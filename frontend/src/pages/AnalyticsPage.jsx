import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLogistics } from '../context/LogisticsContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  Layers,
  Sparkles
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AnalyticsPage = () => {
  const { regionalData } = useLogistics();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await axios.get(`${API}/analytics`);
        setAnalytics(res.data);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const riskPieData = analytics?.risk_distribution || [
    { category: "Low Risk", count: 11, color: "#10B981" },
    { category: "Moderate Risk", count: 4, color: "#F59E0B" },
    { category: "High Risk", count: 3, color: "#EF4444" }
  ];

  const routeAccessibilityData = analytics?.accessibility_by_route || [
    { route: "NH-27 Guwahati", accessibility: 94, safety: 92 },
    { route: "NH-40 Shillong", accessibility: 88, safety: 85 },
    { route: "NH-6 Sonapur", accessibility: 56, safety: 48 },
    { route: "NH-2 Imphal", accessibility: 68, safety: 60 },
    { route: "NH-10 Gangtok", accessibility: 74, safety: 70 },
    { route: "NH-54 Aizawl", accessibility: 82, safety: 80 }
  ];

  const incidentsByTypeData = analytics?.incidents_by_type || [
    { type: "Landslide", count: 14, color: "#EF4444" },
    { type: "Flash Flood", count: 9, color: "#3B82F6" },
    { type: "Road Blockage", count: 6, color: "#F97316" },
    { type: "Erosion", count: 5, color: "#EAB308" },
    { type: "Traffic", count: 8, color: "#A855F7" }
  ];

  const keyInsights = analytics?.key_insights || [
    "Heavy rainfall in Meghalaya currently elevates landslide risk by 42% on NH-6 Sonapur stretch.",
    "Route B ridge bypass provides a 17% higher safety margin for heavy freight compared to valley routes.",
    "Vehicle compatibility restrictions currently apply to Heavy Trucks on 2 mountain passes in Manipur & Arunachal.",
    "Real-time dynamic rerouting prevents an estimated 4.2 hours of logistics delays per blocked convoy."
  ];

  return (
    <div className="space-y-6 pb-12" data-testid="analytics-page">
      {/* Header */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Logistics & Risk Analytics Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Macro telemetry on corridor accessibility, hazard trends, and route optimization distributions.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="analytics-kpis">
        <div className="bg-[#0D1527] border border-slate-800 rounded-xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Average Route Accessibility</span>
          <span className="text-3xl font-extrabold text-cyan-400 font-mono" data-testid="kpi-avg-accessibility">
            87%
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Logistics Suitability Index</span>
        </div>

        <div className="bg-[#0D1527] border border-slate-800 rounded-xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Corridors Monitored</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">18</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Full NE Inter-state Coverage</span>
        </div>

        <div className="bg-[#0D1527] border border-slate-800 rounded-xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">High-Risk Hazard Zones</span>
          <span className="text-3xl font-extrabold text-orange-400 font-mono">4</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Monsoon Slopes Monitored</span>
        </div>

        <div className="bg-[#0D1527] border border-slate-800 rounded-xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Active Incident Hazards</span>
          <span className="text-3xl font-extrabold text-red-400 font-mono">7</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Real-time Telemetry Reports</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Accessibility & Safety by Corridor */}
        <div className="bg-[#0D1527] border border-slate-800 rounded-2xl p-5 shadow-xl" data-testid="chart-accessibility-corridor">
          <h3 className="text-base font-bold text-white font-['Outfit'] mb-1">
            Accessibility & Safety Index by Major Corridor
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Comparison of route suitability and structural safety factors (0-100)
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeAccessibilityData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="route" stroke="#64748B" fontSize={11} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="accessibility" fill="#06B6D4" name="Accessibility Score" radius={[4, 4, 0, 0]} />
                <Bar dataKey="safety" fill="#10B981" name="Safety Index" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Incidents by Hazard Type */}
        <div className="bg-[#0D1527] border border-slate-800 rounded-2xl p-5 shadow-xl" data-testid="chart-incidents-type">
          <h3 className="text-base font-bold text-white font-['Outfit'] mb-1">
            Hazard Breakdown by Incident Type
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Distribution of environmental and road disruptions across North East
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentsByTypeData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis type="category" dataKey="type" stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" name="Reported Incidents" radius={[0, 4, 4, 0]}>
                  {incidentsByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Insights Panel */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-2xl p-6 shadow-xl" data-testid="analytics-insights">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Key Operational Logistics Insights</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {keyInsights.map((insight, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-xs text-slate-200 flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Future Scope / Production Roadmap */}
      <div className="bg-[#0A0F1D] border border-slate-800/80 rounded-2xl p-6 shadow-xl" data-testid="future-scope-section">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Cpu className="w-4 h-4" />
          <span>Future Scope / Production Integration Roadmap</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Production deployment can integrate verified weather, terrain, traffic, satellite, road condition and government datasets:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs">
          {[
            "Real-time IMD Weather Radar",
            "Govt MoRTH Road Data",
            "Sentinel-2 Satellite Imagery",
            "IoT Vehicle Axle Telemetry",
            "Computer Vision Pothole AI",
            "Predictive Landslide ML Models",
            "Emergency Services Gateway",
            "Regional NE Language Support"
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg text-slate-300 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
              <span className="text-[11px]">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
