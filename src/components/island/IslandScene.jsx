/**
 * IslandScene.jsx — Canvas wrapper for the Viking Floating Island.
 *
 * Scene logic lives in scene/SceneContent.jsx and its sub-components.
 * This file owns the Canvas / WebGL config + post-processing effects.
 *
 * Post-processing: Bloom (emissive glow on fire, orb, lights) + Vignette.
 *
 * Chrome compatibility notes:
 *  - frameloop="always" instead of "demand": Chrome's ANGLE/D3D11 backend
 *    sometimes drops the first requestAnimationFrame when the canvas container
 *    has opacity:0 (Framer Motion entrance). "always" bypasses that timing
 *    dependency entirely.
 *  - alpha removed from gl props: transparent WebGL canvas inside a
 *    CSS-transformed container triggers a Chrome compositor bug on certain
 *    GPU/driver combos. Using a solid canvas background avoids it.
 */

import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import SceneContent from './scene/SceneContent';

// Preload all 5 layers so they start fetching as soon as 3D mode activates
useGLTF.preload('/models/island_terrain.glb');
useGLTF.preload('/models/island_vegetation.glb');
useGLTF.preload('/models/island_buildings.glb');
useGLTF.preload('/models/island_activity.glb');
useGLTF.preload('/models/island_props.glb');

const PostFX = ({ isDark }) => (
  <EffectComposer multisampling={0}>
    <SMAA />
    <Bloom
      luminanceThreshold={0.90}
      luminanceSmoothing={0.85}
      intensity={isDark ? 0.40 : 0.20}
      blendFunction={BlendFunction.SCREEN}
      mipmapBlur
    />
    <Vignette
      offset={0.32}
      darkness={isDark ? 0.50 : 0.38}
      blendFunction={BlendFunction.NORMAL}
    />
  </EffectComposer>
);

const IslandScene = ({ isDark }) => (
  <Canvas
    shadows
    frameloop="always"
    camera={{ position: [12, 14, 22], fov: 47 }}
    style={{
      background: isDark ? '#07060f' : '#d4883a',
      width: '100%',
      height: '100%',
    }}
    gl={{
      antialias: true,
      alpha: true,
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: isDark ? 0.9 : 1.15,
    }}
    dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
  >
    <SceneContent isDark={isDark} />
    <PostFX isDark={isDark} />
  </Canvas>
);

export default IslandScene;
