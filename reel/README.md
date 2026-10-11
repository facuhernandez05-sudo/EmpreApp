# Reel: Paso a Paso Calzados, Peña Folklórica

Reel vertical para Instagram (1080 × 1920, 30 fps) hecho con [Remotion](https://remotion.dev).

## Cómo está armado

| Capa | Archivo |
| --- | --- |
| Video editado (cortes en silencios, color, voz limpia y normalizada) | `public/video/main.mp4` (no se versiona: ver abajo) |
| Encuadres, punch-ins y paso a recuadro (PiP) | `src/data/timeline.ts` → `shots` |
| Subtítulos sincronizados (`*palabra*` = destacada) | `src/data/captions.ts` |
| Motion graphics (flyer, día/hora, cómo llegar, servicios, precio, Wayqe, placa final) | `src/scenes/Scenes.tsx` |
| Títulos 3D, cristal, palabras con degradado y brillo | `src/components/` |
| Música (chacarera 6/8 original) y SFX variados, sintetizados | `scripts/gen_audio.py` → `public/music`, `public/sfx` |

Paleta tomada del logo: amarillo `#FDCB6E`, turquesa `#84C2BA`, rojo `#F05862` y salmón `#F9A595`, sobre fondo oscuro degradado.
Tipografías: Montserrat e Inter (OFL), alojadas en `public/fonts`.

## Cortes del video original (segundos)

El hook abre con `110.67–112.87` ("son unos genios… no te los podés perder") y después sigue el relato en orden:
`5.07–20.50`, `22.47–53.13`, `57.40–61.30`, `72.63–76.80`, `77.60–81.53`, `87.97–96.20`, `97.93–112.87` y `113.83–118.00`.
Se sacaron las repeticiones y las pausas largas, y cada corte cae en un silencio. Después se re-transcribió cada clip para confirmar que ninguna palabra quedara cortada.

## Uso

```bash
npm install
npm run studio     # previsualizar
npm run render     # exporta out/reel-pasoapaso.mp4
python3 scripts/gen_audio.py public 92   # regenera música/SFX (requiere numpy)
```

`public/video/main.mp4` pesa demasiado para git. Se regenera con `python3 scripts/build_video.py original.mov public/video/main.mp4`, que corta el `.mov` original en los segmentos de arriba, concatena, escala a 1080×1920 (lanczos), aplica `eq` + `unsharp` y en el audio `highpass` + `afftdn` + `acompressor` + `loudnorm` (I = -15 LUFS).
En entornos con proxy, apunta Remotion al Chrome local con `REMOTION_BROWSER=/ruta/a/headless_shell`.
