// Set I, scene 2: a garden pond at noon with an arched red bridge, koi and a stone lantern.
import {
  rect, roundRect, circle, ellipse, polygon, line, curve, verticalGradient, glow, softShadow, cloud,
} from '../render/shapes.js';
import { makeRng } from '../util/rng.js';

// Points along the bridge deck (a quadratic arc) so posts sit exactly on it.
function deckPoint(t) {
  const u = 1 - t;
  return { x: u * u * 290 + 2 * u * t * 420 + t * t * 550, y: u * u * 322 + 2 * u * t * 222 + t * t * 322 };
}

function drawKoi(ctx, x, y, angle, body, spot, fin) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  polygon(ctx, [-24, 0, -44, -10, -38, 0, -44, 10], fin);
  polygon(ctx, [4, -7, -6, -16, -12, -6], fin);
  polygon(ctx, [4, 7, -6, 16, -12, 6], fin);
  ellipse(ctx, 0, 0, 27, 9.5, body, 'rgba(20,40,50,0.4)', 1);
  ellipse(ctx, -5, -2, 7, 4, spot);
  ellipse(ctx, 9, 2, 5, 3, spot);
  circle(ctx, 20, -3.5, 1.5, '#101010');
  circle(ctx, 20, 3.5, 1.5, '#101010');
  ctx.restore();
}

function drawPad(ctx, x, y, size) {
  ctx.beginPath();
  ctx.ellipse(x, y, size, size * 0.42, 0, 0.35, Math.PI * 2 - 0.2);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fillStyle = '#4f9a4a';
  ctx.fill();
  ctx.strokeStyle = 'rgba(20,70,30,0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  line(ctx, x - size * 0.5, y - 1, x + size * 0.4, y + 2, 'rgba(255,255,255,0.18)', 1);
}

export const koiPond = {
  id: 'koi-pond',
  title: 'Koi Pond at Noon',
  setId: 1,
  seconds: 150,
  activeCount: 7,
  differences: [
    { id: 'koi-recolour', kind: 'colour', x: 332, y: 374, r: 34, label: 'The middle koi lost its orange coat' },
    { id: 'bridge-post', kind: 'missing', x: 394, y: 262, r: 16, label: 'A bridge railing post is missing' },
    { id: 'paper-lantern', kind: 'colour', x: 524, y: 296, r: 14, label: 'The paper lantern on the bridge turned gold' },
    { id: 'lantern-lit', kind: 'detail', x: 230, y: 264, r: 34, label: 'The stone lantern is not lit' },
    { id: 'lotus-bloom', kind: 'added', x: 560, y: 337, r: 28, label: 'A lotus flower bloomed on a pad' },
    { id: 'frog-gone', kind: 'missing', x: 480, y: 386, r: 14, label: 'The frog left its lily pad' },
    { id: 'dragonfly-wings', kind: 'detail', x: 206, y: 334, r: 18, label: 'The dragonfly lost its lower wings' },
    { id: 'blossom-white', kind: 'colour', x: 135, y: 150, r: 24, label: 'A blossom cluster turned white' },
    { id: 'sun-big', kind: 'size', x: 545, y: 66, r: 38, label: 'The sun is larger' },
    { id: 'extra-bird', kind: 'added', x: 330, y: 92, r: 14, label: 'An extra bird flies in the sky' },
    { id: 'ripple-ring', kind: 'detail', x: 500, y: 452, r: 28, label: 'A third ripple ring spreads on the water' },
  ],
  draw(ctx, on) {
    const rng = makeRng(2202);

    // Sky, sun, clouds, hills
    verticalGradient(ctx, 0, 0, 640, 270, [[0, '#9fd1e8'], [1, '#f6ecd2']]);
    glow(ctx, 545, 66, 110, '#fff2b0', 0.55);
    circle(ctx, 545, 66, on.has('sun-big') ? 34 : 26, '#fff0a0');
    cloud(ctx, 90, 70, 1, 'rgba(255,255,255,0.9)');
    cloud(ctx, 380, 42, 0.8, 'rgba(255,255,255,0.85)');
    ellipse(ctx, 120, 268, 280, 80, '#8db79b');
    ellipse(ctx, 470, 278, 320, 66, '#7da68c');
    ellipse(ctx, 300, 282, 260, 40, 'rgba(255,255,255,0.18)');
    [[300, 70], [336, 56], [372, 74]].forEach(([bx, by]) => {
      curve(ctx, [bx - 10, by, bx - 5, by - 7, bx, by], '#2b3a44', 2);
      curve(ctx, [bx, by, bx + 5, by - 7, bx + 10, by], '#2b3a44', 2);
    });
    if (on.has('extra-bird')) {
      curve(ctx, [320, 92, 325, 85, 330, 92], '#2b3a44', 2);
      curve(ctx, [330, 92, 335, 85, 340, 92], '#2b3a44', 2);
    }

    // Grass bank and pond
    rect(ctx, 0, 262, 640, 48, '#6f9a62');
    for (let i = 0; i < 70; i++) {
      const gx = rng() * 640;
      line(ctx, gx, 300, gx + (rng() - 0.5) * 6, 288 - rng() * 14, 'rgba(60,110,50,0.7)', 2);
    }
    verticalGradient(ctx, 0, 304, 640, 176, [[0, '#58aaa8'], [1, '#27677a']]);
    for (let i = 0; i < 40; i++) {
      const wx = rng() * 620;
      const wy = 316 + rng() * 160;
      line(ctx, wx, wy, wx + 10 + rng() * 22, wy, 'rgba(255,255,255,0.18)', 1.5);
    }
    for (let i = 0; i < 24; i++) {
      ellipse(ctx, i * 28 + rng() * 14, 304 + rng() * 5, 16 + rng() * 8, 7, `rgba(${120 + rng() * 40},${120 + rng() * 40},${125 + rng() * 40},1)`);
    }

    // Cherry tree on the left
    polygon(ctx, [62, 300, 74, 300, 80, 214, 70, 160, 64, 214], '#5b3a2a');
    curve(ctx, [70, 200, 100, 180, 135, 160], '#5b3a2a', 6);
    curve(ctx, [68, 190, 50, 170, 38, 170], '#5b3a2a', 5);
    curve(ctx, [74, 176, 100, 140, 108, 112], '#5b3a2a', 5);
    [[60, 132, 0], [110, 112, 0], [135, 150, 1], [40, 175, 0], [95, 172, 0], [150, 108, 0], [20, 140, 0]].forEach(([cx, cy, special]) => {
      const colour = special && on.has('blossom-white') ? '#fff3f6' : '#f7a8c0';
      circle(ctx, cx, cy, 20, colour);
      circle(ctx, cx - 14, cy + 8, 14, colour);
      circle(ctx, cx + 14, cy + 6, 15, colour);
      circle(ctx, cx - 4, cy - 12, 12, 'rgba(255,255,255,0.35)');
    });
    for (let i = 0; i < 12; i++) ellipse(ctx, 50 + rng() * 140, 290 + rng() * 14, 3, 1.6, '#f9c1d1');

    // Stone lantern
    rect(ctx, 216, 292, 28, 9, '#8d8a93');
    rect(ctx, 223, 274, 14, 20, '#a3a0a8');
    rect(ctx, 212, 248, 36, 28, '#8d8a93', 'rgba(30,30,40,0.5)', 1.5);
    if (on.has('lantern-lit')) {
      glow(ctx, 230, 264, 34, '#ffd36e', 0.7);
      rect(ctx, 222, 255, 16, 16, '#ffd36e');
    } else {
      rect(ctx, 222, 255, 16, 16, '#2c2b36');
    }
    polygon(ctx, [202, 248, 258, 248, 230, 226], '#6e6b76', 'rgba(30,30,40,0.5)', 1.5);
    circle(ctx, 230, 223, 4, '#a3a0a8');

    // Water reflections and ripples
    ellipse(ctx, 420, 340, 140, 14, 'rgba(120,40,30,0.25)');
    ellipse(ctx, 230, 330, 20, 18, 'rgba(255,220,140,0.12)');
    for (let i = 0; i < 2; i++) ellipse(ctx, 500, 452, 10 + i * 8, 3 + i * 3, null, 'rgba(255,255,255,0.45)', 1.5);
    if (on.has('ripple-ring')) ellipse(ctx, 500, 452, 26, 9, null, 'rgba(255,255,255,0.45)', 1.5);

    // Lily pads, frog, lotus
    drawPad(ctx, 150, 358, 26);
    drawPad(ctx, 262, 430, 24);
    drawPad(ctx, 480, 396, 30);
    drawPad(ctx, 400, 448, 22);
    drawPad(ctx, 560, 352, 28);
    drawPad(ctx, 80, 434, 24);
    if (!on.has('frog-gone')) {
      ellipse(ctx, 480, 389, 11, 7, '#3f8c3c', 'rgba(10,50,20,0.6)', 1);
      circle(ctx, 486, 381, 5, '#4ea04a', 'rgba(10,50,20,0.6)', 1);
      circle(ctx, 483, 377, 2.4, '#f7e86a');
      circle(ctx, 489, 377, 2.4, '#f7e86a');
      circle(ctx, 483, 377, 1, '#101010');
      circle(ctx, 489, 377, 1, '#101010');
    }
    if (on.has('lotus-bloom')) {
      for (let i = -2; i <= 2; i++) {
        polygon(ctx, [560, 350, 560 + i * 9 - 5, 334, 560 + i * 12, 324 + Math.abs(i) * 4, 560 + i * 9 + 5, 334], i % 2 ? '#f7a0c4' : '#f26fa0', 'rgba(120,20,60,0.45)', 1);
      }
      circle(ctx, 560, 344, 4, '#f6d13a');
    }

    // Koi
    drawKoi(ctx, 170, 408, 0.35, '#f08a3a', '#fbf2e0', '#f7b46a');
    drawKoi(ctx, 340, 372, -0.25, on.has('koi-recolour') ? '#f3ecd8' : '#f08a3a', on.has('koi-recolour') ? '#f6c945' : '#fbf2e0', '#f7d4a0');
    drawKoi(ctx, 440, 432, 2.9, '#e8e2d2', '#2c2a30', '#cfc7b4');

    // Dragonfly
    line(ctx, 190, 334, 224, 334, '#2d6a8a', 3);
    circle(ctx, 224, 334, 3.5, '#2d6a8a');
    ellipse(ctx, 210, 326, 12, 4, 'rgba(255,255,255,0.65)', 'rgba(60,90,110,0.5)', 1, -0.3);
    ellipse(ctx, 200, 326, 12, 4, 'rgba(255,255,255,0.65)', 'rgba(60,90,110,0.5)', 1, 0.3);
    if (!on.has('dragonfly-wings')) {
      ellipse(ctx, 210, 342, 12, 4, 'rgba(255,255,255,0.65)', 'rgba(60,90,110,0.5)', 1, 0.3);
      ellipse(ctx, 200, 342, 12, 4, 'rgba(255,255,255,0.65)', 'rgba(60,90,110,0.5)', 1, -0.3);
    }

    // Arched bridge (drawn last, over the water)
    softShadow(ctx, 420, 326, 150, 8, 0.3);
    ctx.beginPath();
    ctx.moveTo(290, 322);
    ctx.quadraticCurveTo(420, 222, 550, 322);
    ctx.strokeStyle = '#a8352b';
    ctx.lineWidth = 16;
    ctx.stroke();
    ctx.strokeStyle = '#d65a46';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(290, 318);
    ctx.quadraticCurveTo(420, 218, 550, 318);
    ctx.stroke();
    for (let i = 0; i < 9; i++) {
      if (i === 3 && on.has('bridge-post')) continue;
      const p = deckPoint(0.1 + i * 0.1);
      line(ctx, p.x, p.y - 4, p.x, p.y - 26, '#8f2a22', 4);
      circle(ctx, p.x, p.y - 28, 3.2, '#e8c15a');
    }
    ctx.beginPath();
    ctx.moveTo(300, 290);
    ctx.quadraticCurveTo(420, 190, 540, 290);
    ctx.strokeStyle = '#8f2a22';
    ctx.lineWidth = 4;
    ctx.stroke();
    const lanternPost = deckPoint(0.9);
    line(ctx, lanternPost.x, lanternPost.y - 26, lanternPost.x, lanternPost.y - 14, '#3b2a20', 1.5);
    ellipse(ctx, lanternPost.x, lanternPost.y - 4, 8, 11, on.has('paper-lantern') ? '#f2c14a' : '#d83a3a', '#6b1818', 1.5);
    line(ctx, lanternPost.x - 6, lanternPost.y - 4, lanternPost.x + 6, lanternPost.y - 4, 'rgba(90,10,10,0.55)', 1);

    // Foreground rocks and reeds
    ellipse(ctx, 34, 470, 52, 24, '#7d7a84', 'rgba(20,20,30,0.45)', 2);
    ellipse(ctx, 612, 468, 58, 26, '#8a8791', 'rgba(20,20,30,0.45)', 2);
    ellipse(ctx, 30, 460, 24, 8, 'rgba(255,255,255,0.18)');
    for (let i = 0; i < 9; i++) {
      const rx = 600 + (i - 4) * 5;
      line(ctx, rx, 440, rx + (i - 4) * 2, 380 + (i % 3) * 14, '#5f8a42', 3);
      if (i % 3 === 0) roundRect(ctx, rx + (i - 4) * 2 - 2, 372 + (i % 3) * 14, 5, 16, 2, '#6b4a2a');
    }
  },
};
