// Paper grain and a soft vignette laid over every finished scene, so both panels
// share one painted-on-paper look. Seeded, so original and copy get identical specks.
import { makeRng, hashString } from '../util/rng.js';

export function applyPaperGrain(ctx, width, height, key) {
  const rng = makeRng(hashString(key));
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = rng() < 0.5 ? 'rgba(255,248,230,0.07)' : 'rgba(40,20,10,0.06)';
    const s = 1 + rng() * 1.6;
    ctx.fillRect(rng() * width, rng() * height, s, s);
  }
  for (let i = 0; i < 70; i++) {
    ctx.strokeStyle = 'rgba(60,40,20,0.035)';
    ctx.lineWidth = 1;
    const x = rng() * width;
    const y = rng() * height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rng() - 0.5) * 40, y + (rng() - 0.5) * 8);
    ctx.stroke();
  }
  const g = ctx.createRadialGradient(width / 2, height / 2, height * 0.38, width / 2, height / 2, height * 0.95);
  g.addColorStop(0, 'rgba(18,8,28,0)');
  g.addColorStop(1, 'rgba(18,8,28,0.34)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}
