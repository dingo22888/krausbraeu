import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { BrewEvent } from '@/lib/brew-history';
import { Arrow } from './arrow';

export function BrewEventCard({ event }: { event: BrewEvent }) {
 const label = event.kind === 'brewed' ? 'Brautag' : event.kind === 'bottled' ? 'Abgefüllt' : 'Braukeller';
 const date = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${event.date}T12:00:00Z`));
 const content = <>
  <div className="event-art">{event.image ? <Image src={event.image} alt="" fill sizes={event.kind === 'brewed' ? '(max-width: 760px) 80vw, 460px' : '88px'} unoptimized={event.image.startsWith('https:')}/> : <span>#{event.number ?? 'K'}</span>}</div>
  <div className="event-copy"><div className="event-meta"><span>{label}</span><time dateTime={event.date}>{date}</time></div>
   {event.number !== undefined && <span className="event-number">SUD {String(event.number).padStart(2, '0')}</span>}
   <h4>{event.title}</h4><p>{event.subtitle}</p>{event.href && <span className="event-open">Zum Sud <Arrow/></span>}
  </div>
 </>;
 return <li className={`timeline-event event-${event.kind}`} style={{ '--accent': /^#[0-9a-f]{6}$/i.test(event.accent) ? event.accent : '#e9b44c' } as CSSProperties}>
  <span className="event-node" aria-hidden="true"/>
  {event.href ? <Link className="event-card" href={event.href}>{content}</Link> : <article className="event-card">{content}</article>}
 </li>;
}
