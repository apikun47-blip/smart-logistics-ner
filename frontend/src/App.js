import React from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import { StatusBar } from './components/layout/StatusBar';
import { Navbar } from './components/layout/Navbar';
import { OverviewPage } from './pages/OverviewPage';
import { PlannerPage } from './pages/PlannerPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { Toaster } from './components/ui/sonner';

const MainAppContent = () => {
  const { activeTab } = useLogistics();
  const { authView } = useAuth();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'planner':
        return <PlannerPage />;
      case 'analysis':
        return <AnalysisPage />;
      case 'map':
        return <LiveMapPage />;
      case 'incidents':
        return <IncidentsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080D1A] text-slate-100 flex flex-col font-['Inter']">
      {/* Global Status Bar */}
      <StatusBar />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        <div key={activeTab} className="page-enter">
          {renderActivePage()}
        </div>
      </main>

      {/* Auth Overlay */}
      {authView && <AuthPage />}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060A14] py-6 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-slate-300">
              AI-Based Smart Logistics & Accessibility Intelligence Platform for North Eastern India
            </span>
            <span className="mx-2 text-slate-700">|</span>
            <span className="text-emerald-400 font-mono">PREDICT → OPTIMIZE → ADAPT</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Hackathon Edition • Prototype with Simulated AI Telemetry
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <LogisticsProvider>
        <MainAppContent />
      </LogisticsProvider>
    </AuthProvider>
  );
}

export default App;
