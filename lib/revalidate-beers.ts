import 'server-only';
import { revalidatePath } from 'next/cache';
import { getBeerNeighbors } from './db';

// Called only after a successful, authenticated mutation. Invalidates the
// page and its data dependencies so regeneration reads current database state.
export async function revalidateBeers(numbers: (number | null)[]) {
 const changed = [...new Set(numbers.filter((number): number is number => number !== null))];
 const paths = new Set(changed.map(number => `/${number}`));
 // Also works after removal/unpublication: find the two surviving neighbors
 // around the former number. Bulk changes include every affected number.
 try {
  const neighbors = await Promise.all(changed.map(getBeerNeighbors));
  for (const neighbor of neighbors.flat()) paths.add(`/${neighbor.public_number}`);
 } catch {
  // The write has already committed. Never leave private/deleted content
  // cached if the follow-up navigation lookup fails.
  revalidatePath('/[number]', 'page');
  console.error('Navigation lookup during revalidation failed');
 } finally {
  revalidatePath('/');
  for (const path of paths) revalidatePath(path);
 }
}
