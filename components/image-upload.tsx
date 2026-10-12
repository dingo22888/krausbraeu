'use client';
import {useEffect,useState} from 'react';
import Cropper, {type Area} from 'react-easy-crop';
import {Submit} from './submit';

export function ImageUpload({beerId,enabled,action}:{beerId:number;enabled:boolean;action:(data:FormData)=>Promise<void>}){
 const [file,setFile]=useState<File|null>(null);
 const [url,setUrl]=useState('');
 const [crop,setCrop]=useState({x:0,y:0});
 const [zoom,setZoom]=useState(1);
 const [format,setFormat]=useState('1');
 const [area,setArea]=useState<Area|null>(null);
 const [error,setError]=useState('');
 const [busy,setBusy]=useState(false);
 useEffect(()=>{if(!file){setUrl('');return;}const src=URL.createObjectURL(file);setUrl(src);return()=>URL.revokeObjectURL(src);},[file]);
 async function upload(data:FormData){
  if(!file||busy)return;
  setError('');setBusy(true);
  let output=file;
  try{
   if(format!=='original'){
    if(!area)throw new Error('Bitte warten, bis das Bild geladen ist.');
    const image=new window.Image();image.src=url;await image.decode();
    const canvas=document.createElement('canvas');const scale=Math.min(1,2000/Math.max(area.width,area.height));
    canvas.width=Math.max(1,Math.round(area.width*scale));canvas.height=Math.max(1,Math.round(area.height*scale));
    const context=canvas.getContext('2d');if(!context)throw new Error('Der Bildausschnitt konnte nicht erstellt werden.');
    context.drawImage(image,area.x,area.y,area.width,area.height,0,0,canvas.width,canvas.height);
    const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/webp',0.9));
    if(!blob)throw new Error('Der Bildausschnitt konnte nicht erstellt werden.');
    output=new File([blob],'ausschnitt.'+(blob.type==='image/webp'?'webp':'png'),{type:blob.type});
   }
   if(output.size>3*1024*1024)throw new Error('Der Bildausschnitt ist größer als 3 MB. Bitte einen kleineren Ausschnitt wählen.');
  }catch(error){setError(error instanceof Error?error.message:'Bild konnte nicht verarbeitet werden.');setBusy(false);return;}
  data.set('artwork',output);
  try{await action(data);}finally{setBusy(false);}
 }
 return <form action={upload}>
 <input type="hidden" name="id" value={beerId}/>
 <fieldset className="image-upload-fields" disabled={!enabled||busy}>
 <label>Bild ergänzen (PNG, JPEG, WebP · bis 3 MB)<input type="file" accept="image/png,image/jpeg,image/webp" required onChange={event=>{
  const next=event.target.files?.[0];setError('');setArea(null);setCrop({x:0,y:0});setZoom(1);setFile(null);
  if(!next)return;if(!['image/png','image/jpeg','image/webp'].includes(next.type)||next.size>3*1024*1024){setError('Bitte PNG, JPEG oder WebP bis 3 MB auswählen.');event.target.value='';return;}setFile(next);
 }}/></label>
 {url&&<div className="upload-crop-editor">
 <label>Bildausschnitt<select value={format} onChange={event=>{setFormat(event.target.value);setCrop({x:0,y:0});setZoom(1);setArea(null);}}><option value="1">Quadratisch · 1:1</option><option value="1.3333333333333333">Querformat · 4:3</option><option value="0.75">Hochformat · 3:4</option><option value="original">Unbeschnitten</option></select></label>
 {format==='original'?<img className="upload-original" src={url} alt="Ausgewähltes Bild ohne Zuschnitt"/>:<><div className="upload-crop-stage"><Cropper key={url+format} image={url} crop={crop} zoom={zoom} aspect={Number(format)} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_,pixels)=>setArea(pixels)} zoomWithScroll={false} mediaProps={{onError:()=>setError('Das Bild konnte nicht gelesen werden.')}}/></div><label>Zoom<input type="range" min="1" max="3" step="0.01" value={zoom} onChange={event=>setZoom(Number(event.target.value))}/></label><p className="muted">Bild verschieben, um den Ausschnitt festzulegen.</p></>}
 </div>}
 <label>Bildunterschrift<input name="caption" maxLength={300}/></label>
 {enabled&&<Submit pending="Wird zugeschnitten und hochgeladen …">Bild hinzufügen</Submit>}
 </fieldset>
 {error&&<p className="notice error" role="alert">{error}</p>}
 {!enabled&&<p>Für eigene Uploads muss Vercel Blob verbunden sein.</p>}
 </form>;
}
