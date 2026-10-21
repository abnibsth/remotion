"""Original, voice-free 25 s electronic score for Motion Card Listicle.

Run from any directory: python -I scripts/motion-card-listicle/audio.py
NumPy is optional; the stdlib fallback synthesizes the same arrangement.
Requires ffmpeg and ffprobe on PATH. No samples, downloads, or input media.
Delivers 48 kHz stereo PCM24, verified after two-pass EBU R128 loudnorm.
"""
from __future__ import annotations

from array import array
import json
import math
from pathlib import Path
import random
import shutil
import subprocess
import sys
import tempfile
import wave

try:
    import numpy as np
except ImportError:
    np = None

SR = 48_000
DURATION = 25.0
FRAMES = int(SR * DURATION)
SEED = 1202508
BPM = 120
ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "public" / "motion-card-listicle" / "audio"
REPORT = ROOT / "out" / "motion-card-listicle" / "audio-measurements.json"
EVENTS = [
    (0.08, "opening tactile click"),
    *[(t, "opening card assembly") for t in (0.45, 0.65, 0.85, 1.05, 1.25)],
    (2.5, "easing rounded pluck"),
    (3.2, "comparison starts: straight motion"),
    (4.5, "comparison: eased motion"), (5.8, "comparison settles"),
    (6.1, "circle rise"), (7.4, "anticipation pull"),
    (7.85, "first launch"), (9.3, "second launch"),
    *[(t, "squash impact") for t in (11.65, 12.55, 13.22, 13.35)],
    (14.5, "unfold"), (16.0, "follow-through stop"),
    (17.4, "follow-through settle"), (18.1, "short ribbon brush"),
    (19.2, "timing: fast ticks"), (19.8, "timing: balanced ticks"),
    (20.7, "timing: slow ticks"), (22.35, "timing converges"),
    *[(t, "final card assembly") for t in (22.6, 22.78, 22.96, 23.14, 23.32)],
    (23.5, "warm C major nine resolve"),
]


def midi(note: int) -> float:
    return 440.0 * 2 ** ((note - 69) / 12)


def sound(duration: float, frequency: float, *, end_frequency: float | None = None,
          attack: float = 0.008, release: float = 0.12, decay: float = 2.8,
          harmonics: float = 0.12, noise: float = 0.0, seed: int = SEED):
    """Rounded oscillator and optional soft, low-pass noise, with cosine edges."""
    count = max(2, round(duration * SR))
    end_frequency = frequency if end_frequency is None else end_frequency
    slope = (end_frequency - frequency) / duration
    if np is not None:
        t = np.arange(count, dtype=np.float64) / SR
        phase = 2 * math.pi * (frequency * t + 0.5 * slope * t * t)
        signal = np.sin(phase) + harmonics * np.sin(2 * phase)
        if noise:
            rng = np.random.default_rng(seed)
            # A compact moving average keeps ticks papery rather than piercing.
            source = rng.uniform(-1, 1, count + 5)
            smoothed = np.convolve(source, np.ones(6) / 6, mode="valid")
            signal += noise * smoothed[:count]
        up = np.sin(np.minimum(t / attack, 1) * math.pi / 2) ** 2
        down = np.sin(np.clip(((count - 1) / SR - t) / release, 0, 1) * math.pi / 2) ** 2
        return signal * up * down * np.exp(-decay * t)
    rng = random.Random(seed)
    history = [rng.uniform(-1, 1) for _ in range(6)]
    result = array("d")
    for i in range(count):
        t = i / SR
        phase = 2 * math.pi * (frequency * t + 0.5 * slope * t * t)
        value = math.sin(phase) + harmonics * math.sin(2 * phase)
        if noise:
            history[i % 6] = rng.uniform(-1, 1)
            value += noise * sum(history) / 6
        up = math.sin(min(t / attack, 1) * math.pi / 2) ** 2
        down = math.sin(min(max((count - 1 - i) / SR / release, 0), 1) * math.pi / 2) ** 2
        result.append(value * up * down * math.exp(-decay * t))
    return result


def add(mix, signal, at: float, gain: float, pan: float = 0.0) -> None:
    """Equal-power panning, centered bass, and sample-accurate event positions."""
    start = round(at * SR)
    skip = max(0, -start)
    start = max(0, start)
    count = min(len(signal) - skip, FRAMES - start)
    if count <= 0:
        return
    angle = (pan + 1) * math.pi / 4
    left, right = gain * math.cos(angle), gain * math.sin(angle)
    if np is not None:
        source = signal[skip:skip + count]
        mix[start:start + count, 0] += source * left
        mix[start:start + count, 1] += source * right
    else:
        for i in range(count):
            value = signal[skip + i]
            index = (start + i) * 2
            mix[index] += value * left
            mix[index + 1] += value * right


def tick(mix, at: float, gain: float = 0.038, pan: float = 0.0,
         pitch: float = 790.0) -> None:
    add(mix, sound(0.085, pitch, end_frequency=pitch * 0.86,
                   attack=0.0018, release=0.025, decay=58,
                   harmonics=0.08, noise=0.65, seed=SEED + round(at * SR)), at, gain, pan)


def pluck(mix, at: float, note: int, gain: float = 0.065, pan: float = 0.0,
          duration: float = 0.8, echo: bool = True) -> None:
    source = sound(duration, midi(note), decay=3.8, release=0.20, harmonics=0.18)
    add(mix, source, at, gain, pan)
    if echo:
        add(mix, source, at + 0.25, gain * 0.13, -pan)


def glide(mix, at: float, duration: float, start: float, end: float,
          gain: float = 0.038, pan: float = 0.0) -> None:
    # Tonal gestures, not broadband cinematic whooshes.
    add(mix, sound(duration, start, end_frequency=end, attack=0.035,
                   release=min(0.12, duration / 3), decay=1.5, harmonics=0.04), at, gain, pan)


def synthesize():
    mix = np.zeros((FRAMES, 2), dtype=np.float64) if np is not None else array("d", [0.0]) * (FRAMES * 2)
    # Cmaj9 / Am7 / Fmaj9 / Gsus / Cmaj9: original sparse warm harmony.
    chords = [
        (0.12, 6.0, (48, 55, 59, 62), 0.048),
        (6.0, 5.5, (45, 52, 55, 60), 0.049),
        (11.5, 4.5, (41, 48, 55, 57), 0.047),
        (16.0, 3.0, (43, 50, 55, 60), 0.031),
        (19.0, 4.5, (43, 50, 57, 60), 0.045),
        (23.5, 1.5, (48, 55, 59, 62, 64), 0.052),
    ]
    for at, duration, notes, gain in chords:
        for i, note in enumerate(notes):
            pan = (-0.5, 0.35, -0.25, 0.55, 0.0)[i]
            add(mix, sound(duration, midi(note), attack=0.30, release=0.55,
                           decay=0.10, harmonics=0.09), at, gain, pan)

    # Half-second grid = 120 BPM; leave space, no full-time hats or heavy drums.
    for beat in range(1, 47):
        at = beat * 0.5
        if 15.5 <= at < 17.5:
            continue
        section = 0 if at < 6 else 1 if at < 11.5 else 2 if at < 16 else 3
        root = (36, 33, 29, 31)[section]
        if beat % 2 == 0:
            add(mix, sound(0.75, midi(root), attack=0.025, release=0.18,
                           decay=2.1, harmonics=0.24), at, 0.135)
        if beat % 4 in (0, 2):
            # Soft short kick, no aggressive sub-drop or oversized transient.
            add(mix, sound(0.16, 79, end_frequency=44, attack=0.004,
                           release=0.07, decay=18, harmonics=0.04), at, 0.074)
        if beat % 4 == 3:
            tick(mix, at, gain=0.018, pan=-0.28 if beat % 8 == 3 else 0.28, pitch=520)
        if beat % 4 == 1:
            notes = ((64, 67, 62), (60, 64, 67), (57, 60, 67), (62, 67, 69))[section]
            pluck(mix, at, notes[(beat // 4) % 3], 0.050,
                  -0.32 if beat % 8 == 1 else 0.32)

    tick(mix, 0.08, 0.040, pitch=930)
    for i, at in enumerate((0.45, 0.65, 0.85, 1.05, 1.25)):
        tick(mix, at, 0.033, -0.32 + i * 0.16, 650 + i * 75)
    pluck(mix, 2.5, 67, 0.055, 0.24)
    # A/B: even dry ticks versus a gently decelerating, rounder figure.
    for i, at in enumerate((3.2, 3.7, 4.2)):
        tick(mix, at, 0.024, -0.35, 720)
    for at, pitch in ((4.5, 784), (4.78, 740), (5.18, 698), (5.8, 659)):
        tick(mix, at, 0.026, 0.35, pitch)
    glide(mix, 6.1, 0.48, 220, 440, 0.036, 0.12)
    # Pull dips before each launch; the second pull is a softer response.
    glide(mix, 7.4, 0.43, 220, 155, 0.032, -0.25)
    glide(mix, 7.85, 0.24, 220, 660, 0.043, 0.30)
    tick(mix, 7.85, 0.030, 0.2, 610)
    glide(mix, 9.08, 0.28, 196, 147, 0.023, 0.25)
    glide(mix, 9.3, 0.27, 196, 588, 0.039, -0.30)
    for i, at in enumerate((11.65, 12.55, 13.22, 13.35)):
        gain = (0.068, 0.060, 0.050, 0.042)[i]
        add(mix, sound(0.26, 155 - i * 10, end_frequency=83 + i * 6,
                       attack=0.003, release=0.09, decay=12, harmonics=0.19), at, gain)
        tick(mix, at, gain * 0.38, (-1) ** i * 0.18, 640)
    for i, note in enumerate((60, 64, 67)):
        pluck(mix, 14.5 + i * 0.075, note, 0.038, -0.28 + i * 0.28)
    tick(mix, 16.0, 0.035, pitch=520)
    for at, gain, pitch in ((16.18, 0.020, 490), (16.47, 0.013, 460), (17.4, 0.023, 440)):
        tick(mix, at, gain, 0.15, pitch)
    # Only one brief noise brush in the whole soundtrack, tied to the ribbon.
    add(mix, sound(0.28, 880, end_frequency=660, attack=0.065,
                   release=0.13, decay=3, harmonics=0, noise=2.0), 18.1, 0.015, 0.35)
    for base, offsets, gain, pan in (
        (19.2, (0, 0.10, 0.20, 0.30), 0.024, -0.40),
        (19.8, (0, 0.25, 0.50), 0.027, 0.0),
        (20.7, (0, 0.48, 0.96), 0.027, 0.40),
    ):
        for offset in offsets:
            tick(mix, base + offset, gain, pan, 760)
    pluck(mix, 22.35, 67, 0.047, duration=0.55, echo=False)
    tick(mix, 22.35, 0.027, pitch=820)
    for i, at in enumerate((22.6, 22.78, 22.96, 23.14, 23.32)):
        tick(mix, at, 0.031, -0.30 + i * 0.15, 700 + i * 65)
    add(mix, sound(1.45, midi(36), attack=0.045, release=0.6,
                   decay=1.1, harmonics=0.19), 23.5, 0.12)
    for note, pan in ((64, -0.22), (67, 0.22), (74, 0.0)):
        pluck(mix, 23.5, note, 0.042, pan, duration=1.45, echo=False)

    # Gentle bus saturation and a clean ending; no discontinuous edit points.
    if np is not None:
        t = np.arange(FRAMES) / SR
        edge = np.sin(np.minimum(t / 0.025, 1) * math.pi / 2) ** 2
        edge *= np.sin(np.minimum((DURATION - 1 / SR - t) / 0.48, 1) * math.pi / 2) ** 2
        mix = 0.65 * np.tanh(mix / 0.65) * edge[:, None]
        mix[0] = mix[-1] = 0
    else:
        for i in range(FRAMES):
            up = math.sin(min(i / SR / 0.025, 1) * math.pi / 2) ** 2
            down = math.sin(min((FRAMES - 1 - i) / SR / 0.48, 1) * math.pi / 2) ** 2
            for ch in (0, 1):
                index = 2 * i + ch
                mix[index] = 0.65 * math.tanh(mix[index] / 0.65) * up * down
        mix[0] = mix[1] = mix[-2] = mix[-1] = 0.0
    return mix


def write_pcm24(path: Path, samples) -> None:
    if np is not None:
        values = np.rint(np.clip(samples, -1, 1 - 2 ** -23) * 2 ** 23).astype(np.int32)
        pcm = np.stack((values & 255, (values >> 8) & 255, (values >> 16) & 255), axis=-1).astype(np.uint8).tobytes()
    else:
        pcm = bytearray(len(samples) * 3)
        for i, sample in enumerate(samples):
            value = round(max(-1, min(1 - 2 ** -23, sample)) * 2 ** 23)
            pcm[i * 3:i * 3 + 3] = (value & 0xFFFFFF).to_bytes(3, "little")
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(3)
        wav.setframerate(SR)
        wav.writeframes(pcm)


def run(*args: str) -> subprocess.CompletedProcess:
    result = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode:
        raise RuntimeError(f"{args[0]} failed ({result.returncode}):\n" + result.stderr.decode("utf-8", errors="replace"))
    return result


def measure(path: Path) -> dict:
    result = run("ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af",
                 "loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json", "-f", "null", "-")
    text = result.stderr.decode("utf-8", errors="replace")
    return json.loads(text[text.rfind("{"):text.rfind("}") + 1])


def dbfs(value: float) -> float:
    return round(20 * math.log10(max(value, 1e-12)), 4)


def main() -> None:
    for program in ("ffmpeg", "ffprobe"):
        if shutil.which(program) is None:
            raise SystemExit(f"Required executable not found on PATH: {program}")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    target = OUTPUT / "soundtrack.wav"
    with tempfile.TemporaryDirectory(prefix="original-score-", dir=OUTPUT) as directory:
        temp = Path(directory)
        source = temp / "synthesis.wav"
        write_pcm24(source, synthesize())
        first = measure(source)
        normalization = (
            "loudnorm=I=-14:TP=-1.5:LRA=9:"
            f"measured_I={first['input_i']}:measured_TP={first['input_tp']}:"
            f"measured_LRA={first['input_lra']}:measured_thresh={first['input_thresh']}:"
            f"offset={first['target_offset']}:linear=true:print_format=json"
        )
        normalized = temp / "normalized.wav"
        second = run("ffmpeg", "-hide_banner", "-nostats", "-y", "-i", str(source),
                     "-af", normalization, "-ar", str(SR), "-ac", "2",
                     "-c:a", "pcm_s24le", "-t", str(DURATION), str(normalized))
        text = second.stderr.decode("utf-8", errors="replace")
        second_pass = json.loads(text[text.rfind("{"):text.rfind("}") + 1])
        # Rewrap PCM24 with stdlib for pre-3.12 wave readers; exact 1,200,000 frames.
        pcm = bytearray(run("ffmpeg", "-v", "error", "-i", str(normalized),
                            "-f", "s24le", "-acodec", "pcm_s24le", "-").stdout)
        if len(pcm) != FRAMES * 6:
            raise RuntimeError(f"Wrong normalized PCM length: {len(pcm)}")
        pcm[:6] = pcm[-6:] = bytes(6)
        candidate = temp / "soundtrack.wav"
        with wave.open(str(candidate), "wb") as wav:
            wav.setnchannels(2)
            wav.setsampwidth(3)
            wav.setframerate(SR)
            wav.writeframes(pcm)
        final = measure(candidate)
        if not abs(float(final["input_i"]) + 14) <= 0.25:
            raise RuntimeError(f"Integrated loudness outside -14 +/-0.25 LUFS: {final}")
        if not float(final["input_tp"]) <= -1.0:
            raise RuntimeError(f"True peak exceeds -1 dBTP: {final}")
        decoded = run("ffmpeg", "-v", "error", "-i", str(candidate), "-f", "f32le", "-").stdout
        samples = array("f")
        samples.frombytes(decoded)
        if sys.byteorder != "little":
            samples.byteswap()
        if len(samples) != FRAMES * 2 or any(samples[i] != 0 for i in (0, 1, -2, -1)):
            raise RuntimeError("PCM frame count or zero endpoints check failed")
        def rms(values) -> float:
            return dbfs(math.sqrt(sum(float(x) ** 2 for x in values) / len(values)))
        probe = json.loads(run("ffprobe", "-v", "error", "-show_streams", "-show_format",
                               "-of", "json", str(candidate)).stdout)
        stream = probe["streams"][0]
        if (stream["sample_rate"], stream["channels"], stream["codec_name"]) != (str(SR), 2, "pcm_s24le"):
            raise RuntimeError(f"Unexpected delivery format: {stream}")
        # Confirm common delivery transcode also retains safe headroom.
        aac = temp / "headroom-check.m4a"
        run("ffmpeg", "-v", "error", "-y", "-i", str(candidate),
            "-c:a", "aac", "-b:a", "320k", str(aac))
        aac_measured = measure(aac)
        candidate.replace(target)
        probe["format"]["filename"] = str(target)
        report = {
            "file": "public/motion-card-listicle/audio/soundtrack.wav",
            "original_synthesis": True, "external_samples": False, "voice": False,
            "backend": "numpy" if np is not None else "stdlib", "seed": SEED,
            "bpm": BPM, "duration_seconds": DURATION, "sample_rate": SR,
            "channels": 2, "bit_depth": 24, "frames": FRAMES,
            "integrated_lufs": float(final["input_i"]),
            "true_peak_dbtp": float(final["input_tp"]),
            "loudness_range_lu": float(final["input_lra"]),
            "sample_peak_dbfs": dbfs(max(abs(x) for x in samples)),
            "first_sample": list(samples[:2]), "last_sample": list(samples[-2:]),
            "first_50ms_rms_dbfs": rms(samples[:4800]),
            "last_50ms_rms_dbfs": rms(samples[-4800:]),
            "aac_320k_integrated_lufs": float(aac_measured["input_i"]),
            "aac_320k_true_peak_dbtp": float(aac_measured["input_tp"]),
            "normalization": "two-pass ffmpeg loudnorm, I=-14, TP=-1.5, LRA=9",
            "source_measurement": first, "second_pass": second_pass,
            "final_measurement": final,
            "events": [{"seconds": at, "event": label} for at, label in EVENTS],
            "ffprobe": probe,
        }
        REPORT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
        print(json.dumps({k: v for k, v in report.items()
                          if k not in {"events", "ffprobe", "source_measurement", "second_pass", "final_measurement"}}, indent=2))


if __name__ == "__main__":
    main()
