from pathlib import Path
import unittest
import wave
import numpy as np
ROOT=Path(__file__).resolve().parents[2]
class AudioTest(unittest.TestCase):
    def test_v2_duration_and_silence(self):
        for name in ['music.wav','sfx.wav','mix-normalized.wav']:
            with wave.open(str(ROOT/'public/gajian-v2/audio'/name),'rb') as w:
                self.assertEqual((w.getframerate(),w.getnchannels(),w.getnframes()),(48000,2,1440000))
                width=w.getsampwidth();self.assertEqual(width,3)
                w.setpos(19*48000)
                self.assertEqual(np.count_nonzero(np.frombuffer(w.readframes(5*48000),dtype=np.uint8)),0)
if __name__=='__main__':unittest.main()
