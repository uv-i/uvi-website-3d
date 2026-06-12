const KEY = 'uvi_island_3d';
export const getIsland3D = () => localStorage.getItem(KEY) === '1';
export const setIsland3D = (v) => v ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY);
