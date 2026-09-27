import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { database } from '@/lib/db';
import type { Brew } from '@/lib/types';
import { confirmImport } from '../../actions';
import { Submit } from '@/components/submit';
export const dynamic='force-dynamic';
export const metadata={title:'Import prüfen',robots:{index:false,follow:false}};
export default async function ImportPage({params}:{params:Promise<{id:string}>}){await requireAdmin();const {id}=await params;if(!/^[a-f\d-]{36}$/.test(id))notFound();const sql=database();const batches=await sql`SELECT payload FROM beer_import_batches WHERE id=${id}::uuid AND created_at>now()-interval '1 day'`;if(!batches[0])notFound();const brews=batches[0].payload as Brew[];const entries=await sql`SELECT source_id FROM beer_entries`;const known=new Set(entries.map(x=>x.source_id));return <section className="admin section"><Link href="/admin">← Braukeller</Link><h1>Import prüfen.</h1><p>{brews.length} Sude gefunden. {brews.filter(b=>!known.has(b.sourceId)).length} neu, {brews.filter(b=>known.has(b.sourceId)).length} vorhanden. Bestehende Braudaten werden aktualisiert. Eigene Texte, Motive und öffentliche Adressen bleiben erhalten. Fehlende Sude werden nicht gelöscht.</p><div className="table-scroll"><table><thead><tr><th>Sud</th><th>Name</th><th>Aktion</th></tr></thead><tbody>{brews.map(b=><tr key={b.sourceId}><td>{b.number}</td><td>{b.name}</td><td>{known.has(b.sourceId)?'Braudaten aktualisieren':'Privat anlegen'}</td></tr>)}</tbody></table></div><form action={confirmImport}><input type="hidden" name="batch" value={id}/><Submit pending="Wird importiert …">{brews.length} Sude importieren</Submit> <Link className="text-link" href="/admin">Abbrechen</Link></form></section>}
