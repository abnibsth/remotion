"""Original deterministic restrained perfume-commercial score, no stock samples."""
from pathlib import Path
import json
import subprocess
import wave
import numpy as np
SR=48000
rng=np.random.default_rng(50719)
audio=np.zeros((SR*20,2))
out=Path(__file__).resolve().parents[2]/'public/product-commercial/verve'
out.mkdir(parents=True,exist_ok=True)
def add(at,x,gain=.1,pan=0):
    a=round(at*SR);n=min(len(x),len(audio)-a);angle=(pan+1)*np.pi/4
    audio[a:a+n]+=x[:n,None]*gain*np.array([np.cos(angle),np.sin(angle)])
def tone(at,f,d,gain=.1):
    t=np.arange(round(d*SR))/SR
    env=np.minimum(t/.035,1)*np.minimum((d-t)/.15,1)*np.exp(-1.6*t)
    add(at,(np.sin(2*np.pi*f*t)+.2*np.sin(2*np.pi*f*2*t))*env,gain)
def sweep(at,d=.65,gain=.07):
    t=np.arange(round(d*SR))/SR
    n=rng.standard_normal(len(t));n=np.convolve(n,np.ones(9)/9,mode='same')
    add(at,n*np.sin(np.pi*t/d)**2,gain,-.1)
def tick(at,gain=.08):
    t=np.arange(round(.09*SR))/SR
    add(at,(rng.standard_normal(len(t))*.2+np.sin(2*np.pi*1200*t)*.4)*np.exp(-75*t),gain,.15)
def bass(at,f=55,gain=.3):
    t=np.arange(round(.45*SR))/SR
    add(at,np.sin(2*np.pi*(f*t+1.8*(1-np.exp(-25*t))))*np.minimum(t/.008,1)*np.exp(-9*t),gain)
# An open, slow 96 BPM harmonic pulse; warm minor-nine voicings, not trailer hits.
for at in np.arange(0,19,.625):
    tone(float(at),[220,261.626,329.628,391.995][round(at/.625)%4],.55,.075 if at<12 else .09)
    if round(at/.625)%2==0:bass(float(at),55 if at<12 else 65.406,.25)
for at in [0,3,7,12,17]:
    for f in [110,164.814,220,261.626,329.628]:tone(at,f,2.2,.055)
for at in [1,3,7,9.4,10.6,12,17]:sweep(max(0,at-.35),.75,.1)
for at in [3.3,7.4,9.5,10.7,12.3,17.1]:tick(at,.12)
for at in [3,12,17]:bass(at,48,.34)
for at in [18.1,18.65,19.2]:tone(at,440 if at<19 else 660,.6,.09)
audio*=np.minimum(np.arange(len(audio))/SR/.08,1)[:,None]
audio[round(19.2*SR):]*=np.linspace(1,0,len(audio)-round(19.2*SR))[:,None]**1.3
raw=out/'score-premaster.wav'
with wave.open(str(raw),'wb') as f:
    f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((np.tanh(audio)*32767).astype('<i2').tobytes())
def run(args):
    p=subprocess.run(['ffmpeg','-hide_banner','-nostdin',*args],capture_output=True,text=True,check=True);return p.stderr
def parse(log):return json.loads(log[log.rfind('{'):log.rfind('}')+1])
target='loudnorm=I=-14:TP=-1.7:LRA=8'
m=parse(run(['-i',str(raw),'-af',target+':print_format=json','-f','null','-']))
filt=target+f":measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
final=out/'soundtrack.wav'
run(['-y','-i',str(raw),'-af',filt,'-ar',str(SR),'-c:a','pcm_s24le',str(final)])
measured=parse(run(['-i',str(final),'-af',target+':print_format=json','-f','null','-']))
assert abs(float(measured['input_i'])+14)<.5
assert float(measured['input_tp'])<=-1
(out/'audio-qc.json').write_text(json.dumps({'original_synthesis':True,'seed':50719,'sample_rate':SR,'duration':20,'bpm':96,'measured':measured},indent=2),encoding='utf-8')
print(json.dumps(measured,indent=2))
