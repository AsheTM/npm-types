// TypeScript 4.1+ only (recursive conditional types): not exported from `legacy.ts`.

// Adds one `T` until the length is `N`
type BuildTuple<T, N extends number, Result extends unknown[] = []> = Result['length'] extends N
  ? Result
  : BuildTuple<T, N, [T, ...Result]>;

/**
 * A tuple of `N` items of type `T`. `number` gives `T[]`; a negative or decimal `N` gives `never`;
 * a union of lengths gives a union of tuples.
 *
 * Needs TypeScript 4.1+ (`N` up to 42 on TypeScript 4.1–4.4, 998 on TypeScript 4.5+).
 *
 * @example
 * ```ts
 * type Rgb = Tuple<number, 3>; // [number, number, number]
 * type Pair = Tuple<string, 2>; // [string, string]
 * ```
 */
export type Tuple<T, N extends number> = number extends N
  ? T[]
  : N extends unknown
    ? `${N}` extends `-${string}` | `${string}.${string}`
      ? never
      : BuildTuple<T, N>
    : never;
