import { X, MapPin, Mountain, Radiation, FlaskConical, Footprints } from 'lucide-react';
import { type Waypoint, MISSION_PARAMS } from '../data/marsData';

interface WaypointDetailProps {
  waypoint: Waypoint;
  onClose: () => void;
}

function getHazardColor(level: string): string {
  switch (level) {
    case 'Safe': return '#00e676';
    case 'Caution': return '#ffab00';
    case 'Danger': return '#ff1744';
    default: return '#e0e0e4';
  }
}

function getScienceColor(level: string): string {
  switch (level) {
    case 'Critical': return '#ff1744';
    case 'High': return '#ffab00';
    case 'Medium': return '#00e5ff';
    case 'Low': return '#6b6b74';
    default: return '#e0e0e4';
  }
}

export default function WaypointDetail({ waypoint, onClose }: WaypointDetailProps) {
  const wp = waypoint;
  const slopeAccessible = wp.slope < MISSION_PARAMS.maxEvaSlopeWalking;

  return (
    <div className="absolute bottom-4 right-4 w-[380px] max-h-[420px] rounded-lg border border-[#1e1e22] bg-[#0e0e10]/95 backdrop-blur-md shadow-2xl overflow-hidden z-[1000]">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-[#1e1e22] flex items-start justify-between">
        <div>
          <p
            className="text-[9px] tracking-[1.5px] uppercase mb-1"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color:
                wp.type === 'habitat'
                  ? '#00e676'
                  : wp.type === 'danger'
                  ? '#ff1744'
                  : '#00e5ff',
            }}
          >
            {wp.codename}
          </p>
          <h3 className="text-sm font-semibold text-[#e0e0e4]">{wp.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-[#1e1e22] text-[#6b6b74] hover:text-[#e0e0e4] transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-2.5 border-b border-[#1e1e22] grid grid-cols-4 gap-2">
        <QuickStat
          icon={<MapPin size={11} />}
          label="ELEV"
          value={`${wp.elevation}m`}
          color="#00e5ff"
        />
        <QuickStat
          icon={<Mountain size={11} />}
          label="SLOPE"
          value={`${wp.slope}°`}
          color={getHazardColor(wp.hazardLevel)}
        />
        <QuickStat
          icon={<Radiation size={11} />}
          label="HAZARD"
          value={wp.hazardLevel}
          color={getHazardColor(wp.hazardLevel)}
        />
        <QuickStat
          icon={<FlaskConical size={11} />}
          label="SCIENCE"
          value={wp.scienceValue}
          color={getScienceColor(wp.scienceValue)}
        />
      </div>

      {/* Coordinates */}
      <div className="px-4 py-2 border-b border-[#1e1e22]">
        <p
          className="text-[9px] text-[#6b6b74] tabular-nums"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {wp.lat.toFixed(4)}°N, {wp.lng.toFixed(4)}°E (Mars Areographic)
        </p>
      </div>

      {/* Description */}
      <div className="px-4 py-3 overflow-y-auto max-h-[160px]">
        <p className="text-[11px] text-[#c0c0c6] leading-relaxed mb-3">
          {wp.description}
        </p>

        {/* Mineralogy Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {wp.mineralogy.map((m) => (
            <span
              key={m}
              className="px-2 py-0.5 rounded text-[9px] tracking-wider border border-[#1e1e22] text-[#6b6b74] bg-[#141416]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {m}
            </span>
          ))}
        </div>

        {/* EVA Access Badge */}
        <div className="flex items-center gap-2 mt-2">
          <Footprints size={12} className={slopeAccessible ? 'text-[#00e676]' : 'text-[#ff1744]'} />
          <span
            className="text-[9px] tracking-wider"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: slopeAccessible ? '#00e676' : '#ff1744',
            }}
          >
            {slopeAccessible
              ? 'WALKING EVA ACCESSIBLE'
              : 'ROVER-ONLY ACCESS (SLOPE EXCEEDS LIMIT)'}
          </span>
        </div>

        {/* Operational Notes */}
        {wp.notes && (
          <div className="mt-3 px-2.5 py-2 rounded border border-[#1e1e22] bg-[#0a0a0b]">
            <p
              className="text-[8px] tracking-[1.5px] uppercase text-[#6b6b74] mb-1"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              OPS NOTES
            </p>
            <p className="text-[10px] text-[#9e9ea6] leading-relaxed">{wp.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickStat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-1" style={{ color }}>
        {icon}
      </div>
      <p
        className="text-[7px] tracking-[1px] uppercase text-[#6b6b74]"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {label}
      </p>
      <p
        className="text-[10px] font-medium tabular-nums"
        style={{ fontFamily: "'JetBrains Mono', monospace", color }}
      >
        {value}
      </p>
    </div>
  );
}
