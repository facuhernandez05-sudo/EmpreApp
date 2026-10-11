import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ui } from "../theme";

export const usePop = (delay: number, stiffness = 180) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 15, stiffness, mass: 0.7 } });
};

// Tarjeta de cristal con borde metalizado y reflejo superior
export const Glass: React.FC<{
  style?: React.CSSProperties;
  children?: React.ReactNode;
  radius?: number;
  delay?: number;
  from?: "up" | "left" | "right" | "scale";
  tint?: string;
}> = ({ style, children, radius = 36, delay = 0, from = "up", tint = "rgba(255,255,255,.07)" }) => {
  const p = usePop(delay);
  const frame = useCurrentFrame();
  if (frame < delay) return null;
  const off = 1 - p;
  const t =
    from === "left"
      ? `translateX(${-off * 120}px)`
      : from === "right"
        ? `translateX(${off * 120}px)`
        : from === "scale"
          ? `scale(${0.7 + p * 0.3})`
          : `translateY(${off * 80}px)`;
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: radius,
        padding: 1.5,
        background:
          "linear-gradient(135deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,.08) 30%, rgba(255,255,255,.03) 60%, rgba(255,255,255,.35) 100%)",
        boxShadow: "0 30px 70px rgba(0,0,0,.5), 0 8px 20px rgba(0,0,0,.3)",
        transform: `${t} rotateX(${off * 20}deg)`,
        opacity: Math.min(1, p * 1.6),
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: radius - 1.5,
          background: `linear-gradient(160deg, rgba(255,255,255,.14) 0%, ${tint} 40%, ${tint} 100%)`,
          backdropFilter: "blur(28px) saturate(1.4)",
          overflow: "hidden",
          fontFamily: ui,
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "45%",
            background: "linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,0))",
            pointerEvents: "none",
          }}
        />
        {children}
      </div>
    </div>
  );
};

export const Pill: React.FC<{ children: React.ReactNode; color: string; style?: React.CSSProperties }> = ({
  children,
  color,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 26px",
      borderRadius: 999,
      fontFamily: ui,
      fontWeight: 700,
      fontSize: 30,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: "#fff",
      background: "linear-gradient(180deg, rgba(255,255,255,.16), rgba(255,255,255,.05))",
      border: "1.5px solid rgba(255,255,255,.3)",
      backdropFilter: "blur(20px)",
      boxShadow: `0 10px 30px rgba(0,0,0,.4), inset 0 0 0 1px ${color}33`,
      ...style,
    }}
  >
    <span style={{ width: 12, height: 12, borderRadius: 6, background: color, boxShadow: `0 0 14px ${color}` }} />
    {children}
  </div>
);
