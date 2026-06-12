import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import LandmarkCube from './LandmarkCube';

const FloatingParticle = ({ angle, index, isDark }) => {
  const ref = useRef();
  const initialY = -2.7 - index * 0.18;
  const speed = 0.6 + index * 0.12;
  const range = 0.28;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.position.y = initialY + Math.sin(t) * range;
    ref.current.rotation.x = t * 0.25;
    ref.current.rotation.y = t * 0.35;
  });

  return (
    <mesh ref={ref} position={[Math.cos(angle) * 1.6, initialY, Math.sin(angle) * 1.6]}>
      <boxGeometry args={[0.16, 0.16, 0.16]} />
      <meshStandardMaterial
        color={isDark ? '#a855f7' : '#5588cc'}
        emissive={isDark ? '#8855FF' : '#4477bb'}
        emissiveIntensity={isDark ? 0.8 : 0.3}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

const IslandBase = ({ isDark }) => (
  <group>
    <mesh position={[0, 0, 0]} receiveShadow castShadow>
      <boxGeometry args={[6, 0.55, 6]} />
      <meshStandardMaterial color={isDark ? '#1a1030' : '#c8b89a'} roughness={0.85} metalness={0.05} />
    </mesh>
    <mesh position={[0, -0.55, 0]} castShadow>
      <boxGeometry args={[5.4, 0.6, 5.4]} />
      <meshStandardMaterial color={isDark ? '#120c24' : '#a0845c'} roughness={0.9} />
    </mesh>
    <mesh position={[0, -1.2, 0]} castShadow>
      <boxGeometry args={[4.2, 0.7, 4.2]} />
      <meshStandardMaterial color={isDark ? '#0e0920' : '#8a6a42'} roughness={0.9} />
    </mesh>
    <mesh position={[0, -1.95, 0]}>
      <boxGeometry args={[2.8, 0.6, 2.8]} />
      <meshStandardMaterial color={isDark ? '#0a0618' : '#6e5230'} roughness={0.9} />
    </mesh>

    {/* Grass layer */}
    <mesh position={[0, 0.285, 0]} receiveShadow>
      <boxGeometry args={[6.05, 0.06, 6.05]} />
      <meshStandardMaterial
        color={isDark ? '#2a1a50' : '#7bc47f'}
        roughness={0.7}
        emissive={isDark ? '#3a1a80' : '#5a9c5e'}
        emissiveIntensity={isDark ? 0.12 : 0.05}
      />
    </mesh>

    {/* Decorative rocks */}
    {[[-2.2, 0.38, -2], [2.3, 0.4, 1.8], [-1.8, 0.35, 2.2]].map(([x, y, z], i) => (
      <mesh key={i} position={[x, y, z]} castShadow>
        <boxGeometry args={[0.3 + i * 0.05, 0.25 + i * 0.04, 0.3 + i * 0.05]} />
        <meshStandardMaterial color={isDark ? '#2a1550' : '#9a8060'} roughness={0.95} />
      </mesh>
    ))}

    {/* Stubby trees */}
    {[[-2, 0.4, 0.5], [2.1, 0.4, -0.5]].map(([x, y, z], i) => (
      <group key={i} position={[x, y, z]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.1, 0.5, 6]} />
          <meshStandardMaterial color={isDark ? '#3a2010' : '#5a3a18'} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[0.45, 0.38, 0.45]} />
          <meshStandardMaterial
            color={isDark ? '#1a3a25' : '#3a8a40'}
            roughness={0.8}
            emissive={isDark ? '#0a2a15' : '#2a6a30'}
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>
    ))}

    {/* Floating particles under island */}
    {Array.from({ length: 6 }).map((_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      return <FloatingParticle key={i} angle={angle} index={i} isDark={isDark} />;
    })}
  </group>
);

const Cloud = ({ position, scale = 1 }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.x = position[0] + Math.sin(clock.getElapsedTime() * 0.1 + position[2]) * 1.5;
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.2 + position[0]) * 0.15;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <boxGeometry args={[1.2, 0.35, 0.6]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.55} roughness={1} />
      </mesh>
      <mesh position={[0.3, 0.2, 0]}>
        <boxGeometry args={[0.7, 0.3, 0.5]} />
        <meshStandardMaterial color="#f0f0f0" transparent opacity={0.45} roughness={1} />
      </mesh>
      <mesh position={[-0.35, 0.15, 0.1]}>
        <boxGeometry args={[0.5, 0.25, 0.4]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.5} roughness={1} />
      </mesh>
    </group>
  );
};

// 3 landmarks in a triangle arrangement
const LANDMARKS = [
  { label: 'Our Games', route: '/games',   color: '#FF6600', position: [-2,  0.85,  1.8], floatOffset: 0   },
  { label: 'Dev Lab',   route: '/lab',     color: '#00BBFF', position: [ 2,  0.85,  1.8], floatOffset: 1.5 },
  { label: 'Contact',   route: '/contact', color: '#FF4488', position: [ 0,  0.85, -2  ], floatOffset: 3.0 },
];

const BeaconLight = ({ isDark }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.85;
    // Orbit light around the island's center core
    ref.current.position.x = Math.cos(t) * 3.5;
    ref.current.position.z = Math.sin(t) * 3.5;
  });

  return (
    <pointLight
      ref={ref}
      position={[0, 1.8, 0]}
      intensity={isDark ? 2.8 : 1.4}
      distance={8}
      color={isDark ? '#ff7c08' : '#8855ff'}
      castShadow
    />
  );
};

const SceneContents = ({ isDark }) => (
  <>
    <ambientLight intensity={isDark ? 0.4 : 0.7} />
    <directionalLight
      position={[5, 8, 5]}
      intensity={isDark ? 0.9 : 1.4}
      castShadow
      shadow-mapSize={[1024, 1024]}
      color={isDark ? '#aa88ff' : '#fff8ee'}
    />
    <pointLight position={[-4, 3, -4]} intensity={isDark ? 0.6 : 0.3} color={isDark ? '#5500ee' : '#ffaa44'} />
    <pointLight position={[4, 2, 4]} intensity={0.4} color={isDark ? '#ff6600' : '#aaddff'} />
    <BeaconLight isDark={isDark} />

    <fog attach="fog" args={[isDark ? '#08080f' : '#fff6ee', 12, 30]} />

    {isDark && <Stars radius={30} depth={20} count={600} factor={3} saturation={0} fade speed={0.5} />}

    <IslandBase isDark={isDark} />

    <Cloud position={[-5, 1.5, -2]} scale={0.9} />
    <Cloud position={[5.5, 2, 1]} scale={1.1} />
    <Cloud position={[0, 2.5, -6]} scale={0.7} />

    {LANDMARKS.map((lm) => (
      <LandmarkCube key={lm.route} {...lm} isDark={isDark} />
    ))}

    <OrbitControls
      enablePan={false}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.1}
      minDistance={5}
      maxDistance={14}
      autoRotate
      autoRotateSpeed={0.4}
      target={[0, 0.3, 0]}
    />
  </>
);

const IslandScene = ({ isDark }) => (
  <Canvas
    shadows
    camera={{ position: [0, 5, 10], fov: 50 }}
    style={{ background: 'transparent' }}
    gl={{ antialias: true, alpha: true }}
    dpr={[1, 1.5]}
  >
    <SceneContents isDark={isDark} />
  </Canvas>
);

export default IslandScene;
