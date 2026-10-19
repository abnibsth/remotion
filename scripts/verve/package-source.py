"""Create a self-contained editable subset; do not include other films or secrets."""
from pathlib import Path
import json
import zipfile
root=Path(__file__).resolve().parents[2]
out=root/'out/verve-commercial'
archive=out/'product-commercial-source.zip'
if archive.exists():
    with zipfile.ZipFile(archive) as previous:
        assert previous.testzip() is None
        print(f'Refreshing previously generated source archive ({len(previous.namelist())} entries).')
package=json.loads((root/'package.json').read_text(encoding='utf-8'))
package['name']='verve-product-commercial'
package['scripts']={k:v for k,v in package['scripts'].items() if k.startswith('verve:')}
package['scripts']['dev']='remotion studio src/Verve/entry.tsx'
package['scripts']['render:remotion']='remotion render src/Verve/entry.tsx VerveCommercial out/verve-remotion.mp4'
files=[*sorted((root/'src/Verve').glob('*')),*sorted((root/'scripts/verve').glob('*')),*sorted((root/'public/product-commercial/verve').glob('*')),root/'tsconfig.json']
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
    for p in files:
        if p.is_file():z.write(p,p.relative_to(root))
    z.writestr('package.json',json.dumps(package,indent=2))
    z.writestr('START-HERE.txt','Run npm install, then npm run dev. Standalone entry: src/Verve/entry.tsx. See src/Verve/PRODUCTION.md for production commands, source limitations and asset permission/provenance. Rendered exports are supplied separately.\n')
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    print(f'Editable source: {archive}; {len(z.namelist())} files; archive integrity PASS')
