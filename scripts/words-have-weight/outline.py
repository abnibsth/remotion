"""Generate real Space Grotesk outlines; font remains licensed under OFL."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import json
ROOT=Path(__file__).resolve().parents[2]
source=ROOT/'node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2'
font=TTFont(source)
glyphs=font.getGlyphSet()
cmap=font.getBestCmap()
result={}
for word in ['HEAVY','FAST','SLOW','ELASTIC']:
    x=0
    parts=[]
    for letter in word:
        name=cmap[ord(letter)]
        pen=SVGPathPen(glyphs)
        glyphs[name].draw(pen)
        parts.append({'letter':letter,'x':x,'path':pen.getCommands(),'advance':glyphs[name].width})
        x+=glyphs[name].width
    result[word]={'width':x,'capHeight':font['OS/2'].sCapHeight,'glyphs':parts}
target=ROOT/'src/WordsHaveWeight/lib/outlines.json'
target.parent.mkdir(parents=True,exist_ok=True)
target.write_text(json.dumps(result,separators=(',',':')),encoding='utf-8')
print(f'Outlined {len(result)} words from real Space Grotesk glyphs: {target}')
