import { motion } from 'framer-motion';
import { ArrowRight, Package, Github, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TiltWrapper from '../atoms/TiltWrapper';
import { fadeUp } from './fadeUp';

const PackageCard = ({ pkg, isDark }) => (
  <TiltWrapper className="w-full h-full">
    <div className={`group relative flex flex-col border rounded-2xl overflow-hidden h-full transition-all duration-300 ${
      isDark
        ? 'bg-[#0d0b18] border-purple-900/40 hover:border-orange-500/40 hover:shadow-[0_0_28px_rgba(255,140,0,0.10)]'
        : 'bg-white border-purple-100 shadow-sm hover:border-orange-300 hover:shadow-md'
    }`}>
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-fuchsia-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
            <Package size={18} className={isDark ? 'text-orange-400' : 'text-orange-500'} />
          </div>
          <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
            isDark ? 'border-green-700 text-green-400 bg-green-900/20' : 'border-green-400 text-green-700 bg-green-50'
          }`}>Free</span>
        </div>

        <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
          {pkg.category}
        </div>
        <h3 className={`text-lg font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{pkg.title}</h3>
        <p className={`text-sm leading-relaxed flex-1 mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{pkg.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {pkg.tags.slice(0, 4).map((t) => (
            <span key={t} className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-[#5500CC]'
            }`}>{t}</span>
          ))}
        </div>

        <div className={`rounded-lg px-3 py-2 font-mono text-[10px] mb-4 truncate ${
          isDark ? 'bg-black/40 text-green-400' : 'bg-gray-50 text-green-700'
        }`}>
          {`git+${pkg.githubUrl}.git#1.0.0`}
        </div>

        <a
          href={pkg.githubUrl}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
            isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'
          }`}
        >
          <Github size={13} /> View on GitHub <ExternalLink size={11} />
        </a>
      </div>
    </div>
  </TiltWrapper>
);

const PackagesSection = ({ packages, isDark }) => {
  const navigate = useNavigate();
  return (
    <section className="max-w-5xl mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className={`text-xs font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>Dev Lab · Free Resources</div>
          <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Learn by building</h2>
        </div>
        <button
          onClick={() => navigate('/lab')}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-600'}`}
        >
          All resources <ArrowRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {packages.map((pkg, i) => (
          <motion.div key={pkg.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
            <PackageCard pkg={pkg} isDark={isDark} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PackagesSection;
