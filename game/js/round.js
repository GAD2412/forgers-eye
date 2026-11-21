// What happens to a round when the player finds a difference or slips.
// Pure state changes: sound, effects and HUD are triggered by main.js from the results.
import { COMBO_WINDOW_SECONDS, WRONG_CLICK_POINTS, pointsForFind } from './scoring.js';
import { takeTimePenalty } from './timer.js';

export function markFoundDifference(run, diff) {
  const sinceLast = run.elapsed - run.lastFindAt;
  run.found.add(diff.id);
  const order = run.found.size;
  run.order.set(diff.id, order);
  run.combo = order > 1 && sinceLast <= COMBO_WINDOW_SECONDS ? run.combo + 1 : 0;
  run.bestCombo = Math.max(run.bestCombo, run.combo);
  const points = pointsForFind(sinceLast, run.combo);
  run.score += points;
  run.lastFindAt = run.elapsed;
  run.hint = run.hint && run.hint.diffId === diff.id ? null : run.hint;
  const complete = run.found.size === run.active.length;
  if (complete) run.state = 'won';
  return { points, order, combo: run.combo, complete };
}

export function applyWrongClickPenalty(run) {
  run.mistakes += 1;
  run.combo = 0;
  run.score = Math.max(0, run.score - WRONG_CLICK_POINTS);
  const outOfTime = takeTimePenalty(run);
  if (outOfTime) run.state = 'lost';
  return { outOfTime, heartsLeft: Math.max(0, 3 - run.mistakes) };
}

export function expireRound(run) {
  if (run.state === 'playing') run.state = 'lost';
}
