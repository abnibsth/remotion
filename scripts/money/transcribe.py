"""Local-only word timing for the user-supplied narration. No API or download."""
import argparse
import json
from pathlib import Path
from faster_whisper import WhisperModel

parser = argparse.ArgumentParser()
parser.add_argument('audio')
parser.add_argument('output')
args = parser.parse_args()
model = WhisperModel('small', device='cpu', compute_type='int8', local_files_only=True)
segments, info = model.transcribe(args.audio, language='id', beam_size=5, word_timestamps=True, condition_on_previous_text=False)
result = {'language': info.language, 'duration': info.duration, 'segments': []}
for segment in segments:
    result['segments'].append({'text': segment.text, 'start': segment.start, 'end': segment.end, 'words': [{'text': w.word, 'start': w.start, 'end': w.end, 'confidence': w.probability} for w in segment.words or []]})
    print(f'{segment.start:.2f}-{segment.end:.2f}: {segment.text}', flush=True)
Path(args.output).write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
