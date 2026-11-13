import type { Maybe, Nullable } from './index.ts';
import { accept, assertTrue, type Equals } from './testing/assert.ts';

// Nullable: should be `T | null`
{
  // GIVEN
  type Value = Nullable<string>;

  // WHEN / THEN
  assertTrue<Equals<Value, string | null>>();
  accept<Value>('text');
  accept<Value>(null);
  // @ts-expect-error: `undefined` is not allowed
  accept<Value>(undefined);
}

// Maybe: should be `T | null | undefined`
{
  // GIVEN
  type Value = Maybe<number>;

  // WHEN / THEN
  assertTrue<Equals<Value, number | null | undefined>>();
  accept<Value>(1);
  accept<Value>(null);
  accept<Value>(undefined);
  // @ts-expect-error: another type is not allowed
  accept<Value>('1');
}
