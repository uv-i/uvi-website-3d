import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Three-layer depth particle field with cursor-driven parallax.
 *
 * Layer 0 — deep / far: tiny, dim, barely shifts with cursor
 * Layer 1 — mid:        medium, moderate parallax & attraction
 * Layer 2 — near / front: glowing, full parallax, reaches toward cursor
 *
 * Also publishes --px / --py CSS custom properties on :root so any
 * element on the page can layer its own parallax via inline style:
 *   style={{ transform: 'translate3d(calc(var(--px,0)*15px), calc(var(--py,0)*10px), 0)' }}
 */
export default function ParticleField() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect accessibility preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const isMobile = window.innerWidth < 768;
    const root = document.documentElement;

    let W = 0, H = 0, raf;
    let particles = [], layers = [[], [], []];

    // ── Layer config ──────────────────────────────────────────────────────────
    // count, size, opacity, parallax strength, attract strength, drift amplitude
    const CFGS = [
      { id: 0, n: isMobile ? 10 : 20, szMn: 0.5,  szMx: 1.2,  opMn: 0.05, opMx: 0.18, px: 0.014, att: 0.0003, dA: 10 },
      { id: 1, n: isMobile ? 14 : 26, szMn: 0.9,  szMx: 2.0,  opMn: 0.12, opMx: 0.30, px: 0.040, att: 0.0011, dA: 20 },
      { id: 2, n: isMobile ?  5 :  9, szMn: 1.8,  szMx: 3.2,  opMn: 0.26, opMx: 0.54, px: 0.088, att: 0.0022, dA: 28 },
    ];

    // ── Mouse state (never touches React) ────────────────────────────────────
    const m = { x: 0, y: 0, sx: 0, sy: 0, nx: 0, ny: 0, snx: 0, sny: 0, on: false };
    const LM  = 0.068;  // mouse lerp speed
    const LN  = 0.036;  // normalised cursor lerp (lag = more parallax feel)

    // ── Particle ──────────────────────────────────────────────────────────────
    class P {
      constructor(cfg) {
        this.c = cfg;
        this.bx = Math.random() * W;
        this.by = Math.random() * H;
        this.x  = this.bx;
        this.y  = this.by;
        this.vx = 0;
        this.vy = 0;
        this.sz  = cfg.szMn + Math.random() * (cfg.szMx - cfg.szMn);
        this.op  = cfg.opMn + Math.random() * (cfg.opMx - cfg.opMn);
        this.ang = Math.random() * Math.PI * 2;
        this.asp = (Math.random() - 0.5) * 0.0011 * (1 + cfg.id * 0.4);
        this.phi = Math.random() * Math.PI * 2;  // phase for y drift
      }

      update() {
        // Organic float (Lissajous-like orbit around base position)
        this.ang += this.asp;
        const dx = Math.cos(this.ang)                       * this.c.dA * 0.013;
        const dy = Math.sin(this.ang * 1.41 + this.phi)    * this.c.dA * 0.013;

        // Global parallax: each layer shifts at a different rate
        const pox = m.snx * W * this.c.px;
        const poy = m.sny * H * this.c.px;

        // Target = base + drift + parallax
        const tx = this.bx + dx + pox;
        const ty = this.by + dy + poy;

        // Local cursor attraction (within 220 px)
        if (m.on) {
          const cdx = m.sx - tx;
          const cdy = m.sy - ty;
          const d2  = cdx * cdx + cdy * cdy;
          const r2  = 220 * 220;
          if (d2 < r2) {
            const f = (1 - d2 / r2) * this.c.att * 55;
            this.vx += cdx * f;
            this.vy += cdy * f;
          }
        }

        // Spring toward target + damping
        this.vx += (tx - this.x) * 0.038;
        this.vy += (ty - this.y) * 0.038;
        this.vx *= 0.87;
        this.vy *= 0.87;
        this.x  += this.vx;
        this.y  += this.vy;
      }

      draw() {
        // Layer 2 gets a soft radial glow halo
        if (this.c.id === 2) {
          const r  = this.sz * 5;
          const gr = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
          gr.addColorStop(0, isDark
            ? `rgba(190,130,255,${this.op * 0.6})`
            : `rgba(100,40,200,${this.op * 0.4})`);
          gr.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
          ctx.fillStyle = gr;
          ctx.fill();
        }

        const clrs = isDark
          ? ['rgba(110,65,210,', 'rgba(148,95,255,', 'rgba(200,145,255,']
          : ['rgba(55,0,140,',   'rgba(70,0,170,',   'rgba(95,30,195,' ];
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
        ctx.fillStyle = clrs[this.c.id] + this.op + ')';
        ctx.fill();
      }
    }

    // ── Connections ───────────────────────────────────────────────────────────
    const MAX_D = [80, 110, 75];   // per-layer max connection distance

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          if (Math.abs(a.c.id - b.c.id) > 1) continue;
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          const md = MAX_D[Math.max(a.c.id, b.c.id)];
          if (d2 > md * md) continue;
          const t     = 1 - Math.sqrt(d2) / md;
          const avgOp = (a.op + b.op) * 0.5;
          const alpha = t * t * avgOp * (isDark ? 0.38 : 0.22);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = isDark
            ? `rgba(145,85,255,${alpha})`
            : `rgba(75,0,175,${alpha})`;
          ctx.lineWidth = t * 0.65;
          ctx.stroke();
        }
      }
    };

    // ── Main loop ─────────────────────────────────────────────────────────────
    const tick = () => {
      // Smooth mouse position
      m.sx += (m.x - m.sx) * LM;
      m.sy += (m.y - m.sy) * LM;

      // Normalised cursor (-1…1) with extra lag for dreamy parallax feel
      const nx = (m.x / W - 0.5) * 2;
      const ny = (m.y / H - 0.5) * 2;
      m.snx += (nx - m.snx) * LN;
      m.sny += (ny - m.sny) * LN;

      // Publish CSS vars — no React re-render, pure CSS engine update
      root.style.setProperty('--px', m.snx.toFixed(4));
      root.style.setProperty('--py', m.sny.toFixed(4));

      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => p.update());
      drawConnections();
      // Back-to-front so near particles render on top
      layers[0].forEach(p => p.draw());
      layers[1].forEach(p => p.draw());
      layers[2].forEach(p => p.draw());

      raf = requestAnimationFrame(tick);
    };

    const init = () => {
      particles = CFGS.flatMap(cfg => Array.from({ length: cfg.n }, () => new P(cfg)));
      layers = [
        particles.filter(p => p.c.id === 0),
        particles.filter(p => p.c.id === 1),
        particles.filter(p => p.c.id === 2),
      ];
    };

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
      init();
    };

    const onMove  = e => { m.x = e.clientX; m.y = e.clientY; m.on = true; };
    const onLeave = ()  => { m.on = false; };

    resize();
    tick();
    window.addEventListener('mousemove',   onMove,   { passive: true });
    window.addEventListener('resize',      resize,   { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove',   onMove);
      window.removeEventListener('resize',      resize);
      document.removeEventListener('mouseleave', onLeave);
      root.style.removeProperty('--px');
      root.style.removeProperty('--py');
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, mixBlendMode: isDark ? 'screen' : 'multiply' }}
    />
  );
}
