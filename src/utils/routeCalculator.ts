import * as turf from '@turf/turf';
import { MISSION_PARAMS, type Waypoint } from '../data/marsData';

export interface RouteSegment {
  from: Waypoint;
  to: Waypoint;
  distanceKm: number;
  walkingTimeMinutes: number;
  roverTimeMinutes: number;
  oxygenCostHours: number;
  batteryCostPercent: number;
  maxSlope: number;
  hazardLevel: 'Safe' | 'Caution' | 'Danger';
}

export interface RouteResult {
  segments: RouteSegment[];
  totalDistanceKm: number;
  totalWalkingTimeMinutes: number;
  totalRoverTimeMinutes: number;
  totalOxygenCostHours: number;
  totalBatteryCostPercent: number;
  remainingOxygenHours: number;
  remainingBatteryPercent: number;
  overallHazard: 'Safe' | 'Caution' | 'Danger';
  feasible: boolean;
  warnings: string[];
}

/**
 * Calculate the great-circle distance between two Mars coordinates.
 * Uses Turf.js which calculates Earth distances, then scales by Mars/Earth radius ratio.
 */
function marsDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const earthDistKm = turf.distance(turf.point([lng1, lat1]), turf.point([lng2, lat2]), {
    units: 'kilometers',
  });
  // Mars radius / Earth radius ratio
  const marsEarthRatio = 3389.5 / 6371.0;
  return earthDistKm * marsEarthRatio;
}

/**
 * Determine the maximum slope along a segment.
 * Uses the start and end waypoint slopes plus interpolated mid-point estimate.
 */
function segmentMaxSlope(from: Waypoint, to: Waypoint): number {
  // Take the higher of the two endpoint slopes, with a factor for unknown mid-route terrain
  const maxEndpointSlope = Math.max(from.slope, to.slope);
  // Add a small uncertainty buffer for uncharacterized mid-route terrain
  const elevDiff = Math.abs(from.elevation - to.elevation);
  const dist = marsDistanceKm(from.lat, from.lng, to.lat, to.lng) * 1000; // meters
  const avgGradeDeg = Math.atan2(elevDiff, dist) * (180 / Math.PI);
  return Math.max(maxEndpointSlope, avgGradeDeg);
}

function classifyHazard(slope: number): 'Safe' | 'Caution' | 'Danger' {
  if (slope >= MISSION_PARAMS.maxEvaSlopeWalking) return 'Danger';
  if (slope >= MISSION_PARAMS.cautionSlopeThreshold) return 'Caution';
  return 'Safe';
}

/**
 * Calculate a complete route between an ordered list of waypoints.
 */
export function calculateRoute(waypoints: Waypoint[]): RouteResult {
  if (waypoints.length < 2) {
    return {
      segments: [],
      totalDistanceKm: 0,
      totalWalkingTimeMinutes: 0,
      totalRoverTimeMinutes: 0,
      totalOxygenCostHours: 0,
      totalBatteryCostPercent: 0,
      remainingOxygenHours: MISSION_PARAMS.oxygenCapacityHours,
      remainingBatteryPercent: MISSION_PARAMS.batteryCapacityPercent,
      overallHazard: 'Safe',
      feasible: true,
      warnings: [],
    };
  }

  const segments: RouteSegment[] = [];
  const warnings: string[] = [];
  let totalDistance = 0;
  let totalWalkTime = 0;
  let totalRoverTime = 0;
  let totalO2 = 0;
  let totalBattery = 0;
  let worstHazard: 'Safe' | 'Caution' | 'Danger' = 'Safe';

  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = waypoints[i];
    const to = waypoints[i + 1];
    const distKm = marsDistanceKm(from.lat, from.lng, to.lat, to.lng);
    const maxSlope = segmentMaxSlope(from, to);
    const hazard = classifyHazard(maxSlope);

    const walkMinutes = (distKm / MISSION_PARAMS.walkingSpeedKmH) * 60;
    const roverMinutes = (distKm / MISSION_PARAMS.roverSpeedKmH) * 60;
    const o2Cost = distKm * MISSION_PARAMS.oxygenBurnRatePerKm;
    const batteryCost = distKm * MISSION_PARAMS.batteryDrainPerKm;

    segments.push({
      from,
      to,
      distanceKm: distKm,
      walkingTimeMinutes: walkMinutes,
      roverTimeMinutes: roverMinutes,
      oxygenCostHours: o2Cost,
      batteryCostPercent: batteryCost,
      maxSlope,
      hazardLevel: hazard,
    });

    totalDistance += distKm;
    totalWalkTime += walkMinutes;
    totalRoverTime += roverMinutes;
    totalO2 += o2Cost;
    totalBattery += batteryCost;

    if (hazard === 'Danger') worstHazard = 'Danger';
    else if (hazard === 'Caution' && worstHazard !== 'Danger') worstHazard = 'Caution';

    if (hazard === 'Danger') {
      warnings.push(
        `Segment ${from.codename} → ${to.codename}: Slope ${maxSlope.toFixed(1)}° exceeds safe walking EVA limit (${MISSION_PARAMS.maxEvaSlopeWalking}°). Rover-only traverse required.`
      );
    }
  }

  const remainO2 = MISSION_PARAMS.oxygenCapacityHours - totalO2;
  const remainBattery = MISSION_PARAMS.batteryCapacityPercent - totalBattery;

  if (remainO2 < 1.0) {
    warnings.push(
      `WARNING: Remaining O₂ reserve (${remainO2.toFixed(1)} hrs) is below 1-hour safety minimum. Shorten route or resupply.`
    );
  }
  if (remainBattery < 15) {
    warnings.push(
      `WARNING: Battery reserve (${remainBattery.toFixed(0)}%) is below 15% safety threshold.`
    );
  }

  const feasible = remainO2 > 0 && remainBattery > 0;

  return {
    segments,
    totalDistanceKm: totalDistance,
    totalWalkingTimeMinutes: totalWalkTime,
    totalRoverTimeMinutes: totalRoverTime,
    totalOxygenCostHours: totalO2,
    totalBatteryCostPercent: totalBattery,
    remainingOxygenHours: Math.max(0, remainO2),
    remainingBatteryPercent: Math.max(0, remainBattery),
    overallHazard: worstHazard,
    feasible,
    warnings,
  };
}

/**
 * Generate a GeoJSON LineString for the route polyline.
 */
export function routeToGeoJSON(waypoints: Waypoint[]) {
  const coords = waypoints.map((wp) => [wp.lng, wp.lat]);
  return turf.lineString(coords);
}

/**
 * Format minutes into a human-readable duration string.
 */
export function formatDuration(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
}
