import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { JEZERO_CENTER, MARS_TILE_LAYERS, WAYPOINTS, type Waypoint } from '../data/marsData';
import type { RouteResult } from '../utils/routeCalculator';

interface MarsMapProps {
  selectedWaypoints: Waypoint[];
  routeResult: RouteResult | null;
  activeWaypoint: Waypoint | null;
  onWaypointClick: (wp: Waypoint) => void;
  onAddWaypoint: (wp: Waypoint) => void;
  activeLayer: string;
}

function getMarkerClass(type: Waypoint['type']): string {
  switch (type) {
    case 'habitat':
      return 'habitat';
    case 'danger':
      return 'danger';
    case 'science':
    case 'geological':
    case 'resource':
      return 'science';
    default:
      return 'science';
  }
}

function getMarkerEmoji(type: Waypoint['type']): string {
  switch (type) {
    case 'habitat':
      return '🏠';
    case 'science':
      return '🔬';
    case 'geological':
      return '🪨';
    case 'danger':
      return '⚠️';
    case 'resource':
      return '💧';
    default:
      return '📍';
  }
}

export default function MarsMap({
  selectedWaypoints,
  routeResult,
  activeWaypoint,
  onWaypointClick,
  onAddWaypoint,
  activeLayer,
}: MarsMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [JEZERO_CENTER.lat, JEZERO_CENTER.lng],
      zoom: 7,
      minZoom: 3,
      maxZoom: 14,
      zoomControl: true,
      attributionControl: true,
    });

    mapRef.current = map;

    // Fit map bounds to show all waypoints with padding
    const bounds = L.latLngBounds(WAYPOINTS.map((wp) => [wp.lat, wp.lng]));
    map.fitBounds(bounds.pad(0.2));

    // Observe container size changes (flexbox layout shifts, window resize, tab focus)
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize({ debounceMoveend: true });
      }
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    // Window resize fallback
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    // Multi-stage invalidations to ensure full rendering on cold load
    const rAF = requestAnimationFrame(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
        mapRef.current.fitBounds(bounds.pad(0.2));
      }
    });

    const t1 = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
        mapRef.current.fitBounds(bounds.pad(0.2));
      }
    }, 100);

    const t2 = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 400);

    const t3 = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 1000);

    return () => {
      cancelAnimationFrame(rAF);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update tile layer whenever activeLayer changes or map initializes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
      tileLayerRef.current = null;
    }

    const layerConfig = MARS_TILE_LAYERS[activeLayer] || MARS_TILE_LAYERS.mola;

    const tileLayer = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      maxZoom: layerConfig.maxZoom || 14,
      maxNativeZoom: layerConfig.maxNativeZoom || 7,
      tileSize: 256,
      noWrap: false,
      keepBuffer: 8,
      updateWhenIdle: false,
      updateWhenZooming: true,
    }).addTo(map);

    tileLayer.bringToBack();
    tileLayerRef.current = tileLayer;

    // Immediately notify map to re-check tile bounds
    map.invalidateSize();
  }, [activeLayer]);

  // Render waypoint markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    WAYPOINTS.forEach((wp) => {
      const isSelected = selectedWaypoints.some((s) => s.id === wp.id);
      const isActive = activeWaypoint?.id === wp.id;
      const cls = getMarkerClass(wp.type);
      const emoji = getMarkerEmoji(wp.type);

      const size = isActive ? 36 : 28;
      const borderColor =
        wp.type === 'habitat'
          ? '#00e676'
          : wp.type === 'danger'
          ? '#ff1744'
          : '#00e5ff';

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            position: relative;
            width: ${size}px;
            height: ${size}px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <div class="waypoint-marker ${cls}">
              <div class="ring"></div>
              <div class="dot"></div>
            </div>
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: ${isActive ? 18 : 14}px;
              z-index: 10;
              filter: drop-shadow(0 0 4px rgba(0,0,0,0.8));
            ">${emoji}</div>
            ${
              isSelected
                ? `<div style="
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #00e676;
                    border: 2px solid #0a0a0b;
                    z-index: 20;
                  "></div>`
                : ''
            }
            <div style="
              position: absolute;
              top: ${size + 4}px;
              left: 50%;
              transform: translateX(-50%);
              white-space: nowrap;
              font-family: 'JetBrains Mono', monospace;
              font-size: 9px;
              color: ${borderColor};
              text-shadow: 0 0 6px rgba(0,0,0,0.9);
              letter-spacing: 0.5px;
              text-transform: uppercase;
              z-index: 10;
            ">${wp.codename}</div>
          </div>
        `,
        iconSize: [size, size + 20],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([wp.lat, wp.lng], { icon })
        .addTo(map)
        .on('click', () => {
          onWaypointClick(wp);
          onAddWaypoint(wp);
        });

      markersRef.current.push(marker);
    });
  }, [selectedWaypoints, activeWaypoint, onWaypointClick, onAddWaypoint]);

  // Render route line
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    if (routeResult && selectedWaypoints.length >= 2) {
      const coords: L.LatLngTuple[] = selectedWaypoints.map((wp) => [wp.lat, wp.lng]);

      const line = L.polyline(coords, {
        color: routeResult.feasible ? '#00e676' : '#ff1744',
        weight: 3,
        opacity: 0.85,
        dashArray: '12, 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      routeLineRef.current = line;
    }
  }, [routeResult, selectedWaypoints]);

  // Pan to active waypoint
  useEffect(() => {
    if (!mapRef.current || !activeWaypoint) return;
    mapRef.current.panTo([activeWaypoint.lat, activeWaypoint.lng], { animate: true, duration: 0.5 });
  }, [activeWaypoint]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full"
      style={{ background: '#0a0a0b' }}
    />
  );
}
