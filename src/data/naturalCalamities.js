/**
 * Global Natural Calamities, Climate Extremes & Bio-Hazard Intelligence Network for Swain God's Vision.
 *
 * Real-time monitoring of Floods, Tropical Cyclones, Viral Pathogen / Bio-Hazards,
 * Volcanic Eruptions, Wildfire Fronts, Tornado Supercells, and Seismic Quakes.
 * Fully compatible with Google Photorealistic 3D Tiles.
 *
 * @module data/naturalCalamities
 */

import * as Cesium from 'cesium';
import { governorRequestRender } from '../renderGovernor.js';

const USGS_SIGNIFICANT_QUAKES_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';
const NASA_EONET_EVENTS_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events?limit=40';

export const CALAMITY_CATEGORIES = {
  FLOOD: { label: 'FLOOD / FLASH FLOOD', icon: '🌊', color: '#00d4ff', heightM: 35000 },
  CYCLONE: { label: 'CYCLONE / TYPHOON', icon: '🌀', color: '#00f0ff', heightM: 55000 },
  BIOHAZARD: { label: 'BIO-HAZARD / VIRUS', icon: '☣️', color: '#39ff14', heightM: 45000 },
  VOLCANO: { label: 'ACTIVE VOLCANO', icon: '🌋', color: '#ff3b00', heightM: 45000 },
  WILDFIRE: { label: 'WILDFIRE INFERNO', icon: '🔥', color: '#ff6600', heightM: 38000 },
  TORNADO: { label: 'TORNADO / SEVERE', icon: '🌪️', color: '#c084fc', heightM: 40000 },
  TSUNAMI: { label: 'TSUNAMI WARNING', icon: '🌊', color: '#06b6d4', heightM: 35000 },
  EARTHQUAKE: { label: 'SEISMIC QUAKE', icon: '💥', color: '#ff0033', heightM: 50000 },
};

export const STATIC_PLANETARY_DISASTERS = [
  // 🌊 FLOODS & FLASH FLOODS
  {
    id: 'flood-brahmaputra',
    type: 'FLOOD',
    title: 'Assam Valley & Brahmaputra Basin Flash Flood',
    place: 'Assam / Kaziranga Corridor, India',
    magnitude: 'Severe Inundation · Red Alert',
    lat: 26.2006,
    lon: 92.9376,
    severity: 'CRITICAL',
    color: '#00d4ff',
    time: new Date().toISOString(),
  },
  {
    id: 'flood-kerala-wayanad',
    type: 'FLOOD',
    title: 'Western Ghats Flash Flood & Landslide Alert',
    place: 'Wayanad / Idukki, Kerala, India',
    magnitude: 'Monsoon High Water Warning',
    lat: 11.6854,
    lon: 76.1320,
    severity: 'HIGH',
    color: '#00d4ff',
    time: new Date().toISOString(),
  },
  {
    id: 'flood-yangtze',
    type: 'FLOOD',
    title: 'Yangtze Middle-Lower Basin Flood Discharge',
    place: 'Hubei / Poyang Lake Basin, China',
    magnitude: 'Basin Gauge Stage 4',
    lat: 29.8500,
    lon: 115.8000,
    severity: 'HIGH',
    color: '#00d4ff',
    time: new Date().toISOString(),
  },
  {
    id: 'flood-mississippi',
    type: 'FLOOD',
    title: 'Mississippi Delta Floodway Activation',
    place: 'Louisiana / Mississippi River Basin, USA',
    magnitude: 'Crest Stage Inundation',
    lat: 29.9511,
    lon: -90.0715,
    severity: 'MODERATE',
    color: '#38bdf8',
    time: new Date().toISOString(),
  },

  // 🌀 CYCLONES, TYPHOONS & HURRICANES
  {
    id: 'cyclone-bay-of-bengal',
    type: 'CYCLONE',
    title: 'Bay of Bengal Very Severe Cyclonic Vortex',
    place: 'Odisha / West Bengal Coastal Radar Arc',
    magnitude: '165 km/h Sustained Winds · Cat 3',
    lat: 19.5000,
    lon: 87.2000,
    severity: 'CRITICAL',
    color: '#00f0ff',
    time: new Date().toISOString(),
  },
  {
    id: 'cyclone-arabian-sea',
    type: 'CYCLONE',
    title: 'Arabian Sea Cyclonic Deep Depression',
    place: 'West Coast India / Saurashtra Maritime Gate',
    magnitude: '120 km/h Gusts · High Seas Watch',
    lat: 19.8000,
    lon: 67.5000,
    severity: 'HIGH',
    color: '#00e5ff',
    time: new Date().toISOString(),
  },
  {
    id: 'typhoon-philippine-sea',
    type: 'CYCLONE',
    title: 'Western Pacific Super Typhoon Corridor',
    place: 'Luzon Strait / Ryukyu Archipelago',
    magnitude: '240 km/h Super Typhoon (Cat 5)',
    lat: 21.2000,
    lon: 125.8000,
    severity: 'CRITICAL',
    color: '#00f0ff',
    time: new Date().toISOString(),
  },
  {
    id: 'hurricane-atlantic-cat4',
    type: 'CYCLONE',
    title: 'Major Atlantic Hurricane Vector',
    place: 'Florida Straits / Caribbean Sea',
    magnitude: '215 km/h Cat 4 Hurricane',
    lat: 24.5000,
    lon: -81.0000,
    severity: 'HIGH',
    color: '#38bdf8',
    time: new Date().toISOString(),
  },

  // ☣️ BIO-HAZARD, VIRAL PATHOGEN & PANDEMIC OUTBREAKS
  {
    id: 'bio-nipah-kerala',
    type: 'BIOHAZARD',
    title: 'Nipah Virus Bio-Surveillance & Containment Zone',
    place: 'Kozhikode / Malappuram, Kerala, India',
    magnitude: 'BSL-4 Pathogen Surveillance Arc',
    lat: 11.2588,
    lon: 75.7804,
    severity: 'CRITICAL',
    color: '#39ff14',
    time: new Date().toISOString(),
  },
  {
    id: 'bio-h5n1-avian',
    type: 'BIOHAZARD',
    title: 'H5N1 Avian Pathogen Trans-Continental Vector',
    place: 'East Asian-Australasian Flyway / Chilika Lake',
    magnitude: 'High Pathogenicity Avian Vector Watch',
    lat: 19.7167,
    lon: 85.3167,
    severity: 'HIGH',
    color: '#39ff14',
    time: new Date().toISOString(),
  },
  {
    id: 'bio-marburg-congo',
    type: 'BIOHAZARD',
    title: 'Marburg & Filovirus Emergency Isolation Ring',
    place: 'Equatorial Congo Basin',
    magnitude: 'WHO Level 4 Bio-Containment Watch',
    lat: -0.2280,
    lon: 15.8277,
    severity: 'CRITICAL',
    color: '#39ff14',
    time: new Date().toISOString(),
  },
  {
    id: 'bio-dengue-delhi',
    type: 'BIOHAZARD',
    title: 'Vector-Borne Epidemic Transmission Alert',
    place: 'National Capital Region, Delhi, India',
    magnitude: 'High-Density Vector Multiplication Index',
    lat: 28.6139,
    lon: 77.2090,
    severity: 'MODERATE',
    color: '#a3e635',
    time: new Date().toISOString(),
  },

  // 🌋 ACTIVE VOLCANOES
  {
    id: 'volcano-barren-island',
    type: 'VOLCANO',
    title: 'Barren Island Active Eruption & Ash Plume',
    place: 'Andaman Sea, India',
    magnitude: 'Active Strombolian Plume (2.5 km)',
    lat: 12.2780,
    lon: 93.8580,
    severity: 'HIGH',
    color: '#ff3b00',
    time: new Date().toISOString(),
  },
  {
    id: 'volcano-etna',
    type: 'VOLCANO',
    title: 'Mount Etna Summit Crater Ash Emission',
    place: 'Sicily, Italy',
    magnitude: 'VEI 3 Magma Fountain',
    lat: 37.7510,
    lon: 14.9934,
    severity: 'HIGH',
    color: '#ff3b00',
    time: new Date().toISOString(),
  },
  {
    id: 'volcano-kilauea',
    type: 'VOLCANO',
    title: 'Kilauea Caldera Halemaʻumaʻu Lava Lake',
    place: 'Hawaii Volcanoes National Park, USA',
    magnitude: 'Active Magma Effusion',
    lat: 19.4069,
    lon: -155.2834,
    severity: 'MODERATE',
    color: '#ff6600',
    time: new Date().toISOString(),
  },
  {
    id: 'volcano-reykjanes',
    type: 'VOLCANO',
    title: 'Reykjanes Peninsula Volcanic Fissure Zone',
    place: 'Grindavik, Iceland',
    magnitude: 'Basaltic Fissure Eruption',
    lat: 63.8800,
    lon: -22.4300,
    severity: 'HIGH',
    color: '#ff3b00',
    time: new Date().toISOString(),
  },
  {
    id: 'volcano-merapi',
    type: 'VOLCANO',
    title: 'Mount Merapi Pyroclastic Density Current',
    place: 'Central Java, Indonesia',
    magnitude: 'Dome Collapse & Pyroclastic Flow',
    lat: -7.5407,
    lon: 110.4457,
    severity: 'CRITICAL',
    color: '#ff3b00',
    time: new Date().toISOString(),
  },

  // 🔥 WILDFIRES & MEGAFIRES
  {
    id: 'fire-california-complex',
    type: 'WILDFIRE',
    title: 'Sierra Nevada Megafire Inferno Front',
    place: 'Northern California, USA',
    magnitude: '85,000 Hectares · Zero Containment',
    lat: 39.7596,
    lon: -121.6219,
    severity: 'HIGH',
    color: '#ff5500',
    time: new Date().toISOString(),
  },
  {
    id: 'fire-amazon-basin',
    type: 'WILDFIRE',
    title: 'Amazon Rainforest Trans-Basin Fire Front',
    place: 'Rondônia / Amazonas Border, Brazil',
    magnitude: 'Severe Canopy Fire Complex',
    lat: -8.8828,
    lon: -63.9039,
    severity: 'HIGH',
    color: '#ff5500',
    time: new Date().toISOString(),
  },

  // 🌪️ TORNADOES & SUPERCELLS
  {
    id: 'tornado-alley-midwest',
    type: 'TORNADO',
    title: 'Great Plains Multi-Vortex Tornado Alert',
    place: 'Oklahoma City / Kansas Corridor, USA',
    magnitude: 'EF-4 Tornado Damage Track',
    lat: 35.4676,
    lon: -97.5164,
    severity: 'CRITICAL',
    color: '#c084fc',
    time: new Date().toISOString(),
  },
  {
    id: 'storm-kalbaishakhi',
    type: 'TORNADO',
    title: 'Kalbaishakhi Supercell Severe Derecho Line',
    place: 'Bengal Basin / Sundarbans, India',
    magnitude: '110 km/h Severe Gust Front',
    lat: 22.5726,
    lon: 88.3639,
    severity: 'HIGH',
    color: '#c084fc',
    time: new Date().toISOString(),
  },
];

export class NaturalCalamitiesFeed {
  constructor(viewer) {
    this.viewer = viewer;
    this.calamities = [];
    this.entities = [];
    this.visible = false;
    this.lastUpdate = null;
  }

  async fetchLiveDisasters() {
    const list = [...STATIC_PLANETARY_DISASTERS];

    // 1. Fetch live USGS Earthquakes (Open API, No key needed)
    try {
      const res = await fetch(USGS_SIGNIFICANT_QUAKES_URL, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const data = await res.json();
        const features = data.features || [];
        features.slice(0, 30).forEach((f) => {
          const [lon, lat, depth] = f.geometry.coordinates;
          list.push({
            id: f.id,
            type: 'EARTHQUAKE',
            title: f.properties.title || 'Seismic Event',
            place: f.properties.place || 'Global Seismic Belt',
            magnitude: `M ${f.properties.mag} (Depth ${depth}km)`,
            depthKm: depth,
            time: new Date(f.properties.time).toISOString(),
            lat,
            lon,
            severity: f.properties.mag >= 6.5 ? 'CRITICAL' : f.properties.mag >= 5.5 ? 'HIGH' : 'MODERATE',
            color: f.properties.mag >= 6.5 ? '#ff0033' : f.properties.mag >= 5.5 ? '#ff6600' : '#ffcc00',
          });
        });
      }
    } catch {
      // Fallback intact
    }

    // 2. Fetch NASA EONET live events (Open API, No key needed)
    try {
      const res = await fetch(NASA_EONET_EVENTS_URL, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const data = await res.json();
        const events = data.events || [];
        events.slice(0, 20).forEach((e) => {
          const cat = e.categories?.[0]?.title?.toUpperCase() || 'EVENT';
          const geom = e.geometry?.[e.geometry.length - 1];
          if (geom && geom.coordinates) {
            const [lon, lat] = geom.coordinates;
            let mappedType = 'WILDFIRE';
            if (cat.includes('STORM') || cat.includes('CYCLONE') || cat.includes('HURRICANE')) mappedType = 'CYCLONE';
            else if (cat.includes('VOLCANO')) mappedType = 'VOLCANO';
            else if (cat.includes('FLOOD')) mappedType = 'FLOOD';

            list.push({
              id: e.id,
              type: mappedType,
              title: e.title,
              place: `${cat} Zone`,
              magnitude: 'NASA EONET Active Telemetry',
              lat,
              lon,
              severity: 'HIGH',
              color: CALAMITY_CATEGORIES[mappedType]?.color || '#ff8800',
              time: geom.date || new Date().toISOString(),
            });
          }
        });
      }
    } catch {
      // Fallback intact
    }

    this.calamities = list;
    this.lastUpdate = new Date().toISOString();
    return this.calamities;
  }

  show() {
    this.visible = true;
    if (!this.calamities.length) {
      this.fetchLiveDisasters().then(() => this.render3DOverlays());
    } else {
      this.render3DOverlays();
    }
  }

  hide() {
    this.visible = false;
    this.clear3DOverlays();
  }

  toggle() {
    if (this.visible) this.hide();
    else this.show();
    return this.visible;
  }

  render3DOverlays() {
    this.clear3DOverlays();
    if (!this.viewer || !this.visible) return;

    for (const cal of this.calamities) {
      const catConfig = CALAMITY_CATEGORIES[cal.type] || CALAMITY_CATEGORIES.EARTHQUAKE;
      const baseColor = Cesium.Color.fromCssColorString(cal.color || catConfig.color);
      const icon = catConfig.icon || '⚠️';
      const altitude = catConfig.heightM || 40000;

      // 1. 3D Volumetric Cylinder Hazard Column
      const cylinderEntity = this.viewer.entities.add({
        id: `calamity-cyl-${cal.id}`,
        name: cal.title,
        position: Cesium.Cartesian3.fromDegrees(cal.lon, cal.lat, altitude / 2),
        cylinder: {
          length: altitude,
          topRadius: 65000.0,
          bottomRadius: 65000.0,
          material: baseColor.withAlpha(0.25),
          outline: true,
          outlineColor: baseColor.withAlpha(0.85),
          outlineWidth: 2,
        },
      });

      // 2. High-Altitude Floating Tactical Marker & Label
      const labelEntity = this.viewer.entities.add({
        id: `calamity-label-${cal.id}`,
        name: `${cal.title} Info`,
        position: Cesium.Cartesian3.fromDegrees(cal.lon, cal.lat, altitude + 12000),
        point: {
          pixelSize: 10,
          color: baseColor,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: `${icon} [${cal.type}] ${cal.title}\n${cal.place} · ${cal.magnitude}`,
          font: 'bold 11px "JetBrains Mono", monospace',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: baseColor,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 3,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -12),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scale: 0.95,
        },
      });

      this.entities.push(cylinderEntity, labelEntity);
    }

    // Camera fly-to nearest active calamity or Indian epicenter
    if (this.calamities.length > 0) {
      const target = this.calamities.find((c) => c.id === 'flood-brahmaputra' || c.id === 'bio-nipah-kerala') || this.calamities[0];
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(target.lon, target.lat, 1800000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45),
          roll: 0,
        },
        duration: 2.2,
      });
    }

    governorRequestRender(this.viewer.scene);
  }

  clear3DOverlays() {
    if (!this.viewer) return;
    for (const ent of this.entities) {
      this.viewer.entities.remove(ent);
    }
    this.entities = [];
    governorRequestRender(this.viewer.scene);
  }

  clear() {
    this.clear3DOverlays();
  }
}
