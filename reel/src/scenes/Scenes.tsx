import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { brand, display, gradients, ui } from "../theme";
import { Glass, Pill, usePop } from "../components/Glass";
import { Title3D } from "../components/Title3D";
import * as I from "../components/Icons";

// Zonas de la escena gráfica (presentador en recuadro arriba a la derecha)
const COL = { x: 64, y: 410, w: 546, h: 332 }; // columna izquierda
const ROW = { x: 64, y: 780, w: 952, h: 350 }; // fila inferior
const RIGHT = { x: 640, y: 780, w: 376, h: 350 }; // debajo del recuadro

const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number; style?: React.CSSProperties }> = ({
  children,
  size = 30,
  color = "rgba(255,255,255,.7)",
  weight = 600,
  style,
}) => (
  <div style={{ fontFamily: ui, fontSize: size, fontWeight: weight, color, letterSpacing: size < 34 ? 2 : -0.5, ...style }}>{children}</div>
);

const Big: React.FC<{ children: React.ReactNode; size?: number; gradient?: string; style?: React.CSSProperties }> = ({
  children,
  size = 64,
  gradient = gradients.metal,
  style,
}) => (
  <div
    style={{
      fontFamily: display,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: -1,
      backgroundImage: gradient,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      filter: "drop-shadow(0 4px 0 rgba(0,0,0,.35)) drop-shadow(0 10px 18px rgba(0,0,0,.45))",
      ...style,
    }}
  >
    {children}
  </div>
);

const IconBadge: React.FC<{ color: string; children: React.ReactNode; size?: number }> = ({ color, children, size = 96 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: `linear-gradient(145deg, ${color} 0%, ${color}99 100%)`,
      boxShadow: `0 12px 30px ${color}55, inset 0 2px 0 rgba(255,255,255,.45), inset 0 -3px 0 rgba(0,0,0,.18)`,
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

// ------------------------------------------------------------------ HOOK
export const HookScene: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <Title3D text="PEÑA" size={104} delay={1} gradient={gradients.metal} />
      <Title3D text="FOLKLÓRICA" size={104} delay={4} gradient={gradients.gold} depthColor="#7A4A0E" glow="rgba(253,203,110,.45)" />
    </div>
    <PillIn delay={10} top={1385}>
      <Pill color={brand.yellow}>Domingo 11 · Octubre</Pill>
    </PillIn>
  </>
);

const PillIn: React.FC<{ delay: number; top: number; children: React.ReactNode }> = ({ delay, top, children }) => {
  const p = usePop(delay);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 30}px) scale(${0.9 + p * 0.1})`,
      }}
    >
      {children}
    </div>
  );
};

// ------------------------------------------------------------------ PRESENTACIÓN
export const NameScene: React.FC = () => (
  <Glass delay={0} from="right" radius={30} tint="rgba(8,10,18,.7)" style={{ left: 536, top: 600, width: 480, height: 124 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 24px" }}>
      <IconBadge color={brand.teal} size={80}>
        <I.Star size={42} />
      </IconBadge>
      <div>
        <Label size={40} color="#fff" weight={800} style={{ letterSpacing: -0.5 }}>Santiago</Label>
        <Label size={22} style={{ letterSpacing: 1.5, whiteSpace: "nowrap" }}>CLIENTE DE SIEMPRE</Label>
      </div>
    </div>
  </Glass>
);

// ------------------------------------------------------------------ FLYER
export const FlyerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 2, fps, config: { damping: 14, stiffness: 90 } });
  const rotY = interpolate(p, [0, 1], [-45, 10]) + Math.sin(frame / 30) * 3;
  return (
    <>
      <div style={{ position: "absolute", left: 64, top: 405, width: 490, height: 728, perspective: 1400 }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 26,
            overflow: "hidden",
            transform: `rotateY(${rotY}deg) rotateZ(${(1 - p) * -8 - 1.5}deg) translateY(${(1 - p) * 200}px)`,
            opacity: Math.min(1, p * 1.5),
            boxShadow: "0 50px 100px rgba(0,0,0,.7), 0 0 0 2px rgba(255,255,255,.4)",
          }}
        >
          <Img src={staticFile("images/flyer.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(115deg, transparent ${interpolate(frame, [20, 60], [-30, 130])}%, rgba(255,255,255,.45) ${interpolate(frame, [20, 60], [-20, 140])}%, transparent ${interpolate(frame, [20, 60], [-10, 150])}%)`,
            }}
          />
        </div>
      </div>
      <Glass delay={58} from="right" radius={32} style={{ left: RIGHT.x, top: RIGHT.y, width: RIGHT.w, height: 160 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: 26 }}>
          <IconBadge color={brand.red} size={92}>
            <I.Calendar size={50} />
          </IconBadge>
          <div>
            <Label size={24}>DOMINGO</Label>
            <Big size={52}>11 OCT</Big>
          </div>
        </div>
      </Glass>
      <Glass delay={137} from="right" radius={32} style={{ left: RIGHT.x, top: RIGHT.y + 186, width: RIGHT.w, height: 164 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "0 28px" }}>
          <Label size={24}>EN “LA RESERVA”</Label>
          <Big size={46} gradient={gradients.gold}>PEÑA</Big>
          <Big size={46} gradient={gradients.gold}>FOLKLÓRICA</Big>
        </div>
      </Glass>
    </>
  );
};

// ------------------------------------------------------------------ DÍA / HORA / LUGAR
const Ring: React.FC<{ progress: number; color: string; size: number }> = ({ progress, color, size }) => {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.12)" strokeWidth={12} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        style={{ filter: `drop-shadow(0 0 10px ${color})` }}
      />
    </svg>
  );
};

export const InfoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const ring = interpolate(frame, [30, 58], [0, 11 / 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Glass delay={2} from="left" style={{ left: COL.x, top: COL.y, width: COL.w, height: COL.h }}>
        <div style={{ padding: 34, display: "flex", flexDirection: "column", gap: 18 }}>
          <IconBadge color={brand.red}>
            <I.Calendar size={54} />
          </IconBadge>
          <Label size={28}>ESTE DOMINGO</Label>
          <Big size={64}>11 de octubre</Big>
        </div>
      </Glass>
      <Glass delay={29} from="up" style={{ left: ROW.x, top: ROW.y, width: 462, height: ROW.h }}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div style={{ position: "relative", width: 236, height: 236, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: 0 }}>
              <Ring progress={ring} color={brand.teal} size={236} />
            </div>
            <Big size={66}>11:00</Big>
          </div>
          <Label size={24}>DE LA MAÑANA</Label>
        </div>
      </Glass>
      <Glass delay={80} from="up" style={{ left: ROW.x + 490, top: ROW.y, width: 462, height: ROW.h }}>
        <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 14 }}>
          <IconBadge color={brand.yellow}>
            <I.Pin size={54} color="#3a2a05" />
          </IconBadge>
          <Big size={56} gradient={gradients.gold}>La Reserva</Big>
          <RouteTag delay={176} />
        </div>
      </Glass>
    </>
  );
};

const RouteTag: React.FC<{ delay: number }> = ({ delay }) => {
  const p = usePop(delay);
  const frame = useCurrentFrame();
  if (frame < delay) return <Label size={26}>EN EL PREDIO</Label>;
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)`, display: "flex", alignItems: "center", gap: 10 }}>
      <I.Road size={34} color={brand.teal} />
      <Label size={30} color="#fff" weight={700} style={{ letterSpacing: 0 }}>Ruta 90 · km 2.3</Label>
    </div>
  );
};

// ------------------------------------------------------------------ CÓMO LLEGAR
export const RouteScene: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = (a: number, b: number) => interpolate(frame, [a, b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bridge = usePop(28);
  const turn = usePop(103);
  const pin = usePop(112);
  return (
    <>
      <Glass delay={0} from="left" style={{ left: COL.x, top: COL.y, width: COL.w, height: 720 }}>
        <svg width={546} height={720} viewBox="0 0 546 720">
          <defs>
            <linearGradient id="road" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#ffffff" stopOpacity={0.15} />
              <stop offset="1" stopColor="#ffffff" stopOpacity={0.9} />
            </linearGradient>
          </defs>
          {/* Ruta 90 */}
          <path d="M200 700 L200 230" stroke="rgba(255,255,255,.12)" strokeWidth={46} strokeLinecap="round" />
          <path d="M200 700 L200 230" stroke="url(#road)" strokeWidth={6} strokeDasharray="470" strokeDashoffset={470 * draw(4, 40)} strokeLinecap="round" />
          {/* autopista (puente) */}
          <g opacity={bridge} transform={`translate(0 ${(1 - bridge) * 20})`}>
            <path d="M40 430 L506 430" stroke={brand.teal} strokeOpacity={0.35} strokeWidth={40} />
            <path d="M40 430 L506 430" stroke={brand.teal} strokeWidth={5} strokeDasharray="18 14" />
            <rect x={164} y={404} width={72} height={52} rx={10} fill="rgba(255,255,255,.18)" stroke="#fff" strokeWidth={2.5} />
          </g>
          {/* a mano derecha */}
          <path
            d="M200 230 Q200 150 280 150 L420 150"
            stroke={brand.yellow}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
            strokeDasharray="300"
            strokeDashoffset={300 * draw(103, 125)}
            style={{ filter: `drop-shadow(0 0 12px ${brand.yellow})` }}
          />
          <g opacity={turn}>
            <path d="M420 128 L452 150 L420 172" stroke={brand.yellow} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g transform={`translate(470 ${150 - pin * 40}) scale(${pin})`} opacity={pin}>
            <circle cx={0} cy={40} r={26} fill={brand.red} style={{ filter: `drop-shadow(0 0 16px ${brand.red})` }} />
            <circle cx={0} cy={40} r={10} fill="#fff" />
          </g>
        </svg>
        <div style={{ position: "absolute", left: 236, top: 560, fontFamily: ui, fontWeight: 800, fontSize: 30, color: "#fff" }}>RUTA 90</div>
        <div style={{ position: "absolute", left: 250, top: 452, opacity: bridge, fontFamily: ui, fontWeight: 700, fontSize: 24, color: brand.teal, letterSpacing: 1.5 }}>
          PUENTE AUTOPISTA
        </div>
        <div style={{ position: "absolute", left: 230, top: 70, opacity: turn, fontFamily: ui, fontWeight: 800, fontSize: 28, color: brand.yellow, letterSpacing: 1.5 }}>
          A MANO DERECHA
        </div>
      </Glass>
      <Glass delay={8} from="right" radius={32} style={{ left: RIGHT.x, top: RIGHT.y, width: RIGHT.w, height: RIGHT.h }}>
        <div style={{ padding: 30, display: "flex", flexDirection: "column", gap: 14 }}>
          <IconBadge color={brand.red} size={84}>
            <I.Pin size={46} />
          </IconBadge>
          <Big size={48} gradient={gradients.gold}>La Reserva</Big>
          <Label size={30} color="#fff" weight={700} style={{ letterSpacing: 0 }}>Ruta 90 · km 2.3</Label>
        </div>
      </Glass>
    </>
  );
};

// ------------------------------------------------------------------ QUÉ VA A HABER
const Feature: React.FC<{ delay: number; color: string; icon: React.ReactNode; title: string; style: React.CSSProperties; big?: boolean }> = ({
  delay,
  color,
  icon,
  title,
  style,
  big,
}) => (
  <Glass delay={delay} from="scale" radius={34} style={style}>
    <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: big ? "flex-start" : "center", gap: 22, padding: big ? 40 : 18 }}>
      <IconBadge color={color} size={big ? 120 : 104}>
        {icon}
      </IconBadge>
      <Big size={big ? 66 : 40} style={{ textAlign: big ? "left" : "center" }}>{title}</Big>
    </div>
  </Glass>
);

export const FeaturesScene: React.FC = () => {
  const d = (s: number) => Math.round((s - 36.0) * 30);
  const w = (ROW.w - 2 * 22) / 3;
  return (
    <>
      <Feature big delay={d(38.05)} color={brand.red} icon={<I.Music size={66} />} title={"Buena\nmúsica"} style={{ left: COL.x, top: COL.y, width: COL.w, height: COL.h, whiteSpace: "pre" }} />
      <Feature delay={d(40.45)} color={brand.teal} icon={<I.Dance size={58} />} title="Danza" style={{ left: ROW.x, top: ROW.y, width: w, height: ROW.h }} />
      <Feature delay={d(42.85)} color={brand.yellow} icon={<I.Food size={58} color="#3a2a05" />} title="Gastro- nomía" style={{ left: ROW.x + w + 22, top: ROW.y, width: w, height: ROW.h }} />
      <Feature delay={d(44.45)} color={brand.salmon} icon={<I.Parking size={58} />} title="Estacio- namiento" style={{ left: ROW.x + 2 * (w + 22), top: ROW.y, width: w, height: ROW.h }} />
    </>
  );
};

// ------------------------------------------------------------------ PRECIO
export const PriceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [22, 44], [0, 15000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) / 100) * 100;
  const txt = `$${n.toLocaleString("es-AR")}`;
  return (
    <>
      <Glass delay={0} from="left" style={{ left: COL.x, top: COL.y, width: COL.w, height: COL.h }}>
        <div style={{ padding: 36, display: "flex", flexDirection: "column", gap: 20 }}>
          <IconBadge color={brand.yellow} size={110}>
            <I.Ticket size={62} color="#3a2a05" />
          </IconBadge>
          <Big size={70}>Entrada</Big>
        </div>
      </Glass>
      <Glass delay={8} from="up" style={{ left: ROW.x, top: ROW.y, width: ROW.w, height: ROW.h }} tint="rgba(253,203,110,.08)">
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Title3D text={txt} size={170} delay={10} gradient={gradients.gold} depthColor="#7A4A0E" glow="rgba(253,203,110,.5)" />
        </div>
      </Glass>
    </>
  );
};

// ------------------------------------------------------------------ PASO A PASO (insignia superior)
export const StoreBadge: React.FC<{ title: string; sub: string; icon: "store" | "ticket"; checkAt?: number }> = ({ title, sub, icon, checkAt }) => {
  const check = usePop(checkAt ?? 99999);
  const frame = useCurrentFrame();
  return (
    <Glass delay={0} from="scale" radius={36} tint="rgba(8,10,18,.72)" style={{ left: 140, top: 430, width: 800, height: 170 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 30px", height: "100%" }}>
        <IconBadge color={icon === "store" ? brand.teal : brand.yellow} size={104}>
          {icon === "store" ? <I.Store size={58} /> : <I.Ticket size={58} color="#3a2a05" />}
        </IconBadge>
        <div style={{ flex: 1 }}>
          <Big size={46}>{title}</Big>
          <Label size={30} color="rgba(255,255,255,.85)" weight={600} style={{ letterSpacing: 0, marginTop: 8 }}>{sub}</Label>
        </div>
        {checkAt !== undefined && frame >= checkAt && (
          <div style={{ transform: `scale(${check})`, opacity: check }}>
            <I.Check size={70} color={brand.teal} />
          </div>
        )}
      </div>
    </Glass>
  );
};

// ------------------------------------------------------------------ NOTAS MUSICALES (invitación a cantar)
export const NotesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const notes = [
    { x: 780, d: 0, c: brand.yellow, s: 64 },
    { x: 880, d: 8, c: brand.teal, s: 50 },
    { x: 700, d: 15, c: brand.salmon, s: 44 },
  ];
  return (
    <>
      {notes.map((n, i) => {
        const t = frame - n.d;
        if (t < 0) return null;
        const y = 760 - t * 4.2;
        const op = interpolate(t, [0, 8, 45, 60], [0, 1, 1, 0], { extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ position: "absolute", left: n.x + Math.sin(t / 8) * 18, top: y, opacity: op, filter: `drop-shadow(0 0 14px ${n.c})` }}>
            <I.Music size={n.s} color={n.c} />
          </div>
        );
      })}
    </>
  );
};

// ------------------------------------------------------------------ RESUMEN
export const RecapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const ring = interpolate(frame, [42, 70], [0, 11 / 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", left: COL.x, top: COL.y + 10, width: COL.w }}>
        <Title3D text="DOMINGO" size={96} delay={2} align="left" />
        <div style={{ height: 14 }} />
        <Title3D text="11 OCT" size={130} delay={8} align="left" gradient={gradients.gold} depthColor="#7A4A0E" glow="rgba(253,203,110,.45)" />
      </div>
      <Glass delay={38} from="up" style={{ left: ROW.x, top: ROW.y, width: ROW.w, height: ROW.h }}>
        <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 40px", gap: 40 }}>
          <div style={{ position: "relative", width: 250, height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute" }}>
              <Ring progress={ring} color={brand.red} size={250} />
            </div>
            <I.Clock size={92} />
          </div>
          <div>
            <Big size={110}>11:00 HS</Big>
            <Label size={32} color="rgba(255,255,255,.8)" style={{ letterSpacing: 0, marginTop: 14 }}>La Reserva · Ruta 90 km 2.3</Label>
          </div>
        </div>
      </Glass>
    </>
  );
};

// ------------------------------------------------------------------ WAYQE
const Chip: React.FC<{ delay: number; color: string; icon?: React.ReactNode; children: string }> = ({ delay, color, icon, children }) => {
  const p = usePop(delay, 220);
  const frame = useCurrentFrame();
  if (frame < delay) return null;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 26px",
        borderRadius: 999,
        background: "linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.06))",
        border: `1.5px solid ${color}aa`,
        boxShadow: `0 10px 26px rgba(0,0,0,.45), 0 0 22px ${color}40`,
        fontFamily: ui,
        fontWeight: 800,
        fontSize: 34,
        color: "#fff",
        transform: `scale(${0.6 + p * 0.4}) translateY(${(1 - p) * 20}px)`,
        opacity: Math.min(1, p * 1.5),
      }}
    >
      {icon ?? <span style={{ width: 14, height: 14, borderRadius: 7, background: color, boxShadow: `0 0 12px ${color}` }} />}
      {children}
    </div>
  );
};

export const WayqeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = (s: number) => Math.round((s - 65.5) * 30);
  const p = spring({ frame: frame - 2, fps, config: { damping: 15, stiffness: 100 } });
  const kb = 1.06 + frame * 0.0004;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: COL.x,
          top: COL.y,
          width: COL.w,
          height: COL.h,
          borderRadius: 32,
          overflow: "hidden",
          perspective: 1000,
          transform: `translateX(${(1 - p) * -140}px) rotateY(${(1 - p) * 30}deg)`,
          opacity: Math.min(1, p * 1.5),
          boxShadow: "0 40px 90px rgba(0,0,0,.65), 0 0 0 2px rgba(255,255,255,.35)",
        }}
      >
        <Img src={staticFile("images/wayqe.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,.65) 100%)" }} />
        <div style={{ position: "absolute", left: 24, bottom: 22, fontFamily: ui, fontWeight: 800, fontSize: 28, color: "#fff", letterSpacing: 2 }}>
          RUMBO A COSQUÍN
        </div>
      </div>
      <div style={{ position: "absolute", left: ROW.x, top: ROW.y - 6 }}>
        <Title3D text="WAYQE" size={150} delay={d(67.9)} align="left" gradient={gradients.coral} depthColor="#7E2329" glow="rgba(240,88,98,.45)" tracking={2} />
      </div>
      <div style={{ position: "absolute", left: ROW.x, top: ROW.y + 172, width: ROW.w, display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Chip delay={d(70.85)} color={brand.teal}>Toda la provincia</Chip>
        <Chip delay={d(72.96)} color={brand.yellow}>Córdoba</Chip>
        <Chip delay={d(75.28)} color={brand.red} icon={<I.Star size={34} color={brand.red} />}>Cosquín</Chip>
        <Chip delay={d(77.16)} color={brand.salmon} icon={<I.Tv size={34} color={brand.salmon} />}>Canal 9</Chip>
      </div>
    </>
  );
};

// ------------------------------------------------------------------ PLACA FINAL
export const EndCard: React.FC = () => {
  const row = (delay: number, color: string, icon: React.ReactNode, a: string, b: string) => (
    <Glass delay={delay} from="up" radius={30} style={{ position: "relative", width: ROW.w, height: 132 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 26px", height: "100%" }}>
        <IconBadge color={color} size={84}>
          {icon}
        </IconBadge>
        <div>
          <Label size={40} color="#fff" weight={800} style={{ letterSpacing: -0.5 }}>{a}</Label>
          <Label size={27} color="rgba(255,255,255,.75)" style={{ letterSpacing: 0.5 }}>{b}</Label>
        </div>
      </div>
    </Glass>
  );
  const logo = usePop(4, 120);
  return (
    <>
      <div style={{ position: "absolute", left: COL.x, top: 300, width: COL.w, height: 440, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Img
          src={staticFile("brand/logo.png")}
          style={{
            width: 470,
            height: "auto",
            transform: `scale(${0.6 + logo * 0.4}) rotate(${(1 - logo) * -6}deg)`,
            opacity: Math.min(1, logo * 1.4),
            filter: "drop-shadow(0 20px 40px rgba(0,0,0,.6))",
          }}
        />
      </div>
      <div style={{ position: "absolute", left: ROW.x, top: 790, display: "flex", flexDirection: "column", gap: 18 }}>
        {row(10, brand.red, <I.Music size={46} />, "Peña Folklórica · Wayqe", "En “La Reserva”")}
        {row(16, brand.teal, <I.Calendar size={46} />, "Domingo 11 de octubre", "Desde las 11:00 hs · Ruta 90 km 2.3")}
        {row(22, brand.yellow, <I.Ticket size={46} color="#3a2a05" />, "Entradas anticipadas $15.000", "Retiralas en Paso a Paso Calzados")}
      </div>
    </>
  );
};
