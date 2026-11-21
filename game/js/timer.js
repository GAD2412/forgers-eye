// The round clock: counts down while a round is playing and not paused.
import { WRONG_CLICK_SECONDS } from './scoring.js';

// Advance the clock by dt seconds. Returns 'timeout' the moment time runs out.
export function tickRound(run, dt) {
  if (run.state !== 'playing' || run.paused) return null;
  run.elapsed += dt;
  run.timeLeft = Math.max(0, run.timeLeft - dt);
  if (run.combo > 0 && run.elapsed - run.lastFindAt > 6) run.combo = 0;
  return run.timeLeft <= 0 ? 'timeout' : null;
}

export function takeTimePenalty(run, seconds = WRONG_CLICK_SECONDS) {
  run.timeLeft = Math.max(0, run.timeLeft - seconds);
  return run.timeLeft <= 0;
}

// calm, warn or urgent: drives the colour of the timer rail and the red edge glow.
export function timerBand(run) {
  if (run.timeLeft <= 15) return 'urgent';
  if (run.timeLeft / run.timeTotal <= 0.4) return 'warn';
  return 'calm';
}
