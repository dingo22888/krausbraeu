import { useId } from 'react';

export type BeerMoodType = 'bottle' | 'crate';
export type BeerMoodData = { name: string; number: number; artwork: string; accent: string };

/** Reusable, resolution-independent product mockup. No database or client JS. */
export function BeerMoodScene({ beer, type }: { beer: BeerMoodData; type: BeerMoodType }) {
 const id = useId().replace(/:/g, '');
 const ref = (name: string) => `url(#${id}-${name})`;
 const accent = /^#[\da-f]{6}$/i.test(beer.accent) ? beer.accent : '#e9b44c';
 const number = String(beer.number).padStart(2, '0');
 const name = beer.name;
 const bottle = <g>
  <path d="M-23 0 Q-29 6-28 23 L-27 99 C-27 126-66 143-68 177 L-70 408 Q-70 429-48 434 L48 434 Q70 429 70 408 L68 177 C66 143 27 126 27 99 L28 23 Q29 6 23 0Z" fill={ref('glass')} stroke="#786040" strokeWidth="1.2"/>
  <path d="M-21 28 L-20 99 C-20 132-58 149-58 181 L-58 396" fill="none" stroke={ref('shine')} strokeWidth="8" strokeLinecap="round"/>
  <path d="M52 185 L54 400 Q54 420 37 422" fill="none" stroke="#dda052" strokeOpacity=".17" strokeWidth="3"/>
  <path d="M-47 425 Q0 435 47 425" stroke="#da903b" strokeOpacity=".28" strokeWidth="3" fill="none"/>
  <rect x="-28" y="-5" width="56" height="16" rx="4" fill={ref('metal')}/>
  {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-24 + i * 5.4} -3v12`} stroke="#151810" strokeOpacity=".65" strokeWidth="1.4"/>)}
  <rect x="-26" y="48" width="52" height="35" rx="2" fill={accent}/>
  <text y="71" textAnchor="middle" fill="#171a13" fontSize="14" fontWeight="800" letterSpacing="2">{number}</text>
  <g clipPath={ref('label')}>
   <rect x="-64" y="206" width="128" height="167" fill="#e9e4d5"/>
   {beer.artwork ? <image href={beer.artwork} x="-64" y="206" width="128" height="119" preserveAspectRatio="xMidYMid slice"/> : <rect x="-64" y="206" width="128" height="119" fill={accent}/>}
   <rect x="-64" y="325" width="128" height="48" fill="#ede7d7"/>
   <rect x="-64" y="325" width="128" height="3" fill={accent}/>
   <text x="0" y="344" textAnchor="middle" fill="#292b22" fontSize={Math.min(13, 175 / Math.max(name.length, 1))} fontWeight="700">{name}</text>
   <text x="0" y="361" textAnchor="middle" fill="#57594b" fontSize="7.4" fontWeight="700" letterSpacing="1.1">KRAUSBRÄU · SUD {number}</text>
   <rect x="-64" y="206" width="128" height="167" fill={ref('curve')}/>
  </g>
  <path d="M-63 211 Q0 204 63 211 M-63 368 Q0 375 63 368" stroke="#fff" strokeOpacity=".2" fill="none"/>
 </g>;
 return <svg className="beer-mood-scene" viewBox="0 0 600 620" role="img" aria-labelledby={`${id}-title`}>
  <title id={`${id}-title`}>{type === 'bottle' ? 'Flaschenentwurf' : 'Bierkistenentwurf'} für {name}, Sud {beer.number}</title>
  <defs>
   <radialGradient id={`${id}-ambient`} cx="42%" cy="38%" r="70%"><stop stopColor={accent} stopOpacity=".19"/><stop offset="1" stopColor="#131610" stopOpacity="0"/></radialGradient>
   <linearGradient id={`${id}-glass`}><stop stopColor="#14150e"/><stop offset=".16" stopColor="#46321a"/><stop offset=".3" stopColor="#6a461d"/><stop offset=".45" stopColor="#352912"/><stop offset=".76" stopColor="#201d12"/><stop offset=".93" stopColor="#3e2f18"/><stop offset="1" stopColor="#11150f"/></linearGradient>
   <linearGradient id={`${id}-metal`} x2="0" y2="1"><stop stopColor="#d4d3bc"/><stop offset=".28" stopColor={accent}/><stop offset=".8" stopColor="#676b50"/><stop offset="1" stopColor="#303528"/></linearGradient>
   <linearGradient id={`${id}-shine`} x2="0" y2="1"><stop stopColor="#fcf5d6" stopOpacity=".48"/><stop offset=".5" stopColor="#f9e2b7" stopOpacity=".16"/><stop offset="1" stopColor="#fff" stopOpacity=".02"/></linearGradient>
   <linearGradient id={`${id}-curve`}><stop stopColor="#000" stopOpacity=".5"/><stop offset=".2" stopColor="#fff" stopOpacity=".13"/><stop offset=".46" stopColor="#fff" stopOpacity="0"/><stop offset=".8" stopColor="#000" stopOpacity=".07"/><stop offset="1" stopColor="#000" stopOpacity=".55"/></linearGradient>
   <linearGradient id={`${id}-crate`} x2="0" y2="1"><stop stopColor="#414639"/><stop offset=".35" stopColor="#24291f"/><stop offset="1" stopColor="#151a13"/></linearGradient>
   <radialGradient id={`${id}-shadow`}><stop stopColor="#000" stopOpacity=".85"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient>
   <clipPath id={`${id}-label`}><path d="M-64 211 Q0 201 64 211 V368 Q0 378-64 368Z"/></clipPath>
   <g id={`${id}-bottle`}>{bottle}</g>
  </defs>
  <rect width="600" height="620" fill="#171b15"/>
  <rect width="600" height="620" fill={ref('ambient')}/>
  <path d="M0 494H600" stroke="#b9bc9c" strokeOpacity=".09"/>
  <text x="34" y="43" fill={accent} fontSize="10" letterSpacing="3">KRAUSBRÄU / SUD {number}</text>
  {type === 'bottle' ? <>
   <ellipse cx="300" cy="532" rx="162" ry="26" fill={ref('shadow')}/>
   <use href={`#${id}-bottle`} transform="translate(300 87) rotate(-7 0 430)"/>
   <text x="454" y="316" fill="#bfc2b1" opacity=".5" fontSize="10" letterSpacing="4" transform="rotate(90 454 316)">HANDGEBRAUT</text>
  </> : <>
   <ellipse cx="324" cy="522" rx="264" ry="38" fill={ref('shadow')}/>
   <path d="M165 325 237 284 537 297 466 344Z" fill="#10160f" stroke="#505947"/>
   {[0, 1, 2, 3].map(i => <use key={`back${i}`} href={`#${id}-bottle`} transform={`translate(${255 + i * 71} ${178 + i * 3}) scale(.46)`}/>)}
   {[0, 1, 2, 3].map(i => <use key={`front${i}`} href={`#${id}-bottle`} transform={`translate(${204 + i * 74} ${208 + i * 3}) scale(.48)`}/>)}
   <path d="M165 326 465 340 465 510 165 495Z" fill={ref('crate')} stroke="#4f5746" strokeWidth="2"/>
   <path d="M465 340 538 298 538 464 465 510Z" fill="#171d14" stroke="#3d4835" strokeWidth="2"/>
   <path d="M160 322 467 337 543 294V314L470 355 160 340Z" fill="#4a5141"/>
   <path d="M183 357 447 369M183 465 447 478" stroke="#707961" strokeOpacity=".23" strokeWidth="3"/>
   {[190, 225, 260, 400, 435].map(x => <path key={x} d={`M${x} 369v112`} stroke="#0c120b" strokeWidth="8" opacity=".45"/>)}
   <path d="M488 366 519 348V376L488 394Z" fill="#090f08" stroke="#58604b"/>
   <g transform="matrix(1 .049 0 1 272 380)">
    <rect width="116" height="72" rx="2" fill={accent}/>
    <text x="58" y="26" textAnchor="middle" fill="#20251a" fontSize="16" fontWeight="800" letterSpacing=".6">KRAUSBRÄU</text>
    <path d="M16 36H100" stroke="#20251a" strokeOpacity=".5"/>
    <text x="58" y="54" textAnchor="middle" fill="#20251a" fontSize="10" letterSpacing="2">SUD {number}</text>
   </g>
   <ellipse cx="136" cy="540" rx="91" ry="17" fill={ref('shadow')}/>
   <use href={`#${id}-bottle`} transform="translate(137 184) rotate(-9 0 430) scale(.81)"/>
  </>}
  <text x="34" y="587" fill="#a6ab99" fontSize="9" letterSpacing="2">{type === 'bottle' ? 'KLEINER SUD. EIGENER CHARAKTER.' : 'GEBRAUT, UM GETEILT ZU WERDEN.'}</text>
  <text x="566" y="587" textAnchor="end" fill="#828876" fontSize="8" letterSpacing="1">ETIKETTENENTWURF</text>
 </svg>;
}
