import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Star, ExternalLink, Handshake } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { UV_PROJECTS, PARTNER_PROJECTS } from '../data/mockData';
import GameDetailPanel from '../components/game/GameDetailPanel';

// ─────────────────────────────────────────────────────────────────────────────
// Shared atoms
// ─────────────────────────────────────────────────────────────────────────────
const StatusBadge = ({ status, isDark }) => {
  const isLive  = /live|downloads/i.test(status);
  const isInDev = /development/i.test(status);
  return (
    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
      isLive
        ? isDark ? 'border-green-700 text-green-400 bg-green-900/20' : 'border-green-400 text-green-700 bg-green-50'
        : isInDev
          ? isDark ? 'border-amber-700 text-amber-400 bg-amber-900/10' : 'border-amber-400 text-amber-700 bg-amber-50'
          : isDark ? 'border-gray-700 text-gray-400' : 'border-gray-400 text-gray-500'
    }`}>{status}</span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Teaser card — UV Original in development
// ─────────────────────────────────────────────────────────────────────────────
const TeaserCard = ({ project, isDark }) => (
  <div className="relative pl-16 mb-16">
    <div className={`absolute left-[18px] top-7 w-[20px] h-[20px] rounded-full border-2 border-dashed z-10 ${
      isDark ? 'border-amber-600 bg-[#08080f]' : 'border-amber-500 bg-white'
    }`} />
    <article className={`relative border-2 border-dashed rounded-2xl overflow-hidden ${
      isDark ? 'bg-[#0d0b18] border-purple-900/50' : 'bg-white border-purple-200'
    }`}>
      <div className={`px-8 pt-8 pb-6 ${isDark ? 'bg-purple-950/20' : 'bg-purple-50/60'}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className={`text-[10px] font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
              {project.genre}
            </div>
            <div className={`text-2xl font-black tracking-widest select-none ${isDark ? 'text-purple-900' : 'text-purple-200'}`}
              aria-label="Title under wraps">
              ████████████
            </div>
          </div>
          <div className="flex gap-2 mt-1">
            <StatusBadge status={project.status} isDark={isDark} />
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
              isDark ? 'border-purple-700 text-purple-400 bg-purple-900/20' : 'border-purple-300 text-purple-700 bg-purple-50'
            }`}>{project.year}</span>
          </div>
        </div>
        <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {project.description}
        </p>
      </div>
    </article>
  </div>
);

const OriginalsEndCap = ({ isDark }) => (
  <div className="relative pl-16">
    <div className={`absolute left-[18px] top-5 w-[20px] h-[20px] rounded-full border-2 border-dashed ${
      isDark ? 'border-purple-800 bg-[#08080f]' : 'border-purple-300 bg-white'
    }`} />
    <div className={`border-2 border-dashed rounded-2xl p-10 text-center ${
      isDark ? 'border-purple-900/40 text-gray-600' : 'border-purple-200 text-gray-400'
    }`}>
      <Star size={28} className={`mx-auto mb-3 ${isDark ? 'text-purple-900' : 'text-purple-200'}`} />
      <div className={`text-sm font-bold mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>More originals on the way</div>
      <div className="text-xs font-mono">UV Interactives is building its own IP catalog — stay tuned.</div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Partner card — clickable, opens detail panel
// ─────────────────────────────────────────────────────────────────────────────
const PartnerCard = ({ project, isDark, onClick }) => (
  <div className="relative pl-16 mb-16">
    <div className={`absolute left-[18px] top-8 w-[20px] h-[20px] rounded-full border-2 z-10 flex items-center justify-center ${
      isDark ? 'bg-[#08080f] border-[#8855FF] shadow-[0_0_12px_rgba(136,85,255,0.7)]' : 'bg-white border-[#5500CC] shadow-md'
    }`}>
      <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isDark ? 'bg-[#8855FF]' : 'bg-[#5500CC]'}`} />
    </div>
    <div className={`absolute top-[26px] text-[9px] font-mono -translate-y-1/2 ${isDark ? 'text-[#8855FF]' : 'text-[#5500CC]'}`}
      style={{ left: '42px' }}>
      {project.year}
    </div>

    <article
      onClick={onClick}
      className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-1 active:scale-[0.99] ${
        isDark
          ? 'bg-[#0d0b18] border-purple-900/40 hover:border-[#8855FF]/60 hover:shadow-[0_0_32px_rgba(136,85,255,0.18)]'
          : 'bg-white border-purple-100 hover:border-[#5500CC]/40 hover:shadow-[0_0_20px_rgba(85,0,204,0.12)] shadow-sm'
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5500EE] via-orange-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

      {/* Attribution strip */}
      <div className={`flex items-center justify-between px-6 py-3 border-b ${
        isDark ? 'bg-purple-950/30 border-purple-900/40' : 'bg-purple-50/70 border-purple-100'
      }`}>
        <div className="flex items-center gap-2">
          <Handshake size={13} className={isDark ? 'text-purple-400' : 'text-[#5500CC]'} />
          <span className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
            {project.role}
          </span>
        </div>
        <span className={`text-[10px] font-mono ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          IP © {project.partnerName}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        {/* Screenshot placeholder */}
        <div className={`w-full h-48 md:h-full flex items-center justify-center relative ${
          isDark ? 'bg-gradient-to-br from-gray-900 to-[#0d0b18]' : 'bg-gradient-to-br from-orange-50 to-white'
        }`}>
          <span className={`text-7xl font-black opacity-[0.06] select-none ${isDark ? 'text-purple-400' : 'text-purple-500'}`}>
            {project.title.charAt(0)}
          </span>
          <span className={`absolute bottom-2 right-3 text-[9px] font-mono ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
            [ Add Screenshot ]
          </span>
          <div className="absolute top-3 left-3">
            <StatusBadge status={project.status} isDark={isDark} />
          </div>
          {/* Tap hint */}
          <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
            isDark ? 'bg-purple-950/70' : 'bg-purple-900/10'
          }`}>
            <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-[#5500CC]'}`}>
              View Details
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col">
          <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-[#8855FF]' : 'text-[#5500CC]'}`}>
            {project.genre}
          </div>
          <h3 className={`text-2xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
          <p className={`text-sm leading-relaxed mb-5 flex-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {project.description}
          </p>
          {project.highlights && (
            <ul className="space-y-1 mb-5">
              {project.highlights.map((h, i) => (
                <li key={i} className={`flex items-start gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <ChevronRight size={11} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />{h}
                </li>
              ))}
            </ul>
          )}
          <div className={`text-xs font-semibold flex items-center gap-1.5 mt-auto ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
            <span>Click to view details, trailer & screenshots</span>
            <ChevronRight size={12} />
          </div>
        </div>
      </div>
    </article>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'originals', label: 'UV Originals' },
  { id: 'partners',  label: 'Proud Partners' },
];

const GamesPage = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('originals');
  const [selectedIndex, setSelectedIndex] = useState(null);

  const selectedGame = selectedIndex !== null ? PARTNER_PROJECTS[selectedIndex] : null;

  const openGame = (index) => setSelectedIndex(index);
  const closeGame = () => setSelectedIndex(null);

  return (
    <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto min-h-screen">

      <div className="mb-10">
        <div className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-3 ${isDark ? 'text-[#8855FF]' : 'text-[#5500CC]'}`}>
          UV Interactives · Game Catalog
        </div>
        <h1 className={`text-4xl md:text-5xl font-black leading-none mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Games
        </h1>
        <p className={`text-sm max-w-xl ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          Our own IPs in the making — and the titles we proudly ship for our partners.
        </p>
      </div>

      {/* Tab switcher */}
      <div className={`inline-flex rounded-xl border p-1 mb-12 ${
        isDark ? 'bg-[#0d0b18] border-purple-900/40' : 'bg-purple-50/60 border-purple-200'
      }`}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id
                ? isDark ? 'bg-purple-700/60 text-white shadow-md' : 'bg-white text-[#5500CC] shadow-sm border border-purple-100'
                : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <AnimatePresence mode="wait" initial={false}>
        {activeTab === 'originals' ? (
          <motion.div
            key="originals"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className={`absolute left-[26px] top-0 bottom-0 w-[2px] ${
              isDark ? 'bg-gradient-to-b from-amber-600 via-purple-800/40 to-transparent' : 'bg-gradient-to-b from-amber-400 via-purple-300/40 to-transparent'
            }`} />
            {UV_PROJECTS.map((p, i) => p.teaser && (
              <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <TeaserCard project={p} isDark={isDark} />
              </motion.div>
            ))}
            <OriginalsEndCap isDark={isDark} />
          </motion.div>
        ) : (
          <motion.div
            key="partners"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`mb-10 px-5 py-4 rounded-xl border text-sm ${
              isDark ? 'border-purple-900/40 bg-purple-950/20 text-gray-400' : 'border-purple-100 bg-purple-50/60 text-gray-500'
            }`}>
              <span className={`font-semibold ${isDark ? 'text-purple-300' : 'text-[#5500CC]'}`}>What this is: </span>
              Games we maintain and ship on stores on behalf of our clients. The intellectual property belongs to the respective brand — UV Interactives handles the technical side.
            </div>
            <div className="relative">
              <div className={`absolute left-[26px] top-0 bottom-0 w-[2px] ${
                isDark ? 'bg-gradient-to-b from-[#8855FF] via-purple-800/40 to-transparent' : 'bg-gradient-to-b from-[#5500CC] via-purple-300/40 to-transparent'
              }`} />
              {PARTNER_PROJECTS.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>
                  <PartnerCard project={project} isDark={isDark} onClick={() => openGame(i)} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail panel */}
      {selectedGame && (
        <GameDetailPanel
          game={selectedGame}
          games={PARTNER_PROJECTS}
          gameIndex={selectedIndex}
          onClose={closeGame}
          onNavigate={setSelectedIndex}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default GamesPage;
