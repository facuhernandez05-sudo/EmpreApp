// Todos los tiempos están en segundos sobre el video ya editado (public/video/main.mp4).
export const FPS = 30;
export const VOICE_SECONDS = 87.633;
export const TOTAL_SECONDS = 90.6;
export const f = (s: number) => Math.round(s * FPS);

export type Rect = { x: number; y: number; w: number; h: number; r: number };
export type Shot = {
  from: number;
  mode: "full" | "pip";
  zoom: number;
  focus: [number, number]; // punto del video (0-1) que queda centrado
  pip?: Rect;
};

export const FULL: Rect = { x: 0, y: 0, w: 1080, h: 1920, r: 0 };
export const PIP: Rect = { x: 640, y: 262, w: 376, h: 480, r: 44 };

// Encuadres: cambios motivados por quién habla y qué se explica.
export const shots: Shot[] = [
  { from: 0, mode: "full", zoom: 1.15, focus: [0.42, 0.52] }, // hook
  { from: 2.2, mode: "full", zoom: 1.0, focus: [0.5, 0.5] }, // presentación
  { from: 7.68, mode: "full", zoom: 1.18, focus: [0.42, 0.56] }, // "Mirá, mirá"
  { from: 10.0, mode: "pip", zoom: 1.05, focus: [0.5, 0.5] }, // flyer
  { from: 17.6, mode: "full", zoom: 1.3, focus: [0.66, 0.56] }, // Santi cuenta
  { from: 21.48, mode: "pip", zoom: 1.15, focus: [0.68, 0.5] }, // día / hora / lugar
  { from: 28.1, mode: "full", zoom: 1.12, focus: [0.6, 0.55] },
  { from: 30.5, mode: "pip", zoom: 1.15, focus: [0.68, 0.5] }, // cómo llegar
  { from: 36.0, mode: "pip", zoom: 1.15, focus: [0.68, 0.5] }, // qué va a haber
  { from: 45.18, mode: "full", zoom: 1.2, focus: [0.62, 0.56] },
  { from: 46.6, mode: "pip", zoom: 1.15, focus: [0.68, 0.5] }, // precio
  { from: 48.5, mode: "full", zoom: 1.0, focus: [0.5, 0.5] },
  { from: 50.4, mode: "full", zoom: 1.2, focus: [0.4, 0.56] }, // Paso a Paso
  { from: 52.2, mode: "full", zoom: 1.26, focus: [0.64, 0.56] }, // invitación
  { from: 56.4, mode: "pip", zoom: 1.05, focus: [0.5, 0.5] }, // resumen
  { from: 60.18, mode: "full", zoom: 1.14, focus: [0.42, 0.56] }, // entrada anticipada
  { from: 65.5, mode: "pip", zoom: 1.05, focus: [0.5, 0.5] }, // Wayqe
  { from: 79.4, mode: "full", zoom: 1.0, focus: [0.5, 0.5] },
  { from: 81.56, mode: "full", zoom: 1.3, focus: [0.42, 0.56] }, // "genios"
  { from: 83.47, mode: "full", zoom: 1.1, focus: [0.5, 0.55] }, // cierre
  { from: 87.0, mode: "pip", zoom: 1.05, focus: [0.5, 0.5] }, // placa final
];

// Destellos/glitch puntuales sólo en momentos de énfasis
export const glitches = [0.0, 50.75, 81.56];
export const flashes = [0.0, 87.0];

export type Cue = { at: number; src: string; vol: number };
// SFX variados, siempre por debajo de la voz
export const sfx: Cue[] = [
  { at: 0.0, src: "impact", vol: 0.42 },
  { at: 0.0, src: "whoosh3", vol: 0.3 },
  { at: 0.04, src: "glitch1", vol: 0.16 },
  { at: 0.35, src: "swish1", vol: 0.22 },
  { at: 2.18, src: "whoosh1", vol: 0.26 },
  { at: 3.8, src: "pop1", vol: 0.3 },
  { at: 3.85, src: "bell1", vol: 0.1 },
  { at: 7.66, src: "swish2", vol: 0.22 },
  { at: 9.9, src: "whoosh4", vol: 0.26 },
  { at: 11.95, src: "tick", vol: 0.3 },
  { at: 12.0, src: "bell3", vol: 0.1 },
  { at: 14.56, src: "shimmer", vol: 0.13 },
  { at: 17.55, src: "whoosh2", vol: 0.24 },
  { at: 21.4, src: "whoosh3", vol: 0.2 },
  { at: 22.46, src: "pop2", vol: 0.3 },
  { at: 24.1, src: "bell2", vol: 0.1 },
  { at: 27.4, src: "pop3", vol: 0.3 },
  { at: 28.05, src: "swish1", vol: 0.2 },
  { at: 30.45, src: "whoosh1", vol: 0.22 },
  { at: 31.5, src: "tick", vol: 0.25 },
  { at: 34.5, src: "pop1", vol: 0.28 },
  { at: 35.95, src: "whoosh4", vol: 0.22 },
  { at: 38.1, src: "pop2", vol: 0.28 },
  { at: 40.5, src: "pop3", vol: 0.28 },
  { at: 41.3, src: "tick", vol: 0.22 },
  { at: 42.9, src: "pop1", vol: 0.28 },
  { at: 44.5, src: "pop2", vol: 0.26 },
  { at: 45.15, src: "swish2", vol: 0.2 },
  { at: 45.4, src: "riser", vol: 0.12 },
  { at: 46.6, src: "whoosh3", vol: 0.2 },
  { at: 47.45, src: "coin", vol: 0.16 },
  { at: 48.45, src: "whoosh2", vol: 0.22 },
  { at: 50.75, src: "glitch2", vol: 0.15 },
  { at: 50.8, src: "bell1", vol: 0.11 },
  { at: 51.65, src: "pop3", vol: 0.28 },
  { at: 52.18, src: "swish1", vol: 0.2 },
  { at: 54.7, src: "bell3", vol: 0.1 },
  { at: 56.35, src: "whoosh1", vol: 0.24 },
  { at: 56.85, src: "tick", vol: 0.25 },
  { at: 57.9, src: "pop2", vol: 0.28 },
  { at: 60.15, src: "whoosh4", vol: 0.22 },
  { at: 60.9, src: "bell2", vol: 0.1 },
  { at: 65.45, src: "whoosh2", vol: 0.24 },
  { at: 67.95, src: "impact", vol: 0.24 },
  { at: 68.0, src: "shimmer", vol: 0.12 },
  { at: 70.9, src: "pop1", vol: 0.28 },
  { at: 73.0, src: "pop2", vol: 0.28 },
  { at: 75.3, src: "pop3", vol: 0.28 },
  { at: 77.2, src: "tick", vol: 0.25 },
  { at: 77.25, src: "bell1", vol: 0.1 },
  { at: 79.35, src: "whoosh3", vol: 0.22 },
  { at: 81.56, src: "glitch1", vol: 0.15 },
  { at: 81.6, src: "bell2", vol: 0.1 },
  { at: 83.45, src: "swish2", vol: 0.2 },
  { at: 86.95, src: "whoosh1", vol: 0.26 },
  { at: 87.3, src: "shimmer", vol: 0.14 },
  { at: 88.0, src: "bell3", vol: 0.14 },
];
