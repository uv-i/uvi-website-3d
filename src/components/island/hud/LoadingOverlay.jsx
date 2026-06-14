import { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';

/**
 * Fades out and unmounts once the GLB finishes loading.
 */
const LoadingOverlay = ({ isDark }) => {
  const { progress } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(t);
    }
  }, [progress]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark ? '#07060f' : '#f5ede4',
        zIndex: 30,
        gap: '20px',
        pointerEvents: 'none',
        transition: 'opacity 0.45s ease',
        opacity: progress >= 100 ? 0 : 1,
      }}
    >
      {/* Dual-ring spinner */}
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <div style={{
          width: 64, height: 64,
          borderRadius: '50%',
          border: `2px solid ${isDark ? 'rgba(136,85,255,0.2)' : 'rgba(85,0,204,0.1)'}`,
          borderTop: `2px solid ${isDark ? '#8855FF' : '#5500CC'}`,
          animation: 'spin 1s linear infinite',
        }} />
        <div style={{
          position: 'absolute',
          inset: '12px',
          borderRadius: '50%',
          border: `2px solid ${isDark ? 'rgba(255,140,0,0.15)' : 'rgba(255,140,0,0.2)'}`,
          borderBottom: '2px solid #FF8C00',
          animation: 'spin 1.5s linear infinite reverse',
        }} />
      </div>

      <div style={{
        fontFamily: 'monospace',
        fontSize: '10px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: isDark ? 'rgba(200,190,255,0.5)' : 'rgba(85,60,30,0.5)',
      }}>
        Loading Viking Island
      </div>

      <div style={{ width: 200 }}>
        <div style={{
          width: '100%', height: '2px',
          background: isDark ? 'rgba(136,85,255,0.15)' : 'rgba(85,0,204,0.1)',
          borderRadius: '1px', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(to right, #8855FF, #FF8C00)',
            borderRadius: '1px', transition: 'width 0.25s ease',
          }} />
        </div>
        <div style={{
          textAlign: 'right', marginTop: '6px',
          fontFamily: 'monospace', fontSize: '9px',
          color: isDark ? 'rgba(200,190,255,0.35)' : 'rgba(85,60,30,0.35)',
          letterSpacing: '0.1em',
        }}>
          {Math.round(progress)}%
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoadingOverlay;
