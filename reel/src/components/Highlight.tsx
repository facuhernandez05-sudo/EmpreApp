import { brand, gradients } from "../theme";

// Palabra destacada: degradado de marca + volumen 3D sutil + brillo que recorre la palabra
export const Highlight: React.FC<{
  children: string;
  frame: number;
  gradient?: string;
  depthColor?: string;
  glow?: string;
  depth?: number;
}> = ({ children, frame, gradient = gradients.gold, depthColor = "#8A5410", glow = brand.yellow, depth = 4 }) => {
  const extrude = Array.from({ length: depth }, (_, i) => `${0}px ${i + 1}px 0 ${depthColor}`).join(", ");
  const shine = ((frame * 2.2) % 260) - 80;
  return (
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          color: depthColor,
          textShadow: `${extrude}, 0 ${depth + 6}px 18px rgba(0,0,0,.55), 0 0 28px ${glow}55`,
        }}
      >
        {children}
      </span>
      <span
        style={{
          position: "relative",
          textShadow: "none",
          backgroundImage: `linear-gradient(105deg, transparent ${shine}%, rgba(255,255,255,.85) ${shine + 8}%, transparent ${shine + 16}%), ${gradient}`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {children}
      </span>
    </span>
  );
};
