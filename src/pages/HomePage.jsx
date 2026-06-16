import { useState, useEffect, lazy, Suspense, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import GameDetailPanel from '../components/game/GameDetailPanel';
import { useGamesData, useDevLabData } from '../hooks/useSanityData';
import { getIsland3D, setIsland3D, hasIsland3DPref } from '../state/islandState';
import { hasWebGL } from '../utils/webgl';
import { fadeUp } from '../components/home/fadeUp';

import HeroSection       from '../components/home/HeroSection';
import PlatformStrip     from '../components/home/PlatformStrip';
import StatsSection      from '../components/home/StatsSection';
import OpenSourceBanner  from '../components/home/OpenSourceBanner';
import ServicesSection   from '../components/home/ServicesSection';
import PackagesSection   from '../components/home/PackagesSection';
import BuildPicker       from '../components/home/BuildPicker';
import GamesSection      from '../components/home/GamesSection';
import ForgeTeaser       from '../components/home/ForgeTeaser';

const IslandView = lazy(() => import('../components/island/IslandView'));

// ── Transition curtain ────────────────────────────────────────────────────────
// Sits in a React portal-like fixed div — but we render it OUTSIDE the
// App's animated route wrapper (via a separate fixed div here) so it is
// never clipped by a parent CSS transform.
const TransitionCurtain = ({ visible, isDark }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        key="curtain"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: isDark
            ? 'radial-gradient(ellipse at 50% 60%, #1a0b2e 0%, #07060f 100%)'
            : 'radial-gradient(ellipse at 50% 60%, #2a1060 0%, #0a0618 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: [0, 1, 0.7], scale: [0.85, 1.0, 0.95] }}
          transition={{ duration: 0.5, times: [0, 0.5, 1] }}
          style={{
            fontSize: '12px', fontWeight: 900, letterSpacing: '0.35em',
            fontFamily: 'monospace', textTransform: 'uppercase',
            color: 'rgba(136,85,255,0.9)',
            textShadow: '0 0 24px rgba(136,85,255,0.6)',
          }}
        >
          ◈ UV INTERACTIVES
        </motion.span>
      </motion.div>
    )}
  </AnimatePresence>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const HomePage = () => {
  const { isDark } = useTheme();
  const { partnerProjects } = useGamesData();
  const { teachingData }    = useDevLabData();

  const [isMobile, setIsMobile] = useState(false);
  const [view3D,   setView3D]   = useState(() => {
    if (hasIsland3DPref()) return getIsland3D();
    return typeof window !== 'undefined' && window.innerWidth >= 1024 && hasWebGL();
  });
  const [selectedGameIndex, setSelectedGameIndex] = useState(null);
  const [curtainVisible, setCurtainVisible] = useState(false);
  const timerRef = useRef([]);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && getIsland3D()) { setIsland3D(false); setView3D(false); }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Clear timers on unmount to avoid state updates after unmount
  useEffect(() => {
    const timers = timerRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const runTransition = useCallback((callback) => {
    setCurtainVisible(true);
    const t1 = setTimeout(() => {
      callback();
      const t2 = setTimeout(() => setCurtainVisible(false), 200);
      timerRef.current.push(t2);
    }, 380);
    timerRef.current.push(t1);
  }, []);

  const activate3D   = useCallback(() => runTransition(() => { setIsland3D(true);  setView3D(true);  }), [runTransition]);
  const deactivate3D = useCallback(() => runTransition(() => { setIsland3D(false); setView3D(false); }), [runTransition]);

  // ── 3D view (original early-return pattern, preserved) ──────────────────────
  if (view3D && !isMobile) {
    return (
      <>
        <TransitionCurtain visible={curtainVisible} isDark={isDark} />
        <Suspense fallback={
          <div className={`min-h-[calc(100vh-80px)] flex items-center justify-center ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono uppercase tracking-widest opacity-60">Sailing to the island…</span>
            </div>
          </div>
        }>
          <IslandView onToggle2D={deactivate3D} />
        </Suspense>
      </>
    );
  }

  // ── 2D home (original structure, untouched) ──────────────────────────────────
  return (
    <>
      <TransitionCurtain visible={curtainVisible} isDark={isDark} />

      <div className="space-y-24">

        <HeroSection isDark={isDark} isMobile={isMobile} onActivate3D={activate3D} />

        <section className="max-w-3xl mx-auto px-4 -mt-8">
          <PlatformStrip isDark={isDark} />
        </section>

        <StatsSection isDark={isDark} />

        <section className="px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
            <OpenSourceBanner isDark={isDark} />
          </motion.div>
        </section>

        <ServicesSection isDark={isDark} />

        <PackagesSection packages={teachingData['Unity & C#'] || []} isDark={isDark} />

        <section className="py-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
            <BuildPicker isDark={isDark} />
          </motion.div>
        </section>

        <GamesSection
          games={partnerProjects.slice(0, 3)}
          isDark={isDark}
          onGameClick={setSelectedGameIndex}
        />

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
          <ForgeTeaser isDark={isDark} />
        </motion.div>

      </div>

      {selectedGameIndex !== null && (
        <GameDetailPanel
          game={partnerProjects[selectedGameIndex]}
          games={partnerProjects}
          gameIndex={selectedGameIndex}
          onClose={() => setSelectedGameIndex(null)}
          onNavigate={setSelectedGameIndex}
          isDark={isDark}
        />
      )}
    </>
  );
};

export default HomePage;
