// The TypeScript 4.1+ types (`dist/index.d.ts`), checked at the limits of TypeScript 4.1–4.4:
// strings of 40 characters, `Paths` of 9 segments on a self-referencing type, `Tuple` of 42 items.
import type { CamelCase, KebabCase, Paths, PathValue, SnakeCase, Tuple } from '@ashetm/types';

type Equals<A, B> = (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false;

interface Settings {
  theme: { color: string };
  owner?: { name: string };
  tags: string[];
}

interface Tree {
  value: number;
  children: Tree[];
}

export const checks: [
  Equals<Paths<Settings>, 'theme' | 'theme.color' | 'owner' | 'owner.name' | 'tags' | `tags.${number}`>,
  Equals<PathValue<Settings, 'owner.name'>, string | undefined>,
  Equals<PathValue<Settings, 'tags.0'>, string>,
  Equals<KebabCase<'userID'>, 'user-id'>,
  Equals<SnakeCase<'USER_ID'>, 'user_id'>,
  Equals<CamelCase<'user-name id'>, 'userNameId'>,
  Equals<Tuple<number, 3>, [number, number, number]>,
  Equals<Tuple<number, 42>['length'], 42>,
] = [true, true, true, true, true, true, true, true];

export const deepPath: Paths<Tree> = 'children.0.children.0.children.0.children.0.value';
// @ts-expect-error: more than 9 segments
export const tooDeep: Paths<Tree> = 'children.0.children.0.children.0.children.0.children.0';

// 40 characters
export const kebab: KebabCase<'theLongestPropertyNameOfTheSettings_api'> = 'the-longest-property-name-of-the-settings-api';
export const camel: CamelCase<'the_longest_property_name_of_the_set_api'> = 'theLongestPropertyNameOfTheSetApi';
