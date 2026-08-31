/**
 * Weather Doppler Radar Layer for God's Eye View.
 *
 * Integrates RainViewer's public real-time radar precipitation maps directly
 * as a Cesium ImageryLayer on the 3D globe.
 * Provides live animated/current rainfall, storms, and snow reflectivity.
 *
 * @module data/weatherRadar
 */

import * as Cesium from 'cesium';
import { governorRequestRender } from '../renderGovernor.js';

const RAINVIEWER_API_URL = 'https://api.rainviewer.com/public/weather-maps.json';
const RADAR_REFRESH_INTERVAL_MS = 120_000; // 2 minutes

export function createWeatherRadarLayer({
  id = 'weather-radar',
  name = 'Doppler Weather Radar',
  color = '#00e5ff',
  icon = '🌧',
  source = 'RainViewer · LIVE',
} = {}) {
  let _viewer = null;
  let _enabled = false;
  let _imageryLayer = null;
  let _currentTimestamp = null;
  let _host = 'https://tilecache.rainviewer.com';
  let _path = '';
  let _timer = null;
  let _loading = false;
  let _lastError = null;
  let _lastUpdate = null;
  let _opacity = 0.65;

  async function fetchLatestRadarMetadata() {
    try {
      _loading = true;
      const res = await fetch(RAINVIEWER_API_URL, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      _host = data.host || 'https://tilecache.rainviewer.com';
      const past = data.radar?.past || [];
      const latest = past[past.length - 1];
      if (!latest) throw new Error('No radar frames available');
      _currentTimestamp = latest.time;
      _path = latest.path;
      _lastUpdate = new Date(latest.time * 1000).toISOString();
      _lastError = null;
      return true;
    } catch (err) {
      _lastError = err?.message || String(err);
      console.warn('[WeatherRadar] Failed to fetch radar metadata:', _lastError);
      return false;
    } finally {
      _loading = false;
    }
  }

  function applyImageryLayer() {
    if (!_viewer || !_enabled || !_path) return;
    if (_imageryLayer) {
      _viewer.imageryLayers.remove(_imageryLayer, true);
      _imageryLayer = null;
    }

    try {
      const tileUrl = `${_host}${_path}/512/{z}/{x}/{y}/2/1_1.png`;
      const provider = new Cesium.UrlTemplateImageryProvider({
        url: tileUrl,
        minimumLevel: 0,
        maximumLevel: 10,
        credit: 'RainViewer Live Doppler Radar',
      });
      _imageryLayer = _viewer.imageryLayers.addImageryProvider(provider);
      _imageryLayer.alpha = _opacity;
      _imageryLayer.show = true;
      governorRequestRender();
    } catch (err) {
      console.error('[WeatherRadar] Failed to create imagery layer:', err);
    }
  }

  function removeImageryLayer() {
    if (_viewer && _imageryLayer) {
      _viewer.imageryLayers.remove(_imageryLayer, true);
      _imageryLayer = null;
      governorRequestRender();
    }
  }

  async function update() {
    if (!_enabled) return;
    const ok = await fetchLatestRadarMetadata();
    if (ok && _enabled) {
      applyImageryLayer();
    }
  }

  function startPolling() {
    stopPolling();
    _timer = setInterval(update, RADAR_REFRESH_INTERVAL_MS);
  }

  function stopPolling() {
    if (_timer) {
      clearInterval(_timer);
      _timer = null;
    }
  }

  return {
    id,
    name,
    color,
    icon,
    source,
    get enabled() {
      return _enabled;
    },
    set enabled(val) {
      if (val) this.enable();
      else this.disable();
    },

    init(viewer) {
      _viewer = viewer;
    },

    async enable() {
      if (_enabled) return;
      _enabled = true;
      await update();
      startPolling();
    },

    disable() {
      if (!_enabled) return;
      _enabled = false;
      stopPolling();
      removeImageryLayer();
    },

    toggle() {
      if (_enabled) this.disable();
      else this.enable();
      return _enabled;
    },

    setOpacity(alpha) {
      _opacity = Math.max(0, Math.min(1, Number(alpha) || 0.65));
      if (_imageryLayer) {
        _imageryLayer.alpha = _opacity;
        governorRequestRender();
      }
    },

    getOpacity() {
      return _opacity;
    },

    getStats() {
      return {
        id,
        name,
        enabled: _enabled,
        loading: _loading,
        count: _currentTimestamp ? 1 : 0,
        status: _enabled ? (_lastError ? 'degraded' : 'nominal') : 'idle',
        lastUpdate: _lastUpdate,
        timestamp: _currentTimestamp,
        error: _lastError,
        source,
        available: true,
      };
    },

    destroy() {
      this.disable();
      _viewer = null;
    },
  };
}

export default createWeatherRadarLayer();
