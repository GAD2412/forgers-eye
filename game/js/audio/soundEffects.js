// Every sound is synthesised here with the Web Audio API: no audio files, no network.
// Glass-bell chimes for finds, a dull buzz for slips, a rising shimmer for hints.

let audio = null;
let master = null;
let muted = false;

const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66];

function ensureAudio() {
  if (!audio) {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return null;
    audio = new Context();
    master = audio.createGain();
    master.gain.value = muted ? 0 : 0.55;
    master.connect(audio.destination);
  }
  if (audio.state === 'suspended') audio.resume();
  return audio;
}

export function unlockAudio() {
  ensureAudio();
}

export function setMuted(value) {
  muted = Boolean(value);
  if (master) master.gain.value = muted ? 0 : 0.55;
}

export function isMuted() {
  return muted;
}

function tone({ freq, type = 'sine', start = 0, duration = 0.2, gain = 0.2, slideTo = null, attack = 0.006 }) {
  const ctx = ensureAudio();
  if (!ctx || muted) return;
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + attack);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(amp);
  amp.connect(master);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export function playFind(comboStep = 0) {
  const note = PENTATONIC[Math.min(comboStep, PENTATONIC.length - 1)];
  tone({ freq: note, duration: 0.45, gain: 0.22 });
  tone({ freq: note * 2.01, type: 'triangle', start: 0.03, duration: 0.3, gain: 0.1 });
  tone({ freq: note * 3, start: 0.07, duration: 0.22, gain: 0.05 });
  tone({ freq: note * 1.5, start: 0.11, duration: 0.3, gain: 0.08 });
}

export function playMiss() {
  tone({ freq: 190, type: 'sawtooth', duration: 0.28, gain: 0.13, slideTo: 90 });
  tone({ freq: 140, type: 'square', start: 0.05, duration: 0.22, gain: 0.07, slideTo: 70 });
}

export function playHint() {
  [660, 830, 990, 1245, 1480].forEach((freq, i) => tone({ freq, start: i * 0.06, duration: 0.3, gain: 0.09 }));
}

export function playTick(urgent) {
  tone({ freq: urgent ? 1500 : 1100, type: 'square', duration: 0.035, gain: urgent ? 0.07 : 0.04 });
}

export function playClick() {
  tone({ freq: 760, type: 'triangle', duration: 0.07, gain: 0.08 });
}

export function playStar(index) {
  tone({ freq: PENTATONIC[index + 2], duration: 0.5, gain: 0.2 });
  tone({ freq: PENTATONIC[index + 2] * 2, type: 'triangle', start: 0.02, duration: 0.35, gain: 0.08 });
}

export function playWin() {
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => tone({ freq, type: 'triangle', start: i * 0.11, duration: 0.5, gain: 0.16 }));
  tone({ freq: 1568, start: 0.5, duration: 0.7, gain: 0.08 });
}

export function playLose() {
  [392, 349.23, 293.66, 220].forEach((freq, i) => tone({ freq, type: 'triangle', start: i * 0.16, duration: 0.45, gain: 0.14 }));
}
