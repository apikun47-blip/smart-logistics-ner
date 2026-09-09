import os
import time
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
AUTH = f"{BASE_URL}/api/auth"

ADMIN_EMAIL = "admin@nelogistics.in"
ADMIN_PASSWORD = "Admin@NER2026"


def _uniq(prefix="uiuser"):
    return f"{prefix}+{int(time.time()*1000)}@test.in"


# --- Registration ---
def test_register_success_and_duplicate():
    s = requests.Session()
    email = _uniq("reg")
    r = s.post(f"{AUTH}/register", json={"name": "Reg User", "email": email, "password": "Pass@1234"}, timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["email"] == email
    assert data["role"] == "user"
    assert "id" in data
    # cookies set
    assert "access_token" in s.cookies
    assert "refresh_token" in s.cookies
    # duplicate
    r2 = requests.post(f"{AUTH}/register", json={"name": "Reg User", "email": email, "password": "Pass@1234"}, timeout=15)
    assert r2.status_code == 400
    assert "exists" in r2.json()["detail"].lower()


# --- Login / me / bad password ---
def test_admin_login_me_wrong_password():
    s = requests.Session()
    r = s.post(f"{AUTH}/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["email"] == ADMIN_EMAIL
    assert data["role"] == "admin"
    assert "access_token" in s.cookies
    # /me
    me = s.get(f"{AUTH}/me", timeout=15)
    assert me.status_code == 200
    assert me.json()["email"] == ADMIN_EMAIL
    # wrong password (fresh session, different email to avoid affecting admin lockout)
    bad = requests.post(f"{AUTH}/login", json={"email": ADMIN_EMAIL, "password": "wrong-pwd"}, timeout=15)
    assert bad.status_code == 401


# --- Logout ---
def test_logout_clears_cookies():
    s = requests.Session()
    r = s.post(f"{AUTH}/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200
    lo = s.post(f"{AUTH}/logout", timeout=15)
    assert lo.status_code == 200
    # cookies cleared -> /me should be 401. Session may still hold empty cookies; check /me anyway
    # explicitly clear session cookies that were emptied
    for c in list(s.cookies):
        if c.value in ("", None):
            s.cookies.clear(name=c.name, domain=c.domain, path=c.path)
    me = s.get(f"{AUTH}/me", timeout=15)
    assert me.status_code == 401


# --- Brute force lockout ---
def test_brute_force_lockout():
    # register a dedicated victim
    email = _uniq("brute")
    reg = requests.post(f"{AUTH}/register", json={"name": "Brute Victim", "email": email, "password": "Correct@123"}, timeout=15)
    assert reg.status_code == 200
    codes = []
    for _ in range(5):
        r = requests.post(f"{AUTH}/login", json={"email": email, "password": "WrongPass!"}, timeout=15)
        codes.append(r.status_code)
    # 6th should be 429
    r6 = requests.post(f"{AUTH}/login", json={"email": email, "password": "WrongPass!"}, timeout=15)
    assert r6.status_code == 429, f"Expected 429 after 5 fails; got {r6.status_code}, prev={codes}"
    # even correct password should be blocked
    rc = requests.post(f"{AUTH}/login", json={"email": email, "password": "Correct@123"}, timeout=15)
    assert rc.status_code == 429


# --- Forgot / reset / token reuse ---
def test_forgot_reset_password_flow_and_token_reuse():
    email = _uniq("reset")
    old_pwd = "Old@12345"
    new_pwd = "New@12345"
    reg = requests.post(f"{AUTH}/register", json={"name": "Reset User", "email": email, "password": old_pwd}, timeout=15)
    assert reg.status_code == 200
    fp = requests.post(f"{AUTH}/forgot-password", json={"email": email}, timeout=15)
    assert fp.status_code == 200
    token = fp.json().get("reset_token")
    assert token, "reset_token missing in prototype response"
    # reset
    rp = requests.post(f"{AUTH}/reset-password", json={"token": token, "new_password": new_pwd}, timeout=15)
    assert rp.status_code == 200
    # old password fails
    bad = requests.post(f"{AUTH}/login", json={"email": email, "password": old_pwd}, timeout=15)
    assert bad.status_code == 401
    # new password works
    good = requests.post(f"{AUTH}/login", json={"email": email, "password": new_pwd}, timeout=15)
    assert good.status_code == 200
    # reuse token
    reuse = requests.post(f"{AUTH}/reset-password", json={"token": token, "new_password": "Another@123"}, timeout=15)
    assert reuse.status_code == 400


# --- Regression: core logistics endpoints ---
def test_regression_core_endpoints():
    r = requests.post(f"{BASE_URL}/api/routes/analyze", json={
        "origin": "Guwahati", "destination": "Shillong", "cargo_type": "Medicine",
        "cargo_weight_kg": 500, "vehicle_type": "Medium Truck"
    }, timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert "routes" in data and "recommended_route" in data
    assert requests.get(f"{BASE_URL}/api/regional-status", timeout=15).status_code == 200
    assert requests.get(f"{BASE_URL}/api/incidents", timeout=15).status_code == 200
    assert requests.get(f"{BASE_URL}/api/analytics", timeout=15).status_code == 200
