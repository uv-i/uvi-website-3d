import { motion } from 'framer-motion';
import TiltWrapper from '../atoms/TiltWrapper';
import { fadeUp } from './fadeUp';
import { STATS } from '../../data/mockData';
import { useCountUp } from '../../hooks/useCountUp';

// ── Individual animated stat card ────────────────────────────────────────────
const StatCard = ({ value, label, icon: Icon, isDark }) => {
  const { displayValue, ref } = useCountUp(value, 1600);

  return (
    <TiltWrapper className="w-full h-full">
      <div
        ref={ref}
        className={`flex flex-col items-center justify-center p-6 rounded-xl border text-center transition-all h-full backdrop-blur-md ${
          isDark
            ? 'bg-purple-950/40 border-purple-500/20 hover:bg-purple-950/55 hover:border-purple-500/60'
            : 'bg-white/70 border-purple-200/60 shadow-sm hover:bg-white/85 hover:border-[#5500CC]/40'
        }`}
      >
        <Icon size={24} className={`mb-3 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />

        {/* Animated number */}
        <div className={`text-3xl font-black mb-1 tabular-nums ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {displayValue}
        </div>

        <div className={`text-xs uppercase tracking-widest font-mono ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          {label}
        </div>
      </div>
    </TiltWrapper>
  );
};

// ── Section ──────────────────────────────────────────────────────────────────
const StatsSection = ({ isDark }) => (
  <section className="max-w-4xl mx-auto px-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          custom={i}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="h-full"
        >
          <StatCard {...s} isDark={isDark} />
        </motion.div>
      ))}
    </div>
  </section>
);

export default StatsSection;
