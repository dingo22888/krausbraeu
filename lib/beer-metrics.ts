import type { Brew } from './types.ts';

// Undated, unbottled recipes have no measured brewing results yet.
export function beerMetrics(brew: Brew) {
 const draft = !brew.date && !brew.bottledDate;
 return {
  draft,
  gravity: draft ? brew.plannedGravity : brew.originalGravity,
  // The import stores alcohol only after bottling. Never use a draft's
  // calculated actual-result field as a recipe forecast.
  abv: draft ? null : brew.abv,
 };
}
