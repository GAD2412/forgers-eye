// Set I, scene 1: a bakery shop front. Warm brick, striped awning, a sleepy cat.
// draw(ctx, on) paints the picture; `on` holds the ids of differences that are switched
// on, so the original panel draws with none and the copy panel with the round's active ones.
import {
  rect, roundRect, circle, ellipse, polygon, line, curve, verticalGradient, glow, softShadow,
  spacedText, label, bar,
} from '../render/shapes.js';
import { makeRng } from '../util/rng.js';

const CREAM = '#fbf0d6';
const AWNING_RED = '#d9483b';

export const bakersWindow = {
  id: 'bakers-window',
  title: "The Baker's Window",
  setId: 1,
  seconds: 150,
  activeCount: 7,
  differences: [
    { id: 'sign-plus', kind: 'text', x: 320, y: 38, r: 18, label: 'The shop sign shows a plus where an ampersand was' },
    { id: 'awning-teal', kind: 'colour', x: 345, y: 115, r: 42, label: 'One awning stripe turned teal' },
    { id: 'sparrow-gone', kind: 'missing', x: 125, y: 62, r: 17, label: 'The sparrow left the awning' },
    { id: 'third-baguette', kind: 'missing', x: 176, y: 190, r: 22, label: 'A baguette is missing from the basket' },
    { id: 'big-loaf', kind: 'size', x: 330, y: 207, r: 34, label: 'The middle loaf is bigger' },
    { id: 'cherry-green', kind: 'colour', x: 440, y: 183, r: 20, label: 'A cherry on the cake turned green' },
    { id: 'jam-label', kind: 'colour', x: 495, y: 216, r: 15, label: 'The jam jar label changed colour' },
    { id: 'cat-awake', kind: 'detail', x: 222, y: 280, r: 18, label: 'The cat has opened its eyes' },
    { id: 'tin-dots', kind: 'pattern', x: 430, y: 282, r: 20, label: 'Stripes became dots on a biscuit tin' },
    { id: 'lamp-blue', kind: 'colour', x: 232, y: 192, r: 22, label: 'The hanging lamp shade is blue' },
    { id: 'flower-blue', kind: 'colour', x: 268, y: 334, r: 17, label: 'A window-box flower turned blue' },
    { id: 'chalk-nine', kind: 'text', x: 61, y: 368, r: 22, label: 'The chalkboard count reads 9 instead of 6' },
  ],
  draw(ctx, on) {
    const rng = makeRng(1101);

    // Brick wall
    rect(ctx, 0, 0, 640, 480, '#c4694a');
    for (let row = 0; row < 20; row++) {
      const y = 10 + row * 20;
      const off = row % 2 ? 20 : 0;
      for (let x = -40 + off; x < 640; x += 40) {
        const t = rng();
        ctx.fillStyle = t < 0.3 ? 'rgba(255,214,170,0.12)' : t < 0.55 ? 'rgba(60,20,10,0.12)' : 'rgba(0,0,0,0)';
        ctx.fillRect(x + 1, y + 1, 38, 18);
        line(ctx, x, y, x, y + 20, 'rgba(70,30,20,0.3)', 1);
      }
      line(ctx, 0, y, 640, y, 'rgba(70,30,20,0.35)', 1);
    }
    rect(ctx, 0, 0, 640, 10, '#6b3b2e');

    // Cobbles and step
    rect(ctx, 0, 400, 640, 80, '#6b6270');
    for (let i = 0; i < 60; i++) {
      ellipse(ctx, rng() * 640, 405 + rng() * 72, 16 + rng() * 14, 6 + rng() * 4, `rgba(${150 + rng() * 40},${140 + rng() * 40},${150 + rng() * 40},0.35)`);
    }
    rect(ctx, 100, 382, 440, 18, '#a39a8d');
    rect(ctx, 100, 382, 440, 4, 'rgba(255,255,255,0.25)');
    softShadow(ctx, 320, 402, 230, 9, 0.28);

    // Shop sign
    roundRect(ctx, 150, 10, 340, 56, 10, '#2f3b52', '#d9ad4a', 4);
    const signText = on.has('sign-plus') ? 'FLOUR + EMBER' : 'FLOUR & EMBER';
    spacedText(ctx, signText, 320, 38, 28, 22, '#f6dc9c');

    // Window
    roundRect(ctx, 108, 150, 424, 214, 10, '#5b3a24');
    verticalGradient(ctx, 122, 164, 396, 186, [[0, '#ffe6b0'], [1, '#f2a65a']]);
    glow(ctx, 320, 260, 230, '#ffd27a', 0.4);
    rect(ctx, 122, 232, 396, 10, '#8a5a36');
    rect(ctx, 122, 298, 396, 10, '#8a5a36');
    rect(ctx, 122, 232, 396, 3, 'rgba(255,255,255,0.25)');
    rect(ctx, 122, 298, 396, 3, 'rgba(255,255,255,0.25)');

    // Hanging lamp
    line(ctx, 232, 164, 232, 184, '#3b2a20', 2);
    polygon(ctx, [218, 200, 226, 182, 238, 182, 246, 200], on.has('lamp-blue') ? '#3d7be8' : '#e8553d', '#3b2a20', 2);
    circle(ctx, 232, 203, 4, '#fff1b8');
    glow(ctx, 232, 205, 34, '#ffe9a0', 0.55);

    // Baguette basket
    for (let i = 0; i < 3; i++) {
      if (i === 2 && on.has('third-baguette')) continue;
      bar(ctx, 148 + i * 14, 192, 50, 10, -1.45 + i * 0.18, '#d99a52', 'rgba(90,50,20,0.6)', 1.5);
    }
    roundRect(ctx, 130, 210, 58, 22, 4, '#8b5a2b', '#5b3a24', 2);
    for (let i = 0; i < 4; i++) line(ctx, 136 + i * 14, 212, 136 + i * 14, 230, 'rgba(60,30,10,0.4)', 1);

    // Loaves
    for (let i = 0; i < 3; i++) {
      const big = i === 1 && on.has('big-loaf');
      const rx = big ? 31 : 24;
      const ry = big ? 28 : 20;
      const cx = 275 + i * 55;
      ellipse(ctx, cx, 232 - ry, rx, ry, '#c98a4b', 'rgba(90,50,20,0.55)', 1.5);
      for (let s = -1; s <= 1; s++) line(ctx, cx + s * 9 - 3, 232 - ry - 8, cx + s * 9 + 3, 232 - ry + 6, '#f1c98a', 2);
    }

    // Cake and cherries
    ellipse(ctx, 440, 230, 40, 6, '#e7d6b8', 'rgba(90,60,30,0.5)', 1);
    roundRect(ctx, 412, 192, 56, 36, 4, '#7a4a2a');
    rect(ctx, 412, 206, 56, 6, '#f6e7c2');
    ellipse(ctx, 440, 192, 28, 7, '#f7c6d0', 'rgba(120,60,70,0.5)', 1);
    [[428, 186], [440, 183], [452, 186]].forEach(([cx, cy], i) => {
      circle(ctx, cx, cy, 5.5, i === 1 && on.has('cherry-green') ? '#2d9a4e' : '#c4122f', 'rgba(60,0,10,0.5)', 1);
      circle(ctx, cx - 1.5, cy - 1.5, 1.4, 'rgba(255,255,255,0.7)');
    });

    // Jam jar
    roundRect(ctx, 482, 200, 26, 32, 5, '#b3263e', '#5b0f1c', 1.5);
    rect(ctx, 480, 196, 30, 6, '#e8d8a8');
    roundRect(ctx, 485, 209, 20, 14, 2, on.has('jam-label') ? '#6aa6e8' : '#fbf0d6');
    circle(ctx, 495, 216, 3, '#b3263e');

    // Sleeping cat on the lower shelf
    ellipse(ctx, 270, 283, 46, 17, '#e0903c', 'rgba(90,40,10,0.55)', 1.5);
    for (let i = 0; i < 3; i++) curve(ctx, [250 + i * 24, 268, 254 + i * 24, 276, 250 + i * 24, 284], 'rgba(150,70,20,0.6)', 2.5);
    curve(ctx, [314, 288, 336, 296, 322, 276], '#e0903c', 6);
    circle(ctx, 222, 281, 15, '#e8a04a', 'rgba(90,40,10,0.55)', 1.5);
    polygon(ctx, [210, 272, 212, 258, 221, 268], '#e8a04a', 'rgba(90,40,10,0.55)', 1.5);
    polygon(ctx, [226, 268, 235, 259, 236, 273], '#e8a04a', 'rgba(90,40,10,0.55)', 1.5);
    if (on.has('cat-awake')) {
      circle(ctx, 216, 279, 3.2, '#2d5a2d');
      circle(ctx, 227, 279, 3.2, '#2d5a2d');
      circle(ctx, 216, 279, 1.2, '#101010');
      circle(ctx, 227, 279, 1.2, '#101010');
    } else {
      curve(ctx, [212, 279, 216, 283, 220, 279], '#3a1d0a', 1.8);
      curve(ctx, [223, 279, 227, 283, 231, 279], '#3a1d0a', 1.8);
    }
    circle(ctx, 221.5, 285, 1.8, '#c0504d');

    // Biscuit tins
    [380, 430, 480].forEach((tx, i) => {
      roundRect(ctx, tx - 20, 262, 40, 36, 6, ['#3f8f8a', '#c9a13a', '#8a4fa8'][i], 'rgba(30,20,20,0.55)', 1.5);
      rect(ctx, tx - 21, 262, 42, 7, 'rgba(255,255,255,0.35)');
      if (i === 1) {
        for (let k = 0; k < 3; k++) {
          if (on.has('tin-dots')) circle(ctx, tx - 10 + k * 10, 284, 3.6, '#fbf0d6');
          else rect(ctx, tx - 13 + k * 10, 273, 6, 22, '#fbf0d6');
        }
      } else {
        for (let k = 0; k < 3; k++) circle(ctx, tx - 10 + k * 10, 284, 3.2, 'rgba(255,255,255,0.45)');
      }
    });

    // Window reflections
    polygon(ctx, [140, 164, 200, 164, 150, 350, 122, 350, 122, 200], 'rgba(255,255,255,0.1)');
    polygon(ctx, [380, 164, 410, 164, 340, 350, 312, 350], 'rgba(255,255,255,0.07)');
    roundRect(ctx, 108, 150, 424, 214, 10, null, '#3a2314', 4);

    // Window box with flowers
    roundRect(ctx, 120, 356, 400, 26, 4, '#6b4328', '#3a2314', 2);
    const petals = ['#f27999', '#f6c945', '#8c6bd6'];
    for (let i = 0; i < 9; i++) {
      const fx = 145 + i * 41;
      line(ctx, fx, 358, fx, 336, '#3d7a3a', 3);
      circle(ctx, fx - 7, 348, 5, '#4b9a45');
      const colour = i === 3 && on.has('flower-blue') ? '#3d7be8' : petals[i % 3];
      for (let p = 0; p < 5; p++) {
        const a = (p * Math.PI * 2) / 5;
        circle(ctx, fx + Math.cos(a) * 7, 334 + Math.sin(a) * 7, 5, colour);
      }
      circle(ctx, fx, 334, 4, '#7a3f1a');
    }

    // Awning
    for (let i = 0; i < 10; i++) {
      const x = 70 + i * 50;
      const colour = i === 5 && on.has('awning-teal') ? '#2f9c97' : i % 2 ? CREAM : AWNING_RED;
      rect(ctx, x, 78, 50, 46, colour);
      ctx.beginPath();
      ctx.arc(x + 25, 124, 25, 0, Math.PI);
      ctx.fillStyle = colour;
      ctx.fill();
      ctx.strokeStyle = 'rgba(70,20,15,0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    rect(ctx, 64, 70, 512, 12, '#7a2d25');
    rect(ctx, 64, 70, 512, 3, 'rgba(255,255,255,0.25)');
    verticalGradient(ctx, 70, 150, 500, 14, [[0, 'rgba(30,10,10,0.38)'], [1, 'rgba(30,10,10,0)']]);

    // Sparrow on the awning rail
    if (!on.has('sparrow-gone')) {
      polygon(ctx, [114, 62, 100, 70, 112, 68], '#6e5236');
      ellipse(ctx, 125, 63, 12, 8, '#8b6a4a', 'rgba(50,30,10,0.55)', 1);
      ellipse(ctx, 126, 66, 7, 4, '#d9c3a0');
      circle(ctx, 135, 57, 6, '#8b6a4a', 'rgba(50,30,10,0.55)', 1);
      polygon(ctx, [140, 56, 147, 58, 140, 60], '#e8b33a');
      circle(ctx, 136, 55.5, 1.2, '#101010');
    }

    // Chalkboard A-frame
    line(ctx, 30, 400, 44, 290, '#6b4a2a', 5);
    line(ctx, 92, 400, 78, 290, '#6b4a2a', 5);
    roundRect(ctx, 22, 290, 78, 112, 4, '#2e3d34', '#8b5a2b', 5);
    label(ctx, 'TODAY', 61, 311, 13, 'rgba(250,246,230,0.9)', 'center', 'Georgia, serif', '700');
    label(ctx, 'RYE', 61, 332, 16, 'rgba(250,246,230,0.9)', 'center', 'Georgia, serif', '700');
    line(ctx, 36, 344, 86, 344, 'rgba(250,246,230,0.5)', 1.5);
    label(ctx, on.has('chalk-nine') ? '9' : '6', 61, 372, 38, 'rgba(250,246,230,0.92)', 'center', 'Georgia, serif', '700');

    // Street lamp on the right
    rect(ctx, 586, 160, 8, 245, '#2c2a36');
    polygon(ctx, [574, 160, 606, 160, 600, 130, 580, 130], '#ffe9a0', '#2c2a36', 3);
    polygon(ctx, [572, 130, 608, 130, 590, 112], '#2c2a36');
    glow(ctx, 590, 146, 60, '#ffe9a0', 0.5);
    ellipse(ctx, 590, 405, 18, 5, 'rgba(20,10,30,0.3)');
  },
};
