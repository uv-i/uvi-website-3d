import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Smartphone, ExternalLink, Play, Monitor } from 'lucide-react';

// ── Shared variants ───────────────────────────────────────────────────────────
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit:    { opacity: 0, transition: { duration: 0.22 } },
};

const panelVariants = {
  hidden:  { opacity: 0, scale: 0.93, y: 24 },
  visible: { opacity: 1, scale: 1,    y: 0,
    transition: { type: 'spring', damping: 28, stiffness: 320, mass: 0.8 } },
  exit:    { opacity: 0, scale: 0.93, y: 24,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } },
};

const contentVariants = {
  enter:  (dir) => ({ x: dir * 72, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:   (dir) => ({ x: dir * -72, opacity: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }),
};

// ── Media area ────────────────────────────────────────────────────────────────
const MediaArea = ({ game, isDark }) => {
  if (game.trailerYoutubeId) {
    return (
      <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <iframe
          src={`https://www.youtube.com/embed/${game.trailerYoutubeId}?rel=0&modestbranding=1&autoplay=1`}
          title={`${game.title} trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }
  if (game.screenshots?.length > 0) {
    return (
      <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img src={game.screenshots[0]} alt={game.title} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden flex flex-col items-center justify-center gap-3 border-2 border-dashed ${
        isDark ? 'bg-[#0a0815] border-purple-900/50' : 'bg-purple-50/60 border-purple-200'
      }`}
      style={{ aspectRatio: '16/9' }}
    >
      <motion.div
        className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${
          isDark ? 'border-purple-700/60 bg-purple-900/20' : 'border-purple-300 bg-purple-100'
        }`}
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <Play size={22} className={`ml-1 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`} fill="currentColor" />
      </motion.div>
      <div className="text-center">
        <p className={`text-sm font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Trailer coming soon</p>
        <p className={`text-[10px] font-mono mt-1 ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
          Set <code>trailerYoutubeId</code> in mockData.js to go live
        </p>
      </div>
    </div>
  );
};

const ScreenshotStrip = ({ screenshots, title, isDark }) => {
  const placeholders = screenshots?.length > 0 ? null : [0, 1, 2];
  return (
    <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
      {screenshots?.length > 0
        ? screenshots.map((src, i) => (
            <motion.img
              key={i} src={src} alt={`${title} screenshot ${i + 1}`}
              className="flex-shrink-0 h-20 w-auto rounded-lg object-cover"
              whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}
            />
          ))
        : placeholders.map(i => (
            <div key={i} className={`flex-shrink-0 w-32 h-20 rounded-lg border-2 border-dashed flex items-center justify-center ${
              isDark ? 'bg-[#0a0815] border-purple-900/40' : 'bg-purple-50/60 border-purple-200'
            }`}>
              <span className={`text-[9px] font-mono ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
                screenshot {i + 1}
              </span>
            </div>
          ))
      }
    </div>
  );
};

// ── Panel ─────────────────────────────────────────────────────────────────────
const GameDetailPanel = ({ game, games, gameIndex, onClose, onNavigate, isDark }) => {
  const [slideDir, setSlideDir] = useState(0);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && gameIndex < games.length - 1) handleNext();
      if (e.key === 'ArrowLeft'  && gameIndex > 0)               handlePrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameIndex, games.length]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleNext = () => {
    if (gameIndex >= games.length - 1) return;
    setSlideDir(1);
    onNavigate(gameIndex + 1);
  };

  const handlePrev = () => {
    if (gameIndex <= 0) return;
    setSlideDir(-1);
    onNavigate(gameIndex - 1);
  };

  const hasPrev = gameIndex > 0;
  const hasNext = gameIndex < games.length - 1;

  const links = [
    game.partnerUrl  && { label: `View on ${game.partnerName}`, href: game.partnerUrl,  icon: ExternalLink, accent: true },
    game.androidLink && { label: 'Android',                     href: game.androidLink, icon: Smartphone },
    game.iosLink     && { label: 'iOS',                         href: game.iosLink,     icon: Smartphone },
    game.link        && { label: 'Play / View',                 href: game.link,        icon: Monitor },
  ].filter(Boolean);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        style={{
          backgroundColor: isDark ? 'rgba(4,3,12,0.88)' : 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(10px)',
        }}
        onClick={onClose}
      >
        <motion.div
          key="panel"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col ${
            isDark
              ? 'bg-[#0d0b18] border border-purple-900/50'
              : 'bg-white border border-purple-100 shadow-2xl'
          }`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${
            isDark ? 'border-purple-900/40 bg-purple-950/20' : 'border-purple-100 bg-purple-50/60'
          }`}>
            <motion.button
              onClick={handlePrev}
              disabled={!hasPrev}
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                hasPrev
                  ? isDark ? 'text-purple-300 hover:text-white' : 'text-[#5500CC] hover:text-purple-900'
                  : isDark ? 'text-gray-700 cursor-not-allowed' : 'text-gray-200 cursor-not-allowed'
              }`}
              whileHover={hasPrev ? { x: -3 } : {}}
              whileTap={hasPrev ? { scale: 0.95 } : {}}
            >
              <ChevronLeft size={16} /><span className="hidden sm:inline">Prev</span>
            </motion.button>

            <div className="text-center flex-1 px-4">
              <div className={`text-[10px] font-mono uppercase tracking-widest mb-0.5 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
                {game.genre}
              </div>
              <h2 className={`text-lg font-black leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {game.title}
              </h2>
              {game.partnerName && (
                <div className={`text-[10px] font-mono mt-0.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  IP © {game.partnerName}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleNext}
                disabled={!hasNext}
                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  hasNext
                    ? isDark ? 'text-purple-300 hover:text-white' : 'text-[#5500CC] hover:text-purple-900'
                    : isDark ? 'text-gray-700 cursor-not-allowed' : 'text-gray-200 cursor-not-allowed'
                }`}
                whileHover={hasNext ? { x: 3 } : {}}
                whileTap={hasNext ? { scale: 0.95 } : {}}
              >
                <span className="hidden sm:inline">Next</span><ChevronRight size={16} />
              </motion.button>

              <div className={`w-px h-5 ${isDark ? 'bg-purple-900' : 'bg-purple-200'}`} />

              <motion.button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'text-gray-500 hover:text-white hover:bg-purple-900/40' : 'text-gray-400 hover:text-gray-900 hover:bg-purple-100'
                }`}
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <X size={18} />
              </motion.button>
            </div>
          </div>

          {/* Body — scrollable, content slides on nav */}
          <div className="overflow-y-auto flex-1">
            <AnimatePresence mode="wait" custom={slideDir}>
              <motion.div
                key={game.id}
                custom={slideDir}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grid grid-cols-1 lg:grid-cols-[1fr_360px]"
              >
                {/* Left — media */}
                <div className={`p-6 border-b lg:border-b-0 lg:border-r ${isDark ? 'border-purple-900/30' : 'border-purple-100'}`}>
                  <MediaArea game={game} isDark={isDark} />
                  <ScreenshotStrip screenshots={game.screenshots} title={game.title} isDark={isDark} />

                  {game.playableUrl && (
                    <motion.a
                      href={game.playableUrl} target="_blank" rel="noreferrer"
                      className={`mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm ${
                        isDark
                          ? 'bg-orange-500/10 border border-orange-500/30 text-orange-400'
                          : 'bg-orange-50 border border-orange-300 text-orange-700'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play size={16} fill="currentColor" /> Play in Browser
                    </motion.a>
                  )}
                </div>

                {/* Right — info */}
                <div className="p-6 flex flex-col gap-5">
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { text: game.status, color: 'green' },
                      game.year && { text: game.year, color: 'purple' },
                      game.role && { text: game.role, color: 'gray' },
                    ].filter(Boolean).map(({ text, color }) => (
                      <span key={text} className={`text-[9px] font-mono px-2 py-1 rounded border uppercase tracking-wider ${
                        color === 'green'  ? isDark ? 'border-green-700 text-green-400 bg-green-900/20' : 'border-green-400 text-green-700 bg-green-50'
                        : color === 'purple' ? isDark ? 'border-purple-800 text-purple-400' : 'border-purple-300 text-purple-700'
                        : isDark ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-500'
                      }`}>{text}</span>
                    ))}
                  </div>

                  <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {game.description}
                  </p>

                  {game.highlights?.length > 0 && (
                    <div>
                      <div className={`text-[10px] font-mono uppercase tracking-widest mb-3 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
                        Highlights
                      </div>
                      <ul className="space-y-2">
                        {game.highlights.map((h, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                            className={`flex items-start gap-2.5 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                          >
                            <span className={`mt-0.5 text-lg leading-none ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>›</span>
                            {h}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {links.length > 0 && (
                    <div className="mt-auto flex flex-col gap-2 pt-2">
                      {links.map(({ label, href, icon: Icon, accent }, i) => (
                        <motion.a
                          key={label} href={href} target="_blank" rel="noreferrer"
                          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border ${
                            accent
                              ? isDark ? 'border-orange-600/50 text-orange-400' : 'border-orange-400 text-orange-700'
                              : isDark ? 'border-purple-800/60 text-purple-300' : 'border-purple-200 text-[#5500CC]'
                          }`}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.07, duration: 0.3 }}
                        >
                          <Icon size={14} /> {label}
                        </motion.a>
                      ))}
                    </div>
                  )}

                  <p className={`text-[10px] font-mono text-center ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
                    ← → to navigate · Esc to close
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameDetailPanel;
