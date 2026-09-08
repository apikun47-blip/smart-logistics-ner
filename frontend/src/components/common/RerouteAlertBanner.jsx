import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { AlertOctagon, ArrowRight, ShieldCheck, Zap, X } from 'lucide-react';

export const RerouteAlertBanner = () => {
  const { lastRerouteNotice, setLastRerouteNotice, setActiveTab } = useLogistics();

  if (!lastRerouteNotice) return null;

  return (
    <div 
      data-testid="dynamic-reroute-alert-banner"
      className="bg-gradient-to-r from-red-950/90 via-slate-900 to-emerald-950/90 border-2 border-red-500/80 rounded-xl p-4 my-4 shadow-2xl animate-bounce-once glow-red"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-red-600 rounded-lg text-white shadow-lg shadow-red-900/50 mt-0.5">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-3 flex-wrap gap-y-1">
              <span className="text-xs font-black uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded">
                CRITICAL INCIDENT DETECTED
              </span>
              <span className="text-sm font-bold text-white">
                ROUTE RECOMMENDATION AUTOMATICALLY UPDATED
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {lastRerouteNotice.timestamp}
              </span>
            </div>

            {/* Reroute Shift Badge */}
            <div className="flex items-center space-x-3 my-2.5">
              <div className="bg-slate-900 border border-red-500/40 px-3 py-1.5 rounded-lg flex items-center space-x-2">
                <span className="text-xs text-slate-400">Previous:</span>
                <span className="text-xs font-bold line-through text-red-400">{lastRerouteNotice.previous}</span>
                <span className="text-[10px] bg-red-900/50 text-red-300 px-1.5 py-0.2 rounded font-mono">
                  Hazard Compromised
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-emerald-400 font-bold" />

              <div className="bg-emerald-950/60 border border-emerald-500/60 px-3 py-1.5 rounded-lg flex items-center space-x-2 glow-emerald">
                <span className="text-xs text-emerald-300">New AI Choice:</span>
                <span className="text-sm font-extrabold text-emerald-400" data-testid="new-recommended-route-text">
                  {lastRerouteNotice.newRoute}
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            <p className="text-xs text-slate-200 mt-1 max-w-4xl bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <strong className="text-amber-400">Reason: </strong>
              {lastRerouteNotice.reason}
            </p>

            <div className="flex items-center space-x-3 mt-3">
              <button
                data-testid="btn-view-updated-analysis"
                onClick={() => setActiveTab('analysis')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition shadow"
              >
                <span>View Route Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                data-testid="btn-view-updated-map"
                onClick={() => setActiveTab('map')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-md transition"
              >
                <span>Inspect on Live Map</span>
              </button>
            </div>
          </div>
        </div>

        <button
          data-testid="btn-dismiss-reroute-notice"
          onClick={() => setLastRerouteNotice(null)}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
          title="Dismiss notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
