import './VinylRecord.css';

interface VinylRecordProps {
  isPlaying: boolean;
  labelColor: string;
  labelSecondary: string;
  title: string;
  artist: string;
}

export function VinylRecord({
  isPlaying,
  labelColor,
  labelSecondary,
  title,
  artist,
}: VinylRecordProps) {
  return (
    <div className={`vinyl-record ${isPlaying ? 'is-playing' : ''}`}>
      {/* Grooves texture overlay */}
      <div className="vinyl-grooves" />

      {/* Spinning sheen highlight */}
      <div className="vinyl-sheen" />

      {/* Outer ring (label area shadow) */}
      <div className="vinyl-label-ring" />

      {/* Label */}
      <div
        className="vinyl-label"
        style={{
          background: `radial-gradient(circle at 40% 35%, ${labelSecondary}, ${labelColor})`,
        }}
      >
        {/* Label texture lines */}
        <div className="vinyl-label__lines" />

        {/* Label center hole ring */}
        <div className="vinyl-label__text">
          <span className="vinyl-label__title">{title}</span>
          <span className="vinyl-label__artist">{artist}</span>
        </div>

        {/* Spindle hole */}
        <div className="vinyl-spindle" />
      </div>
    </div>
  );
}
