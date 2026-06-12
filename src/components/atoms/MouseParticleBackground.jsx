import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * A highly optimized Canvas-based background animation that renders nodes
 * and links that drift and react directly to mouse cursor position (repulsion effect).
 */
export default function MouseParticleBackground() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();
  const mouseRef = useRef({ x: null, y: null, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    
    // Adapt particle count to device screens
    const particleCount = window.innerWidth < 768 ? 16 : 50;
    const connectionDistance = 120;
    const repelRadius = 140;
    const returnForce = 0.025; // Pull back strength
    const friction = 0.88;     // Damping force

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.originalX = this.x;
        this.originalY = this.y;
        this.vx = 0;
        this.vy = 0;
        this.size = Math.random() * 1.5 + 0.8;
      }

      update() {
        // Return home force
        const dxHome = this.originalX - this.x;
        const dyHome = this.originalY - this.y;
        this.vx += dxHome * returnForce;
        this.vy += dyHome * returnForce;

        // Repelled by mouse cursor
        if (mouseRef.current.active && mouseRef.current.x !== null) {
          const dxMouse = this.x - mouseRef.current.x;
          const dyMouse = this.y - mouseRef.current.y;
          const dist = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          
          if (dist < repelRadius) {
            const force = (repelRadius - dist) / repelRadius;
            // Push vector
            const pushX = (dxMouse / (dist || 1)) * force * 5.5;
            const pushY = (dyMouse / (dist || 1)) * force * 5.5;
            this.vx += pushX;
            this.vy += pushY;
          }
        }

        // Apply friction & move
        this.vx *= friction;
        this.vy *= friction;
        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(136, 85, 255, 0.25)' : 'rgba(85, 0, 204, 0.12)';
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Adaptive gradient color connecting lines
            ctx.strokeStyle = isDark
              ? `rgba(168, 85, 247, ${alpha})`
              : `rgba(255, 120, 0, ${alpha})`;
            
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      
      drawLines();
      animationFrameId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
    />
  );
}
