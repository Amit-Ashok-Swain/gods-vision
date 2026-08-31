import assert from 'node:assert/strict';
import test from 'node:test';
import { CctvMatrix } from './cctvMatrix.js';

test('CCTV Matrix: lifecycle, grid management, and filtering', () => {
  const matrix = new CctvMatrix(null);
  assert.equal(matrix.visible, false);
  assert.ok(matrix.sources.length >= 6);

  matrix.show();
  assert.equal(matrix.visible, true);

  matrix.assignToGrid('test-cam-1');
  assert.equal(matrix.activeGridIds[0], 'test-cam-1');

  matrix.assignToGrid('test-cam-2');
  assert.equal(matrix.activeGridIds[0], 'test-cam-2');
  assert.equal(matrix.activeGridIds[1], 'test-cam-1');

  matrix.hide();
  assert.equal(matrix.visible, false);
});
