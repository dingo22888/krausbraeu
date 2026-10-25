import test from 'node:test';
import assert from 'node:assert/strict';
import type { Beer } from '../lib/types.ts';
import { isShareSection, sectionShare } from '../lib/beer-section-share.ts';
const beer={public_number:32,display_name:'Emberhead',accent:'#ed8e40',tasting_notes:'',brew:{name:'Emberhead',date:null,bottledDate:null,plannedGravity:14.5,originalGravity:19,abv:9,ibu:38,ebc:70,volume:21,malts:[{name:'Münchner & Rauchmalz',amount:2.6}],hops:[{name:'Magnum',amount:20,firstWort:true}],yeast:['Nottingham']}} as Beer;
test('Section shares use planned gravity and omit unmeasured draft alcohol',()=>{
 const data=sectionShare(beer,'werte');assert.match(data.description,/14,5 °P/);assert.doesNotMatch(data.description,/19 °P|9 %/);assert.equal(data.label,'Planwerte');
 assert.equal(data.path,'/32/teilen/werte');assert.equal(data.destination,'/32#werte');
 const brewed=sectionShare({...beer,brew:{...beer.brew,date:'2026-10-25'}},'werte');assert.match(brewed.description,/19 °P/);assert.match(brewed.description,/9 % vol/);
});
test('Share sections isolate relevant ingredients',()=>{
 assert.match(sectionShare(beer,'schuettung').description,/Münchner & Rauchmalz: 2,6 kg/);assert.doesNotMatch(sectionShare(beer,'schuettung').description,/Magnum/);
 assert.match(sectionShare(beer,'hopfen').description,/Magnum: 20 g · Vorderwürze/);
 assert.ok(isShareSection('schuettung'));assert.ok(!isShareSection('constructor'));assert.ok(!isShareSection('../admin'));
});
