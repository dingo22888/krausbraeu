'use client';
import { useFormStatus } from 'react-dom';
export function Submit({children,pending='Wird gespeichert …'}:{children:React.ReactNode;pending?:string}){const status=useFormStatus();return <button type="submit" disabled={status.pending}>{status.pending?pending:children}</button>}
