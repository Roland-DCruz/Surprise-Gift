// systems/SoundSystem.js

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone({ frequency = 440, type = 'sine', duration = 0.15, gain = 0.3, startTime = 0, decay = true }) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTime);
    gainNode.gain.setValueAtTime(gain, ctx.currentTime + startTime);
    if (decay) {
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
    }
    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
  } catch (e) {
    // Silently fail if audio not available
  }
}

export function playSpinStart() {
  // Rising sweep
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.4);
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
}

export function playTick() {
  playTone({ frequency: 800, type: 'square', duration: 0.04, gain: 0.15, decay: true });
}

export function playWinNormal() {
  [0, 0.12, 0.24].forEach((t, i) => {
    playTone({ frequency: 523 + i * 130, type: 'sine', duration: 0.25, gain: 0.3, startTime: t });
  });
}

export function playWinRare() {
  [523, 659, 784, 1047].forEach((f, i) => {
    playTone({ frequency: f, type: 'triangle', duration: 0.3, gain: 0.35, startTime: i * 0.1 });
  });
}

export function playWinEpic() {
  // Big fanfare
  const notes = [523, 659, 784, 1047, 1319];
  notes.forEach((f, i) => {
    playTone({ frequency: f, type: 'sine', duration: 0.5, gain: 0.4, startTime: i * 0.08 });
    playTone({ frequency: f * 2, type: 'triangle', duration: 0.3, gain: 0.2, startTime: i * 0.08 + 0.05 });
  });
}
