import React from 'react';
import { Shield, Clock, DollarSign, CloudSun, AlertTriangle, CheckCircle, Truck, Sparkles } from 'lucide-react';

export const RouteComparisonCard = ({ 
  route, 
  isRecommended, 
  isSelected, 
  onSelect 
}) => {
  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case 'LOW':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'MODERATE':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/50 font-bold';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div
      data-testid={`route-card-${route.id}`}
      onClick={onSelect}
      className={`rounded-xl border p-5 transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
        isRecommended
          ? 'bg-gradient-to-b from-slate-900 via-[#0E1A2D] to-slate-900 border-emerald-500/80 shadow-xl glow-emerald ring-1 ring-emerald-500/50'
          : isSelected
          ? 'bg-slate-900/90 border-blue-500/70 shadow-lg'
          : 'bg-[#0D1527]/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
      }`}
    >
      {/* Top Banner */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <div className="font-extrabold text-lg text-white font-['Outfit'] tracking-wide">
              {route.name}
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
              {route.tagline}
            </div>
          </div>

          {isRecommended ? (
            <span 
              data-testid={`badge-ai-recommended-${route.id}`}
              className="bg-emerald-500 text-slate-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow-sm whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI RECOMMENDED</span>
            </span>
          ) : (
            <span className="bg-slate-800 border border-slate-700 text-slate-300 text-[11px] px-2 py-0.5 rounded whitespace-nowrap">
              {route.type_badge}
            </span>
          )}
        </div>

        {/* AI Overall Score Bar */}
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-300">AI Total Logistics Score</span>
            <span 
              data-testid={`score-${route.id}`}
              className={`text-base font-black font-mono ${
                isRecommended ? 'text-emerald-400' : 'text-slate-200'
              }`}
            >
              {route.ai_score}/100
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isRecommended ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.max(5, Math.min(100, route.ai_score))}%` }}
            />
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs mb-4">
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Distance</span>
            <span className="font-bold text-white text-sm font-mono">{route.distance_km} km</span>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">ETA Travel Time</span>
            <span className="font-bold text-white text-sm font-mono flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400 inline" />
              <span>{route.eta_formatted}</span>
            </span>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Estimated Cost</span>
            <span className="font-bold text-amber-300 text-sm font-mono">
              ₹{route.estimated_cost_inr.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Overall Risk</span>
            <span className={`inline-block text-[11px] px-2 py-0.5 rounded border font-bold ${getRiskBadgeColor(route.incident_risk)}`}>
              {route.incident_risk}
            </span>
          </div>
        </div>

        {/* Deep Intelligence Factors */}
        <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safety Index</span>
            </span>
            <span className="font-bold text-emerald-400 font-mono">{route.safety_score}%</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Accessibility Score</span>
            </span>
            <span className="font-bold text-cyan-400 font-mono">{route.accessibility_score}%</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <CloudSun className="w-3.5 h-3.5 text-amber-400" />
              <span>Weather Factor</span>
            </span>
            <span className="font-bold text-slate-200 font-mono">{route.weather_score}%</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <Truck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Vehicle Compat.</span>
            </span>
            <span className={`font-semibold ${route.vehicle_compatibility === 'Restricted' ? 'text-red-400' : 'text-slate-200'}`}>
              {route.vehicle_compatibility}
            </span>
          </div>
        </div>
      </div>

      {/* Select button */}
      <button
        data-testid={`btn-select-route-${route.id}`}
        className={`mt-4 w-full py-2 rounded-lg text-xs font-semibold transition ${
          isRecommended
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
            : isSelected
            ? 'bg-blue-600 text-white'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        }`}
      >
        {isRecommended ? 'Selected (AI Optimal Choice)' : isSelected ? 'Active Selection' : 'Inspect Route Details'}
      </button>
    </div>
  );
};
