import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, BookOpen, FlaskConical, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { APP_CONFIG } from '../data/mockData';
import { useDevLabData } from '../hooks/useSanityData';
import SectionHeader from '../components/atoms/SectionHeader';
import IdeaForge from '../components/molecules/IdeaForge';
import TiltWrapper from '../components/atoms/TiltWrapper';

// ── Tag ────────────────────────────────────────────────────────────────────────
const Tag = ({ label, isDark }) => (
  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
    isDark ? 'border-gray-700 text-gray-500 bg-gray-900/40' : 'border-orange-200 text-orange-700 bg-orange-50/60'
  }`}>{label}</span>
);

// ── Repo card ──────────────────────────────────────────────────────────────────
const RepoCard = ({ repo, isDark }) => (
  <TiltWrapper className="w-full h-full">
    <article className={`group relative flex flex-col border rounded-xl overflow-hidden h-full ${
      isDark
        ? 'bg-[#0d0b18] border-purple-900/40 hover:border-purple-500/60 hover:shadow-[0_0_24px_rgba(85,0,238,0.15)]'
        : 'bg-white border-purple-100 hover:border-[#5500CC]/40 hover:shadow-[0_0_16px_rgba(85,0,204,0.1)] shadow-sm'
    }`}>
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5500EE] via-fuchsia-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
              <BookOpen size={18} className={isDark ? 'text-purple-400' : 'text-[#5500CC]'} />
            </div>
            <div>
              <div className={`text-[10px] font-mono uppercase tracking-widest mb-0.5 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
                {repo.category}
              </div>
              <h3 className={`font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{repo.title}</h3>
            </div>
          </div>
          <span className={`text-[9px] font-mono px-2 py-0.5 rounded border flex-shrink-0 ${
            repo.status === 'Active'
              ? isDark ? 'border-green-700 text-green-400 bg-green-900/20' : 'border-green-400 text-green-700 bg-green-50'
              : isDark ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'
          }`}>
            {repo.status}
          </span>
        </div>

        <p className={`text-sm leading-relaxed mb-4 flex-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {repo.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {repo.tags.map(t => <Tag key={t} label={t} isDark={isDark} />)}
        </div>

        <a
          href={repo.githubUrl}
          target="_blank"
          rel="noreferrer"
          className={`mt-auto flex items-center justify-center gap-2 text-sm font-bold py-2.5 px-4 rounded-lg border transition-all ${
            isDark
              ? 'border-purple-700 text-purple-300 hover:bg-purple-900/25 hover:border-purple-500'
              : 'border-[#5500CC] text-[#5500CC] hover:bg-purple-50'
          }`}
        >
          <Github size={16} /> View on GitHub <ExternalLink size={12} />
        </a>
      </div>
    </article>
  </TiltWrapper>
);

const PlaceholderCard = ({ isDark }) => (
  <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 text-center min-h-[200px] ${
    isDark ? 'border-purple-900/30 text-gray-700' : 'border-purple-200 text-gray-400'
  }`}>
    <Plus size={28} className={`mb-3 ${isDark ? 'text-purple-800' : 'text-purple-200'}`} />
    <div className="text-sm font-bold mb-1">More Coming Soon</div>
    <div className={`text-xs font-mono ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>
      Unity modules, tutorials & practice projects
    </div>
  </div>
);

// ── Page ───────────────────────────────────────────────────────────────────────
const DevLabPage = () => {
  const { isDark } = useTheme();

  // Fetch live data from Sanity (falls back to mockData.js if CMS not configured)
  const { teachingData, loading } = useDevLabData();
  const tabs = Object.keys(teachingData);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const repos = teachingData[activeTab] ?? [];

  // If Sanity loads different categories than mockData, reset to the first available tab
  useEffect(() => {
    if (tabs.length > 0 && !tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [teachingData]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return (
    <div className="pt-24 pb-20 px-4 max-w-6xl mx-auto min-h-screen flex items-center justify-center">
      <div className={`text-sm font-mono ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
        Loading packages…
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 px-4 max-w-6xl mx-auto min-h-screen">
      <SectionHeader title="Dev Lab" subtitle="Teaching resources, AI tools, and open-source practice projects." />

      {/* Intro banner */}
      <div className={`mb-14 border rounded-2xl p-8 relative overflow-hidden ${
        isDark ? 'bg-gradient-to-r from-gray-900 to-[#0d0b18] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
      }`}>
        <div className="absolute top-0 right-0 p-6 opacity-[0.06]">
          <FlaskConical size={100} className={isDark ? 'text-purple-400' : 'text-[#5500CC]'} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h3 className={`text-2xl font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <FlaskConical className={isDark ? 'text-purple-400' : 'text-[#5500CC]'} size={22} />
            Teaching Game Development
          </h3>
          <p className={`mb-5 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Beyond building games, we actively teach game development — sharing Unity fundamentals, C# scripting patterns,
            and hands-on project structures via GitHub. These repos are open for anyone learning to build games.
          </p>
          <a
            href={APP_CONFIG.socials.github}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 clip-path-polygon transition-all hover:-translate-y-0.5 text-white ${
              isDark
                ? 'bg-[#5500EE] hover:bg-[#6611FF] shadow-[0_0_14px_rgba(85,0,238,0.45)]'
                : 'bg-[#5500CC] hover:bg-[#6611DD]'
            }`}
          >
            <Github size={16} /> View org on GitHub
          </a>
        </div>
      </div>

      {/* ── Tab bar ─────────────────────────────────────────────────────────── */}
      <div className={`flex gap-1 mb-8 p-1 rounded-xl w-fit ${isDark ? 'bg-gray-900/60' : 'bg-gray-100'}`}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab
                ? isDark
                  ? 'bg-[#5500EE] text-white shadow-[0_0_12px_rgba(85,0,238,0.4)]'
                  : 'bg-[#5500CC] text-white shadow-sm'
                : isDark
                  ? 'text-gray-500 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Repo count label */}
      <div className={`text-xs font-mono uppercase tracking-widest mb-6 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
        {activeTab} · {repos.length} published
      </div>

      {/* Repo grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {repos.map(repo => (
          <RepoCard key={repo.id} repo={repo} isDark={isDark} />
        ))}
        <PlaceholderCard isDark={isDark} />
      </div>

      {/* ── Idea Forge section ────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className={`text-xs font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
          AI Tools
        </div>
        <h2 className={`text-2xl font-black mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Experimental Tools
        </h2>
      </div>

      <IdeaForge />

      <p className={`mt-12 text-center text-xs font-mono ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>
        More tools in development — check back soon
      </p>
    </div>
  );
};

export default DevLabPage;
