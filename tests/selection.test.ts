import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSelection, partitionSelection } from '../lib/import-selection.ts';
import type { Brew } from '../lib/types.ts';
const base={style:'',bottledDate:null,status:1,originalGravity:null,plannedGravity:null,ibu:null,ebc:null,volume:null,abv:null,malts:[],hops:[],yeast:[],fermentation:[]};
const brews:Brew[]=[{...base,sourceId:37,number:31,name:'Gurgelrutscher',date:'2026-09-26'},{...base,sourceId:38,number:1,name:'Gurgelrutscher Kevin',date:null},{...base,sourceId:2,number:1,name:'Erster Sud',date:'2021-05-01'}];
test('unbrewed Kevin recipe is not preselected; prior exclusions persist',()=>{assert.deepEqual(defaultSelection(brews,[]),[37,2]);assert.deepEqual(defaultSelection(brews,[37]),[2]);});
test('selection is based on source ID, not duplicate public number',()=>{const {selected,skipped}=partitionSelection(brews,['37','2']);assert.deepEqual(selected.map(b=>b.sourceId),[37,2]);assert.deepEqual(skipped.map(b=>b.sourceId),[38]);});
test('excluded drafts can be explicitly selected; unknown IDs are rejected',()=>{assert.deepEqual(partitionSelection(brews,['38','38']).selected.map(b=>b.sourceId),[38]);assert.throws(()=>partitionSelection(brews,['999']));assert.throws(()=>partitionSelection(brews,['37x']));assert.equal(partitionSelection(brews,[]).selected.length,0);});
