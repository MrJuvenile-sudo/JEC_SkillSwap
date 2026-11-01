/**
 * soundUtils.js
 * Synthesizes crisp, modern notification chimes using Web Audio API
 * and triggers haptic vibration on mobile devices.
 * Zero external MP3 dependencies required — 100% reliable across browsers.
 */

let sharedAudioContext = null;

// Initialize or resume shared AudioContext on first user interaction
export function unlockAudioContext() {
  try {
    if (!sharedAudioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        sharedAudioContext = new AudioCtx();
      }
    }
    if (sharedAudioContext && sharedAudioContext.state === "suspended") {
      sharedAudioContext.resume().catch(() => {});
    }
  } catch (e) {
    // ignore
  }
}

// Attach listener once to unlock audio on first interaction
if (typeof window !== "undefined") {
  const unlockEvents = ["click", "touchstart", "keydown"];
  const handleUnlock = () => {
    unlockAudioContext();
    unlockEvents.forEach((ev) => window.removeEventListener(ev, handleUnlock));
  };
  unlockEvents.forEach((ev) => window.addEventListener(ev, handleUnlock, { passive: true, once: true }));
}

/**
 * Play a pleasant two-tone melodic notification chime (G5 -> C6)
 */
export function playNotificationSound() {
  try {
    unlockAudioContext();
    const ctx = sharedAudioContext || new (window.AudioContext || window.webkitAudioContext)();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Tone 1: Gentle G5 (784 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(784, now);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.22);

    // Tone 2: Bright C6 (1046.5 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1046.5, now + 0.1);
    gain2.gain.setValueAtTime(0.24, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.45);
  } catch (err) {
    console.warn("Could not play synthesized notification audio:", err);
  }
}

/**
 * Trigger physical haptic vibration on mobile devices / smartphones
 */
export function triggerPhoneVibration(pattern = [120, 80, 150]) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (err) {
    // Vibration not supported or permitted on this device
  }
}

/**
 * Dispatch complete sound chime + phone vibration
 */
export function notifyWithSoundAndVibration() {
  playNotificationSound();
  triggerPhoneVibration([120, 80, 150]);
}
