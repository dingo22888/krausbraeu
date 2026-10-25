import type { Beer } from './types.ts';
import { beerMetrics } from './beer-metrics.ts';
export const shareSections = ['werte','rezept','schuettung','hopfen','hefe','verkostung'] as const;
export type ShareSection = typeof shareSections[number];
export function isShareSection(value:string):value is ShareSection {return (shareSections as readonly string[]).includes(value);}
const n=(value:number|null|undefined,digits=1)=>value==null?'—':new Intl.NumberFormat('de-DE',{maximumFractionDigits:digits}).format(value);
export function sectionShare(beer:Beer,section:ShareSection){
 const b=beer.brew;const metrics=beerMetrics(b);
 const name=beer.display_name||b.name;
 const labels:Record<ShareSection,string>={werte:metrics.draft?'Planwerte':'Bierwerte',rezept:'Rezept',schuettung:'Schüttung',hopfen:'Hopfen',hefe:'Hefe',verkostung:'Verkostung'};
 const malts=b.malts.map(m=>({label:m.name,value:`${n(m.amount,2)} kg`}));
 const hops=b.hops.map(h=>({label:h.name,value:`${n(h.amount)} g · ${h.firstWort?'Vorderwürze':h.minutes!=null?`${n(h.minutes)} min`:'Zeit offen'}`}));
 const yeasts=(b.yeastDetails?.length?b.yeastDetails:b.yeast.map(name=>({name,amount:null}))).map(y=>({label:y.name,value:y.amount==null?'':`${n(y.amount)} ${y.amount===1?'Packung':'Packungen'}`}));
 const values=[{label:metrics.draft?'Stammwürze · geplant':'Stammwürze · beim Anstellen',value:`${n(metrics.gravity)} °P`},{label:'Bittere · Rezept',value:`${n(b.ibu,0)} IBU`},{label:'Farbe · berechnet',value:`${n(b.ebc,0)} EBC`},{label:'Ausschlag · geplant',value:`${n(b.volume)} l`}];
 if(metrics.abv!==null) values.push({label:'Alkohol · berechnet',value:`${n(metrics.abv)} % vol.`});
 const rows=section==='werte'?values:section==='schuettung'?malts:section==='hopfen'?hops:section==='hefe'?yeasts:section==='verkostung'?[{label:beer.tasting_notes,value:''}]:[{label:'Stammwürze / Bittere / Farbe',value:`${n(metrics.gravity)} °P · ${n(b.ibu,0)} IBU · ${n(b.ebc,0)} EBC`},{label:'Malz',value:malts.map(m=>m.label).join(', ')},{label:'Hopfen',value:hops.map(h=>h.label).join(', ')},{label:'Hefe',value:yeasts.map(y=>y.label).join(', ')}];
 const title=`${name} · ${labels[section]} · KrausBräu`;
 const description=(rows.length?rows.map(r=>[r.label,r.value].filter(Boolean).join(': ')).join(' · '):'Keine Angaben hinterlegt.').slice(0,600);
 return {name,label:labels[section],title,description,rows,draft:metrics.draft,path:`/${beer.public_number}/teilen/${section}`,destination:`/${beer.public_number}#${section}`};
}
