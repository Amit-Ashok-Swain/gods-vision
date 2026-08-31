import assert from 'node:assert/strict';
import test from 'node:test';
import { createWeatherRadarLayer } from './weatherRadar.js';

test('Weather Doppler Radar: metadata and initial state', () => {
  const layer = createWeatherRadarLayer({
    id: 'weather-radar-test',
    name: 'Test Radar',
  });

  assert.equal(layer.id, 'weather-radar-test');
  assert.equal(layer.name, 'Test Radar');
  assert.equal(layer.enabled, false);
  assert.equal(typeof layer.init, 'function');
  assert.equal(typeof layer.enable, 'function');
  assert.equal(typeof layer.disable, 'function');
  assert.equal(typeof layer.toggle, 'function');

  const stats = layer.getStats();
  assert.equal(stats.id, 'weather-radar-test');
  assert.equal(stats.enabled, false);
  assert.equal(stats.status, 'idle');
  assert.equal(stats.available, true);
});

test('Weather Doppler Radar: opacity control with bounds clamping', () => {
  const layer = createWeatherRadarLayer();

  layer.setOpacity(0.8);
  assert.equal(layer.getOpacity(), 0.8);

  layer.setOpacity(1.5); // Should clamp to 1.0
  assert.equal(layer.getOpacity(), 1.0);

  layer.setOpacity(-0.5); // Should clamp to 0.0
  assert.equal(layer.getOpacity(), 0.0);

  layer.setOpacity('invalid'); // Should fallback to default 0.65
  assert.equal(layer.getOpacity(), 0.65);
});

test('Weather Doppler Radar: toggle transitions enabled state', () => {
  const layer = createWeatherRadarLayer();
  assert.equal(layer.enabled, false);

  layer.enabled = false;
  assert.equal(layer.enabled, false);

  layer.disable();
  assert.equal(layer.enabled, false);

  const stats = layer.getStats();
  assert.equal(stats.enabled, false);
});
