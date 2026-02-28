# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server → http://localhost:5173
npm run build     # tsc type-check + Vite production build
npm run lint      # ESLint (zero warnings policy — --max-warnings 0)
npx tsc --noEmit  # Type-check only (no build output)
```

There are no tests. `npm run preview` serves the production build locally.

## Architecture

### State & Audio Engine

All player state lives in **`src/context/PlayerContext.tsx`** (`useReducer` + React Context). It exposes:
- `usePlayer()` — raw access to `{ state, dispatch, seekRef, currentTrack }`
- `usePlayerActions()` — convenience wrappers: `play`, `pause`, `next`, `prev`, `seek`, `setVolume`, `toggleMute`, `toggleRepeat`, `toggleShuffle`

The audio engine is **`src/hooks/useAudioPlayer.ts`** — a side-effect-only hook called once at the top of `<Player>` in `App.tsx`. It holds `HTMLAudioElement` + `AudioContext → GainNode` refs, wires them to context state via `useEffect`, and exposes a seek function back to context via `seekRef.current`. No component other than `App.tsx` calls this hook.

**`seekRef`** is the bridge between UI (ProgressBar dispatches `SEEK`) and audio (the hook performs the actual `audio.currentTime = t`). The ref is initialized in context and populated by the hook after mount.

### Data Flow

```
Track metadata  →  src/data/playlist.ts  →  initialState in PlayerContext
Local files     →  FileUpload (URL.createObjectURL)  →  ADD_TRACKS action
User gestures   →  usePlayerActions()  →  dispatch  →  reducer  →  state
State changes   →  useAudioPlayer effects  →  HTMLAudioElement / GainNode
```

### Turntable Visual

`src/components/Turntable/` contains the entire visual:
- **`TurntableBase`** — cabinet shell (CSS only, light gray). The bottom bar (knob, pitch slider, RPM dots) is purely decorative.
- **`Turntable`** — assembles stage + platter + VinylRecord + ToneArm. The stage must have `position: relative` for all `position: absolute` children to position correctly.
- **`VinylRecord`** — rotates via `animation-play-state` toggled by `.is-playing` class.
- **`ToneArm`** — pivot is a 44×44px container at `top:14px right:14px` of the stage. The arm assembly (225px wide) extends **leftward** toward the record with `transform-origin: 200px 50%`. Rest = `rotate(-30deg)`, playing = `rotate(5deg…27deg)` driven by the `--track-progress` CSS custom property passed as an inline style.

### TypeScript Notes

- `tsconfig.json` uses `"jsx": "react-jsx"` — do **not** add `import React from 'react'` in components unless `React.` is explicitly used (e.g., `React.CSSProperties`).
- `noUnusedLocals` and `noUnusedParameters` are enabled — all declared variables must be used.
- `Track.duration` is optional — it is not populated from the audio element; the playlist UI shows `—` when absent.

### CSS Conventions

Each component has a co-located `.css` file. No CSS modules, no Tailwind. BEM-style class names (`.component__element--modifier`). Animation play state (`paused` / `running`) is toggled by adding `.is-playing` class — never manipulate `animation` shorthand directly.

### Audio Files

Bundled tracks are served from `public/audio/*.mp3` (not included in repo). Local files added via drag-and-drop use `URL.createObjectURL` and are never uploaded anywhere.
