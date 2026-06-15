import { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';

// Layer labels shown as each file loads in
const LAYERS = ['Terrain', 'Vegetation', 'Buildings', 'Activity', 'Props'];

/**
 * Small corner progress pill — canvas is fully visible while assets stream in.
 * Fades out 800ms after all 5 layers finish loading.
 */
const LoadingOverlay = ({ isDark }) => {
  const { progress, loaded } = useProgress();
  const [visible, setVisible]   = useState(true);
  const [opacity, setOpacity]   = useState(1);

  // Which layer label to show based on progress buckets
  const layerIndex  = Math.min(Math.floor((progress / 100) * LAYERS.length), LAYERS.length - 1);
  const currentLayer = LAYERS[layerIndex];

  useEffect(() => {
    if (progress < 100) return;
    // Fade out after a short pause once everything is loaded
    const fade = setTimeout(() => setOpacity(0), 400);
    const hide = setTimeout(() => setVisible(false), 1200);
    return () => { clearTimeout(fade); clearTimeout(hide); };
  }, [progress]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        right: 20,
        zIndex: 40,
        pointerEvents: 'none',
        opacity,
        transition: 'opacity 0.8s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 6,
      }}
    >
      {/* Layer label */}
      <div style={{
        fontFamily: 'monospace',
        fontSize: 9,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: isDark ? 'rgba(200,190,255,0.55)' : 'rgba(85,60,30,0.55)',
      }}>
        {progress < 100 ? `Building ${currentLayer}…` : 'World ready'}
      </div>

      {/* Progress bar */}
      <div style={{
        width: 120,
        height: 2,
        borderRadius: 1,
        background: isDark ? 'rgba(136,85,255,0.15)' : 'rgba(85,0,204,0.1)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(to right, #8855FF, #FF8C00)',
          borderRadius: 1,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Dot indicators — one per layer */}
      <div style={{ display: 'flex', gap: 4 }}>
        {LAYERS.map((_, i) => {
          const filled = (progress / 100) * LAYERS.length > i;
          return (
            <div key={i} style={{
              width: 4, height: 4, borderRadius: '50%',
              background: filled
                ? (isDark ? '#8855FF' : '#5500CC')
                : (isDark ? 'rgba(136,85,255,0.2)' : 'rgba(85,0,204,0.15)'),
              transition: 'background 0.3s ease',
            }} />
          );
        })}
      </div>
    </div>
  );
};

export default LoadingOverlay;
