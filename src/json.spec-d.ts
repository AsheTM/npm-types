import type { JsonArray, JsonObject, JsonPrimitive, JsonValue } from './index.ts';
import { accept } from './testing/assert.ts';

// JsonPrimitive: should accept only JSON primitives
{
  // GIVEN / WHEN / THEN
  accept<JsonPrimitive>('a');
  accept<JsonPrimitive>(1);
  accept<JsonPrimitive>(true);
  accept<JsonPrimitive>(null);
  // @ts-expect-error: `undefined` is not JSON
  accept<JsonPrimitive>(undefined);
}

// JsonValue: should accept nested objects and arrays
{
  // GIVEN
  const payload = { id: 1, tags: ['a', 'b'], meta: { deleted: false, parent: null }, matrix: [[1], [2]] };

  // WHEN / THEN
  accept<JsonValue>(payload);
  accept<JsonObject>(payload);
  accept<JsonArray>([payload, 1, 'a', null]);
}

// JsonValue: should refuse values that are not JSON
{
  // GIVEN / WHEN / THEN
  // @ts-expect-error: a `Date` is not JSON
  accept<JsonValue>({ at: new Date() });
  // @ts-expect-error: a function is not JSON
  accept<JsonValue>({ run: () => 1 });
  // @ts-expect-error: `undefined` is not JSON
  accept<JsonValue>({ value: undefined });
  // @ts-expect-error: a `bigint` is not JSON
  accept<JsonValue>(1n);
}

// JsonObject: should accept a `type` but not an `interface` (no index signature)
{
  // GIVEN
  type UserType = { id: number };
  interface UserInterface {
    id: number;
  }

  // WHEN / THEN
  accept<JsonObject>({ id: 1 } as UserType);
  // @ts-expect-error: an interface has no index signature
  accept<JsonObject>({ id: 1 } as UserInterface);
}
