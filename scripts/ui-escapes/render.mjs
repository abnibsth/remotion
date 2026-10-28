import {build} from 'esbuild';
import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {spawn,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {once} from 'node:events';
const out=path.resolve('out/ui-escapes'),cache=path.resolve('.cache/ui-escapes');
await fs.mkdir(path.join(cache,'style'),{recursive:true});await fs.mkdir(out,{recursive:true});
const prototype=process.argv.includes('--prototype'),full=process.argv.includes('--full'),serve=process.argv.includes('--serve');
const run=(bin,args)=>{const r=spawnSync(bin,args,{encoding:'utf8',windowsHide:true,maxBuffer:30*1024*1024});if(r.status!==0)throw Error(r.stderr||r.stdout);return r.stdout;};
const ff=args=>run('ffmpeg',['-hide_banner','-loglevel','warning','-y',...args]);
const sha=b=>createHash('sha256').update(b).digest('hex');
let executable;const base=path.join(process.env.LOCALAPPDATA,'ms-playwright');
for(const d of(await fs.readdir(base)).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true})))for(const rel of ['chrome-headless-shell-win64/headless_shell.exe','chrome-win64/chrome.exe']){const p=path.join(base,d,rel);if(!executable&&await fs.stat(p).catch(()=>null))executable=p;}
if(!executable)throw Error('No installed Chromium');
await build({entryPoints:['scripts/ui-escapes/preview.ts'],outdir:cache,bundle:true,format:'iife',platform:'browser',loader:{'.woff2':'file','.woff':'file'},assetNames:'fonts/[name]-[hash]'});
await fs.writeFile(path.join(cache,'index.html'),'<!doctype html><html><head><meta charset="utf-8"><title>UI Escapes Preview</title><link rel="icon" href="data:,"><link rel="stylesheet" href="/preview.css"><style>html,body,#root{margin:0;width:1080px;height:1920px;overflow:hidden;background:#F5F1E9}#root{position:relative}canvas{display:block}</style></head><body><div id="root"></div><script src="/preview.js"></script></body></html>');
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost').pathname;const f=path.resolve(cache,'.'+(u==='/'?'/index.html':decodeURIComponent(u)));if(!f.startsWith(cache+path.sep))throw Error('outside cache');res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream');res.end(await fs.readFile(f));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(serve?3107:0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}`;
if(serve)console.log(`UI Escapes: ${url} — await window.seek(seconds)`);
else{
 let browser;
 try{
  browser=await chromium.launch({executablePath:executable,headless:true,args:['--force-color-profile=srgb','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-web-security']});
  const p=await browser.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});const errors=[];p.on('pageerror',e=>errors.push(String(e)));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await p.goto(url);await p.evaluate(()=>window.ready);
  const shot=async(t,file,type='png')=>{await p.evaluate(t=>window.seek(t),t);const b=await p.screenshot({type,...(type==='jpeg'?{quality:96}:{}),animations:'disabled'});if(file)await fs.writeFile(file,b);return b;};
  const test=await shot(4.3);await shot(19.7);await shot(.1);const again=await shot(4.3);if(sha(test)!==sha(again))throw Error('Random seeking pixels differ');
  const times=prototype?[1.4,3.8,4.65,5.55,6.8]:[1.4,3.8,5.7,8.6,15.8,18.5,24.2];
  for(let i=0;i<times.length;i++){await shot(times[i],path.join(cache,'style',`${String(i).padStart(2,'0')}.png`));await fs.copyFile(path.join(cache,'style',`${String(i).padStart(2,'0')}.png`),path.join(out,`style-${i}.png`));}
  ff(['-framerate','1','-i',path.join(cache,'style/%02d.png'),'-frames:v','1','-vf',`scale=270:480,tile=${times.length}x1`,path.join(out,prototype?'prototype-contact-sheet.png':'ui-escapes-contact-sheet.png')]);
  const qc=await p.evaluate(()=>{const fonts={sans:document.fonts.check('600 80px "Space Grotesk"'),mono:document.fonts.check('500 24px "IBM Plex Mono"')};const invalid=[];for(let f=0;f<1500;f++){const s=window.stateAt(f/60);if(/null|NaN|Infinity/.test(JSON.stringify(s)))invalid.push(f);}return {fonts,invalid,renderer:window.film.renderer.info.render,webgl:window.film.renderer.getContext().getParameter(window.film.renderer.getContext().VERSION)};});
  await fs.writeFile(path.join(out,'style-qc.json'),JSON.stringify({...qc,errors,deterministicPixels:true,times},null,2));if(errors.length||qc.invalid.length||!qc.fonts.sans||!qc.fonts.mono)throw Error(JSON.stringify({qc,errors}));console.log('Style frames and seek QC ready.');
  if(full||prototype){
   if(full){const gate=JSON.parse(await fs.readFile(path.join(out,'prototype-report.json'),'utf8'));if(!gate.decoded||gate.frames!==420)throw Error('Verified seven-second prototype required');}
   const frames=prototype?420:1500,duration=frames/60,target=path.join(out,prototype?'ui-escapes-prototype.mp4':'ui-escapes-final.mp4');
   const child=spawn('ffmpeg',['-hide_banner','-loglevel','warning','-y','-f','image2pipe','-framerate','60','-vcodec','mjpeg','-i','pipe:0','-i',path.resolve('public/ui-escapes/audio/mix.wav'),'-map','0:v:0','-map','1:a:0','-t',String(duration),'-c:v','libx264','-crf',prototype?'20':'17','-preset','medium','-vf','scale=in_range=full:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-c:a','aac','-b:a','320k','-ar','48000','-movflags','+faststart',target],{windowsHide:true,stdio:['pipe','ignore','pipe']});
   let stderr='';child.stderr.on('data',b=>stderr+=b.toString());child.stdin.on('error',()=>{});let last=-1;
   for(let f=0;f<frames;f++){if(child.exitCode!==null)throw Error(stderr);const b=await shot(f/60,null,'jpeg');if(!child.stdin.write(b))await once(child.stdin,'drain');const q=Math.floor(f/frames*20);if(q!==last){last=q;console.log(`Captured ${f}/${frames} (${q*5}%)`);}}
   child.stdin.end();const code=await new Promise(r=>child.once('close',r));if(code!==0)throw Error(stderr);
   const metadata=JSON.parse(run('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',target]));const v=metadata.streams.find(s=>s.codec_type==='video'),a=metadata.streams.find(s=>s.codec_type==='audio');
   if(Number(v.nb_read_frames)!==frames||v.width!==1080||v.height!==1920||v.r_frame_rate!=='60/1'||v.codec_name!=='h264'||a.codec_name!=='aac'||a.sample_rate!=='48000'||Number(metadata.format.duration)!==duration)throw Error('Export spec mismatch');
   ff(['-v','error','-i',target,'-f','null','-']);await fs.writeFile(path.join(out,prototype?'prototype-report.json':'render-report.json'),JSON.stringify({frames,decoded:true,metadata,renderer:'Three.js WebGL, Playwright deterministic capture'},null,2));console.log(`Verified playable export: ${target}`);
  }
 }finally{if(browser)await browser.close();server.close();}
}
