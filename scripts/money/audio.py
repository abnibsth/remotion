"""Original deterministic 120 BPM receipt-film synthesis. NumPy + FFmpeg only.
Run python scripts/money/audio.py; outputs 20-second 48kHz stereo PCM24.
"""
from pathlib import Path
import hashlib
import json
import subprocess
import wave
import numpy as np

SR = 48000
OUT = Path(__file__).resolve().parents[2] / 'public/money/audio'
rng = np.random.default_rng(1202048)
mix = np.zeros((SR * 20, 2))

def add(at, x, gain=1, pan=0):
    a = round(at*SR)
    n = min(len(x), len(mix)-a)
    angle = (pan+1)*np.pi/4
    mix[a:a+n] += x[:n,None]*gain*np.array([np.cos(angle),np.sin(angle)])

def time(d):
    return np.arange(round(d*SR))/SR

def env(t, attack=.004, release=.05):
    return np.minimum(t/attack,1)*np.clip((t[-1]-t)/release,0,1)

def bass(at, midi, d=.3, gain=.34):
    t=time(d)
    p=2*np.pi*440*2**((midi-69)/12)*t+.09*(1-np.exp(-90*t))
    add(at,(np.sin(p)+.26*np.sin(2*p)+.09*np.sin(3*p))*env(t,.007,.065)*np.exp(-2*t),gain)

def paper(at,gain=.15,d=.055,pan=0):
    t=time(d)
    n=rng.standard_normal(len(t))
    add(at,np.tanh((n-.75*np.roll(n,1))*.6)*np.exp(-75*t)*env(t,.001,.008),gain,pan)

def kick(at,gain=.25):
    t=time(.19)
    p=2*np.pi*(49*t+45*.018*(1-np.exp(-t/.018)))
    add(at,np.sin(p)*np.exp(-24*t)*env(t,.002,.02),gain)

def chord(at,notes,d=.5,gain=.10):
    t=time(d)
    for i,midi in enumerate(notes):
        f=440*2**((midi-69)/12)
        x=np.sin(2*np.pi*f*t+.5*np.sin(2*np.pi*f*2*t)*np.exp(-12*t))
        add(at,x*np.exp(-4*t)*env(t,.005,.08),gain,(i-(len(notes)-1)/2)*.28)

def synthesize():
    chord(.15,[62,65,69,76],.75,.105)
    bass(.15,38,.39,.41)
    paper(.15,.24)
    for beat in np.arange(.5,12.5,.5):
        kick(float(beat),.16 if beat%2 else .23)
        if beat%1: paper(float(beat),.16,pan=-.15)
        paper(float(beat+.25),.047,.035,.25)
    phrase=[(0,38,.31),(.75,38,.16),(1,45,.24),(1.5,48,.19),(1.75,45,.17)]
    for bar in [0,2,4,6,8,10]:
        for off,note,d in phrase:
            if bar+off>.15: bass(bar+off,note if bar<8 else note-2,d,.31)
    for at in [1.5,4.5,7.5,10.5]: chord(at,[65,69,72,76],.27,.055)
    # Printer: a gated motor plus synthetic paper-feed pulses, exactly 2.5–4.4.
    t=time(1.9)
    feed=(rng.standard_normal(len(t))*.07+.2*np.sin(2*np.pi*116*t)+.1*np.sin(2*np.pi*232*t))*(.55+.45*np.sin(2*np.pi*21*t)**2)
    add(2.5,feed*env(t,.04,.09),.17,-.2)
    for at in np.arange(2.52,4.36,.095): paper(float(at),.055,.024,-.25)
    for at,note in [(5.5,74),(6.75,72),(8,69)]:
        paper(at,.32,.08)
        chord(at,[note,note-12],.22,.10)
    paper(9.75,.26,.07,-.35)
    paper(9.83,.16,.05,.35)
    chord(9.75,[67,74],.25,.065)
    for i,at in enumerate([11.25,11.4,11.52,11.62,11.70,11.77,11.83]):
        paper(at,.12+i*.015,min(.06,11.9-at),(i%2-.5)*.6)
    t=time(.48)
    add(12.5,np.sin(2*np.pi*(95*t-55*t*t))*env(t,.004,.16)*np.exp(-5*t),.45)
    for at in [12.5,12.54,12.61,12.70,12.79]: paper(at,.18,.11,-.1)
    # Digital-black pause, no reverb or hidden music; one deliberately quiet click.
    mix[13*SR:16*SR]=0
    paper(14.7,.013,.018)
    for at,note,d in [(16,38,.25),(16.375,45,.16),(16.75,48,.18),(17,50,.2),(17.5,45,.25),(18,38,.3)]: bass(at,note,d,.35)
    for at in [16,17,18]: kick(at,.2)
    for at in [16.4,16.48,16.57,16.84,16.93,17.02]: paper(at,.1,min(.08,17.1-at),.2)
    paper(17.25,.28,.07)
    chord(17.25,[65,69,76],.3,.09)
    bass(18.5,38,1.5,.32)
    chord(18.5,[62,65,69,71,76],1.5,.12)
    paper(18.5,.12)
    mix[round(18.5*SR):]*=np.linspace(1,0,round(1.5*SR))[:,None]**1.4
    mix[:]=.82*np.tanh(mix/.82)

def run(args):
    p=subprocess.run(['ffmpeg','-hide_banner','-nostdin',*args],capture_output=True,text=True)
    if p.returncode: raise RuntimeError(p.stderr)
    return p.stderr

def measurement(log):
    a=log.rfind('{')
    return json.loads(log[a:log.find('}',a)+1])

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    synthesize()
    raw=OUT/'soundtrack-premaster.wav'
    with wave.open(str(raw),'wb') as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes((mix.clip(-1,1)*32767).astype('<i2').tobytes())
    target='loudnorm=I=-14:TP=-1.5:LRA=11'
    log1=run(['-i',str(raw),'-af',target+':print_format=json','-f','null','-'])
    first=measurement(log1)
    filt=target+':linear=true:print_format=json'+''.join(':'+k+'='+first[v] for k,v in [('measured_I','input_i'),('measured_TP','input_tp'),('measured_LRA','input_lra'),('measured_thresh','input_thresh'),('offset','target_offset')])
    final=OUT/'soundtrack.wav'
    # Remove loudnorm oversampling pre-ringing in the intentional black pause.
    filt += ",aresample=48000,aeval='if(between(n,624000,705599)+between(n,706560,767999),0,val(0))|if(between(n,624000,705599)+between(n,706560,767999),0,val(1))'"
    log2=run(['-y','-i',str(raw),'-af',filt,'-ar',str(SR),'-ac','2','-c:a','pcm_s24le',str(final)])
    log3=run(['-i',str(final),'-af',target+':print_format=json','-f','null','-'])
    measured=measurement(log3)
    decoded=subprocess.run(['ffmpeg','-v','error','-i',str(final),'-f','f32le','-'],capture_output=True,check=True).stdout
    audio=np.frombuffer(decoded,dtype='<f4').reshape(-1,2)
    silent=np.concatenate([audio[13*SR:round(14.7*SR)].ravel(),audio[round(14.72*SR):16*SR].ravel()])
    result={'seed':1202048,'bpm':120,'sample_rate':SR,'channels':2,'samples':len(audio),'duration_seconds':len(audio)/SR,'encoding':'pcm_s24le','target_integrated_lufs':-14,'target_true_peak_dbtp':-1.5,'pass1':first,'pass2':measurement(log2),'final_measurement':measured,'silence_peak_amplitude':float(np.max(np.abs(silent))),'click_peak_dbfs':float(20*np.log10(np.max(np.abs(audio[round(14.7*SR):round(14.72*SR)])))),'sha256':hashlib.sha256(final.read_bytes()).hexdigest(),'events':{'salary':.15,'printer':[2.5,4.4],'deductions':[5.5,6.75,8],'transport':9.75,'other_roll':[11.25,11.9],'collapse':12.5,'silence':[13,16],'quiet_click':14.7,'bass_return':16,'fold':[16.4,17.1],'typography':17.25,'resolution_fade':[18.5,20]}}
    (OUT/'loudness.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
    (OUT/'loudness.log').write_text('PASS 1\n'+log1+'\nPASS 2\n'+log2+'\nFINAL WAV MEASUREMENT\n'+log3,encoding='utf-8')
    assert len(audio)==SR*20
    assert abs(float(measured['input_i'])+14)<=.2,measured
    assert float(measured['input_tp'])<=-1,measured
    assert result['silence_peak_amplitude']<1e-6,result
    print(json.dumps({k:result[k] for k in ['duration_seconds','final_measurement','silence_peak_amplitude','click_peak_dbfs','sha256']},indent=2))

if __name__=='__main__': main()
