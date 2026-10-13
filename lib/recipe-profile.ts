import type { Beer } from './types.ts';
export const recipeHeadline = (beer: Beer) => beer.recipe_headline?.trim() || beer.brew.style?.trim() || `Das Rezept für ${beer.display_name || beer.brew.name}`;

// Decorative grain palette, not a beer-colour conversion or a measured grain colour.
// EBC measures a malt's extract; physical kernels can look different.
export function maltColor(ebc: number | null | undefined): string | null {
  if (ebc == null || !Number.isFinite(ebc) || ebc < 0) return null;
  const stops = [[0,235,219,168],[10,207,174,104],[30,173,127,65],[100,129,79,39],[400,77,43,27],[1000,43,30,24],[1500,28,24,22]];
  for (let i=1;i<stops.length;i++) {
    const a=stops[i-1], b=stops[i];
    if (ebc<=b[0]) {
      const t=(ebc-a[0])/(b[0]-a[0]);
      return '#'+a.slice(1).map((c,j)=>Math.round(c+(b[j+1]-c)*t).toString(16).padStart(2,'0')).join('');
    }
  }
  return '#1c1816';
}
