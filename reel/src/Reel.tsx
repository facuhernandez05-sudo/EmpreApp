import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background } from "./components/Background";
import { Captions } from "./components/Captions";
import { Logo } from "./components/Logo";
import { VideoLayer } from "./components/VideoLayer";
import { f, flashes, sfx, TOTAL_SECONDS, VOICE_SECONDS } from "./data/timeline";
import {
  EndCard,
  FeaturesScene,
  FlyerScene,
  HookScene,
  InfoScene,
  NameScene,
  NotesScene,
  PriceScene,
  RecapScene,
  RouteScene,
  StoreBadge,
  WayqeScene,
} from "./scenes/Scenes";

const scenes: { from: number; to: number; el: React.ReactNode }[] = [
  { from: 0, to: 2.2, el: <HookScene /> },
  { from: 3.75, to: 7.6, el: <NameScene /> },
  { from: 10.0, to: 17.6, el: <FlyerScene /> },
  { from: 21.48, to: 28.1, el: <InfoScene /> },
  { from: 30.5, to: 36.0, el: <RouteScene /> },
  { from: 36.0, to: 45.18, el: <FeaturesScene /> },
  { from: 46.6, to: 48.5, el: <PriceScene /> },
  { from: 50.75, to: 52.2, el: <StoreBadge title="Paso a Paso" sub="Entradas en el local" icon="store" checkAt={26} /> },
  { from: 54.2, to: 56.4, el: <NotesScene /> },
  { from: 56.4, to: 60.18, el: <RecapScene /> },
  { from: 60.9, to: 65.5, el: <StoreBadge title="Entrada anticipada" sub="Acá en el local · Paso a Paso" icon="ticket" /> },
  { from: 65.5, to: 79.4, el: <WayqeScene /> },
  { from: 87.0, to: TOTAL_SECONDS, el: <EndCard /> },
];

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const fl = flashes.map((t) => frame - f(t)).find((d) => d >= 0 && d < 6);
  if (fl === undefined) return null;
  return <AbsoluteFill style={{ background: "#fff", opacity: interpolate(fl, [0, 6], [0.55, 0]) }} />;
};

// Música discreta: entra suave, queda bien por debajo de la voz y sube en la placa final
const musicVolume = (frame: number) =>
  interpolate(
    frame,
    [0, 6, f(VOICE_SECONDS - 0.4), f(VOICE_SECONDS + 0.3), f(TOTAL_SECONDS - 1.2), f(TOTAL_SECONDS)],
    [0.0, 0.085, 0.085, 0.26, 0.26, 0],
    { extrapolateRight: "clamp" },
  );

export const Reel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#07090F" }}>
    <Background />
    <VideoLayer />
    {scenes.map((s, i) => (
      <Sequence key={i} from={f(s.from)} durationInFrames={f(s.to) - f(s.from)} layout="none">
        <AbsoluteFill>{s.el}</AbsoluteFill>
      </Sequence>
    ))}
    <Logo />
    <Captions />
    <Flash />
    <Audio src={staticFile("music/chacarera.mp3")} volume={musicVolume} />
    {sfx.map((c, i) => (
      <Sequence key={`sfx${i}`} from={f(c.at)} durationInFrames={f(3)} layout="none">
        <Audio src={staticFile(`sfx/${c.src}.mp3`)} volume={c.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
