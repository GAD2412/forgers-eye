// Geometry for a difference's hit shape. A difference is either a circle (x, y, r)
// or a rectangle centred on (x, y) with width w and height h.

export function isRectShape(diff) {
  return diff.w !== undefined && diff.h !== undefined;
}

// Radius of the smallest circle that encloses the shape (used to size markers).
export function enclosingRadius(diff) {
  return isRectShape(diff) ? Math.hypot(diff.w, diff.h) / 2 : diff.r;
}

// How far (px, y) lies outside the shape: 0 or less means inside.
export function distanceOutside(diff, px, py) {
  if (isRectShape(diff)) {
    const dx = Math.max(Math.abs(px - diff.x) - diff.w / 2, 0);
    const dy = Math.max(Math.abs(py - diff.y) - diff.h / 2, 0);
    return Math.hypot(dx, dy);
  }
  return Math.hypot(px - diff.x, py - diff.y) - diff.r;
}

export function shapeBounds(diff) {
  if (isRectShape(diff)) {
    return { left: diff.x - diff.w / 2, top: diff.y - diff.h / 2, right: diff.x + diff.w / 2, bottom: diff.y + diff.h / 2 };
  }
  return { left: diff.x - diff.r, top: diff.y - diff.r, right: diff.x + diff.r, bottom: diff.y + diff.r };
}

export function shapesOverlap(a, b) {
  const ab = shapeBounds(a);
  const bb = shapeBounds(b);
  if (ab.right < bb.left || bb.right < ab.left || ab.bottom < bb.top || bb.bottom < ab.top) return false;
  if (!isRectShape(a) && !isRectShape(b)) return Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r;
  if (isRectShape(a) && isRectShape(b)) return true;
  const [box, disc] = isRectShape(a) ? [a, b] : [b, a];
  return distanceOutside(box, disc.x, disc.y) < disc.r;
}
