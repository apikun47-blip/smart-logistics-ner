import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLogistics } from '../../context/LogisticsContext';
import { ShieldCheck, AlertTriangle, Flame, Navigation2, CheckCircle2, Info } from 'lucide-react';

// Custom Map Bounds Auto-Fitter
const FitMapBounds = ({ originGeo, destGeo, routes }) => {
  const map = useMap();

  useEffect(() => {
    if (!originGeo || !destGeo) return;
    try {
      const bounds = L.latLngBounds([
        [originGeo.lat, originGeo.lng],
        [destGeo.lat, destGeo.lng]
      ]);
      
      // Include polyline points if present
      if (routes) {
        Object.values(routes).forEach(r => {
          if (r.polyline && r.polyline.length > 0) {
            r.polyline.forEach(pt => bounds.extend(pt));
          }
        });
      }
      
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12, animate: true });
    } catch (e) {
      console.warn("Could not fit map bounds:", e);
    }
  }, [originGeo, destGeo, routes, map]);

  return null;
};

// Create custom SVG markers
const createCustomIcon = (color, label, isPulse = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        ${isPulse ? `<div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background-color: ${color}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
        <div style="width: 26px; height: 26px; border-radius: 50%; background-color: ${color}; border: 2px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">
          ${label}
        </div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
};

const hazardIcon = L.divIcon({
  className: 'custom-hazard-marker',
  html: `
    <div style="width: 28px; height: 28px; border-radius: 6px; background-color: #EF4444; border: 2px solid #FFF; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.6);">
      ⚠️
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

export const LiveLeafletMap = ({ height = "520px" }) => {
  const { 
    analysisData, 
    selectedRouteId, 
    setSelectedRouteId, 
    incidents,
    setActiveTab
  } = useLogistics();

  const originGeo = analysisData?.origin || { name: "Guwahati", lat: 26.1445, lng: 91.7362 };
  const destGeo = analysisData?.destination || { name: "Shillong", lat: 25.5788, lng: 91.8933 };
  const routes = analysisData?.routes || {};
  const recommendedName = analysisData?.recommended_route || "Route B";

  const defaultCenter = [
    (originGeo.lat + destGeo.lat) / 2,
    (originGeo.lng + destGeo.lng) / 2
  ];

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-[#0A0F1D]" style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={9}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        {/* OpenStreetMap Standard Free Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <FitMapBounds originGeo={originGeo} destGeo={destGeo} routes={routes} />

        {/* Origin Marker */}
        <Marker
          position={[originGeo.lat, originGeo.lng]}
          icon={createCustomIcon('#3B82F6', 'A')}
        >
          <Popup>
            <div className="text-xs p-1" data-testid="popup-origin-info">
              <span className="font-bold text-blue-400 block uppercase text-[10px]">Logistics Origin Hub</span>
              <strong className="text-sm text-white">{originGeo.name}</strong>
              <p className="text-slate-400">{originGeo.state || 'North East Region'}</p>
              <div className="mt-1 font-mono text-[10px] text-slate-400">
                Coords: {originGeo.lat.toFixed(4)}, {originGeo.lng.toFixed(4)}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker
          position={[destGeo.lat, destGeo.lng]}
          icon={createCustomIcon('#10B981', 'B', true)}
        >
          <Popup>
            <div className="text-xs p-1" data-testid="popup-dest-info">
              <span className="font-bold text-emerald-400 block uppercase text-[10px]">Logistics Destination</span>
              <strong className="text-sm text-white">{destGeo.name}</strong>
              <p className="text-slate-400">{destGeo.state || 'North East Region'}</p>
              <div className="mt-1 font-mono text-[10px] text-slate-400">
                Coords: {destGeo.lat.toFixed(4)}, {destGeo.lng.toFixed(4)}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Route Polylines */}
        {Object.entries(routes).map(([name, r]) => {
          const isRecommended = name === recommendedName;
          const isSelected = selectedRouteId === r.id;
          
          let routeColor = '#3B82F6';
          if (isRecommended) routeColor = '#10B981';
          else if (r.incident_risk === 'CRITICAL') routeColor = '#EF4444';
          else if (r.incident_risk === 'HIGH') routeColor = '#F97316';
          else if (name === 'Route A') routeColor = '#F59E0B';

          const weight = isRecommended ? 6 : (isSelected ? 5 : 3.5);
          const opacity = isRecommended ? 0.95 : (isSelected ? 0.85 : 0.6);
          const dashArray = isRecommended ? null : (r.incident_risk === 'CRITICAL' ? '8, 8' : '4, 4');

          return (
            <Polyline
              key={r.id}
              positions={r.polyline}
              pathOptions={{
                color: routeColor,
                weight,
                opacity,
                dashArray
              }}
              eventHandlers={{
                click: () => setSelectedRouteId(r.id)
              }}
            >
              <Popup>
                <div className="p-1 min-w-[200px]" data-testid={`map-route-popup-${r.id}`}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-white">{r.name}</span>
                    {isRecommended && (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] px-1.5 py-0.2 rounded font-bold">
                        AI CHOICE
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Distance:</span>
                      <span className="font-mono">{r.distance_km} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ETA:</span>
                      <span className="font-mono font-semibold">{r.eta_formatted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Cost:</span>
                      <span className="font-mono">₹{r.estimated_cost_inr.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Safety Index:</span>
                      <span className="font-bold text-emerald-400">{r.safety_score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Accessibility:</span>
                      <span className="font-bold text-cyan-400">{r.accessibility_score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">AI Total Score:</span>
                      <span className="font-extrabold text-amber-300">{r.ai_score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Risk Assessment:</span>
                      <span className={`font-bold ${r.incident_risk === 'LOW' ? 'text-emerald-400' : (r.incident_risk === 'CRITICAL' ? 'text-red-400' : 'text-amber-400')}`}>
                        {r.incident_risk}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className="mt-2.5 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-1 rounded transition text-center"
                  >
                    View Deep Analytics →
                  </button>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* Hazard & Incident Markers */}
        {incidents.slice(0, 8).map((inc) => {
          if (!inc.lat || !inc.lng) return null;
          return (
            <Marker
              key={inc.id}
              position={[inc.lat, inc.lng]}
              icon={hazardIcon}
            >
              <Popup>
                <div className="text-xs p-1 max-w-[220px]" data-testid={`map-incident-${inc.id}`}>
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded">
                      {inc.severity.toUpperCase()}
                    </span>
                    <span className="font-semibold text-white">{inc.type}</span>
                  </div>
                  <strong className="text-slate-200 block">{inc.location}</strong>
                  <p className="text-slate-400 mt-1 text-[11px]">{inc.description}</p>
                  <div className="mt-1 text-[10px] text-amber-400 font-mono">
                    Affects: {inc.affected_route} • {inc.time}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend & Route Selector */}
      <div 
        data-testid="map-legend-overlay"
        className="absolute bottom-4 left-4 z-20 bg-[#0D1527]/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-3 text-xs text-slate-300 shadow-xl max-w-xs"
      >
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Interactive Map Legend
        </span>
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-1 bg-emerald-500 rounded-full inline-block"></span>
            <span className="text-white font-medium">Recommended Route ({recommendedName})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-1 bg-amber-500 rounded-full inline-block"></span>
            <span className="text-slate-300">Fastest Direct Route</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-1 bg-blue-500 rounded-full inline-block"></span>
            <span className="text-slate-300">Balanced Alternative</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-red-400 font-bold">⚠️</span>
            <span className="text-slate-300">Active Incident / Landslide Hazard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
