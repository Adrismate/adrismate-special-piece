gsap.registerPlugin(ScrollTrigger, CustomEase);

/* Exact easing curves from the Figma spec */
CustomEase.create('E',  '0.76, 0, 0.24, 1');  /* strong in-out */
CustomEase.create('ES', '0.16, 1, 0.3, 1');   /* spring-out */

/* ── Gradient palette per step ── */
const GRADIENTS = [
  'linear-gradient(180deg, rgb(206,210,221) 16%, rgb(239,127,46)  94%)',
  'linear-gradient(180deg, rgb(218,214,206)  0%, rgb(238,200,138) 100%)',
  'linear-gradient(180deg, rgb(221,221,215)  0%, rgb(221,221,215) 100%)',
];

const DUR     = 1;    /* seconds */
const LOCK_MS = 950;  /* ms — lock period between steps */

/* ── Refs ── */
const heroEl     = document.getElementById('hero');
const titleEl    = document.getElementById('heroTitle');
const portraitEl = document.getElementById('heroSubject');
const meetsEl    = document.getElementById('meetsEl');
const strategyEl = document.getElementById('strategyEl');
const designEl   = document.getElementById('designEl');
const bioEl      = document.getElementById('heroBio');
const navEl      = document.getElementById('heroNav');
const nextScene  = document.getElementById('nextScene');

/* ══════════════════════════════════
   fitTitle
   Scales "Adrismate" to exactly fill
   viewport width minus the 4.6vw side
   padding used by Strategy / Design.
══════════════════════════════════ */
function fitTitle() {
  const sidePad = window.innerWidth * 0.046;
  const targetW = window.innerWidth - sidePad * 2;

  const probe = document.createElement('span');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = [
    'position:absolute',
    'visibility:hidden',
    'white-space:nowrap',
    "font-family:'Sagace',serif",
    'font-weight:400',
    'letter-spacing:-0.09em',
    'font-size:100px',
    'line-height:1',
    'pointer-events:none',
  ].join(';');
  probe.textContent = 'Adrismate';
  document.body.appendChild(probe);
  const probeW = probe.getBoundingClientRect().width;
  document.body.removeChild(probe);

  if (probeW === 0) return;
  titleEl.style.fontSize = ((targetW / probeW) * 100) + 'px';
}

/* ══════════════════════════════════
   getLabelDx
   Returns the translateX values needed
   to centre the "Strategy meets Design"
   cluster. Temporarily resets GSAP's
   tracked X to read natural positions.
══════════════════════════════════ */
function getLabelDx() {
  const sX = gsap.getProperty(strategyEl, 'x');
  const dX = gsap.getProperty(designEl, 'x');

  gsap.set(strategyEl, { x: 0 });
  gsap.set(designEl,   { x: 0 });
  strategyEl.getBoundingClientRect(); /* force reflow */

  const sR = strategyEl.getBoundingClientRect();
  const dR = designEl.getBoundingClientRect();
  const mR = meetsEl.getBoundingClientRect();

  gsap.set(strategyEl, { x: sX });
  gsap.set(designEl,   { x: dX });

  const gap = 28;
  const vw  = window.innerWidth;
  const clW = sR.width + gap + mR.width + gap + dR.width;
  const clL = (vw - clW) / 2;

  return {
    stratDx: clL - sR.left,
    desDx:   (clL + sR.width + gap + mR.width + gap) - dR.left,
  };
}

/* ══════════════════════════════════
   SCROLL STATE MACHINE — 3 steps

   0  Full hero, starting gradient
   1  Strategy meets Design — title +
      portrait out, labels cluster to
      centre, gradient warms
   2  Everything out → next scene fades
      in over the flat #DDDDD7 bg
══════════════════════════════════ */
let step            = 0;
let locked          = true;  /* stays true until entrance animation completes */
let heroScrollActive = true; /* disabled while pieza is in control */

/* Called by pieza.js to hand scroll back to the hero.
   Bypasses heroScrollActive + locked — it's an explicit
   command from outside the hero's own input handling. */
window.__heroGoBack = function () {
  if (step <= 0) return;
  step -= 1;
  applyStep(step);
  locked = true;
  setTimeout(() => { locked = false; }, LOCK_MS);
};

/* Called by pieza.js to enable/disable hero wheel handling */
window.__setHeroScrollActive = function (v) { heroScrollActive = v; };

function applyStep(n) {
  heroEl.style.background = GRADIENTS[n];

  if (n === 0) {
    window.piezaPause && window.piezaPause();
    gsap.set(nextScene, { opacity: 0, pointerEvents: 'none' });

    /* Title back — opacity only, preserves mix-blend-mode */
    gsap.to(titleEl,    { opacity: 1, y: 0, duration: DUR, ease: 'ES' });
    gsap.to(portraitEl, { opacity: 1,       duration: DUR, ease: 'ES' });
    gsap.to(meetsEl,    { opacity: 0,        duration: 0.5, ease: 'E'  });
    gsap.to(strategyEl, { x: 0, opacity: 1, duration: DUR, ease: 'ES' });
    gsap.to(designEl,   { x: 0, opacity: 1, duration: DUR, ease: 'ES' });
    gsap.to(bioEl,      { opacity: 1, duration: 0.7, delay: 0.2, ease: 'ES' });
    gsap.to(navEl,      { opacity: 1, y: 0, duration: 0.7, ease: 'ES' });

  } else if (n === 1) {
    window.piezaPause && window.piezaPause();
    gsap.set(nextScene, { opacity: 0, pointerEvents: 'none' });

    /* Title slides up while fading — mix-blend-mode breaks during exit,
       which is fine since the element is invisible at that point */
    gsap.to(titleEl,    { opacity: 0, y: '-6vh', duration: DUR, ease: 'E' });
    gsap.to(portraitEl, { opacity: 0,             duration: DUR, ease: 'E' });
    gsap.to(meetsEl,    { opacity: 1, duration: 0.7, delay: 0.22, ease: 'ES' });

    const { stratDx, desDx } = getLabelDx();
    gsap.to(strategyEl, { x: stratDx, opacity: 1, duration: DUR, ease: 'ES' });
    gsap.to(designEl,   { x: desDx,   opacity: 1, duration: DUR, ease: 'ES' });

    gsap.to(bioEl, { opacity: 0, duration: 0.38, ease: 'E' });
    gsap.to(navEl, { opacity: 1, y: 0, duration: 0.7, ease: 'ES' });

  } else if (n === 2) {
    gsap.to(meetsEl,    { opacity: 0, duration: 0.7, ease: 'E' });
    gsap.to(strategyEl, { opacity: 0, duration: 0.7, ease: 'E' });
    gsap.to(designEl,   { opacity: 0, duration: 0.7, ease: 'E' });
    gsap.to(navEl,      { opacity: 0, y: 20, duration: 0.7, ease: 'E' });

    /* Hero content gone → reveal pieza and start it */
    setTimeout(() => {
      gsap.to(nextScene, { opacity: 1, pointerEvents: 'auto', duration: 0.9, ease: 'ES' });
      setTimeout(() => { window.piezaStart && window.piezaStart(); }, 900);
    }, 800);
  }
}

/* ── Idle auto-advance ── */
let idleTimer = null;

function cancelAutoAdvance() {
  clearTimeout(idleTimer);
  idleTimer = null;
}

function scheduleAutoAdvance(delay) {
  cancelAutoAdvance();
  idleTimer = setTimeout(() => {
    if (step >= 2) return;
    advance(1);
    scheduleAutoAdvance(LOCK_MS + 400);
  }, delay);
}

function advance(dir) {
  if (locked || !heroScrollActive) return;
  const next = Math.max(0, Math.min(2, step + dir));
  if (next === step) return;
  cancelAutoAdvance();
  step = next;
  applyStep(step);
  locked = true;
  setTimeout(() => { locked = false; }, LOCK_MS);
}

/* ── Re-snap label cluster on resize ── */
window.addEventListener('resize', () => {
  fitTitle();
  if (step >= 1) {
    const { stratDx, desDx } = getLabelDx();
    gsap.set(strategyEl, { x: stratDx });
    gsap.set(designEl,   { x: desDx   });
  }
});

/* ── Input handling ── */
ScrollTrigger.observe({
  target:         document.documentElement,
  type:           'wheel,touch',
  onDown:         () => { cancelAutoAdvance(); advance(1);  },
  onUp:           () => { cancelAutoAdvance(); advance(-1); },
  preventDefault: true,
  tolerance:      50,
});

window.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); cancelAutoAdvance(); advance(1);  }
  if (e.key === 'ArrowUp'   || e.key === 'PageUp'  ) { e.preventDefault(); cancelAutoAdvance(); advance(-1); }
});

/* Arrow button in hero bio also advances */
const arrowBtn = document.querySelector('.arrow-circle');
if (arrowBtn) {
  arrowBtn.style.cursor = 'pointer';
  arrowBtn.addEventListener('click', () => { cancelAutoAdvance(); advance(1); });
}

/* ══════════════════════════════════
   ENTRANCE ANIMATIONS
   Runs once after Sagace has loaded
   so fitTitle() can measure correctly.
   locked stays true until complete.
══════════════════════════════════ */
document.fonts.ready.then(() => {
  fitTitle();

  /* Set pre-animation positions */
  gsap.set(portraitEl, { y: 20 });
  gsap.set(strategyEl, { x: -24 });
  gsap.set(designEl,   { x:  24 });
  gsap.set(bioEl,      { y:  16 });
  gsap.set(navEl,      { y:  16 });

  const tl = gsap.timeline({
    defaults: { ease: 'ES' },
    onComplete: () => { locked = false; scheduleAutoAdvance(5000); },
  });

  /* Title: opacity only — no y transform, preserves mix-blend-mode */
  tl.to(titleEl,    { opacity: 1,          duration: 1.3 }, 0.08);
  tl.to(portraitEl, { opacity: 1, y: 0,   duration: 1.5 }, 0.3);
  tl.to(strategyEl, { opacity: 1, x: 0,   duration: 1   }, 0.6);
  tl.to(designEl,   { opacity: 1, x: 0,   duration: 1   }, 0.66);
  tl.to(bioEl,      { opacity: 1, y: 0,   duration: 1   }, 0.9);
  tl.to(navEl,      { opacity: 1, y: 0,   duration: 1   }, 1.2);
});
