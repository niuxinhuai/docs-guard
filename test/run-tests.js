import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'src', 'cli.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-guard-'));

function git(args) {
  return execFileSync('git', args, { cwd: tmp, encoding: 'utf8' });
}

function run() {
  return spawnSync(process.execPath, [cli], { cwd: tmp, encoding: 'utf8' });
}

git(['init', '-b', 'main']);
git(['config', 'user.email', 'test@example.com']);
git(['config', 'user.name', 'Test User']);
fs.mkdirSync(path.join(tmp, 'src', 'api'), { recursive: true });
fs.mkdirSync(path.join(tmp, 'docs'), { recursive: true });
fs.writeFileSync(path.join(tmp, 'docs-guard.config.json'), JSON.stringify({
  rules: [{ changed: 'src/api/**', docs: ['docs/api.md'] }]
}, null, 2));
fs.writeFileSync(path.join(tmp, 'src', 'api', 'users.js'), 'export const users = [];\n');
fs.writeFileSync(path.join(tmp, 'docs', 'api.md'), '# API\n');
git(['add', '.']);
git(['commit', '-m', 'initial']);

fs.writeFileSync(path.join(tmp, 'src', 'api', 'users.js'), 'export const users = ["Ada"];\n');
const failed = run();
assert.equal(failed.status, 1);
assert.match(failed.stderr, /Docs guard failed/);

fs.writeFileSync(path.join(tmp, 'docs', 'api.md'), '# API\n\nUpdated users API.\n');
const passed = run();
assert.equal(passed.status, 0);
assert.match(passed.stdout, /Docs guard passed/);

console.log('docs-guard tests passed');
