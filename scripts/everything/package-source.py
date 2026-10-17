"""Package a self-contained editable Remotion film project, without frame caches."""
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parents[2]
out = root / 'out/everything-is-motion'
files = []
for folder in ['src/EverythingIsMotion', 'scripts/everything', 'public/everything-is-motion']:
    files.extend(p for p in (root/folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
for name in ['package.json', 'package-lock.json', 'tsconfig.json', 'remotion.config.ts', 'eslint.config.mjs']:
    files.append(root/name)
with zipfile.ZipFile(out/'everything-is-motion-source.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for p in files:
        z.write(p, 'everything-is-motion/'+str(p.relative_to(root)).replace('\\','/'))
    z.writestr('everything-is-motion/src/index.ts', 'import {registerRoot} from "remotion";\nimport {RemotionRoot} from "./Root";\nregisterRoot(RemotionRoot);\n')
    z.writestr('everything-is-motion/src/Root.tsx', 'import React from "react";\nimport {Composition} from "remotion";\nimport {EverythingIsMotion} from "./EverythingIsMotion";\nexport const RemotionRoot: React.FC = () => <Composition id="EverythingIsMotion" component={EverythingIsMotion} durationInFrames={1200} fps={60} width={1920} height={1080}/>;\n')
    if (out/'PRODUCTION.md').exists():
        z.write(out/'PRODUCTION.md', 'everything-is-motion/README.md')
    for name in ['LICENSE', 'OFL.txt']:
        p=root/'node_modules/@fontsource/space-grotesk'/name
        if p.exists():
            z.write(p, 'everything-is-motion/licenses/space-grotesk-'+name)
print(out/'everything-is-motion-source.zip')
