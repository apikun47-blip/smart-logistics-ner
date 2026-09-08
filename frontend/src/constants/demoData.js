export const PRESET_HUBS = [
  { name: "Guwahati", state: "Assam", desc: "Main NE Gateway / Brahmaputra Valley" },
  { name: "Shillong", state: "Meghalaya", desc: "East Khasi Hills Hub (Elevation 1,525m)" },
  { name: "Imphal", state: "Manipur", desc: "Manipur Valley Commercial Hub" },
  { name: "Aizawl", state: "Mizoram", desc: "High Ridge Capital (Elevation 1,132m)" },
  { name: "Kohima", state: "Nagaland", desc: "Strategic Hill Corridor (Elevation 1,444m)" },
  { name: "Itanagar", state: "Arunachal Pradesh", desc: "Sub-Himalayan Foothill Capital" },
  { name: "Gangtok", state: "Sikkim", desc: "Eastern Himalayan Mountain Route" },
  { name: "Agartala", state: "Tripura", desc: "Southern Plain & Border Trade Hub" },
  { name: "Silchar", state: "Assam", desc: "Barak Valley Transit Junction" },
  { name: "Dibrugarh", state: "Assam", desc: "Upper Assam Oil & Tea Logistics" },
  { name: "Siliguri", state: "West Bengal", desc: "Chicken's Neck Strategic Access Point" },
  { name: "Delhi", state: "NCR", desc: "National Central Freight Inbound" }
];

export const DEMO_SCENARIOS = [
  {
    id: "normal",
    title: "Normal Baseline",
    badge: "Clear Weather",
    origin: "Guwahati",
    destination: "Shillong",
    cargo: "Medicine",
    vehicle: "Medium Truck",
    weight: 500,
    description: "Standard monsoon-free conditions. AI recommends Route B (Safest ridge corridor)."
  },
  {
    id: "landslide_b",
    title: "Major Landslide on Route B (WOW Trigger)",
    badge: "Critical Incident",
    origin: "Guwahati",
    destination: "Shillong",
    cargo: "Medicine",
    vehicle: "Medium Truck",
    weight: 500,
    triggerIncident: {
      type: "Landslide",
      location: "Sonapur / Umiam Gorge Bypass",
      severity: "Critical",
      affected_route: "Route B",
      description: "Massive rockfall blocking Route B. Instant AI dynamic recalculation & reroute to Route C."
    },
    description: "Demonstrates instant AI risk recalibration from Route B -> Route C."
  },
  {
    id: "heavy_rainfall",
    title: "Heavy Monsoon Downpour in Meghalaya",
    badge: "Weather Alert",
    origin: "Guwahati",
    destination: "Shillong",
    cargo: "Vegetables",
    vehicle: "Small Truck",
    weight: 800,
    triggerIncident: {
      type: "Flash Flood",
      location: "Low-lying Highway Approach",
      severity: "High",
      affected_route: "Route A",
      description: "Severe water accumulation on primary highway corridor. Direct road speed halved."
    },
    description: "Monsoon rainfall creates mudslides and water accumulation."
  },
  {
    id: "multi_axle_truck",
    title: "Heavy Multi-Axle Freight Restriction",
    badge: "Vehicle Constraint",
    origin: "Siliguri",
    destination: "Gangtok",
    cargo: "Construction Material",
    vehicle: "Heavy Truck",
    weight: 16000,
    description: "Tests axle load and turning radius AI compatibility on steep hairpin loops."
  },
  {
    id: "cross_state",
    title: "Cross-Border Transit: Imphal → Aizawl",
    badge: "Inter-State Artery",
    origin: "Imphal",
    destination: "Aizawl",
    cargo: "Electronics",
    vehicle: "Van",
    weight: 350,
    description: "Challenging inter-ridge terrain across Manipur and Mizoram."
  }
];
