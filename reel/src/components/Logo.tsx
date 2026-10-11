import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { f, TOTAL_SECONDS } from "../data/timeline";
import { layout } from "../theme";

// Logo discreto dentro del área segura (proporción original, sin deformar)
export const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [f(2.2), f(2.6), f(TOTAL_SECONDS - 3.7), f(TOTAL_SECONDS - 3.3)], [0, 0.95, 0.95, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Img
      src={staticFile("brand/logo.png")}
      style={{
        position: "absolute",
        left: layout.logo.x,
        top: layout.logo.y,
        width: layout.logo.w,
        height: "auto",
        opacity: op,
        filter: "drop-shadow(0 6px 16px rgba(0,0,0,.55))",
      }}
    />
  );
};
