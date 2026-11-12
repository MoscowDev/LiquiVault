// Read-only CI inspection tied to each local commit, rather than a stale badge.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
function git(directory, args) {
  const result = spawnSync('git', args, { cwd: directory, encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) throw new Error(`Git inspection failed for ${directory}; no clean result established`);
  return result.stdout.trim();
}
const results = [];
for (const directory of ['liquivault-contracts', 'liquivault-sdk', 'liquivault-frontend', '.']) {
  const repository = directory === '.' ? 'LiquiVault' : directory;
  const head = git(directory, ['rev-parse', 'HEAD']);
  const dirty = Boolean(git(directory, ['status', '--porcelain']));
  const response = await fetch(`https://api.github.com/repos/MoscowDev/${repository}/actions/runs?head_sha=${head}&event=push&per_page=100`, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'LiquiVault-CI-review' }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`CI inspection HTTP ${response.status}; no passing result established`);
  const page = await response.json();
  const run = page.workflow_runs.find(item => item.head_sha === head && item.path === '.github/workflows/ci.yml');
  results.push({ repository, head, dirty, status: run?.status ?? 'not_started', conclusion: run?.conclusion ?? null, url: run?.html_url ?? null });
}
const report = { checkedAt: new Date().toISOString(), repositories: results };
console.log(JSON.stringify(report, null, 2));
// Optional local receipt is ignored; editing tracked docs would itself dirty HEAD.
if (process.argv.includes('--receipt')) {
  mkdirSync('.stellar', { recursive: true });
  writeFileSync('.stellar/ci-status.json', JSON.stringify(report, null, 2) + '\n');
}
process.exitCode = results.every(item => !item.dirty && item.status === 'completed' && item.conclusion === 'success') ? 0 : 1;
