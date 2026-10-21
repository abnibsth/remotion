import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root=fileURLToPath(new URL('../../',import.meta.url));
const output=path.join(root,'gajian-motion/output');
const destination=path.join(output,'gajian-editable-source.zip');
const files=['src/Gajian','scripts/gajian','public/gajian/audio','gajian-motion/README.md','package.json','package-lock.json','tsconfig.json','remotion.config.ts','SKILL.md'];
await Promise.all(files.map(file=>fs.access(path.join(root,file))));
// Python stdlib zipfile receives explicit local project paths; no downloaded code.
const code=`import sys,zipfile,pathlib
root=pathlib.Path(sys.argv[1]); target=pathlib.Path(sys.argv[2])
with zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for name in sys.argv[3:]:
  p=root/name
  for f in (sorted(p.rglob('*')) if p.is_dir() else [p]):
   if f.is_file() and '__pycache__' not in f.parts: z.write(f,f.relative_to(root))
with zipfile.ZipFile(target) as z:
 assert z.testzip() is None
 print(str(target),len(z.namelist()),'files; archive integrity passed')`;
const result=spawnSync('python',['-I','-c',code,root,destination,...files],{cwd:root,stdio:'inherit'});
if(result.status!==0)throw new Error('Source packaging failed');
