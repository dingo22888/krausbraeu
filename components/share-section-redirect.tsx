'use client';
import { useEffect } from 'react';
export function ShareSectionRedirect({ destination }: { destination: string }) {
 useEffect(()=>{window.location.replace(destination);},[destination]);
 return null;
}
