const KEY = 'uvi_island_3d';
// Store '1' or '0' explicitly so null means "never visited" (used to default to 3D on first load).
export const getIsland3D   = () => localStorage.getItem(KEY) === '1';
export const hasIsland3DPref = () => localStorage.getItem(KEY) !== null;
export const setIsland3D   = (v) => localStorage.setItem(KEY, v ? '1' : '0');
