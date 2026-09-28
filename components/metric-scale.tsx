export function MetricScale({value,max,unit,label}:{value:number|null;max:number;unit:string;label:string}) {
 const known=value!==null&&Number.isFinite(value);const clamped=known?Math.max(0,Math.min(max,value)):0;
 return <div className="metric-scale">
  <div className={`metric-track${known?'':' is-unknown'}`} role={known?'meter':undefined} aria-label={`${label} – Orientierungsskala`} aria-valuemin={known?0:undefined} aria-valuemax={known?max:undefined} aria-valuenow={known?clamped:undefined} aria-valuetext={known?`${value.toLocaleString('de-DE')} ${unit}${value>max?' – oberhalb der Skala':''}`:undefined}>
   {known&&<i style={{width:`${clamped/max*100}%`}}/>}
  </div>
  <div className="metric-range" aria-hidden="true"><span>0</span><span>{max}{known&&value>max?'+':''} {unit}</span></div>
 </div>;
}
