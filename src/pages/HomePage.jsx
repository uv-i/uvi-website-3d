import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, ArrowRight, ExternalLink, Flame, Download, Trophy, Sparkles, Play, Code2, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/atoms/Button';
import TiltWrapper from '../components/atoms/TiltWrapper';
import { PARTNER_PROJECTS } from '../data/mockData';
import { getIsland3D, setIsland3D } from '../state/islandState';
import GameDetailPanel from '../components/game/GameDetailPanel';

// Lazy — Three.js only loads when 3D mode is activated
const IslandView = lazy(() => import('../components/island/IslandView'));

const ExploreIn3DButton = ({ onClick, isDark }) => (
  <div className="mt-10 flex justify-center animate-[fadeIn_1s_ease-out_0.6s_both]">
    <button
      onClick={onClick}
      className={`group relative px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 border shadow-lg hover:-translate-y-1 hover:shadow-2xl flex items-center gap-2 ${
        isDark
          ? 'bg-gradient-to-r from-purple-900/60 to-orange-900/50 border-purple-500/50 text-white shadow-purple-950/40 hover:border-orange-400'
          : 'bg-gradient-to-r from-[#5500CC] to-fuchsia-600 border-[#5500CC]/35 text-white shadow-purple-100 hover:shadow-purple-300'
      }`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-fuchsia-500 to-purple-600 opacity-0 group-hover:opacity-25 transition-opacity duration-500" />
      <span className="absolute inset-0 rounded-full border border-current opacity-25 animate-ping group-hover:animate-none" style={{ animationDuration: '3s' }} />
      <Sparkles size={16} className="text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
      Explore Studio in 3D
      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

// Showreel placeholder — set SHOWREEL_YOUTUBE_ID to your YouTube video ID to go live
const SHOWREEL_YOUTUBE_ID = null;

const VideoEmbed = ({ youtubeId, isDark }) => {
  if (youtubeId) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <iframe src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title="UV Interactives Showreel" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen className="absolute inset-0 w-full h-full border-0" />
      </div>
    );
  }
  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border-2 border-dashed flex flex-col items-center justify-center gap-4 ${isDark ? 'bg-[#0d0b18] border-purple-800/50' : 'bg-purple-50/60 border-purple-200'}`} style={{ aspectRatio: '16/9' }}>
      <div className="absolute top-0 left-0 w-48 h-48 bg-purple-600/10 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-500/10 blur-[60px] rounded-full pointer-events-none" />
      <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 ${isDark ? 'border-purple-500/60 bg-purple-900/30' : 'border-[#5500CC]/40 bg-purple-100'}`}>
        <Play size={24} className={`ml-1 ${isDark ? 'text-purple-300' : 'text-[#5500CC]'}`} fill="currentColor" />
      </div>
      <div className="relative z-10 text-center px-6">
        <p className={`font-black text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Studio Showreel · 30 sec</p>
        <p className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Set <code className={isDark ? 'text-purple-400' : 'text-[#5500CC]'}>SHOWREEL_YOUTUBE_ID</code> in HomePage.jsx to go live</p>
      </div>
      <span className={`absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-purple-600' : 'text-purple-300'}`}>[ placeholder ]</span>
    </div>
  );
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const StatCard = ({ value, label, icon: Icon, isDark }) => (
  <TiltWrapper className="w-full">
    <div className={`flex flex-col items-center justify-center p-6 rounded-xl border text-center transition-all ${isDark ? 'bg-[#0d0b18] border-purple-900/40 hover:border-purple-500/60' : 'bg-white border-purple-100 shadow-sm hover:border-[#5500CC]/40'}`}>
      <Icon size={24} className={`mb-3 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
      <div className={`text-3xl font-black mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
      <div className={`text-xs uppercase tracking-widest font-mono ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{label}</div>
    </div>
  </TiltWrapper>
);

const GameCard = ({ title, genre, description, link, partnerName, partnerUrl, isDark, onClick }) => (
  <TiltWrapper className="w-full h-full">
    <div
      onClick={onClick}
      className={`group relative border rounded-xl p-6 transition-all duration-300 cursor-pointer h-full ${isDark ? 'bg-[#0d0b18] border-purple-900/40 hover:border-purple-500/60 hover:shadow-[0_0_24px_rgba(85,0,238,0.15)]' : 'bg-white border-purple-100 shadow-sm hover:border-[#5500CC]/40 hover:shadow-lg'}`}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5500EE] via-fuchsia-400 to-orange-500 rounded-t opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>{genre}</div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        </div>
        {link && (
          <a href={link} target="_blank" rel="noreferrer" className={`p-2 rounded transition-colors ${isDark ? 'text-gray-500 hover:text-orange-400' : 'text-gray-400 hover:text-orange-600'}`}>
            <ExternalLink size={16} />
          </a>
        )}
      </div>
      <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
      {partnerName && partnerUrl && (
        <a
          href={partnerUrl}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
            isDark ? 'text-gray-500 hover:text-orange-400' : 'text-gray-400 hover:text-[#5500CC]'
          }`}
        >
          IP © {partnerName} <ExternalLink size={10} />
        </a>
      )}
    </div>
  </TiltWrapper>
);

const ServiceCard = ({ icon: Icon, title, desc, isDark }) => (
  <TiltWrapper className="w-full h-full">
    <div className={`p-6 rounded-xl border transition-all h-full ${isDark ? 'bg-[#0d0b18] border-purple-900/40 hover:border-orange-500/40' : 'bg-white border-purple-100 shadow-sm hover:border-orange-300'}`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${isDark ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
        <Icon size={20} className={isDark ? 'text-orange-400' : 'text-orange-500'} />
      </div>
      <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{desc}</p>
    </div>
  </TiltWrapper>
);

const HomePage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);
  const [view3D, setView3D] = useState(() => getIsland3D());
  const [selectedGameIndex, setSelectedGameIndex] = useState(null);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Force 2D on mobile even if singleton says 3D
      if (mobile && getIsland3D()) {
        setIsland3D(false);
        setView3D(false);
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const activate3D = () => { setIsland3D(true);  setView3D(true);  };
  const deactivate3D = () => { setIsland3D(false); setView3D(false); };

  const stats = [
    { value: '50K+', label: 'Downloads on Partner Titles', icon: Download },
    { value: '1',    label: 'Active Client Partnership',   icon: Trophy },
    { value: '7+',   label: 'Years in Game Dev',          icon: Sparkles },
    { value: '4+',   label: 'Service Areas',              icon: Flame },
  ];

  const services = [
    { icon: Gamepad2,  title: 'Unity Development',     desc: 'Mobile games for Android & iOS — Firebase backend, store integration, live ops, and optimised builds.' },
    { icon: Sparkles,  title: 'UEFN / Fortnite',       desc: 'Custom Fortnite islands built in Verse — tycoons, battle maps, economy systems, and live events.' },
    { icon: Code2,     title: 'WebGL / Playable Ads',  desc: 'Instant-play browser games and playable ad formats in Cocos Creator + TypeScript — no install required.' },
    { icon: ArrowRight,title: 'AR & Firebase',         desc: 'Augmented reality experiences and cloud-connected game backends using AR Foundation and Firebase.' },
  ];

  const featured = PARTNER_PROJECTS.slice(0, 3);

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

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {/* Grid subtly shifts against cursor — feels like looking through a tilting pane */}
          <div
            className={`absolute inset-0 ${isDark ? 'bg-[linear-gradient(to_right,#16083030_1px,transparent_1px),linear-gradient(to_bottom,#16083030_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)]'} bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]`}
            style={{ transform: 'translate3d(calc(var(--px,0)*-8px), calc(var(--py,0)*-5px), 0)' }}
          />
          {/* Glow blobs drift at different rates for depth */}
          <div
            className={`absolute top-0 left-0 right-0 h-[600px] ${isDark ? 'bg-purple-900/12' : 'bg-orange-100/40'} blur-[120px] rounded-full`}
            style={{ willChange: 'transform', transform: 'translate3d(calc(var(--px,0)*-18px), calc(var(--py,0)*-12px), 0)' }}
          />
          <div
            className={`absolute top-0 right-[-10%] w-[400px] h-[400px] ${isDark ? 'bg-[#5500EE]/6' : 'bg-amber-100/30'} blur-[100px] rounded-full`}
            style={{ willChange: 'transform', transform: 'translate3d(calc(var(--px,0)*24px), calc(var(--py,0)*16px), 0)' }}
          />
        </div>

        {/* Hero content floats at a mid-depth — moves slightly with cursor, creating layering vs the background */}
        <div
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
          style={{ willChange: 'transform', transform: 'translate3d(calc(var(--px,0)*6px), calc(var(--py,0)*4px), 0)' }}
        >
          <div className={`inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border text-xs font-mono ${isDark ? 'border-purple-500/30 bg-purple-900/15 text-purple-300' : 'border-[#5500CC]/30 bg-purple-50 text-[#5500CC]'}`}>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            OPEN FOR PROJECTS · CHENNAI, INDIA
          </div>

          <h1 className={`text-5xl sm:text-7xl md:text-[96px] font-black mb-4 tracking-tighter leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
            WE BUILD
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5500EE] via-fuchsia-400 to-orange-500">
              GAMES
            </span>
          </h1>

          <p className={`text-lg sm:text-xl md:text-2xl mb-3 font-light ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Unity · UEFN · WebGL · Firebase · 7+ Years
          </p>
          <p className={`text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            UV Interactives builds games that reach players — from 100K+ download mobile titles to Fortnite islands played by thousands. Tell us what you want to build.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/games')} icon={Gamepad2}>See Our Games</Button>
            <Button variant="secondary" onClick={() => navigate('/contact')} icon={ArrowRight}>Start a Project</Button>
          </div>

          {/* 3D Island toggle */}
          {!isMobile && <ExploreIn3DButton onClick={activate3D} isDark={isDark} />}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
              <StatCard {...s} isDark={isDark} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SHOWREEL ── */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className={`text-xs font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>Studio Showreel</div>
            <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>See It In Action</h2>
          </div>
          <span className={`text-xs font-mono px-3 py-1 rounded-full border ${isDark ? 'border-orange-700/50 text-orange-400' : 'border-orange-300 text-orange-600'}`}>30 sec</span>
        </div>
        <VideoEmbed youtubeId={SHOWREEL_YOUTUBE_ID} isDark={isDark} />
      </section>

      {/* ── SERVICES ── */}
      <section className="max-w-6xl mx-auto px-4">
        <div className={`text-xs font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>What We Do</div>
        <h2 className={`text-2xl sm:text-3xl font-black mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <motion.div key={s.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
              <ServiceCard {...s} isDark={isDark} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED GAMES ── */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className={`text-xs font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>Proud Partners</div>
            <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Games We Ship</h2>
          </div>
          <button onClick={() => navigate('/games')} className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-600'}`}>
            Full catalog <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((p, i) => (
            <motion.div key={p.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
              <GameCard
                title={p.title}
                genre={p.genre}
                description={p.description}
                link={p.androidLink}
                partnerName={p.partnerName}
                partnerUrl={p.partnerUrl}
                isDark={isDark}
                onClick={() => setSelectedGameIndex(i)}
              />
            </motion.div>
          ))}
        </div>
      </section>

    </div>

    {/* Detail panel — same as Games page */}
    {selectedGameIndex !== null && (
      <GameDetailPanel
        game={PARTNER_PROJECTS[selectedGameIndex]}
        games={PARTNER_PROJECTS}
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
