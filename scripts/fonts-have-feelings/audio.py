"""Original four-voice score, deterministic synthesis. No external recordings.
Run: python -I scripts/fonts-have-feelings/audio.py
"""
import json
import subprocess
from pathlib import Path
import numpy as np

OUT=Path(__file__).resolve().parents[2]/'public/fonts-have-feelings/audio'
OUT.mkdir(parents=True,exist_ok=True)
SR=48000
N=20*SR
rng=np.random.default_rng(23102026)
stems={k:np.zeros((N,2),dtype=np.float64) for k in ['score','bold','italic','serif','monospace']}

def ff(args,data=None):
    r=subprocess.run(['ffmpeg','-hide_banner','-nostdin','-y',*map(str,args)],input=data,capture_output=True)
    if r.returncode:raise RuntimeError(r.stderr.decode(errors='replace')[-5000:])
    return r

def add(name,at,signal,gain=1,pan=0):
    i=round(at*SR);n=min(len(signal),N-i)
    stems[name][i:i+n]+=signal[:n,None]*np.sqrt([(1-pan)/2,(1+pan)/2])*gain

def env(t,d,a=.004,r=.04):
    return np.clip(t/a,0,1)*np.clip((d-t)/r,0,1)

def note(name,at,midi,d,gain=.1,pan=0,glass=False):
    t=np.arange(round(d*SR))/SR;f=440*2**((midi-69)/12)
    s=np.sin(2*np.pi*f*t)+.23*np.sin(2*np.pi*f*2*t)
    if glass:s+=.11*np.sin(2*np.pi*f*2.756*t)
    s*=np.exp(-t*(3.2 if glass else 1.5))*env(t,d,.008,.08)
    add(name,at,s,gain,pan)

def click(at,gain=.05,name='monospace',pan=0):
    d=.045;t=np.arange(round(d*SR))/SR
    s=(rng.normal(0,.25,len(t))+np.sin(2*np.pi*1900*t)*.4)*np.exp(-t*150)*env(t,d,.0005,.01)
    add(name,at,s,gain,pan)

def boom(at,gain=.8):
    d=.8;t=np.arange(round(d*SR))/SR
    phase=2*np.pi*(42*t+1.8*(1-np.exp(-t*40)))
    s=(np.sin(phase)+.22*np.sin(2*phase))*np.exp(-t*7)
    s+=rng.normal(0,.1,len(t))*np.exp(-t*90)
    add('bold',at,np.tanh(s*1.3)*env(t,d,.001,.08),gain)

def whoosh(at,d=.38,gain=.18,pan=.2):
    t=np.arange(round(d*SR))/SR
    noise=rng.normal(0,1,len(t));bins=np.fft.rfftfreq(len(t),1/SR)
    shape=(1-np.exp(-(bins/700)**4))*np.exp(-(bins/6500)**4)
    s=np.fft.irfft(np.fft.rfft(noise)*shape,n=len(t))
    s*=np.sin(np.pi*t/d)**2
    add('italic',at,s,gain,pan)

# Quiet editorial pulse, with space for each distinct personality.
for at,m in [(.22,72),(.78,79),(1.35,76),(2.05,81)]:
    note('score',at,m,.45,.035,(at%1-.5)*.8,True);click(at,.032)
boom(4.03)
click(3.36,.025)
whoosh(5.88,.3,.09)
whoosh(6.28,.5,.18,-.3)
for i,at in enumerate([6.4,6.72,7.05,7.38,7.72,8.06]):
    click(at,.095,'italic',(-1)**i*.3);note('italic',at,48+i%3*7,.14,.085)
whoosh(8.3,.55,.23,.35)
whoosh(8.92,.5,.07,-.3)
for at,m in [(9.25,77),(9.8,84),(10.4,81),(11.05,88),(11.6,84)]:
    note('serif',at,m,.8,.09,(at%1-.5)*.7,True)
# Exact ordered mechanical ticks match the character-cell snaps.
for i in range(9):
    click(12.15+i*.105,.10,'monospace',(i-4)*.08)
    note('monospace',12.15+i*.105,67+i%3*4,.07,.025)
for at in [13.35,13.75,14.15,14.55]:click(at,.075)
# Four sonic identities arrive in the same order as the assembly.
boom(15.32,.5)
whoosh(15.44,.35,.13)
note('serif',15.56,84,.7,.11,0,True)
click(15.68,.13)
for at,notes in [(15.9,[48,60,67,72]),(16.45,[53,65,69,77]),(17.0,[48,60,67,76])]:
    for j,m in enumerate(notes):note('score',at,m,.72,.07,(j-1.5)*.2)
whoosh(18.1,.6,.07,-.25)
for at,m in [(18.25,81),(18.7,76),(19.1,72)]:note('serif',at,m,.5,.045,0,True)
for at in [18.35,18.65,18.95]:click(at,.045)
# Endpoint silence creates a quiet, click-free replay; actual picture loops exactly.
for a in stems.values():a[:round(.08*SR)]=0;a[round(19.7*SR):]=0
premix=sum(stems.values());common=.78/max(np.max(np.abs(premix)),.78)
for name,a in stems.items():
    a*=common
    ff(['-f','f32le','-ar',SR,'-ac',2,'-i','pipe:0','-c:a','pcm_s24le',OUT/f'stem-{name}.wav'],a.astype('<f4').tobytes())
raw=OUT/'premaster.wav'
ff(['-f','f32le','-ar',SR,'-ac',2,'-i','pipe:0','-c:a','pcm_s24le',raw],sum(stems.values()).astype('<f4').tobytes())
def measure(p):
    log=ff(['-i',p,'-af','loudnorm=I=-14:TP=-2:LRA=11:print_format=json','-f','null','-']).stderr.decode(errors='replace')
    return json.loads(log[log.rfind('{'):log.rfind('}')+1])
first=measure(raw)
settings=('loudnorm=I=-14:TP=-2.5:LRA=11:'+f"measured_I={first['input_i']}:measured_TP={first['input_tp']}:measured_LRA={first['input_lra']}:measured_thresh={first['input_thresh']}:offset={first['target_offset']}:linear=true")
ff(['-i',raw,'-af',settings,'-ar',SR,'-c:a','pcm_s24le',OUT/'mix.wav'])
# Measure the actual delivered codec and correct gain once if needed.
for _ in range(2):
    ff(['-i',OUT/'mix.wav','-c:a','aac','-b:a','320k',OUT/'aac-qc.m4a'])
    metrics=measure(OUT/'aac-qc.m4a')
    correction=min(-14-float(metrics['input_i']),-1.5-float(metrics['input_tp']))
    if abs(correction)<.15:break
    temp=OUT/'gain.wav'
    ff(['-i',OUT/'mix.wav','-af',f'volume={correction}dB','-ar',SR,'-c:a','pcm_s24le',temp]);temp.replace(OUT/'mix.wav')
ff(['-i',OUT/'mix.wav','-c:a','aac','-b:a','320k',OUT/'aac-qc.m4a'])
metrics=measure(OUT/'aac-qc.m4a')
(OUT/'metrics.json').write_text(json.dumps({'decoded_aac':metrics,'first_pass':first,'duration':20,'sample_rate':SR,'seed':23102026},indent=2))
raw.unlink()
assert abs(float(metrics['input_i'])+14)<=1,metrics
assert float(metrics['input_tp'])<=-1,metrics
print(json.dumps(metrics,indent=2))
