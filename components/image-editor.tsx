'use client';
import {useState} from 'react';
import type {BeerImage} from '@/lib/beer-images';
import {Submit} from './submit';
export function ImageEditor({images}:{images:BeerImage[]}){
 const [items,setItems]=useState(images);
 function move(index:number,delta:number){setItems(previous=>{const next=[...previous];[next[index],next[index+delta]]=[next[index+delta],next[index]];return next;});}
 return <><input type="hidden" name="images" value={JSON.stringify(items.map(({id,caption})=>({id,caption})))}/><p>Das erste Bild erscheint auf der Startseite. Beschriftungen stehen unter dem Bild und in der Großansicht.</p>
 {items.map((image,index)=><div className="image-editor-row" key={image.id}><img src={image.url} alt={`Bild ${index+1}`}/><div><label>Bild {index+1}{index===0?' · Vorschaubild':''}<input aria-label={`Beschriftung Bild ${index+1}`} value={image.caption} maxLength={300} onChange={event=>setItems(items.map(item=>item.id===image.id?{...item,caption:event.target.value}:item))}/></label><div className="image-editor-actions"><button type="button" className="secondary" disabled={index===0} onClick={()=>move(index,-1)} aria-label={`Bild ${index+1} nach vorne`}>←</button><button type="button" className="secondary" disabled={index===items.length-1} onClick={()=>move(index,1)} aria-label={`Bild ${index+1} nach hinten`}>→</button><button type="button" className="secondary" onClick={()=>setItems(items.filter(item=>item.id!==image.id))}>Entfernen</button></div></div></div>)}
 <Submit pending="Bilder werden gespeichert …">Reihenfolge & Beschriftungen speichern</Submit></>;
}
