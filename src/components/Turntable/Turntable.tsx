import './Turntable.css';
import { TurntableBase } from './TurntableBase';
import { VinylRecord } from './VinylRecord';
import { ToneArm } from './ToneArm';
import { usePlayer } from '../../context/PlayerContext';

export function Turntable() {
  const { state, currentTrack } = usePlayer();

  const trackProgress =
    state.duration > 0 ? state.currentTime / state.duration : 0;

  const labelColor = currentTrack?.labelColor ?? '#c0392b';
  const labelSecondary = currentTrack?.labelSecondary ?? '#e74c3c';

  return (
    <TurntableBase>
      {/* Brand strip sits above stage */}
      <div className="turntable-brand">
        <span className="turntable-brand__name">ALBY</span>
        <span className="turntable-brand__model">HiFi Stereo</span>
      </div>

      {/* Stage: platter + record + tonearm */}
      <div className="turntable-stage">
        {/* Platter */}
        <div className={`turntable-platter ${state.isPlaying ? 'is-playing' : ''}`}>
          <div className="turntable-platter__ring turntable-platter__ring--outer" />
          <div className="turntable-platter__ring turntable-platter__ring--middle" />
          <div className="turntable-platter__ring turntable-platter__ring--inner" />
          <div className="turntable-platter__spindle" />
        </div>

        {/* Vinyl record */}
        <div className="turntable-record-wrapper">
          <VinylRecord
            isPlaying={state.isPlaying}
            labelColor={labelColor}
            labelSecondary={labelSecondary}
            title={currentTrack?.title ?? ''}
            artist={currentTrack?.artist ?? ''}
          />
        </div>

        {/* Tone arm — pivot at top-right, arm sweeps left across record */}
        <ToneArm
          isPlaying={state.isPlaying}
          trackProgress={trackProgress}
        />

        {/* Loading overlay */}
        {state.isLoading && (
          <div className="turntable-loading">
            <div className="turntable-loading__spinner" />
          </div>
        )}
      </div>
    </TurntableBase>
  );
}
