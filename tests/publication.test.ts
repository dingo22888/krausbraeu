import test from 'node:test';
import assert from 'node:assert/strict';
import { publicationIds } from '../lib/publication.ts';
test('bulk publication accepts selected internal IDs and deduplicates',()=>assert.deepEqual(publicationIds(['37','2','37']),[37,2]));
test('bulk publication rejects empty and malformed selections',()=>{
 for(const values of [[],['-1'],['0'],['1.5'],['1 OR 1=1'],['2147483648'],Array(1001).fill('1')])assert.throws(()=>publicationIds(values));
});
