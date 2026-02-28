import React from 'react';
import './TurntableBase.css';

interface TurntableBaseProps {
  children: React.ReactNode;
}

export function TurntableBase({ children }: TurntableBaseProps) {
  return (
    <div className="turntable-base">
      <div className="turntable-base__inner">
        {children}
      </div>

      {/* Bottom control bar: speed dots · brand · knob + pitch */}
      <div className="turntable-base__controls">
        <div className="turntable-base__speed-dots">
          <div className="turntable-base__speed-dot is-active" title="33 RPM" />
          <div className="turntable-base__speed-dot" title="45 RPM" />
          <div className="turntable-base__speed-dot" title="78 RPM" />
        </div>

        <div className="turntable-base__knob" aria-hidden="true" />

        <div className="turntable-base__pitch">
          <span className="turntable-base__pitch-label">±</span>
          <div className="turntable-base__pitch-track">
            <div className="turntable-base__pitch-thumb" />
          </div>
        </div>
      </div>
    </div>
  );
}
