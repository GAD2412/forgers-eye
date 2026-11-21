// Hand-written drawing helpers shared by every scene.
// All scenes are painted with these: flat gouache shapes, soft shadows, no image files.

export const TAU = Math.PI * 2;

export function hexAlpha(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

function paint(ctx, fill, stroke, lineWidth) {
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth || 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

export function rect(ctx, x, y, w, h, fill, stroke, lineWidth) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  paint(ctx, fill, stroke, lineWidth);
}

export function roundRect(ctx, x, y, w, h, radius, fill, stroke, lineWidth) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  paint(ctx, fill, stroke, lineWidth);
}

export function circle(ctx, x, y, r, fill, stroke, lineWidth) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  paint(ctx, fill, stroke, lineWidth);
}

export function ellipse(ctx, x, y, rx, ry, fill, stroke, lineWidth, rotation = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, TAU);
  paint(ctx, fill, stroke, lineWidth);
}

// points: flat [x0, y0, x1, y1, ...]
export function polygon(ctx, points, fill, stroke, lineWidth) {
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length; i += 2) ctx.lineTo(points[i], points[i + 1]);
  ctx.closePath();
  paint(ctx, fill, stroke, lineWidth);
}

export function line(ctx, x1, y1, x2, y2, stroke, lineWidth = 2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  paint(ctx, null, stroke, lineWidth);
}

// Quadratic curve stroke: [x0, y0, cx, cy, x1, y1]
export function curve(ctx, p, stroke, lineWidth = 2) {
  ctx.beginPath();
  ctx.moveTo(p[0], p[1]);
  ctx.quadraticCurveTo(p[2], p[3], p[4], p[5]);
  paint(ctx, null, stroke, lineWidth);
}

export function verticalGradient(ctx, x, y, w, h, stops) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  for (const [at, colour] of stops) g.addColorStop(at, colour);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

export function glow(ctx, x, y, radius, colour, alpha = 0.5) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, hexAlpha(colour, alpha));
  g.addColorStop(1, hexAlpha(colour, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

export function softShadow(ctx, x, y, rx, ry, alpha = 0.25) {
  ellipse(ctx, x, y, rx, ry, `rgba(20,10,30,${alpha})`);
}

export function star(ctx, x, y, radius, points, fill, rotation = 0, innerRatio = 0.5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? radius : radius * innerRatio;
    const a = rotation + (i * Math.PI) / points - Math.PI / 2;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  paint(ctx, fill);
}

export function cloud(ctx, x, y, scale, fill) {
  circle(ctx, x, y, 14 * scale, fill);
  circle(ctx, x + 18 * scale, y - 8 * scale, 18 * scale, fill);
  circle(ctx, x + 40 * scale, y - 2 * scale, 15 * scale, fill);
  roundRect(ctx, x - 14 * scale, y, 70 * scale, 14 * scale, 7 * scale, fill);
}

// A glyph row with fixed advance, so a letter's position is known exactly.
export function spacedText(ctx, text, cx, y, size, advance, fill, family = 'Georgia, serif', weight = '700') {
  ctx.font = `${weight} ${size}px ${family}`;
  ctx.fillStyle = fill;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const start = cx - ((text.length - 1) * advance) / 2;
  for (let i = 0; i < text.length; i++) ctx.fillText(text[i], start + i * advance, y);
}

export function label(ctx, text, x, y, size, fill, align = 'center', family = 'Georgia, serif', weight = '700') {
  ctx.font = `${weight} ${size}px ${family}`;
  ctx.fillStyle = fill;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

// Rotated rounded bar: baguettes, brush handles, pencils, shelves in perspective.
export function bar(ctx, cx, cy, length, thickness, angle, fill, stroke, lineWidth) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  roundRect(ctx, -length / 2, -thickness / 2, length, thickness, thickness / 2, fill, stroke, lineWidth);
  ctx.restore();
}
