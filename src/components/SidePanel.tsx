import { Navigation, Trash2, RotateCcw, ChevronRight } from 'lucide-react';
import { WAYPOINTS, type Waypoint } from '../data/marsData';
import type { RouteResult } from '../utils/routeCalculator';
import { formatDuration } from '../utils/routeCalculator';

interface SidePanelProps {
  selectedWaypoints: Waypoint[];
  routeResult: RouteResult | null;
  activeWaypoint: Waypoint | null;
  onWaypointClick: (wp: Waypoint) => void;
  onAddWaypoint: (wp: Waypoint) => void;
  onRemoveWaypoint: (id: string) => void;
  onClearRoute: () => void;
  activeLayer: string;
  onLayerChange: (layer: string) => void;
}

function getTypeColor(type: Waypoint['type']): string {
  switch (type) {
    case 'habitat': return '#00e676';
    case 'science': return '#00e5ff';
    case 'geological': return '#ffab00';
    case 'danger': return '#ff1744';
    case 'resource': return '#7c4dff';
    default: return '#e0e0e4';
  }
}

function getTypeLabel(type: Waypoint['type']): string {
  switch (type) {
    case 'habitat': return 'HAB';
    case 'science': return 'SCI';
    case 'geological': return 'GEO';
    case 'danger': return 'HAZ';
    case 'resource': return 'RES';
    default: return 'WPT';
  }
}

function getHazardColor(level: string): string {
  switch (level) {
    case 'Safe': return '#00e676';
    case 'Caution': return '#ffab00';
    case 'Danger': return '#ff1744';
    default: return '#e0e0e4';
  }
}

export default function SidePanel({
  selectedWaypoints,
  routeResult,
  activeWaypoint,
  onWaypointClick,
  onAddWaypoint,
  onRemoveWaypoint,
  onClearRoute,
  activeLayer,
  onLayerChange,
}: SidePanelProps) {
  return (
    <div className="w-[340px] h-full flex flex-col border-r border-[#1e1e22] bg-[#0e0e10]/95 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#1e1e22]">
        <div className="flex items-center gap-2 mb-1">
          <Navigation size={14} className="text-[#00e5ff]" />
          <h2
            className="text-[11px] tracking-[2px] uppercase text-[#00e5ff]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Mission Planner
          </h2>
        </div>
        <p className="text-[10px] text-[#6b6b74]">
          Click waypoints on the map to build your EVA route
        </p>
      </div>

      {/* Layer Toggle */}
      <div className="px-4 py-3 border-b border-[#1e1e22]">
        <p
          className="text-[9px] tracking-[1.5px] uppercase text-[#6b6b74] mb-2"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Map Layer
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onLayerChange('mola')}
            className={`px-2 py-1.5 rounded text-[9px] tracking-wider border transition-all text-center ${
              activeLayer === 'mola'
                ? 'border-[#00e5ff] bg-[#00e5ff]/10 text-[#00e5ff]'
                : 'border-[#1e1e22] text-[#6b6b74] hover:border-[#2a2a30] hover:text-[#e0e0e4]'
            }`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            MOLA TOPO
          </button>
          <button
            onClick={() => onLayerChange('viking')}
            className={`px-2 py-1.5 rounded text-[9px] tracking-wider border transition-all text-center ${
              activeLayer === 'viking'
                ? 'border-[#00e5ff] bg-[#00e5ff]/10 text-[#00e5ff]'
                : 'border-[#1e1e22] text-[#6b6b74] hover:border-[#2a2a30] hover:text-[#e0e0e4]'
            }`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            VIKING OPT
          </button>
          <button
            onClick={() => onLayerChange('surface')}
            className={`px-2 py-1.5 rounded text-[9px] tracking-wider border transition-all text-center ${
              activeLayer === 'surface'
                ? 'border-[#00e5ff] bg-[#00e5ff]/10 text-[#00e5ff]'
                : 'border-[#1e1e22] text-[#6b6b74] hover:border-[#2a2a30] hover:text-[#e0e0e4]'
            }`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            SURFACE
          </button>
        </div>
      </div>

      {/* Route Summary */}
      {routeResult && (
        <div className="px-4 py-3 border-b border-[#1e1e22]">
          <div className="flex items-center justify-between mb-2">
            <p
              className="text-[9px] tracking-[1.5px] uppercase text-[#6b6b74]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Route Summary
            </p>
            <button
              onClick={onClearRoute}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] text-[#ff1744] border border-[#ff1744]/30 hover:bg-[#ff1744]/10 transition-all"
            >
              <RotateCcw size={10} />
              RESET
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <MetricBox
              label="DISTANCE"
              value={`${routeResult.totalDistanceKm.toFixed(1)} km`}
              color="#00e5ff"
            />
            <MetricBox
              label="WALK TIME"
              value={formatDuration(routeResult.totalWalkingTimeMinutes)}
              color="#00e5ff"
            />
            <MetricBox
              label="O₂ REMAINING"
              value={`${routeResult.remainingOxygenHours.toFixed(1)} hrs`}
              color={routeResult.remainingOxygenHours < 2 ? '#ff1744' : '#00e676'}
            />
            <MetricBox
              label="BATTERY"
              value={`${routeResult.remainingBatteryPercent.toFixed(0)}%`}
              color={routeResult.remainingBatteryPercent < 20 ? '#ff1744' : '#00e676'}
            />
          </div>

          {/* Hazard Badge */}
          <div className="mt-2 flex items-center gap-2">
            <span
              className="text-[9px] tracking-wider"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: '#6b6b74' }}
            >
              HAZARD:
            </span>
            <span
              className="px-2 py-0.5 rounded text-[9px] tracking-wider font-medium"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: getHazardColor(routeResult.overallHazard),
                border: `1px solid ${getHazardColor(routeResult.overallHazard)}30`,
                background: `${getHazardColor(routeResult.overallHazard)}10`,
              }}
            >
              {routeResult.overallHazard.toUpperCase()}
            </span>
            {!routeResult.feasible && (
              <span className="px-2 py-0.5 rounded text-[9px] tracking-wider font-medium text-[#ff1744] border border-[#ff1744]/30 bg-[#ff1744]/10 animate-pulse">
                ABORT RECOMMENDED
              </span>
            )}
          </div>

          {/* Warnings */}
          {routeResult.warnings.length > 0 && (
            <div className="mt-2 space-y-1">
              {routeResult.warnings.map((w, i) => (
                <p key={i} className="text-[9px] text-[#ffab00] leading-tight">
                  ⚠ {w}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Route Waypoints */}
      {selectedWaypoints.length > 0 && (
        <div className="px-4 py-3 border-b border-[#1e1e22]">
          <p
            className="text-[9px] tracking-[1.5px] uppercase text-[#6b6b74] mb-2"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Route ({selectedWaypoints.length} waypoints)
          </p>
          <div className="space-y-1">
            {selectedWaypoints.map((wp, idx) => (
              <div key={wp.id} className="flex items-center gap-2">
                <span
                  className="text-[9px] tabular-nums w-4 text-center"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: '#6b6b74' }}
                >
                  {idx + 1}
                </span>
                {idx > 0 && <ChevronRight size={8} className="text-[#6b6b74] -mx-1" />}
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: getTypeColor(wp.type),
                    border: `1px solid ${getTypeColor(wp.type)}30`,
                    background: `${getTypeColor(wp.type)}08`,
                  }}
                >
                  {wp.codename}
                </span>
                {idx > 0 && (
                  <button
                    onClick={() => onRemoveWaypoint(wp.id)}
                    className="ml-auto text-[#6b6b74] hover:text-[#ff1744] transition-colors"
                  >
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Waypoints List */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <p
          className="text-[9px] tracking-[1.5px] uppercase text-[#6b6b74] mb-2"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          All Targets
        </p>
        <div className="space-y-1.5">
          {WAYPOINTS.map((wp) => {
            const isActive = activeWaypoint?.id === wp.id;
            const isInRoute = selectedWaypoints.some((s) => s.id === wp.id);
            return (
              <button
                key={wp.id}
                onClick={() => {
                  onWaypointClick(wp);
                  onAddWaypoint(wp);
                }}
                className={`w-full text-left px-3 py-2 rounded border transition-all ${
                  isActive
                    ? 'border-[#00e5ff]/40 bg-[#00e5ff]/8'
                    : 'border-[#1e1e22] hover:border-[#2a2a30] hover:bg-[#141416]'
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-[8px] px-1 py-px rounded tracking-wider"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: getTypeColor(wp.type),
                      border: `1px solid ${getTypeColor(wp.type)}40`,
                    }}
                  >
                    {getTypeLabel(wp.type)}
                  </span>
                  <span className="text-[11px] text-[#e0e0e4] font-medium truncate">
                    {wp.name}
                  </span>
                  {isInRoute && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00e676]" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-[9px] text-[#6b6b74] tabular-nums"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {wp.lat.toFixed(3)}°N {wp.lng.toFixed(3)}°E
                  </span>
                  <span
                    className="text-[9px] tabular-nums"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: getHazardColor(wp.hazardLevel),
                    }}
                  >
                    {wp.slope.toFixed(1)}°
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MetricBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="px-2.5 py-2 rounded border border-[#1e1e22] bg-[#0a0a0b]">
      <p
        className="text-[8px] tracking-[1.5px] uppercase text-[#6b6b74] mb-0.5"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {label}
      </p>
      <p
        className="text-[13px] font-medium tabular-nums"
        style={{ fontFamily: "'JetBrains Mono', monospace", color }}
      >
        {value}
      </p>
    </div>
  );
}
