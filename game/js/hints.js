// The hint: a golden glow over a region that hides one still-unfound difference.
// Limited uses, a cooldown, and a small time cost, so it is a decision and not a crutch.
import { enclosingRadius } from './scenes/differenceShape.js';

export const HINTS_PER_ROUND = 3;
export const HINT_COOLDOWN_SECONDS = 9;
export const HINT_GLOW_MS = 3200;
export const HINT_TIME_COST_SECONDS = 3;

export function hintStatus(run) {
  const remaining = run.active.length - run.found.size;
  const cooldownLeft = Math.max(0, run.hintReadyAt - run.elapsed);
  return {
    usesLeft: run.hintsLeft,
    cooldownLeft,
    cooldownRatio: cooldownLeft / HINT_COOLDOWN_SECONDS,
    available: run.state === 'playing' && !run.paused && run.hintsLeft > 0 && cooldownLeft <= 0 && remaining > 0,
  };
}

// Returns the revealed difference, or null if no hint could be given.
export function revealHint(run, now) {
  if (!hintStatus(run).available) return null;
  const unfound = run.active.filter((diff) => !run.found.has(diff.id));
  const diff = unfound[Math.floor(Math.random() * unfound.length)];
  // The glow is centred a little off the difference, so it narrows the search without pointing at it.
  const angle = Math.random() * Math.PI * 2;
  const drift = enclosingRadius(diff) * 0.5;
  run.hint = {
    diffId: diff.id,
    x: diff.x + Math.cos(angle) * drift,
    y: diff.y + Math.sin(angle) * drift,
    radius: enclosingRadius(diff) + 46,
    born: now,
    until: now + HINT_GLOW_MS,
  };
  run.hintsLeft -= 1;
  run.hintsUsed += 1;
  run.hintReadyAt = run.elapsed + HINT_COOLDOWN_SECONDS;
  run.timeLeft = Math.max(1, run.timeLeft - HINT_TIME_COST_SECONDS);
  return diff;
}
