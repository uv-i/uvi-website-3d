const PLATFORMS = ['Unity', 'UEFN · Verse', 'WebGL', 'Firebase', 'iOS', 'Android', 'AR Foundation'];

const PlatformStrip = ({ isDark }) => (
  <div className="flex flex-wrap gap-2 justify-center items-center">
    {PLATFORMS.map((p) => (
      <span
        key={p}
        className={`text-[11px] font-mono px-3 py-1 rounded-full border ${
          isDark
            ? 'border-purple-800/50 text-gray-400 bg-purple-950/20'
            : 'border-purple-100 text-gray-500 bg-purple-50/60'
        }`}
      >
        {p}
      </span>
    ))}
  </div>
);

export default PlatformStrip;
