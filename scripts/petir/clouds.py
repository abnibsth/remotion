"""Original layered cloud plates from seeded multiscale noise, no external photos."""
from pathlib import Path
import numpy as np
from PIL import Image,ImageFilter
import base64,json
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'public/petir/clouds'; OUT.mkdir(parents=True,exist_ok=True)
w,h=900,1050
y,x=np.mgrid[0:h,0:w];x=x/w;y=y/h
plates=[]
for layer in range(3):
 rng=np.random.default_rng(7301+layer)
 noise=np.zeros((h,w))
 for grid,amp in [(4,0.46),(9,.26),(20,.15),(45,.08),(95,.035),(210,.015)]:
  a=rng.random((grid,grid))
  im=Image.fromarray((a*255).astype('uint8')).resize((w,h),Image.Resampling.BICUBIC)
  noise+=np.array(im)/255*amp
 noise=(noise-.36)*2.7
 mass=np.zeros((h,w))
 for i in range(14):
  cx=rng.uniform(-.15,1.15);cy=rng.uniform(.08,.9);sx=rng.uniform(.15,.4);sy=rng.uniform(.08,.22)
  mass=np.maximum(mass,np.exp(-((x-cx)/sx)**2-((y-cy)/sy)**2))
 density=np.clip((mass*.72+noise-.24)*1.8,0,1)
 grad=np.clip(np.gradient(density,axis=0)*-25,0,.45)
 light=np.clip(.2+noise*.4+grad,0,1)
 rgba=np.zeros((h,w,4),dtype=np.uint8)
 for c,(low,high) in enumerate([(10,81),(18,99),(36,133)]):rgba[:,:,c]=(low+(high-low)*light).astype('uint8')
 edge=np.clip((1-np.abs(x-.5)*1.5)*3,0,1)*np.clip(y*12,0,1)*np.clip((1-y)*12,0,1)
 rgba[:,:,3]=(density*edge*230).astype('uint8')
 im=Image.fromarray(rgba).filter(ImageFilter.GaussianBlur(.65));target=OUT/f'cloud-{layer}.png';im.save(target,optimize=True)
 plates.append('data:image/png;base64,'+base64.b64encode(target.read_bytes()).decode())
target=ROOT/'src/Petir/lib/clouds.json';target.parent.mkdir(parents=True,exist_ok=True);target.write_text(json.dumps(plates))
print('Generated three original deterministic layered storm plates')
