/**
 * The intersection of all the members of the union `U`.
 *
 * @example
 * ```ts
 * type Both = UnionToIntersection<{ id: number } | { name: string }>; // { id: number } & { name: string }
 * ```
 */
export type UnionToIntersection<U> = (U extends unknown ? (value: U) => void : never) extends (value: infer I) => void
  ? I
  : never;

/**
 * `T` or any other `Base` (`string` by default), keeping editor autocomplete for the members of `T`.
 * A plain `'sm' | 'md' | string` collapses to `string` and loses the suggestions.
 *
 * @example
 * ```ts
 * type Size = LiteralUnion<'sm' | 'md' | 'lg'>;
 *
 * const a: Size = 'md'; // suggested
 * const b: Size = 'xl'; // allowed
 * const c: Size = 1; // error
 * ```
 */
export type LiteralUnion<T extends Base, Base = string> = T | (Base & Record<never, never>);
