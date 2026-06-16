import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import OrbitLight      from './OrbitLight';
import DustMotes       from './DustMotes';
import CelestialBodies from './CelestialBodies';
import VikingIsland    from './VikingIsland';
import LeoOrb          from './LeoOrb';

// ─── Ping-pong auto-rotate ────────────────────────────────────────────────────
// Drives OrbitControls left↔right instead of drifting to one azimuth limit.
// Positive autoRotateSpeed moves toward minAzimuth (left); negative toward maxAzimuth (right).
const MIN_AZ       = -Math.PI * 0.50;
const MAX_AZ       =  Math.PI * 0.60;
const ROTATE_SPEED = 0.3;
const FLIP_MARGIN  = 0.06; // radians before hard limit where we flip

const PingPongRotate = ({ controlsRef }) => {
  const dirRef = useRef(-1); // start heading right (toward maxAzimuth)
  useFrame(() => {
    const ctrl = controlsRef.current;
    if (!ctrl) return;
    const az = ctrl.getAzimuthalAngle();
    if (az >= MAX_AZ - FLIP_MARGIN) dirRef.current =  1; // hit right → go left
    if (az <= MIN_AZ + FLIP_MARGIN) dirRef.current = -1; // hit left  → go right
    ctrl.autoRotateSpeed = ROTATE_SPEED * dirRef.current;
  });
  return null;
};

// ─── Scene: lights, fog, sub-components, camera controls ─────────────────────
const SceneContent = ({ isDark }) => {
  const orbitRef = useRef();

  return (
    <>
      {/* Fog: warm amber-gold in day, deep indigo at night */}
      <fog attach="fog" args={[isDark ? '#070612' : '#c8883a', 28, 68]} />

      {/* Ambient — slightly warmer on day to reinforce golden hour */}
      <ambientLight intensity={isDark ? 0.28 : 0.50} color={isDark ? '#ffffff' : '#ffe8c0'} />

      {/* Main key light — overhead, shadow-casting */}
      <directionalLight
        position={[14, 22, 8]}
        intensity={isDark ? 1.1 : 1.6}
        color={isDark ? '#d4b8ff' : '#ffb858'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={90}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      {/* Secondary fill / rim */}
      <directionalLight
        position={[-12, 6, -12]}
        intensity={isDark ? 0.35 : 0.20}
        color={isDark ? '#5577ff' : '#aac8ff'}
      />

      {/* Golden-hour backlight: warm sunset glow from behind the mountains (day only) */}
      {!isDark && (
        <directionalLight
          position={[-3, 10, -20]}
          intensity={0.85}
          color="#ff8822"
          castShadow={false}
        />
      )}

      <pointLight position={[-5, 8, 0]} intensity={isDark ? 1.2 : 0.35} color="#8855FF" distance={30} />
      <pointLight position={[6,  3, 6]} intensity={isDark ? 0.7 : 0.25} color="#FF8C00" distance={22} />

      <OrbitLight      isDark={isDark} />
      <DustMotes       isDark={isDark} />
      <CelestialBodies isDark={isDark} />

      {isDark && (
        <Stars radius={70} depth={50} count={900} factor={4} saturation={0.4} fade speed={0.25} />
      )}

      <Suspense fallback={null}>
        <VikingIsland isDark={isDark} />
      </Suspense>

      <LeoOrb isDark={isDark} />

      <OrbitControls
        enablePan={false}
        // Polar: 22.5° top-down → 68° near-horizon
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        // Radial: comfortable close-up → widest pull-back
        minDistance={22}
        maxDistance={30}
        // Azimuth: mountains fill Z = −6 → −26; stop before camera clips into them
        minAzimuthAngle={-Math.PI * 0.30}
        maxAzimuthAngle={ Math.PI * 0.50}
        autoRotate
        autoRotateSpeed={0.3}
        target={[-3, 2, 2]}
        enableDamping
        dampingFactor={0.04}
        ref={orbitRef}
      />
      <PingPongRotate controlsRef={orbitRef} />
    </>
  );
};

export default SceneContent;
