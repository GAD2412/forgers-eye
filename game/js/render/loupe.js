// The loupe: a round lens that magnifies the spot under the cursor in BOTH panels at once,
// so the two pictures can be compared at the same place.
import { PICTURE_WIDTH } from './sceneRenderer.js';

export const LOUPE_ZOOM = 2.4;
export const LOUPE_RADIUS_PX = 74;

// ctx is in picture space; view.scale is CSS pixels per picture unit.
export function drawLoupe(ctx, source, x, y, view) {
  const radius = LOUPE_RADIUS_PX / view.scale;
  const sourceScale = source.width / PICTURE_WIDTH;
  const reach = radius / LOUPE_ZOOM;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#120c1a';
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  ctx.drawImage(
    source,
    (x - reach) * sourceScale, (y - reach) * sourceScale, reach * 2 * sourceScale, reach * 2 * sourceScale,
    x - radius, y - radius, radius * 2, radius * 2,
  );
  ctx.restore();

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#2a1a0a';
  ctx.lineWidth = 9 / view.scale;
  ctx.stroke();
  ctx.strokeStyle = '#e0b84a';
  ctx.lineWidth = 5 / view.scale;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, radius - 6 / view.scale, Math.PI * 1.1, Math.PI * 1.45);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 3 / view.scale;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 6 / view.scale, y);
  ctx.lineTo(x + 6 / view.scale, y);
  ctx.moveTo(x, y - 6 / view.scale);
  ctx.lineTo(x, y + 6 / view.scale);
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = 1.5 / view.scale;
  ctx.stroke();
}
