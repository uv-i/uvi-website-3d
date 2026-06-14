/**
 * Returns true if WebGL (v2 or v1) is available in this browser/GPU.
 * Used to gate the 3D island default on first visit.
 */
export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
