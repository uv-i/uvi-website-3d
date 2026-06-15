import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Gamepad2, Mail, Moon, Sun, MonitorSmartphone, Menu, X, FlaskConical } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useLogoTilt } from '../../hooks/useLogoTilt';

// ── Sub-components ────────────────────────────────────────────────────────────

/** Single nav link with magnetic drift, cursor glow, and sliding underline */
const MagNavLink = ({ to, label, isDark }) => {
  const ref = useMagnetic(0.20);
  return (
    <div ref={ref} className="inline-flex" style={{ position: 'relative' }}>
      <NavLink
        to={to}
        end={to === '/'}
        className={({ isActive }) =>
          `relative px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5
           overflow-hidden transition-colors duration-200 group/link
           ${isActive
             ? isDark ? 'text-white bg-purple-600/20' : 'text-[#5500CC] bg-purple-100'
             : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-[#5500CC]'
           }`
        }
      >
        {({ isActive }) => (
          <>
            {/* Radial glow that follows cursor (--gx/--gy set on wrapper via useMagnetic) */}
            <span
              className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover/link:opacity-100 transition-opacity duration-200"
              style={{
                background: isDark
                  ? 'radial-gradient(circle 56px at var(--gx,50%) var(--gy,50%), rgba(136,85,255,0.20), transparent 72%)'
                  : 'radial-gradient(circle 56px at var(--gx,50%) var(--gy,50%), rgba(85,0,204,0.11), transparent 72%)',
              }}
            />

            {/* Active pulse dot */}
            {isActive && (
              <span className={`absolute left-2 w-1.5 h-1.5 rounded-full animate-pulse ${
                isDark ? 'bg-purple-400 shadow-[0_0_6px_#a855f7]' : 'bg-[#5500CC]'
              }`} />
            )}

            <span className={`relative z-10 ${isActive ? 'ml-2' : ''}`}>{label}</span>

            {/* Slide-in gradient underline */}
            <span className={`
              absolute bottom-[5px] left-4 right-4 h-[1.5px] rounded-full
              origin-left scale-x-0 group-hover/link:scale-x-100
              transition-transform duration-300 ease-out
              ${isDark
                ? 'bg-gradient-to-r from-purple-400 via-fuchsia-400 to-orange-400'
                : 'bg-gradient-to-r from-[#5500CC] to-orange-500'
              }
            `} />
          </>
        )}
      </NavLink>
    </div>
  );
};

/** Theme toggle with magnetic drift + icon spin */
const ThemeButton = ({ isDark, toggleTheme, themeIcon, themeMode }) => {
  const ref = useMagnetic(0.32);
  return (
    <div ref={ref} className="inline-flex ml-2">
      <button
        onClick={toggleTheme}
        title={`Theme: ${themeMode}`}
        className={`p-2.5 rounded-full transition-all duration-300 group/theme
          ${isDark
            ? 'bg-gray-800/80 text-amber-400 hover:bg-gray-700 hover:text-amber-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.45)]'
            : 'bg-orange-100 text-purple-600 hover:bg-orange-200 hover:shadow-[0_0_20px_rgba(85,0,204,0.30)]'
          }`}
      >
        <span className="block transition-transform duration-500 ease-out group-hover/theme:rotate-[30deg] group-hover/theme:scale-110">
          {themeIcon}
        </span>
      </button>
    </div>
  );
};

/** "Work With Us" CTA — navigates to /contact, hidden when already there */
const CTALink = ({ isDark }) => {
  const ref      = useMagnetic(0.16);
  const location = useLocation();
  if (location.pathname === '/contact') return null;

  return (
    <div ref={ref} className="inline-flex ml-3">
      <Link
        to="/contact"
        className={`relative px-4 py-2 text-white text-xs font-bold uppercase tracking-wider
          clip-path-polygon overflow-hidden group/cta
          transition-all duration-300
          ${isDark
            ? 'bg-[#5500EE] hover:bg-[#6611FF] shadow-[0_0_12px_rgba(85,0,238,0.45)] hover:shadow-[0_6px_24px_rgba(85,0,238,0.70)]'
            : 'bg-[#5500CC] hover:bg-[#6611DD] hover:shadow-[0_6px_24px_rgba(85,0,204,0.45)]'
          }`}
      >
        <span className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-[200%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out skew-x-12 pointer-events-none" />
        <span className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300" />
        <span className="relative">Work With Us</span>
      </Link>
    </div>
  );
};

// ── Main NavBar ───────────────────────────────────────────────────────────────

const NavBar = () => {
  const { isDark, toggleTheme, themeMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const logoRef  = useLogoTilt(15);

  const navItems = [
    { path: '/',        label: 'Home',    icon: Gamepad2 },
    { path: '/games',   label: 'Games',   icon: Gamepad2 },
    { path: '/lab',     label: 'Dev Lab', icon: FlaskConical },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  const getThemeIcon = () => {
    if (themeMode === 'dark')  return <Moon size={18} />;
    if (themeMode === 'light') return <Sun  size={18} />;
    return <MonitorSmartphone size={18} />;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b transition-colors duration-300 ${
      isDark ? 'bg-[#08080f]/88 border-purple-900/25' : 'bg-[#FFF6EE]/90 border-orange-200/60'
    }`}>
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center justify-between h-20">

          {/* ── Logo — 3D tilt with depth-separated layers ── */}
          <div ref={logoRef} style={{ display: 'inline-flex', transformStyle: 'preserve-3d', cursor: 'pointer' }}>
            <NavLink to="/" className="flex items-center gap-3 group/logo" style={{ transformStyle: 'preserve-3d', textDecoration: 'none' }}>
              {/* Logo box — closest layer (pops forward most on tilt) */}
              <div
                style={{
                  width: 44, height: 44,
                  backgroundColor: '#5500EE',
                  transform: 'translateZ(14px)',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
                className="rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 shadow-[0_0_14px_rgba(85,0,238,0.5)] group-hover/logo:shadow-[0_0_30px_rgba(85,0,238,0.85)] transition-shadow duration-400"
              >
                <img
                  src="/uv-logo.png"
                  alt="UV Interactives"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div
                  className="w-full h-full items-center justify-center hidden"
                  style={{ display: 'none', fontWeight: 900, fontSize: 14, color: '#FF8C00', letterSpacing: '0.05em' }}
                >
                  UV
                </div>
              </div>

              {/* Wordmark — mid layer (shifts less than the icon on tilt) */}
              <div className="leading-none" style={{ transform: 'translateZ(5px)', willChange: 'transform' }}>
                <div className="text-base font-black tracking-wider">
                  <span className={isDark ? 'text-[#8855FF]' : 'text-[#5500CC]'}>UV</span>{' '}
                  <span className={isDark ? 'text-orange-400' : 'text-orange-600'}>INTERACTIVES</span>
                </div>
                <div className={`text-[10px] font-mono tracking-[0.18em] uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Game Studio
                </div>
              </div>
            </NavLink>
          </div>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <MagNavLink key={item.path} to={item.path} label={item.label} isDark={isDark} />
            ))}
            <ThemeButton
              isDark={isDark}
              toggleTheme={toggleTheme}
              themeIcon={getThemeIcon()}
              themeMode={themeMode}
            />
            <CTALink isDark={isDark} />
          </div>

          {/* ── Mobile controls ── */}
          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleTheme} className={isDark ? 'text-amber-400' : 'text-purple-600'}>
              {getThemeIcon()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b ${isDark ? 'bg-[#08080f] border-purple-900/25' : 'bg-[#FFF6EE] border-orange-200/60'}`}>
          <div className="px-3 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block w-full text-left px-3 py-3.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? isDark ? 'bg-purple-900/20 text-purple-300' : 'bg-purple-100 text-[#5500CC]'
                      : isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-orange-50 hover:text-gray-900'
                  }`
                }
              >
                <div className="flex items-center gap-3"><item.icon size={18} />{item.label}</div>
              </NavLink>
            ))}
            {location.pathname !== '/contact' && (
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-center gap-2 w-full mt-2 px-4 py-3 text-white text-sm font-bold uppercase tracking-wider clip-path-polygon ${
                  isDark ? 'bg-[#5500EE]' : 'bg-[#5500CC]'
                }`}
              >
                Work With Us
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
