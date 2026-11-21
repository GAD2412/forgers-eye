// The heads-up display: remaining counter, found pips, timer rail, hearts, hint button.
import { formatClock } from '../scoring.js';
import { timerBand } from '../timer.js';
import { hintStatus, HINTS_PER_ROUND } from '../hints.js';
import { getSet } from '../scenes/index.js';

const el = {};

export function bindHud() {
  for (const id of [
    'app', 'set-badge', 'scene-title', 'scene-meta', 'remaining-counter', 'remaining-number', 'remaining-word',
    'found-pips', 'score-value', 'combo-badge', 'hearts', 'hint-button', 'hint-uses', 'loupe-button',
    'pause-button', 'mute-button', 'timer-rail', 'timer-fill', 'timer-text', 'penalty-flash', 'toast',
    'panel-original', 'panel-copy',
  ]) el[id] = document.getElementById(id);
}

export function showRoundHeading(run) {
  const set = getSet(run.scene.setId);
  el['set-badge'].textContent = `SET ${set.numeral}`;
  el['scene-title'].textContent = run.scene.title;
  el['scene-meta'].textContent = `${set.difficulty} · ${set.name} · ${run.active.length} differences`;
  el['found-pips'].innerHTML = run.active.map(() => '<li></li>').join('');
  el['hearts'].querySelectorAll('li').forEach((heart) => heart.classList.remove('lost'));
  setToast('Click a difference in either picture.', 'neutral');
}

export function renderHud(run) {
  const remaining = run.active.length - run.found.size;
  const number = el['remaining-number'];
  const word = el['remaining-word'];
  if (remaining === 0) {
    number.textContent = '';
    word.textContent = run.state === 'won' ? 'ALL FOUND' : 'LEFT';
  } else {
    number.textContent = String(remaining);
    word.textContent = 'LEFT';
  }
  const pips = el['found-pips'].children;
  for (let i = 0; i < pips.length; i++) pips[i].classList.toggle('found', i < run.found.size);

  el['score-value'].textContent = run.score.toLocaleString('en-US');
  el['combo-badge'].hidden = run.combo < 1;
  el['combo-badge'].textContent = `x${1 + Math.min(run.combo, 4) * 0.25}`;

  const hearts = el['hearts'].children;
  for (let i = 0; i < hearts.length; i++) hearts[i].classList.toggle('lost', i >= 3 - run.mistakes);

  const ratio = run.timeLeft / run.timeTotal;
  el['timer-fill'].style.width = `${(ratio * 100).toFixed(2)}%`;
  el['timer-text'].textContent = formatClock(run.timeLeft);
  el['timer-rail'].setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
  el['app'].dataset.band = timerBand(run);

  const hint = hintStatus(run);
  const hintButton = el['hint-button'];
  hintButton.disabled = !hint.available;
  hintButton.classList.toggle('ready', hint.available);
  hintButton.style.setProperty('--cool', String(hint.cooldownRatio.toFixed(3)));
  el['hint-uses'].textContent = `${hint.usesLeft}/${HINTS_PER_ROUND}`;
}

export function pulseCounter() {
  const counter = el['remaining-counter'];
  counter.classList.remove('bump');
  void counter.offsetWidth;
  counter.classList.add('bump');
}

export function flashTimePenalty(seconds) {
  const flash = el['penalty-flash'];
  flash.textContent = `-${seconds}s`;
  flash.classList.remove('show');
  void flash.offsetWidth;
  flash.classList.add('show');
}

export function shakeFrames() {
  for (const frame of [el['panel-original'], el['panel-copy']]) {
    frame.classList.remove('shake');
    void frame.offsetWidth;
    frame.classList.add('shake');
  }
}

export function setToast(message, tone = 'neutral') {
  el['toast'].textContent = message;
  el['toast'].dataset.tone = tone;
}

export function setPressed(buttonId, pressed) {
  el[buttonId].setAttribute('aria-pressed', String(pressed));
}

export function setScreenMarker(name) {
  el['app'].dataset.screen = name;
}
