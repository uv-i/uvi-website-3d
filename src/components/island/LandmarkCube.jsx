import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

/**
 * A hoverable, clickable 3D landmark cube.
 * position: [x, y, z]
 * color: hex string for the emissive/material base
 * label: display name
 * route: react-router path to navigate to on click
 * floatOffset: stagger the idle float animation
 */
const LandmarkCube = ({ position, color, label, route, floatOffset = 0, isDark }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  // Idle float animation
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() + floatOffset;
    meshRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.08;
    meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
  });

  const handleClick = (e) => {
    e.stopPropagation();
    navigate(route);
  };

  return (
    <group position={position}>
      {/* Glow ring on hover */}
      {hovered && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
          <ringGeometry args={[0.55, 0.75, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.35} />
        </mesh>
      )}

      {/* Main cube */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        castShadow
        scale={hovered ? 1.12 : 1}
      >
        <boxGeometry args={[0.55, 0.7, 0.55]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : color}
          emissive={color}
          emissiveIntensity={hovered ? 0.9 : 0.35}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Small flag pole */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
        <meshStandardMaterial color={isDark ? '#555' : '#aaa'} roughness={0.6} />
      </mesh>
      {/* Flag */}
      <mesh position={[0.18, 1.1, 0]}>
        <boxGeometry args={[0.32, 0.18, 0.02]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>

      {/* HTML label — always faces camera */}
      <Html
        position={[0, 1.55, 0]}
        center
        distanceFactor={6}
        occlude={false}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div style={{
          background: hovered
            ? 'rgba(0,0,0,0.85)'
            : 'rgba(0,0,0,0.55)',
          color: hovered ? '#fff' : '#ddd',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '11px',
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          border: `1px solid ${hovered ? color : 'rgba(255,255,255,0.15)'}`,
          transition: 'all 0.15s ease',
          textShadow: hovered ? `0 0 8px ${color}` : 'none',
        }}>
          {label}
        </div>
      </Html>
    </group>
  );
};

export default LandmarkCube;
