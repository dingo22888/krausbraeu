'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
export function EditBeerLink({beerId}:{beerId:number}){
 const [admin,setAdmin]=useState(false);
 useEffect(()=>{
  let controller:AbortController|undefined;
  async function refresh(){
   controller?.abort();const request=new AbortController();controller=request;
   try{const response=await fetch('/api/auth/status',{cache:'no-store',credentials:'same-origin',signal:request.signal});const result=response.ok?await response.json():null;if(!request.signal.aborted)setAdmin(result?.admin===true);}
   catch{if(!request.signal.aborted)setAdmin(false);}
  }
  void refresh();window.addEventListener('focus',refresh);
  return()=>{controller?.abort();window.removeEventListener('focus',refresh);};
 },[]);
 if(!admin)return null;
 return <Link className="text-link edit-beer-link" href={`/admin/beer/${beerId}`} prefetch={false}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15z"/></svg>Bearbeiten</Link>;
}
