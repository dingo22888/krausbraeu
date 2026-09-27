import Link from 'next/link';
import { listBeers } from '@/lib/db';
import { BeerLabel, dateLabel } from '@/components/beer-label';
export const dynamic='force-dynamic';
export default async function Home(){const beers=await listBeers(); return <>{beers[0]?<BeerLabel beer={beers[0]}/>:<section className="empty section"><p className="eyebrow">KRAUSBRÄU</p><h1>Der nächste Sud<br/>kommt bald.</h1><p>Hier entstehen unsere digitalen Bieretiketten.</p></section>}<section id="sude" className="archive section"><div><span className="eyebrow">DAS BIERARCHIV</span><h2>Jeder Sud eine Geschichte.</h2></div><div className="archive-list">{beers.map(b=><Link href={`/${b.public_number}`} className="archive-row" key={b.id}><span className="archive-number">{String(b.public_number).padStart(2,'0')}</span><div><h3>{b.display_name||b.brew.name}</h3><span>{b.brew.style} · {dateLabel(b.brew.date)}</span></div><span aria-hidden="true">↗</span></Link>)}</div></section></>}
