import { motion } from 'framer-motion';
import TiltWrapper from '../atoms/TiltWrapper';
import { fadeUp } from './fadeUp';
import { SERVICES } from '../../data/mockData';

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
