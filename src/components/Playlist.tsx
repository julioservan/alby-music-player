import './Playlist.css';
import { usePlayer, usePlayerActions } from '../context/PlayerContext';
import { formatTime } from '../utils/formatTime';
import type { Track } from '../types/music';

function PlaylistItem({
  track,
  index,
  isActive,
  isPlaying,
  onSelect,
}: {
  track: Track;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <li
      className={`playlist-item ${isActive ? 'is-active' : ''}`}
      onClick={() => onSelect(index)}
      role="option"
      aria-selected={isActive}
    >
      {/* Color dot */}
      <div
        className="playlist-item__dot"
        style={{ background: track.labelColor }}
      />

      {/* Index or playing indicator */}
      <span className="playlist-item__index">
        {isActive && isPlaying ? (
          <span className="playlist-item__equalizer" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        ) : (
          <>{index + 1}</>
        )}
      </span>

      <div className="playlist-item__info">
        <span className="playlist-item__title">{track.title}</span>
        <span className="playlist-item__artist">{track.artist}</span>
      </div>

      <span className="playlist-item__duration">
        {track.duration ? formatTime(track.duration) : '—'}
      </span>
    </li>
  );
}

export function Playlist() {
  const { state } = usePlayer();
  const { setTrack } = usePlayerActions();

  return (
    <div className="playlist">
      <div className="playlist__header">
        <h3 className="playlist__title">Playlist</h3>
        <span className="playlist__count">{state.tracks.length} tracks</span>
      </div>
      <ul
        className="playlist__list"
        role="listbox"
        aria-label="Playlist"
      >
        {state.tracks.map((track, i) => (
          <PlaylistItem
            key={track.id}
            track={track}
            index={i}
            isActive={i === state.currentIndex}
            isPlaying={state.isPlaying}
            onSelect={setTrack}
          />
        ))}
      </ul>
    </div>
  );
}
