import Link from 'next/link';
export type SudNeighbor={public_number:number;name:string;direction:'previous'|'next'};
export function SudNavigation({neighbors}:{neighbors:SudNeighbor[]}) {
 const previous=neighbors.find(n=>n.direction==='previous');const next=neighbors.find(n=>n.direction==='next');
 return <nav className="sud-navigation" aria-label="Zwischen Suden wechseln">
  {previous?<Link className="sud-nav-link" href={`/${previous.public_number}`} rel="prev"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20 12H4m6-6-6 6 6 6"/></svg><span><small>Voriger Sud · #{previous.public_number}</small><strong>{previous.name}</strong></span></Link>:<span className="sud-nav-boundary">Hier beginnt die Braugeschichte.</span>}
  <Link className="sud-nav-all" href="/#sude">Alle Sude</Link>
  {next?<Link className="sud-nav-link next" href={`/${next.public_number}`} rel="next"><span><small>Nächster Sud · #{next.public_number}</small><strong>{next.name}</strong></span><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></Link>:<span className="sud-nav-boundary next">Das ist der jüngste Sud.</span>}
 </nav>;
}
