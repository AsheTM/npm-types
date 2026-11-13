// Types kept as they are by the deep types
type Builtin =
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
  | WeakSet<object>;

/**
 * `T` with every property optional, at every level.
 *
 * - Arrays and tuples: items are deep partial, tuples keep their length.
 * - `Map` and `Set` (readonly too): values are deep partial, `Map` keys are kept.
 * - Primitives, functions, `Date`, `RegExp`, `Error`, `Promise`, `WeakMap` and `WeakSet` are kept as they are.
 *
 * @example
 * ```ts
 * interface Settings {
 *   theme: { color: string; dark: boolean };
 *   tags: string[];
 * }
 *
 * const patch: DeepPartial<Settings> = { theme: { dark: true } };
 * ```
 */
// `Map` and `Set` are checked before `Builtin`: a `Map` or a `Set` of objects is assignable to `WeakMap` or `WeakSet`
export type DeepPartial<T> = T extends Map<infer K, infer V>
  ? Map<K, DeepPartial<V>>
  : T extends ReadonlyMap<infer K, infer V>
    ? ReadonlyMap<K, DeepPartial<V>>
    : T extends Set<infer U>
      ? Set<DeepPartial<U>>
      : T extends ReadonlySet<infer U>
        ? ReadonlySet<DeepPartial<U>>
        : T extends Builtin
          ? T
          : T extends ReadonlyArray<unknown>
            ? { [K in keyof T]: DeepPartial<T[K]> }
            : { [K in keyof T]?: DeepPartial<T[K]> };

/**
 * `T` with every property `readonly`, at every level.
 *
 * - Arrays and tuples become readonly arrays and tuples, with deep readonly items.
 * - `Map` and `Set` become `ReadonlyMap` and `ReadonlySet`, with deep readonly values (`Map` keys are kept).
 * - Primitives, functions, `Date`, `RegExp`, `Error`, `Promise`, `WeakMap` and `WeakSet` are kept as they are.
 *
 * @example
 * ```ts
 * interface Settings {
 *   theme: { color: string };
 *   tags: string[];
 * }
 *
 * const settings: DeepReadonly<Settings> = { theme: { color: 'red' }, tags: ['a'] };
 * settings.theme.color = 'blue'; // error
 * settings.tags.push('b'); // error
 * ```
 */
export type DeepReadonly<T> = T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<K, DeepReadonly<V>>
  : T extends ReadonlySet<infer U>
    ? ReadonlySet<DeepReadonly<U>>
    : T extends Builtin
      ? T
      : { readonly [K in keyof T]: DeepReadonly<T[K]> };

/**
 * `T` with every property required, at every level: `?` is removed, with the `undefined` that came
 * with it (an explicit `| undefined` is kept).
 *
 * - Arrays: items are deep required. Tuples: optional items become required.
 * - `Map` and `Set` (readonly too): values are deep required, `Map` keys are kept.
 * - Primitives, functions, `Date`, `RegExp`, `Error`, `Promise`, `WeakMap` and `WeakSet` are kept as they are.
 *
 * @example
 * ```ts
 * interface Options {
 *   retry?: { count?: number; delay?: number };
 * }
 *
 * const defaults: DeepRequired<Options> = { retry: { count: 3, delay: 100 } };
 * ```
 */
export type DeepRequired<T> = T extends Map<infer K, infer V>
  ? Map<K, DeepRequired<V>>
  : T extends ReadonlyMap<infer K, infer V>
    ? ReadonlyMap<K, DeepRequired<V>>
    : T extends Set<infer U>
      ? Set<DeepRequired<U>>
      : T extends ReadonlySet<infer U>
        ? ReadonlySet<DeepRequired<U>>
        : T extends Builtin
          ? T
          : T extends ReadonlyArray<unknown>
            ? number extends T['length']
              ? { [K in keyof T]: DeepRequired<T[K]> } // `-?` on an array would also remove `undefined` from its items
              : { [K in keyof T]-?: DeepRequired<T[K]> }
            : { [K in keyof T]-?: DeepRequired<T[K]> };

/**
 * `T` without `readonly`, at every level.
 *
 * - Readonly arrays and tuples become mutable, with deep mutable items.
 * - `ReadonlyMap` and `ReadonlySet` become `Map` and `Set`, with deep mutable values (`Map` keys are kept).
 * - Primitives, functions, `Date`, `RegExp`, `Error`, `Promise`, `WeakMap` and `WeakSet` are kept as they are.
 *
 * @example
 * ```ts
 * const defaults = { theme: { color: 'red' }, tags: ['a'] } as const;
 *
 * const settings: DeepMutable<typeof defaults> = { theme: { color: 'red' }, tags: ['a'] };
 * settings.theme.color = 'red'; // allowed
 * settings.tags.push('a'); // allowed
 * ```
 */
export type DeepMutable<T> = T extends ReadonlyMap<infer K, infer V>
  ? Map<K, DeepMutable<V>>
  : T extends ReadonlySet<infer U>
    ? Set<DeepMutable<U>>
    : T extends Builtin
      ? T
      : { -readonly [K in keyof T]: DeepMutable<T[K]> };
