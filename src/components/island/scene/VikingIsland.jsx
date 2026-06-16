import { useRef, useMemo, Suspense, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { LANDMARKS } from './landmarks';
import Landmark from './Landmark';

// ────────────────────────────────────────────────────────────────────────────
// WIND SHADER
// Applied to every mesh in the vegetation layer via onBeforeCompile.
// Injects a sin-wave vertex displacement that's height-dependent
// (tips sway more than the base — roots are anchored).
// ────────────────────────────────────────────────────────────────────────────
const WIND_UNIFORMS = { uWindTime: { value: 0 } };

function applyWindToMaterial(material) {
  if (!material) return;
  if (material.userData.windPatched) return;
  material.userData.windPatched = true;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uWindTime = WIND_UNIFORMS.uWindTime;

    // MUST declare the custom uniform at the top of the vertex shader —
    // Three.js does NOT auto-generate declarations for onBeforeCompile uniforms.
    shader.vertexShader = 'uniform float uWindTime;\n' + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      /* glsl */ `
      #include <begin_vertex>

      float worldY = (modelMatrix * vec4(position, 1.0)).y;
      float heightFactor = smoothstep(0.0, 2.5, worldY);

      float wave1 = sin(uWindTime * 1.15 + position.x * 0.9 + position.z * 0.6) * 0.048;
      float wave2 = sin(uWindTime * 0.80 + position.z * 1.1 + position.x * 0.4) * 0.028;

      transformed.x += (wave1 + wave2) * heightFactor;
      transformed.z += wave2 * 0.4    * heightFactor;
      `
    );
    material.userData.windShader = shader;
  };

  material.needsUpdate = true;
}

// ────────────────────────────────────────────────────────────────────────────
// WATER SHADER
// UV-scrolling ripples + Fresnel edge highlights + specular sparkle.
// Pure pass-through vertex shader — all animation in the fragment shader
// so it's resolution-independent regardless of lake mesh polygon count.
// ────────────────────────────────────────────────────────────────────────────
const waterVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vUv     = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir   = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const waterFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3  uShallowColor;
  uniform vec3  uDeepColor;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec2 uv1 = vUv * 3.5 + vec2( uTime * 0.06,  uTime * 0.03);
    vec2 uv2 = vUv * 2.8 + vec2(-uTime * 0.04,  uTime * 0.07);
    vec2 uv3 = vUv * 5.0 + vec2( uTime * 0.02, -uTime * 0.05);

    float r1 = sin(uv1.x * 6.28) * sin(uv1.y * 6.28) * 0.5 + 0.5;
    float r2 = sin(uv2.x * 6.28 + 1.2) * sin(uv2.y * 6.28 + 0.8) * 0.5 + 0.5;
    float r3 = sin(uv3.x * 6.28 + 2.4) * 0.5 + 0.5;

    float ripple = (r1 * 0.5 + r2 * 0.35 + r3 * 0.15);

    float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 2.5);

    vec3 waterColor = mix(uDeepColor, uShallowColor, ripple * 0.55 + fresnel * 0.3);

    vec3  sunDir  = normalize(vec3(0.6, 1.0, 0.4));
    float spec    = pow(max(0.0, dot(reflect(-sunDir, vNormal), vViewDir)), 48.0);
    vec3  specCol = vec3(1.0, 0.97, 0.9) * spec * 0.55;

    vec3  col   = waterColor + specCol;
    float alpha = clamp(uOpacity + fresnel * 0.20, 0.0, 1.0);

    gl_FragColor = vec4(col, alpha);
  }
`;

function buildWaterMaterial(isDark) {
  return new THREE.ShaderMaterial({
    vertexShader:   waterVert,
    fragmentShader: waterFrag,
    uniforms: {
      uTime:         { value: 0 },
      uShallowColor: { value: isDark ? new THREE.Color(0x1a3a5c) : new THREE.Color(0x44aadd) },
      uDeepColor:    { value: isDark ? new THREE.Color(0x050e1c) : new THREE.Color(0x1166aa) },
      uOpacity:      { value: 0.88 },
    },
    transparent: true,
    depthWrite:  false,
    side:        THREE.FrontSide,
  });
}

// ────────────────────────────────────────────────────────────────────────────
// TERRAIN LAYER — patches lake meshes with the water shader
// ────────────────────────────────────────────────────────────────────────────
const TerrainLayer = ({ isDark }) => {
  const { scene }    = useGLTF('/models/island_terrain.glb');
  const ref          = useRef();
  const elapsed      = useRef(0);
  const done         = useRef(false);
  const waterMatsRef = useRef([]);

  const waterMat = useMemo(() => buildWaterMaterial(isDark), [isDark]);

  useEffect(() => {
    waterMatsRef.current = [];
    scene.traverse((obj) => {
      if (!obj.isMesh) return;
      const name = (obj.name || '').toLowerCase();
      if (name.includes('lake') || name.includes('water') || name.includes('pond') ||
          name.includes('river') || name.includes('sea')  || name.includes('ocean')) {
        obj.material = waterMat;
        waterMatsRef.current.push(waterMat);
      }
    });
  }, [scene, waterMat]);

  useFrame((_, delta) => {
    if (!done.current && ref.current) {
      elapsed.current += delta;
      const t     = Math.min(elapsed.current / 1.4, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      ref.current.position.y = -8 * (1 - eased);
      if (t >= 1) done.current = true;
    }
    waterMat.uniforms.uTime.value += delta;
  });

  return <group ref={ref}><primitive object={scene} /></group>;
};

// ────────────────────────────────────────────────────────────────────────────
// VEGETATION LAYER — wind shader via onBeforeCompile
// ────────────────────────────────────────────────────────────────────────────
const VegetationLayer = () => {
  const { scene } = useGLTF('/models/island_vegetation.glb');
  const ref       = useRef();
  const elapsed   = useRef(0);
  const done      = useRef(false);

  useEffect(() => {
    scene.traverse((obj) => {
      if (!obj.isMesh) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((mat) => {
        if (!mat) return;
        delete mat.userData.windPatched; // re-patch on every mount (handles HMR)
        applyWindToMaterial(mat);
      });
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (!done.current && ref.current) {
      elapsed.current += delta;
      const t     = Math.min(elapsed.current / 1.4, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      ref.current.position.y = -8 * (1 - eased);
      if (t >= 1) done.current = true;
    }
    WIND_UNIFORMS.uWindTime.value += delta;
  });

  return <group ref={ref}><primitive object={scene} /></group>;
};

// ────────────────────────────────────────────────────────────────────────────
// Generic layer for buildings / activity / props
// ────────────────────────────────────────────────────────────────────────────
const IslandLayer = ({ path }) => {
  const { scene } = useGLTF(path);
  const ref       = useRef();
  const elapsed   = useRef(0);
  const done      = useRef(false);

  useFrame((_, delta) => {
    if (!ref.current || done.current) return;
    elapsed.current += delta;
    const t     = Math.min(elapsed.current / 1.4, 1);
    const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    ref.current.position.y = -8 * (1 - eased);
    if (t >= 1) done.current = true;
  });

  return <group ref={ref}><primitive object={scene} /></group>;
};

// ────────────────────────────────────────────────────────────────────────────
// FIRE PARTICLES
// ────────────────────────────────────────────────────────────────────────────
const FireLayer = ({ position, count, color, size, maxHeight, riseSpeed }) => {
  const ref = useRef();

  const data = useMemo(() => {
    const pos  = new Float32Array(count * 3);
    const meta = new Float32Array(count * 4);
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
        meta[i * 4]           = 0;
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
        size={size} color={color} transparent opacity={0.9}
        depthWrite={false} sizeAttenuation blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const ForgeLight = ({ position }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.intensity =
      1.4 + Math.sin(t * 7.3) * 0.5 + Math.sin(t * 11.7) * 0.25 + Math.sin(t * 3.1) * 0.15;
  });
  return (
    <pointLight ref={ref} position={position} color="#FF5500" distance={14} intensity={1.4} castShadow={false} />
  );
};

const FORGE_POS = [-6.4, 0.7, -4.8];

const FireEffect = () => (
  <group>
    <FireLayer position={FORGE_POS} count={20} color="#FF2200" size={0.10} maxHeight={1.4} riseSpeed={1.2} />
    <FireLayer position={FORGE_POS} count={16} color="#FF6600" size={0.14} maxHeight={2.0} riseSpeed={0.9} />
    <FireLayer position={FORGE_POS} count={10} color="#FFCC00" size={0.09} maxHeight={2.8} riseSpeed={0.65} />
    <ForgeLight position={[FORGE_POS[0], FORGE_POS[1] + 0.5, FORGE_POS[2]]} />
  </group>
);

// ────────────────────────────────────────────────────────────────────────────
// FIREFLIES
// ────────────────────────────────────────────────────────────────────────────
const FIREFLY_ZONES = [
  { cx: -6.5, cy: 1.5, cz: -4.5, r: 6, n: 18 },
  { cx: 16,   cy: 1.0, cz: -6,   r: 5, n: 10 },
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
        ref={matRef} size={0.22} color="#BBFF44" transparent opacity={0.75}
        depthWrite={false} sizeAttenuation blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// VIKING ISLAND ROOT
// ────────────────────────────────────────────────────────────────────────────
const VikingIsland = ({ isDark }) => {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.42) * 0.22;
    groupRef.current.rotation.z = Math.sin(t * 0.28) * 0.006;
  });

  return (
    <group ref={groupRef}>
      <Suspense fallback={null}>
        <TerrainLayer isDark={isDark} />
      </Suspense>
      <Suspense fallback={null}>
        <VegetationLayer />
      </Suspense>
      <Suspense fallback={null}>
        <IslandLayer path="/models/island_buildings.glb" />
      </Suspense>
      <Suspense fallback={null}>
        <IslandLayer path="/models/island_activity.glb" />
      </Suspense>
      <Suspense fallback={null}>
        <IslandLayer path="/models/island_props.glb" />
      </Suspense>

      {LANDMARKS.map((lm) => (
        <Landmark key={lm.id} lm={lm} isDark={isDark} />
      ))}
      {isDark && <FireEffect />}
      {isDark && <Fireflies />}
    </group>
  );
};

export default VikingIsland;
