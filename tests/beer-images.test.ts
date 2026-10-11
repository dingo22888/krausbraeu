import {test} from 'node:test';
import assert from 'node:assert/strict';
import {beerImages,editImages} from '../lib/beer-images.ts';
test('Gallery preserves legacy images; explicit removal stays empty',()=>{
 assert.equal(beerImages({image_url:'/old.webp'})[0].url,'/old.webp');
 assert.deepEqual(beerImages({image_url:'/old.webp',images:[]}),[]);
});
test('Gallery reorder and captions retain trusted URLs and reject unknown or duplicate IDs',()=>{
 const images=[{id:'a',url:'/a.webp',caption:''},{id:'b',url:'/b.webp',caption:''}];
 const result=editImages(JSON.stringify([{id:'b',caption:' Foto ',url:'https://evil.test'},{id:'a',caption:''}]),images);
 assert.deepEqual(result,[{id:'b',url:'/b.webp',caption:'Foto'},images[0]]);
 assert.throws(()=>editImages('[{"id":"c","caption":""}]',images));
 assert.throws(()=>editImages('[{"id":"a","caption":""},{"id":"a","caption":""}]',images));
 assert.throws(()=>editImages(JSON.stringify([{id:'a',caption:'x'.repeat(301)}]),images));
 assert.deepEqual(editImages('[]',images),[]);
});
