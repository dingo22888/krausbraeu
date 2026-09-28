import { beerColor } from '@/lib/beer-color';
export function BeerColor({ebc}:{ebc:number|null}) {
 const color=beerColor(ebc);
 return <svg className="beer-color-mug" viewBox="0 0 62 72" width="62" height="72" role="img" aria-label={color?`Ungefähre Bierfarbe bei ${ebc?.toLocaleString('de-DE')} EBC`:'Bierfarbe noch unbekannt'}>
  <path d="M45 24h7c8 0 8 24 0 24h-7" fill="none" stroke="#a7a79d" strokeWidth="3"/>
  <path d="M10 18h35v44q0 4-4 4H14q-4 0-4-4Z" fill={color||'none'} stroke="#c8c9bb" strokeWidth="1.5"/>
  {color&&<><path d="M15 29v29" stroke="#fff" strokeOpacity=".23" strokeWidth="3" strokeLinecap="round"/><path d="M38 28v31" stroke="#fff" strokeOpacity=".09" strokeWidth="2" strokeLinecap="round"/></>}
  <path d="M9 24v-7a6 6 0 0 1 9-5 8 8 0 0 1 14-2 7 7 0 0 1 12 4 5 5 0 0 1 2 10Z" fill="#f1ead6"/>
  <path d="M13 69h29" stroke="#8c8e82" strokeWidth="1.5" strokeLinecap="round"/>
 </svg>;
}
