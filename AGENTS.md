# AGENTS.md

## Cursor Cloud specific instructions

**Product:** Alby Music Player — a fully client-side React + TypeScript SPA with a vinyl turntable UI. No backend, no database, no external APIs.

**Single service:** Vite dev server on port 5173 (`npm run dev`).

### Commands

See `CLAUDE.md` for the full list. Key commands:

- `npm run dev` — Vite dev server at http://localhost:5173
- `npm run build` — TypeScript type-check + Vite production build
- `npm run lint` — ESLint (zero-warnings policy)

### Known issues

- **ESLint config missing from repo:** The `.eslintrc.cjs` file was never committed. Running `npm run lint` fails with "ESLint couldn't find a configuration file." The build (`npm run build`) and type-checking (`npx tsc --noEmit`) work correctly.

### No tests

There are no automated test suites in this project. Verification is done via `npm run build` (type-check) and manual testing in the browser.
