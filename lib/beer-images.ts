import type { Beer } from './types.ts';
export type BeerImage = {id:string;url:string;caption:string};
export function beerImages(beer:Pick<Beer,'images'|'image_url'>):BeerImage[]{
 return beer.images ?? (beer.image_url ? [{id:'original',url:beer.image_url,caption:''}] : []);
}
export function editImages(value:string,existing:BeerImage[]):BeerImage[]{
 const rows:unknown=JSON.parse(value);
 if(!Array.isArray(rows)||rows.length>30)throw new Error('Invalid gallery');
 const used=new Set<string>();
 return rows.map(row=>{
  if(!row||typeof row.id!=='string'||typeof row.caption!=='string'||row.caption.length>300||used.has(row.id))throw new Error('Invalid image');
  const original=existing.find(image=>image.id===row.id);if(!original)throw new Error('Unknown image');
  used.add(row.id);return {...original,caption:row.caption.trim()};
 });
}
