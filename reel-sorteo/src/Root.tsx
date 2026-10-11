import { Composition } from "remotion";
import { Reel } from "./Reel";
import { DURATION_S, FPS, H, W } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition id="ReelSorteo" component={Reel} durationInFrames={Math.round(DURATION_S * FPS)} fps={FPS} width={W} height={H} />
  );
};
