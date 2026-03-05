# Alby — Music Player

A vinyl turntable music player with a warm audiophile aesthetic. Built with React, TypeScript, and the Web Audio API.

**Live demo:** https://alby-music-player-u9of.vercel.app/

## Features

- Animated vinyl turntable with tone arm that tracks playback progress
- Play, pause, skip, shuffle and repeat (none / all / one)
- Interactive progress bar and volume control
- Drag-and-drop local audio files (MP3, FLAC, WAV, OGG…)
- Fully functional Web Audio API engine with smooth volume ramping

## Stack

- React 18 + TypeScript
- Vite 5
- Web Audio API (`AudioContext` + `GainNode`)
- Pure CSS animations — no UI libraries

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
npm run lint      # ESLint (zero warnings)
```

## Audio files

Bundled tracks are from [Bensound](https://www.bensound.com) (CC BY-ND 4.0) and served from `public/audio/`.

To add your own tracks, drop audio files onto the player or edit `src/data/playlist.ts`.
