import { useMemo } from 'react';
import { Mountain, TrendingDown, AlertTriangle } from 'lucide-react';
import type { Waypoint } from '../data/marsData';
import { MISSION_PARAMS } from '../data/marsData';

interface ElevationProfileProps {
  waypoints: Waypoint[];
  onWaypointHover: (wp: Waypoint | null) => void;
}

// Compute cumulative distances between waypoints (scaled for Mars)
function cumulativeDistances(wps: Waypoint[]): number[] {
  const distances = [0];
  for (let i = 1; i < wps.length; i++) {
    const dlat = wps[i].lat - wps[i - 1].lat;
    const dlng = wps[i].lng - wps[i - 1].lng;
    // Approximate Mars surface distance using Haversine-like flat approx
    const latDist = dlat * 59.15; // ~59.15 km per degree on Mars
    const lngDist = dlng * 59.15 * Math.cos((wps[i].lat * Math.PI) / 180);
    const segDist = Math.sqrt(latDist * latDist + lngDist * lngDist);
    distances.push(distances[i - 1] + segDist);
  }
  return distances;
}

export default function ElevationProfile({
  waypoints,
  onWaypointHover,
}: ElevationProfileProps) {
  const profileData = useMemo(() => {
    if (waypoints.length < 2) return null;

    const distances = cumulativeDistances(waypoints);
    const elevations = waypoints.map((wp) => wp.elevation);
    const slopes = waypoints.map((wp) => wp.slope);
    const totalDistance = distances[distances.length - 1];
    const minElev = Math.min(...elevations) - 30;
    const maxElev = Math.max(...elevations) + 30;
    const elevRange = maxElev - minElev;

    return { distances, elevations, slopes, totalDistance, minElev, maxElev, elevRange };
  }, [waypoints]);

  if (!profileData || waypoints.length < 2) {
    return (
      <div className="px-4 py-3 border-t border-[#1e1e22] bg-[#0e0e10]/90">
        <div className="flex items-center gap-2 mb-1">
          <Mountain size={12} className="text-[#6b6b74]" />
          <span
            className="text-[9px] tracking-[1.5px] uppercase text-[#6b6b74]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Elevation Profile
          </span>
        </div>
        <p className="text-[10px] text-[#4a4a52]">
          Add at least 2 waypoints to see the elevation cross-section
        </p>
      </div>
    );
  }

  const { distances, elevations, slopes, totalDistance, minElev, elevRange } =
    profileData;

  // SVG dimensions
  const svgWidth = 720;
  const svgHeight = 120;
  const padLeft = 50;
  const padRight = 20;
  const padTop = 12;
  const padBottom = 24;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  // Map data to SVG coordinates
  const toX = (dist: number) => padLeft + (dist / totalDistance) * plotW;
  const toY = (elev: number) => padTop + plotH - ((elev - minElev) / elevRange) * plotH;

  // Build the filled area path
  const linePoints = distances.map((d, i) => `${toX(d)},${toY(elevations[i])}`).join(' ');
  const areaPath = `M ${toX(0)},${toY(elevations[0])} L ${linePoints} L ${toX(totalDistance)},${padTop + plotH} L ${toX(0)},${padTop + plotH} Z`;

  // Elevation tick marks
  const elevTicks = 4;
  const tickStep = elevRange / elevTicks;

  // Slope hazard zones
  const getSegmentColor = (slope: number): string => {
    if (slope >= MISSION_PARAMS.maxEvaSlopeWalking) return '#ff174440';
    if (slope >= MISSION_PARAMS.cautionSlopeThreshold) return '#ffab0030';
    return 'transparent';
  };

  // Elevation change
  const elevDelta = elevations[elevations.length - 1] - elevations[0];
  const maxSlope = Math.max(...slopes);

  return (
    <div className="border-t border-[#1e1e22] bg-[#0e0e10]/90">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-2.5 pb-1">
        <div className="flex items-center gap-2">
          <Mountain size={12} className="text-[#00e5ff]" />
          <span
            className="text-[9px] tracking-[1.5px] uppercase text-[#00e5ff]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Elevation Profile
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <TrendingDown size={10} className="text-[#6b6b74]" />
            <span
              className="text-[9px] tabular-nums"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: elevDelta < 0 ? '#00e5ff' : '#ffab00',
              }}
            >
              {elevDelta > 0 ? '+' : ''}
              {elevDelta.toFixed(0)}m net
            </span>
          </div>
          {maxSlope >= MISSION_PARAMS.cautionSlopeThreshold && (
            <div className="flex items-center gap-1">
              <AlertTriangle
                size={10}
                className={
                  maxSlope >= MISSION_PARAMS.maxEvaSlopeWalking
                    ? 'text-[#ff1744]'
                    : 'text-[#ffab00]'
                }
              />
              <span
                className="text-[9px] tabular-nums"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color:
                    maxSlope >= MISSION_PARAMS.maxEvaSlopeWalking
                      ? '#ff1744'
                      : '#ffab00',
                }}
              >
                Max {maxSlope.toFixed(1)}°
              </span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <ChartLegendDot color="#00e676" label="Safe" />
            <ChartLegendDot color="#ffab00" label="Caution" />
            <ChartLegendDot color="#ff1744" label="Danger" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pb-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full"
          style={{ maxHeight: '120px' }}
        >
          {/* Grid lines */}
          {Array.from({ length: elevTicks + 1 }).map((_, i) => {
            const elev = minElev + tickStep * i;
            const y = toY(elev);
            return (
              <g key={`grid-${i}`}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke="#1e1e22"
                  strokeWidth="0.5"
                />
                <text
                  x={padLeft - 4}
                  y={y + 3}
                  textAnchor="end"
                  fill="#4a4a52"
                  fontSize="8"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {elev.toFixed(0)}m
                </text>
              </g>
            );
          })}

          {/* Slope hazard background segments */}
          {waypoints.map((wp, i) => {
            if (i === 0) return null;
            const bgColor = getSegmentColor(Math.max(wp.slope, waypoints[i - 1].slope));
            if (bgColor === 'transparent') return null;
            return (
              <rect
                key={`hazard-${i}`}
                x={toX(distances[i - 1])}
                y={padTop}
                width={toX(distances[i]) - toX(distances[i - 1])}
                height={plotH}
                fill={bgColor}
              />
            );
          })}

          {/* Filled area under elevation line */}
          <path d={areaPath} fill="url(#elevGrad)" opacity="0.3" />

          {/* Elevation gradient definition */}
          <defs>
            <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Elevation line */}
          <polyline
            points={linePoints}
            fill="none"
            stroke="#00e5ff"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Waypoint dots and labels */}
          {waypoints.map((wp, i) => {
            const cx = toX(distances[i]);
            const cy = toY(elevations[i]);
            const dotColor =
              wp.type === 'habitat'
                ? '#00e676'
                : wp.type === 'danger'
                ? '#ff1744'
                : wp.slope >= MISSION_PARAMS.cautionSlopeThreshold
                ? '#ffab00'
                : '#00e5ff';

            return (
              <g
                key={wp.id}
                onMouseEnter={() => onWaypointHover(wp)}
                onMouseLeave={() => onWaypointHover(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Vertical drop line */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx}
                  y2={padTop + plotH}
                  stroke={dotColor}
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                  opacity="0.4"
                />
                {/* Dot */}
                <circle cx={cx} cy={cy} r={4} fill={dotColor} />
                <circle
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill="none"
                  stroke={dotColor}
                  strokeWidth="0.5"
                  opacity="0.5"
                />
                {/* Codename label */}
                <text
                  x={cx}
                  y={padTop + plotH + 14}
                  textAnchor="middle"
                  fill="#6b6b74"
                  fontSize="7"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {wp.codename}
                </text>
                {/* Elevation label */}
                <text
                  x={cx}
                  y={cy - 8}
                  textAnchor="middle"
                  fill={dotColor}
                  fontSize="8"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {wp.elevation}m
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function ChartLegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span
        className="text-[8px] text-[#6b6b74]"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {label}
      </span>
    </div>
  );
}
