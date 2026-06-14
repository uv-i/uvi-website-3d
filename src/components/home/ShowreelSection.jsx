import { Play } from 'lucide-react';

const VideoEmbed = ({ youtubeId, isDark }) => {
  if (youtubeId) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title="UV Interactives Showreel"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }
  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border-2 border-dashed flex flex-col items-center justify-center gap-4 ${
        isDark ? 'bg-[#0d0b18] border-purple-800/50' : 'bg-purple-50/60 border-purple-200'
      }`}
      style={{ aspectRatio: '16/9' }}
    >
      <div className="absolute top-0 left-0 w-48 h-48 bg-purple-600/10 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-500/10 blur-[60px] rounded-full pointer-events-none" />
      <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 ${
        isDark ? 'border-purple-500/60 bg-purple-900/30' : 'border-[#5500CC]/40 bg-purple-100'
      }`}>
        <Play size={24} className={`ml-1 ${isDark ? 'text-purple-300' : 'text-[#5500CC]'}`} fill="currentColor" />
      </div>
      <div className="relative z-10 text-center px-6">
        <p className={`font-black text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Studio Showreel · 30 sec</p>
        <p className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Set <code className={isDark ? 'text-purple-400' : 'text-[#5500CC]'}>showreelYoutubeId</code> in{' '}
          <code className={isDark ? 'text-purple-400' : 'text-[#5500CC]'}>mockData.js → APP_CONFIG</code> to go live
        </p>
      </div>
      <span className={`absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-purple-600' : 'text-purple-300'}`}>
        [ placeholder ]
      </span>
    </div>
  );
};

const ShowreelSection = ({ youtubeId, isDark }) => (
  <section className="max-w-5xl mx-auto px-4">
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className={`text-xs font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
          Studio Showreel
        </div>
        <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>See It In Action</h2>
      </div>
      <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
        isDark ? 'border-orange-700/50 text-orange-400' : 'border-orange-300 text-orange-600'
      }`}>30 sec</span>
    </div>
    <VideoEmbed youtubeId={youtubeId} isDark={isDark} />
  </section>
);

export default ShowreelSection;
