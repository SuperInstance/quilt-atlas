#!/usr/bin/env node
// quilt-atlas builder v2 — zero-dep, runs locally or in Actions.
// Maps the SuperInstance account: inventory, families, CI coverage,
// recent motion. Writes atlas.json + regenerates the README block
// between the ATLAS markers. Honest gaps stay visible (no fabrication).
//
// v2 (task 53-e): classification reads repo DESCRIPTIONS, not just names.
//   Stage 1 — name keywords first, families preserved exactly (same
//             regexes + precedence as v1: jev > latent > moth > qthe >
//             quilt > fleet); nothing that was classified stays unclassified.
//   Stage 2 — for the remainder: case-insensitive substring scoring of the
//             description against a small synonym table per family; highest
//             score wins, ties broken by family precedence.
//   Stage 3 — everything else stays "other" (honest residue, not failure).
// Every repo records [family, stage, matched keywords, language] in
// atlas.json → "classification" so the map is auditable. Still imperfect
// on purpose — but now the imperfection shows its evidence.

import { writeFileSync, readFileSync } from 'node:fs';

const TOKEN = process.env.GITHUB_TOKEN || '';
const OWNER = 'SuperInstance';
const H = {
  Authorization: `token ${TOKEN}`,
  Accept: 'application/vnd.github+json',
  'User-Agent': 'quilt-atlas-builder',
};
async function api(url) {
  const r = await fetch(url, { headers: H });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

// Hard cap receipted: 40 pages x 100 = 4000. If we come back with exactly
// 4000, the account outgrew the map and the true count is unknown-by-this-run.
const repos = [];
for (let p = 1; p <= 40; p++) {
  const b = await api(`https://api.github.com/users/${OWNER}/repos?per_page=100&page=${p}`);
  if (!Array.isArray(b) || b.length === 0) break;
  repos.push(...b);
  if (b.length < 100) break;
}

// ---- classifier v2 -------------------------------------------------------
// One table, family precedence = array order (same as v1's classify()).
//   [family, name-regex (v1-identical), description synonyms]
// v1 name regexes preserved verbatim from classify():
//   jev /jev/ · latent /jepa|latent/ · moth /moth|quantum/
//   qthe /qthe|canon/ · quilt /quilt/ · fleet /fleet|seeds|crab/
// (v1's unused FAMILIES/familyOf regex variants removed — dead code; the
//  operative classifier was classify() and its behavior is unchanged.)
const FAMILIES = [
  ['jev',    /jev/,             ['jev', 'living model', 'living-model', 'jepa', 'latent']],
  ['latent', /jepa|latent/,     ['jepa', 'latent', 'latent space', 'latent grid', 'world model', 'world-model']],
  ['moth',   /moth|quantum/,    ['moth', 'quantum', 'seal']],
  ['qthe',   /qthe|canon/,      ['qthe', 'canon', 'ternary', 'hyper-embedding', 'two-reader', 'two reader']],
  ['quilt',  /quilt/,           ['quilt', 'reactive cell', 'cell runtime', 'sheet']],
  ['fleet',  /fleet|seeds|crab/,['fleet', 'agent', 'lane', 'receipt', 'crab', 'seeds']],
];
const hitsIn = (text, kws) => {
  const t = (text || '').toLowerCase();
  return kws.filter((k) => t.includes(k));
};
// Deterministic, ordered rules. Name stage first; description stage scores
// every family and keeps the strictly-best (first-max ⇒ precedence wins ties).
function classify(name, description) {
  for (const [f, re, kws] of FAMILIES) {
    if (re.test(name)) {
      const hits = hitsIn(name, kws);
      return { family: f, stage: 'name', hits: hits.length ? hits : [name.match(re)[0]] };
    }
  }
  let best = null;
  for (const [f, , kws] of FAMILIES) {
    const hits = hitsIn(description, kws);
    if (hits.length && (!best || hits.length > best.hits.length)) {
      best = { family: f, stage: 'description', hits };
    }
  }
  if (best) return best;
  return { family: 'other', stage: 'none', hits: [] };
}

const sorted = [...repos].sort((a, b) => (a.pushed_at < b.pushed_at ? 1 : -1));
const TOPN = 24;
const top = sorted.slice(0, TOPN);

// CI coverage on the top slice (cheap: contents API on .github/workflows)
const coverage = [];
for (const r of top) {
  let wf = [];
  try {
    const c = await api(`https://api.github.com/repos/${OWNER}/${r.name}/contents/.github/workflows`);
    if (Array.isArray(c)) wf = c.map((x) => x.name);
  } catch { /* 404: no workflows dir — honest gap */ }
  coverage.push({ repo: r.name, workflows: wf, pushed_at: r.pushed_at, size_kb: r.size });
}

const byFamily = {};
const classification = {};
const byStage = {};
for (const r of repos) {
  const c = classify(r.name, r.description);
  (byFamily[c.family] ||= []).push(r.name);
  // evidence tuple: [family, stage, matched keywords ("|" joined), language]
  classification[r.name] = [c.family, c.stage, c.hits.join('|'), r.language || ''];
  const s = (byStage[c.stage] ||= {});
  s[c.family] = (s[c.family] || 0) + 1;
}

const atlas = {
  generated_at_utc: new Date().toISOString(),
  account: OWNER,
  total_repos: repos.length,
  families: Object.fromEntries(Object.entries(byFamily).map(([k, v]) => [k, v.length])),
  families_by_stage: byStage,
  family_members: byFamily,
  classification,
  top_motion: coverage,
  notes: [
    'v2 (53-e): families match NAME first (precedence jev>latent>moth>qthe>quilt>fleet, unchanged from v1), then DESCRIPTION substring scoring (small synonym table per family, ties broken by precedence); residue stays "other" — families now use descriptions and are still imperfect on purpose',
    'per-repo evidence lives in classification: [family, stage in {name,description,none}, matched keywords "|" joined, language] — audit the map, do not trust it blind',
    'CI coverage is measured only on the top_motion slice (API economy); absence elsewhere is UNMEASURED, not zero',
    'hard cap 40 pages x 100 = 4000; if total_repos == 4000 the account outgrew the map and the true count is unknown-by-this-run (raise the cap next run)',
  ],
};
writeFileSync('atlas.json', JSON.stringify(atlas, null, 2) + '\n');

const table = coverage
  .map((c) => `| ${c.repo} | ${c.workflows.length ? c.workflows.join(', ') : '— none —'} | ${c.pushed_at.slice(0, 16).replace('T', ' ')} |`)
  .join('\n');
const famLine = Object.entries(atlas.families)
  .sort((a, b) => b[1] - a[1])
  .map(([k, v]) => {
    const desc = (byStage.description || {})[k] || 0;
    return `${k}=${v}${desc ? ` (name ${v - desc} · desc ${desc})` : ''}`;
  })
  .join(' · ');

const block = `<!-- ATLAS:BEGIN (generated by scripts/build_atlas.mjs — do not hand-edit inside markers) -->
**${atlas.total_repos} repos** · families (v2: name → description): ${famLine} · generated ${atlas.generated_at_utc}

v2 evidence rule: every repo's [family, stage, matched keywords, language] is recorded in atlas.json → \`classification\`. Descriptions joined the classifier; "other" is still honest residue. CI is probed only on the top-motion slice — absence elsewhere is UNMEASURED, not zero.

### Top motion (24 most recently pushed) and their CI

| repo | workflows | last push (UTC) |
|---|---|---|
${table}

Missing rows in the table are below the motion cut — see atlas.json for the full inventory.
<!-- ATLAS:END -->`;

const readmePath = 'README.md';
let readme = readFileSync(readmePath, 'utf8');
readme = /<!-- ATLAS:BEGIN[\s\S]*<!-- ATLAS:END -->/.test(readme)
  ? readme.replace(/<!-- ATLAS:BEGIN[\s\S]*<!-- ATLAS:END -->/, block)
  : readme + '\n' + block + '\n';
writeFileSync(readmePath, readme);

const stageLine = Object.entries(byStage)
  .map(([s, m]) => `${s}=${Object.values(m).reduce((a, b) => a + b, 0)}`)
  .join(' · ');
console.log(`atlas built: ${atlas.total_repos} repos, ${coverage.length} CI-probed, families ${famLine}`);
console.log(`stages: ${stageLine}`);
