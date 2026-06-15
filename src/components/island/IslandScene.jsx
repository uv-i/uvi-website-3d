/**
 * IslandScene.jsx — Canvas wrapper for the Viking Floating Island.
 *
 * Scene logic lives in scene/SceneContent.jsx and its sub-components.
 * This file owns only the Canvas / WebGL configuration.
 *
 * Coordinate mapping: Three.js (X, Y, Z) = Blender (X, Zblender, −Yblender)
 */

import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import SceneContent from './scene/SceneContent';

// Preload all 5 layers so they start fetching as soon as 3D mode activates
useGLTF.preload('/models/island_terrain.glb');
useGLTF.preload('/models/island_vegetation.glb');
useGLTF.preload('/models/island_buildings.glb');
useGLTF.preload('/models/island_activity.glb');
useGLTF.preload('/models/island_props.glb');

const IslandScene = ({ isDark }) => (
  <Canvas
    shadows
    frameloop="demand"
    camera={{ position: [12, 14, 22], fov: 47 }}
    style={{ background: 'transparent', width: '100%', height: '100%' }}
    gl={{
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: isDark ? 0.9 : 1.15,
    }}
    dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
  >
    <SceneContent isDark={isDark} />
  </Canvas>
);

export default IslandScene;
