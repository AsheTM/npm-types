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

/**
 * `T` where at least one of the keys `K` (all keys by default) must be set.
 * The other keys of `K` stay optional; keys outside `K` are kept as they are.
 *
 * @example
 * ```ts
 * interface Contact {
 *   name: string;
 *   email?: string;
 *   phone?: string;
 * }
 *
 * type ReachableContact = RequireAtLeastOne<Contact, 'email' | 'phone'>;
 *
 * const a: ReachableContact = { name: 'A', email: 'a@b.c' };
 * const b: ReachableContact = { name: 'B', email: 'b@c.d', phone: '01' };
 * const c: ReachableContact = { name: 'C' }; // error
 * ```
 */
export type RequireAtLeastOne<T, K extends keyof T = keyof T> = {
  [P in K]-?: Prettify<Omit<T, K> & Required<Pick<T, P>> & Partial<Pick<T, Exclude<K, P>>>>;
}[K];

/**
 * `T` where exactly one of the keys `K` (all keys by default) must be set; the other keys of `K`
 * are not allowed. Keys outside `K` are kept as they are.
 *
 * @example
 * ```ts
 * interface Payment {
 *   amount: number;
 *   card?: string;
 *   iban?: string;
 * }
 *
 * type SinglePayment = RequireExactlyOne<Payment, 'card' | 'iban'>;
 *
 * const a: SinglePayment = { amount: 1, card: '4242' };
 * const b: SinglePayment = { amount: 1, card: '4242', iban: 'FR76' }; // error
 * const c: SinglePayment = { amount: 1 }; // error
 * ```
 */
export type RequireExactlyOne<T, K extends keyof T = keyof T> = {
  [P in K]-?: Prettify<Omit<T, K> & Required<Pick<T, P>> & { [Q in Exclude<K, P>]?: never }>;
}[K];

/**
 * A union with one object type per key of `T`. `readonly` and `?` are kept.
 *
 * TypeScript can't split an intersection back into its members, so
 * `SplitKeys<A & B>` gives `A | B` only when `A` and `B` have one key each.
 *
 * @example
 * ```ts
 * type Change = SplitKeys<{ name: string; age?: number }>; // { name: string } | { age?: number }
 * ```
 */
export type SplitKeys<T> = {
  [K in keyof T]-?: Prettify<Pick<T, K>>;
}[keyof T];

/**
 * `A` with the properties of `B` on top: `B` wins on shared keys.
 *
 * @example
 * ```ts
 * type Row = Merge<{ id: number; name: string }, { id: string }>; // { name: string; id: string }
 * ```
 */
export type Merge<A, B> = Prettify<Omit<A, keyof B> & B>;

/**
 * `Omit` that only accepts keys of `T`, so a typo or a renamed key is an error.
 *
 * @example
 * ```ts
 * interface User {
 *   id: number;
 *   name: string;
 * }
 *
 * type Draft = StrictOmit<User, 'id'>; // { name: string }
 * type Typo = StrictOmit<User, 'idd'>; // error
 * ```
 */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

/**
 * The keys of `T` marked `?`.
 *
 * @example
 * ```ts
 * type Keys = OptionalKeys<{ id: number; name?: string }>; // 'name'
 * ```
 */
export type OptionalKeys<T> = {
  [K in keyof T]-?: Record<never, never> extends Pick<T, K> ? K : never;
}[keyof T];

/**
 * The keys of `T` not marked `?` (a value that can be `undefined` is still required).
 *
 * @example
 * ```ts
 * type Keys = RequiredKeys<{ id: number; name?: string }>; // 'id'
 * ```
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: Record<never, never> extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * The `[key, value]` pairs of the object `T`, to type `Object.entries`. String keys only,
 * like `Object.entries`.
 *
 * @example
 * ```ts
 * interface User {
 *   id: number;
 *   name: string;
 * }
 *
 * declare const user: User;
 * const entries = Object.entries(user) as Entries<User>; // (['id', number] | ['name', string])[]
 * ```
 */
export type Entries<T> = Array<
  {
    [K in keyof T]-?: K extends string ? [K, T[K]] : never;
  }[keyof T]
>;
