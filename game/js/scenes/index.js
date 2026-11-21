// The catalogue: three sets of scenes, raised in difficulty, and the helper that decides
// which of a scene's differences are live in a given round.
import { bakersWindow } from './bakersWindow.js';
import { koiPond } from './koiPond.js';
import { clockmakersBench } from './clockmakersBench.js';
import { glasshouseJungle } from './glasshouseJungle.js';
import { stargazersDome } from './stargazersDome.js';
import { atticOfToys } from './atticOfToys.js';
import { rooftopLaundry } from './rooftopLaundry.js';
import { coralCathedral } from './coralCathedral.js';
import { makeRng, shuffled } from '../util/rng.js';

export const SETS = [
  { id: 1, numeral: 'I', name: 'Morning Studio', difficulty: 'Easy', tagline: 'Warm light, bold changes' },
  { id: 2, numeral: 'II', name: 'Afternoon Gallery', difficulty: 'Medium', tagline: 'Smaller, craftier changes' },
  { id: 3, numeral: 'III', name: 'Midnight Vault', difficulty: 'Hard', tagline: 'Shade, shape and a single star' },
];

export const SCENES = [
  bakersWindow, koiPond,
  clockmakersBench, glasshouseJungle, rooftopLaundry,
  stargazersDome, atticOfToys, coralCathedral,
];

export function getScene(sceneId) {
  return SCENES.find((scene) => scene.id === sceneId) || SCENES[0];
}

export function getSet(setId) {
  return SETS.find((set) => set.id === setId) || SETS[0];
}

export function scenesInSet(setId) {
  return SCENES.filter((scene) => scene.setId === setId);
}

// A scene defines more differences than a round uses; the seed picks which ones are live,
// so replaying a scene is a fresh hunt rather than a memorised one.
export function pickActiveDifferences(scene, seed) {
  const rng = makeRng(seed ^ scene.id.length ^ (scene.seconds * 131));
  const chosen = new Set(shuffled(scene.differences, rng).slice(0, scene.activeCount).map((d) => d.id));
  return scene.differences.filter((d) => chosen.has(d.id));
}
