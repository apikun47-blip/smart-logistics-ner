import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { 
  LayoutDashboard, 
  Navigation, 
  GitFork, 
  MapPin, 
  AlertOctagon, 
  BarChart3,
  Compass,
  Cpu
} from 'lucide-react';

export const Navbar = () => {
  const { activeTab, setActiveTab } = useLogistics();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, testId: 'nav-overview' },
    { id: 'planner', label: 'Route Planner', icon: Navigation, testId: 'nav-planner' },
    { id: 'analysis', label: 'Route Analysis', icon: GitFork, testId: 'nav-analysis' },
    { id: 'map', label: 'Live Map', icon: MapPin, testId: 'nav-map' },
    { id: 'incidents', label: 'Incidents', icon: AlertOctagon, testId: 'nav-incidents' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, testId: 'nav-analytics' }
  ];

  return (
    <header className="bg-[#0D1527] border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand Logo & Tagline */}
        <div 
          data-testid="brand-header"
          onClick={() => setActiveTab('overview')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white font-['Outfit']">
                AI Logistics Command
              </span>
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                NER INDIA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wider">
              PREDICT <span className="text-emerald-400">→</span> OPTIMIZE <span className="text-emerald-400">→</span> ADAPT
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1" data-testid="global-navbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                data-testid={item.testId}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition duration-150 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Route Planner CTA */}
        <div className="flex items-center space-x-2">
          <button
            data-testid="header-plan-route-cta"
            onClick={() => setActiveTab('planner')}
            className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md shadow-emerald-900/40 transition hover:shadow-emerald-900/60"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Plan Route</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Scroll Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto space-x-1 px-3 py-2 border-t border-slate-800/80 bg-[#0A0F1D]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              data-testid={`mobile-${item.testId}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
