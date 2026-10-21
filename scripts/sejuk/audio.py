"""Deterministic 29-second Sejuk score; NumPy synthesis and FFmpeg loudnorm only."""
from pathlib import Path
import json
import shutil
import struct
import subprocess
import wave
import zlib

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'public' / 'sejuk' / 'audio'
SR = 48000
DURATION = 29
RNG = np.random.default_rng(20261017)


def clock(duration):
    return np.arange(round(duration * SR), dtype=np.float64) / SR


def fade(x, attack=0.004, release=0.035):
    x = np.asarray(x).copy()
    a, r = min(len(x), round(attack * SR)), min(len(x), round(release * SR))
    if a:
        x[:a] *= np.linspace(0, 1, a)
    if r:
        x[-r:] *= np.linspace(1, 0, r)
    return x


def noise(duration):
    return RNG.standard_normal(round(duration * SR))


def bright_noise(duration):
    n = noise(duration)
    return n - np.concatenate(([0], n[:-1]))


def tone(freq, duration, decay=5, harmonics=False):
    t = clock(duration)
    x = np.sin(2 * np.pi * freq * t)
    if harmonics:
        x += 0.3 * np.sin(4 * np.pi * freq * t) + 0.12 * np.sin(6 * np.pi * freq * t)
    return fade(x * np.exp(-decay * t))


def put(track, when, sound, gain=1, pan=0):
    start = round(when * SR)
    end = min(len(track), start + len(sound))
    if end <= start:
        return
    p = np.array([np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)])
    track[start:end] += gain * sound[:end - start, None] * p


def whoosh(duration=0.34, rising=True):
    t = clock(duration)
    env = np.sin(np.pi * t / duration) ** 2
    freq = np.linspace(250, 2500, len(t))
    if not rising:
        freq = freq[::-1]
    return fade((0.6 * bright_noise(duration) + 0.3 * np.sin(2 * np.pi * np.cumsum(freq) / SR)) * env)


def write_wav(path, audio):
    with wave.open(str(path), 'wb') as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(np.round(np.clip(audio, -1, 1) * 32767).astype('<i2').tobytes())


def grain():
    """Small neutral texture, independent of the soundtrack's RNG stream."""
    pixels = np.clip(np.random.default_rng(73).normal(128, 24, (512, 512)), 0, 255).astype(np.uint8)
    def chunk(tag, payload):
        return struct.pack('>I', len(payload)) + tag + payload + struct.pack('>I', zlib.crc32(tag + payload) & 0xffffffff)
    rows = b''.join(b'\0' + row.tobytes() for row in pixels)
    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', struct.pack('>IIBBBBB', 512, 512, 8, 0, 0, 0, 0))
    png += chunk(b'IDAT', zlib.compress(rows, 9)) + chunk(b'IEND', b'')
    (OUT.parent / 'grain.png').write_bytes(png)


def main():
    ffmpeg = shutil.which('ffmpeg')
    if not ffmpeg:
        raise RuntimeError('ffmpeg must be on PATH')
    OUT.mkdir(parents=True, exist_ok=True)
    music = np.zeros((DURATION * SR, 2), dtype=np.float64)
    fx = np.zeros_like(music)
    t = clock(0.34)
    kick = fade(np.sin(2 * np.pi * (48 * t + (115 / 34) * (1 - np.exp(-34 * t)))) * np.exp(-14 * t))
    t = clock(0.19)
    clap = fade(bright_noise(0.19) * np.exp(-23 * t) * (0.65 + 0.35 * np.sin(2 * np.pi * 83 * t) ** 2))
    t = clock(0.065)
    hat = fade(bright_noise(0.065) * np.exp(-65 * t), 0.001, 0.015)
    # 120 BPM: quarter note = 0.5 s; backbeat claps on beats 2 and 4.
    for beat in range(58):
        at = beat * 0.5
        brand = at >= 17.2
        put(music, at, kick, 0.32 if brand else 0.19)
        if beat % 4 in (1, 3):
            put(music, at, clap, 0.105 if brand else 0.065, 0.08)
        for off in (0, 0.25):
            put(music, at + off, hat, 0.048 if brand else 0.026, -0.3 if off else 0.3)
        # Minor chromatic comedy before the reveal; warm C-major groove after it.
        notes = [48, 48, 51, 49] if not brand else [48, 55, 57, 53]
        midi = notes[(beat // 4) % 4]
        freq = 440 * 2 ** ((midi - 69) / 12)
        put(music, at, tone(freq / 2, 0.42, 7, True), 0.22 if brand else 0.13)
        if beat % 2 == 0 or brand:
            put(music, at + 0.25, tone(freq * (4 if brand else 2), 0.36, 13, True), 0.11 if brand else 0.065, (-1) ** beat * 0.28)
    # Extra suspense pulses and nervous pizzicato in the problem section.
    for at in np.arange(0.75, 15, 1):
        put(music, at, tone(311.127 if int(at) % 2 else 329.628, 0.2, 20, True), 0.045, -0.25)
    for at in (17.2, 19.2, 21.2, 23.2, 25.2, 27.2):
        for freq in (261.626, 329.628, 391.995):
            put(music, at, tone(freq, 1.65, 2.4, True), 0.055, (freq - 330) / 300)
    # Music is sample-exact silent from 15.000 through 16.500, then reveal gap to 17.2.
    music[round(15 * SR):round(17.2 * SR)] = 0
    music[round(14.96 * SR):round(15 * SR)] *= np.linspace(1, 0, round(0.04 * SR))[:, None]
    for at in (3, 7.5, 11.5, 15, 16.5, 19.5, 23.5, 26.5):
        put(fx, at, whoosh(0.18 if at == 15 else 0.32), 0.12)
    for i, at in enumerate(np.arange(3, 7.5, 0.25)):
        put(fx, at, tone(1450 if i % 2 else 1050, 0.045, 85), 0.10, -0.25 if i % 2 else 0.25)
    for at in (11.7, 12.5):
        for off, freq in ((0, 880), (0.085, 1174.659)):
            put(fx, at + off, tone(freq, 0.16, 20), 0.15, 0.25)
    for at in (10, 25.8):
        t = clock(0.22)
        stamp = fade((0.65 * noise(0.22) + np.sin(2 * np.pi * 95 * t)) * np.exp(-32 * t))
        put(fx, at, stamp, 0.28)
    put(fx, 24, tone(1250, 0.13, 5), 0.14)
    for off, freq in ((0, 1046.502), (0.19, 783.991)):
        put(fx, 23.65 + off, tone(freq, 0.62, 5, True), 0.16)
    t = clock(0.58)
    put(fx, 24.25, fade((noise(0.58) * 0.35 + np.sin(2 * np.pi * 55 * t)) * np.exp(-10 * t)), 0.36)
    put(fx, 24.25, whoosh(1.15, False), 0.095, -0.35)
    for off, freq in ((0, 523.251), (0.13, 659.255), (0.26, 783.991), (0.4, 1046.502)):
        put(fx, 22.5 + off, tone(freq, 0.48, 7, True), 0.14, 0.15)
    # Record scratch is deliberately the only brief punctuation over the music break.
    t = clock(0.22)
    freq = 1800 - 1450 * t / 0.22 + 240 * np.sin(2 * np.pi * 24 * t)
    scratch = fade((np.sin(2 * np.pi * np.cumsum(freq) / SR) + 0.45 * bright_noise(0.22)) * np.exp(-8 * t))
    put(fx, 15, scratch, 0.23)
    fx[round(15.22 * SR):round(16.5 * SR)] = 0
    t = clock(0.7)
    riser = fade((0.32 * bright_noise(0.7) + np.sin(2 * np.pi * (220 * t + 1300 * t * t))) * (t / 0.7) ** 1.5)
    put(fx, 16.5, riser, 0.22)
    put(fx, 17.2, kick, 0.28)
    audio = music + fx
    audio[-round(0.22 * SR):] *= np.linspace(1, 0, round(0.22 * SR))[:, None]
    audio *= 0.90 / max(0.90, float(np.max(np.abs(audio))))
    raw = OUT / 'mix.wav'
    normalized = OUT / 'mix-normalized.wav'
    write_wav(raw, audio)
    target = 'loudnorm=I=-14:TP=-1:LRA=11'
    first = subprocess.run([ffmpeg, '-hide_banner', '-nostats', '-i', str(raw), '-af', target + ':print_format=json', '-f', 'null', '-'], capture_output=True, text=True, check=True)
    stats = json.loads(first.stderr[first.stderr.rfind('{'):first.stderr.rfind('}') + 1])
    filt = target + ':measured_I=' + stats['input_i'] + ':measured_TP=' + stats['input_tp'] + ':measured_LRA=' + stats['input_lra'] + ':measured_thresh=' + stats['input_thresh'] + ':offset=' + stats['target_offset'] + ':linear=false:print_format=json'
    subprocess.run([ffmpeg, '-y', '-hide_banner', '-nostats', '-i', str(raw), '-af', filt + ',aresample=48000,alimiter=limit=0.84:level=false:latency=true', '-ar', str(SR), '-ac', '2', '-c:a', 'pcm_s16le', str(normalized)], capture_output=True, text=True, check=True)
    verify = subprocess.run([ffmpeg, '-hide_banner', '-nostats', '-i', str(normalized), '-af', target + ':print_format=json', '-f', 'null', '-'], capture_output=True, text=True, check=True)
    measured = json.loads(verify.stderr[verify.stderr.rfind('{'):verify.stderr.rfind('}') + 1])
    for path in (raw, normalized):
        with wave.open(str(path), 'rb') as f:
            samples = np.frombuffer(f.readframes(f.getnframes()), dtype='<i2').reshape(-1, 2)
            print(json.dumps({'path': str(path), 'seconds': len(samples) / SR, 'sample_rate': f.getframerate(), 'channels': f.getnchannels(), 'frames': len(samples), 'peak_dbfs': float(20 * np.log10(max(1, np.abs(samples.astype(np.int32)).max()) / 32768)), 'break_15.23_to_16.49_max_pcm': int(np.abs(samples[round(15.23 * SR):round(16.49 * SR)].astype(np.int32)).max())}))
    assert np.count_nonzero(music[15 * SR:round(16.5 * SR)]) == 0
    print('Normalized measured LUFS/true peak/LRA:', measured['input_i'], measured['input_tp'], measured['input_lra'])
    grain()
    print('Texture:', OUT.parent / 'grain.png')


if __name__ == '__main__':
    main()
