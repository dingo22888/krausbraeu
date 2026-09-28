import { Arrow } from '@/components/arrow';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL('https://beer.krausonline.de'),title:{default:'KrausBräu · Handgebraut',template:'%s · KrausBräu'},description:'Kleine Sude, eigener Charakter. Die digitalen Bieretiketten von KrausBräu.',icons:{icon:'/icon.svg'}};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="de"><body><header className="site-header"><Link href="/" className="brand" aria-label="KrausBräu Startseite">KRAUS<span>BRÄU</span><small>PRIVATE BRAUKUNST</small></Link><nav><Link href="/#sude">Die Sude</Link><span className="header-detail">HANDGEBRAUT SEIT 2021</span></nav></header><main>{children}</main><footer><Link href="/" className="footer-logo"><Image src="/krausbraeu-logo.png" width={200} height={200} alt="Kraus Bräu – Gebraut in Struthütten, seit 2021, powered by Hansi"/></Link><span>Privat gebraut. Mit Freunden geteilt.</span><Link href="/admin">Braukeller <Arrow/></Link></footer></body></html>}
