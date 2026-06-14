import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Leo lives just above and beside the forge
const ORB_POS = [-8, 0.75, 12];
const ORB_COLOR = '#FFBB33';

/**
 * LeoOrb — a glowing animated sphere near the forge.
 * Clicking dispatches the 'leo:open' DOM event which ChatBot.jsx listens for.
 */
const LeoOrb = ({ isDark }) => {
  const orbRef   = useRef();
  const glowRef  = useRef();
  const [hovered, setHovered] = useState(false);

  const onEnter = useCallback(() => setHovered(true),  []);
  const onLeave = useCallback(() => setHovered(false), []);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : '';
    return () => { document.body.style.cursor = ''; };
  }, [hovered]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Bob up and down
    if (orbRef.current) {
      orbRef.current.position.y = ORB_POS[1] + Math.sin(t * 1.4) * 0.22;
      // Gentle spin
      orbRef.current.rotation.y = t * 0.6;
    }

    // Pulse glow halo
    if (glowRef.current) {
      const pulse = 0.55 + Math.sin(t * 2.8) * 0.20;
      const targetOpacity = hovered ? pulse + 0.15 : pulse * 0.6;
      glowRef.current.material.opacity += (targetOpacity - glowRef.current.material.opacity) * 0.08;
      const targetScale = hovered ? 1.3 : 1.0;
      glowRef.current.scale.x += (targetScale - glowRef.current.scale.x) * 0.08;
      glowRef.current.scale.y += (targetScale - glowRef.current.scale.y) * 0.08;
      glowRef.current.scale.z += (targetScale - glowRef.current.scale.z) * 0.08;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('leo:open'));
  };

  return (
    <group position={ORB_POS}>
      {/* Glow halo — flat circle, always faces camera via billboard effect */}
      <mesh ref={glowRef} renderOrder={1}>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial
          color={ORB_COLOR}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* The orb sphere */}
      <mesh
        ref={orbRef}
        onPointerOver={(e) => { e.stopPropagation(); onEnter(); }}
        onPointerOut={onLeave}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial
          color={ORB_COLOR}
          emissive={ORB_COLOR}
          emissiveIntensity={hovered ? 2.5 : 1.4}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* Point light so the orb illuminates surroundings */}
      <pointLight color={ORB_COLOR} intensity={hovered ? 1.8 : 0.9} distance={6} decay={2} />

      {/* HTML tooltip */}
      <Html
        position={[0, 0.65, 0]}
        center
        zIndexRange={[10, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div style={{
          opacity: hovered ? 1 : 0,
          transform: `translateY(${hovered ? '0px' : '6px'})`,
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          background: isDark ? 'rgba(8,8,15,0.90)' : 'rgba(255,246,238,0.94)',
          border: `1.5px solid ${ORB_COLOR}99`,
          borderRadius: '10px',
          padding: '6px 12px',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          whiteSpace: 'nowrap',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          boxShadow: `0 0 14px ${ORB_COLOR}44`,
        }}>
          <div style={{
            fontSize: '11px', fontWeight: 700,
            color: isDark ? '#fff' : '#1a1a2e',
            display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            <span>🦁</span> Talk to Leo
          </div>
          <div style={{
            fontSize: '8px', fontFamily: 'monospace', letterSpacing: '0.08em',
            color: ORB_COLOR, marginTop: '2px', textAlign: 'center',
          }}>
            CLICK TO CHAT
          </div>
        </div>
      </Html>
    </group>
  );
};

export default LeoOrb;
