import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fuentes locales (Inter, Inter Tight, Instrument Serif — Google Fonts, licencia OFL)
const FONT_FILES: [string, string, string, string][] = [
  ["Inter", "Inter_wght_600", "600", "normal"],
  ["Inter", "Inter_wght_800", "800", "normal"],
  ["Inter", "Inter_wght_900", "900", "normal"],
  ["Inter Tight", "Inter_Tight_wght_800", "800", "normal"],
  ["Inter Tight", "Inter_Tight_wght_900", "900", "normal"],
  ["Instrument Serif", "Instrument_Serif_ital_1", "400", "italic"],
];
FONT_FILES.forEach(([family, file, weight, style]) => {
  loadFont({ family, url: staticFile(`fonts/${file}.woff2`), weight, style, format: "woff2" });
});

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION_S = 24.9;

export const fonts = {
  body: "Inter, sans-serif",
  title: "'Inter Tight', Inter, sans-serif",
  serif: "'Instrument Serif', serif",
};

// Paleta del club (amarillo/negro) llevada a un look premium metalizado
export const C = {
  yellow: "#FFD21F",
  yellowDeep: "#F2B705",
  gold: "#C9961A",
  goldDark: "#5C3F00",
  ink: "#050505",
  white: "#FFFFFF",
  muted: "rgba(255,255,255,0.62)",
};

export const GOLD_GRADIENT =
  "linear-gradient(180deg, #FFF7CF 0%, #FFE36A 28%, #FFD21F 50%, #E8A800 72%, #FFE98A 100%)";
export const SILVER_GRADIENT =
  "linear-gradient(180deg, #FFFFFF 0%, #F1F1F1 45%, #BDBDBD 60%, #FFFFFF 100%)";

export const s2f = (s: number) => Math.round(s * FPS);
