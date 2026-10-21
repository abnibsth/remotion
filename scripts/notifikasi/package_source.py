"""Package only editable video sources/assets; never include .env or unrelated work."""
from pathlib import Path
import zipfile
import argparse

parser=argparse.ArgumentParser()
parser.add_argument('--fps',type=int,choices=[30,60],default=30)
args=parser.parse_args()
root=Path(__file__).resolve().parents[2]
delivery=root/'out'/('notifikasi-overload-60fps' if args.fps==60 else 'notifikasi-overload')
output=delivery/'notifikasi-overload-source.zip'
standalone_root='''import {Composition, Folder} from 'remotion';
import {NotifikasiOverload, HookScene, ComingScene, ChaosScene, BreakdownScene, SilenceScene, SolutionScene, PayoffScene} from './Notifikasi';
export const RemotionRoot = () => <>
  <Composition id="NotifikasiOverload" component={NotifikasiOverload} durationInFrames={600} fps={30} width={1080} height={1920}/>
  <Composition id="NotifikasiOverload60" component={NotifikasiOverload} durationInFrames={1200} fps={60} width={1080} height={1920}/>
  <Folder name="Notifikasi-Scenes">
    <Composition id="Notifikasi-Hook" component={HookScene} durationInFrames={75} fps={30} width={1080} height={1920}/>
    <Composition id="Notifikasi-Coming" component={ComingScene} durationInFrames={90} fps={30} width={1080} height={1920}/>
    <Composition id="Notifikasi-Chaos" component={ChaosScene} durationInFrames={120} fps={30} width={1080} height={1920}/>
    <Composition id="Notifikasi-Breakdown" component={BreakdownScene} durationInFrames={90} fps={30} width={1080} height={1920}/>
    <Composition id="Notifikasi-Silence" component={SilenceScene} durationInFrames={90} fps={30} width={1080} height={1920}/>
    <Composition id="Notifikasi-Solution" component={SolutionScene} durationInFrames={75} fps={30} width={1080} height={1920}/>
    <Composition id="Notifikasi-Payoff" component={PayoffScene} durationInFrames={60} fps={30} width={1080} height={1920}/>
  </Folder>
</>;
'''
files=[]
for directory in ['src/Notifikasi','scripts/notifikasi','public/notifikasi']:
    files.extend(p for p in (root/directory).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
files.extend(root/p for p in ['package.json','package-lock.json','tsconfig.json','remotion.config.ts','eslint.config.mjs','src/index.ts'])
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
    for file in files:
        archive.write(file,file.relative_to(root).as_posix())
    archive.writestr('src/Root.tsx',standalone_root)
    archive.write(root/'src/Notifikasi/README.md','README.md')
    archive.writestr('.gitignore','node_modules\nout\n.cache\n.env*\n')
    for name in ['verification.json','preview-check.json','audio-report.json','contact-sheet.png','transition-check.png']:
        file=delivery/name
        if file.exists(): archive.write(file,'production-qc/'+name)
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    assert 'src/Root.tsx' in archive.namelist()
    assert not any(name.startswith('.env') for name in archive.namelist())
print(f'SOURCE ZIP VERIFIED: {output} ({output.stat().st_size} bytes, {len(files)+3} source entries + QC)')
