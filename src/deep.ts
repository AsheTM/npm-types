// Types kept as they are by `DeepPartial` and `DeepReadonly`
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
