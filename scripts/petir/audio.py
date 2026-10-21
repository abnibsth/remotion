"""Build the original 30-second Petir soundtrack. Run: python -I scripts/petir/audio.py.
Requires installed numpy, edge_tts, ffmpeg. No credentials or downloaded sound samples.
"""
from __future__ import annotations

import asyncio
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public" / "petir" / "audio"
REPORTS = ROOT / "out" / "petir"
SR = 48000
DURATION = 30
FRAMES = SR * DURATION
SEED = 20261021
SEGMENTS = [
    (0.35, 2.85, "Pernah kepikiran, kenapa petir bisa muncul?"),
    (3.25, 7.65, "Di dalam awan badai, partikel es saling bertabrakan."),
    (8.25, 13.6, "Tumbukan ini membantu memisahkan muatan listrik."),
    (14.3, 19.6, "Saat medan listrik cukup kuat, udara mulai terionisasi."),
    (20.2, 25.6, "Terbentuklah jalur listrik, lalu muncul kilatan petir!"),
    (26.0, 29.9, "Udara memanas sangat cepat. Itulah yang menghasilkan guntur."),
]
EVENTS = [
    {"time": 0.35, "event": "hook flash / electric snap"},
    {"time": 0.8, "event": "hook thunder"},
    *[{"time": t, "event": "ice collision tick"} for t in (4.5, 5.4, 6.2)],
    {"time": 14.0, "end": 22.0, "event": "electric tension rise"},
    {"time": 20.6, "end": 23.1, "event": "stepped leader crackles"},
    {"time": 23.5, "event": "return stroke impact"},
    {"time": 24.0, "event": "delayed thunder"},
    {"time": 26.0, "end": 28.0, "event": "pressure rumble"},
]


def run(args, data=None):
    result = subprocess.run(args, input=data, stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE, check=False)
    if result.returncode:
        raise RuntimeError(result.stderr.decode("utf-8", errors="replace")[-3000:])
    return result


def ffmpeg(*args, data=None):
    return run(["ffmpeg", "-hide_banner", "-nostdin", "-y", *map(str, args)], data)


def write_wav(path, samples):
    ffmpeg("-f", "f32le", "-ar", SR, "-ac", 2, "-i", "pipe:0",
           "-c:a", "pcm_s24le", path, data=np.asarray(samples, dtype="<f4").tobytes())


def smooth(t, start, end):
    x = np.clip((t - start) / (end - start), 0, 1)
    return x * x * (3 - 2 * x)


def synthesize():
    """Deterministic synthesis: original pads, filtered air, and physical-style transients."""
    rng = np.random.default_rng(SEED)
    t = np.arange(FRAMES, dtype=np.float64) / SR
    music = np.zeros((FRAMES, 2), dtype=np.float64)
    sfx = np.zeros_like(music)

    def noise(n, low, high, slope=0):
        freqs = np.fft.rfftfreq(n, 1 / SR)
        spectrum = np.fft.rfft(rng.standard_normal(n))
        shape = (1 - np.exp(-(freqs / max(low, 1)) ** 4))
        shape *= np.exp(-(freqs / high) ** 4)
        shape *= np.maximum(freqs, 20) ** (-slope / 2)
        result = np.fft.irfft(spectrum * shape, n=n)
        return result / max(np.std(result), 1e-8)

    # Continuous dark D-minor/add9 harmony; no borrowed melody or rhythmic samples.
    chords = [(38, 57, 60, 64, 69), (34, 53, 57, 60, 65),
              (36, 55, 58, 62, 67), (38, 57, 60, 64, 69)]
    for section, chord in enumerate(chords):
        a, b = section * 7.5, (section + 1) * 7.5
        env = smooth(t, a - 1, a + 1.5) * (1 - smooth(t, b - 0.8, b + 1.8))
        for index, note in enumerate(chord):
            frequency = 440 * 2 ** ((note - 69) / 12)
            for channel in range(2):
                detune = (-1 if channel == 0 else 1) * (0.0008 + index * 0.0001)
                tone = np.sin(2 * np.pi * frequency * (1 + detune) * t + index * 0.7)
                tone += 0.16 * np.sin(2 * np.pi * frequency * 2 * t + channel)
                amplitude = 0.025 if index == 0 else 0.009
                music[:, channel] += amplitude * tone * env * (0.86 + 0.14 * np.sin(t * 0.8 + index))
    for at, note in [(2.9, 81), (7.8, 76), (13.8, 79), (19.8, 81), (25.7, 74)]:
        dt = t - at
        env = np.where(dt >= 0, np.exp(-np.maximum(dt, 0) / 1.3), 0) * smooth(t, at, at + 0.03)
        frequency = 440 * 2 ** ((note - 69) / 12)
        for channel in range(2):
            music[:, channel] += 0.017 * env * np.sin(2 * np.pi * frequency * t + channel * 0.25)

    # Stereo storm air has a shared low cloud bed but independent upper air.
    cloud = noise(FRAMES, 24, 190, 1.7)
    for channel in range(2):
        sfx[:, channel] += cloud * 0.018 + noise(FRAMES, 320, 6500, 1.2) * 0.008
        sfx[:, channel] *= 0.8 + 0.2 * np.sin(t * 0.47 + channel * 1.2)

    def add(at, signal, pan=0, gain=1):
        offset = round(at * SR)
        length = min(len(signal), FRAMES - offset)
        # Equal-power stereo position, with subtle decorrelation from a short reflection.
        signal = signal[:length] * gain
        sfx[offset:offset + length, 0] += signal * np.sqrt((1 - pan) / 2)
        sfx[offset:offset + length, 1] += signal * np.sqrt((1 + pan) / 2)
        delay = round(0.027 * SR)
        count = min(length, FRAMES - offset - delay)
        if count > 0:
            sfx[offset + delay:offset + delay + count, 1] += signal[:count] * 0.19

    def thunder(at, duration, gain):
        n = round(duration * SR)
        x = np.arange(n) / SR
        envelope = (1 - np.exp(-x * 45)) * np.exp(-x / (duration * 0.28))
        envelope *= np.minimum(1, (duration - x) / 0.35)
        body = noise(n, 25, 490, 1.8)
        body += 0.25 * noise(n, 250, 2300, 1.2) * np.exp(-x * 2.4)
        body *= envelope * (0.8 + 0.2 * np.cos(x * 16 + np.sin(x * 5)))
        add(at, body, -0.1, gain)

    def crack(at, gain, pan=0, duration=0.08):
        n = round(duration * SR)
        x = np.arange(n) / SR
        env = (1 - np.exp(-x * 8000)) * np.exp(-x * 95)
        add(at, noise(n, 1600, 14500, 0.4) * env, pan, gain)

    crack(0.35, 0.28, -0.18, 0.12)
    thunder(0.8, 3.0, 0.13)
    for at, pan in [(4.5, -0.5), (5.4, 0.4), (6.2, -0.15)]:
        n = round(0.24 * SR)
        x = np.arange(n) / SR
        tick = (np.sin(2 * np.pi * 2400 * x) + 0.5 * np.sin(2 * np.pi * 3700 * x))
        tick *= np.exp(-x * 45) * (1 - np.exp(-x * 3000))
        add(at, tick, pan, 0.055)
    tension = smooth(t, 14, 18) * (1 - smooth(t, 21.4, 22))
    phase = 2 * np.pi * (170 * t + 3.4 * np.maximum(t - 14, 0) ** 2)
    for channel in range(2):
        sfx[:, channel] += tension * (0.014 * np.sin(phase + channel * 0.3)
                                      + noise(FRAMES, 2400, 11000, 0.5) * 0.009)
    for at in [20.6, 20.85, 21.07, 21.31, 21.49, 21.78, 22.02, 22.19, 22.4, 22.61, 22.79, 22.96, 23.1]:
        crack(at, 0.025 + (at - 20.6) * 0.018, np.sin(at * 19) * 0.65)
    crack(23.5, 0.48, 0.05, 0.16)
    n = round(0.6 * SR)
    x = np.arange(n) / SR
    impact = np.sin(2 * np.pi * (105 * x - 45 * x * x)) * np.exp(-x * 13)
    impact *= 1 - np.exp(-x * 1500)
    add(23.5, impact, 0, 0.36)
    thunder(24.0, 4.2, 0.3)
    n = round(2 * SR)
    x = np.arange(n) / SR
    pressure = noise(n, 25, 150, 1.8) * np.sin(np.pi * x / 2) ** 2
    add(26.0, pressure, 0.12, 0.11)
    fade = smooth(t, 0, 0.12) * (1 - smooth(t, 29.35, 30))
    return music * fade[:, None], sfx * fade[:, None]


async def fetch_voice(text, voice, path, rate="+8%"):
    import edge_tts
    await asyncio.wait_for(edge_tts.Communicate(text, voice=voice, rate=rate,
                                               pitch="-2Hz", volume="+0%").save(str(path)), 30)


def decode_voice(path):
    raw = ffmpeg("-i", path, "-af", "silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.015,areverse,silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.045,areverse",
                 "-ar", SR, "-ac", 1, "-f", "f32le", "pipe:1").stdout
    return np.frombuffer(raw, dtype="<f4").copy()


async def narration():
    voice_dir = PUBLIC / "narration"
    voice_dir.mkdir(parents=True, exist_ok=True)
    report = {"available": False, "service": "edge_tts", "attempts": [],
              "fallback": "No artificial or robotic replacement; timed script and subtitles supplied.",
              "segments": []}
    selected = None
    for voice in ("id-ID-ArdiNeural", "id-ID-GadisNeural"):
        path = voice_dir / "segment-01.mp3"
        try:
            await fetch_voice(SEGMENTS[0][2], voice, path)
            selected = voice
            report["attempts"].append({"voice": voice, "status": "connected"})
            break
        except Exception as exc:
            path.unlink(missing_ok=True)
            report["attempts"].append({"voice": voice, "status": "unavailable", "error_type": type(exc).__name__})
    if not selected:
        return np.zeros((FRAMES, 2)), report
    try:
        await asyncio.gather(*[fetch_voice(text, selected, voice_dir / f"segment-{i+1:02d}.mp3")
                               for i, (_, _, text) in enumerate(SEGMENTS) if i])
        result = np.zeros((FRAMES, 2), dtype=np.float64)
        for i, (start, end, text) in enumerate(SEGMENTS):
            path = voice_dir / f"segment-{i+1:02d}.mp3"
            audio = decode_voice(path)
            original_duration = len(audio) / SR
            budget = end - start
            tempo = max(1.0, original_duration / (budget - 0.025))
            if tempo > 1.22:
                # A modest faster neural delivery before pitch-preserving fitting.
                await fetch_voice(text, selected, path, rate="+15%")
                audio = decode_voice(path)
                original_duration = len(audio) / SR
                tempo = max(1.0, original_duration / (budget - 0.025))
                rate = "+15%"
            else:
                rate = "+8%"
            if tempo > 1.22:
                raise ValueError(f"Segment {i+1} exceeds the natural-speed fitting limit")
            if tempo > 1:
                raw = ffmpeg("-f", "f32le", "-ar", SR, "-ac", 1, "-i", "pipe:0",
                             "-af", f"atempo={tempo:.8f}", "-f", "f32le", "pipe:1",
                             data=np.asarray(audio, dtype="<f4").tobytes()).stdout
                audio = np.frombuffer(raw, dtype="<f4").copy()
            if len(audio) > round(budget * SR):
                raise ValueError("Voice fitting would truncate speech")
            fade = min(round(0.006 * SR), len(audio) // 2)
            audio[:fade] *= np.linspace(0, 1, fade)
            audio[-fade:] *= np.linspace(1, 0, fade)
            rms = np.sqrt(np.mean(audio * audio))
            audio *= min(0.16 / max(rms, 1e-8), 0.82 / max(np.max(np.abs(audio)), 1e-8))
            offset = round(start * SR)
            result[offset:offset+len(audio)] += audio[:, None]
            report["segments"].append({"index": i+1, "start": start, "end": end, "text": text,
                                       "neural_rate": rate, "source_duration": original_duration,
                                       "pitch_preserving_atempo": tempo,
                                       "spoken_end": start + len(audio) / SR})
            write_wav(voice_dir / f"segment-{i+1:02d}.wav", np.repeat(audio[:, None], 2, axis=1))
        report.update(available=True, voice=selected, fallback=None)
        return result, report
    except Exception as exc:
        report["failure"] = {"error_type": type(exc).__name__, "reason": "Incomplete neural narration; no partial VO included in mix."}
        report["segments"] = []
        return np.zeros((FRAMES, 2)), report


def loudness(path):
    output = ffmpeg("-i", path, "-af", "loudnorm=I=-14:TP=-1.2:LRA=8:print_format=json",
                    "-f", "null", "-").stderr.decode("utf-8", errors="replace")
    return json.loads(output[output.rfind("{"):output.rfind("}") + 1])


def master(raw, target):
    measured = loudness(raw)
    settings = ("loudnorm=I=-14:TP=-1.2:LRA=8:"
                f"measured_I={measured['input_i']}:measured_TP={measured['input_tp']}:"
                f"measured_LRA={measured['input_lra']}:measured_thresh={measured['input_thresh']}:"
                f"offset={measured['target_offset']}:linear=true:print_format=json")
    ffmpeg("-i", raw, "-af", settings + f",aresample={SR},atrim=end_sample={FRAMES},asetpts=PTS-STARTPTS",
           "-ar", SR, "-ac", 2, "-c:a", "pcm_s24le", target)
    # Dynamic loudnorm can undershoot on a sparse storm. Correct against the
    # rendered master, protecting intersample peaks at 4x rate; do not just
    # claim the requested normalization target as a measurement.
    final = loudness(target)
    for _ in range(3):
        delta = -14 - float(final["input_i"])
        if abs(delta) <= 0.05:
            break
        with tempfile.TemporaryDirectory(prefix="petir-master-") as temp:
            corrected = Path(temp) / "corrected.wav"
            ffmpeg("-i", target, "-af",
                   f"aresample=192000,volume={delta:.4f}dB,"
                   "alimiter=limit=0.879:attack=1:release=50:level=false:latency=true,"
                   f"aresample={SR},apad=whole_len={FRAMES},atrim=end_sample={FRAMES}",
                   "-ar", SR, "-ac", 2, "-c:a", "pcm_s24le", corrected)
            shutil.copyfile(corrected, target)
        final = loudness(target)
    return final


def timecode(seconds):
    ms = round(seconds * 1000)
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def main():
    if not shutil.which("ffmpeg"):
        raise RuntimeError("An installed ffmpeg is required; no dependencies are installed automatically.")
    PUBLIC.mkdir(parents=True, exist_ok=True)
    REPORTS.mkdir(parents=True, exist_ok=True)
    srt = "\n".join(f"{i}\n{timecode(start)} --> {timecode(end)}\n{text}\n"
                    for i, (start, end, text) in enumerate(SEGMENTS, 1))
    script = "Bahasa Indonesia — Petir (30 detik)\n\n" + "\n".join(
        f"{start:.2f}–{end:.2f}  {text}" for start, end, text in SEGMENTS) + "\n"
    for folder in (PUBLIC, REPORTS):
        (folder / "narration.srt").write_text(srt, encoding="utf-8")
        (folder / "narration-script.txt").write_text(script, encoding="utf-8")
    print("Trying Indonesian neural narration (no credentials required)...", flush=True)
    voice, voice_report = asyncio.run(narration())
    (REPORTS / "narration-report.json").write_text(json.dumps(voice_report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    music, effects = synthesize()
    duck = np.ones(FRAMES)
    t = np.arange(FRAMES) / SR
    if voice_report["available"]:
        for segment in voice_report["segments"]:
            envelope = smooth(t, segment["start"] - 0.07, segment["start"])
            envelope *= 1 - smooth(t, segment["spoken_end"], segment["spoken_end"] + 0.22)
            duck = np.minimum(duck, 1 - envelope * 0.72)
        write_wav(PUBLIC / "narration.wav", voice)
    else:
        (PUBLIC / "narration.wav").unlink(missing_ok=True)
    soundtrack = music + effects
    mixed = music * duck[:, None] + effects * (0.65 + 0.35 * duck[:, None]) + voice
    with tempfile.TemporaryDirectory(prefix="petir-audio-") as temp:
        raw = Path(temp) / "raw.wav"
        write_wav(raw, soundtrack)
        score_metrics = master(raw, PUBLIC / "score.wav")
        write_wav(raw, mixed)
        metrics = master(raw, PUBLIC / "mix.wav")
    # FFmpeg emits WAVE_FORMAT_EXTENSIBLE for 24-bit PCM; Python 3.10 wave
    # cannot read that header. Probe the actual final stream instead.
    stream = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-of", "json",
                             str(PUBLIC / "mix.wav")]).stdout)["streams"][0]
    channels, rate = int(stream["channels"]), int(stream["sample_rate"])
    frames = round(int(stream["duration_ts"]) * float(stream["time_base"].split("/")[0])
                   / float(stream["time_base"].split("/")[1]) * rate)
    width = int(stream["bits_per_sample"]) // 8
    integrated, peak = float(metrics["input_i"]), float(metrics["input_tp"])
    report = {
        "output": "public/petir/audio/mix.wav", "duration_seconds": frames / rate,
        "sample_rate": rate, "channels": channels, "frames": frames, "pcm_bits": width * 8,
        "integrated_lufs": integrated, "true_peak_dbtp": peak,
        "loudness_range_lu": float(metrics["input_lra"]),
        "target_lufs": -14, "max_true_peak_dbtp": -1,
        "narration_available": voice_report["available"],
        "narration_voice": voice_report.get("voice"),
        "music_duck_db": -11.06 if voice_report["available"] else 0,
        "effects_duck_db": -2.52 if voice_report["available"] else 0,
        "score_integrated_lufs": float(score_metrics["input_i"]),
        "original_synthesis": True, "seed": SEED, "events": EVENTS,
        "subtitles": [{"index": i, "start": a, "end": b, "text": text}
                      for i, (a, b, text) in enumerate(SEGMENTS, 1)],
        "measurement": "FFmpeg loudnorm EBU R128 integrated and oversampled true peak, measured on final PCM WAV",
        "checks": {"exact_30_seconds": frames == FRAMES, "stereo_48khz": channels == 2 and rate == SR,
                   "loudness_within_0_25_lu": abs(integrated + 14) <= 0.25,
                   "true_peak_at_most_minus_1": peak <= -1},
    }
    (REPORTS / "audio-report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({k: report[k] for k in ("duration_seconds", "sample_rate", "channels", "integrated_lufs", "true_peak_dbtp", "narration_available", "checks")}, indent=2))
    if not all(report["checks"].values()):
        raise RuntimeError("Final audio failed verification; see out/petir/audio-report.json")


if __name__ == "__main__":
    main()
