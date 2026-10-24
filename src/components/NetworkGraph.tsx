import { useMemo } from 'react';
import type { Edge, Person, SearchResult } from '../lib/graph';
import { degreeMap } from '../lib/graph';

type Props={people:Person[];edges:Edge[];result:SearchResult|null;start:string;target:string;onMove:(id:string,x:number,y:number)=>void};
export default function NetworkGraph({people,edges,result,start,target,onMove}:Props){
 const degree=useMemo(()=>degreeMap(people,edges),[people,edges]);
 const pathEdges=new Set((result?.path??[]).slice(1).map((id,i)=>[result!.path[i],id].sort().join(':')));
 const visited=new Set(result?.visited??[]); const path=new Set(result?.path??[]);
 return <svg className="network-svg" viewBox="0 0 100 100" role="img" aria-label="Interactive social connection network">
  <defs><pattern id="dots" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx=".4" cy=".4" r=".12" fill="#34415c"/></pattern><filter id="glow"><feGaussianBlur stdDeviation="1.1" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <rect width="100" height="100" fill="url(#dots)" />
  {edges.map((e,i)=>{const a=people.find(p=>p.id===e.source),b=people.find(p=>p.id===e.target);if(!a||!b)return null;const hot=pathEdges.has([e.source,e.target].sort().join(':'));return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={hot?'edge edge-path':'edge'} />})}
  {people.map(p=>{const isStart=p.id===start,isTarget=p.id===target,isPath=path.has(p.id),isVisited=visited.has(p.id);const r=1.2+Math.min(degree[p.id]??0,5)*.11;return <g key={p.id} className="graph-node" transform={`translate(${p.x} ${p.y})`} onPointerDown={e=>{(e.currentTarget as SVGGElement).setPointerCapture(e.pointerId);const svg=(e.currentTarget.ownerSVGElement);if(!svg)return;const move=(ev:PointerEvent)=>{const rect=svg.getBoundingClientRect();onMove(p.id,Math.max(5,Math.min(95,(ev.clientX-rect.left)/rect.width*100)),Math.max(5,Math.min(95,(ev.clientY-rect.top)/rect.height*100)));};const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up,{once:true});}}>
    {(isStart||isTarget)&&<circle r={r+1.05} className={isStart?'node-ring start-ring':'node-ring target-ring'}/>}
    <circle r={r} className={`node-core ${isPath?'node-path':isVisited?'node-visited':''} ${isStart?'node-start':''} ${isTarget?'node-target':''}`} filter={isPath?'url(#glow)':undefined}/>
    <text y={r+2.1} textAnchor="middle" className="node-label">{p.name.split(' ')[0]}</text>
    {(isStart||isTarget)&&<text y={-r-1.7} textAnchor="middle" className="node-tag">{isStart?'START':'TARGET'}</text>}
   </g>})}
 </svg>
}
