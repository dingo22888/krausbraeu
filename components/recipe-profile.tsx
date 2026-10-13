import type { Beer } from '@/lib/types';
import { maltColor, recipeHeadline } from '@/lib/recipe-profile';
const number = (n:number, digits=1) => new Intl.NumberFormat('de-DE',{maximumFractionDigits:digits}).format(n);
const kg = (n:number) => new Intl.NumberFormat('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
const known = (n:number|null|undefined): n is number => n != null && Number.isFinite(n) && n>=0;

function IngredientIcon({type}:{type:'malt'|'hop'|'yeast'}) {
  return <svg className="ingredient-symbol" viewBox="0 0 32 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type==='malt'?<><path d="M16 36V8m0 17C6 26 5 18 5 18s10-1 11 7Zm0-8C6 18 6 10 6 10s9 0 10 7Zm0 8c10 1 11-7 11-7s-10-1-11 7Zm0-8c10 1 10-7 10-7s-9 0-10 7Zm0-8c-5-4 0-8 0-8s5 4 0 8Z"/></>:type==='hop'?<><path d="M16 3v5m0 0C2 15 4 29 16 37 28 29 30 15 16 8Zm0 0-5 11 5 5 5-5-5-11ZM6 19l10 5 10-5M8 28l8 4 8-4m-8-8v8"/></>:<><ellipse cx="11" cy="15" rx="7" ry="9" transform="rotate(-25 11 15)"/><ellipse cx="22" cy="28" rx="6" ry="8" transform="rotate(30 22 28)"/><circle cx="23" cy="9" r="4"/><path d="m9 13 3 4m9 8 2 3"/></>}
  </svg>;
}
function MaltGrains({ebc}:{ebc?:number|null}) {
  const color=maltColor(ebc);
  return <span className="malt-color" title={color?'Malzfarbe nach EBC angenähert; keine naturgetreue Kornfarbe':'Malzfarbe nicht hinterlegt'}>
    <svg viewBox="0 0 38 32" width="38" height="32" aria-hidden="true"><g fill={color||'none'} stroke="#aaa38a" strokeWidth="1"><ellipse cx="12" cy="15" rx="6" ry="12" transform="rotate(-28 12 15)"/><ellipse cx="27" cy="18" rx="6" ry="12" transform="rotate(25 27 18)"/></g><g stroke={color?'#eadfbd':'#aaa38a'} strokeOpacity={color?'.4':'.6'} fill="none"><path d="m7 5 10 20M31 8l-9 21"/></g></svg>
    <small>{known(ebc)?`${number(ebc)} EBC`:'EBC offen'}</small>
  </span>;
}
export function RecipeProfile({beer}:{beer:Beer}) {
  const b=beer.brew;
  const total=b.malts.reduce((sum,m)=>sum+(known(m.amount)?m.amount:0),0);
  const yeast=b.yeastDetails?.length?b.yeastDetails:b.yeast.map(name=>({name,amount:null}));
  return <section className="ingredients section recipe-profile" aria-labelledby="recipe-heading">
    <div className="section-intro"><span className="eyebrow">DAS PRÄGT DIESEN SUD</span><h2 id="recipe-heading">{recipeHeadline(beer)}</h2>{beer.recipe_note?.trim()&&<p>{beer.recipe_note}</p>}
      <dl className="recipe-facts">
        {known(b.volume)&&<div><dt>Ausschlag · geplant</dt><dd>{number(b.volume)} <span>l</span></dd></div>}
        {b.malts.length>0&&<div><dt>Gesamtschüttung</dt><dd>{kg(total)} <span>kg</span></dd></div>}
        {known(b.boilMinutes)&&<div><dt>Kochzeit</dt><dd>{number(b.boilMinutes)} <span>min</span></dd></div>}
      </dl><small className="recipe-context">{!b.date?'Planwerte · laut Rezept':'Zutaten und Mengen laut Rezept'}</small>
    </div>
    <div className="ingredient-list">
      <div className="ingredient"><IngredientIcon type="malt"/><div><h3>Schüttung</h3>{b.malts.length===0?<p>Keine Angabe</p>:b.malts.map((m,i)=>{
        const share=known(m.share)?m.share:total>0?m.amount/total*100:null;
        return <div className="malt recipe-malt" key={i}><div className="malt-heading"><span>{m.name}</span><strong>{kg(m.amount)} kg <span>· {share===null?'—':number(share)} %</span></strong></div><MaltGrains ebc={m.ebc}/><div className="bar" aria-hidden="true"><span style={{width:`${Math.max(0,Math.min(100,share??0))}%`}}/></div></div>;
      })}<small className="recipe-context">Kornfarben nach Malz-EBC angenähert.</small></div></div>
      <div className="ingredient"><IngredientIcon type="hop"/><div><h3>Hopfen</h3>{b.hops.length===0?<p>Keine Angabe</p>:<ul className="recipe-additions">{b.hops.map((h,i)=><li key={i}><div><span>{h.name}</span><strong>{number(h.amount)} g</strong></div><small>{[h.firstWort?'Vorderwürze':known(h.minutes)?h.minutes===0?'Zum Kochende':`${number(h.minutes)} min vor Kochende`:null,known(h.alpha)?`${number(h.alpha)} % Alpha`:null].filter(Boolean).join(' · ')}</small></li>)}</ul>}</div></div>
      <div className="ingredient"><IngredientIcon type="yeast"/><div><h3>Hefe</h3>{yeast.length===0?<p>Keine Angabe</p>:<ul className="recipe-additions">{yeast.map((y,i)=><li key={i}><div><span>{y.name}</span>{known(y.amount)&&<strong>{number(y.amount)} {y.amount===1?'Packung':'Packungen'}</strong>}</div></li>)}</ul>}</div></div>
    </div>
  </section>;
}
