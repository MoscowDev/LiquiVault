import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const issues = JSON.parse(readFileSync(resolve(root, 'docs/wave/published.json'), 'utf8'));
const drafts = JSON.parse(readFileSync(resolve(root, 'docs/wave/issues.json'), 'utf8'));
let text = '# Published contributor backlog\n\nThese are opened GitHub issues, not a Drips approval or reward commitment. Read the owning repository contribution guide and discuss assignment before starting.\n';
for (const repository of [...new Set(issues.map(issue => issue.repository))]) {
  text += `\n## ${repository}\n\n`;
  text += issues.filter(issue => issue.repository === repository).map(issue => {
    const draft = drafts.find(item => item.repository === issue.repository && item.key === issue.key);
    return `- [#${issue.number}: ${issue.title}](${issue.url}) — ${draft?.progressStatus ?? 'Review current issue status'}.\n`;
  }).join('');
}
text += '\nThe [reviewed issue descriptions](issues.json) record candidate progress and remaining scope. The [publication record](published.json) preserves returned URLs. Progress above describes local implementation; it does not automatically update GitHub issue bodies or open/closed state. Review completed criteria before assigning work.\n';
writeFileSync(resolve(root, 'docs/wave/README.md'), text);
console.log(`Rendered ${issues.length} published contributor issues.`);
