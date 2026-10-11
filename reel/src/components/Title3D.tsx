import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { display, gradients } from "../theme";

// Título 3D: extrusión por capas, degradado metalizado/de marca, entrada en perspectiva y brillo
export const Title3D: React.FC<{
  text: string;
  size: number;
  delay?: number; // frames relativos a la secuencia
  gradient?: string;
  depthColor?: string;
  glow?: string;
  depth?: number;
  align?: "left" | "center";
  tracking?: number;
}> = ({
  text,
  size,
  delay = 0,
  gradient = gradients.metal,
  depthColor = "#3A4150",
  glow = "rgba(255,255,255,.35)",
  depth = 9,
  align = "center",
  tracking = -1,
}) => {
  const frame = useCurrentFrame() - delay;
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 14, stiffness: 120, mass: 0.8 } });
  if (frame < 0) return null;
  const extrude = Array.from({ length: depth }, (_, i) => `${i * 0.35}px ${i + 1}px 0 ${depthColor}`).join(", ");
  const shine = interpolate(frame, [8, 38], [-40, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const float = Math.sin(frame / 22) * 4;
  const base: React.CSSProperties = {
    fontFamily: display,
    fontWeight: 900,
    fontSize: size,
    lineHeight: 0.95,
    letterSpacing: tracking,
    whiteSpace: "pre",
    textAlign: align,
  };
  return (
    <div
      style={{
        perspective: 1200,
        opacity: Math.min(1, p * 1.5),
        filter: `blur(${(1 - p) * 10}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          transform: `rotateX(${(1 - p) * -75}deg) translateY(${(1 - p) * 60 + float}px) rotateY(${Math.sin(frame / 40) * 4}deg)`,
          transformOrigin: "50% 100%",
        }}
      >
        <div
          aria-hidden
          style={{
            ...base,
            position: "absolute",
            inset: 0,
            color: depthColor,
            textShadow: `${extrude}, 0 ${depth + 10}px 30px rgba(0,0,0,.6), 0 0 50px ${glow}`,
          }}
        >
          {text}
        </div>
        <div
          style={{
            ...base,
            position: "relative",
            backgroundImage: `linear-gradient(110deg, transparent ${shine - 12}%, rgba(255,255,255,.95) ${shine}%, transparent ${shine + 12}%), ${gradient}`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
