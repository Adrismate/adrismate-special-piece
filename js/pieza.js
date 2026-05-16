/* ══════════════════════════════════
   PIEZA CREATIVA — animation engine
   Auto-plays on start. No wheel scroll.
   Navigation: TOC click only.
   Audio toggle: play/pause (swap for
   real mute/unmute when audio lands).
══════════════════════════════════ */

(function () {

  /* ── Timeline ── */
  const FRAMES = [
    /* 0 · Preamble */
    { t: 0.0,  dur: 2.0,  idx: null,          brand: false, els: [] },

    /* 1 · LA INCOMODIDAD */
    { t: 2.0,  dur: 3.4,  idx:'incomodidad',  brand: false, els: [
      { id:'g1',  type:'gradient',    x:'50%',  y:'50%', a:'cc', w:'42vw', h:'25vw' },
      { id:'l1',  text:'Todo empieza con algo incómodo.', size:'xxl', x:'50%', y:'50%', a:'cc' },
    ]},
    { t: 5.4,  dur: 2.6,  idx:'incomodidad',  els: [
      { id:'g1',  type:'gradient',    x:'50%',  y:'50%', a:'cc', w:'34vw', h:'20vw' },
      { id:'l2a', text:'No con un briefing,',  size:'l', x:'5vw',  y:'50%', a:'cl' },
    ]},
    { t: 8.0,  dur: 2.8,  idx:'incomodidad',  els: [
      { id:'g1',  type:'gradient',    x:'50%',  y:'50%', a:'cc', w:'34vw', h:'20vw' },
      { id:'l2a', text:'No con un briefing,',  size:'l', x:'5vw',  y:'50%', a:'cl', mute:true },
      { id:'l2b', text:'ni tampoco con un cliente.', size:'l', x:'95vw', y:'50%', a:'cr' },
    ]},
    { t: 10.8, dur: 3.2,  idx:'incomodidad',  els: [
      { id:'l4',  text:'Con una fricción que no puedo ignorar.', size:'l', x:'50%', y:'50%', a:'cc' },
    ]},
    { t: 14.0, dur: 2.8,  idx:'incomodidad',  els: [
      { id:'l5',  text:'Entonces recuerdo…', size:'xl', x:'50%', y:'50%', a:'cc' },
    ]},
    { t: 16.8, dur: 2.4,  idx:'incomodidad',  els: [
      { id:'ph1', type:'placeholder', x:'4vw',  y:'18vh', a:'tl', w:'42vw', h:'60vh' },
      { id:'l3a', text:'que algo esté hecho así', size:'l', x:'95vw', y:'48%', a:'cr' },
    ]},
    { t: 19.2, dur: 2.8,  idx:'incomodidad',  els: [
      { id:'ph1', type:'placeholder', x:'4vw',  y:'18vh', a:'tl', w:'42vw', h:'60vh' },
      { id:'l3a', text:'que algo esté hecho así', size:'l', x:'95vw', y:'48%', a:'cr', mute:true },
      { id:'l3b', text:'no significa que esté bien.', size:'l', x:'95vw', y:'56%', a:'cr' },
    ]},

    /* 2 · CUESTIONARLO TODO */
    { t: 22.0, dur: 3.6,  idx:'cuestionarlo', els: [
      { id:'l6a', text:'Me cuestiono todo lo cotidiano', size:'xl', x:'50%', y:'46%', a:'cc' },
      { id:'l6b', text:'como hábito profesional.', size:'xl', x:'50%', y:'56%', a:'cc', mute:true },
    ]},
    { t: 25.6, dur: 2.6,  idx:'cuestionarlo', els: [
      { id:'ph2', type:'placeholder', x:'50%',  y:'50%', a:'cc', w:'92vw', h:'68vh' },
      { id:'l7a', text:'Las cosas no surgen de la nada.', size:'l', x:'18vw', y:'48%', a:'cl' },
      { id:'l7b', text:'Somos incapaces de crear algo nuevo sin', size:'l', x:'18vw', y:'56%', a:'cl', mute:true },
    ]},
    { t: 28.2, dur: 2.6,  idx:'cuestionarlo', els: [
      { id:'ph2', type:'placeholder', x:'50%',  y:'50%', a:'cc', w:'92vw', h:'68vh' },
      { id:'l7b', text:'Somos incapaces de crear algo nuevo sin', size:'l', x:'4vw',  y:'50%', a:'cl' },
      { id:'l7c', text:'una fuente de inspiración, sin una referencia.', size:'l', x:'96vw', y:'50%', a:'cr', mute:true },
    ]},
    { t: 30.8, dur: 2.8,  idx:'cuestionarlo', els: [
      { id:'ph2', type:'placeholder', x:'50%',  y:'50%', a:'cc', w:'92vw', h:'68vh' },
      { id:'l7b', text:'Somos incapaces de crear algo nuevo sin', size:'l', x:'4vw',  y:'50%', a:'cl', mute:true },
      { id:'l7c', text:'una fuente de inspiración, sin una referencia.', size:'l', x:'96vw', y:'50%', a:'cr' },
    ]},
    { t: 33.6, dur: 3.4,  idx:'cuestionarlo', els: [
      { id:'c1',  type:'placeholder', x:'42vw', y:'-4vh',  a:'tl', w:'26vw', h:'30vw' },
      { id:'c2',  type:'placeholder', x:'72vw', y:'12vh',  a:'tl', w:'22vw', h:'32vw' },
      { id:'c3',  type:'placeholder', x:'4vw',  y:'30vh',  a:'tl', w:'20vw', h:'30vw' },
      { id:'c4',  type:'placeholder', x:'48vw', y:'62vh',  a:'tl', w:'20vw', h:'34vh' },
      { id:'l8',  text:'Pero es ahí donde se nos brinda la oportunidad de', size:'m', x:'5vw', y:'52%', a:'cl', z:10 },
    ]},
    { t: 37.0, dur: 1.6,  idx:'cuestionarlo', els: [
      { id:'c1',  type:'placeholder', x:'42vw', y:'-2vh',  a:'tl', w:'30vw', h:'46vw' },
      { id:'c2',  type:'placeholder', x:'66vw', y:'8vh',   a:'tl', w:'26vw', h:'34vw' },
      { id:'c3',  type:'placeholder', x:'18vw', y:'18vh',  a:'tl', w:'28vw', h:'34vw' },
      { id:'c4',  type:'placeholder', x:'40vw', y:'52vh',  a:'tl', w:'20vw', h:'42vh' },
      { id:'c5',  type:'placeholder', x:'52vw', y:'40vh',  a:'tl', w:'18vw', h:'24vh', z:2 },
      { id:'l9a', text:'cuestionar',          size:'l', x:'17vw', y:'58%', a:'cl', z:10 },
      { id:'l9b', text:'combinar',            size:'l', x:'50%',  y:'58%', a:'cc', mute:true, z:10 },
      { id:'l9c', text:'y crear algo nuevo.', size:'l', x:'85vw', y:'58%', a:'cr', mute:true, z:10 },
    ]},
    { t: 38.6, dur: 1.6,  idx:'cuestionarlo', els: [
      { id:'c1',  type:'placeholder', x:'42vw', y:'-2vh',  a:'tl', w:'30vw', h:'46vw' },
      { id:'c2',  type:'placeholder', x:'66vw', y:'8vh',   a:'tl', w:'26vw', h:'34vw' },
      { id:'c3',  type:'placeholder', x:'18vw', y:'18vh',  a:'tl', w:'28vw', h:'34vw' },
      { id:'c4',  type:'placeholder', x:'40vw', y:'52vh',  a:'tl', w:'20vw', h:'42vh' },
      { id:'c5',  type:'placeholder', x:'52vw', y:'40vh',  a:'tl', w:'18vw', h:'24vh', z:2 },
      { id:'l9a', text:'cuestionar',          size:'l', x:'17vw', y:'58%', a:'cl', mute:true, z:10 },
      { id:'l9b', text:'combinar',            size:'l', x:'50%',  y:'58%', a:'cc', z:10 },
      { id:'l9c', text:'y crear algo nuevo.', size:'l', x:'85vw', y:'58%', a:'cr', mute:true, z:10 },
    ]},
    { t: 40.2, dur: 2.2,  idx:'cuestionarlo', els: [
      { id:'c1',  type:'placeholder', x:'42vw', y:'-2vh',  a:'tl', w:'30vw', h:'46vw' },
      { id:'c2',  type:'placeholder', x:'66vw', y:'8vh',   a:'tl', w:'26vw', h:'34vw' },
      { id:'c3',  type:'placeholder', x:'18vw', y:'18vh',  a:'tl', w:'28vw', h:'34vw' },
      { id:'c4',  type:'placeholder', x:'40vw', y:'52vh',  a:'tl', w:'20vw', h:'42vh' },
      { id:'c5',  type:'placeholder', x:'52vw', y:'40vh',  a:'tl', w:'18vw', h:'24vh', z:2 },
      { id:'l9a', text:'cuestionar',          size:'l', x:'17vw', y:'58%', a:'cl', mute:true, z:10 },
      { id:'l9b', text:'combinar',            size:'l', x:'50%',  y:'58%', a:'cc', mute:true, z:10 },
      { id:'l9c', text:'y crear algo nuevo.', size:'l', x:'85vw', y:'58%', a:'cr', z:10 },
    ]},

    /* 3 · LEARN BY DOING */
    { t: 42.4, dur: 2.8,  idx:'learn', els: [
      { id:'l10a', text:'Learn by doing.', size:'xl', x:'50%', y:'46%', a:'cc' },
    ]},
    { t: 45.2, dur: 2.4,  idx:'learn', els: [
      { id:'l10a', text:'Learn by doing.', size:'xl', x:'50%', y:'46%', a:'cc' },
      { id:'l10b', text:'Si no sabes por donde empezar,', size:'xl', x:'50%', y:'56%', a:'cc', mute:true },
    ]},
    { t: 47.6, dur: 2.4,  idx:'learn', els: [
      { id:'l10a', text:'Learn by doing.',   size:'xl', x:'50%', y:'46%', a:'cc' },
      { id:'l10c', text:'empieza haciendo.', size:'xl', x:'50%', y:'56%', a:'cc', mute:true },
    ]},
    { t: 50.0, dur: 2.4,  idx:'learn', els: [
      { id:'l11a', text:'Encaja todas las piezas necesarias.', size:'l', x:'5vw', y:'34%', a:'tl' },
    ]},
    { t: 52.4, dur: 2.8,  idx:'learn', els: [
      { id:'l11a', text:'Encaja todas las piezas necesarias.', size:'l', x:'5vw', y:'34%', a:'tl', mute:true },
      { id:'l11b', text:'Observa desde lejos y\npiensa en como\nmejorarlo.', size:'l', x:'50%', y:'58%', a:'cc' },
    ]},
    { t: 55.2, dur: 2.6,  idx:'learn', els: [
      { id:'l11a', text:'Encaja todas las piezas necesarias.', size:'l', x:'5vw', y:'34%', a:'tl', mute:true },
      { id:'l11b', text:'Observa desde lejos y\npiensa en como\nmejorarlo.', size:'l', x:'50%', y:'58%', a:'cc', mute:true },
      { id:'l11c', text:'Vuelve a intentarlo.', size:'l', x:'95vw', y:'82%', a:'br' },
    ]},

    /* 4 · UCD REAL */
    { t: 57.8, dur: 2.8,  idx:'ucd', els: [
      { id:'l12',  text:'User-centered design real.', size:'xl', x:'50%', y:'50%', a:'cc' },
    ]},
    { t: 60.6, dur: 2.4,  idx:'ucd', els: [
      { id:'l13a', text:'Sal ahí fuera y pregunta.', size:'l', x:'5vw', y:'66%', a:'cl' },
    ]},
    { t: 63.0, dur: 2.6,  idx:'ucd', els: [
      { id:'l13a', text:'Sal ahí fuera y pregunta.', size:'l', x:'5vw',  y:'66%', a:'cl', mute:true },
      { id:'l13b', text:'No asumas, contrástalo con datos.', size:'l', x:'50%', y:'50%', a:'cc' },
    ]},
    { t: 65.6, dur: 3.0,  idx:'ucd', els: [
      { id:'l13a', text:'Sal ahí fuera y pregunta.', size:'l', x:'5vw',  y:'66%', a:'cl', mute:true },
      { id:'l13b', text:'No asumas, contrástalo con datos.', size:'l', x:'50%', y:'50%', a:'cc', mute:true },
      { id:'l13c', text:'Comparte, haz participe y perfecciona.', size:'l', x:'95vw', y:'34%', a:'cr' },
    ]},

    /* 5 · EL COSQUILLEO */
    { t: 68.6, dur: 1.8,  idx:'cosquilleo', els: [
      { id:'l14',  text:'Pero sobretodo,', size:'xl', x:'50%', y:'50%', a:'cc' },
    ]},
    { t: 70.4, dur: 2.4,  idx:'cosquilleo', els: [
      { id:'l15',  text:'crea.', size:'xxl', x:'50%', y:'50%', a:'cc' },
    ]},
    { t: 72.8, dur: 3.4,  idx:'cosquilleo', els: [
      { id:'l16',  text:'Crear productos que sorprendan,\nque se adelanten a las expectativas del usuario.', size:'l', x:'50%', y:'50%', a:'cc' },
    ]},
    { t: 76.2, dur: 3.0,  idx:'cosquilleo', els: [
      { id:'l17',  text:'"La gente no sabe lo que quiere hasta que se lo enseñas",', size:'l', x:'50%', y:'42%', a:'cc' },
    ]},
    { t: 79.2, dur: 2.0,  idx:'cosquilleo', els: [
      { id:'l17',  text:'"La gente no sabe lo que quiere hasta que se lo enseñas",', size:'l', x:'50%', y:'42%', a:'cc', mute:true },
      { id:'l17b', text:'decía Jobs.', size:'l', x:'50%', y:'74%', a:'cc', mute:true },
    ]},
    { t: 81.2, dur: 2.4,  idx:'cosquilleo', els: [
      { id:'l18a', text:'No tengas miedo a crearlo,', size:'l', x:'5vw', y:'52%', a:'cl' },
    ]},
    { t: 83.6, dur: 2.0,  idx:'cosquilleo', els: [
      { id:'l18a', text:'No tengas miedo a crearlo,', size:'l', x:'5vw', y:'52%', a:'cl', mute:true },
      { id:'l18b', text:'cuando algo funciona,', size:'l', x:'50%', y:'52%', a:'cc' },
    ]},
    { t: 85.6, dur: 3.6,  idx:'cosquilleo', els: [
      { id:'l19',  text:'esa sensación de cosquilleo\nte recorrerá la piel.', size:'l', x:'50%', y:'50%', a:'cc' },
    ]},

    /* 6 · ENDING */
    { t: 89.2, dur: 2.6,  idx:'cosquilleo', mutedIdx:true, els: [
      { id:'l20',  text:'Nadie me lo ha pedido.', size:'xl', x:'50%', y:'46%', a:'cc' },
    ]},
    { t: 91.8, dur: 3.0,  idx:'cosquilleo', mutedIdx:true, els: [
      { id:'l20',  text:'Nadie me lo ha pedido.', size:'xl', x:'50%', y:'46%', a:'cc' },
      { id:'l20b', text:'Tampoco lo he esperado…', size:'xl', x:'50%', y:'56%', a:'cc', mute:true },
    ]},
    { t: 94.8, dur: 3.0,  idx:'cosquilleo', mutedIdx:true, els: [
      { id:'l21',  text:'[entra la siguiente sección]', size:'m', x:'50%', y:'50%', a:'cc', mute:true },
    ]},
  ];

  const TOTAL = 97.8;

  const SECTIONS = [
    { id:'incomodidad',  label:'La incomodidad' },
    { id:'cuestionarlo', label:'Cuestionarlo todo' },
    { id:'learn',        label:'Learn by doing' },
    { id:'ucd',          label:'UCD real' },
    { id:'cosquilleo',   label:'El cosquilleo' },
  ];
  for (const s of SECTIONS) {
    const f = FRAMES.find(fr => fr.idx === s.id);
    s.start = f ? f.t : 0;
  }
  const SECTION_ORDER = SECTIONS.map(s => s.id);

  const ANCHOR = {
    cc:['-50%','-50%'], cl:['0','-50%'],     cr:['-100%','-50%'],
    tl:['0','0'],       tc:['-50%','0'],     tr:['-100%','0'],
    bl:['0','-100%'],   bc:['-50%','-100%'], br:['-100%','-100%'],
  };

  /* ── Refs ── */
  const root         = document.getElementById('nextScene');
  const sceneEl      = root.querySelector('.pieza-scene');
  const indexEl      = root.querySelector('.pieza-index');
  const brandBg      = root.querySelector('.brand-bg');
  const entries      = [...indexEl.querySelectorAll('.entry')];
  const pauseBtn    = root.querySelector('#piezaPauseBtn');
  const pauseIcon   = root.querySelector('#piezaPauseIcon');
  const audioBtn    = root.querySelector('.audio-toggle');
  const audioIcon   = root.querySelector('#piezaAudioIcon');
  const progressTrack = root.querySelector('.pieza-progress-track');

  /* ── Build scene DOM ── */
  const allSpecs = new Map();
  for (const f of FRAMES)
    for (const e of (f.els || []))
      if (!allSpecs.has(e.id)) allSpecs.set(e.id, e);

  const dom = new Map();
  for (const [id, spec] of allSpecs) {
    const el = document.createElement('div');
    el.className = spec.type === 'gradient' ? 'viz gradient'
                 : spec.type === 'placeholder' ? 'viz placeholder'
                 : 'line size-' + (spec.size || 'l');
    el.dataset.id = id;
    el.style.zIndex = spec.z || 5;
    sceneEl.appendChild(el);
    dom.set(id, el);
  }

  function applyEl(el, spec) {
    const [ax, ay] = ANCHOR[spec.a || 'cc'];
    el.style.setProperty('--ax', ax);
    el.style.setProperty('--ay', ay);
    el.style.left = spec.x;
    el.style.top  = spec.y;
    if (spec.w) el.style.width  = spec.w;
    if (spec.h) el.style.height = spec.h;
    if (spec.size)
      el.className = el.className.replace(/\s?size-\w+/g, '') + ' size-' + spec.size;
    if (spec.text !== undefined) {
      const html = String(spec.text).replace(/\n/g, '<br>');
      if (el.innerHTML !== html) el.innerHTML = html;
    }
    if (spec.mute) el.classList.add('muted');
    else           el.classList.remove('muted');
    el.style.zIndex = spec.z || 5;
  }

  /* ══════════════════════════════════
     TOC — persistent shown state.
     Sections accumulate in shownSections
     and never go back to hidden.
     active follows the current playhead.
  ══════════════════════════════════ */
  const shownSections = new Set();

  function updateIndex(f) {
    const activeId  = f.idx;
    const activeIdx = activeId ? SECTION_ORDER.indexOf(activeId) : -1;

    /* Accumulate all sections up to and including the current one */
    if (activeIdx >= 0) {
      for (let i = 0; i <= activeIdx; i++) shownSections.add(SECTION_ORDER[i]);
    }

    entries.forEach(entry => {
      const id    = entry.dataset.id;
      const myIdx = SECTION_ORDER.indexOf(id);

      /* shown: persistent once reached */
      if (shownSections.has(id)) entry.classList.add('shown');

      /* active: only current, not during mutedIdx frames */
      if (myIdx === activeIdx && !f.mutedIdx) entry.classList.add('active');
      else                                    entry.classList.remove('active');
    });
  }

  /* ── Segmented chapter progress ── */
  const segments = [];
  for (let i = 0; i < SECTIONS.length; i++) {
    const segEl  = document.createElement('div');
    segEl.className = 'pieza-segment';
    const fillEl = document.createElement('div');
    fillEl.className = 'pieza-segment-fill';
    segEl.appendChild(fillEl);
    progressTrack.appendChild(segEl);
    const segStart = SECTIONS[i].start;
    const segEnd   = i + 1 < SECTIONS.length ? SECTIONS[i + 1].start : TOTAL;
    segments.push({ fillEl, start: segStart, end: segEnd });
  }

  function updateProgress() {
    for (const seg of segments) {
      const span = seg.end - seg.start;
      const pct  = span <= 0 ? 0 : Math.min(1, Math.max(0, (t - seg.start) / span));
      seg.fillEl.style.transform = `scaleX(${pct})`;
    }
  }

  /* TOC click → jump to section start. shownSections is NOT reset. */
  entries.forEach(entry => {
    entry.addEventListener('click', () => {
      if (!entry.classList.contains('shown')) return; /* not yet reached */
      const section = SECTIONS.find(s => s.id === entry.dataset.id);
      if (section) t = section.start;
    });
  });

  /* ── Frame renderer ── */
  let renderGen    = 0;
  let lastFrameIdx = -1;

  function renderAt(time) {
    let i = 0;
    for (let k = FRAMES.length - 1; k >= 0; k--) {
      if (time >= FRAMES[k].t) { i = k; break; }
    }
    const f = FRAMES[i];

    if (i !== lastFrameIdx) {
      renderGen++;
      lastFrameIdx = i;
    }
    const gen = renderGen;

    const visible = new Set((f.els || []).map(e => e.id));

    for (const [id, el] of dom)
      if (!visible.has(id) && el.classList.contains('shown'))
        el.classList.remove('shown');

    let stagger = 0;
    for (const spec of (f.els || [])) {
      const el       = dom.get(spec.id);
      const wasShown = el.classList.contains('shown');
      applyEl(el, spec);
      if (!wasShown) {
        const delay = 40 + stagger;
        stagger += 70;
        setTimeout(() => { if (renderGen === gen) el.classList.add('shown'); }, delay);
      } else {
        el.classList.add('shown');
      }
    }

    brandBg.classList.toggle('shown', !!f.brand);
    updateIndex(f);
  }

  /* ── Playback ── */
  let playing = false;
  let t       = 0;
  let lastTs  = 0;

  /* Pause-button icons */
  const ICON_PAUSE = `
    <rect x="4"  y="3" width="3" height="10" rx="1" fill="currentColor"/>
    <rect x="9" y="3" width="3" height="10" rx="1" fill="currentColor"/>`;
  const ICON_PLAY  = `
    <path d="M5 3l8 5-8 5V3z" fill="currentColor"/>`;

  /* Audio-toggle icons — swap when real narration audio lands */
  const ICON_AUDIO_ON  = `
    <path d="M3 8.5V5.5L7 3v10l-4-2.5z" fill="currentColor"/>
    <path d="M9.5 6.5c.6.5 1 1.2 1 2s-.4 1.5-1 2" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M11.5 4.5c1.2 1 2 2.5 2 4s-.8 3-2 4" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
  const ICON_AUDIO_OFF = `
    <path d="M3 8.5V5.5L7 3v10l-4-2.5z" fill="currentColor" opacity=".4"/>
    <line x1="10" y1="6" x2="14" y2="10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    <line x1="14" y1="6" x2="10" y2="10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`;

  let audioMuted = false;

  function setAudioMuted(m) {
    audioMuted = m;
    audioIcon.innerHTML = m ? ICON_AUDIO_OFF : ICON_AUDIO_ON;
    audioBtn.classList.toggle('muted', m);
  }

  function setPlaying(p) {
    playing = p;
    pauseIcon.innerHTML = p ? ICON_PAUSE : ICON_PLAY;
    pauseBtn.setAttribute('aria-label', p ? 'Pause' : 'Resume');
  }

  /* rAF loop */
  function loop(ts) {
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    if (playing) {
      t += dt;
      if (t >= TOTAL) { t = TOTAL; setPlaying(false); }
    }
    renderAt(t);
    updateProgress();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ── Pause/resume button ── */
  pauseBtn.addEventListener('click', () => {
    if (t >= TOTAL) t = 0;
    setPlaying(!playing);
  });

  /* ── Audio toggle (mute/unmute — cosmetic until real audio lands) ── */
  audioBtn.addEventListener('click', () => setAudioMuted(!audioMuted));

  /* ── Scroll-up-to-hero gesture ── */
  let wheelAccum = 0;
  const WHEEL_BACK_THRESHOLD = 80;
  root.addEventListener('wheel', (e) => {
    if (e.deltaY < 0) {
      wheelAccum += Math.abs(e.deltaY);
      if (wheelAccum >= WHEEL_BACK_THRESHOLD) {
        wheelAccum = 0;
        window.__heroGoBack && window.__heroGoBack();
      }
    } else {
      wheelAccum = 0;
    }
  }, { passive: true });

  /* ── Public API called by hero.js ── */
  window.piezaStart = function () {
    t            = 0;
    lastTs       = 0;
    lastFrameIdx = -1;
    wheelAccum   = 0;
    /* Reset all scene elements for a clean start */
    for (const [, el] of dom) el.classList.remove('shown');
    entries.forEach(e => e.classList.remove('shown', 'active'));
    shownSections.clear();
    brandBg.classList.remove('shown');
    setAudioMuted(false);
    setPlaying(true);
    window.__setHeroScrollActive && window.__setHeroScrollActive(false);
  };

  window.piezaPause = function () {
    setPlaying(false);
    window.__setHeroScrollActive && window.__setHeroScrollActive(true);
  };

})();
