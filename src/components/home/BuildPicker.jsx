import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { BUILD_OPTIONS } from '../../data/mockData';

const BuildPicker = ({ isDark }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const selected = BUILD_OPTIONS.find((o) => o.id === active);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className={`text-xs font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
        What are you building?
      </div>
      <h2 className={`text-2xl sm:text-3xl font-black mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Pick your platform
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {BUILD_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = active === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setActive(isActive ? null : opt.id)}
              className={`group relative text-left p-5 rounded-2xl border transition-all duration-300 ${
                isActive
                  ? isDark ? 'border-2 bg-[#0d0b18]' : 'border-2 bg-white shadow-lg'
                  : isDark
                    ? 'border-purple-900/40 bg-[#0d0b18] hover:border-purple-500/60'
                    : 'border-purple-100 bg-white shadow-sm hover:border-[#5500CC]/40'
              }`}
              style={isActive ? { borderColor: opt.color } : {}}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: opt.color }} />
              )}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${opt.color}22` }}>
                <Icon size={20} style={{ color: opt.color }} />
              </div>
              <div className={`text-base font-black mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{opt.platform}</div>
              <div className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{opt.tagline}</div>
            </button>
          );
        })}
      </div>

      {selected && (
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className={`rounded-2xl border p-6 flex flex-col sm:flex-row items-start gap-6 ${
            isDark ? 'bg-[#0d0b18] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
          }`}
        >
          <ul className="flex-1 grid grid-cols-2 gap-2">
            {selected.examples.map((ex) => (
              <li key={ex} className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <ChevronRight size={13} style={{ color: selected.color, flexShrink: 0 }} />
                {ex}
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate(selected.route, { state: { inquiry: selected.id } })}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-200 hover:scale-105"
            style={{ background: selected.color }}
          >
            {selected.cta} <ArrowRight size={14} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default BuildPicker;
