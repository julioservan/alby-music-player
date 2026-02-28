import { PlayerProvider } from './context/PlayerContext';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { Turntable } from './components/Turntable/Turntable';
import { TrackInfo } from './components/TrackInfo';
import { ProgressBar } from './components/ProgressBar';
import { Controls } from './components/Controls';
import { VolumeControl } from './components/VolumeControl';
import { Playlist } from './components/Playlist';
import { FileUpload } from './components/FileUpload';

// Inner component so it has access to PlayerContext
function Player() {
  useAudioPlayer(); // Wire up audio engine to context
  return (
    <main className="app-layout">
      {/* Left: Turntable visual */}
      <section className="app-turntable-panel" aria-label="Turntable">
        <Turntable />
      </section>

      {/* Right: Controls panel */}
      <section className="app-controls-panel" aria-label="Player controls">
        <TrackInfo />
        <ProgressBar />
        <Controls />
        <VolumeControl />
        <div className="app-divider" />
        <Playlist />
        <FileUpload />
      </section>
    </main>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <div className="app-root">
        <header className="app-header">
          <h1 className="app-header__logo">
            <span className="app-header__logo-alby">ALBY</span>
            <span className="app-header__logo-sub">Music Player</span>
          </h1>
          <p className="app-header__attribution">
            Music by{' '}
            <a
              href="https://www.bensound.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bensound
            </a>{' '}
            (CC BY-ND 4.0)
          </p>
        </header>

        <Player />

        <footer className="app-footer">
          <p>Built with React + Vite · Web Audio API</p>
        </footer>
      </div>
    </PlayerProvider>
  );
}
