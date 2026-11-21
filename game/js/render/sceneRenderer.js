// Paints a scene into a canvas. Scenes live in a fixed 640x480 picture space; this file
// scales that space to whatever size the panel currently has.
import { applyPaperGrain } from './paperGrain.js';

export const PICTURE_WIDTH = 640;
export const PICTURE_HEIGHT = 480;

// Draw one picture into ctx in picture space (origin top-left, 640x480).
export function drawScene(ctx, scene, activeIds) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, PICTURE_WIDTH, PICTURE_HEIGHT);
  ctx.clip();
  scene.draw(ctx, new Set(activeIds));
  applyPaperGrain(ctx, PICTURE_WIDTH, PICTURE_HEIGHT, scene.id);
  ctx.restore();
}

// Size a canvas to its CSS box (times device pixel ratio) and paint the scene into it.
export function paintPanel(canvas, scene, activeIds, maxRatio = 2) {
  const box = canvas.getBoundingClientRect();
  // At least 1.6x, so the loupe has real detail to magnify even on a 1x screen.
  const ratio = Math.min(Math.max(window.devicePixelRatio || 1, 1.6), maxRatio);
  const width = Math.max(8, Math.round(box.width * ratio));
  const height = Math.max(6, Math.round((width * PICTURE_HEIGHT) / PICTURE_WIDTH));
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(width / PICTURE_WIDTH, 0, 0, height / PICTURE_HEIGHT, 0, 0);
  drawScene(ctx, scene, activeIds);
}

// Small preview used by the level cards and the menu.
export function paintThumbnail(canvas, scene, activeIds = []) {
  canvas.width = 224;
  canvas.height = 168;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(224 / PICTURE_WIDTH, 0, 0, 168 / PICTURE_HEIGHT, 0, 0);
  drawScene(ctx, scene, activeIds);
}
