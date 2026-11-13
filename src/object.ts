/**
 * The union of the value types of an object.
 *
 * @example
 * ```ts
 * const Status = { Active: 'active', Archived: 'archived' } as const;
 *
 * type Status = ValueOf<typeof Status>; // 'active' | 'archived'
 * ```
 */
export type ValueOf<T> = T[keyof T];

/**
 * The keys of `T` whose value is assignable to `V`. `undefined` is ignored, so an optional key
 * like `nickname?: string` counts for `V = string`.
 *
 * @example
 * ```ts
 * interface User {
 *   id: number;
 *   name: string;
 *   nickname?: string;
 * }
 *
 * type TextKeys = KeysOfType<User, string>; // 'name' | 'nickname'
 * ```
 */
export type KeysOfType<T, V> = {
  [K in keyof T]-?: Exclude<T[K], undefined> extends V ? K : never;
}[keyof T];

/**
 * `T` without `readonly` on its properties (one level, arrays and tuples too).
 *
 * @example
 * ```ts
 * interface Point {
 *   readonly x: number;
 *   readonly y: number;
 * }
 *
 * const point: Mutable<Point> = { x: 0, y: 0 };
 * point.x = 1; // allowed
 * ```
 */
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};
