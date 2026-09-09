import os
import jwt
import bcrypt
import secrets
import logging
from datetime import datetime, timezone, timedelta
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

auth_router = APIRouter(prefix="/api/auth", tags=["auth"])
JWT_ALGORITHM = "HS256"
logger = logging.getLogger("ner_logistics_auth")


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=60), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str):
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite="none", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True, samesite="none", max_age=604800, path="/")


def user_public(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user.get("name", ""),
        "email": user["email"],
        "role": user.get("role", "user"),
        "created_at": user.get("created_at").isoformat() if isinstance(user.get("created_at"), datetime) else user.get("created_at")
    }


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


LOCKOUT_MINUTES = 15
MAX_ATTEMPTS = 5


async def check_lockout(identifier: str):
    doc = await db.login_attempts.find_one({"identifier": identifier})
    if doc and doc.get("count", 0) >= MAX_ATTEMPTS:
        locked_until = doc.get("locked_until")
        if locked_until and datetime.fromisoformat(locked_until) > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail=f"Too many failed attempts. Account locked for {LOCKOUT_MINUTES} minutes.")
        await db.login_attempts.delete_one({"identifier": identifier})


async def record_failed_attempt(identifier: str):
    doc = await db.login_attempts.find_one({"identifier": identifier})
    count = (doc.get("count", 0) if doc else 0) + 1
    update = {"count": count, "last_attempt": datetime.now(timezone.utc).isoformat()}
    if count >= MAX_ATTEMPTS:
        update["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_MINUTES)).isoformat()
    await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)


@auth_router.post("/register")
async def register(body: RegisterRequest, response: Response):
    email = body.email.strip().lower()
    if "@" not in email or "." not in email:
        raise HTTPException(status_code=400, detail="Please enter a valid email address")
    if len(body.name.strip()) < 2:
        raise HTTPException(status_code=400, detail="Name must be at least 2 characters")
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    doc = {
        "name": body.name.strip(),
        "email": email,
        "password_hash": hash_password(body.password),
        "role": "user",
        "created_at": datetime.now(timezone.utc)
    }
    result = await db.users.insert_one(doc)
    doc["_id"] = result.inserted_id
    set_auth_cookies(response, str(result.inserted_id), email)
    return user_public(doc)


def get_client_ip(request: Request) -> str:
    xff = request.headers.get("X-Forwarded-For", "")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@auth_router.post("/login")
async def login(body: LoginRequest, request: Request, response: Response):
    email = body.email.strip().lower()
    identifier = f"{get_client_ip(request)}:{email}"
    await check_lockout(identifier)
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        await record_failed_attempt(identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    set_auth_cookies(response, str(user["_id"]), email)
    return user_public(user)


@auth_router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out successfully"}


@auth_router.get("/me")
async def me(user: dict = Depends(get_current_user)):
    return user_public(user)


@auth_router.post("/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access_token = create_access_token(str(user["_id"]), user["email"])
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite="none", max_age=3600, path="/")
        return {"message": "Token refreshed"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@auth_router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordRequest):
    email = body.email.strip().lower()
    user = await db.users.find_one({"email": email})
    if not user:
        return {"message": "If an account exists for this email, a reset token has been issued."}
    token = secrets.token_urlsafe(32)
    await db.password_reset_tokens.insert_one({
        "token": token,
        "user_id": str(user["_id"]),
        "used": False,
        "expires_at": datetime.now(timezone.utc) + timedelta(hours=1),
        "created_at": datetime.now(timezone.utc)
    })
    logger.info(f"Password reset token for {email}: {token}")
    return {
        "message": "Reset token generated. In this prototype (no email service), use the token below to set a new password.",
        "reset_token": token
    }


@auth_router.post("/reset-password")
async def reset_password(body: ResetPasswordRequest):
    if len(body.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    doc = await db.password_reset_tokens.find_one({"token": body.token})
    if not doc or doc.get("used"):
        raise HTTPException(status_code=400, detail="Invalid or already used reset token")
    expires_at = doc["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Reset token has expired")
    await db.users.update_one({"_id": ObjectId(doc["user_id"])}, {"$set": {"password_hash": hash_password(body.new_password)}})
    await db.password_reset_tokens.update_one({"token": body.token}, {"$set": {"used": True}})
    return {"message": "Password reset successfully. You can now sign in with your new password."}


async def setup_auth():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=0)
    admin_email = os.environ["ADMIN_EMAIL"]
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "name": "Command Admin",
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "role": "admin",
            "created_at": datetime.now(timezone.utc)
        })
        logger.info("Admin account seeded")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
