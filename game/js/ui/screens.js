// Menu, level select, results and pause: built from templates and shown over the gallery.
import { SCENES, SETS, getScene, getSet, scenesInSet } from '../scenes/index.js';
import { paintThumbnail } from '../render/sceneRenderer.js';
import { getRecord, totalStars } from '../storage/progress.js';
import { formatClock, verdictFor } from '../scoring.js';

const LAYERS = ['screen-menu', 'screen-levels', 'screen-results', 'screen-pause'];

export function showLayer(name) {
  for (const id of LAYERS) document.getElementById(id).hidden = id !== name;
  const open = name ? document.getElementById(name) : null;
  if (open) {
    const first = open.querySelector('[data-autofocus]') || open.querySelector('button');
    if (first) first.focus({ preventScroll: true });
  }
}

function starsMarkup(count, total = 3) {
  let out = '';
  for (let i = 0; i < total; i++) out += `<span class="${i < count ? 'earned' : ''}">&#9733;</span>`;
  return out;
}

function bindActions(root, handlers) {
  root.querySelectorAll('[data-action]').forEach((node) => {
    node.addEventListener('click', () => handlers[node.dataset.action](node.dataset.scene));
  });
}

export function renderMenu(handlers) {
  const root = document.getElementById('screen-menu');
  root.innerHTML = `
    <div class="sheet">
      <div>
        <p class="eyebrow">A gallery of twin paintings</p>
        <h2>Forger's <em>Eye</em></h2>
        <p class="lede">Every painting here hangs twice, and the copy has been tampered with. Find what the forger changed before the clock runs out.</p>
        <div class="button-row">
          <button class="btn primary" data-action="openLevels" data-autofocus>Enter the gallery</button>
          <button class="btn" data-action="startDaily">Daily run</button>
        </div>
        <p class="menu-stars"><b>${totalStars()}</b> / ${SCENES.length * 3} stars collected &middot; 3 sets &middot; ${SCENES.length} pairs</p>
      </div>
      <div class="menu-pair" aria-hidden="true">
        <div class="mini-frame"><canvas id="menu-original"></canvas></div>
        <div class="mini-frame"><canvas id="menu-copy"></canvas></div>
      </div>
    </div>`;
  bindActions(root, handlers);
  const scene = getScene('koi-pond');
  paintThumbnail(document.getElementById('menu-original'), scene, []);
  paintThumbnail(document.getElementById('menu-copy'), scene, scene.differences.slice(0, 6).map((d) => d.id));
}

export function renderLevels(handlers) {
  const root = document.getElementById('screen-levels');
  const columns = SETS.map((set) => {
    const cards = scenesInSet(set.id).map((scene) => {
      const record = getRecord(scene.id);
      const best = record && record.bestSeconds !== null ? `Best hunt ${formatClock(record.bestSeconds)}` : 'Not cleared yet';
      return `
        <button class="level-card" data-action="playScene" data-scene="${scene.id}">
          <canvas data-thumb="${scene.id}"></canvas>
          <span>
            <h4>${scene.title}</h4>
            <span class="meta">${scene.activeCount} of ${scene.differences.length} live &middot; ${formatClock(scene.seconds)}</span>
            <span class="stars" aria-label="${record ? record.stars : 0} of 3 stars">${starsMarkup(record ? record.stars : 0)}</span><br>
            <span class="meta">${best}</span>
          </span>
        </button>`;
    }).join('');
    return `
      <div class="set-column">
        <div class="set-head"><h3>Set ${set.numeral} &middot; ${set.name}</h3><span class="chip ${set.difficulty.toLowerCase()}">${set.difficulty}</span></div>
        <p class="set-tagline">${set.tagline}</p>
        ${cards}
      </div>`;
  }).join('');
  root.innerHTML = `
    <div class="sheet">
      <div class="levels-head">
        <div><p class="eyebrow">The gallery</p><h2>Choose a pair to authenticate</h2></div>
        <p class="star-total"><b>${totalStars()} / ${SCENES.length * 3}</b>stars</p>
      </div>
      <div class="set-columns">${columns}</div>
      <div class="levels-foot">
        <button class="btn small" data-action="openMenu">Back</button>
        <button class="btn small primary" data-action="playAll" data-autofocus>Hang the whole gallery</button>
      </div>
    </div>`;
  bindActions(root, handlers);
  root.querySelectorAll('canvas[data-thumb]').forEach((canvas) => paintThumbnail(canvas, getScene(canvas.dataset.thumb), []));
}

export function renderResults(run, summary, handlers) {
  const root = document.getElementById('screen-results');
  const won = run.state === 'won';
  const set = getSet(run.scene.setId);
  const notes = [];
  if (summary.newBestTime) notes.push('New best time on this pair');
  if (summary.newBestScore && summary.score > 0) notes.push('New high score');
  if (summary.firstWin) notes.push('First authentication of this pair');
  const stars = [0, 1, 2].map((i) => `<span class="${i < summary.stars ? 'earned' : 'empty'}" style="--i:${i}">&#9733;</span>`).join('');
  root.innerHTML = `
    <div class="sheet">
      <p class="eyebrow">Set ${set.numeral} &middot; ${run.scene.title}</p>
      <h2>${verdictFor(run, summary.stars)}</h2>
      <div class="result-stars" aria-label="${summary.stars} of 3 stars">${stars}</div>
      <div class="stat-grid">
        <div class="stat"><b>${run.found.size} / ${run.active.length}</b><span>Differences found</span></div>
        <div class="stat"><b>${won ? formatClock(run.timeLeft) : '0:00'}</b><span>Time left</span></div>
        <div class="stat"><b>${run.mistakes}</b><span>Slips</span></div>
        <div class="stat"><b>${run.hintsUsed}</b><span>Hints used</span></div>
        <div class="stat"><b>x${1 + Math.min(run.bestCombo, 4) * 0.25}</b><span>Best combo</span></div>
        <div class="stat ${summary.newBestScore ? 'record' : ''}"><b>${summary.score.toLocaleString('en-US')}</b><span>Score</span></div>
      </div>
      ${notes.length ? `<p class="record-note">${notes.join(' &middot; ')}</p>` : ''}
      <div class="button-row">
        ${handlers.hasNext ? '<button class="btn primary" data-action="next" data-autofocus>Next pair</button>' : ''}
        <button class="btn ${handlers.hasNext ? '' : 'primary'}" data-action="retry" ${handlers.hasNext ? '' : 'data-autofocus'}>${won ? 'Play again' : 'Try again'}</button>
        <button class="btn" data-action="openLevels">Gallery</button>
      </div>
    </div>`;
  bindActions(root, handlers);
}

export function renderPause(handlers) {
  const root = document.getElementById('screen-pause');
  root.innerHTML = `
    <div class="sheet">
      <p class="eyebrow">The clock is stopped</p>
      <h2>Paused</h2>
      <div class="keys-list">
        <span><kbd>Arrows</kbd> move the cursor</span><span><kbd>Space</kbd> mark a difference</span>
        <span><kbd>H</kbd> hint (3 per pair)</span><span><kbd>Z</kbd> loupe on both pictures</span>
        <span><kbd>R</kbd> restart the pair</span><span><kbd>M</kbd> mute sound</span>
      </div>
      <div class="button-row">
        <button class="btn primary" data-action="resume" data-autofocus>Resume</button>
        <button class="btn" data-action="restart">Restart</button>
        <button class="btn" data-action="openLevels">Gallery</button>
      </div>
    </div>`;
  bindActions(root, handlers);
}
