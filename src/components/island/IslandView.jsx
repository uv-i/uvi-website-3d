import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Gamepad2, FlaskConical, Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const IslandScene = lazy(() => import('./IslandScene'));

const NAV_ITEMS = [
  { label: 'Our Games', route: '/games',   icon: Gamepad2 },
  { label: 'Dev Lab',   route: '/lab',     icon: FlaskConical },
  { label: 'Contact',   route: '/contact', icon: Mail },
];

const SceneFallback = ({ isDark }) => (
  <div className={`w-full h-full flex flex-col items-center justify-center gap-4 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
    <div className="w-10 h-10 border-2 border-current border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-mono uppercase tracking-widest opacity-60">Loading Island…</span>
  </div>
);

const IslandView = ({ onToggle2D }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 80px)' }}>

      {/* Top nav overlay */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-center px-4">
        <div className={`flex flex-wrap justify-center gap-2 px-4 py-2.5 rounded-2xl backdrop-blur-md border ${
          isDark ? 'bg-black/40 border-purple-800/40' : 'bg-white/60 border-purple-200'
        }`}>
          {NAV_ITEMS.map(({ label, route, icon: Icon }) => (
            <button
              key={route}
              onClick={() => navigate(route)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 ${
                isDark
                  ? 'text-gray-300 hover:text-white hover:bg-purple-700/50'
                  : 'text-gray-600 hover:text-[#5500CC] hover:bg-purple-100'
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <Suspense fallback={<SceneFallback isDark={isDark} />}>
        <IslandScene isDark={isDark} />
      </Suspense>

      {/* Hint text */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none">
        <span className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          Drag to rotate · Scroll to zoom · Click a landmark to navigate
        </span>
      </div>

      {/* Back to 2D */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
        <button
          onClick={onToggle2D}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md transition-all hover:-translate-y-0.5 ${
            isDark
              ? 'bg-black/50 border-purple-700/50 text-purple-300 hover:border-purple-500 hover:text-white'
              : 'bg-white/70 border-purple-300 text-[#5500CC] hover:border-[#5500CC]'
          }`}
        >
          <Map size={13} />
          Back to 2D View
        </button>
      </div>
    </div>
  );
};

export default IslandView;
