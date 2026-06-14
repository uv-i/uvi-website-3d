/**
 * IslandView.jsx — Full-screen wrapper for the Viking Island 3D experience.
 *
 * Owns only layout + composition. All HUD sub-components live in ./hud/.
 */

import { Suspense, lazy } from 'react';
import { useTheme } from '../../context/ThemeContext';
import LoadingOverlay from './hud/LoadingOverlay';
import StatsHUD       from './hud/StatsHUD';
import TitleHUD       from './hud/TitleHUD';
import HintBar        from './hud/HintBar';
import BackButton     from './hud/BackButton';

const IslandScene = lazy(() => import('./IslandScene'));

const IslandView = ({ onToggle2D }) => {
  const { isDark } = useTheme();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 80px)',
        overflow: 'visible',
        background: isDark ? '#07060f' : '#d4883a',
      }}
    >
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)',
        pointerEvents: 'none', zIndex: 5,
      }} />

      {/* 3D Canvas */}
      <Suspense fallback={null}>
        <IslandScene isDark={isDark} />
        <LoadingOverlay isDark={isDark} />
      </Suspense>

      {/* HUD overlays */}
      <TitleHUD    isDark={isDark} />
      <StatsHUD    isDark={isDark} />
      <HintBar     isDark={isDark} />
      <BackButton  isDark={isDark} onToggle2D={onToggle2D} />
    </div>
  );
};

export default IslandView;
