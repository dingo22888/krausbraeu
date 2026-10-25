'use client';
import { useEffect } from 'react';
// Restore deep-link positioning after hydration, when Next has finished its
// initial scroll handling and all server-rendered headings are mounted.
export function InitialSectionScroll(){
 useEffect(()=>{
  const id=window.location.hash.slice(1);
  if(!['bier','werte','rezept','schuettung','hopfen','hefe','verkostung','gaerung'].includes(id))return;
  let second=0;
  const first=requestAnimationFrame(()=>{second=requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'}));});
  return ()=>{cancelAnimationFrame(first);cancelAnimationFrame(second);};
 },[]);
 return null;
}
