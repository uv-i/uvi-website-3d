import React from 'react';
import { ExternalLink, Gamepad2, MapPin, Smartphone, Globe, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Reusable link button
const LinkBtn = ({ href, label, icon: Icon, isDark }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border transition-colors ${
      isDark
        ? 'border-orange-800 text-orange-400 hover:bg-orange-900/20 hover:border-orange-500'
        : 'border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400'
    }`}
  >
    <Icon size={12} /> {label}
  </a>
);

const ProjectCard = ({ project, variant = 'indie' }) => {
  const { isDark } = useTheme();
  const isIndie = variant === 'indie';

  // Build link list from project data
  const links = [
    project.link && { label: 'Play / View', href: project.link, icon: Globe },
    project.androidLink && { label: 'Android', href: project.androidLink, icon: Smartphone },
    project.iosLink && { label: 'iOS', href: project.iosLink, icon: Smartphone },
  ].filter(Boolean);

  // Image or styled placeholder
  const ImageArea = () => (
    <div className={`relative overflow-hidden ${isIndie ? 'h-48' : 'md:w-2/5 h-48 md:h-auto'} bg-gradient-to-br ${isDark ? 'from-gray-900 to-[#0e0e1a]' : 'from-gray-100 to-gray-50'} flex items-center justify-center`}>
      {project.image ? (
        <img
          src={project.image}
          alt={project.title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isIndie ? 'opacity-60 group-hover:opacity-40' : 'opacity-60'}`}
        />
      ) : (
        // Placeholder when no image is set
        <div className="w-full h-full flex flex-col items-center justify-center select-none p-4 text-center relative">
          <div className={`text-5xl font-black opacity-10 ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>
            {project.title.charAt(0)}
          </div>
          <div className={`text-[10px] font-mono absolute bottom-2 right-3 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>
            [ Add Screenshot ]
          </div>
        </div>
      )}

      {/* Status badge */}
      <span className={`absolute top-2 right-2 px-2 py-0.5 border rounded text-[10px] font-mono uppercase z-10 ${
        /live|downloads/i.test(project.status)
          ? (isDark ? 'bg-black/80 border-green-500/50 text-green-400' : 'bg-white/90 border-green-400 text-green-700')
          : /unreleased/i.test(project.status)
            ? (isDark ? 'bg-black/80 border-gray-600 text-gray-400' : 'bg-white/90 border-gray-400 text-gray-500')
            : (isDark ? 'bg-black/80 border-orange-500/50 text-orange-400' : 'bg-white/90 border-orange-300 text-orange-600')
      }`}>
        {project.status}
      </span>

      {/* Fortnite map code badge */}
      {project.mapCode && (
        <div className={`absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded ${isDark ? 'bg-black/70 text-orange-400' : 'bg-white/80 text-orange-600'}`}>
          <MapPin size={10} /> {project.mapCode}
        </div>
      )}

      {/* Hover play overlay for indie tab */}
      {isIndie && links.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a href={links[0].href} target="_blank" rel="noreferrer"
            className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/30 hover:bg-white/20 transition-all transform hover:scale-110"
            aria-label="Open project">
            <ExternalLink className="text-white" size={28} />
          </a>
        </div>
      )}
    </div>
  );

  // ── INDIE / CURRENT variant ─────────────────────────────────────────────────
  if (isIndie) {
    return (
      <article className={`group relative border rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
        isDark
          ? 'bg-gray-900 border-orange-500/20 hover:border-orange-500 hover:shadow-[0_0_30px_rgba(234,88,12,0.15)]'
          : 'bg-white border-gray-200 hover:border-orange-400 shadow-md hover:shadow-xl'
      }`}>
        {/* Top accent on hover */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-600 via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

        <ImageArea />

        <div className="p-6 flex-1 flex flex-col">
          <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
            {project.genre}
          </div>
          <h3 className={`text-xl font-bold mb-1 transition-colors ${isDark ? 'text-white group-hover:text-orange-400' : 'text-gray-900 group-hover:text-orange-600'}`}>
            {project.title}
          </h3>
          <p className={`text-xs font-mono mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            {project.studio} · {project.year}
          </p>
          <p className={`mb-4 flex-1 text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {project.description}
          </p>
          <div className="flex gap-2 mb-5 flex-wrap">
            {project.tags.map((tag, i) => (
              <span key={i} className={`px-2 py-0.5 rounded text-xs font-mono ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                #{tag}
              </span>
            ))}
          </div>

          {links.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-auto">
              {links.map(l => <LinkBtn key={l.label} {...l} isDark={isDark} />)}
            </div>
          ) : (
            <div className={`flex items-center gap-1.5 text-xs font-mono mt-auto ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              <Lock size={11} /> Unreleased / Private
            </div>
          )}
        </div>
      </article>
    );
  }

  // ── PORTFOLIO / PAST WORK variant ──────────────────────────────────────────
  return (
    <article className={`group relative border rounded-xl overflow-hidden transition-all duration-300 flex flex-col md:flex-row ${
      isDark
        ? 'bg-gray-900 border-gray-700 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]'
        : 'bg-white border-gray-200 shadow-md hover:border-amber-400 hover:shadow-xl'
    }`}>
      <ImageArea />

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
            {project.studio}
          </span>
          <h3 className={`text-xl font-bold mt-0.5 mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {project.title}
          </h3>
          <p className={`text-xs font-mono mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {project.genre} · {project.year}
          </p>
          <div className={`border-l-2 pl-4 mb-4 ${isDark ? 'border-orange-800' : 'border-orange-200'}`}>
            <p className={`text-xs font-mono mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>My Role / Contributions:</p>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{project.description}</p>
          </div>
          {project.highlights && (
            <ul className="space-y-1 mb-4">
              {project.highlights.map((h, i) => (
                <li key={i} className={`text-xs flex items-start gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="text-orange-500 mt-0.5 flex-shrink-0">›</span>{h}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag, i) => (
              <span key={i} className={`px-2 py-0.5 rounded text-xs border font-mono ${isDark ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                #{tag}
              </span>
            ))}
          </div>

          {links.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {links.map(l => <LinkBtn key={l.label} {...l} isDark={isDark} />)}
            </div>
          ) : (
            <div className={`flex items-center gap-1.5 text-xs font-mono ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              <Lock size={11} /> Unreleased / Private
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
