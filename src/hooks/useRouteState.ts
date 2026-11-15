import { useState, useCallback } from 'react';
import { type Waypoint, WAYPOINTS } from '../data/marsData';
import { calculateRoute, type RouteResult } from '../utils/routeCalculator';

const initialWps = [WAYPOINTS[0], WAYPOINTS[1], WAYPOINTS[2], WAYPOINTS[3]];
const initialRoute = calculateRoute(initialWps);

export function useRouteState() {
  const [selectedWaypoints, setSelectedWaypoints] = useState<Waypoint[]>(initialWps);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(initialRoute);
  const [activeWaypoint, setActiveWaypoint] = useState<Waypoint | null>(null);

  const addWaypoint = useCallback(
    (wp: Waypoint) => {
      setSelectedWaypoints((prev) => {
        if (prev.find((p) => p.id === wp.id)) return prev;
        const next = [...prev, wp];
        const result = calculateRoute(next);
        setRouteResult(result);
        return next;
      });
    },
    []
  );

  const removeWaypoint = useCallback((wpId: string) => {
    setSelectedWaypoints((prev) => {
      const next = prev.filter((p) => p.id !== wpId);
      if (next.length >= 2) {
        setRouteResult(calculateRoute(next));
      } else {
        setRouteResult(null);
      }
      return next;
    });
  }, []);

  const clearRoute = useCallback(() => {
    setSelectedWaypoints([WAYPOINTS[0]]);
    setRouteResult(null);
  }, []);

  const selectWaypoint = useCallback((wp: Waypoint | null) => {
    setActiveWaypoint(wp);
  }, []);

  return {
    selectedWaypoints,
    routeResult,
    activeWaypoint,
    addWaypoint,
    removeWaypoint,
    clearRoute,
    selectWaypoint,
  };
}
