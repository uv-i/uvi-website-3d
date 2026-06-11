import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Home, Gamepad2 } from 'lucide-react';

const NotFoundPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      {/* Ambient glow */}
      <div className={`fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[120px] pointer-events-none ${
        isDark ? 'bg-purple-900/15' : 'bg-orange-100/50'
      }`} />

      <div className="relative z-10 text-center max-w-md mx-auto">

        {/* 404 number */}
        <div className={`text-[120px] sm:text-[160px] font-black leading-none tracking-tighter select-none ${
          isDark
            ? 'text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-fuchsia-400 to-orange-500'
            : 'text-transparent bg-clip-text bg-gradient-to-br from-[#5500CC] via-fuchsia-500 to-orange-500'
        }`}>
          404
        </div>

        {/* Lion */}
        <div className="text-5xl mb-4 -mt-4">🦁</div>

        <h1 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Lost in the map?
        </h1>
        <p className={`text-sm mb-8 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          This page doesn't exist — or was moved. Leo checked every corner and came up empty.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white clip-path-polygon transition-all hover:-translate-y-0.5 ${
              isDark
                ? 'bg-[#5500EE] hover:bg-[#6611FF] shadow-[0_0_14px_rgba(85,0,238,0.45)]'
                : 'bg-[#5500CC] hover:bg-[#6611DD]'
            }`}
          >
            <Home size={16} /> Back to Home
          </button>
          <button
            onClick={() => navigate('/projects')}
            className={`flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold clip-path-polygon border transition-all hover:-translate-y-0.5 ${
              isDark
                ? 'border-orange-500/50 text-orange-400 hover:bg-orange-900/20'
                : 'border-orange-400 text-orange-600 hover:bg-orange-50'
            }`}
          >
            <Gamepad2 size={16} /> See My Work
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
