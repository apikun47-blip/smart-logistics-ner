import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { DEMO_SCENARIOS } from '../../constants/demoData';
import { Sparkles, Play, ShieldAlert, Mountain, CloudLightning, Truck } from 'lucide-react';

export const DemoScenarioBar = () => {
  const { activeScenario, applyDemoScenario } = useLogistics();

  const getIcon = (id) => {
    switch (id) {
      case 'landslide_b':
        return Mountain;
      case 'heavy_rainfall':
        return CloudLightning;
      case 'multi_axle_truck':
        return Truck;
      default:
        return ShieldAlert;
    }
  };

  return (
    <div 
      data-testid="demo-scenario-bar"
      className="bg-[#0F172A] border border-slate-800 rounded-xl p-3.5 my-4 shadow-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded bg-amber-500/20 text-amber-400">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Hackathon Live Demo Presets (1-Click Wow Scenarios)
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Click any preset to simulate instantaneous terrain risk & dynamic AI rerouting
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {DEMO_SCENARIOS.map((sc) => {
          const Icon = getIcon(sc.id);
          const isSelected = activeScenario === sc.id;
          return (
            <button
              key={sc.id}
              data-testid={`demo-scenario-btn-${sc.id}`}
              onClick={() => applyDemoScenario(sc)}
              className={`text-left p-2.5 rounded-lg border text-xs transition duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-md'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center space-x-1.5">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="font-semibold truncate">{sc.title.split('(')[0]}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  sc.id === 'landslide_b' ? 'bg-red-500/20 text-red-400 border border-red-500/30 font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {sc.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                {sc.origin} → {sc.destination} ({sc.cargo})
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
