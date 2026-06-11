import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const SectionHeader = ({ title, subtitle }) => {
  const { isDark } = useTheme();
  return (
    <header className="mb-12 text-center">
      <h2 className={`text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r tracking-tight uppercase
        ${isDark
          ? 'from-purple-400 via-fuchsia-300 to-orange-400'
          : 'from-[#5500CC] via-purple-600 to-orange-500'
        }`}>
        {title}
      </h2>
      <div className={`h-[2px] w-20 mx-auto mt-4 bg-gradient-to-r from-transparent ${isDark ? 'via-purple-500' : 'via-[#5500CC]'} to-transparent`} />
      {subtitle && (
        <p className={`mt-4 max-w-2xl mx-auto px-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
    </header>
  );
};

export default SectionHeader;
