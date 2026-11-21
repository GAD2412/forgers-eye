// Set II, scene 3: a clockmaker's workshop. Teal wallpaper, brass gears, a big wall clock.
// Differences here are smaller: a missing tooth, a swapped numeral, a minute hand that moved.
import {
  rect, roundRect, circle, ellipse, polygon, line, curve, verticalGradient, glow, softShadow,
  label, bar,
} from '../render/shapes.js';
import { makeRng } from '../util/rng.js';

const BRASS = '#d9ad4a';

function drawGear(ctx, x, y, r, teeth, body, skipTooth) {
  for (let i = 0; i < teeth; i++) {
    if (i === skipTooth) continue;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((i * Math.PI * 2) / teeth);
    rect(ctx, -5, -(r + 8), 10, 13, body, 'rgba(40,30,10,0.5)', 1);
    ctx.restore();
  }
  circle(ctx, x, y, r, body, 'rgba(40,30,10,0.5)', 1.5);
  circle(ctx, x, y, r * 0.58, '#4d3d22');
  circle(ctx, x, y, r * 0.4, body);
  circle(ctx, x, y, r * 0.12, '#4d3d22');
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + 0.4;
    line(ctx, x + Math.cos(a) * r * 0.4, y + Math.sin(a) * r * 0.4, x + Math.cos(a) * r * 0.58, y + Math.sin(a) * r * 0.58, '#4d3d22', 3);
  }
}

function drawHand(ctx, cx, cy, degrees, length, width, colour) {
  const a = (degrees * Math.PI) / 180;
  line(ctx, cx, cy, cx + Math.sin(a) * length, cy - Math.cos(a) * length, colour, width);
}

export const clockmakersBench = {
  id: 'clockmakers-bench',
  title: "The Clockmaker's Bench",
  setId: 2,
  seconds: 140,
  activeCount: 8,
  differences: [
    { id: 'minute-hand', kind: 'position', x: 338, y: 125, r: 30, label: 'The wall clock minute hand moved' },
    { id: 'clock-numeral', kind: 'text', x: 278, y: 125, r: 13, label: 'IX became XI on the clock face' },
    { id: 'pendulum-bob', kind: 'colour', x: 320, y: 238, r: 15, label: 'The pendulum bob turned silver' },
    { id: 'wallpaper-motif', kind: 'pattern', x: 520, y: 102, r: 12, label: 'One wallpaper motif is a circle, not a diamond' },
    { id: 'curtain-tie', kind: 'colour', x: 37, y: 120, r: 15, label: 'A curtain tie-back changed colour' },
    { id: 'owl-gone', kind: 'missing', x: 470, y: 156, r: 20, label: 'The little owl left the shelf' },
    { id: 'key-missing', kind: 'missing', x: 538, y: 232, r: 14, label: 'A key is missing from the hooks' },
    { id: 'drawer-knob', kind: 'missing', x: 394, y: 462, r: 11, label: 'A drawer knob is missing' },
    { id: 'gear-tooth', kind: 'missing', x: 110, y: 351, r: 12, label: 'A gear tooth is missing' },
    { id: 'watch-crown', kind: 'missing', x: 290, y: 362, r: 11, label: 'The pocket watch crown is gone' },
    { id: 'lens-tint', kind: 'colour', x: 390, y: 392, r: 30, label: 'The magnifier lens is tinted green' },
    { id: 'screw-extra', kind: 'added', x: 490, y: 431, r: 14, label: 'An extra screw lies on the bench' },
  ],
  draw(ctx, on) {
    const rng = makeRng(3303);

    // Wallpaper
    verticalGradient(ctx, 0, 0, 640, 336, [[0, '#2a5560'], [1, '#356b6a']]);
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 17; c++) {
        const x = c * 40 + (r % 2 ? 20 : 0);
        const y = 30 + r * 36;
        if (r === 2 && c === 13 && on.has('wallpaper-motif')) {
          circle(ctx, x, y, 9, 'rgba(255,240,200,0.42)');
        } else {
          polygon(ctx, [x, y - 10, x + 8, y, x, y + 10, x - 8, y], 'rgba(255,240,200,0.12)');
        }
        circle(ctx, x + 20, y + 18, 2, 'rgba(255,240,200,0.08)');
      }
    }
    rect(ctx, 0, 318, 640, 18, '#1f3d44');
    rect(ctx, 0, 318, 640, 3, 'rgba(255,255,255,0.15)');

    // Window with curtains
    rect(ctx, 28, 48, 124, 134, '#4a3320');
    verticalGradient(ctx, 34, 54, 112, 122, [[0, '#9fd3ea'], [1, '#e9e2c0']]);
    ellipse(ctx, 90, 168, 70, 14, '#7ea36b');
    line(ctx, 90, 54, 90, 176, '#4a3320', 4);
    line(ctx, 34, 114, 146, 114, '#4a3320', 4);
    polygon(ctx, [22, 40, 54, 40, 52, 184, 22, 184], '#a63d4a', 'rgba(60,10,20,0.5)', 1.5);
    polygon(ctx, [126, 40, 158, 40, 158, 184, 128, 184], '#a63d4a', 'rgba(60,10,20,0.5)', 1.5);
    rect(ctx, 22, 116, 30, 9, on.has('curtain-tie') ? '#e0b84a' : '#d9d2c0');
    rect(ctx, 128, 116, 30, 9, '#d9d2c0');
    line(ctx, 14, 40, 166, 40, '#7a5a30', 5);

    // Wall clock
    glow(ctx, 320, 125, 100, '#ffe9a0', 0.18);
    circle(ctx, 320, 125, 64, BRASS, '#6b4a14', 3);
    circle(ctx, 320, 125, 55, '#f7efd8', '#6b4a14', 2);
    const numerals = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    numerals.forEach((n, i) => {
      const a = (i * Math.PI) / 6;
      const text = i === 9 && on.has('clock-numeral') ? 'XI' : n;
      label(ctx, text, 320 + Math.sin(a) * 42, 125 - Math.cos(a) * 42, 11, '#3b2a14');
    });
    drawHand(ctx, 320, 125, 300, 28, 5, '#2a1f14');
    drawHand(ctx, 320, 125, on.has('minute-hand') ? 120 : 60, 42, 3, '#2a1f14');
    circle(ctx, 320, 125, 4, BRASS, '#2a1f14', 1);
    line(ctx, 320, 189, 320, 228, '#8a6a2a', 3);
    circle(ctx, 320, 238, 11, on.has('pendulum-bob') ? '#c9ced6' : BRASS, '#6b4a14', 2);
    circle(ctx, 317, 235, 3, 'rgba(255,255,255,0.5)');

    // Shelf with owl, keys
    rect(ctx, 430, 176, 180, 10, '#7a4a28');
    rect(ctx, 430, 176, 180, 3, 'rgba(255,255,255,0.2)');
    if (!on.has('owl-gone')) {
      ellipse(ctx, 470, 160, 13, 17, '#8b5a34', 'rgba(40,20,10,0.6)', 1.5);
      ellipse(ctx, 470, 164, 8, 11, '#d9b98a');
      circle(ctx, 465, 152, 4.6, '#fff7e0', '#3a2310', 1);
      circle(ctx, 475, 152, 4.6, '#fff7e0', '#3a2310', 1);
      circle(ctx, 465, 152, 1.8, '#101010');
      circle(ctx, 475, 152, 1.8, '#101010');
      polygon(ctx, [468, 156, 472, 156, 470, 160], '#e8a23a');
    }
    [['#2f7a4a', 520, 40], ['#b0383c', 530, 34], ['#3a5f9a', 540, 44]].forEach(([c, x, h], i) => {
      roundRect(ctx, x + i * 4 + 0, 176 - h, 9, h, 1.5, c, 'rgba(0,0,0,0.4)', 1);
    });
    ellipse(ctx, 590, 168, 12, 8, '#a0522d');
    for (let i = 0; i < 3; i++) curve(ctx, [590, 162, 584 + i * 6, 150, 580 + i * 10, 140], '#3f8f4a', 3);

    rect(ctx, 438, 214, 164, 5, '#5b3a24');
    for (let i = 0; i < 6; i++) {
      const kx = 450 + i * 18;
      circle(ctx, kx, 218, 2, '#2a1f14');
      if (i === 5 && on.has('key-missing')) continue;
      line(ctx, kx, 220, kx, 238, '#b8b0a0', 2);
      circle(ctx, kx, 244, 5, null, '#b8b0a0', 2);
      line(ctx, kx, 230, kx + 4, 230, '#b8b0a0', 2);
    }

    // Bench top
    verticalGradient(ctx, 0, 336, 640, 144, [[0, '#9a6a3e'], [1, '#6d4526']]);
    for (let i = 0; i < 6; i++) line(ctx, 0, 352 + i * 18, 640, 352 + i * 18, 'rgba(40,20,10,0.25)', 1.5);
    for (let i = 0; i < 30; i++) {
      const gx = rng() * 640;
      const gy = 340 + rng() * 96;
      line(ctx, gx, gy, gx + 18 + rng() * 30, gy + (rng() - 0.5) * 2, 'rgba(255,230,190,0.07)', 1.5);
    }
    rect(ctx, 0, 336, 640, 4, 'rgba(255,255,255,0.25)');
    rect(ctx, 0, 440, 640, 40, '#5a3820');
    for (let i = 0; i < 4; i++) {
      roundRect(ctx, 20 + i * 152, 448, 140, 26, 3, '#6d4526', 'rgba(20,10,5,0.6)', 1.5);
      if (i === 2 && on.has('drawer-knob')) continue;
      circle(ctx, 90 + i * 152, 462, 6, BRASS, '#6b4a14', 1.5);
    }

    // Gears
    softShadow(ctx, 112, 394, 44, 8, 0.28);
    drawGear(ctx, 110, 390, 36, 12, BRASS, on.has('gear-tooth') ? 0 : -1);
    drawGear(ctx, 176, 424, 24, 9, '#c9ced6', -1);
    drawGear(ctx, 36, 420, 18, 8, '#b98a4a', -1);

    // Pocket watch with chain
    curve(ctx, [296, 400, 330, 450, 360, 418], '#c9ced6', 3);
    circle(ctx, 290, 395, 31, '#c9ced6', '#6a6f78', 2.5);
    circle(ctx, 290, 395, 25, '#fbf6e6', '#6a6f78', 1.5);
    if (!on.has('watch-crown')) {
      rect(ctx, 286, 360, 8, 8, '#c9ced6', '#6a6f78', 1.5);
      circle(ctx, 290, 357, 5, null, '#c9ced6', 2);
    }
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      line(ctx, 290 + Math.sin(a) * 21, 395 - Math.cos(a) * 21, 290 + Math.sin(a) * 24, 395 - Math.cos(a) * 24, '#3b2a14', 1.5);
    }
    drawHand(ctx, 290, 395, 305, 12, 2.5, '#2a1f14');
    drawHand(ctx, 290, 395, 60, 18, 1.8, '#2a1f14');

    // Magnifier
    bar(ctx, 424, 424, 40, 8, 0.8, '#5b3a24', 'rgba(20,10,5,0.6)', 1);
    circle(ctx, 390, 392, 28, on.has('lens-tint') ? 'rgba(150,255,170,0.4)' : 'rgba(150,210,255,0.38)', '#8a6a2a', 5);
    curve(ctx, [376, 380, 384, 372, 396, 372], 'rgba(255,255,255,0.7)', 2.5);

    // Screws
    [[460, 414], [472, 424], [458, 430], [476, 412], [468, 436]].forEach(([sx, sy], i) => {
      bar(ctx, sx, sy, 18, 6, 0.4 + i, '#c9ced6', 'rgba(40,40,50,0.6)', 1);
    });
    if (on.has('screw-extra')) bar(ctx, 490, 431, 18, 6, 1.3, '#c9ced6', 'rgba(40,40,50,0.6)', 1);

    // Desk lamp
    softShadow(ctx, 572, 366, 30, 7, 0.3);
    ellipse(ctx, 572, 360, 22, 6, '#2a3a44');
    line(ctx, 572, 358, 572, 312, '#2a3a44', 4);
    polygon(ctx, [544, 312, 600, 312, 588, 276, 556, 276], '#f0e2b6', '#6b4a14', 2);
    for (let i = 0; i < 4; i++) line(ctx, 553 + i * 12, 313, 559 + i * 9, 277, 'rgba(168,60,60,0.55)', 3);
    glow(ctx, 572, 318, 54, '#ffe9a0', 0.4);
  },
};
