// dragons.mjs — v0.3.0: THE WYRM PASS (Adam: "let's get those Dragons in here!").
// The 16 true dragons (FF pp.190-218) print as: heading, "Dragon (Element)"
// subtype, INLINE-label header (Environment/Organization/CR-by-age/Treasure/
// Alignment/Advancement/LA-by-age), then TWO age tables — "X Dragons by Age"
// (combat: size/HD[hardness]/abilities/BA/attack/saves/breath/FP) and
// "X Dragon Abilities by Age" (speed/init/T-AC/cumulative specials/CL/PP/SR)
// — each row anchored on the twelve age names. Variants = the twelve ages.
export const DRAGON_AGES = ['Wyrmling', 'Very young', 'Young', 'Juvenile', 'Young adult', 'Adult', 'Mature adult', 'Old', 'Very old', 'Ancient', 'Wyrm', 'Great wyrm'];
const SIZE_WORD = { T: 'Tiny', S: 'Small', M: 'Medium', L: 'Large', H: 'Huge', G: 'Gargantuan', C: 'Colossal' };
const ageIdx = l => DRAGON_AGES.findIndex(a => a.toLowerCase() === l.trim().toLowerCase());
const glue = t => t.replace(/\/\s+/g, '/').replace(/[−–]/g, '-');

export function extractDragons({ lines, pageOf, isCaps, merged, MISMATCH }) {
  const dragonNames = [...pageOf.keys()].filter(n => /^[A-Z]+ DRAGON$/.test(n));
  let built = 0;
  for (const dname of dragonNames) {
    try {
      let h = -1;
      for (let i = 0; i < lines.length; i++) if (lines[i].toUpperCase() === dname && /^Dragon \(/.test(lines[i + 1] || '')) { h = i; break; }
      if (h < 0) { MISMATCH.push(`${dname} :: DRAGON PASS :: heading+subtype not found`); continue; }
      const subtype = lines[h + 1];
      // header block with inline labels, until the "... Dragons by Age" marker
      const hdr = {}; let cur = null; let i = h + 2;
      for (; i < lines.length && !/Dragons by Age$/i.test(lines[i]); i++) {
        // Some dragons pluralize the labels ("Challenge Ratings:") — tolerate.
        const m = lines[i].match(/^(Environment|Organization|Challenge Rating|Treasure|Alignment|Advancement|Level Adjustment)s?:\s*(.*)$/);
        if (m) { cur = m[1]; hdr[cur] = m[2]; } else if (cur) hdr[cur] += ' ' + lines[i];
      }
      const perAge = label => { // "Wyrmling 3; very young 4; ... others —"
        const map = {};
        for (const part of (hdr[label] || '').split(';')) {
          const pm = part.trim().match(/^(.+?)\s+([+\-−]?[\d—–—–-][\d—–—–+\sHD]*)$/);
          if (pm) map[pm[1].trim().toLowerCase()] = pm[2].trim();
        }
        return map;
      };
      const crMap = perAge('Challenge Rating'), laMap = perAge('Level Adjustment'), advMap = perAge('Advancement');
      // ---- table 1 rows ----
      i++; // past the "by Age" marker
      while (i < lines.length && ageIdx(lines[i]) < 0) i++; // skip T1 headers
      const t1 = {};
      while (i < lines.length && !/Abilities by Age$/i.test(lines[i])) {
        const ai = ageIdx(lines[i]);
        if (ai >= 0) { t1[ai] = []; i++; while (i < lines.length && ageIdx(lines[i]) < 0 && !/Abilities by Age$/i.test(lines[i])) { t1[ai].push(lines[i]); i++; } }
        else i++;
      }
      // ---- table 2 rows ----
      i++; while (i < lines.length && ageIdx(lines[i]) < 0) i++; // skip T2 headers
      const t2 = {}; let lastAge = -1;
      while (i < lines.length) {
        const ai = ageIdx(lines[i]);
        if (ai >= 0) { lastAge = ai; t2[ai] = []; i++; continue; }
        if (lastAge === 11 && lines[i].split(/\s+/).length > 9) break; // prose ends the final row
        if (isCaps(lines[i]) && pageOf.has(lines[i].toUpperCase())) break;
        if (lastAge >= 0) t2[lastAge].push(lines[i]);
        i++;
      }
      // ---- prose body until the next known heading ----
      const prose = [];
      for (let k = i; k < lines.length && prose.join(' ').length < 9000; k++) {
        if (isCaps(lines[k]) && pageOf.has(lines[k].toUpperCase())) break;
        prose.push(lines[k]);
      }
      // ---- compose the twelve age variants ----
      const variants = []; const cum = [];
      for (let a = 0; a < 12; a++) {
        if (!t1[a]) continue;
        const row = glue(t1[a].join(' '));
        const v = { label: DRAGON_AGES[a] };
        let m2 = row.match(/\b([TSMLHGC])\b/); const size = m2 ? m2[1] : null;
        m2 = row.match(/(\d+d12(?:\+\d+)?)\s*(\[[^\]]*\])?/);
        if (m2) {
          // Average HP for the GM-on-the-go: Nd12 averages 6.5 per die, floor.
          const hm = m2[1].match(/(\d+)d12(?:\+(\d+))?/);
          const avg = Math.floor(Number(hm[1]) * 6.5 + (Number(hm[2]) || 0));
          v.hit_dice = `${m2[1]} (${avg} hp)`;
          if (m2[2]) v.t_ac_system_adj = 'Natural Hardness ' + m2[2].slice(1, -1);
        }
        const after = m2 ? row.slice(row.indexOf(m2[0]) + m2[0].length) : row;
        const toks = after.trim().split(/\s+/);
        const ints = []; const pairs = []; const singles = []; let breath = null, fp = null;
        for (let ti = 0; ti < toks.length; ti++) {
          const t = toks[ti];
          if (/^\d+d\d+(?:\+\d+)?$/.test(t) && /^\(\d+\)$/.test(toks[ti + 1] || '')) { breath = t + ' ' + toks[ti + 1]; ti++; continue; }
          if (/^\d+$/.test(t) && ints.length < 6) { ints.push(t); continue; }
          if (/^[+\-]\d+\/[+\-]?\d+$/.test(t)) { pairs.push(t); continue; }
          if (/^[+\-]\d+$/.test(t)) { singles.push(t); continue; }
          if (/^(\d+|[—–—–-]+)$/.test(t)) fp = t;
        }
        if (ints.length === 6) v.attributes = `Str ${ints[0]}, Dex ${ints[1]}, Con ${ints[2]}, Int ${ints[3]}, Wis ${ints[4]}, Cha ${ints[5]}`;
        const baGrap = pairs[0], atkParry = pairs[1], refDodge = pairs[2];
        if (baGrap && atkParry) { v.ba_grapple_parry = baGrap + '/' + atkParry.split('/')[1]; v.attack = atkParry.split('/')[0] + ' melee (bite/claws/wings by size — see Combat)'; }
        if (singles.length >= 2 && refDodge) v.saves_dodge = `Fort ${singles[0]}, Ref ${refDodge.split('/')[0]}, Will ${singles[1]}, Dodge ${refDodge.split('/')[1]}`;
        if (breath) v.special_attacks = `Breath weapon ${breath.replace(' (', ' (DC ')}${fp && /\d/.test(fp) ? ', frightful presence (DC ' + fp + ')' : ''}`;
        // table 2
        const cells = (t2[a] || []).map(c => c.trim());
        const speed = cells.find(c => /ft\./.test(c));
        const init = cells.find(c => /^[+\-−]\d+$/.test(c));
        const tac = cells.find(c => /\d+\/\d+\s*\(/.test(c));
        const cl = cells.find(c => /^\d+(st|nd|rd|th)$/.test(c));
        const pp = cells.find(c => /^\d+ PP$/.test(c));
        const srs = cells.filter(c => /^\d+$/.test(c)); const sr = srs.length ? srs[srs.length - 1] : null;
        const specials = cells.filter(c => c !== speed && c !== init && c !== tac && c !== cl && c !== pp && !/^\d+$/.test(c) && !/^[—–—–-]+$/.test(c));
        for (const sp of specials) if (!cum.includes(sp)) cum.push(sp);
        if (init || speed) v.initiative_speed = `${init || '+0'}; ${speed || ''}`;
        if (tac) v.touch_full_ac_t_ac = tac;
        v.special_qualities = cum.join('; ') + (cl ? `; caster level ${cl}${pp ? ' (' + pp + ')' : ''}` : '') + (sr ? `, SR ${sr}` : '');
        if (size) v.size_type = `${SIZE_WORD[size]} ${subtype}`;
        const ageKey = DRAGON_AGES[a].toLowerCase();
        v.challenge_rating = crMap[ageKey] || '';
        v.level_adjustment = laMap[ageKey] || laMap['others'] || '';
        v.advancement = advMap[ageKey] || '';
        v.environment = hdr['Environment'] || ''; v.organization = hdr['Organization'] || '';
        v.treasure = hdr['Treasure'] || ''; v.alignment = hdr['Alignment'] || '';
        variants.push(v);
      }
      if (variants.length >= 10) {
        merged.push({ hadCaps: true, parent: dname, variants, body: prose.join('\n') });
        built++;
      } else MISMATCH.push(`${dname} :: DRAGON PASS :: only ${variants.length} ages parsed`);
    } catch (e) { MISMATCH.push(`${dname} :: DRAGON PASS THREW :: ${String(e).slice(0, 80)}`); }
  }
  console.log(`dragons built: ${built} of ${dragonNames.length}`);
  return built;
}
