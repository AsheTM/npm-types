// TypeScript 4.1+ only (template literal types): not exported from `legacy.ts`

// Values `Paths` does not go into
type Leaf =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | Function
  | Date
  | RegExp
  | Error
  | Promise<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | ReadonlyMap<unknown, unknown>
  | ReadonlySet<unknown>;

// `Depth[D]` is `D - 1`: stops self-referencing types (`children: Tree[]`) after 9 segments, the most TypeScript 4.1–4.4 can do.
type Depth = [never, 0, 1, 2, 3, 4, 5, 6, 7];

type PathsAt<T, D extends number> = [D] extends [never]
  ? never
  : T extends Leaf
    ? never
    : T extends ReadonlyArray<infer U>
      ? `${number}` | `${number}.${PathsAt<NonNullable<U>, Depth[D]>}`
      : { [K in keyof T & string]-?: K | `${K}.${PathsAt<NonNullable<T[K]>, Depth[D]>}` }[keyof T & string];

/**
 * Every dot path of `T`: its keys, then the keys of its values, and so on.
 *
 * - String keys only. Arrays and tuples use `${number}`.
 * - Optional values are followed. `Date`, functions, `Map`, `Set` and other built-ins are not.
 * - At most 9 segments (`a.0.b` has 3), only reached by self-referencing types.
 *
 * Needs TypeScript 4.1+.
 *
 * @example
 * ```ts
 * interface Settings {
 *   theme: { color: string };
 *   tags: string[];
 * }
 *
 * type Path = Paths<Settings>; // 'theme' | 'theme.color' | 'tags' | `tags.${number}`
 * ```
 */
export type Paths<T> = PathsAt<T, 8>;

type Get<T, K extends string> = T extends null | undefined
  ? undefined
  : K extends keyof T
    ? T[K]
    : T extends ReadonlyArray<infer U>
      ? K extends `${number}`
        ? U
        : never
      : never;

/**
 * The type at the dot path `P` of `T`. It includes `undefined` when a step of the path is optional,
 * and is `never` when the path does not exist.
 *
 * Needs TypeScript 4.1+.
 *
 * @example
 * ```ts
 * interface Settings {
 *   theme: { color: string };
 *   owner?: { name: string };
 *   tags: string[];
 * }
 *
 * type Color = PathValue<Settings, 'theme.color'>; // string
 * type Owner = PathValue<Settings, 'owner.name'>; // string | undefined
 * type Tag = PathValue<Settings, 'tags.0'>; // string
 *
 * function get<T, P extends Paths<T>>(value: T, path: P): PathValue<T, P> { ... }
 * ```
 */
export type PathValue<T, P extends string> = P extends `${infer Head}.${infer Rest}`
  ? PathValue<Get<T, Head>, Rest>
  : Get<T, P>;
