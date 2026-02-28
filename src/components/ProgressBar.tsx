import React, { useRef, useCallback } from 'react';
import './ProgressBar.css';
import { usePlayer, usePlayerActions } from '../context/PlayerContext';
import { formatTime } from '../utils/formatTime';

export function ProgressBar() {
  const { state } = usePlayer();
  const { seek } = usePlayerActions();
  const isDraggingRef = useRef(false);
  const barRef = useRef<HTMLDivElement>(null);

  const progress = state.duration > 0
    ? (state.currentTime / state.duration) * 100
    : 0;

  const getTimeFromEvent = useCallback(
    (clientX: number): number => {
      if (!barRef.current || state.duration === 0) return 0;
      const rect = barRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return ratio * state.duration;
    },
    [state.duration]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDraggingRef.current = true;
      seek(getTimeFromEvent(e.clientX));

      const onMouseMove = (ev: MouseEvent) => {
        if (isDraggingRef.current) seek(getTimeFromEvent(ev.clientX));
      };
      const onMouseUp = (ev: MouseEvent) => {
        if (isDraggingRef.current) {
          seek(getTimeFromEvent(ev.clientX));
          isDraggingRef.current = false;
        }
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [getTimeFromEvent, seek]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      isDraggingRef.current = true;
      seek(getTimeFromEvent(e.touches[0].clientX));

      const onTouchMove = (ev: TouchEvent) => {
        if (isDraggingRef.current) seek(getTimeFromEvent(ev.touches[0].clientX));
      };
      const onTouchEnd = (ev: TouchEvent) => {
        if (isDraggingRef.current) {
          const touch = ev.changedTouches[0];
          seek(getTimeFromEvent(touch.clientX));
          isDraggingRef.current = false;
        }
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
      };

      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd);
    },
    [getTimeFromEvent, seek]
  );

  return (
    <div className="progress-bar-container">
      <span className="progress-bar__time progress-bar__time--current">
        {formatTime(state.currentTime)}
      </span>

      <div
        ref={barRef}
        className="progress-bar"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={state.duration}
        aria-valuenow={state.currentTime}
        aria-label="Seek"
        tabIndex={0}
      >
        <div className="progress-bar__track">
          <div
            className="progress-bar__fill"
            style={{ width: `${progress}%` }}
          />
          <div
            className="progress-bar__thumb"
            style={{ left: `${progress}%` }}
          />
        </div>
      </div>

      <span className="progress-bar__time progress-bar__time--duration">
        {formatTime(state.duration)}
      </span>
    </div>
  );
}
