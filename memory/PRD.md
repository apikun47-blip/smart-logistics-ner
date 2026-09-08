# Product Requirements Document (PRD)

## Project Name
**AI-Based Smart Logistics & Accessibility Intelligence Platform for North Eastern India**
**Core Tagline:** PREDICT → OPTIMIZE → ADAPT

---

## 1. Executive Summary & Problem Vision
Logistics in North Eastern India (Assam, Meghalaya, Manipur, Mizoram, Nagaland, Arunachal Pradesh, Tripura, and Sikkim) is severely hindered by mountainous slopes, heavy monsoon precipitation, recurring landslides, flash floods, fragile road quality, and vehicle axle restrictions. Standard navigation algorithms prioritize shortest distance, often directing heavy freight into blocked or hazard-compromised corridors.

This platform implements an AI-assisted logistics intelligence command center that:
1. **PREDICTS** environmental and route risks (slope angle, rainfall index, historical landslide hotspots).
2. **OPTIMIZES** multi-route alternatives (Route A Fastest, Route B Safest, Route C Balanced) against cargo profiles (Medicine, Vegetables, Construction Material, Electronics).
3. **ADAPTS** dynamically in real-time when field incidents (critical landslides, floods, road subsidence) occur, re-ranking corridors and issuing instant reroute directives.

---

## 2. Core Architecture & Tech Stack
- **Frontend:** React 19, Tailwind CSS, Lucide React, Recharts, Leaflet + OpenStreetMap.
- **Backend:** FastAPI (Python), Motor (Async MongoDB), Pydantic v2.
- **Geocoding & Routing Engine:** OSM Nominatim + Free OSRM with resilient deterministic local geometric and elevation fallback (zero downtime guarantee).
- **AI Scoring Matrix:**
  - Base formula: Safety × 30% + Accessibility × 25% + Travel Time × 20% + Freight Cost × 15% + Weather Factor × 10%.
  - Adaptive Cargo Customization: Dynamic weights for Medicine (Safety & Reliability priority), Vegetables (Time & Cold-Chain), Construction (Cost & Heavy Axle load), Electronics (Low Vibration).
  - Dynamic Hazard Penalty: Critical incidents immediately penalize affected corridors and promote safe bypasses.

---

## 3. Implemented Features (Completed on September 8, 2026)
- **Global Status Bar:** Real-time indicator showing System Operational, Weather Monitoring ACTIVE, 18 Routes Monitored, 7 Active Incidents, and Demo Data mode badge with 1-click Reset Demo button.
- **Overview Command Dashboard:**
  - Hero banner with quick start CTA.
  - KPI Metrics (24 Active Shipments, 18 Monitored Corridors, 4 High Risk Slopes, 7 Active Incidents).
  - Regional Logistics & Terrain Risk Matrix for all 8 North Eastern States.
  - Recent Road Hazard alerts ticker.
- **Interactive AI Route Planner:**
  - Arbitrary Origin & Destination search with fast datalist autocomplete and swap utility.
  - Cargo Type selector (Medicine, Vegetables, Construction Material, Electronics).
  - Cargo Weight input/slider (50 kg to 30,000 kg).
  - Vehicle Type selector (Van, Small Truck, Medium Truck, Heavy Truck) with real-time turning radius and axle compatibility indicators.
  - Multi-step loading simulation ("Analyzing terrain... Evaluating weather... Checking accessibility... Calculating risk...").
- **Route Analysis & Explainable AI:**
  - AI Recommended Route Spotlight with overall score (0-100), distance, ETA, cost, safety %, accessibility %, weather %, and risk level.
  - Side-by-side comparison cards for Route A (Fastest), Route B (Safest Ridge Bypass), and Route C (Balanced Arterial).
  - Explainable AI "Why Did AI Choose This Route?" card with key multi-factor drivers and tactical decision narrative.
- **Interactive Live Map:**
  - OpenStreetMap tiles with custom markers for Origin (A) and Destination (B).
  - Colored route polylines (Emerald for Recommended, Amber for Fastest, Blue for Balanced, Red for Critical).
  - Active hazard markers with interactive popups and auto-fitting map bounds.
- **Live Incident Intelligence & Dynamic Rerouting (The "WOW" Moment):**
  - Active hazard cards with filter by severity (Critical, High, Medium, Low).
  - "Report Incident" modal with Route selector and severity levels.
  - Instant dynamic recalculation: Reporting a Critical Landslide on Route B automatically triggers risk penalty, switches AI choice to Route C, and displays prominent `ROUTE RECOMMENDATION AUTOMATICALLY UPDATED` banner.
- **Analytics Dashboard:**
  - Recharts visualizations: Corridor Accessibility & Safety index, Hazard Breakdown by Incident type.
  - Key operational logistics insights and future production integration roadmap.
- **1-Click Demo Scenarios:**
  - Normal Baseline (Guwahati → Shillong, Route B Recommended).
  - Major Landslide on Route B (WOW Trigger rerouting to Route C).
  - Heavy Monsoon Downpour in Meghalaya (Vegetables).
  - Heavy Multi-Axle Freight Restriction (Siliguri → Gangtok).
  - Cross-Border Transit (Imphal → Aizawl).

---

## 4. Backlog & Future Extensions
- **P0 (Completed):** Core command center, dynamic routing, explainable AI, leaflet map, incident reporting, dynamic rerouting, demo mode.
- **P1 (Future Scope):** Real-time IMD Doppler Weather Radar integration, MoRTH national highway condition APIs.
- **P2 (Future Scope):** Sentinel-2 satellite landslide predictive vision model, IoT axle vibration telemetry, Regional language voice advisories (Assamese, Bengali, Manipuri, Mizo, Khasi).
