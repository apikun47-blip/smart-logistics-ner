import React from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { RouteComparisonCard } from '../components/routes/RouteComparisonCard';
import { ExplainableAICard } from '../components/routes/ExplainableAICard';
import { RerouteAlertBanner } from '../components/common/RerouteAlertBanner';
import { 
  GitFork, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Map as MapIcon, 
  AlertTriangle,
  Flame,
  Layers
} from 'lucide-react';

export const AnalysisPage = () => {
  const { 
    analysisData, 
    selectedRouteId, 
    setSelectedRouteId, 
    setActiveTab, 
    isAnalyzing 
  } = useLogistics();

  if (isAnalyzing || !analysisData) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-4" data-testid="analysis-loading-placeholder">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold">Calculating Multi-Objective Route Intelligence...</p>
      </div>
    );
  }

  const routes = analysisData.routes || {};
  const recommendedName = analysisData.recommended_route || 'Route B';
  const winner = analysisData.recommended_route_data || routes[recommendedName] || Object.values(routes)[0];

  return (
    <div className="space-y-6 pb-12" data-testid="analysis-page">
      {/* Dynamic Reroute Alert if active */}
      <RerouteAlertBanner />

      {/* Header Banner */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
              AI Route Evaluation Completed
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {analysisData.origin.name} → {analysisData.destination.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            AI Route Analysis & Optimization
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            data-testid="btn-view-on-live-map"
            onClick={() => setActiveTab('map')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg transition"
          >
            <MapIcon className="w-4 h-4" />
            <span>View on Live Map</span>
          </button>
          <button
            data-testid="btn-replan-route"
            onClick={() => setActiveTab('planner')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition"
          >
            Reconfigure Parameters
          </button>
        </div>
      </div>

      {/* AI RECOMMENDED ROUTE HERO SPOTLIGHT */}
      <div 
        data-testid="ai-recommended-hero-card"
        className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-[#0B172E] border-2 border-emerald-500/90 rounded-2xl p-6 sm:p-8 shadow-2xl glow-emerald"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500 rounded-xl text-slate-950 font-black shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                AI OPTIMAL RECOMMENDATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']" data-testid="winner-route-name">
                {winner.name} <span className="text-base font-normal text-slate-300">({winner.tagline})</span>
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block mb-0.5">Overall AI Score</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono" data-testid="winner-ai-score">
              {winner.ai_score}/100
            </span>
          </div>
        </div>

        {/* Hero Score Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">Distance</span>
            <span className="font-extrabold text-white text-base font-mono">{winner.distance_km} km</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">ETA</span>
            <span className="font-extrabold text-white text-base font-mono">{winner.eta_formatted}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">Estimated Cost</span>
            <span className="font-extrabold text-amber-300 text-base font-mono">
              ₹{winner.estimated_cost_inr.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">Safety Index</span>
            <span className="font-extrabold text-emerald-400 text-base font-mono">{winner.safety_score}%</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">Accessibility</span>
            <span className="font-extrabold text-cyan-400 text-base font-mono">{winner.accessibility_score}%</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">Overall Risk</span>
            <span className={`font-extrabold text-base ${winner.incident_risk === 'LOW' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {winner.incident_risk}
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison: Route A, Route B, Route C */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Multi-Route Side-by-Side Comparison (A / B / C)
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated under current elevation, rainfall, road quality, and active incidents
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            3 Alternative Corridors Generated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="route-cards-grid">
          {Object.entries(routes).map(([name, r]) => (
            <RouteComparisonCard
              key={r.id}
              route={r}
              isRecommended={name === recommendedName}
              isSelected={selectedRouteId === r.id}
              onSelect={() => setSelectedRouteId(r.id)}
            />
          ))}
        </div>
      </div>

      {/* Explainable AI "Why Did AI Choose This Route?" */}
      <ExplainableAICard
        explainableAi={analysisData.explainable_ai}
        recommendedRoute={winner}
        optimizationProfile={analysisData.optimization_profile}
        cargoType={analysisData.cargo_type}
      />
    </div>
  );
};
