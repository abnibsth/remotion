export function camera(el,{x=0,y=0,scale=1,rx=0,ry=0,rz=0,z=0}={}){
 el.style.transform=`perspective(2400px) translate3d(${x}px,${y}px,${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`;
}
