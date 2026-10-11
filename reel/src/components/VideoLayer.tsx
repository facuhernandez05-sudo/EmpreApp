import { Easing, Freeze, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { f, FULL, glitches, PIP, Rect, shots, VOICE_SECONDS } from "../data/timeline";

const SRC_W = 1080;
const SRC_H = 1920;
const MORPH = 14;
const LAST = f(VOICE_SECONDS) - 2; // frames para pasar de pantalla completa a recuadro
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
  r: lerp(a.r, b.r, t),
});

type Cam = { rect: Rect; zoom: number; fx: number; fy: number };

const camFor = (frame: number): Cam => {
  let i = 0;
  while (i + 1 < shots.length && frame >= f(shots[i + 1].from)) i++;
  const s = shots[i];
  const start = f(s.from);
  const local = frame - start;
  const end = i + 1 < shots.length ? f(shots[i + 1].from) : start + 300;
  const rect = s.mode === "pip" ? s.pip ?? PIP : FULL;
  // empuje lento dentro del plano + pequeño "asentado" al cortar
  const drift = interpolate(frame, [start, end], [0, 0.035]);
  const settle = interpolate(local, [0, 9], [0.045, 0], { extrapolateRight: "clamp", easing: ease });
  const cam: Cam = { rect, zoom: s.zoom + drift + settle, fx: s.focus[0], fy: s.focus[1] };
  const prev = shots[i - 1];
  if (prev && prev.mode !== s.mode && local < MORPH) {
    const t = ease(local / MORPH);
    const prect = prev.mode === "pip" ? prev.pip ?? PIP : FULL;
    return {
      rect: lerpRect(prect, rect, t),
      zoom: lerp(prev.zoom, s.zoom, t),
      fx: lerp(prev.focus[0], s.focus[0], t),
      fy: lerp(prev.focus[1], s.focus[1], t),
    };
  }
  return cam;
};

export const VideoLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { rect, zoom, fx, fy } = camFor(frame);
  // escala tipo "cover" dentro del rectángulo
  const scale = Math.max(rect.w / SRC_W, rect.h / SRC_H) * zoom;
  const vw = SRC_W * scale;
  const vh = SRC_H * scale;
  const left = Math.min(0, Math.max(rect.w - vw, rect.w / 2 - fx * vw));
  const top = Math.min(0, Math.max(rect.h - vh, rect.h / 2 - fy * vh));

  const g = glitches.find((t) => frame >= f(t) && frame < f(t) + 7);
  const gl = g !== undefined ? frame - f(g) : -1;
  const jitter = gl >= 0 ? Math.sin(gl * 12.9) * 14 * (1 - gl / 7) : 0;
  const isPip = rect.w < 1000;

  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        borderRadius: rect.r,
        overflow: "hidden",
        transform: `translateX(${jitter}px)`,
        boxShadow: isPip
          ? "0 40px 90px rgba(0,0,0,.6), 0 0 0 1.5px rgba(255,255,255,.28), inset 0 0 0 1px rgba(255,255,255,.1)"
          : "none",
        filter: gl >= 0 ? `hue-rotate(${gl % 2 ? 40 : -30}deg) saturate(1.6)` : undefined,
      }}
    >
      {frame < LAST ? (
        <OffthreadVideo src={staticFile("video/main.mp4")} style={{ position: "absolute", left, top, width: vw, height: vh }} />
      ) : (
        <Freeze frame={LAST - 1}>
          <OffthreadVideo muted src={staticFile("video/main.mp4")} style={{ position: "absolute", left, top, width: vw, height: vh }} />
        </Freeze>
      )}
      {gl >= 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, rgba(255,255,255,.08) 0 2px, transparent 2px 7px)",
            mixBlendMode: "screen",
            transform: `translateY(${(gl * 37) % 40}px)`,
          }}
        />
      )}
      {isPip && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: rect.r,
            background: "linear-gradient(160deg, rgba(255,255,255,.22) 0%, rgba(255,255,255,0) 32%)",
          }}
        />
      )}
      {!isPip && (
        // viñeta suave + zona de lectura para subtítulos
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 120% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.45) 100%), linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.38) 66%, rgba(0,0,0,.38) 72%, rgba(0,0,0,0) 85%)",
          }}
        />
      )}
    </div>
  );
};
