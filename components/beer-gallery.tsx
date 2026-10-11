'use client';
import Image from 'next/image';
import {useRef,useState} from 'react';
import type {BeerImage} from '@/lib/beer-images';
export function BeerGallery({images,name,number}:{images:BeerImage[];name:string;number:number}){
 const [active,setActive]=useState(0);const track=useRef<HTMLDivElement>(null);const modal=useRef<HTMLDialogElement>(null);
 const current=images[active];
 function go(index:number){const next=(index+images.length)%images.length;setActive(next);track.current?.children[next]?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest',inline:'start'});}
 if(!images.length)return <div className="hero-art"><div className="type-art">#{number}</div></div>;
 return <section className="beer-gallery" aria-label={`Bilder zu ${name}`}>
 <div className="gallery-track" ref={track} onScroll={event=>{const el=event.currentTarget;setActive(Math.max(0,Math.min(images.length-1,Math.round(el.scrollLeft/el.clientWidth))));}}>
 {images.map((image,index)=><button className="gallery-slide" key={image.id} type="button" aria-label={`${image.caption||name} · Bild ${index+1} vergrößern`} onClick={()=>{setActive(index);modal.current?.showModal();}}><Image src={image.url} alt={image.caption||`${name} · Bild ${index+1}`} fill sizes="(max-width:760px) 100vw, 50vw" priority={index===0} unoptimized={image.url.startsWith('https:')}/></button>)}
 </div>
 <div className="gallery-bar">{images.length>1&&<button type="button" className="secondary" aria-label="Vorheriges Bild" onClick={()=>go(active-1)}>←</button>}<span aria-live="polite">{active+1} / {images.length}{images.length>1?' · Wischen oder blättern':' · Zum Vergrößern antippen'}</span>{images.length>1&&<button type="button" className="secondary" aria-label="Nächstes Bild" onClick={()=>go(active+1)}>→</button>}</div>
 {current.caption&&<p className="gallery-caption">{current.caption}</p>}
 <dialog className="gallery-lightbox" ref={modal} aria-label={`Bildansicht ${name}`} onKeyDown={event=>{if(event.key==='ArrowRight')go(active+1);if(event.key==='ArrowLeft')go(active-1);}}>
 <button type="button" className="lightbox-close" onClick={()=>modal.current?.close()} autoFocus>Schließen ×</button>
 <img src={current.url} alt={current.caption||name}/><p>{current.caption}</p>
 {images.length>1&&<div className="gallery-bar"><button type="button" onClick={()=>go(active-1)} aria-label="Vorheriges Bild">←</button><span>{active+1} / {images.length}</span><button type="button" onClick={()=>go(active+1)} aria-label="Nächstes Bild">→</button></div>}
 </dialog></section>;
}
