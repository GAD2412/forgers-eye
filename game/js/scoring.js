// Points, combos and stars. Stars reward time left on the clock and few slips.

export const WRONG_CLICK_SECONDS = 5;
export const WRONG_CLICK_POINTS = 50;
export const COMBO_WINDOW_SECONDS = 6;

// Points for one find: a base, a bonus for being quick after the previous find, and a combo multiplier.
export function pointsForFind(secondsSinceLast, comboStep) {
  const speedBonus = Math.max(0, Math.round(60 - secondsSinceLast * 6));
  const multiplier = 1 + Math.min(comboStep, 4) * 0.25;
  return Math.round((100 + speedBonus) * multiplier);
}

// 0 stars if the clock ran out, otherwise 1 to 3.
export function starsFor(run) {
  if (run.state !== 'won') return 0;
  const ratio = run.timeLeft / run.timeTotal;
  if (ratio >= 0.45 && run.mistakes <= 2) return 3;
  if (ratio >= 0.2) return 2;
  return 1;
}

export function finalScore(run) {
  const timeBonus = run.state === 'won' ? Math.round(run.timeLeft * 10) : 0;
  const perfectBonus = run.state === 'won' && run.mistakes === 0 ? 300 : 0;
  return Math.max(0, run.score + timeBonus + perfectBonus);
}

export function verdictFor(run, stars) {
  if (run.state === 'lost') return 'The forger got away';
  if (stars === 3 && run.mistakes === 0) return 'A flawless authentication';
  if (stars === 3) return 'Sharp eye, curator';
  if (stars === 2) return 'Well spotted';
  return 'Caught them, just in time';
}

export function formatClock(seconds) {
  const whole = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}
