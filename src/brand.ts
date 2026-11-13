declare const brand: unique symbol;

/**
 * `T` tagged with a `Name`, so two types with the same shape can't be mixed up.
 * A branded value is still a `T`; a plain `T` must be cast to get the brand.
 *
 * @example
 * ```ts
 * type UserId = Brand<string, 'UserId'>;
 * type OrderId = Brand<string, 'OrderId'>;
 *
 * const userId = 'u-1' as UserId;
 * const text: string = userId; // allowed
 * const orderId: OrderId = userId; // error
 * const other: UserId = 'u-2'; // error
 * ```
 */
export type Brand<T, Name extends string> = T & { readonly [brand]: Name };
