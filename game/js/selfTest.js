// ?selftest: proves the game is fair. For every scene it renders the original and a copy
// with ONE difference switched on, measures the pixels that really changed, and checks that
// each difference is visible, sits inside its declared hit shape, stays inside the picture,
// does not overlap another, and that nothing changes anywhere that is not declared.
import { SCENES } from './scenes/index.js';
import { drawScene, PICTURE_WIDTH, PICTURE_HEIGHT } from './render/sceneRenderer.js';
import { distanceOutside, enclosingRadius, shapeBounds, shapesOverlap } from './scenes/differenceShape.js';

const PIXEL_THRESHOLD = 36; // summed channel difference that counts as "changed"
const SHAPE_SLACK = 8; // changed pixels may sit this far outside the declared shape
const MIN_CHANGED_PIXELS = 70;

function renderPixels(scene, ids) {
  const canvas = document.createElement('canvas');
  canvas.width = PICTURE_WIDTH;
  canvas.height = PICTURE_HEIGHT;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  drawScene(ctx, scene, ids);
  return ctx.getImageData(0, 0, PICTURE_WIDTH, PICTURE_HEIGHT).data;
}

// Visit every changed pixel and report its position to visit(x, y).
function eachChangedPixel(a, b, visit) {
  for (let y = 0; y < PICTURE_HEIGHT; y++) {
    for (let x = 0; x < PICTURE_WIDTH; x++) {
      const i = (y * PICTURE_WIDTH + x) * 4;
      const delta = Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
      if (delta > PIXEL_THRESHOLD) visit(x, y);
    }
  }
}

function checkScene(scene) {
  const lines = [];
  let ok = true;
  const fail = (text) => {
    ok = false;
    lines.push(`  FAIL ${text}`);
  };

  const base = renderPixels(scene, []);
  const again = renderPixels(scene, []);
  let wobble = 0;
  eachChangedPixel(base, again, () => wobble++);
  if (wobble > 0) fail(`two renders of the original differ in ${wobble} pixels (scene is not deterministic)`);

  const ids = scene.differences.map((d) => d.id);
  if (new Set(ids).size !== ids.length) fail('duplicate difference ids');
  if (scene.activeCount > scene.differences.length) fail('activeCount is larger than the number of differences');

  for (const diff of scene.differences) {
    const bounds = shapeBounds(diff);
    if (bounds.left < 0 || bounds.top < 0 || bounds.right > PICTURE_WIDTH || bounds.bottom > PICTURE_HEIGHT) fail(`${diff.id}: hit shape leaves the picture`);
    if (!diff.label) fail(`${diff.id}: no description`);

    const changed = renderPixels(scene, [diff.id]);
    let count = 0;
    let minX = 1e9;
    let minY = 1e9;
    let maxX = -1;
    let maxY = -1;
    let worstOutside = -1e9;
    eachChangedPixel(base, changed, (x, y) => {
      count++;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      worstOutside = Math.max(worstOutside, distanceOutside(diff, x, y));
    });
    const actual = count
      ? `bbox ${minX}-${maxX} x ${minY}-${maxY} (suggest x:${Math.round((minX + maxX) / 2)} y:${Math.round((minY + maxY) / 2)} r:${Math.round(Math.hypot(maxX - minX, maxY - minY) / 2) + 4})`
      : 'nothing changed';
    const note = `${diff.id}: ${count} px changed, ${actual}`;
    if (count < MIN_CHANGED_PIXELS) fail(`${note} -> too little to see`);
    else if (worstOutside > SHAPE_SLACK) fail(`${note} -> changes ${Math.round(worstOutside)}px outside the declared shape`);
    else if (enclosingRadius(diff) > Math.hypot(maxX - minX, maxY - minY) / 2 + 30) fail(`${note} -> declared shape is far larger than the change`);
    else lines.push(`  ok   ${note}`);
  }

  for (let i = 0; i < scene.differences.length; i++) {
    for (let j = i + 1; j < scene.differences.length; j++) {
      if (shapesOverlap(scene.differences[i], scene.differences[j])) fail(`${scene.differences[i].id} and ${scene.differences[j].id} overlap`);
    }
  }

  // Everything on at once: no pixel may change outside every declared shape.
  const everything = renderPixels(scene, ids);
  let stray = 0;
  let sample = '';
  eachChangedPixel(base, everything, (x, y) => {
    if (!scene.differences.some((d) => distanceOutside(d, x, y) <= SHAPE_SLACK)) {
      stray++;
      if (!sample) sample = `(${x},${y})`;
    }
  });
  if (stray) fail(`${stray} changed pixels lie outside every declared shape, first at ${sample}`);

  return { ok, text: `${ok ? 'PASS' : 'FAIL'} ${scene.id} (${scene.differences.length} differences, ${scene.activeCount} live)\n${lines.join('\n')}` };
}

export function runSelfTest() {
  const panel = document.getElementById('selftest-report');
  panel.hidden = false;
  const results = SCENES.map(checkScene);
  const allOk = results.every((r) => r.ok);
  panel.textContent = `${allOk ? 'ALL SCENES PASS' : 'SELF-TEST FAILED'}\n\n${results.map((r) => r.text).join('\n\n')}`;
  window.__selftest = { ok: allOk, report: panel.textContent };
  console.log(allOk ? 'selftest: all scenes pass' : 'selftest: FAILED');
  return allOk;
}
