import React from 'react';
import {C, Label, mono, sans, Reveal} from './design';
import {balanceAt, EVENTS, FINANCE, formatIDR, mix, progress, spring} from './motion.mjs';

export const Expenses:React.FC<{t:number}> = ({t})=>{
 const enter=progress(t,4.05,5), drain=progress(t,8.85,9.45);
 const balance=balanceAt(t), salaryWidth=1420*balance/FINANCE.initial;
 return <g opacity={enter*(1-drain)}>
  <Reveal t={t} start={4.82} x={230} y={176} w={1460} h={110}><text x={0} y={88} fontFamily={sans} fontWeight={700} fontSize={94} letterSpacing={-4}>Then life takes its cut.</text></Reveal>
  <Label x={237} y={337} size={23}>THE EVERYDAY EXPENSE TRACK</Label>
  <Label x={1680} y={337} anchor="end" size={23}>DEBITS / 01—03</Label>
  <path d="M250 635H1670" stroke={C.ink} strokeWidth={2} opacity={.25}/>
  {FINANCE.expenses.slice(0,3).map((expense,i)=>{
    const hit=EVENTS.deductions[i], p=progress(t,hit-.52,hit-.03), paid=progress(t,hit,hit+.25);
    const x=250+i*485, y=mix(633,423,p)+7*Math.sin(Math.max(0,t-hit)*27)*Math.exp(-Math.max(0,t-hit)*10)*(t>=hit?1:0);
    const h=mix(3,190,p);
    const segment=1420*expense.amount/FINANCE.initial;
    const before=FINANCE.initial-FINANCE.expenses.slice(0,i).reduce((s,e)=>s+e.amount,0);
    const peel=progress(t,hit,hit+.55);
    return <g key={expense.label}>
     <g transform={`translate(${x+65*(1-p)} ${y})`}>
      <rect width={450} height={h} fill={paid>.01?C.ink:C.paper} stroke={C.ink} strokeWidth={2}/>
      <svg width={450} height={h} overflow="hidden" opacity={p}>
       <Label x={26} y={43} size={18} fill={paid>.01?C.paper:C.ink}>0{i+1} / RECURRING</Label>
       <text x={25} y={96} fontFamily={sans} fontWeight={700} fontSize={i===2?37:49} fill={paid>.01?C.paper:C.ink}>{expense.label}</text>
       <text data-type="transaction" x={25} y={156} fontFamily={mono} fontSize={34} fill={paid>.01?C.paper:C.ink}>−{formatIDR(expense.amount)}</text>
       <path d="M405 26V52M392 39H418" stroke={C.red} strokeWidth={3} transform={`rotate(${45*paid} 405 39)`}/>
      </svg>
     </g>
     <path d={`M${x+225} ${y+h}V709`} stroke={C.ink} strokeWidth={1} strokeDasharray="4 7" opacity={p*.45}/>
     {t>=hit&&t<hit+.6?<rect x={250+1420*before/FINANCE.initial-segment} y={728-85*peel} width={segment} height={56*(1-peel)} fill={C.red} opacity={1-peel}/>:null}
    </g>;
  })}
  <Label x={250} y={701} size={20}>YOUR SALARY</Label>
  <Label x={1670} y={701} size={20} anchor="end">100% = Rp5.000.000</Label>
  <rect x={250} y={728} width={1420} height={56} fill={C.ink} opacity={.09}/>
  <rect x={250} y={728} width={salaryWidth} height={56} fill={C.green} stroke={C.ink} strokeWidth={2}/>
  <path d={`M${250+salaryWidth} 720V792`} stroke={C.ink} strokeWidth={3}/>
 </g>;
};

export const DrainCards:React.FC<{t:number}>=({t})=><g opacity={progress(t,9,9.4)*(1-progress(t,12.15,12.65))}>
 <Label x={960} y={252} size={23} anchor="middle">AND THE LITTLE THINGS?</Label>
 {FINANCE.expenses.slice(3).map((expense,i)=>{
  const hit=EVENTS.deductions[i+3], p=spring(t-hit+.5,13,.95), paid=progress(t,hit,hit+.4);
  const x=i?1000:310;
  return <g key={expense.label} transform={`translate(${x} ${mix(820,670,p)})`} opacity={progress(t,hit-.5,hit-.2)}>
    <rect width={610} height={150} fill={i?C.red:C.ink}/>
    <Label x={30} y={46} size={24} fill={i?C.ink:C.paper}>{expense.label}</Label>
    <text data-type="transaction" x={30} y={110} fontFamily={mono} fontSize={40} fill={i?C.ink:C.paper}>−{formatIDR(expense.amount)}</text>
    <path d="M550 35V65M535 50H565" stroke={i?C.ink:C.red} strokeWidth={3} transform={`rotate(${45*paid} 550 50)`}/>
  </g>;
 })}
</g>;
