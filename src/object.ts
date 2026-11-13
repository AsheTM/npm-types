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

/**
 * `T` with its intersections flattened into one object type, so hovers are readable.
 * `readonly` and `?` are kept.
 *
 * @example
 * ```ts
 * type User = Prettify<{ id: number } & { name?: string }>; // { id: number; name?: string }
 * ```
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
};

/**
 * `T` with only the keys `K` optional.
 *
 * @example
 * ```ts
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * type NewUser = PartialBy<User, 'id'>; // { name: string; email: string; id?: number }
 * ```
 */
export type PartialBy<T, K extends keyof T> = Prettify<Omit<T, K> & Partial<Pick<T, K>>>;

/**
 * `T` with only the keys `K` required.
 *
 * @example
 * ```ts
 * interface Options {
 *   url?: string;
 *   timeout?: number;
 * }
 *
 * type UrlOptions = RequiredBy<Options, 'url'>; // { timeout?: number; url: string }
 * ```
 */
export type RequiredBy<T, K extends keyof T> = Prettify<Omit<T, K> & Required<Pick<T, K>>>;
