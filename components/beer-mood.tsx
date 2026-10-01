import 'server-only';
import { database } from '@/lib/db';
import type { Beer } from '@/lib/types';
import { BeerMoodScene, type BeerMoodType } from './beer-mood-scene';

/** sudId is beer_entries.id (not the source ID or public sud number). */
export async function BeerMood({ sudId, type }: { sudId: number; type: BeerMoodType }) {
 if (!Number.isSafeInteger(sudId) || sudId < 1) return null;
 const sql = database();
 const rows = await sql`SELECT * FROM beer_entries WHERE id=${sudId} AND published=true`;
 const beer = rows[0] as Beer | undefined;
 if (!beer) return null;
 return <BeerMoodScene type={type} beer={{ name: beer.display_name || beer.brew.name, number: beer.public_number!, artwork: beer.image_url, accent: beer.accent }}/>;
}
