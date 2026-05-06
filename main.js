/* ═══════════════════════════════════════════════════════════
   main.js  —  For Jigyasa, from Vayun  💕
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── CONFIG ──────────────────────────────────────────────── */
// Add your 3 photo paths here (relative URLs for GitHub Pages).
// e.g. "photos/1.jpg"  or a full https URL.
// If a path is empty / fails to load, a pretty gradient placeholder is shown.
const PHOTOS = [
  'photo1.jpg',
  'photo2.jpg',
  'photo3.jpg',
];

const TYPEWRITER_MESSAGE = `Hey Jigyasa,

I don't really know how to put this into words —
but you make every ordinary moment feel like magic.

The way you laugh, the way you care,
the way you make the whole world feel softer…
I notice all of it.

You are the reason I believe
that some things in this universe are perfectly designed.

And I want you to know —
every single star up there has been watching over you,
because even the universe knows
you deserve nothing less than infinite love.

You mean everything to me. ♥`;

/* ─── GLOBALS ─────────────────────────────────────────────── */
let currentSlide = 1;
const slides = {
  1: document.getElementById('slide1'),
  2: document.getElementById('slide2'),
  3: document.getElementById('slide3'),
};
const audio = document.getElementById('bgMusic');

/* ══════════════════════════════════════════════════════════
   ① SHARED STARFIELD CANVAS
══════════════════════════════════════════════════════════ */
(function initStarfield() {
  const canvas = document.getElementById('starCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createStars(n = 220) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x:   Math.random() * W,
        y:   Math.random() * H,
        r:   Math.random() * 1.4 + 0.3,
        a:   Math.random(),
        da:  (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
        vx:  (Math.random() - 0.5) * 0.08,
        vy:  (Math.random() - 0.5) * 0.08,
        hue: Math.random() < 0.3 ? 330 : 0,  // pink tinge on some
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.x += s.vx; s.y += s.vy; s.a += s.da;
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
      if (s.a < 0.1 || s.a > 1) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.hue
        ? `hsla(${s.hue},100%,85%,${s.a})`
        : `rgba(255,240,248,${s.a})`;
      ctx.fill();
    }
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', () => { resize(); createStars(); });
  resize(); createStars(); drawStars();
})();

/* ══════════════════════════════════════════════════════════
   ② FLOATING PETALS (slide 1)
══════════════════════════════════════════════════════════ */
(function spawnPetals() {
  const container = document.getElementById('petals');
  const symbols   = ['♥', '❤', '✿', '✦', '·'];

  function makePetal() {
    const el = document.createElement('span');
    el.className = 'petal';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const size  = Math.random() * 1 + 0.6;
    const left  = Math.random() * 100;
    const dur   = Math.random() * 12 + 10;
    const delay = Math.random() * 15;
    el.style.cssText = `
      left:${left}%;
      font-size:${size}rem;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      opacity:0;
    `;
    container.appendChild(el);
    // recycle
    setTimeout(() => { el.remove(); makePetal(); }, (dur + delay) * 1000);
  }

  for (let i = 0; i < 40; i++) makePetal();
})();

/* ══════════════════════════════════════════════════════════
   ③ SLIDE TRANSITIONS
══════════════════════════════════════════════════════════ */
function goToSlide(n) {
  const from = slides[currentSlide];
  const to   = slides[n];
  if (!to || n === currentSlide) return;

  from.classList.remove('active');
  from.classList.add('exit');
  setTimeout(() => from.classList.remove('exit'), 1300);

  to.classList.add('active');
  currentSlide = n;

  if (n === 2) initHeartPhotos();
  if (n === 3) { initNameCanvas(); startTypewriter(); }
}

/* ── BUTTON WIRING ── */
document.getElementById('startBtn').addEventListener('click', () => {
  // Try to play audio (browsers require a user gesture)
  audio.volume = 0.45;
  audio.play().catch(() => {});
  goToSlide(2);
});

document.getElementById('toSlide3Btn').addEventListener('click', () => {
  goToSlide(3);
});

/* ══════════════════════════════════════════════════════════
   ④ SLIDE 2 — ROTATING HEART OF PHOTOS
══════════════════════════════════════════════════════════ */
function initHeartPhotos() {
  const scene = document.getElementById('heartScene');
  // Prevent re-init
  if (scene.querySelector('.heart-ring')) return;

  const ring = document.createElement('div');
  ring.className = 'heart-ring';
  scene.appendChild(ring);

  // Heart shape: parametric coords (t in 0..2π)
  // scaled to fit container
  const SIZE  = scene.offsetWidth || 360;
  const scale = SIZE * 0.36;
  const cx    = SIZE / 2;
  const cy    = SIZE / 2 + SIZE * 0.05;

  // Number of photo frames to place along the heart outline
  const total = 16;

  for (let i = 0; i < total; i++) {
    const t = (i / total) * 2 * Math.PI;
    // Heart parametric: x = 16sin³t, y = -(13cos t - 5cos2t - 2cos3t - cos4t)
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const px = cx + (hx / 16) * scale;
    const py = cy + (hy / 16) * scale;

    const frame   = document.createElement('div');
    const fSize   = parseInt(getComputedStyle(document.documentElement)
                      .getPropertyValue('--frame-size')) || 72;
    frame.className = 'photo-frame';
    frame.style.left = (px - fSize / 2) + 'px';
    frame.style.top  = (py - fSize / 2) + 'px';

    // Cycle through the 3 photos
    const photoSrc = PHOTOS[i % PHOTOS.length];
    if (photoSrc) {
      const img = new Image();
      img.onload = () => {
        const imgEl = document.createElement('img');
        imgEl.src = photoSrc;
        imgEl.alt = 'Photo';
        frame.appendChild(imgEl);
        frame.classList.remove('placeholder');
      };
      img.onerror = () => {
        // Show placeholder emoji
        frame.classList.add('placeholder');
        frame.textContent = ['💕', '🌸', '✨', '💫', '🌙'][i % 5];
      };
      img.src = photoSrc;
      frame.classList.add('placeholder');
      frame.textContent = ['💕', '🌸', '✨', '💫', '🌙'][i % 5];
    } else {
      frame.classList.add('placeholder');
      frame.textContent = ['💕', '🌸', '✨', '💫', '🌙'][i % 5];
    }

    ring.appendChild(frame);
  }
}

/* ══════════════════════════════════════════════════════════
   ⑤ SLIDE 3 — STAR-NAME CANVAS  ("JIGYASA")
══════════════════════════════════════════════════════════ */
function initNameCanvas() {
  const canvas = document.getElementById('nameCanvas');
  if (canvas._inited) return;
  canvas._inited = true;

  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const NAME  = 'JIGYASA';
  const FSIZE = Math.min(window.innerWidth * 0.16, 160);
  const particles = [];
  let   started = false;

  // Get text pixel positions
  const offscreen = document.createElement('canvas');
  offscreen.width  = canvas.width;
  offscreen.height = Math.min(260, canvas.height * 0.35);
  const octx = offscreen.getContext('2d');
  octx.fillStyle = '#fff';
  octx.font      = `bold ${FSIZE}px 'Montserrat', sans-serif`;
  octx.textAlign = 'center';
  octx.textBaseline = 'middle';
  octx.fillText(NAME, offscreen.width / 2, offscreen.height / 2);

  const imgData = octx.getImageData(0, 0, offscreen.width, offscreen.height);
  const gap = 5;

  for (let y = 0; y < offscreen.height; y += gap) {
    for (let x = 0; x < offscreen.width; x += gap) {
      const idx = (y * offscreen.width + x) * 4;
      if (imgData.data[idx + 3] > 128) {
        const hue   = Math.random() < 0.5 ? 330 + Math.random() * 30 : 280 + Math.random() * 40;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 3;
        particles.push({
          tx: x,                           // target x (text position)
          ty: y + (canvas.height * 0.08),  // target y (offset for top area)
          x:  Math.random() * canvas.width,
          y:  Math.random() * canvas.height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r:  Math.random() * 1.8 + 0.6,
          hue,
          alpha: 0,
          arrived: false,
          delay:   Math.random() * 60,     // frames to wait before moving
        });
      }
    }
  }

  let frame = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allArrived = true;

    for (const p of particles) {
      if (p.delay > 0) { p.delay--; allArrived = false; continue; }

      if (!p.arrived) {
        allArrived = false;
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 2) {
          p.arrived = true;
          p.x = p.tx; p.y = p.ty;
        } else {
          p.vx += dx * 0.06;
          p.vy += dy * 0.06;
          p.vx *= 0.78;
          p.vy *= 0.78;
          p.x += p.vx;
          p.y += p.vy;
        }
        p.alpha = Math.min(p.alpha + 0.04, 1);
      }

      // draw sparkle
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      grd.addColorStop(0, `hsla(${p.hue},100%,90%,${p.alpha})`);
      grd.addColorStop(1, `hsla(${p.hue},100%,70%,0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},100%,95%,${p.alpha})`;
      ctx.fill();
    }

    // gentle shimmer after all arrived
    if (allArrived) {
      for (const p of particles) {
        p.alpha = 0.6 + 0.4 * Math.sin(frame * 0.04 + p.tx * 0.05);
      }
    }

    frame++;
    requestAnimationFrame(animate);
  }

  animate();
}

/* ══════════════════════════════════════════════════════════
   ⑥ SLIDE 3 — TYPEWRITER
══════════════════════════════════════════════════════════ */
function startTypewriter() {
  const el     = document.getElementById('typewriterText');
  const cursor = document.querySelector('.cursor');
  const note   = document.getElementById('finalNote');

  if (el._started) return;
  el._started = true;

  const text    = TYPEWRITER_MESSAGE;
  let   i       = 0;
  const SPEED   = 38; // ms per character

  // slight delay so the star animation starts first
  setTimeout(function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, SPEED);
    } else {
      // done — show final love note
      cursor.style.display = 'none';
      setTimeout(() => {
        note.classList.remove('hidden');
      }, 800);
    }
  }, 900);
}
