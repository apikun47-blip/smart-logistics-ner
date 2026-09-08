import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { ReportIncidentModal } from '../components/incidents/ReportIncidentModal';
import { RerouteAlertBanner } from '../components/common/RerouteAlertBanner';
import { 
  AlertOctagon, 
  Plus, 
  Mountain, 
  CloudRain, 
  AlertTriangle, 
  Truck, 
  ShieldAlert, 
  Trash2, 
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const IncidentsPage = () => {
  const { incidents, resetDemoState, reportIncident, setActiveTab } = useLogistics();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('ALL');

  const filteredIncidents = selectedSeverityFilter === 'ALL'
    ? incidents
    : incidents.filter(i => i.severity.toUpperCase() === selectedSeverityFilter);

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50 font-black';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40 font-bold';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Low':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Quick 1-Click Trigger for the "WOW MOMENT" demo
  const triggerLandslideWowDemo = async () => {
    await reportIncident({
      type: "Landslide",
      title: "Major Landslide on Route B Ridge Corridor",
      location: "Sonapur / Umiam Gorge Pass",
      state: "Meghalaya",
      severity: "Critical",
      affected_route: "Route B",
      description: "Critical slope failure and boulder slide blocking Route B. Immediate AI dynamic recalculation & reroute to Route C."
    });
  };

  return (
    <div className="space-y-6 pb-12" data-testid="incidents-page">
      {/* Dynamic Reroute Alert if active */}
      <RerouteAlertBanner />

      {/* Modal */}
      <ReportIncidentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Header Banner */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
            <span className="font-bold text-red-400">TELEMETRY & HAZARD MONITOR</span>
            <span>•</span>
            <span>Real-time Field Reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Live Incident Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Monitor, report, and dynamically assess environmental risks and corridor blockages.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            data-testid="btn-trigger-landslide-wow"
            onClick={triggerLandslideWowDemo}
            className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-red-950 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simulate Critical Landslide (WOW Trigger)</span>
          </button>

          <button
            data-testid="btn-open-report-incident-modal"
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-950 transition"
          >
            <Plus className="w-4 h-4" />
            <span>REPORT INCIDENT</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0D1527] border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold">Filter by Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              data-testid={`filter-severity-${sev.toLowerCase()}`}
              onClick={() => setSelectedSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedSeverityFilter === sev
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-white">{filteredIncidents.length}</strong> active hazards
        </div>
      </div>

      {/* Incident Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="incidents-grid">
        {filteredIncidents.map((inc) => (
          <div
            key={inc.id}
            data-testid={`incident-card-${inc.id}`}
            className="bg-[#0D1527] border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-between transition duration-150"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-bold text-base text-white font-['Outfit']">
                  {inc.type}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${getSeverityBadge(inc.severity)}`}>
                  {inc.severity.toUpperCase()}
                </span>
              </div>

              <strong className="text-xs text-slate-200 block mb-1">
                {inc.title || `${inc.type} at ${inc.location}`}
              </strong>

              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {inc.description}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-200 font-medium">{inc.location}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Affected Corridor:</span>
                <span className="font-mono font-bold text-amber-400">{inc.affected_route}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">State / Region:</span>
                <span className="text-slate-300">{inc.state || 'North East Region'}</span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-[11px] text-slate-500 font-mono">{inc.time}</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {inc.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
