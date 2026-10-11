import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { C, GOLD_GRADIENT, fonts } from "./theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const useSpring = (delay = 0, config: Parameters<typeof spring>[0]["config"] = { damping: 14, mass: 0.8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

/* ---------- Fondo: degradado oscuro, glow dorado, grilla fina, partículas ---------- */
export const Background: React.FC<{ accent?: number }> = ({ accent = 1 }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const x1 = 50 + Math.sin(t * 0.35) * 18;
  const y1 = 30 + Math.cos(t * 0.27) * 10;
  const x2 = 50 + Math.cos(t * 0.31) * 22;
  const y2 = 78 + Math.sin(t * 0.22) * 8;
  return (
    <AbsoluteFill style={{ background: "#060606" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 38% at ${x1}% ${y1}%, rgba(255,196,0,${0.2 * accent}) 0%, rgba(255,196,0,0) 70%),
            radial-gradient(55% 30% at ${x2}% ${y2}%, rgba(255,150,0,${0.1 * accent}) 0%, rgba(255,150,0,0) 70%),
            linear-gradient(180deg, #0b0a07 0%, #070604 45%, #0d0b06 100%)`,
        }}
      />
      {/* grilla sutil en perspectiva */}
      <AbsoluteFill style={{ perspective: 900, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: -540,
            right: -540,
            top: 1100,
            height: 1600,
            transform: `rotateX(72deg) translateY(${(frame * 2) % 120}px)`,
            transformOrigin: "50% 0%",
            backgroundImage:
              "linear-gradient(rgba(255,210,31,0.13) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,210,31,0.13) 1.5px, transparent 1.5px)",
            backgroundSize: "120px 120px",
            maskImage: "linear-gradient(180deg, transparent 0%, black 30%, transparent 85%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 30%, transparent 85%)",
          }}
        />
      </AbsoluteFill>
      <Dust />
      {/* viñeta */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(120% 80% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Dust: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(40).fill(0).map((_, i) => {
        const x = random(`dx${i}`) * 1080;
        const sp = 0.3 + random(`ds${i}`) * 0.9;
        const y = (random(`dy${i}`) * 2100 - frame * sp * 1.6) % 2100;
        const yy = y < -100 ? y + 2100 : y;
        const s = 2 + random(`dz${i}`) * 5;
        const o = 0.15 + 0.35 * Math.abs(Math.sin(frame / 25 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(frame / 40 + i) * 14,
              top: yy,
              width: s,
              height: s,
              borderRadius: s,
              background: "#FFE27A",
              opacity: o,
              filter: `blur(${s > 5 ? 1.5 : 0}px)`,
              boxShadow: "0 0 10px rgba(255,210,31,0.8)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- Título 3D metalizado con extrusión, brillo y perspectiva ---------- */
export const Title3D: React.FC<{
  text: string;
  size: number;
  delay?: number;
  depth?: number;
  serif?: boolean;
  gradient?: string;
  extrudeColor?: string;
  shine?: boolean;
  tilt?: boolean;
  letterSpacing?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  size,
  delay = 0,
  depth = 14,
  serif = false,
  gradient = GOLD_GRADIENT,
  extrudeColor = "#7A5200",
  shine = true,
  tilt = true,
  letterSpacing = -0.02,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = useSpring(delay, { damping: 13, mass: 0.9, stiffness: 120 });
  const rx = tilt ? interpolate(p, [0, 1], [50, 6]) + Math.sin((frame - delay) / 26) * 1.2 : 0;
  const ry = tilt ? Math.sin((frame - delay) / 34) * 3 : 0;
  const sc = interpolate(p, [0, 1], [0.6, 1]);
  const op = interpolate(frame - delay, [0, 6], [0, 1], clamp);
  const blur = interpolate(frame - delay, [0, 7], [10, 0], clamp);
  const shineX = interpolate(frame - delay - 10, [0, 26], [-40, 140], clamp);
  const d = Math.round(depth * (size / 160));
  const shadows = new Array(Math.max(1, d))
    .fill(0)
    .map((_, i) => `${((i + 1) * 0.35).toFixed(2)}px ${i + 1}px 0 ${shade(extrudeColor, i / d)}`)
    .join(",");
  const base: React.CSSProperties = {
    fontFamily: serif ? fonts.serif : fonts.title,
    fontStyle: serif ? "italic" : "normal",
    fontWeight: serif ? 400 : 900,
    fontSize: size,
    lineHeight: 0.95,
    letterSpacing: `${letterSpacing}em`,
    whiteSpace: "pre",
    textAlign: "center",
  };
  return (
    <div
      style={{
        perspective: 1400,
        opacity: op,
        filter: `blur(${blur}px)`,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) scale(${sc})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          aria-hidden
          style={{
            ...base,
            position: "absolute",
            inset: 0,
            color: extrudeColor,
            textShadow: `${shadows}, ${d * 0.35}px ${d + 10}px 22px rgba(0,0,0,0.55)`,
          }}
        >
          {text}
        </div>
        <div
          style={{
            ...base,
            position: "relative",
            backgroundImage: gradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextStroke: serif ? undefined : `${Math.max(1, size / 110)}px rgba(255,250,225,0.55)`,
          }}
        >
          {text}
        </div>
        {shine ? (
          <div
            aria-hidden
            style={{
              ...base,
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) ${shineX - 12}%, rgba(255,255,255,0.95) ${shineX}%, rgba(255,255,255,0) ${shineX + 12}%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              mixBlendMode: "screen",
            }}
          >
            {text}
          </div>
        ) : null}
      </div>
    </div>
  );
};

function shade(hex: string, t: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  const k = 1 - t * 0.65;
  return `rgb(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)})`;
}

/* ---------- Tarjeta de cristal con borde metalizado ---------- */
export const Glass: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  radius?: number;
  padding?: number;
}> = ({ children, style, radius = 44, padding = 0 }) => (
  <div
    style={{
      position: "relative",
      borderRadius: radius,
      padding: 2,
      background:
        "linear-gradient(140deg, rgba(255,240,180,0.9), rgba(255,210,31,0.25) 30%, rgba(255,255,255,0.08) 55%, rgba(255,210,31,0.6))",
      boxShadow: "0 40px 90px rgba(0,0,0,0.6), 0 0 80px rgba(255,190,0,0.12)",
      ...style,
    }}
  >
    <div
      style={{
        borderRadius: radius - 2,
        background: "linear-gradient(160deg, rgba(40,36,26,0.92), rgba(14,13,10,0.94))",
        overflow: "hidden",
        padding,
        position: "relative",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />
      {children}
    </div>
  </div>
);

/* ---------- Píldora / badge ---------- */
export const Pill: React.FC<{
  children: React.ReactNode;
  dark?: boolean;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, dark, size = 40, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: `${size * 0.36}px ${size * 0.8}px`,
      borderRadius: 999,
      fontFamily: fonts.title,
      fontWeight: 900,
      fontSize: size,
      letterSpacing: "0.02em",
      textTransform: "uppercase",
      color: dark ? C.yellow : "#111",
      background: dark
        ? "linear-gradient(180deg, rgba(30,28,20,0.95), rgba(10,10,8,0.95))"
        : "linear-gradient(180deg, #FFF0A0 0%, #FFD21F 45%, #E6A600 100%)",
      border: dark ? "2px solid rgba(255,210,31,0.6)" : "2px solid rgba(255,255,255,0.6)",
      boxShadow: dark
        ? "0 14px 40px rgba(0,0,0,0.6)"
        : "0 6px 0 #8A6000, 0 18px 40px rgba(0,0,0,0.55), 0 0 40px rgba(255,200,0,0.35), inset 0 2px 0 rgba(255,255,255,0.8)",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ---------- Escudo C.A.E.C. (redibujo vectorial del escudo del flyer) ---------- */
export const Shield: React.FC<{ size: number; glow?: number }> = ({ size, glow = 0.5 }) => {
  const shape = "M20 14 Q20 6 28 6 L172 6 Q180 6 180 14 L180 150 Q180 200 100 236 Q20 200 20 150 Z";
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 200 240"
      style={{ filter: `drop-shadow(0 10px 24px rgba(0,0,0,0.6)) drop-shadow(0 0 ${30 * glow}px rgba(255,200,0,${glow}))`, overflow: "visible" }}
    >
      <defs>
        <clipPath id="sh">
          <path d={shape} />
        </clipPath>
        <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF6D6" />
          <stop offset="0.45" stopColor="#D9C48A" />
          <stop offset="0.7" stopColor="#FFF1C2" />
          <stop offset="1" stopColor="#B89A55" />
        </linearGradient>
        <linearGradient id="yel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE34D" />
          <stop offset="1" stopColor="#F2B705" />
        </linearGradient>
        <linearGradient id="gloss" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g clipPath="url(#sh)">
        <rect x="0" y="0" width="200" height="240" fill="#0A0A0A" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={20 + i * 32} y={64} width={32} height={180} fill={i % 2 === 0 ? "url(#yel)" : "#0A0A0A"} />
        ))}
        <rect x="0" y="60" width="200" height="5" fill="#0A0A0A" />
        <path d="M0 0 L200 0 L200 90 L0 150 Z" fill="url(#gloss)" />
      </g>
      <text x="100" y="47" textAnchor="middle" fontFamily={fonts.title} fontWeight={900} fontSize="31" fill="#FFFFFF" letterSpacing="0">
        C.A.E.C.
      </text>
      <path d={shape} fill="none" stroke="url(#rim)" strokeWidth="9" />
    </svg>
  );
};

/* ---------- Rayos de luz ---------- */
export const LightRays: React.FC<{ opacity?: number; y?: number }> = ({ opacity = 1, y = 760 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - 1200,
        top: y - 1200,
        width: 2400,
        height: 2400,
        opacity,
        transform: `rotate(${frame * 0.4}deg)`,
        background:
          "repeating-conic-gradient(from 0deg, rgba(255,210,31,0.16) 0deg 5deg, rgba(255,210,31,0) 5deg 18deg)",
        maskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 45%)",
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 45%)",
      }}
    />
  );
};

/* ---------- Confetti dorado (estallido) ---------- */
export const Confetti: React.FC<{ start: number; count?: number; originY?: number; seed?: string }> = ({
  start,
  count = 60,
  originY = 760,
  seed = "c",
}) => {
  const frame = useCurrentFrame();
  const f = frame - start;
  if (f < 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const a = random(`${seed}a${i}`) * Math.PI * 2;
        const v = 14 + random(`${seed}v${i}`) * 30;
        const t = f;
        const x = 540 + Math.cos(a) * v * t * 0.9;
        const y = originY + Math.sin(a) * v * t * 0.9 + 0.55 * t * t;
        const rot = t * (8 + random(`${seed}r${i}`) * 20);
        const o = interpolate(t, [0, 40, 70], [1, 1, 0], clamp);
        const w = 10 + random(`${seed}w${i}`) * 16;
        const gold = random(`${seed}g${i}`) > 0.35;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              height: w * 0.45,
              opacity: o,
              transform: `rotate(${rot}deg) rotateX(${rot * 2}deg)`,
              background: gold ? "linear-gradient(90deg,#FFF3B0,#FFD21F,#C99000)" : "#FFFFFF",
              borderRadius: 2,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- Glitch RGB para énfasis puntuales ---------- */
export const Glitch: React.FC<{ children: React.ReactNode; at: number; dur?: number }> = ({ children, at, dur = 8 }) => {
  const frame = useCurrentFrame();
  const f = frame - at;
  const active = f >= 0 && f < dur;
  if (!active) return <>{children}</>;
  const k = random(`g${frame}`);
  const dx = (k - 0.5) * 40;
  const sliceY = random(`gy${frame}`) * 100;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${dx}px)`, mixBlendMode: "screen", filter: "drop-shadow(6px 0 0 rgba(255,0,60,0.8)) drop-shadow(-6px 0 0 rgba(0,220,255,0.8))" }}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: `inset(${sliceY}% 0 ${Math.max(0, 100 - sliceY - 8)}% 0)`,
          transform: `translateX(${-dx * 1.5}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Transición de escena (entrada/salida) ---------- */
export const SceneWrap: React.FC<{ children: React.ReactNode; dur: number; enter?: "zoom" | "up" | "blur"; exitFrames?: number }> = ({
  children,
  dur,
  enter = "zoom",
  exitFrames = 6,
}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const outP = interpolate(frame, [dur - exitFrames, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const scale = (enter === "zoom" ? interpolate(inP, [0, 1], [1.12, 1]) : 1) * interpolate(outP, [0, 1], [1, 0.92]);
  const ty = enter === "up" ? interpolate(inP, [0, 1], [120, 0]) : 0;
  const blur = interpolate(inP, [0, 1], [18, 0]) + outP * 22;
  const op = Math.min(inP * 1.4, 1 - outP);
  return (
    <AbsoluteFill style={{ opacity: op, transform: `translateY(${ty}px) scale(${scale})`, filter: `blur(${blur}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

export const Kicker: React.FC<{ text: string; delay?: number; style?: React.CSSProperties }> = ({ text, delay = 0, style }) => {
  const p = useSpring(delay);
  return (
    <div
      style={{
        fontFamily: fonts.body,
        fontWeight: 800,
        fontSize: 34,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: C.yellow,
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
        textShadow: "0 0 24px rgba(255,210,31,0.5)",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/* ---------- Logo oficial del club (sin deformar: solo ancho, alto automático) ---------- */
export const Logo: React.FC<{ width: number; glow?: number; style?: React.CSSProperties }> = ({ width, glow = 0.4, style }) => (
  <Img
    src={staticFile("img/logo.png")}
    style={{
      width,
      height: "auto",
      display: "block",
      filter: `drop-shadow(0 ${width * 0.06}px ${width * 0.12}px rgba(0,0,0,0.6)) drop-shadow(0 0 ${width * 0.18 * glow}px rgba(255,214,0,${glow}))`,
      ...style,
    }}
  />
);

/* ---------- Moto en capas 3D: glow, podio, sombra, moto, brillos — con órbita de cámara ---------- */
export const Moto3D: React.FC<{
  width: number;
  delay?: number;
  orbit?: [number, number];
  orbitFrames?: number;
  fromX?: number;
}> = ({ width, delay = 0, orbit = [-22, 10], orbitFrames = 90, fromX = 700 }) => {
  const frame = useCurrentFrame();
  const f = frame - delay;
  const inP = useSpring(delay, { damping: 14, mass: 0.9, stiffness: 90 });
  const ry = interpolate(f, [0, orbitFrames], orbit, { ...clamp, easing: Easing.out(Easing.quad) });
  const rx = 8 + Math.sin(f / 30) * 1.5;
  const h = width * (871 / 970);
  const float = Math.sin(f / 18) * 8;
  const sweep = interpolate(f, [8, 34], [-30, 130], clamp);
  const layer = (z: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
    position: "absolute",
    left: 0,
    top: 0,
    width,
    height: h,
    transform: `translateZ(${z}px)`,
    ...extra,
  });
  return (
    <div style={{ width, height: h, perspective: 1300, opacity: Math.min(1, inP * 1.6) }}>
      <div
        style={{
          position: "relative",
          width,
          height: h,
          transformStyle: "preserve-3d",
          transform: `translateX(${(1 - inP) * fromX}px) rotateX(${rx}deg) rotateY(${ry + (1 - inP) * -35}deg) scale(${0.75 + inP * 0.25})`,
        }}
      >
        {/* capa 1: halo dorado al fondo */}
        <div style={layer(-320, { background: "radial-gradient(closest-side, rgba(255,205,0,0.55), rgba(255,205,0,0.12) 55%, rgba(255,205,0,0) 100%)", transform: "translateZ(-320px) scale(1.5)" })} />
        {/* capa 2: aro del podio (en el piso) */}
        <div
          style={{
            position: "absolute",
            left: width * 0.05,
            top: h * 0.95 - width * 0.45,
            width: width * 0.9,
            height: width * 0.9,
            borderRadius: "50%",
            transform: "rotateX(90deg)",
            border: "6px solid rgba(255,210,31,0.85)",
            boxShadow: "0 0 50px rgba(255,210,31,0.7), inset 0 0 60px rgba(255,210,31,0.45)",
            background: "radial-gradient(closest-side, rgba(0,0,0,0.65), rgba(0,0,0,0) 100%)",
          }}
        />
        {/* capa 3: moto, flotando */}
        <div style={layer(40, { transform: `translateZ(40px) translateY(${float}px)` })}>
          <Img
            src={staticFile("img/moto_cut.png")}
            style={{
              width: "100%",
              height: "100%",
              filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.7)) contrast(1.06) saturate(1.15)",
              maskImage: "linear-gradient(90deg, black 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(90deg, black 90%, transparent 100%)",
            }}
          />
          {/* barrido de luz sobre la moto */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep - 14}%, rgba(255,245,200,0.6) ${sweep}%, rgba(255,255,255,0) ${sweep + 14}%)`,
              mixBlendMode: "screen",
              maskImage: `url(${staticFile("img/moto_cut.png")})`,
              WebkitMaskImage: `url(${staticFile("img/moto_cut.png")})`,
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
            }}
          />
        </div>
        {/* capa 4: brillos en primer plano */}
        {new Array(10).fill(0).map((_, i) => {
          const x = random(`m3x${i}`) * width;
          const y = random(`m3y${i}`) * h * 0.9;
          const z = 160 + random(`m3z${i}`) * 220;
          const tw = Math.abs(Math.sin(f / 9 + i * 1.7));
          const sz = 8 + random(`m3s${i}`) * 10;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y + Math.sin(f / 20 + i) * 10,
                width: sz,
                height: sz,
                transform: `translateZ(${z}px) rotate(45deg)`,
                background: "#FFF3B0",
                opacity: tw * 0.9,
                boxShadow: "0 0 18px 4px rgba(255,214,0,0.8)",
                borderRadius: 2,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
