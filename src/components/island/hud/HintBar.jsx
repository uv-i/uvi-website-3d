const HINTS = [
  { full: '🖱 Drag to orbit',             short: '🖱 Drag'    },
  { full: '⚙ Scroll to zoom',             short: '⚙ Zoom'    },
  { full: '🗺 Click a placard to explore', short: '🗺 Explore' },
];

/**
 * Centered bottom strip with orbit/zoom/click instructions.
 * Collapses to short labels on narrow viewports (sm breakpoint).
 */
const HintBar = ({ isDark }) => (
  <div style={{
    position: 'absolute',
    bottom: '60px',
    left: 0, right: 0,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 20,
  }}>
    <div style={{
      display: 'flex',
      gap: '20px',
      padding: '7px 18px',
      background: isDark ? 'rgba(8,8,15,0.60)' : 'rgba(255,246,238,0.70)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderRadius: '999px',
      border: `1px solid ${isDark ? 'rgba(136,85,255,0.18)' : 'rgba(85,0,204,0.12)'}`,
    }}>
      {HINTS.map(({ full, short }) => (
        <span
          key={full}
          style={{
            fontFamily: 'monospace', fontSize: '9px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            color: isDark ? 'rgba(200,190,255,0.45)' : 'rgba(80,50,20,0.45)',
          }}
        >
          <span className="hidden sm:inline">{full}</span>
          <span className="sm:hidden">{short}</span>
        </span>
      ))}
    </div>
  </div>
);

export default HintBar;
