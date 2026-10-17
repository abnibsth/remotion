"""Audio-only regression checks; run after `python -B scripts/gajian/audio.py`."""
import hashlib
import json
from pathlib import Path
import unittest
import wave

import numpy as np

import importlib.util

spec = importlib.util.spec_from_file_location('gajian_audio', Path(__file__).with_name('audio.py'))
audio = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audio)


class GajianAudioTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.music, cls.sfx, cls.events = audio.synthesize()

    def test_exact_duration_stereo_finite_and_no_clipping(self):
        for bus in (self.music, self.sfx, self.music + self.sfx):
            self.assertEqual(bus.shape, (1_440_000, 2))
            self.assertTrue(np.isfinite(bus).all())
            self.assertLess(np.max(np.abs(bus)), 1)
        self.assertGreater(np.max(np.abs(self.sfx[:, 0] - self.sfx[:, 1])), 0.01)

    def test_seed_reproduces_every_sample(self):
        music, sfx, events = audio.synthesize()
        self.assertEqual(hashlib.sha256(music.tobytes()).digest(), hashlib.sha256(self.music.tobytes()).digest())
        self.assertEqual(hashlib.sha256(sfx.tobytes()).digest(), hashlib.sha256(self.sfx.tobytes()).digest())
        self.assertEqual(events, self.events)

    def test_abrupt_music_cut_and_digital_silence(self):
        self.assertGreater(np.max(np.abs(self.music[19 * audio.SR:20 * audio.SR])), 0.05)
        self.assertEqual(np.count_nonzero(self.music[20 * audio.SR:]), 0)
        self.assertEqual(np.count_nonzero(self.sfx[20 * audio.SR:round(20.7 * audio.SR)]), 0)
        ambience = self.sfx[round(20.75 * audio.SR):round(21.2 * audio.SR)]
        self.assertGreater(np.sqrt(np.mean(ambience ** 2)), 1e-7)
        self.assertLess(np.sqrt(np.mean(ambience ** 2)), 0.0001)

    def test_every_requested_cue_is_sample_accurate(self):
        expected = [0.7, 1.6, 2.5, 4.4, 8.0, 9.0, 10.1, 11.2, 12.4,
                    14.35, 15.25, 16.15, 17.05, 18.25, 19.4,
                    21.3, 23.1, 25.3, 26.35, 27.0, 28.6]
        cue_times = [event['time'] for event in self.events if event['category'] == 'cue']
        self.assertEqual(cue_times, expected)
        for event in self.events:
            self.assertEqual(event['sample'], round(event['time'] * audio.SR))
        for at in expected:
            segment = self.sfx[round(at * audio.SR):round((at + 0.15) * audio.SR)]
            self.assertGreater(np.max(np.abs(segment)), 0.002, f'Inaudible cue at {at}')

    def test_rendered_wavs_and_measured_master_meet_delivery_spec(self):
        assets = Path(audio.ASSETS)
        for name in ('music.wav', 'sfx.wav', 'mix.wav', 'mix-normalized.wav'):
            with wave.open(str(assets / name), 'rb') as wav:
                self.assertEqual(wav.getframerate(), 48_000)
                self.assertEqual(wav.getnchannels(), 2)
                self.assertEqual(wav.getnframes(), 1_440_000)
                self.assertEqual(wav.getsampwidth(), 3)
            data = audio.read_pcm24(assets / name)
            self.assertLess(np.max(np.abs(data)), 1)
            self.assertEqual(np.count_nonzero(data[960_000:993_600]), 0)
        report = json.loads((assets / 'loudness-report.json').read_text(encoding='utf-8'))
        measured = report['files']['mix-normalized.wav']['loudness']
        self.assertLessEqual(abs(float(measured['input_i']) + 14), 0.3)
        self.assertLessEqual(float(measured['input_tp']), -1.0)
        self.assertTrue(report['validation']['all_passed'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
