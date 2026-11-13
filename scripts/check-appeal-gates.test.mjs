import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), 'liquivault-gates-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  mkdirSync(join(directory, 'scripts'));
  cpSync(join(root, 'scripts/check-appeal-gates.mjs'), join(directory, 'scripts/check-appeal-gates.mjs'));
  cpSync(join(root, 'docs/gates'), join(directory, 'docs/gates'), { recursive: true });
  return {
    run: (...args) => spawnSync(process.execPath, [join(directory, 'scripts/check-appeal-gates.mjs'), ...args], { encoding: 'utf8', windowsHide: true, timeout: 30000 }),
    change: (file, update) => {
      const path = join(directory, 'docs/gates', file);
      const data = JSON.parse(readFileSync(path, 'utf8'));
      update(data);
      writeFileSync(path, JSON.stringify(data));
    },
  };
}

test('valid local receipts report outstanding human evidence', t => {
  const result = fixture(t).run();
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.evidenceComplete, false);
  assert.deepEqual(report.pending, ['real-wallet-extension-lifecycle', 'independent-developer-or-user-feedback']);
});

test('strict readiness rejects incomplete evidence', t => {
  const result = fixture(t).run('--require-complete');
  assert.equal(result.status, 1);
  assert.equal(JSON.parse(result.stdout).evidenceComplete, false);
});

test('a claimed recovery without preserved rejection evidence fails', t => {
  const files = fixture(t);
  files.change('archival-recovery.json', record => { record.rejectedSigningPreservedArchive = false; });
  const result = files.run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /rejectedSigningPreservedArchive/);
});

test('evidence cannot escape the evidence directory', t => {
  const files = fixture(t);
  files.change('status.json', status => { status.archivalEvidence = ['../outside.json']; });
  const result = files.run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Evidence must stay inside docs\/gates/);
});
