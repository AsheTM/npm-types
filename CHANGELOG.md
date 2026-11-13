# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-13

### Added

- Nullability types: `Nullable<T>`, `Maybe<T>` ([#3](https://github.com/AsheTM/npm-types/issues/3)).
- Array types: `NonEmptyArray<T>`, `ArrayItem<T>` ([#3](https://github.com/AsheTM/npm-types/issues/3)).
- Object types: `ValueOf<T>`, `KeysOfType<T, V>`, `Mutable<T>` ([#4](https://github.com/AsheTM/npm-types/issues/4)).
- Deep types: `DeepPartial<T>`, `DeepReadonly<T>` (arrays, tuples, `Map`, `Set`; built-in objects kept as they are) ([#5](https://github.com/AsheTM/npm-types/issues/5)).
- Branded types: `Brand<T, Name>` ([#4](https://github.com/AsheTM/npm-types/issues/4)).
- Types only, ESM, `"sideEffects": false`, no runtime dependencies; TypeScript 3.7 or later (optional peer dependency) ([#2](https://github.com/AsheTM/npm-types/issues/2)).
- MIT license ([#10](https://github.com/AsheTM/npm-types/issues/10)).
