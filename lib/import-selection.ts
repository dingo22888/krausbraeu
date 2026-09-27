import type { Brew } from './types.ts';
export function defaultSelection(brews: Brew[], excluded: number[]): number[] {
 const excludedIds = new Set(excluded);
 return brews.filter(b => !!b.date && !excludedIds.has(b.sourceId)).map(b => b.sourceId);
}
export function partitionSelection(brews: Brew[], submitted: FormDataEntryValue[]) {
 const valid = new Set(brews.map(b => b.sourceId));
 const selectedIds = new Set<number>();
 for (const value of submitted) {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value) || !valid.has(Number(value))) throw new Error('Ungültige Importauswahl.');
  selectedIds.add(Number(value));
 }
 return { selected: brews.filter(b => selectedIds.has(b.sourceId)), skipped: brews.filter(b => !selectedIds.has(b.sourceId)) };
}
