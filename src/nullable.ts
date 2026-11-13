/**
 * `T` or `null`.
 *
 * @example
 * ```ts
 * let user: Nullable<User> = null;
 * ```
 */
export type Nullable<T> = T | null;

/**
 * `T`, `null` or `undefined`.
 *
 * @example
 * ```ts
 * function greet(name: Maybe<string>): string {
 *   return `Hello ${name ?? 'stranger'}`;
 * }
 * ```
 */
export type Maybe<T> = T | null | undefined;
