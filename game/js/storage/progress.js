// Saves stars, best times and the mute choice in localStorage. Every access is wrapped:
// private windows and blocked storage must never break the game.

const STORAGE_KEY = 'forgers-eye/progress/v1';
let cache = null;

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function writeStored(data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    // Storage unavailable: progress simply lasts for this visit.
  }
}

export function loadProgress() {
  if (!cache) cache = { scenes: {}, muted: false, ...readStored() };
  return cache;
}

export function getRecord(sceneId) {
  return loadProgress().scenes[sceneId] || null;
}

// summary: { stars, seconds, score, won }. Returns what changed so the results screen can brag.
export function recordResult(sceneId, summary) {
  const progress = loadProgress();
  const old = progress.scenes[sceneId] || { plays: 0, stars: 0, bestSeconds: null, bestScore: 0 };
  const next = {
    plays: old.plays + 1,
    stars: Math.max(old.stars, summary.stars),
    bestSeconds: summary.won && (old.bestSeconds === null || summary.seconds < old.bestSeconds) ? summary.seconds : old.bestSeconds,
    bestScore: Math.max(old.bestScore, summary.score),
  };
  progress.scenes[sceneId] = next;
  writeStored(progress);
  return {
    record: next,
    newBestTime: summary.won && (old.bestSeconds === null || summary.seconds < old.bestSeconds),
    newBestScore: summary.score > old.bestScore,
    firstWin: summary.won && old.stars === 0,
  };
}

export function totalStars() {
  return Object.values(loadProgress().scenes).reduce((sum, record) => sum + record.stars, 0);
}

export function getMutedPreference() {
  return Boolean(loadProgress().muted);
}

export function saveMutedPreference(muted) {
  const progress = loadProgress();
  progress.muted = Boolean(muted);
  writeStored(progress);
}
