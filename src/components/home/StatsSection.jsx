import { motion } from 'framer-motion';
import { Download, Trophy, Sparkles, Flame } from 'lucide-react';
import TiltWrapper from '../atoms/TiltWrapper';
import { fadeUp } from './fadeUp';

export const STATS = [
  { value: '50K+', label: 'Downloads on Partner Titles', icon: Download },
  { value: '1',    label: 'Active Client Partnership',   icon: Trophy   },
  { value: '8+',   label: 'Years in Game Dev',           icon: Sparkles },
  { value: '4+',   label: 'Service Areas',               icon: Flame    },
];

const StatCard = ({ value, label, icon: Icon, isDark }) => (
  <TiltWrapper className="w-full h-full">
    <div className={`flex flex-col items-center justify-center p-6 rounded-xl border text-center transition-all h-full ${
      isDark
        ? 'bg-[#0d0b18] border-purple-900/40 hover:border-purple-500/60'
        : 'bg-white border-purple-100 shadow-sm hover:border-[#5500CC]/40'
    }`}>
      <Icon size={24} className={`mb-3 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
      <div className={`text-3xl font-black mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
      <div className={`text-xs uppercase tracking-widest font-mono ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{label}</div>
    </div>
  </TiltWrapper>
);

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
