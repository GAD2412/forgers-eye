// Set III, scene 8: a drowned cathedral of coral. Blue light, close colours, and changes
// that hide in shadows, counts and tiny details.
import {
  rect, roundRect, circle, ellipse, polygon, line, curve, verticalGradient, glow, softShadow,
} from '../render/shapes.js';
import { makeRng } from '../util/rng.js';

function drawFish(ctx, x, y, scale, body, fin, stripes) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  polygon(ctx, [-20, 0, -36, -12, -32, 0, -36, 12], fin);
  polygon(ctx, [-4, -11, 6, -22, 12, -10], fin);
  ellipse(ctx, 0, 0, 22, 12, body, 'rgba(10,30,50,0.5)', 1.2);
  for (let i = 0; i < stripes; i++) rect(ctx, -10 + i * 9, -11, 4, 22, 'rgba(255,255,255,0.8)');
  circle(ctx, 13, -2, 2.4, '#101820');
  ctx.restore();
}

export const coralCathedral = {
  id: 'coral-cathedral',
  title: 'Coral Cathedral',
  setId: 3,
  seconds: 130,
  activeCount: 10,
  differences: [
    { id: 'starfish-arm', kind: 'missing', x: 110, y: 420, r: 26, label: 'A starfish arm is missing' },
    { id: 'fish-stripe', kind: 'pattern', x: 300, y: 200, r: 22, label: 'The striped fish has one stripe fewer' },
    { id: 'turtle-flipper', kind: 'position', x: 435, y: 356, r: 31, label: 'The turtle flipper points another way' },
    { id: 'gem-green', kind: 'colour', x: 520, y: 424, r: 12, label: 'A gem in the chest turned green' },
    { id: 'jelly-tentacle', kind: 'missing', x: 520, y: 150, r: 22, label: 'The jellyfish lost a tentacle' },
    { id: 'extra-bubble', kind: 'added', x: 212, y: 120, r: 13, label: 'An extra bubble rises' },
    { id: 'coral-tip', kind: 'colour', x: 90, y: 262, r: 18, label: 'A coral tip is orange, not pink' },
    { id: 'fish-shadow', kind: 'shadow', x: 300, y: 450, w: 70, h: 14, label: 'The fish casts no shadow on the sand' },
    { id: 'kelp-frond', kind: 'size', x: 587, y: 271, w: 20, h: 66, label: 'A kelp frond is shorter' },
    { id: 'rose-spoke', kind: 'missing', x: 303, y: 136, r: 14, label: 'The rose window is missing a spoke' },
    { id: 'urchin-spines', kind: 'detail', x: 209, y: 452, r: 14, label: 'A sea urchin has fewer spines' },
  ],
  draw(ctx, on) {
    const rng = makeRng(8808);

    // Water, light shafts, distant arches
    verticalGradient(ctx, 0, 0, 640, 480, [[0, '#2b8fb8'], [0.5, '#16597f'], [1, '#0b2c4a']]);
    for (let i = 0; i < 5; i++) polygon(ctx, [60 + i * 130, 0, 100 + i * 130, 0, 40 + i * 130 + 90, 480, 10 + i * 130, 480], 'rgba(190,240,255,0.07)');
    [[160, 330], [480, 330]].forEach(([cx, cy]) => {
      polygon(ctx, [cx - 60, 400, cx - 60, cy, cx, cy - 90, cx + 60, cy, cx + 60, 400], 'rgba(10,50,90,0.55)');
    });

    // The cathedral window (a coral arch with a glowing rose)
    polygon(ctx, [250, 300, 250, 150, 320, 70, 390, 150, 390, 300], '#c9577a', 'rgba(60,10,30,0.6)', 3);
    polygon(ctx, [266, 300, 266, 156, 320, 94, 374, 156, 374, 300], '#0f4666');
    glow(ctx, 320, 120, 56, '#aef0ff', 0.5);
    circle(ctx, 320, 120, 16, 'rgba(230,255,255,0.9)');
    for (let i = 0; i < 8; i++) {
      if (i === 3 && on.has('rose-spoke')) continue;
      const a = (i * Math.PI) / 4;
      line(ctx, 320 + Math.cos(a) * 16, 120 + Math.sin(a) * 16, 320 + Math.cos(a) * 36, 120 + Math.sin(a) * 36, '#f5a8c4', 5);
    }
    for (let i = 0; i < 8; i++) circle(ctx, 258, 160 + i * 18, 6 + (i % 2), '#e07a98');
    for (let i = 0; i < 8; i++) circle(ctx, 382, 160 + i * 18, 6 + (i % 2), '#e07a98');

    // Sand floor
    verticalGradient(ctx, 0, 400, 640, 80, [[0, '#d9c28a'], [1, '#a38a58']]);
    for (let i = 0; i < 50; i++) circle(ctx, rng() * 640, 405 + rng() * 70, 1 + rng() * 2, 'rgba(255,245,210,0.35)');

    // Coral clusters
    [[60, 300, '#f06a8a'], [30, 330, '#e8a03a'], [600, 340, '#f06a8a']].forEach(([cx, cy, c]) => {
      for (let i = -2; i <= 2; i++) {
        curve(ctx, [cx, 410, cx + i * 14, cy + 40, cx + i * 20, cy - Math.abs(i) * 6], c, 8);
        circle(ctx, cx + i * 20, cy - Math.abs(i) * 6, 6, c);
      }
    });
    // The first coral tip is the one that changes
    circle(ctx, 90, 262, 6.5, on.has('coral-tip') ? '#f2903a' : '#f06a8a');

    // Sea urchin
    for (let i = 0; i < 14; i++) {
      if (i === 3 && on.has('urchin-spines')) continue;
      const a = (i * Math.PI * 2) / 14;
      line(ctx, 205 + Math.cos(a) * 9, 436 + Math.sin(a) * 9, 205 + Math.cos(a) * 27, 436 + Math.sin(a) * 27, '#3a2a5a', 4.5);
    }
    circle(ctx, 205, 436, 10, '#5a3f8a', 'rgba(20,10,40,0.6)', 1.5);

    // Starfish
    for (let i = 0; i < 5; i++) {
      if (i === 1 && on.has('starfish-arm')) continue;
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
      polygon(ctx, [110 + Math.cos(a - 0.35) * 8, 430 + Math.sin(a - 0.35) * 8, 110 + Math.cos(a) * 28, 430 + Math.sin(a) * 28, 110 + Math.cos(a + 0.35) * 8, 430 + Math.sin(a + 0.35) * 8], '#f2903a', 'rgba(90,30,10,0.5)', 1.2);
    }
    circle(ctx, 110, 430, 9, '#f2903a');

    // Kelp
    [[560, 0], [586, 1], [612, 2]].forEach(([kx, k]) => {
      curve(ctx, [kx, 420, kx - 14, 360, kx + (k % 2 ? 10 : -6), 300 + k * 6], '#2f9a62', 7);
    });
    if (!on.has('kelp-frond')) curve(ctx, [586, 300, 580, 270, 590, 244], '#2f9a62', 7);
    else curve(ctx, [586, 300, 582, 288, 586, 278], '#2f9a62', 7);

    // Jellyfish
    ellipse(ctx, 520, 128, 28, 20, 'rgba(240,180,255,0.75)', 'rgba(120,50,150,0.7)', 2);
    ellipse(ctx, 520, 134, 28, 8, 'rgba(200,120,230,0.6)');
    for (let i = 0; i < 6; i++) {
      if (i === 4 && on.has('jelly-tentacle')) continue;
      curve(ctx, [496 + i * 9, 138, 490 + i * 9, 156, 498 + i * 9, 172], 'rgba(240,180,255,0.7)', 2.5);
    }

    // Turtle
    ellipse(ctx, 420, 330, 40, 26, '#4f8f5a', 'rgba(10,40,20,0.7)', 2);
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      circle(ctx, 420 + Math.cos(a) * 15, 330 + Math.sin(a) * 10, 7, null, 'rgba(10,40,20,0.55)', 1.5);
    }
    circle(ctx, 462, 322, 10, '#7aaa6a', 'rgba(10,40,20,0.7)', 1.5);
    circle(ctx, 466, 320, 1.8, '#101820');
    const flipper = on.has('turtle-flipper') ? [[440, 345], [455, 372]] : [[440, 345], [420, 372]];
    polygon(ctx, [432, 340, flipper[0][0] + 6, flipper[0][1], flipper[1][0] + 4, flipper[1][1], flipper[1][0] - 8, flipper[1][1] - 6], '#6aa06a', 'rgba(10,40,20,0.7)', 1.5);
    polygon(ctx, [384, 330, 366, 342, 372, 350, 392, 338], '#6aa06a', 'rgba(10,40,20,0.7)', 1.5);
    polygon(ctx, [400, 312, 390, 292, 402, 290, 414, 308], '#6aa06a', 'rgba(10,40,20,0.7)', 1.5);

    // Treasure chest
    softShadow(ctx, 516, 446, 44, 7, 0.35);
    roundRect(ctx, 484, 424, 64, 26, 3, '#7a4a28', '#2a1810', 2);
    ctx.beginPath();
    ctx.moveTo(484, 424);
    ctx.quadraticCurveTo(516, 396, 548, 424);
    ctx.fillStyle = '#8a5a30';
    ctx.fill();
    ctx.strokeStyle = '#2a1810';
    ctx.lineWidth = 2;
    ctx.stroke();
    rect(ctx, 508, 424, 16, 14, '#d9ad4a', '#6b4a14', 1.5);
    [[500, 426, '#d9483b'], [516, 424, on.has('gem-green') ? '#3fbf6a' : '#d9483b'], [532, 426, '#3d7be8']].forEach(([gx, gy, c]) => {
      polygon(ctx, [gx, gy - 7, gx + 6, gy, gx, gy + 7, gx - 6, gy], c, 'rgba(255,255,255,0.6)', 1);
    });

    // Fish
    drawFish(ctx, 300, 200, 1, '#f2b83a', '#f08a3a', on.has('fish-stripe') ? 2 : 3);
    softShadow(ctx, 300, 452, 36, 6, on.has('fish-shadow') ? 0 : 0.35);
    drawFish(ctx, 180, 250, 0.7, '#7ad0e8', '#3f9ac0', 0);
    drawFish(ctx, 210, 280, 0.6, '#7ad0e8', '#3f9ac0', 0);
    drawFish(ctx, 190, 300, 0.65, '#7ad0e8', '#3f9ac0', 0);
    drawFish(ctx, 300, 340, 0.8, '#e8e0f0', '#b0a8c8', 1);

    // Bubbles
    for (let i = 0; i < 6; i++) circle(ctx, 212 + (i % 2) * 6, 150 - i * 14, 3 + i * 0.6, null, 'rgba(220,250,255,0.8)', 1.5);
    if (on.has('extra-bubble')) circle(ctx, 212, 120, 7, 'rgba(220,250,255,0.4)', 'rgba(235,252,255,0.95)', 2.5);
    for (let i = 0; i < 24; i++) circle(ctx, rng() * 640, rng() * 380, 1.5 + rng() * 3, null, 'rgba(220,250,255,0.45)', 1);
  },
};
