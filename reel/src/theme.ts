import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Tipografías variables alojadas localmente (licencia OFL)
loadFont({ family: "Montserrat", url: staticFile("fonts/Montserrat.woff2"), weight: "100 900" });
loadFont({ family: "Inter", url: staticFile("fonts/Inter.woff2"), weight: "100 900" });

export const display = "Montserrat, sans-serif";
export const ui = "Inter, sans-serif";

// Paleta tomada del logo de Paso a Paso Calzados
export const brand = {
  yellow: "#FDCB6E",
  teal: "#84C2BA",
  red: "#F05862",
  salmon: "#F9A595",
  white: "#FFFFFF",
  ink: "#07090F",
  ink2: "#121725",
};

export const gradients = {
  gold: "linear-gradient(180deg, #FFF1C4 0%, #FDCB6E 42%, #F2A44C 100%)",
  metal: "linear-gradient(135deg, #F4F6FA 0%, #9AA3B2 28%, #FFFFFF 50%, #8A93A3 72%, #E9ECF2 100%)",
  coral: "linear-gradient(180deg, #FFD1C7 0%, #F9A595 40%, #F05862 100%)",
  teal: "linear-gradient(180deg, #D8F3EF 0%, #84C2BA 50%, #4E9C93 100%)",
};

// Zonas seguras de Instagram Reels (1080x1920)
export const layout = {
  logo: { x: 64, y: 262, w: 150 },
  pip: { x: 640, y: 262, w: 376, h: 480, r: 44 },
  captionsY: 1250,
  side: 64,
};
