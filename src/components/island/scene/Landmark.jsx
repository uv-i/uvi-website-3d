import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

// ── Sonar-pulse ShaderMaterial ────────────────────────────────────────────────
// Renders expanding concentric rings on the ground — like a radar/sonar ping.
// Two rings offset by 0.5 in phase give a continuous pulse rather than a flash.
const sonarVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sonarFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uAlpha;   // master opacity (0 = hidden, 1 = fully visible)
  varying vec2  vUv;

  void main() {
    vec2  uv   = vUv * 2.0 - 1.0;
    float dist = length(uv);

    // Discard outside the circle to keep the disc perfectly round
    if (dist > 1.0) discard;

    // Two rings travelling outward at different phases
    float speed   = 0.55;
    float ring1   = fract(dist - uTime * speed);
    float ring2   = fract(dist - uTime * speed + 0.5);

    // Thin bright edge at the ring front, fade behind
    float r1Alpha = smoothstep(0.88, 1.0, ring1) * (1.0 - dist * dist);
    float r2Alpha = smoothstep(0.88, 1.0, ring2) * (1.0 - dist * dist) * 0.55;

    // Soft filled centre glow
    float centre  = pow(max(0.0, 1.0 - dist * 1.4), 3.0) * 0.18;

    float alpha   = (r1Alpha + r2Alpha + centre) * uAlpha;
    gl_FragColor  = vec4(uColor, alpha);
  }
`;

// ── Component ─────────────────────────────────────────────────────────────────
const Landmark = ({ lm, isDark }) => {
  const [hovered, setHovered] = useState(false);
  const navigate  = useNavigate();
  const discRef   = useRef();
  const alphaRef  = useRef(0); // smooth lerp target for uAlpha

  const onEnter = useCallback(() => setHovered(true),  []);
  const onLeave = useCallback(() => setHovered(false), []);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : '';
    return () => { document.body.style.cursor = ''; };
  }, [hovered]);

  // Build the sonar material once per landmark
  const sonarMat = useMemo(() => {
    const color = new THREE.Color(lm.color);
    return new THREE.ShaderMaterial({
      vertexShader:   sonarVert,
      fragmentShader: sonarFrag,
      uniforms: {
        uTime:  { value: 0 },
        uColor: { value: color },
        uAlpha: { value: 0 },
      },
      transparent: true,
      depthWrite:  false,
      side:        THREE.DoubleSide,
    });
  }, [lm.color]);

  useFrame(({ clock }) => {
    sonarMat.uniforms.uTime.value = clock.getElapsedTime();

    // Smoothly show/hide the disc
    const targetAlpha = hovered ? 0.85 : 0;
    alphaRef.current += (targetAlpha - alphaRef.current) * 0.10;
    sonarMat.uniforms.uAlpha.value = alphaRef.current;

    // Scale the disc slightly on hover for a "landing pad expanding" feel
    if (discRef.current) {
      const targetScale = hovered ? 1.08 : 1.0;
      discRef.current.scale.x += (targetScale - discRef.current.scale.x) * 0.10;
      discRef.current.scale.y += (targetScale - discRef.current.scale.y) * 0.10;
    }
  });

  return (
    <group>
      {/* Ground sonar disc */}
      <mesh
        ref={discRef}
        position={[lm.hitPos[0], 0.06, lm.hitPos[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={1}
      >
        <planeGeometry args={[5.6, 5.6, 1, 1]} />
        <primitive object={sonarMat} attach="material" />
      </mesh>

      {/* Invisible 3D hit volume */}
      <mesh
        position={lm.hitPos}
        onPointerOver={(e) => { e.stopPropagation(); onEnter(); }}
        onPointerOut={onLeave}
        onClick={(e) => { e.stopPropagation(); navigate(lm.route); }}
      >
        <boxGeometry args={lm.hitSize} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* HTML placard */}
      <Html
        position={lm.placardPos}
        center
        zIndexRange={[10, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none', overflow: 'visible' }}
      >
        <div
          onClick={() => navigate(lm.route)}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          style={{
            background: isDark ? 'rgba(8,8,15,0.90)' : 'rgba(255,246,238,0.94)',
            border: `1.5px solid ${hovered ? lm.color : 'rgba(136,85,255,0.28)'}`,
            borderRadius: '14px',
            padding: '10px 16px 10px',
            cursor: 'pointer',
            pointerEvents: 'auto',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            textAlign: 'center',
            minWidth: '148px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease',
            transform: `scale(${hovered ? 1.08 : 1})`,
            boxShadow: hovered
              ? `0 0 22px ${lm.color}60, 0 6px 20px rgba(0,0,0,0.35)`
              : '0 4px 14px rgba(0,0,0,0.28)',
            position: 'relative',
          }}
        >
          <div style={{ fontSize: '20px', lineHeight: 1, marginBottom: '5px' }}>{lm.icon}</div>

          <div style={{
            color: hovered ? lm.color : (isDark ? '#f0f0ff' : '#1a1a2e'),
            fontWeight: 700, fontSize: '12px', letterSpacing: '0.09em',
            textTransform: 'uppercase', transition: 'color 0.2s ease',
          }}>
            {lm.label}
          </div>

          <div style={{
            color: isDark ? 'rgba(200,190,255,0.45)' : 'rgba(0,0,0,0.38)',
            fontSize: '10px', letterSpacing: '0.05em', marginTop: '3px',
          }}>
            {lm.sub}
          </div>

          {/* Desc + tags — slide in on hover */}
          <div style={{
            maxHeight: hovered ? '140px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.22s ease',
          }}>
            <div style={{
              margin: '7px 0 6px',
              height: '1px',
              background: `linear-gradient(to right, transparent, ${lm.color}55, transparent)`,
            }} />

            {lm.desc && (
              <div style={{
                color: isDark ? 'rgba(220,210,255,0.6)' : 'rgba(0,0,0,0.5)',
                fontSize: '9px', letterSpacing: '0.04em',
                marginBottom: '6px', lineHeight: 1.4,
              }}>
                {lm.desc}
              </div>
            )}

            {lm.tags && (
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {lm.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: '8px', fontFamily: 'monospace', letterSpacing: '0.06em',
                    padding: '2px 6px', borderRadius: '999px',
                    border: `1px solid ${lm.color}66`,
                    color: lm.color, background: `${lm.color}14`,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ▶ ENTER bar */}
          <div style={{
            marginTop: '6px',
            height: hovered ? '16px' : '0px',
            overflow: 'hidden',
            transition: 'height 0.18s ease',
          }}>
            <div style={{
              color: lm.color, fontSize: '8px', fontWeight: 700,
              letterSpacing: '0.12em', fontFamily: 'monospace',
            }}>
              ▶ ENTER
            </div>
          </div>

          {/* Connecting post */}
          <div style={{
            position: 'absolute', bottom: '-18px', left: '50%', transform: 'translateX(-50%)',
            width: '2px', height: '18px',
            background: `linear-gradient(to bottom, ${lm.color}99, transparent)`,
            borderRadius: '1px',
          }} />
        </div>
      </Html>
    </group>
  );
};

export default Landmark;
