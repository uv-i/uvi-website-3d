import React from 'react';
import { Github, BookOpen, ExternalLink, GraduationCap, Code2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { TEACHING_DATA, APP_CONFIG } from '../data/mockData';

const TeachingCard = ({ title, description, tags, githubUrl, status, category, isDark }) => (
  <div className={`group relative border rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 ${
    isDark
      ? 'bg-[#0d0b18] border-purple-900/40 hover:border-purple-500/60 hover:shadow-[0_0_24px_rgba(85,0,238,0.15)]'
      : 'bg-white border-purple-100 shadow-sm hover:border-[#5500CC]/40 hover:shadow-lg'
  }`}>
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5500EE] via-fuchsia-400 to-orange-500 rounded-t opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex items-start justify-between mb-3">
      <div>
        <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
          {category}
        </div>
        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
          status === 'Active'
            ? isDark ? 'border-green-700/60 text-green-400 bg-green-900/20' : 'border-green-300 text-green-700 bg-green-50'
            : isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
        }`}>
          {status}
        </span>
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noreferrer"
            className={`p-1.5 rounded transition-colors ${isDark ? 'text-gray-500 hover:text-orange-400' : 'text-gray-400 hover:text-orange-600'}`}>
            <Github size={16} />
          </a>
        )}
      </div>
    </div>
    <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag} className={`text-[10px] font-mono px-2 py-1 rounded border ${
          isDark ? 'border-gray-700 text-gray-400 bg-gray-900/50' : 'border-gray-200 text-gray-500 bg-gray-50'
        }`}>
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const TeachingPage = () => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-20 pt-8 pb-24">

      {/* ── HERO ── */}
      <section className="max-w-4xl mx-auto px-4">
        <div className={`text-xs font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
          Teaching
        </div>
        <h1 className={`text-4xl sm:text-5xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Game Dev{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5500EE] via-fuchsia-400 to-orange-500">
            Resources
          </span>
        </h1>
        <p className={`text-lg max-w-2xl leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Open-source Unity tutorials and learning materials for aspiring game developers.
          All resources are free and available on GitHub.
        </p>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: BookOpen, title: 'Beginner Friendly', desc: 'Content built from the ground up — no prior game dev experience needed.' },
            { icon: Code2, title: 'Practical Focus', desc: 'Real Unity projects, not just theory. Learn by building actual game mechanics.' },
            { icon: GraduationCap, title: 'Open Source', desc: 'All repos are public on GitHub. Fork, modify, and ship your own games.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className={`p-6 rounded-xl border ${isDark ? 'bg-[#0d0b18] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${isDark ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
                <Icon size={20} className={isDark ? 'text-orange-400' : 'text-orange-500'} />
              </div>
              <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COURSE MODULES ── */}
      <section className="max-w-4xl mx-auto px-4">
        <div className={`text-xs font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
          Course Modules
        </div>
        <h2 className={`text-2xl font-black mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Available Repositories</h2>

        {TEACHING_DATA.length > 0 ? (
          <div className="grid grid-cols-1 gap-5">
            {TEACHING_DATA.map(item => (
              <TeachingCard key={item.id} {...item} isDark={isDark} />
            ))}
          </div>
        ) : (
          <div className={`rounded-xl border border-dashed p-12 text-center ${isDark ? 'border-purple-800/40' : 'border-purple-200'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>More modules coming soon.</p>
          </div>
        )}
      </section>

      {/* ── GITHUB CTA ── */}
      <section className="max-w-4xl mx-auto px-4">
        <div className={`rounded-2xl border p-8 flex flex-col sm:flex-row items-center justify-between gap-6 ${
          isDark ? 'bg-[#0d0b18] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
        }`}>
          <div>
            <h3 className={`text-xl font-black mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>All repos on GitHub</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Follow <span className={isDark ? 'text-purple-300' : 'text-[#5500CC]'}>@uv-i</span> for updates on new modules and projects.
            </p>
          </div>
          <a
            href={APP_CONFIG.socials.github}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-2 px-6 py-3 text-sm font-bold text-white clip-path-polygon flex-shrink-0 transition-all hover:-translate-y-0.5 ${
              isDark ? 'bg-[#5500EE] hover:bg-[#6611FF] shadow-[0_0_12px_rgba(85,0,238,0.45)]' : 'bg-[#5500CC] hover:bg-[#6611DD]'
            }`}
          >
            <Github size={16} /> View on GitHub <ExternalLink size={12} />
          </a>
        </div>
      </section>

    </div>
  );
};

export default TeachingPage;
