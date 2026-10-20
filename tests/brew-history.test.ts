import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brewHistory, eventDate } from '../lib/brew-history.ts';
import type { Beer } from '../lib/types.ts';
const beer = (overrides: Partial<Beer> = {}): Beer => ({ id: 1, published: true, public_number: 31, display_name: 'Gurgelrutscher', accent: '#e9b44c', image_url: '/old.webp', images: [{id:'new',url:'/first.webp',caption:''}], brew: { name: 'Gurgelrutscher', style: 'Helles', date: '2026-09-27', bottledDate: '2026-10-04' }, ...overrides } as Beer);
test('Chronicle orders actual brewing/bottling dates and uses the first gallery image', () => {
 const events = brewHistory([beer()]);
 assert.deepEqual(events.map(e => [e.kind,e.date]), [['bottled','2026-10-04'],['brewed','2026-09-27']]);
 assert.equal(events[0].image, '/first.webp');
 assert.equal(events[0].href, '/31');
});
test('Chronicle never exposes private beers or invents dates for drafts', () => {
 assert.deepEqual(brewHistory([beer({published:false}),beer({public_number:null}),beer({brew:{date:null,bottledDate:null} as Beer['brew']})]), []);
});
test('Chronicle rejects impossible dates and keeps timezone-free source days', () => {
 assert.equal(eventDate('2026-02-30'),null);
 assert.equal(eventDate('0000-00-00'),null);
 assert.equal(eventDate('invalid'),null);
 assert.equal(eventDate('2024-02-29 23:30:00'),'2024-02-29');
 assert.equal(eventDate('2026-10-04T23:30:00-02:00'),'2026-10-04');
});
