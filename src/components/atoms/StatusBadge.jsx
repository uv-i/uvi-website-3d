import React from 'react';

/**
 * Small monospaced status badge.
 * Colour is derived from the status string:
 *  - contains "live" or "downloads" → green
 *  - contains "development"         → amber
 *  - anything else                  → neutral gray
 */
const StatusBadge = ({ status, isDark }) => {
  const isLive  = /live|downloads/i.test(status);
  const isInDev = /development/i.test(status);

  return (
    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
      isLive
        ? isDark
          ? 'border-green-700 text-green-400 bg-green-900/20'
          : 'border-green-400 text-green-700 bg-green-50'
        : isInDev
          ? isDark
            ? 'border-amber-700 text-amber-400 bg-amber-900/10'
            : 'border-amber-400 text-amber-700 bg-amber-50'
          : isDark
            ? 'border-gray-700 text-gray-400'
            : 'border-gray-400 text-gray-500'
    }`}>
      {status}
    </span>
  );
};

export default StatusBadge;
