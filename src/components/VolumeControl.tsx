import React, { useRef, useCallback } from 'react';
import './VolumeControl.css';
import { usePlayer, usePlayerActions } from '../context/PlayerContext';

function IconVolumeMute() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

function IconVolumeDown() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
    </svg>
  );
}

function IconVolumeUp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

export function VolumeControl() {
  const { state } = usePlayer();
  const { setVolume, toggleMute } = usePlayerActions();
  const barRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const effectiveVolume = state.isMuted ? 0 : state.volume;

  const getVolumeFromEvent = useCallback((clientX: number): number => {
    if (!barRef.current) return 0;
    const rect = barRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDraggingRef.current = true;
      setVolume(getVolumeFromEvent(e.clientX));

      const onMove = (ev: MouseEvent) => {
        if (isDraggingRef.current) setVolume(getVolumeFromEvent(ev.clientX));
      };
      const onUp = (ev: MouseEvent) => {
        if (isDraggingRef.current) {
          setVolume(getVolumeFromEvent(ev.clientX));
          isDraggingRef.current = false;
        }
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [getVolumeFromEvent, setVolume]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      isDraggingRef.current = true;
      setVolume(getVolumeFromEvent(e.touches[0].clientX));

      const onMove = (ev: TouchEvent) => {
        if (isDraggingRef.current) setVolume(getVolumeFromEvent(ev.touches[0].clientX));
      };
      const onEnd = (ev: TouchEvent) => {
        if (isDraggingRef.current) {
          setVolume(getVolumeFromEvent(ev.changedTouches[0].clientX));
          isDraggingRef.current = false;
        }
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
      };
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('touchend', onEnd);
    },
    [getVolumeFromEvent, setVolume]
  );

  return (
    <div className="volume-control">
      <button
        className="volume-control__mute-btn"
        onClick={toggleMute}
        aria-label={state.isMuted ? 'Unmute' : 'Mute'}
      >
        {state.isMuted || state.volume === 0
          ? <IconVolumeMute />
          : state.volume < 0.5
          ? <IconVolumeDown />
          : <IconVolumeUp />}
      </button>

      <div
        ref={barRef}
        className="volume-control__bar"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(effectiveVolume * 100)}
        aria-label="Volume"
        tabIndex={0}
      >
        <div className="volume-control__track">
          <div
            className="volume-control__fill"
            style={{ width: `${effectiveVolume * 100}%` }}
          />
          <div
            className="volume-control__thumb"
            style={{ left: `${effectiveVolume * 100}%` }}
          />
        </div>
      </div>

      <span className="volume-control__value">
        {Math.round(effectiveVolume * 100)}
      </span>
    </div>
  );
}
