import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { PRESET_HUBS } from '../constants/demoData';
import { 
  Navigation, 
  MapPin, 
  Truck, 
  Package, 
  Scale, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Zap,
  RotateCcw
} from 'lucide-react';

export const PlannerPage = () => {
  const { 
    origin, 
    setOrigin, 
    destination, 
    setDestination, 
    cargoType, 
    setCargoType, 
    cargoWeight, 
    setCargoWeight, 
    vehicleType, 
    setVehicleType,
    isAnalyzing,
    analyzingStep,
    runRouteAnalysis,
    setActiveTab
  } = useLogistics();

  const [originInput, setOriginInput] = useState(origin);
  const [destInput, setDestInput] = useState(destination);
  const [weightInput, setWeightInput] = useState(cargoWeight);
  const [customError, setCustomError] = useState('');

  const cargoOptions = [
    { value: 'Medicine', label: 'Medicine / Pharmaceuticals', priority: 'High Safety & Temperature Stability' },
    { value: 'Vegetables', label: 'Perishable Vegetables / Agro', priority: 'Fast Transit Time & Cold-Chain Speed' },
    { value: 'Construction Material', label: 'Construction Materials / Cement / Steel', priority: 'Axle Compatibility & Freight Cost' },
    { value: 'Electronics', label: 'Electronics / Sensitive Hardware', priority: 'Low Vibration & Low Moisture Ridge' }
  ];

  const vehicleOptions = [
    { value: 'Van', label: 'Logistics Van (Up to 1.2 Ton)', capacity: '1,200 kg' },
    { value: 'Small Truck', label: 'Small Freight Truck (Up to 3.5 Ton)', capacity: '3,500 kg' },
    { value: 'Medium Truck', label: 'Medium Truck (6-Wheeler, Up to 9 Ton)', capacity: '9,000 kg' },
    { value: 'Heavy Truck', label: 'Heavy Multi-Axle Truck (Up to 24 Ton)', capacity: '24,000 kg' }
  ];

  // Dynamic vehicle compatibility check for feedback
  const getVehicleCompatibilityFeedback = () => {
    if (vehicleType === 'Heavy Truck') {
      return {
        status: 'Restricted on High-Slope Mountain Hairpins',
        badge: 'Restricted Caution',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      };
    }
    return {
      status: 'Excellent for all primary and ridge corridors',
      badge: 'Excellent',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    };
  };

  const vehicleFeedback = getVehicleCompatibilityFeedback();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originInput.trim() || !destInput.trim()) {
      setCustomError('Please provide valid origin and destination locations.');
      return;
    }
    setCustomError('');
    setOrigin(originInput.trim());
    setDestination(destInput.trim());
    setCargoWeight(Number(weightInput) || 500);

    await runRouteAnalysis({
      origin: originInput.trim(),
      destination: destInput.trim(),
      cargo_type: cargoType,
      cargo_weight_kg: Number(weightInput) || 500,
      vehicle_type: vehicleType
    }, true);
  };

  const handleSwap = () => {
    const temp = originInput;
    setOriginInput(destInput);
    setDestInput(temp);
  };

  return (
    <div className="space-y-6 pb-12" data-testid="planner-page">
      {/* Header */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
            <Navigation className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              AI Route Planner
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              "Configure your shipment and let AI identify the safest and most accessible route."
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Origin and Destination Dynamic Input Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Origin */}
            <div className="md:col-span-5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Origin Location (Any City / Hub) *</span>
              </label>
              <div className="relative">
                <input
                  data-testid="input-origin"
                  type="text"
                  list="preset-hubs-list"
                  value={originInput}
                  onChange={(e) => setOriginInput(e.target.value)}
                  placeholder="e.g. Guwahati, Imphal, Gangtok, Delhi..."
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Type any origin (e.g. Guwahati, Silchar, Gangtok, Delhi)
              </span>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-2 flex justify-center pt-2 md:pt-6">
              <button
                type="button"
                data-testid="btn-swap-locations"
                onClick={handleSwap}
                title="Swap Origin and Destination"
                className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Destination */}
            <div className="md:col-span-5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Destination Location (Any City / Hub) *</span>
              </label>
              <div className="relative">
                <input
                  data-testid="input-destination"
                  type="text"
                  list="preset-hubs-list"
                  value={destInput}
                  onChange={(e) => setDestInput(e.target.value)}
                  placeholder="e.g. Shillong, Aizawl, Kohima, Itanagar..."
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Type any destination (e.g. Shillong, Imphal, Aizawl, Tura)
              </span>
            </div>
          </div>

          {/* Datalist for fast autocomplete */}
          <datalist id="preset-hubs-list">
            {PRESET_HUBS.map((hub) => (
              <option key={hub.name} value={hub.name}>
                {hub.name}, {hub.state} - {hub.desc}
              </option>
            ))}
          </datalist>

          {/* Cargo Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
            {/* Cargo Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Package className="w-4 h-4 text-amber-400" />
                <span>Cargo Type *</span>
              </label>
              <select
                data-testid="select-cargo-type"
                value={cargoType}
                onChange={(e) => setCargoType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                {cargoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-amber-400/90 mt-1.5 font-mono">
                Priority: {cargoOptions.find((c) => c.value === cargoType)?.priority}
              </p>
            </div>

            {/* Cargo Weight */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>Cargo Weight (kg) *</span>
              </label>
              <div className="flex items-center space-x-3">
                <input
                  data-testid="input-cargo-weight"
                  type="number"
                  min="50"
                  max="30000"
                  step="50"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-emerald-500 font-semibold"
                />
                <span className="text-xs text-slate-400 font-mono">kg</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1.5 block">
                Standard payload benchmark: 500 kg - 15,000 kg
              </span>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-indigo-400" />
                <span>Vehicle Type *</span>
              </label>
              <select
                data-testid="select-vehicle-type"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                {vehicleOptions.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Compatibility:</span>
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${vehicleFeedback.color}`} data-testid="vehicle-compatibility-badge">
                  {vehicleFeedback.badge}
                </span>
              </div>
            </div>
          </div>

          {customError && (
            <div className="p-3 bg-red-900/40 border border-red-500/50 rounded-xl text-xs text-red-300">
              {customError}
            </div>
          )}

          {/* Analyze Button with Loading Overlay */}
          <div className="pt-4 border-t border-slate-800">
            {isAnalyzing ? (
              <div 
                data-testid="analysis-loading-state"
                className="bg-slate-900 border border-emerald-500/40 rounded-xl p-6 text-center space-y-3 glow-emerald"
              >
                <div className="flex justify-center">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin"></div>
                    <Zap className="absolute inset-0 m-auto w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div className="text-sm font-bold text-white font-['Outfit']">
                  AI Optimization Engine Executing...
                </div>
                <p className="text-xs text-emerald-400 font-mono animate-pulse">
                  {analyzingStep}
                </p>
              </div>
            ) : (
              <button
                type="submit"
                data-testid="btn-analyze-routes"
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base py-4 rounded-xl shadow-xl shadow-emerald-950/80 flex items-center justify-center space-x-2 transition duration-200 group"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition transform" />
                <span>ANALYZE ROUTES →</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Quick City Pair Suggestions */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Or Select a Popular North-Eastern Corridor:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { o: "Guwahati", d: "Shillong" },
            { o: "Imphal", d: "Aizawl" },
            { o: "Kohima", d: "Itanagar" },
            { o: "Gangtok", d: "Guwahati" },
            { o: "Siliguri", d: "Gangtok" },
            { o: "Delhi", d: "Guwahati" }
          ].map((pair, idx) => (
            <button
              key={idx}
              type="button"
              data-testid={`quick-pair-${pair.o.toLowerCase()}-${pair.d.toLowerCase()}`}
              onClick={() => {
                setOriginInput(pair.o);
                setDestInput(pair.d);
              }}
              className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-2.5 rounded-lg text-xs text-left text-slate-300 hover:text-white transition"
            >
              <div className="font-semibold text-white">{pair.o} → {pair.d}</div>
              <span className="text-[10px] text-slate-400">Click to load</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
