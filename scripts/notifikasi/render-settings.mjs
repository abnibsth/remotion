export function requestAsset(url) {
  const pathname=new URL(url,'http://127.0.0.1').pathname;
  return pathname==='/'?'index.html':decodeURIComponent(pathname.slice(1));
}

export function renderSettings(args=process.argv.slice(2)) {
  const value=args.find(arg=>arg.startsWith('--fps='));
  const fps=value?Number(value.slice(6)):30;
  if(fps!==30&&fps!==60)throw new Error('Frame rate must be 30 or 60');
  return {fps,totalFrames:20*fps,directory:fps===30?'out/notifikasi-overload':`out/notifikasi-overload-${fps}fps`,socialBitrate:fps===60?'12000k':'8000k',maxrate:fps===60?'18000k':'12000k',bufsize:fps===60?'24000k':'16000k'};
}
