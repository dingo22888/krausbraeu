import { SectionHeading } from './section-heading';
import { RecipeProfile } from './recipe-profile';
import { ShareBeerButton } from './share-beer-button';
import { EditBeerLink } from './edit-beer-link';
import { BeerGallery } from './beer-gallery';
import { beerImages } from '@/lib/beer-images';
import { BeerColor } from './beer-color';
import { Arrow } from './arrow';
import { MetricScale } from './metric-scale';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import type { Beer } from '@/lib/types';
import { beerMetrics } from '@/lib/beer-metrics';
export const format=(n:number|null,digits=1)=>n===null?'—':new Intl.NumberFormat('de-DE',{maximumFractionDigits:digits}).format(n);
export function dateLabel(date:string|null) {return date?new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(new Date(date.slice(0,10)+'T12:00:00Z')):'Noch nicht gebraut';}
export function statusLabel(beer:Beer) { return beer.brew.bottledDate?'Abgefüllt':beer.brew.date?'In Gärung':'Rezeptentwurf'; }
export function BeerLabel({beer,preview=false,navigation}:{beer:Beer;preview?:boolean;navigation?:ReactNode}) { const b=beer.brew; const metrics=beerMetrics(b); const name=beer.display_name||b.name; const accent=/^#[0-9a-f]{6}$/i.test(beer.accent)?beer.accent:'#e9b44c';
 const share=!preview&&beer.published&&beer.public_number!==null?{number:beer.public_number,name}:undefined;
 return <article className="label-page" style={{'--accent':accent} as CSSProperties}>
 <style>{`:root { --accent: ${accent}; }`}</style>
 {preview&&<div className="notice">Private Vorschau · <Link href={`/admin/beer/${beer.id}`}>Zurück zur Bearbeitung</Link></div>}
 {navigation}
 <section className="hero"><div className="hero-copy"><div className="eyebrow">HANDGEBRAUT · SUD {String(beer.public_number??b.number).padStart(2,'0')}</div><p className="style-name">{b.style||'Hausgebraut'}</p><h1>{name}</h1><p className="hero-description">{beer.description||'Ein selbst gebrautes Bier von KrausBräu. Kleine Menge, eigener Charakter.'}</p><div className="hero-foot"><span className="pill">{statusLabel(beer)}</span><span>{metrics.draft?'Noch nicht gebraut':`Gebraut am ${dateLabel(b.date)}`}</span></div><div className="beer-hero-actions"><a className="text-link" href="#bier"><Arrow down/>Das steckt drin</a>{!preview&&beer.public_number!==null&&<ShareBeerButton number={beer.public_number} name={name}/>}{!preview&&<EditBeerLink beerId={beer.id}/>}</div></div>
 <BeerGallery key={beer.id} images={beerImages(beer)} name={name} number={b.number}/></section>
 <nav className="section-jumps section" aria-label="Abschnitte dieses Suds"><a href="#werte">Werte</a><a href="#rezept">Rezept</a><a href="#schuettung">Schüttung</a><a href="#hopfen">Hopfen</a><a href="#hefe">Hefe</a>{beer.tasting_notes&&<a href="#verkostung">Verkostung</a>}</nav>
 <div id="bier" className="metrics-heading section"><SectionHeading share={share} id="werte">Die Werte</SectionHeading></div>
 <section className="stats" aria-label="Bierdaten"><div><span>Alkohol</span><strong>{metrics.abv===null?(metrics.draft?'—':'Noch offen'):`${format(metrics.abv)} %`}</strong><small>{metrics.draft?'Planwert nicht hinterlegt':metrics.abv===null?'Nach der Gärung':'vol. · berechnet'}</small><MetricScale label="Alkohol" value={metrics.abv} max={12} unit="% vol."/></div><div><span>Stammwürze</span><strong>{format(metrics.gravity)} <em>°P</em></strong><small>{metrics.draft?'Geplant · laut Rezept':'Beim Anstellen'}</small><MetricScale label="Stammwürze" value={metrics.gravity} max={25} unit="°P"/></div><div><span>Bittere</span><strong>{format(b.ibu,0)} <em>IBU</em></strong><small>{metrics.draft?'Geplant · laut Rezept':'Laut Rezept'}</small><MetricScale label="Bittere" value={b.ibu} max={100} unit="IBU"/></div><div className="color-stat"><span>Bierfarbe</span><div className="color-stat-value"><strong>{format(b.ebc,0)} <em>EBC</em></strong><BeerColor ebc={b.ebc}/></div><small>{metrics.draft?'Geplant · Farbton angenähert':'Berechnet · Farbton angenähert'}</small><MetricScale label="Bierfarbe" value={b.ebc} max={120} unit="EBC"/></div></section>
 <RecipeProfile beer={beer}/>
 {beer.tasting_notes&&<section className="tasting section"><span className="eyebrow">PERSÖNLICH VERKOSTET</span><SectionHeading share={share} id="verkostung">So schmeckt’s.</SectionHeading><p>{beer.tasting_notes}</p></section>}
 {(b.fermentation.length>0||b.bottledDate||b.sourceId===37)&&<section className="section brewing-record">
  {b.bottledDate&&<p>Abgefüllt am {dateLabel(b.bottledDate)}</p>}
  {b.fermentation.length>0&&<><SectionHeading id="gaerung">Gärprotokoll</SectionHeading><div className="table-scroll"><table><thead><tr><th>Datum</th><th>Restextrakt</th><th>Temperatur</th></tr></thead><tbody>{b.fermentation.map((f,i)=><tr key={i}><td>{dateLabel(f.date)}</td><td>{format(f.extract)} °P</td><td>{format(f.temperature)} °C</td></tr>)}</tbody></table></div></>}
  {b.sourceId===37&&<p className="source">Rezeptgrundlage: „Gurgelrutscher“ von horstibus, Maische, Malz und mehr (05.02.2013). Braudaten dieses Suds: KrausBräu.</p>}
 </section>}

 </article>;
}
