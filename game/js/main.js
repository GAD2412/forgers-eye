// Forger's Eye: wires the scenes, the round rules, the HUD, the sounds and the screens together.
import { app, createRun, buildDailyQueue } from './state.js';
import { SCENES, getScene } from './scenes/index.js';
import { paintPanel, PICTURE_WIDTH } from './render/sceneRenderer.js';
import { paintOverlay, resetEffects, addFoundEffect, addWrongClickEffect } from './render/markerEffects.js';
import { attachPointerInput, findDifferenceAt, isOnFoundDifference } from './input/clickDetector.js';
import { attachKeyboard } from './input/keyboardControls.js';
import { markFoundDifference, applyWrongClickPenalty, expireRound } from './round.js';
import { tickRound } from './timer.js';
import { revealHint } from './hints.js';
import { WRONG_CLICK_SECONDS, finalScore, starsFor } from './scoring.js';
import { todaySeed } from './util/rng.js';
import { getMutedPreference, recordResult, saveMutedPreference } from './storage/progress.js';
import * as sound from './audio/soundEffects.js';
import * as hud from './ui/hud.js';
import { renderLevels, renderMenu, renderPause, renderResults, showLayer } from './ui/screens.js';
import { runSelfTest } from './selfTest.js';

const query = new URLSearchParams(window.location.search);
const canvases = {};
const contexts = {};
const view = { scale: 1, cursor: app.cursor, loupeOn: false, sources: {} };
let lastFrame = performance.now();
let lastWholeSecond = -1;
let resultsTimer = 0;

function byId(id) {
  return document.getElementById(id);
}

// ---------- layout ----------

function fitPanels() {
  const stage = byId('stage');
  const gap = parseFloat(getComputedStyle(stage).columnGap) || 24;
  const chromeX = 2 * (11 + 9);
  const chromeY = 2 * (11 + 9) + 64;
  const byWidth = (stage.clientWidth - 40 - gap) / 2 - chromeX;
  const byHeight = ((stage.clientHeight - 26 - chromeY) * 4) / 3;
  stage.style.setProperty('--panel-w', `${Math.max(220, Math.floor(Math.min(byWidth, byHeight)))}px`);
}

function paintPictures() {
  const run = app.run;
  const scene = run ? run.scene : getScene('koi-pond');
  const activeIds = run ? run.active.map((d) => d.id) : [];
  paintPanel(canvases.original, scene, []);
  paintPanel(canvases.copy, scene, activeIds);
  for (const side of ['original', 'copy']) {
    canvases[`fx-${side}`].width = canvases[side].width;
    canvases[`fx-${side}`].height = canvases[side].height;
  }
  view.sources = { original: canvases.original, copy: canvases.copy };
  view.scale = canvases.original.clientWidth / PICTURE_WIDTH;
}

function relayout() {
  fitPanels();
  paintPictures();
}

// ---------- rounds ----------

function startRound(sceneId, seed) {
  const scene = getScene(sceneId);
  const roundSeed = seed !== undefined ? seed : Math.floor(Math.random() * 1e9);
  window.clearTimeout(resultsTimer);
  app.run = createRun(scene, roundSeed);
  app.screen = 'playing';
  resetEffects();
  hud.setScreenMarker('playing');
  hud.showRoundHeading(app.run);
  showLayer(null);
  relayout();
  hud.renderHud(app.run);
  lastWholeSecond = -1;
  app.loupeOn = false;
  view.loupeOn = false;
  hud.setPressed('loupe-button', false);
}

function startQueue(ids, name) {
  app.queue = ids;
  app.queueIndex = 0;
  app.queueName = name;
  startRound(ids[0], query.get('seed') ? Number(query.get('seed')) : undefined);
}

function openMenu() {
  window.clearTimeout(resultsTimer);
  app.screen = 'menu';
  hud.setScreenMarker('menu');
  renderMenu(menuHandlers);
  showLayer('screen-menu');
}

function openLevels() {
  window.clearTimeout(resultsTimer);
  if (app.run && app.run.state === 'playing') app.run.paused = true;
  app.screen = 'levels';
  hud.setScreenMarker('levels');
  renderLevels(menuHandlers);
  showLayer('screen-levels');
}

function pauseRound() {
  const run = app.run;
  if (!run || run.state !== 'playing' || run.paused) return;
  run.paused = true;
  renderPause(pauseHandlers);
  showLayer('screen-pause');
}

function resumeRound() {
  const run = app.run;
  if (!run || run.state !== 'playing') return;
  run.paused = false;
  showLayer(null);
}

function togglePause() {
  if (app.run && app.run.paused) resumeRound();
  else pauseRound();
}

function restartRound() {
  if (app.run) startRound(app.run.scene.id, app.run.seed);
}

function finishRound() {
  const run = app.run;
  const won = run.state === 'won';
  const stars = starsFor(run);
  const score = finalScore(run);
  const outcome = recordResult(run.scene.id, { stars, seconds: run.elapsed, score, won });
  const summary = { stars, score, ...outcome };
  if (won) sound.playWin();
  else sound.playLose();
  hud.setToast(won ? 'Every difference found.' : 'Time is up. The dashed rings show what you missed.', won ? 'good' : 'bad');
  resultsTimer = window.setTimeout(() => {
    app.screen = 'results';
    hud.setScreenMarker('results');
    const hasNext = app.queueIndex < app.queue.length - 1;
    renderResults(run, summary, { ...menuHandlers, hasNext, next: nextRound, retry: restartRound });
    showLayer('screen-results');
    if (won) for (let i = 0; i < stars; i++) window.setTimeout(() => sound.playStar(i), 330 * i + 200);
  }, won ? 1100 : 1900);
}

function nextRound() {
  if (app.queueIndex < app.queue.length - 1) {
    app.queueIndex += 1;
    startRound(app.queue[app.queueIndex]);
  } else {
    openLevels();
  }
}

// ---------- player actions ----------

function selectAt(x, y) {
  const run = app.run;
  if (!run || run.state !== 'playing' || run.paused || app.screen !== 'playing') return;
  sound.unlockAudio();
  const now = performance.now();
  const diff = findDifferenceAt(run, x, y);
  if (diff) {
    const result = markFoundDifference(run, diff);
    addFoundEffect(diff, result.order, now, app.reducedMotion);
    sound.playFind(result.combo);
    hud.pulseCounter();
    hud.setToast(`${result.order}/${run.active.length}  ${diff.label}  +${result.points}`, 'good');
    hud.renderHud(run);
    if (result.complete) finishRound();
  } else if (isOnFoundDifference(run, x, y)) {
    hud.setToast('Already marked. Look elsewhere.', 'neutral');
  } else {
    const result = applyWrongClickPenalty(run);
    addWrongClickEffect(x, y, now);
    sound.playMiss();
    if (!app.reducedMotion) hud.shakeFrames();
    hud.flashTimePenalty(WRONG_CLICK_SECONDS);
    hud.setToast(`Nothing changed there. -${WRONG_CLICK_SECONDS} seconds`, 'bad');
    hud.renderHud(run);
    if (result.outOfTime) finishRound();
  }
}

function useHint() {
  const run = app.run;
  if (!run || app.screen !== 'playing') return;
  const diff = revealHint(run, performance.now());
  if (!diff) return;
  sound.playHint();
  hud.setToast('Hint: something is hiding in the glowing area. -3 seconds', 'hint');
  hud.renderHud(run);
}

function moveCursor(dx, dy) {
  const cursor = app.cursor;
  if (!cursor.visible) {
    cursor.x = PICTURE_WIDTH / 2;
    cursor.y = 240;
  }
  cursor.visible = true;
  cursor.x = Math.min(PICTURE_WIDTH - 2, Math.max(2, cursor.x + dx));
  cursor.y = Math.min(478, Math.max(2, cursor.y + dy));
  app.keyboardCursor = true;
}

function toggleLoupe() {
  app.loupeOn = !app.loupeOn;
  view.loupeOn = app.loupeOn;
  hud.setPressed('loupe-button', app.loupeOn);
  hud.setToast(app.loupeOn ? 'Loupe on: both pictures are magnified at the same spot.' : 'Loupe off.', 'neutral');
}

function toggleMute() {
  const muted = !sound.isMuted();
  sound.setMuted(muted);
  saveMutedPreference(muted);
  hud.setPressed('mute-button', muted);
  hud.setToast(muted ? 'Sound off.' : 'Sound on.', 'neutral');
}

const menuHandlers = {
  openMenu,
  openLevels,
  startDaily: () => startQueue(buildDailyQueue(todaySeed()), 'Daily Run'),
  playScene: (id) => {
    const start = SCENES.findIndex((scene) => scene.id === id);
    startQueue(SCENES.slice(start).map((scene) => scene.id), 'Gallery');
  },
  playAll: () => startQueue(SCENES.map((scene) => scene.id), 'Gallery'),
  next: nextRound,
  retry: restartRound,
};

const pauseHandlers = { resume: resumeRound, restart: restartRound, openLevels };

// ---------- frame loop ----------

function frame(now) {
  window.requestAnimationFrame(frame); // scheduled first, so one bad frame can never stop the game
  now = performance.now();
  const dt = Math.min(0.5, Math.max(0, (now - lastFrame) / 1000));
  lastFrame = now;
  const run = app.run;
  if (run && app.screen === 'playing') {
    const status = tickRound(run, dt);
    if (status === 'timeout') {
      expireRound(run);
      finishRound();
    }
    if (run.state === 'playing') {
      const whole = Math.ceil(run.timeLeft);
      if (whole !== lastWholeSecond) {
        lastWholeSecond = whole;
        if (whole <= 10 && whole > 0) sound.playTick(true);
      }
    }
    hud.renderHud(run);
  }
  for (const side of ['original', 'copy']) {
    paintOverlay(contexts[side], side, app.screen === 'playing' || app.screen === 'results' ? run : null, view, now);
  }
}

// ---------- boot ----------

function boot() {
  for (const side of ['original', 'copy']) {
    canvases[side] = byId(`scene-${side}`);
    canvases[`fx-${side}`] = byId(`fx-${side}`);
    contexts[side] = canvases[`fx-${side}`].getContext('2d');
    attachPointerInput(canvases[`fx-${side}`], side, {
      onMove: (x, y) => {
        app.cursor.x = x;
        app.cursor.y = y;
        app.cursor.visible = true;
        app.keyboardCursor = false;
      },
      onLeave: () => {
        if (!app.keyboardCursor) app.cursor.visible = false;
      },
      onSelect: (x, y) => selectAt(x, y),
    });
  }
  hud.bindHud();
  app.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const muted = getMutedPreference();
  sound.setMuted(muted);
  hud.setPressed('mute-button', muted);

  byId('hint-button').addEventListener('click', useHint);
  byId('loupe-button').addEventListener('click', toggleLoupe);
  byId('pause-button').addEventListener('click', togglePause);
  byId('mute-button').addEventListener('click', toggleMute);

  attachKeyboard({
    moveCursor,
    selectAtCursor: () => selectAt(app.cursor.x, app.cursor.y),
    useHint,
    togglePause,
    restartRound,
    toggleLoupe,
    toggleMute,
    isPlaying: () => app.screen === 'playing' && Boolean(app.run) && app.run.state === 'playing',
    openMenu: () => {
      if (app.screen === 'playing') togglePause();
      else if (app.screen === 'results') openLevels();
      else if (app.screen === 'levels') openMenu();
    },
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseRound();
  });
  new ResizeObserver(() => relayout()).observe(byId('stage'));

  fitPanels();
  paintPictures();
  hud.renderHud(createRun(getScene('koi-pond'), 1));
  window.requestAnimationFrame(frame);

  window.forgersEye = { app, startRound, startQueue };
  if (query.has('selftest')) {
    runSelfTest();
    return;
  }
  const direct = query.get('scene');
  if (direct && SCENES.some((scene) => scene.id === direct)) {
    startQueue(SCENES.slice(SCENES.findIndex((scene) => scene.id === direct)).map((scene) => scene.id), 'Gallery');
  } else {
    openMenu();
  }
}

boot();
