import type { ArrayItem, NonEmptyArray } from './index.ts';
import { accept, assertTrue, type Equals } from './testing/assert.ts';

// NonEmptyArray: should accept one item or more
{
  // GIVEN
  type Ids = NonEmptyArray<number>;

  // WHEN / THEN
  accept<Ids>([1]);
  accept<Ids>([1, 2, 3]);
  // @ts-expect-error: an empty array is not allowed
  accept<Ids>([]);
  // @ts-expect-error: a plain array may be empty, so it is not allowed
  accept<Ids>([1] as number[]);
}

// NonEmptyArray: the first item should always exist
{
  // GIVEN
  type Ids = NonEmptyArray<number>;

  // WHEN
  type First = Ids[0];

  // THEN
  assertTrue<Equals<First, number>>();
}

// ArrayItem: should give the item type of arrays, readonly arrays and tuples
{
  // GIVEN
  type Tags = string[];
  type Ids = readonly number[];
  type Roles = readonly ['admin', 'user'];

  // WHEN / THEN
  assertTrue<Equals<ArrayItem<Tags>, string>>();
  assertTrue<Equals<ArrayItem<Ids>, number>>();
  assertTrue<Equals<ArrayItem<Roles>, 'admin' | 'user'>>();
  assertTrue<Equals<ArrayItem<NonEmptyArray<boolean>>, boolean>>();
}

// ArrayItem: should only accept arrays
{
  // GIVEN
  type Text = string;

  // WHEN / THEN
  // @ts-expect-error: `string` is not an array
  accept<ArrayItem<Text>>('a');
}
