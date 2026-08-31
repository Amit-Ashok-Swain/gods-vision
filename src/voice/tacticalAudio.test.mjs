import assert from 'node:assert/strict';
import test from 'node:test';
import {
  cancelTacticalSpeech,
  isTacticalAudioEnabled,
  isTacticalAudioSupported,
  setTacticalAudioEnabled,
  speakTacticalBrief,
} from './tacticalAudio.js';

test('Tactical Audio: state toggling and guards', () => {
  assert.equal(isTacticalAudioSupported(), false); // In Node environment
  assert.equal(isTacticalAudioEnabled(), true);

  setTacticalAudioEnabled(false);
  assert.equal(isTacticalAudioEnabled(), false);

  setTacticalAudioEnabled(true);
  assert.equal(isTacticalAudioEnabled(), true);

  // In Node environment without window.speechSynthesis, speak returns false gracefully
  const spoken = speakTacticalBrief('Radar contact confirmed.');
  assert.equal(spoken, false);

  // cancel should not throw
  assert.doesNotThrow(() => cancelTacticalSpeech());
});
