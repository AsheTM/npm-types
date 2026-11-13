// TypeScript 4.1+ only (template literal types): not exported from `legacy.ts`.
// One recursion step per character, so TypeScript 4.1–4.4 handles strings of about 40 characters.

type Delimiter = '_' | '-' | ' ';

// What came before the current character
type State = 'start' | 'lower' | 'upper' | 'delimiter';

// A lowercase letter, a digit or any other character that has no uppercase
type IsLower<C extends string> = C extends Lowercase<C> ? true : false;

// The output for one character: a new word starts after a delimiter, or on a lowercase → uppercase change
type Piece<C extends string, Before extends State, Separator extends string> = C extends Delimiter
  ? ''
  : IsLower<C> extends true
    ? `${Before extends 'delimiter' ? Separator : ''}${C}`
    : `${Before extends 'delimiter' | 'lower' ? Separator : ''}${Lowercase<C>}`;

type NextState<C extends string, Before extends State> = C extends Delimiter
  ? Before extends 'start'
    ? 'start'
    : 'delimiter'
  : IsLower<C> extends true
    ? 'lower'
    : 'upper';

type Separate<S extends string, Separator extends string, Result extends string = '', Before extends State = 'start'> =
  S extends `${infer C}${infer Rest}`
    ? Separate<Rest, Separator, `${Result}${Piece<C, Before, Separator>}`, NextState<C, Before>>
    : Result;

/**
 * `S` in kebab-case. Words are split on `_`, `-`, spaces and lowercase → uppercase changes.
 * `string` stays `string`.
 *
 * Needs TypeScript 4.1+ (about 40 characters on TypeScript 4.1–4.4).
 *
 * @example
 * ```ts
 * type A = KebabCase<'userId'>; // 'user-id'
 * type B = KebabCase<'USER_ID'>; // 'user-id'
 * type C = KebabCase<'UserID'>; // 'user-id'
 * ```
 */
export type KebabCase<S extends string> = string extends S ? string : Separate<S, '-'>;

/**
 * `S` in snake_case. Words are split on `_`, `-`, spaces and lowercase → uppercase changes.
 * `string` stays `string`.
 *
 * Needs TypeScript 4.1+ (about 40 characters on TypeScript 4.1–4.4).
 *
 * @example
 * ```ts
 * type A = SnakeCase<'userId'>; // 'user_id'
 * type B = SnakeCase<'user-name id'>; // 'user_name_id'
 * ```
 */
export type SnakeCase<S extends string> = string extends S ? string : Separate<S, '_'>;

type ToUnderscores<S extends string, Result extends string = ''> = S extends `${infer C}${infer Rest}`
  ? ToUnderscores<Rest, `${Result}${C extends Delimiter ? '_' : C}`>
  : Result;

// An all-uppercase word (`ID`) is lowercased first, so it becomes `Id`
type Word<W extends string> = W extends Uppercase<W> ? Capitalize<Lowercase<W>> : Capitalize<W>;

type JoinWords<S extends string, Result extends string = ''> = S extends `${infer W}_${infer Rest}`
  ? JoinWords<Rest, `${Result}${Word<W>}`>
  : `${Result}${Word<S>}`;

/**
 * `S` in camelCase. Words are split on `_`, `-` and spaces; all-uppercase words are lowercased first.
 * `string` stays `string`.
 *
 * Needs TypeScript 4.1+ (about 40 characters on TypeScript 4.1–4.4).
 *
 * @example
 * ```ts
 * type A = CamelCase<'user_id'>; // 'userId'
 * type B = CamelCase<'USER_ID'>; // 'userId'
 * type C = CamelCase<'user-name id'>; // 'userNameId'
 * ```
 */
export type CamelCase<S extends string> = string extends S ? string : Uncapitalize<JoinWords<ToUnderscores<S>>>;
