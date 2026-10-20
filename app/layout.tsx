import { Arrow } from '@/components/arrow';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL('https://beer.krausonline.de'),title:{default:'KrausBräu · Handgebraut',template:'%s · KrausBräu'},description:'Kleine Sude, eigener Charakter. Die digitalen Bieretiketten von KrausBräu.',icons:{icon:[{url:'/brand/icon-32.png',type:'image/png',sizes:'32x32'},{url:'/brand/icon-512.png',type:'image/png',sizes:'512x512'}],apple:[{url:'/brand/icon-180.png',sizes:'180x180',type:'image/png'}]}};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="de"><body><header className="site-header"><Link href="/" className="brand" aria-label="KrausBräu Startseite"><Image src="/brand/schriftzug.webp" width={300} height={120} alt="KrausBräu – Gebraut in Struthütten" preload/></Link><nav><Link href="/#sude">Die Sude</Link><span className="header-detail">HANDGEBRAUT SEIT 2021</span></nav></header><main>{children}</main><footer><Link href="/" className="footer-logo"><Image src="/brand/siegel-kopf.webp" width={200} height={200} alt="KrausBräu – Porträtsiegel mit Tobi und Gerstenähren"/></Link><span>Privat gebraut. Mit Freunden geteilt.</span><Link href="/admin">Braukeller <Arrow/></Link></footer></body></html>}
