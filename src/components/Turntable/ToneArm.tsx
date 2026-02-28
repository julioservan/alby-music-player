import React from 'react';
import './ToneArm.css';

interface ToneArmProps {
  isPlaying: boolean;
  trackProgress: number; // 0 to 1
}

export function ToneArm({ isPlaying, trackProgress }: ToneArmProps) {
  return (
    <div className="tonearm-pivot-container">
      {/* Physical pivot post beneath the arm */}
      <div className="tonearm-pivot-post" />

      {/*
        Assembly rotates around the PIVOT point.
        Pivot is at x=200 from the left of the 225px-wide assembly
        (transform-origin: 200px 50%).
        Left section (0..200px) = main arm + headshell pointing toward record.
        Right section (200..225px) = counterweight stub.
        Assembly left edge is positioned 200px to the LEFT of the pivot center.
      */}
      <div
        className={`tonearm-assembly ${isPlaying ? 'is-playing' : ''}`}
        style={{ '--track-progress': trackProgress } as React.CSSProperties}
      >
        {/* Headshell — leftmost tip, sits over the record */}
        <div className="tonearm-headshell">
          <div className="tonearm-headshell__body" />
          <div className="tonearm-headshell__cartridge" />
          <div className="tonearm-headshell__stylus" />
        </div>

        {/* Main arm tube */}
        <div className="tonearm-tube" />

        {/* Counterweight — right of the pivot */}
        <div className="tonearm-counterweight">
          <div className="tonearm-counterweight__disc" />
        </div>
      </div>

      {/* Pivot cap on top */}
      <div className="tonearm-pivot-cap" />
    </div>
  );
}
