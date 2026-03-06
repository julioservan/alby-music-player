# AGENTS.md

## Cursor Cloud specific instructions

**Product:** Alby Music Player — a fully client-side React + TypeScript SPA with a vinyl turntable UI. No backend, no database, no external APIs.

**Single service:** Vite dev server on port 5173 (`npm run dev`).

### Commands

See `CLAUDE.md` for the full list. Key commands:

- `npm run dev` — Vite dev server at http://localhost:5173
- `npm run build` — TypeScript type-check + Vite production build
- `npm run lint` — ESLint (zero-warnings policy)

### Notes

- The `react-refresh/only-export-components` rule whitelists `usePlayer` and `usePlayerActions` in `.eslintrc.cjs` because `PlayerContext.tsx` intentionally co-exports hooks alongside the provider component.

### No tests

There are no automated test suites in this project. Verification is done via `npm run build` (type-check) and manual testing in the browser.
