import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { captions } from "../data/captions";
import { f } from "../data/timeline";
import { display, layout } from "../theme";
import { Highlight } from "./Highlight";

// la puntuación que sigue a una palabra clave queda pegada a ella (sin comas sueltas al cortar línea)
const parse = (text: string) => text.split(/(\*[^*]+\*[,.;:?!]*)/g).filter(Boolean);

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cap = captions.find((c) => frame >= f(c.from) && frame < f(c.to));
  if (!cap) return null;
  const local = frame - f(cap.from);
  const len = f(cap.to) - f(cap.from);
  const enter = spring({ frame: local, fps, config: { damping: 16, stiffness: 220, mass: 0.6 } });
  const exit = interpolate(local, [len - 3, len], [1, 0.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const parts = parse(cap.text);
  const size = cap.text.replace(/\*/g, "").length > 30 ? 62 : 68;

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: layout.captionsY,
        transform: `translateY(-50%) translateY(${(1 - enter) * 26}px) scale(${0.94 + enter * 0.06})`,
        opacity: Math.min(enter * 1.4, 1) * exit,
        textAlign: "center",
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.14,
        letterSpacing: -0.5,
        color: "#FFFFFF",
        textShadow: "0 3px 0 rgba(0,0,0,.28), 0 6px 22px rgba(0,0,0,.7), 0 0 2px rgba(0,0,0,.6)",
        textWrap: "balance",
      }}
    >
      {parts.map((p, i) =>
        p.startsWith("*") ? (
          <span key={i} style={{ whiteSpace: "nowrap" }}>
            <Highlight frame={frame}>{p.slice(1, p.lastIndexOf("*"))}</Highlight>
            {p.slice(p.lastIndexOf("*") + 1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </div>
  );
};
