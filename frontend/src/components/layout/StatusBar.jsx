import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Activity, CloudRain, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';

export const StatusBar = () => {
  const { regionalData, resetDemoState } = useLogistics();
  const meta = regionalData?.global_status || {
    system_operational: true,
    weather_monitoring: "ACTIVE",
    routes_monitored: 18,
    active_incidents: 7,
    last_updated: "Just now",
    data_mode: "Prototype / Simulated AI Telemetry"
  };

  return (
    <div 
      data-testid="global-status-bar"
      className="bg-[#0A0F1D] border-b border-slate-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-slate-300"
    >
      <div className="flex items-center space-x-4 flex-wrap gap-y-1">
        <div className="flex items-center space-x-2 font-medium" data-testid="status-system-operational">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-semibold tracking-wide">SYSTEM OPERATIONAL</span>
        </div>

        <span className="text-slate-600 hidden sm:inline">|</span>

        <div className="flex items-center space-x-1 text-slate-300" data-testid="status-weather-monitoring">
          <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Weather Monitoring:</span>
          <span className="text-cyan-400 font-medium">ACTIVE</span>
        </div>

        <span className="text-slate-600 hidden sm:inline">|</span>

        <div className="flex items-center space-x-1" data-testid="status-routes-monitored">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Routes Monitored:</span>
          <span className="text-white font-semibold">{meta.routes_monitored}</span>
        </div>

        <span className="text-slate-600 hidden sm:inline">|</span>

        <div className="flex items-center space-x-1" data-testid="status-active-incidents">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Active Incidents:</span>
          <span className="text-amber-400 font-semibold">{meta.active_incidents}</span>
        </div>

        <span className="text-slate-600 hidden md:inline">|</span>

        <div className="hidden md:flex items-center space-x-1 text-slate-400" data-testid="status-last-updated">
          <span>Last Updated:</span>
          <span className="text-slate-200">{meta.last_updated}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <span 
          data-testid="status-prototype-badge"
          className="bg-slate-800/80 border border-slate-700/80 text-[11px] text-amber-300 px-2 py-0.5 rounded font-mono"
        >
          {meta.data_mode}
        </span>
        <button
          data-testid="btn-reset-demo"
          onClick={resetDemoState}
          title="Reset back to default demo state"
          className="flex items-center space-x-1 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 px-2 py-0.5 rounded transition text-[11px]"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );
};
