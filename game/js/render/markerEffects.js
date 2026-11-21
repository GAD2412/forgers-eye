// The live layer above each picture: found-difference rings, sparkles, hint glow, wrong-click
// crosses, the mirrored cursor, and (after a lost round) dashed rings on what was missed.
// Everything is drawn in picture space; sizes given in "px" are CSS pixels, so a ring is the
// same thickness on screen whatever the panel size.
import { enclosingRadius } from '../scenes/differenceShape.js';
import { drawLoupe } from './loupe.js';
import { TAU } from './shapes.js';

const rings = [];
const sparks = [];
const crosses = [];

export function resetEffects() {
  rings.length = 0;
  sparks.length = 0;
  crosses.length = 0;
}

function easeOutBack(t) {
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}

export function addFoundEffect(diff, order, now, calm) {
  rings.push({ diff, order, born: now });
  if (calm) return;
  for (let i = 0; i < 16; i++) {
    const angle = Math.random() * TAU;
    const speed = 40 + Math.random() * 90;
    sparks.push({
      x: diff.x, y: diff.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 20,
      born: now, life: 650 + Math.random() * 350, size: 2 + Math.random() * 3, warm: Math.random() < 0.6,
    });
  }
}

export function addWrongClickEffect(x, y, now) {
  crosses.push({ x, y, born: now });
}

function drawMarker(ctx, ring, now, view, hasBeenFound) {
  const age = Math.max(0, now - ring.born);
  const base = enclosingRadius(ring.diff) + 8 / view.scale;
  const grow = Math.min(1, age / 420);
  const radius = base * (0.3 + 0.7 * easeOutBack(grow));
  const { x, y } = ring.diff;
  if (age < 650) {
    const t = age / 650;
    ctx.beginPath();
    ctx.arc(x, y, base + (36 * t) / view.scale, 0, TAU);
    ctx.strokeStyle = `rgba(255,243,196,${0.8 * (1 - t)})`;
    ctx.lineWidth = (6 * (1 - t) + 1) / view.scale;
    ctx.stroke();
    const flash = ctx.createRadialGradient(x, y, 0, x, y, base * 1.4);
    flash.addColorStop(0, `rgba(255,236,160,${0.55 * (1 - t)})`);
    flash.addColorStop(1, 'rgba(255,236,160,0)');
    ctx.fillStyle = flash;
    ctx.beginPath();
    ctx.arc(x, y, base * 1.4, 0, TAU);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.strokeStyle = 'rgba(24,12,34,0.92)';
  ctx.lineWidth = 9 / view.scale;
  ctx.stroke();
  ctx.strokeStyle = '#fff3c4';
  ctx.lineWidth = 5 / view.scale;
  ctx.stroke();
  ctx.setLineDash([2 / view.scale, 11 / view.scale]);
  ctx.strokeStyle = '#e0a020';
  ctx.lineWidth = 2 / view.scale;
  ctx.stroke();
  ctx.setLineDash([]);

  // Number badge: the marker is told apart by shape and number, never by colour alone.
  const badge = 11 / view.scale;
  const bx = x + Math.cos(-0.8) * radius;
  const by = y + Math.sin(-0.8) * radius;
  ctx.beginPath();
  ctx.arc(bx, by, badge, 0, TAU);
  ctx.fillStyle = '#fff3c4';
  ctx.fill();
  ctx.strokeStyle = 'rgba(24,12,34,0.95)';
  ctx.lineWidth = 2.5 / view.scale;
  ctx.stroke();
  ctx.fillStyle = '#241238';
  ctx.font = `800 ${14 / view.scale}px "Avenir Next Condensed", "Arial Narrow", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(ring.order), bx, by + 0.5 / view.scale);
}

function drawSparks(ctx, now, view) {
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    const age = Math.max(0, now - s.born);
    if (age > s.life) {
      sparks.splice(i, 1);
      continue;
    }
    const t = age / s.life;
    const px = s.x + (s.vx * age) / 1000;
    const py = s.y + (s.vy * age) / 1000 + 60 * (age / 1000) * (age / 1000);
    const size = (s.size * (1 - t)) / view.scale + 0.4;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(t * 5);
    ctx.fillStyle = s.warm ? `rgba(255,214,96,${1 - t})` : `rgba(255,255,255,${1 - t})`;
    ctx.beginPath();
    for (let k = 0; k < 8; k++) {
      const r = k % 2 === 0 ? size * 2.4 : size * 0.6;
      const a = (k * Math.PI) / 4;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function drawCrosses(ctx, now, view) {
  for (let i = crosses.length - 1; i >= 0; i--) {
    const c = crosses[i];
    const age = Math.max(0, now - c.born);
    if (age > 700) {
      crosses.splice(i, 1);
      continue;
    }
    const t = age / 700;
    const arm = (10 + 6 * t) / view.scale;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(0.15 * (1 - t));
    ctx.lineCap = 'round';
    for (const [colour, width] of [['rgba(24,12,34,' + (1 - t) + ')', 9], ['rgba(255,110,96,' + (1 - t) + ')', 5]]) {
      ctx.strokeStyle = colour;
      ctx.lineWidth = width / view.scale;
      ctx.beginPath();
      ctx.moveTo(-arm, -arm);
      ctx.lineTo(arm, arm);
      ctx.moveTo(arm, -arm);
      ctx.lineTo(-arm, arm);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawHint(ctx, hint, now, view) {
  const pulse = 0.5 + 0.5 * Math.sin(now / 160);
  const left = hint.until - now;
  const fade = Math.max(0, Math.min(1, left / 500, Math.max(0, now - hint.born) / 200 + 0.2));
  const radius = hint.radius * (0.92 + 0.08 * pulse);
  const g = ctx.createRadialGradient(hint.x, hint.y, 0, hint.x, hint.y, radius);
  g.addColorStop(0, `rgba(255,224,120,${0.5 * fade})`);
  g.addColorStop(0.7, `rgba(255,200,80,${0.28 * fade})`);
  g.addColorStop(1, 'rgba(255,200,80,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(hint.x, hint.y, radius, 0, TAU);
  ctx.fill();
  ctx.save();
  ctx.setLineDash([10 / view.scale, 8 / view.scale]);
  ctx.lineDashOffset = -now / 40 / view.scale;
  ctx.strokeStyle = `rgba(255,243,196,${0.95 * fade})`;
  ctx.lineWidth = 3 / view.scale;
  ctx.beginPath();
  ctx.arc(hint.x, hint.y, radius * 0.86, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

function drawCursor(ctx, cursor, view) {
  const r = 13 / view.scale;
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, r, 0, TAU);
  ctx.strokeStyle = 'rgba(24,12,34,0.85)';
  ctx.lineWidth = 5 / view.scale;
  ctx.stroke();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.2 / view.scale;
  ctx.stroke();
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    ctx.beginPath();
    ctx.moveTo(cursor.x + dx * r * 1.3, cursor.y + dy * r * 1.3);
    ctx.lineTo(cursor.x + dx * r * 2.1, cursor.y + dy * r * 2.1);
    ctx.stroke();
  }
}

function drawMissed(ctx, diff, now, view) {
  const radius = enclosingRadius(diff) + 8 / view.scale;
  ctx.save();
  ctx.setLineDash([8 / view.scale, 7 / view.scale]);
  ctx.lineDashOffset = -now / 50 / view.scale;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, radius, 0, TAU);
  ctx.strokeStyle = 'rgba(24,12,34,0.9)';
  ctx.lineWidth = 7 / view.scale;
  ctx.stroke();
  ctx.strokeStyle = '#ff9d8a';
  ctx.lineWidth = 3.5 / view.scale;
  ctx.stroke();
  ctx.restore();
}

// Paint one panel's overlay. `run` is the current round, `view` carries the scale, the
// shared cursor, the loupe state and the two scene canvases (for the loupe).
export function paintOverlay(ctx, side, run, view, now) {
  const canvas = ctx.canvas;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!run) return;
  ctx.setTransform(canvas.width / 640, 0, 0, canvas.height / 480, 0, 0);

  if (run.hint && now < run.hint.until) drawHint(ctx, run.hint, now, view);
  for (const ring of rings) drawMarker(ctx, ring, now, view);
  if (run.state === 'lost') {
    for (const diff of run.active) if (!run.found.has(diff.id)) drawMissed(ctx, diff, now, view);
  }
  drawSparks(ctx, now, view);
  drawCrosses(ctx, now, view);
  if (view.cursor && view.cursor.visible && run.state === 'playing') {
    if (view.loupeOn) drawLoupe(ctx, view.sources[side], view.cursor.x, view.cursor.y, view);
    else drawCursor(ctx, view.cursor, view);
  }
}
