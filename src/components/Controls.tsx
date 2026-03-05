import './Controls.css';
import { usePlayer, usePlayerActions } from '../context/PlayerContext';

function IconPrev() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function IconShuffle() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
    </svg>
  );
}

function IconRepeatNone() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
    </svg>
  );
}

function IconRepeatOne() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 2 1 1 1-1v4h1z" />
    </svg>
  );
}

export function Controls() {
  const { state } = usePlayer();
  const { play, pause, next, prev, toggleRepeat, toggleShuffle } = usePlayerActions();

  return (
    <div className="controls">
      {/* Shuffle */}
      <button
        className={`controls__btn controls__btn--icon ${state.isShuffle ? 'is-active' : ''}`}
        onClick={toggleShuffle}
        aria-label="Shuffle"
        title="Shuffle"
      >
        <IconShuffle />
      </button>

      {/* Previous */}
      <button
        className="controls__btn controls__btn--icon"
        onClick={prev}
        aria-label="Previous track"
      >
        <IconPrev />
      </button>

      {/* Play / Pause */}
      <button
        className="controls__btn controls__btn--play"
        onClick={state.isPlaying ? pause : play}
        aria-label={state.isPlaying ? 'Pause' : 'Play'}
      >
        {state.isPlaying ? <IconPause /> : <IconPlay />}
      </button>

      {/* Next */}
      <button
        className="controls__btn controls__btn--icon"
        onClick={next}
        aria-label="Next track"
      >
        <IconNext />
      </button>

      {/* Repeat */}
      <button
        className={`controls__btn controls__btn--icon ${state.repeatMode !== 'none' ? 'is-active' : ''}`}
        onClick={toggleRepeat}
        aria-label={`Repeat: ${state.repeatMode}`}
        title={`Repeat: ${state.repeatMode}`}
      >
        {state.repeatMode === 'one' ? <IconRepeatOne /> : <IconRepeatNone />}
      </button>
    </div>
  );
}
