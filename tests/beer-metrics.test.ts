import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beerMetrics } from '../lib/beer-metrics.ts';
import type { Brew } from '../lib/types.ts';

test('Draft metrics use target gravity, never provisional actual results', () => {
 const brew = {date:null,bottledDate:null,plannedGravity:14.5,originalGravity:16,abv:0.5} as Brew;
 assert.deepEqual(beerMetrics(brew),{draft:true,gravity:14.5,abv:null});
 assert.equal(beerMetrics({...brew,plannedGravity:null}).gravity,null);
 assert.deepEqual(beerMetrics({...brew,date:'2026-10-11'}),{draft:false,gravity:16,abv:0.5});
 assert.equal(beerMetrics({...brew,bottledDate:'2026-10-11'}).draft,false);
});
