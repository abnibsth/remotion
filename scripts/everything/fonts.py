"""Outline the installed OFL Space Grotesk font into compatible morph contours."""
import json
import math
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen

ROOT = Path(__file__).resolve().parents[2]
FONT = ROOT / 'node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff'

class FlattenPen(BasePen):
    def __init__(self, glyphset):
        super().__init__(glyphset)
        self.contours = []
        self.points = []
    def _moveTo(self, p):
        self.points = [p]
    def _lineTo(self, p):
        self.points.append(p)
    def _curveToOne(self, a, b, c):
        p = self.points[-1]
        for i in range(1, 17):
            t = i / 16
            self.points.append(tuple((1-t)**3*p[k]+3*(1-t)**2*t*a[k]+3*(1-t)*t*t*b[k]+t**3*c[k] for k in [0,1]))
    def _qCurveToOne(self, a, b):
        p = self.points[-1]
        for i in range(1, 13):
            t = i / 12
            self.points.append(tuple((1-t)**2*p[k]+2*(1-t)*t*a[k]+t*t*b[k] for k in [0,1]))
    def _closePath(self):
        self.contours.append(self.points)
    def _endPath(self):
        self._closePath()

def resample(points, count=128):
    lengths = [math.dist(points[i], points[(i+1)%len(points)]) for i in range(len(points))]
    total = sum(lengths)
    out = []
    j, consumed = 0, 0
    for i in range(count):
        target = total*i/count
        while j < len(points)-1 and consumed+lengths[j] < target:
            consumed += lengths[j]
            j += 1
        k = (j+1)%len(points)
        a = (target-consumed)/max(lengths[j], 1e-9)
        out.append([round(points[j][d]*(1-a)+points[k][d]*a, 4) for d in [0,1]])
    return out

font = TTFont(FONT)
glyphset = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font['head'].unitsPerEm
result = {}
for word, size in [('MOVE', 370), ('EVERYTHING', 232), ('IS MOTION', 265)]:
    advances = [font['hmtx'][cmap[ord(c)]][0] if c != ' ' else upm*.3 for c in word]
    scale = size/upm
    width = sum(advances)*scale
    x = -width/2
    slots = []
    for c, advance in zip(word, advances):
        if c != ' ':
            pen = FlattenPen(glyphset)
            glyphset[cmap[ord(c)]].draw(pen)
            contours = [[[x+p[0]*scale, size*.355-p[1]*scale] for p in contour] for contour in pen.contours]
            contours.sort(key=lambda ps: -abs(sum(ps[i][0]*ps[(i+1)%len(ps)][1]-ps[(i+1)%len(ps)][0]*ps[i][1] for i in range(len(ps)))))
            center = [x+advance*scale/2, 0]
            normalized = [resample(c) for c in contours]
            while len(normalized)<3:
                normalized.append([center]*128)
            slots.append(normalized)
        x += advance*scale
    while len(slots)<12:
        slots.append([[[width/2,0]]*128]*3)
    result[word] = slots
out = ROOT/'src/EverythingIsMotion/lib/glyphs.json'
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(result, separators=(',',':')), encoding='utf8')
print(f'Outlined Space Grotesk Bold: {out}, {out.stat().st_size} bytes')
