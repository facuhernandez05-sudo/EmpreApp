import { AbsoluteFill, useCurrentFrame } from "remotion";
import { brand } from "../theme";

// Fondo oscuro degradado con profundidad suave y brillos en colores de marca
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const orb = (color: string, x: number, y: number, size: number, op: number) => (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        opacity: op,
        filter: "blur(140px)",
      }}
    />
  );
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 90% 60% at 50% 30%, ${brand.ink2} 0%, ${brand.ink} 75%)`,
        overflow: "hidden",
      }}
    >
      {orb(brand.teal, 200 + Math.sin(t * 0.3) * 120, 500 + Math.cos(t * 0.25) * 90, 700, 0.22)}
      {orb(brand.red, 900 + Math.cos(t * 0.22) * 100, 1100 + Math.sin(t * 0.3) * 120, 640, 0.18)}
      {orb(brand.yellow, 520 + Math.sin(t * 0.18) * 160, 1650, 600, 0.12)}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          backgroundPosition: `0 ${(frame * 0.4) % 72}px`,
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, black 20%, transparent 80%)",
        }}
      />
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 55%, rgba(0,0,0,.6) 100%)" }}
      />
    </AbsoluteFill>
  );
};
