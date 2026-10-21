import React,{useMemo} from 'react';
import * as THREE from 'three';
import {bodyOpacity,E} from './motion';
const graphite='#242b35';
function bodyGeometry(){const xs=[-2.65,-2.4,-2.05,-1.65,-1.1,-.5,.15,.8,1.4,1.9,2.35,2.6];const widths=[.76,1.04,1.08,1.13,1.02,.98,1.0,1.05,1.14,1.14,1.02,.8];const tops=[.56,.7,.82,.86,.84,.77,.74,.77,.89,.92,.86,.67];const pos:number[]=[],idx:number[]=[];const n=21;for(let i=0;i<xs.length;i++)for(let j=0;j<n;j++){const z=-1+2*j/(n-1);const crown=Math.pow(1-Math.abs(z)**2,.7);pos.push(xs[i],tops[i]-.22+.22*crown,widths[i]*z);}for(let i=0;i<xs.length-1;i++)for(let j=0;j<n-1;j++){const a=i*n+j,b=a+n;idx.push(a,b,a+1,b,b+1,a+1);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;}
function cabinGeometry(){const shape=new THREE.Shape();shape.moveTo(-.95,.75);shape.lineTo(-.39,1.35);shape.quadraticCurveTo(.2,1.49,.72,1.31);shape.lineTo(1.35,.77);shape.closePath();const g=new THREE.ExtrudeGeometry(shape,{depth:1.53,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.08,bevelThickness:.08,curveSegments:16});g.translate(0,0,-.765);return g;}
function wingGeometry(){const s=new THREE.Shape();s.moveTo(-.32,0);s.bezierCurveTo(-.12,.12,.22,.1,.4,.015);s.bezierCurveTo(.1,-.015,-.1,-.07,-.32,0);const g=new THREE.ExtrudeGeometry(s,{depth:2.22,bevelEnabled:false,curveSegments:22});g.translate(2.07,1.55,-1.11);return g;}
function Panel({position,scale,color=graphite,opacity=1}:{position:[number,number,number];scale:[number,number,number];color?:string;opacity?:number}){return <mesh position={position} scale={scale}><boxGeometry/><meshStandardMaterial color={color} roughness={.42} metalness={.65} transparent={opacity<1} opacity={opacity}/></mesh>;}
export const Car:React.FC<{t:number}>=({t})=>{const body=useMemo(bodyGeometry,[]),cabin=useMemo(cabinGeometry,[]),wing=useMemo(wingGeometry,[]);const opacity=bodyOpacity(t);const cut=E(t,12.3,13.7)*(1-E(t,18.2,19.3));const load=E(t,19.2,21.2);return <group position={[0,-load*.012,0]}>
 <mesh geometry={body}><meshStandardMaterial color={graphite} roughness={.36} metalness={.8} side={THREE.DoubleSide} transparent opacity={opacity}/></mesh>
 <mesh geometry={cabin}><meshStandardMaterial color="#0b141e" roughness={.19} metalness={.65} transparent opacity={opacity*.92}/></mesh>
 <Panel position={[-.16,1.43,0]} scale={[1.15,.05,1.47]} opacity={opacity}/>
 {[-1,1].map(side=>[-1.64,1.65].map(x=><mesh key={`${side}-${x}`} position={[x,.43,side*.99]} scale={[1.1,1,1]}><torusGeometry args={[.48,.085,12,48,Math.PI]}/><meshStandardMaterial color={graphite} roughness={.48} metalness={.6} transparent opacity={opacity}/></mesh>))}
 {[-1,1].map(side=><group key={side}>
  <Panel position={[0,.36,side*1.02]} scale={[4.6,.3,.08]} opacity={opacity}/>
  <Panel position={[-2.56,.49,side*.66]} scale={[.06,.09,.52]} color="#e6f9ff" opacity={opacity}/>
  <Panel position={[2.52,.65,side*.65]} scale={[.05,.045,.5]} color="#de3a31" opacity={opacity}/>
  <Panel position={[-.67,.87,side*.91]} scale={[.37,.04,.06]} opacity={opacity}/>
  <Panel position={[-.2,.97,side*.87]} scale={[.5,.025,.025]} color="#647389" opacity={opacity}/>
  <Panel position={[.55,1.1,side*.82]} scale={[.035,.51,.035]} opacity={opacity}/>
  {[-1.64,1.65].map(x=><group key={x} position={[x,.43,side*1.04]}>
   <mesh scale={[1,1-load*.012,1]}><torusGeometry args={[.32,.115,20,64]}/><meshStandardMaterial color="#111316" roughness={.92}/></mesh>
   <mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.285,.285,.16,40]}/><meshStandardMaterial color="#77828e" metalness={.92} roughness={.3}/></mesh>
   <mesh position={[0,0,side*.09]}><torusGeometry args={[.245,.025,8,48]}/><meshStandardMaterial color="#b0bcc8" metalness={.9} roughness={.25}/></mesh>
   {Array.from({length:10},(_,i)=><mesh key={i} rotation={[0,0,i*Math.PI/5+(t<3?t*5:t>25?t*8:15)]} position={[0,0,side*.11]}><boxGeometry args={[.48,.025,.024]}/><meshStandardMaterial color="#252b33" metalness={.8} roughness={.3}/></mesh>)}
   <Panel position={[.1,.02,-side*.03]} scale={[.12,.24,.08]} color="#ff9c52"/>
  </group>)}
 </group>)}
 <Panel position={[-2.53,.22,0]} scale={[.52,.045,2.23]} color="#131b25"/>
 <Panel position={[0,.16,0]} scale={[4.35,.045,1.85]} color={cut>.2?'#296174':'#121b25'}/>
 <mesh position={[2.06,.26,0]} rotation={[0,0,.16]}><boxGeometry args={[1.05,.035,1.86]}/><meshStandardMaterial color={cut>.2?'#245c70':'#101721'} roughness={.5} metalness={.6}/></mesh>
 {[-.75,-.38,0,.38,.75].map(z=><Panel key={z} position={[2.1,.22,z]} scale={[1,.2,.025]} color="#161f29"/>)}
 {[-.7,.7].map(z=><Panel key={z} position={[1.95,1.19,z]} scale={[.075,.65,.05]} color="#202c3a"/>)}
 <mesh geometry={wing}><meshStandardMaterial color={t>=7&&t<13?'#394755':'#1c2632'} roughness={.4} metalness={.75}/></mesh>
 {[-1.13,1.13].map(z=><Panel key={z} position={[2.1,1.58,z]} scale={[.83,.28,.035]} color="#202d3b"/>)}
 <Panel position={[-2.42,.48,0]} scale={[.08,.22,.9]} color="#080d14" opacity={opacity}/>
 {Array.from({length:7},(_,i)=><Panel key={i} position={[-2.04+i*.075,.79,.51]} scale={[.025,.012,.35]} color="#0b1119" opacity={opacity}/>)}
 </group>;};
