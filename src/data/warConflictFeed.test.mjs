import assert from 'node:assert/strict';
import test from 'node:test';
import { CONFLICT_THEATERS, WarConflictFeed } from './warConflictFeed.js';

test('War Conflict Feed: theaters catalog schema', () => {
  assert.ok(Array.isArray(CONFLICT_THEATERS));
  assert.ok(CONFLICT_THEATERS.length >= 4);

  for (const theater of CONFLICT_THEATERS) {
    assert.ok(theater.id);
    assert.ok(theater.name);
    assert.ok(theater.status);
    assert.ok(theater.threatLevel);
    assert.ok(Number.isFinite(theater.lat));
    assert.ok(Number.isFinite(theater.lon));
    assert.ok(Array.isArray(theater.keyPoints));
  }
});

test('War Conflict Feed: lifecycle and toggle', () => {
  const feed = new WarConflictFeed(null);
  assert.equal(feed.visible, false);

  feed.show();
  assert.equal(feed.visible, true);

  feed.hide();
  assert.equal(feed.visible, false);

  feed.toggle();
  assert.equal(feed.visible, true);

  assert.doesNotThrow(() => feed.clear());
});
