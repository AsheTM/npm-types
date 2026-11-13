# @ashetm/types

``@ashetm/types`` is a small, dependency-free library of TypeScript utility types: nullability, arrays, objects, deep partial / readonly and branded types.

It is **types only**: it adds nothing to your bundle. It works with any project (Angular, React, Node, ...) on **TypeScript 3.7 or later**.

## Install

You can install it with npm:

```bash
npm install @ashetm/types
```

## API

```ts
import type { ArrayItem, Brand, DeepPartial, DeepReadonly, KeysOfType, Maybe, Mutable, NonEmptyArray, Nullable, ValueOf } from '@ashetm/types';
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

```ts
const ids: NonEmptyArray<number> = [1, 2];
const none: NonEmptyArray<number> = []; // error

type Role = ArrayItem<readonly ['admin', 'user']>; // 'admin' | 'user'
```

### Objects

| Type               | Is                                                                                       |
|--------------------|------------------------------------------------------------------------------------------|
| `ValueOf<T>`       | the union of the value types of `T`.                                                     |
| `KeysOfType<T, V>` | the keys of `T` whose value is assignable to `V` (`undefined` is ignored).               |
| `Mutable<T>`       | `T` without `readonly` on its properties (one level, arrays and tuples too).             |

```ts
const Status = { Active: 'active', Archived: 'archived' } as const;
type Status = ValueOf<typeof Status>; // 'active' | 'archived'

interface User {
  id: number;
  name: string;
  nickname?: string;
}
type TextKeys = KeysOfType<User, string>; // 'name' | 'nickname'
```

### Deep types

| Type              | Is                                                     |
|-------------------|--------------------------------------------------------|
| `DeepPartial<T>`  | `T` with every property optional, at every level.      |
| `DeepReadonly<T>` | `T` with every property `readonly`, at every level.    |

Both of them:

- go into arrays and tuples (tuples keep their length; `DeepReadonly` makes them readonly),
- go into `Map` and `Set` values (`Map` keys are kept; `DeepReadonly` turns them into `ReadonlyMap` and `ReadonlySet`),
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
- `npm run test:compat` builds, then checks `dist/*.d.ts` with TypeScript 3.7, 4.2, 5.0, 6 and the latest (downloaded with `npx`).

## License

[MIT](LICENSE) © DAWOUD Haitham
