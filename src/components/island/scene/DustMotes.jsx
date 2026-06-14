import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

const COUNT = 40;

/**
 * Rising dust-mote particle system — ambient atmosphere for the floating island.
 * Particles drift upward and sway gently on the horizontal axes.
 */
const DustMotes = ({ isDark }) => {
  const ref = useRef();

  const { positions, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds    = new Float32Array(COUNT);
    const offsets   = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22 - 4;
      positions[i * 3 + 1] = Math.random() * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18 + 2;
      speeds[i]  = 0.3 + Math.random() * 0.5;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    return { positions, speeds, offsets };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes.position;
    const t = clock.getElapsedTime();
    for (let i = 0; i < COUNT; i++) {
      // Loop upward, wrap at 8 units
      attr.array[i * 3 + 1] = (attr.array[i * 3 + 1] + speeds[i] * 0.004) % 8;
      // Gentle horizontal sway
      attr.array[i * 3]    += Math.sin(t * speeds[i] * 0.5 + offsets[i]) * 0.002;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color={isDark ? '#a855f7' : '#FF8C00'}
        transparent
        opacity={isDark ? 0.45 : 0.3}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

export default DustMotes;
