import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, Code2, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion';
import Button from '../atoms/Button';

// ─── Word-split stagger variants ────────────────────────────────────────────
const headlineContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const wordVariant = {
  hidden: {
    opacity: 0,
    y: 48,
    rotateX: -30,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1], // custom ease-out-expo
    },
  },
};

// Gradient word has the same motion but keeps clip-text
const gradientWordVariant = {
  ...wordVariant,
};

// ─── Sub-line fade variant ───────────────────────────────────────────────────
const subtitleVariant = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay: 0.55 + i * 0.1 },
  }),
};

// ─── 3D Button ───────────────────────────────────────────────────────────────
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

// ─── Main component ──────────────────────────────────────────────────────────
const HeroSection = ({ isDark, isMobile, onActivate3D }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  // ── Scroll-based values ──────────────────────────────────────────────────
  const { scrollY } = useScroll();

  // Blob parallax: as user scrolls down, blobs drift upward (negative translateY)
  const blob1Y = useTransform(scrollY, [0, 600], [0, -120]);
  const blob2Y = useTransform(scrollY, [0, 600], [0, -80]);
  const blob3Y = useTransform(scrollY, [0, 600], [0, -160]);

  // Grid mask parallax — subtle upward shift
  const gridY = useTransform(scrollY, [0, 600], [0, -40]);

  // ── Scroll-velocity tilt ─────────────────────────────────────────────────
  // scrollVelocity gives raw px/s; we map it to a rotateX and skewY
  const scrollVelocity = useVelocity(scrollY);

  // Smooth the raw velocity so it doesn't snap
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 300,
    damping: 50,
    restDelta: 0.001,
  });

  // Map velocity → tilt angles (cap at ±8deg rotateX, ±2deg skewY)
  const rotateX = useTransform(smoothVelocity, [-2000, 0, 2000], [8, 0, -8]);
  const skewY   = useTransform(smoothVelocity, [-2000, 0, 2000], [-2, 0, 2]);

  // Content also subtly fades/scales as it scrolls out of view
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const contentY       = useTransform(scrollY, [0, 400], [0, -60]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20"
    >
      {/* ── Background grid (parallax) ─────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: gridY }}
      >
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-[linear-gradient(to_right,#16083030_1px,transparent_1px),linear-gradient(to_bottom,#16083030_1px,transparent_1px)]'
              : 'bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)]'
          } bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]`}
        />
      </motion.div>

      {/* ── Parallax blobs ────────────────────────────────────────────────── */}
      {/* Blob 1 — wide top glow */}
      <motion.div
        className={`absolute top-0 left-0 right-0 h-[600px] ${isDark ? 'bg-purple-900/12' : 'bg-orange-100/40'} blur-[120px] rounded-full pointer-events-none z-0`}
        style={{ y: blob1Y }}
      />
      {/* Blob 2 — top-right accent */}
      <motion.div
        className={`absolute top-0 right-[-10%] w-[400px] h-[400px] ${isDark ? 'bg-[#5500EE]/6' : 'bg-amber-100/30'} blur-[100px] rounded-full pointer-events-none z-0`}
        style={{ y: blob2Y }}
      />
      {/* Blob 3 — bottom-left secondary (new, adds depth) */}
      <motion.div
        className={`absolute bottom-[-80px] left-[-5%] w-[350px] h-[350px] ${isDark ? 'bg-orange-900/8' : 'bg-purple-100/25'} blur-[110px] rounded-full pointer-events-none z-0`}
        style={{ y: blob3Y }}
      />

      {/* ── Content wrapper (scroll fade + lift) ─────────────────────────── */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border text-xs font-mono ${
            isDark
              ? 'border-purple-500/30 bg-purple-900/15 text-purple-300'
              : 'border-[#5500CC]/30 bg-purple-50 text-[#5500CC]'
          }`}
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          OPEN FOR PROJECTS · CHENNAI, INDIA
        </motion.div>

        {/* ── Headline with split-word stagger + scroll-velocity tilt ──── */}
        <motion.div
          style={{ rotateX, skewY, perspective: 1200, transformStyle: 'preserve-3d' }}
        >
          {/* "WE BUILD" line */}
          <motion.h1
            variants={headlineContainer}
            initial="hidden"
            animate="visible"
            className={`text-5xl sm:text-7xl md:text-[96px] font-black tracking-tighter leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}
            style={{ perspective: 800 }}
          >
            <span style={{ display: 'inline-block', overflow: 'visible' }}>
              {['WE', ' ', 'BUILD'].map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariant}
                  style={{
                    display: 'inline-block',
                    transformOrigin: 'bottom center',
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>

            <br />

            {/* "GAMES" — gradient word */}
            <motion.span
              variants={gradientWordVariant}
              style={{
                display: 'inline-block',
                transformOrigin: 'bottom center',
              }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#5500EE] via-fuchsia-400 to-orange-500"
            >
              GAMES
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Sub-lines staggered in after headline */}
        <motion.p
          custom={0}
          variants={subtitleVariant}
          initial="hidden"
          animate="visible"
          className={`text-lg sm:text-xl md:text-2xl mb-5 font-light tracking-wide ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
        >
          Mobile · WebGL · Fortnite · 8+ Years Shipping
        </motion.p>

        <motion.p
          custom={1}
          variants={subtitleVariant}
          initial="hidden"
          animate="visible"
          className={`text-base sm:text-lg mb-3 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
        >
          We ship games that reach players across every platform — and we believe our growth only means something when the builders around us grow too.
        </motion.p>

        <motion.p
          custom={2}
          variants={subtitleVariant}
          initial="hidden"
          animate="visible"
          className={`text-sm mb-10 max-w-xl mx-auto font-medium ${isDark ? 'text-orange-400/80' : 'text-orange-600'}`}
        >
          Our tutorials, packages, and tools are free and open — because a rising tide lifts all builders.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          variants={subtitleVariant}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button onClick={() => navigate('/games')} icon={Gamepad2}>See Our Games</Button>
          <Button variant="secondary" onClick={() => navigate('/contact')} icon={ArrowRight}>Start a Project</Button>
        </motion.div>

        <motion.div
          custom={4}
          variants={subtitleVariant}
          initial="hidden"
          animate="visible"
          className="mt-4 flex justify-center"
        >
          <button
            onClick={() => navigate('/lab')}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors underline underline-offset-4 decoration-dashed ${
              isDark
                ? 'text-purple-400 hover:text-orange-400 decoration-purple-600'
                : 'text-[#5500CC] hover:text-orange-600 decoration-[#5500CC]/40'
            }`}
          >
            <Code2 size={14} />
            Explore free game dev resources
          </button>
        </motion.div>

        {!isMobile && <ExploreIn3DButton onClick={onActivate3D} isDark={isDark} />}
      </motion.div>
    </section>
  );
};

export default HeroSection;
