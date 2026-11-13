# @ashetm/types

[![npm version](https://img.shields.io/npm/v/@ashetm/types)](https://www.npmjs.com/package/@ashetm/types)
[![npm downloads](https://img.shields.io/npm/dm/@ashetm/types)](https://www.npmjs.com/package/@ashetm/types)
[![CI](https://github.com/AsheTM/npm-types/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/AsheTM/npm-types/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-%3E%3D3.7-3178c6?logo=typescript&logoColor=white)](#typescript-support)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![license](https://img.shields.io/npm/l/@ashetm/types)](LICENSE)

``@ashetm/types`` is a small, dependency-free library of TypeScript utility types: nullability, arrays and tuples, objects, unions, deep partial / readonly, JSON, dot paths, string cases and branded types.

It is **types only**: it adds nothing to your bundle. It works with any project (Angular, React, Node, ...) on **TypeScript 3.7 or later**.

## TypeScript support

| TypeScript | Angular     | Types                                                                                     |
|------------|-------------|-------------------------------------------------------------------------------------------|
| 3.7 – 4.0  | 9 – 11.0    | all except `Tuple`, [Paths](#paths) and [String cases](#string-cases)                     |
| 4.1 – 4.4  | 11.1 – 13.0 | all; string cases up to about 40 characters, `Paths` of self-referencing types up to 9 segments, `Tuple` up to 42 items |
| 4.5+       | 13.1+       | all                                                                                       |

Your TypeScript version picks the right types by itself (`typesVersions`): nothing to configure.

## Install

You can install it with npm:

```bash
npm install @ashetm/types
```

## API

```ts
import type { DeepPartial, NonEmptyArray, Nullable, Prettify /* , ... */ } from '@ashetm/types';
```

On TypeScript 3.7, use `import { ... }` (`import type` needs TypeScript 3.8).

### Nullability

| Type          | Is                         |
|---------------|----------------------------|
| `Nullable<T>` | `T \| null`                |
| `Maybe<T>`    | `T \| null \| undefined`   |

### Arrays

| Type               | Is                                                                      |
|--------------------|-------------------------------------------------------------------------|
| `NonEmptyArray<T>` | an array with at least one item: `[T, ...T[]]`.                         |
| `ArrayItem<T>`     | the item type of an array or a tuple (readonly too).                    |
| `Tuple<T, N>`      | a tuple of `N` items of type `T` (TypeScript 4.1+, up to 998 items).    |

```ts
const ids: NonEmptyArray<number> = [1, 2];
const none: NonEmptyArray<number> = []; // error

type Role = ArrayItem<readonly ['admin', 'user']>; // 'admin' | 'user'
type Rgb = Tuple<number, 3>; // [number, number, number]
```

### Objects

| Type               | Is                                                                                       |
|--------------------|------------------------------------------------------------------------------------------|
| `ValueOf<T>`       | the union of the value types of `T`.                                                     |
| `KeysOfType<T, V>` | the keys of `T` whose value is assignable to `V` (`undefined` is ignored).               |
| `Mutable<T>`       | `T` without `readonly` on its properties (one level, arrays and tuples too).             |
| `Prettify<T>`      | `T` with its intersections flattened, so hovers are readable (`readonly` and `?` kept).  |
| `PartialBy<T, K>`  | `T` with only the keys `K` optional.                                                     |
| `RequiredBy<T, K>` | `T` with only the keys `K` required.                                                     |
| `RequireAtLeastOne<T, K>` | at least one of the keys `K` (all keys by default) must be set.                   |
| `RequireExactlyOne<T, K>` | exactly one of the keys `K` (all keys by default) must be set, the others are not allowed. |
| `SplitKeys<T>`     | a union with one object type per key of `T` (`readonly` and `?` kept).                   |
| `Merge<A, B>`      | `A` with the properties of `B` on top: `B` wins on shared keys.                          |
| `StrictOmit<T, K>` | `Omit` that only accepts keys of `T`, so a typo is an error.                             |
| `OptionalKeys<T>`  | the keys of `T` marked `?`.                                                              |
| `RequiredKeys<T>`  | the keys of `T` not marked `?`.                                                          |
| `Entries<T>`       | the `[key, value]` pairs of `T` (string keys), to type `Object.entries`.                 |

```ts
const Status = { Active: 'active', Archived: 'archived' } as const;
type Status = ValueOf<typeof Status>; // 'active' | 'archived'

interface User {
  id: number;
  name: string;
  nickname?: string;
}
type TextKeys = KeysOfType<User, string>; // 'name' | 'nickname'
type NewUser = PartialBy<User, 'id'>; // { name: string; nickname?: string; id?: number }

interface Contact {
  name: string;
  email?: string;
  phone?: string;
}
type Reachable = RequireAtLeastOne<Contact, 'email' | 'phone'>;
const contact: Reachable = { name: 'A' }; // error: email or phone is needed

type Change = SplitKeys<{ name: string; age?: number }>; // { name: string } | { age?: number }

type Row = Merge<User, { id: string }>; // { name: string; nickname?: string; id: string }
type Draft = StrictOmit<User, 'idd'>; // error: 'idd' is not a key of User
type Optional = OptionalKeys<User>; // 'nickname'

declare const user: User;
const entries = Object.entries(user) as Entries<User>; // (['id', number] | ['name', string] | ['nickname', string | undefined])[]
```

TypeScript can't split an intersection back into its members, so there is no `IntersectionToUnion`: `SplitKeys<A & B>` gives `A | B` only when `A` and `B` have one key each.

### Unions

| Type                     | Is                                              |
|--------------------------|-------------------------------------------------|
| `UnionToIntersection<U>` | the intersection of all the members of `U`.     |
| `LiteralUnion<T, Base>`  | `T` or any other `Base` (`string` by default), keeping autocomplete for `T`. |

```ts
type Both = UnionToIntersection<{ id: number } | { name: string }>; // { id: number } & { name: string }

type Size = LiteralUnion<'sm' | 'md' | 'lg'>;
const size: Size = 'xl'; // allowed, and the editor still suggests 'sm', 'md' and 'lg'
```

### Deep types

| Type              | Is                                                     |
|-------------------|--------------------------------------------------------|
| `DeepPartial<T>`  | `T` with every property optional, at every level.      |
| `DeepReadonly<T>` | `T` with every property `readonly`, at every level.    |
| `DeepRequired<T>` | `T` with every property required, at every level.      |
| `DeepMutable<T>`  | `T` without `readonly`, at every level.                |

All of them:

- go into arrays and tuples (tuples keep their length; `DeepReadonly` / `DeepMutable` make them readonly / mutable; `DeepRequired` makes optional tuple items required),
- go into `Map` and `Set` values (`Map` keys are kept; `DeepReadonly` gives `ReadonlyMap` / `ReadonlySet`, `DeepMutable` gives `Map` / `Set`),
- keep primitives, functions, `Date`, `RegExp`, `Error`, `Promise`, `WeakMap` and `WeakSet` as they are.

```ts
interface Settings {
  theme: { color: string; dark: boolean };
  tags: string[];
}

const patch: DeepPartial<Settings> = { theme: { dark: true } };

const settings: DeepReadonly<Settings> = { theme: { color: 'red', dark: false }, tags: [] };
settings.theme.color = 'blue'; // error
settings.tags.push('a'); // error
```

`DeepRequired` removes `?` with the `undefined` that came with it; an explicit `| undefined` is kept.

### JSON

| Type            | Is                                                   |
|-----------------|------------------------------------------------------|
| `JsonPrimitive` | `string \| number \| boolean \| null`               |
| `JsonValue`     | any JSON value: what `JSON.parse` can return.        |
| `JsonObject`    | `{ [key: string]: JsonValue }`                       |
| `JsonArray`     | `JsonValue[]`                                        |

```ts
const payload: JsonValue = { id: 1, tags: ['a'], meta: null };
const invalid: JsonValue = { at: new Date() }; // error
```

An `interface` has no index signature, so a value typed with one is not assignable to `JsonObject`: use a `type` instead.

### Paths

Needs TypeScript 4.1+.

| Type              | Is                                                                                         |
|-------------------|--------------------------------------------------------------------------------------------|
| `Paths<T>`        | every dot path of `T` (string keys; arrays and tuples use `${number}`).                    |
| `PathValue<T, P>` | the type at the dot path `P`: with `undefined` when a step is optional, `never` when the path does not exist. |

```ts
interface Settings {
  theme: { color: string };
  owner?: { name: string };
  tags: string[];
}

type Path = Paths<Settings>; // 'theme' | 'theme.color' | 'owner' | 'owner.name' | 'tags' | `tags.${number}`
type Owner = PathValue<Settings, 'owner.name'>; // string | undefined

declare const settings: Settings;
declare function get<T, P extends Paths<T>>(value: T, path: P): PathValue<T, P>;
get(settings, 'theme.color'); // string
get(settings, 'theme.size'); // error
```

Optional values are followed; `Date`, functions, `Map`, `Set` and other built-ins are not. Self-referencing types (`children: Tree[]`) stop at 9 segments.

### String cases

Needs TypeScript 4.1+.

| Type           | Is                                                                                       |
|----------------|------------------------------------------------------------------------------------------|
| `CamelCase<S>` | `S` in camelCase: words split on `_`, `-` and spaces; all-uppercase words lowercased first. |
| `KebabCase<S>` | `S` in kebab-case: words split on `_`, `-`, spaces and lowercase → uppercase changes.    |
| `SnakeCase<S>` | `S` in snake_case: same words as `KebabCase`.                                            |

```ts
type A = CamelCase<'user_id'>; // 'userId'
type B = CamelCase<'USER_ID'>; // 'userId'
type C = KebabCase<'userID'>; // 'user-id'
type D = SnakeCase<'user-name id'>; // 'user_name_id'
```

`string` stays `string`, and a union is converted member by member.

### Branded types

`Brand<T, Name>` tags `T` with a name, so two types with the same shape can't be mixed up. A branded value is still a `T`; a plain `T` must be cast to get the brand.

```ts
type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

const userId = 'u-1' as UserId;
const text: string = userId; // allowed
const orderId: OrderId = userId; // error
```

## Development

Node 24 (see `.nvmrc`).

```bash
npm install
npm run typecheck
npm test
npm run build
npm run test:compat
```

- `npm test` type-checks the type tests (`src/*.spec-d.ts`): what must compile, and `// @ts-expect-error` for what must not. Nothing runs.
- `npm run test:compat` builds, then checks the package like a real install (`compat/`, linked as `@ashetm/types`) with TypeScript 3.7, 4.0, 4.1, 4.4, 5.0, 6 and the latest (downloaded with `npx`).
- `src/legacy.ts` holds the TypeScript 3.7 types: TypeScript < 4.1 reads only this file. Types that need TypeScript 4.1+ are exported from `src/index.ts` only.

## License

[MIT](LICENSE) © DAWOUD Haitham
