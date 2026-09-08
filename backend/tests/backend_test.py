import os
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")


def test_health_and_regional_status():
    health = requests.get(f"{BASE_URL}/api/", timeout=15)
    assert health.status_code == 200
    assert health.json()["tagline"] == "PREDICT → OPTIMIZE → ADAPT"
    regional = requests.get(f"{BASE_URL}/api/regional-status", timeout=15)
    assert regional.status_code == 200
    assert len(regional.json()["regions"]) == 8


def test_analyze_routes_dynamic_inputs():
    response = requests.post(f"{BASE_URL}/api/routes/analyze", json={
        "origin": "Imphal", "destination": "Aizawl", "cargo_type": "Electronics",
        "cargo_weight_kg": 750, "vehicle_type": "Van"
    }, timeout=30)
    assert response.status_code == 200
    data = response.json()
    assert data["origin"]["name"] == "Imphal"
    assert data["destination"]["name"] == "Aizawl"
    assert set(data["routes"]) == {"Route A", "Route B", "Route C"}
    assert data["vehicle_type"] == "Van"


def test_incident_create_and_read_persistence():
    payload = {
        "type": "Landslide", "title": "TEST critical Route B slide", "location": "Shillong",
        "state": "Meghalaya", "severity": "Critical", "affected_route": "Route B",
        "description": "TEST automated persistence incident"
    }
    created = requests.post(f"{BASE_URL}/api/incidents", json=payload, timeout=30)
    assert created.status_code == 200
    incident = created.json()["incident"]
    assert incident["title"] == payload["title"]
    listed = requests.get(f"{BASE_URL}/api/incidents", timeout=15)
    assert listed.status_code == 200
    assert any(item["id"] == incident["id"] for item in listed.json()["incidents"])
    deleted = requests.delete(f"{BASE_URL}/api/incidents/{incident['id']}", timeout=15)
    assert deleted.status_code == 200


def test_analytics_shape():
    response = requests.get(f"{BASE_URL}/api/analytics", timeout=15)
    assert response.status_code == 200
    data = response.json()
    assert data["kpis"]["active_shipments"] == 24
    assert len(data["accessibility_by_route"]) >= 5
    assert len(data["incidents_by_type"]) >= 3