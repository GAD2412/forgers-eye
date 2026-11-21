// Set III, scene 6: an attic of forgotten toys by moonlight. Dim light, close colours,
// a missing shadow and a spider that crept down its thread.
import {
  rect, roundRect, circle, ellipse, polygon, line, curve, verticalGradient, glow, softShadow,
  label, star,
} from '../render/shapes.js';
import { makeRng } from '../util/rng.js';

const FLAG_COLOURS = ['#d9483b', '#f2c14a', '#3f8f8a', '#8a4fa8', '#4b9a45'];

function buntingPoint(t) {
  const u = 1 - t;
  return { x: u * u * 20 + 2 * u * t * 320 + t * t * 620, y: u * u * 70 + 2 * u * t * 130 + t * t * 70 };
}

export const atticOfToys = {
  id: 'attic-of-toys',
  title: 'Attic of Forgotten Toys',
  setId: 3,
  seconds: 130,
  activeCount: 10,
  differences: [
    { id: 'window-star', kind: 'position', x: 338, y: 155, r: 14, label: 'A star in the round window shifted' },
    { id: 'horse-saddle', kind: 'colour', x: 140, y: 326, r: 15, label: 'The rocking horse saddle changed colour' },
    { id: 'horse-shadow', kind: 'shadow', x: 158, y: 420, w: 146, h: 20, label: 'The rocking horse casts no shadow' },
    { id: 'block-letter', kind: 'text', x: 275, y: 345, r: 18, label: 'A toy block shows D where it showed B' },
    { id: 'bear-bow', kind: 'colour', x: 480, y: 326, r: 15, label: "The teddy bear's bow tie changed colour" },
    { id: 'trunk-sticker', kind: 'shape', x: 528, y: 396, r: 15, label: 'The trunk sticker is a circle, not a star' },
    { id: 'robot-ball', kind: 'missing', x: 360, y: 304, r: 12, label: 'The robot lost its antenna ball' },
    { id: 'top-stripes', kind: 'pattern', x: 200, y: 394, r: 14, label: 'The spinning top has an extra stripe' },
    { id: 'kite-bow', kind: 'missing', x: 571, y: 269, r: 15, label: 'A bow is missing from the kite tail' },
    { id: 'spider-drop', kind: 'position', x: 150, y: 84, r: 26, label: 'The spider crept down its thread' },
    { id: 'bunting-flag', kind: 'colour', x: 390, y: 110, r: 19, label: 'One bunting flag changed colour' },
  ],
  draw(ctx, on) {
    const rng = makeRng(6606);

    // Back wall and rafters
    rect(ctx, 0, 0, 640, 480, '#5d4632');
    for (let i = 0; i < 32; i++) {
      line(ctx, i * 20, 0, i * 20, 400, 'rgba(20,10,5,0.28)', 1.5);
      if (i % 3 === 0) rect(ctx, i * 20 + 2, 0, 16, 400, 'rgba(255,230,190,0.04)');
    }
    polygon(ctx, [0, 0, 640, 0, 640, 50, 320, -10, 0, 50], '#3a2818');
    line(ctx, 0, 60, 320, -10, '#3a2818', 14);
    line(ctx, 640, 60, 320, -10, '#3a2818', 14);
    rect(ctx, 0, 52, 640, 10, '#3a2818');
    rect(ctx, 0, 52, 640, 2, 'rgba(255,255,255,0.12)');

    // Round window
    circle(ctx, 320, 120, 62, '#3a2818', '#2a1a0e', 2);
    circle(ctx, 320, 120, 54, '#0f1736');
    ctx.save();
    ctx.beginPath();
    ctx.arc(320, 120, 54, 0, Math.PI * 2);
    ctx.clip();
    verticalGradient(ctx, 266, 66, 108, 108, [[0, '#0b1030'], [1, '#34457f']]);
    glow(ctx, 300, 110, 40, '#fff2c0', 0.4);
    circle(ctx, 300, 110, 14, '#f6eecb');
    circle(ctx, 305, 107, 3, 'rgba(180,170,140,0.5)');
    for (let i = 0; i < 18; i++) circle(ctx, 270 + rng() * 100, 70 + rng() * 100, 0.7 + rng(), 'rgba(255,255,240,0.7)');
    const sy = on.has('window-star') ? 164 : 150;
    glow(ctx, 338, sy, 10, '#cfe0ff', 0.7);
    star(ctx, 338, sy, 4.5, 4, '#fffbe8', 0.2, 0.35);
    ctx.restore();
    line(ctx, 320, 66, 320, 174, '#3a2818', 4);
    line(ctx, 266, 120, 374, 120, '#3a2818', 4);
    glow(ctx, 320, 120, 150, '#9ab0ff', 0.12);

    // Bunting
    ctx.beginPath();
    ctx.moveTo(20, 70);
    ctx.quadraticCurveTo(320, 130, 620, 70);
    ctx.strokeStyle = '#2a1a0e';
    ctx.lineWidth = 2;
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const p = buntingPoint(0.05 + i * 0.081);
      const colour = i === 7 && on.has('bunting-flag') ? '#e8b83a' : FLAG_COLOURS[i % 5];
      polygon(ctx, [p.x - 10, p.y, p.x + 10, p.y, p.x, p.y + 24], i === 7 && on.has('bunting-flag') ? colour : colour, 'rgba(20,10,5,0.5)', 1);
    }

    // Spider on its thread
    const spiderY = on.has('spider-drop') ? 102 : 74;
    line(ctx, 150, 0, 150, spiderY, 'rgba(255,255,255,0.45)', 1);
    circle(ctx, 150, spiderY + 5, 5, '#1b1620');
    circle(ctx, 150, spiderY, 3, '#1b1620');
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue;
      line(ctx, 150, spiderY + 4, 150 + i * 6, spiderY + 1, '#1b1620', 1);
      line(ctx, 150, spiderY + 4, 150 + i * 6, spiderY + 11, '#1b1620', 1);
    }

    // Kite on the wall
    polygon(ctx, [560, 120, 596, 160, 560, 206, 524, 160], '#3f8f8a', 'rgba(10,20,20,0.6)', 2);
    polygon(ctx, [560, 120, 596, 160, 560, 160], '#d9483b');
    polygon(ctx, [560, 206, 524, 160, 560, 160], '#f2c14a');
    line(ctx, 560, 120, 560, 206, 'rgba(10,20,20,0.6)', 1.5);
    line(ctx, 524, 160, 596, 160, 'rgba(10,20,20,0.6)', 1.5);
    curve(ctx, [560, 206, 540, 240, 590, 290], '#6b4a2a', 2);
    [0.3, 0.55, 0.78, 0.98].forEach((t, i) => {
      if (i === 2 && on.has('kite-bow')) return;
      const u = 1 - t;
      const bx = u * u * 560 + 2 * u * t * 540 + t * t * 590;
      const by = u * u * 206 + 2 * u * t * 240 + t * t * 290;
      polygon(ctx, [bx, by, bx - 9, by - 6, bx - 9, by + 6], '#d9483b');
      polygon(ctx, [bx, by, bx + 9, by - 6, bx + 9, by + 6], '#f2c14a');
    });

    // Floor
    rect(ctx, 0, 400, 640, 80, '#4a3624');
    for (let i = 0; i < 10; i++) line(ctx, 0, 406 + i * 8, 640, 406 + i * 8, 'rgba(0,0,0,0.3)', 1.5);
    for (let i = 0; i < 16; i++) line(ctx, i * 44 - 10, 400, i * 52 - 60, 480, 'rgba(0,0,0,0.18)', 1.5);
    polygon(ctx, [250, 400, 390, 400, 460, 480, 200, 480], 'rgba(160,180,255,0.07)');

    // Rocking horse
    if (!on.has('horse-shadow')) softShadow(ctx, 150, 420, 80, 9, 0.38);
    ctx.beginPath();
    ctx.ellipse(130, 392, 80, 22, 0, 0.1, Math.PI - 0.1);
    ctx.strokeStyle = '#8a5a36';
    ctx.lineWidth = 7;
    ctx.stroke();
    line(ctx, 88, 392, 98, 352, '#8a5a36', 7);
    line(ctx, 160, 392, 154, 352, '#8a5a36', 7);
    ellipse(ctx, 128, 334, 42, 22, '#b88a58', 'rgba(40,20,10,0.6)', 2);
    polygon(ctx, [158, 332, 176, 296, 196, 304, 188, 332, 168, 346], '#b88a58', 'rgba(40,20,10,0.6)', 2);
    ellipse(ctx, 190, 306, 14, 10, '#b88a58', 'rgba(40,20,10,0.6)', 2, 0.5);
    circle(ctx, 188, 300, 2.4, '#101010');
    polygon(ctx, [162, 300, 168, 282, 174, 302], '#b88a58', 'rgba(40,20,10,0.6)', 1.5);
    for (let i = 0; i < 5; i++) curve(ctx, [156 + i * 2, 304 + i * 6, 146, 308 + i * 6, 142, 322 + i * 5], '#3a2418', 3);
    roundRect(ctx, 118, 318, 34, 12, 5, on.has('horse-saddle') ? '#3f7a4a' : '#a83a3a', 'rgba(40,10,10,0.6)', 1.5);
    curve(ctx, [88, 332, 74, 336, 76, 352], '#3a2418', 4);

    // Spinning top
    const stripes = on.has('top-stripes') ? 4 : 3;
    polygon(ctx, [176, 370, 224, 370, 200, 408], '#3a7ab0', 'rgba(10,20,40,0.6)', 1.5);
    for (let i = 0; i < stripes; i++) {
      const width = 44 - i * 9;
      rect(ctx, 200 - width / 2, 374 + i * 7, width, 5, i % 2 ? '#f2c14a' : '#d9483b');
    }
    ellipse(ctx, 200, 372, 18, 5, '#d9483b', 'rgba(60,10,10,0.6)', 1);
    line(ctx, 200, 372, 200, 360, '#8a5a36', 4);

    // Blocks
    const blocks = [
      [250, 362, 'A', '#d9483b'],
      [256, 324, on.has('block-letter') ? 'D' : 'B', '#f2c14a'],
      [252, 286, 'C', '#3f8f8a'],
    ];
    blocks.forEach(([bx, by, ch, colour]) => {
      roundRect(ctx, bx, by, 38, 38, 3, colour, 'rgba(30,20,10,0.6)', 2);
      label(ctx, ch, bx + 19, by + 20, 24, '#fff6dc', 'center', 'Georgia, serif', '700');
    });

    // Robot
    softShadow(ctx, 360, 402, 30, 5, 0.3);
    rect(ctx, 336, 346, 48, 50, '#8a93a0', 'rgba(20,20,30,0.7)', 2);
    rect(ctx, 342, 322, 36, 26, '#a4adba', 'rgba(20,20,30,0.7)', 2);
    circle(ctx, 351, 334, 4, '#ffd36e');
    circle(ctx, 369, 334, 4, '#ffd36e');
    line(ctx, 360, 322, 360, 308, '#6a707c', 2);
    if (!on.has('robot-ball')) circle(ctx, 360, 304, 6.5, '#d9483b', 'rgba(60,10,10,0.6)', 1);
    for (let i = 0; i < 3; i++) circle(ctx, 348 + i * 12, 366, 3.5, i === 1 ? '#d9483b' : '#3f8f8a');
    rect(ctx, 340, 380, 40, 6, '#6a707c');
    rect(ctx, 326, 354, 10, 30, '#6a707c');
    rect(ctx, 384, 354, 10, 30, '#6a707c');
    rect(ctx, 340, 396, 12, 10, '#6a707c');
    rect(ctx, 368, 396, 12, 10, '#6a707c');

    // Trunk with bear
    rect(ctx, 430, 372, 140, 62, '#7a4a28', '#2a1810', 3);
    rect(ctx, 430, 372, 140, 12, '#8a5a36', '#2a1810', 3);
    line(ctx, 450, 372, 450, 434, '#3a2418', 5);
    line(ctx, 550, 372, 550, 434, '#3a2418', 5);
    rect(ctx, 492, 384, 16, 16, '#d9ad4a', '#6b4a14', 1.5);
    circle(ctx, 500, 392, 2.5, '#2a1810');
    if (on.has('trunk-sticker')) {
      circle(ctx, 528, 396, 11, '#f2c14a', 'rgba(60,40,10,0.6)', 1.5);
    } else {
      star(ctx, 528, 396, 13, 5, '#f2c14a', 0, 0.45);
    }
    ellipse(ctx, 480, 342, 18, 22, '#b8864a', 'rgba(40,20,10,0.6)', 2);
    circle(ctx, 480, 310, 17, '#b8864a', 'rgba(40,20,10,0.6)', 2);
    circle(ctx, 466, 296, 7, '#b8864a', 'rgba(40,20,10,0.6)', 2);
    circle(ctx, 494, 296, 7, '#b8864a', 'rgba(40,20,10,0.6)', 2);
    circle(ctx, 474, 308, 2, '#101010');
    circle(ctx, 486, 308, 2, '#101010');
    ellipse(ctx, 480, 316, 6, 4.5, '#e6c898');
    circle(ctx, 480, 314, 2, '#2a1810');
    const bow = on.has('bear-bow') ? '#3d6fd0' : '#d9483b';
    polygon(ctx, [480, 328, 466, 320, 466, 336], bow, 'rgba(30,10,10,0.5)', 1);
    polygon(ctx, [480, 328, 494, 320, 494, 336], bow, 'rgba(30,10,10,0.5)', 1);
    circle(ctx, 480, 328, 3.5, bow, 'rgba(30,10,10,0.5)', 1);
    ellipse(ctx, 464, 352, 7, 11, '#b8864a', 'rgba(40,20,10,0.6)', 2);
    ellipse(ctx, 496, 352, 7, 11, '#b8864a', 'rgba(40,20,10,0.6)', 2);

    // Dust motes in the moonbeam
    for (let i = 0; i < 40; i++) circle(ctx, 250 + rng() * 150, 180 + rng() * 220, 1 + rng() * 1.2, 'rgba(210,220,255,0.35)');
  },
};
