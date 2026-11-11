// Read-only CI inspection tied to each local commit, rather than a stale badge.
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const results = [];
for (const directory of ['liquivault-contracts', 'liquivault-sdk', 'liquivault-frontend', '.']) {
  const repository = directory === '.' ? 'LiquiVault' : directory;
  const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: directory, encoding: 'utf8', windowsHide: true }).stdout.trim();
  const dirty = Boolean(spawnSync('git', ['status', '--porcelain'], { cwd: directory, encoding: 'utf8', windowsHide: true }).stdout.trim());
  const response = await fetch(`https://api.github.com/repos/MoscowDev/${repository}/actions/runs?per_page=5`, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'LiquiVault-CI-review' }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`CI inspection HTTP ${response.status}; no passing result established`);
  const page = await response.json();
  const run = page.workflow_runs.find(item => item.head_sha === head);
  results.push({ repository, head, dirty, status: run?.status ?? 'not_started', conclusion: run?.conclusion ?? null, url: run?.html_url ?? null });
}
const report = { checkedAt: new Date().toISOString(), repositories: results };
console.log(JSON.stringify(report, null, 2));
// Optional local receipt is ignored; editing tracked docs would itself dirty HEAD.
if (process.argv.includes('--receipt')) writeFileSync('.stellar/ci-status.json', JSON.stringify(report, null, 2) + '\n');
process.exitCode = results.every(item => !item.dirty && item.status === 'completed' && item.conclusion === 'success') ? 0 : 1;
