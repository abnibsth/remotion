"""Preserve supplied references; derive crops and one faithful photo cutout.
No generative upscaling, recoloring, reconstructed logos, or invented product views.
"""
import argparse
import hashlib
import json
import shutil
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

parser=argparse.ArgumentParser()
parser.add_argument('reference_dir')
args=parser.parse_args()
root=Path(__file__).resolve().parents[2]
out=root/'public/product-commercial/verve'
out.mkdir(parents=True,exist_ok=True)
source=Path(args.reference_dir)
for number,name in [(3,'listing-reference.png'),(4,'hero-reference.png'),(5,'detail-reference.png')]:
    dest=out/name
    if not dest.exists(): shutil.copyfile(source/f'{number}.png',dest)
listing=Image.open(out/'listing-reference.png').convert('RGB')
hero=Image.open(out/'hero-reference.png').convert('RGBA')
detail=Image.open(out/'detail-reference.png').convert('RGB')
# Trace the visible front-view silhouette; the printed label remains untouched.
# Cubic segments are sampled to a supersampled alpha matte for soft edge coverage.
segments=[
 ((211,78),(218,70),(321,69),(335,78)),
 ((335,78),(336,104),(336,137),(327,157)),
 ((327,157),(323,167),(313,176),(300,179)),
 ((300,179),(313,183),(331,189),(341,207)),
 ((341,207),(351,220),(353,237),(353,256)),
 ((353,256),(353,291),(355,336),(351,363)),
 ((351,363),(319,378),(226,378),(196,363)),
 ((196,363),(192,335),(193,281),(193,250)),
 ((193,250),(193,215),(205,191),(249,179)),
 ((249,179),(232,175),(223,169),(219,157)),
 ((219,157),(209,137),(209,100),(211,78)),
]
points=[]
for p0,p1,p2,p3 in segments:
    for i in range(25):
        t=i/24
        points.append(tuple((1-t)**3*p0[k]+3*(1-t)**2*t*p1[k]+3*(1-t)*t*t*p2[k]+t**3*p3[k] for k in [0,1]))
scale=4
matte=Image.new('L',(hero.width*scale,hero.height*scale))
ImageDraw.Draw(matte).polygon([(round(x*scale),round(y*scale)) for x,y in points],fill=255)
matte=matte.resize(hero.size,Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(.32))
hero.putalpha(matte)
hero.crop((188,65,360,382)).save(out/'bottle-front-reference.png')
# Clean front view from listing: unlike the styled hero photo, no flower
# occludes the base. Preserve this actual photographed silhouette for packshots.
clean=listing.crop((336,199,468,438)).convert('RGBA')
contour=[(24,8),(29,5),(102,5),(109,8),(109,42),(105,61),(98,74),(92,79),(105,86),(116,100),(123,119),(124,225),(116,232),(21,232),(8,228),(7,122),(9,108),(16,92),(30,80),(24,69),(20,50),(20,14)]
alpha=Image.new('L',(clean.width*4,clean.height*4));ImageDraw.Draw(alpha).polygon([(x*4,y*4) for x,y in contour],fill=255)
clean.putalpha(alpha.resize(clean.size,Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(.3)))
clean.save(out/'bottle-front.png')
listing.crop((172,169,462,437)).save(out/'packaging-photo.png')
box=listing.crop((171,170,348,433)).convert('RGBA')
box_mask=Image.new('L',box.size);ImageDraw.Draw(box_mask).polygon([(5,4),(165,2),(175,7),(175,257),(4,258),(2,11)],fill=255)
box.putalpha(box_mask.filter(ImageFilter.GaussianBlur(.25)));box.save(out/'box-cutout.png')
listing.crop((230,77,392,110)).save(out/'brand-reference.png')
detail.crop((0,0,449,448)).save(out/'detail-photo.png')
manifest={
 'product':{'brand':'MYKONOS','name':'Verve','type':'Extrait de Parfum','volume':'50 ml','variant':'Verve'},
 'evidence':'User-supplied Shopee listing screenshot and two product photographs, 2026-10-19.',
 'source_url':'https://s.shopee.co.id/50ZxVeKFNn',
 'resolved_listing':'https://shopee.co.id/product/146082540/4971698183',
 'access_limit':'Live listing requires login; no unconfirmed details inferred.',
 'permission':'User explicitly confirmed permission to use supplied photos and logo for promotion in conversation.',
 'excluded_claims':['materials','fragrance notes','longevity','certifications','prices','discounts','ratings','official Shopee partnership'],
 'creative_tagline':{'text':'Hadir. Tanpa banyak kata.','status':'Original campaign copy; not claimed as an official brand tagline.'},
 'assets':[]
}
for p in sorted(out.glob('*.png')):
    im=Image.open(p)
    manifest['assets'].append({'file':p.name,'width':im.width,'height':im.height,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'source':'user-supplied screenshot/photo','processing':'unaltered reference' if 'reference' in p.name else 'crop / alpha silhouette only','limitation':'Source resolution retained; no synthetic detail added.'})
(out/'asset-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print(json.dumps(manifest,indent=2))
