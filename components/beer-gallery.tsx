'use client';
import Image from 'next/image';
import {useRef,useState} from 'react';
import {Swiper,SwiperSlide} from 'swiper/react';
import {Autoplay,A11y} from 'swiper/modules';
import type {Swiper as SwiperInstance} from 'swiper';
import 'swiper/css';
import type {BeerImage} from '@/lib/beer-images';
export function BeerGallery({images,name,number}:{images:BeerImage[];name:string;number:number}){
 const [active,setActive]=useState(0);const slider=useRef<SwiperInstance|null>(null);const modal=useRef<HTMLDialogElement>(null);
 const current=images[active];
 function go(direction:number){if(direction<0)slider.current?.slidePrev();else slider.current?.slideNext();}

 if(!images.length)return <div className="hero-art"><div className="type-art">#{number}</div></div>;
 return <section className="beer-gallery" aria-label={`Bilder zu ${name}`}>
 <Swiper className="gallery-swiper" modules={[Autoplay,A11y]} slidesPerView={1} loop={images.length>1} speed={450} autoplay={images.length>1?{delay:5000,disableOnInteraction:false,pauseOnMouseEnter:true}:false} onSwiper={instance=>{slider.current=instance;}} onSlideChange={instance=>setActive(instance.realIndex)}>
 {images.map((image,index)=><SwiperSlide key={image.id}><button className="gallery-slide" type="button" aria-label={`${image.caption||name} · Bild ${index+1} vergrößern`} onClick={()=>{slider.current?.autoplay.stop();modal.current?.showModal();}}><Image src={image.url} alt={image.caption||`${name} · Bild ${index+1}`} fill sizes="(max-width:760px) 100vw, 50vw" priority={index===0} unoptimized={image.url.startsWith('https:')}/></button></SwiperSlide>)}
 </Swiper>
 <div className="gallery-bar">{images.length>1&&<button type="button" className="secondary" aria-label="Vorheriges Bild" onClick={()=>go(-1)}>←</button>}<span aria-live="polite">{active+1} / {images.length}{images.length>1?' · Wischen oder blättern':' · Zum Vergrößern antippen'}</span>{images.length>1&&<button type="button" className="secondary" aria-label="Nächstes Bild" onClick={()=>go(1)}>→</button>}</div>
 <div className="gallery-captions">{images.map((image,index)=><p key={image.id} className="gallery-caption" aria-hidden={index!==active} style={{visibility:index===active?'visible':'hidden'}}>{image.caption||'\u00a0'}</p>)}</div>
 <dialog className="gallery-lightbox" ref={modal} onClose={()=>{slider.current?.autoplay.start();}} aria-label={`Bildansicht ${name}`} onKeyDown={event=>{if(event.key==='ArrowRight')go(1);if(event.key==='ArrowLeft')go(-1);}}>
 <button type="button" className="lightbox-close" onClick={()=>modal.current?.close()} autoFocus>Schließen ×</button>
 <img src={current.url} alt={current.caption||name}/><p>{current.caption}</p>
 {images.length>1&&<div className="gallery-bar"><button type="button" onClick={()=>go(-1)} aria-label="Vorheriges Bild">←</button><span>{active+1} / {images.length}</span><button type="button" onClick={()=>go(1)} aria-label="Nächstes Bild">→</button></div>}
 </dialog></section>;
}
