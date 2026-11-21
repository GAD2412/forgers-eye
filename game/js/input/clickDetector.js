// Turns a pointer position on either picture into a difference (or a miss).
// The hit radius is forgiving: a click a little outside a shape still counts.
import { distanceOutside } from '../scenes/differenceShape.js';
import { PICTURE_HEIGHT, PICTURE_WIDTH } from '../render/sceneRenderer.js';

export const FORGIVENESS = 11; // picture units around each hit shape

// The nearest unfound difference within the forgiveness margin, or null.
export function findDifferenceAt(run, x, y) {
  let best = null;
  let bestDistance = Infinity;
  for (const diff of run.active) {
    if (run.found.has(diff.id)) continue;
    const distance = distanceOutside(diff, x, y);
    if (distance <= FORGIVENESS && distance < bestDistance) {
      best = diff;
      bestDistance = distance;
    }
  }
  return best;
}

// A click on a marker that is already placed is not a mistake.
export function isOnFoundDifference(run, x, y) {
  return run.active.some((diff) => run.found.has(diff.id) && distanceOutside(diff, x, y) <= FORGIVENESS);
}

export function toPicturePoint(canvas, event) {
  const box = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - box.left) / box.width) * PICTURE_WIDTH,
    y: ((event.clientY - box.top) / box.height) * PICTURE_HEIGHT,
  };
}

// handlers: { onSelect(x, y, side), onMove(x, y, side), onLeave() }
export function attachPointerInput(canvas, side, handlers) {
  canvas.addEventListener('pointermove', (event) => {
    const p = toPicturePoint(canvas, event);
    handlers.onMove(p.x, p.y, side);
  });
  canvas.addEventListener('pointerleave', () => handlers.onLeave());
  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const p = toPicturePoint(canvas, event);
    handlers.onSelect(p.x, p.y, side);
  });
  canvas.addEventListener('contextmenu', (event) => event.preventDefault());
}
