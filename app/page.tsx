import { BrandLogo } from '@/components/brand-logo';
import { BrewCollection } from '@/components/brew-collection';
import { BrewEventCard } from '@/components/brew-event-card';
import { brewHistory } from '@/lib/brew-history';
import { beerImages } from '@/lib/beer-images';
import { beerMetadata } from '@/lib/beer-metadata';
import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { listBeers } from '@/lib/db';
import { dateLabel } from '@/components/beer-label';
import { Arrow } from '@/components/arrow';
import { connection } from 'next/server';
export const revalidate = false;
export async function generateMetadata(){
 if(!process.env.VERCEL&&!process.env.NEON_BEER_DATABASE_URL&&!process.env.NEON_BEER_POSTGRES_URL)return {};
 const [latest]=await listBeers();return latest?beerMetadata(latest,true):{};
}
export default async function Home(){
 // A local build without credentials cannot prerender real database content.
 if (!process.env.VERCEL && !process.env.NEON_BEER_DATABASE_URL && !process.env.NEON_BEER_POSTGRES_URL) await connection();
 const beers=await listBeers();
 const events = brewHistory(beers);
 const brewSides = new Map(events.filter(event => event.kind !== 'bottled').map((event,index) => [event.id,index % 2 === 0 ? 'left' as const : 'right' as const]));
 const years = [...new Set(events.map(event => event.date.slice(0,4)))].map(year => {
  const entries = events.filter(event => event.date.startsWith(year));
  return { year, count: entries.length, content: <ol className="timeline-events">{entries.map(event => <BrewEventCard key={event.id} event={event} side={brewSides.get(event.id)}/>)}</ol> };
 });
 const planned = beers.filter(b => !b.brew.date && !b.brew.bottledDate);
 const brewedCount = beers.filter(b => b.brew.date || b.brew.bottledDate).length;
 const firstYear = years.at(-1)?.year;
 const upcoming = planned.length > 0 ? <aside className="upcoming-brews"><p className="eyebrow">ALS NÄCHSTES IM BRAUKELLER</p><div>{planned.map(b => <Link key={b.id} href={`/${b.public_number}`} style={{'--accent':b.accent} as CSSProperties}><span className="upcoming-art">{beerImages(b)[0]?.url ? <Image src={beerImages(b)[0]!.url} alt="" fill sizes="64px" unoptimized={beerImages(b)[0]!.url.startsWith('https:')}/> : <span>#{b.public_number}</span>}</span><span><strong>{b.display_name || b.brew.name}</strong><small>{b.brew.style || 'Rezeptentwurf'} · Geplant</small></span><Arrow/></Link>)}</div></aside> : null;
 return <>
  <section className="brew-intro section"><div><p className="eyebrow">TOBIS BRAUBUCH</p><h1>{firstYear ? <>Seit {firstYear}<br/>wird hier gebraut.</> : <>Hier wird gebraut.</>}</h1><p>{brewedCount} {brewedCount === 1 ? 'gebrauter Sud' : 'gebraute Sude'}{planned.length > 0 && <> <span aria-hidden="true">·</span> {planned.length} {planned.length === 1 ? 'weiterer' : 'weitere'} in Planung</>}</p></div><div className="intro-portrait"><BrandLogo variant="portrait" idPrefix="braubuch-portrait"/></div></section>
  <section id="sude" className="collection section brew-collection" aria-label="Sude und Braubuch">
   <BrewCollection years={years} upcoming={upcoming} count={beers.length} grid={<div className="beer-grid">{beers.map(b=><Link href={`/${b.public_number}`} className="beer-card" key={b.id} style={{'--accent':b.accent} as CSSProperties}>
    <div className="card-art">{beerImages(b)[0]?.url?<Image src={beerImages(b)[0]!.url} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 400px" unoptimized={beerImages(b)[0]!.url.startsWith('https:')}/>:<span className="cover-fallback">#{b.public_number}</span>}<span className="card-number">SUD {String(b.public_number).padStart(2,'0')}</span><span className="card-open"><Arrow/></span></div>
    <div className="card-copy"><p>{b.brew.style||'Hausgebraut'}</p><h3>{b.display_name||b.brew.name}</h3><span>{dateLabel(b.brew.date)}</span></div>
   </Link>)}</div>}/>
  </section>
 </>;
}
