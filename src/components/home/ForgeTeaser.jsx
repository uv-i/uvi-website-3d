import { BookOpen } from 'lucide-react';
import { FORGE_POSTS } from '../../data/mockData';

const ForgeTeaser = ({ isDark }) => (
  <section className="max-w-5xl mx-auto px-4 pb-20">
    <div className="flex items-center justify-between mb-8">
      <div>
        <div className={`text-xs font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
          From the Forge
        </div>
        <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Game dev, written down
        </h2>
      </div>
      <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
        isDark ? 'border-purple-800/50 text-purple-400' : 'border-purple-200 text-[#5500CC]'
      }`}>Coming soon</span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {FORGE_POSTS.map((post) => (
        <div
          key={post.slug}
          className={`relative rounded-2xl border p-5 flex flex-col gap-3 select-none ${
            isDark ? 'bg-[#0d0b18] border-purple-900/30' : 'bg-white border-purple-100 shadow-sm'
          }`}
        >
          {/* Coming-soon frosted overlay */}
          <div className={`absolute inset-0 rounded-2xl backdrop-blur-[2px] flex items-center justify-center z-10 ${
            isDark ? 'bg-[#0d0b18]/60' : 'bg-white/60'
          }`}>
            <span className={`text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border ${
              isDark ? 'border-purple-700 text-purple-400' : 'border-purple-300 text-[#5500CC]'
            }`}>Coming soon</span>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen size={14} className={isDark ? 'text-orange-400' : 'text-orange-500'} />
            <span className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
              {post.tag}
            </span>
            <span className={`ml-auto text-[10px] font-mono ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              {post.mins} min read
            </span>
          </div>
          <h3 className={`text-sm font-bold leading-snug ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {post.title}
          </h3>
        </div>
      ))}
    </div>
  </section>
);

export default ForgeTeaser;
