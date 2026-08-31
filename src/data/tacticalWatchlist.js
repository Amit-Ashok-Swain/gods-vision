/**
 * Tactical Multi-Target Watchlist for God's Eye View.
 *
 * Allows operators to pin and monitor multiple airborne, orbital, and naval
 * contacts simultaneously with real-time relative range, bearing, and closing velocity.
 *
 * @module data/tacticalWatchlist
 */

import * as Cesium from 'cesium';
import { haversineDistanceKm, initialCompassBearingDeg } from './rangeRuler.js';
import { governorRequestRender } from '../renderGovernor.js';

export class TacticalWatchlist {
  constructor(viewer) {
    this.viewer = viewer;
    this.pinnedTargets = new Map(); // id -> { id, label, layerId, position, entity }
    this.container = null;
    this.visible = false;
    this._initDom();
  }

  _initDom() {
    if (typeof document === 'undefined') return;
    this.container = document.createElement('div');
    this.container.id = 'tactical-watchlist';
    this.container.className = 'tactical-watchlist-hud';
    this.container.innerHTML = `
      <div class="watchlist-header">
        <span class="watchlist-title">TACTICAL WATCHLIST</span>
        <span class="watchlist-count" id="watchlist-count">0 TARGETS</span>
        <button class="watchlist-close-btn" id="watchlist-close">✕</button>
      </div>
      <div class="watchlist-items" id="watchlist-items">
        <div class="watchlist-empty">NO PINNED TARGETS · CLICK CONTACT & PRESS 'W'</div>
      </div>
    `;
    this.container.style.display = 'none';
    document.body.appendChild(this.container);

    this.container.querySelector('#watchlist-close')?.addEventListener('click', () => {
      this.hide();
    });
  }

  add(target) {
    if (!target || !target.id) return false;
    this.pinnedTargets.set(target.id, {
      id: target.id,
      label: target.label || target.callsign || target.name || target.id,
      layerId: target.layerId || 'flights',
      altitudeFt: target.altitudeFt || target.altitudeM ? Math.round((target.altitudeM || 0) * 3.28084) : 0,
      speedKts: target.speedKts || target.velocityMps ? Math.round((target.velocityMps || 0) * 1.94384) : 0,
      lat: target.lat || 0,
      lon: target.lon || 0,
      addedAt: Date.now(),
    });
    this.show();
    this.render();
    return true;
  }

  remove(id) {
    const removed = this.pinnedTargets.delete(id);
    if (removed) this.render();
    return removed;
  }

  clear() {
    this.pinnedTargets.clear();
    this.render();
  }

  toggle() {
    if (this.visible) this.hide();
    else this.show();
    return this.visible;
  }

  show() {
    this.visible = true;
    if (this.container) {
      this.container.style.display = 'flex';
      this.render();
    }
  }

  hide() {
    this.visible = false;
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  render() {
    if (!this.container) return;
    const itemsEl = this.container.querySelector('#watchlist-items');
    const countEl = this.container.querySelector('#watchlist-count');
    if (!itemsEl || !countEl) return;

    countEl.textContent = `${this.pinnedTargets.size} TARGET${this.pinnedTargets.size === 1 ? '' : 'S'}`;

    if (this.pinnedTargets.size === 0) {
      itemsEl.innerHTML = '<div class="watchlist-empty">NO PINNED TARGETS · CLICK CONTACT & PRESS \'W\'</div>';
      return;
    }

    // Compute observer camera position
    let camLat = 0;
    let camLon = 0;
    if (this.viewer?.camera) {
      const carto = Cesium.Cartographic.fromCartesian(this.viewer.camera.positionWC);
      if (carto) {
        camLat = Cesium.Math.toDegrees(carto.latitude);
        camLon = Cesium.Math.toDegrees(carto.longitude);
      }
    }

    let html = '';
    for (const target of this.pinnedTargets.values()) {
      const distKm = (target.lat && target.lon && camLat && camLon)
        ? Math.round(haversineDistanceKm(camLat, camLon, target.lat, target.lon))
        : null;
      const bearing = (target.lat && target.lon && camLat && camLon)
        ? Math.round(initialCompassBearingDeg(camLat, camLon, target.lat, target.lon))
        : null;

      html += `
        <div class="watchlist-row" data-id="${target.id}">
          <div class="watchlist-row-info">
            <span class="watchlist-tag tag-${target.layerId}">${target.layerId.slice(0, 3).toUpperCase()}</span>
            <span class="watchlist-label">${target.label}</span>
          </div>
          <div class="watchlist-row-telemetry">
            ${distKm !== null ? `<span>RNG: ${distKm} km</span>` : ''}
            ${bearing !== null ? `<span>BRG: ${bearing}°</span>` : ''}
            ${target.altitudeFt ? `<span>ALT: ${target.altitudeFt.toLocaleString()} ft</span>` : ''}
          </div>
          <button class="watchlist-remove-btn" onclick="window.__gevWatchlist.remove('${target.id}')">✕</button>
        </div>
      `;
    }

    itemsEl.innerHTML = html;
  }
}
