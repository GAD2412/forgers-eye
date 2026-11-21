// Set II, scene 4: a Victorian glasshouse. Iron ribs, a fountain, palms, a patient tortoise.
import {
  rect, roundRect, circle, ellipse, polygon, line, curve, verticalGradient, glow, softShadow,
  label, bar,
} from '../render/shapes.js';
import { makeRng } from '../util/rng.js';

const FROND_ANGLES = [-170, -140, -115, -90, -65, -40, -10];

function drawFrond(ctx, cx, cy, degrees, length) {
  const a = (degrees * Math.PI) / 180;
  const tipX = cx + Math.cos(a) * length;
  const tipY = cy + Math.sin(a) * length * 0.6 + 30;
  const midX = cx + Math.cos(a) * length * 0.5;
  const midY = cy + Math.sin(a) * length * 0.6 - 10;
  curve(ctx, [cx, cy, midX, midY, tipX, tipY], '#2f7a45', 7);
  for (let i = 1; i < 7; i++) {
    const t = i / 7;
    const px = (1 - t) * (1 - t) * cx + 2 * (1 - t) * t * midX + t * t * tipX;
    const py = (1 - t) * (1 - t) * cy + 2 * (1 - t) * t * midY + t * t * tipY;
    line(ctx, px, py, px - 4, py + 14 - t * 4, '#3f9a55', 3);
    line(ctx, px, py, px + 4, py - 12 + t * 4, '#3f9a55', 3);
  }
}

export const glasshouseJungle = {
  id: 'glasshouse-jungle',
  title: 'Glasshouse Jungle',
  setId: 2,
  seconds: 140,
  activeCount: 8,
  differences: [
    { id: 'butterfly-blue', kind: 'colour', x: 470, y: 168, r: 22, label: 'The butterfly changed its wing colour' },
    { id: 'fountain-jet', kind: 'missing', x: 343, y: 351, r: 32, label: 'One fountain jet stopped' },
    { id: 'basket-blooms', kind: 'colour', x: 170, y: 100, r: 24, label: 'The hanging basket flowers turned yellow' },
    { id: 'palm-frond', kind: 'missing', x: 66, y: 240, r: 30, label: 'A palm frond is missing' },
    { id: 'orchid-bloom', kind: 'missing', x: 432, y: 292, r: 15, label: 'The top orchid bloom is gone' },
    { id: 'tortoise-leaf', kind: 'added', x: 280, y: 450, r: 13, label: 'The tortoise holds a leaf' },
    { id: 'pot-band', kind: 'colour', x: 616, y: 391, r: 15, label: 'A flower pot band changed colour' },
    { id: 'packet-text', kind: 'text', x: 553, y: 385, r: 15, label: 'A seed packet reads FERM instead of FERN' },
    { id: 'ladder-rung', kind: 'missing', x: 615, y: 330, r: 15, label: 'A ladder rung is missing' },
    { id: 'glass-crack', kind: 'added', x: 570, y: 64, r: 28, label: 'A pane of glass is cracked' },
    { id: 'cobweb', kind: 'added', x: 30, y: 30, w: 60, h: 60, label: 'A cobweb hangs in the corner' },
    { id: 'can-red', kind: 'colour', x: 495, y: 379, r: 38, label: 'The watering can turned red' },
  ],
  draw(ctx, on) {
    const rng = makeRng(4404);

    verticalGradient(ctx, 0, 0, 640, 480, [[0, '#d7efdc'], [0.5, '#86c7a0'], [1, '#3c7a5a']]);
    glow(ctx, 320, 0, 360, '#fffbe0', 0.55);

    // Iron ribs of the glass roof
    ctx.lineCap = 'butt';
    [380, 300, 220, 140].forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(320, 430, r, Math.PI, Math.PI * 2);
      ctx.strokeStyle = 'rgba(32,64,50,0.8)';
      ctx.lineWidth = i === 0 ? 7 : 3.5;
      ctx.stroke();
    });
    for (let a = -170; a <= -10; a += 20) {
      const rad = (a * Math.PI) / 180;
      line(ctx, 320 + Math.cos(rad) * 60, 430 + Math.sin(rad) * 60, 320 + Math.cos(rad) * 380, 430 + Math.sin(rad) * 380, 'rgba(32,64,50,0.7)', 3);
    }

    if (on.has('glass-crack')) {
      [[548, 40, 560, 58], [560, 58, 556, 74], [556, 74, 578, 80], [578, 80, 574, 96], [560, 58, 586, 50], [578, 80, 596, 76]].forEach(([x1, y1, x2, y2]) => line(ctx, x1, y1, x2, y2, 'rgba(255,255,255,0.85)', 1.5));
    }
    if (on.has('cobweb')) {
      [[56, 8], [48, 30], [30, 48], [8, 56]].forEach(([x, y]) => line(ctx, 0, 0, x, y, 'rgba(255,255,255,0.7)', 1));
      [0.45, 0.75, 1].forEach((k) => {
        ctx.beginPath();
        ctx.moveTo(56 * k, 8 * k);
        ctx.quadraticCurveTo(40 * k, 30 * k, 48 * k, 30 * k + 0.1);
        ctx.quadraticCurveTo(36 * k, 38 * k, 30 * k, 48 * k);
        ctx.quadraticCurveTo(24 * k, 50 * k, 8 * k, 56 * k);
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    // Hanging basket
    line(ctx, 170, 0, 170, 82, 'rgba(60,40,20,0.8)', 2);
    line(ctx, 170, 82, 150, 100, 'rgba(60,40,20,0.8)', 2);
    line(ctx, 170, 82, 190, 100, 'rgba(60,40,20,0.8)', 2);
    ctx.beginPath();
    ctx.arc(170, 100, 22, 0, Math.PI);
    ctx.fillStyle = '#7a4a28';
    ctx.fill();
    for (let i = 0; i < 7; i++) {
      const bx = 152 + i * 6;
      circle(ctx, bx, 96 - (i % 2) * 5, 7, on.has('basket-blooms') ? '#f6c945' : '#f27999', 'rgba(80,20,40,0.35)', 1);
    }
    curve(ctx, [150, 106, 142, 130, 148, 150], '#3f9a55', 3);
    curve(ctx, [190, 106, 198, 134, 192, 156], '#3f9a55', 3);

    // Palm on the left
    polygon(ctx, [78, 470, 94, 470, 104, 300, 100, 252, 90, 252, 84, 300], '#6b4a2a', 'rgba(40,20,10,0.5)', 1.5);
    for (let i = 0; i < 6; i++) line(ctx, 82 + i * 2, 280 + i * 30, 100 + i * 0.5, 284 + i * 30, 'rgba(40,20,10,0.4)', 1.5);
    FROND_ANGLES.forEach((a, i) => {
      if (i === 2 && on.has('palm-frond')) return;
      drawFrond(ctx, 96, 252, a, 92);
    });

    // Butterfly
    const wing = on.has('butterfly-blue') ? '#3d7be8' : '#f08a3a';
    ellipse(ctx, 458, 160, 13, 9, wing, 'rgba(40,20,10,0.6)', 1.2, -0.5);
    ellipse(ctx, 482, 160, 13, 9, wing, 'rgba(40,20,10,0.6)', 1.2, 0.5);
    ellipse(ctx, 460, 176, 9, 7, wing, 'rgba(40,20,10,0.6)', 1.2, 0.5);
    ellipse(ctx, 480, 176, 9, 7, wing, 'rgba(40,20,10,0.6)', 1.2, -0.5);
    line(ctx, 470, 158, 470, 180, '#2a1f14', 3);
    curve(ctx, [470, 158, 466, 148, 462, 146], '#2a1f14', 1.2);
    curve(ctx, [470, 158, 474, 148, 478, 146], '#2a1f14', 1.2);

    // Orchid
    line(ctx, 440, 420, 436, 290, '#3f7a45', 4);
    for (let i = 0; i < 5; i++) {
      if (i === 0 && on.has('orchid-bloom')) continue;
      const ox = 432 + (i % 2) * 14;
      const oy = 292 + i * 16;
      for (let p = 0; p < 5; p++) {
        const a = (p * Math.PI * 2) / 5;
        ellipse(ctx, ox + Math.cos(a) * 6, oy + Math.sin(a) * 6, 5, 3, '#f1dcf2', 'rgba(110,50,120,0.5)', 1, a);
      }
      circle(ctx, ox, oy, 3, '#c04a9a');
    }

    // Fountain
    ellipse(ctx, 320, 424, 96, 24, '#a8a39a', 'rgba(30,30,40,0.5)', 2);
    ellipse(ctx, 320, 420, 84, 18, '#6cc3d8');
    ellipse(ctx, 320, 418, 70, 12, 'rgba(255,255,255,0.18)');
    rect(ctx, 308, 372, 24, 46, '#bdb8ae', 'rgba(30,30,40,0.4)', 1.5);
    ellipse(ctx, 320, 372, 44, 11, '#a8a39a', 'rgba(30,30,40,0.5)', 1.5);
    ellipse(ctx, 320, 370, 36, 8, '#7ed0e2');
    line(ctx, 320, 366, 320, 320, 'rgba(255,255,255,0.85)', 3);
    curve(ctx, [320, 362, 290, 312, 276, 372], 'rgba(255,255,255,0.8)', 3);
    if (!on.has('fountain-jet')) curve(ctx, [320, 362, 350, 300, 364, 370], 'rgba(255,255,255,0.8)', 3);
    for (let i = 0; i < 9; i++) circle(ctx, 306 + rng() * 28, 322 + rng() * 40, 1.6, 'rgba(255,255,255,0.7)');

    // Tortoise
    softShadow(ctx, 244, 462, 38, 6, 0.3);
    ellipse(ctx, 244, 446, 30, 19, '#7a8a3a', 'rgba(40,40,10,0.6)', 1.5);
    [[-12, -4], [0, -8], [12, -4], [-6, 5], [8, 5]].forEach(([dx, dy]) => circle(ctx, 244 + dx, 446 + dy, 6.5, null, 'rgba(40,50,10,0.55)', 1.5));
    circle(ctx, 276, 452, 7, '#9aa85a', 'rgba(40,40,10,0.6)', 1.2);
    circle(ctx, 279, 450, 1.3, '#101010');
    rect(ctx, 224, 458, 8, 8, '#9aa85a');
    rect(ctx, 256, 458, 8, 8, '#9aa85a');
    if (on.has('tortoise-leaf')) ellipse(ctx, 284, 452, 8, 4, '#4bb35a', 'rgba(20,70,30,0.6)', 1, -0.4);

    // Ladder
    line(ctx, 592, 452, 606, 248, '#8a5a36', 5);
    line(ctx, 622, 452, 636, 248, '#8a5a36', 5);
    [270, 300, 330, 360, 390].forEach((y, i) => {
      if (i === 2 && on.has('ladder-rung')) return;
      const lean = ((452 - y) / 204) * 14;
      line(ctx, 592 + lean, y, 622 + lean, y, '#a87646', 4);
    });

    // Potting bench
    rect(ctx, 460, 400, 176, 14, '#8a5a36', 'rgba(30,15,5,0.6)', 1.5);
    rect(ctx, 468, 414, 8, 66, '#6d4526');
    rect(ctx, 618, 414, 8, 66, '#6d4526');
    const canColour = on.has('can-red') ? '#d9483b' : '#3f8f8a';
    roundRect(ctx, 462, 362, 34, 38, 4, canColour, 'rgba(20,20,20,0.5)', 1.5);
    polygon(ctx, [496, 376, 526, 358, 528, 364, 496, 388], canColour, 'rgba(20,20,20,0.5)', 1.5);
    curve(ctx, [462, 372, 450, 354, 474, 354], '#2a2a2a', 3);
    [540, 568].forEach((px, i) => {
      polygon(ctx, [px, 400, px + 4, 372, px + 24, 374, px + 26, 400], '#f6f0dc', 'rgba(60,40,20,0.5)', 1);
      rect(ctx, px + 4, 380, 18, 10, '#f6f0dc');
      label(ctx, i === 0 && on.has('packet-text') ? 'FERM' : i === 0 ? 'FERN' : 'ROSE', px + 13, 385, 9, '#2f6a3a');
    });
    [[616, 372, 22], [616, 392, 26]].forEach(([px, py, w], i) => {
      polygon(ctx, [px - w / 2, py - 10, px + w / 2, py - 10, px + w / 2 - 3, py + 10, px - w / 2 + 3, py + 10], '#c46a3c', 'rgba(60,20,10,0.55)', 1.5);
      if (i === 1) rect(ctx, px - w / 2 - 1, py - 14, w + 2, 6, '#c46a3c', 'rgba(60,20,10,0.55)', 1.5);
    });
    rect(ctx, 607, 388, 18, 6, on.has('pot-band') ? '#e8b83a' : '#3f8f8a');
    for (let i = 0; i < 5; i++) circle(ctx, 606 + i * 5, 358 - (i % 2) * 6, 6, '#4bb35a', 'rgba(20,70,30,0.5)', 1);

    // Light shafts
    polygon(ctx, [150, 0, 200, 0, 330, 480, 250, 480], 'rgba(255,250,210,0.09)');
    polygon(ctx, [420, 0, 460, 0, 560, 480, 500, 480], 'rgba(255,250,210,0.07)');
  },
};
