import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { AlertOctagon, X, Send, ShieldAlert } from 'lucide-react';

export const ReportIncidentModal = ({ isOpen, onClose }) => {
  const { reportIncident, origin, destination } = useLogistics();

  const [incidentType, setIncidentType] = useState('Landslide');
  const [locationName, setLocationName] = useState('Sonapur / Umiam Gorge Sector');
  const [stateName, setStateName] = useState('Meghalaya');
  const [severity, setSeverity] = useState('Critical');
  const [affectedRoute, setAffectedRoute] = useState('Route B');
  const [description, setDescription] = useState('Massive rockfall and slope subsidence blocking traffic completely.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await reportIncident({
        type: incidentType,
        location: locationName,
        state: stateName,
        severity,
        affected_route: affectedRoute,
        description
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      data-testid="report-incident-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="bg-[#0D1527] border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950/80 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-red-600/30 border border-red-500/50 rounded-lg text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Report Logistics Incident / Hazard
              </h3>
              <p className="text-xs text-slate-400">
                Triggers instantaneous AI risk recalculation and dynamic reroute
              </p>
            </div>
          </div>
          <button
            data-testid="btn-close-incident-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Incident Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Incident Hazard Type *
              </label>
              <select
                data-testid="select-incident-type"
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="Landslide">Landslide / Mudslide</option>
                <option value="Flood">Flash Flood / Waterlogging</option>
                <option value="Road Blockage">Road Blockage / Tree Fall</option>
                <option value="Accident">Accident / Vehicle Breakdown</option>
                <option value="Road Damage">Severe Potholes / Road Subsidence</option>
                <option value="Heavy Traffic">Heavy Freight Bottleneck</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Incident Severity *
              </label>
              <select
                data-testid="select-incident-severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 font-semibold"
              >
                <option value="Low" className="text-slate-300">Low (Minor Delay)</option>
                <option value="Medium" className="text-amber-400">Medium (Moderate Slowdown)</option>
                <option value="High" className="text-orange-400">High (Severe Disruption)</option>
                <option value="Critical" className="text-red-400 font-bold">Critical (Corridor Blocked - REROUTE)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location / Landmark *
              </label>
              <input
                data-testid="input-incident-location"
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required
                placeholder="e.g. Sonapur Tunnel, Meghalaya"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                State *
              </label>
              <select
                data-testid="select-incident-state"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="Meghalaya">Meghalaya</option>
                <option value="Assam">Assam</option>
                <option value="Manipur">Manipur</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Tripura">Tripura</option>
                <option value="Sikkim">Sikkim</option>
              </select>
            </div>
          </div>

          {/* Affected Route */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Affected Route *
            </label>
            <select
              data-testid="select-affected-route"
              value={affectedRoute}
              onChange={(e) => setAffectedRoute(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
            >
              <option value="Route B">Route B (Safest Ridge Bypass - Current Recommended)</option>
              <option value="Route A">Route A (Fastest Direct Highway)</option>
              <option value="Route C">Route C (Balanced Foothill Arterial)</option>
              <option value="All">All Corridors (Regional Hazard)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Tip: Selecting <span className="text-red-400 font-bold">Route B</span> with <span className="text-red-400 font-bold">Critical</span> demonstrates the instant AI Rerouting WOW moment!
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Incident Details / Terrain Observations
            </label>
            <textarea
              data-testid="input-incident-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe road blockage, weather impact, or single-lane constraints..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              data-testid="btn-cancel-incident"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="btn-submit-incident"
              className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2 rounded-lg flex items-center space-x-2 shadow-lg shadow-red-900/40 transition"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Recalculating AI Routes...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Incident & Trigger AI Reroute</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
