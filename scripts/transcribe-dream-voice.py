"""Transcribe the provided recording locally; never sends audio to a speech API."""
import argparse
import json
from pathlib import Path
from faster_whisper import WhisperModel

parser = argparse.ArgumentParser()
parser.add_argument("audio")
parser.add_argument("output")
parser.add_argument("--model", default="small")
args = parser.parse_args()
model = WhisperModel(args.model, device="cpu", compute_type="int8")
segments, info = model.transcribe(
    args.audio, language="id", beam_size=5, word_timestamps=True,
    initial_prompt="Pixel Quest. Penjaga Mimpi. Kristal Mimpi. Otak, ingatan, emosi, tidur REM.",
    condition_on_previous_text=False,
)
result = {"language": info.language, "duration": info.duration, "segments": []}
for segment in segments:
    words = [{"text": word.word, "startMs": round(word.start * 1000), "endMs": round(word.end * 1000),
              "timestampMs": round((word.start + word.end) * 500), "confidence": word.probability}
             for word in segment.words or []]
    result["segments"].append({"text": segment.text, "start": segment.start, "end": segment.end, "words": words})
    print(f"{segment.start:.2f}-{segment.end:.2f}: {segment.text}", flush=True)
output = Path(args.output)
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Saved {len(result['segments'])} locally transcribed segments.", flush=True)
