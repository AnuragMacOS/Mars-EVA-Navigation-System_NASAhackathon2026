# Mars EVA Navigation System

> Tactical surface navigation, real-time life-support telemetrics, and hazard avoidance HUD for astronaut extravehicular activity (EVA) in Jezero Crater, built for the NASA Space Apps Challenge.

[![Frontend](https://img.shields.io/badge/Frontend-React%2019-0284c7?style=flat&logo=react)](https://react.dev/)
[![Language](https://img.shields.io/badge/Language-TypeScript-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Mapping](https://img.shields.io/badge/Mapping-Leaflet%20%26%20Turf.js-10b981?style=flat&logo=leaflet)](https://leafletjs.com/)
[![Hackathon](https://img.shields.io/badge/Hackathon-NASA%20Space%20Apps%202026-e11d48?style=flat)](https://www.spaceappschallenge.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

---

##  Live Demo & Deployment

- **Production Deployment:** [mars-eva-navigation-system.vercel.app](https://mars-eva-navigation-system.vercel.app)
- **Source Code Repository:** [github.com/AnuragMacOS/Mars-EVA-Navigation-System_NASAhackathon2026](https://github.com/AnuragMacOS/Mars-EVA-Navigation-System_NASAhackathon2026)

### 🎥 Project Walkthrough Demo

https://github.com/user-attachments/assets/1bb41ef1-c5df-4355-8dc8-222d89ebe60d



---

## NASA Space Apps Challenge 2026

- **Challenge Track:** *Interplanetary Survival Guide: Martian Map*
- **Local Event:** Delhi, India
- **Team Name:** Himalayan Coders
- **Team Members:** Anurag Bhatt & Sahil Singh

---

##  Overview & Operational Problem

During a crewed Martian surface mission, astronauts undertaking Extravehicular Activity (EVA) operate under extreme environmental constraints with no room for error:

1. **Zero GNSS / GPS:** Mars has no navigation satellite constellation. Beyond visual range of the lander, crew must rely on hazardous dead-reckoning.
2. **Strict 8-Hour Life-Support Thresholds:** Portable Life Support Systems (PLSS) impose a hard 8-hour oxygen ceiling. Metabolic consumption spikes steeply when ascending grades.
3. **Severe Slope Hazards (>15°):** Escarpments, crater walls, and boulder fields present rollover hazards for pressurized rovers and fall risks for suited crew.
4. **4 to 24 Minute Earth Communications Delay:** Light-time latency prevents Houston Mission Control from offering real-time assistance during emergencies, abort traverses, or solar storms.

The **Mars EVA Navigation System (MENS)** solves this autonomy bottleneck by giving astronauts a zero-latency, client-side tactical heads-up display directly on their suits and rover touchscreens.

---

##  NASA APIs, Datasets & Scientific Citations

This project directly integrates verified, open-access NASA planetary data, live heliophysics feeds, and human spaceflight standards:

| Resource | Source & Endpoint | Application in Project |
| :--- | :--- | :--- |
| **NASA Mars Trek WMTS** | `trek.nasa.gov` Tile Server<br>`Mars_MGS_MOLA_ClrShade_merge_global_463m` | **MOLA Topography Basemap:** High-resolution Mars Orbiter Laser Altimeter color-shaded relief showing depth and crater floor relief (-2,680m to -2,380m). |
| **Viking Orbiter MDIM 2.1** | `trek.nasa.gov` Tile Server<br>`Mars_Viking_MDIM21_ClrMosaic_global_232m` | **Viking Optical Basemap:** Global USGS/NASA digital image mosaic providing true surface albedo and photographic context. |
| **NASA DONKI Space Weather API** | `api.nasa.gov/DONKI`<br>`/DONKI/FLR`, `/DONKI/CME`, `/DONKI/SEP` | **Live Space Weather Telemetry:** Real-time stream tracking solar flares, coronal mass ejections, and energetic particles, issuing automated **SHELTER ADVISORIES**. |
| **NASA Mars 2020 Perseverance** | NASA JPL Mission Archives | **Jezero Crater Science Targets:** Octavia E. Butler landing site (Base Camp), Séítah formation, Western Delta front, and boulder hazard zones. |
| **NASA MSL Curiosity RAD** | NASA PDS Planetary Data System | **Radiation Baseline:** In-situ surface radiation measurement calibration (0.67 mSv/sol nominal threshold). |
| **NASA-STD-3001 Vol. 2** | NASA Spaceflight Human-System Standard | **Metabolic Envelope:** 8-hour oxygen depletion modeling, terrain impedance scaling, and Point-of-No-Return (PNR) margin calculation. |

---

## Core Features

- **Multi-Spectral Basemap Switcher:** Seamlessly toggles between NASA MOLA Elevation Altimetry, Viking MDIM 2.1 Optical mosaic, and OpenPlanetary surface cartography with automatic multi-zoom tile fallbacks.
- **Autonomous Geodesic Traversal Engine:** Point-and-click tactical waypoint sequencing calculating true great-circle surface distances over the Martian ellipsoid (mean radius: 3,389.5 km).
- **Life-Support & Consumables Telemetry:** Dynamically calculates march duration at 1.2 m/s, remaining oxygen reserves, suit battery life, and Point-of-No-Return (PNR) return thresholds.
- **Topographic SVG Elevation Profile:** Real-time cross-section profile plotting ascent/descent contours with color-coded slope safety bands (`<5° Nominal`, `5°–15° Caution`, `>15° Hazard`).
- **Tactical Hazard Avoidance:** Pinpoints unnavigable obstacles (such as *Boulder Field Sigma* with 2.5m impact ejecta) and provides recommended detour routing.
- **Real-Time Space Weather Alert Radar:** Live polling against NASA DONKI for CME shocks and solar particle spikes.

---

##  Technical Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/) (sub-300ms production builds)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Mapping & Geospatial:** [Leaflet.js](https://leafletjs.com/) & [Turf.js](https://turfjs.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

---

##  Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/AnuragMacOS/mars-eva-navigation-system.git

# Navigate into project directory
cd mars-eva-navigation-system

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### Production Build

```bash
# Compile TypeScript and bundle assets
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Developed for the **NASA Space Apps Challenge 2026**.
