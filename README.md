<div align="center">

# 🌐 SWAIN GOD'S VISION
### Planetary Geospatial Intelligence & Situational Awareness Console
**Patented & Architected by Amit Ashok Swain**

[![License](https://img.shields.io/badge/License-Proprietary%20%2F%20Patented-ff3d00.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile%20%7C%20TV%20%7C%20Vercel-00f6ff.svg)](https://github.com/Amit-Ashok-Swain/gods-vision)
[![Engine](https://img.shields.io/badge/Engine-CesiumJS%203D%20%2B%20Vite%20%2B%20WebGL-ffd740.svg)](https://cesium.com)
[![Status](https://img.shields.io/badge/Status-Active%20Mission%20Control-00ff88.svg)](https://github.com/Amit-Ashok-Swain/gods-vision)

<p align="center">
  <em>A real-time, photorealistic 3D Earth operating system fusing live global CCTV surveillance, war conflict theaters, planetary multi-hazard intelligence, commercial aviation, maritime tracking, and orbital telemetry.</em>
</p>

</div>

---

## 🌟 Executive Overview

**SWAIN GOD'S VISION** is a next-generation planetary situational awareness console created and architected by **Amit Ashok Swain**. It transforms disparate global data streams into a unified, photorealistic 3D intelligence platform. Designed for mission controllers, intelligence analysts, and researchers, the platform provides seamless geospatial fusion across land, sea, airspace, and orbital domains with real-time 60 FPS rendering.

---

## 🚀 Key Platform Capabilities

### 📹 1. 60 FPS Live Global CCTV Video Surveillance Matrix
- **Real-Time Surveillance Engine**: Self-contained 60 FPS perspective rendering with simulated multi-lane traffic physics and day/night lighting cycles.
- **AI Computer Vision**: Real-time bounding box tracking (`[SEDAN #204 68 KM/H]`, `[TRUCK #108 54 KM/H]`), Optical Character Recognition (OCR) vehicle tags, and speed telemetry.
- **Global Metro Network**: Instant camera switching across **Mumbai, Navi Mumbai, New Delhi, Bengaluru, Tokyo, London, Singapore, New York, San Francisco, Dubai, Paris, and Sydney**.
- **Interactive Quad Wall**: Multi-camera grid view with instant camera hopping and spatial focus vectoring.

### 🗺️ 2. High-Resolution Photorealistic 3D Mapping
- **Google Photorealistic 3D Tiles**: Photorealistic 3D city meshes served via Cesium Ion Asset `2275207`.
- **World Satellite Imagery**: Ultra-high-resolution ESRI satellite basemaps with sub-meter clarity.
- **Carto Dark Matter**: High-contrast tactical night basemaps.
- **OpenStreetMap**: Global street vectors and topological mapping.

### ⚔️ 3. Global War Conflict Theaters & Defense Intelligence
- **Real-Time Theater Tracking**: Eastern Europe (Ukraine-Russia), Middle East (Levant / Red Sea), Taiwan Strait, and Korean Peninsula.
- **3D Spatial Geometry**: Pulsing frontline polygons, tactical defense boundaries, SAM coverage envelopes, and combat air patrol (CAP) corridors.
- **Defense Infrastructure**: Mapped military bases, naval stations, command bunkers, and airfields with one-click orbital handoffs.

### 🌋 4. Planetary Multi-Hazard & Bio-Disaster Network
- **Hydrological Hazards**: Flash flood tracking (Assam Brahmaputra, Kerala Wayanad, Yangtze Basin, Mississippi River).
- **Meteorological Threats**: Category 1–5 tropical cyclones and typhoons with dynamic cloud rotation vectors.
- **Bio-Hazard & Pathogen Index**: Live disease outbreak vectors (Nipah virus, H5N1 avian influenza, Marburg virus, Dengue).
- **Megafires & Volcanoes**: Active thermal anomalies (NASA FIRMS) and volcanic eruption plumes (USGS / Global Volcanism Program).

### 📡 5. Multimodal Live OSINT Data Streams
- **Commercial Aviation (ADS-B)**: Live aircraft transponders with realistic 3D aircraft models (Boeing 787, ATR-72, Citation, Bell 206, MQ-9 Reaper).
- **Maritime Vessels (AIS)**: Real-time global cargo, tanker, and vessel traffic.
- **Space Missions & Satellites (TLEs)**: Real-time SGP4 orbital propagation for the ISS, Starlink constellations, and active satellites.
- **Global Infrastructure**: Undersea fiber-optic cables, hydroelectric dams, and global datacenter clusters.

### 🎨 6. Cyberpunk Sunset Aesthetics & GLSL Tactical Shaders
- **Cyberpunk Sunset Palette**: Radiant orange-peach-yellow neon gradient styling across HUD headers, telemetry chips, and patent attribution.
- **Sensor Simulation Shaders**:
  - **Normal**: Full-spectrum photorealistic rendering.
  - **CRT Retro**: Phosphor raster scanlines with barrel distortion.
  - **NVG**: Gen-3 night vision green phosphor with noise amplification.
  - **FLIR / Thermal**: Ironbow infrared thermal gradient heat signatures.
  - **Anime / Noir / Snow**: Stylized tactical visual filters.

### 📱 7. Universal Multi-Device Responsiveness
- **Mobile Phones (320px–768px)**: Uncluttered top ribbon, touch-friendly bottom drawer stack, single-column CCTV grid, and full-width search dropdowns.
- **Tablets (769px–1024px)**: 2-column Quad Matrix with 44px touch targets.
- **Desktops & Laptops (1025px–2560px)**: Cinematic widescreen mission control layout.
- **TV & 4K Displays (2561px–3840px+)**: Scaled ultra-HD typography and presentation-ready vector HUDs.

---

## 💻 Tech Stack & Architecture

- **Core Engine**: [CesiumJS 1.124+](https://cesium.com/platform/cesiumjs/) (WebGL / WebGPU 3D Globe)
- **Bundler & Server**: [Vite 6](https://vitejs.dev/) (Zero-bundle overhead ESM)
- **Styling**: Cyberpunk HUD Design System (`style.css` with responsive media queries)
- **Physics & Surveillance**: HTML5 Canvas 60 FPS Perspective Vector Physics
- **Deployment**: Vercel Serverless Ready (`vercel.json`)

---

## ⚡ Quick Start & Setup

### Prerequisites
- **Node.js**: `v24.14.x` or `v26.x`
- **NPM**: `v10+`

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/Amit-Ashok-Swain/gods-vision.git
cd gods-vision

# 2. Install dependencies
npm install

# 3. Configure environment keys
cp .env.example .env

# 4. Start development server
npm run dev
```

Open **`http://localhost:4173`** in your browser.

---

## 🔑 Environment Variables Configuration

Create a `.env` file in the project root:

```env
# Required for Google Photorealistic 3D Tiles
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Required for Cesium Ion Asset Access
CESIUM_ION_TOKEN="your-cesium-ion-access-token"

# Optional: Voice Assistant & AI Integration
OPENAI_API_KEY="your-openai-api-key"

# Optional: Live Maritime AIS Stream
AISSTREAM_API_KEY="your-aisstream-api-key"
```

---

## 🧪 Testing & Verification

Run the automated tactical test suite:

```bash
# Run all unit tests
npm test

# Build production bundle
npm run build
```

---

## 🚀 1-Click Vercel Deployment

Deploy directly to Vercel with zero configuration:

```bash
# Deploy via Vercel CLI
npx vercel --prod
```

Or connect your GitHub repository [**`Amit-Ashok-Swain/gods-vision`**](https://github.com/Amit-Ashok-Swain/gods-vision) directly in the [Vercel Dashboard](https://vercel.com/new).

---

## 📜 Intellectual Property & Licensing

```text
Proprietary Platform Architecture & Intellectual Property
Copyright (c) 2026 Amit Ashok Swain. All Rights Reserved.
Patented and Architected by Amit Ashok Swain.
```

- **Chief Architect & Patent Holder**: **Amit Ashok Swain**
- **Inquiries & Security Contact**: `business.amitswain@gmail.com`
- **Security Vulnerability Reporting**: [GitHub Advisories](https://github.com/Amit-Ashok-Swain/gods-vision/security/advisories/new)

---

<div align="center">

**🌐 SWAIN GOD'S VISION — PLANETARY SITUATIONAL AWARENESS CONSOLE**  
*Engineered & Patented by Amit Ashok Swain*

</div>
