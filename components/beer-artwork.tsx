import Image from 'next/image';
import { Arrow } from './arrow';

export function BeerArtwork({ image, number, sizes, priority = false }: {
 image: string | null; number: number | null; sizes: string; priority?: boolean;
}) {
 return <div className="card-art">
  {image ? <Image src={image} alt="" fill sizes={sizes} priority={priority} unoptimized={image.startsWith('https:')}/> : <span className="cover-fallback">#{number}</span>}
  <span className="card-number">SUD {String(number).padStart(2, '0')}</span>
  <span className="card-open" aria-hidden="true"><Arrow/></span>
 </div>;
}
