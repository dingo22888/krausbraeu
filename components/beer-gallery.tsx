'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

const labels = ['Artwork', 'Flasche', 'Kiste'];
export function BeerGallery({ children, name }: { children: ReactNode[]; name: string }) {
 const track = useRef<HTMLDivElement>(null);
 const selected = useRef(0);
 const [active, setActive] = useState(0);
 const [ready, setReady] = useState(false);
 useEffect(() => {
  setReady(true);
  const element = track.current;
  if (!element) return;
  const resize = new ResizeObserver(() => element.scrollTo({ left: selected.current * element.clientWidth, behavior: 'instant' }));
  resize.observe(element);
  return () => resize.disconnect();
 }, []);
 function go(index: number) {
  const element = track.current;
  if (!element) return;
  element.scrollTo({ left: Math.max(0, Math.min(labels.length - 1, index)) * element.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
 }
 return <section className="hero-art beer-gallery" aria-label={`Ansichten von ${name}`} aria-roledescription="Karussell" onKeyDown={event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); go(active + (event.key === 'ArrowRight' ? 1 : -1)); }
 }}>
  <div className="mood-track" ref={track} tabIndex={ready ? 0 : -1} aria-label="Bieransichten — mit links und rechts wechseln" onScroll={event => {
   const element = event.currentTarget;
   const index = Math.max(0, Math.min(labels.length - 1, Math.round(element.scrollLeft / element.clientWidth)));
   selected.current = index;
   setActive(index);
  }}>
   {children.map((child, index) => <div className="mood-slide" key={labels[index]} role="group" aria-roledescription="Folie" aria-label={`${index + 1} von ${labels.length}: ${labels[index]}`} aria-hidden={ready && active !== index}>{child}</div>)}
  </div>
  <div className="mood-controls" style={{ visibility: ready ? 'visible' : 'hidden' }}>
   <button type="button" className="mood-arrow" aria-label="Vorige Ansicht" disabled={active === 0} onClick={() => go(active - 1)}><Chevron/></button>
   <div className="mood-dots" role="group" aria-label="Ansicht auswählen">{labels.map((label, index) => <button type="button" key={label} aria-label={label} aria-pressed={active === index} onClick={() => go(index)}><span/></button>)}</div>
   <span className="mood-caption" aria-live="polite" aria-atomic="true">{labels[active]} <small>{String(active + 1).padStart(2, '0')} / 03</small></span>
   <button type="button" className="mood-arrow" aria-label="Nächste Ansicht" disabled={active === labels.length - 1} onClick={() => go(active + 1)}><Chevron next/></button>
  </div>
 </section>;
}
function Chevron({ next = false }: { next?: boolean }) {
 return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: next ? 'rotate(180deg)' : undefined }}><path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="1.5"/></svg>;
}
