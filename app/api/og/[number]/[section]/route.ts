import sharp from 'sharp';
import { ImageResponse } from 'next/og';
import { createElement as h } from 'react';
import { getBeer } from '@/lib/db';
import { isShareSection, sectionShare } from '@/lib/beer-section-share';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const truncate=(text:string,max:number)=>text.length>max?text.slice(0,max-1)+'…':text;
export async function GET(_request:Request,{params}:{params:Promise<{number:string;section:string}>}){
 const {number,section}=await params;
 if(!/^[1-9]\d{0,8}$/.test(number)||!isShareSection(section))return new Response(null,{status:404});
 const beer=await getBeer(Number(number));if(!beer||(section==='verkostung'&&!beer.tasting_notes))return new Response(null,{status:404});
 const data=sectionShare(beer,section);const accent=/^#[0-9a-f]{6}$/i.test(beer.accent)?beer.accent:'#e9b44c';
 const png=new ImageResponse(h('div',{style:{display:'flex',flexDirection:'column',width:'100%',height:'100%',background:'#141512',color:'#f6f4ec',padding:'40px 60px',borderTop:`8px solid ${accent}`}},
  h('div',{style:{fontSize:23,color:accent,letterSpacing:3}},`KRAUSBRÄU · SUD ${number}${data.draft?' · REZEPTENTWURF':''}`),
  h('div',{style:{fontSize:48,fontWeight:700,marginTop:12}},truncate(data.name,34)),
  h('div',{style:{fontSize:30,color:accent,marginTop:6,marginBottom:18}},data.label),
  h('div',{style:{display:'flex',flexDirection:'column',gap:data.rows.length>=6?6:12}},...(data.rows.length?data.rows.slice(0,6):[{label:'Keine Angaben hinterlegt.',value:''}]).map((r,i)=>h('div',{key:i,style:{display:'flex',flexDirection:'column'}},h('div',{style:{fontSize:data.rows.length>=6?22:25}},truncate(r.label,75)),r.value?h('div',{style:{fontSize:data.rows.length>=6?19:21,color:accent}},truncate(r.value,88)):null))),
  h('div',{style:{position:'absolute',bottom:22,left:60,fontSize:19,color:'#aaa99b'}},`${data.rows.length>6?`+ ${data.rows.length-6} weitere · `:''}beer.krausonline.de · ${data.label}`)
 ),{width:1200,height:630});
 const image=await sharp(Buffer.from(await png.arrayBuffer())).jpeg({quality:85,mozjpeg:true}).toBuffer();
 return new Response(new Uint8Array(image),{headers:{'Content-Type':'image/jpeg','Content-Length':String(image.length),'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
