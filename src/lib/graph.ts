export type Person = { id: string; name: string; role: string; company: string; x: number; y: number };
export type Edge = { source: string; target: string };
export type SearchResult = { found: boolean; path: string[]; visited: string[]; steps: number; algorithm: string; elapsedMs: number };

export const people: Person[] = [
 {id:'p1',name:'You',role:'Computer Science Student',company:'Your Network',x:48,y:48},
 {id:'p2',name:'Aarav Mehta',role:'Software Engineer',company:'Google',x:26,y:25},
 {id:'p3',name:'Maya Shah',role:'ML Engineer',company:'Microsoft',x:70,y:22},
 {id:'p4',name:'Rohan Kapoor',role:'Data Scientist',company:'Amazon',x:18,y:68},
 {id:'p5',name:'Isha Verma',role:'Product Manager',company:'Adobe',x:76,y:55},
 {id:'p6',name:'Kabir Singh',role:'Research Intern',company:'IIT Delhi',x:43,y:80},
 {id:'p7',name:'Ananya Rao',role:'Recruiter',company:'NVIDIA',x:90,y:79},
 {id:'p8',name:'Dev Patel',role:'Backend Engineer',company:'Atlassian',x:52,y:12},
 {id:'p9',name:'Sara Khan',role:'AI Researcher',company:'DeepMind',x:89,y:34},
 {id:'p10',name:'Vikram Joshi',role:'Tech Lead',company:'Flipkart',x:9,y:43},
 {id:'p11',name:'Neha Gupta',role:'Data Analyst',company:'Deloitte',x:63,y:67},
 {id:'p12',name:'Arjun Nair',role:'Engineering Manager',company:'Spotify',x:32,y:54}
];
export const edges: Edge[] = [
 ['p1','p2'],['p1','p4'],['p1','p6'],['p2','p3'],['p2','p8'],['p3','p8'],['p3','p9'],['p4','p10'],['p4','p12'],['p5','p9'],['p5','p11'],['p6','p11'],['p6','p12'],['p7','p11'],['p7','p9'],['p8','p12'],['p10','p12'],['p2','p12'],['p3','p5']
].map(([source,target])=>({source,target}));
export const presets = {
  career: { people, edges },
  tech: { people: people.filter(p=>['p1','p2','p3','p6','p8','p9','p10','p12'].includes(p.id)), edges: edges.filter(e=>['p1','p2','p3','p6','p8','p9','p10','p12'].includes(e.source)&&['p1','p2','p3','p6','p8','p9','p10','p12'].includes(e.target)) },
  compact: { people: people.slice(0,8), edges: edges.filter(e=>Number(e.source.slice(1))<=8&&Number(e.target.slice(1))<=8) }
};
export function neighbors(id:string, graphPeople:Person[], graphEdges:Edge[]) { return graphEdges.flatMap(e=>e.source===id?[e.target]:e.target===id?[e.source]:[]); }
export function findPath(start:string,target:string,graphPeople:Person[],graphEdges:Edge[],algorithm:'bfs'|'bidirectional'):SearchResult {
 const t0=performance.now(); if(start===target) return {found:true,path:[start],visited:[start],steps:0,algorithm,elapsedMs:0};
 const adjacency=new Map(graphPeople.map(p=>[p.id,neighbors(p.id,graphPeople,graphEdges)]));
 const visited:string[]=[]; let steps=0; let path:string[]=[];
 if(algorithm==='bfs') {
  const queue=[start], parent=new Map<string,string|null>([[start,null]]);
  while(queue.length){ const cur=queue.shift()!; visited.push(cur); steps++; if(cur===target) break;
   for(const next of adjacency.get(cur)??[]) if(!parent.has(next)){parent.set(next,cur);queue.push(next);}
  }
  if(parent.has(target)){let cur:string|null=target;while(cur){path.unshift(cur);cur=parent.get(cur)??null;}}
 } else {
  const qa=[start], qb=[target], pa=new Map<string,string|null>([[start,null]]), pb=new Map<string,string|null>([[target,null]]); let meet:string|undefined;
  while(qa.length&&qb.length&&!meet){
   const expandA=qa.length<=qb.length; const queue=expandA?qa:qb; const own=expandA?pa:pb; const other=expandA?pb:pa;
   const level=queue.length;
   for(let i=0;i<level&&!meet;i++){const cur=queue.shift()!;visited.push(cur);steps++;
    for(const next of adjacency.get(cur)??[]){if(!own.has(next)){own.set(next,cur);queue.push(next);}if(other.has(next)){meet=next;break;}}
   }
  }
  if(meet){let cur:string|null=meet;const left:string[]=[];while(cur){left.unshift(cur);cur=pa.get(cur)??null;}cur=pb.get(meet)??null;while(cur){left.push(cur);cur=pb.get(cur)??null;}path=left;}
 }
 return {found:path.length>0,path,visited:[...new Set(visited)],steps,algorithm,elapsedMs:performance.now()-t0};
}
export function degreeMap(graphPeople:Person[],graphEdges:Edge[]) { return Object.fromEntries(graphPeople.map(p=>[p.id,neighbors(p.id,graphPeople,graphEdges).length])); }
export function recommendBridges(start:string,target:string,graphPeople:Person[],graphEdges:Edge[]) {
 const direct=findPath(start,target,graphPeople,graphEdges,'bfs'); if(direct.found)return [];
 const startReach=new Set<string>([start]), targetReach=new Set<string>([target]); const q1=[start],q2=[target];
 while(q1.length){const n=q1.shift()!;for(const v of neighbors(n,graphPeople,graphEdges))if(!startReach.has(v)){startReach.add(v);q1.push(v);}}
 while(q2.length){const n=q2.shift()!;for(const v of neighbors(n,graphPeople,graphEdges))if(!targetReach.has(v)){targetReach.add(v);q2.push(v);}}
 return graphPeople.filter(p=>p.id!==start&&p.id!==target&&(startReach.has(p.id)||targetReach.has(p.id))).map(p=>({...p,score:neighbors(p.id,graphPeople,graphEdges).length})).sort((a,b)=>b.score-a.score).slice(0,4);
}
