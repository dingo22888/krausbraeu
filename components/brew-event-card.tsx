import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { BrewEvent } from '@/lib/brew-history';
import { Arrow } from './arrow';

export function BrewEventCard({ event, side = 'left' }: { event: BrewEvent; side?: 'left' | 'right' }) {
 const label = event.kind === 'brewed' ? 'Brautag' : event.kind === 'bottled' ? 'Abgefüllt' : 'Braukeller';
 const date = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${event.date}T12:00:00Z`));
 const accent = { '--accent': /^#[0-9a-f]{6}$/i.test(event.accent) ? event.accent : '#e9b44c' } as CSSProperties;
 if (event.kind === 'bottled') {
  const milestone = <><span className="milestone-art">{event.image && <Image src={event.image} alt="" fill sizes="44px" unoptimized={event.image.startsWith('https:')}/>}</span><span className="milestone-copy"><time dateTime={event.date}>{date} · Abgefüllt</time><strong>#{event.number} {event.title}</strong></span><Arrow/></>;
  return <li className="timeline-milestone" style={accent}>{event.href ? <Link href={event.href} className="milestone-card">{milestone}</Link> : <article className="milestone-card">{milestone}</article>}</li>;
 }
 const content = <>
  <div className="event-art">{event.image ? <Image src={event.image} alt="" fill sizes={event.kind === 'brewed' ? '(max-width: 760px) 80vw, 460px' : '88px'} unoptimized={event.image.startsWith('https:')}/> : <span>#{event.number ?? 'K'}</span>}</div>
  <div className="event-copy"><div className="event-meta"><span>{label}</span><time dateTime={event.date}>{date}</time></div>
   {event.number !== undefined && <span className="event-number">SUD {String(event.number).padStart(2, '0')}</span>}
   <h4>{event.title}</h4><p>{event.subtitle}</p>{event.href && <span className="event-open">Zum Sud <Arrow/></span>}
  </div>
 </>;
 return <li className={`timeline-event event-${event.kind} event-side-${side}`} style={accent}>
  <span className="event-node" aria-hidden="true"/>
  {event.href ? <Link className="event-card" href={event.href}>{content}</Link> : <article className="event-card">{content}</article>}
 </li>;
}
