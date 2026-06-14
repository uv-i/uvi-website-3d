import { useRef, useEffect } from 'react';

/**
 * Magnetic hover effect — the element drifts toward the cursor while hovered
 * and springs back when the cursor leaves.
 *
 * Also writes --gx / --gy CSS custom properties onto the element so child
 * elements can render a cursor-tracking glow without extra JS.
 *
 * @param {number} strength  How far the element drifts (0 = none, 1 = full offset)
 * @returns {React.RefObject}  Attach to the element you want to magnetise
 */
export function useMagnetic(strength = 0.24) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const r  = el.getBoundingClientRect();
      const cx = e.clientX - r.left  - r.width  / 2;
      const cy = e.clientY - r.top   - r.height / 2;
      el.style.transition = 'transform 80ms ease-out';
      el.style.transform  = `translate(${cx * strength}px, ${cy * strength}px)`;
      el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width)  * 100}%`);
      el.style.setProperty('--gy', `${((e.clientY - r.top)  / r.height) * 100}%`);
    };

    const onLeave = () => {
      el.style.transition = 'transform 650ms cubic-bezier(0.25, 1, 0.5, 1)';
      el.style.transform  = 'translate(0, 0)';
    };

    el.addEventListener('mousemove',  onMove,  { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove',  onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return ref;
}
