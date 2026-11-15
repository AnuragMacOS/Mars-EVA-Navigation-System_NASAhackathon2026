import {
  Wind,
  Battery,
  Thermometer,
  Radiation,
  Compass,
  Clock,
  Signal,
  Wifi,
} from 'lucide-react';
import { MISSION_PARAMS } from '../data/marsData';

interface TopBarProps {
  currentSol: number;
  currentRadiation: number;
  isLive: boolean;
}

export default function TopBar({ currentSol, currentRadiation, isLive }: TopBarProps) {
  const isElevated = currentRadiation > MISSION_PARAMS.radiationBaseline * 1.5;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e1e22] bg-[#0e0e10]/90 backdrop-blur-sm">
      {/* Left: Mission ID */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
          <span
            className="text-[11px] tracking-[2px] uppercase text-[#00e5ff]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            MARS EVA NAVIGATION SYSTEM
          </span>
        </div>
        <div className="h-4 w-px bg-[#1e1e22]" />
        <span
          className="text-[10px] text-[#6b6b74] tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          JEZERO CRATER OPS
        </span>
        {isLive && (
          <>
            <div className="h-4 w-px bg-[#1e1e22]" />
            <div className="flex items-center gap-1">
              <Wifi size={9} className="text-[#00e676]" />
              <span
                className="text-[8px] tracking-wider text-[#00e676]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                DONKI LIVE
              </span>
            </div>
          </>
        )}
      </div>

      {/* Center: Telemetry Gauges */}
      <div className="flex items-center gap-5">
        <TelemetryItem
          icon={<Clock size={13} />}
          label="SOL"
          value={`${currentSol}`}
          color="#00e5ff"
        />
        <TelemetryItem
          icon={<Thermometer size={13} />}
          label="TEMP"
          value="-63°C"
          color="#ffab00"
        />
        <TelemetryItem
          icon={<Wind size={13} />}
          label="WIND"
          value="12 km/h"
          color="#e0e0e4"
        />
        <TelemetryItem
          icon={<Radiation size={13} />}
          label="RAD"
          value={`${currentRadiation.toFixed(2)} mSv/d`}
          color={isElevated ? '#ff1744' : '#00e676'}
          alert={isElevated}
        />
        <TelemetryItem
          icon={<Battery size={13} />}
          label="PWR"
          value="92%"
          color="#00e676"
        />
        <TelemetryItem
          icon={<Compass size={13} />}
          label="HDG"
          value="247° SW"
          color="#00e5ff"
        />
        <TelemetryItem
          icon={<Signal size={13} />}
          label="COMMS"
          value={`${MISSION_PARAMS.commsDelayMinutes}m delay`}
          color="#ffab00"
        />
      </div>

      {/* Right: Time */}
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] text-[#6b6b74] tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          MARS UTC
        </span>
        <span
          className="text-[11px] text-[#e0e0e4] tabular-nums"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          14:32:08
        </span>
      </div>
    </div>
  );
}

function TelemetryItem({
  icon,
  label,
  value,
  color,
  alert = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  alert?: boolean;
}) {
  return (
    <div className={`flex items-center gap-1.5 ${alert ? 'animate-pulse' : ''}`}>
      <span style={{ color }}>{icon}</span>
      <div className="flex flex-col">
        <span
          className="text-[8px] tracking-[1.5px] text-[#6b6b74] uppercase"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {label}
        </span>
        <span
          className="text-[11px] tabular-nums"
          style={{ fontFamily: "'JetBrains Mono', monospace", color }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
