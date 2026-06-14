import { Github, ArrowRight } from 'lucide-react';

const OpenSourceBanner = ({ isDark }) => (
  <a
    href="https://github.com/uv-interactives"
    target="_blank"
    rel="noreferrer"
    className={`group flex items-center justify-between gap-4 px-6 py-4 rounded-2xl border transition-all duration-300 max-w-3xl mx-auto ${
      isDark
        ? 'bg-[#0d0b18] border-purple-900/40 hover:border-purple-500/60 hover:shadow-[0_0_24px_rgba(136,85,255,0.12)]'
        : 'bg-white border-purple-100 shadow-sm hover:border-[#5500CC]/40 hover:shadow-md'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isDark ? 'bg-purple-900/40' : 'bg-purple-50'
      }`}>
        <Github size={20} className={isDark ? 'text-purple-300' : 'text-[#5500CC]'} />
      </div>
      <div>
        <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Open source by default
        </p>
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Every tutorial, tool, and package we build is freely available on GitHub — no paywalls, no signups.
        </p>
      </div>
    </div>
    <div className={`flex-shrink-0 flex items-center gap-1 text-xs font-mono font-bold transition-colors ${
      isDark ? 'text-purple-400 group-hover:text-orange-400' : 'text-[#5500CC] group-hover:text-orange-600'
    }`}>
      uv-interactives <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
    </div>
  </a>
);

export default OpenSourceBanner;
