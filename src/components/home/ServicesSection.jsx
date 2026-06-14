import { motion } from 'framer-motion';
import { Gamepad2, Sparkles, Code2, ArrowRight } from 'lucide-react';
import TiltWrapper from '../atoms/TiltWrapper';
import { fadeUp } from './fadeUp';

export const SERVICES = [
  { icon: Gamepad2,   title: 'Unity Development',    desc: 'Mobile games for Android & iOS — Firebase backend, store integration, live ops, and optimised builds.' },
  { icon: Sparkles,   title: 'UEFN / Fortnite',      desc: 'Custom Fortnite islands built in Verse — tycoons, battle maps, economy systems, and live events.' },
  { icon: Code2,      title: 'WebGL / Playable Ads', desc: 'Instant-play browser games and playable ad formats in Cocos Creator + TypeScript — no install required.' },
  { icon: ArrowRight, title: 'AR & Firebase',        desc: 'Augmented reality experiences and cloud-connected game backends using AR Foundation and Firebase.' },
];

const ServiceCard = ({ icon: Icon, title, desc, isDark }) => (
  <TiltWrapper className="w-full h-full">
    <div className={`p-6 rounded-xl border transition-all h-full ${
      isDark
        ? 'bg-[#0d0b18] border-purple-900/40 hover:border-orange-500/40'
        : 'bg-white border-purple-100 shadow-sm hover:border-orange-300'
    }`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${isDark ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
        <Icon size={20} className={isDark ? 'text-orange-400' : 'text-orange-500'} />
      </div>
      <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{desc}</p>
    </div>
  </TiltWrapper>
);

const ServicesSection = ({ isDark }) => (
  <section className="max-w-6xl mx-auto px-4">
    <div className={`text-xs font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>What We Do</div>
    <h2 className={`text-2xl sm:text-3xl font-black mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Services</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {SERVICES.map((s, i) => (
        <motion.div key={s.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
          <ServiceCard {...s} isDark={isDark} />
        </motion.div>
      ))}
    </div>
  </section>
);

export default ServicesSection;
