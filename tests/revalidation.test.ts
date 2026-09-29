import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';

test('revalidation covers changed, removed and adjacent published pages, including lookup failure', async () => {
 const paths: string[] = [];
 let published = [1, 3, 7];
 let fail = false;
 const state = {
  invalidate: (path: string) => paths.push(path),
  neighbors: async (number: number) => {
   if (fail) throw new Error('database unavailable');
   const previous = published.filter(n => n < number).at(-1);
   const next = published.find(n => n > number);
   return [previous, next].filter(n => n !== undefined).map(public_number => ({ public_number }));
  },
 };
 const bridge = globalThis as typeof globalThis & { revalidationTest?: typeof state };
 bridge.revalidationTest = state;
 const hooks = registerHooks({
  resolve(specifier, context, next) {
   if (context.parentURL?.endsWith('/lib/revalidate-beers.ts')) {
    const mocks: Record<string, string> = {
     'server-only': '',
     'next/cache': 'export const revalidatePath = globalThis.revalidationTest.invalidate;',
     './db': 'export const getBeerNeighbors = globalThis.revalidationTest.neighbors;',
    };
    if (specifier in mocks) return { url: `data:text/javascript,${encodeURIComponent(mocks[specifier])}`, shortCircuit: true };
   }
   return next(specifier, context);
  },
 });
 try {
  const { revalidateBeers } = await import('../lib/revalidate-beers.ts');
  await revalidateBeers([3, 3, null]);
  assert.deepEqual(paths.sort(), ['/', '/1', '/3', '/7']);
  paths.length = 0;
  published = [1, 7]; // The mutation has already removed/unpublished 3.
  await revalidateBeers([3]);
  assert.deepEqual(paths.sort(), ['/', '/1', '/3', '/7']);
  paths.length = 0;
  published = [1, 3, 4, 7];
  await revalidateBeers([3, 4]);
  assert.deepEqual(paths.sort(), ['/', '/1', '/3', '/4', '/7']);
  paths.length = 0;
  fail = true;
  await revalidateBeers([3]);
  assert.deepEqual(paths.sort(), ['/', '/3', '/[number]']);
 } finally {
  hooks.deregister();
  delete bridge.revalidationTest;
 }
});
