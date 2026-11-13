import type { CamelCase, KebabCase, SnakeCase } from './index.ts';
import { assertTrue, type Equals } from './testing/assert.ts';

// KebabCase: should split on delimiters and lowercase → uppercase changes
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<KebabCase<'userId'>, 'user-id'>>();
  assertTrue<Equals<KebabCase<'UserId'>, 'user-id'>>();
  assertTrue<Equals<KebabCase<'user_id'>, 'user-id'>>();
  assertTrue<Equals<KebabCase<'user id'>, 'user-id'>>();
  assertTrue<Equals<KebabCase<'user-id'>, 'user-id'>>();
  assertTrue<Equals<KebabCase<'USER_ID'>, 'user-id'>>();
}

// KebabCase: should keep acronyms and digits in one word, and merge repeated delimiters
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<KebabCase<'userID'>, 'user-id'>>();
  assertTrue<Equals<KebabCase<'v2Api'>, 'v2-api'>>();
  assertTrue<Equals<KebabCase<'user__name'>, 'user-name'>>();
  assertTrue<Equals<KebabCase<'_user'>, 'user'>>();
  assertTrue<Equals<KebabCase<''>, ''>>();
}

// KebabCase: should keep `string` and apply to each member of a union
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<KebabCase<string>, string>>();
  assertTrue<Equals<KebabCase<'userId' | 'orderId'>, 'user-id' | 'order-id'>>();
}

// SnakeCase: should use `_` between words
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<SnakeCase<'userId'>, 'user_id'>>();
  assertTrue<Equals<SnakeCase<'user-name id'>, 'user_name_id'>>();
  assertTrue<Equals<SnakeCase<'USER_ID'>, 'user_id'>>();
  assertTrue<Equals<SnakeCase<string>, string>>();
}

// CamelCase: should join words, with an uppercase first letter from the second word
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<CamelCase<'user_id'>, 'userId'>>();
  assertTrue<Equals<CamelCase<'user-name id'>, 'userNameId'>>();
  assertTrue<Equals<CamelCase<'USER_ID'>, 'userId'>>();
  assertTrue<Equals<CamelCase<'UserId'>, 'userId'>>();
  assertTrue<Equals<CamelCase<'userId'>, 'userId'>>();
  assertTrue<Equals<CamelCase<'v2_api'>, 'v2Api'>>();
}

// CamelCase: should keep `string` and apply to each member of a union
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<CamelCase<string>, string>>();
  assertTrue<Equals<CamelCase<'user_id' | 'order_id'>, 'userId' | 'orderId'>>();
}
