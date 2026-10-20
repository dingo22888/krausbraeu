import { Arrow } from '@/components/arrow';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL('https://beer.krausonline.de'),title:{default:'KrausBräu · Handgebraut',template:'%s · KrausBräu'},description:'Kleine Sude, eigener Charakter. Die digitalen Bieretiketten von KrausBräu.',icons:{icon:[{url:'/brand/k-mark-32.png',type:'image/png',sizes:'32x32'},{url:'/brand/k-mark.svg',type:'image/svg+xml',sizes:'any'}],apple:[{url:'/brand/k-mark-180.png',sizes:'180x180',type:'image/png'}]}};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="de"><body><header className="site-header"><Link href="/" className="brand" aria-label="KrausBräu Startseite"><BrandLogo/></Link><nav><Link href="/#sude">Die Sude</Link><span className="header-detail">HANDGEBRAUT SEIT 2021</span></nav></header><main>{children}</main><footer><Link href="/" className="footer-logo" aria-label="KrausBräu – Gebraut in Struthütten"><BrandLogo variant="portrait"/></Link><span>Privat gebraut. Mit Freunden geteilt.</span><Link href="/admin">Braukeller <Arrow/></Link></footer></body></html>}
