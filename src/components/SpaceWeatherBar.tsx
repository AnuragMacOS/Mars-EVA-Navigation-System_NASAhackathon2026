import {
  AlertTriangle,
  ShieldAlert,
  Sun,
  Radio,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { type SolarEvent } from '../data/marsData';

interface SpaceWeatherBarProps {
  events: SolarEvent[];
  isLive: boolean;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
  onRefresh: () => void;
}

function getSeverityColor(severity: SolarEvent['severity']): string {
  switch (severity) {
    case 'Low':
      return '#00e676';
    case 'Moderate':
      return '#ffab00';
    case 'High':
      return '#ff1744';
    case 'Extreme':
      return '#d500f9';
    default:
      return '#e0e0e4';
  }
}

function getSeverityIcon(severity: SolarEvent['severity']) {
  switch (severity) {
    case 'Low':
      return <Sun size={12} />;
    case 'Moderate':
      return <Radio size={12} />;
    case 'High':
      return <AlertTriangle size={12} />;
    case 'Extreme':
      return <ShieldAlert size={12} />;
    default:
      return <Sun size={12} />;
  }
}

function formatEventTime(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hours}:${mins}`;
  } catch {
    return '';
  }
}

export default function SpaceWeatherBar({
  events,
  isLive,
  loading,
  error,
  lastFetched,
  onRefresh,
}: SpaceWeatherBarProps) {
  const hasAlert = events.some(
    (e) => e.severity === 'High' || e.severity === 'Extreme'
  );

  return (
    <div
      className={`flex items-center gap-3 px-4 py-1.5 border-t border-[#1e1e22] bg-[#0e0e10]/90 ${
        hasAlert ? 'hud-glow-red' : ''
      }`}
    >
      {/* Live Status Indicator */}
      <div className="flex items-center gap-2 shrink-0">
        <div
          className={`w-1.5 h-1.5 rounded-full ${hasAlert ? 'animate-pulse' : ''}`}
          style={{
            background: hasAlert
              ? '#ff1744'
              : isLive
              ? '#00e676'
              : '#ffab00',
          }}
        />
        <span
          className="text-[9px] tracking-[1.5px] uppercase"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: hasAlert
              ? '#ff1744'
              : isLive
              ? '#00e676'
              : '#ffab00',
          }}
        >
          SPACE WEATHER
        </span>
        {isLive ? (
          <Wifi size={10} className="text-[#00e676]" />
        ) : (
          <WifiOff size={10} className="text-[#ffab00]" />
        )}
        <span
          className="text-[8px] tracking-wider px-1.5 py-px rounded border"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: isLive ? '#00e676' : '#ffab00',
            borderColor: isLive ? '#00e67630' : '#ffab0030',
            background: isLive ? '#00e67608' : '#ffab0008',
          }}
        >
          {isLive ? 'LIVE' : 'CACHED'}
        </span>
      </div>

      <div className="h-3 w-px bg-[#1e1e22] shrink-0" />

      {/* Events Scroll */}
      <div className="flex items-center gap-4 flex-1 overflow-x-auto">
        {loading ? (
          <span
            className="text-[9px] text-[#6b6b74] animate-pulse"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Fetching NASA DONKI data...
          </span>
        ) : events.length === 0 ? (
          <span
            className="text-[9px] text-[#00e676]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            No significant solar events in the last 30 days
          </span>
        ) : (
          events.slice(0, 5).map((evt) => (
            <div
              key={evt.id}
              className="flex items-center gap-1.5 shrink-0"
              title={`${evt.description}\n${formatEventTime(evt.beginTime)}`}
            >
              <span style={{ color: getSeverityColor(evt.severity) }}>
                {getSeverityIcon(evt.severity)}
              </span>
              <span
                className="text-[9px] tabular-nums"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: getSeverityColor(evt.severity),
                }}
              >
                {evt.classType} {evt.type}
              </span>
              <span
                className="text-[8px] px-1.5 py-px rounded tracking-wider"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: getSeverityColor(evt.severity),
                  border: `1px solid ${getSeverityColor(evt.severity)}30`,
                  background: `${getSeverityColor(evt.severity)}10`,
                }}
              >
                {evt.severity.toUpperCase()}
              </span>
              {isLive && (
                <span
                  className="text-[7px] text-[#6b6b74] tabular-nums"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {formatEventTime(evt.beginTime)}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Shelter Advisory */}
      {hasAlert && (
        <div className="flex items-center gap-1.5 shrink-0 animate-pulse">
          <ShieldAlert size={12} className="text-[#ff1744]" />
          <span
            className="text-[9px] tracking-wider text-[#ff1744] font-medium"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            SHELTER ADVISORY
          </span>
        </div>
      )}

      {/* Error indicator */}
      {error && (
        <span
          className="text-[8px] text-[#ffab00] shrink-0"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {error}
        </span>
      )}

      <div className="h-3 w-px bg-[#1e1e22] shrink-0" />

      {/* Refresh + Source */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1 rounded hover:bg-[#1e1e22] text-[#6b6b74] hover:text-[#00e5ff] transition-colors disabled:opacity-40"
          title="Refresh space weather data"
        >
          <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
        </button>
        <span
          className="text-[8px] text-[#6b6b74] tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          SRC: NASA DONKI
        </span>
        {lastFetched && (
          <span
            className="text-[7px] text-[#4a4a52] tabular-nums"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {lastFetched.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
}
