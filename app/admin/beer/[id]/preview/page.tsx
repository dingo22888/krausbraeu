import { requireAdmin } from '@/lib/auth';
import { getAdminBeer } from '@/lib/db';
import { notFound } from 'next/navigation';
import { BeerLabel } from '@/components/beer-label';
export const dynamic='force-dynamic';
export const metadata={title:'Private Vorschau',robots:{index:false,follow:false}};
export default async function Preview({params}:{params:Promise<{id:string}>}){await requireAdmin();const {id}=await params;if(!/^\d+$/.test(id))notFound();const b=await getAdminBeer(Number(id));if(!b)notFound();return <BeerLabel beer={b} preview/>;}
