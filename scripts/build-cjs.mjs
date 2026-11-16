// Writes the CommonJS flavour of the types next to the ESM one (`exports` → `require`):
// a `.d.cts` copy of each `dist/*.d.ts`, with `./x.js` imports rewritten to `./x.cjs`,
// and an empty `dist/index.cjs` so a runtime `require` doesn't fail.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;

for (const file of readdirSync(dist)) {
  if (!file.endsWith('.d.ts')) continue;
  const source = readFileSync(join(dist, file), 'utf8');
  const cjs = source.replace(/(['"])(\.\.?\/[^'"]+?)\.js\1/g, '$1$2.cjs$1');
  writeFileSync(join(dist, file.replace(/\.d\.ts$/, '.d.cts')), cjs);
}

writeFileSync(join(dist, 'index.cjs'), "'use strict';\nmodule.exports = {};\n");
