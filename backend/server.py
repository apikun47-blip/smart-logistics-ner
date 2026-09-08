from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import math
import uuid
import requests
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db_name = os.environ['DB_NAME']
db = client[db_name]

app = FastAPI(title="AI Logistics Intelligence - North Eastern India", version="1.0.0")
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("ner_logistics_ai")

# -------------------------------------------------------------
# Curated Database of North Eastern Transport Hubs & Coordinates
# -------------------------------------------------------------
NE_HUBS = {
    "guwahati": {"name": "Guwahati", "state": "Assam", "lat": 26.1445, "lng": 91.7362, "type": "Major Gateway / Port"},
    "shillong": {"name": "Shillong", "state": "Meghalaya", "lat": 25.5788, "lng": 91.8933, "type": "Hilly Hub"},
    "imphal": {"name": "Imphal", "state": "Manipur", "lat": 24.8170, "lng": 93.9368, "type": "Valley Capital"},
    "aizawl": {"name": "Aizawl", "state": "Mizoram", "lat": 23.7271, "lng": 92.7176, "type": "Ridge Top Hub"},
    "kohima": {"name": "Kohima", "state": "Nagaland", "lat": 25.6751, "lng": 94.1086, "type": "High Altitude Hub"},
    "itanagar": {"name": "Itanagar", "state": "Arunachal Pradesh", "lat": 27.0844, "lng": 93.6053, "type": "Foothill Capital"},
    "gangtok": {"name": "Gangtok", "state": "Sikkim", "lat": 27.3389, "lng": 88.6065, "type": "Mountain Corridor"},
    "agartala": {"name": "Agartala", "state": "Tripura", "lat": 23.8315, "lng": 91.2868, "type": "Plain Border Hub"},
    "silchar": {"name": "Silchar", "state": "Assam", "lat": 24.8333, "lng": 92.7789, "type": "Barak Valley Gateway"},
    "dibrugarh": {"name": "Dibrugarh", "state": "Assam", "lat": 27.4728, "lng": 94.9120, "type": "Upper Assam Hub"},
    "tura": {"name": "Tura", "state": "Meghalaya", "lat": 25.5141, "lng": 90.2033, "type": "Garo Hills Hub"},
    "siliguri": {"name": "Siliguri", "state": "West Bengal (Chicken's Neck)", "lat": 26.7271, "lng": 88.3953, "type": "Strategic NE Gateway"},
    "delhi": {"name": "Delhi", "state": "National Capital Region", "lat": 28.6139, "lng": 77.2090, "type": "National Hub"},
    "kolkata": {"name": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lng": 88.3639, "type": "Eastern Port Hub"},
    "tezpur": {"name": "Tezpur", "state": "Assam", "lat": 26.6528, "lng": 92.7926, "type": "Central Transit Hub"},
    "dimapur": {"name": "Dimapur", "state": "Nagaland", "lat": 25.9090, "lng": 93.7265, "type": "Railhead & Commercial Hub"}
}

DEFAULT_INCIDENTS = [
    {
        "id": "inc-001",
        "type": "Landslide",
        "title": "Major Landslide on NH-6 Meghalaya-Barak Corridor",
        "location": "Sonapur Tunnel, Meghalaya",
        "state": "Meghalaya",
        "severity": "High",
        "affected_route": "Route A",
        "lat": 25.132,
        "lng": 92.355,
        "time": "35 mins ago",
        "status": "Active Cleanup",
        "description": "Massive mudslide and boulder debris blocking one lane. Heavy vehicles halted.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "inc-002",
        "type": "Flood",
        "title": "Flash Waterlogging on Lowland Transit",
        "location": "Silchar Bypass, Barak Valley",
        "state": "Assam",
        "severity": "Medium",
        "affected_route": "Route A",
        "lat": 24.812,
        "lng": 92.760,
        "time": "1 hour ago",
        "status": "Monitored",
        "description": "Water logging depth 1.5 ft near bridge approach. High clearance trucks advised.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "inc-003",
        "type": "Road Blockage",
        "title": "Culvert Structural Subsidence",
        "location": "Mao Gate - Senapati Highway",
        "state": "Manipur",
        "severity": "Medium",
        "affected_route": "Route A",
        "lat": 25.502,
        "lng": 94.135,
        "time": "2 hours ago",
        "status": "Diversion Active",
        "description": "Slow speed zone near culvert following overnight mountain seepage.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "inc-004",
        "type": "Road Damage",
        "title": "Severe Potholes and Slit Erosion",
        "location": "Umiam Gorge Stretch, NH-40",
        "state": "Meghalaya",
        "severity": "Low",
        "affected_route": "Route A",
        "lat": 25.654,
        "lng": 91.905,
        "time": "3 hours ago",
        "status": "Warning Active",
        "description": "Slow speed zone (20 km/h) due to road resurfacing works.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "inc-005",
        "type": "Heavy Traffic",
        "title": "Freight Bottleneck at Jorabat Junction",
        "location": "Jorabat Tri-Junction (Assam-Meghalaya border)",
        "state": "Assam",
        "severity": "Medium",
        "affected_route": "Route A",
        "lat": 26.095,
        "lng": 91.875,
        "time": "15 mins ago",
        "status": "Congested",
        "description": "Peak morning commercial vehicle clearance delay ~45 minutes.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "inc-006",
        "type": "Landslide",
        "title": "Slope Failure Warning at Bhalukpong Pass",
        "location": "Bhalukpong-Bomdila Highway",
        "state": "Arunachal Pradesh",
        "severity": "High",
        "affected_route": "Route C",
        "lat": 27.012,
        "lng": 92.640,
        "time": "4 hours ago",
        "status": "Restricted Movement",
        "description": "Active rockfall zone during rainfall. Convoys moving in single file.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "inc-007",
        "type": "Accident",
        "title": "Multi-Vehicle Stoppage on Dzongu Access Road",
        "location": "Mangan-Gangtok Corridor",
        "state": "Sikkim",
        "severity": "Medium",
        "affected_route": "Route A",
        "lat": 27.420,
        "lng": 88.530,
        "time": "50 mins ago",
        "status": "Clearance in Progress",
        "description": "Stranded fuel tanker blocking ascending hairpins. Light vehicles only.",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

# -------------------------------------------------------------
# Pydantic Request/Response Models
# -------------------------------------------------------------
class LocationQuery(BaseModel):
    query: str

class LocationInfo(BaseModel):
    name: str
    state: str
    lat: float
    lng: float
    display_name: Optional[str] = None

class RouteAnalysisRequest(BaseModel):
    origin: str
    destination: str
    cargo_type: str = "Medicine"  # Vegetables, Medicine, Construction Material, Electronics
    cargo_weight_kg: float = 500
    vehicle_type: str = "Medium Truck"  # Van, Small Truck, Medium Truck, Heavy Truck
    incident_overrides: Optional[List[Dict[str, Any]]] = None
    demo_scenario: Optional[str] = None

class IncidentCreate(BaseModel):
    type: str  # Landslide, Flood, Road Blockage, Accident, Road Damage, Heavy Traffic
    title: Optional[str] = None
    location: str
    state: Optional[str] = "Meghalaya"
    severity: str  # Low, Medium, High, Critical
    affected_route: str = "Route B"  # Route A, Route B, Route C, All
    description: str
    lat: Optional[float] = None
    lng: Optional[float] = None

class IncidentModel(IncidentCreate):
    id: str
    time: str
    status: str
    created_at: str

# -------------------------------------------------------------
# Helper: Geocoding (Nominatim with Instant Resilient Fallback)
# -------------------------------------------------------------
def geocode_location(query: str) -> LocationInfo:
    cleaned = query.strip().lower()
    
    # 1. Direct match in NE hubs
    if cleaned in NE_HUBS:
        h = NE_HUBS[cleaned]
        return LocationInfo(name=h["name"], state=h["state"], lat=h["lat"], lng=h["lng"], display_name=f"{h['name']}, {h['state']}")
    
    for key, hub in NE_HUBS.items():
        if key in cleaned or cleaned in key or hub["name"].lower() in cleaned:
            return LocationInfo(name=hub["name"], state=hub["state"], lat=hub["lat"], lng=hub["lng"], display_name=f"{hub['name']}, {hub['state']}")
    
    # 2. Try OpenStreetMap Nominatim with tight timeout
    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": f"{query}, India", "format": "json", "limit": 1}
        headers = {"User-Agent": "NER-Logistics-Intelligence/1.0"}
        res = requests.get(url, params=params, headers=headers, timeout=2.0)
        if res.status_code == 200:
            data = res.json()
            if data and len(data) > 0:
                first = data[0]
                return LocationInfo(
                    name=query.title(),
                    state="North East Region" if "india" in first.get("display_name", "").lower() else "India",
                    lat=float(first["lat"]),
                    lng=float(first["lon"]),
                    display_name=first.get("display_name", f"{query.title()}, India")
                )
    except Exception as e:
        logger.warning(f"Nominatim lookup failed for {query}: {e}")
    
    # 3. Deterministic Pseudo Geocoder for any arbitrary unknown location
    h_val = sum(ord(c) for c in cleaned)
    # Clamp within NE India bounding box: Lat 23.5 to 28.5, Lng 88.5 to 95.5
    pseudo_lat = 24.0 + ((h_val * 17) % 400) / 100.0
    pseudo_lng = 89.5 + ((h_val * 31) % 550) / 100.0
    return LocationInfo(
        name=query.title(),
        state="North East Region",
        lat=round(pseudo_lat, 4),
        lng=round(pseudo_lng, 4),
        display_name=f"{query.title()} (Assisted Geo Fallback), NE Region"
    )

# -------------------------------------------------------------
# Helper: Great Circle Distance & Polyline Generator
# -------------------------------------------------------------
def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def generate_curved_polyline(start_lat, start_lng, end_lat, end_lng, curve_factor=0.0, num_points=25):
    points = []
    # Vector perpendicular
    dx = end_lng - start_lng
    dy = end_lat - start_lat
    # Perpendicular vector
    px = -dy
    py = dx
    
    for i in range(num_points + 1):
        t = i / float(num_points)
        # base linear interpolation
        base_lat = start_lat + t * dy
        base_lng = start_lng + t * dx
        # Parabolic arc displacement for mountain valley bypass simulation
        arc = math.sin(t * math.pi) * curve_factor
        # Slight terrain wiggle
        wiggle_lat = math.sin(t * 8.0 * math.pi) * 0.015 * abs(curve_factor + 0.5)
        wiggle_lng = math.cos(t * 8.0 * math.pi) * 0.015 * abs(curve_factor + 0.5)
        
        pt_lat = base_lat + py * arc + wiggle_lat
        pt_lng = base_lng + px * arc + wiggle_lng
        points.append([round(pt_lat, 5), round(pt_lng, 5)])
    return points

# -------------------------------------------------------------
# AI Route Intelligence & Adaptive Scoring Logic
# -------------------------------------------------------------
def calculate_route_metrics(
    origin_geo: LocationInfo,
    dest_geo: LocationInfo,
    cargo_type: str,
    cargo_weight_kg: float,
    vehicle_type: str,
    active_incidents: List[Dict[str, Any]]
):
    base_dist = haversine_distance(origin_geo.lat, origin_geo.lng, dest_geo.lat, dest_geo.lng)
    if base_dist < 20:
        base_dist = 65.0  # minimum intercity mountain corridor distance
    
    # Mountain terrain multiplier (NE India roads have 1.35x - 1.65x winding factor)
    dist_A = round(base_dist * 1.35, 1)  # Fastest / Direct NH Corridor
    dist_B = round(base_dist * 1.48, 1)  # Safest / Low-Elevation Ridge Bypass
    dist_C = round(base_dist * 1.55, 1)  # Balanced / Multi-Lane Arterial
    
    # Speed factors depending on vehicle & slope
    vehicle_speed_factors = {
        "Van": {"speed": 45, "cost_per_km": 16, "max_safe_weight": 1200},
        "Small Truck": {"speed": 40, "cost_per_km": 24, "max_safe_weight": 3500},
        "Medium Truck": {"speed": 34, "cost_per_km": 32, "max_safe_weight": 9000},
        "Heavy Truck": {"speed": 26, "cost_per_km": 44, "max_safe_weight": 24000}
    }
    v_spec = vehicle_speed_factors.get(vehicle_type, vehicle_speed_factors["Medium Truck"])
    
    # Base ETAs
    hours_A = dist_A / (v_spec["speed"] * 1.05)
    hours_B = dist_B / (v_spec["speed"] * 0.95)
    hours_C = dist_C / (v_spec["speed"] * 1.0)
    
    # Costs
    cost_A = int(dist_A * v_spec["cost_per_km"] * (1 + cargo_weight_kg / 15000))
    cost_B = int(dist_B * v_spec["cost_per_km"] * (1 + cargo_weight_kg / 15000) * 1.05)
    cost_C = int(dist_C * v_spec["cost_per_km"] * (1 + cargo_weight_kg / 15000) * 1.02)
    
    # Base Attributes
    # Route A (Fastest NH Corridor - Higher slope & landslide hazard during rain)
    safety_A = 76.0
    access_A = 80.0
    weather_A = 74.0
    terrain_A = "Moderate-High Slope (Steep Gorges)"
    traffic_A = "High (Freight Corridor)"
    
    # Route B (Safest - Reinforced drainage, low gradient bypass, engineered bridges)
    safety_B = 93.0
    access_B = 95.0
    weather_B = 90.0
    terrain_B = "Low-Slope Ridge Bypass (Reinforced Slopes)"
    traffic_B = "Low-Moderate"
    
    # Route C (Balanced - Secondary National Highway corridor)
    safety_C = 85.0
    access_C = 87.0
    weather_C = 82.0
    terrain_C = "Rolling Foothill Corridor"
    traffic_C = "Moderate"

    # Vehicle Compatibility Assessment
    def get_vehicle_compat(route_name, v_type, weight):
        if v_type == "Heavy Truck":
            if route_name == "Route A":
                return "Good"
            elif route_name == "Route B":
                return "Excellent"  # Wide engineered turning radii
            else:
                return "Restricted" if weight > 12000 else "Good"
        elif v_type == "Medium Truck":
            return "Excellent" if route_name in ["Route B", "Route C"] else "Good"
        else:
            return "Excellent"

    # Calculate Incident Impact on each Route
    incident_penalties = {"Route A": 0, "Route B": 0, "Route C": 0}
    incident_counts = {"Route A": 0, "Route B": 0, "Route C": 0}
    critical_blockage = {"Route A": False, "Route B": False, "Route C": False}
    
    for inc in active_incidents:
        aff = inc.get("affected_route", "Route B")
        sev = inc.get("severity", "Medium")
        sev_weight = {"Low": 6, "Medium": 14, "High": 28, "Critical": 48}.get(sev, 12)
        
        target_routes = ["Route A", "Route B", "Route C"] if aff in ["All", "Global"] else [aff]
        for tr in target_routes:
            if tr in incident_penalties:
                incident_penalties[tr] += sev_weight
                incident_counts[tr] += 1
                if sev == "Critical":
                    critical_blockage[tr] = True

    # Adjust safety and accessibility by active incidents
    safety_A = max(15.0, safety_A - incident_penalties["Route A"] * 1.1)
    access_A = max(10.0, access_A - incident_penalties["Route A"] * 1.2)
    
    safety_B = max(15.0, safety_B - incident_penalties["Route B"] * 1.1)
    access_B = max(10.0, access_B - incident_penalties["Route B"] * 1.2)
    
    safety_C = max(15.0, safety_C - incident_penalties["Route C"] * 1.1)
    access_C = max(10.0, access_C - incident_penalties["Route C"] * 1.2)

    # Risk level classification
    def get_risk_level(safety_val, inc_penalty):
        if safety_val < 50 or inc_penalty >= 40:
            return "CRITICAL"
        elif safety_val < 70 or inc_penalty >= 20:
            return "HIGH"
        elif safety_val < 85:
            return "MODERATE"
        return "LOW"

    risk_A = get_risk_level(safety_A, incident_penalties["Route A"])
    risk_B = get_risk_level(safety_B, incident_penalties["Route B"])
    risk_C = get_risk_level(safety_C, incident_penalties["Route C"])

    # Cargo-Aware Priority Matrix
    # Base: Safety 30%, Accessibility 25%, Time 20%, Cost 15%, Weather 10%
    cargo_weights = {
        "Medicine": {"safety": 0.35, "access": 0.30, "time": 0.20, "cost": 0.05, "weather": 0.10, "profile": "High Safety & High Reliability Priority"},
        "Vegetables": {"safety": 0.20, "access": 0.20, "time": 0.35, "cost": 0.15, "weather": 0.10, "profile": "Speed & Cold-Chain Time Priority"},
        "Construction Material": {"safety": 0.20, "access": 0.30, "time": 0.10, "cost": 0.30, "weather": 0.10, "profile": "Cost & Heavy Axle Accessibility Priority"},
        "Electronics": {"safety": 0.35, "access": 0.25, "time": 0.20, "cost": 0.10, "weather": 0.10, "profile": "Vibration, Moisture & Safety Priority"}
    }
    c_weight = cargo_weights.get(cargo_type, cargo_weights["Medicine"])

    # Normalization helper for travel time & cost (lower is better -> score 100 to 50)
    times = [hours_A, hours_B, hours_C]
    min_t, max_t = min(times), max(times)
    time_score_A = 100 - ((hours_A - min_t) / (max_t - min_t + 0.001)) * 30
    time_score_B = 100 - ((hours_B - min_t) / (max_t - min_t + 0.001)) * 30
    time_score_C = 100 - ((hours_C - min_t) / (max_t - min_t + 0.001)) * 30

    costs = [cost_A, cost_B, cost_C]
    min_c, max_c = min(costs), max(costs)
    cost_score_A = 100 - ((cost_A - min_c) / (max_c - min_c + 0.001)) * 30
    cost_score_B = 100 - ((cost_B - min_c) / (max_c - min_c + 0.001)) * 30
    cost_score_C = 100 - ((cost_C - min_c) / (max_c - min_c + 0.001)) * 30

    # Calculate Total AI Score (0 - 100)
    ai_score_A = (
        safety_A * c_weight["safety"] +
        access_A * c_weight["access"] +
        time_score_A * c_weight["time"] +
        cost_score_A * c_weight["cost"] +
        weather_A * c_weight["weather"]
    )
    ai_score_B = (
        safety_B * c_weight["safety"] +
        access_B * c_weight["access"] +
        time_score_B * c_weight["time"] +
        cost_score_B * c_weight["cost"] +
        weather_B * c_weight["weather"]
    )
    ai_score_C = (
        safety_C * c_weight["safety"] +
        access_C * c_weight["access"] +
        time_score_C * c_weight["time"] +
        cost_score_C * c_weight["cost"] +
        weather_C * c_weight["weather"]
    )

    # Penalty for critical blockage
    if critical_blockage["Route A"]:
        ai_score_A = max(10, ai_score_A - 40)
    if critical_blockage["Route B"]:
        ai_score_B = max(10, ai_score_B - 40)
    if critical_blockage["Route C"]:
        ai_score_C = max(10, ai_score_C - 40)

    # Format ETAs
    def format_eta(hrs):
        h = int(hrs)
        m = int((hrs - h) * 60)
        return f"{h}h {m:02d}m"

    # Route Polylines for Leaflet
    poly_A = generate_curved_polyline(origin_geo.lat, origin_geo.lng, dest_geo.lat, dest_geo.lng, curve_factor=-0.12)
    poly_B = generate_curved_polyline(origin_geo.lat, origin_geo.lng, dest_geo.lat, dest_geo.lng, curve_factor=0.20)
    poly_C = generate_curved_polyline(origin_geo.lat, origin_geo.lng, dest_geo.lat, dest_geo.lng, curve_factor=0.04)

    route_dict = {
        "Route A": {
            "id": "route-a",
            "name": "Route A",
            "tagline": "Fastest Corridor",
            "type_badge": "Fastest",
            "distance_km": dist_A,
            "eta_hours": round(hours_A, 2),
            "eta_formatted": format_eta(hours_A),
            "estimated_cost_inr": cost_A,
            "safety_score": round(safety_A, 1),
            "accessibility_score": round(access_A, 1),
            "weather_score": round(weather_A, 1),
            "terrain_risk": terrain_A,
            "traffic_risk": traffic_A,
            "incident_risk": risk_A,
            "active_incidents_count": incident_counts["Route A"],
            "vehicle_compatibility": get_vehicle_compat("Route A", vehicle_type, cargo_weight_kg),
            "ai_score": round(ai_score_A, 1),
            "polyline": poly_A,
            "color": "#EF4444" if risk_A in ["HIGH", "CRITICAL"] else "#F59E0B"
        },
        "Route B": {
            "id": "route-b",
            "name": "Route B",
            "tagline": "Safest / Ridge Bypass",
            "type_badge": "Safest & Most Accessible",
            "distance_km": dist_B,
            "eta_hours": round(hours_B, 2),
            "eta_formatted": format_eta(hours_B),
            "estimated_cost_inr": cost_B,
            "safety_score": round(safety_B, 1),
            "accessibility_score": round(access_B, 1),
            "weather_score": round(weather_B, 1),
            "terrain_risk": terrain_B,
            "traffic_risk": traffic_B,
            "incident_risk": risk_B,
            "active_incidents_count": incident_counts["Route B"],
            "vehicle_compatibility": get_vehicle_compat("Route B", vehicle_type, cargo_weight_kg),
            "ai_score": round(ai_score_B, 1),
            "polyline": poly_B,
            "color": "#10B981" if risk_B == "LOW" else ("#EF4444" if risk_B == "CRITICAL" else "#F59E0B")
        },
        "Route C": {
            "id": "route-c",
            "name": "Route C",
            "tagline": "Balanced Arterial",
            "type_badge": "Balanced",
            "distance_km": dist_C,
            "eta_hours": round(hours_C, 2),
            "eta_formatted": format_eta(hours_C),
            "estimated_cost_inr": cost_C,
            "safety_score": round(safety_C, 1),
            "accessibility_score": round(access_C, 1),
            "weather_score": round(weather_C, 1),
            "terrain_risk": terrain_C,
            "traffic_risk": traffic_C,
            "incident_risk": risk_C,
            "active_incidents_count": incident_counts["Route C"],
            "vehicle_compatibility": get_vehicle_compat("Route C", vehicle_type, cargo_weight_kg),
            "ai_score": round(ai_score_C, 1),
            "polyline": poly_C,
            "color": "#3B82F6" if risk_C in ["LOW", "MODERATE"] else "#EF4444"
        }
    }

    # Determine winning recommendation
    sorted_routes = sorted(route_dict.values(), key=lambda r: r["ai_score"], reverse=True)
    winner = sorted_routes[0]

    # Generate Explainable AI dynamic narrative
    why_points = []
    if winner["name"] == "Route B":
        why_points = [
            f"Higher safety index ({winner['safety_score']}%) with fortified anti-landslide drainage",
            f"Superb road accessibility score ({winner['accessibility_score']}%) with low steep slope exposure",
            f"Engineered geometry ideal for {vehicle_type} carrying {cargo_weight_kg}kg {cargo_type}",
            f"Zero severe bottleneck incidents compared to alternate mountain passes",
            f"Lower environmental disruption probability under current regional weather"
        ]
        decision_narrative = (
            f"Although Route B has a slightly longer travel distance than the direct highway ({winner['distance_km']} km vs {route_dict['Route A']['distance_km']} km), "
            f"its significantly superior safety ({winner['safety_score']}%) and accessibility scores make it the optimal logistical choice "
            f"for high-priority {cargo_type} transport in complex terrain."
        )
    elif winner["name"] == "Route C":
        why_points = [
            f"Dynamic failover reroute: avoids critical hazards on primary corridors",
            f"Strong road accessibility ({winner['accessibility_score']}%) along rolling foothill bypass",
            f"Reliable all-weather transit corridor with reduced landslide vulnerability",
            f"Safe load clearance for {vehicle_type} with balanced freight economics (₹{winner['estimated_cost_inr']:,})",
            f"Overall highest operational resiliency score ({winner['ai_score']}/100)"
        ]
        decision_narrative = (
            f"Route C is selected as the recommended corridor because active hazards and terrain incidents have severely downgraded alternative routes. "
            f"Route C delivers the safest bypass with stable road accessibility ({winner['accessibility_score']}%) and minimal risk of cargo stranding."
        )
    else:  # Route A
        why_points = [
            f"Fastest logistical transit time ({winner['eta_formatted']}) along direct freight corridor",
            f"Lowest operational cost per ton (₹{winner['estimated_cost_inr']:,})",
            f"Optimal for time-critical {cargo_type} movement under current clear road conditions",
            f"Direct dual-lane connectivity without mountain loop detours",
            f"Top overall performance score ({winner['ai_score']}/100)"
        ]
        decision_narrative = (
            f"Route A provides the fastest travel time ({winner['eta_formatted']}) with minimum transit cost, making it the most efficient route "
            f"for {cargo_type} delivery given that active risk on this corridor remains manageable."
        )

    return {
        "origin": origin_geo.model_dump(),
        "destination": dest_geo.model_dump(),
        "cargo_type": cargo_type,
        "cargo_weight_kg": cargo_weight_kg,
        "vehicle_type": vehicle_type,
        "optimization_profile": c_weight["profile"],
        "weight_matrix": c_weight,
        "recommended_route": winner["name"],
        "recommended_route_data": winner,
        "routes": route_dict,
        "explainable_ai": {
            "title": f"Why Did AI Choose {winner['name']}?",
            "key_factors": why_points,
            "decision_narrative": decision_narrative,
            "primary_benefit": f"{winner['type_badge']} with {winner['ai_score']}/100 AI Score"
        }
    }

# -------------------------------------------------------------
# API Endpoints
# -------------------------------------------------------------
@api_router.get("/")
async def api_health():
    return {
        "status": "online",
        "system": "AI-Based Smart Logistics & Accessibility Intelligence Platform for North Eastern India",
        "tagline": "PREDICT → OPTIMIZE → ADAPT",
        "region": "Assam, Meghalaya, Manipur, Mizoram, Nagaland, Arunachal Pradesh, Tripura, Sikkim",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@api_router.get("/locations")
async def list_transport_hubs(query: Optional[str] = None):
    hubs = list(NE_HUBS.values())
    if query:
        q = query.lower()
        hubs = [h for h in hubs if q in h["name"].lower() or q in h["state"].lower()]
    return {"hubs": hubs}

@api_router.post("/geocode")
async def geocode_endpoint(req: LocationQuery):
    geo = geocode_location(req.query)
    return geo.model_dump()

@api_router.get("/regional-status")
async def get_regional_status():
    return {
        "regions": [
            {"state": "Assam", "risk_level": "LOW", "risk_score": 24, "weather": "Partly Cloudy, 28°C", "monitored_corridors": 6, "active_incidents": 2, "status_badge": "Normal Transit"},
            {"state": "Meghalaya", "risk_level": "MODERATE", "risk_score": 58, "weather": "Heavy Rain, 19°C", "monitored_corridors": 4, "active_incidents": 2, "status_badge": "Monsoon Watch"},
            {"state": "Manipur", "risk_level": "HIGH", "risk_score": 78, "weather": "Rain Showers, 22°C", "monitored_corridors": 3, "active_incidents": 1, "status_badge": "Active Hazard"},
            {"state": "Mizoram", "risk_level": "LOW", "risk_score": 32, "weather": "Overcast, 24°C", "monitored_corridors": 2, "active_incidents": 0, "status_badge": "Safe Transit"},
            {"state": "Nagaland", "risk_level": "MODERATE", "risk_score": 48, "weather": "Foggy Slopes, 18°C", "monitored_corridors": 3, "active_incidents": 1, "status_badge": "Caution Advised"},
            {"state": "Arunachal Pradesh", "risk_level": "HIGH", "risk_score": 72, "weather": "Torrential Rain, 14°C", "monitored_corridors": 3, "active_incidents": 1, "status_badge": "Rockfall Alert"},
            {"state": "Tripura", "risk_level": "LOW", "risk_score": 19, "weather": "Clear Sky, 30°C", "monitored_corridors": 2, "active_incidents": 0, "status_badge": "Optimal"},
            {"state": "Sikkim", "risk_level": "MODERATE", "risk_score": 54, "weather": "Mist & Drizzle, 12°C", "monitored_corridors": 2, "active_incidents": 1, "status_badge": "High Altitude Warning"}
        ],
        "global_status": {
            "system_operational": True,
            "weather_monitoring": "ACTIVE",
            "routes_monitored": 18,
            "high_risk_routes": 4,
            "active_incidents": 7,
            "last_updated": "Just now",
            "data_mode": "Prototype / Simulated AI Telemetry"
        }
    }

@api_router.get("/incidents")
async def get_incidents():
    # Fetch from Mongo or seed default
    count = await db.incidents.count_documents({})
    if count == 0:
        await db.incidents.insert_many([dict(inc) for inc in DEFAULT_INCIDENTS])
    
    docs = await db.incidents.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return {"incidents": docs}

@api_router.post("/incidents")
async def create_incident(inc: IncidentCreate):
    new_id = f"inc-{uuid.uuid4().hex[:6]}"
    # Geocode if lat/lng not provided
    lat = inc.lat
    lng = inc.lng
    if lat is None or lng is None:
        loc_geo = geocode_location(inc.location)
        lat = loc_geo.lat
        lng = loc_geo.lng
        
    doc = {
        "id": new_id,
        "type": inc.type,
        "title": inc.title or f"{inc.type} at {inc.location}",
        "location": inc.location,
        "state": inc.state or "Meghalaya",
        "severity": inc.severity,
        "affected_route": inc.affected_route,
        "lat": lat,
        "lng": lng,
        "time": "Just now",
        "status": "Active / Reported",
        "description": inc.description,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.incidents.insert_one(doc)
    doc_out = dict(doc)
    if "_id" in doc_out:
        del doc_out["_id"]
    return {"message": "Incident reported successfully", "incident": doc_out}

@api_router.delete("/incidents/{incident_id}")
async def delete_incident(incident_id: str):
    res = await db.incidents.delete_one({"id": incident_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Incident not found")
    return {"message": "Incident resolved/deleted successfully", "id": incident_id}

@api_router.post("/incidents/reset-demo")
async def reset_demo_incidents():
    await db.incidents.delete_many({})
    await db.incidents.insert_many([dict(inc) for inc in DEFAULT_INCIDENTS])
    return {"message": "Incidents reset to demo state", "count": len(DEFAULT_INCIDENTS)}

@api_router.post("/routes/analyze")
async def analyze_routes_endpoint(req: RouteAnalysisRequest):
    # Geocode origin and destination
    origin_geo = geocode_location(req.origin)
    dest_geo = geocode_location(req.destination)
    
    # Get active incidents
    if req.incident_overrides is not None:
        active_incs = req.incident_overrides
    else:
        active_incs = await db.incidents.find({}, {"_id": 0}).to_list(100)
        if not active_incs:
            active_incs = DEFAULT_INCIDENTS
    
    analysis_result = calculate_route_metrics(
        origin_geo=origin_geo,
        dest_geo=dest_geo,
        cargo_type=req.cargo_type,
        cargo_weight_kg=req.cargo_weight_kg,
        vehicle_type=req.vehicle_type,
        active_incidents=active_incs
    )
    
    return analysis_result

@api_router.get("/analytics")
async def get_analytics_data():
    return {
        "kpis": {
            "active_shipments": 24,
            "routes_monitored": 18,
            "high_risk_routes": 4,
            "active_incidents": 7,
            "avg_accessibility_score": 87,
            "safe_corridors_percentage": 78
        },
        "risk_distribution": [
            {"category": "Low Risk (Green)", "count": 11, "color": "#10B981"},
            {"category": "Moderate Risk (Amber)", "count": 4, "color": "#F59E0B"},
            {"category": "High / Blocked (Red)", "count": 3, "color": "#EF4444"}
        ],
        "accessibility_by_route": [
            {"route": "NH-27 Guwahati Bypass", "accessibility": 94, "safety": 92, "slope": "Low"},
            {"route": "NH-40 Shillong Ridge", "accessibility": 88, "safety": 85, "slope": "Moderate"},
            {"route": "NH-6 Sonapur Valley", "accessibility": 56, "safety": 48, "slope": "High Hazard"},
            {"route": "NH-2 Imphal Express", "accessibility": 68, "safety": 60, "slope": "Moderate"},
            {"route": "NH-10 Gangtok Mountain", "accessibility": 74, "safety": 70, "slope": "Steep Pass"},
            {"route": "NH-54 Aizawl Artery", "accessibility": 82, "safety": 80, "slope": "Ridge"}
        ],
        "incidents_by_type": [
            {"type": "Landslide", "count": 14, "color": "#EF4444"},
            {"type": "Flash Flood", "count": 9, "color": "#3B82F6"},
            {"type": "Road Blockage", "count": 6, "color": "#F97316"},
            {"type": "Structural Erosion", "count": 5, "color": "#EAB308"},
            {"type": "Traffic Congestion", "count": 8, "color": "#A855F7"}
        ],
        "recommendation_distribution": [
            {"route_name": "Route B (Safest/Accessible)", "share": 62},
            {"route_name": "Route A (Fastest Transit)", "share": 24},
            {"route_name": "Route C (Adaptive Bypass)", "share": 14}
        ],
        "key_insights": [
            "Heavy rainfall in Meghalaya currently elevates landslide risk by 42% on NH-6 Sonapur Tunnel stretch.",
            "Route B ridge bypass provides a 17% higher safety margin for heavy freight compared to the valley route.",
            "Vehicle compatibility restrictions currently apply to Heavy Trucks on 2 mountain passes in Manipur & Arunachal.",
            "Real-time dynamic rerouting prevents an estimated 4.2 hours of logistics delays per blocked convoy."
        ]
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
