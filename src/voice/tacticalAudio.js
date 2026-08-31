/**
 * Tactical Speech Synthesizer for God's Eye View.
 *
 * Uses the Web Speech API (window.speechSynthesis) to deliver local voice
 * announcements, contact intercepts, and telemetry briefings without requiring
 * external cloud API keys.
 *
 * @module voice/tacticalAudio
 */

let _enabled = true;
let _currentUtterance = null;

export function isTacticalAudioSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function setTacticalAudioEnabled(enabled) {
  _enabled = Boolean(enabled);
  if (!_enabled) {
    cancelTacticalSpeech();
  }
}

export function isTacticalAudioEnabled() {
  return _enabled;
}

export function cancelTacticalSpeech() {
  if (isTacticalAudioSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignored if synthesis is busy or uninitialized
    }
  }
}

/**
 * Speak a tactical phrase or situation briefing.
 * @param {string} text The message to announce.
 * @param {object} options Tuning options (rate, pitch, volume).
 * @returns {boolean} Whether speech was successfully queued.
 */
export function speakTacticalBrief(text, {
  rate = 1.05,
  pitch = 0.95,
  volume = 0.85,
  priority = false,
} = {}) {
  if (!_enabled || !isTacticalAudioSupported() || !text || typeof text !== 'string') {
    return false;
  }

  try {
    if (priority) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.rate = Math.max(0.5, Math.min(2.0, rate));
    utterance.pitch = Math.max(0.5, Math.min(1.5, pitch));
    utterance.volume = Math.max(0, Math.min(1.0, volume));

    // Prefer an English voice with natural cadence if available
    const voices = window.speechSynthesis.getVoices?.() || [];
    const englishVoice = voices.find((v) => v.lang?.startsWith('en') && (v.name?.includes('Natural') || v.name?.includes('Online') || v.name?.includes('David') || v.name?.includes('Zira') || v.name?.includes('Google')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    _currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('[TacticalAudio] Speech synthesis failed:', err);
    return false;
  }
}
