import { Map } from 'lucide-react';

/**
 * Centered "Back to 2D View" pill button at the bottom of the island canvas.
 */
const BackButton = ({ onToggle2D, isDark }) => (
  <div style={{
    position: 'absolute',
    bottom: '16px',
    left: 0, right: 0,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 20,
  }}>
    <button
      onClick={onToggle2D}
      style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        padding: '8px 20px', borderRadius: '999px',
        border: `1.5px solid ${isDark ? 'rgba(136,85,255,0.35)' : 'rgba(85,0,204,0.25)'}`,
        background: isDark ? 'rgba(8,8,15,0.75)' : 'rgba(255,246,238,0.85)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        color: isDark ? '#c4a8ff' : '#5500CC',
        fontFamily: 'monospace', fontSize: '10px',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        cursor: 'pointer', fontWeight: 700,
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = isDark ? 'rgba(136,85,255,0.7)' : 'rgba(85,0,204,0.5)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = isDark
          ? '0 4px 16px rgba(136,85,255,0.3)'
          : '0 4px 16px rgba(85,0,204,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isDark ? 'rgba(136,85,255,0.35)' : 'rgba(85,0,204,0.25)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <Map size={12} />
      Back to 2D View
    </button>
  </div>
);

export default BackButton;
