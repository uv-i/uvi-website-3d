import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

/**
 * Interactive landmark — invisible collision box + HTML placard.
 *
 * Hover shared between 3D hit mesh and HTML card.
 * On hover: desc line + tag chips slide in above the "▶ ENTER" bar.
 */
const Landmark = ({ lm, isDark }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const glowRef  = useRef();

  const onEnter = useCallback(() => setHovered(true),  []);
  const onLeave = useCallback(() => setHovered(false), []);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : '';
    return () => { document.body.style.cursor = ''; };
  }, [hovered]);

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    const t = clock.getElapsedTime();
    const target = hovered ? 0.18 + Math.sin(t * 3.5) * 0.10 : 0;
    glowRef.current.material.opacity += (target - glowRef.current.material.opacity) * 0.12;
    const s = hovered ? 1 + Math.sin(t * 2) * 0.06 : 0.8;
    glowRef.current.scale.setScalar(s);
  });

  return (
    <group>
      {/* Ground-glow disc */}
      <mesh ref={glowRef} position={[lm.hitPos[0], 0.05, lm.hitPos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.8, 32]} />
        <meshBasicMaterial color={lm.color} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
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
          {/* Icon */}
          <div style={{ fontSize: '20px', lineHeight: 1, marginBottom: '5px' }}>{lm.icon}</div>

          {/* Label */}
          <div style={{
            color: hovered ? lm.color : (isDark ? '#f0f0ff' : '#1a1a2e'),
            fontWeight: 700, fontSize: '12px', letterSpacing: '0.09em',
            textTransform: 'uppercase', transition: 'color 0.2s ease',
          }}>
            {lm.label}
          </div>

          {/* Sub */}
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
            {/* Divider */}
            <div style={{
              margin: '7px 0 6px',
              height: '1px',
              background: `linear-gradient(to right, transparent, ${lm.color}55, transparent)`,
            }} />

            {/* Desc line */}
            {lm.desc && (
              <div style={{
                color: isDark ? 'rgba(220,210,255,0.6)' : 'rgba(0,0,0,0.5)',
                fontSize: '9px', letterSpacing: '0.04em',
                marginBottom: '6px', lineHeight: 1.4,
              }}>
                {lm.desc}
              </div>
            )}

            {/* Tag chips */}
            {lm.tags && (
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {lm.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: '8px',
                    fontFamily: 'monospace',
                    letterSpacing: '0.06em',
                    padding: '2px 6px',
                    borderRadius: '999px',
                    border: `1px solid ${lm.color}66`,
                    color: lm.color,
                    background: `${lm.color}14`,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ▶ ENTER */}
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

          {/* Post line */}
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
