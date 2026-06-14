import { ArrowRight, Sparkles, Code2, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';

const ExploreIn3DButton = ({ onClick, isDark }) => (
  <div className="mt-10 flex justify-center animate-[fadeIn_1s_ease-out_0.6s_both]">
    <button
      onClick={onClick}
      className={`group relative px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 border shadow-lg hover:-translate-y-1 hover:shadow-2xl flex items-center gap-2 ${
        isDark
          ? 'bg-gradient-to-r from-purple-900/60 to-orange-900/50 border-purple-500/50 text-white shadow-purple-950/40 hover:border-orange-400'
          : 'bg-gradient-to-r from-[#5500CC] to-fuchsia-600 border-[#5500CC]/35 text-white shadow-purple-100 hover:shadow-purple-300'
      }`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-fuchsia-500 to-purple-600 opacity-0 group-hover:opacity-25 transition-opacity duration-500" />
      <span className="absolute inset-0 rounded-full border border-current opacity-25 animate-ping group-hover:animate-none" style={{ animationDuration: '3s' }} />
      <Sparkles size={16} className="text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
      Explore Studio in 3D
      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

const HeroSection = ({ isDark, isMobile, onActivate3D }) => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background grid + blobs */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-[linear-gradient(to_right,#16083030_1px,transparent_1px),linear-gradient(to_bottom,#16083030_1px,transparent_1px)]'
              : 'bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)]'
          } bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]`}
        />
        <div className={`absolute top-0 left-0 right-0 h-[600px] ${isDark ? 'bg-purple-900/12' : 'bg-orange-100/40'} blur-[120px] rounded-full`} />
        <div className={`absolute top-0 right-[-10%] w-[400px] h-[400px] ${isDark ? 'bg-[#5500EE]/6' : 'bg-amber-100/30'} blur-[100px] rounded-full`} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className={`inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border text-xs font-mono ${
          isDark ? 'border-purple-500/30 bg-purple-900/15 text-purple-300' : 'border-[#5500CC]/30 bg-purple-50 text-[#5500CC]'
        }`}>
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          OPEN FOR PROJECTS · CHENNAI, INDIA
        </div>

        <h1 className={`text-5xl sm:text-7xl md:text-[96px] font-black mb-4 tracking-tighter leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
          WE BUILD
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5500EE] via-fuchsia-400 to-orange-500">
            GAMES
          </span>
        </h1>

        <p className={`text-lg sm:text-xl md:text-2xl mb-5 font-light tracking-wide ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Mobile · WebGL · Fortnite · 8+ Years Shipping
        </p>
        <p className={`text-base sm:text-lg mb-3 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          We ship games that reach players across every platform — and we believe our growth only means something when the builders around us grow too.
        </p>
        <p className={`text-sm mb-10 max-w-xl mx-auto font-medium ${isDark ? 'text-orange-400/80' : 'text-orange-600'}`}>
          Our tutorials, packages, and tools are free and open — because a rising tide lifts all builders.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/games')} icon={Gamepad2}>See Our Games</Button>
          <Button variant="secondary" onClick={() => navigate('/contact')} icon={ArrowRight}>Start a Project</Button>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => navigate('/lab')}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors underline underline-offset-4 decoration-dashed ${
              isDark ? 'text-purple-400 hover:text-orange-400 decoration-purple-600' : 'text-[#5500CC] hover:text-orange-600 decoration-[#5500CC]/40'
            }`}
          >
            <Code2 size={14} />
            Explore free game dev resources
          </button>
        </div>

        {!isMobile && <ExploreIn3DButton onClick={onActivate3D} isDark={isDark} />}
      </div>
    </section>
  );
};

export default HeroSection;
