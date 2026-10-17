"""Package V2 plus explicitly shared V1 helper source; no V1 render output."""
from pathlib import Path
import zipfile
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'gajian-motion/v2/output/gajian-v2-editable-source.zip'
items=['src/GajianV2','scripts/gajian-v2','src/Gajian/motion.mjs','src/Gajian/motion.d.mts','scripts/gajian/audio.py','public/gajian-v2/audio','gajian-motion/v2/CHANGELOG.md','package.json','package-lock.json','tsconfig.json','remotion.config.ts','SKILL.md']
with zipfile.ZipFile(OUT,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for name in items:
        p=ROOT/name
        for f in (sorted(p.rglob('*')) if p.is_dir() else [p]):
            if f.is_file() and '__pycache__' not in f.parts:z.write(f,f.relative_to(ROOT))
with zipfile.ZipFile(OUT) as z:
    assert z.testzip() is None
    print(OUT,len(z.namelist()),'files; integrity passed')
