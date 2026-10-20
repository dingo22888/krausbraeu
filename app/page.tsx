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
 const years = [...new Set(events.map(event => event.date.slice(0,4)))].map(year => {
  const entries = events.filter(event => event.date.startsWith(year));
  return { year, count: entries.length, content: <ol className="timeline-events">{entries.map(event => <BrewEventCard key={event.id} event={event}/>)}</ol> };
 });
 const planned = beers.filter(b => !b.brew.date && !b.brew.bottledDate);
 const upcoming = planned.length > 0 ? <aside className="upcoming-brews"><p className="eyebrow">ALS NÄCHSTES IM BRAUKELLER</p><div>{planned.map(b => <Link key={b.id} href={`/${b.public_number}`} style={{'--accent':b.accent} as CSSProperties}><span className="upcoming-number">#{b.public_number}</span><span><strong>{b.display_name || b.brew.name}</strong><small>{b.brew.style || 'Rezeptentwurf'} · Geplant</small></span><Arrow/></Link>)}</div></aside> : null;
 return <>
  <section className="brew-intro section"><p className="eyebrow">KRAUSBRÄU · GEBRAUT IN STRUTHÜTTEN</p><h1>Kleine Sude.<br/><span>Große Geschichten.</span></h1><p>Vom ersten Brautag bis zur letzten Flasche. Ein Blick in unseren Braukeller.</p></section>
  <section id="sude" className="collection section brew-collection" aria-label="Sude und Braubuch">
   <BrewCollection years={years} upcoming={upcoming} count={beers.length} grid={<div className="beer-grid">{beers.map(b=><Link href={`/${b.public_number}`} className="beer-card" key={b.id} style={{'--accent':b.accent} as CSSProperties}>
    <div className="card-art">{beerImages(b)[0]?.url?<Image src={beerImages(b)[0]!.url} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 400px" unoptimized={beerImages(b)[0]!.url.startsWith('https:')}/>:<span className="cover-fallback">#{b.public_number}</span>}<span className="card-number">SUD {String(b.public_number).padStart(2,'0')}</span><span className="card-open"><Arrow/></span></div>
    <div className="card-copy"><p>{b.brew.style||'Hausgebraut'}</p><h3>{b.display_name||b.brew.name}</h3><span>{dateLabel(b.brew.date)}</span></div>
   </Link>)}</div>}/>
  </section>
 </>;
}
