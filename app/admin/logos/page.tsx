import Image from 'next/image';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Markenlogos', robots: { index: false, follow: false } };
const logos = [
  ['siegel-k', 'Siegel mit K', 'Kreis, Gerstenähren und Herkunft'],
  ['komplettlogo-k', 'Komplettlogo mit K', 'Siegel, Schriftzug und Herkunftszeile'],
  ['schriftzug', 'Schriftzug', 'KrausBräu · Gebraut in Struthütten'],
  ['kreis-k', 'K im Kreis', 'Kompaktes Markenzeichen und Favicon'],
  ['siegel-kopf', 'Siegel mit Kopf', 'Tobis Porträt mit Gerstenähren und Herkunft'],
  ['komplettlogo-kopf', 'Komplettlogo mit Kopf', 'Porträtsiegel, Schriftzug und Herkunftszeile'],
  ['kreis-kopf', 'Kopf im Kreis', 'Kompaktes Porträtzeichen'],
] as const;

export default async function Logos() {
  await requireAdmin();
  return <section className="admin section">
    <Link href="/admin" className="text-link">Zurück zum Braukeller</Link>
    <h1>Unsere Markenlogos.</h1>
    <p>Sieben Varianten für KrausBräu. Die PNG-Originale liegen in Google Drive; hier kannst du die Webversionen herunterladen.</p>
    <p className="brand-drive-link"><a className="text-link" href="https://drive.google.com/drive/folders/1lsk2l0QE3tyySgTQ6OwfoJlsKdtWSpNX" target="_blank" rel="noopener noreferrer">Originale in Google Drive öffnen</a></p>
    <div className="brand-gallery">{logos.map(([id,title,description],index) => <article className="brand-card" key={id}>
      <div className="brand-preview"><Image src={`/brand/${id}.webp`} alt={title} fill sizes="(max-width: 760px) 90vw, 440px"/></div>
      <h2>{index + 1}. {title}</h2><p>{description}</p>
      <a className="text-link" href={`/brand/${id}.webp`} download={`krausbraeu-${id}.webp`}>WebP herunterladen</a>
    </article>)}</div>
  </section>;
}
