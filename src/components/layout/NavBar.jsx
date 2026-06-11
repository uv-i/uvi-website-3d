import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Gamepad2, Mail, Moon, Sun, MonitorSmartphone, Menu, X, FlaskConical } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { APP_CONFIG } from '../../data/mockData';

const UVLogo = ({ size = 44 }) => (
  <div style={{ width: size, height: size, backgroundColor: '#5500EE' }}
    className="rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 shadow-[0_0_14px_rgba(85,0,238,0.5)]">
    <img src="/uv-logo.png" alt="UV Interactives" className="w-full h-full object-cover"
      onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
    <div className="w-full h-full items-center justify-center hidden"
      style={{ display:'none', fontWeight:900, fontSize:14, color:'#FF8C00', letterSpacing:'0.05em' }}>UV</div>
  </div>
);

const NavBar = () => {
  const { isDark, toggleTheme, themeMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/',        label: 'Home',    icon: Gamepad2 },
    { path: '/games',   label: 'Games',   icon: Gamepad2 },
    { path: '/lab',     label: 'Dev Lab', icon: FlaskConical },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  const getThemeIcon = () => {
    if (themeMode === 'dark') return <Moon size={18} />;
    if (themeMode === 'light') return <Sun size={18} />;
    return <MonitorSmartphone size={18} />;
  };

  const linkClasses = ({ isActive }) =>
    `relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
      isActive
        ? isDark ? 'text-white bg-purple-600/20 shadow-[0_0_12px_rgba(85,0,238,0.25)]' : 'text-[#5500CC] bg-purple-100'
        : isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-[#5500CC] hover:bg-purple-50'
    }`;

  const mobileLinkClasses = ({ isActive }) =>
    `block w-full text-left px-3 py-3.5 rounded-lg text-base font-medium transition-colors ${
      isActive
        ? isDark ? 'bg-purple-900/20 text-purple-300' : 'bg-purple-100 text-[#5500CC]'
        : isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-orange-50 hover:text-gray-900'
    }`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b transition-colors duration-300 ${
      isDark ? 'bg-[#08080f]/88 border-purple-900/25' : 'bg-[#FFF6EE]/90 border-orange-200/60'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/" className="flex items-center gap-3 cursor-pointer group">
            <UVLogo size={44} />
            <div className="leading-none">
              <div className="text-base font-black tracking-wider">
                <span className={isDark ? 'text-[#8855FF]' : 'text-[#5500CC]'}>UV</span>{' '}
                <span className={isDark ? 'text-orange-400' : 'text-orange-600'}>INTERACTIVES</span>
              </div>
              <div className={`text-[10px] font-mono tracking-[0.18em] uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Game Studio
              </div>
            </div>
          </NavLink>

          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkClasses}>
                {({ isActive }) => (
                  <>
                    {isActive && <span className={`absolute left-2 w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-purple-400 shadow-[0_0_6px_#a855f7]' : 'bg-[#5500CC]'}`} />}
                    <span className={isActive ? 'ml-2' : ''}>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
            <button onClick={toggleTheme} className={`ml-2 p-2 rounded-full transition-colors ${isDark ? 'bg-gray-800 text-amber-400 hover:bg-gray-700' : 'bg-orange-100 text-purple-600 hover:bg-orange-200'}`} title={`Theme: ${themeMode}`}>
              {getThemeIcon()}
            </button>
            <a href={`mailto:${APP_CONFIG.contactEmail}`}
              className={`ml-3 px-4 py-2 text-white text-xs font-bold uppercase tracking-wider clip-path-polygon transition-all hover:-translate-y-0.5 ${isDark ? 'bg-[#5500EE] hover:bg-[#6611FF] shadow-[0_0_12px_rgba(85,0,238,0.45)]' : 'bg-[#5500CC] hover:bg-[#6611DD]'}`}>
              Work With Us
            </a>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleTheme} className={isDark ? 'text-amber-400' : 'text-purple-600'}>{getThemeIcon()}</button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`md:hidden border-b ${isDark ? 'bg-[#08080f] border-purple-900/25' : 'bg-[#FFF6EE] border-orange-200/60'}`}>
          <div className="px-3 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className={mobileLinkClasses}>
                <div className="flex items-center gap-3"><item.icon size={18} />{item.label}</div>
              </NavLink>
            ))}
            <a href={`mailto:${APP_CONFIG.contactEmail}`}
              className={`flex items-center justify-center gap-2 w-full mt-2 px-4 py-3 text-white text-sm font-bold uppercase tracking-wider clip-path-polygon ${isDark ? 'bg-[#5500EE]' : 'bg-[#5500CC]'}`}>
              Work With Us
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
