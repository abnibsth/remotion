"""Original 30-second, voice-free score for Click a Link.

Run from any directory with Python + NumPy and ffmpeg/ffprobe on PATH.
All instruments and effects are synthesized here: no input media or samples.
Outputs only the PCM24 master and JSON measurements; AAC tests are temporary.
Arrangement: 114 BPM, restrained electronic documentary pulse, warm bass,
D minor/add9 through suspended harmony to a softly illuminated D major/add9.
"""
from __future__ import annotations

import json
import math
from pathlib import Path
import shutil
import subprocess
import tempfile
import wave

import numpy as np

SR = 48_000
DURATION = 30.0
FRAMES = round(SR * DURATION)
BPM = 114
BEAT = 60 / BPM
SEED = 1143017
ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "public" / "click-a-link" / "audio" / "soundtrack.wav"
REPORT = ROOT / "out" / "click-a-link" / "audio-measurements.json"
# Seconds, narrative cue, instrument, MIDI pitch, stereo pan, level.
EVENTS = [
    (0.7, "mouse click", "click", 83, -0.12, 0.095),
    (1.2, "low pulse", "pulse", 38, 0.0, 0.15),
    (3.35, "URL separation: protocol", "tick", 74, -0.30, 0.064),
    (3.7, "URL separation: host", "tick", 77, 0.0, 0.064),
    (4.05, "URL separation: path", "tick", 81, 0.30, 0.064),
    (6.65, "DNS query", "pluck", 74, -0.34, 0.074),
    (7.2, "DNS lookup one", "tick", 77, -0.08, 0.059),
    (7.65, "DNS lookup two", "tick", 81, 0.13, 0.059),
    (8.35, "DNS return", "pluck", 72, 0.34, 0.078),
    (10.65, "TCP SYN", "pulse", 50, -0.25, 0.095),
    (11.05, "TCP SYN-ACK", "pulse", 57, 0.25, 0.087),
    (11.4, "TCP ACK", "pulse", 62, 0.0, 0.087),
    (11.7, "TLS exchange one", "tick", 76, -0.20, 0.060),
    (12.0, "TLS exchange two", "tick", 79, 0.20, 0.060),
    (12.35, "TLS lock", "lock", 81, 0.0, 0.082),
    (14.5, "HTTP request", "tick", 74, -0.28, 0.070),
    (15.0, "request send", "pluck", 79, -0.38, 0.078),
    (16.65, "request arrival", "tick", 74, 0.35, 0.074),
    (17.4, "server processing", "pulse", 55, 0.12, 0.090),
    (18.6, "HTTP response", "pluck", 70, 0.32, 0.077),
    (19.1, "response returning", "pluck", 74, -0.32, 0.077),
    (20.6, "resource tick: HTML", "tick", 74, -0.30, 0.061),
    (21.1, "resource tick: CSS", "tick", 77, 0.0, 0.061),
    (21.6, "resource tick: JavaScript", "tick", 81, 0.30, 0.061),
    (22.1, "render: parse", "tick", 69, -0.34, 0.058),
    (22.65, "render: style", "tick", 73, -0.20, 0.058),
    (23.2, "render: layout", "tick", 76, -0.06, 0.061),
    (23.8, "render: paint", "pluck", 79, 0.10, 0.063),
    (24.45, "render: composite", "pluck", 81, 0.28, 0.067),
    (25.4, "page ready", "chime", 86, 0.0, 0.072),
    (27.6, "final reveal", "reveal", 81, 0.0, 0.077),
    (28.2, "final D major add9 resolve", "resolve", 74, 0.0, 0.076),
]


def midi(note: float) -> float:
    return 440 * 2 ** ((note - 69) / 12)


def tone(duration: float, frequency: float, *, attack: float = 0.006,
         release: float = 0.16, decay: float = 3.5, harmonic: float = 0.15,
         end: float | None = None, shimmer: float = 0.0) -> np.ndarray:
    t = np.arange(round(duration * SR), dtype=np.float64) / SR
    slope = 0.0 if end is None else (end - frequency) / duration
    phase = 2 * math.pi * (frequency * t + 0.5 * slope * t * t)
    signal = np.sin(phase) + harmonic * np.sin(2 * phase)
    signal += shimmer * np.sin(phase * 3.003) * np.exp(-2.2 * t)
    up = np.sin(np.minimum(t / attack, 1) * math.pi / 2) ** 2
    remaining = (len(t) - 1) / SR - t
    down = np.sin(np.clip(remaining / release, 0, 1) * math.pi / 2) ** 2
    return signal * up * down * np.exp(-decay * t)


def add(mix: np.ndarray, signal: np.ndarray, at: float, gain: float,
        pan: float = 0.0, echo: bool = False) -> None:
    start = round(at * SR)
    skip = max(0, -start)
    start = max(0, start)
    count = min(len(signal) - skip, FRAMES - start)
    if count <= 0:
        return
    angle = (pan + 1) * math.pi / 4
    mix[start:start + count, 0] += signal[skip:skip + count] * gain * math.cos(angle)
    mix[start:start + count, 1] += signal[skip:skip + count] * gain * math.sin(angle)
    if echo:
        # Tiny filtered tonal reflections, not a broadband whoosh or long wash.
        add(mix, signal, at + BEAT * 0.75, gain * 0.12, -pan)
        add(mix, signal, at + BEAT * 1.5, gain * 0.045, pan * 0.5)


def tactile(at: float, pitch: float, mouse: bool = False) -> np.ndarray:
    duration = 0.065 if mouse else 0.095
    t = np.arange(round(duration * SR)) / SR
    rng = np.random.default_rng(SEED + round(at * SR))
    raw = rng.uniform(-1, 1, len(t) + 7)
    papery = np.convolve(raw, np.ones(8) / 8, mode="valid")[:len(t)]
    signal = tone(duration, pitch, end=pitch * 0.73, attack=0.0007,
                  release=0.014, decay=85 if mouse else 48, harmonic=0.11)
    env = (1 - np.exp(-t * 6000)) * np.exp(-t * (160 if mouse else 95))
    signal += papery * env * (1.7 if mouse else 0.85)
    if mouse:
        # A close mechanical down/up pair, synthesized at the waveform level.
        delay = round(0.012 * SR)
        signal[delay:] += signal[:-delay].copy() * 0.27
    signal[0] = signal[-1] = 0.0
    return signal


# Overlapping, slowly breathed voicings; bass roots remain in the center.
CHORDS = [
    (0.08, 6.65, (50, 57, 60, 64, 69), 38),       # Dm9
    (6.3, 4.65, (50, 57, 60, 65, 69), 34),        # Bbmaj9
    (10.5, 4.15, (53, 57, 60, 64, 67), 41),       # Fmaj9
    (14.2, 4.6, (55, 60, 62, 65, 69), 36),        # C6/9sus
    (18.4, 4.0, (50, 57, 58, 65, 69), 31),        # Gm9
    (22.0, 3.65, (52, 55, 61, 64, 69), 33),       # A7(add9)
    (25.3, 3.12, (50, 57, 62, 64, 69), 38),       # Dsus2
    (28.2, 1.8, (50, 57, 61, 64, 66), 38),        # Dmaj9
]


def synthesize() -> np.ndarray:
    mix = np.zeros((FRAMES, 2), dtype=np.float64)
    for at, duration, notes, _ in CHORDS:
        for i, note in enumerate(notes):
            # Related but detuned sine partials create a narrow, warm synth pad.
            pan = (-0.48, 0.40, -0.27, 0.50, 0.10)[i]
            pad = tone(duration, midi(note) * (1 + (i - 2) * 0.00038),
                       attack=0.48, release=min(0.75, duration / 2),
                       decay=0.055, harmonic=0.055)
            t = np.arange(len(pad)) / SR
            pad *= 0.94 + 0.06 * np.cos(2 * math.pi * 0.22 * t + i)
            add(mix, pad, at, 0.041 if at < 28 else 0.047, pan)

    motif = (0, 7, 2, 9, 7, 2, 12, 9)
    for beat in range(2, 53):
        at = beat * BEAT
        section = max(i for i, chord in enumerate(CHORDS) if chord[0] <= at)
        root = CHORDS[section][3]
        # Half-time rounded bass, understated beat and generous negative space.
        if beat % 2 == 0:
            add(mix, tone(0.95, midi(root), attack=0.022, release=0.26,
                          decay=2.6, harmonic=0.29), at, 0.157)
        if beat % 4 == 0 and not 15.5 < at < 18.3:
            add(mix, tone(0.19, 76, end=45, attack=0.003,
                          release=0.075, decay=21, harmonic=0.03), at, 0.055)
        # The little two-bar motif evolves with the harmony, never a busy arp.
        if beat % 2 == 1 and not (14.2 < at < 18.4 or 22 < at < 25.3):
            interval = motif[(beat // 2) % len(motif)]
            note = root + 36 + interval
            while note > 86:
                note -= 12
            add(mix, tone(0.82, midi(note), decay=5.6, harmonic=0.13,
                          shimmer=0.045), at + BEAT / 2, 0.038,
                -0.26 if beat % 4 == 1 else 0.26, echo=True)

    for at, _, kind, note, pan, gain in EVENTS:
        if kind in {"click", "tick"}:
            add(mix, tactile(at, midi(note), mouse=kind == "click"), at, gain, pan)
        elif kind == "pulse":
            add(mix, tone(0.40 if note > 40 else 0.72, midi(note),
                          attack=0.004, release=0.14, decay=7.0,
                          harmonic=0.25), at, gain, pan)
            if note > 40:
                add(mix, tactile(at, midi(note + 24)), at, gain * 0.24, pan)
        elif kind in {"pluck", "chime", "lock"}:
            add(mix, tone(0.85 if kind == "pluck" else 1.15,
                          midi(note), attack=0.003, decay=5.0,
                          harmonic=0.11, shimmer=0.07), at, gain, pan, echo=True)
            if kind == "lock":
                add(mix, tactile(at, 900), at, gain * 0.53)
                add(mix, tone(0.65, midi(note - 12), decay=6), at, gain * 0.6)
            if kind == "chime":
                add(mix, tone(1.25, midi(note - 7), decay=3.5), at, gain * 0.48, -0.25)
        elif kind == "reveal":
            for i, interval in enumerate((-12, -5, 0, 2)):
                add(mix, tone(1.20, midi(note + interval), attack=0.09,
                              release=0.45, decay=1.9, harmonic=0.08),
                    at + i * 0.045, gain * 0.57, -0.30 + i * 0.20)
        elif kind == "resolve":
            add(mix, tone(1.8, midi(38), attack=0.025, release=0.6,
                          decay=1.0, harmonic=0.20), at, 0.15)
            for n, p in ((66, -0.28), (69, 0.28), (76, 0.0)):
                add(mix, tone(1.8, midi(n), decay=2.1, release=0.65,
                              harmonic=0.07), at, gain * 0.65, p)

    # Gentle saturation is timbral glue, not a hard limiter. Zero-ended master.
    t = np.arange(FRAMES) / SR
    envelope = np.sin(np.minimum(t / 0.045, 1) * math.pi / 2) ** 2
    envelope *= np.sin(np.clip((DURATION - 1 / SR - t) / 0.65, 0, 1) * math.pi / 2) ** 2
    mix = 0.72 * np.tanh(mix / 0.72) * envelope[:, None]
    mix[0] = mix[-1] = 0
    if not np.isfinite(mix).all():
        raise RuntimeError("Non-finite synthesized samples")
    return mix


def write_pcm24(path: Path, samples: np.ndarray) -> None:
    values = np.rint(np.clip(samples, -1, 1 - 2 ** -23) * 2 ** 23).astype(np.int32)
    packed = np.stack((values & 255, (values >> 8) & 255,
                       (values >> 16) & 255), axis=-1).astype(np.uint8).tobytes()
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(3)
        wav.setframerate(SR)
        wav.writeframes(packed)


def run(*args: str) -> subprocess.CompletedProcess:
    result = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode:
        raise RuntimeError(f"{args[0]} failed ({result.returncode}):\n" +
                           result.stderr.decode("utf-8", errors="replace"))
    return result


def parse_measurement(result: subprocess.CompletedProcess) -> dict:
    text = result.stderr.decode("utf-8", errors="replace")
    return json.loads(text[text.rfind("{"):text.rfind("}") + 1])


def measure(path: Path) -> dict:
    return parse_measurement(run("ffmpeg", "-hide_banner", "-nostats", "-i", str(path),
                                 "-af", "loudnorm=I=-14:TP=-1.8:LRA=9:print_format=json",
                                 "-f", "null", "-"))


def dbfs(value: float) -> float:
    return round(20 * math.log10(max(value, 1e-12)), 4)


def validate_loudness(measurement: dict, label: str) -> None:
    if abs(float(measurement["input_i"]) + 14) > 0.2:
        raise RuntimeError(f"{label} not -14 +/-0.2 LUFS: {measurement}")
    if float(measurement["input_tp"]) > -1:
        raise RuntimeError(f"{label} exceeds -1 dBTP: {measurement}")


def main() -> None:
    for executable in ("ffmpeg", "ffprobe"):
        if shutil.which(executable) is None:
            raise SystemExit(f"Required executable not on PATH: {executable}")
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="original-score-", dir=OUTPUT.parent) as directory:
        temp = Path(directory)
        source = temp / "synthesis.wav"
        write_pcm24(source, synthesize())
        first = measure(source)
        normalization = (
            "loudnorm=I=-14:TP=-1.8:LRA=9:"
            f"measured_I={first['input_i']}:measured_TP={first['input_tp']}:"
            f"measured_LRA={first['input_lra']}:measured_thresh={first['input_thresh']}:"
            f"offset={first['target_offset']}:linear=true:print_format=json"
        )
        normalized = temp / "normalized.wav"
        second = parse_measurement(run(
            "ffmpeg", "-hide_banner", "-nostats", "-y", "-i", str(source),
            "-af", normalization, "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s24le",
            "-t", str(DURATION), str(normalized)))
        pcm = bytearray(run("ffmpeg", "-v", "error", "-i", str(normalized),
                            "-f", "s24le", "-acodec", "pcm_s24le", "-").stdout)
        if len(pcm) != FRAMES * 6:
            raise RuntimeError(f"Wrong normalized PCM length: {len(pcm)}")
        pcm[:6] = pcm[-6:] = bytes(6)
        candidate = temp / "soundtrack.wav"
        # Canonical RIFF PCM avoids WAVE_EXTENSIBLE issues on older Python.
        with wave.open(str(candidate), "wb") as wav:
            wav.setnchannels(2)
            wav.setsampwidth(3)
            wav.setframerate(SR)
            wav.writeframes(pcm)
        final = measure(candidate)
        validate_loudness(final, "PCM master")
        probe = json.loads(run("ffprobe", "-v", "error", "-show_streams", "-show_format",
                               "-of", "json", str(candidate)).stdout)
        stream = probe["streams"][0]
        if (stream["sample_rate"], stream["channels"], stream["codec_name"],
                int(stream["bits_per_sample"])) != (str(SR), 2, "pcm_s24le", 24):
            raise RuntimeError(f"Unexpected format: {stream}")
        if float(stream["duration"]) != DURATION or int(stream["duration_ts"]) != FRAMES:
            raise RuntimeError(f"Unexpected sample count: {stream}")
        decoded = run("ffmpeg", "-v", "error", "-i", str(candidate), "-f", "f32le", "-").stdout
        samples = np.frombuffer(decoded, dtype="<f4").reshape(-1, 2)
        if len(samples) != FRAMES or np.any(samples[[0, -1]] != 0):
            raise RuntimeError("Frame count or zero endpoints failed")
        # Verify lossy delivery too, not just its encoder's input. Keep it temporary.
        aac_checks = {}
        for bitrate in (192, 320):
            aac = temp / f"aac-{bitrate}.m4a"
            run("ffmpeg", "-v", "error", "-y", "-i", str(candidate),
                "-c:a", "aac", "-b:a", f"{bitrate}k", str(aac))
            result = measure(aac)
            validate_loudness(result, f"AAC {bitrate}k")
            aac_checks[f"{bitrate}k"] = result
        OUTPUT.write_bytes(candidate.read_bytes())
        probe["format"]["filename"] = str(OUTPUT)
        report = {
            "file": "public/click-a-link/audio/soundtrack.wav",
            "original_synthesis": True, "external_samples": False, "voice": False,
            "backend": "numpy", "seed": SEED, "bpm": BPM,
            "duration_seconds": DURATION, "sample_rate": SR, "channels": 2,
            "bit_depth": 24, "frames": FRAMES,
            "integrated_lufs": float(final["input_i"]),
            "true_peak_dbtp": float(final["input_tp"]),
            "loudness_range_lu": float(final["input_lra"]),
            "sample_peak_dbfs": dbfs(float(np.max(np.abs(samples)))),
            "rms_dbfs": dbfs(float(np.sqrt(np.mean(samples.astype(np.float64) ** 2)))),
            "first_sample": samples[0].tolist(), "last_sample": samples[-1].tolist(),
            "first_50ms_rms_dbfs": dbfs(float(np.sqrt(np.mean(samples[:2400].astype(np.float64) ** 2)))),
            "last_50ms_rms_dbfs": dbfs(float(np.sqrt(np.mean(samples[-2400:].astype(np.float64) ** 2)))),
            "stereo_correlation": round(float(np.corrcoef(samples.T)[0, 1]), 6),
            "aac_192k_integrated_lufs": float(aac_checks["192k"]["input_i"]),
            "aac_192k_true_peak_dbtp": float(aac_checks["192k"]["input_tp"]),
            "aac_320k_integrated_lufs": float(aac_checks["320k"]["input_i"]),
            "aac_320k_true_peak_dbtp": float(aac_checks["320k"]["input_tp"]),
            "normalization": "two-pass ffmpeg loudnorm, I=-14, TP=-1.8, LRA=9",
            "source_measurement": first, "second_pass": second,
            "final_measurement": final, "aac_measurements": aac_checks,
            "events": [{"seconds": at, "sample_frame": round(at * SR), "event": label,
                        "instrument": kind} for at, label, kind, *_ in EVENTS],
            "ffprobe": probe,
        }
        REPORT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
        print(json.dumps({k: v for k, v in report.items() if k not in {
            "source_measurement", "second_pass", "final_measurement", "aac_measurements",
            "events", "ffprobe"}}, indent=2))


if __name__ == "__main__":
    main()
