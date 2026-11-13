import type { DeepPartial, DeepReadonly } from './index.ts';
import { accept, assertTrue, type Equals } from './testing/assert.ts';

interface Settings {
  theme: { color: string; dark: boolean };
  tags: string[];
  pair: [string, { size: number }];
  createdAt: Date;
  pattern: RegExp;
  load: (id: number) => string;
  users: Map<string, { name: string }>;
  roles: Set<{ id: number }>;
}

// DeepPartial: should make every property optional, at every level
{
  // GIVEN / WHEN
  type Patch = DeepPartial<Settings>;

  // THEN
  accept<Patch>({});
  accept<Patch>({ theme: {} });
  accept<Patch>({ theme: { dark: true } });
  accept<Patch>({ pair: ['a', {}] });
  // @ts-expect-error: unknown properties are not allowed
  accept<Patch>({ theme: { other: 1 } });
}

// DeepPartial: should make array items deep partial, and keep the length of tuples
{
  // GIVEN / WHEN
  type Items = DeepPartial<{ size: number }[]>;
  type Pair = DeepPartial<[string, { size: number }]>;
  type ReadonlyItems = DeepPartial<readonly { size: number }[]>;

  // THEN
  assertTrue<Equals<Items, { size?: number }[]>>();
  assertTrue<Equals<Pair, [string, { size?: number }]>>();
  assertTrue<Equals<ReadonlyItems, readonly { size?: number }[]>>();
  // @ts-expect-error: a tuple keeps its length
  accept<Pair>(['a']);
}

// DeepPartial: should make `Map` and `Set` values deep partial, and keep `Map` keys
{
  // GIVEN / WHEN
  type Users = DeepPartial<Map<{ id: number }, { name: string }>>;
  type Roles = DeepPartial<Set<{ id: number }>>;
  type ReadonlyUsers = DeepPartial<ReadonlyMap<string, { name: string }>>;
  type ReadonlyRoles = DeepPartial<ReadonlySet<{ id: number }>>;

  // THEN
  assertTrue<Equals<Users, Map<{ id: number }, { name?: string }>>>();
  assertTrue<Equals<Roles, Set<{ id?: number }>>>();
  assertTrue<Equals<ReadonlyUsers, ReadonlyMap<string, { name?: string }>>>();
  assertTrue<Equals<ReadonlyRoles, ReadonlySet<{ id?: number }>>>();
}

// DeepPartial: should keep primitives, functions and built-in objects as they are
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<DeepPartial<string>, string>>();
  assertTrue<Equals<DeepPartial<number | null>, number | null>>();
  assertTrue<Equals<DeepPartial<Date>, Date>>();
  assertTrue<Equals<DeepPartial<RegExp>, RegExp>>();
  assertTrue<Equals<DeepPartial<Error>, Error>>();
  assertTrue<Equals<DeepPartial<Promise<{ id: number }>>, Promise<{ id: number }>>>();
  assertTrue<Equals<DeepPartial<WeakMap<{ id: number }, { name: string }>>, WeakMap<{ id: number }, { name: string }>>>();
  assertTrue<Equals<DeepPartial<WeakSet<{ id: number }>>, WeakSet<{ id: number }>>>();
  assertTrue<Equals<DeepPartial<(id: number) => string>, (id: number) => string>>();
  assertTrue<Equals<DeepPartial<Settings>['createdAt'], Date | undefined>>();
}

// DeepPartial: should apply to each member of a union
{
  // GIVEN / WHEN
  type Value = DeepPartial<string | { size: number }>;

  // THEN
  assertTrue<Equals<Value, string | { size?: number }>>();
}

// DeepReadonly: should make every property readonly, at every level
{
  // GIVEN
  const settings = {} as DeepReadonly<Settings>;

  // WHEN / THEN
  // @ts-expect-error: a nested property is readonly
  settings.theme.color = 'blue';
  // @ts-expect-error: an array is readonly
  settings.tags.push('b');
  // @ts-expect-error: a tuple item is readonly
  settings.pair[1].size = 2;
  // @ts-expect-error: a `Map` is readonly
  settings.users.set('a', { name: 'b' });
  // @ts-expect-error: a `Set` is readonly
  settings.roles.add({ id: 1 });
  accept<string>(settings.load(1));
}

// DeepReadonly: should turn arrays, tuples, `Map` and `Set` into their readonly versions
{
  // GIVEN / WHEN
  type Items = DeepReadonly<{ size: number }[]>;
  type Pair = DeepReadonly<[string, { size: number }]>;
  type Users = DeepReadonly<Map<string, { name: string }>>;
  type Roles = DeepReadonly<Set<{ id: number }>>;

  // THEN
  assertTrue<Equals<Items, readonly { readonly size: number }[]>>();
  assertTrue<Equals<Pair, readonly [string, { readonly size: number }]>>();
  assertTrue<Equals<Users, ReadonlyMap<string, { readonly name: string }>>>();
  assertTrue<Equals<Roles, ReadonlySet<{ readonly id: number }>>>();
}

// DeepReadonly: should keep primitives, functions and built-in objects as they are
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<DeepReadonly<string>, string>>();
  assertTrue<Equals<DeepReadonly<Date>, Date>>();
  assertTrue<Equals<DeepReadonly<RegExp>, RegExp>>();
  assertTrue<Equals<DeepReadonly<WeakSet<{ id: number }>>, WeakSet<{ id: number }>>>();
  assertTrue<Equals<DeepReadonly<(id: number) => string>, (id: number) => string>>();
  assertTrue<Equals<DeepReadonly<Settings>['createdAt'], Date>>();
}
