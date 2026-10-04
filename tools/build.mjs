// build.mjs — inject data/bestiary.json into the template → gmf.html (single-file doctrine).
import { readFileSync, writeFileSync } from 'node:fs';
const tpl = readFileSync('src/gmf.template.html', 'utf8');
const data = JSON.parse(readFileSync('data/bestiary.json', 'utf8'));
const payload = JSON.stringify(data.entries);
const out = tpl.replace('/*__BESTIARY__*/[]', payload);
writeFileSync('gmf.html', out);
console.log(`gmf.html built: ${(out.length/1024/1024).toFixed(2)} MB, ${data.entries.length} foes embedded`);
