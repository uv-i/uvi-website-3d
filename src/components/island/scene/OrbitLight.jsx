import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * A point light that orbits the island horizontally, giving the scene a
 * slowly-moving key light that avoids static shadow banding.
 */
const OrbitLight = ({ isDark }) => {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.6;
    ref.current.position.x = Math.cos(t) * 14 - 4;
    ref.current.position.z = Math.sin(t) * 14 + 2;
  });

  return (
    <pointLight
      ref={ref}
      position={[0, 4, 0]}
      intensity={isDark ? 1.6 : 0.7}
      distance={30}
      color={isDark ? '#FF8C00' : '#8855FF'}
    />
  );
};

export default OrbitLight;
