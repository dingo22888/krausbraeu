import { notFound } from 'next/navigation';
import { getBeer } from '@/lib/db';
import { BeerLabel } from '@/components/beer-label';
export const dynamic='force-dynamic';
async function lookup(params:Promise<{number:string}>){const {number}=await params;if(!/^[1-9]\d{0,8}$/.test(number))return null;return getBeer(Number(number));}
export async function generateMetadata({params}:{params:Promise<{number:string}>}){const beer=await lookup(params);return {title:beer?`${beer.display_name||beer.brew.name} · Sud ${beer.public_number}`:'Sud nicht gefunden'};}
export default async function Page({params}:{params:Promise<{number:string}>}){const beer=await lookup(params);if(!beer)notFound();return <BeerLabel beer={beer}/>;}
