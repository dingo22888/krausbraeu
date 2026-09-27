'use client';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
type Item = { id:number; number:number; name:string; date:string; published:boolean; publicNumber:number|null; color:string; hasArtwork:boolean };
function Controls({count}:{count:number}) {
 const {pending}=useFormStatus();
 return <div className="actions bulk-actions"><button name="operation" value="publish" disabled={!count||pending}>{pending?'Wird gespeichert …':`${count} Sude veröffentlichen`}</button><button className="secondary" name="operation" value="unpublish" disabled={!count||pending}>Auswahl auf privat setzen</button></div>;
}
export function BeerSelection({items,action}:{items:Item[];action:(form:FormData)=>Promise<void>}) {
 const [selected,setSelected]=useState<Set<number>>(()=>new Set());
 function toggle(id:number){setSelected(old=>{const next=new Set(old);if(next.has(id))next.delete(id);else next.add(id);return next;});}
 return <form action={action}>
  <div className="selection-toolbar"><p role="status">{selected.size} von {items.length} ausgewählt</p><div><button type="button" className="secondary" onClick={()=>setSelected(new Set(items.map(b=>b.id)))}>Alle auswählen</button><button type="button" className="secondary" onClick={()=>setSelected(new Set(items.filter(b=>!b.published).map(b=>b.id)))}>Nur private</button><button type="button" className="secondary" onClick={()=>setSelected(new Set())}>Abwählen</button></div></div>
  <Controls count={selected.size}/>
  <p className="selection-note">Neue öffentliche Links verwenden die Sudnummer. Bereits vergebene Links bleiben erhalten. Bei einer doppelten oder fehlenden Nummer wird die gesamte Veröffentlichung gestoppt.</p>
  <div className="bulk-list">{items.map(b=><div className="bulk-row" key={b.id}>
   <input type="checkbox" name="beer_id" value={b.id} id={`beer-${b.id}`} checked={selected.has(b.id)} onChange={()=>toggle(b.id)}/>
   <span className="archive-number">{b.number}</span>
   <div className="bulk-info"><label htmlFor={`beer-${b.id}`}>{b.name}</label><span>{b.date} · {b.published?'Veröffentlicht':'Privat'}{b.publicNumber!==null?` · /${b.publicNumber}`:''}</span><small><i className="color-dot" style={{backgroundColor:b.color}}/>{b.hasArtwork?'Artwork vorhanden':'Ohne Artwork'}</small></div>
   <Link className="text-link" href={`/admin/beer/${b.id}`}>Bearbeiten ↗</Link>
  </div>)}</div>
 </form>;
}
