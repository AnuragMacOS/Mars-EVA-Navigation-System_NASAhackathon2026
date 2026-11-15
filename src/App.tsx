import { useState } from 'react';
import MarsMap from './components/MarsMap';
import TopBar from './components/TopBar';
import SidePanel from './components/SidePanel';
import SpaceWeatherBar from './components/SpaceWeatherBar';
import WaypointDetail from './components/WaypointDetail';
import ElevationProfile from './components/ElevationProfile';
import { useRouteState } from './hooks/useRouteState';
import { useSpaceWeather } from './hooks/useSpaceWeather';
import { MISSION_PARAMS } from './data/marsData';

export default function App() {
  const {
    selectedWaypoints,
    routeResult,
    activeWaypoint,
    addWaypoint,
    removeWaypoint,
    clearRoute,
    selectWaypoint,
  } = useRouteState();

  const {
    events: spaceWeatherEvents,
    isLive: weatherIsLive,
    loading: weatherLoading,
    error: weatherError,
    lastFetched: weatherLastFetched,
    refetch: weatherRefetch,
  } = useSpaceWeather();

  const [activeLayer, setActiveLayer] = useState('mola');
  const currentSol = 847;

  // Compute live radiation from space weather events
  const maxRadMultiplier = spaceWeatherEvents.length > 0
    ? Math.max(...spaceWeatherEvents.map((e) => e.radiationIncrease))
    : 1.0;
  const currentRadiation = MISSION_PARAMS.radiationBaseline * maxRadMultiplier;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0a0a0b] overflow-hidden">
      {/* Top Telemetry Bar */}
      <TopBar currentSol={currentSol} currentRadiation={currentRadiation} isLive={weatherIsLive} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side Panel */}
        <SidePanel
          selectedWaypoints={selectedWaypoints}
          routeResult={routeResult}
          activeWaypoint={activeWaypoint}
          onWaypointClick={selectWaypoint}
          onAddWaypoint={addWaypoint}
          onRemoveWaypoint={removeWaypoint}
          onClearRoute={clearRoute}
          activeLayer={activeLayer}
          onLayerChange={setActiveLayer}
        />

        {/* Map + Elevation Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Map */}
          <div className="flex-1 relative w-full h-full min-h-0">
            <MarsMap
              selectedWaypoints={selectedWaypoints}
              routeResult={routeResult}
              activeWaypoint={activeWaypoint}
              onWaypointClick={selectWaypoint}
              onAddWaypoint={addWaypoint}
              activeLayer={activeLayer}
            />

            {/* Waypoint Detail Card */}
            {activeWaypoint && (
              <WaypointDetail
                waypoint={activeWaypoint}
                onClose={() => selectWaypoint(null)}
              />
            )}

            {/* Map Overlay: Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[500]">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <line x1="20" y1="0" x2="20" y2="14" stroke="#00e5ff" strokeWidth="0.5" opacity="0.3" />
                <line x1="20" y1="26" x2="20" y2="40" stroke="#00e5ff" strokeWidth="0.5" opacity="0.3" />
                <line x1="0" y1="20" x2="14" y2="20" stroke="#00e5ff" strokeWidth="0.5" opacity="0.3" />
                <line x1="26" y1="20" x2="40" y2="20" stroke="#00e5ff" strokeWidth="0.5" opacity="0.3" />
                <circle cx="20" cy="20" r="3" stroke="#00e5ff" strokeWidth="0.5" fill="none" opacity="0.3" />
              </svg>
            </div>

            {/* Map Legend */}
            <div className="absolute top-3 right-3 z-[500] px-3 py-2.5 rounded-lg border border-[#1e1e22] bg-[#0e0e10]/90 backdrop-blur-sm">
              <p
                className="text-[8px] tracking-[1.5px] uppercase text-[#6b6b74] mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Legend
              </p>
              <div className="space-y-1.5">
                <LegendItem color="#00e676" label="Habitat / Safe Zone" />
                <LegendItem color="#00e5ff" label="Science Target" />
                <LegendItem color="#ffab00" label="Geological Interest" />
                <LegendItem color="#7c4dff" label="Resource Prospect" />
                <LegendItem color="#ff1744" label="Hazard / Danger Zone" />
              </div>
            </div>

            {/* NASA Attribution */}
            <div className="absolute bottom-3 left-3 z-[500] px-2 py-1 rounded border border-[#1e1e22] bg-[#0e0e10]/80">
              <p
                className="text-[8px] text-[#6b6b74]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Data: NASA/JPL-Caltech Mars Trek, MOLA, HiRISE | DONKI Space Weather API
              </p>
            </div>
          </div>

          {/* Elevation Profile Chart */}
          <ElevationProfile
            waypoints={selectedWaypoints}
            onWaypointHover={selectWaypoint}
          />
        </div>
      </div>

      {/* Bottom Space Weather Bar — now live */}
      <SpaceWeatherBar
        events={spaceWeatherEvents}
        isLive={weatherIsLive}
        loading={weatherLoading}
        error={weatherError}
        lastFetched={weatherLastFetched}
        onRefresh={weatherRefetch}
      />
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span
        className="text-[9px] text-[#9e9ea6]"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {label}
      </span>
    </div>
  );
}
