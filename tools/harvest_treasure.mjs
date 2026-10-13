// harvest_treasure.mjs — v0.7.1 THE TREASURE ROLLER (the Forge pays out).
// Parses GMG Table: Treasure (pp.42-43): per level 1st-20th, three d% columns
// (Coins / Goods / Items), bands classified by their result keywords; plus
// the per-EL value table, the average-values table, and the 21st+ major-item
// extension. Output: data/treasure.json.
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = process.argv[2] || 'C:/Users/adam_/OneDrive/Desktop/E&E/extraction';
const g = readFileSync(`${DIR}/gmg_text.txt`, 'utf8').replace(/\r/g, '').split('\n');

const startIdx = g.findIndex(l => l.trim() === 'Table: Treasure');
const endIdx = g.findIndex((l, i) => i > startIdx && /^For treasures above 20th/.test(l.trim()));
const block = g.slice(startIdx + 1, endIdx).join('\n')
  .replace(/^Level d%.*$/gm, '').replace(/^===== PAGE \d+ =====$/gm, '').replace(/^\d{1,3}$/gm, '');

// Split into per-level chunks on the ordinal leads.
const levels = {};
{
  const parts = block.split(/^(\d+)(?:st|nd|rd|th)\s/m);
  for (let i = 1; i < parts.length; i += 2) {
    const lvl = +parts[i];
    const text = parts[i + 1] || '';
    const rows = { coins: [], goods: [], items: [] };
    // tokenize: band lo–hi followed by result text until the next band
    const rx = /(\d{2,3})[\u2013\u2014-](\d{2,3})\s+((?:(?!\d{2,3}[\u2013\u2014-]\d{2,3}).)*)/gs;
    for (const m of text.matchAll(rx)) {
      const lo = +m[1], hi = +m[2];
      const res = m[3].replace(/\s+/g, ' ').trim();
      if (lo > hi || hi > 100) continue;
      const entry = { lo, hi, r: res === '\u2014' || res === '' || res === '-' ? null : res };
      const t = entry.r || '';
      if (/cp|sp\b|gp\b|pp\b/.test(t)) rows.coins.push(entry);
      else if (/gem|art/.test(t)) rows.goods.push(entry);
      else if (/mundane|minor|medium|major/.test(t)) rows.items.push(entry);
      else { // empty bands: assign to the first column still missing its 01- band
        for (const col of ['coins', 'goods', 'items']) if (!rows[col].some(e => e.lo === lo)) { rows[col].push(entry); break; }
      }
    }
    for (const col of ['coins', 'goods', 'items']) rows[col].sort((a, b) => a.lo - b.lo);
    levels[lvl] = rows;
  }
}

// per-EL value + average values + 21st+ extension
const values = {};
for (const l of g) { const m = l.match(/^(\d+)\s+([\d,]+)\s*gp \/ \$([\d,]+)\s+(\d+)\s+([\d,]+)\s*gp \/ \$([\d,]+)/); if (m) { values[+m[1]] = +m[2].replace(/,/g, ''); values[+m[4]] = +m[5].replace(/,/g, ''); } }
const avg = {};
for (let i = 0; i < g.length; i++) { const m = g[i].match(/^(Gem|Art object|Mundane item|Minor magic item|Medium magic item|Major magic item)\s+([\d,]+)\s*gp/); if (m) avg[m[1]] = +m[2].replace(/,/g, ''); }
const beyond = {};
for (const l of g) for (const m of l.matchAll(/(2\d|30)(?:st|nd|rd|th)\s+\+(\d+)/g)) beyond[+m[1]] = +m[2];

const out = { _meta: { generated: new Date().toISOString().slice(0, 10), levels: Object.keys(levels).length }, levels, values, avg, beyond };
writeFileSync(new URL('../data/treasure.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out._meta));
const chk = (n) => { const L = levels[n]; return n + ': coins ' + L.coins.length + ' goods ' + L.goods.length + ' items ' + L.items.length; };
console.log([1, 4, 10, 20].map(chk).join(' | '));
console.log('L20 coins:', JSON.stringify(levels[20].coins));
console.log('values 1,10,20:', values[1], values[10], values[20], '| avg Gem:', avg['Gem'], '| beyond 25:', beyond[25]);
