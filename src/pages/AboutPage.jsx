import React from 'react';
import { Github, Linkedin, ExternalLink, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { APP_CONFIG, TIMELINE_DATA, SKILLS_DATA } from '../data/mockData';

const Section = ({ label, children, isDark }) => (
  <section className="max-w-4xl mx-auto px-4">
    <div className={`text-xs font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
      {label}
    </div>
    {children}
  </section>
);

const SkillPill = ({ label, isDark }) => (
  <span className={`text-xs font-mono px-3 py-1.5 rounded-full border ${
    isDark ? 'border-purple-800/60 text-purple-300 bg-purple-900/20' : 'border-purple-200 text-[#5500CC] bg-purple-50'
  }`}>
    {label}
  </span>
);

const TimelineItem = ({ year, title, description, icon: Icon, isDark, isLast }) => (
  <div className="flex gap-5">
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
        isDark ? 'border-purple-600 bg-purple-900/30' : 'border-[#5500CC] bg-purple-50'
      }`}>
        <Icon size={16} className={isDark ? 'text-purple-300' : 'text-[#5500CC]'} />
      </div>
      {!isLast && (
        <div className={`w-px flex-1 mt-2 ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`} />
      )}
    </div>
    <div className="pb-10">
      <div className={`text-xs font-mono mb-1 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{year}</div>
      <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
    </div>
  </div>
);

const AboutPage = () => {
  const { isDark } = useTheme();

  const skillGroups = [
    { label: 'Engines', items: SKILLS_DATA.engines },
    { label: 'Languages', items: SKILLS_DATA.languages },
    { label: 'Backend & Tools', items: [...SKILLS_DATA.backend, ...SKILLS_DATA.tools] },
    { label: 'Soft Skills', items: SKILLS_DATA.soft },
  ];

  return (
    <div className="space-y-20 pt-8 pb-24">

      {/* ── HERO ── */}
      <Section label="About" isDark={isDark}>
        <div className={`rounded-2xl border p-8 sm:p-12 flex flex-col sm:flex-row gap-8 items-start ${
          isDark ? 'bg-[#0d0b18] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
        }`}>
          {/* Avatar placeholder */}
          <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl font-black ${
            isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-[#5500CC]'
          }`}>
            B
          </div>
          <div className="flex-1 min-w-0">
            <h1 className={`text-3xl sm:text-4xl font-black mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {APP_CONFIG.founderName}
            </h1>
            <div className={`text-sm font-mono uppercase tracking-widest mb-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
              {APP_CONFIG.tagline} · {APP_CONFIG.studio}
            </div>
            <p className={`text-base leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              7+ years building games that people actually play — from 100K+ download mobile titles to
              live Fortnite islands, AR educational apps, and WebGL instant-play games. Based in Chennai,
              India. Currently shipping UEFN experiences at Visceral Technology.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${APP_CONFIG.contactEmail}`}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold text-white clip-path-polygon transition-all hover:-translate-y-0.5 ${
                  isDark ? 'bg-[#5500EE] hover:bg-[#6611FF] shadow-[0_0_12px_rgba(85,0,238,0.45)]' : 'bg-[#5500CC] hover:bg-[#6611DD]'
                }`}
              >
                Work With Me
              </a>
              <a
                href="/Bhuvanesh_Resume.pdf"
                download
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                  isDark ? 'border-gray-700 text-gray-300 hover:border-purple-500 hover:text-white' : 'border-gray-300 text-gray-700 hover:border-[#5500CC] hover:text-[#5500CC]'
                }`}
              >
                <Download size={14} /> Resume
              </a>
              <a href={APP_CONFIG.socials.linkedin} target="_blank" rel="noreferrer"
                className={`p-2 rounded-lg border transition-colors ${isDark ? 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-500' : 'border-gray-300 text-gray-500 hover:text-gray-900'}`}>
                <Linkedin size={16} />
              </a>
              <a href={APP_CONFIG.socials.github} target="_blank" rel="noreferrer"
                className={`p-2 rounded-lg border transition-colors ${isDark ? 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-500' : 'border-gray-300 text-gray-500 hover:text-gray-900'}`}>
                <Github size={16} />
              </a>
              <a href={APP_CONFIG.socials.portfolio} target="_blank" rel="noreferrer"
                className={`p-2 rounded-lg border transition-colors ${isDark ? 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-500' : 'border-gray-300 text-gray-500 hover:text-gray-900'}`}>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ── SKILLS ── */}
      <Section label="Skills & Stack" isDark={isDark}>
        <h2 className={`text-2xl font-black mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>What I Work With</h2>
        <div className="space-y-6">
          {skillGroups.map(({ label, items }) => (
            <div key={label}>
              <div className={`text-xs font-mono uppercase tracking-widest mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {label}
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map(item => <SkillPill key={item} label={item} isDark={isDark} />)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── TIMELINE ── */}
      <Section label="Career Timeline" isDark={isDark}>
        <h2 className={`text-2xl font-black mb-10 ${isDark ? 'text-white' : 'text-gray-900'}`}>Journey So Far</h2>
        <div>
          {TIMELINE_DATA.map((item, i) => (
            <TimelineItem
              key={item.year}
              {...item}
              isDark={isDark}
              isLast={i === TIMELINE_DATA.length - 1}
            />
          ))}
        </div>
      </Section>

    </div>
  );
};

export default AboutPage;
