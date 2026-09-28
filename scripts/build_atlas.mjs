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
//
// v3 (task 54-c): pagination follows the Link header (rel="next") until the
//   account is exhausted, bounded by a hard safety cap of 120 pages
//   (12000 repos). The old 40-page cap pinned the map at exactly 4000 —
//   the account outgrew it. Pages fetched + cap-hit are receipted in
//   atlas.json (pages_fetched / pagination_cap / pagination_cap_hit).
//   Env-gated ATLAS_DUMP=<path> writes a per-repo audit dump
//   (name, description, family, stage, hits) so keyword-precision audits
//   (54-c fleet audit and successors) read real text, not guesses.
//
// v3.1 (task 55-c): NO classifier change. qthe synonym audit executed per the
//   54-c queued finding: 30-repo deterministic sample of the desc-stage qthe
//   population read by hand (87% strict precision, ≥ 70% bar) ⇒ synonym table
//   KEPT; the "canonical"-adjective residual is census-receipted in notes.
//   Audit verdict lives in atlas.json notes so scheduled regens carry it.

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

// Pagination receipted: follow Link headers (rel="next") page by page until
// the account is exhausted; the hard safety cap of 120 pages only exists so
// a runaway account can never loop forever. If pagination_cap_hit is true,
// the cap bound the run and the true count is still unknown-by-this-run.
const PAGES_CAP = 120;
const repos = [];
let pages = 0;
let hardCapHit = false;
let nextUrl = `https://api.github.com/users/${OWNER}/repos?per_page=100&page=1`;
while (nextUrl) {
  const r = await fetch(nextUrl, { headers: H });
  if (!r.ok) throw new Error(`${r.status} ${nextUrl}`);
  const b = await r.json();
  if (!Array.isArray(b) || b.length === 0) break;
  repos.push(...b);
  pages++;
  // GitHub Link header shape: <url&page=N>; rel="next", <url&page=M>; rel="last"
  const m = (r.headers.get('link') || '').match(/<([^>]*)>;\s*rel="next"/);
  if (!m) { nextUrl = null; break; }            // no rel=next ⇒ exhausted
  if (pages >= PAGES_CAP) { hardCapHit = true; break; } // safety cap bound us
  nextUrl = m[1];
}
console.log(`pagination: ${pages} pages, ${repos.length} repos, hard-cap-hit=${hardCapHit}`);

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

// Audit lane (env-gated, off by default in scheduled runs): per-repo dump of
// the real description text beside the classification evidence. This is how
// keyword-precision audits stay honest — read the text, not the vibes.
if (process.env.ATLAS_DUMP) {
  const dump = repos.map((r) => ({
    name: r.name,
    description: r.description || '',
    family: classification[r.name]?.[0] ?? 'MISSING',
    stage: classification[r.name]?.[1] ?? 'MISSING',
    hits: classification[r.name]?.[2] ?? '',
  }));
  writeFileSync(process.env.ATLAS_DUMP, JSON.stringify(dump, null, 2) + '\n');
  console.log(`audit dump: ${dump.length} rows → ${process.env.ATLAS_DUMP}`);
}

const atlas = {
  generated_at_utc: new Date().toISOString(),
  account: OWNER,
  total_repos: repos.length,
  pages_fetched: pages,
  pagination_cap: PAGES_CAP,
  pagination_cap_hit: hardCapHit,
  families: Object.fromEntries(Object.entries(byFamily).map(([k, v]) => [k, v.length])),
  families_by_stage: byStage,
  family_members: byFamily,
  classification,
  top_motion: coverage,
  notes: [
    'v2 (53-e): families match NAME first (precedence jev>latent>moth>qthe>quilt>fleet, unchanged from v1), then DESCRIPTION substring scoring (small synonym table per family, ties broken by precedence); residue stays "other" — families now use descriptions and are still imperfect on purpose',
    'per-repo evidence lives in classification: [family, stage in {name,description,none}, matched keywords "|" joined, language] — audit the map, do not trust it blind',
    'CI coverage is measured only on the top_motion slice (API economy); absence elsewhere is UNMEASURED, not zero',
    'pagination follows Link headers (rel=next) until the account is exhausted, bounded by a hard safety cap of 120 pages (12000 repos); pagination_cap_hit=true would mean the cap bound the run and the true count is unknown-by-this-run',
    'fleet keyword audit (54-c): 30-repo deterministic sample of the description-stage fleet population (then 1153) read by hand — 25/30 genuinely fleet (83% strict, 27/30 counting defensible multi-agent-theory borderlines) ⇒ synonym table kept unchanged; 53-e suspicion that agent/lane/receipt hoover broadly is refuted on this account (surface at audit time: agent=844 · fleet=425 · crab=9 · lane=6 · receipt=6 · seeds=2); misses receipted in worklog 54-c (lau-compilers "agent DSL" tail-match, superinstance-embedder verb-matched "seeds")',
    'qthe keyword audit (55-c): 30-repo deterministic sample of the description-stage qthe population (then 427; surface ternary=402 · canon=25) read by hand — 26/30 genuinely qthe (87% strict, 28/30 = 93% counting two defensible ternary/fleet tie-zone borderlines: flux-realm "A2A orchestration with ternary event manifolds", superinstance-protocol "ternary conservation auditing for A2A messaging") ⇒ synonym table kept unchanged; the 54-c "canonical"-adjective suspicion CONFIRMED but bounded — full census of all 25 canon-surface repos: 9 adjective collisions (substrate-opposites, observation-primitive, compress-huffman-rs, huffman-code, plato-tile-import, plato-tile-spec, plato-tile-spec-c, jetson-grand-design, flux-isa-authority) vs 16 genuine canon-noun usages ("R10 substrate canon point as code", "The Quilt canon as code", "canon-aware", "the answer is canon"); residual ≈ 9 repos = 2% of desc-stage qthe, priced NOT fixed (family precision 87% ≥ 70% bar; stability rule forbids unforced reclassification); ternary surface clean in sample + red-flag scan of all 402 (ternary-compiler/-python are three-valued-logic compilers, not ?: operators); strategy-ecology stays qthe by receipted precedence (ternary substantive, fleet-subject tie zone — the 54-c named example)',
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
**${atlas.total_repos} repos** (${atlas.pages_fetched} pages, Link-follow cap ${atlas.pagination_cap}${atlas.pagination_cap_hit ? ' — CAP HIT, count bounded not total' : ''}) · families (v2: name → description): ${famLine} · generated ${atlas.generated_at_utc}

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
console.log(`atlas built: ${atlas.total_repos} repos across ${pages} pages, ${coverage.length} CI-probed, families ${famLine}`);
console.log(`stages: ${stageLine}`);
