# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-11-13

### Added

- `LiteralUnion<T, Base>`, `Merge<A, B>`, `StrictOmit<T, K>` ([#33](https://github.com/AsheTM/npm-types/issues/33)).
- `OptionalKeys<T>`, `RequiredKeys<T>`, `Entries<T>` ([#34](https://github.com/AsheTM/npm-types/issues/34)).
- `Tuple<T, N>` (TypeScript 4.1+) ([#35](https://github.com/AsheTM/npm-types/issues/35)).
- CI on GitHub Actions: type checks and TypeScript 3.7 – latest compat on every PR ([#29](https://github.com/AsheTM/npm-types/issues/29)).
- README badges ([#31](https://github.com/AsheTM/npm-types/issues/31)).

## [1.2.0] - 2026-11-13

### Added

- `Paths<T>`, `PathValue<T, P>` (TypeScript 4.1+) ([#23](https://github.com/AsheTM/npm-types/issues/23)).
- `CamelCase<S>`, `KebabCase<S>`, `SnakeCase<S>` (TypeScript 4.1+) ([#24](https://github.com/AsheTM/npm-types/issues/24)).
- `typesVersions`: TypeScript 3.7 – 4.0 keeps the 1.1 types, TypeScript 4.1+ gets every type ([#22](https://github.com/AsheTM/npm-types/issues/22)).

## [1.1.0] - 2026-11-13

### Added

- `Prettify<T>`, `PartialBy<T, K>`, `RequiredBy<T, K>` ([#12](https://github.com/AsheTM/npm-types/issues/12)).
- `RequireAtLeastOne<T, K>`, `RequireExactlyOne<T, K>` ([#13](https://github.com/AsheTM/npm-types/issues/13)).
- `DeepRequired<T>`, `DeepMutable<T>` ([#14](https://github.com/AsheTM/npm-types/issues/14)).
- JSON types: `JsonPrimitive`, `JsonValue`, `JsonObject`, `JsonArray` ([#15](https://github.com/AsheTM/npm-types/issues/15)).
- `UnionToIntersection<U>`, `SplitKeys<T>` ([#16](https://github.com/AsheTM/npm-types/issues/16)).

## [1.0.0] - 2026-11-13

### Added

- Nullability types: `Nullable<T>`, `Maybe<T>` ([#3](https://github.com/AsheTM/npm-types/issues/3)).
- Array types: `NonEmptyArray<T>`, `ArrayItem<T>` ([#3](https://github.com/AsheTM/npm-types/issues/3)).
- Object types: `ValueOf<T>`, `KeysOfType<T, V>`, `Mutable<T>` ([#4](https://github.com/AsheTM/npm-types/issues/4)).
- Deep types: `DeepPartial<T>`, `DeepReadonly<T>` (arrays, tuples, `Map`, `Set`; built-in objects kept as they are) ([#5](https://github.com/AsheTM/npm-types/issues/5)).
- Branded types: `Brand<T, Name>` ([#4](https://github.com/AsheTM/npm-types/issues/4)).
- Types only, ESM, `"sideEffects": false`, no runtime dependencies; TypeScript 3.7 or later (optional peer dependency) ([#2](https://github.com/AsheTM/npm-types/issues/2)).
- MIT license ([#10](https://github.com/AsheTM/npm-types/issues/10)).
