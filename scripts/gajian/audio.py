"""Original 120 BPM comic-pop score/foley; deterministic NumPy, no samples/network.

Run: python -B scripts/gajian/audio.py
Outputs stay entirely in public/gajian/audio. FFmpeg performs two-pass EBU R128
normalization and independent true-peak verification; Python/NumPy synthesize
all instruments, including the deliberately exposed post-cut comedy cues.
"""
from pathlib import Path
import hashlib
import json
import shutil
import subprocess
import wave

import numpy as np

SR = 48_000
DURATION = 30
N = SR * DURATION
SEED = 314159
BPM = 120
ASSETS = Path(__file__).resolve().parents[2] / 'public' / 'gajian' / 'audio'
TARGET_I = -14
TARGET_TP = -1.1  # 0.1 dB delivery margin under the requested -1 dBTP ceiling.


def clock(length):
    return np.arange(round(length * SR), dtype=np.float64) / SR


def envelope(t, length, attack=0.003, release=0.025):
    return np.minimum(1, t / attack) * np.clip((length - t) / release, 0, 1)


def pitched(freq, length, decay=5, harmonics=(1, .28, .10), attack=.003):
    t = clock(length)
    signal = sum(amp * np.sin(2 * np.pi * freq * (h + 1) * t)
                 for h, amp in enumerate(harmonics))
    return signal * np.exp(-t * decay) * envelope(t, length, attack)


def glide(start_hz, end_hz, length, decay=4, brightness=.2):
    t = clock(length)
    # Integrating instantaneous frequency keeps even steep glides phase-continuous.
    f = np.linspace(start_hz, end_hz, len(t))
    phase = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(phase) + brightness * np.sin(2 * phase)) * np.exp(-t * decay) * envelope(t, length)


def brass(freq, length=.20, fall=0):
    t = clock(length)
    f = freq * (1 + .005 * np.sin(2 * np.pi * 5.5 * t)) - fall * t / length
    phase = 2 * np.pi * np.cumsum(f) / SR
    signal = sum(np.sin(h * phase) * (1 / h ** 1.25) for h in range(1, 9))
    return np.tanh(signal * 1.3) * envelope(t, length, .012, .07) * np.exp(-t * 1.8)


class Composer:
    def __init__(self):
        self.rng = np.random.default_rng(SEED)
        self.music = np.zeros((N, 2), dtype=np.float64)
        self.sfx = np.zeros_like(self.music)
        self.events = []

    def noise(self, length):
        return self.rng.standard_normal(round(length * SR))

    def add(self, bus, at, signal, gain=1, pan=0):
        first = round(at * SR)
        if first < 0 or first >= N:
            raise ValueError(f'Invalid start time: {at}')
        count = min(len(signal), N - first)
        weights = np.array([np.cos((pan + 1) * np.pi / 4),
                            np.sin((pan + 1) * np.pi / 4)])
        bus[first:first + count] += signal[:count, None] * gain * weights

    def event(self, at, name, length, description, category='cue'):
        self.events.append({'time': at, 'sample': round(at * SR), 'name': name,
                            'duration': length, 'category': category,
                            'description': description})

    def kick(self):
        t = clock(.28)
        phase = 2 * np.pi * (47 * t + 100 * .018 * (1 - np.exp(-t / .018)))
        return (np.sin(phase) * np.exp(-t * 17) + self.noise(.28) * .10 * np.exp(-t * 280)) * envelope(t, .28, .001)

    def snare(self):
        t = clock(.19)
        noise = self.noise(.19)
        return ((noise - np.roll(noise, 1)) * .36 * np.exp(-t * 25)
                + np.sin(2 * np.pi * 185 * t) * .42 * np.exp(-t * 27)) * envelope(t, .19, .001)

    def hat(self, length=.055):
        t = clock(length)
        noise = self.noise(length)
        return (noise - np.roll(noise, 1)) * np.exp(-t * 70) * envelope(t, length, .001, .01)

    def impact(self, at, weight=.45, pan=0):
        t = clock(.42)
        low = glide(105, 35, .42, 11)
        crack = self.noise(.42) * np.exp(-t * 65) * envelope(t, .42, .001)
        self.add(self.sfx, at, low + crack * .24, weight, pan)

    def paper(self, length=.16):
        t = clock(length)
        n = self.noise(length)
        return (n - np.roll(n, 2)) * np.sin(np.pi * t / length) ** 2 * .45

    def score(self):
        # Original eight-bar A-minor/D-minor/E-dominant hook. Fixed 0.5s beat;
        # tension increases through density/register, never by drifting tempo.
        roots = [55, 55, 73.4162, 82.4069, 55, 73.4162, 82.4069, 82.4069]
        hook = [440, 523.251, 659.255, 587.330, 523.251, 440, 415.305, 493.883]
        bass_pattern = [(0, 1, .16), (.375, 1, .11), (.75, 2, .12),
                        (1.25, 1, .17), (1.625, 1.5, .10)]
        for beat in range(40):
            at = beat * .5
            intensity = .62 if at < 2.5 else .86 if at < 8 else 1.0
            self.add(self.music, at, self.kick(), .32 * intensity)
            if beat % 2:
                self.add(self.music, at, self.snare(), .25 * intensity, .08)
            spacing = .25 if at < 8 else .125
            for index, off in enumerate(np.arange(0, .5, spacing)):
                self.add(self.music, at + off, self.hat(), (.035 if index == 0 else .021) * intensity,
                         -.45 if index % 2 else .45)
            if at >= 8 and beat % 4 == 3:
                self.add(self.music, at + .375, self.kick(), .20)
            if at >= 14 and beat % 2:
                self.add(self.music, at + .25, self.snare(), .10, -.30)
            if at >= 17:
                self.add(self.music, at + .375, self.snare(), .12, .25)

        for bar in range(10):
            at = bar * 2
            root = roots[bar % 8]
            for off, multiple, length in bass_pattern:
                self.add(self.music, at + off, pitched(root * multiple, length, 5, (1, .36, .17, .06)), .24)
            if at >= 2:
                for j, off in enumerate([.25, .875, 1.5]):
                    f = hook[(bar * 2 + j) % len(hook)]
                    self.add(self.music, at + off, brass(f, .18), .072, -.28)
                    self.add(self.music, at + off, brass(f * .75, .18), .040, .30)
            for j, off in enumerate([.125, .625, 1.125, 1.75]):
                f = root * [8, 12, 10, 12][j]
                self.add(self.music, at + off, pitched(f, .10, 23, (1, .3, .15)), .050, (-1) ** j * .38)
            if at >= 8:
                for j in range(8):
                    f = [440, 523.251, 659.255, 830.609][j % 4] * (2 if at >= 16 else 1)
                    self.add(self.music, at + j * .25, pitched(f, .11, 24, (1, .16)), .020 + .0015 * (at - 8), (-1) ** j * .55)

        t = clock(12)
        rising_phase = 2 * np.pi * (135 * t + 16 * t ** 2)
        riser = (np.sin(rising_phase) * .09 + self.noise(12) * .025)
        riser *= (t / 12) ** 1.8 * envelope(t, 12, .08, .002)
        self.add(self.music, 8, riser, .65, .1)
        self.event(8, 'tension-rise', 12, 'Increasing subdivisions, snare fills and rising original synth; fixed 120 BPM.', 'music')

    def cues(self):
        # Notification: bright two-note phone chime, not an existing platform sound.
        self.add(self.sfx, .7, pitched(1318.51, .44, 10, (1, .13)), .21, -.2)
        self.add(self.sfx, .79, pitched(1760, .35, 11, (1, .10)), .17, .2)
        self.event(.7, 'notification', .44, 'Original two-note payday notification.')

        self.add(self.sfx, 1.6, self.paper(.18), .15, -.15)
        for j, f in enumerate([1568, 1975.53, 2637.02]):
            self.add(self.sfx, 1.6 + j * .07, pitched(f, .36, 12, (1, .23)), .18, -.3 + j * .3)
        self.event(1.6, 'cash', .5, 'Cash-register-style coin cascade and paper flutter.')

        self.impact(2.5, .48)
        for j in range(7):
            self.add(self.sfx, 2.5 + j * .035, self.paper(.075), .10, -.7 + j * .23)
        self.add(self.sfx, 2.5, brass(220, .30), .16, -.15)
        self.event(2.5, 'bass-confetti', .5, 'Bass hit, tiny stereo paper pops, celebratory brass.')

        self.add(self.sfx, 4.4, glide(700, 1700, .26, 7), .12, -.45)
        for j, f in enumerate([1760, 2217.46, 2637.02]):
            self.add(self.sfx, 4.4 + j * .075, pitched(f, .45, 9, (1, .10)), .115, j * .4 - .4)
        self.event(4.4, 'luxury-sunglasses', .60, 'Polished sunglasses swipe and sparkling luxury glint.')

        for off in (0, .17):
            self.add(self.sfx, 8 + off, brass(830.609, .15, 80), .18, -.1)
        self.event(8.0, 'warning', .32, 'Double short warning brass, entering tension section.')
        for index, at in enumerate([9.0, 10.1, 11.2, 12.4]):
            self.impact(at, .39 + index * .035, (-1) ** index * .18)
            self.add(self.sfx, at, pitched(740 - index * 95, .18, 18), .12)
            self.event(at, 'expense-impact', .42, f'Expense {index + 1}: progressively heavier receipt punch.')

        for index, at in enumerate([14.35, 15.25, 16.15, 17.05, 18.25]):
            self.add(self.sfx, at, glide(620 - index * 55, 150 - index * 12, .26, 8), .22, (-1) ** index * .25)
            self.add(self.sfx, at, self.paper(.12), .14)
            self.event(at, 'deduction', .35, f'Deduction {index + 1}: downward rubbery debit and paper tick.')
        self.impact(19.4, .52)
        self.add(self.sfx, 19.4, brass(146.832, .50, 45), .18)
        self.event(19.4, 'last-deduction-landing', .60, 'Final deduction lands; all tails stop at 20.000s.')

        # A true 700ms silence is enforced after all synthesis/normalization.
        self.event(20.0, 'hard-cut', .7, 'All music/effects cut at sample 960000; digital silence until 20.7s.', 'structure')
        t = clock(9.3)
        room = self.noise(9.3) * .000022
        room += np.sin(2 * np.pi * 83 * t) * .000007
        self.add(self.sfx, 20.7, room * envelope(t, 9.3, .15, .8), 1, -.15)
        self.event(20.7, 'quiet-ambience', 9.3, 'Extremely quiet synthetic room air, no rhythmic bed or musical pad.', 'ambience')
        t = clock(.17)
        f = 1320 + 400 * np.sin(np.pi * t / .17)
        squeak = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / .17) ** 2
        self.add(self.sfx, 21.3, squeak, .028, .25)
        self.event(21.3, 'tiny-squeak', .17, 'Tiny embarrassed rubber squeak, alone over near-inaudible air.')

        t = clock(1.65)
        piano = np.zeros_like(t)
        # Stiff-string inharmonic partials with individually damped envelopes.
        for h, amplitude in enumerate([1, .43, .19, .10, .05], 1):
            freq = 220 * h * np.sqrt(1 + .00028 * h * h)
            piano += amplitude * np.sin(2 * np.pi * freq * t) * np.exp(-t * (2.9 + h * .85))
        self.add(self.sfx, 23.1, piano * envelope(t, 1.65, .002, .25), .15, -.10)
        self.event(23.1, 'isolated-sad-piano', 1.65, 'Single exposed A3 piano-like note; no accompanying melody/chord.')

        self.add(self.sfx, 25.3, self.paper(.20), .16, -.35)
        self.add(self.sfx, 25.3, pitched(1050, .09, 40), .09, .20)
        self.event(25.3, 'calendar', .20, 'Dry calendar-page flick and tiny date tick.')
        self.add(self.sfx, 26.35, self.paper(.14), .13, -.15)
        self.add(self.sfx, 26.35, glide(155, 65, .22, 15), .13)
        self.event(26.35, 'wallet', .22, 'Empty-wallet leather/paper flap with hollow low pop.')
        self.add(self.sfx, 27, brass(220, .92, 94), .17, -.13)
        self.event(27.0, 'sad-trombone', .92, 'Original descending muted trombone-like wah; no borrowed tune.')
        self.add(self.sfx, 28.6, pitched(220, .80, 5, (1, .08), .025), .038)
        self.add(self.sfx, 28.6, self.paper(.12), .016, .25)
        self.event(28.6, 'soft-end', .80, 'Soft low pluck and small paper settle, fading to digital zero.')

    def finish(self):
        cut = 20 * SR
        # 2ms de-click is perceptually abrupt; no residual reverb past boundary.
        for bus in (self.music, self.sfx):
            bus[cut - 96:cut] *= np.linspace(1, 0, 96)[:, None]
        self.music[cut:] = 0
        self.sfx[cut:round(20.7 * SR)] = 0
        self.sfx[-round(.2 * SR):] *= np.linspace(1, 0, round(.2 * SR))[:, None]
        # One shared gain preserves stem summation; never clip individual stems.
        peak = max(np.max(np.abs(self.music)), np.max(np.abs(self.sfx)),
                   np.max(np.abs(self.music + self.sfx)))
        gain = min(1.0, .86 / peak)
        self.music *= gain
        self.sfx *= gain
        return self.music, self.sfx, sorted(self.events, key=lambda e: e['time'])


def synthesize():
    composer = Composer()
    composer.score()
    composer.cues()
    return composer.finish()


def write_wav(path, data):
    if data.shape != (N, 2) or not np.isfinite(data).all():
        raise ValueError('Expected finite 30-second stereo audio')
    if np.max(np.abs(data)) >= 1:
        raise ValueError(f'Refusing clipped output: {path}')
    pcm = np.rint(data * 8388607).astype('<i4').reshape(-1)
    packed = np.column_stack((pcm & 255, (pcm >> 8) & 255, (pcm >> 16) & 255)).astype(np.uint8)
    with wave.open(str(path), 'wb') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(3)
        wav.setframerate(SR)
        wav.writeframes(packed.tobytes())


def read_pcm24(path):
    with wave.open(str(path), 'rb') as wav:
        if (wav.getnchannels(), wav.getsampwidth(), wav.getframerate()) != (2, 3, SR):
            raise ValueError('Expected stereo 48kHz PCM24')
        raw = np.frombuffer(wav.readframes(wav.getnframes()), dtype=np.uint8).reshape(-1, 3).astype(np.int32)
    pcm = raw[:, 0] | (raw[:, 1] << 8) | (raw[:, 2] << 16)
    pcm = (pcm ^ 0x800000) - 0x800000
    return pcm.reshape(-1, 2).astype(np.float64) / 8388607


def ffmpeg(*args):
    return subprocess.run(['ffmpeg', '-hide_banner', '-nostdin', *args],
                          capture_output=True, check=True)


def loudness(path):
    result = ffmpeg('-i', str(path), '-af',
                    f'loudnorm=I={TARGET_I}:TP={TARGET_TP}:LRA=11:print_format=json', '-f', 'null', '-')
    log = result.stderr.decode('utf-8', errors='replace')
    return json.loads(log[log.rfind('{'):log.rfind('}') + 1]), log


def normalize(source, destination):
    first, first_log = loudness(source)
    settings = (f'loudnorm=I={TARGET_I}:TP={TARGET_TP}:LRA=11:'
                f"measured_I={first['input_i']}:measured_TP={first['input_tp']}:"
                f"measured_LRA={first['input_lra']}:measured_thresh={first['input_thresh']}:"
                f"offset={first['target_offset']}:linear=false:print_format=json")
    # Decode directly into an in-memory float buffer, avoiding temporary assets
    # and extensible WAV headers unsupported by Python 3.10's wave module.
    second = ffmpeg('-i', str(source), '-af', settings + ',aresample=48000,apad=whole_dur=30,atrim=duration=30',
                    '-ar', str(SR), '-ac', '2', '-f', 'f64le', '-')
    data = np.frombuffer(second.stdout, dtype='<f8').copy().reshape(-1, 2)
    # Resampling can pre-ring a few samples into silent boundaries. Restore
    # the exact creative silence, then measure the actual final exported WAV.
    data[20 * SR:round(20.7 * SR)] = 0
    data[-1] = 0
    write_wav(destination, data)
    log = first_log + '\nSECOND PASS\n' + second.stderr.decode('utf-8', errors='replace')
    # loudnorm's internal meter precedes the final 48kHz resampler. Its reported
    # true peak is not the delivered true peak. Correct against actual PCM and
    # limit at 192kHz with 0.41dB margin for the final downsampling reconstruction.
    for attempt in range(5):
        measured, measurement_log = loudness(destination)
        log += f'\nDELIVERY MEASUREMENT {attempt}\n' + measurement_log
        correction = TARGET_I - float(measured['input_i'])
        if abs(correction) <= .08 and float(measured['input_tp']) <= -1:
            break
        filters = (f'volume={correction:.4f}dB,aresample=192000,'
                   'alimiter=limit=0.85:level=false:latency=true,aresample=48000,'
                   'apad=whole_dur=30,atrim=duration=30')
        adjusted = ffmpeg('-i', str(destination), '-af', filters,
                          '-ar', str(SR), '-ac', '2', '-f', 'f64le', '-')
        data = np.frombuffer(adjusted.stdout, dtype='<f8').copy().reshape(-1, 2)
        data[20 * SR:round(20.7 * SR)] = 0
        data[-1] = 0
        write_wav(destination, data)
        log += f'\nMEASURED GAIN CORRECTION {correction:.4f} dB / OVERSAMPLED LIMITER\n'
    (ASSETS / 'normalization.log').write_text(log, encoding='utf-8')
    return first


def rms_db(data):
    return float(20 * np.log10(max(1e-12, np.sqrt(np.mean(data ** 2)))))


def main():
    if not shutil.which('ffmpeg'):
        raise SystemExit('FFmpeg is required for measured -14 LUFS / -1 dBTP delivery.')
    ASSETS.mkdir(parents=True, exist_ok=True)
    music, sfx, events = synthesize()
    for name, data in [('music.wav', music), ('sfx.wav', sfx), ('mix.wav', music + sfx)]:
        write_wav(ASSETS / name, data)
    (ASSETS / 'events.json').write_text(json.dumps({
        'sample_rate': SR, 'duration': DURATION, 'bpm': BPM, 'seed': SEED,
        'originality': '100% original NumPy synthesis; no external samples, recordings, melodies or network.',
        'mixing': 'music.wav + sfx.wav = mix.wav (within PCM24 quantization); use mix-normalized.wav for delivery. Do not stack mix with stems.',
        'music_stop': 20, 'digital_silence': [20, 20.7], 'events': events,
    }, indent=2), encoding='utf-8')
    first = normalize(ASSETS / 'mix.wav', ASSETS / 'mix-normalized.wav')
    files = {}
    for name in ('music.wav', 'sfx.wav', 'mix.wav', 'mix-normalized.wav'):
        path = ASSETS / name
        data = read_pcm24(path)
        measured, _ = loudness(path)
        files[name] = {
            'sample_rate': SR, 'channels': 2, 'bit_depth': 24, 'frames': len(data),
            'duration': len(data) / SR, 'sample_peak_dbfs': float(20 * np.log10(np.max(np.abs(data)))),
            'loudness': measured, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
            'silence_20_to_20_7_nonzero_samples': int(np.count_nonzero(data[960000:993600])),
            'ambience_20_75_to_21_2_rms_dbfs': rms_db(data[996000:1017600]),
        }
    final = files['mix-normalized.wav']['loudness']
    checks = {
        'exact_30s_48k_stereo_pcm24': all(item['frames'] == N for item in files.values()),
        'silence_is_digital_zero': all(item['silence_20_to_20_7_nonzero_samples'] == 0 for item in files.values()),
        'music_silent_from_20': not np.any(read_pcm24(ASSETS / 'music.wav')[20 * SR:]),
        'loudness_within_0_3_lu_of_minus_14': abs(float(final['input_i']) + 14) <= .3,
        'true_peak_at_or_below_minus_1': float(final['input_tp']) <= -1,
        'all_files_unclipped': all(float(item['loudness']['input_tp']) < 0 for item in files.values()),
        'normalized_ambience_below_minus_65_dbfs': files['mix-normalized.wav']['ambience_20_75_to_21_2_rms_dbfs'] < -65,
    }
    report = {
        'source': 'Original seeded NumPy synthesis, no external recordings/samples.',
        'python_dependencies': {'numpy': np.__version__},
        'ffmpeg': ffmpeg('-version').stdout.decode('utf-8').splitlines()[0],
        'normalization': {'method': 'FFmpeg two-pass loudnorm plus measured gain correction and 192kHz safety limiter; independently remeasured after exact silence restoration',
                          'target_lufs': TARGET_I, 'delivery_ceiling_dbtp': -1,
                          'processing_ceiling_dbtp': TARGET_TP, 'first_pass': first},
        'files': files, 'validation': {**checks, 'all_passed': all(checks.values())},
        'constraints': ['No voice-over or licensed/reference melody included.',
                        '48kHz PCM24 delivery; loudness/true-peak values apply to WAV, not a later lossy encode.',
                        'Post-cut sad piano and trombone are isolated foley on sfx.wav; music.wav remains zero after 20s.',
                        'Deterministic for a fixed NumPy/FFmpeg toolchain; different FFmpeg versions may vary normalized PCM.'],
    }
    (ASSETS / 'loudness-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps({'files': {name: {'duration': item['duration'], 'lufs': item['loudness']['input_i'],
                                     'true_peak_dbtp': item['loudness']['input_tp']}
                               for name, item in files.items()}, 'validation': report['validation']}, indent=2))
    if not checks or not all(checks.values()):
        raise SystemExit('Audio validation failed; inspect public/gajian/audio/loudness-report.json')


if __name__ == '__main__':
    main()
