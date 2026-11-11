// Review docs/wave/issues.json first. Default is read-only dry-run.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const drafts = JSON.parse(readFileSync(resolve(root, 'docs/wave/issues.json'), 'utf8'));
if (!process.argv.includes('--publish')) {
  console.log(JSON.stringify(drafts.map(({ repository, title }) => ({ repository, title })), null, 2));
  process.exit(0);
}
let authorization;
if (process.env.GH_TOKEN) authorization = `Bearer ${process.env.GH_TOKEN}`;
else {
  const result = spawnSync('git', ['credential', 'fill'], { cwd: root, input: 'protocol=https\nhost=github.com\n\n', encoding: 'utf8', windowsHide: true,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' } });
  if (result.status !== 0) throw new Error('No usable GitHub credential. Authenticate normally or set GH_TOKEN; credentials are never printed.');
  const values = Object.fromEntries(result.stdout.trim().split(/\r?\n/).map(line => { const at = line.indexOf('='); return [line.slice(0, at), line.slice(at + 1)]; }));
  if (!values.username || !values.password) throw new Error('Credential helper did not return authorization');
  authorization = `Basic ${Buffer.from(`${values.username}:${values.password}`).toString('base64')}`;
}
async function api(path, method = 'GET', body) {
  let response;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      response = await fetch(`https://api.github.com${path}`, { method, headers: { Authorization: authorization, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json', 'User-Agent': 'LiquiVault-backlog-publisher' }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(30000) });
      break;
    } catch (error) {
      // A lost POST response is ambiguous. Stop; the next run deduplicates first.
      if (method !== 'GET' || attempt === 2) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  if (!response.ok) throw new Error(`GitHub ${method} ${path}: HTTP ${response.status}`);
  return response.json();
}
const user = await api('/user');
if (user.login.toLowerCase() !== 'moscowdev') throw new Error('Authenticated account does not match the intended repository owner');
const output = resolve(root, 'docs/wave/published.json');
const published = JSON.parse(readFileSync(output, 'utf8'));
for (const draft of drafts) {
  const repository = draft.repository;
  if (!/^MoscowDev\/liquivault-(contracts|sdk|frontend)$/.test(repository)) throw new Error('Unexpected target repository');
  const existing = await api(`/repos/${repository}/issues?state=all&per_page=100`);
  const marker = `<!-- liquivault-backlog:${draft.key} -->`;
  let issue = existing.find(item => !item.pull_request && item.body?.includes(marker));
  if (!issue) issue = await api(`/repos/${repository}/issues`, 'POST', { title: draft.title, body: draft.body, labels: draft.labels });
  const entry = { repository, key: draft.key, title: draft.title, number: issue.number, url: issue.html_url };
  const index = published.findIndex(item => item.repository === repository && item.key === draft.key);
  if (index >= 0) published[index] = entry; else published.push(entry);
  writeFileSync(output, JSON.stringify(published, null, 2) + '\n');
  console.log(issue.html_url);
}
await import('./render-backlog.mjs');
