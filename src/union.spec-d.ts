import type { UnionToIntersection } from './index.ts';
import { assertTrue, type Equals } from './testing/assert.ts';

// UnionToIntersection: should turn a union into an intersection
{
  // GIVEN
  type Union = { id: number } | { name: string };

  // WHEN
  type Intersection = UnionToIntersection<Union>;

  // THEN
  assertTrue<Equals<Intersection, { id: number } & { name: string }>>();
}

// UnionToIntersection: should give `never` for primitives that can't be both
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<UnionToIntersection<string | number>, never>>();
  assertTrue<Equals<UnionToIntersection<string>, string>>();
}

// UnionToIntersection: should merge function types into overloads
{
  // GIVEN
  type Handlers = ((value: string) => void) | ((value: number) => void);

  // WHEN
  type Overloads = UnionToIntersection<Handlers>;

  // THEN
  assertTrue<Equals<Overloads, ((value: string) => void) & ((value: number) => void)>>();
}
