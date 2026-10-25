'use client';
import {useState} from 'react';
export function ShareBeerButton({number,name,section,compact=false}:{number:number;name:string;section?:string;compact?:boolean}){
 const [message,setMessage]=useState('');
 const [manual,setManual]=useState(false);
 const [busy,setBusy]=useState(false);
 const url=`https://beer.krausonline.de/${number}${section?`/teilen/${section}`:''}`;
 async function share(){
  if(busy)return;setBusy(true);setMessage('');setManual(false);
  try{
   if(navigator.share){
    try{await navigator.share({title:`${name} · KrausBräu`,url});return;}
    catch(error){if(error instanceof DOMException&&error.name==='AbortError')return;}
   }
   try{await navigator.clipboard.writeText(url);setMessage('Link kopiert.');}
   catch{setManual(true);setMessage('Link zum Kopieren:');}
  }finally{setBusy(false);}
 }
 return <span className={`share-beer${compact?' share-section':''}`}><button type="button" className="text-link share-beer-button" onClick={share} disabled={busy} aria-label={compact?`${name} teilen`:undefined} title={compact?'Abschnitt mit Vorschau teilen':undefined}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M12 15V3m-4 4 4-4 4 4M5 11v9h14v-9"/></svg>{!compact&&'Teilen'}</button><span className="share-feedback" role="status">{message}</span>{manual&&<input aria-label="Link zum Sud" readOnly value={url} onFocus={event=>event.currentTarget.select()}/>}</span>;
}
