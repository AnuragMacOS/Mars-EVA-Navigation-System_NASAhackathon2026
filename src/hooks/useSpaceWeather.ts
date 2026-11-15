import { useState, useEffect, useCallback } from 'react';
import { SOLAR_EVENTS, type SolarEvent } from '../data/marsData';

const DONKI_BASE = 'https://api.nasa.gov/DONKI';
const API_KEY = 'DEMO_KEY'; // Free tier — works for hackathon demos

interface DonkiFlare {
  flrID: string;
  beginTime: string;
  peakTime: string;
  endTime: string | null;
  classType: string;
  sourceLocation: string;
  activeRegionNum: number | null;
  note: string;
}

interface DonkiCME {
  activityID: string;
  startTime: string;
  sourceLocation: string;
  note: string;
}

interface DonkiSEP {
  sepID: string;
  eventTime: string;
  instruments: { displayName: string }[];
}

function classifySeverity(classType: string): SolarEvent['severity'] {
  if (!classType) return 'Low';
  const letter = classType.charAt(0).toUpperCase();
  const num = parseFloat(classType.slice(1)) || 1;
  if (letter === 'X') return 'Extreme';
  if (letter === 'M' && num >= 5) return 'High';
  if (letter === 'M') return 'Moderate';
  if (letter === 'C' && num >= 5) return 'Moderate';
  return 'Low';
}

function radiationMultiplier(severity: SolarEvent['severity']): number {
  switch (severity) {
    case 'Low': return 1.05;
    case 'Moderate': return 2.2;
    case 'High': return 6.5;
    case 'Extreme': return 15.0;
    default: return 1.0;
  }
}

function formatDateParam(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export function useSpaceWeather() {
  const [events, setEvents] = useState<SolarEvent[]>(SOLAR_EVENTS);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    const startDate = formatDateParam(30);
    const endDate = formatDateParam(0);
    const results: SolarEvent[] = [];

    try {
      // Fetch Solar Flares
      const flrRes = await fetch(
        `${DONKI_BASE}/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${API_KEY}`
      );

      if (flrRes.ok) {
        const flares: DonkiFlare[] = await flrRes.json();
        // Take the 5 most recent flares
        const recentFlares = flares.slice(-5).reverse();
        for (const flr of recentFlares) {
          const severity = classifySeverity(flr.classType);
          results.push({
            id: flr.flrID || `flr-${flr.beginTime}`,
            type: 'FLR',
            classType: flr.classType || 'Unknown',
            beginTime: flr.beginTime,
            severity,
            radiationIncrease: radiationMultiplier(severity),
            description: flr.note || `Solar flare class ${flr.classType} detected.`,
            shieldingRequired: severity === 'High' || severity === 'Extreme',
          });
        }
      }

      // Fetch Coronal Mass Ejections
      const cmeRes = await fetch(
        `${DONKI_BASE}/CME?startDate=${startDate}&endDate=${endDate}&api_key=${API_KEY}`
      );

      if (cmeRes.ok) {
        const cmes: DonkiCME[] = await cmeRes.json();
        const recentCMEs = cmes.slice(-3).reverse();
        for (const cme of recentCMEs) {
          results.push({
            id: cme.activityID || `cme-${cme.startTime}`,
            type: 'CME',
            classType: 'CME',
            beginTime: cme.startTime,
            severity: 'Moderate',
            radiationIncrease: 2.4,
            description:
              cme.note?.slice(0, 200) ||
              'Coronal mass ejection detected. Monitor for elevated particle flux.',
            shieldingRequired: false,
          });
        }
      }

      // Fetch Solar Energetic Particles
      const sepRes = await fetch(
        `${DONKI_BASE}/SEP?startDate=${startDate}&endDate=${endDate}&api_key=${API_KEY}`
      );

      if (sepRes.ok) {
        const seps: DonkiSEP[] = await sepRes.json();
        const recentSEPs = seps.slice(-3).reverse();
        for (const sep of recentSEPs) {
          results.push({
            id: sep.sepID || `sep-${sep.eventTime}`,
            type: 'SEP',
            classType: 'SEP',
            beginTime: sep.eventTime,
            severity: 'High',
            radiationIncrease: 8.0,
            description:
              'Solar energetic particle event detected. Elevated radiation risk for surface EVA operations.',
            shieldingRequired: true,
          });
        }
      }

      if (results.length > 0) {
        // Sort by time descending, take top 6
        results.sort(
          (a, b) => new Date(b.beginTime).getTime() - new Date(a.beginTime).getTime()
        );
        setEvents(results.slice(0, 6));
        setIsLive(true);
      } else {
        // No events in last 30 days — use static fallback
        setEvents(SOLAR_EVENTS);
        setIsLive(false);
      }

      setLastFetched(new Date());
    } catch (err) {
      console.warn('DONKI API fetch failed, using static fallback:', err);
      setError('API unavailable — showing cached data');
      setEvents(SOLAR_EVENTS);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  // Refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return { events, isLive, loading, error, lastFetched, refetch: fetchWeather };
}
