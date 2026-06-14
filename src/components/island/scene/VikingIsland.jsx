import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { LANDMARKS } from './landmarks';
import Landmark from './Landmark';

// ─── Particle fire layer ───────────────────────────────────────────────────────
const FireLayer = ({ position, count, color, size, maxHeight, riseSpeed }) => {
  const ref = useRef();

  const data = useMemo(() => {
    const pos  = new Float32Array(count * 3);
    const meta = new Float32Array(count * 4); // [life, speed, xDrift, zDrift]
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r   = Math.random() * 0.25;
      pos[i * 3]     = position[0] + Math.cos(ang) * r;
      pos[i * 3 + 1] = position[1] + Math.random() * maxHeight;
      pos[i * 3 + 2] = position[2] + Math.sin(ang) * r;
      meta[i * 4]     = Math.random();
      meta[i * 4 + 1] = riseSpeed * (0.7 + Math.random() * 0.6);
      meta[i * 4 + 2] = (Math.random() - 0.5) * 0.012;
      meta[i * 4 + 3] = (Math.random() - 0.5) * 0.012;
    }
    return { pos, meta };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame(() => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes.position;
    const { pos, meta } = data;
    for (let i = 0; i < count; i++) {
      meta[i * 4] += 0.013 * meta[i * 4 + 1];
      if (meta[i * 4] >= 1) {
        const ang = Math.random() * Math.PI * 2;
        const r   = Math.random() * 0.25;
        meta[i * 4]         = 0;
        attr.array[i * 3]     = position[0] + Math.cos(ang) * r;
        attr.array[i * 3 + 1] = position[1];
        attr.array[i * 3 + 2] = position[2] + Math.sin(ang) * r;
        meta[i * 4 + 2] = (Math.random() - 0.5) * 0.012;
        meta[i * 4 + 3] = (Math.random() - 0.5) * 0.012;
      } else {
        const life = meta[i * 4];
        attr.array[i * 3]     += meta[i * 4 + 2];
        attr.array[i * 3 + 2] += meta[i * 4 + 3];
        attr.array[i * 3 + 1]  = position[1] + life * maxHeight;
        // Converge toward centre as it rises (flame tip)
        attr.array[i * 3]     = attr.array[i * 3]     * (1 - life * 0.04) + position[0] * life * 0.04;
        attr.array[i * 3 + 2] = attr.array[i * 3 + 2] * (1 - life * 0.04) + position[2] * life * 0.04;
      }
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.pos} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.9}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ─── Flickering forge light ───────────────────────────────────────────────────
const ForgeLight = ({ position }) => {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // Irregular flicker: sum of fast + slow sines
    ref.current.intensity =
      1.4 + Math.sin(t * 7.3) * 0.5 + Math.sin(t * 11.7) * 0.25 + Math.sin(t * 3.1) * 0.15;
  });

  return (
    <pointLight
      ref={ref}
      position={position}
      color="#FF5500"
      distance={14}
      intensity={1.4}
      castShadow={false}
    />
  );
};

// ─── Full fire effect (3 particle bands + flickering light) ──────────────────
const FORGE_POS = [-6.4, 0.7, -4.8];

const FireEffect = () => (
  <group>
    <FireLayer position={FORGE_POS} count={20} color="#FF2200" size={0.10} maxHeight={1.4} riseSpeed={1.2} />
    <FireLayer position={FORGE_POS} count={16} color="#FF6600" size={0.14} maxHeight={2.0} riseSpeed={0.9} />
    <FireLayer position={FORGE_POS} count={10} color="#FFCC00" size={0.09} maxHeight={2.8} riseSpeed={0.65} />
    <ForgeLight position={[FORGE_POS[0], FORGE_POS[1] + 0.5, FORGE_POS[2]]} />
  </group>
);

// ─── Fireflies ────────────────────────────────────────────────────────────────
const FIREFLY_ZONES = [
  { cx: -6.5, cy: 1.5, cz: -4.5, r: 6, n: 18 }, // house / forge
  { cx: 16,   cy: 1.0, cz: -6,   r: 5, n: 10 }, // lake
];
const FIREFLY_COUNT = FIREFLY_ZONES.reduce((s, z) => s + z.n, 0);

const Fireflies = () => {
  const ref    = useRef();
  const matRef = useRef();

  const { pos, phase, speed } = useMemo(() => {
    const pos   = new Float32Array(FIREFLY_COUNT * 3);
    const phase = new Float32Array(FIREFLY_COUNT);
    const speed = new Float32Array(FIREFLY_COUNT);
    let idx = 0;
    for (const z of FIREFLY_ZONES) {
      for (let i = 0; i < z.n; i++) {
        const ang = Math.random() * Math.PI * 2;
        const r   = z.r * Math.sqrt(Math.random());
        pos[idx * 3]     = z.cx + Math.cos(ang) * r;
        pos[idx * 3 + 1] = z.cy + (Math.random() - 0.5) * 2.5;
        pos[idx * 3 + 2] = z.cz + Math.sin(ang) * r;
        phase[idx] = Math.random() * Math.PI * 2;
        speed[idx] = 0.25 + Math.random() * 0.4;
        idx++;
      }
    }
    return { pos, phase, speed };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t    = clock.getElapsedTime();
    const attr = ref.current.geometry.attributes.position;
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const p = phase[i];
      const s = speed[i];
      attr.array[i * 3]     = pos[i * 3]     + Math.cos(t * s + p)        * 0.55;
      attr.array[i * 3 + 1] = pos[i * 3 + 1] + Math.sin(t * s * 1.4 + p) * 0.45;
      attr.array[i * 3 + 2] = pos[i * 3 + 2] + Math.sin(t * s + p + 1.2) * 0.55;
    }
    attr.needsUpdate = true;
    // Two out-of-phase sines so fireflies don't all sync: opacity 0.45 → 1.0
    if (matRef.current) {
      matRef.current.opacity = 0.55 + Math.sin(t * 3.2) * 0.28 + Math.sin(t * 7.1) * 0.12;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={pos} count={FIREFLY_COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.22}
        color="#BBFF44"
        transparent
        opacity={0.75}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ─── Viking island GLB + floating bob ────────────────────────────────────────
const VikingIsland = ({ isDark }) => {
  const groupRef = useRef();
  const { scene } = useGLTF('/models/viking_island.glb');

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.42) * 0.22;
    groupRef.current.rotation.z = Math.sin(t * 0.28) * 0.006;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      {LANDMARKS.map((lm) => (
        <Landmark key={lm.id} lm={lm} isDark={isDark} />
      ))}
      {isDark && <FireEffect />}
      {isDark && <Fireflies />}
    </group>
  );
};

export default VikingIsland;
