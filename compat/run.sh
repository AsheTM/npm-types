#!/bin/sh
# Type-checks `compat/` against the built package with old and new TypeScript versions.
# `@ashetm/types` is linked to the package root, so `types`, `typesVersions` and `exports` are used like in a real install.
# TypeScript 6+ removed `moduleResolution: node`, so it uses `bundler`.
set -e

cd "$(dirname "$0")"
mkdir -p node_modules/@ashetm
ln -sfn ../../.. node_modules/@ashetm/types

check() {
  echo "TypeScript $1 ($2)"
  npx -y -p "typescript@$1" tsc -p "$2"
}

# TypeScript 3.7 – 4.0: `typesVersions` gives `dist/legacy.d.ts`
for version in 3.7 4.0; do
  check "$version" tsconfig.json
done

# TypeScript 4.1+: every type (`modern.ts` too)
for version in 4.1 4.4 5.0; do
  check "$version" tsconfig.v4.1.json
done

for version in 6 latest; do
  check "$version" tsconfig.bundler.json
done
