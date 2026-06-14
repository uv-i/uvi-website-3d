import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import GameDetailPanel from '../components/game/GameDetailPanel';
import { APP_CONFIG } from '../data/mockData';
import { useGamesData, useDevLabData } from '../hooks/useSanityData';
import { getIsland3D, setIsland3D, hasIsland3DPref } from '../state/islandState';
import { hasWebGL } from '../utils/webgl';
import { fadeUp } from '../components/home/fadeUp';

// Home sections
import HeroSection       from '../components/home/HeroSection';
import PlatformStrip     from '../components/home/PlatformStrip';
import StatsSection      from '../components/home/StatsSection';
import OpenSourceBanner  from '../components/home/OpenSourceBanner';
// import ShowreelSection from '../components/home/ShowreelSection'; // hidden until showreel is ready
import ServicesSection   from '../components/home/ServicesSection';
import PackagesSection   from '../components/home/PackagesSection';
import BuildPicker       from '../components/home/BuildPicker';
import GamesSection      from '../components/home/GamesSection';
import ForgeTeaser       from '../components/home/ForgeTeaser';

// Lazy — Three.js loads only when 3D mode is activated
const IslandView = lazy(() => import('../components/island/IslandView'));

const HomePage = () => {
  const { isDark } = useTheme();

  // Live data from Sanity (silently falls back to mockData.js if CMS not configured)
  const { partnerProjects } = useGamesData();
  const { teachingData }    = useDevLabData();

  const [isMobile, setIsMobile]     = useState(false);
  const [view3D,   setView3D]       = useState(() => {
    if (hasIsland3DPref()) return getIsland3D();
    return typeof window !== 'undefined' && window.innerWidth >= 1024 && hasWebGL();
  });
  const [selectedGameIndex, setSelectedGameIndex] = useState(null);

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

  const activate3D   = () => { setIsland3D(true);  setView3D(true);  };
  const deactivate3D = () => { setIsland3D(false); setView3D(false); };

  if (view3D && !isMobile) {
    return (
      <Suspense fallback={
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono uppercase tracking-widest opacity-60">Loading 3D Engine…</span>
          </div>
        </div>
      }>
        <IslandView onToggle2D={deactivate3D} />
      </Suspense>
    );
  }

  return (
    <>
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

        {/* <ShowreelSection youtubeId={APP_CONFIG.showreelYoutubeId} isDark={isDark} /> */}

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
