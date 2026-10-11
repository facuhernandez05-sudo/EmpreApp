import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import words from "./words.json";
import { fonts } from "./theme";
import { clamp } from "./components";

type Word = { w: string; s: number; e: number; k: number };
const WORDS = words as Word[];

// Palabras clave resaltadas en dorado
const KEY = new Set(
  [
    "sorteo", "sueño", "niños", "jirafas", "básquet", "empalme", "central",
    "moto", "110", "primer", "segundo", "premio", "tv", "smart", "sorpresa",
    "tres", "cuotas", "15.000", "pesos", "efectivo", "temporada", "verano",
    "gratis", "dos", "personas", "perder",
  ],
);
const clean = (w: string) => w.toLowerCase().replace(/[¡!¿?.,:]/g, "");

// Agrupa en bloques breves (máx. ~2 líneas)
const MAX_CHARS = 22;
type Group = { words: Word[]; start: number; end: number };
const buildGroups = (): Group[] => {
  const groups: Group[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) groups.push({ words: cur, start: cur[0].s, end: cur[cur.length - 1].e });
    cur = [];
  };
  WORDS.forEach((w, i) => {
    const prev = WORDS[i - 1];
    const len = cur.map((x) => x.w).join(" ").length + w.w.length + 1;
    const next = WORDS[i + 1];
    // no dejar una sola palabra final huérfana (ej. "Empalme Central.")
    const lastOfSentence = /[.!?]$/.test(w.w) && (!next || next.k !== w.k);
    const tooLong = len > MAX_CHARS || cur.length >= 4;
    if (cur.length && (w.k !== prev.k || (w.w === "y" && cur.length >= 2) || w.s - prev.e > 0.25 || (tooLong && !(lastOfSentence && len <= 30)))) flush();
    cur.push(w);
    if (/[.,!?]$/.test(w.w) && cur.length >= 2) flush();
  });
  flush();
  // ventana visible: hasta el inicio del siguiente bloque (o fin + 0.35s)
  return groups.map((g, i) => {
    const next = groups[i + 1];
    const end = next && next.start - g.end < 0.6 ? next.start : g.end + 0.35;
    return { ...g, end };
  });
};
const GROUPS = buildGroups();

export const Captions: React.FC<{ hide: [number, number][] }> = ({ hide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const g = GROUPS.find((x) => t >= x.start - 0.05 && t < x.end);
  if (!g) return null;
  if (hide.some(([a, b]) => g.start >= a && g.start < b)) return null;
  const local = frame - Math.round((g.start - 0.05) * fps);
  const p = spring({ frame: local, fps, config: { damping: 15, mass: 0.6 } });
  const out = interpolate(t, [g.end - 0.08, g.end], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 150,
        top: 1250,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        opacity: Math.min(p * 1.5, out),
        transform: `translateY(${(1 - p) * 24}px) scale(${0.94 + p * 0.06})`,
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontFamily: fonts.body,
          fontWeight: 900,
          fontSize: 76,
          lineHeight: 1.08,
          letterSpacing: "-0.015em",
          maxWidth: 840,
        }}
      >
        {g.words.map((w, i) => {
          const isKey = KEY.has(clean(w.w));
          const active = t >= w.s && t < w.e + 0.05;
          const spoken = t >= w.s;
          const wp = spring({ frame: frame - Math.round(w.s * fps), fps, config: { damping: 12, mass: 0.5 } });
          const pop = spoken ? 1 + (active ? 0.08 * wp : 0) : 1;
          return (
            <span key={i} style={{ display: "inline-block", margin: "0 0.17em", transform: `scale(${pop})`, transformOrigin: "50% 70%" }}>
              {isKey ? (
                <span
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      color: "#6B4700",
                      textShadow:
                        "0 1px 0 #7A5200, 0 2px 0 #6B4700, 0 3px 0 #5A3B00, 0 4px 0 #4A3000, 0 8px 18px rgba(0,0,0,0.8), 0 0 28px rgba(255,200,0,0.45)",
                    }}
                  >
                    {w.w}
                  </span>
                  <span
                    style={{
                      position: "relative",
                      backgroundImage: "linear-gradient(180deg,#FFF8D2 0%,#FFE14D 40%,#FFC800 65%,#FFE98A 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      opacity: spoken ? 1 : 0.55,
                    }}
                  >
                    {w.w}
                  </span>
                </span>
              ) : (
                <span
                  style={{
                    color: "#FFFFFF",
                    opacity: spoken ? 1 : 0.55,
                    textShadow: "0 3px 0 rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.85)",
                  }}
                >
                  {w.w}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};
