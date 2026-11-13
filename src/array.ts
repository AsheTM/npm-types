/**
 * An array with at least one item.
 *
 * @example
 * ```ts
 * const ids: NonEmptyArray<number> = [1, 2, 3];
 * const first: number = ids[0]; // `number`, not `number | undefined` with `noUncheckedIndexedAccess`
 *
 * const none: NonEmptyArray<number> = []; // error
 * ```
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * The item type of an array or a tuple (readonly too).
 *
 * @example
 * ```ts
 * type Id = ArrayItem<number[]>; // number
 * type Role = ArrayItem<readonly ['admin', 'user']>; // 'admin' | 'user'
 * ```
 */
export type ArrayItem<T extends ReadonlyArray<unknown>> = T[number];
