// Set III, scene 5: an observatory dome at night. Every change here is small and sits in
// shade, in a star field, or in a thing you only notice when you read the whole room.
import {
  rect, roundRect, circle, ellipse, polygon, line, curve, verticalGradient, glow, softShadow,
  label, bar, star,
} from '../render/shapes.js';
import { makeRng } from '../util/rng.js';

const CONSTELLATION = [[300, 40], [320, 62], [340, 54], [352, 84], [326, 104], [308, 134], [334, 172]];

function drawCrescent(ctx, cx, cy, radius, offset, colour) {
  const half = offset / 2;
  const h = Math.sqrt(radius * radius - half * half);
  const theta = Math.atan2(h, half);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -theta, theta, true);
  ctx.arc(cx + offset, cy, radius, Math.PI - theta, Math.PI + theta, false);
  ctx.closePath();
  ctx.fillStyle = colour;
  ctx.fill();
}

export const stargazersDome = {
  id: 'stargazers-dome',
  title: "The Stargazer's Dome",
  setId: 3,
  seconds: 130,
  activeCount: 10,
  differences: [
    { id: 'star-missing', kind: 'missing', x: 326, y: 104, r: 13, label: 'A star of the constellation is gone' },
    { id: 'moon-crescent', kind: 'shape', x: 302, y: 204, r: 20, label: 'The crescent moon is thinner' },
    { id: 'finder-angle', kind: 'position', x: 346, y: 255, r: 40, label: 'The finder scope points a different way' },
    { id: 'continent-colour', kind: 'colour', x: 98, y: 318, r: 18, label: 'A continent on the globe changed colour' },
    { id: 'flame-tall', kind: 'size', x: 500, y: 335, r: 23, label: 'The candle flame is taller' },
    { id: 'steam-wisp', kind: 'missing', x: 585, y: 368, r: 17, label: 'A wisp of steam is missing above the cup' },
    { id: 'book-hue', kind: 'colour', x: 463, y: 370, w: 64, h: 18, label: 'A book changed from navy to violet' },
    { id: 'chart-pin', kind: 'position', x: 92, y: 87, r: 22, label: 'The pin on the star chart moved' },
    { id: 'ink-blot', kind: 'added', x: 150, y: 128, r: 14, label: 'An ink blot stains the chart' },
    { id: 'dome-lamp', kind: 'colour', x: 499, y: 92, r: 40, label: 'The hanging lamp glows green, not amber' },
    { id: 'rug-diamond', kind: 'colour', x: 310, y: 458, r: 11, label: 'One diamond on the rug changed colour' },
  ],
  draw(ctx, on) {
    const rng = makeRng(5505);

    // Dome interior
    rect(ctx, 0, 0, 640, 480, '#2a2036');
    for (let i = -8; i <= 8; i++) line(ctx, 320 + i * 12, 0, 320 + i * 80, 400, 'rgba(120,80,50,0.55)', 4);
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.ellipse(320, -80 + i * 80, 420 - i * 10, 70, 0, 0, Math.PI);
      ctx.strokeStyle = 'rgba(150,100,60,0.5)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    for (let i = 0; i < 40; i++) {
      circle(ctx, rng() * 640, rng() * 400, 2.4, 'rgba(210,160,90,0.35)');
    }

    // Night sky in the slit
    polygon(ctx, [262, 0, 378, 0, 366, 252, 274, 252], '#4a3320');
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(272, 0);
    ctx.lineTo(368, 0);
    ctx.lineTo(358, 248);
    ctx.lineTo(282, 248);
    ctx.closePath();
    ctx.clip();
    verticalGradient(ctx, 262, 0, 120, 252, [[0, '#0b0f2e'], [1, '#3a4a8a']]);
    for (let i = 0; i < 60; i++) circle(ctx, 270 + rng() * 100, rng() * 250, 0.6 + rng() * 0.8, `rgba(255,255,240,${0.3 + rng() * 0.5})`);
    for (let i = 0; i < CONSTELLATION.length - 1; i++) {
      line(ctx, CONSTELLATION[i][0], CONSTELLATION[i][1], CONSTELLATION[i + 1][0], CONSTELLATION[i + 1][1], 'rgba(160,190,255,0.28)', 1);
    }
    CONSTELLATION.forEach(([sx, sy], i) => {
      if (i === 4 && on.has('star-missing')) return;
      glow(ctx, sx, sy, 11, '#cfe0ff', 0.7);
      star(ctx, sx, sy, 4.5, 4, '#fffbe8', 0.2, 0.35);
    });
    glow(ctx, 302, 204, 40, '#fff2c0', 0.35);
    drawCrescent(ctx, 302, 204, 16, on.has('moon-crescent') ? 14 : 8, '#f6eecb');
    ctx.restore();

    // Moonlight on the floor
    polygon(ctx, [282, 252, 358, 252, 450, 470, 190, 470], 'rgba(200,215,255,0.07)');

    // Telescope
    softShadow(ctx, 322, 456, 100, 10, 0.35);
    line(ctx, 322, 356, 232, 452, '#5b3a24', 7);
    line(ctx, 322, 356, 322, 462, '#5b3a24', 7);
    line(ctx, 322, 356, 412, 452, '#5b3a24', 7);
    circle(ctx, 322, 352, 11, '#d9ad4a', '#6b4a14', 2);
    bar(ctx, 325, 255, 190, 32, -1.41, '#2f5f8a', 'rgba(10,20,40,0.7)', 2);
    bar(ctx, 322, 205, 20, 34, -1.41, '#d9ad4a', '#6b4a14', 1.5);
    bar(ctx, 328, 305, 20, 34, -1.41, '#d9ad4a', '#6b4a14', 1.5);
    bar(ctx, 330, 160, 18, 38, -1.41, '#3a7ab0', '#6b4a14', 1.5);
    ctx.save();
    ctx.translate(332, 292);
    ctx.rotate(on.has('finder-angle') ? -1.25 : -1.45);
    roundRect(ctx, 0, -5, 70, 10, 4, '#d9ad4a', '#6b4a14', 1.5);
    roundRect(ctx, 60, -7, 14, 14, 3, '#2f5f8a', '#6b4a14', 1.5);
    ctx.restore();
    line(ctx, 322, 332, 332, 296, '#6b4a14', 3);

    // Star chart on the wall
    polygon(ctx, [30, 40, 180, 38, 182, 150, 28, 152], '#e6d6a8', '#8a6a3a', 2.5);
    [[50, 60], [76, 70], [104, 58], [128, 84], [152, 66], [64, 110], [112, 118], [138, 130]].forEach(([cx, cy], i, all) => {
      circle(ctx, cx, cy, 2.4, '#3b2a14');
      if (i > 0 && i < 6) line(ctx, all[i - 1][0], all[i - 1][1], cx, cy, 'rgba(60,40,20,0.5)', 1);
    });
    ellipse(ctx, 100, 100, 44, 30, null, 'rgba(60,40,20,0.35)', 1);
    const pin = on.has('chart-pin') ? [98, 92] : [84, 80];
    line(ctx, pin[0], pin[1], pin[0] + 3, pin[1] + 7, '#6a6a70', 2);
    circle(ctx, pin[0], pin[1], 4.5, '#d9483b', 'rgba(60,10,10,0.6)', 1);
    if (on.has('ink-blot')) {
      ellipse(ctx, 150, 128, 8, 6, '#1b1630');
      circle(ctx, 143, 134, 3, '#1b1630');
      circle(ctx, 158, 124, 2.4, '#1b1630');
    }

    // Hanging lamp
    line(ctx, 500, 0, 500, 62, '#8a6a2a', 2);
    glow(ctx, 500, 90, 80, on.has('dome-lamp') ? '#a8e08a' : '#ffcf6a', 0.4);
    polygon(ctx, [488, 66, 512, 66, 520, 100, 480, 100], on.has('dome-lamp') ? '#9ad08a' : '#f2b84a', '#6b4a14', 2);
    rect(ctx, 484, 62, 32, 6, '#6b4a14');
    circle(ctx, 500, 88, 6, 'rgba(255,255,255,0.65)');

    // Floor and rug
    rect(ctx, 0, 410, 640, 70, '#3a2a2c');
    for (let i = 0; i < 9; i++) line(ctx, 0, 416 + i * 8, 640, 416 + i * 8, 'rgba(0,0,0,0.25)', 1);
    ellipse(ctx, 240, 458, 180, 24, '#6a2c3a', '#d9ad4a', 2.5);
    for (let i = 0; i < 8; i++) {
      const dx = 110 + i * 40;
      const colour = i === 5 && on.has('rug-diamond') ? '#d6a23a' : '#c04a3a';
      polygon(ctx, [dx, 450, dx + 9, 458, dx, 466, dx - 9, 458], colour);
    }

    // Globe
    softShadow(ctx, 110, 432, 36, 7, 0.35);
    line(ctx, 110, 322, 110, 420, '#8a6a2a', 5);
    ellipse(ctx, 110, 424, 30, 8, '#6b4a14');
    circle(ctx, 110, 328, 44, null, '#d9ad4a', 4);
    circle(ctx, 110, 328, 38, '#2f5f8a');
    ctx.save();
    ctx.beginPath();
    ctx.arc(110, 328, 38, 0, Math.PI * 2);
    ctx.clip();
    polygon(ctx, [86, 308, 104, 304, 112, 318, 100, 330, 88, 326], on.has('continent-colour') ? '#c9a23a' : '#5b8f4a');
    polygon(ctx, [118, 330, 140, 322, 146, 346, 130, 360, 120, 348], '#5b8f4a');
    polygon(ctx, [92, 346, 108, 350, 104, 366, 92, 362], '#5b8f4a');
    glow(ctx, 96, 312, 44, '#ffffff', 0.25);
    ctx.restore();

    // Desk
    rect(ctx, 424, 400, 216, 80, '#6d4526', '#2a1810', 2);
    rect(ctx, 424, 400, 216, 5, 'rgba(255,255,255,0.2)');
    // Books
    roundRect(ctx, 432, 388, 62, 12, 2, '#a83a3a', 'rgba(0,0,0,0.5)', 1);
    roundRect(ctx, 436, 376, 56, 12, 2, '#2f7a5a', 'rgba(0,0,0,0.5)', 1);
    roundRect(ctx, 434, 364, 58, 12, 2, on.has('book-hue') ? '#7a3f9a' : '#2f3f8a', 'rgba(0,0,0,0.5)', 1);
    // Candle
    rect(ctx, 494, 360, 12, 40, '#efe3c0', 'rgba(90,70,30,0.5)', 1);
    ellipse(ctx, 500, 400, 16, 4, '#8a6a2a');
    line(ctx, 500, 360, 500, 354, '#2a1f14', 2);
    const flameRy = on.has('flame-tall') ? 19 : 12;
    glow(ctx, 500, 346, 52, '#ffcf6a', 0.4);
    ellipse(ctx, 500, 354 - flameRy, 6, flameRy, '#ffb93a');
    ellipse(ctx, 500, 354 - flameRy * 0.7, 3, flameRy * 0.55, '#fff2b0');
    // Cup and steam
    ellipse(ctx, 570, 402, 20, 5, '#d9d2c0');
    roundRect(ctx, 556, 384, 28, 18, 5, '#f1ead6', 'rgba(60,50,40,0.5)', 1.5);
    curve(ctx, [584, 388, 596, 392, 584, 398], '#f1ead6', 3);
    for (let i = 0; i < 3; i++) {
      if (i === 2 && on.has('steam-wisp')) continue;
      curve(ctx, [562 + i * 12, 380, 556 + i * 12, 368, 564 + i * 12, 356], 'rgba(255,255,255,0.55)', 2.5);
    }
    // Quill
    bar(ctx, 612, 392, 36, 3, -0.5, '#efe3c0', 'rgba(90,70,30,0.5)', 1);
  },
};
