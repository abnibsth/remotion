"""Build the original 20-second Words Have Weight score and verify PCM/AAC.

Only the soundtrack and measurement JSON are retained. Intermediate PCM and the
AAC verification encode live in a temporary directory and are deleted on exit.
Requirements: Python 3, numpy, ffmpeg and ffprobe on PATH. No sample assets.
"""
from pathlib import Path
import json
import math
import subprocess
import tempfile
import wave

import numpy as np

SR = 48_000
DURATION = 20
FRAMES = SR * DURATION
SEED = 482071
ROOT = Path(__file__).resolve().parents[2]
WAV = ROOT / "public/words-have-weight/audio/soundtrack.wav"
REPORT = ROOT / "out/words-have-weight/audio-measurements.json"
rng = np.random.default_rng(SEED)
music = np.zeros((FRAMES, 2), dtype=np.float64)
physical = np.zeros_like(music)
events = []


def clock(duration):
    return np.arange(round(duration * SR), dtype=np.float64) / SR


def envelope(t, attack=.002, release=.04):
    duration = len(t) / SR
    return np.minimum(t / attack, 1) * np.minimum((duration - t) / release, 1)


def add(bus, at, signal, gain=1., pan=0.):
    first = round(at * SR)
    count = min(len(signal), FRAMES - first)
    assert 0 <= first < FRAMES and count > 0
    angle = (pan + 1) * np.pi / 4
    bus[first:first + count] += signal[:count, None] * gain * np.array(
        [np.cos(angle), np.sin(angle)]
    )


def record(at, kind, duration, **details):
    events.append({"timeSeconds": at, "kind": kind,
                   "durationSeconds": duration, **details})


def filtered_noise(duration, low, high):
    """Seeded, smoothly band-limited noise without a scipy dependency."""
    count = round(duration * SR)
    frequency = np.fft.rfftfreq(count, 1 / SR)
    spectrum = np.fft.rfft(rng.standard_normal(count))
    highpass = 1 - np.exp(-(frequency / max(low, 1)) ** 4)
    lowpass = np.exp(-(frequency / high) ** 4)
    result = np.fft.irfft(spectrum * highpass * lowpass, n=count)
    return result / max(1e-9, np.sqrt(np.mean(result ** 2)))


def pluck(frequency, duration=.65, decay=7., brightness=.15):
    t = clock(duration)
    signal = np.sin(2 * np.pi * frequency * t)
    signal += brightness * np.sin(2 * np.pi * frequency * 2.003 * t)
    return signal * np.exp(-t * decay) * envelope(t, .002, .09)


def impact(at, strength=1., pitch=44., duration=.7, pan=0.):
    t = clock(duration)
    # Fundamental settles quickly into a deep, nearly sinusoidal body.
    phase = 2 * np.pi * (pitch * t + 105 * .018 * (1 - np.exp(-t / .018)))
    body = np.sin(phase) * np.exp(-t * 8.5)
    wood = np.sin(2 * np.pi * (pitch * 3.07) * t) * np.exp(-t * 28)
    crack = filtered_noise(duration, 1800, 12500) * np.exp(-t * 210)
    signal = (body * .84 + wood * .22 + crack * .15) * envelope(t, .0006, .08)
    add(physical, at, signal, strength, pan)
    # Very short dry secondary tick, not a reverb or generic transition sweep.
    add(physical, at + .006, pluck(2750, .028, 190, .2), strength * .105, -pan)
    record(at, "physical-impact", duration, pitchHz=pitch, strength=strength)


def tap(at, frequency=850., gain=.1, pan=0.):
    t = clock(.075)
    signal = (np.sin(2 * np.pi * frequency * t) * .6
              + filtered_noise(.075, 2000, 11000) * .12)
    signal *= np.exp(-t * 80) * envelope(t, .0006, .015)
    add(physical, at, signal, gain, pan)
    record(at, "delicate-contact", .075)


def build_score():
    # A restrained D/A pentatonic motif: isolated rounded mallet notes, no loop
    # of broadband whooshes, no constant hi-hat or dense drum accompaniment.
    for at, hz, gain, pan in [
        (.10, 146.832, .13, -.18), (1.72, 220., .105, .22),
        (2.62, 293.665, .095, -.24), (3.48, 220., .105, .18),
        (5.72, 440., .065, -.3), (6.48, 587.330, .055, .3),
        (7.20, 659.255, .045, -.18), (9.22, 293.665, .08, -.22),
        (9.68, 440., .065, .22), (12.18, 220., .065, -.3),
        (13.05, 293.665, .055, .3), (16.10, 220., .075, -.18),
    ]:
        add(music, at, pluck(hz, .85, 5.8, .10), gain, pan)
        record(at, "minimal-mallet-score", .85, frequencyHz=hz)
    # HEAVY: the strongest low transient, then two diminishing settlements.
    impact(.72, .94, 39., .9)
    impact(1.0, .34, 54., .44, -.08)
    impact(1.28, .20, 65., .32, .10)

    # A floor under load: increasing low wooden strain, then a small release.
    t = clock(.50)
    load = (np.sin(2 * np.pi * (65 * t + 8 * t * t)) * .38
            + np.sin(2 * np.pi * 131 * t) * .18
            + filtered_noise(.5, 160, 1600) * .11)
    load *= np.sin(np.pi * t / .5) ** .7
    load *= .66 + .34 * np.sin(2 * np.pi * 19 * t) ** 2
    add(physical, 4.35, load, .47)
    record(4.35, "floor-loading-creak", .5)
    impact(4.85, .24, 78., .30)
    record(4.85, "floor-release", .30)

    # LIGHT: widely spaced airy, pitched partials with a diffuse high shimmer.
    for j, (at, hz) in enumerate([(5.1, 1174.659), (5.52, 1760.),
                                  (6.02, 2349.318), (6.66, 1760.)]):
        length = min(1.18, 7.5 - at)
        t = clock(length)
        shimmer = (np.sin(2 * np.pi * hz * t)
                   + .26 * np.sin(2 * np.pi * hz * 1.502 * t)
                   + .07 * filtered_noise(length, 6500, 15000))
        shimmer *= np.exp(-t * 3.6) * envelope(t, .018, .20)
        add(physical, at, shimmer, .073 if j == 0 else .047,
            -.6 if j % 2 == 0 else .6)
    record(5.1, "light-airy-tonal-shimmer", 2.4)

    # FAST: an actual pitched acceleration, a dry arrival, slowing intervals.
    t = clock(.40)
    frequency = 270 * np.exp(np.log(7.5) * t / .40)
    rise = (np.sin(2 * np.pi * np.cumsum(frequency) / SR)
            + .15 * np.sin(4 * np.pi * np.cumsum(frequency) / SR))
    rise *= np.sin(np.pi * t / .40) ** .8
    add(physical, 8.12, rise, .18, -.08)
    record(8.12, "fast-sharp-pitch-rise", .40, fromHz=270, toHz=2025)
    impact(8.7, .67, 61., .52)
    for at, hz, gain in [(9.91, 980., .14), (10.045, 740., .12),
                          (10.25, 510., .19), (10.55, 330., .09)]:
        tap(at, hz, gain, .12)
    impact(10.25, .27, 83., .40)
    record(10.25, "fast-deceleration", .50)

    # SLOW: low, breathing harmonic atmosphere, not a transition whoosh.
    t = clock(2.8)
    slow_env = np.sin(np.pi * t / 2.8) ** 1.4
    for hz, gain, pan in [(146.832, .083, -.55), (220., .065, .5),
                           (293.665, .035, .05)]:
        signal = np.sin(2 * np.pi * hz * t + .13 * np.sin(t * 2.2))
        add(music, 11., signal * slow_env, gain, pan)
    add(physical, 11., filtered_noise(2.8, 650, 2500) * slow_env, .007, .1)
    record(11., "slow-breathing-atmosphere", 2.8)

    # Single droplet contact: falling resonant bubble with a tiny surface tick.
    t = clock(.33)
    phase = 2 * np.pi * (640 * t + 850 * .023 * (1 - np.exp(-t / .023)))
    drop = np.sin(phase) * np.exp(-t * 21) * envelope(t, .0008, .05)
    add(physical, 13.85, drop, .31, .12)
    tap(13.85, 2900, .055, -.2)
    record(13.85, "droplet-contact", .33)

    # ELASTIC: rising string tension, a clear snap, then damped spring accents.
    t = clock(.85)
    frequency = 150 + 180 * (t / .85) ** 1.7
    phase = 2 * np.pi * np.cumsum(frequency) / SR
    tension = (np.sin(phase) + .24 * np.sin(phase * 2.01)
               + .09 * np.sin(phase * 3.02))
    tension *= (.25 + .75 * t / .85) * envelope(t, .06, .012)
    add(physical, 14.3, tension, .17, -.14)
    record(14.3, "elastic-tension", .85)
    t = clock(.20)
    snap = filtered_noise(.2, 1800, 13500) * np.exp(-t * 115)
    snap += np.sin(2 * np.pi * (360 * t - 550 * t * t)) * np.exp(-t * 29)
    add(physical, 15.15, snap * envelope(t, .0003, .04), .39)
    record(15.15, "elastic-snap", .2)
    for at, hz, gain, pan in [(15.4, 220., .19, .3), (15.7, 146.832, .115, -.25)]:
        t = clock(.3)
        spring = np.sin(2 * np.pi * (hz * t + 8 * np.sin(18 * t) / 18))
        add(physical, at, spring * np.exp(-t * 18) * envelope(t), gain, pan)
        record(at, "elastic-damped-accent", .3)

    # Collapse: a compact falling body and a few grains, not a long crash tail.
    impact(16.7, .57, 45., .62)
    for at, hz, gain, pan in [(16.75, 340., .11, -.35),
                               (16.81, 720., .08, .25), (16.89, 430., .04, -.12)]:
        tap(at, hz, gain, pan)
    record(16.7, "collapse", .65)
    for at, hz, gain, pan in [(17.2, 1174.659, .105, -.4),
                               (17.4, 1468.324, .10, .3),
                               (17.6, 1760., .095, -.08)]:
        add(physical, at, pluck(hz, .62, 7., .06), gain, pan)
        record(at, "delicate-final-stagger", .62)
    # Warm D(add6/9) resolve. Low register stays soft, no triumphant loud sting.
    for hz, gain, pan in [(146.832, .16, -.15), (220., .12, .15),
                           (293.665, .105, -.4), (369.994, .085, .4),
                           (493.883, .065, -.12)]:
        t = clock(2.22)
        signal = (np.sin(2 * np.pi * hz * t)
                  + .12 * np.sin(2 * np.pi * 2 * hz * t))
        signal *= (1 - np.exp(-t * 18)) * np.exp(-t * .9)
        signal *= envelope(t, .005, .40)
        add(music, 17.6, signal, gain, pan)
    record(17.6, "final-warm-resolve", 2.22)

    # Subtle short stereo reflections only on tonal score, never on contacts.
    delay = round(.079 * SR)
    original = music.copy()
    music[delay:, 0] += .12 * original[:-delay, 1]
    music[delay:, 1] += .10 * original[:-delay, 0]
    mix = music + physical
    # A clean 120 ms silent end, with a preceding 100 ms fade to absolute zero.
    end = round(19.88 * SR)
    fade = round(.10 * SR)
    mix[end - fade:end] *= np.linspace(1, 0, fade)[:, None]
    mix[end:] = 0
    mix -= np.mean(mix, axis=0)[None, :]  # remove tiny synthesis DC bias
    mix[:96] *= np.linspace(0, 1, 96)[:, None]
    mix[end:] = 0
    mix *= .80 / np.max(np.abs(mix))
    return mix


def run(command):
    return subprocess.run(command, capture_output=True, text=True, check=True)


def write_pcm16(path, signal):
    with wave.open(str(path), "wb") as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(SR)
        output.writeframes(np.round(np.clip(signal, -1, 1) * 32767).astype("<i2").tobytes())


def measure(path):
    result = run(["ffmpeg", "-hide_banner", "-i", str(path), "-af",
                  "loudnorm=I=-14:TP=-1:LRA=11:print_format=json",
                  "-f", "null", "-"])
    text = result.stderr
    data = json.loads(text[text.rfind("{"):text.rfind("}") + 1])
    probe = json.loads(run(["ffprobe", "-v", "error", "-select_streams", "a:0",
                           "-show_entries", "stream=codec_name,sample_rate,channels,duration,duration_ts,time_base,bits_per_raw_sample:format=duration",
                           "-of", "json", str(path)]).stdout)
    return {"integratedLufs": float(data["input_i"]),
            "truePeakDbtp": float(data["input_tp"]),
            "loudnessRangeLu": float(data["input_lra"]),
            "thresholdLufs": float(data["input_thresh"]),
            "probe": probe}


def main():
    WAV.parent.mkdir(parents=True, exist_ok=True)
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    mix = build_score()
    assert mix.shape == (960_000, 2)
    attempts = []
    with tempfile.TemporaryDirectory(prefix="words-have-weight-audio-") as temporary:
        temp = Path(temporary)
        raw = temp / "synthesis.wav"
        master = temp / "master.wav"
        aac = temp / "verification.m4a"
        write_pcm16(raw, mix)
        # Dynamic loudness normalization preserves the quiet gaps while keeping
        # short physical accents present. Oversampled limiting reserves codec
        # headroom; all loudness reports below are post-master measurements.
        ceiling = -1.8
        gain = 0.
        for attempt in range(10):
            limit = 10 ** (ceiling / 20)
            filters = (
                "loudnorm=I=-14:TP=-1.8:LRA=9:linear=false,"
                f"volume={gain:.4f}dB,aresample=192000,"
                f"alimiter=limit={limit:.8f}:attack=1:release=45:level=false:latency=true,"
                "aresample=48000,apad=whole_dur=20,atrim=duration=20,"
                "afade=t=out:st=19.78:d=0.10"
            )
            run(["ffmpeg", "-hide_banner", "-y", "-i", str(raw), "-af", filters,
                 "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s24le", str(master)])
            run(["ffmpeg", "-hide_banner", "-y", "-i", str(master),
                 "-c:a", "aac", "-b:a", "320k", "-ar", str(SR),
                 "-ac", "2", "-t", "20", str(aac)])
            pcm_measure = measure(master)
            aac_measure = measure(aac)
            attempts.append({"attempt": attempt + 1, "gainDb": gain,
                             "limiterCeilingDb": ceiling,
                             "wavLufs": pcm_measure["integratedLufs"],
                             "wavDbtp": pcm_measure["truePeakDbtp"],
                             "aacLufs": aac_measure["integratedLufs"],
                             "aacDbtp": aac_measure["truePeakDbtp"]})
            good_peak = max(pcm_measure["truePeakDbtp"], aac_measure["truePeakDbtp"]) <= -1.
            good_loudness = max(abs(pcm_measure["integratedLufs"] + 14),
                                abs(aac_measure["integratedLufs"] + 14)) <= .10
            if good_peak and good_loudness:
                break
            if not good_peak:
                ceiling -= max(.15, aac_measure["truePeakDbtp"] + 1.15)
            gain += -14 - pcm_measure["integratedLufs"]
        else:
            raise RuntimeError("Master did not meet PCM and AAC targets: " + json.dumps(attempts))

        # Verify the actual decoded PCM data, not just a declared duration.
        decoded = subprocess.run(["ffmpeg", "-v", "error", "-i", str(master),
                                  "-f", "f32le", "-acodec", "pcm_f32le", "-"],
                                 capture_output=True, check=True).stdout
        samples = np.frombuffer(decoded, dtype="<f4").reshape(-1, 2)
        assert len(samples) == FRAMES
        assert np.max(np.abs(samples)) < 1
        assert np.max(np.abs(samples[-round(.10 * SR):])) == 0
        stream = pcm_measure["probe"]["streams"][0]
        assert int(stream["sample_rate"]) == SR and stream["channels"] == 2
        assert float(stream["duration"]) == DURATION
        # Write only the assigned retained WAV and JSON paths.
        WAV.write_bytes(master.read_bytes())
        report = {
            "source": "100% original deterministic numpy synthesis; no external assets, samples, or voiceover",
            "seed": SEED, "durationSeconds": DURATION, "sampleRateHz": SR,
            "channels": 2, "framesPerChannel": FRAMES, "pcmBitDepth": 24,
            "targetIntegratedLufs": -14, "loudnessToleranceLu": .10,
            "maximumTruePeakDbtp": -1, "wav": pcm_measure,
            "aacVerification": {"codec": "AAC-LC", "bitrateBitsPerSecond": 320000,
                                "retained": False, **aac_measure},
            "decodedWavSamplePeakDbfs": float(20 * math.log10(np.max(np.abs(samples)))),
            "last100msAbsolutePeak": float(np.max(np.abs(samples[-4800:]))),
            "masteringAttempts": attempts,
            "events": sorted(events, key=lambda entry: entry["timeSeconds"]),
            "verification": {"exact20SecondWav": True, "stereo48000Hz": True,
                             "wavLoudnessPassed": True, "aacLoudnessPassed": True,
                             "wavTruePeakPassed": True, "aacTruePeakPassed": True,
                             "cleanSilentEnding": True},
            "ffmpegVersion": run(["ffmpeg", "-version"]).stdout.splitlines()[0],
        }
        REPORT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
