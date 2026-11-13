import type { Tuple } from './index.ts';
import { accept, assertTrue, type Equals } from './testing/assert.ts';

// Tuple: should give a tuple of N items
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<Tuple<number, 3>, [number, number, number]>>();
  assertTrue<Equals<Tuple<string, 1>, [string]>>();
  assertTrue<Equals<Tuple<string, 0>, []>>();
  accept<Tuple<number, 2>>([1, 2]);
  // @ts-expect-error: one item too many
  accept<Tuple<number, 2>>([1, 2, 3]);
}

// Tuple: should give a union of tuples for a union of lengths
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<Tuple<boolean, 1 | 2>, [boolean] | [boolean, boolean]>>();
}

// Tuple: should give an array for `number`, and `never` for a negative or decimal length
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<Tuple<string, number>, string[]>>();
  assertTrue<Equals<Tuple<string, -1>, never>>();
  assertTrue<Equals<Tuple<string, 1.5>, never>>();
}

// Tuple: should handle up to 998 items
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<Tuple<0, 998>['length'], 998>>();
  // @ts-expect-error: more than 998 items
  type TooLong = Tuple<0, 999>;
}
