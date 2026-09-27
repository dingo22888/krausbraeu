import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { database } from '@/lib/db';
import type { Brew } from '@/lib/types';
import { defaultSelection } from '@/lib/import-selection';
import { ImportSelection } from '@/components/import-selection';
import { confirmImport } from '../../actions';
export const dynamic='force-dynamic';
export const metadata={title:'Import prüfen',robots:{index:false,follow:false}};
export default async function ImportPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{error?:string}>}) {
 await requireAdmin();const {id}=await params;if(!/^[a-f\d-]{36}$/.test(id))notFound();const sql=database();
 const [batches,entries,excluded]=await Promise.all([sql`SELECT payload FROM beer_import_batches WHERE id=${id}::uuid AND created_at>now()-interval '1 day'`,sql`SELECT source_id FROM beer_entries`,sql`SELECT source_id FROM beer_import_exclusions`]);
 if(!batches[0])notFound();const brews=batches[0].payload as Brew[];const known=new Set(entries.map(x=>x.source_id));const query=await searchParams;
 return <section className="admin section"><Link href="/admin">← Braukeller</Link><h1>Deine Sude auswählen.</h1><p>{brews.length} Sude gefunden. Wähle aus, welche du übernehmen möchtest. Ungebraute Rezeptentwürfe sind zunächst abgewählt. Deine eigenen Texte, Motive und öffentlichen Adressen bleiben beim Import erhalten.</p>{query.error&&<p className="notice error" role="alert">Die Auswahl war ungültig. Bitte wähle die gewünschten Sude erneut aus.</p>}<ImportSelection batch={id} items={brews.map(b=>({sourceId:b.sourceId,number:b.number,name:b.name,date:b.date,existing:known.has(b.sourceId)}))} initialSelected={defaultSelection(brews,excluded.map(x=>Number(x.source_id)))} action={confirmImport}/></section>;
}
