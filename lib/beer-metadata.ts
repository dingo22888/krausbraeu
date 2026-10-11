import type {Metadata} from 'next';
import type {Beer} from './types';
import {beerImages} from './beer-images';
export function beerMetadata(beer:Beer,home=false):Metadata{
 const title=home?'KrausBräu · Handgebraut':`${beer.display_name||beer.brew.name} · Sud ${beer.public_number}`;
 const description=beer.description||`${beer.display_name||beer.brew.name} – ein Bier von KrausBräu.`;
 const first=beerImages(beer)[0];const images=first?[{url:new URL(first.url,'https://beer.krausonline.de').href,alt:first.caption||beer.display_name||beer.brew.name}]:[];
 return {title,description,openGraph:{title,description,type:'website',url:home?'https://beer.krausonline.de/':`https://beer.krausonline.de/${beer.public_number}`,images},twitter:{card:'summary_large_image',title,description,images}};
}
