"""Original 144 BPM showreel score. Standard library only; no external samples."""
import argparse
from array import array
import math
from pathlib import Path
import random
import wave

RATE = 44100
DURATION = 15
TAU = math.tau
rng = random.Random(41)
left = array('f', [0]) * (RATE * DURATION)
right = array('f', [0]) * (RATE * DURATION)


def add(start, duration, synth, gain=1, pan=0):
    offset = round(start * RATE)
    count = round(duration * RATE)
    for i in range(count):
        index = offset + i
        if 0 <= index < len(left):
            value = synth(i / RATE, i / count) * gain
            left[index] += value * math.sqrt((1 - pan) / 2)
            right[index] += value * math.sqrt((1 + pan) / 2)


def kick(t, _):
    phase = 49 * t + 110 * 0.022 * (1 - math.exp(-t / 0.022))
    return math.sin(TAU * phase) * math.exp(-t * 17) + rng.uniform(-1, 1) * math.exp(-t * 250) * 0.3


def impact(t, _):
    return math.sin(TAU * (38 * t + 3 * (1 - math.exp(-t * 25)))) * math.exp(-t * 7) + rng.uniform(-1, 1) * math.exp(-t * 27) * 0.28


def clap(t, _):
    return rng.uniform(-1, 1) * math.exp(-t * 32) * (0.4 + 0.6 * abs(math.sin(t * 700)))


def pluck(freq):
    return lambda t, _: (math.sin(TAU * freq * t) + 0.25 * math.sin(TAU * freq * 2 * t)) * math.exp(-t * 13) * min(1, t * 500)


beat = 60 / 144
notes = [146.832, 220, 293.665, 329.628, 440, 293.665, 220, 164.814]
for n in range(36):
    start = n * beat
    if start >= 12.5:
        continue
    add(start, 0.36, kick, 0.72)
    if n % 2:
        add(start, 0.17, clap, 0.24, -0.1)
    for half in range(2):
        when = start + half * beat / 2
        add(when, 0.045, lambda t, _: rng.uniform(-1, 1) * math.exp(-t * 115), 0.07, 0.45 if half else -0.45)
        add(when, 0.28, pluck(notes[(n * 2 + half) % len(notes)] * (2 if n >= 17 else 1)), 0.16, 0.4 if half else -0.4)
    bass = [73.416, 65.406, 87.307, 82.407][(n // 4) % 4]
    add(start + 0.025, beat * 0.85, lambda t, u, f=bass: math.sin(TAU * f * t) * min(1, t * 80) * (1 - u) ** 1.7, 0.34)

for cue in [0, 0.32, 2, 4.5, 7, 10, 12.5]:
    add(cue, 0.7, impact, 0.75 if cue in [0, 7, 12.5] else 0.5)
for cue in [1.7, 4.18, 6.68, 9.68, 12.18]:
    add(cue - 0.15, 0.42, lambda t, u: (rng.uniform(-1, 1) * 0.8 + math.sin(TAU * (650 * t + 1600 * t * t)) * 0.15) * math.sin(math.pi * u) ** 2, 0.24, -0.25)
for freq in [146.832, 220, 293.665, 440, 587.33]:
    add(12.58, 2.3, lambda t, u, f=freq: math.sin(TAU * f * t) * min(1, t * 35) * math.exp(-t * 2.5) * (1 - u), 0.16)

# Smooth soft limiting, a short fade-in and a full half-second tail fade.
peak = max(max(abs(v) for v in left), max(abs(v) for v in right), 1e-8)
scale = 0.86 / math.tanh(peak * 1.1)
pcm = array('h')
for i in range(len(left)):
    fade = min(1, i / (RATE * 0.004), (len(left) - 1 - i) / (RATE * 0.5))
    for channel in [left, right]:
        value = math.tanh(channel[i] * 1.1) * scale * max(0, fade)
        pcm.append(round(max(-1, min(1, value)) * 32767))

parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=Path(__file__).resolve().parents[2] / 'public' / 'showreel' / 'score.wav')
args = parser.parse_args()
args.output.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(args.output), 'wb') as output:
    output.setnchannels(2)
    output.setsampwidth(2)
    output.setframerate(RATE)
    output.writeframes(pcm.tobytes())
print(f'Wrote {args.output}: {DURATION}s stereo, peak {max(abs(v) for v in pcm) / 32767:.3f}')
