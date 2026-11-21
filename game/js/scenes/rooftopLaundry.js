// Set II, scene 7: a sunny rooftop terrace. Laundry on a sagging line, a pigeon, a cat on a crate,
// a skyline behind. Medium difficulty: clothes, counts and one lit window.
import {
  rect, roundRect, circle, ellipse, polygon, line, curve, verticalGradient, glow, softShadow, cloud,
} from '../render/shapes.js';
import { makeRng } from '../util/rng.js';

const LINE_LEFT = 40;
const LINE_WIDTH = 430;

// The laundry line: x is linear in t, y sags in the middle.
function linePoint(t) {
  return { x: LINE_LEFT + LINE_WIDTH * t, y: 170 + 120 * t * (1 - t) };
}

function drawShirt(ctx, p, colour) {
  polygon(ctx, [p.x - 9, p.y, p.x - 18, p.y + 8, p.x - 13, p.y + 15, p.x - 9, p.y + 12, p.x - 9, p.y + 38, p.x + 9, p.y + 38, p.x + 9, p.y + 12, p.x + 13, p.y + 15, p.x + 18, p.y + 8, p.x + 9, p.y], colour, 'rgba(40,20,20,0.5)', 1.3);
}

export const rooftopLaundry = {
  id: 'rooftop-laundry',
  title: 'Rooftop Laundry Day',
  setId: 2,
  seconds: 140,
  activeCount: 8,
  differences: [
    { id: 'shirt-colour', kind: 'colour', x: 431, y: 198, r: 26, label: 'A shirt on the line changed colour' },
    { id: 'sock-missing', kind: 'missing', x: 334, y: 213, r: 29, label: 'A sock is missing from the line' },
    { id: 'towel-stripe', kind: 'pattern', x: 180, y: 212, r: 22, label: 'The towel has an extra stripe' },
    { id: 'pigeon-gone', kind: 'missing', x: 255, y: 186, r: 16, label: 'The pigeon flew off the line' },
    { id: 'smoke-puff', kind: 'missing', x: 584, y: 198, r: 20, label: 'A puff of chimney smoke is missing' },
    { id: 'dish-tilt', kind: 'position', x: 215, y: 300, r: 24, label: 'The satellite dish is tilted differently' },
    { id: 'window-lit', kind: 'detail', x: 410, y: 262, r: 12, label: 'A skyline window is lit' },
    { id: 'cat-tail', kind: 'position', x: 331, y: 367, w: 28, h: 70, label: 'The cat tail points a different way' },
    { id: 'flower-blue', kind: 'colour', x: 394, y: 366, r: 19, label: 'A potted flower turned blue' },
    { id: 'tank-band', kind: 'colour', x: 125, y: 170, w: 62, h: 12, label: 'The water tower band changed colour' },
    { id: 'balloon-added', kind: 'added', x: 350, y: 92, r: 30, label: 'A hot-air balloon drifts in the sky' },
  ],
  draw(ctx, on) {
    const rng = makeRng(7707);

    // Sky and sun
    verticalGradient(ctx, 0, 0, 640, 340, [[0, '#86c4e8'], [0.65, '#f7dcae'], [1, '#f9c98f']]);
    glow(ctx, 570, 120, 150, '#fff2b0', 0.6);
    circle(ctx, 570, 120, 28, '#fff2b0');
    cloud(ctx, 60, 70, 1.1, 'rgba(255,255,255,0.9)');
    cloud(ctx, 440, 54, 0.9, 'rgba(255,255,255,0.85)');
    if (on.has('balloon-added')) {
      circle(ctx, 350, 86, 22, '#e8553d', 'rgba(60,20,20,0.5)', 1.5);
      ellipse(ctx, 350, 86, 9, 22, '#f2c14a');
      line(ctx, 336, 104, 346, 118, '#6b4a2a', 1.5);
      line(ctx, 364, 104, 354, 118, '#6b4a2a', 1.5);
      rect(ctx, 344, 118, 12, 9, '#8a5a36');
    }

    // Skyline
    [[0, 230, 90, 110], [90, 200, 70, 140], [160, 252, 60, 88], [230, 218, 80, 122], [310, 244, 70, 96], [380, 208, 60, 132], [440, 238, 90, 102], [530, 222, 110, 118]].forEach(([bx, by, bw, bh], i) => {
      rect(ctx, bx, by, bw, bh, i % 2 ? '#a894b8' : '#b9a8c9');
      for (let wy = by + 12; wy < by + bh - 10; wy += 22) {
        for (let wx = bx + 8; wx < bx + bw - 10; wx += 18) rect(ctx, wx, wy, 8, 11, 'rgba(60,40,80,0.35)');
      }
    });
    rect(ctx, 405, 256, 8, 11, on.has('window-lit') ? '#ffd36e' : 'rgba(60,40,80,0.35)');
    if (on.has('window-lit')) glow(ctx, 409, 262, 20, '#ffd36e', 0.5);

    // Water tower on the left roof
    line(ctx, 112, 188, 108, 202, '#5b4a3a', 3);
    line(ctx, 138, 188, 142, 202, '#5b4a3a', 3);
    ellipse(ctx, 125, 170, 30, 22, '#8a5a36', 'rgba(30,15,5,0.6)', 2);
    rect(ctx, 95, 166, 60, 9, on.has('tank-band') ? '#3d7be8' : '#5b3a24');
    polygon(ctx, [93, 156, 157, 156, 125, 138], '#6b4a2a', 'rgba(30,15,5,0.6)', 2);

    // Chimney and smoke
    rect(ctx, 540, 262, 30, 68, '#a8453a', 'rgba(40,10,10,0.5)', 1.5);
    rect(ctx, 535, 256, 40, 10, '#6b2a22');
    for (let i = 0; i < 5; i++) line(ctx, 540, 272 + i * 12, 570, 272 + i * 12, 'rgba(40,10,10,0.3)', 1);
    circle(ctx, 555, 246, 12, 'rgba(255,255,255,0.8)');
    circle(ctx, 568, 224, 15, 'rgba(255,255,255,0.7)');
    if (!on.has('smoke-puff')) circle(ctx, 584, 198, 18, 'rgba(255,255,255,0.6)');

    // Terrace: parapet and planks
    rect(ctx, 0, 330, 640, 16, '#cdbca4', 'rgba(60,40,20,0.4)', 1.5);
    rect(ctx, 0, 330, 640, 4, 'rgba(255,255,255,0.35)');
    verticalGradient(ctx, 0, 346, 640, 134, [[0, '#c4925e'], [1, '#8f6238']]);
    for (let i = 0; i < 9; i++) line(ctx, 0, 358 + i * 14, 640, 358 + i * 14, 'rgba(60,30,10,0.3)', 1.5);
    for (let i = 0; i < 40; i++) {
      const gx = rng() * 640;
      const gy = 350 + rng() * 120;
      line(ctx, gx, gy, gx + 20 + rng() * 30, gy, 'rgba(255,230,190,0.1)', 1.5);
    }

    // Satellite dish on the parapet
    rect(ctx, 211, 312, 8, 20, '#6a6f78');
    ctx.save();
    ctx.translate(215, 304);
    ctx.rotate(on.has('dish-tilt') ? 0.5 : -0.3);
    ellipse(ctx, 0, 0, 22, 8, '#e6e8ee', '#6a6f78', 2, 0.8);
    line(ctx, 0, 0, 10, -16, '#6a6f78', 2);
    circle(ctx, 10, -17, 3, '#d9483b');
    ctx.restore();

    // Laundry line and poles
    rect(ctx, 38, 150, 6, 190, '#5b4a3a');
    rect(ctx, 468, 150, 6, 190, '#5b4a3a');
    ctx.beginPath();
    ctx.moveTo(41, 170);
    ctx.quadraticCurveTo(255, 230, 471, 170);
    ctx.strokeStyle = '#3b3b44';
    ctx.lineWidth = 2;
    ctx.stroke();
    const items = [
      ['sock', '#8a4fa8'], ['shirt', '#f2c14a'], ['towel', '#3f8f8a'], ['dress', '#e8553d'],
      ['shirt', '#f6f0dc'], ['sock', '#4b9a45'], ['towel', '#a83a3a'], ['shirt', '#3d7be8'],
    ];
    items.forEach(([kind, colour], i) => {
      const p = linePoint(0.09 + i * 0.117);
      if (kind === 'sock') {
        if (i === 5 && on.has('sock-missing')) return;
        polygon(ctx, [p.x - 7, p.y, p.x + 7, p.y, p.x + 7, p.y + 22, p.x + 16, p.y + 32, p.x + 8, p.y + 38, p.x - 7, p.y + 26], colour, 'rgba(40,20,20,0.5)', 1.3);
        rect(ctx, p.x - 7, p.y, 14, 5, 'rgba(255,255,255,0.55)');
      } else if (kind === 'shirt') {
        drawShirt(ctx, p, i === 7 && on.has('shirt-colour') ? '#e8553d' : colour);
      } else if (kind === 'towel') {
        roundRect(ctx, p.x - 15, p.y, 30, 44, 2, colour, 'rgba(40,20,20,0.5)', 1.3);
        const stripes = i === 2 && on.has('towel-stripe') ? 3 : 2;
        for (let s = 0; s < stripes; s++) rect(ctx, p.x - 15, p.y + 22 + s * 7, 30, 4, 'rgba(255,255,255,0.7)');
      } else {
        polygon(ctx, [p.x - 8, p.y, p.x + 8, p.y, p.x + 20, p.y + 44, p.x - 20, p.y + 44], colour, 'rgba(40,20,20,0.5)', 1.3);
        rect(ctx, p.x - 8, p.y + 14, 16, 3, 'rgba(255,255,255,0.6)');
      }
      circle(ctx, p.x - 5, p.y - 1, 3, '#d9ad4a', 'rgba(60,40,10,0.6)', 1);
      circle(ctx, p.x + 5, p.y - 1, 3, '#d9ad4a', 'rgba(60,40,10,0.6)', 1);
    });

    // Pigeon on the line
    if (!on.has('pigeon-gone')) {
      const p = linePoint(0.5);
      ellipse(ctx, p.x, p.y - 8, 12, 8, '#8f96a3', 'rgba(30,30,40,0.6)', 1.2);
      circle(ctx, p.x + 10, p.y - 15, 5.5, '#7a8190', 'rgba(30,30,40,0.6)', 1.2);
      polygon(ctx, [p.x + 15, p.y - 15, p.x + 21, p.y - 13, p.x + 15, p.y - 12], '#e8b33a');
      polygon(ctx, [p.x - 11, p.y - 9, p.x - 22, p.y - 4, p.x - 10, p.y - 4], '#6a7080');
      circle(ctx, p.x + 11, p.y - 16, 1.2, '#101010');
      ellipse(ctx, p.x + 2, p.y - 10, 5, 3, '#b6bcc8');
    }

    // Crate with a cat
    softShadow(ctx, 300, 418, 48, 8, 0.3);
    rect(ctx, 270, 372, 60, 44, '#a8773f', '#5b3a24', 2);
    for (let i = 1; i < 4; i++) line(ctx, 270, 372 + i * 11, 330, 372 + i * 11, 'rgba(60,30,10,0.5)', 1.5);
    ellipse(ctx, 300, 362, 20, 13, '#d98a3a', 'rgba(70,30,10,0.6)', 1.5);
    circle(ctx, 282, 350, 11, '#e8a04a', 'rgba(70,30,10,0.6)', 1.5);
    polygon(ctx, [274, 344, 275, 331, 283, 341], '#e8a04a', 'rgba(70,30,10,0.6)', 1.2);
    polygon(ctx, [287, 341, 294, 331, 292, 344], '#e8a04a', 'rgba(70,30,10,0.6)', 1.2);
    circle(ctx, 278, 350, 1.6, '#3a2a10');
    circle(ctx, 287, 350, 1.6, '#3a2a10');
    if (on.has('cat-tail')) curve(ctx, [318, 366, 340, 360, 342, 336], '#d98a3a', 6);
    else curve(ctx, [318, 366, 338, 376, 336, 398], '#d98a3a', 6);

    // Potted flowers
    polygon(ctx, [388, 396, 428, 396, 422, 424, 394, 424], '#c46a3c', 'rgba(60,20,10,0.55)', 1.5);
    rect(ctx, 386, 392, 44, 8, '#d9804a', 'rgba(60,20,10,0.55)', 1.5);
    [[394, 366, '#f27999'], [408, 358, '#f6c945'], [422, 368, '#e8553d']].forEach(([fx, fy, c], i) => {
      line(ctx, fx, 392, fx, fy + 6, '#3d7a3a', 3);
      const colour = i === 0 && on.has('flower-blue') ? '#3d7be8' : c;
      for (let p = 0; p < 5; p++) {
        const a = (p * Math.PI * 2) / 5;
        circle(ctx, fx + Math.cos(a) * 6, fy + Math.sin(a) * 6, 4.5, colour);
      }
      circle(ctx, fx, fy, 3, '#7a3f1a');
    });
    ellipse(ctx, 560, 430, 34, 9, 'rgba(40,20,10,0.25)');
    roundRect(ctx, 530, 392, 60, 34, 4, '#6b8f5a', 'rgba(20,40,20,0.6)', 2);
    for (let i = 0; i < 6; i++) circle(ctx, 536 + i * 10, 390 - (i % 2) * 6, 7, '#4bb35a', 'rgba(20,70,30,0.5)', 1);
  },
};
