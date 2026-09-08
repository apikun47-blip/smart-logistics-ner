import React from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { DemoScenarioBar } from '../components/common/DemoScenarioBar';
import { RerouteAlertBanner } from '../components/common/RerouteAlertBanner';
import { 
  Compass, 
  ArrowRight, 
  Truck, 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  CloudRain, 
  MapPin, 
  Mountain,
  Navigation,
  CheckCircle2,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const OverviewPage = () => {
  const { setActiveTab, regionalData, incidents } = useLogistics();

  const regions = regionalData?.regions || [
    { state: "Assam", risk_level: "LOW", weather: "Partly Cloudy, 28°C", active_incidents: 2, status_badge: "Normal Transit" },
    { state: "Meghalaya", risk_level: "MODERATE", weather: "Heavy Rain, 19°C", active_incidents: 2, status_badge: "Monsoon Watch" },
    { state: "Manipur", risk_level: "HIGH", weather: "Rain Showers, 22°C", active_incidents: 1, status_badge: "Active Hazard" },
    { state: "Mizoram", risk_level: "LOW", weather: "Overcast, 24°C", active_incidents: 0, status_badge: "Safe Transit" },
    { state: "Nagaland", risk_level: "MODERATE", weather: "Foggy Slopes, 18°C", active_incidents: 1, status_badge: "Caution Advised" },
    { state: "Arunachal Pradesh", risk_level: "HIGH", weather: "Torrential Rain, 14°C", active_incidents: 1, status_badge: "Rockfall Alert" },
    { state: "Tripura", risk_level: "LOW", weather: "Clear Sky, 30°C", active_incidents: 0, status_badge: "Optimal" },
    { state: "Sikkim", risk_level: "MODERATE", weather: "Mist & Drizzle, 12°C", active_incidents: 1, status_badge: "High Altitude Warning" }
  ];

  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'MODERATE':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'HIGH':
      case 'CRITICAL':
        return 'text-red-400 bg-red-500/10 border-red-500/30 font-bold';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-12" data-testid="overview-page">
      {/* Dynamic Reroute Alert Banner if triggered */}
      <RerouteAlertBanner />

      {/* Hero Section */}
      <div 
        data-testid="hero-section"
        className="relative bg-gradient-to-r from-[#0C1529] via-[#0F1D38] to-[#0A1326] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI-POWERED LOGISTICS INTELLIGENCE • NORTH EASTERN REGION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Outfit'] leading-tight mb-2">
            AI Logistics Intelligence
          </h1>

          <p className="text-emerald-400 text-base sm:text-lg font-semibold mb-3">
            "Safer routes. Smarter logistics. Better accessibility."
          </p>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
            AI-assisted route intelligence that evaluates safety, accessibility, weather, terrain, travel time and cost to recommend the most suitable logistics route across complex mountain and riverine corridors.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              data-testid="hero-start-route-planning-btn"
              onClick={() => setActiveTab('planner')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-900/50 hover:shadow-emerald-900/70 transition"
            >
              <span>START ROUTE PLANNING</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              data-testid="hero-explore-live-map-btn"
              onClick={() => setActiveTab('map')}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-sm px-5 py-3 rounded-xl border border-slate-700 transition"
            >
              Explore Live Map
            </button>
          </div>
        </div>
      </div>

      {/* Demo Presets Bar */}
      <DemoScenarioBar />

      {/* Core KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="overview-kpis">
        <div className="bg-[#0D1527] border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Active Shipments</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono" data-testid="kpi-active-shipments">
            24
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Live freight units in transit</span>
        </div>

        <div className="bg-[#0D1527] border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Routes Monitored</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono" data-testid="kpi-routes-monitored">
            18
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">8 NE States & Chicken's Neck</span>
        </div>

        <div className="bg-[#0D1527] border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">High Risk Routes</span>
            <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-400 font-mono" data-testid="kpi-high-risk-routes">
            4
          </div>
          <span className="text-[11px] text-orange-300/80 mt-1 block">Monsoon & landslide prone</span>
        </div>

        <div className="bg-[#0D1527] border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Active Incidents</span>
            <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-400 font-mono" data-testid="kpi-active-incidents">
            7
          </div>
          <span className="text-[11px] text-red-300/80 mt-1 block">Landslides, floods & bottlenecks</span>
        </div>
      </div>

      {/* Regional Logistics Status Grid */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-2xl p-6 shadow-xl" data-testid="regional-logistics-status">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white font-['Outfit']">
              Regional Logistics & Terrain Risk Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Live environmental telemetry across all 8 North Eastern states
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md">
            All 8 States Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {regions.map((reg) => (
            <div 
              key={reg.state}
              data-testid={`state-risk-card-${reg.state.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm">{reg.state}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${getRiskColor(reg.risk_level)}`}>
                  {reg.risk_level} RISK
                </span>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{reg.weather}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-semibold text-slate-200">{reg.status_badge}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts & Quick Scenarios Two-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-[#0D1527] border border-slate-800 rounded-2xl p-6 shadow-xl" data-testid="recent-alerts-panel">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Recent Terrain & Road Alerts
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('incidents')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              View All Incidents →
            </button>
          </div>

          <div className="space-y-3">
            {incidents.slice(0, 4).map((inc) => (
              <div 
                key={inc.id}
                data-testid={`alert-item-${inc.id}`}
                className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 text-xs flex items-start space-x-3"
              >
                <div className={`p-2 rounded-lg mt-0.5 flex-shrink-0 ${
                  inc.severity === 'Critical' ? 'bg-red-600 text-white' : (inc.severity === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-amber-500/20 text-amber-400')
                }`}>
                  <Mountain className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-white">{inc.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      inc.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{inc.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                    <span>Affects: {inc.affected_route}</span>
                    <span>{inc.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Tagline Architecture Breakdown */}
        <div className="bg-[#0D1527] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between" data-testid="core-tagline-card">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Core Architecture & Philosophy
            </span>
            <h3 className="text-xl font-bold text-white font-['Outfit'] mb-4">
              PREDICT <span className="text-emerald-400">→</span> OPTIMIZE <span className="text-emerald-400">→</span> ADAPT
            </h3>

            <div className="space-y-3.5">
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
                <div className="flex items-center space-x-2 font-bold text-white text-sm mb-1">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">1</span>
                  <span>PREDICT: Environmental & Slope Hazards</span>
                </div>
                <p className="text-xs text-slate-300 ml-8">
                  Evaluates mountain slope angles, monsoon rainfall indices, river basin flooding, and historic landslide hotspots across North Eastern corridors.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
                <div className="flex items-center space-x-2 font-bold text-white text-sm mb-1">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">2</span>
                  <span>OPTIMIZE: Cargo & Vehicle Aware Routing</span>
                </div>
                <p className="text-xs text-slate-300 ml-8">
                  Calculates multi-objective scores (Safety 30%, Accessibility 25%, Time 20%, Cost 15%, Weather 10%) customized for Medicine, Vegetables, or Heavy Axles.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
                <div className="flex items-center space-x-2 font-bold text-white text-sm mb-1">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">3</span>
                  <span>ADAPT: Instant Hazard Recalibration</span>
                </div>
                <p className="text-xs text-slate-300 ml-8">
                  Reacts in real-time to active landslides and culvert failures by immediately recalculating safe bypass corridors and rerouting logistics in seconds.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Ready to test any route?</span>
            <button
              onClick={() => setActiveTab('planner')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition"
            >
              <span>Open AI Route Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
