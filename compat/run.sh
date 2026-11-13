#!/bin/sh
# Type-checks `compat/index.ts` against the built `dist/*.d.ts` with old and new TypeScript versions.
# TypeScript 6+ removed `moduleResolution: node`, so it uses `tsconfig.modern.json` (`bundler`).
set -e

for version in 3.7 4.2 5.0; do
  echo "TypeScript $version"
  npx -y -p "typescript@$version" tsc -p compat/tsconfig.json
done

for version in 6 latest; do
  echo "TypeScript $version"
  npx -y -p "typescript@$version" tsc -p compat/tsconfig.modern.json
done
