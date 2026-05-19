/* ══════════════════════════════════
   PIEZA CREATIVA — audio-driven engine

   audio.currentTime IS the playhead.
   The rAF loop reads it every frame.
   GSAP owns all opacity + transform.
   Exits: hard cut (gsap.set autoAlpha:0)
   Enters text: opacity + y (power2.out)
   Enters cards: scale + rotation (power3.out)
   Muted color: CSS transition only.
══════════════════════════════════ */

(function () {
	gsap.registerPlugin(TextPlugin);

	/* ── Visuals are placeholders while storyboard is being consolidated.
        Toggle to false when final photography is wired into each frame. ── */
	const USE_PLACEHOLDERS = false;

	/* ── Timeline — timestamps re-analyzed from audio (Whisper word-level) ── */
	const FRAMES = [
		/* 0 · Preamble — breath before narration */
		{ t: 0.0, dur: 0.58, idx: null, brand: false, els: [] },

		/* 1 · LA INCOMODIDAD ───────────────────────────────────────────
       W 0.58–2.76  "Todo empieza con algo incómodo."
       Imagen impacto full-bleed → tras 0.6s retrocede al marco lateral.
       El texto entra al completo en el mismo instante, con blend-mode
       difference para legibilidad sobre la imagen y el canvas. */
		{
			id: "incomodidad-1",
			t: 0.58,
			dur: 2.18,
			idx: "incomodidad",
			els: [
				{
					id: "g0",
					type: "photo",
					src: "assets/images/incomodidad-1.png",
					x: "50%",
					y: "50%",
					a: "cc",
					w: "min(90vw, 906px)",
					h: "calc(min(90vw, 906px) * 0.7225)",
					anim: "bleed-to-frame",
				},
				{
					id: "l1",
					text: "Todo empieza con algo incómodo.",
					size: "xl",
					x: "50%",
					y: "50%",
					a: "cc",
					diff: true,
					z: 10,
					anim: "typewriter",
					twDur: 2.18,
				},
			],
		},
		/* W 2.76–3.82  "No con un briefing,"
       White flash 200ms → swipe-from-right del texto y de la imagen.
       Imagen al centro, texto a la izquierda. */
		{
			id: "incomodidad-2",
			t: 2.76,
			dur: 1.06,
			idx: "incomodidad",
			flash: true,
			els: [
				{ id: "g1", type: "photo", src: "assets/images/incomodidad-2.png", x: "50%", y: "50%", a: "cc", w: "44vw", h: "32vh", anim: "swipe-right" },
				{ id: "l2a", text: "No con un briefing,", size: "l", x: "6vw", y: "50%", a: "cl", anim: "swipe-right" },
			],
		},
		/* W 3.82–5.26  "ni tampoco con un cliente."
       Imagen se reajusta ligeramente a la izquierda para equilibrio horizontal,
       l2a queda muted, l2b entra swipe-right por la derecha. */
		{
			id: "incomodidad-3",
			t: 3.82,
			dur: 1.44,
			idx: "incomodidad",
			els: [
				{ id: "g1", type: "photo", src: "assets/images/incomodidad-2.png", x: "47%", y: "50%", a: "cc", w: "44vw", h: "32vh" },
				{ id: "l2a", text: "No con un briefing,", size: "l", x: "6vw", y: "50%", a: "cl" },
				{ id: "l2b", text: "ni tampoco con un cliente.", size: "l", x: "94vw", y: "50%", a: "cr", anim: "swipe-right" },
			],
		},
		/* W 5.26–6.10  "Con una fricción"
       Fast-cut: aparece en el centro debajo de la imagen anterior, sin enter. */
		{
			id: "incomodidad-4",
			t: 5.26,
			dur: 0.84,
			idx: "incomodidad",
			els: [
				{ id: "g1", type: "photo", src: "assets/images/incomodidad-2.png", x: "47%", y: "50%", a: "cc", w: "44vw", h: "32vh", z: 10, exitAfter: 0 },
				{ id: "l4a", text: "Con una fricción", size: "l", x: "50%", y: "50%", a: "cc", anim: "fast-cut", z: 2 },
			],
		},
		/* W 6.10–7.54  "que no puedo ignorar."
       Texto inicial se desplaza a izquierda con fast-in/easy-out,
       el fondo invierte a negro y la imagen full-bleed aparece detrás
       con parallax zoom interno. */
		{
			id: "incomodidad-5",
			t: 6.1,
			dur: 1.44,
			idx: "incomodidad",
			invert: true,
			els: [
				{ id: "gT", type: "photo", src: "assets/images/la-friccion.png", x: "50%", y: "50%", a: "cc", w: "84vw", h: "54vh", anim: "bleed-pullback" },
				{ id: "l4a", text: "Con una fricción que no puedo ignorar.", size: "m", x: "50%", y: "50%", a: "cc", z: 10 },
			],
		},
		/* W 7.54–8.32  "Entonces recuerdo…"
       Vuelve canvas claro. Texto grande de impacto al centro. */
		{
			id: "incomodidad-6",
			t: 7.54,
			dur: 0.78,
			idx: "incomodidad",
			els: [{ id: "l5", text: "Entonces recuerdo…", size: "xl", x: "50%", y: "50%", a: "cc", anim: "fast-cut" }],
		},
		/* W 8.32–9.44  "que algo esté hecho así"
       Ojo en primer plano izquierdo, texto centrado a la derecha. */
		{
			id: "incomodidad-7",
			t: 8.32,
			dur: 1.12,
			idx: "incomodidad",
			els: [
				{ id: "ph1", type: "photo", src: "assets/images/dar por sentado.png", x: "11.67vw", y: "49.97%", a: "cl", w: "46.32vw", h: "65.1vh" },
				{ id: "l3a", text: "que algo esté hecho así", size: "m", x: "77.99vw", y: "50%", a: "cc" },
			],
		},
		/* W 9.44–11.54  "no significa que esté bien."
       Swipe-up + fade-in: la nueva frase empuja a la anterior sin tocarla. */
		{
			id: "incomodidad-8",
			t: 9.44,
			dur: 2.1,
			idx: "incomodidad",
			els: [
				{ id: "ph1", type: "photo", src: "assets/images/dar por sentado.png", x: "11.61vw", y: "49.39%", a: "cl", w: "46.37vw", h: "64.66vh" },
				{ id: "l3a", text: "que algo esté hecho así", size: "m", x: "78vw", y: "42%", a: "cc", mute: true },
				{ id: "l3b", text: "no significa que esté bien.", size: "m", x: "77.99vw", y: "50%", a: "cc", anim: "swipe-up" },
			],
		},

		/* 2 · CUESTIONARLO TODO ────────────────────────────────────────
       W 11.54–12.68  "Me cuestiono todo lo cotidiano"              */
		{
			id: "cuestionarlo-1",
			t: 11.54,
			dur: 1.14,
			idx: "cuestionarlo",
			els: [
				{
					id: "q0",
					type: "photo",
					src: "assets/images/me cuestiono todo lo cotidiano.png",
					x: "50%",
					y: "50%",
					a: "cc",
					w: "min(32vw, 520px)",
					h: "calc(min(32vw, 520px) * 1.941)",
					anim: "bleed-to-frame",
				},
				{ id: "l6a", text: "Me cuestiono todo lo cotidiano", size: "xl", x: "50%", y: "50%", a: "cc", anim: "typewriter", twDur: 1.14 },
				{ id: "l6b", text: "como hábito profesional.", size: "xl", x: "50%", y: "56%", a: "cc", mute: true },
			],
		},
		/* W 12.68–14.34  "como hábito profesional."                    */
		{
			id: "cuestionarlo-2",
			t: 12.68,
			dur: 1.66,
			idx: "cuestionarlo",
			els: [
				{
					id: "q0",
					type: "photo",
					src: "assets/images/me cuestiono todo lo cotidiano.png",
					x: "50%",
					y: "50%",
					a: "cc",
					w: "min(32vw, 520px)",
					h: "calc(min(32vw, 520px) * 1.941)",
				},
				{ id: "l6a", text: "Me cuestiono todo lo cotidiano", size: "xl", x: "50%", y: "44.78%", a: "cc" },
				{ id: "l6b", text: "como hábito profesional.", size: "xl", x: "50.09%", y: "54.45%", a: "cc" },
			],
		},
		/* W 14.34–16.52  "Las cosas no surgen de la nada."
       Upper-middle area, left rail. Below the TOC vertically. */
		{
			id: "cuestionarlo-3",
			t: 14.34,
			dur: 2.18,
			idx: "cuestionarlo",
			els: [
				{ id: "l7a", text: "Las cosas no surgen de la nada.", size: "l", x: "8.33vw", y: "50%", a: "cl", z: 10 },
				{ id: "l7b", text: "Somos incapaces de crear algo nuevo sin", size: "l", x: "22vw", y: "55%", a: "cl", mute: true },
			],
		},
		/* W 16.52–18.52  "Somos incapaces de crear algo nuevo sin" —
       second clause activates beneath the first, same left rail. */
		{
			id: "cuestionarlo-4",
			t: 16.52,
			dur: 2.0,
			idx: "cuestionarlo",
			els: [
				{ id: "l7a", text: "Las cosas no surgen de la nada.", size: "l", x: "22vw", y: "48%", a: "cl", mute: true },
				{ id: "l7b", text: "Somos incapaces de crear algo nuevo sin", size: "l", x: "35.07vw", y: "50%", a: "cl", z: 10 },
			],
		},
		/* W 18.52–19.42  "una fuente de inspiración," — appears on the
       right rail, balancing the left-side phrases. */
		{
			id: "cuestionarlo-5",
			t: 18.52,
			dur: 0.9,
			idx: "cuestionarlo",
			els: [
				{ id: "l7a", text: "Las cosas no surgen de la nada.", size: "l", x: "22vw", y: "48%", a: "cl", mute: true },
				{ id: "l7b", text: "Somos incapaces de crear algo nuevo sin", size: "l", x: "22vw", y: "55%", a: "cl", mute: true },
				{ id: "l7c", text: "una fuente de inspiración,", size: "l", x: "69.45vw", y: "50%", a: "cl", z: 10 },
			],
		},
		/* W 19.42–20.0  "sin una referencia." — completes the right-rail
       phrase next to "una fuente de inspiración," */
		{
			id: "cuestionarlo-6",
			t: 19.42,
			dur: 0.58,
			idx: "cuestionarlo",
			els: [
				{ id: "l7c", text: "una fuente de inspiración,", size: "l", x: "55vw", y: "48%", a: "cl", mute: true },
				{ id: "l7d", text: "sin una referencia.", size: "l", x: "69.38vw", y: "50%", a: "cl", z: 10 },
			],
		},
		/* W 20.0–20.86  Cards settled — beat before the phrase lands     */
		{
			id: "cuestionarlo-7",
			t: 20.0,
			dur: 0.86,
			idx: "cuestionarlo",
			els: [
				{ id: "l7c", text: "una fuente de inspiración,", size: "l", x: "55vw", y: "48%", a: "cl", mute: true },
				{ id: "l7d", text: "sin una referencia.", size: "l", x: "55vw", y: "55%", a: "cl", mute: true },
			],
		},
		/* W 20.86–22.96  "Pero es ahí donde se nos brinda la oportunidad de"
       Centered horizontally, mid-vertical — fills the canvas with the
       turning-point statement. Single line at this size. */
		{
			id: "cuestionarlo-8",
			t: 20.86,
			dur: 2.1,
			idx: "cuestionarlo",
			els: [{ id: "l8", text: "Pero es ahí donde se nos brinda la oportunidad de", size: "l", x: "50%", y: "50%", a: "cc", z: 10 }],
		},
		/* W 22.96–23.66  "cuestionar" — l8 exits left, words accumulate  */
		{
			id: "cuestionarlo-9",
			t: 22.96,
			dur: 0.7,
			idx: "cuestionarlo",
			els: [
				{
					id: "q1",
					type: "photo",
					src: "assets/images/cuestionar.png",
					x: "49.83%",
					y: "51.58%",
					a: "cc",
					w: "20.5vw",
					h: "65.8vh",
				},
				{ id: "l9a", text: "cuestionar", size: "l", x: "11.64vw", y: "52.15%", a: "bl", z: 10 },
			],
		},
		/* W 23.66–24.54  "combinar" — builds alongside "cuestionar"      */
		{
			id: "cuestionarlo-10",
			t: 23.66,
			dur: 0.88,
			idx: "cuestionarlo",
			els: [{ id: "l9b", text: "combinar", size: "l", x: "50%", y: "52.15%", a: "bc", z: 1 }],
		},
		/* W 24.54–25.80  "y crear algo nuevo." — phrase complete          */
		{
			id: "cuestionarlo-11",
			t: 24.54,
			dur: 1.26,
			idx: "cuestionarlo",
			els: [
				{
					id: "q2",
					type: "photo",
					src: "assets/images/crear algo nuevo.png",
					x: "50%",
					y: "50%",
					a: "cc",
					w: "26vw",
					h: "65.13vh",
					z: 3,
				},
				{ id: "l9a", text: "cuestionar", size: "l", x: "7.99vw", y: "51.12%", a: "bl", z: 10, mute: true },
				{ id: "l9b", text: "combinar", size: "l", x: "50%", y: "50.63%", a: "bc", z: 10, mute: true },
				{ id: "l9c", text: "y crear algo nuevo.", size: "l", x: "87.76vw", y: "52.15%", a: "br", z: 10 },
			],
		},

		/* 3 · LEARN BY DOING ───────────────────────────────────────────
       W 25.80–27.0  "Learn by doing."                               */
		{
			id: "learn-1",
			t: 25.8,
			dur: 1.2,
			idx: "learn",
			els: [{ id: "l10a", text: "Learn by doing.", size: "xl", x: "50%", y: "48.86%", a: "cc", anim: "typewriter", twDur: 1.2 }],
		},
		/* W 27.0–28.52  "Si no sabes por dónde empezar,"
		   Texto solo — l10a sube al entrar l10b (shift-position). */
		{
			id: "learn-2",
			t: 27.0,
			dur: 1.52,
			idx: "learn",
			els: [
				{ id: "l10a", text: "Learn by doing.", size: "xl", x: "50%", y: "41%", a: "cc", anim: "shift-position" },
				{ id: "l10b", text: "Si no sabes por dónde empezar,", size: "xl", x: "50%", y: "51.82%", a: "cc" },
			],
		},
		/* W 28.52–28.78  "empieza"
		   Texto solo — l10a persiste arriba, l10c "empieza" entra debajo. */
		{
			id: "learn-3",
			t: 28.52,
			dur: 0.26,
			idx: "learn",
			els: [
				{ id: "l10a", text: "Learn by doing.", size: "xl", x: "50%", y: "41%", a: "cc" },
				{ id: "l10c", text: "empieza", size: "xl", x: "50%", y: "51.57%", a: "cc" },
			],
		},
		/* W 28.78–29.76  "haciendo."
		   Imagen entra full-bleed → encuadre (bleed-to-frame 0.62s).
		   "haciendo." blanco puro, inmóvil. */
		{
			id: "learn-3b",
			t: 28.78,
			dur: 0.98,
			idx: "learn",
			els: [
				{
					id: "phL0",
					type: "photo",
					src: "assets/images/haciendo.png",
					x: "50%",
					y: "50%",
					a: "cc",
					w: "53.69vw",
					h: "55.92vh",
					anim: "bleed-to-frame",
					bleedDur: 0.62,
					z: 1,
				},
				{ id: "l10d", text: "haciendo.", size: "xl", x: "50%", y: "50%", a: "cc", white: true },
			],
		},
		/* W 29.76–31.76  "Encaja todas las piezas necesarias."
       notebook-sketch: cuaderno abierto cenital — empieza haciendo */
		{
			id: "learn-4",
			t: 29.76,
			dur: 2.0,
			idx: "learn",
			els: [
				{
					id: "phL1",
					type: "photo",
					src: "assets/images/encaja las piezas.png",
					x: "19.85vw",
					y: "58.2%",
					a: "cc",
					w: "25.69vw",
					h: "63.61vh",
				},
				{ id: "l11a", text: "Encaja todas las piezas necesarias.", size: "l", x: "6.97vw", y: "20.34%", a: "tl" },
			],
		},
		/* W 31.76–34.70  "Observa desde lejos y piensa en cómo mejorarlo."
       feedback-talk: manos sobre escritorio diseñando wireframes — observar y rehacer */
		{
			id: "learn-5",
			t: 31.76,
			dur: 1.24,
			idx: "learn",
			els: [
				{
					id: "phL2",
					type: "photo",
					src: "assets/images/observa desde lejos.png",
					x: "50vw",
					y: "58.77%",
					a: "cc",
					w: "22.57vw",
					h: "63.31vh",
				},
				{ id: "l11b", text: "Observa desde lejos y", size: "l", x: "49.99vw", y: "24.44%", a: "cc" },
			],
		},
		/* W 33.0–34.70  "piensa en cómo mejorarlo." — text updates in same position */
		{
			id: "learn-6",
			t: 33.0,
			dur: 1.7,
			idx: "learn",
			els: [
				{
					id: "phL2",
					type: "photo",
					src: "assets/images/observa desde lejos.png",
					x: "50vw",
					y: "58.5%",
					a: "cc",
					w: "22.57vw",
					h: "63.31vh",
				},
				{ id: "l11b", text: "piensa en cómo mejorarlo.", size: "l", x: "50.02vw", y: "22.58%", a: "cc" },
			],
		},
		/* W 34.70–36.02  "Vuelve a intentarlo." — full-bleed feedback-talk */
		{
			id: "learn-7",
			t: 34.7,
			dur: 1.32,
			idx: "learn",
			els: [
				{
					id: "phL3",
					type: "photo",
					src: "assets/images/vuelve a intentarlo.png",
					x: "82.13%",
					y: "58.78%",
					a: "cc",
					w: "25.64vw",
					h: "62.75vh",
				},
				{ id: "l11c", text: "Vuelve a intentarlo.", size: "l", x: "86.93%", y: "23.3%", a: "cc", z: 10 },
			],
		},

		/* 4 · UCD REAL ─────────────────────────────────────────────────
       W 36.02–38.66  "User-centered design real."                   */
		{
			id: "ucd-1",
			t: 36.02,
			dur: 2.64,
			idx: "ucd",
			els: [{ id: "l12", text: "User-centered design real.", size: "xl", x: "50%", y: "50%", a: "cc" }],
		},
		/* W 38.66–39.90  "Sal ahí fuera y pregunta."                   */
		{
			id: "ucd-2",
			t: 38.66,
			dur: 1.24,
			idx: "ucd",
			els: [
				{
					id: "phU1",
					type: "photo",
					src: "assets/images/sal ahi fuera.png",
					x: "50vw",
					y: "50%",
					a: "cc",
					w: "min(56vw, 618px)",
					h: "calc(min(56vw, 618px) * 0.777)",
				},
				{ id: "l13a", text: "Sal ahí fuera y pregunta.", size: "l", x: "9.49vw", y: "50%", a: "cl" },
			],
		},
		/* W 39.90–42.20  "No asumas, contrástalo con datos."            */
		{
			id: "ucd-3",
			t: 39.9,
			dur: 2.3,
			idx: "ucd",
			els: [
				{
					id: "phU1",
					type: "photo",
					src: "assets/images/sal ahi fuera.png",
					x: "72vw",
					y: "56%",
					a: "cc",
					w: "min(56vw, 618px)",
					h: "calc(min(56vw, 618px) * 0.777)",
					mute: true,
				},
				{ id: "l13a", text: "Sal ahí fuera y pregunta.", size: "l", x: "5vw", y: "66%", a: "cl", mute: true },
				{ id: "l13b", text: "No asumas, contrástalo con datos.", size: "l", x: "50%", y: "50%", a: "cc" },
			],
		},
		/* W 42.20–45.16  "Comparte, haz partícipe y perfecciona."       */
		{
			id: "ucd-4",
			t: 42.2,
			dur: 2.96,
			idx: "ucd",
			els: [
				{
					id: "phU2",
					type: "photo",
					src: "assets/images/comparte.png",
					x: "50vw",
					y: "50%",
					a: "cc",
					w: "min(26vw, 418px)",
					h: "calc(min(26vw, 418px) * 1.5)",
				},
				{ id: "l13a", text: "Sal ahí fuera y pregunta.", size: "l", x: "5vw", y: "66%", a: "cl", mute: true },
				{ id: "l13b", text: "No asumas, contrástalo con datos.", size: "l", x: "50%", y: "50%", a: "cc", mute: true },
				{ id: "l13c", text: "Comparte, haz partícipe y perfecciona.", size: "l", x: "97.18vw", y: "50%", a: "cr" },
			],
		},

		/* 5 · EL COSQUILLEO ────────────────────────────────────────────
       W 45.16–46.30  "Sobre todo,"                                  */
		{
			id: "cosquilleo-1",
			t: 45.16,
			dur: 1.14,
			idx: "cosquilleo",
			els: [{ id: "l14", text: "Sobre todo,", size: "xl", x: "50%", y: "50%", a: "cc", anim: "typewriter", twDur: 1.14 }],
		},
		/* W 46.30–47.12  "crea." — the imperative drops like a stamp.    */
		{
			id: "cosquilleo-2",
			t: 46.3,
			dur: 0.82,
			idx: "cosquilleo",
			els: [{ id: "l15", text: "crea.", size: "xxl", x: "50%", y: "50%", a: "cc", anim: "stamp-drop" }],
		},
		/* W 47.12–51.58  "Crea productos que sorprendan…"
       Adrián lands first (milliseconds), then text expands outward from
       behind him — as if the words radiated from his head. Photo z=10,
       text z=5 so phrases peek out around the silhouette. */
		{
			id: "cosquilleo-3",
			t: 47.12,
			dur: 4.46,
			idx: "cosquilleo",
			els: [
				{
					id: "phC1",
					type: "photo",
					src: "assets/images/crea productos.png",
					x: "49.99%",
					y: "50.01%",
					a: "cc",
					w: "34vw",
					h: "calc(min(34vw, 706px) * 1.072)",
					anim: "fast-photo-pop",
					z: 10,
					cutout: true,
				},
				{
					id: "l16a",
					text: "Crea productos que sorprendan,",
					size: "l",
					x: "31.84%",
					y: "50.08%",
					a: "bc",
					anim: "expand-from-head",
					z: 3,
				},
				{
					id: "l16b",
					text: "que se adelanten a las expectativas del usuario.",
					size: "l",
					x: "74.05%",
					y: "45.56%",
					a: "tc",
					anim: "expand-from-head",
					z: 3,
				},
			],
		},
		/* W 51.58–52.5  "La gente no sabe lo que quiere…"
       Quote enters in resonance — centered, slight scale expansion. The
       text holds the room before Jobs arrives to push it aside. */
		{
			id: "cosquilleo-4",
			t: 51.58,
			dur: 0.92,
			idx: "cosquilleo",
			els: [
				{
					id: "l17",
					text: '"La gente no sabe lo que quiere\nhasta que se lo enseñas",',
					size: "xl",
					x: "50%",
					y: "50%",
					a: "cc",
					anim: "expand-from-center",
				},
			],
		},
		/* W 52.5–55.28  Camera-pan beat. Quote slides left, photo enters from
       right, then "decía Jobs." swipes up with fade once the image has landed. */
		{
			id: "cosquilleo-5",
			t: 52.5,
			dur: 2.78,
			idx: "cosquilleo",
			els: [
				{
					id: "phC2",
					type: "photo",
					src: "assets/images/steve jobs.png",
					x: "63.18vw",
					y: "50.65%",
					a: "cc",
					w: "28vw",
					h: "71.77vh",
					anim: "push-from-right",
				},
				{
					id: "l17",
					text: '"La gente no sabe lo que quiere\nhasta que se lo enseñas",',
					size: "xl",
					x: "-61.08vw",
					y: "51.15%",
					a: "cl",
					anim: "shift-position",
				},
				{ id: "l17b", text: "decía Jobs.", size: "l", x: "60.26vw", y: "90.04%", a: "cl", anim: "swipe-up", enterDelay: 1.5 },
			],
		},
		/* W 55.28–56.88  "No tengas miedo a crearlo."                   */
		{
			id: "cosquilleo-7",
			t: 55.28,
			dur: 1.6,
			idx: "cosquilleo",
			els: [
				{
					id: "phC3",
					type: "photo",
					src: "assets/images/no tengas miedo.png",
					x: "57%",
					y: "50%",
					a: "cc",
					w: "min(45vw, 600px)",
					h: "calc(min(45vw, 600px) * 0.637)",
				},
				{ id: "l18a", text: "No tengas miedo a crearlo,", size: "l", x: "9.25vw", y: "50%", a: "cl" },
			],
		},
		/* W 56.88–57.66  "Cuando algo funciona,"                        */
		{
			id: "cosquilleo-8",
			t: 56.88,
			dur: 0.78,
			idx: "cosquilleo",
			els: [{ id: "l18b", text: "Cuando algo funciona,", size: "l", x: "37.05%", y: "50%", a: "cc" }],
		},
		/* W 57.66–60.96  "esa sensación de cosquilleo te recorrerá la piel." */
		{
			id: "cosquilleo-9",
			t: 57.66,
			dur: 3.3,
			idx: "cosquilleo",
			els: [
				{
					id: "phC4",
					type: "photo",
					src: "assets/images/cosquilleo.png",
					x: "66.62%",
					y: "50.38%",
					a: "cc",
					w: "24vw",
					h: "65.27vh",
				},
				{ id: "l19", text: "esa sensación de cosquilleo te recorrerá la piel.", size: "l", x: "65.9%", y: "49.7%", a: "cc" },
			],
		},

		/* 6 · ENDING ───────────────────────────────────────────────────
       W 60.96–62.0  "Nadie me lo ha pedido." — text on a clean canvas */
		{
			id: "cosquilleo-10",
			t: 60.96,
			dur: 1.04,
			idx: "cosquilleo",
			mutedIdx: true,
			els: [{ id: "l20", text: "Nadie me lo ha pedido.", size: "xl", x: "50.05%", y: "44.75%", a: "cc" }],
		},
		/* W 62.0–63.82  "Tampoco lo he esperado…" + envelope tossed in.
       Second phrase arrives, then the envelope slides up from below the
       canvas — fully visible throughout its travel. Lands overlapping
       the second line, with the natural "thrown on a table" settle. */
		{
			id: "cosquilleo-11",
			t: 62.0,
			dur: 1.82,
			idx: "cosquilleo",
			mutedIdx: true,
			els: [
				{ id: "l20", text: "Nadie me lo ha pedido.", size: "xl", x: "50%", y: "37.54%", a: "cc" },
				{ id: "l20b", text: "Tampoco lo he esperado…", size: "xl", x: "50%", y: "47.82%", a: "cc" },
				{
					id: "phC5",
					type: "photo",
					src: "assets/images/nadie me lo ha pedido.png",
					x: "50%",
					y: "62%",
					a: "cc",
					w: "min(28vw, 540px)",
					h: "calc(min(28vw, 540px) * 1.194)",
					anim: "envelope-toss",
					z: 20,
					cutout: true,
				},
			],
		},
	];

	const TOTAL = 63.82;

	/* ── Image prefetch — fires while hero is visible, fills browser cache.
	     Iterates every spec with a src so the list never goes stale.
	     new Image() triggers a GET; the browser caches the response so when
	     pieza starts the images are already available — no blank frames. ── */
	(function prefetchImages() {
		const seen = new Set();
		for (const f of FRAMES) {
			for (const e of f.els || []) {
				if (e.src && !seen.has(e.src)) {
					seen.add(e.src);
					new Image().src = e.src;
				}
			}
		}
	})();

	const SECTIONS = [
		{ id: "incomodidad", label: "La incomodidad" },
		{ id: "cuestionarlo", label: "Cuestionarlo todo" },
		{ id: "learn", label: "Learn by doing" },
		{ id: "ucd", label: "UCD real" },
		{ id: "cosquilleo", label: "El cosquilleo" },
	];
	for (const s of SECTIONS) {
		const f = FRAMES.find((fr) => fr.idx === s.id);
		s.start = f ? f.t : 0;
	}
	const SECTION_ORDER = SECTIONS.map((s) => s.id);

	/* Stable rotation per card id — handoff: –5 to +5 deg max */
	const CARD_ROT = { ph1: -1.5, ph2: 0.8, c1: -2.5, c2: 3.0, c3: -1.5, c4: 2.0, c5: -1.0 };

	/* xPercent/yPercent let GSAP own the full transform stack.
     This prevents CSS translate() being wiped when GSAP sets y/scale. */
	const ANCHOR = {
		cc: { xp: -50, yp: -50 },
		cl: { xp: 0, yp: -50 },
		cr: { xp: -100, yp: -50 },
		tl: { xp: 0, yp: 0 },
		tc: { xp: -50, yp: 0 },
		tr: { xp: -100, yp: 0 },
		bl: { xp: 0, yp: -100 },
		bc: { xp: -50, yp: -100 },
		br: { xp: -100, yp: -100 },
	};

	/* ── Audio engine ── */
	const audio = new Audio("assets/voice-off.m4a");
	audio.preload = "auto";

	/* ── Refs ── */
	const root = document.getElementById("nextScene");
	const sceneEl = root.querySelector(".pieza-scene");
	const indexEl = root.querySelector(".pieza-index");
	const brandBg = root.querySelector(".brand-bg");
	const entries = [...indexEl.querySelectorAll(".entry")];
	const pauseBtn = root.querySelector("#piezaPauseBtn");
	const pauseIcon = root.querySelector("#piezaPauseIcon");
	const audioBtn = root.querySelector(".audio-toggle");
	const audioIcon = root.querySelector("#piezaAudioIcon");
	const progressTrack = root.querySelector(".pieza-progress-track");

	/* ── Flash overlay (200ms white between hard-cut scenes) ── */
	const flashEl = document.createElement("div");
	flashEl.className = "pieza-flash";
	root.querySelector(".pieza-container").appendChild(flashEl);
	function flash() {
		gsap.killTweensOf(flashEl);
		gsap.set(flashEl, { autoAlpha: 0 });
		gsap.to(flashEl, {
			autoAlpha: 1,
			duration: 0.08,
			ease: "power2.in",
			onComplete() {
				gsap.to(flashEl, { autoAlpha: 0, duration: 0.12, ease: "power2.out" });
			},
		});
	}

	const container = root.querySelector(".pieza-container");
	function setInverted(on) {
		container.classList.toggle("inverted", !!on);
	}

	/* ── Build scene DOM ── */
	const allSpecs = new Map();
	for (const f of FRAMES) for (const e of f.els || []) if (!allSpecs.has(e.id)) allSpecs.set(e.id, e);

	const dom = new Map();
	for (const [id, spec] of allSpecs) {
		const el = document.createElement("div");
		/* Photos and placeholders share the placeholder render while
       USE_PLACEHOLDERS is true — keeps the timeline data intact. */
		const renderAsPhoto = spec.type === "photo" && !USE_PLACEHOLDERS;
		el.className =
			spec.type === "gradient"
				? "viz placeholder grad"
				: spec.type === "placeholder"
					? "viz placeholder"
					: renderAsPhoto
						? "viz photo" + (spec.cutout ? " cutout" : "")
						: spec.type === "photo"
							? "viz placeholder"
							: "line size-" + (spec.size || "l");
		el.dataset.id = id;
		sceneEl.appendChild(el);
		gsap.set(el, { autoAlpha: 0 }); /* GSAP owns visibility from the start */
		dom.set(id, el);
	}

	/* ── Apply spec to element (position, size, text, muted — no animation) ── */
	function applyEl(el, spec) {
		const { xp, yp } = ANCHOR[spec.a || "cc"];
		/* Set anchor via GSAP so it stacks correctly with y/scale tweens */
		gsap.set(el, { xPercent: xp, yPercent: yp });
		/* Defer left/top/size when we're animating from full-bleed into a frame */
		if (!isBleedToFrame(spec)) {
			el.style.left = spec.x;
			el.style.top = spec.y;
			if (spec.w) el.style.width = spec.w;
			if (spec.h) el.style.height = spec.h;
		} else {
			/* leave left/top/width/height for enterEl to animate from full-bleed */
		}
		if (spec.size) el.className = el.className.replace(/\s?size-\w+/g, "") + " size-" + spec.size;
		if (spec.text !== undefined) {
			const html = String(spec.text).replace(/\n/g, "<br>");
			if (el.innerHTML !== html) el.innerHTML = html;
		}
		if (spec.mute) el.classList.add("muted");
		else el.classList.remove("muted");
		if (spec.diff) el.classList.add("diff");
		else el.classList.remove("diff");
		if (spec.white) el.classList.add("white");
		else el.classList.remove("white");
		el.style.zIndex = spec.z != null ? spec.z : 5;
		/* Skip backgroundImage while placeholders are global */
		if (spec.src && !USE_PLACEHOLDERS) el.style.backgroundImage = `url('${spec.src}')`;
	}

	/* Parallax token — slow drift inside the frame creates the window-depth
     illusion. The image is slightly larger than the frame (cover scale),
     so panning the background creates parallax against the frame edges. */
	function startParallax(el) {
		if (USE_PLACEHOLDERS) return;
		gsap.killTweensOf(el, "backgroundPosition,backgroundSize");
		gsap.fromTo(
			el,
			{ backgroundSize: "108%", backgroundPosition: "50% 55%" },
			{ backgroundSize: "122%", backgroundPosition: "50% 45%", duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true },
		);
	}

	function isBleedToFrame(spec) {
		return spec.anim === "bleed-to-frame";
	}

	function resolveLengthPx(value, axis) {
		if (value == null) return null;
		if (typeof value === "number") return value;
		const raw = String(value).trim();
		const vwMatch = raw.match(/^([\d.]+)vw$/i);
		if (vwMatch) return (parseFloat(vwMatch[1]) / 100) * window.innerWidth;
		const vhMatch = raw.match(/^([\d.]+)vh$/i);
		if (vhMatch) return (parseFloat(vhMatch[1]) / 100) * window.innerHeight;
		const pxMatch = raw.match(/^([\d.]+)px$/i);
		if (pxMatch) return parseFloat(pxMatch[1]);
		const minMatch = raw.match(/^min\(([-\d.]+)vw,\s*([\d.]+)px\)$/i);
		if (minMatch) {
			const vwPx = (parseFloat(minMatch[1]) / 100) * window.innerWidth;
			const px = parseFloat(minMatch[2]);
			return Math.min(vwPx, px);
		}
		const calcMinMatch = raw.match(/^calc\(min\(([-\d.]+)vw,\s*([\d.]+)px\)\s*\*\s*([\d.]+)\)$/i);
		if (calcMinMatch) {
			const vwPx = (parseFloat(calcMinMatch[1]) / 100) * window.innerWidth;
			const px = parseFloat(calcMinMatch[2]);
			const ratio = parseFloat(calcMinMatch[3]);
			return Math.min(vwPx, px) * ratio;
		}
		/* Fallback: treat as px number if possible */
		const num = parseFloat(raw);
		return Number.isFinite(num) ? num : null;
	}

	function isSoftSwipe(spec) {
		return spec.anim === "swipe-left-soft";
	}

	/* ── GSAP transition helpers ── */
	function enterEl(el, spec, delay) {
		gsap.killTweensOf(el);
		delay = (delay || 0) + (spec.enterDelay || 0);
		const rot = CARD_ROT[spec.id] || 0;

		/* Typewriter — character-by-character reveal synced to audio duration.
		   TextPlugin types into .tw-text; .tw-cursor blinks while typing then fades. */
		if (spec.anim === "typewriter") {
			const full = String(spec.text || "");
			gsap.set(el, { autoAlpha: 1 });
			el.innerHTML = '<span class="tw-text"></span><span class="tw-cursor">|</span>';
			const textSpan = el.querySelector(".tw-text");
			const cursorSpan = el.querySelector(".tw-cursor");
			const dur = spec.twDur || 2;
			/* Cursor blinks while typing */
			gsap.to(cursorSpan, { opacity: 0, duration: 0.5, ease: "steps(1)", repeat: -1, yoyo: true });
			/* Characters appear at audio pace */
			gsap.to(textSpan, {
				duration: dur,
				delay,
				ease: "none",
				text: { value: full, delimiter: "" },
				onComplete() {
					gsap.killTweensOf(cursorSpan);
					gsap.to(cursorSpan, { opacity: 0, duration: 0.4, delay: 0.5 });
				},
			});
			return;
		}

		/* ── Motion tokens (anim:'...') ── */
		if (spec.anim === "fast-photo-pop") {
			/* Photo lands quickly with a tiny scale-up — used before paired
         text expansion. Parallax kicks in during the pop, not after. */
			gsap.fromTo(el, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.32, delay, ease: "power2.out" });
			if (!spec.cutout) startParallax(el);
			return;
		}
		if (spec.anim === "expand-from-head") {
			/* Cortinilla simétrica: parte completamente oculta (50% desde cada lado)
			   y se abre hacia los bordes. La foto aterriza primero (delay + 0.22),
			   luego el texto emerge desde el centro. */
			gsap.set(el, { autoAlpha: 1, clipPath: "inset(0 50% 0 50%)" });
			gsap.to(el, {
				clipPath: "inset(0 0% 0 0%)",
				duration: 0.75,
				delay: delay + 0.22,
				ease: "power2.inOut",
				onComplete() {
					el.style.clipPath = "";
				},
			});
			return;
		}
		if (spec.anim === "stamp-drop") {
			/* Used for the single most weighty word of the piece — lands like
         a stamp on paper. Slight overshoot at the end seals the impact. */
			gsap.fromTo(el, { autoAlpha: 0, scale: 1.35 }, { autoAlpha: 1, scale: 1, duration: 0.5, delay, ease: "back.out(1.4)" });
			return;
		}
		if (spec.anim === "expand-from-center") {
			/* Quote-style entry — text appears at center with a subtle scale
         expansion. Resonance, not impact. */
			gsap.fromTo(el, { autoAlpha: 0, scale: 0.88 }, { autoAlpha: 1, scale: 1, duration: 0.55, delay, ease: "power3.out" });
			return;
		}
		if (spec.anim === "push-from-right") {
			/* Image enters from off-screen right, pushing toward its final
         position. Pairs with a left-shifting text element. */
			gsap.fromTo(
				el,
				{ autoAlpha: 0, x: 180 },
				{
					autoAlpha: 1,
					x: 0,
					duration: 0.85,
					delay,
					ease: "power3.out",
					onComplete() {
						if (spec.type === "photo") startParallax(el);
					},
				},
			);
			return;
		}
		if (spec.anim === "envelope-toss") {
			/* Envelope is fully visible during its travel — opacity stays 1.
         Slides up from below the canvas, with a slight tilt that settles
         to neutral. Custom ease creates the "tossed on a table" feel. */
			gsap.set(el, { autoAlpha: 1, y: window.innerHeight * 0.7, rotation: -3.5 });
			gsap.to(el, {
				y: 0,
				rotation: 0,
				duration: 1.35,
				delay,
				ease: "back.out(0.7)",
				onComplete() {
					if (!spec.cutout) startParallax(el);
				},
			});
			return;
		}
		if (spec.anim === "bleed-pullback") {
			/* Storyboard: image enters scaled up (suggesting bleed) + fades in,
         then settles into its framed size while parallax zoom continues
         the inner motion. When real photography lands, swap this for a
         literal width/height tween from 100vw/100vh to the spec frame. */
			gsap.fromTo(
				el,
				{ autoAlpha: 0, scale: 1.18 },
				{
					autoAlpha: 1,
					scale: 1,
					duration: 1.4,
					delay,
					ease: "expo.out",
					onComplete() {
						startParallax(el);
					},
				},
			);
			return;
		}
		if (spec.anim === "bleed-to-frame") {
			const targetWidth = resolveLengthPx(spec.w || "min(96vw, 1150px)", "width") || window.innerWidth;
			const targetHeight = resolveLengthPx(spec.h || "calc(min(96vw, 1150px) * 0.7565)", "height") || window.innerHeight;
			const { xp, yp } = ANCHOR[spec.a || "cc"];
			/* Start centered full-bleed, then animate to framed left/top + anchor */
			gsap.set(el, {
				autoAlpha: 1,
				width: "100vw",
				height: "100vh",
				scale: 1.06,
				left: "50%",
				top: "50%",
				xPercent: -50,
				yPercent: -50,
			});
			gsap.to(el, {
				width: targetWidth,
				height: targetHeight,
				scale: 1,
				left: spec.x,
				top: spec.y,
				xPercent: xp,
				yPercent: yp,
				duration: spec.bleedDur || 1.5,
				delay,
				ease: "power3.out",
				onComplete() {
					el.style.width = `${targetWidth}px`;
					el.style.height = `${targetHeight}px`;
					el.style.left = spec.x;
					el.style.top = spec.y;
					/* Persist final percent offsets */
					gsap.set(el, { xPercent: xp, yPercent: yp });
				},
			});
			/* Parallax starts during the bleed — window-depth feeling is
         present from the first moment, not after the frame settles. */
			startParallax(el);
			return;
		}
		if (spec.anim === "swipe-right") {
			gsap.fromTo(
				el,
				{ autoAlpha: 0.0, x: 120 },
				{
					autoAlpha: 1,
					x: 0,
					duration: 0.6,
					delay,
					ease: "expo.out",
					onComplete() {
						if (spec.type === "photo") startParallax(el);
					},
				},
			);
			return;
		}
		if (spec.anim === "swipe-left-soft") {
			gsap.fromTo(el, { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: -42, duration: 0.36, delay, ease: "power2.inOut" });
			return;
		}
		if (spec.anim === "swipe-up") {
			gsap.fromTo(el, { autoAlpha: 0.0, y: 44 }, { autoAlpha: 1, y: 0, duration: 0.52, delay, ease: "expo.out" });
			return;
		}
		if (spec.anim === "fast-cut") {
			gsap.set(el, { autoAlpha: 1, x: 0, y: 0, scale: 1 });
			return;
		}
		if (spec.anim === "behind-cut") {
			/* Aparece detrás de imágenes del frame anterior.
			   setTimeout en lugar de gsap delay porque el ticker de GSAP duerme
			   cuando no hay animaciones activas y los tweens pendientes no se ejecutan. */
			gsap.set(el, { autoAlpha: 0, x: 0, y: 0, scale: 1 });
			const _el = el;
			setTimeout(
				() => {
					gsap.set(_el, { autoAlpha: 1 });
				},
				Math.round((delay + 0.28) * 1000),
			);
			return;
		}

		if (spec.type === "placeholder") {
			/* Collage card entrance — handoff §6 */
			gsap.fromTo(
				el,
				{ autoAlpha: 0, scale: 0.88, y: 50, rotation: rot * 2 },
				{
					autoAlpha: 1,
					scale: 1,
					y: 0,
					rotation: rot,
					duration: 0.7,
					delay,
					ease: "power3.out",
					onComplete() {
						startParallax(el);
					},
				},
			);
		} else if (spec.type === "gradient") {
			gsap.fromTo(el, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.7, delay, ease: "power3.out" });
		} else if (spec.type === "photo") {
			/* Enter from the side the photo lives on; center photos read x to decide */
			const a = spec.a || "cc";
			const fromX = a.endsWith("l") ? -64 : a.endsWith("r") ? 64 : parseFloat(spec.x || "50") < 50 ? -64 : 64;
			gsap.fromTo(el, { autoAlpha: 0, scale: 0.97, x: fromX }, { autoAlpha: 1, scale: 1, x: 0, duration: 0.45, delay, ease: "power2.out" });
		} else if (spec.anim === "typewriter-left") {
			/* TextPlugin types chars smoothly; clipPath wipes the reveal left→right */
			const full = el.textContent;
			el.textContent = "";
			gsap.set(el, { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
			const twDur = Math.max(full.length * 0.07, 0.6);
			gsap.to(el, {
				clipPath: "inset(0 0% 0 0)",
				duration: twDur,
				delay,
				ease: "none",
				onComplete() {
					el.style.clipPath = "";
				},
			});
			gsap.to(el, { duration: twDur, delay, text: { value: full, delimiter: "" }, ease: "none" });
		} else {
			/* Text enters along its spatial rail — mirrors the exit direction */
			const a = spec.a || "cc";
			const fromX = a.endsWith("l") ? -44 : a.endsWith("r") ? 44 : 0;
			const fromY = fromX !== 0 ? 0 : 24;
			gsap.fromTo(el, { autoAlpha: 0, x: fromX, y: fromY }, { autoAlpha: 1, x: 0, y: 0, duration: 0.42, delay, ease: "power2.out" });
		}
	}

	/* FLIP-style transition for elements that persist between frames but
     change position. Captures old screen rect, applies new spec, then
     animates the delta with GSAP transforms. */
	function transitionEl(el, spec, delay, oldRect) {
		const newRect = el.getBoundingClientRect();
		const dx = oldRect.left - newRect.left;
		const dy = oldRect.top - newRect.top;
		if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return; /* no real change */
		gsap.killTweensOf(el, "x,y");
		const tr = spec.transition && typeof spec.transition === "object" ? spec.transition : null;
		let duration = spec.anim === "shift-position" ? 0.85 : 0.6;
		let ease = spec.anim === "shift-position" ? "power3.inOut" : "power2.inOut";
		if (tr) {
			if (tr.duration != null) {
				const parsed = Number.parseFloat(tr.duration);
				if (Number.isFinite(parsed)) duration = parsed;
			}
			if (typeof tr.ease === "string" && tr.ease.trim()) ease = tr.ease.trim();
		}
		gsap.fromTo(el, { x: dx, y: dy }, { x: 0, y: 0, duration, delay, ease });
	}

	function exitEl(el) {
		gsap.killTweensOf(el);
		const spec = allSpecs.get(el.dataset.id);
		/* Visuals hard-cut — they're large, movement would distract */
		if (!spec || spec.type === "photo" || spec.type === "placeholder" || spec.type === "gradient") {
			gsap.set(el, { autoAlpha: 0 });
			return;
		}
		if (spec.anim === "swipe-left-soft") {
			gsap.to(el, { autoAlpha: 0, x: -42, duration: 0.24, ease: "power2.inOut" });
			return;
		}
		/* Text exits along its spatial rail */
		const a = spec.a || "cc";
		if (a.endsWith("l")) gsap.to(el, { autoAlpha: 0, x: -44, duration: 0.24, ease: "power2.in" });
		else if (a.endsWith("r")) gsap.to(el, { autoAlpha: 0, x: 44, duration: 0.24, ease: "power2.in" });
		else gsap.to(el, { autoAlpha: 0, y: -24, duration: 0.24, ease: "power2.in" });
	}

	/* ══════════════════════════════════
     TOC — persistent shown state
  ══════════════════════════════════ */
	const shownSections = new Set();

	function updateIndex(f) {
		const activeId = f.idx;
		const activeIdx = activeId ? SECTION_ORDER.indexOf(activeId) : -1;

		if (activeIdx >= 0) for (let i = 0; i <= activeIdx; i++) shownSections.add(SECTION_ORDER[i]);

		entries.forEach((entry) => {
			const id = entry.dataset.id;
			const myIdx = SECTION_ORDER.indexOf(id);
			if (shownSections.has(id)) entry.classList.add("shown");
			if (myIdx === activeIdx && !f.mutedIdx) entry.classList.add("active");
			else entry.classList.remove("active");
		});
	}

	/* ── Segmented chapter progress ── */
	const segments = [];
	for (let i = 0; i < SECTIONS.length; i++) {
		const segEl = document.createElement("div");
		segEl.className = "pieza-segment";
		const fillEl = document.createElement("div");
		fillEl.className = "pieza-segment-fill";
		segEl.appendChild(fillEl);
		progressTrack.appendChild(segEl);
		const segStart = SECTIONS[i].start;
		const segEnd = i + 1 < SECTIONS.length ? SECTIONS[i + 1].start : TOTAL;
		segments.push({ fillEl, start: segStart, end: segEnd });
	}

	function updateProgress() {
		const t = audio.currentTime;
		for (const seg of segments) {
			const span = seg.end - seg.start;
			const pct = span <= 0 ? 0 : Math.min(1, Math.max(0, (t - seg.start) / span));
			seg.fillEl.style.transform = `scaleX(${pct})`;
		}
	}

	/* ── Frame renderer ── */
	let lastFrameIdx = -1;

	function renderAt(time) {
		let i = 0;
		for (let k = FRAMES.length - 1; k >= 0; k--) {
			if (time >= FRAMES[k].t) {
				i = k;
				break;
			}
		}
		if (i === lastFrameIdx) return; /* no frame change — skip */
		lastFrameIdx = i;

		const f = FRAMES[i];
		if (f.flash) flash();
		setInverted(!!f.invert);
		/* mute:true elements are fully hidden — treat as not present */
		const visible = new Set((f.els || []).filter((e) => !e.mute).map((e) => e.id));

		/* Hard cut exits */
		for (const [id, el] of dom) if (!visible.has(id)) exitEl(el);

		/* Animated enters + position updates */
		let staggerMs = 0;
		for (const spec of (f.els || []).filter((e) => !e.mute)) {
			const el = dom.get(spec.id);
			const isNew = gsap.getProperty(el, "autoAlpha") < 0.5;
			const shouldTransition = !isNew && (spec.anim || spec.transition);
			/* Capture position before applyEl moves the element — needed for FLIP */
			const oldRect = shouldTransition ? el.getBoundingClientRect() : null;
			applyEl(el, spec);
			if (isNew) {
				enterEl(el, spec, staggerMs / 1000);
				staggerMs += 70;
			} else if (oldRect) {
				transitionEl(el, spec, staggerMs / 1000, oldRect);
				staggerMs += 70;
			}
			/* Persisting elements without anim: applyEl already updated muted/position */
		}

		/* exitAfter — elements that linger briefly then fade out within the frame.
		   Guard with lastFrameIdx===i so stale timeouts don't fire after navigation. */
		const _capturedIdx = i;
		for (const spec of (f.els || []).filter((e) => !e.mute && e.exitAfter != null)) {
			const _el = dom.get(spec.id);
			setTimeout(() => {
				if (lastFrameIdx === _capturedIdx) gsap.to(_el, { autoAlpha: 0, duration: 0.3 });
			}, spec.exitAfter);
		}

		brandBg.classList.toggle("shown", !!f.brand);
		updateIndex(f);
	}

	/* ── rAF loop — reads audio.currentTime ── */
	function loop() {
		renderAt(audio.currentTime);
		updateProgress();
		requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);

	/* ── Playback icon helpers ── */
	const ICON_PAUSE = `
    <rect x="4"  y="3" width="3" height="10" rx="1" fill="currentColor"/>
    <rect x="9" y="3" width="3" height="10" rx="1" fill="currentColor"/>`;
	const ICON_PLAY = `
    <path d="M5 3l8 5-8 5V3z" fill="currentColor"/>`;

	const ICON_AUDIO_ON = `
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
		audio.muted = m;
		audioIcon.innerHTML = m ? ICON_AUDIO_OFF : ICON_AUDIO_ON;
		audioBtn.classList.toggle("muted", m);
	}

	function syncPauseIcon() {
		const playing = !audio.paused && !audio.ended;
		pauseIcon.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
		pauseBtn.setAttribute("aria-label", playing ? "Pause" : "Resume");
	}

	audio.addEventListener("play", syncPauseIcon);
	audio.addEventListener("pause", syncPauseIcon);
	audio.addEventListener("ended", syncPauseIcon);

	/* ── Pause/resume button ── */
	pauseBtn.addEventListener("click", () => {
		if (audio.ended || audio.currentTime >= TOTAL) {
			lastFrameIdx = -1;
			audio.currentTime = 0;
			audio.play().catch(() => {});
		} else if (audio.paused) {
			audio.play().catch(() => {});
		} else {
			audio.pause();
		}
	});

	/* ── Audio mute toggle ── */
	audioBtn.addEventListener("click", () => setAudioMuted(!audioMuted));

	/* ── Debug: click progress track to seek ── */
	progressTrack.addEventListener("click", (e) => {
		const rect = progressTrack.getBoundingClientRect();
		if (!rect.width) return;
		const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
		const target = TOTAL * pct;
		lastFrameIdx = -1;
		audio.currentTime = target;
		if (!audio.paused && !audio.ended) audio.play().catch(() => {});
	});

	/* ── TOC click → seek audio to section start ── */
	entries.forEach((entry) => {
		entry.addEventListener("click", () => {
			if (!entry.classList.contains("shown")) return;
			const section = SECTIONS.find((s) => s.id === entry.dataset.id);
			if (!section) return;
			lastFrameIdx = -1; /* force re-render at new position */
			audio.currentTime = section.start;
			if (audio.paused && !audio.ended) audio.play().catch(() => {});
		});
	});

	/* ── Scroll-up → back to hero ── */
	let wheelAccum = 0;
	root.addEventListener(
		"wheel",
		(e) => {
			if (e.deltaY < 0) {
				wheelAccum += Math.abs(e.deltaY);
				if (wheelAccum >= 80) {
					wheelAccum = 0;
					window.__heroGoBack && window.__heroGoBack();
				}
			} else {
				wheelAccum = 0;
			}
		},
		{ passive: true },
	);

	/* ── prefers-reduced-motion ── */
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		for (const [, el] of dom) gsap.set(el, { autoAlpha: 1, y: 0, scale: 1, rotation: 0, xPercent: -50, yPercent: -50 });
	}

	/* ── Public API ── */
	window.piezaStart = function () {
		audio.currentTime = 0;
		lastFrameIdx = -1;
		wheelAccum = 0;
		for (const [, el] of dom) {
			gsap.killTweensOf(el);
			gsap.set(el, { autoAlpha: 0, y: 0, scale: 1, rotation: 0 });
		}
		entries.forEach((e) => e.classList.remove("shown", "active"));
		shownSections.clear();
		brandBg.classList.remove("shown");
		setAudioMuted(false);
		audio.play().catch(() => {
			/* Unmuted autoplay blocked — retry muted so visuals still run */
			setAudioMuted(true);
			audio.play().catch(() => syncPauseIcon());
		});
		window.__setHeroScrollActive && window.__setHeroScrollActive(false);
	};

	window.piezaPause = function () {
		audio.pause();
		window.__setHeroScrollActive && window.__setHeroScrollActive(true);
	};

	/* ══════════════════════════════════
	   DEV MODE  — activated by ?dev in the URL
	   Skips hero, hides subs, injects a frame
	   navigator panel for fast layout review.
	   Not shipped to production.
	══════════════════════════════════ */
	if (new URLSearchParams(location.search).has("dev")) {
		const DEV_STORE_KEY = "pieza-dev-overrides-v1";
		let devStatusEl = null;
		let devStatusTimer = null;
		let devBox = null;
		let devShell = null;
		let devStage = null;
		let devStageInner = null;
		let devGrid = null;
		let devScale = 1;

		function devStatus(msg) {
			if (!devStatusEl) return;
			devStatusEl.textContent = msg || "";
			if (devStatusTimer) window.clearTimeout(devStatusTimer);
			if (msg) {
				devStatusTimer = window.setTimeout(() => {
					if (devStatusEl) devStatusEl.textContent = "";
				}, 1400);
			}
		}

		function trimFloat(n) {
			const s = Number(n).toFixed(2);
			return s.replace(/\.?0+$/, "");
		}

		function detectUnit(value) {
			if (typeof value !== "string") return null;
			const m = value.trim().match(/(vw|vh|%|px)$/i);
			return m ? m[1].toLowerCase() : null;
		}

		function formatLen(px, axis, unitHint) {
			const unit = unitHint || (axis === "x" || axis === "w" ? "vw" : "vh");
			if (unit === "px") return `${Math.round(px)}px`;
			const base = axis === "y" || axis === "h" ? window.innerHeight : window.innerWidth;
			const v = base ? (px / base) * 100 : 0;
			if (unit === "%") return `${trimFloat(v)}%`;
			if (unit === "vw") return `${trimFloat((px / window.innerWidth) * 100)}vw`;
			if (unit === "vh") return `${trimFloat((px / window.innerHeight) * 100)}vh`;
			return `${Math.round(px)}px`;
		}

		function unitsFor(spec) {
			return {
				x: detectUnit(spec.x) || "vw",
				y: detectUnit(spec.y) || "vh",
				w: detectUnit(spec.w) || "vw",
				h: detectUnit(spec.h) || "vh",
			};
		}

		function getPanelWidthPx() {
			const raw = getComputedStyle(document.documentElement).getPropertyValue("--dev-panel-w").trim();
			const num = Number.parseFloat(raw);
			return Number.isFinite(num) ? num : 280;
		}

		function loadOverrides() {
			try {
				const raw = localStorage.getItem(DEV_STORE_KEY);
				if (!raw) return { version: 1, frames: {} };
				const parsed = JSON.parse(raw);
				if (!parsed || typeof parsed !== "object") return { version: 1, frames: {} };
				if (!parsed.frames) parsed.frames = {};
				return parsed;
			} catch {
				return { version: 1, frames: {} };
			}
		}

		function saveOverrides(store) {
			try {
				store.updatedAt = new Date().toISOString();
				localStorage.setItem(DEV_STORE_KEY, JSON.stringify(store));
				devStatus("saved");
			} catch {
				devStatus("save failed");
			}
		}

		function applyOverrides(store) {
			for (const frameIdxStr of Object.keys(store.frames || {})) {
				const frameIdx = Number(frameIdxStr);
				const frame = FRAMES[frameIdx];
				if (!frame || !frame.els) continue;
				const frameOverrides = store.frames[frameIdxStr];
				for (const id of Object.keys(frameOverrides || {})) {
					const spec = frame.els.find((e) => e.id === id);
					if (!spec) continue;
					Object.assign(spec, frameOverrides[id]);
				}
			}
		}

		let devStore = loadOverrides();
		applyOverrides(devStore);

		/* Dev-only seek/render helpers — exposed for console use */
		window.__piezaSeek = function (t) {
			lastFrameIdx = -1;
			audio.currentTime = t;
		};
		window.__piezaRender = function (t) {
			lastFrameIdx = -1;
			renderAt(t);
		};

		/* 1. Skip hero — show pieza immediately */
		const ns = document.getElementById("nextScene");
		if (ns) {
			ns.style.opacity = "1";
			ns.style.pointerEvents = "all";
		}
		const heroEl = document.getElementById("hero");
		if (heroEl) heroEl.style.display = "none";
		window.__setHeroScrollActive && window.__setHeroScrollActive(false);

		devShell = document.createElement("div");
		devShell.id = "dev-shell";
		devStage = document.createElement("div");
		devStage.id = "dev-stage";
		devStageInner = document.createElement("div");
		devStageInner.id = "dev-stage-inner";
		devGrid = document.createElement("div");
		devGrid.id = "dev-grid";
		devShell.appendChild(devStage);
		devStage.appendChild(devStageInner);
		if (ns) {
			ns.style.position = "absolute";
			ns.style.inset = "0";
			ns.style.width = "100vw";
			ns.style.height = "100vh";
			devStageInner.appendChild(ns);
			devStageInner.appendChild(devGrid);
		}
		document.body.appendChild(devShell);

		/* 2. Hide subtitles */
		const subsEl = document.getElementById("piezaSubs");
		if (subsEl) subsEl.style.display = "none";

		/* 3. Render frame 0 paused */
		lastFrameIdx = -1;
		renderAt(0.01);
		audio.pause();
		syncPauseIcon();

		/* 4. Track current frame index for ← → navigation */
		let devFrameIdx = 0;
		let devFrameLabelEl = null;
		let devSelLabelEl = null;
		let devElementPickerEl = null;
		let devCanvasSizeEl = null;
		let devTextSizeEl = null;
		let devTextSizeRowEl = null;
		let devApplyAllEl = null;
		let devEditToggleEl = null;
		let devDeleteEl = null;
		let devInputXEl = null;
		let devInputYEl = null;
		let devInputWEl = null;
		let devInputHEl = null;
		let devInputZEl = null;
		let devMotionAEl = null;
		let devMotionBEl = null;
		let devMotionEl = null;
		let devMotionDurationEl = null;
		let devMotionEaseEl = null;
		let devMotionApplyEl = null;
		let devMotionClearEl = null;
		let devMotionPreviewEl = null;

		const devState = {
			editOn: false,
			applyAll: false,
			selectedEl: null,
			selectedSpec: null,
			units: null,
			canResize: false,
			drag: null,
		};

		const SPEC_KEYS = ["x", "y", "w", "h", "size", "mute", "z", "transition"];
		const devHistory = [];
		const devRedo = [];
		const HISTORY_LIMIT = 200;

		function isEditableTarget(target) {
			if (!target || target === document.body) return false;
			if (target.isContentEditable) return true;
			const tag = target.tagName;
			return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
		}

		function snapshotSpec(spec) {
			const snap = {};
			for (const key of SPEC_KEYS) {
				if (Object.prototype.hasOwnProperty.call(spec, key)) {
					const value = spec[key];
					if (value && typeof value === "object") snap[key] = JSON.parse(JSON.stringify(value));
					else snap[key] = value;
				}
			}
			return snap;
		}

		function applySnapshot(spec, snap) {
			for (const key of SPEC_KEYS) {
				if (Object.prototype.hasOwnProperty.call(snap, key)) {
					const value = snap[key];
					if (value && typeof value === "object") spec[key] = JSON.parse(JSON.stringify(value));
					else spec[key] = value;
				} else delete spec[key];
			}
		}

		function snapsEqual(a, b) {
			for (const key of SPEC_KEYS) {
				const aHas = Object.prototype.hasOwnProperty.call(a, key);
				const bHas = Object.prototype.hasOwnProperty.call(b, key);
				if (aHas !== bHas) return false;
				if (aHas) {
					const av = a[key];
					const bv = b[key];
					if ((av && typeof av === "object") || (bv && typeof bv === "object")) {
						if (JSON.stringify(av) !== JSON.stringify(bv)) return false;
					} else if (av !== bv) return false;
				}
			}
			return true;
		}

		function applyOverrideSnapshot(frameIdx, id, snap) {
			if (!devStore.frames[frameIdx]) devStore.frames[frameIdx] = {};
			const entry = devStore.frames[frameIdx][id] || {};
			let hasAny = false;
			for (const key of SPEC_KEYS) {
				if (Object.prototype.hasOwnProperty.call(snap, key)) {
					entry[key] = snap[key];
					hasAny = true;
				} else {
					delete entry[key];
				}
			}
			if (hasAny) devStore.frames[frameIdx][id] = entry;
			else {
				delete devStore.frames[frameIdx][id];
				if (!Object.keys(devStore.frames[frameIdx]).length) delete devStore.frames[frameIdx];
			}
		}

		function recordHistory(items) {
			if (!items || !items.length) return;
			devHistory.push({ items });
			if (devHistory.length > HISTORY_LIMIT) devHistory.shift();
			devRedo.length = 0;
		}

		function capturePrevMap(id) {
			const map = {};
			for (let i = 0; i < FRAMES.length; i++) {
				const frame = FRAMES[i];
				if (!frame || !frame.els) continue;
				const frameSpec = frame.els.find((e) => e.id === id);
				if (!frameSpec) continue;
				map[i] = snapshotSpec(frameSpec);
			}
			return map;
		}

		function applyHistory(items, useNext) {
			for (const item of items) {
				const frame = FRAMES[item.frameIdx];
				if (!frame || !frame.els) continue;
				const spec = frame.els.find((e) => e.id === item.id);
				if (!spec) continue;
				const snap = useNext ? item.next : item.prev;
				applySnapshot(spec, snap);
				applyOverrideSnapshot(item.frameIdx, item.id, snap);
			}
			saveOverrides(devStore);
			const t = FRAMES[devFrameIdx] ? FRAMES[devFrameIdx].t + 0.001 : 0.01;
			lastFrameIdx = -1;
			renderAt(t);
			if (devState.selectedSpec) {
				const spec = specForFrame(devState.selectedSpec.id, devFrameIdx);
				if (!spec || spec.mute) clearSelection();
				else {
					devState.selectedSpec = spec;
					updateInspector();
					updateDevBox();
				}
			} else {
				updateInspector();
			}
		}

		function devUndo() {
			if (!devHistory.length) return;
			const entry = devHistory.pop();
			devRedo.push(entry);
			applyHistory(entry.items, false);
		}

		function devRedoAction() {
			if (!devRedo.length) return;
			const entry = devRedo.pop();
			devHistory.push(entry);
			applyHistory(entry.items, true);
		}

		function specForFrame(id, idx) {
			const frame = FRAMES[idx];
			if (!frame || !frame.els) return null;
			return frame.els.find((e) => e.id === id) || null;
		}

		function updateFrameLabel() {
			if (!devFrameLabelEl) return;
			const f = FRAMES[devFrameIdx];
			devFrameLabelEl.textContent = f ? `${devFrameIdx} @ ${f.t.toFixed(2)}s` : `${devFrameIdx}`;
		}

		function refreshElementPicker() {
			if (!devElementPickerEl) return;
			const frame = FRAMES[devFrameIdx];
			devElementPickerEl.innerHTML = "";
			const placeholder = document.createElement("option");
			placeholder.value = "";
			placeholder.textContent = "--";
			devElementPickerEl.appendChild(placeholder);
			if (!frame || !frame.els) return;
			for (const spec of frame.els.filter((e) => !e.mute)) {
				const opt = document.createElement("option");
				opt.value = spec.id || "";
				let label = spec.id || "(no-id)";
				if (spec.text) {
					const txt = String(spec.text).replace(/\n/g, " ").slice(0, 28);
					label += ` - ${txt}`;
				}
				opt.textContent = label;
				devElementPickerEl.appendChild(opt);
			}
			if (devState.selectedSpec) devElementPickerEl.value = devState.selectedSpec.id || "";
		}

		let devMotionAuto = true;

		function frameLabel(i) {
			const f = FRAMES[i];
			if (!f) return String(i);
			const id = f.id ? ` · ${f.id}` : "";
			return `${i} · ${f.t.toFixed(2)}s${id}`;
		}

		function populateFrameSelect(selectEl) {
			if (!selectEl) return;
			selectEl.innerHTML = "";
			for (let i = 0; i < FRAMES.length; i++) {
				const opt = document.createElement("option");
				opt.value = String(i);
				opt.textContent = frameLabel(i);
				selectEl.appendChild(opt);
			}
		}

		function refreshMotionElements() {
			if (!devMotionEl || !devMotionAEl || !devMotionBEl) return;
			const aIdx = Number(devMotionAEl.value);
			const bIdx = Number(devMotionBEl.value);
			const aFrame = FRAMES[aIdx];
			const bFrame = FRAMES[bIdx];
			devMotionEl.innerHTML = "";
			const placeholder = document.createElement("option");
			placeholder.value = "";
			placeholder.textContent = "--";
			devMotionEl.appendChild(placeholder);
			if (!aFrame || !bFrame || !aFrame.els || !bFrame.els) return;
			const aIds = new Set(aFrame.els.filter((e) => !e.mute).map((e) => e.id));
			for (const spec of bFrame.els.filter((e) => !e.mute && aIds.has(e.id))) {
				const opt = document.createElement("option");
				opt.value = spec.id || "";
				let label = spec.id || "(no-id)";
				if (spec.text) label += ` - ${String(spec.text).replace(/\n/g, " ").slice(0, 24)}`;
				opt.textContent = label;
				devMotionEl.appendChild(opt);
			}
		}

		function updateMotionPanel() {
			if (!devMotionAEl || !devMotionBEl || !devMotionEl) return;
			if (devMotionAuto) {
				devMotionAEl.value = String(devFrameIdx);
				devMotionBEl.value = String(Math.min(devFrameIdx + 1, FRAMES.length - 1));
			}
			refreshMotionElements();
			if (!devMotionEl.value && devState.selectedSpec && devState.selectedSpec.id) {
				devMotionEl.value = devState.selectedSpec.id;
			}
			const bIdx = Number(devMotionBEl.value);
			const id = devMotionEl.value;
			const spec = id ? specForFrame(id, bIdx) : null;
			const tr = spec && spec.transition && typeof spec.transition === "object" ? spec.transition : null;
			if (devMotionDurationEl) devMotionDurationEl.value = tr && tr.duration != null ? String(tr.duration) : "";
			if (devMotionEaseEl) devMotionEaseEl.value = tr && tr.ease ? String(tr.ease) : "";
		}

		function updateCanvasSize() {
			if (!devCanvasSizeEl) return;
			const total = window.innerWidth;
			const panelW = getPanelWidthPx();
			const view = Math.max(0, total - panelW);
			devCanvasSizeEl.textContent = `${Math.round(total)}px → ${Math.round(view)}px`;
		}

		function rectToCanvas(rect) {
			const stageRect = devStage ? devStage.getBoundingClientRect() : { left: 0, top: 0 };
			const scale = devScale || 1;
			const left = (rect.left - stageRect.left) / scale;
			const top = (rect.top - stageRect.top) / scale;
			const width = rect.width / scale;
			const height = rect.height / scale;
			return { left, top, width, height, right: left + width, bottom: top + height };
		}

		function updateDevLayout() {
			if (!devStageInner) return;
			const totalW = window.innerWidth;
			const totalH = window.innerHeight;
			const panelW = getPanelWidthPx();
			const viewW = Math.max(0, totalW - panelW);
			const scale = totalW > 0 ? Math.min(1, viewW / totalW) : 1;
			devScale = scale;
			devStageInner.style.width = `${totalW}px`;
			devStageInner.style.height = `${totalH}px`;
			devStageInner.style.transform = `scale(${scale})`;
			updateCanvasSize();
		}

		function applyMotionFromPanel(clear) {
			const bIdx = Number(devMotionBEl.value);
			const id = devMotionEl.value;
			if (!id || !Number.isFinite(bIdx)) return;
			const spec = specForFrame(id, bIdx);
			if (!spec) return;
			const prevMap = devState.applyAll ? capturePrevMap(spec.id) : null;
			const prevSnapshot = devState.applyAll ? null : snapshotSpec(spec);
			if (clear) {
				delete spec.transition;
			} else {
				const durationRaw = devMotionDurationEl ? devMotionDurationEl.value : "";
				const easeRaw = devMotionEaseEl ? devMotionEaseEl.value : "";
				const duration = Number.parseFloat(durationRaw);
				const ease = String(easeRaw || "").trim();
				const next = { ...(spec.transition && typeof spec.transition === "object" ? spec.transition : {}) };
				if (Number.isFinite(duration)) next.duration = duration;
				else delete next.duration;
				if (ease) next.ease = ease;
				else delete next.ease;
				if (!Object.keys(next).length) delete spec.transition;
				else spec.transition = next;
			}
			commitSpecChanges(spec, { prevSnapshot, prevMap, frameIdx: bIdx });
			updateMotionPanel();
		}

		function previewMotion() {
			const aIdx = Number(devMotionAEl.value);
			const bIdx = Number(devMotionBEl.value);
			if (!Number.isFinite(aIdx) || !Number.isFinite(bIdx)) return;
			const aFrame = FRAMES[aIdx];
			const bFrame = FRAMES[bIdx];
			if (!aFrame || !bFrame) return;
			lastFrameIdx = -1;
			renderAt(aFrame.t + 0.001);
			devFrameIdx = bIdx;
			renderAt(bFrame.t + 0.001);
			audio.currentTime = bFrame.t + 0.001;
			audio.pause();
			syncPauseIcon();
			devHighlight(bIdx);
			updateInspector();
			updateDevBox();
		}

		function updateInspector() {
			updateFrameLabel();
			if (!devSelLabelEl || !devTextSizeEl || !devTextSizeRowEl) return;
			refreshElementPicker();
			if (!devState.selectedSpec) {
				devSelLabelEl.textContent = "-";
				if (devElementPickerEl) devElementPickerEl.value = "";
				if (devInputXEl) {
					devInputXEl.value = "";
					devInputXEl.disabled = true;
				}
				if (devInputYEl) {
					devInputYEl.value = "";
					devInputYEl.disabled = true;
				}
				if (devInputWEl) {
					devInputWEl.value = "";
					devInputWEl.disabled = true;
				}
				if (devInputHEl) {
					devInputHEl.value = "";
					devInputHEl.disabled = true;
				}
				if (devInputZEl) {
					devInputZEl.value = "";
					devInputZEl.disabled = true;
				}
				devTextSizeRowEl.style.display = "none";
				updateMotionPanel();
				return;
			}
			const spec = devState.selectedSpec;
			devSelLabelEl.textContent = spec.id || "-";
			if (devElementPickerEl) devElementPickerEl.value = spec.id || "";
			if (devInputXEl) {
				devInputXEl.disabled = false;
				devInputXEl.value = spec.x || "";
			}
			if (devInputYEl) {
				devInputYEl.disabled = false;
				devInputYEl.value = spec.y || "";
			}
			if (devInputWEl) {
				devInputWEl.disabled = false;
				devInputWEl.value = spec.w || "";
			}
			if (devInputHEl) {
				devInputHEl.disabled = false;
				devInputHEl.value = spec.h || "";
			}
			if (devInputZEl) {
				devInputZEl.disabled = false;
				devInputZEl.value = spec.z != null ? String(spec.z) : "";
			}
			if (spec.type == null) {
				devTextSizeRowEl.style.display = "flex";
				devTextSizeEl.value = spec.size || "l";
			} else {
				devTextSizeRowEl.style.display = "none";
			}
			updateMotionPanel();
		}

		function updateDevBox() {
			if (!devBox || !devState.editOn || !devState.selectedEl) {
				if (devBox) devBox.classList.add("hidden");
				return;
			}
			const rect = devState.selectedEl.getBoundingClientRect();
			devBox.style.left = `${rect.left}px`;
			devBox.style.top = `${rect.top}px`;
			devBox.style.width = `${rect.width}px`;
			devBox.style.height = `${rect.height}px`;
			devBox.classList.toggle("no-resize", !devState.canResize);
			devBox.classList.remove("hidden");
		}

		function clearSelection() {
			devState.selectedEl = null;
			devState.selectedSpec = null;
			devState.units = null;
			devState.canResize = false;
			updateInspector();
			updateDevBox();
		}

		function selectEl(el, opts = {}) {
			const force = !!opts.force;
			const id = el.dataset.id;
			const spec = specForFrame(id, devFrameIdx);
			if (!spec || spec.mute) return;
			if (!force && gsap.getProperty(el, "autoAlpha") < 0.05) return;
			gsap.killTweensOf(el);
			devState.selectedEl = el;
			devState.selectedSpec = spec;
			devState.units = unitsFor(spec);
			devState.canResize = !!spec.type;
			updateInspector();
			updateDevBox();
		}

		function commitSpecChanges(spec, opts = {}) {
			if (!spec) return;
			const patch = { x: spec.x, y: spec.y };
			if (spec.w != null) patch.w = spec.w;
			if (spec.h != null) patch.h = spec.h;
			if (spec.size != null) patch.size = spec.size;
			if (Object.prototype.hasOwnProperty.call(spec, "mute")) patch.mute = spec.mute;
			if (Object.prototype.hasOwnProperty.call(spec, "z")) patch.z = spec.z;
			if (Object.prototype.hasOwnProperty.call(spec, "transition")) patch.transition = spec.transition;
			const items = [];
			const prevMap = opts.prevMap || null;
			const prevSnapshot = opts.prevSnapshot || null;
			const targetFrameIdx = opts.frameIdx != null ? opts.frameIdx : devFrameIdx;
			if (devState.applyAll) {
				for (let i = 0; i < FRAMES.length; i++) {
					const frame = FRAMES[i];
					if (!frame || !frame.els) continue;
					const frameSpec = frame.els.find((e) => e.id === spec.id);
					if (!frameSpec) continue;
					const before = prevMap && prevMap[i] ? prevMap[i] : snapshotSpec(frameSpec);
					Object.assign(frameSpec, patch);
					const after = snapshotSpec(frameSpec);
					applyOverrideSnapshot(i, spec.id, after);
					if (!snapsEqual(before, after)) items.push({ frameIdx: i, id: spec.id, prev: before, next: after });
				}
			} else {
				const before = prevSnapshot || snapshotSpec(spec);
				const after = snapshotSpec(spec);
				applyOverrideSnapshot(targetFrameIdx, spec.id, after);
				if (!snapsEqual(before, after)) items.push({ frameIdx: targetFrameIdx, id: spec.id, prev: before, next: after });
			}
			if (!opts.skipHistory) recordHistory(items);
			saveOverrides(devStore);
		}

		function devJump(idx) {
			devFrameIdx = Math.max(0, Math.min(FRAMES.length - 1, idx));
			const t = FRAMES[devFrameIdx].t + 0.001;
			lastFrameIdx = -1;
			renderAt(t);
			audio.currentTime = t;
			audio.pause();
			syncPauseIcon();
			devHighlight(devFrameIdx);
			refreshElementPicker();
			if (devState.selectedEl) {
				const id = devState.selectedEl.dataset.id;
				const spec = specForFrame(id, devFrameIdx);
				if (!spec || spec.mute) clearSelection();
				else {
					devState.selectedSpec = spec;
					devState.units = unitsFor(spec);
					devState.canResize = !!spec.type;
					updateInspector();
					updateDevBox();
				}
			} else {
				updateInspector();
			}
		}

		/* 5. Keyboard: ← → navigate frames, Space pause/resume */
		document.addEventListener("keydown", function devKeys(e) {
			if ((e.metaKey || e.ctrlKey) && !isEditableTarget(e.target)) {
				const key = e.key.toLowerCase();
				if (key === "z") {
					e.preventDefault();
					if (e.shiftKey) devRedoAction();
					else devUndo();
					return;
				}
				if (key === "y") {
					e.preventDefault();
					devRedoAction();
					return;
				}
				if (key === "]") {
					e.preventDefault();
					bumpZ(1);
					return;
				}
				if (key === "[") {
					e.preventDefault();
					bumpZ(-1);
					return;
				}
			}
			if (!isEditableTarget(e.target) && devState.editOn && devState.selectedSpec) {
				if (e.key === "Backspace" || e.key === "Delete") {
					e.preventDefault();
					deleteSelected();
					return;
				}
			}
			const isArrow = e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "ArrowDown";
			if (isArrow && devState.editOn && devState.selectedEl && !e.altKey) {
				const step = e.shiftKey ? 10 : 1;
				const dx = e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0;
				const dy = e.key === "ArrowDown" ? step : e.key === "ArrowUp" ? -step : 0;
				if (dx || dy) {
					const spec = devState.selectedSpec;
					const el = devState.selectedEl;
					const prevMap = devState.applyAll ? capturePrevMap(spec.id) : null;
					const prevSnapshot = devState.applyAll ? null : snapshotSpec(spec);
					const rect = rectToCanvas(el.getBoundingClientRect());
					const { xp, yp } = ANCHOR[spec.a || "cc"];
					const anchorLeft = rect.left - (xp / 100) * rect.width + dx;
					const anchorTop = rect.top - (yp / 100) * rect.height + dy;
					spec.x = formatLen(anchorLeft, "x", devState.units.x);
					spec.y = formatLen(anchorTop, "y", devState.units.y);
					el.style.left = spec.x;
					el.style.top = spec.y;
					applyEl(el, spec);
					updateInspector();
					updateDevBox();
					commitSpecChanges(spec, { prevSnapshot, prevMap });
				}
				e.preventDefault();
				return;
			}
			if (e.key === "ArrowRight") {
				e.preventDefault();
				devJump(devFrameIdx + 1);
			} else if (e.key === "ArrowLeft") {
				e.preventDefault();
				devJump(devFrameIdx - 1);
			}
		});

		/* 6. Build navigator panel */
		const panel = document.createElement("div");
		panel.id = "dev-nav";
		panel.innerHTML = `
			<div id="dev-nav-header">
				<span id="dev-nav-title">DEV</span>
				<button id="dev-nav-toggle" title="Toggle panel">☰</button>
			</div>
			<div id="dev-controls">
				<button id="dev-edit-toggle" class="dev-btn">Edit Off</button>
				<button id="dev-delete" class="dev-btn dev-danger">Delete</button>
				<button id="dev-export" class="dev-btn">Export</button>
				<button id="dev-reset" class="dev-btn">Reset</button>
			</div>
			<div id="dev-inspector">
				<div class="dev-row"><span class="dev-label">Frame</span><span id="dev-frame-label">0</span></div>
				<div class="dev-row"><span class="dev-label">Sel</span><span id="dev-sel-label">-</span></div>
				<div class="dev-row"><span class="dev-label">Canvas</span><span id="dev-canvas-size">-</span></div>
				<div class="dev-row"><span class="dev-label">Element</span>
					<select id="dev-element-picker"></select>
				</div>
				<div class="dev-grid">
					<label class="dev-field"><span>x</span><input id="dev-x" type="text" spellcheck="false"></label>
					<label class="dev-field"><span>y</span><input id="dev-y" type="text" spellcheck="false"></label>
					<label class="dev-field"><span>w</span><input id="dev-w" type="text" spellcheck="false"></label>
					<label class="dev-field"><span>h</span><input id="dev-h" type="text" spellcheck="false"></label>
				</div>
				<div class="dev-row"><span class="dev-label">Layer</span>
					<div class="dev-layer">
						<button class="dev-mini" data-layer="back">-</button>
						<input id="dev-z" type="number" step="1" placeholder="5">
						<button class="dev-mini" data-layer="front">+</button>
					</div>
				</div>
				<div class="dev-row"><span class="dev-label">Align</span>
					<div class="dev-align">
						<button class="dev-mini" data-align="left">L</button>
						<button class="dev-mini" data-align="center">C</button>
						<button class="dev-mini" data-align="right">R</button>
						<button class="dev-mini" data-align="top">T</button>
						<button class="dev-mini" data-align="middle">M</button>
						<button class="dev-mini" data-align="bottom">B</button>
					</div>
				</div>
				<div class="dev-row"><span class="dev-label">Motion</span></div>
				<div class="dev-motion">
					<div class="dev-motion-row">
						<select id="dev-motion-a"></select>
						<select id="dev-motion-b"></select>
					</div>
					<div class="dev-motion-row">
						<select id="dev-motion-el"></select>
					</div>
					<div class="dev-motion-row">
						<input id="dev-motion-duration" type="number" step="0.05" placeholder="dur">
						<input id="dev-motion-ease" type="text" placeholder="ease">
					</div>
					<div class="dev-motion-row">
						<button id="dev-motion-apply" class="dev-mini">Apply</button>
						<button id="dev-motion-clear" class="dev-mini">Clear</button>
						<button id="dev-motion-preview" class="dev-mini">Preview</button>
					</div>
				</div>
				<div class="dev-row dev-size-row"><span class="dev-label">Text</span>
					<select id="dev-text-size">
						<option value="xxl">xxl</option>
						<option value="xl">xl</option>
						<option value="l">l</option>
						<option value="m">m</option>
					</select>
				</div>
				<label class="dev-check"><input type="checkbox" id="dev-apply-all">apply all frames</label>
				<div id="dev-status"></div>
			</div>
			<div id="dev-nav-list"></div>`;
		if (devShell) devShell.appendChild(panel);
		else document.body.appendChild(panel);

		/* Panel CSS — injected inline so it never leaks into production */
		const devStyle = document.createElement("style");
		devStyle.textContent = `
			#dev-nav {
				position: fixed; top: 0; right: 0; width: 260px; height: 100vh;
				background: rgba(10,10,10,0.92); color: #e8e8e6;
				font-family: 'SF Mono', 'Fira Code', monospace; font-size: 11px;
				z-index: 99999; display: flex; flex-direction: column;
				border-left: 1px solid rgba(255,255,255,0.08);
				backdrop-filter: blur(8px);
				transition: transform 0.2s ease;
				min-height: 0;
			}
			#dev-nav.collapsed { transform: translateX(calc(100% - 32px)); pointer-events: none; }
			#dev-nav.collapsed #dev-nav-header { pointer-events: auto; }
			#dev-nav.collapsed #dev-nav-toggle { pointer-events: auto; }
			#dev-nav.collapsed #dev-nav-list { pointer-events: none; }
			body.dev-docked-right { overflow: hidden; }
			body.dev-docked-right #dev-shell {
				position: fixed; inset: 0; display: grid;
				grid-template-columns: 1fr var(--dev-panel-w, 280px);
			}
			body.dev-docked-right #dev-stage {
				position: relative; overflow: hidden; background: #0c0c0a;
			}
			body.dev-docked-right #dev-stage-inner {
				position: absolute; inset: 0; transform-origin: top left;
			}
			body.dev-docked-right #dev-grid {
				position: absolute; inset: 0; pointer-events: none; z-index: 99970;
				background-image:
					linear-gradient(to right, rgba(255, 95, 64, 0.25) 1px, transparent 1px),
					linear-gradient(to bottom, rgba(255, 95, 64, 0.25) 1px, transparent 1px);
				background-size: var(--dev-grid, 40px) var(--dev-grid, 40px);
				mix-blend-mode: multiply;
				opacity: 0.35;
			}
			body.dev-docked-right #dev-nav {
				position: relative; top: auto; right: auto; height: 100%; width: 100%;
			}
			body.dev-docked-right #dev-nav.collapsed { transform: translateX(calc(100% - 32px)); }
			#dev-controls {
				display: flex; gap: 6px; padding: 8px 12px;
				border-bottom: 1px solid rgba(255,255,255,0.08);
			}
			.dev-btn {
				background: rgba(255,255,255,0.06);
				border: 1px solid rgba(255,255,255,0.1);
				color: #ddd; font-size: 10px; padding: 4px 6px;
				border-radius: 4px; cursor: pointer;
			}
			.dev-btn:hover { background: rgba(255,255,255,0.12); }
			.dev-btn.on { background: #ff5f40; color: #111; border-color: #ff5f40; }
			.dev-btn.dev-danger { color: #ffb3a6; border-color: rgba(255, 95, 64, 0.5); }
			.dev-btn.dev-danger:hover { background: rgba(255, 95, 64, 0.2); color: #fff; }
			#dev-inspector {
				padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.08);
				font-size: 10px; color: #bdbdb8;
			}
			.dev-row {
				display: flex; align-items: center; justify-content: space-between;
				gap: 8px; margin-bottom: 4px;
			}
			.dev-label { color: #777; }
			#dev-element-picker {
				background: #101010; color: #ddd; border: 1px solid rgba(255,255,255,0.1);
				font-size: 10px; padding: 2px 4px; border-radius: 3px; width: 140px;
			}
			.dev-grid {
				display: grid; grid-template-columns: 1fr 1fr; gap: 4px 6px; margin: 6px 0;
			}
			.dev-field {
				display: flex; align-items: center; gap: 6px; color: #888; font-size: 10px;
			}
			.dev-field span { width: 10px; text-transform: lowercase; }
			.dev-field input {
				flex: 1; background: #101010; color: #ddd; border: 1px solid rgba(255,255,255,0.1);
				font-size: 10px; padding: 2px 4px; border-radius: 3px;
			}
			.dev-field input:disabled { opacity: 0.4; }
			.dev-layer { display: flex; align-items: center; gap: 4px; }
			#dev-z {
				width: 48px; background: #101010; color: #ddd; border: 1px solid rgba(255,255,255,0.1);
				font-size: 10px; padding: 2px 4px; border-radius: 3px;
			}
			#dev-z:disabled { opacity: 0.4; }
			.dev-align { display: flex; gap: 4px; }
			.dev-motion { display: flex; flex-direction: column; gap: 4px; margin: 4px 0 6px; }
			.dev-motion-row { display: flex; gap: 4px; }
			.dev-motion select,
			.dev-motion input {
				flex: 1; background: #101010; color: #ddd; border: 1px solid rgba(255,255,255,0.1);
				font-size: 10px; padding: 2px 4px; border-radius: 3px;
			}
			.dev-motion input::placeholder { color: #666; }
			.dev-mini {
				background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
				color: #ddd; font-size: 10px; padding: 2px 6px; border-radius: 3px; cursor: pointer;
			}
			.dev-mini:hover { background: rgba(255,255,255,0.12); }
			#dev-text-size {
				background: #101010; color: #ddd; border: 1px solid rgba(255,255,255,0.1);
				font-size: 10px; padding: 2px 4px; border-radius: 3px;
			}
			.dev-check { display: flex; align-items: center; gap: 6px; color: #888; font-size: 10px; }
			#dev-status { min-height: 12px; color: #ff5f40; font-size: 10px; margin-top: 6px; }
			#dev-nav-header {
				display: flex; align-items: center; justify-content: space-between;
				padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.08);
				flex-shrink: 0;
			}
			#dev-nav-title { font-weight: 700; font-size: 10px; letter-spacing: 0.12em; color: #ff5f40; }
			#dev-nav-toggle {
				background: none; border: none; color: #888; cursor: pointer;
				font-size: 14px; padding: 2px 4px; line-height: 1;
			}
			#dev-nav-toggle:hover { color: #fff; }
			#dev-nav-list {
				overflow-y: auto; flex: 1; padding: 4px 0; min-height: 0;
			}
			#dev-nav-list::-webkit-scrollbar { width: 3px; }
			#dev-nav-list::-webkit-scrollbar-track { background: transparent; }
			#dev-nav-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
			.dev-chapter-label {
				padding: 8px 12px 4px; font-size: 9px; letter-spacing: 0.1em;
				text-transform: uppercase; color: #ff5f40; opacity: 0.7;
			}
			.dev-frame-item {
				display: flex; gap: 8px; align-items: flex-start;
				padding: 5px 12px; cursor: pointer; border-left: 2px solid transparent;
				transition: background 0.1s;
			}
			.dev-frame-item:hover { background: rgba(255,255,255,0.05); }
			.dev-frame-item.active {
				background: rgba(255,255,255,0.08); border-left-color: #ff5f40;
			}
			.dev-frame-ts { color: #ff5f40; min-width: 36px; flex-shrink: 0; }
			.dev-frame-text { color: #aaa; line-height: 1.4; overflow: hidden;
				display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
			.dev-frame-text em { color: #ddd; font-style: normal; }
			.dev-hint {
				padding: 8px 12px; font-size: 10px; color: #555;
				border-top: 1px solid rgba(255,255,255,0.05); flex-shrink: 0;
			}
			#dev-editor {
				position: fixed; inset: 0; z-index: 99990; pointer-events: none;
			}
			#dev-box {
				position: absolute; border: 1px solid #ff5f40;
				box-shadow: 0 0 0 1px rgba(0,0,0,0.6);
				pointer-events: auto;
			}
			#dev-box.hidden { display: none; }
			#dev-box.no-resize .dev-handle { display: none; }
			.dev-handle {
				position: absolute; width: 8px; height: 8px; background: #ff5f40;
				border-radius: 2px; margin: -4px 0 0 -4px; pointer-events: auto;
			}
			.dev-handle[data-handle="nw"] { left: 0; top: 0; cursor: nwse-resize; }
			.dev-handle[data-handle="n"] { left: 50%; top: 0; cursor: ns-resize; }
			.dev-handle[data-handle="ne"] { right: 0; top: 0; cursor: nesw-resize; }
			.dev-handle[data-handle="e"] { right: 0; top: 50%; cursor: ew-resize; }
			.dev-handle[data-handle="se"] { right: 0; bottom: 0; cursor: nwse-resize; }
			.dev-handle[data-handle="s"] { left: 50%; bottom: 0; cursor: ns-resize; }
			.dev-handle[data-handle="sw"] { left: 0; bottom: 0; cursor: nesw-resize; }
			.dev-handle[data-handle="w"] { left: 0; top: 50%; cursor: ew-resize; }
			#nextScene.dev-editing .line,
			#nextScene.dev-editing .viz { pointer-events: auto; cursor: grab; }
			#nextScene.dev-editing .line:active,
			#nextScene.dev-editing .viz:active { cursor: grabbing; }
		`;
		document.head.appendChild(devStyle);

		devFrameLabelEl = panel.querySelector("#dev-frame-label");
		devSelLabelEl = panel.querySelector("#dev-sel-label");
		devElementPickerEl = panel.querySelector("#dev-element-picker");
		devCanvasSizeEl = panel.querySelector("#dev-canvas-size");
		devTextSizeEl = panel.querySelector("#dev-text-size");
		devTextSizeRowEl = panel.querySelector(".dev-size-row");
		devApplyAllEl = panel.querySelector("#dev-apply-all");
		devEditToggleEl = panel.querySelector("#dev-edit-toggle");
		devStatusEl = panel.querySelector("#dev-status");
		devDeleteEl = panel.querySelector("#dev-delete");
		devInputXEl = panel.querySelector("#dev-x");
		devInputYEl = panel.querySelector("#dev-y");
		devInputWEl = panel.querySelector("#dev-w");
		devInputHEl = panel.querySelector("#dev-h");
		devInputZEl = panel.querySelector("#dev-z");
		devMotionAEl = panel.querySelector("#dev-motion-a");
		devMotionBEl = panel.querySelector("#dev-motion-b");
		devMotionEl = panel.querySelector("#dev-motion-el");
		devMotionDurationEl = panel.querySelector("#dev-motion-duration");
		devMotionEaseEl = panel.querySelector("#dev-motion-ease");
		devMotionApplyEl = panel.querySelector("#dev-motion-apply");
		devMotionClearEl = panel.querySelector("#dev-motion-clear");
		devMotionPreviewEl = panel.querySelector("#dev-motion-preview");

		populateFrameSelect(devMotionAEl);
		populateFrameSelect(devMotionBEl);
		devMotionAEl.value = String(devFrameIdx);
		devMotionBEl.value = String(Math.min(devFrameIdx + 1, FRAMES.length - 1));

		document.body.classList.add("dev-docked-right");
		document.documentElement.style.setProperty("--dev-panel-w", "280px");

		/* Populate frame list */
		const listEl = panel.querySelector("#dev-nav-list");
		let lastSection = null;
		FRAMES.forEach((f, i) => {
			if (f.idx && f.idx !== lastSection) {
				lastSection = f.idx;
				const sep = document.createElement("div");
				sep.className = "dev-chapter-label";
				sep.textContent = f.idx;
				listEl.appendChild(sep);
			}
			const firstText = (f.els || []).find((e) => e.text);
			const item = document.createElement("div");
			item.className = "dev-frame-item";
			item.dataset.frameIdx = i;
			item.innerHTML = `
				<span class="dev-frame-ts" title="${f.id}">${f.t.toFixed(2)}s</span>
				<span class="dev-frame-text"><em style="color:#ff5f40; font-style:normal; font-size:9px">${f.id || "?"}</em> ${firstText ? `<em>${firstText.text.replace(/\n/g, " ")}</em>` : "<span style='opacity:.3'>—</span>"}</span>`;
			item.addEventListener("click", () => devJump(i));
			listEl.appendChild(item);
		});

		/* Hint bar */
		const hint = document.createElement("div");
		hint.className = "dev-hint";
		hint.textContent = "← → frames · cmd+z / cmd+shift+z · cmd+[ / cmd+] layers · edit: drag/resize (shift locks)";
		panel.appendChild(hint);

		/* Toggle collapse */
		panel.querySelector("#dev-nav-toggle").addEventListener("click", () => {
			panel.classList.toggle("collapsed");
		});

		/* Prevent wheel events on the panel from bubbling to the pieza wheel handler */
		panel.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
		panel.addEventListener("pointerdown", (e) => e.stopPropagation());

		function devHighlight(idx) {
			listEl.querySelectorAll(".dev-frame-item").forEach((el) => el.classList.remove("active"));
			const active = listEl.querySelector(`[data-frame-idx="${idx}"]`);
			if (active) {
				active.classList.add("active");
				active.scrollIntoView({ block: "nearest", behavior: "smooth" });
			}
		}

		const devEditor = document.createElement("div");
		devEditor.id = "dev-editor";
		devEditor.innerHTML = `
			<div id="dev-box" class="hidden">
				<div class="dev-handle" data-handle="nw"></div>
				<div class="dev-handle" data-handle="n"></div>
				<div class="dev-handle" data-handle="ne"></div>
				<div class="dev-handle" data-handle="e"></div>
				<div class="dev-handle" data-handle="se"></div>
				<div class="dev-handle" data-handle="s"></div>
				<div class="dev-handle" data-handle="sw"></div>
				<div class="dev-handle" data-handle="w"></div>
			</div>`;
		document.body.appendChild(devEditor);
		devBox = devEditor.querySelector("#dev-box");

		function exportOverrides() {
			const payload = JSON.stringify(devStore, null, 2);
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(payload).then(
					() => devStatus("copied"),
					() => {
						window.prompt("Copy overrides", payload);
					},
				);
			} else {
				window.prompt("Copy overrides", payload);
			}
		}

		function resetOverrides() {
			const ok = window.confirm("Clear stored edits and reload?");
			if (!ok) return;
			localStorage.removeItem(DEV_STORE_KEY);
			location.reload();
		}

		function updateDrag(spec, el, rect) {
			const { xp, yp } = ANCHOR[spec.a || "cc"];
			const anchorLeft = rect.left - (xp / 100) * rect.width;
			const anchorTop = rect.top - (yp / 100) * rect.height;
			spec.x = formatLen(anchorLeft, "x", devState.units.x);
			spec.y = formatLen(anchorTop, "y", devState.units.y);
			el.style.left = spec.x;
			el.style.top = spec.y;
			if (devState.canResize) {
				spec.w = formatLen(rect.width, "w", devState.units.w);
				spec.h = formatLen(rect.height, "h", devState.units.h);
				el.style.width = spec.w;
				el.style.height = spec.h;
			}
			updateInspector();
			updateDevBox();
		}

		function startDrag(e, mode, handle) {
			if (!devState.selectedEl || !devState.selectedSpec) return;
			const rect = rectToCanvas(devState.selectedEl.getBoundingClientRect());
			const prevMap = devState.applyAll ? capturePrevMap(devState.selectedSpec.id) : null;
			const prevSnapshot = devState.applyAll ? null : snapshotSpec(devState.selectedSpec);
			devState.drag = {
				mode,
				handle,
				startX: e.clientX,
				startY: e.clientY,
				startRect: rect,
				ratio: rect.width && rect.height ? rect.width / rect.height : 1,
				axis: null,
				prevMap,
				prevSnapshot,
			};
			document.addEventListener("pointermove", onDragMove);
			document.addEventListener("pointerup", onDragEnd);
		}

		function onDragMove(e) {
			if (!devState.drag || !devState.selectedEl || !devState.selectedSpec) return;
			const { startX, startY, startRect, mode, handle, ratio } = devState.drag;
			const scale = devScale || 1;
			let dx = (e.clientX - startX) / scale;
			let dy = (e.clientY - startY) / scale;
			let left = startRect.left;
			let top = startRect.top;
			let right = startRect.right;
			let bottom = startRect.bottom;

			if (mode === "move") {
				if (e.shiftKey) {
					if (!devState.drag.axis) devState.drag.axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
					if (devState.drag.axis === "x") dy = 0;
					if (devState.drag.axis === "y") dx = 0;
				} else {
					devState.drag.axis = null;
				}
				left += dx;
				top += dy;
				right = left + startRect.width;
				bottom = top + startRect.height;
			} else if (mode === "resize" && devState.canResize) {
				if (handle.includes("n")) top += dy;
				if (handle.includes("s")) bottom += dy;
				if (handle.includes("w")) left += dx;
				if (handle.includes("e")) right += dx;

				let width = right - left;
				let height = bottom - top;
				const minSize = 20;
				if (width < minSize) {
					width = minSize;
					if (handle.includes("w")) left = right - width;
					else right = left + width;
				}
				if (height < minSize) {
					height = minSize;
					if (handle.includes("n")) top = bottom - height;
					else bottom = top + height;
				}

				if (e.shiftKey && ratio) {
					if (Math.abs(dx) > Math.abs(dy)) {
						height = width / ratio;
						if (handle.includes("n")) top = bottom - height;
						else bottom = top + height;
					} else {
						width = height * ratio;
						if (handle.includes("w")) left = right - width;
						else right = left + width;
					}
				}
			}

			const rect = {
				left,
				top,
				width: right - left,
				height: bottom - top,
				right,
				bottom,
			};
			updateDrag(devState.selectedSpec, devState.selectedEl, rect);
		}

		function onDragEnd() {
			if (!devState.drag || !devState.selectedEl || !devState.selectedSpec) return;
			const dragState = devState.drag;
			document.removeEventListener("pointermove", onDragMove);
			document.removeEventListener("pointerup", onDragEnd);
			devState.drag = null;
			applyEl(devState.selectedEl, devState.selectedSpec);
			updateDevBox();
			commitSpecChanges(devState.selectedSpec, {
				prevSnapshot: dragState.prevSnapshot,
				prevMap: dragState.prevMap,
			});
		}

		function readManualValue(input) {
			if (!input) return "";
			return String(input.value || "").trim();
		}

		function applyManualInputs() {
			if (!devState.selectedSpec || !devState.selectedEl) return;
			const spec = devState.selectedSpec;
			const prevMap = devState.applyAll ? capturePrevMap(spec.id) : null;
			const prevSnapshot = devState.applyAll ? null : snapshotSpec(spec);
			const xVal = readManualValue(devInputXEl);
			const yVal = readManualValue(devInputYEl);
			const wVal = readManualValue(devInputWEl);
			const hVal = readManualValue(devInputHEl);
			if (xVal) spec.x = xVal;
			if (yVal) spec.y = yVal;
			if (wVal) spec.w = wVal;
			if (hVal) spec.h = hVal;
			applyEl(devState.selectedEl, spec);
			devState.units = unitsFor(spec);
			commitSpecChanges(spec, { prevSnapshot, prevMap });
			updateInspector();
			updateDevBox();
		}

		function deleteSelected() {
			if (!devState.selectedSpec) return;
			const spec = devState.selectedSpec;
			const prevMap = devState.applyAll ? capturePrevMap(spec.id) : null;
			const prevSnapshot = devState.applyAll ? null : snapshotSpec(spec);
			spec.mute = true;
			commitSpecChanges(spec, { prevSnapshot, prevMap });
			lastFrameIdx = -1;
			renderAt(FRAMES[devFrameIdx].t + 0.001);
			clearSelection();
		}

		function alignSelected(kind) {
			if (!devState.selectedSpec || !devState.selectedEl) return;
			const spec = devState.selectedSpec;
			const el = devState.selectedEl;
			const prevMap = devState.applyAll ? capturePrevMap(spec.id) : null;
			const prevSnapshot = devState.applyAll ? null : snapshotSpec(spec);
			const rect = rectToCanvas(el.getBoundingClientRect());
			const containerRect = {
				left: 0,
				top: 0,
				right: window.innerWidth,
				bottom: window.innerHeight,
				width: window.innerWidth,
				height: window.innerHeight,
			};
			const { xp, yp } = ANCHOR[spec.a || "cc"];
			let left = rect.left;
			let top = rect.top;

			if (kind === "left") left = containerRect.left;
			if (kind === "center") left = containerRect.left + (containerRect.width - rect.width) / 2;
			if (kind === "right") left = containerRect.right - rect.width;
			if (kind === "top") top = containerRect.top;
			if (kind === "middle") top = containerRect.top + (containerRect.height - rect.height) / 2;
			if (kind === "bottom") top = containerRect.bottom - rect.height;

			if (kind === "left" || kind === "center" || kind === "right") {
				const anchorLeft = left - (xp / 100) * rect.width;
				spec.x = formatLen(anchorLeft, "x", devState.units.x);
				el.style.left = spec.x;
			}
			if (kind === "top" || kind === "middle" || kind === "bottom") {
				const anchorTop = top - (yp / 100) * rect.height;
				spec.y = formatLen(anchorTop, "y", devState.units.y);
				el.style.top = spec.y;
			}

			applyEl(el, spec);
			commitSpecChanges(spec, { prevSnapshot, prevMap });
			updateInspector();
			updateDevBox();
		}

		function setZValue(raw) {
			if (!devState.selectedSpec || !devState.selectedEl) return;
			const spec = devState.selectedSpec;
			const prevMap = devState.applyAll ? capturePrevMap(spec.id) : null;
			const prevSnapshot = devState.applyAll ? null : snapshotSpec(spec);
			const value = String(raw || "").trim();
			if (!value) {
				delete spec.z;
			} else {
				const num = Number.parseInt(value, 10);
				if (!Number.isFinite(num)) return;
				spec.z = num;
			}
			applyEl(devState.selectedEl, spec);
			commitSpecChanges(spec, { prevSnapshot, prevMap });
			updateInspector();
			updateDevBox();
		}

		function bumpZ(delta) {
			if (!devState.selectedSpec) return;
			const current = devState.selectedSpec.z != null ? devState.selectedSpec.z : 5;
			setZValue(current + delta);
		}

		devEditToggleEl.addEventListener("click", () => {
			devState.editOn = !devState.editOn;
			devEditToggleEl.classList.toggle("on", devState.editOn);
			devEditToggleEl.textContent = devState.editOn ? "Edit On" : "Edit Off";
			root.classList.toggle("dev-editing", devState.editOn);
			if (!devState.editOn) clearSelection();
			else updateDevBox();
		});

		panel.querySelector("#dev-export").addEventListener("click", exportOverrides);
		panel.querySelector("#dev-reset").addEventListener("click", resetOverrides);
		devDeleteEl.addEventListener("click", () => {
			if (!devState.editOn) return;
			deleteSelected();
		});
		panel.querySelectorAll(".dev-align [data-align]").forEach((btn) => {
			btn.addEventListener("click", () => {
				if (!devState.editOn) return;
				alignSelected(btn.dataset.align);
			});
		});
		panel.querySelectorAll("[data-layer]").forEach((btn) => {
			btn.addEventListener("click", () => {
				if (!devState.editOn) return;
				const dir = btn.dataset.layer === "front" ? 1 : -1;
				bumpZ(dir);
			});
		});
		devMotionAEl.addEventListener("change", () => {
			devMotionAuto = false;
			updateMotionPanel();
		});
		devMotionBEl.addEventListener("change", () => {
			devMotionAuto = false;
			updateMotionPanel();
		});
		devMotionEl.addEventListener("change", updateMotionPanel);
		devMotionApplyEl.addEventListener("click", () => applyMotionFromPanel(false));
		devMotionClearEl.addEventListener("click", () => applyMotionFromPanel(true));
		devMotionPreviewEl.addEventListener("click", previewMotion);

		devElementPickerEl.addEventListener("change", () => {
			const id = devElementPickerEl.value;
			if (!id) {
				clearSelection();
				return;
			}
			const el = dom.get(id);
			if (el) selectEl(el, { force: true });
		});

		devTextSizeEl.addEventListener("change", () => {
			if (!devState.selectedSpec || devState.selectedSpec.type != null) return;
			const prevMap = devState.applyAll ? capturePrevMap(devState.selectedSpec.id) : null;
			const prevSnapshot = devState.applyAll ? null : snapshotSpec(devState.selectedSpec);
			devState.selectedSpec.size = devTextSizeEl.value;
			applyEl(devState.selectedEl, devState.selectedSpec);
			commitSpecChanges(devState.selectedSpec, { prevSnapshot, prevMap });
			updateInspector();
		});

		for (const input of [devInputXEl, devInputYEl, devInputWEl, devInputHEl]) {
			input.addEventListener("change", applyManualInputs);
			input.addEventListener("keydown", (e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					applyManualInputs();
					input.blur();
				}
			});
		}
		devInputZEl.addEventListener("change", () => setZValue(devInputZEl.value));
		devInputZEl.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				setZValue(devInputZEl.value);
				devInputZEl.blur();
			}
		});

		devApplyAllEl.addEventListener("change", () => {
			devState.applyAll = devApplyAllEl.checked;
		});

		sceneEl.addEventListener("pointerdown", (e) => {
			if (!devState.editOn) return;
			const target = e.target.closest(".line, .viz");
			if (!target) return;
			e.preventDefault();
			selectEl(target);
			startDrag(e, "move", "");
		});

		devBox.addEventListener("pointerdown", (e) => {
			if (!devState.editOn) return;
			const handleEl = e.target.closest(".dev-handle");
			if (handleEl) {
				const handle = handleEl.dataset.handle;
				startDrag(e, "resize", handle);
			} else {
				startDrag(e, "move", "");
			}
			e.stopPropagation();
		});

		window.addEventListener("resize", () => {
			if (devState.selectedSpec) devState.units = unitsFor(devState.selectedSpec);
			updateInspector();
			updateDevBox();
			updateDevLayout();
		});

		devHighlight(0);
		updateInspector();
		updateDevLayout();
	}
})();
