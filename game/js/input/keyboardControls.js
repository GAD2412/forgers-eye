// Keyboard play: arrows (or WASD) move a shared cursor over both pictures, Space or Enter
// selects, and single keys drive hint, pause, restart, menu, mute and loupe.

const MOVE_KEYS = {
  ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
  a: [-1, 0], d: [1, 0], w: [0, -1], s: [0, 1],
};

// actions: { moveCursor(dx, dy), selectAtCursor(), useHint(), togglePause(), restartRound(),
//            openMenu(), toggleMute(), toggleLoupe(), isPlaying() }
export function attachKeyboard(actions) {
  window.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const onControl = event.target instanceof HTMLElement && event.target.closest('button, a, input, select, textarea');
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

    if (key === 'Escape') {
      event.preventDefault();
      actions.openMenu();
      return;
    }
    if (key === 'm') {
      actions.toggleMute();
      return;
    }
    if (!actions.isPlaying()) return;

    if (MOVE_KEYS[key]) {
      event.preventDefault();
      const step = event.shiftKey ? 34 : 12;
      actions.moveCursor(MOVE_KEYS[key][0] * step, MOVE_KEYS[key][1] * step);
    } else if ((key === ' ' || key === 'Enter') && !onControl) {
      event.preventDefault();
      actions.selectAtCursor();
    } else if (key === 'h') {
      actions.useHint();
    } else if (key === 'p') {
      actions.togglePause();
    } else if (key === 'r') {
      actions.restartRound();
    } else if (key === 'z') {
      actions.toggleLoupe();
    }
  });
}
