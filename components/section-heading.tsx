import type { ReactNode } from 'react';

export function SectionHeading({ id, children, level = 2 }: { id: string; children: ReactNode; level?: 2 | 3 }) {
 const Tag = level === 3 ? 'h3' : 'h2';
 return <Tag id={id} className="section-heading"><a href={`#${id}`} title="Direktlink zu diesem Abschnitt">
  {children}<svg className="section-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="m10 13 4-4m-6 7-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 1 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0"/></svg>
 </a></Tag>;
}
