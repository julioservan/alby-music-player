import { useEffect, useRef, useState } from 'react';
import './TrackInfo.css';
import { usePlayer } from '../context/PlayerContext';

export function TrackInfo() {
  const { state, currentTrack } = usePlayer();
  const [displayTrack, setDisplayTrack] = useState(currentTrack);
  const [fadeKey, setFadeKey] = useState(0);
  const prevIndexRef = useRef(state.currentIndex);

  useEffect(() => {
    if (state.currentIndex !== prevIndexRef.current) {
      prevIndexRef.current = state.currentIndex;
      setFadeKey((k) => k + 1);
      const t = setTimeout(() => setDisplayTrack(currentTrack), 100);
      return () => clearTimeout(t);
    } else {
      setDisplayTrack(currentTrack);
    }
  }, [state.currentIndex, currentTrack]);

  if (!displayTrack) return null;

  return (
    <div className="track-info" key={fadeKey}>
      <div
        className="track-info__color-bar"
        style={{ background: displayTrack.labelColor }}
      />
      <div className="track-info__text">
        <h2 className="track-info__title">{displayTrack.title}</h2>
        <p className="track-info__artist">{displayTrack.artist}</p>
      </div>
      {state.isLoading && <div className="track-info__loading-dot" />}
    </div>
  );
}
