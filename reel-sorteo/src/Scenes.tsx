import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, Easing } from "remotion";
import { C, fonts, s2f, SILVER_GRADIENT } from "./theme";
import { Confetti, Glass, Glitch, Kicker, LightRays, Logo, Moto3D, Pill, Title3D, clamp, useSpring } from "./components";

// Tiempos absolutos (s) de cada escena: derivados de la locución
export const SCENES = {
  hook: [0, 1.22],
  dream: [1.22, 6.05],
  prizes: [6.05, 10.45],
  surprise: [10.45, 12.95],
  bono: [12.95, 15.7],
  listen: [15.7, 16.75],
  cash: [16.75, 21.25],
  question: [21.25, 22.55],
  end: [22.55, 24.9],
} as const;

// Convierte un tiempo absoluto de la voz a frame local de la escena
const at = (abs: number, scene: keyof typeof SCENES) => s2f(abs - SCENES[scene][0]);

// Zonas de layout (sin superposiciones): logo 220–320 · contenido 340–1170 · subtítulos 1250–1420
const Center: React.FC<{ y: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ y, children, style }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", ...style }}>{children}</div>
);

/* 1 · HOOK: la moto entra en capas 3D + "¡GRAN SORTEO!" ------------------ */
export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 3], [0.9, 0], clamp);
  const pill = useSpring(14, { damping: 12 });
  return (
    <AbsoluteFill>
      <LightRays y={860} opacity={interpolate(frame, [0, 8], [0, 1], clamp)} />
      <Glitch at={0} dur={4}>
        <AbsoluteFill>
          <Center y={330}>
            <Title3D text="¡GRAN SORTEO!" size={112} delay={0} depth={16} />
          </Center>
          <Center y={500}>
            <Moto3D width={740} delay={0} orbit={[-26, 8]} orbitFrames={60} fromX={900} />
          </Center>
          <Center y={1205} style={{ opacity: pill, transform: `translateY(${(1 - pill) * 30}px) scale(${0.85 + pill * 0.15})` }}>
            <Pill size={42}>1° premio · Moto 110cc</Pill>
          </Center>
        </AbsoluteFill>
      </Glitch>
      <Confetti start={3} count={60} originY={900} seed="hook" />
      <AbsoluteFill style={{ background: "#FFF6D0", opacity: flash }} />
    </AbsoluteFill>
  );
};

/* 2 · EL SUEÑO: jirafas de básquet para los chicos ---------------------- */
export const SceneDream: React.FC = () => {
  const frame = useCurrentFrame();
  const kidsIn = at(2.75, "dream");
  const logoIn = at(4.95, "dream");
  const card = useSpring(kidsIn, { damping: 15, mass: 0.9 });
  const label = useSpring(at(3.65, "dream"));
  const swap = interpolate(frame, [logoIn - 4, logoIn + 6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lg = useSpring(logoIn, { damping: 11, mass: 0.7 });
  const zoom = interpolate(frame, [kidsIn, 150], [1.06, 1.0], clamp);
  // antes de la foto: títulos centrados; luego suben a la franja superior
  const lift = useSpring(kidsIn - 4, { damping: 16 });
  const titleY = interpolate(lift, [0, 1], [560, 340]);
  return (
    <AbsoluteFill>
      {/* bloque título → se reemplaza por el escudo al nombrar el club */}
      <div style={{ position: "absolute", left: 0, right: 0, top: titleY, height: 240, opacity: 1 - swap, transform: `scale(${1 - swap * 0.2})` }}>
        <Center y={0}>
          <Title3D text="Sorteo" size={124} serif delay={0} depth={4} tilt={false} />
        </Center>
        <Center y={112}>
          <Title3D text="SOLIDARIO" size={120} delay={3} depth={14} />
        </Center>
        <Center y={262} style={{ opacity: 1 - lift }}>
          <Kicker text="¡Ayudando a ayudar!" delay={12} />
        </Center>
      </div>
      <Center y={300} style={{ opacity: swap }}>
        <div style={{ perspective: 1200 }}>
          <div style={{ transform: `rotateY(${(1 - lg) * 180}deg) scale(${0.6 + lg * 0.4})` }}>
            <Logo width={196} glow={0.6} />
          </div>
        </div>
      </Center>
      {/* foto de los chicos con la jirafa */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 600,
          width: 900,
          height: 475,
          opacity: card,
          transform: `perspective(1600px) translateY(${(1 - card) * 160}px) rotateX(${(1 - card) * 25}deg) rotateY(${Math.sin(frame / 40) * 2.5}deg)`,
        }}
      >
        <Glass style={{ width: "100%", height: "100%" }} radius={46}>
          <Img
            src={staticFile("img/kids.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 100%", transform: `scale(${zoom})`, transformOrigin: "50% 100%", filter: "contrast(1.06) saturate(1.12)" }}
          />
        </Glass>
      </div>
      <Center y={1100} style={{ opacity: label, transform: `translateY(${(1 - label) * 30}px)` }}>
        <Pill size={34}>
          <BallIcon /> Juntos por nuestra cancha
        </Pill>
      </Center>
    </AbsoluteFill>
  );
};

/* 3 · PREMIOS: moto 110cc (1°) → TV Smart 32" (2°), en 3D --------------- */
export const ScenePrizes: React.FC = () => {
  const frame = useCurrentFrame();
  const title = at(7.15, "prizes");
  const badge1 = useSpring(at(7.88, "prizes"), { damping: 9, mass: 0.6 });
  const tvT = at(8.8, "prizes");
  const sw = interpolate(frame, [tvT - 4, tvT + 8], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const tvIn = useSpring(tvT, { damping: 14 });
  const badge2 = useSpring(at(9.45, "prizes"), { damping: 9, mass: 0.6 });
  return (
    <AbsoluteFill>
      <LightRays y={780} opacity={0.6} />
      {/* PRIMER PREMIO */}
      <AbsoluteFill style={{ opacity: 1 - sw, transform: `perspective(1600px) translateX(${-sw * 500}px) rotateY(${sw * 40}deg)` }}>
        <Center y={340} style={{ transform: `scale(${badge1})` }}>
          <Pill size={44}>1° premio</Pill>
        </Center>
        <Center y={445}>
          <Moto3D width={640} delay={0} orbit={[24, -10]} orbitFrames={90} fromX={-800} />
        </Center>
        <Center y={1035} style={{ opacity: frame >= title ? 1 : 0 }}>
          <Title3D text="MOTO 110cc" size={140} delay={title} depth={16} />
        </Center>
      </AbsoluteFill>
      {/* SEGUNDO PREMIO */}
      {frame >= tvT - 4 ? (
        <AbsoluteFill style={{ opacity: tvIn, transform: `perspective(1600px) translateX(${(1 - tvIn) * 500}px) rotateY(${(1 - tvIn) * -40}deg)` }}>
          <Center y={340} style={{ transform: `scale(${badge2})` }}>
            <Pill size={44} dark>
              2° premio
            </Pill>
          </Center>
          <Center y={520}>
            <div style={{ transform: `perspective(1400px) rotateY(${Math.sin(frame / 25) * 8 - 6}deg) rotateX(6deg) scale(1.75)`, transformOrigin: "50% 0%" }}>
              <TV on={tvT + 3} />
            </div>
          </Center>
          <Center y={1040}>
            <Title3D text="TV SMART 32”" size={118} delay={tvT + 6} depth={14} gradient={SILVER_GRADIENT} extrudeColor="#5A5A5A" />
          </Center>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

/* 4 · LLEVÁ LA MOTO… CON UNA SORPRESA ----------------------------------- */
export const SceneSurprise: React.FC = () => {
  const sur = at(12.28, "surprise");
  const gift = useSpring(sur, { damping: 8, mass: 0.6 });
  return (
    <AbsoluteFill>
      <LightRays y={760} opacity={0.8} />
      <Center y={340}>
        <Title3D text="un regalo inolvidable" size={92} serif delay={2} depth={4} tilt={false} />
      </Center>
      <Center y={455}>
        <Moto3D width={620} delay={0} orbit={[-30, 18]} orbitFrames={75} fromX={0} />
      </Center>
      <Center y={1035} style={{ transform: `scale(${gift}) rotate(${(1 - gift) * 30}deg)` }}>
        <GiftIcon size={120} />
      </Center>
      <Confetti start={sur} count={50} originY={1080} seed="sur" />
    </AbsoluteFill>
  );
};

/* 6b · EFECTIVO → TEMPORADA DE VERANO GRATIS PARA 2 ------------------- */
export const SceneCash: React.FC = () => {
  const frame = useCurrentFrame();
  const top = useSpring(0, { damping: 15 });
  const ef = at(17.54, "cash");
  const temp = at(19.0, "cash");
  const grat = at(19.75, "cash");
  const two = at(20.32, "cash");
  const shrink = useSpring(temp - 6, { damping: 16 });
  const card = useSpring(temp, { damping: 14 });
  const twoP = useSpring(two, { damping: 10 });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(shrink, [0, 1], [520, 340]), transform: `scale(${interpolate(shrink, [0, 1], [1, 0.72])})`, transformOrigin: "50% 0%" }}>
        <Center y={0} style={{ opacity: top, transform: `translateY(${(1 - top) * 30}px)` }}>
          <Kicker text="Pagando en" delay={0} style={{ fontSize: 44 }} />
        </Center>
        <Center y={80}>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <CoinIcon size={140} at={ef} />
            <Title3D text="EFECTIVO" size={150} delay={ef - 2} depth={16} />
          </div>
        </Center>
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 590,
          width: 900,
          height: 580,
          opacity: card,
          transform: `perspective(1600px) translateY(${(1 - card) * 160}px) rotateX(${(1 - card) * 22}deg)`,
        }}
      >
        <Glass style={{ width: "100%", height: "100%" }} radius={50} padding={48}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 32, letterSpacing: "0.2em", color: C.muted }}>ENTRÁS AL SORTEO POR</div>
              <div style={{ fontFamily: fonts.title, fontWeight: 900, fontSize: 80, color: "#fff", lineHeight: 1, marginTop: 18 }}>
                Temporada
                <br />
                de verano
              </div>
            </div>
            <SunIcon size={150} />
          </div>
          <div style={{ marginTop: 18, display: "flex", opacity: frame >= grat ? 1 : 0 }}>
            <Title3D text="GRATIS" size={140} delay={grat} depth={16} tilt={false} />
          </div>
          <div style={{ marginTop: 26, transform: `scale(${twoP})`, transformOrigin: "0% 50%" }}>
            <Pill size={34}>
              <PeopleIcon /> para 2 personas
            </Pill>
          </div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

/* 7 · ¿TE LO VAS A PERDER? ------------------------------------------- */
export const SceneQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 39], [1, 1.08]);
  return (
    <AbsoluteFill>
      <LightRays y={780} opacity={0.5} />
      <Glitch at={2} dur={5}>
        <AbsoluteFill style={{ transform: `scale(${push})` }}>
          <Center y={560}>
            <Title3D text="¿TE LO VAS" size={150} delay={0} depth={14} gradient={SILVER_GRADIENT} extrudeColor="#4A4A4A" />
          </Center>
          <Center y={740}>
            <Title3D text="A PERDER?" size={176} delay={5} depth={16} />
          </Center>
        </AbsoluteFill>
      </Glitch>
    </AbsoluteFill>
  );
};

/* 8 · CIERRE ---------------------------------------------------------- */
export const SceneEnd: React.FC = () => {
  const frame = useCurrentFrame();
  const sh = useSpring(0, { damping: 11, mass: 0.8 });
  const info = useSpring(14, { damping: 15 });
  const cta = useSpring(22, { damping: 12 });
  const pulse = 1 + 0.03 * Math.sin(frame / 4.5) * (frame > 30 ? 1 : 0);
  return (
    <AbsoluteFill>
      <LightRays y={480} opacity={0.9} />
      <Confetti start={1} count={60} originY={480} seed="end" />
      <Center y={300}>
        <div style={{ perspective: 1200 }}>
          <div style={{ transform: `rotateY(${(1 - sh) * -120 + Math.sin(frame / 20) * 8}deg) scale(${0.5 + sh * 0.5})` }}>
            <Logo width={250} glow={0.7} />
          </div>
        </div>
      </Center>
      <Center y={660}>
        <Title3D text="GRAN SORTEO" size={120} delay={4} depth={14} />
      </Center>
      <Center y={790}>
        <Title3D text="Solidario" size={104} serif delay={8} depth={4} tilt={false} />
      </Center>
      <Center y={935} style={{ opacity: info, transform: `translateY(${(1 - info) * 40}px)` }}>
        <div style={{ display: "flex", gap: 20 }}>
          <Pill dark size={30}>
            <CalIcon /> Sorteo: diciembre
          </Pill>
          <Pill dark size={30}>
            Lotería de Santa Fe
          </Pill>
        </div>
      </Center>
      <Center y={1040} style={{ opacity: cta, transform: `scale(${(0.8 + cta * 0.2) * pulse})` }}>
        <Pill size={48}>Comprá tu bono</Pill>
      </Center>
      <Center y={1165} style={{ opacity: cta }}>
        <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 27, color: C.muted, textAlign: "center" }}>
          Secretaría · Subcomisión de Básquet · Comisión Directiva
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* Logo oficial discreto (zona segura superior izquierda) -------------- */
export const CornerLogo: React.FC = () => {
  const p = useSpring(0, { damping: 16 });
  return (
    <div style={{ position: "absolute", left: 64, top: 222, opacity: p * 0.95, transform: `translateX(${(1 - p) * -30}px)` }}>
      <Logo width={74} glow={0.25} />
    </div>
  );
};

const TV: React.FC<{ on: number }> = ({ on }) => {
  const frame = useCurrentFrame();
  const f = frame - on;
  const lineW = interpolate(f, [0, 4], [0, 100], clamp);
  const open = interpolate(f, [4, 10], [0.02, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "relative", width: 450 }}>
      <div
        style={{
          width: 450,
          height: 270,
          borderRadius: 18,
          padding: 10,
          background: "linear-gradient(160deg,#3a3a3a,#0c0c0c 40%,#1e1e1e)",
          boxShadow: "0 30px 70px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 60px rgba(255,200,0,0.15)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 8, background: "#020202", overflow: "hidden" }}>
          {f >= 0 ? (
            <div
              style={{
                position: "absolute",
                left: `${50 - lineW / 2}%`,
                width: `${lineW}%`,
                top: `${50 - open * 50}%`,
                height: `${Math.max(open * 100, 1.5)}%`,
                background: "radial-gradient(80% 90% at 50% 40%, #6B5200 0%, #1a1400 60%, #050505 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
                boxShadow: "0 0 30px rgba(255,255,255,0.6)",
              }}
            >
              <div style={{ opacity: open, transform: `scale(${open})`, display: "flex", alignItems: "center", gap: 16 }}>
                <Logo width={74} glow={0.4} />
                <div style={{ fontFamily: fonts.title, fontWeight: 900, fontSize: 40, color: "#fff", lineHeight: 1 }}>
                  SMART
                  <br />
                  <span style={{ color: C.yellow }}>TV</span>
                </div>
              </div>
            </div>
          ) : null}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 40%)" }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", width: 300, margin: "0 auto" }}>
        <div style={{ width: 10, height: 26, background: "#2a2a2a", transform: "skewX(20deg)" }} />
        <div style={{ width: 10, height: 26, background: "#2a2a2a", transform: "skewX(-20deg)" }} />
      </div>
    </div>
  );
};

/* 4 · LLEVÁ LA MOTO… CON UNA SORPRESA ----------------------------------- */
const GiftIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.6)) drop-shadow(0 0 20px rgba(255,200,0,0.6))" }}>
    <defs>
      <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a2a2a" />
        <stop offset="1" stopColor="#050505" />
      </linearGradient>
      <linearGradient id="gr" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFF3B0" />
        <stop offset="0.5" stopColor="#FFD21F" />
        <stop offset="1" stopColor="#C99000" />
      </linearGradient>
    </defs>
    <rect x="14" y="42" width="72" height="50" rx="6" fill="url(#gb)" stroke="url(#gr)" strokeWidth="2" />
    <rect x="9" y="30" width="82" height="16" rx="5" fill="url(#gb)" stroke="url(#gr)" strokeWidth="2" />
    <rect x="44" y="30" width="12" height="62" fill="url(#gr)" />
    <path d="M50 30 C38 10 22 18 32 28 C36 31 44 30 50 30 C56 30 64 31 68 28 C78 18 62 10 50 30 Z" fill="url(#gr)" />
  </svg>
);

/* 5 · BONO: 3 cuotas de $15.000 --------------------------------------- */
const CoinIcon: React.FC<{ size: number; at: number }> = ({ size, at: a }) => {
  const frame = useCurrentFrame();
  const p = useSpring(a, { damping: 9, mass: 0.6 });
  const spin = Math.cos((frame - a) / 6);
  return (
    <div style={{ width: size, height: size, transform: `scale(${p}) scaleX(${frame >= a ? 0.35 + 0.65 * Math.abs(spin) : 1})` }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.6)) drop-shadow(0 0 22px rgba(255,200,0,0.6))" }}>
        <defs>
          <radialGradient id="cg" cx="35%" cy="30%" r="80%">
            <stop offset="0" stopColor="#FFF6C8" />
            <stop offset="0.45" stopColor="#FFD21F" />
            <stop offset="1" stopColor="#A87400" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#cg)" />
        <circle cx="50" cy="50" r="37" fill="none" stroke="#9A6A00" strokeWidth="3" />
        <text x="50" y="66" textAnchor="middle" fontFamily={fonts.title} fontWeight={900} fontSize="46" fill="#7A5200">
          $
        </text>
      </svg>
    </div>
  );
};

const SunIcon: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${frame * 0.6}deg)`, filter: "drop-shadow(0 0 30px rgba(255,200,0,0.7))" }}>
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x="48" y="4" width="4" height="14" rx="2" fill="#FFD21F" opacity="0.85" transform={`rotate(${i * 30} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="24" fill="#FFD21F" opacity="0.9" />
    </svg>
  );
};

const PeopleIcon: React.FC = () => (
  <svg width="58" height="40" viewBox="0 0 58 40">
    <circle cx="19" cy="11" r="8" fill="#111" />
    <path d="M4 38 Q4 22 19 22 Q34 22 34 38 Z" fill="#111" />
    <circle cx="39" cy="11" r="8" fill="#111" />
    <path d="M24 38 Q24 22 39 22 Q54 22 54 38 Z" fill="#111" />
  </svg>
);

/* 7 · ¿TE LO VAS A PERDER? ------------------------------------------- */
const CalIcon: React.FC = () => (
  <svg width="34" height="34" viewBox="0 0 34 34">
    <rect x="3" y="6" width="28" height="25" rx="5" fill="none" stroke="#FFD21F" strokeWidth="3" />
    <path d="M3 13 H31 M10 2 V9 M24 2 V9" stroke="#FFD21F" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/* Logo discreto persistente (zona segura superior izquierda) ----------- */
const BallIcon: React.FC<{ size?: number }> = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="18" fill="#E8741C" stroke="#111" strokeWidth="2.5" />
    <path d="M2 20 H38 M20 2 V38 M7 7 Q20 20 7 33 M33 7 Q20 20 33 33" stroke="#111" strokeWidth="2.5" fill="none" />
  </svg>
);

/* 3 · PREMIOS: moto 110cc (1°) y TV Smart 32" (2°) ---------------------- */
export const SceneBono: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useSpring(0, { damping: 15 });
  const ticks = [14.1, 14.27, 14.44].map((s) => at(s, "bono"));
  const moneyT = at(14.66, "bono");
  const count = interpolate(frame, [moneyT, moneyT + 14], [0, 15000], { ...clamp, easing: Easing.out(Easing.cubic) });
  const money = useSpring(moneyT, { damping: 11 });
  return (
    <AbsoluteFill>
      <Center y={300}>
        <Kicker text="Bono contribución" delay={2} />
      </Center>
      <Center y={370}>
        <Title3D text="Adquirí tu bono" size={112} serif delay={0} depth={6} tilt={false} />
      </Center>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 560,
          width: 860,
          height: 560,
          opacity: card,
          transform: `perspective(1600px) translateY(${(1 - card) * 140}px) rotateX(${(1 - card) * 20}deg)`,
        }}
      >
        <Glass style={{ width: "100%", height: "100%" }} radius={50} padding={50}>
          <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 36, letterSpacing: "0.2em", color: C.muted, textAlign: "center" }}>
            EN 3 CUOTAS
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 34 }}>
            {ticks.map((t, i) => {
              const fill = interpolate(frame, [t, t + 5], [0, 1], clamp);
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 120,
                    borderRadius: 28,
                    position: "relative",
                    overflow: "hidden",
                    border: "2px solid rgba(255,210,31,0.5)",
                    background: "rgba(255,255,255,0.04)",
                    transform: `scale(${1 + 0.06 * Math.sin(Math.PI * fill)})`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: `${fill * 100}%`,
                      background: "linear-gradient(180deg,#FFF0A0,#FFD21F 50%,#E6A600)",
                      boxShadow: "0 0 30px rgba(255,210,31,0.8)",
                    }}
                  />
                  <div
                    style={{
                      position: "relative",
                      fontFamily: fonts.title,
                      fontWeight: 900,
                      fontSize: 66,
                      lineHeight: "116px",
                      textAlign: "center",
                      color: fill > 0.5 ? "#111" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {i + 1}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 40, display: "flex", justifyContent: "center", opacity: money, transform: `scale(${0.7 + money * 0.3})` }}>
            <Title3D
              text={`$${Math.round(count).toLocaleString("es-AR")}`}
              size={170}
              delay={moneyT}
              depth={18}
              tilt={false}
            />
          </div>
          <div style={{ textAlign: "center", fontFamily: fonts.body, fontWeight: 800, fontSize: 34, color: C.muted, letterSpacing: "0.2em", marginTop: 6, opacity: money }}>
            PESOS POR CUOTA
          </div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

/* 6a · PERO ESCUCHÁ BIEN (golpe amarillo) ------------------------------ */
export const SceneListen: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(0, { damping: 12 });
  const shake = frame < 6 ? (random(`sh${frame}`) - 0.5) * 24 : 0;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(170deg,#FFE347 0%,#FFD21F 50%,#F4B800 100%)" }}>
      <AbsoluteFill style={{ background: "radial-gradient(80% 50% at 50% 45%, rgba(255,255,255,0.45), rgba(255,255,255,0) 70%)" }} />
      <Glitch at={0} dur={6}>
        <AbsoluteFill style={{ transform: `translateX(${shake}px) scale(${interpolate(frame, [0, 31], [1.05, 1])})` }}>
          <Center y={600}>
            <div style={{ fontFamily: fonts.title, fontWeight: 900, fontSize: 196, color: "#0A0A0A", letterSpacing: "-0.04em", transform: `scale(${0.8 + p * 0.2})`, textShadow: "0 6px 0 rgba(0,0,0,0.12)" }}>
              ESCUCHÁ
            </div>
          </Center>
          <Center y={800}>
            <div style={{ fontFamily: fonts.serif, fontStyle: "italic", fontSize: 230, color: "#0A0A0A", opacity: interpolate(frame, [5, 11], [0, 1], clamp), transform: `translateY(${interpolate(frame, [5, 14], [40, 0], clamp)}px)` }}>
              bien.
            </div>
          </Center>
        </AbsoluteFill>
      </Glitch>
    </AbsoluteFill>
  );
};

/* 6b · EFECTIVO → TEMPORADA DE VERANO GRATIS PARA 2 ------------------- */