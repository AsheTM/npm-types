import type { Brand } from './index.ts';
import { accept, assertTrue, type Equals } from './testing/assert.ts';

type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

// Brand: a branded value should still be a `T`
{
  // GIVEN
  const userId = 'u-1' as UserId;

  // WHEN / THEN
  accept<string>(userId);
  accept<UserId>(userId);
}

// Brand: a plain `T` should need a cast
{
  // GIVEN
  const text = 'u-1';

  // WHEN / THEN
  // @ts-expect-error: a plain string has no brand
  accept<UserId>(text);
}

// Brand: two brands on the same type should not be mixed up
{
  // GIVEN
  const userId = 'u-1' as UserId;

  // WHEN / THEN
  // @ts-expect-error: a `UserId` is not an `OrderId`
  accept<OrderId>(userId);
  assertTrue<Equals<Equals<UserId, OrderId>, false>>();
}

// Brand: should keep the methods of `T`
{
  // GIVEN
  const userId = 'u-1' as UserId;

  // WHEN
  const upper: string = userId.toUpperCase();

  // THEN
  accept<string>(upper);
}

// Brand: should work on objects
{
  // GIVEN
  type Email = Brand<{ value: string }, 'Email'>;

  // WHEN / THEN
  accept<{ value: string }>({ value: 'a@b.c' } as Email);
  // @ts-expect-error: a plain object has no brand
  accept<Email>({ value: 'a@b.c' });
}
