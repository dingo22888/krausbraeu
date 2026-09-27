'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Submit } from './submit';
type Item = { sourceId: number; number: number; name: string; date: string | null; existing: boolean };
export function ImportSelection({batch,items,initialSelected,action}:{batch:string;items:Item[];initialSelected:number[];action:(form:FormData)=>Promise<void>}) {
 const [selected,setSelected]=useState(()=>new Set(initialSelected));
 function toggle(id:number){setSelected(previous=>{const next=new Set(previous);if(next.has(id))next.delete(id);else next.add(id);return next;});}
 return <form action={action}>
  <input type="hidden" name="batch" value={batch}/>
  <div className="selection-toolbar"><p role="status">{selected.size} von {items.length} Suden ausgewählt</p><div><button type="button" className="secondary" onClick={()=>setSelected(new Set(items.map(b=>b.sourceId)))}>Alle auswählen</button><button type="button" className="secondary" onClick={()=>setSelected(new Set())}>Alle abwählen</button></div></div>
  <div className="table-scroll"><table className="import-table"><thead><tr><th>Importieren</th><th>Sud</th><th>Name</th><th>Aktion</th></tr></thead><tbody>{items.map(b=><tr key={b.sourceId} className={!selected.has(b.sourceId)?'skipped-row':''}><td><input id={`import-${b.sourceId}`} type="checkbox" name="source_id" value={b.sourceId} checked={selected.has(b.sourceId)} onChange={()=>toggle(b.sourceId)} aria-label={`${b.name} importieren (ID ${b.sourceId})`}/></td><td>{b.number}</td><td><label htmlFor={`import-${b.sourceId}`}>{b.name}</label>{!b.date&&<small className="draft-tag">Rezeptentwurf · noch nicht gebraut</small>}</td><td>{!selected.has(b.sourceId)?(b.existing?'Unverändert lassen':'Nicht importieren'):(b.existing?'Braudaten aktualisieren':'Privat anlegen')}</td></tr>)}</tbody></table></div>
  <p className="selection-note">Abgewählte Sude bleiben beim nächsten Import abgewählt. Du kannst sie jederzeit wieder auswählen. Bereits vorhandene Sude werden durch Abwählen nicht gelöscht.</p>
  <div className="actions"><Submit pending="Auswahl wird übernommen …">{selected.size?`${selected.size} Sude importieren`:'Auswahl ohne Import speichern'}</Submit><Link className="text-link" href="/admin">Abbrechen</Link></div>
 </form>;
}
