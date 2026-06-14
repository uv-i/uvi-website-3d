import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { APP_CONFIG } from '../../data/mockData';

const Footer = () => {
  const { isDark } = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer className={`border-t py-10 px-4 transition-colors duration-300 ${
      isDark ? 'bg-[#08080f] border-purple-900/20 text-gray-500' : 'bg-orange-50 border-orange-200/60 text-gray-500'
    }`}>
      {/* ── Tuning: swap `max-w-7xl` for `max-w-full` to reach screen edges on wide monitors */}
      <div className="max-w-full mx-auto flex flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded flex items-center justify-center bg-[#5500EE] overflow-hidden">
              <img src="/uv-logo.png" alt="" className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
              <span style={{ display: 'none', color: '#FF8C00', fontWeight: 900, fontSize: 9 }}>UV</span>
            </div>
            <span className="text-sm font-black tracking-wider">
              <span className={isDark ? 'text-[#8855FF]' : 'text-[#5500CC]'}>UV</span>
              {' '}
              <span className={isDark ? 'text-orange-400' : 'text-orange-600'}>INTERACTIVES</span>
            </span>
          </div>
          <p className="text-xs font-mono">© {year} · UV Interactives · {APP_CONFIG.contactLocation}</p>
        </div>

        <div className="flex gap-5 text-sm">
          <a href={APP_CONFIG.socials.github} target="_blank" rel="noreferrer"
            className={`transition-colors ${isDark ? 'hover:text-purple-400' : 'hover:text-[#5500CC]'}`}>
            GitHub
          </a>
          <a href={`mailto:${APP_CONFIG.contactEmail}`}
            className={`transition-colors ${isDark ? 'hover:text-orange-400' : 'hover:text-orange-600'}`}>
            Email
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
