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
				{ id: "l1", text: "Todo empieza con algo incómodo.", size: "xl", x: "50%", y: "50%", a: "cc", diff: true, z: 10 },
			],
		},
		/* W 2.76–3.82  "No con un briefing,"
       White flash 200ms → swipe-from-right del texto y de la imagen.
       Imagen al centro, texto a la izquierda. */
		{
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
			t: 5.26,
			dur: 0.84,
			idx: "incomodidad",
			els: [{ id: "l4a", text: "Con una fricción", size: "l", x: "50%", y: "50%", a: "cc", anim: "fast-cut", z: 10 }],
		},
		/* W 6.10–7.54  "que no puedo ignorar."
       Texto inicial se desplaza a izquierda con fast-in/easy-out,
       el fondo invierte a negro y la imagen full-bleed aparece detrás
       con parallax zoom interno. */
		{
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
			t: 7.54,
			dur: 0.78,
			idx: "incomodidad",
			els: [{ id: "l5", text: "Entonces recuerdo…", size: "xl", x: "50%", y: "50%", a: "cc", anim: "fast-cut", exit: "swipe-left-soft" }],
		},
		/* W 8.32–9.44  "que algo esté hecho así"
       Ojo en primer plano izquierdo, texto centrado a la derecha. */
		{
			t: 8.32,
			dur: 1.12,
			idx: "incomodidad",
			els: [
				{ id: "ph1", type: "photo", src: "assets/images/dar por sentado.png", x: "6vw", y: "50%", a: "cl", w: "52vw", h: "40vh" },
				{ id: "l3a", text: "que algo esté hecho así", size: "m", x: "78vw", y: "46%", a: "cc" },
			],
		},
		/* W 9.44–11.54  "no significa que esté bien."
       Swipe-up + fade-in: la nueva frase empuja a la anterior sin tocarla. */
		{
			t: 9.44,
			dur: 2.1,
			idx: "incomodidad",
			els: [
				{ id: "ph1", type: "photo", src: "assets/images/dar por sentado.png", x: "6vw", y: "50%", a: "cl", w: "52vw", h: "40vh" },
				{ id: "l3a", text: "que algo esté hecho así", size: "m", x: "78vw", y: "42%", a: "cc", mute: true },
				{ id: "l3b", text: "no significa que esté bien.", size: "m", x: "78vw", y: "58%", a: "cc", anim: "swipe-up" },
			],
		},

		/* 2 · CUESTIONARLO TODO ────────────────────────────────────────
       W 11.54–12.68  "Me cuestiono todo lo cotidiano"              */
		{
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
				{ id: "l6a", text: "Me cuestiono todo lo cotidiano", size: "xl", x: "50%", y: "46%", a: "cc" },
				{ id: "l6b", text: "como hábito profesional.", size: "xl", x: "50%", y: "56%", a: "cc", mute: true },
			],
		},
		/* W 12.68–14.34  "como hábito profesional."                    */
		{
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
				{ id: "l6a", text: "Me cuestiono todo lo cotidiano", size: "xl", x: "50%", y: "46%", a: "cc", mute: true },
				{ id: "l6b", text: "como hábito profesional.", size: "xl", x: "50%", y: "56%", a: "cc" },
			],
		},
		/* W 14.34–16.52  "Las cosas no surgen de la nada."
       Upper-middle area, left rail. Below the TOC vertically. */
		{
			t: 14.34,
			dur: 2.18,
			idx: "cuestionarlo",
			els: [
				{ id: "l7a", text: "Las cosas no surgen de la nada.", size: "l", x: "22vw", y: "48%", a: "cl", z: 10 },
				{ id: "l7b", text: "Somos incapaces de crear algo nuevo sin", size: "l", x: "22vw", y: "55%", a: "cl", mute: true },
			],
		},
		/* W 16.52–18.52  "Somos incapaces de crear algo nuevo sin" —
       second clause activates beneath the first, same left rail. */
		{
			t: 16.52,
			dur: 2.0,
			idx: "cuestionarlo",
			els: [
				{ id: "l7a", text: "Las cosas no surgen de la nada.", size: "l", x: "22vw", y: "48%", a: "cl", mute: true },
				{ id: "l7b", text: "Somos incapaces de crear algo nuevo sin", size: "l", x: "22vw", y: "55%", a: "cl", z: 10 },
			],
		},
		/* W 18.52–19.42  "una fuente de inspiración," — appears on the
       right rail, balancing the left-side phrases. */
		{
			t: 18.52,
			dur: 0.9,
			idx: "cuestionarlo",
			els: [
				{ id: "l7a", text: "Las cosas no surgen de la nada.", size: "l", x: "22vw", y: "48%", a: "cl", mute: true },
				{ id: "l7b", text: "Somos incapaces de crear algo nuevo sin", size: "l", x: "22vw", y: "55%", a: "cl", mute: true },
				{ id: "l7c", text: "una fuente de inspiración,", size: "l", x: "55vw", y: "48%", a: "cl", z: 10 },
			],
		},
		/* W 19.42–20.0  "sin una referencia." — completes the right-rail
       phrase next to "una fuente de inspiración," */
		{
			t: 19.42,
			dur: 0.58,
			idx: "cuestionarlo",
			els: [
				{ id: "l7c", text: "una fuente de inspiración,", size: "l", x: "55vw", y: "48%", a: "cl", mute: true },
				{ id: "l7d", text: "sin una referencia.", size: "l", x: "55vw", y: "55%", a: "cl", z: 10 },
			],
		},
		/* W 20.0–20.86  Cards settled — beat before the phrase lands     */
		{
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
			t: 20.86,
			dur: 2.1,
			idx: "cuestionarlo",
			els: [{ id: "l8", text: "Pero es ahí donde se nos brinda la oportunidad de", size: "l", x: "50%", y: "50%", a: "cc", z: 10 }],
		},
		/* W 22.96–23.66  "cuestionar" — l8 exits left, words accumulate  */
		{
			t: 22.96,
			dur: 0.7,
			idx: "cuestionarlo",
			els: [
				{
					id: "q1",
					type: "photo",
					src: "assets/images/cuestionar.png",
					x: "50%",
					y: "50%",
					a: "cc",
					w: "min(26vw, 455px)",
					h: "calc(min(26vw, 455px) * 1.777)",
				},
				{ id: "l9a", text: "cuestionar", size: "l", x: "8vw", y: "92%", a: "bl", z: 10 },
			],
		},
		/* W 23.66–24.54  "combinar" — builds alongside "cuestionar"      */
		{
			t: 23.66,
			dur: 0.88,
			idx: "cuestionarlo",
			els: [{ id: "l9b", text: "combinar", size: "l", x: "50%", y: "92%", a: "bc", z: 10 }],
		},
		/* W 24.54–25.80  "y crear algo nuevo." — phrase complete          */
		{
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
					w: "min(26vw, 455px)",
					h: "calc(min(26vw, 455px) * 1.778)",
				},
				{ id: "l9a", text: "cuestionar", size: "l", x: "8vw", y: "92%", a: "bl", z: 10 },
				{ id: "l9b", text: "combinar", size: "l", x: "50%", y: "92%", a: "bc", z: 10 },
				{ id: "l9c", text: "y crear algo nuevo.", size: "l", x: "92vw", y: "92%", a: "br", z: 10 },
			],
		},

		/* 3 · LEARN BY DOING ───────────────────────────────────────────
       W 25.80–27.0  "Learn by doing."                               */
		{ t: 25.8, dur: 1.2, idx: "learn", els: [{ id: "l10a", text: "Learn by doing.", size: "xl", x: "50%", y: "46%", a: "cc" }] },
		/* W 27.0–28.52  "Si no sabes por dónde empezar,"               */
		{
			t: 27.0,
			dur: 1.52,
			idx: "learn",
			els: [
				{ id: "phL0", type: "photo", src: "assets/images/haciendo.png", x: "50%", y: "50%", a: "cc", w: "100vw", h: "100vh", anim: "fast-cut" },
				{ id: "l10a", text: "Learn by doing.", size: "xl", x: "50%", y: "46%", a: "cc" },
				{ id: "l10b", text: "Si no sabes por dónde empezar,", size: "xl", x: "50%", y: "56%", a: "cc", mute: true },
			],
		},
		/* W 28.52–29.76  "empieza haciendo."                            */
		{
			t: 28.52,
			dur: 1.24,
			idx: "learn",
			els: [
				{ id: "phL0", type: "photo", src: "assets/images/haciendo.png", x: "50%", y: "50%", a: "cc", w: "100vw", h: "100vh", anim: "fast-cut" },
				{ id: "l10a", text: "Learn by doing.", size: "xl", x: "50%", y: "46%", a: "cc" },
				{ id: "l10c", text: "empieza haciendo.", size: "xl", x: "50%", y: "56%", a: "cc", mute: true },
			],
		},
		/* W 29.76–31.76  "Encaja todas las piezas necesarias."
       notebook-sketch: cuaderno abierto cenital — empieza haciendo */
		{
			t: 29.76,
			dur: 2.0,
			idx: "learn",
			els: [
				{
					id: "phL1",
					type: "photo",
					src: "assets/images/encaja las piezas.png",
					x: "68vw",
					y: "50%",
					a: "cc",
					w: "min(32vw, 444px)",
					h: "calc(min(32vw, 444px) * 1.331)",
				},
				{ id: "l11a", text: "Encaja todas las piezas necesarias.", size: "l", x: "4vw", y: "34%", a: "tl" },
			],
		},
		/* W 31.76–34.70  "Observa desde lejos y piensa en cómo mejorarlo."
       feedback-talk: manos sobre escritorio diseñando wireframes — observar y rehacer */
		{
			t: 31.76,
			dur: 1.24,
			idx: "learn",
			els: [
				{
					id: "phL2",
					type: "photo",
					src: "assets/images/observa desde lejos.png",
					x: "22vw",
					y: "50%",
					a: "cc",
					w: "min(28vw, 390px)",
					h: "calc(min(28vw, 390px) * 1.508)",
				},
				{ id: "l11b", text: "Observa desde lejos y", size: "l", x: "72vw", y: "50%", a: "cc" },
			],
		},
		/* W 33.0–34.70  "piensa en cómo mejorarlo." — text updates in same position */
		{
			t: 33.0,
			dur: 1.7,
			idx: "learn",
			els: [
				{
					id: "phL2",
					type: "photo",
					src: "assets/images/observa desde lejos.png",
					x: "22vw",
					y: "50%",
					a: "cc",
					w: "min(28vw, 390px)",
					h: "calc(min(28vw, 390px) * 1.508)",
				},
				{ id: "l11b", text: "piensa en cómo mejorarlo.", size: "l", x: "72vw", y: "50%", a: "cc" },
			],
		},
		/* W 34.70–36.02  "Vuelve a intentarlo." — full-bleed feedback-talk */
		{
			t: 34.7,
			dur: 1.32,
			idx: "learn",
			els: [
				{
					id: "phL3",
					type: "photo",
					src: "assets/images/vuelve a intentarlo.png",
					x: "50%",
					y: "50%",
					a: "cc",
					w: "min(30vw, 443px)",
					h: "calc(min(30vw, 443px) * 1.316)",
				},
				{ id: "l11c", text: "Vuelve a intentarlo.", size: "xl", x: "50%", y: "50%", a: "cc", z: 10 },
			],
		},

		/* 4 · UCD REAL ─────────────────────────────────────────────────
       W 36.02–38.66  "User-centered design real."                   */
		{ t: 36.02, dur: 2.64, idx: "ucd", els: [{ id: "l12", text: "User-centered design real.", size: "xl", x: "50%", y: "50%", a: "cc" }] },
		/* W 38.66–39.90  "Sal ahí fuera y pregunta."                   */
		{
			t: 38.66,
			dur: 1.24,
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
				},
				{ id: "l13a", text: "Sal ahí fuera y pregunta.", size: "l", x: "5vw", y: "66%", a: "cl" },
			],
		},
		/* W 39.90–42.20  "No asumas, contrástalo con datos."            */
		{
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
				},
				{ id: "l13a", text: "Sal ahí fuera y pregunta.", size: "l", x: "5vw", y: "66%", a: "cl", mute: true },
				{ id: "l13b", text: "No asumas, contrástalo con datos.", size: "l", x: "50%", y: "50%", a: "cc" },
			],
		},
		/* W 42.20–45.16  "Comparte, haz partícipe y perfecciona."       */
		{
			t: 42.2,
			dur: 2.96,
			idx: "ucd",
			els: [
				{
					id: "phU2",
					type: "photo",
					src: "assets/images/comparte.png",
					x: "18vw",
					y: "52%",
					a: "cc",
					w: "min(26vw, 418px)",
					h: "calc(min(26vw, 418px) * 1.5)",
				},
				{ id: "l13a", text: "Sal ahí fuera y pregunta.", size: "l", x: "5vw", y: "66%", a: "cl", mute: true },
				{ id: "l13b", text: "No asumas, contrástalo con datos.", size: "l", x: "50%", y: "50%", a: "cc", mute: true },
				{ id: "l13c", text: "Comparte, haz partícipe y perfecciona.", size: "l", x: "95vw", y: "34%", a: "cr" },
			],
		},

		/* 5 · EL COSQUILLEO ────────────────────────────────────────────
       W 45.16–46.30  "Sobre todo,"                                  */
		{ t: 45.16, dur: 1.14, idx: "cosquilleo", els: [{ id: "l14", text: "Sobre todo,", size: "xl", x: "50%", y: "50%", a: "cc" }] },
		/* W 46.30–47.12  "crea." — the imperative drops like a stamp.    */
		{
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
			t: 47.12,
			dur: 4.46,
			idx: "cosquilleo",
			els: [
				{
					id: "phC1",
					type: "photo",
					src: "assets/images/crea productos.png",
					x: "50%",
					y: "50%",
					a: "cc",
					w: "min(34vw, 706px)",
					h: "calc(min(34vw, 706px) * 1.072)",
					anim: "fast-photo-pop",
					z: 10,
				},
				{
					id: "l16",
					text: "Crea productos que sorprendan, que se adelanten a las expectativas del usuario.",
					size: "l",
					x: "50%",
					y: "50%",
					a: "cc",
					anim: "expand-from-head",
					z: 5,
				},
			],
		},
		/* W 51.58–52.5  "La gente no sabe lo que quiere…"
       Quote enters in resonance — centered, slight scale expansion. The
       text holds the room before Jobs arrives to push it aside. */
		{
			t: 51.58,
			dur: 0.92,
			idx: "cosquilleo",
			els: [
				{
					id: "l17",
					text: '"La gente no sabe lo que quiere\nhasta que se lo enseñas",',
					size: "l",
					x: "50%",
					y: "50%",
					a: "cc",
					anim: "expand-from-center",
				},
			],
		},
		/* W 52.5–54.0  Jobs pushes from right — the quote slides left to
       make room. Two simultaneous moves create the "push" illusion:
       photo enters from off-screen right, text translates to left rail. */
		{
			t: 52.5,
			dur: 1.5,
			idx: "cosquilleo",
			els: [
				{
					id: "phC2",
					type: "photo",
					src: "assets/images/steve jobs.png",
					x: "72vw",
					y: "56%",
					a: "cc",
					w: "min(28vw, 594px)",
					h: "calc(min(28vw, 594px) * 1.378)",
					anim: "push-from-right",
				},
				{
					id: "l17",
					text: '"La gente no sabe lo que quiere\nhasta que se lo enseñas",',
					size: "l",
					x: "8vw",
					y: "44%",
					a: "cl",
					anim: "shift-position",
				},
			],
		},
		/* W 54.0–55.28  "decía Jobs." — attribution lands below the muted
       quote, both anchored to the left rail with Jobs to the right. */
		{
			t: 54.0,
			dur: 1.28,
			idx: "cosquilleo",
			els: [
				{
					id: "phC2",
					type: "photo",
					src: "assets/images/steve jobs.png",
					x: "72vw",
					y: "56%",
					a: "cc",
					w: "min(28vw, 594px)",
					h: "calc(min(28vw, 594px) * 1.378)",
				},
				{
					id: "l17",
					text: '"La gente no sabe lo que quiere\nhasta que se lo enseñas",',
					size: "l",
					x: "8vw",
					y: "44%",
					a: "cl",
					mute: true,
				},
				{ id: "l17b", text: "decía Jobs.", size: "l", x: "8vw", y: "62%", a: "cl" },
			],
		},
		/* W 55.28–56.88  "No tengas miedo a crearlo."                   */
		{
			t: 55.28,
			dur: 1.6,
			idx: "cosquilleo",
			els: [
				{
					id: "phC3",
					type: "photo",
					src: "assets/images/no tengas miedo.png",
					x: "50%",
					y: "50%",
					a: "cc",
					w: "min(60vw, 705px)",
					h: "calc(min(60vw, 705px) * 0.637)",
				},
				{ id: "l18a", text: "No tengas miedo a crearlo.", size: "xl", x: "50%", y: "52%", a: "cc" },
			],
		},
		/* W 56.88–57.66  "Cuando algo funciona,"                        */
		{ t: 56.88, dur: 0.78, idx: "cosquilleo", els: [{ id: "l18b", text: "Cuando algo funciona,", size: "l", x: "50%", y: "46%", a: "cc" }] },
		/* W 57.66–60.96  "esa sensación de cosquilleo te recorrerá la piel." */
		{
			t: 57.66,
			dur: 3.3,
			idx: "cosquilleo",
			els: [
				{
					id: "phC4",
					type: "photo",
					src: "assets/images/cosquilleo.png",
					x: "50%",
					y: "50%",
					a: "cc",
					w: "min(24vw, 480px)",
					h: "calc(min(24vw, 480px) * 1.462)",
				},
				{ id: "l19", text: "esa sensación de cosquilleo te recorrerá la piel.", size: "l", x: "50%", y: "50%", a: "cc" },
			],
		},

		/* 6 · ENDING ───────────────────────────────────────────────────
       W 60.96–62.0  "Nadie me lo ha pedido." — text on a clean canvas */
		{
			t: 60.96,
			dur: 1.04,
			idx: "cosquilleo",
			mutedIdx: true,
			els: [{ id: "l20", text: "Nadie me lo ha pedido.", size: "xl", x: "50%", y: "44%", a: "cc" }],
		},
		/* W 62.0–63.82  "Tampoco lo he esperado…" + envelope tossed in.
       Second phrase arrives, then the envelope slides up from below the
       canvas — fully visible throughout its travel. Lands overlapping
       the second line, with the natural "thrown on a table" settle. */
		{
			t: 62.0,
			dur: 1.82,
			idx: "cosquilleo",
			mutedIdx: true,
			els: [
				{ id: "l20", text: "Nadie me lo ha pedido.", size: "xl", x: "50%", y: "36%", a: "cc" },
				{ id: "l20b", text: "Tampoco lo he esperado…", size: "xl", x: "50%", y: "48%", a: "cc" },
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
				},
			],
		},
	];

	const TOTAL = 63.82;

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

	/* ── Subtitle sync overlay (temporal check — no animation) ── */
	const subsEl = document.getElementById("piezaSubs");
	let subSegs = [];
	fetch("assets/subtitles.json")
		.then((r) => r.json())
		.then((s) => {
			subSegs = s;
		});

	function renderSubs(time) {
		if (!subsEl) return;
		const seg = subSegs.find((s) => time >= s.start && time < s.end);
		subsEl.textContent = seg ? seg.text : "";
	}

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
						? "viz photo"
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
		el.style.zIndex = spec.z || 5;
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
		const rot = CARD_ROT[spec.id] || 0;

		/* Opening headline — fades in slowly as the image bleeds behind it,
       so they feel like one synchronized arrival rather than separate events. */
		if (spec.id === "l1") {
			gsap.fromTo(el, { autoAlpha: 0, x: 0, y: 0 }, { autoAlpha: 1, duration: 0.9, delay, ease: "power2.out" });
			return;
		}

		/* ── New motion tokens (anim:'...') ── */
		if (spec.anim === "fast-photo-pop") {
			/* Photo lands quickly with a tiny scale-up — used before paired
         text expansion. Parallax kicks in during the pop, not after. */
			gsap.fromTo(
				el,
				{ autoAlpha: 0, scale: 0.94 },
				{ autoAlpha: 1, scale: 1, duration: 0.32, delay, ease: "power2.out" },
			);
			startParallax(el);
			return;
		}
		if (spec.anim === "expand-from-head") {
			/* Text starts compressed near where the photo's head lives, then
         expands outward to its final scale. Delayed so the photo lands
         FIRST (milliseconds) and the text feels like it radiates out as
         the head settles into frame. */
			gsap.fromTo(
				el,
				{ autoAlpha: 0, scale: 0.55 },
				{ autoAlpha: 1, scale: 1, duration: 0.6, delay: delay + 0.22, ease: "power3.out" },
			);
			return;
		}
		if (spec.anim === "stamp-drop") {
			/* Used for the single most weighty word of the piece — lands like
         a stamp on paper. Slight overshoot at the end seals the impact. */
			gsap.fromTo(
				el,
				{ autoAlpha: 0, scale: 1.35 },
				{ autoAlpha: 1, scale: 1, duration: 0.5, delay, ease: "back.out(1.4)" },
			);
			return;
		}
		if (spec.anim === "expand-from-center") {
			/* Quote-style entry — text appears at center with a subtle scale
         expansion. Resonance, not impact. */
			gsap.fromTo(
				el,
				{ autoAlpha: 0, scale: 0.88 },
				{ autoAlpha: 1, scale: 1, duration: 0.55, delay, ease: "power3.out" },
			);
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
					startParallax(el);
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
				duration: 1.5,
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
		if (spec.anim === "shift-position") {
			/* Smooth, deliberate — used when a phrase makes room for a photo */
			gsap.fromTo(el, { x: dx, y: dy }, { x: 0, y: 0, duration: 0.85, delay, ease: "power3.inOut" });
			return;
		}
		/* Default position transition */
		gsap.fromTo(el, { x: dx, y: dy }, { x: 0, y: 0, duration: 0.6, delay, ease: "power2.inOut" });
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
			/* Capture position before applyEl moves the element — needed for FLIP */
			const oldRect = !isNew && spec.anim ? el.getBoundingClientRect() : null;
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

		brandBg.classList.toggle("shown", !!f.brand);
		updateIndex(f);
	}

	/* ── rAF loop — reads audio.currentTime ── */
	function loop() {
		renderAt(audio.currentTime);
		renderSubs(audio.currentTime);
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

	/* ── Debug helpers (remove before production) ── */
	window.__piezaSeek = function (t) {
		lastFrameIdx = -1;
		audio.currentTime = t;
	};
	window.__piezaRender = function (t) {
		lastFrameIdx = -1;
		renderAt(t);
	};

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
})();
