import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const issues = JSON.parse(readFileSync(resolve(root, 'docs/wave/published.json'), 'utf8'));
let text = '# Published contributor backlog\n\nThese are opened GitHub issues, not a Drips approval or reward commitment. Read the owning repository contribution guide and discuss assignment before starting.\n';
for (const repository of [...new Set(issues.map(issue => issue.repository))]) {
  text += `\n## ${repository}\n\n`;
  text += issues.filter(issue => issue.repository === repository).map(issue => `- [#${issue.number}: ${issue.title}](${issue.url})\n`).join('');
}
text += '\nThe [reviewed issue descriptions](issues.json) and [publication record](published.json) preserve the scope and returned URLs. Completed repairs are excluded from this backlog.\n';
writeFileSync(resolve(root, 'docs/wave/README.md'), text);
console.log(`Rendered ${issues.length} published contributor issues.`);
