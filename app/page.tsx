import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { listBeers } from '@/lib/db';
import { dateLabel, statusLabel } from '@/components/beer-label';
import { Arrow } from '@/components/arrow';
export const dynamic='force-dynamic';
export default async function Home(){
 const beers=await listBeers();const latest=beers[0];
 return <>
  {latest?<section className="latest section" style={{'--accent':latest.accent} as CSSProperties}>
   <div className="latest-copy"><p className="eyebrow">FRISCH AUS DEM BRAUKELLER · SUD {latest.public_number}</p><h1>{latest.display_name||latest.brew.name}</h1><p className="latest-description">{latest.description||'Kleine Menge, eigener Charakter. Entdecke das jüngste Bier aus unserem Braukeller.'}</p><div className="hero-foot"><span className="pill">{statusLabel(latest)}</span><span>{latest.brew.style||'Hausgebraut'}</span></div><Link className="text-link" href={`/${latest.public_number}`}>Diesen Sud entdecken <Arrow/></Link></div>
   <Link className="latest-art" href={`/${latest.public_number}`} aria-label={`${latest.display_name||latest.brew.name} entdecken`}>{latest.image_url?<Image src={latest.image_url} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 40vw, 430px" priority unoptimized={latest.image_url.startsWith('https:')}/>:<span className="cover-fallback">#{latest.public_number}</span>}<span className="latest-badge">NEUESTE PRESSUNG</span></Link>
  </section>:<section className="empty section"><p className="eyebrow">KRAUSBRÄU</p><h1>Der nächste Sud<br/>kommt bald.</h1><p>Hier entstehen unsere digitalen Bieretiketten.</p></section>}
  <section id="sude" className="collection section"><div className="collection-heading"><div><span className="eyebrow">DIE KRAUSBRÄU-SAMMLUNG</span><h2>Kleine Sude.<br/>Große Geschichten.</h2></div><p>{beers.length} {beers.length===1?'Sud':'Sude'}. Handgebraut.<br/>Jedes Cover ein eigenes Kapitel.</p></div>
   <div className="beer-grid">{beers.map(b=><Link href={`/${b.public_number}`} className="beer-card" key={b.id} style={{'--accent':b.accent} as CSSProperties}>
    <div className="card-art">{b.image_url?<Image src={b.image_url} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 400px" unoptimized={b.image_url.startsWith('https:')}/>:<span className="cover-fallback">#{b.public_number}</span>}<span className="card-number">SUD {String(b.public_number).padStart(2,'0')}</span><span className="card-open"><Arrow/></span></div>
    <div className="card-copy"><p>{b.brew.style||'Hausgebraut'}</p><h3>{b.display_name||b.brew.name}</h3><span>{dateLabel(b.brew.date)}</span></div>
   </Link>)}</div>
  </section>
 </>;
}
