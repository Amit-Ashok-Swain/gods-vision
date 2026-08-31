import assert from 'node:assert/strict';
import test from 'node:test';
import {
  estimateFlightTimeMinutes,
  haversineDistanceKm,
  initialCompassBearingDeg,
  RangeRulerTool,
} from './rangeRuler.js';

test('Range Ruler: Great Circle Haversine math', () => {
  // New York (40.7128, -74.0060) to London (51.5074, -0.1278) ≈ 5,570 km
  const nyToLondonKm = haversineDistanceKm(40.7128, -74.0060, 51.5074, -0.1278);
  assert.ok(nyToLondonKm > 5500 && nyToLondonKm < 5650, `Expected ~5570km, got ${nyToLondonKm}`);

  // Same point distance should be 0
  assert.equal(haversineDistanceKm(30, -90, 30, -90), 0);
});

test('Range Ruler: Initial Compass Bearing calculation', () => {
  // Bearing from Equator (0,0) directly North (10,0) is 0°
  const bearingNorth = initialCompassBearingDeg(0, 0, 10, 0);
  assert.equal(Math.round(bearingNorth), 0);

  // Bearing from Equator (0,0) directly East (0,10) is 90°
  const bearingEast = initialCompassBearingDeg(0, 0, 0, 10);
  assert.equal(Math.round(bearingEast), 90);

  // Bearing from Equator (0,0) directly South (-10,0) is 180°
  const bearingSouth = initialCompassBearingDeg(0, 0, -10, 0);
  assert.equal(Math.round(bearingSouth), 180);
});

test('Range Ruler: Flight time estimation', () => {
  // 900 km at 900 km/h is 60 minutes
  const timeMin = estimateFlightTimeMinutes(900, 900);
  assert.equal(timeMin, 60);

  assert.equal(estimateFlightTimeMinutes(0, 900), 0);
  assert.equal(estimateFlightTimeMinutes(100, 0), 0);
});

test('Range Ruler Tool: lifecycle and toggle', () => {
  const tool = new RangeRulerTool(null);
  assert.equal(tool.active, false);

  tool.activate();
  assert.equal(tool.active, false); // No viewer attached

  tool.clear();
  assert.equal(tool.pointA, null);
  assert.equal(tool.pointB, null);
});
