# forgers-eye

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/GAD2412/forgers-eye/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/GAD2412/forgers-eye/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Forger's Eye** is a spot the difference game set in a gallery of twin paintings. Every picture hangs twice, and the copy has been tampered with: find what the forger changed before the clock runs out. Plain HTML, CSS and JavaScript modules, no build step, no network, all art drawn by code and all sounds synthesised in the browser.

- Six hand-drawn scenes in three sets that get harder: Morning Studio (bold changes), Afternoon Gallery (smaller, craftier), Midnight Vault (shade, shape and a single star).
- Every scene defines 11 or 12 differences and uses 7 to 10 of them per round, so a replay is a fresh hunt.
- A mark for every find (ring, number badge, sparkles, chime), slips cost time and a heart, a hint that glows over a region (3 per round, with a cooldown), a loupe that magnifies the same spot in both pictures, stars, scores, combos and saved best times.
- Mouse or keyboard: arrows move a shared cursor, Space marks, H hint, Z loupe, P pause, R restart, M mute, Esc menu.
- `?selftest` renders every scene twice and proves each difference is visible, inside its hit shape, not overlapping another, and that nothing else changes.

## Run it

```sh
node serve.ts
# then open http://localhost:8080  (add ?selftest to run the fairness check)
```

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
