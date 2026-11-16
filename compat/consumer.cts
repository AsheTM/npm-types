// A CommonJS consumer (`module: node16`): resolves the `require` condition (`dist/index.d.cts`).
import type { DeepPartial, LiteralUnion, Nullable, Paths, Tuple } from '@ashetm/types';

type Equals<A, B> = (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false;

export type Size = LiteralUnion<'sm' | 'md' | 'lg'>;

export const checks: [
  Equals<Nullable<string>, string | null>,
  Equals<DeepPartial<{ a: { b: number } }>, { a?: { b?: number } }>,
  Equals<Paths<{ a: { b: number } }>, 'a' | 'a.b'>,
  Equals<Tuple<number, 2>, [number, number]>,
] = [true, true, true, true];
