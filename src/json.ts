/** A JSON primitive: `string`, `number`, `boolean` or `null`. */
export type JsonPrimitive = string | number | boolean | null;

/**
 * Any JSON value: what `JSON.parse` can return.
 *
 * @example
 * ```ts
 * const payload: JsonValue = { id: 1, tags: ['a'], meta: null };
 * const invalid: JsonValue = { at: new Date() }; // error
 * ```
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * A JSON object.
 *
 * An `interface` has no index signature, so a value typed with one is not assignable to `JsonObject`:
 * use a `type` instead. Optional properties are not allowed (`undefined` is not JSON).
 */
export type JsonObject = { [key: string]: JsonValue };

/** A JSON array. */
export type JsonArray = JsonValue[];
