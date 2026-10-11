"""Genera música y SFX originales (sintetizados, libres de derechos) para el reel.
Uso: python3 scripts/gen_audio.py public
"""
import sys, wave, numpy as np

SR = 48000
OUT = sys.argv[1] if len(sys.argv) > 1 else "public"
rng = np.random.default_rng(7)


def save(path, x):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    peak = np.max(np.abs(x)) or 1
    x = x / peak * 0.89
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def t_(d):
    return np.arange(int(d * SR)) / SR


def env(n, a=0.005, r=None):
    e = np.ones(n)
    na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    if r:
        nr = min(n, int(r * SR)); e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def onepole(x, coef):
    """Low-pass de un polo con coeficiente variable en el tiempo."""
    y = np.zeros_like(x); s = 0.0
    c = np.broadcast_to(coef, x.shape)
    for i in range(len(x)):
        s += c[i] * (x[i] - s); y[i] = s
    return y


def bandsweep(d, f0, f1, q=0.35, curve=1.0):
    n = int(d * SR); noise = rng.standard_normal(n)
    f = f0 + (f1 - f0) * np.linspace(0, 1, n) ** curve
    c = 1 - np.exp(-2 * np.pi * f / SR)
    lp = onepole(noise, c); hp = lp - onepole(lp, c * q)
    return hp


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------- SFX
def whoosh(d, f0, f1, curve, pan):
    x = bandsweep(d, f0, f1, curve=curve)
    shape = np.sin(np.pi * np.linspace(0, 1, len(x)) ** 0.7) ** 2
    x *= shape
    l = x * (1 - pan); r = np.roll(x, int(0.004 * SR)) * (1 + pan)
    return np.stack([l, r], 1)


def bell(f, d=2.2, bright=1.0):
    t = t_(d); x = np.zeros_like(t)
    for ratio, amp, dec in [(1, 1, 1.6), (2.0, .45 * bright, 1.0), (2.76, .3 * bright, .7), (5.4, .12 * bright, .35), (8.9, .05 * bright, .2)]:
        x += amp * np.sin(2 * np.pi * f * ratio * t + rng.random() * 6) * np.exp(-t / dec * 2.2)
    return x * env(len(t), 0.002)


def pop(f0, f1, d=0.09):
    t = t_(d); f = np.geomspace(f0, f1, len(t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38) * env(len(t), 0.001)


def tick():
    t = t_(0.04)
    return (rng.standard_normal(len(t)) * 0.5 + np.sin(2 * np.pi * 3200 * t)) * np.exp(-t * 160)


def riser(d=1.3):
    t = t_(d)
    tone = sum(np.sin(2 * np.pi * np.cumsum(np.geomspace(f, f * 2.2, len(t))) / SR) for f in (220, 330.5, 440.7))
    x = bandsweep(d, 400, 7000, curve=2) * 1.5 + tone * 0.15
    return x * np.linspace(0, 1, len(t)) ** 2.2 * env(len(t), 0.01, 0.04)


def impact():
    t = t_(1.4); f = 38 + 70 * np.exp(-t * 9)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    air = bandsweep(1.4, 3000, 300) * np.exp(-t * 6) * 0.4
    return (sub + air) * env(len(t), 0.002)


def glitch(seed):
    g = np.random.default_rng(seed); out = []
    for _ in range(g.integers(5, 9)):
        d = g.uniform(0.015, 0.05); t = t_(d)
        kind = g.integers(3)
        if kind == 0: s = np.sign(np.sin(2 * np.pi * g.uniform(200, 1800) * t))
        elif kind == 1: s = np.round(g.standard_normal(len(t)) * 2) / 2
        else: s = np.sin(2 * np.pi * g.uniform(2000, 6000) * t)
        out.append(s * g.uniform(0.3, 1)); out.append(np.zeros(int(g.uniform(0, 0.02) * SR)))
    x = np.concatenate(out)
    return x * env(len(x), 0.001, 0.01)


def shimmer():
    x = np.zeros(int(1.6 * SR))
    for i, m in enumerate([88, 91, 95, 100, 103]):
        b = bell(midi(m), 1.2, 0.6) * (0.8 - i * 0.1); o = int(i * 0.055 * SR)
        x[o:o + len(b)] += b[:len(x) - o]
    return x


def coin():
    a = bell(midi(91), 1.0, .5); b = bell(midi(96), 1.4, .5)
    x = np.zeros(int(1.6 * SR)); x[:len(a)] += a; o = int(0.08 * SR); x[o:o + len(b)] += b[:len(x) - o]
    return x


sfx = {
    "whoosh1": whoosh(0.55, 300, 5000, 1.5, -0.3),
    "whoosh2": whoosh(0.8, 6000, 400, 0.6, 0.3),
    "whoosh3": whoosh(0.4, 800, 9000, 2.0, 0.0),
    "whoosh4": whoosh(1.0, 200, 3000, 1.0, -0.5),
    "swish1": whoosh(0.25, 1500, 9000, 1.0, 0.4),
    "swish2": whoosh(0.3, 9000, 1200, 1.0, -0.4),
    "bell1": bell(midi(81)), "bell2": bell(midi(85), 2.6, .8), "bell3": bell(midi(76), 2.4, 1.2),
    "pop1": pop(900, 300), "pop2": pop(1400, 600, 0.07), "pop3": pop(600, 180, 0.12),
    "tick": tick(), "riser": riser(), "impact": impact(),
    "glitch1": glitch(1), "glitch2": glitch(2), "shimmer": shimmer(), "coin": coin(),
}
for k, v in sfx.items():
    save(f"{OUT}/sfx/{k}.wav", v)

# ---------------------------------------------------------------- MÚSICA (chacarera 6/8)
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 92
N = int(DUR * SR) + SR * 3
mix = np.zeros((N, 2))
EIGHTH = 60 / (88 * 3)
BAR = EIGHTH * 6


def ks(f, d, bright=0.5, damp=0.996):
    n = int(d * SR); p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p); buf = onepole(buf, np.full(p, bright))
    out = np.zeros(n); i = 0
    while i < n:
        k = min(p, n - i); out[i:i + k] = buf[:k]
        buf = damp * 0.5 * (buf + np.roll(buf, -1)); i += p
    return out


cache = {}


def string(m, d, bright, damp):
    key = (m, round(d, 2), bright, damp)
    if key not in cache:
        cache[key] = ks(midi(m), d, bright, damp)
    return cache[key]


def add(x, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N: return
    x = x[:N - i]
    if x.ndim == 1:
        mix[i:i + len(x), 0] += x * gain * (1 - pan); mix[i:i + len(x), 1] += x * gain * (1 + pan)
    else:
        mix[i:i + len(x)] += x * gain


CH = {
    "Am": [45, 52, 57, 60, 64], "E7": [40, 47, 50, 56, 59, 64],
    "G": [43, 47, 50, 55, 59, 67], "C": [48, 52, 55, 60, 64],
    "Dm": [50, 57, 62, 65], "F": [41, 48, 53, 57, 60, 65],
}
prog = ["Am", "Am", "E7", "E7", "E7", "E7", "Am", "Am", "Dm", "Am", "G", "C", "F", "E7", "Am", "Am"]


def strum(ch, at, up=False, gain=1.0, muted=False):
    notes = CH[ch][::-1] if up else CH[ch]
    d = 0.09 if muted else 1.6
    for j, m in enumerate(notes):
        s = string(m, d, 0.35 if up else 0.5, 0.97 if muted else 0.9975)
        add(s * (np.linspace(1, 0, len(s)) ** 3 if muted else 1), at + j * (0.006 if up else 0.009), gain * (0.6 if up else 1) / len(notes) * 5.5, pan=-0.25 + j * 0.08)


def bombo(at, rim=False, gain=1.0):
    t = t_(0.5)
    if rim:
        x = (rng.standard_normal(len(t)) * 0.4 + np.sin(2 * np.pi * 1100 * t)) * np.exp(-t * 70) * 0.5
    else:
        f = 62 + 50 * np.exp(-t * 25)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) + bandsweep(0.5, 900, 200) * np.exp(-t * 30) * 0.3
    add(x, at, gain)


def pad(ch, at, d, gain):
    t = t_(d); x = np.zeros_like(t)
    for m in CH[ch][1:4]:
        for det in (-0.08, 0.08):
            x += np.sin(2 * np.pi * midi(m + 12) * (1 + det / 100) * t)
    e = np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.6)
    add(x * e * 0.03, at, gain)


bars = int(DUR / BAR) + 1
for b in range(bars):
    ch = prog[b % len(prog)]; t0 = b * BAR
    intro = b < 2
    pad(ch, t0, BAR + 0.3, 1.0)
    if b >= bars - 1:
        strum("Am", t0, gain=1.1); bombo(t0); continue
    strum(ch, t0, gain=1.0)
    if not intro:
        strum(ch, t0 + 2 * EIGHTH, up=True, gain=0.8)
        strum(ch, t0 + 3 * EIGHTH, muted=True, gain=1.1)
        strum(ch, t0 + 4 * EIGHTH, gain=0.85)
        strum(ch, t0 + 5 * EIGHTH, up=True, gain=0.7)
        bombo(t0); bombo(t0 + 2 * EIGHTH, rim=True, gain=0.8); bombo(t0 + 3 * EIGHTH, gain=0.7)
        bombo(t0 + 5 * EIGHTH, rim=True, gain=0.6)

# reverb liviano (ecos difusos)
wet = np.zeros_like(mix)
for dly, g in [(0.031, .35), (0.047, .3), (0.073, .25), (0.109, .2), (0.151, .15), (0.211, .1)]:
    k = int(dly * SR); wet[k:, 0] += mix[:-k, 1] * g; wet[k:, 1] += mix[:-k, 0] * g
mix = mix + wet * 0.6
fade = int(2.5 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
save(f"{OUT}/music/chacarera.wav", mix)
print("ok", len(sfx), "sfx")
