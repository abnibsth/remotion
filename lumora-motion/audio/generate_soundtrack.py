"""Original deterministic soundtrack. Requires numpy and FFmpeg. Run python -I this_file.
No external samples. Edit SECTIONS, SEED, instrument functions and arrangement below.
All outputs remain in this script's directory.
"""
from pathlib import Path
import subprocess
import numpy as np
import json
import re
import hashlib

SR=48000
N=1440000
SEED=20261016
OUT=Path(__file__).resolve().parent
SECTIONS=[(0,4,[50,57,61,64,69],38,'Logo atmosphere and bass pulse'),
(4,8,[47,54,57,61,66],35,'Build'),(8,13,[43,50,54,57,62],31,'Discovery percussive plucks'),
(13,18,[50,57,61,64,69],38,'Profile gentle ticks'),(18,23,[47,54,57,61,66],35,'AI typing plucks'),
(23,27,[43,50,54,57,62],31,'Optimistic lift and connection chime'),
(27,30,[50,57,61,64,69],38,'Final warm major nine chord and fade')]

def hz(n): return 440*2**((n-69)/12)

def render():
    rng=np.random.default_rng(SEED)
    mix=np.zeros((N,2)); send=np.zeros_like(mix)
    def add(a,x,start,gain=1,pan=0):
        i=round(start*SR); x=x[:N-i]
        if x.ndim==1:
            angle=(pan+1)*np.pi/4
            x=np.column_stack((x*np.cos(angle),x*np.sin(angle)))
        a[i:i+len(x)]+=x*gain
    def pluck(note):
        t=np.arange(int(1.8*SR))/SR; p=2*np.pi*hz(note)*t
        return (np.sin(p+0.5*np.exp(-t/0.05)*np.sin(p))+.18*np.sin(2*p)*np.exp(-t/.15))*(1-np.exp(-t/.006))*np.exp(-t/.37)
    for s,e,notes,root,label in SECTIONS:
        dur=min(e-s+1.5,30-s); t=np.arange(round(dur*SR))/SR
        env=np.minimum(t/.8,1)*np.clip((dur-t)/1.5,0,1)
        pad=np.zeros((len(t),2))
        for k,note in enumerate(notes):
            for ch,cents in enumerate([-4,4]):
                p=2*np.pi*hz(note)*2**(cents/1200)*t+k*.63
                pad[:,ch]+=(np.sin(p)+.14*np.sin(2*p)+.03*np.sin(3*p))*(.9+.1*np.sin(2*np.pi*.12*t+k))
        pad*=env[:,None]*(.035 if s!=27 else .047)
        add(mix,pad,s); add(send,pad,s,.35)
        if s<27:
            for time in np.arange(s+.06,e,1):
                t=np.arange(int(.85*SR))/SR
                bass=(np.sin(2*np.pi*hz(root)*t)+.12*np.sin(4*np.pi*hz(root)*t))*(1-np.exp(-t/.022))*np.exp(-t/.32)*np.minimum((.85-t)/.05,1)
                add(mix,bass,time,.15)
        if 4<=s<27:
            for time in np.arange(s,e-.1,1):
                t=np.arange(int(.28*SR))/SR
                kick=np.sin(2*np.pi*(47*t+38*.018*(1-np.exp(-t/.018))))*np.exp(-t/.075)*(1-np.exp(-t/.002))
                add(mix,kick,time,.10 if s<23 else .13)
        patterns={4:[(4.5,66),(5.5,69),(6.5,73),(7.25,69)],
            8:[(8+i*.5,n) for i,n in enumerate([74,69,66,69,71,69,66,62,66,69])],
            13:[(13.5,69),(15,66),(16.5,64),(17.25,69)],
            18:[(18+i*.5+off,n) for i,n in enumerate([66,69,73,69,66,61,66,69,73,69]) for off in ([0,.17] if i%3==0 else [0])],
            23:[(23,66),(23.75,69),(24.5,74),(25.25,78),(26,76),(26.5,73)]}
        for i,(time,note) in enumerate(patterns.get(s,[])):
            voice=pluck(note); pan=[-.42,.25,-.15,.46][i%4]; gain=.052 if s==18 else .07
            add(mix,voice,time,gain,pan); add(send,voice,time,gain*.65,pan)
        if 8<=s<27:
            for i,time in enumerate(np.arange(s+.25,e-.1,.5 if s==13 else .25)):
                t=np.arange(int(.075*SR))/SR
                noise=np.convolve(rng.standard_normal(len(t)),np.ones(10)/10,mode='same')
                tick=(noise*.5+np.sin(2*np.pi*1550*t)*.16)*np.exp(-t/.012)*(1-np.exp(-t/.001))
                add(mix,tick,time,.030 if s==13 else .023,(-1)**i*.28)
    for i,note in enumerate([74,81,88]):
        t=np.arange(int(3.2*SR))/SR
        bell=sum(a*np.sin(2*np.pi*hz(note)*r*t)*np.exp(-t/d) for r,a,d in [(1,1,1.1),(2,.2,.5),(3,.045,.2)])*(1-np.exp(-t/.012))
        add(mix,bell,25.7+i*.12,.031,[-.3,.3,0][i]); add(send,bell,25.7+i*.12,.035,[-.3,.3,0][i])
    for delay,gain in [(.113,.23),(.181,.18),(.293,.15),(.431,.11),(.617,.08),(.829,.055),(1.073,.035)]:
        n=round(delay*SR); mix[n:]+=send[:-n,::-1]*gain
    mix-=mix.mean(axis=0); mix=.8*np.tanh(mix/.8)
    fade=np.minimum(np.arange(N)/(.12*SR),1)*np.sin(np.clip((N-1-np.arange(N))/(2.4*SR),0,1)*np.pi/2)**2
    return (mix*fade[:,None]).astype('<f4')

def run(args,data=None):
    p=subprocess.run(args,input=data,stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True)
    return p.stdout,p.stderr.decode('utf-8',errors='replace')

def measure(log): return json.loads(re.findall(r'\{[^{}]*"input_i"[^{}]*\}',log)[-1])

def main():
    premaster=OUT/'_premaster.wav'; output=OUT/'soundtrack.wav'
    run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','pipe:0','-c:a','pcm_f32le',str(premaster)],render().tobytes())
    target='loudnorm=I=-14:TP=-1:LRA=11'
    _,log=run(['ffmpeg','-hide_banner','-i',str(premaster),'-af',target+':print_format=json','-f','null','-']); first=measure(log)
    second=target+':measured_I='+first['input_i']+':measured_TP='+first['input_tp']+':measured_LRA='+first['input_lra']+':measured_thresh='+first['input_thresh']+':offset='+first['target_offset']+':linear=true:print_format=json'
    _,log=run(['ffmpeg','-hide_banner','-y','-i',str(premaster),'-af',second+',aresample=48000,apad=whole_len=1440000,atrim=end_sample=1440000','-ar','48000','-ac','2','-c:a','pcm_s24le','-map_metadata','-1',str(output)]); second_result=measure(log)
    _,stats=run(['ffmpeg','-hide_banner','-i',str(output),'-af','ebur128=peak=true,astats=metadata=0:reset=0','-f','null','-'])
    _,log=run(['ffmpeg','-hide_banner','-i',str(output),'-af',target+':print_format=json','-f','null','-']); measured=measure(log)
    raw,_=run(['ffmpeg','-v','error','-i',str(output),'-f','f32le','-c:a','pcm_f32le','pipe:1']); decoded=np.frombuffer(raw,dtype='<f4').reshape(-1,2)
    probe,_=run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(output)])
    peak=float(np.max(np.abs(decoded)))
    report={'title':'LUMORA Warm Connections','generator':str(Path(__file__).resolve()),'audio':str(output),
      'original':True,'source':'Seeded NumPy oscillator and noise synthesis; no external samples, downloads or voice',
      'seed':SEED,'tempo_bpm':120,'tonality':'D major / B minor','sample_rate_hz':SR,'channels':2,'sample_frames':len(decoded),'duration_seconds':len(decoded)/SR,
      'encoding':'24-bit PCM WAV','sha256':hashlib.sha256(output.read_bytes()).hexdigest(),
      'arrangement':[{'start_seconds':s,'end_seconds':e,'description':label} for s,e,_,_,label in SECTIONS],
      'mastering':{'method':'FFmpeg loudnorm two-pass','target_lufs':-14,'true_peak_ceiling_dbtp':-1,'pass_one':first,'pass_two':second_result},
      'verification':{'decoded_loudnorm':measured,'decoded_sample_peak_dbfs':float(20*np.log10(peak)),
      'clipped_samples':int(np.sum(np.abs(decoded)>=1)),'stereo_correlation':float(np.corrcoef(decoded.T)[0,1]),
      'first_frame':decoded[0].tolist(),'last_frame':decoded[-1].tolist(),'all_samples_finite':bool(np.isfinite(decoded).all()),
      'ebur128_astats_log':stats,'ffprobe':json.loads(probe)}}
    assert len(decoded)==N
    assert abs(float(measured['input_i'])+14)<.2,measured
    assert float(measured['input_tp'])<=-1,measured
    assert peak<1 and np.isfinite(decoded).all()
    (OUT/'audio-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    premaster.unlink()
    print(json.dumps({'frames':len(decoded),'lufs':measured['input_i'],'true_peak_dbtp':measured['input_tp'],'sample_peak_dbfs':report['verification']['decoded_sample_peak_dbfs'],'sha256':report['sha256']}))

if __name__=='__main__': main()
