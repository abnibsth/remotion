"""Synthesize the original 20-second EVERYTHING IS MOTION score.

No samples, sound libraries, or input media: only seeded NumPy oscillators/noise.
Run: python scripts/everything/audio.py
Requires NumPy, ffmpeg and ffprobe on PATH. Output is stereo 48 kHz PCM24.
"""
from __future__ import annotations

import json
import math
from pathlib import Path
import subprocess
import tempfile
import wave

import numpy as np

SR = 48_000
DURATION = 20.0
FRAMES = int(SR * DURATION)
ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "public" / "everything-is-motion" / "audio"
RNG = np.random.default_rng(461903)
EVENTS = [
    (0.0, "pulse"), (1.2, "stretch"), (3.65, "ring closure"),
    (4.5, "swell"), (6.0, "peel"), (7.5, "ribbon whoosh left"),
    (8.5, "ribbon whoosh right"), (9.35, "MOVE impact"),
    (10.55, "EVERYTHING"), (11.45, "IS MOTION"), (12.3, "liquid"),
    (15.3, "collapse"), (17.3, "shock"), (18.2, "return"),
]


def clock(seconds: float) -> np.ndarray:
    return np.arange(round(seconds * SR), dtype=np.float64) / SR


def envelope(t: np.ndarray, attack: float, release: float, decay: float = 0.0) -> np.ndarray:
    """Cosine edges keep even percussion free of sample discontinuities."""
    end = (len(t) - 1) / SR
    up = np.sin(np.clip(t / attack, 0, 1) * np.pi / 2) ** 2
    down = np.sin(np.clip((end - t) / release, 0, 1) * np.pi / 2) ** 2
    return up * down * np.exp(-decay * t)


def noise(seconds: float, low: float, high: float) -> np.ndarray:
    """Seeded, gently band-limited noise; no external recordings."""
    n = round(seconds * SR)
    bins = np.fft.rfftfreq(n, 1 / SR)
    spectrum = np.fft.rfft(RNG.normal(size=n))
    shape = (1 - np.exp(-(bins / max(low, 1)) ** 4)) * np.exp(-(bins / high) ** 4)
    signal = np.fft.irfft(spectrum * shape, n=n)
    return signal / max(np.std(signal), 1e-9)


def add(mix: np.ndarray, signal: np.ndarray, at: float, gain: float, pan: float = 0.0) -> None:
    """Equal-power pan; sub-bass is always centered."""
    start = round(at * SR)
    skip = max(0, -start)
    start = max(start, 0)
    count = min(len(signal) - skip, FRAMES - start)
    if count <= 0:
        return
    s = signal[skip:skip + count] * gain
    angle = (pan + 1) * np.pi / 4
    mix[start:start + count, 0] += s * np.cos(angle)
    mix[start:start + count, 1] += s * np.sin(angle)


def pitched(freq: float, duration: float, softness: float = 0.008) -> np.ndarray:
    t = clock(duration)
    # A tiny inharmonic FM bloom becomes a clean, rounded sine tail.
    modulation = 1.15 * np.exp(-t * 10) * np.sin(2 * np.pi * freq * 2.003 * t)
    tone = np.sin(2 * np.pi * freq * t + modulation)
    tone += 0.13 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 5)
    return tone * envelope(t, softness, min(0.22, duration / 3), 2.7)


def note(mix: np.ndarray, at: float, freq: float, gain: float, pan: float = 0.0,
         duration: float = 1.25, echoes: bool = True) -> None:
    sound = pitched(freq, duration)
    add(mix, sound, at, gain, pan)
    if echoes:
        add(mix, sound, at + 0.234, gain * 0.22, -pan * 0.8)
        add(mix, sound, at + 0.469, gain * 0.10, pan * 0.5)


def bass(mix: np.ndarray, at: float, freq: float = 36.7081, gain: float = 0.25,
         duration: float = 0.9) -> None:
    t = clock(duration)
    # Small second/third harmonics remain audible without oversized cinema booms.
    phase = 2 * np.pi * (freq * t + 0.45 * (1 - np.exp(-t * 12)))
    sound = np.sin(phase) + 0.23 * np.sin(2 * phase) + 0.07 * np.sin(3 * phase)
    add(mix, sound * envelope(t, 0.024, 0.19, 1.35), at, gain)


def tick(mix: np.ndarray, at: float, gain: float, pan: float, wood: bool = False) -> None:
    duration = 0.16 if wood else 0.075
    t = clock(duration)
    sound = noise(duration, 650 if wood else 3600, 3400 if wood else 9800)
    if wood:
        sound = sound * 0.23 + np.sin(2 * np.pi * 740 * t + 0.8 * np.exp(-t * 50)) * 0.65
    add(mix, sound * envelope(t, 0.0025, 0.025, 42 if wood else 65), at, gain, pan)


def whoosh(mix: np.ndarray, at: float, duration: float, gain: float,
           direction: float = 1.0, descending: bool = False) -> None:
    t = clock(duration)
    u = t / duration
    source = noise(duration, 450, 6200)
    # Amplitude/frequency-modulated air, with a moving narrow tonal filament.
    freq = 1100 * (1.0 - 0.75 * u) if descending else 340 + 1600 * u ** 1.7
    filament = np.sin(2 * np.pi * np.cumsum(freq) / SR)
    shaped = (source * 0.32 + filament * 0.075) * np.sin(np.pi * u) ** 2
    pan = direction * (u * 1.6 - 0.8)
    start = round(at * SR)
    count = min(len(t), FRAMES - start)
    angle = (pan[:count] + 1) * np.pi / 4
    mix[start:start + count, 0] += shaped[:count] * np.cos(angle) * gain
    mix[start:start + count, 1] += shaped[:count] * np.sin(angle) * gain


def synthesize() -> np.ndarray:
    mix = np.zeros((FRAMES, 2), dtype=np.float64)
    t = clock(DURATION)

    # A quiet breathing harmonic field: D minor/add9, no maximalist chord stacks.
    activity = np.interp(t, [0, 3.5, 6, 9, 10.5, 12, 14.5, 15.3, 17, 18.2, 20],
                         [0.32, 0.42, 0.56, 0.70, 1.0, 0.9, 0.55, 0.22, 0.12, 0.45, 0.24])
    for freq, gain, pan in [(146.8324, 0.037, -0.45), (220.0, 0.029, 0.42),
                             (329.6276, 0.016, -0.2), (349.2282, 0.011, 0.3)]:
        tone = np.sin(2 * np.pi * freq * t + 0.2 * np.sin(2 * np.pi * 0.11 * t))
        tone += 0.3 * np.sin(2 * np.pi * freq * 1.0016 * t)
        add(mix, tone * activity * (0.82 + 0.18 * np.cos(2 * np.pi * 0.2 * t)), 0, gain, pan)
    for pan in [-0.85, 0.85]:
        air = noise(DURATION, 1700, 7200)
        breath = (0.65 + 0.35 * np.sin(2 * np.pi * 0.4 * t + pan)) ** 2
        add(mix, air * breath * activity, 0, 0.012, pan)

    # The pulse is gentle at the loop boundary; density, not huge hits, builds the climax.
    bass_events = [(0, 0.25, 36.7081), (1.2, 0.18, 36.7081), (2.5, 0.19, 36.7081),
                   (3.65, 0.20, 55), (4.5, 0.22, 36.7081), (5.75, 0.17, 36.7081),
                   (6.6, 0.19, 48.9994), (7.5, 0.22, 48.9994), (8.5, 0.23, 55),
                   (9.35, 0.38, 36.7081), (9.975, 0.23, 36.7081),
                   (10.55, 0.31, 55), (11.175, 0.24, 55), (11.45, 0.32, 36.7081),
                   (12.3, 0.22, 36.7081), (13.55, 0.18, 36.7081),
                   (14.8, 0.16, 48.9994), (15.3, 0.17, 36.7081),
                   (17.3, 0.22, 36.7081), (18.2, 0.22, 36.7081), (19.0, 0.13, 36.7081)]
    for at, gain, freq in bass_events:
        bass(mix, at, freq, gain)

    for at, freq, gain, pan in [
        (0.12, 293.6648, 0.10, -0.3), (1.2, 440, 0.09, 0.4),
        (2.0, 329.6276, 0.075, 0.1), (2.8, 220, 0.08, -0.45),
        (3.65, 587.3295, 0.13, 0.3), (4.5, 293.6648, 0.11, -0.3),
        (5.125, 440, 0.10, 0.4), (6.0, 349.2282, 0.11, 0.55),
        (6.625, 329.6276, 0.095, -0.4), (7.5, 293.6648, 0.10, -0.3),
        (8.125, 440, 0.11, 0.35), (8.75, 587.3295, 0.12, -0.25),
        (9.35, 293.6648, 0.19, -0.25), (9.6625, 440, 0.13, 0.35),
        (9.975, 587.3295, 0.14, -0.3), (10.2875, 659.2551, 0.10, 0.3),
        (10.55, 440, 0.17, 0.25), (10.8625, 587.3295, 0.14, -0.35),
        (11.175, 659.2551, 0.12, 0.3), (11.45, 349.2282, 0.17, -0.2),
        (11.7625, 440, 0.13, 0.35), (12.075, 587.3295, 0.10, -0.2),
        (13.0, 329.6276, 0.08, -0.4), (13.8, 440, 0.075, 0.4),
        (14.5, 293.6648, 0.08, -0.2), (18.2, 293.6648, 0.12, -0.3),
        (18.825, 440, 0.08, 0.3), (19.2, 329.6276, 0.055, -0.15),
    ]:
        note(mix, at, freq, gain, pan)

    for i, at in enumerate(np.arange(0.625, 15.0, 0.625)):
        climax = 9 <= at <= 12
        tick(mix, float(at), 0.11 if climax else 0.065, (-1 if i % 2 else 1) * 0.43,
             wood=i % 2 == 1)
        if climax:
            tick(mix, float(at + 0.3125), 0.047, (-1 if i % 2 else 1) * 0.65)

    # Stretch: elastic pitch tension, not an orchestral riser.
    st = clock(1.35)
    freq = 146.8324 + 73.4162 * np.sin(np.pi * st / 2.7)
    stretch = np.sin(2 * np.pi * np.cumsum(freq) / SR)
    add(mix, stretch * envelope(st, 0.09, 0.36, 0.8), 1.2, 0.075, -0.25)

    # Ring closure: a pair of near-pure resonances with short spatial reflections.
    rt = clock(1.7)
    ring = (np.sin(2 * np.pi * 880 * rt) + 0.32 * np.sin(2 * np.pi * 1322 * rt))
    ring *= envelope(rt, 0.006, 0.3, 3.8)
    add(mix, ring, 3.65, 0.10, 0.25)
    add(mix, ring, 3.79, 0.025, -0.6)

    whoosh(mix, 4.5, 1.6, 0.065, -1)
    whoosh(mix, 6.0, 0.68, 0.10, 1, descending=True)
    whoosh(mix, 7.5, 0.88, 0.115, 1)
    whoosh(mix, 8.5, 0.72, 0.135, -1)

    # Typographic locks: tactile, short synth/wood hits, not trailer explosions.
    for at, gain in [(9.35, 0.20), (10.55, 0.14), (11.45, 0.16)]:
        tick(mix, at, gain, 0.0, wood=True)
        hit_t = clock(0.42)
        hit = np.sin(2 * np.pi * (92 * hit_t + 2.4 * (1 - np.exp(-hit_t * 24))))
        add(mix, hit * envelope(hit_t, 0.004, 0.15, 8), at, gain * 0.65)
        whoosh(mix, at + 0.025, 0.40, 0.065, 1)

    # Liquid surface: seeded little downward chirps, pitch-continuous and stereo.
    for i in range(19):
        at = 12.3 + i * 0.105 + float(RNG.uniform(0, 0.045))
        if i == 0:
            at = 12.3
        length = float(RNG.uniform(0.15, 0.33))
        lt = clock(length)
        f = float(RNG.uniform(650, 1350)) * np.exp(-lt * 5) + 170
        drop = np.sin(2 * np.pi * np.cumsum(f) / SR)
        add(mix, drop * envelope(lt, 0.003, 0.06, 10), at,
            0.045 if i else 0.09, float(RNG.uniform(-0.7, 0.7)))

    # Collapse winds inward and thins to negative space before the restrained shock.
    ct = clock(0.85)
    f = 293.6648 * np.exp(-ct * 2.8)
    collapse = np.sin(2 * np.pi * np.cumsum(f) / SR)
    add(mix, collapse * envelope(ct, 0.006, 0.25, 2), 15.3, 0.13)
    whoosh(mix, 15.3, 0.90, 0.10, -1, descending=True)
    tick(mix, 17.3, 0.19, 0, wood=True)
    note(mix, 17.3, 880, 0.09, 0.1, duration=0.55, echoes=False)
    whoosh(mix, 18.2, 0.9, 0.065, 1)

    # A deliberate quiet seam: pulse starts at t=0 but ramps, with no boundary hit.
    seam = envelope(t, 0.18, 0.70)
    mix *= seam[:, None]
    mix = 0.72 * np.tanh(mix / 0.72)  # gentle synth-bus saturation, never hard clipping
    mix[0] = mix[-1] = 0
    return mix


def write_pcm24(path: Path, samples: np.ndarray) -> None:
    values = np.rint(np.clip(samples, -1, 1 - 2 ** -23) * (2 ** 23)).astype(np.int32)
    packed = np.stack([values & 255, (values >> 8) & 255, (values >> 16) & 255], axis=-1)
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(3)
        wav.setframerate(SR)
        wav.writeframes(packed.astype(np.uint8).tobytes())


def run(*args: str) -> subprocess.CompletedProcess:
    return subprocess.run(args, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def loudness(path: Path) -> dict:
    result = run("ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af",
                 "loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json", "-f", "null", "-")
    text = result.stderr.decode("utf-8", errors="replace")
    return json.loads(text[text.rfind("{"):text.rfind("}") + 1])


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    target = OUTPUT / "soundscape.wav"
    with tempfile.TemporaryDirectory(prefix="synthesis-", dir=OUTPUT) as directory:
        temp = Path(directory)
        raw = temp / "original.wav"
        write_pcm24(raw, synthesize())
        measured = loudness(raw)
        normalization = (
            "loudnorm=I=-14:TP=-1.5:LRA=9:"
            f"measured_I={measured['input_i']}:measured_TP={measured['input_tp']}:"
            f"measured_LRA={measured['input_lra']}:measured_thresh={measured['input_thresh']}:"
            f"offset={measured['target_offset']}:linear=true:print_format=json"
        )
        run("ffmpeg", "-hide_banner", "-nostats", "-y", "-i", str(raw), "-af", normalization,
            "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s24le", "-t", "20", str(target))

        # The normalizer resamples internally. Enforce exact frame count and zero
        # endpoints in PCM, then measure this actual deliverable (not the source).
        # Decode through ffmpeg: Python <3.12 wave cannot read its extensible
        # PCM24 WAV header. Rewrap with stdlib wave for broad compatibility.
        decoded_pcm = run("ffmpeg", "-v", "error", "-i", str(target),
                          "-f", "s24le", "-acodec", "pcm_s24le", "-")
        pcm = bytearray(decoded_pcm.stdout)
        assert len(pcm) == FRAMES * 2 * 3
        pcm[:6] = pcm[-6:] = bytes(6)
        with wave.open(str(target), "wb") as wav:
            wav.setnchannels(2)
            wav.setsampwidth(3)
            wav.setframerate(SR)
            wav.writeframes(pcm)

        final = loudness(target)
        decoded = run("ffmpeg", "-v", "error", "-i", str(target), "-f", "f32le", "-")
        samples = np.frombuffer(decoded.stdout, dtype="<f4").reshape(-1, 2)
        assert samples.shape == (FRAMES, 2)
        assert np.all(samples[0] == 0) and np.all(samples[-1] == 0)
        assert abs(float(final["input_i"]) + 14) <= 0.25, final
        assert float(final["input_tp"]) <= -1.0, final

        # AAC is not delivered, but test the usual film encode for headroom.
        aac = temp / "headroom-check.m4a"
        run("ffmpeg", "-v", "error", "-y", "-i", str(target), "-c:a", "aac", "-b:a", "320k", str(aac))
        aac_measured = loudness(aac)
        probe = json.loads(run("ffprobe", "-v", "error", "-show_streams", "-show_format",
                               "-of", "json", str(target)).stdout)
        def rms_db(x: np.ndarray) -> float:
            return round(20 * math.log10(max(float(np.sqrt(np.mean(x ** 2))), 1e-12)), 2)
        report = {
            "file": "public/everything-is-motion/audio/soundscape.wav",
            "original_synthesis": True,
            "seed": 461903,
            "duration_seconds": DURATION,
            "sample_rate": SR,
            "channels": 2,
            "bit_depth": 24,
            "frames": FRAMES,
            "integrated_lufs": float(final["input_i"]),
            "true_peak_dbtp": float(final["input_tp"]),
            "loudness_range_lu": float(final["input_lra"]),
            "aac_320k_integrated_lufs": float(aac_measured["input_i"]),
            "aac_320k_true_peak_dbtp": float(aac_measured["input_tp"]),
            "first_sample": samples[0].tolist(),
            "last_sample": samples[-1].tolist(),
            "first_50ms_rms_dbfs": rms_db(samples[:2400]),
            "last_50ms_rms_dbfs": rms_db(samples[-2400:]),
            "sample_peak_dbfs": round(20 * math.log10(float(np.max(np.abs(samples)))), 2),
            "normalization": "two-pass ffmpeg loudnorm, I=-14, TP=-1.5, LRA=9",
            "events": [{"seconds": at, "event": label} for at, label in EVENTS],
            "ffprobe": probe,
        }
        (OUTPUT / "analysis.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
        print(json.dumps({k: v for k, v in report.items() if k not in {"events", "ffprobe"}}, indent=2))


if __name__ == "__main__":
    main()
