import { spawnSync } from 'node:child_process';
const repo = process.argv[2];
if (!['liquivault-sdk', 'liquivault-frontend'].includes(repo)) throw new Error('Select a LiquiVault JavaScript repository');
const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['audit', '--json'], { cwd: repo, encoding: 'utf8', windowsHide: true, shell: process.platform === 'win32', maxBuffer: 8 * 1024 * 1024 });
let report;
try { report = JSON.parse(result.stdout); } catch { throw new Error('Audit endpoint unavailable; no clean result established'); }
if (!report.metadata) throw new Error(`Audit failed: ${report.error?.code ?? 'unknown error'}`);
console.log(JSON.stringify({ repo, counts: report.metadata.vulnerabilities,
  packages: Object.entries(report.vulnerabilities ?? {}).map(([name, value]) => ({ name, severity: value.severity, range: value.range, fix: value.fixAvailable, via: value.via })) }, null, 2));
process.exitCode = report.metadata.vulnerabilities.total ? 1 : 0;
