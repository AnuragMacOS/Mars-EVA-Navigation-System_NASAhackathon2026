// Jezero Crater waypoint data based on real Perseverance rover mission locations
// Coordinates are in Mars areographic (planetocentric) lat/lon
// For Leaflet, we use these directly as lat/lng

export interface Waypoint {
  id: string;
  name: string;
  codename: string;
  lat: number;
  lng: number;
  type: 'habitat' | 'science' | 'geological' | 'danger' | 'resource';
  elevation: number; // meters relative to Mars datum (MOLA)
  slope: number; // degrees
  description: string;
  scienceValue: 'Critical' | 'High' | 'Medium' | 'Low';
  hazardLevel: 'Safe' | 'Caution' | 'Danger';
  mineralogy: string[];
  notes: string;
  imageCredit?: string;
}

export const JEZERO_CENTER = { lat: 18.4447, lng: 77.4508 };

export const WAYPOINTS: Waypoint[] = [
  {
    id: 'hab-01',
    name: 'Jezero Base Camp',
    codename: 'HAB-ALPHA',
    lat: 18.4447,
    lng: 77.4025,
    type: 'habitat',
    elevation: -2650,
    slope: 1.2,
    description:
      'Primary surface habitat and EVA staging area. Located at the Octavia E. Butler Landing site where Perseverance touched down on February 18, 2021. Flat terrain with minimal boulder hazards makes this an optimal base camp location.',
    scienceValue: 'Low',
    hazardLevel: 'Safe',
    mineralogy: ['Basalt', 'Regolith'],
    notes:
      'Perseverance landing site. Flat flood-deposited terrain. Optimal for habitat deployment due to low rock abundance and gentle slopes under 3 degrees.',
  },
  {
    id: 'sci-01',
    name: 'Séítah Region',
    codename: 'SCI-DELTA-1',
    lat: 18.4120,
    lng: 77.3750,
    type: 'science',
    elevation: -2680,
    slope: 4.8,
    description:
      'Ancient olivine-rich terrain southwest of the landing site. The Séítah region contains some of the oldest exposed bedrock in Jezero Crater, with igneous rocks that crystallized from magma. Perseverance collected drill samples here revealing olivine cumulate textures.',
    scienceValue: 'Critical',
    hazardLevel: 'Caution',
    mineralogy: ['Olivine', 'Pyroxene', 'Carbonate'],
    notes:
      'Named from the Navajo word meaning "amidst the sand." Sand dunes and loose regolith create moderate mobility hazard for suited EVA. Rover-assisted traverse recommended.',
  },
  {
    id: 'sci-02',
    name: 'Western Delta Front',
    codename: 'SCI-DELTA-2',
    lat: 18.4780,
    lng: 77.3580,
    type: 'science',
    elevation: -2520,
    slope: 12.5,
    description:
      'The ancient river delta where water once flowed into Jezero Crater billions of years ago. Layered sedimentary deposits preserve a record of Martian water chemistry and potentially biosignatures. This is the single highest-priority astrobiology target in the crater.',
    scienceValue: 'Critical',
    hazardLevel: 'Caution',
    mineralogy: ['Hydrated Silica', 'Phyllosilicates', 'Carbonates', 'Iron Oxides'],
    notes:
      'Steep frontal scarp with exposed sedimentary layers. EVA approach from the south along the delta toe is safest. Slopes exceed 15 degrees on the upper face; climbing harness may be required.',
  },
  {
    id: 'sci-03',
    name: 'Kodiak Butte',
    codename: 'SCI-KODI',
    lat: 18.4610,
    lng: 77.3920,
    type: 'geological',
    elevation: -2580,
    slope: 8.2,
    description:
      'An isolated remnant of the ancient delta, separated from the main delta body by erosion. Kodiak preserves clear inclined sedimentary strata (foresets and bottomsets) that confirm Jezero once held a standing lake. First identified by Perseverance orbital imagery.',
    scienceValue: 'High',
    hazardLevel: 'Safe',
    mineralogy: ['Sandstone', 'Mudstone', 'Hematite'],
    notes:
      'Excellent panoramic observation point. 360-degree visibility from the summit. Approach via the eastern gradual slope (under 10 degrees). Western face is a sheer 30m cliff.',
  },
  {
    id: 'sci-04',
    name: 'Crater Rim Overlook',
    codename: 'SCI-RIM-N',
    lat: 18.5300,
    lng: 77.4500,
    type: 'geological',
    elevation: -2100,
    slope: 18.7,
    description:
      'Northern rim of Jezero Crater offering views across the entire crater floor. The rim exposes the oldest geological units in the area, pre-dating the lake and delta. Impact-shattered Noachian basement rocks are accessible here.',
    scienceValue: 'High',
    hazardLevel: 'Danger',
    mineralogy: ['Noachian Basement', 'Impact Breccia', 'Pyroxene'],
    notes:
      'EXTREME CAUTION: Slopes exceed 18 degrees with loose talus. Only accessible via pressurized rover. Walking EVA prohibited beyond the rim approach zone. Communication shadow possible behind rim crest.',
  },
  {
    id: 'sci-05',
    name: 'Neretva Vallis Inlet',
    codename: 'SCI-INLET',
    lat: 18.5100,
    lng: 77.3200,
    type: 'science',
    elevation: -2480,
    slope: 6.3,
    description:
      'The ancient river channel that fed water and sediment into Jezero Crater from the northwest. The inlet valley preserves fluvial erosion features and transported mineral grains from the watershed upstream. Studying these deposits reveals the broader Martian hydrological history.',
    scienceValue: 'High',
    hazardLevel: 'Caution',
    mineralogy: ['Fluvial Sediments', 'Phyllosilicates', 'Zeolites'],
    notes:
      'Moderate terrain with scattered boulders in the channel floor. Follow the valley centerline for smoothest traverse. Watch for undercut banks on the southern side.',
  },
  {
    id: 'res-01',
    name: 'Subsurface Ice Prospect',
    codename: 'RES-ICE-1',
    lat: 18.3900,
    lng: 77.4800,
    type: 'resource',
    elevation: -2700,
    slope: 2.1,
    description:
      'Thermal inertia anomaly detected by Mars Odyssey THEMIS suggesting possible shallow subsurface water ice or hydrated minerals within 1-2 meters of the surface. If confirmed, this would be a critical in-situ resource utilization (ISRU) site for water extraction.',
    scienceValue: 'Critical',
    hazardLevel: 'Safe',
    mineralogy: ['Hydrated Sulfates', 'Possible H2O Ice'],
    notes:
      'Flat terrain. Drill deployment site candidate. Ground-penetrating radar survey recommended before sample extraction. ISRU water processing could support extended mission operations.',
  },
  {
    id: 'danger-01',
    name: 'Boulder Field Sigma',
    codename: 'HAZ-SIGMA',
    lat: 18.4550,
    lng: 77.4300,
    type: 'danger',
    elevation: -2630,
    slope: 7.5,
    description:
      'Dense boulder field with rocks ranging from 0.3 to 2.5 meters in diameter. Created by ancient impact ejecta. Impassable by pressurized rover and extremely hazardous for walking EVA. Navigation systems must route around this zone.',
    scienceValue: 'Low',
    hazardLevel: 'Danger',
    mineralogy: ['Impact Ejecta', 'Basalt Boulders'],
    notes:
      'AVOID. Route planning must exclude this zone entirely. Comm relay may be disrupted by boulder radar scatter. Nearest safe detour adds approximately 800 meters via the southern bypass.',
  },
];

export interface MarsTileLayerConfig {
  name: string;
  url: string;
  attribution: string;
  description: string;
  maxNativeZoom: number;
  maxZoom: number;
}

export const MARS_TILE_LAYERS: Record<string, MarsTileLayerConfig> = {
  mola: {
    name: 'MOLA Topo',
    url: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    attribution: 'NASA/JPL/GSFC Mars Trek | MOLA',
    description: 'Mars Orbiter Laser Altimeter color hillshade topography',
    maxNativeZoom: 7,
    maxZoom: 14,
  },
  viking: {
    name: 'Viking Opt',
    url: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    attribution: 'NASA/JPL/USGS Mars Trek | Viking',
    description: 'Viking Orbiter global color mosaic',
    maxNativeZoom: 7,
    maxZoom: 14,
  },
  surface: {
    name: 'Hi-Res Shaded',
    url: 'https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-2/all/{z}/{x}/{y}.png',
    attribution: 'OpenPlanetary / NASA / USGS',
    description: 'High-resolution composite Mars surface basemap',
    maxNativeZoom: 10,
    maxZoom: 14,
  },
};

// Mission simulation parameters based on real NASA data
export const MISSION_PARAMS = {
  oxygenCapacityHours: 8, // Standard EVA suit O2 supply
  oxygenBurnRatePerKm: 0.35, // Hours of O2 per km walked (accounting for Mars gravity)
  walkingSpeedKmH: 1.5, // Average suited walking speed on Mars terrain
  roverSpeedKmH: 8.0, // Pressurized rover average speed
  batteryCapacityPercent: 100,
  batteryDrainPerKm: 3.5, // % per km
  radiationBaseline: 0.67, // mSv per day (Curiosity RAD measurement)
  radiationEvaMultiplier: 1.0, // Surface EVA multiplier
  commsDelayMinutes: 14.5, // One-way light delay Earth-Mars (average)
  marsGravity: 3.72, // m/s²
  earthGravity: 9.81,
  suitMassKg: 55, // Approximate Mars EVA suit mass
  maxEvaSlopeWalking: 20, // degrees - max safe slope for walking EVA
  maxEvaSlopeRover: 25, // degrees - max slope for rover
  cautionSlopeThreshold: 12, // degrees - above this, caution advisory
};

// Solar flare event simulation data (modeled after real DONKI API structure)
export interface SolarEvent {
  id: string;
  type: 'CME' | 'FLR' | 'SEP';
  classType: string;
  beginTime: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Extreme';
  radiationIncrease: number; // multiplier on baseline
  description: string;
  shieldingRequired: boolean;
}

export const SOLAR_EVENTS: SolarEvent[] = [
  {
    id: 'evt-001',
    type: 'FLR',
    classType: 'C2.3',
    beginTime: '2026-11-15T08:30:00Z',
    severity: 'Low',
    radiationIncrease: 1.1,
    description: 'Minor C-class solar flare detected. Minimal impact on surface operations.',
    shieldingRequired: false,
  },
  {
    id: 'evt-002',
    type: 'CME',
    classType: 'M5.8',
    beginTime: '2026-11-14T15:30:00Z',
    severity: 'Moderate',
    radiationIncrease: 2.4,
    description:
      'M-class coronal mass ejection with Earth-directed component. Elevated radiation expected at Mars orbit within 48 hours.',
    shieldingRequired: false,
  },
  {
    id: 'evt-003',
    type: 'SEP',
    classType: 'X1.2',
    beginTime: '2026-11-13T02:15:00Z',
    severity: 'High',
    radiationIncrease: 8.5,
    description:
      'X-class solar energetic particle event. Immediate shelter-in-place advisory for all surface EVA crews. Radiation levels significantly elevated.',
    shieldingRequired: true,
  },
];
