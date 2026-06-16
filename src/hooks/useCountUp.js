import { useState, useEffect, useRef } from 'react';

/**
 * useCountUp — animates a number from 0 to `target` when the returned `ref`
 * scrolls into view.
 *
 * @param {number} target   — final numeric value
 * @param {number} duration — animation duration in ms (default 1400)
 * @returns {{ displayValue: string, ref: React.RefObject }}
 *          displayValue is the formatted string (e.g. "50K+" from "50K+")
 */
export const useCountUp = (rawValue, duration = 1400) => {
  const ref     = useRef(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  // Parse suffix + numeric part from strings like "50K+", "8+", "1", "4+"
  const { num, suffix } = (() => {
    const str = String(rawValue);
    const match = str.match(/^(\d+(?:\.\d+)?)(.*)/);
    if (!match) return { num: null, suffix: str }; // non-numeric (e.g. "♥")
    return { num: parseFloat(match[1]), suffix: match[2] };
  })();

  // Observe when the element enters the viewport
  useEffect(() => {
    if (num === null) return; // nothing to animate
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [num]);

  // Run the counter animation
  useEffect(() => {
    if (!started || num === null) return;
    let startTs = null;

    const step = (ts) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      // Ease-out cubic: fast start → slow finish
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, num, duration]);

  const displayValue = num === null ? rawValue : `${count}${suffix}`;

  return { displayValue, ref };
};
