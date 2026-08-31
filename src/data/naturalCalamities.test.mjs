import assert from 'node:assert/strict';
import test from 'node:test';
import { NaturalCalamitiesFeed } from './naturalCalamities.js';

test('Natural Calamities Feed: lifecycle and mock data handling', () => {
  const feed = new NaturalCalamitiesFeed(null);
  assert.equal(feed.visible, false);
  assert.equal(feed.calamities.length, 0);

  feed.show();
  assert.equal(feed.visible, true);

  feed.hide();
  assert.equal(feed.visible, false);

  assert.doesNotThrow(() => feed.clear());
});
