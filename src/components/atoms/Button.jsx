import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, isLoading = false, type = 'button' }) => {
  const { isDark } = useTheme();

  const baseStyle =
    'relative px-6 py-3 font-bold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-1 focus:outline-none clip-path-polygon disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    // Purple — brand identity, primary actions
    primary: isDark
      ? 'bg-[#5500EE] hover:bg-[#6611FF] text-white border border-purple-400/50 shadow-[0_0_18px_rgba(85,0,238,0.5)] hover:shadow-[0_0_28px_rgba(85,0,238,0.8)]'
      : 'bg-[#5500CC] hover:bg-[#6611DD] text-white border border-purple-400/40 shadow-[0_0_14px_rgba(85,0,204,0.35)] hover:shadow-[0_0_22px_rgba(85,0,204,0.6)]',

    // Orange — energy, CTAs, secondary emphasis
    secondary: isDark
      ? 'bg-transparent hover:bg-orange-900/20 text-orange-400 border border-orange-500 shadow-[0_0_10px_rgba(255,140,0,0.15)] hover:shadow-[0_0_20px_rgba(255,140,0,0.35)]'
      : 'bg-transparent hover:bg-orange-50 text-orange-600 border border-orange-500 shadow-sm hover:shadow-md',

    outline: isDark
      ? 'bg-transparent text-white border border-gray-600 hover:bg-white/10'
      : 'bg-transparent text-gray-900 border border-gray-400 hover:bg-black/5',

    // Gold/amber — AI features
    ai: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:shadow-[0_0_25px_rgba(245,158,11,0.8)]',
  };

  return (
    <button type={type} onClick={onClick} disabled={isLoading} className={`${baseStyle} ${variants[variant]} ${className}`}>
      <div className="flex items-center gap-2 justify-center">
        {isLoading ? <RefreshCw className="animate-spin" size={18} /> : Icon && <Icon size={18} />}
        {children}
      </div>
      {/* Corner accent marks — signature UV style */}
      <span className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${
        variant === 'primary' ? 'border-purple-300/50' : variant === 'secondary' ? 'border-orange-400/50' : 'border-white/30'
      }`} />
      <span className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${
        variant === 'primary' ? 'border-purple-300/50' : variant === 'secondary' ? 'border-orange-400/50' : 'border-white/30'
      }`} />
    </button>
  );
};

export default Button;
