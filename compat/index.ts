// Checks the built `dist/*.d.ts` with old TypeScript versions (down to 3.7, the `peerDependencies` floor).
// Only TypeScript 3.7 syntax here: no `import type`, no `@ts-expect-error` (3.8 / 3.9).
import {
  ArrayItem,
  Brand,
  DeepPartial,
  DeepReadonly,
  KeysOfType,
  Maybe,
  Mutable,
  NonEmptyArray,
  Nullable,
  ValueOf,
} from '../dist/index.js';

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
] = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
