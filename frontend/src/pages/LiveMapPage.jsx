import React from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { LiveLeafletMap } from '../components/map/LiveLeafletMap';
import { RerouteAlertBanner } from '../components/common/RerouteAlertBanner';
import { 
  MapPin, 
  Layers, 
  Sparkles, 
  AlertTriangle, 
  Navigation, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const LiveMapPage = () => {
  const { 
    analysisData, 
    selectedRouteId, 
    setSelectedRouteId, 
    setActiveTab, 
    incidents 
  } = useLogistics();

  const routes = analysisData?.routes || {};
  const recommendedName = analysisData?.recommended_route || 'Route B';
  const selectedRoute = Object.values(routes).find(r => r.id === selectedRouteId) || Object.values(routes)[0];

  return (
    <div className="space-y-6 pb-12" data-testid="live-map-page">
      {/* Dynamic Reroute Alert if active */}
      <RerouteAlertBanner />

      {/* Header */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
            <span className="font-bold text-emerald-400">LIVE GEOSPATIAL INTELLIGENCE</span>
            <span>•</span>
            <span>OSM Leaflet Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Interactive Corridor Map & Hazard Overlay
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            data-testid="btn-map-report-incident"
            onClick={() => setActiveTab('incidents')}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-md transition"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Road Incident</span>
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-8">
          <LiveLeafletMap height="580px" />
        </div>

        {/* Selected Route Telemetry Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0D1527] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Route Telemetry Details
            </span>

            {selectedRoute ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white font-['Outfit']">
                      {selectedRoute.name}
                    </h3>
                    <span className="text-xs text-slate-400">{selectedRoute.tagline}</span>
                  </div>

                  {selectedRoute.name === recommendedName ? (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Choice</span>
                    </span>
                  ) : (
                    <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded">
                      Alternative
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Distance</span>
                    <span className="font-bold text-white text-sm font-mono">{selectedRoute.distance_km} km</span>
                  </div>

                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">ETA</span>
                    <span className="font-bold text-white text-sm font-mono">{selectedRoute.eta_formatted}</span>
                  </div>

                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Cost</span>
                    <span className="font-bold text-amber-300 text-sm font-mono">
                      ₹{selectedRoute.estimated_cost_inr.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">AI Score</span>
                    <span className="font-bold text-emerald-400 text-sm font-mono">
                      {selectedRoute.ai_score}/100
                    </span>
                  </div>
                </div>

                {/* Road and terrain attributes */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Terrain Profile:</span>
                    <span className="font-semibold text-slate-200">{selectedRoute.terrain_risk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Traffic Density:</span>
                    <span className="font-semibold text-slate-200">{selectedRoute.traffic_risk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vehicle Compatibility:</span>
                    <span className="font-semibold text-slate-200">{selectedRoute.vehicle_compatibility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Safety Score:</span>
                    <span className="font-bold text-emerald-400">{selectedRoute.safety_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Accessibility Score:</span>
                    <span className="font-bold text-cyan-400">{selectedRoute.accessibility_score}%</span>
                  </div>
                </div>

                {/* Route Switcher Buttons */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Select Route on Map:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Object.values(routes).map(r => (
                      <button
                        key={r.id}
                        data-testid={`btn-map-switch-${r.id}`}
                        onClick={() => setSelectedRouteId(r.id)}
                        className={`py-1.5 rounded-lg text-xs font-semibold border transition ${
                          selectedRouteId === r.id
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Active Hazard Indicators on Map */}
          <div className="bg-[#0D1527] border border-slate-800 rounded-2xl p-4 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-2 flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Active Hazard Points Monitored ({incidents.length})</span>
            </span>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {incidents.slice(0, 5).map(inc => (
                <div key={inc.id} className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">{inc.type}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      inc.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{inc.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
