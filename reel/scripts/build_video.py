"""Arma public/video/main.mp4 desde el video original.
Uso: python3 scripts/build_video.py original.mov public/video/main.mp4
"""
import sys, tempfile
SRC, OUT = sys.argv[1], sys.argv[2]
TMP = tempfile.mkdtemp()
import subprocess, json
edl=[(110.68,112.85),(5.08,20.51),(22.45,53.15),(57.40,61.30),(72.62,76.79),(77.60,81.52),(87.96,96.19),(97.92,112.85),(113.83,118.01)]
edl=[(round(s*30)/30, round(e*30)/30) for s,e in edl]
for i,(s,e) in enumerate(edl):
    d=e-s
    subprocess.run(["ffmpeg","-v","error","-y","-ss",f"{s:.4f}","-i",SRC,"-t",f"{d:.4f}",
      "-af",f"afade=t=in:d=0.03,afade=t=out:st={d-0.04:.4f}:d=0.04","-c:v","libx264","-crf","10","-preset","fast","-r","30",
      "-c:a","pcm_s16le","-ar","48000",f"{TMP}/seg{i}.mov"],check=True)
n=len(edl)
fc="".join(f"[{i}:v][{i}:a]" for i in range(n))+f"concat=n={n}:v=1:a=1[cv][ca];"
fc+="[cv]scale=1080:1920:flags=lanczos,eq=contrast=1.07:saturation=1.18:gamma=0.96:brightness=-0.01,unsharp=5:5:0.6:5:5:0.0,format=yuv420p[vo];"
fc+="[ca]highpass=f=85,lowpass=f=12000,afftdn=nr=10:nf=-40,acompressor=threshold=-22dB:ratio=3:attack=8:release=120:makeup=4dB,loudnorm=I=-15:TP=-1.5:LRA=9,aresample=48000[ao]"
args=["ffmpeg","-v","error","-y"]
for i in range(n): args+=["-i",f"{TMP}/seg{i}.mov"]
subprocess.run(args+["-filter_complex",fc,"-map","[vo]","-map","[ao]","-c:v","libx264","-crf","14","-preset","slow","-c:a","aac","-b:a","256k",OUT],check=True)
t=0; segs=[]
for s,e in edl: segs.append({"src":[s,e],"at":round(t,4)}); t+=e-s
print(t)
