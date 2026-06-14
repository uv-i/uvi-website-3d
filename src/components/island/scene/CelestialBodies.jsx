import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Sun and Moon — animated sky bodies behind the mountains (Z = −22).
 *
 * progress ref: 0 = full night, 1 = full day.
 * Both bodies are always mounted; Y position and layer opacity lerp when
 * isDark changes so the transition is smooth (~1.4 s at 60 fps).
 *
 * Sun: large bright sphere + two flat additive-blended glow halos.
 * Moon: smaller standard-lit sphere + one soft additive glow halo.
 */
const CelestialBodies = ({ isDark }) => {
  const progress = useRef(isDark ? 0 : 1);

  const sunRef  = useRef();
  const moonRef = useRef();

  // Per-layer material refs for opacity animation
  const sCoreRef  = useRef();
  const sInnerRef = useRef();
  const sHazeRef  = useRef();
  const mCoreRef  = useRef();
  const mGlowRef  = useRef();

  useFrame(() => {
    progress.current += ((isDark ? 0 : 1) - progress.current) * 0.022;
    const p  = progress.current;
    const mp = 1 - p; // moon's inverse progress

    // Sun: rises from Y 6 → 12 across the day transition
    if (sunRef.current)  sunRef.current.position.y  = 6  + p  * 6;
    const sA = Math.max(0, Math.min(1, (p  - 0.12) * 1.4));
    if (sCoreRef.current)  sCoreRef.current.opacity  = sA * 0.98;
    if (sInnerRef.current) sInnerRef.current.opacity = sA * 0.55;
    if (sHazeRef.current)  sHazeRef.current.opacity  = sA * 0.20;

    // Moon: rises from Y 4 → 10 (peaks just below sun to distinguish them)
    if (moonRef.current) moonRef.current.position.y = 4  + mp * 6;
    const mA = Math.max(0, Math.min(1, (mp - 0.12) * 1.4));
    if (mCoreRef.current) mCoreRef.current.opacity = mA * 0.95;
    if (mGlowRef.current) mGlowRef.current.opacity = mA * 0.28;
  });

  return (
    <>
      {/* ── Sun: left-of-centre, behind mountains at Z = −22 ── */}
      <group ref={sunRef} position={[-10, 6, -22]}>
        {/* Self-luminous sphere — uniform bright yellow, no lighting needed */}
        <mesh>
          <sphereGeometry args={[2.2, 32, 32]} />
          <meshBasicMaterial ref={sCoreRef} color="#FFF5B0" transparent opacity={0} depthWrite={false} />
        </mesh>
        {/* Warm orange inner corona — flat additive halo */}
        <mesh position={[0, 0, -0.05]}>
          <circleGeometry args={[4.4, 64]} />
          <meshBasicMaterial ref={sInnerRef} color="#FF8C00" transparent opacity={0}
            side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {/* Wide red-orange atmospheric haze */}
        <mesh position={[0, 0, -0.10]}>
          <circleGeometry args={[12, 64]} />
          <meshBasicMaterial ref={sHazeRef} color="#FF4400" transparent opacity={0}
            side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* ── Moon: right/lake side, behind mountains at Z = −22 ── */}
      <group ref={moonRef} position={[-15, 4, -22]}>
        {/* Standard-lit sphere — catches scene lighting for realistic depth */}
        <mesh>
          <sphereGeometry args={[1.4, 32, 32]} />
          <meshStandardMaterial ref={mCoreRef} color="#EEF6FF"
            roughness={0.9} metalness={0}
            emissive="#99AACC" emissiveIntensity={0.25}
            transparent opacity={0} depthWrite={false} />
        </mesh>
        {/* Soft blue-silver atmospheric glow */}
        <mesh position={[0, 0, -0.05]}>
          <circleGeometry args={[2.8, 64]} />
          <meshBasicMaterial ref={mGlowRef} color="#3355BB" transparent opacity={0}
            side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
};

export default CelestialBodies;
