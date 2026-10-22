"""Original deterministic score for PHP IS DEAD (AGAIN), no samples or voice.

Generate and verify: python -I scripts/php-is-dead/audio.py
Verify existing assets: python -I scripts/php-is-dead/audio.py --verify
Requires installed NumPy, ffmpeg, ffprobe; no downloads. Only writes assets beneath
public/php-is-dead/audio; intermediate files live in the system temporary folder.
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
PUBLIC = ROOT / "public" / "php-is-dead" / "audio"
SR = 48000
DURATION = 20
FRAMES = SR * DURATION
SEED = 20261022
TARGET = -14.0
AAC_BITRATE = "320k"
STEMS = ("impacts", "timeline", "hero", "phrases", "keyboard")
TIMINGS = [
    {"at": [0.12, 1.00, 1.58], "stem": "impacts", "cue": "Oversized synthesized low cinematic punches"},
    {"at": [3.10, 4.40, 5.48, 6.36, 7.05, 7.35, 7.55, 7.72], "stem": "timeline", "cue": "Accelerating mechanical timeline stamps"},
    {"start": 8.0, "end": 10.0, "cue": "Absolute digital silence, no meanwhile sound"},
    {"start": 10.0, "end": 14.55, "stem": "hero", "cue": "Original ludicrously heroic synthesized brass/chord swell"},
    {"at": [10.0, 11.0, 12.0, 13.0], "stem": "hero", "cue": "Increasing build downbeats"},
    {"at": [14.25], "stem": "hero", "cue": "Heroic D-major peak; all hero audio cut at 14.55"},
    {"start": 14.55, "end": 15.20, "cue": "Silence around visual BRO at 14.65; no spoken word"},
    {"at": [15.20, 15.65, 16.25], "stem": "phrases", "cue": "Dry restrained low punctuation"},
    {"start": 18.10, "end": 18.60, "stem": "keyboard", "cue": "Minimal dry synthesized keyboard typing"},
    {"at": [18.85], "stem": "keyboard", "cue": "Small clean reveal glint"},
    {"at": [19.63], "stem": "keyboard", "cue": "Last dry key"},
    {"start": 19.85, "end": 20.0, "cue": "Absolute digital silence"},
]


def run(args, data=None):
    result = subprocess.run(list(map(str, args)), input=data, stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE, check=False)
    if result.returncode:
        raise RuntimeError(result.stderr.decode("utf-8", errors="replace")[-6000:])
    return result


def ffmpeg(*args, data=None):
    return run(["ffmpeg", "-hide_banner", "-nostdin", "-y", *args], data)


def smooth(x):
    x = np.clip(x, 0, 1)
    return x * x * (3 - 2 * x)


def env(t, duration, attack=0.002, release=0.03):
    return smooth(t / attack) * (1 - smooth((t - duration + release) / release))


def freq(note):
    return 440 * 2 ** ((note - 69) / 12)


def enforce_silence(samples):
    # Half-open intervals: precisely sample 384000 through 479999 is zero.
    samples[8 * SR:10 * SR] = 0
    samples[round(14.55 * SR):round(15.20 * SR)] = 0
    samples[round(19.85 * SR):] = 0
    return samples


def synthesize():
    rng = np.random.default_rng(SEED)
    stems = {name: np.zeros((FRAMES, 2), dtype=np.float64) for name in STEMS}

    def add(stem, at, signal, gain=1, pan=0):
        offset = round(at * SR)
        count = min(len(signal), FRAMES - offset)
        stereo = signal[:count, None] * np.sqrt([(1 - pan) / 2, (1 + pan) / 2])
        stems[stem][offset:offset + count] += gain * stereo

    def noise(n, low, high):
        bins = np.fft.rfftfreq(n, 1 / SR)
        shape = (1 - np.exp(-(bins / low) ** 4)) * np.exp(-(bins / high) ** 4)
        signal = np.fft.irfft(np.fft.rfft(rng.standard_normal(n)) * shape, n=n)
        return signal / max(np.std(signal), 1e-9)

    def punch(stem, at, gain, duration=0.6, base=45, dirty=True):
        t = np.arange(round(duration * SR)) / SR
        phase = 2 * np.pi * (base * t + 75 * 0.025 * (1 - np.exp(-t / 0.025)))
        body = (np.sin(phase) + 0.24 * np.sin(phase * 2)) * np.exp(-t * 7)
        if dirty:
            body += 0.22 * noise(len(t), 150, 3200) * np.exp(-t * 17)
            body += 0.15 * np.sin(2 * np.pi * 113 * t) * np.exp(-t * 12)
        add(stem, at, np.tanh(body * 1.5) * env(t, duration, 0.001, 0.07), gain)

    for at, gain, base in [(0.12, 0.88, 42), (1.0, 0.99, 39), (1.58, 1.08, 36)]:
        punch("impacts", at, gain, 0.94, base)
        # Designed metallic debris, not a sampled explosion. Dry low core stays centered.
        t = np.arange(round(0.72 * SR)) / SR
        for pan in (-0.65, 0.65):
            dust = noise(len(t), 900, 6800) * np.exp(-t * 10) * env(t, 0.72, 0.001, 0.12)
            add("impacts", at, dust, 0.14 * gain, pan)

    for i, at in enumerate([3.10, 4.40, 5.48, 6.36, 7.05, 7.35, 7.55, 7.72]):
        duration = min(0.27, 8.0 - at)
        t = np.arange(round(duration * SR)) / SR
        tone = (np.sin(2 * np.pi * (145 + 12 * i) * t) * np.exp(-t * 24)
                + 0.25 * np.sin(2 * np.pi * (1040 + 90 * i) * t) * np.exp(-t * 70)
                + 0.3 * noise(len(t), 1000, 7200) * np.exp(-t * 95))
        add("timeline", at, tone * env(t, duration, 0.0006, 0.025),
            0.48 if i < 5 else 0.39 + 0.04 * (i - 5), (-1) ** i * 0.16)

    # Self-composed harmonic sequence: D -> Bb -> G -> A(sus), then D-major payoff.
    # Original simple upward call, not a quotation of a melody or recording.
    chord_specs = [
        (10.0, 11.10, [38, 50, 57, 62, 66], 0.075),
        (11.0, 12.10, [34, 46, 53, 58, 62], 0.100),
        (12.0, 13.10, [31, 43, 55, 59, 62], 0.130),
        (13.0, 14.25, [33, 45, 57, 62, 64], 0.155),
        (14.25, 14.55, [38, 50, 57, 62, 66, 74], 0.195),
    ]
    for start, end, notes, gain in chord_specs:
        duration = end - start
        t = np.arange(round(duration * SR)) / SR
        attack = 0.028 if start == 14.25 else 0.11
        # A 1 ms de-click is still an abrupt guillotine, not a musical fade-out.
        release = 0.001 if end == 14.55 else 0.09
        shape = env(t, duration, attack, release)
        shape *= 0.7 + 0.3 * smooth(t / max(duration - 0.1, 0.1))
        for j, note in enumerate(notes):
            f = freq(note)
            tone = np.zeros_like(t)
            for harmonic in range(1, 10):
                # Brass-like broad harmonic structure with restrained top end.
                strength = np.exp(-harmonic / 4.8) / harmonic ** 0.8
                tone += strength * np.sin(2 * np.pi * f * harmonic * t
                                         + 0.035 * np.sin(2 * np.pi * 5.1 * t))
            pan = float(np.linspace(-0.67, 0.67, len(notes))[j])
            add("hero", start, tone * shape, gain, pan)
            width = np.sin(2 * np.pi * f * 1.003 * t) * shape
            add("hero", start, width, gain * 0.11, -pan)
    for i, at in enumerate([10.0, 11.0, 12.0, 13.0]):
        punch("hero", at, 0.22 + i * 0.05, 0.44, [49, 46, 43, 45][i], False)
    for at, note, duration, gain in [(10.20, 74, 0.46, 0.12), (10.75, 81, 0.38, 0.14),
                                      (11.28, 82, 0.55, 0.16), (12.30, 83, 0.48, 0.18),
                                      (13.15, 85, 0.50, 0.20), (13.72, 88, 0.53, 0.22)]:
        t = np.arange(round(duration * SR)) / SR
        f = freq(note)
        call = sum(np.sin(2 * np.pi * f * h * t) / h ** 1.25 for h in range(1, 7))
        add("hero", at, call * env(t, duration, 0.025, 0.06), gain, 0.12)
    # Stereo diffusion only on hero; every reflection is guillotined at 14.55.
    dry_hero = stems["hero"].copy()
    for i, (delay, gain) in enumerate([(0.067, 0.16), (0.139, 0.12), (0.223, 0.08)]):
        n = round(delay * SR)
        stems["hero"][n:] += dry_hero[:-n, ::-1 if i % 2 == 0 else 1] * gain
    cut = round(14.55 * SR)
    stems["hero"][cut - 48:cut] *= np.linspace(1, 0, 48)[:, None]
    stems["hero"][cut:] = 0

    for at, base, gain in [(15.20, 62, 0.20), (15.65, 58, 0.18), (16.25, 49, 0.22)]:
        punch("phrases", at, gain, 0.20, base, False)

    def key(at, gain, pan, duration=0.055):
        t = np.arange(round(duration * SR)) / SR
        tone = (noise(len(t), 850, 4900) * np.exp(-t * 130)
                + 0.20 * np.sin(2 * np.pi * 820 * t) * np.exp(-t * 95))
        add("keyboard", at, tone * env(t, duration, 0.0005, 0.012), gain, pan)

    for i, at in enumerate([18.10, 18.18, 18.235, 18.33, 18.405, 18.47, 18.545]):
        key(at, 0.052 + 0.006 * (i % 3), 0.12 * (-1) ** i)
    # A quiet two-tone glass-like confirmation, no reverb or gratuitous impact.
    t = np.arange(round(0.22 * SR)) / SR
    reveal = (np.sin(2 * np.pi * freq(86) * t)
              + 0.45 * np.sin(2 * np.pi * freq(93) * t)) * np.exp(-t * 18)
    add("keyboard", 18.85, reveal * env(t, 0.22, 0.003, 0.05), 0.095, 0.14)
    key(19.63, 0.075, 0, 0.065)
    for samples in stems.values():
        enforce_silence(samples)
    return stems


def write_wav(path, samples):
    ffmpeg("-f", "f32le", "-ar", SR, "-ac", 2, "-i", "pipe:0",
           "-c:a", "pcm_s24le", path, data=np.asarray(samples, dtype="<f4").tobytes())


def decode(path):
    data = ffmpeg("-i", path, "-ar", SR, "-ac", 2, "-f", "f32le", "pipe:1").stdout
    return np.frombuffer(data, dtype="<f4").reshape(-1, 2).copy()


def loudness(path):
    text = ffmpeg("-i", path, "-af", "loudnorm=I=-14:TP=-2:LRA=11:print_format=json",
                  "-f", "null", "-").stderr.decode("utf-8", errors="replace")
    raw = json.loads(text[text.rfind("{"):text.rfind("}") + 1])
    return {"integrated_lufs": float(raw["input_i"]), "true_peak_dbtp": float(raw["input_tp"]),
            "loudness_range_lu": float(raw["input_lra"]), "raw": raw}


def encode(source, target):
    ffmpeg("-i", source, "-c:a", "aac", "-b:a", AAC_BITRATE, "-ar", SR, "-ac", 2, target)


def master(raw, target, folder):
    first = loudness(raw)["raw"]
    # Actual two-pass EBU R128 normalization, with a conservative codec ceiling.
    settings = ("loudnorm=I=-14:TP=-2.5:LRA=11:"
                f"measured_I={first['input_i']}:measured_TP={first['input_tp']}:"
                f"measured_LRA={first['input_lra']}:measured_thresh={first['input_thresh']}:"
                f"offset={first['target_offset']}:linear=true:print_format=json")
    current = folder / "two-pass.wav"
    result = ffmpeg("-i", raw, "-af", settings, "-ar", SR, "-ac", 2, "-c:a", "pcm_s24le", current)
    text = result.stderr.decode("utf-8", errors="replace")
    second = json.loads(text[text.rfind("{"):text.rfind("}") + 1])
    iterations = []
    ceiling = -2.5
    for i in range(8):
        delta = TARGET - loudness(current)["integrated_lufs"]
        corrected = folder / f"limited-{i}.wav"
        # Oversampled transparent peak control; compensate limiter latency.
        ffmpeg("-i", current, "-af",
               f"aresample=192000,volume={delta:.6f}dB,"
               f"alimiter=limit={10 ** (ceiling / 20):.10f}:attack=2:release=65:level=false:latency=true,"
               f"aresample={SR},apad=whole_len={FRAMES},atrim=end_sample={FRAMES},asetpts=PTS-STARTPTS",
               "-ar", SR, "-ac", 2, "-c:a", "pcm_s24le", corrected)
        # Resampling/limiting can smear into silence, so zero the final delivered PCM.
        write_wav(target, enforce_silence(decode(corrected)[:FRAMES]))
        encoded = folder / "trial.m4a"
        encode(target, encoded)
        pcm, aac = loudness(target), loudness(encoded)
        iterations.append({"iteration": i, "limiter_ceiling_dbtp": ceiling,
                           "wav_lufs": pcm["integrated_lufs"], "wav_dbtp": pcm["true_peak_dbtp"],
                           "aac_lufs": aac["integrated_lufs"], "aac_dbtp": aac["true_peak_dbtp"]})
        if (abs(aac["integrated_lufs"] - TARGET) <= 0.35
                and abs(pcm["integrated_lufs"] - TARGET) <= 0.35
                and pcm["true_peak_dbtp"] <= -2 and aac["true_peak_dbtp"] <= -1):
            return {"first_pass": first, "second_pass": second, "corrections": iterations}
        if pcm["true_peak_dbtp"] > -2 or aac["true_peak_dbtp"] > -1:
            ceiling -= max(pcm["true_peak_dbtp"] + 2, aac["true_peak_dbtp"] + 1) + 0.15
        current = target
    raise RuntimeError("Unable to meet WAV/AAC mastering targets")


def silent_window(samples, start, end):
    region = samples[round(start * SR):round(end * SR)]
    peak = float(np.max(np.abs(region)))
    return {"start": start, "end": end, "nonzero_samples": int(np.count_nonzero(region)),
            "peak_amplitude": peak, "exact_silence": peak == 0}


def verify(mastering=None):
    target = PUBLIC / "mix.wav"
    stream = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-of", "json", target]).stdout)["streams"][0]
    samples = decode(target)
    pcm = loudness(target)
    pcm.pop("raw")
    encoded = PUBLIC / "mix-aac-qc.m4a"
    encode(target, encoded)
    aac = loudness(encoded)
    aac.pop("raw")
    decoded = decode(encoded)
    windows = [silent_window(samples, a, b) for a, b in [(8, 10), (14.55, 15.20), (19.85, 20)]]
    # AAC is block based and cannot promise bit-zero boundary samples. Report
    # the interior separately; exact temporal silence is guaranteed in the WAV.
    aac_silence = [silent_window(decoded, a, b) for a, b in [(8.05, 9.95), (19.9, 20)]]
    stem_reports = {}
    for name in STEMS:
        path = PUBLIC / f"stem-{name}.wav"
        data = decode(path)
        stem_reports[name] = {"file": path.name, "frames": len(data),
                              "peak_amplitude": float(np.max(np.abs(data))),
                              "finite": bool(np.isfinite(data).all()),
                              "silence": [silent_window(data, a, b) for a, b in [(8, 10), (19.85, 20)]],
                              "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}
    checks = {
        "exact_20_seconds": len(samples) == FRAMES and float(stream["duration"]) == DURATION,
        "stereo_48khz_24bit_pcm": int(stream["sample_rate"]) == SR and int(stream["channels"]) == 2 and stream["codec_name"] == "pcm_s24le",
        "finite_unclipped": bool(np.isfinite(samples).all()) and float(np.max(np.abs(samples))) < 1,
        "stereo_not_dual_mono": float(np.sqrt(np.mean((samples[:, 0] - samples[:, 1]) ** 2))) > 0.001,
        "exact_required_silences": all(w["exact_silence"] for w in windows),
        "wav_loudness_minus14_plusminus1": abs(pcm["integrated_lufs"] - TARGET) <= 1,
        "wav_conservative_true_peak": pcm["true_peak_dbtp"] <= -2,
        "decoded_aac_loudness_minus14_plusminus1": abs(aac["integrated_lufs"] - TARGET) <= 1,
        "decoded_aac_true_peak": aac["true_peak_dbtp"] <= -1,
        "all_stems_full_length_finite_unclipped": all(s["frames"] == FRAMES and s["finite"] and s["peak_amplitude"] < 1 for s in stem_reports.values()),
        "all_stems_required_silences": all(w["exact_silence"] for s in stem_reports.values() for w in s["silence"]),
    }
    previous = PUBLIC / "metrics.json"
    if mastering is None and previous.exists():
        mastering = json.loads(previous.read_text(encoding="utf-8")).get("mastering")
    report = {"title": "PHP IS DEAD (AGAIN)", "seed": SEED, "duration_seconds": len(samples) / SR,
              "frames": len(samples), "sample_rate": SR, "channels": 2, "pcm_bits": 24,
              "wav": pcm, "decoded_aac": {**aac, "bitrate": AAC_BITRATE, "file": encoded.name,
                                            "decoded_frames_including_codec_padding": len(decoded)},
              "silence_windows_wav": windows, "silence_interiors_decoded_aac": aac_silence,
              "stems": stem_reports, "stem_note": "Time-aligned premaster stems; not individually loudness-normalized. Final master has shared loudnorm/peak processing, so stems do not sum to the mastered WAV.",
              "events": TIMINGS, "original_synthesis": True, "external_samples": False, "voiceover": False,
              "mastering": mastering, "measurement": "FFmpeg loudnorm EBU R128, final 24-bit WAV and actual decoded AAC 320 kb/s encode",
              "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
              "checks": checks, "passed": all(checks.values())}
    previous.write_text(json.dumps(report, indent=2, allow_nan=False) + "\n", encoding="utf-8")
    print(json.dumps({"wav": pcm, "decoded_aac": aac, "duration_seconds": len(samples) / SR,
                      "checks": checks, "passed": report["passed"]}, indent=2))
    if not report["passed"]:
        raise RuntimeError("Audio verification failed; see public/php-is-dead/audio/metrics.json")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--verify", action="store_true")
    args = parser.parse_args()
    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            raise RuntimeError(f"Installed {tool} is required")
    mastering = None
    if not args.verify:
        PUBLIC.mkdir(parents=True, exist_ok=True)
        stems = synthesize()
        # One common premaster scale preserves all relative balances.
        raw_mix = sum(stems.values())
        scale = 0.82 / max(float(np.max(np.abs(raw_mix))), 1e-9)
        for name, samples in stems.items():
            write_wav(PUBLIC / f"stem-{name}.wav", samples * scale)
        with tempfile.TemporaryDirectory(prefix="php-is-dead-audio-") as temp:
            folder = Path(temp)
            raw = folder / "raw.wav"
            write_wav(raw, raw_mix * scale)
            mastering = master(raw, PUBLIC / "mix.wav", folder)
    verify(mastering)


if __name__ == "__main__":
    main()
