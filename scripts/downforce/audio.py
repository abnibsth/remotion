"""Original Downforce sound design; no samples, network, or voice synthesis.

Build and verify: python -I scripts/downforce/audio.py
Verify existing deliverables: python -I scripts/downforce/audio.py --verify
Requires numpy and installed FFmpeg/FFprobe. AAC QC files stay in a temp folder.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public" / "downforce" / "audio"
REPORT = ROOT / "out" / "downforce" / "audio-report.json"
SR = 48000
DURATION = 30
FRAMES = SR * DURATION
SEED = 20261021
TARGET = -14.0
MAX_TP = -1.8
AAC_BITRATE = "192k"
SEGMENTS = [
    (0.3, 2.8, "Air can push a race car into the road."),
    (3.4, 4.4, "But how?"),
    (7.2, 12.5, "As air moves around the car, its shape creates pressure differences."),
    (13.4, 18.3, "The wings and underfloor help generate downforce."),
    (19.5, 24.5, "That extra load can help the tires grip the road."),
    (26.0, 29.5, "That's the science of downforce."),
]
EVENTS = [
    {"start": 0, "end": 3, "event": "engine hook: rising harmonic combustion pulse"},
    {"start": 3, "end": 7, "event": "wind: stereo filtered air sweep"},
    {"start": 7, "end": 13, "event": "wing: pitched airflow and pressure accents"},
    {"start": 13, "end": 19, "event": "underfloor: low venturi suction and air rush"},
    {"start": 19, "end": 25, "event": "mechanical: suspension clicks and loaded tire texture"},
    {"start": 25, "end": 29, "event": "final engine: controlled acceleration and release"},
    {"start": 28.5, "end": 30, "event": "tonal resolve at 28.5, clean fade to silence"},
]


def run(args, data=None):
    result = subprocess.run(list(map(str, args)), input=data, stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE, check=False)
    if result.returncode:
        raise RuntimeError(result.stderr.decode("utf-8", errors="replace")[-4000:])
    return result


def ffmpeg(*args, data=None):
    return run(["ffmpeg", "-hide_banner", "-nostdin", "-y", *args], data)


def write_wav(path, samples):
    ffmpeg("-f", "f32le", "-ar", SR, "-ac", 2, "-i", "pipe:0",
           "-c:a", "pcm_s24le", path, data=np.asarray(samples, dtype="<f4").tobytes())


def smooth(t, start, end):
    x = np.clip((t - start) / (end - start), 0, 1)
    return x * x * (3 - 2 * x)


def envelope(t, start, end, attack=0.12, release=0.25):
    return smooth(t, start, start + attack) * (1 - smooth(t, end - release, end))


def synthesize():
    """Seeded FFT-shaped air, harmonic engines, resonators, and original score."""
    rng = np.random.default_rng(SEED)
    t = np.arange(FRAMES, dtype=np.float64) / SR
    mix = np.zeros((FRAMES, 2), dtype=np.float64)

    def noise(n, low, high, slope=0.7):
        f = np.fft.rfftfreq(n, 1 / SR)
        shape = (1 - np.exp(-(f / low) ** 4)) * np.exp(-(f / high) ** 4)
        shape *= np.maximum(f, 20) ** (-slope / 2)
        x = np.fft.irfft(np.fft.rfft(rng.standard_normal(n)) * shape, n=n)
        return x / max(float(np.std(x)), 1e-8)

    def stereo_air(start, end, low, high, gain, motion=0.6):
        env = envelope(t, start, end, 0.28, 0.4)
        shared = noise(FRAMES, low, high)
        for ch in range(2):
            air = 0.72 * shared + 0.28 * noise(FRAMES, low, high)
            modulation = 0.8 + 0.2 * np.sin(t * motion * 2 * np.pi + ch * 0.8)
            mix[:, ch] += air * env * modulation * gain

    def add(at, signal, gain=1, pan=0):
        offset = round(at * SR)
        n = min(len(signal), FRAMES - offset)
        gains = np.sqrt(np.array([1 - pan, 1 + pan]) / 2)
        mix[offset:offset + n] += signal[:n, None] * gains[None, :] * gain

    # Quiet D-centered original score; a suspended second resolves to D at 28.5.
    for note, gain in [(38, 0.027), (57, 0.013), (64, 0.009), (69, 0.008)]:
        f = 440 * 2 ** ((note - 69) / 12)
        env = envelope(t, 0, 30, 0.4, 0.65)
        if note == 64:
            env *= 1 - smooth(t, 28.3, 28.5)
        for ch in range(2):
            mix[:, ch] += gain * env * np.sin(2 * np.pi * f * (1 + (ch * 2 - 1) * 0.0005) * t)
    for at in np.arange(0.1, 28.1, 0.75):
        x = np.arange(round(0.32 * SR)) / SR
        pulse = np.sin(2 * np.pi * 146.832 * x) * envelope(x, 0, 0.32, 0.012, 0.22)
        add(float(at), pulse, 0.019, 0.16 * np.sin(at))

    def engine(start, end, final=False):
        x = np.maximum(t - start, 0)
        duration = end - start
        # Eight firing harmonics with flutter, no sampled vehicle recordings.
        frequency = 64 + (84 if final else 65) * smooth(x, 0, duration - 0.6)
        frequency *= 1 + 0.012 * np.sin(2 * np.pi * 9 * x)
        phase = 2 * np.pi * np.cumsum(frequency) / SR
        tone = sum(np.sin(k * phase + k * 0.14) / k ** 1.35 for k in range(1, 9))
        env = envelope(t, start, end, 0.1, 0.45)
        grit = noise(FRAMES, 90, 2800, 0.9)
        for ch in range(2):
            flutter = 0.9 + 0.1 * np.sin(2 * np.pi * 13 * x + ch * 0.35)
            mix[:, ch] += env * (0.15 * tone * flutter + 0.026 * grit)
        stereo_air(start, end, 650, 6200, 0.025, 0.8)

    engine(0, 3)
    stereo_air(3, 7, 180, 8000, 0.09, 0.35)
    # Wings: higher, lighter airflow separated from the lower underfloor section.
    stereo_air(7, 13, 900, 9500, 0.062, 0.48)
    wing_env = envelope(t, 7, 13, 0.25, 0.4)
    for ch in range(2):
        phase = 2 * np.pi * (580 * t + 14 * np.sin(t * 0.9))
        mix[:, ch] += 0.025 * wing_env * np.sin(phase + ch * 0.18)
    for at, pan in [(7.08, -0.5), (9.2, 0.4), (11.4, -0.25)]:
        x = np.arange(round(0.42 * SR)) / SR
        pressure = noise(len(x), 300, 5800) * envelope(x, 0, 0.42, 0.025, 0.3)
        add(at, pressure, 0.08, pan)
    stereo_air(13, 19, 45, 650, 0.1, 0.28)
    stereo_air(13, 19, 800, 4200, 0.029, 0.65)
    under_env = envelope(t, 13, 19, 0.25, 0.4)
    for ch in range(2):
        mix[:, ch] += 0.055 * under_env * np.sin(2 * np.pi * 82.407 * t + 0.4 * np.sin(t * 7))
    # Mechanism is restrained and rounded, not metallic gunshot-like transients.
    stereo_air(19, 25, 160, 1800, 0.055, 1.2)
    for index, at in enumerate([19.05, 19.8, 20.9, 22.0, 23.1, 24.2]):
        x = np.arange(round(0.38 * SR)) / SR
        transient = (np.sin(2 * np.pi * 310 * x) + 0.38 * np.sin(2 * np.pi * 1150 * x))
        transient *= np.exp(-x * 21) * smooth(x, 0, 0.003)
        transient += noise(len(x), 1200, 6000) * np.exp(-x * 55) * smooth(x, 0, 0.003) * 0.22
        transient *= 1 - smooth(x, 0.3, 0.38)
        add(at, transient, 0.12, (-1 if index % 2 else 1) * 0.3)
    engine(25, 29, final=True)
    # Clear musical landing on 28.5, with enough decay before the 30-second cut.
    x = np.arange(round(1.5 * SR)) / SR
    resolve = sum(np.sin(2 * np.pi * f * x) * g for f, g in
                  [(146.832, 1.0), (220.0, 0.5), (293.665, 0.3)])
    resolve *= envelope(x, 0, 1.5, 0.018, 0.65) * np.exp(-x * 1.8)
    add(28.5, resolve, 0.12)
    mix *= (smooth(t, 0, 0.025) * (1 - smooth(t, 29.35, 29.95)))[:, None]
    return mix


def loudness(path):
    text = ffmpeg("-i", path, "-af", "loudnorm=I=-14:TP=-1.8:LRA=8:print_format=json",
                  "-f", "null", "-").stderr.decode("utf-8", errors="replace")
    values = json.loads(text[text.rfind("{"):text.rfind("}") + 1])
    return {"integrated_lufs": float(values["input_i"]),
            "true_peak_dbtp": float(values["input_tp"]),
            "loudness_range_lu": float(values["input_lra"]), "raw": values}


def encode_aac(source, target):
    ffmpeg("-i", source, "-c:a", "aac", "-b:a", AAC_BITRATE, "-ar", SR, "-ac", 2, target)


def master(raw, target, folder):
    measured = loudness(raw)["raw"]
    settings = ("loudnorm=I=-14:TP=-2.6:LRA=8:"
                f"measured_I={measured['input_i']}:measured_TP={measured['input_tp']}:"
                f"measured_LRA={measured['input_lra']}:measured_thresh={measured['input_thresh']}:"
                f"offset={measured['target_offset']}:linear=true")
    initial = folder / "normalized.wav"
    ffmpeg("-i", raw, "-af", settings, "-ar", SR, "-ac", 2, "-c:a", "pcm_s24le", initial)
    current = initial
    ceiling = -2.6
    # Measure actual WAV and decoded AAC on every pass. Leave codec headroom;
    # never infer successful delivery from normalization settings alone.
    for iteration in range(8):
        delta = TARGET - loudness(current)["integrated_lufs"]
        corrected = folder / f"master-{iteration}.wav"
        limit = 10 ** (ceiling / 20)
        ffmpeg("-i", current, "-af",
               f"aresample=192000,volume={delta:.5f}dB,"
               f"alimiter=limit={limit:.9f}:attack=2:release=60:level=false:latency=true,"
               f"aresample={SR},apad=whole_len={FRAMES},atrim=end_sample={FRAMES},asetpts=PTS-STARTPTS",
               "-ar", SR, "-ac", 2, "-c:a", "pcm_s24le", corrected)
        trial_aac = folder / "trial.m4a"
        encode_aac(corrected, trial_aac)
        pcm, aac = loudness(corrected), loudness(trial_aac)
        if (abs(pcm["integrated_lufs"] - TARGET) <= 0.15
                and abs(aac["integrated_lufs"] - TARGET) <= 0.25
                and max(pcm["true_peak_dbtp"], aac["true_peak_dbtp"]) <= MAX_TP):
            shutil.copyfile(corrected, target)
            return
        overshoot = max(pcm["true_peak_dbtp"], aac["true_peak_dbtp"]) - MAX_TP
        if overshoot > 0:
            ceiling -= overshoot + 0.2
        current = corrected
    raise RuntimeError("Unable to meet measured WAV/AAC loudness and peak limits")


def timecode(seconds):
    ms = round(seconds * 1000)
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def text_deliverables():
    srt = "\n".join(f"{i}\n{timecode(a)} --> {timecode(b)}\n{text}\n"
                    for i, (a, b, text) in enumerate(SEGMENTS, 1))
    script = "English — Downforce (30 seconds)\nNo voiceover included; timed narration script.\n\n"
    script += "\n".join(f"{a:.2f}–{b:.2f}  {text}" for a, b, text in SEGMENTS) + "\n"
    return {"narration.srt": srt, "narration-script.txt": script}


def verify():
    target = PUBLIC / "mix.wav"
    stream = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-of", "json", target]).stdout)["streams"][0]
    pcm = loudness(target)
    with tempfile.TemporaryDirectory(prefix="downforce-aac-qc-") as temp:
        encoded = Path(temp) / "delivery.m4a"
        encode_aac(target, encoded)
        aac = loudness(encoded)
        aac_stream = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-of", "json", encoded]).stdout)["streams"][0]
    decoded = ffmpeg("-i", target, "-f", "f32le", "pipe:1").stdout
    samples = np.frombuffer(decoded, dtype="<f4").reshape(-1, 2)
    rate, channels = int(stream["sample_rate"]), int(stream["channels"])
    checks = {
        "exact_30_seconds": len(samples) == FRAMES and float(stream["duration"]) == DURATION,
        "stereo_48khz_24bit_pcm": rate == SR and channels == 2 and stream["codec_name"] == "pcm_s24le",
        "finite_samples": bool(np.isfinite(samples).all()),
        "no_sample_clipping": bool(np.max(np.abs(samples)) < 1),
        "stereo_not_dual_mono": bool(np.sqrt(np.mean((samples[:, 0] - samples[:, 1]) ** 2)) > 0.001),
        "clean_start_and_end": bool(np.max(np.abs(samples[0])) < 0.001 and np.max(np.abs(samples[-2400:])) < 0.001),
        "wav_loudness_within_0_25_lu": abs(pcm["integrated_lufs"] - TARGET) <= 0.25,
        "wav_true_peak_at_most_minus_1_8": pcm["true_peak_dbtp"] <= MAX_TP,
        "aac_loudness_within_0_25_lu": abs(aac["integrated_lufs"] - TARGET) <= 0.25,
        "aac_true_peak_at_most_minus_1_8": aac["true_peak_dbtp"] <= MAX_TP,
        "aac_stereo_48khz": int(aac_stream["sample_rate"]) == SR and int(aac_stream["channels"]) == 2,
        "english_script_and_srt_exact": all((PUBLIC / name).read_text(encoding="utf-8") == text
                                             for name, text in text_deliverables().items()),
        "six_nonoverlapping_caption_slots": len(SEGMENTS) == 6 and all(
            0 <= a < b <= DURATION and (i == 0 or SEGMENTS[i - 1][1] <= a)
            for i, (a, b, _) in enumerate(SEGMENTS)),
    }
    pcm.pop("raw")
    aac.pop("raw")
    report = {
        "output": "public/downforce/audio/mix.wav", "duration_seconds": len(samples) / rate,
        "sample_rate": rate, "channels": channels, "frames": len(samples),
        "pcm_bits": int(stream["bits_per_sample"]), **pcm,
        "target_lufs": TARGET, "max_true_peak_dbtp": MAX_TP,
        "aac": {"codec": "aac", "bitrate": AAC_BITRATE, **aac,
                "measurement": "FFmpeg loudnorm on decoded temporary AAC/M4A encoded from final WAV",
                "retained": False},
        "narration_available": False, "narration_reason": "Synth-only requested; no VO needed.",
        "original_synthesis": True, "external_samples": False, "network_used": False,
        "seed": SEED, "events": EVENTS,
        "subtitles": [{"index": i, "start": a, "end": b, "text": text}
                      for i, (a, b, text) in enumerate(SEGMENTS, 1)],
        "script": "public/downforce/audio/narration-script.txt",
        "srt": "public/downforce/audio/narration.srt",
        "measurement": "FFmpeg loudnorm EBU R128 integrated loudness and oversampled true peak on final WAV",
        "checks": checks, "passed": all(checks.values()),
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({k: report[k] for k in ("duration_seconds", "sample_rate", "channels", "integrated_lufs", "true_peak_dbtp", "aac", "checks", "passed")}, indent=2))
    if not report["passed"]:
        raise RuntimeError("Audio verification failed; see out/downforce/audio-report.json")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--verify", action="store_true", help="verify existing WAV, English script and SRT without resynthesizing")
    args = parser.parse_args()
    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            raise RuntimeError(f"Installed {tool} is required; dependencies are not installed automatically")
    if not args.verify:
        PUBLIC.mkdir(parents=True, exist_ok=True)
        for name, text in text_deliverables().items():
            (PUBLIC / name).write_text(text, encoding="utf-8")
        with tempfile.TemporaryDirectory(prefix="downforce-audio-") as temp:
            folder = Path(temp)
            raw = folder / "raw.wav"
            write_wav(raw, synthesize())
            master(raw, PUBLIC / "mix.wav", folder)
    verify()


if __name__ == "__main__":
    main()
