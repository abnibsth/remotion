"""WHEN UI ESCAPES THE SCREEN: original, deterministic, sample-free soundtrack.

Build and verify: python -I scripts/ui-escapes/audio.py
Verify only:      python -I scripts/ui-escapes/audio.py --verify
Requires existing NumPy, FFmpeg and FFprobe; never installs dependencies.
Writes only the three WAVs, LICENSE.md, and out/ui-escapes/audio-report.json.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public" / "ui-escapes" / "audio"
REPORT = ROOT / "out" / "ui-escapes" / "audio-report.json"
SR = 48000
DURATION = 25
FRAMES = DURATION * SR
BPM = 112
BEAT = 60 / BPM
SEED = 20261024
TARGET_LUFS = -14.0
WAV_TP_TARGET = -1.2
DELIVERY_TP_MAX = -1.0
AAC_BITRATES = ("192k", "320k")
POPS = (11.2, 11.68, 12.15, 12.58, 13.0, 13.42, 13.82, 14.18, 14.5, 14.86, 15.18)
SILENCES = ((16.65, 16.95), (21.25, 23.4))
EVENTS = [
    {"name": "mouse", "start": 1.5, "end": 1.565},
    {"name": "folder_twitch", "start": 2.6, "end": 2.76},
    {"name": "folder_stretch", "start": 3.15, "end": 4.45},
    {"name": "screen_exit", "start": 4.45, "end": 4.84},
    {"name": "folder_impact", "start": 5.55, "end": 5.91},
    {"name": "folder_bounce", "start": 6.05, "end": 6.37},
    {"name": "folder_settle", "start": 6.7, "end": 6.88},
    {"name": "browser_bend", "start": 7.2, "end": 8.7},
    {"name": "browser_flutter", "start": 9.2, "end": 10.5},
    *[{"name": f"pop_{i + 1:02d}", "start": at, "end": round(at + 0.17, 5)}
      for i, at in enumerate(POPS)],
    *[{"name": f"impact_{i + 1:02d}", "start": round(at + 0.85, 5),
       "end": round(at + 1.03, 5)} for i, at in enumerate(POPS)],
    {"name": "delete_click", "start": 16.6, "end": 16.64},
    {"name": "suction", "start": 16.95, "end": 20.8},
    {"name": "closure", "start": 21.1, "end": 21.225},
    {"name": "dry_ping", "start": 23.45, "end": 23.82},
    {"name": "tiny_twitch", "start": 24.2, "end": 24.305},
]
LICENSE = """# Original synthesized soundtrack

## WHEN UI ESCAPES THE SCREEN

Files: `music.wav`, `sfx.wav`, and `mix.wav`.
Generator: `scripts/ui-escapes/audio.py`, deterministic seed 20261024.

All musical phrases, instruments, percussion, and foley in these files are
original procedural synthesis: mathematical oscillators, decaying resonant
modes, envelopes, and seeded filtered noise. No recordings, sample libraries,
stock music, third-party melodies, network downloads, speech, or vocals were
used. No real device/OS notification recordings were used or imitated.

To the extent any copyright or related rights subsist in this generated audio,
the contributor dedicates those rights to the public domain under CC0 1.0
Universal: https://creativecommons.org/publicdomain/zero/1.0/ . Attribution is
not required. No warranty is provided; no third-party rights are granted.
The generator's dependencies retain their own licenses and are not embedded
as source or executable code in the WAV files.

Each WAV is exactly 25 seconds, 48,000 Hz, two-channel 24-bit PCM.
The stems share the mix's mastering envelope and are NOT independently
normalized to -14 LUFS. Add music and SFX at unity gain to reconstruct the mix
within 24-bit quantization tolerance. `mix.wav` is the delivery master.
"""


def run(args, data=None):
    result = subprocess.run(list(map(str, args)), input=data, stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE, check=False)
    if result.returncode:
        raise RuntimeError(result.stderr.decode("utf-8", errors="replace")[-5000:])
    return result


def ffmpeg(*args, data=None):
    return run(["ffmpeg", "-hide_banner", "-nostdin", "-y", *args], data)


def write_wav(path, samples):
    ffmpeg("-f", "f32le", "-ar", SR, "-ac", 2, "-i", "pipe:0",
           "-c:a", "pcm_s24le", path, data=np.asarray(samples, dtype="<f4").tobytes())


def read_wav(path):
    stream = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-of", "json", path]).stdout)["streams"][0]
    # Do not force rate/channels here: verification must inspect the delivered format.
    decoded = ffmpeg("-i", path, "-f", "f32le", "pipe:1").stdout
    return np.frombuffer(decoded, dtype="<f4").reshape(-1, int(stream["channels"])), stream


def smooth(t, start, end):
    x = np.clip((t - start) / (end - start), 0, 1)
    return x * x * (3 - 2 * x)


def envelope(t, duration, attack=0.003, release=0.025):
    return smooth(t, 0, attack) * (1 - smooth(t, duration - release, duration))


def clock(duration):
    return np.arange(round(duration * SR), dtype=np.float64) / SR


def frequency(midi):
    return 440 * 2 ** ((midi - 69) / 12)


def synthesize():
    """Felt/wood modes, rounded bass, papery foley; no harsh saw/square leads."""
    rng = np.random.default_rng(SEED)
    stems = {name: np.zeros((FRAMES, 2), dtype=np.float64) for name in ("music", "sfx")}

    def noise(n, low=250, high=6000, slope=0.6):
        bins = np.fft.rfftfreq(n, 1 / SR)
        shape = (1 - np.exp(-(bins / low) ** 4)) * np.exp(-(bins / high) ** 4)
        shape *= np.maximum(bins, 30) ** (-slope / 2)
        signal = np.fft.irfft(np.fft.rfft(rng.standard_normal(n)) * shape, n=n)
        return signal / max(float(np.std(signal)), 1e-12)

    def add(stem, at, signal, gain=1.0, pan=0.0):
        start = round(at * SR)
        n = min(len(signal), FRAMES - start)
        if start < 0 or n <= 0:
            raise ValueError(f"Invalid audio event at {at}")
        if np.ndim(signal) == 2:
            stems[stem][start:start + n] += signal[:n] * gain
        else:
            pan = np.asarray(pan)
            gains = np.stack((np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)), axis=-1)
            stems[stem][start:start + n] += signal[:n, None] * gains * gain

    def pluck(at, midi, gain=0.09, pan=0, duration=0.48):
        t = clock(duration)
        phase = 2 * np.pi * frequency(midi) * t
        # Independently decaying modes give a soft physical attack, not a game bleep.
        signal = (np.sin(phase) * np.exp(-t * 7.2)
                  + 0.23 * np.sin(phase * 2.003) * np.exp(-t * 13)
                  + 0.075 * np.sin(phase * 3.012) * np.exp(-t * 22)
                  + 0.028 * np.sin(phase * 4.91) * np.exp(-t * 35))
        signal += noise(len(t), 700, 3800) * np.exp(-t * 95) * 0.026
        signal *= envelope(t, duration, 0.004, 0.07)
        add("music", at, signal, gain, pan)

    def bass(at, midi, gain=0.07, duration=0.4):
        t = clock(duration)
        phase = 2 * np.pi * frequency(midi) * t
        signal = (np.sin(phase) + 0.18 * np.sin(2 * phase) + 0.035 * np.sin(3 * phase))
        signal *= np.exp(-t * 3.6) * envelope(t, duration, 0.012, 0.10)
        add("music", at, signal, gain)

    def kick(at, gain=0.06):
        duration = 0.22
        t = clock(duration)
        phase = 2 * np.pi * (55 * t + 1.4 * (1 - np.exp(-t * 32)))
        signal = np.sin(phase) * np.exp(-t * 24)
        signal += noise(len(t), 400, 2400) * np.exp(-t * 140) * 0.035
        add("music", at, signal * envelope(t, duration, 0.003, 0.04), gain)

    def hat(at, gain=0.012, pan=0.25, duration=0.048):
        t = clock(duration)
        signal = noise(len(t), 1900, 6200, 0.4) * np.exp(-t * 74)
        add("music", at, signal * envelope(t, duration, 0.0015, 0.012), gain, pan)

    def rim(at, gain=0.028, pan=-0.15):
        duration = 0.09
        t = clock(duration)
        signal = (np.sin(2 * np.pi * 760 * t) * np.exp(-t * 90)
                  + 0.31 * np.sin(2 * np.pi * 1323 * t) * np.exp(-t * 120)
                  + noise(len(t), 800, 4700) * np.exp(-t * 100) * 0.11)
        add("music", at, signal * envelope(t, duration, 0.0015, 0.015), gain, pan)

    # Original F6/9 -> Dm7 -> Bbmaj7 -> C6 motif. Sparse, nimble, no big pad.
    harmonies = ((41, (65, 69, 72, 74)), (38, (65, 69, 72, 76)),
                 (34, (65, 69, 70, 74)), (36, (64, 67, 69, 74)))
    for bar in range(5):
        start = 0.18 + bar * 4 * BEAT
        root, notes = harmonies[bar % 4]
        for beat, index, level in ((0, 0, 0.078), (0.75, 2, 0.063),
                                   (1.5, 1, 0.065), (2.5, 3, 0.071), (3.25, 2, 0.049)):
            at = start + beat * BEAT
            if at < 10.8:
                pluck(at, notes[index], level, (-0.28, 0.22, -0.12, 0.3)[index])
        for beat, note in ((0, root), (2, root + 7)):
            bass(start + beat * BEAT, note, 0.056, 0.51)
        for beat in (0, 2):
            kick(start + beat * BEAT, 0.040)
        rim(start + BEAT, 0.014)
        for beat in (0.5, 2.5, 3.5):
            hat(start + beat * BEAT, 0.0075, 0.2 * (-1) ** int(beat))

    # 112 BPM stays fixed; subdivision density and velocities gently accelerate.
    for index in range(10):
        at = 11 + index * BEAT
        if at >= 16:
            break
        root, notes = harmonies[(index // 4) % 4]
        progress = (at - 11) / 5
        bass(at, root if index % 2 == 0 else root + 7, 0.066, 0.37)
        kick(at, 0.051 if index % 2 == 0 else 0.039)
        if index % 2:
            rim(at, 0.028)
        pluck(at, notes[index % 4], 0.076 + 0.014 * progress,
              0.24 * (-1) ** index, 0.38)
        if at + 0.5 * BEAT < 16:
            hat(at + 0.5 * BEAT, 0.014 + 0.005 * progress, 0.3)
        if progress > 0.25 and at + 0.75 * BEAT < 16:
            hat(at + 0.75 * BEAT, 0.005 + 0.007 * progress, -0.35)
        if progress > 0.6 and at + 0.25 * BEAT < 16:
            hat(at + 0.25 * BEAT, 0.006 + 0.005 * progress, -0.18)
        if index % 2 or progress > 0.7:
            offbeat = at + 0.5 * BEAT
            if offbeat < 16:
                pluck(offbeat, notes[(index + 2) % 4], 0.046, -0.22, 0.30)
    for note, pan in ((65, -0.2), (69, 0.2), (74, 0)):
        pluck(16.08, note, 0.036, pan, 0.48)

    def tick(at, gain=0.1, pan=0, duration=0.04, tone=1450):
        t = clock(duration)
        signal = noise(len(t), 700, 5700) * np.exp(-t * 175) * 0.40
        signal += np.sin(2 * np.pi * tone * t) * np.exp(-t * 145) * 0.60
        add("sfx", at, signal * envelope(t, duration, 0.001, 0.009), gain, pan)

    def paper(at, duration, gain, pan=0, low=450, high=4900):
        t = clock(duration)
        signal = noise(len(t), low, high) * envelope(t, duration, min(0.025, duration / 5), duration / 3)
        signal *= 0.72 + 0.28 * np.sin(2 * np.pi * 31 * t + 0.4)
        add("sfx", at, signal, gain, pan)

    def impact(at, gain=0.16, pan=0, size=1, duration=0.18):
        t = clock(duration)
        phase = 2 * np.pi * (105 / size * t + 0.65 * (1 - np.exp(-t * 50)))
        signal = np.sin(phase) * np.exp(-t * 32 / size)
        signal += np.sin(2 * np.pi * 480 / size * t) * np.exp(-t * 70) * 0.24
        signal += noise(len(t), 400, 4800) * np.exp(-t * 130) * 0.15
        add("sfx", at, signal * envelope(t, duration, 0.0018, 0.035), gain, pan)

    tick(1.5, 0.115, -0.32, 0.038, 1730)
    tick(1.528, 0.045, -0.30, 0.037, 1250)
    paper(2.6, 0.16, 0.035, -0.18, 600, 3700)
    impact(2.6, 0.045, -0.18, 0.75, 0.12)

    # The folder stretches like textured rubber, not a cartoon laser.
    t = clock(1.30)
    f = 185 + 73 * smooth(t, 0, 1.25) + 8 * np.sin(2 * np.pi * 3.3 * t)
    phase = 2 * np.pi * np.cumsum(f) / SR
    stretch = np.sin(phase) + 0.17 * np.sin(phase * 2.012)
    stretch *= 0.032 + 0.034 * smooth(t, 0.15, 1.18)
    stretch += noise(len(t), 380, 2650) * (0.011 + 0.012 * smooth(t, 0, 1.25))
    stretch *= envelope(t, 1.30, 0.055, 0.040)
    add("sfx", 3.15, stretch, pan=-0.2 + 0.35 * smooth(t, 0, 1.30))
    paper(4.45, 0.39, 0.077, np.linspace(-0.18, 0.62, round(0.39 * SR)), 480, 5000)
    tick(4.45, 0.057, 0.12, 0.045, 930)
    impact(5.55, 0.255, 0.30, 1.4, 0.36)
    paper(5.55, 0.12, 0.026, 0.32, 600, 4200)
    t = clock(0.32)
    phase = 2 * np.pi * (155 * t + 2.4 * (1 - np.exp(-t * 18)))
    bounce = (np.sin(phase) + 0.12 * np.sin(2 * phase)) * np.exp(-t * 13)
    add("sfx", 6.05, bounce * envelope(t, 0.32, 0.003, 0.045), 0.125, 0.18)
    impact(6.7, 0.070, 0.12, 0.85, 0.13)
    paper(6.72, 0.16, 0.022, 0.12, 350, 3200)

    t = clock(1.5)
    f = 146 + 18 * np.sin(np.pi * t / 1.5) + 1.1 * np.sin(2 * np.pi * 6 * t)
    phase = 2 * np.pi * np.cumsum(f) / SR
    bend = np.sin(phase) * 0.048 + np.sin(phase * 2.73) * 0.012
    bend += noise(len(t), 500, 2400) * 0.009 * (0.6 + 0.4 * np.sin(2 * np.pi * 8 * t) ** 2)
    add("sfx", 7.2, bend * envelope(t, 1.5, 0.05, 0.09), pan=0.28 * np.sin(np.pi * t / 1.5))
    flutter_offsets = (0, 0.155, 0.305, 0.45, 0.59, 0.725, 0.85, 0.965, 1.075, 1.18, 1.245)
    for index, offset in enumerate(flutter_offsets):
        duration = min(0.073, 1.30 - offset)
        paper(9.2 + offset, duration, 0.036 + 0.009 * (index % 3), 0.36 * (-1) ** index, 850, 4700)

    # Eleven physical air/membrane pops, each with a desk landing exactly +0.85 s.
    for index, at in enumerate(POPS):
        t = clock(0.17)
        base = (300, 345, 275, 390)[index % 4]
        phase = 2 * np.pi * (base * t + 1.55 * (1 - np.exp(-t * 50)))
        pop = np.sin(phase) * np.exp(-t * 34)
        pop += noise(len(t), 500, 5000) * np.exp(-t * 110) * 0.17
        pan = (-0.42, 0.32, -0.19, 0.46, 0.0)[index % 5]
        add("sfx", at, pop * envelope(t, 0.17, 0.0018, 0.025), 0.145 + 0.008 * (index % 3), pan)
        impact(round(at + 0.85, 5), 0.142 + 0.008 * (index % 3), pan * 0.85, 0.78 + 0.06 * (index % 4))

    tick(16.6, 0.139, 0, 0.04, 1160)

    # A smooth narrowing vacuum with tiny entrained paper flecks, no vocal formants.
    t = clock(3.85)
    progress = t / 3.85
    low_air = noise(len(t), 90, 1200, 0.9)
    mid_air = noise(len(t), 500, 3300, 0.6)
    high_air = noise(len(t), 1300, 5600, 0.5)
    env = envelope(t, 3.85, 0.14, 0.19)
    level = 0.45 + 0.55 * smooth(t, 0.1, 3.3)
    rotation = 0.85 * t + 0.58 * t * t
    for channel in range(2):
        swirl = 0.73 + 0.27 * np.sin(2 * np.pi * rotation + channel * 1.8)
        air = low_air * (0.066 - 0.025 * progress)
        air += mid_air * (0.023 + 0.035 * progress) * swirl
        air += high_air * 0.010 * smooth(t, 1.4, 3.4)
        phase = 2 * np.pi * (91 * t + 4.2 * t * t)
        body = np.sin(phase + channel * 0.035) * 0.032 * (1 - 0.5 * progress)
        stems["sfx"][round(16.95 * SR):round(20.8 * SR), channel] += (air + body) * env * level
    for index, offset in enumerate((0.25, 0.65, 1.01, 1.33, 1.62, 1.88, 2.11, 2.32,
                                     2.51, 2.68, 2.83, 2.97, 3.10, 3.22, 3.33, 3.43, 3.52)):
        paper(16.95 + offset, 0.07, 0.020 + index * 0.0007,
              float(0.5 * np.sin(index * 1.8)), 800, 4200)
    impact(21.1, 0.115, 0, 0.92, 0.125)
    tick(21.105, 0.040, 0, 0.028, 1380)

    t = clock(0.37)
    ping = np.sin(2 * np.pi * 880 * t) * np.exp(-t * 19)
    ping += 0.11 * np.sin(2 * np.pi * 2357 * t) * np.exp(-t * 34)
    add("sfx", 23.45, ping * envelope(t, 0.37, 0.002, 0.055), 0.082, -0.05)
    paper(24.2, 0.105, 0.014, -0.10, 650, 3500)
    tick(24.2, 0.025, -0.1, 0.026, 980)
    tick(24.246, 0.012, 0.1, 0.025, 780)

    # Music yields to the physical action; the ping/twitch have no music beneath.
    t = np.arange(FRAMES) / SR
    duck = np.ones(FRAMES)
    for event in EVENTS:
        at = event["start"]
        if at >= 16.6:
            continue
        depth = 0.36 if event["name"] in ("screen_exit", "folder_impact") else 0.20
        duck *= 1 - depth * smooth(t, at - 0.018, at) * (1 - smooth(t, at + 0.045, at + 0.20))
    stems["music"] *= duck[:, None]
    stems["music"] *= (1 - smooth(t, 16.42, 16.58))[:, None]
    for samples in stems.values():
        for start, end in SILENCES:
            # Source envelopes already end before these; the mask is an exact contract.
            samples[round(start * SR):round(end * SR)] = 0
        samples[:round(0.025 * SR)] = 0
        samples[round(24.5 * SR):] = 0
    return stems


def loudness(path):
    text = ffmpeg("-i", path, "-af",
                  "loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json",
                  "-f", "null", "-").stderr.decode("utf-8", errors="replace")
    raw = json.loads(text[text.rfind("{"):text.rfind("}") + 1])
    return {"integrated_lufs": float(raw["input_i"]),
            "true_peak_dbtp": float(raw["input_tp"]),
            "loudness_range_lu": float(raw["input_lra"]),
            "gated_threshold_lufs": float(raw["input_thresh"])}


def encode_aac(source, target, bitrate):
    ffmpeg("-i", source, "-c:a", "aac", "-b:a", bitrate, "-ar", SR, "-ac", 2, target)


def linked_master(stems, gain_db, ceiling_db):
    """One transparent look-ahead gain envelope shared by both stems.

    Detect 1-ms block maxima, hold around peaks, release over 65 ms, then smooth.
    FFmpeg measures the actual reconstructed true peak and decoded AAC afterward;
    this sample-domain controller is not presented as a true-peak meter.
    """
    linear_gain = 10 ** (gain_db / 20)
    ceiling = 10 ** (ceiling_db / 20)
    mix = stems["music"] + stems["sfx"]
    detect = np.maximum.reduce([np.max(np.abs(a), axis=1) for a in (mix, *stems.values())])
    peaks = detect.reshape(-1, 48).max(axis=1) * linear_gain
    required = np.minimum(0, 20 * np.log10(ceiling / np.maximum(peaks, 1e-12)))
    padded = np.pad(required, (8, 8), mode="edge")
    held = np.minimum.reduce([padded[i:i + len(required)] for i in range(13)])
    # i=0..12 covers eight preceding and four following milliseconds.
    release = np.exp(-0.001 / 0.065)
    state = 0.0
    for index in range(len(held)):
        state = min(float(held[index]), state * release)
        held[index] = state
    smoothed = np.convolve(np.pad(held, (2, 2), mode="edge"), np.ones(5) / 5, mode="valid")
    gain = np.interp(np.arange(FRAMES) / 48 - 0.5, np.arange(len(smoothed)), smoothed)
    gain = linear_gain * 10 ** (gain / 20)
    mastered = {name: signal * gain[:, None] for name, signal in stems.items()}
    stats = {"common_gain_db": gain_db, "sample_limiter_ceiling_dbfs": ceiling_db,
             "maximum_gain_reduction_db": round(float(-np.min(smoothed)), 4),
             "shared_envelope_preserves_stem_sum": True}
    return mastered, stats


def master(stems, folder):
    raw = folder / "raw.wav"
    write_wav(raw, stems["music"] + stems["sfx"])
    original = loudness(raw)
    gain_db = TARGET_LUFS - original["integrated_lufs"]
    ceiling_db = -1.65
    attempts = []
    for iteration in range(10):
        mastered, stats = linked_master(stems, gain_db, ceiling_db)
        trial = folder / "master.wav"
        write_wav(trial, mastered["music"] + mastered["sfx"])
        pcm = loudness(trial)
        aac_values = {}
        for bitrate in AAC_BITRATES:
            encoded = folder / f"trial-{bitrate}.m4a"
            encode_aac(trial, encoded, bitrate)
            aac_values[bitrate] = loudness(encoded)
        attempts.append({"iteration": iteration + 1, **stats, "wav": pcm, "aac": aac_values})
        peak_excess = max(pcm["true_peak_dbtp"] - WAV_TP_TARGET,
                          max(item["true_peak_dbtp"] for item in aac_values.values()) - WAV_TP_TARGET)
        if (abs(pcm["integrated_lufs"] - TARGET_LUFS) <= 0.12
                and all(abs(item["integrated_lufs"] - TARGET_LUFS) <= 0.25 for item in aac_values.values())
                and peak_excess <= 0):
            for name, samples in mastered.items():
                write_wav(PUBLIC / f"{name}.wav", samples)
            shutil.copyfile(trial, PUBLIC / "mix.wav")
            return {"premaster": original, "passes": attempts, "final": stats}
        gain_db += TARGET_LUFS - pcm["integrated_lufs"]
        if peak_excess > 0:
            ceiling_db -= peak_excess + 0.10
    raise RuntimeError("Mastering did not meet the measured WAV and decoded-AAC targets")


def dbfs(value):
    return float(20 * np.log10(max(float(value), 1e-15)))


def rms(signal):
    return float(np.sqrt(np.mean(np.asarray(signal, dtype=np.float64) ** 2)))


def verify(mastering=None):
    assets, checks, measurements = {}, {}, {}
    for name in ("music", "sfx", "mix"):
        path = PUBLIC / f"{name}.wav"
        samples, stream = read_wav(path)
        assets[name] = samples
        rate, channels = int(stream["sample_rate"]), int(stream["channels"])
        metrics = loudness(path)
        measurements[name] = {
            "file": path.relative_to(ROOT).as_posix(), "frames": len(samples),
            "duration_seconds": len(samples) / rate, "sample_rate": rate,
            "channels": channels, "pcm_bits": int(stream["bits_per_sample"]),
            "codec": stream["codec_name"], "bytes": path.stat().st_size,
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest(), **metrics,
            "sample_peak_dbfs": dbfs(np.max(np.abs(samples))),
            "stereo_difference_rms_dbfs": dbfs(rms(samples[:, 0] - samples[:, -1])),
        }
        checks[f"{name}_exact_25s_1200000_frames"] = bool(
            len(samples) == FRAMES and float(stream["duration"]) == DURATION)
        checks[f"{name}_stereo_48khz_24bit_pcm"] = bool(
            rate == SR and channels == 2 and stream["codec_name"] == "pcm_s24le"
            and int(stream["bits_per_sample"]) == 24)
        checks[f"{name}_finite_no_clipping"] = bool(np.isfinite(samples).all() and np.max(np.abs(samples)) < 1)
        checks[f"{name}_not_dual_mono"] = rms(samples[:, 0] - samples[:, -1]) > 0.0001
        checks[f"{name}_clean_boundaries"] = bool(
            np.max(np.abs(samples[:1200])) == 0 and np.max(np.abs(samples[-24000:])) == 0)

    mix, sfx = assets["mix"], assets["sfx"]
    pcm = measurements["mix"]
    checks["mix_loudness_within_0_25_lu_of_minus14"] = abs(pcm["integrated_lufs"] - TARGET_LUFS) <= 0.25
    checks["mix_true_peak_at_most_minus1_2"] = pcm["true_peak_dbtp"] <= WAV_TP_TARGET
    residual = float(np.max(np.abs(mix.astype(np.float64) - assets["music"] - sfx)))
    checks["stems_reconstruct_mix_within_24bit_quantization"] = residual <= 3 / 2 ** 23

    silence_results = []
    for start, end in SILENCES:
        per_stem = {name: float(np.max(np.abs(samples[round(start * SR):round(end * SR)])))
                    for name, samples in assets.items()}
        silence_results.append({"start": start, "end": end,
                                "frames": round((end - start) * SR),
                                "max_absolute_sample": per_stem})
        checks[f"exact_digital_silence_{start}_{end}_all_stems"] = all(value == 0 for value in per_stem.values())
    checks["no_music_after_16_65"] = bool(np.max(np.abs(assets["music"][round(16.65 * SR):])) == 0)

    cue_results = []
    for event in sorted(EVENTS, key=lambda item: item["start"]):
        start = round(event["start"] * SR)
        length = min(round((event["end"] - event["start"]) * SR), round(0.06 * SR))
        energy = rms(sfx[start:start + length])
        cue_results.append({**event, "onset_sample": start,
                            "sfx_first_60ms_rms_dbfs": round(dbfs(energy), 3)})
        checks[f"cue_present_{event['name']}"] = energy > 0.0004
    checks["eleven_pop_impact_pairs_plus_0_85s"] = len(POPS) == 11 and all(
        round((round(at + 0.85, 5) - at) * SR) == 40800 for at in POPS)

    aac_report = {}
    with tempfile.TemporaryDirectory(prefix="ui-escapes-aac-qc-") as temp:
        for bitrate in AAC_BITRATES:
            encoded = Path(temp) / f"delivery-{bitrate}.m4a"
            encode_aac(PUBLIC / "mix.wav", encoded, bitrate)
            values = loudness(encoded)
            decoded, stream = read_wav(encoded)
            codec_silences = []
            for start, end in SILENCES:
                # AAC is transform-coded: distinguish boundary ringing from the interior.
                interior = decoded[round((start + 0.06) * SR):round((end - 0.06) * SR)]
                codec_silences.append({"start": start + 0.06, "end": end - 0.06,
                                       "peak_dbfs": dbfs(np.max(np.abs(interior)))})
            aac_report[bitrate] = {"codec": stream["codec_name"], "bitrate": bitrate,
                                   **values, "sample_rate": int(stream["sample_rate"]),
                                   "channels": int(stream["channels"]),
                                   "container_duration_seconds": float(stream["duration"]),
                                   "decoded_frames_including_codec_padding": len(decoded),
                                   "silence_interiors": codec_silences, "retained": False}
            checks[f"aac_{bitrate}_loudness_within_0_3_lu"] = abs(values["integrated_lufs"] - TARGET_LUFS) <= 0.3
            checks[f"aac_{bitrate}_true_peak_at_most_minus1"] = values["true_peak_dbtp"] <= DELIVERY_TP_MAX
            checks[f"aac_{bitrate}_stereo_48khz"] = int(stream["sample_rate"]) == SR and int(stream["channels"]) == 2
            checks[f"aac_{bitrate}_silence_interiors_below_minus90"] = all(item["peak_dbfs"] < -90 for item in codec_silences)

    checks["license_matches_original_synthesis_declaration"] = (PUBLIC / "LICENSE.md").read_text(encoding="utf-8") == LICENSE
    checks["only_requested_files_in_audio_folder"] = {path.name for path in PUBLIC.iterdir()} == {
        "music.wav", "sfx.wav", "mix.wav", "LICENSE.md"}
    if mastering is None and REPORT.exists():
        previous = json.loads(REPORT.read_text(encoding="utf-8"))
        # Preserve mastering history only when it belongs to these exact deliverables.
        if all(previous.get("files", {}).get(name, {}).get("sha256") == info["sha256"]
               for name, info in measurements.items()):
            mastering = previous.get("mastering")
    report = {
        "title": "WHEN UI ESCAPES THE SCREEN", "passed": all(checks.values()),
        "duration_seconds": DURATION, "sample_rate": SR, "channels": 2, "frames": FRAMES,
        "integrated_lufs": pcm["integrated_lufs"], "true_peak_dbtp": pcm["true_peak_dbtp"],
        "target_lufs": TARGET_LUFS, "wav_true_peak_target_dbtp": WAV_TP_TARGET,
        "maximum_delivery_true_peak_dbtp": DELIVERY_TP_MAX,
        "files": measurements, "aac": aac_report, "silences": silence_results,
        "stem_sum_max_absolute_residual": residual, "cues": cue_results,
        "tempo": {"bpm": BPM, "groove_start": 11, "groove_end": 16,
                  "acceleration": "Progressively denser eighth/sixteenth-note subdivisions at a fixed 112 BPM"},
        "provenance": {"original_procedural_synthesis": True, "seed": SEED,
                       "external_samples": False, "network_used": False,
                       "vocals_or_speech": False, "license": "CC0-1.0"},
        "mastering": mastering,
        "measurement": "FFmpeg loudnorm EBU R128 integrated LUFS and oversampled true peak on final WAVs and decoded temporary AAC; FFprobe format and sample decoding checks",
        "tools": {"ffmpeg": run(["ffmpeg", "-version"]).stdout.decode(errors="replace").splitlines()[0],
                  "numpy": np.__version__},
        "limitations": [
            "Audio-only delivery: no composition, visual timing, or final mux was edited or rendered.",
            "No human listening-room audition was performed; sonic quality and picture sync still need an editorial listening pass.",
            "Digital silence is sample-exact in PCM; AAC may ring within about one transform window at silence boundaries and may append codec padding.",
            "AAC QC covers FFmpeg AAC at 192 and 320 kb/s, not every encoder, bitrate, or downstream platform transcode.",
            "Stems share the mix's linked mastering gain; only the summed mix is targeted to -14 LUFS."
        ],
        "checks": checks,
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"passed": report["passed"], "duration_seconds": DURATION,
                      "frames": FRAMES, "sample_rate": SR, "channels": 2,
                      "integrated_lufs": pcm["integrated_lufs"], "true_peak_dbtp": pcm["true_peak_dbtp"],
                      "aac": aac_report, "checks_passed": sum(checks.values()),
                      "checks_total": len(checks),
                      "failed_checks": [name for name, passed in checks.items() if not passed],
                      "report": str(REPORT)}, indent=2))
    if not report["passed"]:
        raise RuntimeError(f"Audio verification failed; inspect {REPORT}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--verify", action="store_true", help="measure existing deliverables without resynthesis")
    args = parser.parse_args()
    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            raise RuntimeError(f"Installed {tool} is required; no package changes are made")
    mastering = None
    if not args.verify:
        PUBLIC.mkdir(parents=True, exist_ok=True)
        (PUBLIC / "LICENSE.md").write_text(LICENSE, encoding="utf-8")
        with tempfile.TemporaryDirectory(prefix="ui-escapes-audio-") as temp:
            mastering = master(synthesize(), Path(temp))
    verify(mastering)


if __name__ == "__main__":
    main()
