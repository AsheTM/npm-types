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
