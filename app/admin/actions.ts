'use server';
import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';
import { requireAdmin, COOKIE } from '@/lib/auth';
import { database } from '@/lib/db';
import { parseSqlite } from '@/lib/import-sqlite';
import type { Brew } from '@/lib/types';
import { publicationIds } from '@/lib/publication';
import { partitionSelection } from '@/lib/import-selection';
export async function logout(){(await cookies()).delete(COOKIE);redirect('/admin');}
export async function stageImport(form:FormData){await requireAdmin();const file=form.get('database');if(!(file instanceof File)||file.size===0||file.size>3*1024*1024)redirect('/admin?error=file');let rows:Brew[];try{rows=await parseSqlite(Buffer.from(await file.arrayBuffer()));}catch{redirect('/admin?error=sqlite');}const sql=database();const id=randomUUID();await sql`DELETE FROM beer_import_batches WHERE created_at < now()-interval '1 day'`;await sql`INSERT INTO beer_import_batches(id,payload) VALUES(${id},${JSON.stringify(rows)}::jsonb)`;redirect(`/admin/import/${id}`);}
export async function confirmImport(form:FormData) {
 await requireAdmin();const id=String(form.get('batch')||'');if(!/^[a-f\d-]{36}$/.test(id))redirect('/admin?error=batch');
 const sql=database();const rows=await sql`SELECT payload FROM beer_import_batches WHERE id=${id}::uuid AND created_at>now()-interval '1 day'`;
 if(!rows[0])redirect('/admin?error=batch');const brews=rows[0].payload as Brew[];
 let selection: ReturnType<typeof partitionSelection>;
 try {selection=partitionSelection(brews,form.getAll('source_id'));}catch{redirect(`/admin/import/${id}?error=selection`);}
 await sql.transaction([
  ...selection.selected.map(b=>sql`INSERT INTO beer_entries(source_id,brew) VALUES(${b.sourceId},${JSON.stringify(b)}::jsonb) ON CONFLICT(source_id) DO UPDATE SET brew=EXCLUDED.brew,updated_at=now()`),
  ...selection.selected.map(b=>sql`DELETE FROM beer_import_exclusions WHERE source_id=${b.sourceId}`),
  ...selection.skipped.map(b=>sql`INSERT INTO beer_import_exclusions(source_id) VALUES(${b.sourceId}) ON CONFLICT DO NOTHING`),
  sql`DELETE FROM beer_import_batches WHERE id=${id}::uuid`
 ]);
 revalidatePath('/','layout');redirect('/admin?success=import');
}
export async function deleteBeer(form:FormData) {
 await requireAdmin();const id=Number(form.get('id'));if(!Number.isSafeInteger(id)||id<1)redirect('/admin');
 if(form.get('confirmation')!=='LÖSCHEN')redirect(`/admin/beer/${id}?error=confirmation`);
 const sql=database();
 await sql.transaction([
  sql`INSERT INTO beer_import_exclusions(source_id) SELECT source_id FROM beer_entries WHERE id=${id} ON CONFLICT DO NOTHING`,
  sql`DELETE FROM beer_entries WHERE id=${id}`
 ]);
 revalidatePath('/','layout');redirect('/admin?success=deleted');
}
export async function saveBeer(form:FormData){await requireAdmin();const id=Number(form.get('id'));if(!Number.isSafeInteger(id)||id<1)redirect('/admin');const returnTo=`/admin/beer/${id}`;const title=String(form.get('display_name')||'').trim().slice(0,120);const description=String(form.get('description')||'').trim().slice(0,4000);const tasting=String(form.get('tasting_notes')||'').trim().slice(0,4000);const color=String(form.get('accent')||'');const published=form.get('published')==='on';const rawNumber=String(form.get('public_number')||'');const number=rawNumber===''?null:Number(rawNumber);if(!/^#[\da-f]{6}$/i.test(color)||(number!==null&&(!Number.isSafeInteger(number)||number<=0||number>99999999))||(published&&number===null))redirect(returnTo+'?error=validation');
 const sql=database();const previous=await sql`SELECT image_url,public_number FROM beer_entries WHERE id=${id}`;if(!previous[0])redirect('/admin');let imageUrl=previous[0].image_url as string;
 const file=form.get('artwork');if(file instanceof File&&file.size>0){if(!process.env.BLOB_READ_WRITE_TOKEN)redirect(returnTo+'?error=storage');if(file.size>3*1024*1024)redirect(returnTo+'?error=image');const data=Buffer.from(await file.arrayBuffer());const png=data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));const jpg=data[0]===255&&data[1]===216&&data[2]===255;const webp=data.subarray(0,4).toString()==='RIFF'&&data.subarray(8,12).toString()==='WEBP';if(!png&&!jpg&&!webp)redirect(returnTo+'?error=image');const ext=png?'png':jpg?'jpg':'webp';const blob=await put(`beer/${id}/artwork.${ext}`,data,{access:'public',addRandomSuffix:true,contentType:png?'image/png':jpg?'image/jpeg':'image/webp'});imageUrl=blob.url;}
 // Preserve an already assigned public URL. Reimported source numbers never rename it.
 if(previous[0].public_number!==null&&previous[0].public_number!==number)redirect(returnTo+'?error=number');
 try{await sql`UPDATE beer_entries SET display_name=${title},description=${description},tasting_notes=${tasting},accent=${color},public_number=${number},published=${published},image_url=${imageUrl},updated_at=now() WHERE id=${id}`;}catch(error){if((error as {code?:string}).code==='23505')redirect(returnTo+'?error=duplicate');throw error;}revalidatePath('/','layout');redirect(returnTo+'?success=saved');}

export async function bulkPublication(form:FormData) {
 await requireAdmin();
 const operation=form.get('operation');
 if(operation!=='publish'&&operation!=='unpublish')redirect('/admin?error=selection');
 let ids:number[];
 try{ids=publicationIds(form.getAll('beer_id'));}catch{redirect('/admin?error=selection');}
 const sql=database();const publishing=operation==='publish';
 let changed;
 try {
  changed=await sql`
   WITH selected AS MATERIALIZED (
    SELECT id, COALESCE(public_number, CASE WHEN brew->>'number' ~ '^[1-9][0-9]{0,7}$' THEN (brew->>'number')::integer END) AS target
    FROM beer_entries WHERE id=ANY(${ids}::integer[])
   ), valid AS (
    SELECT (SELECT count(*) FROM selected)=${ids.length}
     AND (NOT ${publishing} OR (
      NOT EXISTS (SELECT 1 FROM selected WHERE target IS NULL)
      AND NOT EXISTS (SELECT target FROM selected GROUP BY target HAVING count(*)>1)
      AND NOT EXISTS (SELECT 1 FROM beer_entries e JOIN selected s ON e.public_number=s.target WHERE e.id<>s.id)
     )) AS ok
   )
   UPDATE beer_entries e SET published=${publishing},
    public_number=CASE WHEN ${publishing} THEN s.target ELSE e.public_number END,
    updated_at=now()
   FROM selected s,valid v WHERE e.id=s.id AND v.ok RETURNING e.id
  `;
 }catch(error){if((error as {code?:string}).code==='23505')redirect('/admin?error=publication');throw error;}
 if(changed.length!==ids.length)redirect('/admin?error=publication');
 revalidatePath('/','layout');redirect(`/admin?success=${publishing?'published':'private'}&count=${changed.length}`);
}
