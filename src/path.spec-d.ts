import type { Paths, PathValue } from './index.ts';
import { accept, assertTrue, type Equals } from './testing/assert.ts';

interface Settings {
  theme: { color: string; dark?: boolean };
  owner?: { name: string };
  tags: string[];
  pair: [string, { size: number }];
  createdAt: Date;
  users: Map<string, { name: string }>;
  load: () => void;
}

// Paths: should give every dot path
{
  // GIVEN / WHEN
  type Path = Paths<Settings>;

  // THEN
  assertTrue<
    Equals<
      Path,
      | 'theme'
      | 'theme.color'
      | 'theme.dark'
      | 'owner'
      | 'owner.name'
      | 'tags'
      | `tags.${number}`
      | 'pair'
      | `pair.${number}`
      | `pair.${number}.size`
      | 'createdAt'
      | 'users'
      | 'load'
    >
  >();
  accept<Path>('tags.3');
  // @ts-expect-error: unknown path
  accept<Path>('theme.size');
  // @ts-expect-error: `Date` is not followed
  accept<Path>('createdAt.getTime');
}

// Paths: should stop on self-referencing types
{
  // GIVEN
  interface Tree {
    value: number;
    children: Tree[];
  }

  // WHEN
  type Path = Paths<Tree>;

  // THEN
  accept<Path>('children.0.children.1.value');
  accept<Path>('children.0.children.0.children.0.children.0.value');
  // @ts-expect-error: more than 9 segments
  accept<Path>('children.0.children.0.children.0.children.0.children.0');
}

// Paths: should give `never` for values without keys
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<Paths<string>, never>>();
  assertTrue<Equals<Paths<{}>, never>>();
}

// PathValue: should give the type at a path
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<PathValue<Settings, 'theme'>, { color: string; dark?: boolean }>>();
  assertTrue<Equals<PathValue<Settings, 'theme.color'>, string>>();
  assertTrue<Equals<PathValue<Settings, 'tags.0'>, string>>();
  assertTrue<Equals<PathValue<Settings, 'pair.1.size'>, number>>();
  assertTrue<Equals<PathValue<Settings, 'createdAt'>, Date>>();
}

// PathValue: should add `undefined` when a step is optional
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<PathValue<Settings, 'owner.name'>, string | undefined>>();
  assertTrue<Equals<PathValue<Settings, 'theme.dark'>, boolean | undefined>>();
}

// PathValue: should give `never` for an unknown path
{
  // GIVEN / WHEN / THEN
  assertTrue<Equals<PathValue<Settings, 'theme.size'>, never>>();
  assertTrue<Equals<PathValue<Settings, 'tags.first'>, never>>();
}

// PathValue: should work with Paths in a function signature
{
  // GIVEN
  const settings = {} as Settings;
  const get = <T, P extends Paths<T>>(_value: T, _path: P): PathValue<T, P> => ({}) as PathValue<T, P>;

  // WHEN
  const color = get(settings, 'theme.color');

  // THEN
  accept<string>(color);
  // @ts-expect-error: unknown path
  get(settings, 'theme.size');
}
