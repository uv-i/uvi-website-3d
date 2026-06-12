import React from 'react';
import use3DTilt from '../../hooks/use3DTilt';

/**
 * Wraps children in a 3D tilt container with:
 *  - Cursor-tracked specular glare (bright white hotspot)
 *  - Cursor-tracked border glow (purple/violet gradient)
 *  - Inner content lifted on the Z-axis (appears to float above the card surface)
 *  - Top-edge rainbow sheen on hover
 *
 * CSS vars --glare-x / --glare-y are written by use3DTilt in sync with mouse.
 */
export default function TiltWrapper({ children, className = '', options = {} }) {
  const tiltRef = use3DTilt(options);

  return (
    <div
      ref={tiltRef}
      className={`relative group/tilt overflow-hidden rounded-xl ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* ── Specular glare hotspot ── */}
      {/* Tracks cursor, bright white — mimics light reflecting off a card surface */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-0 group-hover/tilt:opacity-100 transition-opacity duration-200"
        style={{
          background: 'radial-gradient(circle 140px at var(--glare-x,50%) var(--glare-y,50%), rgba(255,255,255,0.14), transparent 80%)',
          mixBlendMode: 'overlay',
        }}
      />

      {/* ── Border / rim glow ── */}
      {/* A purple radial that brightens the card edge nearest the cursor */}
      <div
        className="absolute inset-0 pointer-events-none z-20 rounded-xl opacity-0 group-hover/tilt:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle 180px at var(--glare-x,50%) var(--glare-y,50%), rgba(136,85,255,0.18), transparent 72%)',
        }}
      />

      {/* ── Top edge gradient bar ── */}
      {/* Fades in on hover — gives the "holographic foil" edge effect */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-40 pointer-events-none opacity-0 group-hover/tilt:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#5500EE] via-fuchsia-400 to-orange-400 rounded-t-xl" />

      {/* ── Inner content — lifted in Z so tilt depth is visible ── */}
      <div
        className="w-full h-full"
        style={{ transform: 'translateZ(28px)', transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </div>
  );
}
