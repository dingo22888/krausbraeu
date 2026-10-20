'use client';
import { useState, type ReactNode } from 'react';

export function BrewCollection({ years, grid, upcoming, count }: {
 years: { year: string; count: number; content: ReactNode }[]; grid: ReactNode; upcoming: ReactNode; count: number;
}) {
 const [view, setView] = useState<'history' | 'grid'>('history');
 const [year, setYear] = useState('all');
 const shown = years.filter(group => year === 'all' || group.year === year);
 return <>
  <div className="collection-tools">
   <div className="collection-switch" role="group" aria-label="Darstellung der Sude">
    <button type="button" title="Braubuch" aria-label="Braubuch" aria-pressed={view === 'history'} aria-controls="brew-history" onClick={() => setView('history')}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1v18M3 5h7m0 10h7"/><circle cx="10" cy="5" r="2"/><circle cx="10" cy="15" r="2"/></svg></button>
    <button type="button" title="Alle Sude als Raster" aria-label={`Alle ${count} Sude als Raster`} aria-pressed={view === 'grid'} aria-controls="brew-grid" onClick={() => setView('grid')}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 2h6v6H2zM12 2h6v6h-6zM2 12h6v6H2zM12 12h6v6h-6z"/></svg></button>
   </div>
   {view === 'history' && years.length > 0 && <label className="history-filter">Zeitraum<span className="history-select"><select value={year} onChange={event => setYear(event.target.value)}><option value="all">Alle Jahre</option>{years.map(group => <option key={group.year} value={group.year}>{group.year}</option>)}</select><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7 5 5 5-5"/></svg></span></label>}
  </div>
  <div id="brew-history" hidden={view !== 'history'}>
   {year === 'all' && upcoming}
   <p className="history-summary" role="status">{shown.reduce((sum,group) => sum + group.count, 0)} Momente aus dem Braukeller{year === 'all' ? '' : ` · ${year}`}</p>
   {shown.length ? <div className="brew-timeline">{shown.map(group => <section className="timeline-year" key={group.year} aria-label={`Braujahr ${group.year}`}><h3 className="timeline-year-label">{group.year}</h3>{group.content}</section>)}<p className="timeline-end">Mit jedem Sud ein Stück Geschichte.</p></div> : <p className="history-empty">Die Geschichte beginnt mit dem ersten Brautag. Alle veröffentlichten Rezepte findest du unter „Alle Sude“.</p>}
  </div>
  <div id="brew-grid" hidden={view !== 'grid'}>{grid}</div>
 </>;
}
