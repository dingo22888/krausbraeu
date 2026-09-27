'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <section className="section empty"><h1>Kurze Braupause.</h1><p>Die Bierdaten konnten gerade nicht geladen werden. Bitte versuche es gleich noch einmal.</p><button onClick={reset}>Erneut versuchen</button></section>}
