import type { KeysOfType, Mutable, ValueOf } from './index.ts';
import { accept, assertTrue, type Equals } from './testing/assert.ts';

interface User {
  readonly id: number;
  name: string;
  nickname?: string;
  age: number | null;
  greet: () => string;
}

// ValueOf: should give the union of the values
{
  // GIVEN
  const status = { Active: 'active', Archived: 'archived' } as const;

  // WHEN
  type Status = ValueOf<typeof status>;

  // THEN
  assertTrue<Equals<Status, 'active' | 'archived'>>();
}

// ValueOf: should work on arrays and tuples
{
  // GIVEN
  type Roles = ['admin', 'user'];

  // WHEN / THEN
  accept<ValueOf<Roles>>('admin');
}

// KeysOfType: should give the keys whose value is assignable to `V`
{
  // GIVEN / WHEN
  type TextKeys = KeysOfType<User, string>;
  type NumberKeys = KeysOfType<User, number>;
  type NullableNumberKeys = KeysOfType<User, number | null>;
  type FunctionKeys = KeysOfType<User, Function>;

  // THEN
  assertTrue<Equals<TextKeys, 'name' | 'nickname'>>();
  assertTrue<Equals<NumberKeys, 'id'>>();
  assertTrue<Equals<NullableNumberKeys, 'id' | 'age'>>();
  assertTrue<Equals<FunctionKeys, 'greet'>>();
}

// KeysOfType: should give `never` when no value matches
{
  // GIVEN / WHEN
  type DateKeys = KeysOfType<User, Date>;

  // THEN
  assertTrue<Equals<DateKeys, never>>();
}

// Mutable: should remove `readonly` from the properties
{
  // GIVEN
  interface Point {
    readonly x: number;
    readonly y?: number;
  }

  // WHEN
  type MutablePoint = Mutable<Point>;

  // THEN
  assertTrue<Equals<MutablePoint, { x: number; y?: number }>>();
  assertTrue<Equals<Equals<Point, MutablePoint>, false>>();
}

// Mutable: should remove `readonly` from arrays and tuples
{
  // GIVEN
  type Ids = readonly number[];
  type Pair = readonly [string, number];

  // WHEN / THEN
  assertTrue<Equals<Mutable<Ids>, number[]>>();
  assertTrue<Equals<Mutable<Pair>, [string, number]>>();
}

// Mutable: should only remove `readonly` from the first level
{
  // GIVEN
  interface Box {
    readonly inner: { readonly value: number };
  }

  // WHEN
  type MutableBox = Mutable<Box>;

  // THEN
  assertTrue<Equals<MutableBox, { inner: { readonly value: number } }>>();
}
