/**
 * IslandView.jsx — Full-screen wrapper for the Viking Island 3D experience.
 *
 * Owns only layout + composition. All HUD sub-components live in ./hud/.
 * Entrance/exit animation is handled by the parent (HomePage) via motion.div.
 */

import { Suspense, lazy, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import LoadingOverlay from './hud/LoadingOverlay';
import StatsHUD       from './hud/StatsHUD';
import TitleHUD       from './hud/TitleHUD';
import HintBar        from './hud/HintBar';
import BackButton     from './hud/BackButton';

const IslandScene = lazy(() => import('./IslandScene'));

// Detect WebGL support once (cached — doesn't create a real renderer).
function checkWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

const IslandView = ({ onToggle2D }) => {
  const { isDark } = useTheme();
  const hasWebGL = useMemo(checkWebGL, []);

  const bg = isDark ? '#07060f' : '#d4883a';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 80px)',
        overflow: 'visible',
        background: bg,
      }}
    >
      {/* Vignette CSS fallback — superseded by post-processing once canvas is ready */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.40) 100%)',
        pointerEvents: 'none', zIndex: 5,
      }} />

      {/* ── WebGL unavailable fallback ───────────────────────────────────────── */}
      {!hasWebGL && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 15,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '12px',
          textAlign: 'center', padding: '24px',
        }}>
          <span style={{ fontSize: '2.5rem' }}>🏝️</span>
          <p style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
            3D view needs WebGL
          </p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', margin: 0, maxWidth: '280px' }}>
            Enable hardware acceleration in Chrome:<br />
            <code style={{ color: '#c084fc' }}>chrome://settings/system</code>
          </p>
        </div>
      )}

      {/* ── 3D Canvas ────────────────────────────────────────────────────────── */}
      {hasWebGL && (
        <motion.div
          style={{ width: '100%', height: '100%' }}
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1,  y: 0,  scale: 1   }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <Suspense fallback={null}>
            <IslandScene isDark={isDark} />
            <LoadingOverlay isDark={isDark} />
          </Suspense>
        </motion.div>
      )}

      {/* HUD overlays */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}
      >
        <TitleHUD    isDark={isDark} />
        <StatsHUD    isDark={isDark} />
        <HintBar     isDark={isDark} />
      </motion.div>

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1,  y: 0 }}
        transition={{ duration: 0.4, delay: 0.85, ease: 'easeOut' }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}
      >
        <BackButton isDark={isDark} onToggle2D={onToggle2D} />
      </motion.div>
    </div>
  );
};

export default IslandView;
