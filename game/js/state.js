// The one shared object the game reads and writes, and the factory for a fresh round.
import { pickActiveDifferences, scenesInSet } from './scenes/index.js';
import { HINTS_PER_ROUND } from './hints.js';
import { makeRng, shuffled } from './util/rng.js';

export const app = {
  screen: 'menu', // menu | levels | playing | results
  run: null,
  queue: [], // scene ids still to play in a Daily Run
  queueIndex: 0,
  queueName: '',
  loupeOn: false,
  cursor: { x: 320, y: 240, visible: false },
  keyboardCursor: false,
  reducedMotion: false,
};

export function createRun(scene, seed) {
  return {
    scene,
    seed,
    active: pickActiveDifferences(scene, seed),
    found: new Set(),
    order: new Map(),
    mistakes: 0,
    hintsLeft: HINTS_PER_ROUND,
    hintsUsed: 0,
    hintReadyAt: 0,
    hint: null,
    timeTotal: scene.seconds,
    timeLeft: scene.seconds,
    elapsed: 0,
    paused: false,
    state: 'playing', // playing | won | lost
    combo: 0,
    bestCombo: 0,
    lastFindAt: 0,
    score: 0,
  };
}

// The Daily Run: one scene from each set, the same three for everybody on a given date.
export function buildDailyQueue(seed) {
  const rng = makeRng(seed);
  return [1, 2, 3].map((setId) => shuffled(scenesInSet(setId), rng)[0].id);
}
