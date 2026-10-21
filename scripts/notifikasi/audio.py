"""Original deterministic stereo score + foley. No external samples."""
from pathlib import Path
import json
import subprocess
import wave
import numpy as np

SR = 48000
DURATION = 20
N = SR * DURATION
rng = np.random.default_rng(271828)
music = np.zeros((N, 2), dtype=np.float64)
sfx = np.zeros_like(music)
root = Path(__file__).resolve().parents[2]
assets = root / 'public' / 'notifikasi' / 'audio'
assets.mkdir(parents=True, exist_ok=True)
output = root / 'out' / 'notifikasi-overload'
output.mkdir(parents=True, exist_ok=True)
events = []


def clock(length):
    return np.arange(round(length * SR)) / SR


def add(bus, start, signal, gain=1, pan=0):
    first = round(start * SR)
    last = min(N, first + len(signal))
    if first < 0 or first >= N:
        return
    p = np.array([np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)])
    bus[first:last] += signal[:last-first, None] * gain * p


def noise(t):
    return rng.standard_normal(len(t))


def tone(freq, length, decay=5, brightness=.2):
    t = clock(length)
    env = (1-np.exp(-t*220))*np.exp(-decay*t)
    env *= np.minimum(1, (length-t)*50)
    return (np.sin(2*np.pi*freq*t) + brightness*np.sin(2*np.pi*freq*2*t)) * env


def kick():
    t = clock(.35)
    phase = 2*np.pi*(43*t + 95*.024*(1-np.exp(-t/.024)))
    return np.sin(phase)*np.exp(-t*15) + noise(t)*np.exp(-t*300)*.14


def snare():
    t = clock(.24)
    n = noise(t)
    return (.5*(n-np.roll(n, 1))*np.exp(-t*24) + np.sin(2*np.pi*190*t)*np.exp(-t*23)*.3)*(1-np.exp(-t*600))


def hat(length=.055):
    t = clock(length)
    n = noise(t)
    return (n-np.roll(n,1))*np.exp(-t*65)*np.minimum(1,(length-t)*300)


def ding(start, freq=1174.66, gain=.34, pan=0):
    add(sfx,start,tone(freq,.5,9,.3)+tone(freq*1.5,.5,13,.0)*.45,gain,pan)
    events.append({'time':round(start,4),'type':'notification'})


def pop(start, pitch=600, gain=.18, pan=0):
    t=clock(.105)
    a=np.sin(2*np.pi*(pitch*t-230*t*t))*np.exp(-t*42)*(1-np.exp(-t*850))
    add(sfx,start,a,gain,pan)
    events.append({'time':round(start,4),'type':'message-pop'})


def impact(start,gain=.6):
    t=clock(.65)
    body=np.sin(2*np.pi*(36*t+70*.035*(1-np.exp(-t/.035))))*np.exp(-t*9)
    crack=(noise(t)-np.roll(noise(t),1))*np.exp(-t*42)*.23
    add(sfx,start,body+crack,gain)
    events.append({'time':start,'type':'impact'})


def whoosh(start,length=.32):
    t=clock(length)
    env=np.sin(np.pi*t/length)**2
    n=noise(t)
    add(sfx,start,(n-np.roll(n,7))*.2*env,.4,-.25)
    add(sfx,start+.02,np.sin(2*np.pi*(190*t+1800*t*t))*env,.08,.4)
    events.append({'time':start,'type':'whoosh'})


# 120 BPM: sparse hook, syncopated office groove, double-time chaos.
for beat in range(25):
    at=beat*.5
    intensity=.52 if at<2.5 else .78 if at<5.5 else 1
    add(music,at,kick(),.32*intensity)
    if beat%2:
        add(music,at,snare(),.24*intensity,.07)
    if at>=2.5 and beat%4==2:
        add(music,at+.375,kick(),.18*intensity)
    spacing=.25 if at<5.5 else .125
    for off in np.arange(0,.5,spacing):
        add(music,at+off,hat(),(.035 if off==0 else .025)*intensity,(-1 if off% .5 else 1)*.4)
    if at>=1.5:
        notes=[55,55,65.406,73.416,55,82.407,73.416,65.406]
        freq=notes[beat%8]
        add(music,at+.05,tone(freq,.31,9,.33),.2*intensity)
        if at>=5.5:
            add(music,at+.30,tone(freq*2,.15,17,.3),.10,.25)
    if at>=2.5:
        arp=[440,523.251,659.255,783.991,659.255,523.251,587.33,659.255]
        add(music,at+.25,tone(arp[beat%8],.22,15,.4),.055,-.35)

# Score acceleration: a tonal rise that terminates exactly at the silence cut.
t=clock(3)
add(music,9.5,(np.sin(2*np.pi*(180*t+95*t*t))*.14+noise(t)*.045)*(t/3)**2,.38)

# Precise synchronized foley.
ding(.3)
for a,f in [(1.3,1396.9),(1.55,1568),(1.8,1760)]: ding(a,f,.28,(-1 if a==1.55 else 1)*.3)
for a in [2.62,3.35,3.85,4.55,5.25]: pop(a,620+(a%1)*300,.26,(-1 if a%1<.5 else 1)*.4)
for a in np.arange(5.5,9.5,.23): pop(float(a),650+((a*211)%450),.2,np.sin(a*3)*.55)
for a in np.arange(9.55,12.45,.105): pop(float(a),800+((a*173)%600),.16,np.sin(a*4)*.6)
for a in [2.25,5.25,9.25]: whoosh(a)
for a,g in [(2.85,.45),(5.5,.5),(7.3,.9),(9.65,.75),(10.05,.9)]: impact(a,g)

# Phone motor: modulated low-frequency buzz with irregular but seeded body.
for a,length,gain in [(1.3,.55,.07),(3.1,1.65,.055),(5.5,3.9,.075),(9.5,2.8,.10)]:
    t=clock(length)
    sig=np.tanh(np.sin(2*np.pi*92*t)*3)*(.3+.7*np.maximum(0,np.sin(2*np.pi*17*t)))
    sig*=np.minimum(1,t*40)*np.minimum(1,(length-t)*40)
    add(sfx,a,sig,gain,-.15)
    events.append({'time':a,'type':'phone-vibration'})

# Alert/panic sting, musical descending brass-like synth.
for a in [6.5,8.45,9.75,10.45,11.15]:
    t=clock(.33)
    freq=520-230*t+40*np.sin(t*45)
    sig=np.sin(2*np.pi*np.cumsum(freq)/SR)
    add(sfx,a,np.tanh(sig*2)*np.exp(-t*10),.10,.25)
t=clock(.42)
scratch=np.sin(2*np.pi*(1000*t+110*np.sin(t*28)))*noise(t)*.17
scratch*=np.sin(np.pi*t/.42)**2
add(sfx,12.08,scratch,.65)
events.append({'time':12.08,'type':'record-scratch'})

# A strict sample boundary: no groove, alerts, motor or reverb after 12.500s.
cut=round(12.5*SR)
fade=round(.004*SR)
for bus in [music,sfx]:
    bus[cut-fade:cut]*=np.linspace(1,0,fade)[:,None]
    bus[cut:]=0

# Almost silent paper-room noise, then tactile taps, warm DND resolution.
t=clock(3)
room=noise(t)*.000035
add(sfx,12.5,room,1)
for a in [15.02,16.35]:
    tt=clock(.055)
    add(sfx,a,(np.sin(2*np.pi*980*tt)*.5+noise(tt)*.2)*np.exp(-tt*100),.20)
    events.append({'time':a,'type':'ui-tap'})
for a,f in [(16.40,659.255),(16.53,987.767),(18.08,783.991)]:
    add(sfx,a,tone(f,1.1,4,.12),.20,.18)
    events.append({'time':a,'type':'warm-confirmation'})
for start,chord in [(16.4,[130.813,196,261.626,329.628]),(18.0,[130.813,196,293.665,329.628,523.251])]:
    duration=20-start
    tt=clock(duration)
    env=(1-np.exp(-tt*3))*np.exp(-tt*.65)*np.minimum(1,(duration-tt)*2)
    for j,f in enumerate(chord):
        sig=(np.sin(2*np.pi*f*tt)+.17*np.sin(2*np.pi*2*f*tt))*env
        add(music,start,sig,.058,(-.55+j*.25))

# Gentle width without feeding any pre-cut echo into the silent section.
for bus in [music,sfx]:
    bus[:cut,1]+=.1*np.pad(bus[:cut-601,0],(601,0))
    bus[cut:cut+601]=0
mix=music+sfx
mix[-4800:]*=np.linspace(1,0,4800)[:,None]
peak=float(np.max(np.abs(mix)))
mix*=.85/max(1,peak)


def write_wav(file,data):
    with wave.open(str(file),'wb') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SR)
        wav.writeframes((np.clip(data,-1,1)*32767).astype('<i2').tobytes())


write_wav(assets/'mix-raw.wav',mix)
write_wav(assets/'music-original.wav',music*.6)
write_wav(assets/'sfx-original.wav',sfx*.6)
analysis=subprocess.run(['ffmpeg','-hide_banner','-i',str(assets/'mix-raw.wav'),'-af','loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
first=json.loads(analysis.stderr[analysis.stderr.rfind('{'):analysis.stderr.rfind('}')+1])
normalizer=f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={first['input_i']}:measured_TP={first['input_tp']}:measured_LRA={first['input_lra']}:measured_thresh={first['input_thresh']}:offset={first['target_offset']}:linear=false:print_format=json"
# AAC reconstruction can overshoot the PCM true peak; reserve codec headroom.
command=['ffmpeg','-hide_banner','-y','-i',str(assets/'mix-raw.wav'),'-af',normalizer+',volume=0.4dB,aresample=192000,alimiter=limit=0.78:level=false:latency=true,aresample=48000,apad=whole_dur=20,atrim=duration=20','-ar','48000','-c:a','pcm_s24le',str(assets/'mix.wav')]
result=subprocess.run(command,capture_output=True,text=True,check=True)
(output/'audio-normalization.log').write_text(analysis.stderr+'\nSECOND PASS\n'+result.stderr,encoding='utf-8')
start=result.stderr.rfind('{')
measure=json.loads(result.stderr[start:result.stderr.rfind('}')+1])
quiet=mix[round(12.6*SR):round(14.8*SR)]
assert len(mix)==960000
assert np.sqrt(np.mean(quiet**2))<.0001
assert np.max(np.abs(mix))<=.86
report={'sampleRate':SR,'samples':len(mix),'duration':20,'musicDrop':12.5,'quietRmsDb':float(20*np.log10(max(1e-12,np.sqrt(np.mean(quiet**2))))),'normalization':measure,'events':events,'source':'100% original synthesis; seed 271828; no external recordings or samples'}
(output/'audio-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print('AUDIO READY: 960000 samples / 48 kHz / stereo / original score and SFX')
print(json.dumps(measure,indent=2))
