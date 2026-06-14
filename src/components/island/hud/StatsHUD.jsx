import { STUDIO_STATS } from '../../../data/mockData';

/**
 * Bottom-left frosted pill showing studio headline stats.
 */
const StatsHUD = ({ isDark }) => (
  <div style={{
    position: 'absolute',
    top: '96px',
    right:'20px',
    zIndex: 20,
    pointerEvents: 'none',
  }}>
    <div style={{
      display: 'flex',
      background: isDark ? 'rgba(4,3,10,0.82)' : 'rgba(255,246,235,0.90)',
      border: `1px solid ${isDark ? 'rgba(255,140,0,0.45)' : 'rgba(255,140,0,0.35)'}`,
      borderRadius: '12px',
      overflow: 'hidden',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: isDark
        ? '0 0 18px rgba(255,140,0,0.18), 0 4px 12px rgba(0,0,0,0.5)'
        : '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      {STUDIO_STATS.map((s, i) => (
        <div key={s.label} style={{
          padding: '8px 16px',
          textAlign: 'center',
          borderRight: i < STUDIO_STATS.length - 1
            ? `1px solid ${isDark ? 'rgba(255,140,0,0.20)' : 'rgba(255,140,0,0.15)'}`
            : 'none',
        }}>
          <div style={{
            fontFamily: 'monospace', fontSize: '14px', fontWeight: 700,
            color: '#FF8C00', letterSpacing: '0.04em', lineHeight: 1,
          }}>
            {s.value}
          </div>
          <div style={{
            fontFamily: 'monospace', fontSize: '7px', letterSpacing: '0.12em',
            textTransform: 'uppercase', marginTop: '3px',
            color: isDark ? 'rgba(255,200,140,0.55)' : 'rgba(120,60,0,0.55)',
          }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default StatsHUD;
