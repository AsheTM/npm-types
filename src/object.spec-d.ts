import type { KeysOfType, Mutable, PartialBy, Prettify, RequireAtLeastOne, RequiredBy, RequireExactlyOne, ValueOf } from './index.ts';
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

// Prettify: should flatten an intersection and keep `readonly` and `?`
{
  // GIVEN
  type Intersection = { readonly id: number } & { name?: string };

  // WHEN
  type Flat = Prettify<Intersection>;

  // THEN
  assertTrue<Equals<Flat, { readonly id: number; name?: string }>>();
}

// PartialBy: should make only the given keys optional
{
  // GIVEN
  interface Account {
    id: number;
    name: string;
    readonly email: string;
  }

  // WHEN
  type NewAccount = PartialBy<Account, 'id' | 'email'>;

  // THEN
  assertTrue<Equals<NewAccount, { name: string; id?: number; readonly email?: string }>>();
  accept<NewAccount>({ name: 'A' });
  // @ts-expect-error: `name` is still required
  accept<NewAccount>({ id: 1 });
}

// RequiredBy: should make only the given keys required
{
  // GIVEN
  interface Options {
    url?: string;
    timeout?: number;
  }

  // WHEN
  type UrlOptions = RequiredBy<Options, 'url'>;

  // THEN
  assertTrue<Equals<UrlOptions, { timeout?: number; url: string }>>();
  // @ts-expect-error: `url` is required
  accept<UrlOptions>({ timeout: 1 });
}

interface Contact {
  name: string;
  email?: string;
  phone?: string;
}

// RequireAtLeastOne: should need at least one of the given keys
{
  // GIVEN
  type Reachable = RequireAtLeastOne<Contact, 'email' | 'phone'>;

  // WHEN / THEN
  accept<Reachable>({ name: 'A', email: 'a@b.c' });
  accept<Reachable>({ name: 'A', phone: '01' });
  accept<Reachable>({ name: 'A', email: 'a@b.c', phone: '01' });
  // @ts-expect-error: none of the keys is set
  accept<Reachable>({ name: 'A' });
  // @ts-expect-error: keys outside the list are kept as they are
  accept<Reachable>({ email: 'a@b.c' });
}

// RequireAtLeastOne: should use every key by default
{
  // GIVEN
  type Filter = RequireAtLeastOne<{ id?: number; name?: string }>;

  // WHEN / THEN
  assertTrue<Equals<Filter, { id: number; name?: string } | { name: string; id?: number }>>();
  // @ts-expect-error: an empty object is not allowed
  accept<Filter>({});
}

// RequireExactlyOne: should need exactly one of the given keys
{
  // GIVEN
  type Single = RequireExactlyOne<Contact, 'email' | 'phone'>;

  // WHEN / THEN
  accept<Single>({ name: 'A', email: 'a@b.c' });
  accept<Single>({ name: 'A', phone: '01' });
  // @ts-expect-error: two keys are set
  accept<Single>({ name: 'A', email: 'a@b.c', phone: '01' });
  // @ts-expect-error: none of the keys is set
  accept<Single>({ name: 'A' });
}
