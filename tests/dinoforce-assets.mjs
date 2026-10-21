// Run from the repository root: node tests/dinoforce-assets.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { gunzipSync } from 'node:zlib';

const context = { window: {} };
vm.runInNewContext(fs.readFileSync('data/dinoforce-build.js', 'utf8'), context);
const build = context.window.dinoForceBuild;
const root = path.join('jogos/dinoforce', build.root);
const exactFile = name => {
  let current = '.';
  for (const part of name.split(/[\\/]/).filter(Boolean)) {
    assert(fs.readdirSync(current).includes(part), `Missing file or case mismatch: ${name}`);
    current = path.join(current, part);
  }
  const bytes = fs.readFileSync(current);
  assert(!bytes.subarray(0, 100).toString().startsWith('version https://git-lfs.github.com/spec'), `LFS pointer: ${name}`);
  return bytes;
};
const loader = exactFile(path.join(root, build.loader)).toString();
assert(loader.includes('UnityWeb Compressed Content (gzip)'), 'Expected generated gzip fallback decompressor');
for (const key of ['dataUrl', 'frameworkUrl', 'codeUrl']) {
  const name = path.join(root, build.config[key]);
  const bytes = exactFile(name);
  const decoded = gunzipSync(bytes);
  assert(bytes.length < 100 * 1024 * 1024, `Exceeds Git file limit: ${name}`);
  if (key === 'codeUrl') assert.equal(decoded.subarray(0, 4).toString(), '\0asm');
  if (key === 'dataUrl') assert(decoded.subarray(0, 30).toString().includes('UnityWebData'));
  console.log(`${name}: ${bytes.length} bytes; gzip verified`);
}
for (const name of ['index.html', 'StreamingAssets/aa/settings.json', 'StreamingAssets/aa/catalog.bin', 'StreamingAssets/aa/catalog.hash']) exactFile(path.join(root, name));
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const name = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(name) : [name];
});
let total = 0;
for (const name of walk('jogos')) {
  const bytes = exactFile(name);
  assert(bytes.length < 100 * 1024 * 1024, `Exceeds Git file limit: ${name}`);
  total += bytes.length;
}
assert(total < 1024 ** 3, 'Games exceed the complete GitHub Pages site size limit');
console.log(`Exact case, real binaries, fallback, required files verified. Games: ${total} bytes.`);
