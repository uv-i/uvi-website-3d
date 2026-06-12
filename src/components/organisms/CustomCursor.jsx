import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState([]);

  const mouseCoords = useRef({ x: 0, y: 0 });
  const ringCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if touch device
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    setIsVisible(true);

    const onMouseMove = (e) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      const interactive = target.closest('button, a, [role="button"], .cursor-pointer, [data-hover-glow], canvas');
      
      if (interactive) {
        setHovered(true);
        const text = interactive.getAttribute('data-cursor-text');
        if (text) {
          setCursorText(text);
        } else if (interactive.tagName === 'CANVAS' || interactive.closest('.interactive-3d')) {
          setCursorText("drag");
        }
      }
    };

    const onMouseOut = (e) => {
      const target = e.target;
      if (!target) return;
      const interactive = target.closest('button, a, [role="button"], .cursor-pointer, [data-hover-glow], canvas');
      
      if (interactive) {
        setHovered(false);
        setCursorText("");
      }
    };

    const onMouseDown = (e) => {
      setClicked(true);
      setTimeout(() => setClicked(false), 300);

      // Spawn click ripple
      const newRipple = {
        id: Math.random(),
        x: e.clientX,
        y: e.clientY
      };
      setRipples(prev => [...prev.slice(-4), newRipple]);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);
    window.addEventListener('mousedown', onMouseDown);

    // Easing loop for trailing ring
    let animationFrameId;
    const updateRing = () => {
      const ease = 0.16; // Easing factor
      ringCoords.current.x += (mouseCoords.current.x - ringCoords.current.x) * ease;
      ringCoords.current.y += (mouseCoords.current.y - ringCoords.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringCoords.current.x}px, ${ringCoords.current.y}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(updateRing);
    };
    updateRing();

    // Hide real cursor on body on desktop
    const style = document.createElement('style');
    style.innerHTML = `
      @media (pointer: fine) {
        body, a, button, [role="button"], .cursor-pointer, input, textarea, select {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('mousedown', onMouseDown);
      cancelAnimationFrame(animationFrameId);
      document.head.removeChild(style);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes ripple-expand {
          0% {
            transform: translate3d(-50%, -50%, 0) scale(0.2);
            opacity: 1;
          }
          100% {
            transform: translate3d(-50%, -50%, 0) scale(2.2);
            opacity: 0;
          }
        }
        .click-ripple {
          position: fixed;
          pointer-events: none;
          z-index: 9997;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid #ff7b00;
          box-shadow: 0 0 10px rgba(255, 123, 0, 0.4), inset 0 0 10px rgba(255, 123, 0, 0.2);
          animation: ripple-expand 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
      `}</style>

      {/* Ripple click animations */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="click-ripple"
          style={{
            left: ripple.x,
            top: ripple.y
          }}
          onAnimationEnd={() => {
            setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
          }}
        />
      ))}

      {/* Small center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-orange-500 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
        style={{ mixBlendMode: 'difference' }}
      />

      {/* Trailing interactive ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border-2 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out flex items-center justify-center ${
          hovered
            ? 'w-14 h-14 bg-[#5500EE]/10 border-orange-400 shadow-[0_0_15px_rgba(255,123,0,0.2)] scale-110'
            : 'w-7 h-7 border-purple-500/50'
        } ${clicked ? 'scale-90 border-orange-500 bg-orange-500/10' : ''}`}
      >
        {cursorText && (
          <span className="text-[7px] font-black font-mono tracking-widest text-orange-400 uppercase select-none">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}
