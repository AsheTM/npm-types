import type { LiteralUnion, UnionToIntersection } from './index.ts';
import { accept, assertTrue, type Equals } from './testing/assert.ts';

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

// LiteralUnion: should accept the literals and any other value of the base type
{
  // GIVEN
  type Size = LiteralUnion<'sm' | 'md'>;

  // WHEN / THEN
  accept<Size>('sm');
  accept<Size>('xl');
  // @ts-expect-error: not a string
  accept<Size>(1);
  assertTrue<Equals<Size, 'sm' | 'md' | (string & Record<never, never>)>>();
}

// LiteralUnion: should work with another base type
{
  // GIVEN
  type Port = LiteralUnion<80 | 443, number>;

  // WHEN / THEN
  accept<Port>(80);
  accept<Port>(8080);
  // @ts-expect-error: not a number
  accept<Port>('80');
  // @ts-expect-error: the literals must belong to the base type
  type Wrong = LiteralUnion<'a', number>;
}
