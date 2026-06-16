import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const ORB_POS   = [-8, 0.75, 12];
const ORB_COLOR = '#FFBB33';
const ORB_COLOR_VEC = new THREE.Color(ORB_COLOR);

// ── Fresnel ShaderMaterial ────────────────────────────────────────────────────
// Renders the glowing shell around the orb. The fresnel term makes edges glow
// bright and the center transparent — exactly like a glass energy ball.
const fresnelVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal  = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir   = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fresnelFrag = /* glsl */ `
  uniform vec3  uColor;
  uniform float uIntensity;
  varying vec3  vNormal;
  varying vec3  vViewDir;

  void main() {
    float fresnel  = pow(1.0 - abs(dot(vNormal, vViewDir)), 2.8);
    // Add a soft core glow so it isn't purely edge-lit
    float corGlow  = pow(abs(dot(vNormal, vViewDir)), 4.0) * 0.25;
    float alpha    = clamp((fresnel + corGlow) * uIntensity, 0.0, 1.0);
    gl_FragColor   = vec4(uColor, alpha);
  }
`;

// ── Component ─────────────────────────────────────────────────────────────────
const LeoOrb = ({ isDark }) => {
  const orbRef     = useRef();
  const shellRef   = useRef();
  const lightRef   = useRef();
  const [hovered, setHovered] = useState(false);

  const onEnter = useCallback(() => setHovered(true),  []);
  const onLeave = useCallback(() => setHovered(false), []);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : '';
    return () => { document.body.style.cursor = ''; };
  }, [hovered]);

  // Build the fresnel material once
  const fresnelMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   fresnelVert,
    fragmentShader: fresnelFrag,
    uniforms: {
      uColor:     { value: ORB_COLOR_VEC.clone() },
      uIntensity: { value: 1.0 },
    },
    transparent:  true,
    depthWrite:   false,
    side:         THREE.FrontSide,
    blending:     THREE.AdditiveBlending,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Bob + spin
    if (orbRef.current) {
      orbRef.current.position.y = ORB_POS[1] + Math.sin(t * 1.4) * 0.22;
      orbRef.current.rotation.y = t * 0.6;
    }

    // Fresnel shell — follows orb Y, pulses intensity
    if (shellRef.current) {
      shellRef.current.position.y = ORB_POS[1] + Math.sin(t * 1.4) * 0.22;
      const pulse = 0.7 + Math.sin(t * 2.8) * 0.18;
      const targetIntensity = hovered ? pulse * 1.6 : pulse;
      fresnelMat.uniforms.uIntensity.value +=
        (targetIntensity - fresnelMat.uniforms.uIntensity.value) * 0.08;

      const targetScale = hovered ? 1.35 : 1.0;
      shellRef.current.scale.x += (targetScale - shellRef.current.scale.x) * 0.08;
      shellRef.current.scale.y += (targetScale - shellRef.current.scale.y) * 0.08;
      shellRef.current.scale.z += (targetScale - shellRef.current.scale.z) * 0.08;
    }

    // Point light breathes with fresnel
    if (lightRef.current) {
      const targetIntensity = hovered
        ? 1.8 + Math.sin(t * 3.1) * 0.3
        : 0.9 + Math.sin(t * 2.4) * 0.15;
      lightRef.current.intensity += (targetIntensity - lightRef.current.intensity) * 0.07;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('leo:open'));
  };

  return (
    <group>
      {/* Fresnel shell — slightly larger than orb, shares Y animation */}
      <mesh
        ref={shellRef}
        position={[ORB_POS[0], ORB_POS[1], ORB_POS[2]]}
        renderOrder={2}
      >
        <sphereGeometry args={[0.50, 32, 32]} />
        <primitive object={fresnelMat} attach="material" />
      </mesh>

      {/* The core orb sphere */}
      <mesh
        ref={orbRef}
        position={[ORB_POS[0], ORB_POS[1], ORB_POS[2]]}
        onPointerOver={(e) => { e.stopPropagation(); onEnter(); }}
        onPointerOut={onLeave}
        onClick={handleClick}
        renderOrder={3}
      >
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial
          color={ORB_COLOR}
          emissive={ORB_COLOR}
          emissiveIntensity={hovered ? 3.0 : 1.6}
          roughness={0.05}
          metalness={0.15}
        />
      </mesh>

      {/* Point light illuminates surroundings */}
      <pointLight
        ref={lightRef}
        position={[ORB_POS[0], ORB_POS[1] + 0.3, ORB_POS[2]]}
        color={ORB_COLOR}
        intensity={0.9}
        distance={8}
        decay={2}
      />

      {/* HTML tooltip */}
      <Html
        position={[ORB_POS[0], ORB_POS[1] + 0.85, ORB_POS[2]]}
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
