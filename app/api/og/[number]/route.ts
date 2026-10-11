import sharp from 'sharp';
import {getBeer} from '@/lib/db';
import {beerImages} from '@/lib/beer-images';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{number:string}>}){
 const {number}=await params;if(!/^[1-9]\d{0,8}$/.test(number))return new Response(null,{status:404});
 const beer=await getBeer(Number(number));const first=beer&&beerImages(beer)[0];
 if(!first)return new Response(null,{status:404});
 const source=new URL(first.url,'https://beer.krausonline.de');
 // Only fetch artwork from this site or the configured public Blob service.
 if(source.protocol!=='https:'||source.username||source.password||source.port||!(source.hostname==='beer.krausonline.de'&&!source.pathname.startsWith('/api/')||source.hostname.endsWith('.public.blob.vercel-storage.com')))return new Response(null,{status:400});
 const response=await fetch(source,{redirect:'error',signal:AbortSignal.timeout(10000)});
 if(!response.ok)return new Response(null,{status:502});
 const data=Buffer.from(await response.arrayBuffer());if(data.length>4*1024*1024)return new Response(null,{status:413});
 const image=await sharp(data,{limitInputPixels:40000000}).rotate().resize(800,800,{fit:'contain',background:'#141512'}).flatten({background:'#141512'}).jpeg({quality:78,mozjpeg:true}).toBuffer();
 return new Response(new Uint8Array(image),{headers:{'Content-Type':'image/jpeg','Content-Length':String(image.length),'Cache-Control':'public, max-age=300','X-Content-Type-Options':'nosniff'}});
}
