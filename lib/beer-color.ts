// Illustrative EBC palette, not a calibrated colorimetric conversion.
// Interpolate display RGB between anchors so fractional EBC values remain continuous.
const anchors: [number,string][] = [[0,'#fff4ba'],[4,'#f8df76'],[8,'#f3c33c'],[12,'#e9a122'],[20,'#bd691b'],[35,'#854011'],[60,'#47230f'],[100,'#24150e'],[120,'#1b120e']];
export function beerColor(ebc:number|null):string|null {
 if(ebc===null||!Number.isFinite(ebc)||ebc<0)return null;
 const last=anchors[anchors.length-1];if(ebc>=last[0])return last[1];
 const upper=anchors.findIndex(([value])=>value>=ebc);if(upper===0)return anchors[0][1];
 const [low,a]=anchors[upper-1];const [high,b]=anchors[upper];const t=(ebc-low)/(high-low);
 return '#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');
}
