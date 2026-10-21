"""Original, seeded Chaos to Order score; synthesis only, no samples or voiceover.

Build and measure: python -I scripts/chaos-to-order/audio.py
Measure existing mix: python -I scripts/chaos-to-order/audio.py --verify
Requires NumPy, FFmpeg and FFprobe. Intermediate audio/AAC lives only in temp.
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
PUBLIC = ROOT / "public" / "chaos-to-order" / "audio"
REPORT = ROOT / "out" / "chaos-to-order" / "audio-report.json"
SR = 48000
DURATION = 20
FRAMES = SR * DURATION
SEED = 20261021
TARGET_LUFS = -14.0
MAX_TP = -1.8
GUARDED_TP = -2.0
AAC_BITRATE = "192k"
EVENTS = [
    {"start": 0, "end": 3, "event": "fragmented tactile wood, ceramic and paper clicks; irregular stereo positions"},
    {"start": 3.2, "end": 6, "event": "organizing pulse; scattered clicks settle toward a shared tempo"},
    {"start": 6, "end": 11, "event": "synchronized 120 BPM rhythm; rounded kick, tactile ticks and pitched arpeggio"},
    {"start": 11, "end": 15, "event": "spacious D-suspended harmonic field; percussion recedes, stereo echoes open"},
    {"start": 15.1, "end": 18, "event": "reveal and resolution to D major; warm low landing and luminous chord"},
    {"start": 18, "end": 20, "event": "dissolve into silence; last 100 ms silent for a clean loop"},
]


def run(args, data=None):
    result = subprocess.run(list(map(str, args)), input=data, stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE, check=False)
    if result.returncode:
        raise RuntimeError(result.stderr.decode("utf-8", errors="replace")[-5000:])
    return result


def ffmpeg(*args, data=None):
    return run(["ffmpeg", "-hide_banner", "-nostdin", "-y", *args], data)


def smooth(t, start, end):
    x = np.clip((t - start) / (end - start), 0, 1)
    return x * x * (3 - 2 * x)


def envelope(t, duration, attack=0.008, release=0.08):
    return smooth(t, 0, attack) * (1 - smooth(t, duration - release, duration))


def frequency(note):
    return 440 * 2 ** ((note - 69) / 12)


def synthesize():
    """Deterministic modal clicks, membrane pulse, plucked keys and evolving pads."""
    rng = np.random.default_rng(SEED)
    time = np.arange(FRAMES, dtype=np.float64) / SR
    dry = np.zeros((FRAMES, 2), dtype=np.float64)
    space = np.zeros_like(dry)

    def add(at, signal, gain=1.0, pan=0.0, send=0.0):
        offset = round(at * SR)
        count = min(len(signal), FRAMES - offset)
        if offset < 0 or count <= 0:
            return
        stereo = signal[:count, None] * np.sqrt([(1 - pan) / 2, (1 + pan) / 2]) * gain
        dry[offset:offset + count] += stereo
        space[offset:offset + count] += stereo * send

    def noise(count, low, high):
        bins = np.fft.rfftfreq(count, 1 / SR)
        shape = (1 - np.exp(-(bins / low) ** 4)) * np.exp(-(bins / high) ** 4)
        signal = np.fft.irfft(np.fft.rfft(rng.standard_normal(count)) * shape, n=count)
        return signal / max(float(np.std(signal)), 1e-9)

    def click(at, gain, pan, kind=0, send=0.2):
        duration = 0.17 if kind != 2 else 0.11
        t = np.arange(round(duration * SR)) / SR
        # Short modal resonances and soft noise excitation, not digital impulses.
        base = [650, 1100, 420][kind] * rng.uniform(0.93, 1.07)
        tone = (np.sin(2 * np.pi * base * t) * np.exp(-t * 65)
                + 0.35 * np.sin(2 * np.pi * base * 2.31 * t) * np.exp(-t * 110))
        grain = noise(len(t), 1500, 7500) * np.exp(-t * (140 if kind != 2 else 70))
        signal = (0.7 * tone + 0.25 * grain) * envelope(t, duration, 0.0018, 0.035)
        add(at, signal, gain, pan, send)

    def pulse(at, gain=0.18, pan=0.0):
        t = np.arange(round(0.38 * SR)) / SR
        phase = 2 * np.pi * (73.416 * t + 26 * 0.022 * (1 - np.exp(-t / 0.022)))
        body = (np.sin(phase) + 0.13 * np.sin(2 * phase)) * np.exp(-t * 12)
        body *= envelope(t, 0.38, 0.004, 0.10)
        add(at, body, gain, pan, 0.05)

    def pluck(at, note, gain, pan, duration=1.3, send=0.45):
        t = np.arange(round(duration * SR)) / SR
        f = frequency(note)
        signal = sum(np.sin(2 * np.pi * f * h * t + 0.14 * h) * np.exp(-t * (3.0 + h)) / h ** 1.7
                     for h in range(1, 5))
        signal *= envelope(t, duration, 0.005, min(0.3, duration / 3))
        add(at, signal, gain, pan, send)

    def chord(start, end, notes, gain, attack, release):
        count = round((end - start) * SR)
        t = np.arange(count) / SR
        env = envelope(t, end - start, attack, release)
        for index, note in enumerate(notes):
            f = frequency(note)
            # Slight opposed detuning gives width; fundamental stays stable in mono.
            tone = (0.8 * np.sin(2 * np.pi * f * t)
                    + 0.16 * np.sin(2 * np.pi * f * 2 * t)
                    + 0.07 * np.sin(2 * np.pi * f * 3 * t))
            movement = 0.92 + 0.08 * np.sin(2 * np.pi * 0.17 * t + index)
            pan = np.linspace(-0.65, 0.65, len(notes))[index]
            add(start, tone * env * movement, gain, float(pan), 0.58)
            shimmer = np.sin(2 * np.pi * f * 1.0018 * t) * env
            add(start, shimmer, gain * 0.16, -float(pan), 0.7)

    # Start with 120 ms of silence, then restrained, non-repeating tactile fragments.
    fragments = [0.16, 0.32, 0.61, 0.68, 1.02, 1.29, 1.38, 1.74, 2.03, 2.16, 2.50, 2.72, 2.89]
    for i, at in enumerate(fragments):
        click(at, float(rng.uniform(0.09, 0.16)), float(rng.uniform(-0.78, 0.78)), i % 3, 0.08)
    for at, note, pan in [(0.62, 74, -0.5), (1.41, 81, 0.6), (2.31, 76, -0.2)]:
        pluck(at, note, 0.055, pan, 0.5, 0.15)

    # The first unambiguous low pulse is exactly 3.2 seconds.
    for i, at in enumerate([3.2, 3.9, 4.5, 5.05, 5.55]):
        pulse(at, 0.19 + i * 0.008)
        click(at, 0.075, 0.28 * (-1) ** i, i % 2, 0.22)
        pluck(at + 0.25, [62, 69, 74, 76, 81][i], 0.075, 0.4 * (-1) ** i)
    chord(3.2, 11.6, [50, 57, 64], 0.042, 1.0, 1.1)

    # A fixed half-second grid now locks the parts together at 6.0 seconds.
    pattern = [62, 69, 74, 76, 69, 74, 81, 76]
    for index, at in enumerate(np.arange(6.0, 11.0, 0.5)):
        pulse(float(at), 0.22 if index % 4 == 0 else 0.18)
        click(float(at), 0.09, -0.25 if index % 2 == 0 else 0.25, index % 2, 0.22)
        click(float(at + 0.25), 0.045, 0.45 * (-1) ** index, 2, 0.32)
        pluck(float(at), pattern[index % len(pattern)], 0.12, 0.4 * (-1) ** index, 1.3, 0.4)
        if index % 2:
            pluck(float(at + 0.25), 81, 0.046, -0.35, 0.8, 0.38)
    chord(6.0, 11.3, [38, 57], 0.047, 0.3, 0.8)

    # Negative space replaces percussion. The suspended E anticipates resolution.
    chord(11.0, 15.35, [50, 57, 64, 69, 74], 0.066, 0.65, 0.65)
    for at, note, pan in [(11.0, 74, -0.5), (12.25, 81, 0.55), (13.5, 76, -0.25), (14.35, 69, 0.25)]:
        pluck(at, note, 0.13, pan, 2.0, 0.65)

    # D-major reveal lands exactly at 15.1, with no riser or harsh impact.
    pulse(15.1, 0.28)
    chord(15.1, 19.8, [38, 50, 57, 66, 74, 81], 0.071, 0.035, 1.8)
    for at, note, pan, gain in [(15.1, 74, -0.35, 0.17), (15.1, 78, 0.35, 0.14),
                                (15.1, 81, 0.05, 0.12), (16.1, 81, 0.5, 0.10),
                                (17.1, 78, -0.4, 0.085), (18.05, 74, 0.2, 0.055)]:
        pluck(at, note, gain, pan, 1.7, 0.7)

    # Deterministic, cross-channel diffuse echoes; no external impulse responses.
    mix = dry.copy()
    for index, (delay, level) in enumerate([(0.137, 0.19), (0.281, 0.15), (0.433, 0.12),
                                          (0.619, 0.09), (0.827, 0.065), (1.067, 0.045)]):
        offset = round(delay * SR)
        reflection = space[:-offset, ::-1] if index % 2 == 0 else space[:-offset]
        mix[offset:] += reflection * level
    # Fade all dry and echo energy together; both 100 ms loop edges are silent.
    master_env = smooth(time, 0.12, 0.15) * (1 - smooth(time, 18.0, 19.86))
    mix *= master_env[:, None]
    return mix


def write_wav(path, samples):
    ffmpeg("-f", "f32le", "-ar", SR, "-ac", 2, "-i", "pipe:0",
           "-c:a", "pcm_s24le", path, data=np.asarray(samples, dtype="<f4").tobytes())


def loudness(path):
    text = ffmpeg("-i", path, "-af", "loudnorm=I=-14:TP=-1.8:LRA=8:print_format=json",
                  "-f", "null", "-").stderr.decode("utf-8", errors="replace")
    raw = json.loads(text[text.rfind("{"):text.rfind("}") + 1])
    return {"integrated_lufs": float(raw["input_i"]), "true_peak_dbtp": float(raw["input_tp"]),
            "loudness_range_lu": float(raw["input_lra"]), "raw": raw}


def encode_aac(source, target):
    ffmpeg("-i", source, "-c:a", "aac", "-b:a", AAC_BITRATE, "-ar", SR, "-ac", 2, target)


def master(raw, target, folder):
    measured = loudness(raw)["raw"]
    settings = ("loudnorm=I=-14:TP=-2.8:LRA=8:"
                f"measured_I={measured['input_i']}:measured_TP={measured['input_tp']}:"
                f"measured_LRA={measured['input_lra']}:measured_thresh={measured['input_thresh']}:"
                f"offset={measured['target_offset']}:linear=true")
    current = folder / "normalized.wav"
    ffmpeg("-i", raw, "-af", settings, "-ar", SR, "-ac", 2, "-c:a", "pcm_s24le", current)
    ceiling = -2.8
    for iteration in range(8):
        delta = TARGET_LUFS - loudness(current)["integrated_lufs"]
        corrected = folder / f"master-{iteration}.wav"
        limit = 10 ** (ceiling / 20)
        ffmpeg("-i", current, "-af",
               f"aresample=192000,volume={delta:.5f}dB,"
               f"alimiter=limit={limit:.9f}:attack=2:release=60:level=false:latency=true,"
               f"aresample={SR},apad=whole_len={FRAMES},atrim=end_sample={FRAMES},asetpts=PTS-STARTPTS",
               "-ar", SR, "-ac", 2, "-c:a", "pcm_s24le", corrected)
        encoded = folder / "trial.m4a"
        encode_aac(corrected, encoded)
        pcm, aac = loudness(corrected), loudness(encoded)
        peak = max(pcm["true_peak_dbtp"], aac["true_peak_dbtp"])
        if (abs(pcm["integrated_lufs"] - TARGET_LUFS) <= 0.15
                and abs(aac["integrated_lufs"] - TARGET_LUFS) <= 0.25 and peak <= GUARDED_TP):
            shutil.copyfile(corrected, target)
            return
        if peak > GUARDED_TP:
            ceiling -= peak - GUARDED_TP + 0.2
        current = corrected
    raise RuntimeError("Unable to meet measured WAV/AAC loudness and guarded true-peak limits")


def decode(path):
    data = ffmpeg("-i", path, "-ar", SR, "-ac", 2, "-f", "f32le", "pipe:1").stdout
    return np.frombuffer(data, dtype="<f4").reshape(-1, 2)


def db(value):
    return float(20 * np.log10(max(float(value), 1e-8)))


def verify():
    target = PUBLIC / "mix.wav"
    stream = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-of", "json", target]).stdout)["streams"][0]
    samples = decode(target)
    pcm = loudness(target)
    with tempfile.TemporaryDirectory(prefix="chaos-to-order-aac-qc-") as temp:
        encoded = Path(temp) / "delivery.m4a"
        encode_aac(target, encoded)
        aac = loudness(encoded)
        aac_stream = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-of", "json", encoded]).stdout)["streams"][0]
        aac_samples = decode(encoded)
    edge_count = round(0.1 * SR)
    edge_metrics = {
        "window_ms": 100,
        "first_peak_dbfs": db(np.max(np.abs(samples[:edge_count]))),
        "last_peak_dbfs": db(np.max(np.abs(samples[-edge_count:]))),
        "first_rms_dbfs": db(np.sqrt(np.mean(samples[:edge_count] ** 2))),
        "last_rms_dbfs": db(np.sqrt(np.mean(samples[-edge_count:] ** 2))),
        "boundary_step_dbfs": db(np.max(np.abs(samples[0] - samples[-1]))),
        "aac_first_peak_dbfs": db(np.max(np.abs(aac_samples[:edge_count]))),
        "aac_last_peak_dbfs": db(np.max(np.abs(aac_samples[round(19.9 * SR):FRAMES]))),
        "floor_dbfs": -160,
    }
    rate, channels = int(stream["sample_rate"]), int(stream["channels"])
    checks = {
        "exact_20_seconds": len(samples) == FRAMES and float(stream["duration"]) == DURATION,
        "stereo_48khz_24bit_pcm": rate == SR and channels == 2 and stream["codec_name"] == "pcm_s24le",
        "finite_samples": bool(np.isfinite(samples).all()),
        "no_sample_clipping": bool(np.max(np.abs(samples)) < 1),
        "stereo_not_dual_mono": bool(np.sqrt(np.mean((samples[:, 0] - samples[:, 1]) ** 2)) > 0.001),
        "first_last_100ms_near_silence": max(edge_metrics["first_peak_dbfs"], edge_metrics["last_peak_dbfs"]) <= -70,
        "loop_boundary_near_silence": edge_metrics["boundary_step_dbfs"] <= -70,
        "aac_first_last_100ms_near_silence": max(edge_metrics["aac_first_peak_dbfs"], edge_metrics["aac_last_peak_dbfs"]) <= -60,
        "wav_loudness_within_0_25_lu": abs(pcm["integrated_lufs"] - TARGET_LUFS) <= 0.25,
        "wav_true_peak_at_most_minus_1_8": pcm["true_peak_dbtp"] <= MAX_TP,
        "aac_loudness_within_0_25_lu": abs(aac["integrated_lufs"] - TARGET_LUFS) <= 0.25,
        "aac_true_peak_at_most_minus_1_8": aac["true_peak_dbtp"] <= MAX_TP,
        "codec_headroom_at_least_0_2_db": max(pcm["true_peak_dbtp"], aac["true_peak_dbtp"]) <= GUARDED_TP,
        "aac_stereo_48khz": int(aac_stream["sample_rate"]) == SR and int(aac_stream["channels"]) == 2,
    }
    pcm.pop("raw")
    aac.pop("raw")
    report = {
        "output": "public/chaos-to-order/audio/mix.wav",
        "duration_seconds": len(samples) / rate, "sample_rate": rate, "channels": channels,
        "frames": len(samples), "pcm_bits": int(stream["bits_per_sample"]), **pcm,
        "sample_peak_dbfs": db(np.max(np.abs(samples))),
        "target_lufs": TARGET_LUFS, "max_true_peak_dbtp": MAX_TP,
        "true_peak_margin_db": round(MAX_TP - pcm["true_peak_dbtp"], 2),
        "aac": {"codec": "aac", "bitrate": AAC_BITRATE, **aac,
                "true_peak_margin_db": round(MAX_TP - aac["true_peak_dbtp"], 2),
                "measurement": "FFmpeg loudnorm on decoded temporary AAC/M4A encoded from final WAV",
                "decoded_frames": len(aac_samples), "retained": False},
        "loop": edge_metrics, "seed": SEED, "tempo_bpm": 120,
        "events": EVENTS, "voiceover": False, "original_synthesis": True,
        "external_samples": False, "network_used": False,
        "synthesis": "Seeded NumPy modal clicks, membrane pulses, harmonic plucks, detuned pads and stereo delay taps",
        "measurement": "FFmpeg loudnorm EBU R128 integrated loudness and oversampled true peak on final WAV",
        "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
        "checks": checks, "passed": all(checks.values()),
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, indent=2, allow_nan=False) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, allow_nan=False))
    if not report["passed"]:
        raise RuntimeError("Audio verification failed; see out/chaos-to-order/audio-report.json")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--verify", action="store_true", help="measure the existing final WAV and temporary AAC without resynthesizing")
    args = parser.parse_args()
    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            raise RuntimeError(f"Installed {tool} is required; dependencies are not installed automatically")
    if not args.verify:
        PUBLIC.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(prefix="chaos-to-order-audio-") as temp:
            folder = Path(temp)
            raw = folder / "raw.wav"
            write_wav(raw, synthesize())
            master(raw, PUBLIC / "mix.wav", folder)
    verify()


if __name__ == "__main__":
    main()
