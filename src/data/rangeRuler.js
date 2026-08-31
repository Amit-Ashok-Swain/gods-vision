/**
 * Geodesic Range & Bearing Measurement Tool for God's Eye View.
 *
 * Provides real-time Great Circle geodesic distance, compass bearing, and
 * estimated intercept times between any two clicked coordinates or tracked contacts.
 *
 * @module data/rangeRuler
 */

import * as Cesium from 'cesium';
import { governorRequestRender } from '../renderGovernor.js';

const EARTH_RADIUS_KM = 6371.0088;
const KM_TO_NM = 0.539957;

export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function initialCompassBearingDeg(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
}

export function estimateFlightTimeMinutes(distanceKm, speedKmh = 900) {
  if (distanceKm <= 0 || speedKmh <= 0) return 0;
  return (distanceKm / speedKmh) * 60;
}

export class RangeRulerTool {
  constructor(viewer) {
    this.viewer = viewer;
    this.active = false;
    this.pointA = null; // { lat, lon, cartesian }
    this.pointB = null;
    this.polylineEntity = null;
    this.labelEntity = null;
    this.markerEntities = [];
    this.handler = null;
  }

  activate() {
    if (this.active || !this.viewer) return;
    this.active = true;
    this.clear();
    this._bindEvents();
    console.log('[RangeRuler] Activated. Click two points on the globe to measure distance.');
  }

  deactivate() {
    if (!this.active) return;
    this.active = false;
    this._unbindEvents();
    this.clear();
  }

  toggle() {
    if (this.active) this.deactivate();
    else this.activate();
    return this.active;
  }

  clear() {
    if (this.viewer) {
      if (this.polylineEntity) {
        this.viewer.entities.remove(this.polylineEntity);
        this.polylineEntity = null;
      }
      if (this.labelEntity) {
        this.viewer.entities.remove(this.labelEntity);
        this.labelEntity = null;
      }
      for (const marker of this.markerEntities) {
        this.viewer.entities.remove(marker);
      }
      this.markerEntities = [];
      governorRequestRender();
    }
    this.pointA = null;
    this.pointB = null;
  }

  _bindEvents() {
    if (this.handler || !this.viewer) return;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.handler.setInputAction((click) => {
      const ray = this.viewer.camera.getPickRay(click.position);
      if (!ray) return;
      const cartesian = this.viewer.scene.globe?.pick(ray, this.viewer.scene)
        || this.viewer.camera.pickEllipsoid(click.position, this.viewer.scene.globe?.ellipsoid);
      if (!cartesian) return;

      const carto = Cesium.Cartographic.fromCartesian(cartesian);
      const lat = Cesium.Math.toDegrees(carto.latitude);
      const lon = Cesium.Math.toDegrees(carto.longitude);

      if (!this.pointA) {
        this.clear();
        this.pointA = { lat, lon, cartesian };
        this._addPointMarker(cartesian, 'POINT A');
      } else if (!this.pointB) {
        this.pointB = { lat, lon, cartesian };
        this._addPointMarker(cartesian, 'POINT B');
        this._renderMeasurement();
      } else {
        // Reset to start new measurement
        this.clear();
        this.pointA = { lat, lon, cartesian };
        this._addPointMarker(cartesian, 'POINT A');
      }
      governorRequestRender();
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  _unbindEvents() {
    if (this.handler) {
      this.handler.destroy();
      this.handler = null;
    }
  }

  _addPointMarker(cartesian, labelText) {
    if (!this.viewer) return;
    const marker = this.viewer.entities.add({
      position: cartesian,
      point: {
        pixelSize: 8,
        color: Cesium.Color.fromCssColorString('#00ffff'),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: labelText,
        font: '10px "JetBrains Mono", monospace',
        fillColor: Cesium.Color.fromCssColorString('#00ffff'),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -14),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    this.markerEntities.push(marker);
  }

  _renderMeasurement() {
    if (!this.pointA || !this.pointB || !this.viewer) return;

    const distKm = haversineDistanceKm(this.pointA.lat, this.pointA.lon, this.pointB.lat, this.pointB.lon);
    const distNm = distKm * KM_TO_NM;
    const bearing = initialCompassBearingDeg(this.pointA.lat, this.pointA.lon, this.pointB.lat, this.pointB.lon);
    const flightMinMach085 = estimateFlightTimeMinutes(distKm, 900); // 900 km/h airliner

    // Polyline Great Circle arc
    this.polylineEntity = this.viewer.entities.add({
      polyline: {
        positions: [this.pointA.cartesian, this.pointB.cartesian],
        width: 3,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.fromCssColorString('#00ffff'),
          dashLength: 16,
        }),
        arcType: Cesium.ArcType.GEODESIC,
        clampToGround: false,
      },
    });

    // Midpoint label
    const midLat = (this.pointA.lat + this.pointB.lat) / 2;
    const midLon = (this.pointA.lon + this.pointB.lon) / 2;
    const midCartesian = Cesium.Cartesian3.fromDegrees(midLon, midLat, 5000);

    const summaryText = `RNG: ${Math.round(distKm)} km (${Math.round(distNm)} NM) · HDG: ${Math.round(bearing)}° · ETE: ${Math.round(flightMinMach085)}m`;

    this.labelEntity = this.viewer.entities.add({
      position: midCartesian,
      label: {
        text: summaryText,
        font: '12px "JetBrains Mono", monospace',
        fillColor: Cesium.Color.fromCssColorString('#00ffff'),
        backgroundColor: Cesium.Color.fromCssColorString('rgba(10, 16, 24, 0.85)'),
        showBackground: true,
        backgroundPadding: new Cesium.Cartesian2(8, 5),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });

    console.log(`[RangeRuler] Measurement: ${summaryText}`);
  }
}
