import 'server-only';
import { neon } from '@neondatabase/serverless';
import type { Beer, Brew } from './types';
import initialBrew from './initial-brew.json';
function localPreview(): Beer | null { if(process.env.VERCEL || process.env.NODE_ENV !== 'development' || process.env.LOCAL_PREVIEW !== '1') return null; return {id:1,source_id:37,brew:initialBrew as Brew,public_number:31,published:true,display_name:'Gurgelrutscher',description:'Ein obergäriges Helles aus der KrausBräu-Küche. Pale-Ale-Malz, Weizenmalz, Carapils und ein kleiner Anteil Haferflocken treffen auf Hallertauer Magnum und Nottingham-Hefe.',tasting_notes:'',accent:'#e9b44c',image_url:'/gurgelrutscher.webp',updated_at:''}; }
export function database() { const url = process.env.DATABASE_URL || process.env.POSTGRES_URL; if (!url) throw new Error('Datenbankverbindung fehlt.'); return neon(url); }
export async function listBeers(published = true): Promise<Beer[]> { const fixture=localPreview(); if(fixture) return [fixture]; const sql=database(); const rows=published ? await sql`SELECT * FROM beer_entries WHERE published=true ORDER BY public_number DESC` : await sql`SELECT * FROM beer_entries ORDER BY (brew->>'date') DESC NULLS LAST, id DESC`; return rows as Beer[]; }
export async function getBeer(number: number): Promise<Beer | null> { const fixture=localPreview(); if(fixture) return number===31?fixture:null; const sql=database(); const rows=await sql`SELECT * FROM beer_entries WHERE published=true AND public_number=${number}`; return (rows[0] as Beer)||null; }
export async function getAdminBeer(id: number): Promise<Beer | null> { const sql=database(); const rows=await sql`SELECT * FROM beer_entries WHERE id=${id}`; return (rows[0] as Beer)||null; }
