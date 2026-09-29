import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getBeer, getBeerNeighbors, listBeers } from '@/lib/db';
import { SudNavigation } from '@/components/sud-navigation';
import { BeerLabel } from '@/components/beer-label';
export const revalidate = false;
export const dynamicParams = true;
export async function generateStaticParams() {
 if (!process.env.VERCEL && !process.env.NEON_BEER_DATABASE_URL && !process.env.NEON_BEER_POSTGRES_URL) return [];
 return (await listBeers()).map(beer => ({ number: String(beer.public_number) }));
}
const lookupBeer = cache(getBeer);
async function lookup(params:Promise<{number:string}>){const {number}=await params;if(!/^[1-9]\d{0,8}$/.test(number))return null;return lookupBeer(Number(number));}
export async function generateMetadata({params}:{params:Promise<{number:string}>}){const beer=await lookup(params);return {title:beer?`${beer.display_name||beer.brew.name} · Sud ${beer.public_number}`:'Sud nicht gefunden'};}
export default async function Page({params}:{params:Promise<{number:string}>}){const beer=await lookup(params);if(!beer)notFound();const neighbors=await getBeerNeighbors(beer.public_number!);return <BeerLabel beer={beer} navigation={<SudNavigation neighbors={neighbors}/>}/>;}
