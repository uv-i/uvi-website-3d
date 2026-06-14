/**
 * Landmark definitions — 3D positions are tied to the viking_island.glb model.
 *
 * Coordinate mapping: Three.js (X, Y, Z) = Blender (X, Zblender, −Yblender)
 *
 * hitPos     : centre of the invisible collision box
 * hitSize    : [width, height, depth] of the collision box
 * placardPos : where the HTML placard anchor floats
 * desc       : one-line context shown on hover
 * tags       : tech/topic chips shown on hover (max 3)
 */
export const LANDMARKS = [
  {
    id: 'devlab',
    label: 'Dev Lab',
    icon: '⚗️',
    sub: 'Free Unity Packages',
    desc: 'Free & open source. No signup.',
    tags: ['Unity', 'C#', 'GitHub'],
    route: '/lab',
    color: '#FF8C00',
    hitPos:     [-7,  2, -3],
    hitSize:    [4.5, 6, 4.5],
    placardPos: [-7,  5.5, -3],
  },
  {
    id: 'games',
    label: 'Our Games',
    icon: '⚔️',
    sub: 'Partner & Original Titles',
    desc: '50K+ downloads. More in the forge.',
    tags: ['Mobile', 'Fortnite', 'WebGL'],
    route: '/games',
    color: '#8855FF',
    hitPos:     [3.5, 2, 3.5],
    hitSize:    [3.5, 5, 3.5],
    placardPos: [3.5, 5, 3.5],
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: '🗺️',
    sub: 'Start a Project',
    desc: 'Chennai, India · Open for work.',
    tags: ['Pitch us', 'Collaborate'],
    route: '/contact',
    color: '#22C55E',
    hitPos:     [-12, 2, 4],
    hitSize:    [5,   5, 5],
    placardPos: [-12, 5.5, 4],
  },
];
