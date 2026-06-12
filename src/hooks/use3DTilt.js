import { useEffect, useRef } from 'react';

/**
 * Applies a 3D perspective tilt to an element directly via DOM (no React re-renders).
 * Tracks cursor position and writes --glare-x / --glare-y CSS custom properties
 * for child elements to create specular highlight and border-glow effects.
 */
export default function use3DTilt(options = {}) {
  const elementRef = useRef(null);
  const {
    maxRotation = 18,     // degrees — was 10, now more dramatic
    perspective  = 750,   // px — closer = more exaggerated distortion
    scale        = 1.048, // was 1.02
    speed        = 350,   // ms spring-back
  } = options;

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    el.style.willChange = 'transform';
    el.style.transition = `transform ${speed}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    el.style.transform  = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const px   = x / rect.width  - 0.5;  // -0.5 … 0.5
      const py   = y / rect.height - 0.5;

      el.style.transform = `perspective(${perspective}px) rotateX(${-py * maxRotation}deg) rotateY(${px * maxRotation}deg) scale(${scale})`;

      // CSS vars for glare / border tracking
      el.style.setProperty('--glare-x', `${(x / rect.width)  * 100}%`);
      el.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
    };

    const handleMouseEnter = () => {
      // Snap to cursor quickly on enter
      el.style.transition = 'transform 60ms ease-out';
    };

    const handleMouseLeave = () => {
      el.style.transition = `transform ${speed}ms cubic-bezier(0.25, 1, 0.5, 1)`;
      el.style.transform  = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
      el.style.setProperty('--glare-x', '50%');
      el.style.setProperty('--glare-y', '50%');
    };

    el.addEventListener('mousemove',  handleMouseMove,  { passive: true });
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove',  handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxRotation, perspective, scale, speed]);

  return elementRef;
}
