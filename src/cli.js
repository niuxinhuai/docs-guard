#!/usr/bin/env node
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`docs-guard

Usage:
  docs-guard [--config docs-guard.config.json] [--base HEAD]

Checks whether configured source changes also update required docs.`);
  process.exit(0);
}

function valueAfter(flag, fallback) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : fallback;
}

function globToRegExp(glob) {
  const escaped = glob.replace(/[.+^${()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '::DOUBLE_STAR::')
    .replace(/\*/g, '[^/]*')
    .replace(/::DOUBLE_STAR::/g, '.*');
  return new RegExp(`^${escaped}$`);
}

const configPath = valueAfter('--config', 'docs-guard.config.json');
const base = valueAfter('--base', 'HEAD');
if (!fs.existsSync(configPath)) {
  console.error(`Missing config: ${configPath}`);
  process.exit(2);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
let changed = [];
try {
  changed = execFileSync('git', ['diff', '--name-only', base], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
} catch {
  console.error('docs-guard must be run inside a git repository.');
  process.exit(2);
}

const failures = [];
for (const rule of config.rules || []) {
  const sourceMatchers = [rule.changed].flat().map(globToRegExp);
  const docs = [rule.docs].flat();
  const hit = changed.some((file) => sourceMatchers.some((matcher) => matcher.test(file)));
  const docHit = docs.some((doc) => changed.includes(doc));
  if (hit && !docHit) failures.push({ rule, docs });
}

if (failures.length) {
  console.error('Docs guard failed:');
  for (const failure of failures) {
    console.error(`- Source changed but docs were not updated: ${failure.docs.join(', ')}`);
  }
  process.exit(1);
}

console.log('Docs guard passed.');
