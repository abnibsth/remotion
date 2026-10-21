"""Original V2 electronic funk; shared synthesis primitives, revised score and cue sheet."""
from pathlib import Path
import importlib.util
import json
import wave
import subprocess
import numpy as np

ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('v1_synthesis',ROOT/'scripts/gajian/audio.py')
base=importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
SR=48000
OUT=ROOT/'public/gajian-v2/audio'
OUT.mkdir(parents=True,exist_ok=True)
c=base.Composer()
c.rng=np.random.default_rng(26017)
events=[]
# Tight syncopation, low saw harmonics and dry percussion instead of V1 brass groove.
for beat in range(60):
    at=beat*.5
    if 19<=at<24: continue
    ending=at>=24
    energy=.78 if at<7 else 1.0 if not ending else .55
    c.add(c.music,at,c.kick(),.29*energy)
    if beat%2: c.add(c.music,at,c.snare(),.19*energy,.15)
    for off in [0,.25]+([.125,.375] if 7<=at<19 else []):
        c.add(c.music,at+off,c.hat(),.026*energy,(-1)**int((at+off)*8)*.5)
    root=[65.406,65.406,77.782,58.270][int(at/2)%4]
    for off,mul,dur in [(0,1,.18),(.375,1.5,.11)]:
        c.add(c.music,at+off,base.pitched(root*mul,dur,8,(1,.31,.12,.05)),.24*energy)
    if beat%4 in (1,3):
        for mul in [4,5,6]:
            c.add(c.music,at+.125,base.pitched(root*mul,.17,15,(1,.15,.06)),.052*energy,(-1)**beat*.25)
    if 13<=at<19:
        c.add(c.music,at+.375,base.glide(330+(at-13)*20,550,.12,10),.05)

def cue(at,name,kind='pop',weight=.25):
    events.append({'time':at,'sample':round(at*SR),'name':name})
    if kind=='thud': c.impact(at,weight)
    elif kind=='paper': c.add(c.sfx,at,c.paper(.22),weight,-.2)
    elif kind=='down': c.add(c.sfx,at,base.glide(750,90,.30,8),weight)
    elif kind=='elastic': c.add(c.sfx,at,base.glide(220,620,.28,7),weight,.15)
    else:
        c.add(c.sfx,at,base.pitched(880,.17,17,(1,.1)),weight)
        c.add(c.sfx,at+.055,base.pitched(1320,.16,19,(1,.06)),weight*.6)
for args in [(0,'salary-impact','thud',.42),(.35,'phone-slide','paper',.19),(.8,'catch','pop',.17),(1.5,'elastic-landing','elastic',.26),(2.4,'headline-expansion','thud',.25),(3.1,'number-to-money','paper',.27),(4.5,'surf-swish','elastic',.15),(6.6,'anticipation','down',.16),(7.1,'tagihan-collision','thud',.55)]:cue(*args)
for i,at in enumerate([8,9.25,10.5,11.75]):
    cue(at,['kos','makan','cicilan','transport'][i],'thud',.33+i*.03)
    c.add(c.sfx,at+.07,c.paper(.15),.13,(-1)**i*.3)
for at in [13.4,14.35,15.3,16.25,17.3]:cue(at,'numerical-deduction','down',.21)
cue(18.7,'last-digits-collapse','thud',.43)
for args in [(24,'calendar-glance','paper',.15),(24.8,'calendar-expands','elastic',.2),(25.6,'wallet-fold','paper',.28),(26.6,'character-falls','down',.27),(27.8,'punchline-settle','thud',.22),(28.35,'relate-elastic','elastic',.21)]:cue(*args)
c.add(c.sfx,26.7,base.brass(220,.7,100),.1)
for bus in [c.music,c.sfx]:
    bus[19*SR-96:19*SR]*=np.linspace(1,0,96)[:,None]
    bus[19*SR:24*SR]=0
    bus[-12000:]*=np.linspace(1,0,12000)[:,None]
peak=max(np.max(np.abs(c.music+c.sfx)),np.max(np.abs(c.music)),np.max(np.abs(c.sfx)))
gain=min(.82/peak,1)
for name,data in [('music',c.music*gain),('sfx',c.sfx*gain),('mix',(c.music+c.sfx)*gain)]:base.write_wav(OUT/(name+'.wav'),data)
# Two-pass normalization; retain extra reconstruction headroom for final AAC.
base.TARGET_TP=-2.1
base.TARGET_I=-14
first,_=base.loudness(OUT/'mix.wav')
filt=f"loudnorm=I=-14:TP=-2.1:LRA=11:measured_I={first['input_i']}:measured_TP={first['input_tp']}:measured_LRA={first['input_lra']}:measured_thresh={first['input_thresh']}:offset={first['target_offset']},aresample=48000,apad=whole_dur=30,atrim=duration=30"
r=base.ffmpeg('-i',str(OUT/'mix.wav'),'-af',filt,'-ar','48000','-ac','2','-f','f64le','-')
data=np.frombuffer(r.stdout,dtype='<f8').copy().reshape(-1,2)
data[19*SR:24*SR]=0
data[-1]=0
base.write_wav(OUT/'mix-normalized.wav',data)
measured,_=base.loudness(OUT/'mix-normalized.wav')
# Reconstruction peaks are measured after the final sample-rate conversion.
if float(measured['input_tp']) > -1.8:
    data *= 10 ** ((-1.9-float(measured['input_tp']))/20)
    base.write_wav(OUT/'mix-normalized.wav',data)
    measured,_=base.loudness(OUT/'mix-normalized.wav')
report={'duration':30,'sample_rate':SR,'frames':len(data),'channels':2,'digital_silence':[19,24],'silence_nonzero_samples':int(np.count_nonzero(data[19*SR:24*SR])),'loudness':measured,'original':True}
assert len(data)==1440000 and report['silence_nonzero_samples']==0
assert float(measured['input_tp'])<=-1.8
(OUT/'events.json').write_text(json.dumps(events,indent=2))
(OUT/'loudness-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
