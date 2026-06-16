import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TiltWrapper from '../atoms/TiltWrapper';
import { fadeUp } from './fadeUp';

export const GameCard = ({ title, genre, description, link, partnerName, partnerUrl, isDark, onClick }) => (
  <TiltWrapper className="w-full h-full">
    <div
      onClick={onClick}
      className={`group relative border rounded-xl p-6 transition-all duration-300 cursor-pointer h-full backdrop-blur-md ${
        isDark
          ? 'bg-purple-950/40 border-purple-500/20 hover:bg-purple-950/55 hover:border-purple-500/60 hover:shadow-[0_0_24px_rgba(85,0,238,0.15)]'
          : 'bg-white/70 border-purple-200/60 shadow-sm hover:bg-white/85 hover:border-[#5500CC]/40 hover:shadow-lg'
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5500EE] via-fuchsia-400 to-orange-500 rounded-t opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>{genre}</div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        </div>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`p-2 rounded transition-colors ${isDark ? 'text-gray-500 hover:text-orange-400' : 'text-gray-400 hover:text-orange-600'}`}
          >
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
          onClick={(e) => e.stopPropagation()}
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

const GamesSection = ({ games, isDark, onGameClick }) => {
  const navigate = useNavigate();
  return (
    <section className="max-w-7xl mx-auto px-4 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className={`text-xs font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>Proud Partners</div>
          <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Games We Ship</h2>
        </div>
        <button
          onClick={() => navigate('/games')}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-600'}`}
        >
          Full catalog <ArrowRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((p, i) => (
          <motion.div key={p.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
            <GameCard
              title={p.title}
              genre={p.genre}
              description={p.description}
              link={p.androidLink}
              partnerName={p.partnerName}
              partnerUrl={p.partnerUrl}
              isDark={isDark}
              onClick={() => onGameClick(i)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default GamesSection;
