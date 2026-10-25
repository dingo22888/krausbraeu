import { SectionHeading } from './section-heading';
import type { Beer, Ingredient } from '@/lib/types';
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
  if (!color) return null;
  return <span className="malt-color">
    <svg viewBox="0 0 38 32" width="38" height="32" aria-hidden="true"><g fill={color||'none'} stroke="#aaa38a" strokeWidth="1"><ellipse cx="12" cy="15" rx="6" ry="12" transform="rotate(-28 12 15)"/><ellipse cx="27" cy="18" rx="6" ry="12" transform="rotate(25 27 18)"/></g><g stroke={color?'#eadfbd':'#aaa38a'} strokeOpacity={color?'.4':'.6'} fill="none"><path d="m7 5 10 20M31 8l-9 21"/></g></svg>
    <small>{number(ebc!)} EBC</small>
  </span>;
}
function HopTiming({hop,boilMinutes}:{hop:Ingredient;boilMinutes?:number|null}) {
  if (!known(boilMinutes)||boilMinutes<=0) return null;
  if (!hop.firstWort&&(!known(hop.minutes)||hop.minutes>boilMinutes)) return null;
  const position=hop.firstWort?0:100*(boilMinutes-hop.minutes!)/boilMinutes;
  const label=hop.firstWort?`Vorderwürze, vor Kochbeginn; Kochdauer ${number(boilMinutes)} Minuten`:`Zugabe ${number(boilMinutes-hop.minutes!)} Minuten nach Kochbeginn, ${number(hop.minutes!)} Minuten vor Kochende`;
  return <div className="hop-timing" role="img" aria-label={label}>
    <div className="hop-timing-track" aria-hidden="true">
      {hop.firstWort&&<span className="hop-first-wort"><i/></span>}
      <div className="hop-boil-track">{!hop.firstWort&&<i style={{left:`${position}%`}}/>}</div>
    </div>
    <div className="hop-timing-labels" aria-hidden="true"><span>Kochbeginn · {number(boilMinutes)} min</span><span>Kochende · 0 min</span></div>
  </div>;
}
export function RecipeProfile({beer}:{beer:Beer}) {
  const b=beer.brew;
  const total=b.malts.reduce((sum,m)=>sum+(known(m.amount)?m.amount:0),0);
  const yeast=b.yeastDetails?.length?b.yeastDetails:b.yeast.map(name=>({name,amount:null}));
  return <section className="ingredients section recipe-profile" aria-labelledby="rezept">
    <div className="section-intro"><span className="eyebrow">DAS PRÄGT DIESEN SUD</span><SectionHeading id="rezept">{recipeHeadline(beer)}</SectionHeading>{beer.recipe_note?.trim()&&<p>{beer.recipe_note}</p>}
      <dl className="recipe-facts">
        {known(b.volume)&&<div><dt>Ausschlag · geplant</dt><dd>{number(b.volume)} <span>l</span></dd></div>}
        {b.malts.length>0&&<div><dt>Gesamtschüttung</dt><dd>{kg(total)} <span>kg</span></dd></div>}
        {known(b.boilMinutes)&&<div><dt>Kochzeit</dt><dd>{number(b.boilMinutes)} <span>min</span></dd></div>}
      </dl>{!b.date&&!b.bottledDate&&<small className="recipe-context">Planwerte</small>}
    </div>
    <div className="ingredient-list">
      <div className="ingredient"><IngredientIcon type="malt"/><div><SectionHeading id="schuettung" level={3}>Schüttung</SectionHeading>{b.malts.length===0?<p>Keine Angabe</p>:b.malts.map((m,i)=>{
        const share=known(m.share)?m.share:total>0?m.amount/total*100:null;
        return <div className="malt recipe-malt" key={i}><div className="malt-heading"><span>{m.name}</span><strong>{kg(m.amount)} kg <span>· {share===null?'—':number(share)} %</span></strong></div><MaltGrains ebc={m.ebc}/><div className="bar" aria-hidden="true"><span style={{width:`${Math.max(0,Math.min(100,share??0))}%`}}/></div></div>;
      })}</div></div>
      <div className="ingredient"><IngredientIcon type="hop"/><div><SectionHeading id="hopfen" level={3}>Hopfen</SectionHeading>{b.hops.length===0?<p>Keine Angabe</p>:<ul className="recipe-additions">{b.hops.map((h,i)=><li key={i}><div><span>{h.name}</span><strong>{number(h.amount)} g</strong></div><small>{[h.firstWort?'Vorderwürze':known(h.minutes)?h.minutes===0?'Zum Kochende':`${number(h.minutes)} min vor Kochende`:null,known(h.alpha)?`${number(h.alpha)} % Alpha`:null].filter(Boolean).join(' · ')}</small><HopTiming hop={h} boilMinutes={b.boilMinutes}/></li>)}</ul>}</div></div>
      <div className="ingredient"><IngredientIcon type="yeast"/><div><SectionHeading id="hefe" level={3}>Hefe</SectionHeading>{yeast.length===0?<p>Keine Angabe</p>:<ul className="recipe-additions">{yeast.map((y,i)=><li key={i}><div><span>{y.name}</span>{known(y.amount)&&<strong>{number(y.amount)} {y.amount===1?'Packung':'Packungen'}</strong>}</div></li>)}</ul>}</div></div>
    </div>
  </section>;
}
