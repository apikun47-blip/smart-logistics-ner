import React from 'react';
import { Brain, CheckCircle2, ShieldCheck, ArrowRight, Activity, Cpu } from 'lucide-react';

export const ExplainableAICard = ({ explainableAi, recommendedRoute, optimizationProfile, cargoType }) => {
  if (!explainableAi) return null;

  return (
    <div 
      data-testid="explainable-ai-card"
      className="bg-gradient-to-br from-[#0D1527] via-slate-900 to-[#0A1A2F] border border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
    >
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-400 shadow-md">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Explainable AI Intelligence Matrix
            </span>
            <h3 className="text-lg font-bold text-white font-['Outfit']" data-testid="explainable-ai-title">
              {explainableAi.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Profile:</span>
          <span className="bg-slate-800 border border-slate-700 text-cyan-300 text-xs px-2.5 py-1 rounded-md font-mono">
            {cargoType} ({optimizationProfile})
          </span>
        </div>
      </div>

      {/* Decision Factor Bullets */}
      <div className="my-5 space-y-2.5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Key Multi-Factor Optimization Drivers:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {explainableAi.key_factors.map((factor, idx) => (
            <div 
              key={idx}
              data-testid={`explainable-ai-factor-${idx}`}
              className="flex items-start space-x-2.5 bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg text-xs text-slate-200"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>{factor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Decision Narrative Box */}
      <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 mt-4">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wide mb-1.5">
          <Cpu className="w-4 h-4" />
          <span>AI Tactical Decision Narrative</span>
        </div>
        <p 
          data-testid="ai-decision-narrative"
          className="text-sm text-slate-200 leading-relaxed font-sans"
        >
          "{explainableAi.decision_narrative}"
        </p>
      </div>
    </div>
  );
};
