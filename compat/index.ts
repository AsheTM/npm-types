// Checks the published types like a real install (`@ashetm/types` is linked to the package root) on old and new TypeScript.
// These are the TypeScript 3.7+ types (`dist/legacy.d.ts`). Only TypeScript 3.7 syntax here: no `import type`, no `@ts-expect-error`.
import {
  ArrayItem,
  Brand,
  DeepPartial,
  DeepMutable,
  DeepReadonly,
  DeepRequired,
  JsonValue,
  KeysOfType,
  Maybe,
  Mutable,
  NonEmptyArray,
  Nullable,
  PartialBy,
  Prettify,
  RequireAtLeastOne,
  RequiredBy,
  RequireExactlyOne,
  SplitKeys,
  UnionToIntersection,
  ValueOf,
} from '@ashetm/types';

type Equals<A, B> = (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false;
type Assignable<A, B> = [A] extends [B] ? true : false;

interface User {
  readonly id: number;
  name: string;
  nickname?: string;
}

type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

export const checks: [
  // Nullable, Maybe
  Equals<Nullable<string>, string | null>,
  Equals<Maybe<string>, string | null | undefined>,
  // NonEmptyArray, ArrayItem
  Assignable<[1], NonEmptyArray<number>>,
  Equals<Assignable<[], NonEmptyArray<number>>, false>,
  Equals<ArrayItem<readonly ['a', 'b']>, 'a' | 'b'>,
  // ValueOf, KeysOfType, Mutable
  Equals<ValueOf<{ a: 1; b: 2 }>, 1 | 2>,
  Equals<KeysOfType<User, string>, 'name' | 'nickname'>,
  Equals<Mutable<User>, { id: number; name: string; nickname?: string }>,
  Equals<Mutable<readonly [string, number]>, [string, number]>,
  // Brand
  Assignable<UserId, string>,
  Equals<Assignable<string, UserId>, false>,
  Equals<Assignable<UserId, OrderId>, false>,
  // DeepPartial
  Equals<DeepPartial<{ a: { b: number } }>, { a?: { b?: number } }>,
  Equals<DeepPartial<[string, { size: number }]>, [string, { size?: number }]>,
  Equals<DeepPartial<Map<{ id: number }, { name: string }>>, Map<{ id: number }, { name?: string }>>,
  Equals<DeepPartial<Set<{ id: number }>>, Set<{ id?: number }>>,
  Equals<DeepPartial<Date>, Date>,
  // DeepReadonly
  Equals<DeepReadonly<{ a: { b: number[] } }>, { readonly a: { readonly b: readonly number[] } }>,
  Equals<DeepReadonly<Map<string, { name: string }>>, ReadonlyMap<string, { readonly name: string }>>,
  Equals<DeepReadonly<Set<{ id: number }>>, ReadonlySet<{ readonly id: number }>>,
  Equals<DeepReadonly<() => void>, () => void>,
  // DeepRequired, DeepMutable
  Equals<DeepRequired<{ a?: { b?: number[] } }>, { a: { b: number[] } }>,
  Equals<DeepRequired<[string, number?]>, [string, number]>,
  Equals<DeepMutable<{ readonly a: readonly { readonly b: number }[] }>, { a: { b: number }[] }>,
  Equals<DeepMutable<ReadonlyMap<string, { readonly name: string }>>, Map<string, { name: string }>>,
  // Prettify, PartialBy, RequiredBy
  Equals<Prettify<{ a: 1 } & { b?: 2 }>, { a: 1; b?: 2 }>,
  Equals<PartialBy<User, 'id'>, { name: string; nickname?: string; readonly id?: number }>,
  Equals<RequiredBy<User, 'nickname'>, { readonly id: number; name: string; nickname: string }>,
  // RequireAtLeastOne, RequireExactlyOne
  Equals<RequireAtLeastOne<{ a?: 1; b?: 2 }>, { a: 1; b?: 2 } | { b: 2; a?: 1 }>,
  Equals<Assignable<{}, RequireAtLeastOne<{ a?: 1; b?: 2 }>>, false>,
  Equals<Assignable<{ a: 1; b: 2 }, RequireExactlyOne<{ a?: 1; b?: 2 }>>, false>,
  Assignable<{ a: 1 }, RequireExactlyOne<{ a?: 1; b?: 2 }>>,
  // JsonValue
  Assignable<{ a: (number | null)[]; b: { c: boolean } }, JsonValue>,
  Equals<Assignable<{ a: Date }, JsonValue>, false>,
  // UnionToIntersection, SplitKeys
  Equals<UnionToIntersection<{ a: 1 } | { b: 2 }>, { a: 1 } & { b: 2 }>,
  Equals<SplitKeys<{ a: 1; b?: 2 }>, { a: 1 } | { b?: 2 }>,
] = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
