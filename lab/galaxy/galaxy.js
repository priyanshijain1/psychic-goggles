// Create Galaxy Background
(function() {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas) {
    console.error('Galaxy canvas not found!');
    return;
  }

  const ctx = canvas.getContext('2d');

  // Configuration
  const options = {
    starCount: 520,
    coreGlow: true,
    respectReducedMotion: true
  };

  // Detect prefers-reduced-motion
  const PREFERS_REDUCE = options.respectReducedMotion &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let DPR = Math.max(1, window.devicePixelRatio || 1);
  let WIDTH = 0, HEIGHT = 0;
  let bgCanvas = null, bgCtx = null;
  let stars = [];
  let raf = null;
  let last = 0;

  // Warp (click) parameters
  const WARP_DURATION = 26;
  const WARP_RADIUS = 160;
  const WARP_MULT = 3.4;
  let warpFrames = 0;

  // Resize & DPR handling
  function fit() {
    DPR = Math.max(1, window.devicePixelRatio || 1);
    WIDTH = Math.floor(window.innerWidth * DPR);
    HEIGHT = Math.floor(window.innerHeight * DPR);

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    createOffscreen();
    initStars();
  }

  // Create offscreen canvas for static layers
  function createOffscreen() {
    bgCanvas = document.createElement('canvas');
    bgCanvas.width = WIDTH;
    bgCanvas.height = HEIGHT;
    bgCtx = bgCanvas.getContext('2d');

    const w = WIDTH / DPR;
    const h = HEIGHT / DPR;
    const cx = w / 2;
    const cy = h / 2;
    const big = Math.max(w, h) * 0.8;

    // Base radial gradient
    const g = bgCtx.createRadialGradient(cx, cy, big * 0.02, cx, cy, big);
    g.addColorStop(0, 'rgba(12,10,20,0.18)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    bgCtx.fillStyle = g;
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    if (options.coreGlow) {
      // Galactic core warm glow
      const core = bgCtx.createRadialGradient(cx, cy, 0, cx, cy, big * 0.45);
      core.addColorStop(0, 'rgba(255,245,220,0.12)');
      core.addColorStop(0.25, 'rgba(255,240,200,0.06)');
      core.addColorStop(1, 'rgba(0,0,0,0)');
      bgCtx.fillStyle = core;
      bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    }

    // Faint static stars layer
    const bgStars = Math.floor(options.starCount * 0.14);
    for (let i = 0; i < bgStars; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 0.9 + 0.2;
      const a = Math.random() * 0.35 + 0.05;
      bgCtx.beginPath();
      bgCtx.fillStyle = `rgba(255,255,255,${a})`;
      bgCtx.arc(x, y, r, 0, Math.PI * 2);
      bgCtx.fill();
    }
  }

  // Initialize moving stars
  function initStars() {
    stars.length = 0;
    const w = WIDTH / DPR;
    const h = HEIGHT / DPR;
    const cx = w / 2;
    const cy = h / 2;
    for (let i = 0; i < options.starCount; i++) {
      const r = Math.pow(Math.random(), 1.6) * Math.max(w, h) * 0.45;
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.0004 + Math.random() * 0.002) * (0.6 + r / Math.max(w, h));
      const drift = (Math.random() * 0.045 + 0.01);
      const tw = Math.random() * 0.9 + 0.2;
      stars.push({ r, angle, speed, drift, tw, cx, cy });
    }
  }

  // Click warp effect
  function onClick(e) {
    if (PREFERS_REDUCE) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (let s of stars) {
      const x = s.cx + Math.cos(s.angle) * s.r;
      const y = s.cy + Math.sin(s.angle) * s.r;
      const d = Math.hypot(x - clickX, y - clickY);
      if (d < WARP_RADIUS) {
        s._warp = (s._warp || 1) * (1 + (WARP_MULT - 1) * (1 - d / WARP_RADIUS));
      }
    }
    warpFrames = WARP_DURATION;
  }

  // Animation loop
  function loop(now) {
    raf = requestAnimationFrame(loop);

    if (PREFERS_REDUCE) {
      ctx.clearRect(0, 0, WIDTH / DPR, HEIGHT / DPR);
      if (bgCanvas) ctx.drawImage(bgCanvas, 0, 0);
      for (let s of stars) {
        const x = s.cx + Math.cos(s.angle) * s.r;
        const y = s.cy + Math.sin(s.angle) * s.r;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0.06, s.tw * 0.8)})`;
        ctx.arc(x, y, 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    const dt = Math.min(4, (now - last) / 16.6667);
    last = now;

    ctx.clearRect(0, 0, WIDTH / DPR, HEIGHT / DPR);
    if (bgCanvas) ctx.drawImage(bgCanvas, 0, 0);

    const maxR = Math.max(WIDTH / DPR, HEIGHT / DPR) * 0.6;

    // Update and render each star
    for (let s of stars) {
      const warpFactor = s._warp || 1;
      s.angle += s.speed * warpFactor * dt;
      s.r += s.drift * 0.02 * dt;
      if (s.r > maxR) s.r *= 0.62;

      if (s._warp) {
        s._warp = 1 + (s._warp - 1) * 0.92;
        if (s._warp < 1.02) s._warp = undefined;
      }

      const x = s.cx + Math.cos(s.angle) * s.r;
      const y = s.cy + Math.sin(s.angle) * s.r;

      s.tw += (Math.random() - 0.5) * 0.04 * dt;
      const alpha = Math.max(0.05, Math.min(1, s.tw));
      const size = 0.25 + (s.r / maxR) * 1.6;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    if (warpFrames > 0) warpFrames--;
  }

  // Start animation
  function start() {
    fit();
    window.addEventListener('resize', fit);
    canvas.addEventListener('click', onClick);
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }

  // Auto-start when script loads
  start();
})();
