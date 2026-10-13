import 'server-only';
import {del} from '@vercel/blob';
import {database} from './db';
// Only uploads owned by this application; never repository artwork or arbitrary URLs.
export async function cleanupBlobs(){
 const sql=database();
 const pending=await sql`SELECT url,beer_id FROM beer_blob_cleanup ORDER BY created_at LIMIT 100`;
 for(const item of pending){
  const url=new URL(item.url);
  if(url.origin!=='https://fsaen4cfpqghbymz.public.blob.vercel-storage.com'||!url.pathname.startsWith(`/beer/${item.beer_id}/`)||url.search||url.hash)continue;
  const referenced=await sql`SELECT id FROM beer_entries WHERE image_url=${item.url} OR EXISTS(SELECT 1 FROM jsonb_array_elements(COALESCE(images,'[]'::jsonb)) image WHERE image->>'url'=${item.url}) LIMIT 1`;
  if(referenced.length)continue;
  try{await del(item.url);}catch{console.error('Blob cleanup pending; retry from admin.');continue;}
  await sql`DELETE FROM beer_blob_cleanup WHERE url=${item.url}`;
 }
 const remaining=await sql`SELECT count(*)::integer AS count FROM beer_blob_cleanup`;
 return remaining[0].count as number;
}
