import React from "react";
import { AbsoluteFill, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { Background } from "./components";
import { Captions } from "./Captions";
import { FPS, s2f } from "./theme";
import {
  CornerLogo,
  SCENES,
  SceneBono,
  SceneCash,
  SceneDream,
  SceneEnd,
  SceneHook,
  SceneListen,
  ScenePrizes,
  SceneQuestion,
  SceneSurprise,
} from "./Scenes";
import { SceneWrap } from "./components";

// Tramos de voz en la pista editada (s) — para el ducking de la música
const VOICE: [number, number][] = [
  [0.15, 0.99], [1.24, 5.84], [6.14, 10.28], [10.58, 12.78], [13.08, 15.46], [15.81, 20.93], [21.48, 22.56],
];

// SFX variados, siempre por debajo de la voz
const SFX: [number, string, number][] = [
  [0.0, "impact", 0.55],
  [0.03, "glitch2", 0.16],
  [1.12, "whoosh1", 0.35],
  [2.7, "swish", 0.3],
  [3.62, "bounce", 0.3],
  [4.95, "chime", 0.3],
  [5.95, "whoosh3", 0.35],
  [7.12, "hit", 0.4],
  [7.86, "stamp", 0.35],
  [8.78, "tvon", 0.28],
  [9.48, "pop", 0.35],
  [10.37, "whoosh2", 0.35],
  [12.26, "sparkle", 0.38],
  [12.87, "whoosh4", 0.3],
  [14.08, "ticks", 0.35],
  [14.64, "cash", 0.33],
  [15.66, "glitch", 0.26],
  [16.7, "swish", 0.3],
  [17.5, "coin", 0.36],
  [18.95, "bell_soft", 0.3],
  [20.3, "pop", 0.3],
  [20.95, "riser", 0.2],
  [21.22, "glitch2", 0.2],
  [22.52, "impact", 0.45],
  [22.58, "chime", 0.28],
  [23.4, "sparkle", 0.22],
];

const musicVolume = (f: number) => {
  const t = f / FPS;
  // distancia al tramo de voz más cercano → ducking suave
  let duck = 0;
  for (const [a, b] of VOICE) {
    const d = t < a ? a - t : t > b ? t - b : 0;
    duck = Math.max(duck, interpolate(d, [0, 0.25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  }
  return 0.42 - duck * 0.27; // 0.15 bajo la voz, 0.42 en huecos
};

const scene = (k: keyof typeof SCENES) => {
  const [a, b] = SCENES[k];
  return { from: s2f(a), durationInFrames: s2f(b) - s2f(a) };
};

export const Reel: React.FC = () => {
  const logo = { from: s2f(6.05), durationInFrames: s2f(SCENES.question[0]) - s2f(6.05) };
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background />
      <Sequence {...scene("hook")}>
        <SceneWrap dur={scene("hook").durationInFrames} exitFrames={5}>
          <SceneHook />
        </SceneWrap>
      </Sequence>
      <Sequence {...scene("dream")}>
        <SceneWrap dur={scene("dream").durationInFrames}>
          <SceneDream />
        </SceneWrap>
      </Sequence>
      <Sequence {...scene("prizes")}>
        <SceneWrap dur={scene("prizes").durationInFrames} enter="up">
          <ScenePrizes />
        </SceneWrap>
      </Sequence>
      <Sequence {...scene("surprise")}>
        <SceneWrap dur={scene("surprise").durationInFrames}>
          <SceneSurprise />
        </SceneWrap>
      </Sequence>
      <Sequence {...scene("bono")}>
        <SceneWrap dur={scene("bono").durationInFrames} enter="up" exitFrames={3}>
          <SceneBono />
        </SceneWrap>
      </Sequence>
      <Sequence {...scene("listen")}>
        <SceneListen />
      </Sequence>
      <Sequence {...scene("cash")}>
        <SceneWrap dur={scene("cash").durationInFrames} enter="blur">
          <SceneCash />
        </SceneWrap>
      </Sequence>
      <Sequence {...scene("question")}>
        <SceneWrap dur={scene("question").durationInFrames} exitFrames={4}>
          <SceneQuestion />
        </SceneWrap>
      </Sequence>
      <Sequence {...scene("end")}>
        <SceneWrap dur={scene("end").durationInFrames + 30}>
          <SceneEnd />
        </SceneWrap>
      </Sequence>
      <Sequence {...logo}>
        <CornerLogo />
      </Sequence>
      <Captions hide={[[0, 1.2], [15.7, 16.75], [21.25, 23]]} />
      {/* fade final */}
      <Sequence from={s2f(24.4)}>
        <FadeOut />
      </Sequence>

      <Audio src={staticFile("audio/voice.wav")} volume={1} />
      <Audio src={staticFile("audio/music.wav")} volume={musicVolume} />
      {SFX.map(([t, name, v], i) => (
        <Sequence key={i} from={s2f(t)}>
          <Audio src={staticFile(`audio/${name}.wav`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const FadeOut: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, 15], [0, 0.85], { extrapolateRight: "clamp" }) }} />;
};
