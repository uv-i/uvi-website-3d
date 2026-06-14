import { useRef, useEffect } from 'react';

/**
 * 3-D logo tilt — rotates the element toward the cursor using CSS perspective,
 * with preserve-3d so child elements at different translateZ depths pop forward
 * at different rates, creating a parallax card effect.
 *
 * @param {number} maxDeg  Maximum rotation in degrees (default 15°)
 * @returns {React.RefObject}  Attach to the element you want to tilt
 */
export function useLogoTilt(maxDeg = 15) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transformStyle = 'preserve-3d';

    const onMove = (e) => {
      const r  = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width  - 0.5;
      const py = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transition = 'transform 80ms ease-out';
      el.style.transform  =
        `perspective(480px) rotateX(${-py * maxDeg}deg) rotateY(${px * maxDeg}deg) scale(1.06)`;
    };

    const onLeave = () => {
      el.style.transition = 'transform 650ms cubic-bezier(0.25, 1, 0.5, 1)';
      el.style.transform  = 'perspective(480px) rotateX(0deg) rotateY(0deg) scale(1)';
    };

    el.addEventListener('mousemove',  onMove,  { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove',  onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [maxDeg]);

  return ref;
}
