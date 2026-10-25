import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createHash } from 'node:crypto';
import { getBeer } from '@/lib/db';
import { isShareSection, sectionShare } from '@/lib/beer-section-share';
import { ShareSectionRedirect } from '@/components/share-section-redirect';
export const dynamic='force-dynamic';
type Params=Promise<{number:string;section:string}>;
const lookup=cache(async(number:string,section:string)=>{
 if(!/^[1-9]\d{0,8}$/.test(number)||!isShareSection(section))return null;
 const beer=await getBeer(Number(number));
 if(!beer||(section==='verkostung'&&!beer.tasting_notes))return null;
 return {beer,section,data:sectionShare(beer,section)};
});
export async function generateMetadata({params}:{params:Params}):Promise<Metadata>{
 const {number,section}=await params;const found=await lookup(number,section);if(!found)return {title:'Abschnitt nicht gefunden',robots:{index:false}};
 const {data}=found;const origin='https://beer.krausonline.de';
 const version=createHash('sha256').update(JSON.stringify([data,found.beer.accent])).digest('hex').slice(0,12);
 const image={url:`${origin}/api/og/${number}/${section}?v=${version}`,width:1200,height:630,type:'image/jpeg',alt:data.description};
 return {title:{absolute:data.title},description:data.description,robots:{index:false,follow:true},alternates:{canonical:`${origin}/${number}`},openGraph:{type:'website',title:data.title,description:data.description,url:origin+data.path,images:[image]},twitter:{card:'summary_large_image',title:data.title,description:data.description,images:[image.url]}};
}
export default async function SharedSection({params}:{params:Params}){
 const {number,section}=await params;const found=await lookup(number,section);if(!found)notFound();const {data}=found;
 return <section className="section shared-section"><p className="eyebrow">KRAUSBRÄU · {data.label}</p><h1>{data.name}</h1><p>{data.description}</p><a className="text-link" href={data.destination}>Zum Abschnitt {data.label}</a><ShareSectionRedirect destination={data.destination}/></section>;
}
