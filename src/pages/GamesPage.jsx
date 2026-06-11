import React from 'react';
import { Globe, Smartphone, Lock, ChevronRight, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { UV_PROJECTS } from '../data/mockData';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const Tag = ({ label, isDark }) => (
  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
    isDark ? 'border-gray-700 text-gray-500 bg-gray-900/40' : 'border-orange-200 text-orange-700 bg-orange-50/60'
  }`}>{label}</span>
);

const LinkBtn = ({ href, label, icon: Icon, isDark }) => (
  <a href={href} target="_blank" rel="noreferrer"
    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border transition-colors ${
      isDark
        ? 'border-purple-800/60 text-purple-400 hover:bg-purple-900/20 hover:border-purple-500'
        : 'border-purple-200 text-[#5500CC] hover:bg-purple-50 hover:border-[#5500CC]'
    }`}>
    <Icon size={12} />{label}
  </a>
);

const StatusBadge = ({ status, isDark }) => {
  const isLive = /live|downloads/i.test(status);
  const isUnreleased = /unreleased/i.test(status);
  return (
    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
      isLive
        ? isDark ? 'border-green-700 text-green-400 bg-green-900/20' : 'border-green-400 text-green-700 bg-green-50'
        : isUnreleased
          ? isDark ? 'border-gray-700 text-gray-400' : 'border-gray-400 text-gray-500'
          : isDark ? 'border-amber-700 text-amber-400 bg-amber-900/10' : 'border-amber-400 text-amber-700 bg-amber-50'
    }`}>{status}</span>
  );
};

const ImagePlaceholder = ({ title, isDark }) => (
  <div className={`w-full h-48 flex items-center justify-center relative ${
    isDark ? 'bg-gradient-to-br from-gray-900 to-[#0d0b18]' : 'bg-gradient-to-br from-orange-50 to-white'
  }`}>
    <span className={`text-7xl font-black opacity-[0.06] select-none ${isDark ? 'text-purple-400' : 'text-purple-500'}`}>
      {title.charAt(0)}
    </span>
    <span className={`absolute bottom-2 right-3 text-[9px] font-mono ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
      [ Add Screenshot ]
    </span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Timeline node — one game per entry
// ─────────────────────────────────────────────────────────────────────────────
const TimelineGame = ({ project, isDark, index }) => {
  const links = [
    project.link        && { label: 'Play / View', href: project.link,        icon: Globe },
    project.androidLink && { label: 'Android',     href: project.androidLink, icon: Smartphone },
    project.iosLink     && { label: 'iOS',          href: project.iosLink,     icon: Smartphone },
  ].filter(Boolean);

  return (
    <div className="relative pl-16 mb-20">
      {/* Timeline dot */}
      <div className={`absolute left-[18px] top-8 w-[20px] h-[20px] rounded-full border-2 z-10 flex items-center justify-center ${
        isDark
          ? 'bg-[#08080f] border-[#8855FF] shadow-[0_0_12px_rgba(136,85,255,0.7)]'
          : 'bg-white border-[#5500CC] shadow-md'
      }`}>
        <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isDark ? 'bg-[#8855FF]' : 'bg-[#5500CC]'}`} />
      </div>

      {/* Year chip beside dot */}
      <div
        className={`absolute top-[26px] text-[9px] font-mono -translate-y-1/2 ${isDark ? 'text-[#8855FF]' : 'text-[#5500CC]'}`}
        style={{ left: '42px' }}
      >
        {project.year}
      </div>

      {/* Card */}
      <article className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        isDark
          ? 'bg-[#0d0b18] border-purple-900/40 hover:border-[#8855FF]/60 hover:shadow-[0_0_32px_rgba(136,85,255,0.18)]'
          : 'bg-white border-purple-100 hover:border-[#5500CC]/40 hover:shadow-[0_0_20px_rgba(85,0,204,0.12)] shadow-sm'
      }`}>
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5500EE] via-orange-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
          {/* Screenshot */}
          <div className="relative">
            <ImagePlaceholder title={project.title} isDark={isDark} />
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              <StatusBadge status={project.status} isDark={isDark} />
              {project.isUVBadge && (
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
                  isDark ? 'border-orange-700 text-orange-400 bg-orange-900/20' : 'border-orange-400 text-orange-700 bg-orange-50'
                }`}>★ UV</span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col">
            <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-[#8855FF]' : 'text-[#5500CC]'}`}>
              {project.genre}
            </div>
            <h3 className={`text-2xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>

            <p className={`text-sm leading-relaxed mb-4 flex-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {project.description}
            </p>

            {project.highlights && (
              <ul className="space-y-1 mb-4">
                {project.highlights.map((h, i) => (
                  <li key={i} className={`flex items-start gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <ChevronRight size={11} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />{h}
                  </li>
                ))}
              </ul>
            )}

            {project.attribution && (
              <div className={`text-[10px] italic mb-4 px-3 py-2 rounded border ${
                isDark ? 'border-purple-900/40 text-gray-500 bg-purple-900/10' : 'border-purple-100 text-gray-400 bg-purple-50/50'
              }`}>{project.attribution}</div>
            )}

            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.map(t => <Tag key={t} label={t} isDark={isDark} />)}
            </div>

            <div className="flex flex-wrap gap-2 mt-auto">
              {links.length > 0
                ? links.map(l => <LinkBtn key={l.label} {...l} isDark={isDark} />)
                : <span className={`text-xs font-mono flex items-center gap-1.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}><Lock size={11} /> Unreleased</span>
              }
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// "Coming up" end cap
// ─────────────────────────────────────────────────────────────────────────────
const ComingSoon = ({ isDark }) => (
  <div className="relative pl-16">
    <div className={`absolute left-[18px] top-5 w-[20px] h-[20px] rounded-full border-2 border-dashed ${
      isDark ? 'border-purple-800 bg-[#08080f]' : 'border-purple-300 bg-white'
    }`} />
    <div className={`border-2 border-dashed rounded-2xl p-10 text-center ${
      isDark ? 'border-purple-900/40 text-gray-600' : 'border-purple-200 text-gray-400'
    }`}>
      <Star size={30} className={`mx-auto mb-3 ${isDark ? 'text-purple-800' : 'text-purple-200'}`} />
      <div className={`text-sm font-bold mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>More titles in development</div>
      <div className="text-xs font-mono">New UV Interactives originals launching soon</div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
const GamesPage = () => {
  const { isDark } = useTheme();

  return (
    <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto min-h-screen">

      {/* Hero label */}
      <div className="mb-14">
        <div className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-3 ${isDark ? 'text-[#8855FF]' : 'text-[#5500CC]'}`}>
          UV Interactives · Game Catalog
        </div>
        <h1 className={`text-4xl md:text-5xl font-black leading-none mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Games We've Built
        </h1>
        <p className={`text-sm max-w-xl ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          Every title here is owned, designed, and maintained under the UV Interactives brand.
          This catalog grows with every release.
        </p>
      </div>

      {/* Timeline line */}
      <div className="relative">
        <div className={`absolute left-[26px] top-0 bottom-0 w-[2px] ${
          isDark
            ? 'bg-gradient-to-b from-[#8855FF] via-purple-800/40 to-transparent'
            : 'bg-gradient-to-b from-[#5500CC] via-purple-300/40 to-transparent'
        }`} />

        {UV_PROJECTS.map((project, i) => (
          <TimelineGame key={project.id} project={project} isDark={isDark} index={i} />
        ))}

        <ComingSoon isDark={isDark} />
      </div>
    </div>
  );
};

export default GamesPage;
