"""Design ORDER first from real font geometry; seed choreography around it."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from fontTools.ttLib import TTFont
import json,random,math
R=Path(__file__).resolve().parents[2]
font=TTFont(R/'node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2');font.flavor=None
cache=R/'.cache/chaos-to-order';cache.mkdir(parents=True,exist_ok=True);ttf=cache/'space-grotesk.ttf';font.save(ttf)
im=Image.new('L',(900,400));d=ImageDraw.Draw(im);f=ImageFont.truetype(str(ttf),225);box=d.textbbox((0,0),'ORDER',font=f);d.text(((900-(box[2]-box[0]))/2-box[0],80-box[1]),'ORDER',font=f,fill=255)
cells=[]
for y in range(75,265,16):
 for x in range(30,880,16):
  if im.getpixel((x,y))>180:cells.append((x,y))
rng=random.Random(20261021);rng.shuffle(cells)
# Cap at 280 purpose-assigned fragments; this font mask yields 245 samples.
if len(cells)>280:cells=cells[:280]
items=[]
for i,(px,py) in enumerate(cells):
 depth=rng.uniform(-210,230);factor=(1500-depth)/1500
 rx=(px-450)*factor;ry=(py-170)*factor
 # camera rotation at reveal is zero, projection preserves sampled font pixels.
 items.append({'id':i,'type':['rect','line','circle','letter','marker'][i%5],
 'initialPosition':[rng.uniform(-365,365),rng.uniform(-420,420),rng.uniform(-180,190)],
 'organizedPosition':[((i%16)-7.5)*45,((i//16)-7)*46,0],
 'revealPosition':[rx,ry,depth],'target':[px-450,py-170],
 'rotation':rng.uniform(-165,165),'scale':rng.uniform(.8,1.3),'color':'#171717' if i%13 else ['#315BFF','#F36B4D','#DCEB8B'][(i//13)%3],
 'depth':depth,'delay':rng.uniform(0,2.0),'duration':rng.uniform(2.0,2.9),'motionProfile':i%4,'phase':rng.uniform(0,math.pi*2),'bend':rng.uniform(-110,110)})
target=R/'src/ChaosToOrder/objects.json';target.parent.mkdir(parents=True,exist_ok=True);target.write_text(json.dumps(items,separators=(',',':')))
print(f'Designed {len(items)} seeded fragments from Space Grotesk ORDER silhouette')
