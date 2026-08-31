/**
 * Global War & Conflict Intelligence Feed for Swain God's Vision.
 *
 * Provides real-time tactical theater monitoring, active conflict zones,
 * disputed airspaces, naval choke points, and global threat levels.
 * Fully compatible with Google Photorealistic 3D Tiles.
 *
 * @module data/warConflictFeed
 */

import * as Cesium from 'cesium';
import { governorRequestRender } from '../renderGovernor.js';

export const CONFLICT_THEATERS = [
  {
    id: 'theater-ukraine',
    name: 'Eastern Europe / Black Sea Theatre',
    region: 'Eastern Europe',
    status: 'ACTIVE HOSTILITIES',
    threatLevel: 'CRITICAL (DEFCON 2)',
    lat: 48.3794,
    lon: 31.1656,
    radiusKm: 650,
    color: '#ff0033',
    summary: 'Active frontline operations, air defense tracking, and Black Sea naval corridor monitoring.',
    keyPoints: [
      { name: 'Donbas Sector', lat: 48.0159, lon: 37.8028, type: 'Frontline' },
      { name: 'Crimea / Sevastopol Airspace', lat: 44.6166, lon: 33.5254, type: 'Naval Bastion' },
      { name: 'Kyiv Air Defense Zone', lat: 50.4501, lon: 30.5234, type: 'Capital Defense' },
    ],
  },
  {
    id: 'theater-middle-east',
    name: 'Middle East & Red Sea Corridor',
    region: 'Middle East',
    status: 'HIGH TENSION / MARITIME STRIKES',
    threatLevel: 'HIGH (DEFCON 3)',
    lat: 25.2769,
    lon: 45.4950,
    radiusKm: 850,
    color: '#ff8800',
    summary: 'Bab-el-Mandeb maritime shipping protection, regional missile interception arrays.',
    keyPoints: [
      { name: 'Strait of Hormuz', lat: 26.5667, lon: 56.2500, type: 'Choke Point' },
      { name: 'Bab-el-Mandeb Strait', lat: 12.5833, lon: 43.3333, type: 'Maritime Security' },
      { name: 'Golan / Levant Zone', lat: 33.1200, lon: 35.8000, type: 'Border Defense' },
    ],
  },
  {
    id: 'theater-taiwan-strait',
    name: 'Taiwan Strait & South China Sea',
    region: 'Indo-Pacific',
    status: 'AIR-DEFENSE PATROLS',
    threatLevel: 'ELEVATED (DEFCON 3)',
    lat: 23.6978,
    lon: 120.9605,
    radiusKm: 550,
    color: '#ffaa00',
    summary: 'ADIZ incursions, carrier strike group vectoring, and subsea cable surveillance.',
    keyPoints: [
      { name: 'Taiwan Strait Median Line', lat: 24.2000, lon: 119.5000, type: 'Airspace Boundary' },
      { name: 'Miyako Strait', lat: 24.8000, lon: 125.3000, type: 'Naval Passage' },
      { name: 'Bashi Channel', lat: 21.0000, lon: 121.0000, type: 'Submarine Corridor' },
    ],
  },
  {
    id: 'theater-korea',
    name: 'Korean Demilitarized Zone (DMZ)',
    region: 'East Asia',
    status: 'ARMED STANDOFF / MISSILE WATCH',
    threatLevel: 'ELEVATED (DEFCON 3)',
    lat: 38.3214,
    lon: 127.0000,
    radiusKm: 300,
    color: '#ffaa00',
    summary: 'Ballistic missile early-warning radars and artillery counter-battery monitoring.',
    keyPoints: [
      { name: 'Panmunjom DMZ', lat: 37.9560, lon: 126.6770, type: 'Demarcation Line' },
      { name: 'Northern Limit Line (NLL)', lat: 37.7500, lon: 125.5000, type: 'Naval Border' },
    ],
  },
  {
    id: 'theater-ladakh',
    name: 'Line of Actual Control (LAC) · Northern India',
    region: 'South Asia',
    status: 'HIGH-ALTITUDE DEFENSE PATROLS',
    threatLevel: 'ALERT (DEFCON 3)',
    lat: 34.1526,
    lon: 77.5771,
    radiusKm: 400,
    color: '#ff7700',
    summary: 'Himalayan high-altitude border surveillance, radar arrays, and defense outposts.',
    keyPoints: [
      { name: 'Galwan Valley Sector', lat: 34.7500, lon: 78.2000, type: 'Forward Outpost' },
      { name: 'Pangong Tso Radar Array', lat: 33.7500, lon: 78.6500, type: 'Border Sector' },
      { name: 'Siachen Defense Zone', lat: 35.4212, lon: 77.1095, type: 'High Altitude' },
    ],
  },
];

export class WarConflictFeed {
  constructor(viewer) {
    this.viewer = viewer;
    this.entities = [];
    this.visible = false;
  }

  show() {
    this.visible = true;
    this.render();
    if (this.viewer) {
      // Smoothly frame initial theater or global overview
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(38.0, 35.0, 7_500_000),
        duration: 2.2,
      });
    }
  }

  hide() {
    this.visible = false;
    this.clear();
  }

  toggle() {
    if (this.visible) this.hide();
    else this.show();
    return this.visible;
  }

  clear() {
    if (this.viewer) {
      for (const e of this.entities) {
        this.viewer.entities.remove(e);
      }
      this.entities = [];
      governorRequestRender();
    }
  }

  render() {
    this.clear();
    if (!this.viewer) return;

    for (const theater of CONFLICT_THEATERS) {
      const color = Cesium.Color.fromCssColorString(theater.color);
      const centerPosition = Cesium.Cartesian3.fromDegrees(theater.lon, theater.lat, 15000);

      // 3D Elevated Cylinder Dome (Visible above all Google 3D Tiles)
      const domeEntity = this.viewer.entities.add({
        id: `conflict-dome-${theater.id}`,
        position: Cesium.Cartesian3.fromDegrees(theater.lon, theater.lat, 25000),
        cylinder: {
          length: 50000,
          topRadius: theater.radiusKm * 1000,
          bottomRadius: theater.radiusKm * 1000,
          material: color.withAlpha(0.18),
          outline: true,
          outlineColor: color.withAlpha(0.95),
          outlineWidth: 3,
        },
      });
      this.entities.push(domeEntity);

      // Elevated Glowing Label
      const labelEntity = this.viewer.entities.add({
        id: `conflict-label-${theater.id}`,
        position: Cesium.Cartesian3.fromDegrees(theater.lon, theater.lat, 60000),
        point: {
          pixelSize: 12,
          color: color,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: `⚔️ THEATER: ${theater.name.toUpperCase()}\nSTATUS: ${theater.status} · [${theater.threatLevel}]`,
          font: 'bold 12px "JetBrains Mono", monospace',
          fillColor: Cesium.Color.WHITE,
          backgroundColor: Cesium.Color.fromCssColorString('rgba(15, 23, 42, 0.92)'),
          showBackground: true,
          backgroundPadding: new Cesium.Cartesian2(10, 6),
          outlineColor: color,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -32),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
      this.entities.push(labelEntity);

      // Key tactical points
      for (const pt of theater.keyPoints) {
        const ptEntity = this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(pt.lon, pt.lat, 8000),
          point: {
            pixelSize: 8,
            color: color,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 1.5,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: `[${pt.type}] ${pt.name}`,
            font: '10px "JetBrains Mono", monospace',
            fillColor: color,
            backgroundColor: Cesium.Color.fromCssColorString('rgba(10, 16, 24, 0.85)'),
            showBackground: true,
            backgroundPadding: new Cesium.Cartesian2(6, 3),
            pixelOffset: new Cesium.Cartesian2(0, -16),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });
        this.entities.push(ptEntity);
      }
    }
    governorRequestRender();
  }

  flyToTheater(theaterId) {
    const theater = CONFLICT_THEATERS.find((t) => t.id === theaterId);
    if (!theater || !this.viewer) return;
    this.show();
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(theater.lon, theater.lat, theater.radiusKm * 2500),
      duration: 2.2,
    });
  }
}
