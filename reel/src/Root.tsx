import { Composition } from "remotion";
import { Reel } from "./Reel";
import { FPS, TOTAL_SECONDS } from "./data/timeline";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Reel"
    component={Reel}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={Math.round(TOTAL_SECONDS * FPS)}
  />
);
