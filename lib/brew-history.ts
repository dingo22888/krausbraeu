import type { Beer } from './types.ts';
import { beerImages } from './beer-images.ts';

// Custom entries can later use the same presentation without a linked beer.
export type BrewEvent = {
 id: string; date: string; kind: 'brewed' | 'bottled' | 'custom';
 title: string; subtitle: string; href?: string; image?: string; accent: string; number?: number;
};
export function eventDate(value: string | null): string | null {
 const day = value?.slice(0, 10);
 if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
 const parsed = new Date(`${day}T12:00:00Z`);
 return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === day ? day : null;
}
export function brewHistory(beers: Beer[]): BrewEvent[] {
 return beers.filter(b => b.published && b.public_number !== null).flatMap(b => {
  const shared = { title: b.display_name || b.brew.name, subtitle: b.brew.style || 'Hausgebraut', href: `/${b.public_number}`, image: beerImages(b)[0]?.url, accent: b.accent, number: b.public_number! };
  return ([['brewed', b.brew.date], ['bottled', b.brew.bottledDate]] as const).flatMap(([kind, raw]) => {
   const date = eventDate(raw);
   return date ? [{ ...shared, id: `${b.id}-${kind}`, kind, date }] : [];
  });
 }).sort((a,b) => b.date.localeCompare(a.date) || (a.kind === b.kind ? (b.number ?? 0) - (a.number ?? 0) : a.kind === 'bottled' ? -1 : 1));
}
