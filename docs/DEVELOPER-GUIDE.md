# quilt-atlas — Developer Guide

For developers extending the map (new families, new metrics, new audits) or appending to
the studies/SEED DNA layers. Everything here is verified against the repo at HEAD.

## Code layout

```
quilt-atlas/
├── scripts/build_atlas.mjs      # THE pipeline (215 lines, zero-dep Node). Sections:
│                                #   pagination (Link-header follow, 120-page cap) →
│                                #   classifier v2 (FAMILIES table) → top-motion slice →
│                                #   CI coverage probe → atlas.json → README block regen
│                                #   → env-gated ATLAS_DUMP audit lane
├── .github/workflows/atlas.yml  # cron '17 */6 * * *' + workflow_dispatch; Node 20;
│                                #   commits atlas.json + README.md as "quilt-atlas bot"
├── atlas.json                   # generated map (36k+ lines): the machine-readable truth
├── README.md                    # prose + generated block between ATLAS:BEGIN/END markers
├── studies/                     # append-only research layer (16 studies + data/)
│   ├── MECHANICAL-M1-74.md … MECHANICAL-M5-78.md   # the mechanical-learning program
│   ├── REHYDRATION-72.md · PROMISE-CENSUS-72.md · JEV-CALIBRATION-74.md
│   ├── REFLEX-ROUTER-75.md · ANIMAL-AI-LATTICE-72.md · GRAPH-R2-72.md
│   ├── CELL-LAB-ROUND3-72.md · CELL-LAB-ROUND4-72.md · DEEP-STUDY-71-legacy-corpora.md
│   ├── REPO-CHORES-74.md
│   ├── w71-dag-receipt.json · w71-seal-chain.jsonl # wave-71 replay/seal receipts
│   └── data/                    # preregs (prereg_round3/4.md, w75-router-prereg.md),
│                                #   round ledgers (round3/3b/4.jsonl), result JSONs
│                                #   (w72-*, w74-m1, w75-router, w76-m3, w77-m4, w78-m5)
├── seed-dna/
│   ├── seed-dna-catalog.md      # 1,068 lines: §0 genetic code, §1 families, §2 synergy
│   │                            #   map, §3 boilerplate, §4 method receipt, + wave-68/70
│   │                            #   addenda
│   └── seed-dna.json            # 49 machine-usable DNA entries
├── NIGHT-SHIFT-REPORT.md        # wave-67 operational snapshot
└── RELEASES-STATUS.md           # wave-66 publishing census + where-ready queue
```

There is no package.json, no lockfile, no dependencies. Node >= 18 (global `fetch`);
CI pins Node 20.

## Core concepts (named as the code names them)

- **FAMILIES table** — `[[family, nameRegex, descriptionSynonyms], ...]` in strict array
  order. Order IS precedence: `jev > latent > moth > qthe > quilt > fleet`. The v1 name
  regexes are preserved verbatim (see the comment block in build_atlas.mjs); the synonym
  lists are the v2 addition.
- **classify(name, description) — the 3-stage classifier.** Stage `name`: first regex hit
  wins. Stage `description`: substring-score the description against every family's
  synonyms; strictly-greater score wins, so first-max = precedence breaks ties. Stage
  `none` → family `other` (honest residue).
- **classification (evidence tuple)** — `atlas.json → classification[repo] =
  [family, stage, "kw1|kw2", language]`. This is the map's auditability contract: every
  assignment shows its work.
- **top_motion** — the 24 most recently pushed repos (`TOPN = 24`), each probed once via
  the contents API for `.github/workflows`. A 404 becomes an empty workflow list — an
  honest gap, not an error.
- **Pagination receipts** — `pages_fetched`, `pagination_cap` (120), `pagination_cap_hit`.
  The README block states the true count and flags a capped run; a bounded run can never
  masquerade as a full inventory.
- **ATLAS_DUMP** — env-gated audit lane: writes `[{name, description, family, stage,
  hits}]` to the given path. This is how the 54-c (fleet) and 55-c (qthe) keyword audits
  read real text.
- **notes** — audit verdicts are appended to `atlas.json → notes` so every scheduled regen
  carries them forward.

## How to extend

### Add a family (or change synonyms)

1. Edit the `FAMILIES` table in `scripts/build_atlas.mjs` — order fixes precedence, so
   place the new row where its precedence belongs:

```js
const FAMILIES = [
  ['jev',    /jev/,             ['jev', 'living model', 'living-model', 'jepa', 'latent']],
  // ... insert, e.g. a new family between latent and moth:
  // ['organ', /organ/,          ['organ', 'witness', 'custody']],
];
```

2. Bump the header comment (`v2/v3/v3.1 ...` history is maintained in-file) and note the
   change in `atlas.json → notes` (add to the array literal at the bottom) so scheduled
   regens carry the rationale.
3. Run once with a token and diff `atlas.json` — expect `families_by_stage` to shift;
   sanity-check a few `classification` tuples before committing.
4. Follow the audit discipline: a new synonym list deserves a deterministic 30-repo sample
   audit (see the 55-c pattern in the notes) before or shortly after it ships.

### Add a metric to the top-motion slice

The `coverage` loop is the place:

```js
for (const r of top) {
  let wf = [];
  try {
    const c = await api(`https://api.github.com/repos/${OWNER}/${r.name}/contents/.github/workflows`);
    if (Array.isArray(c)) wf = c.map((x) => x.name);
  } catch { /* 404: no workflows dir — honest gap */ }
  coverage.push({ repo: r.name, workflows: wf, pushed_at: r.pushed_at, size_kb: r.size });
}
```

Add fields to `coverage.push({...})` and, if they belong in the human view, to the `table`
template and the `block` literal near the bottom. Keep every new number receipted in
`atlas.json` too — the README block is a rendering, atlas.json is the record.

### Add an audit dump consumer

`ATLAS_DUMP` writes JSON; downstream tooling (as in the 54-c/55-c audits) reads it
deterministically. Do not widen the dump schema casually — audit scripts key on
`name/description/family/stage/hits`.

### Add a study (the studies layer's contract)

1. One markdown file per study: `studies/<NAME>-<WAVE>.md` (e.g. `MECHANICAL-M4-77.md`).
2. Header must carry: wave, task ID, date, lane, preregistration path (with stamp/sha when
   one exists), artifact paths, and the verdict line — see any existing study header.
3. Copy the load-bearing result JSONs / preregs into `studies/data/` (naming convention:
   `w<wave>-<name>.json`, `prereg_round<N>.md`, `round<N>.jsonl`).
4. Book failures verbatim. M1's registered P2 FAIL is the layer's most-cited row; the
   honest-failure rule is what makes verdicts load-bearing.
5. Append-only: never rewrite a past study; addenda live in new files or explicit Addendum
   sections (see the SEED DNA catalog's wave-68/70 addenda).

## Testing

There is no test suite and no CI check beyond execution. The de-facto verification ladder:

```bash
node --check scripts/build_atlas.mjs                        # syntax
GITHUB_TOKEN="$(gh auth token)" node scripts/build_atlas.mjs # full run (needs token)
git diff --stat                                              # expected: atlas.json + README.md only
jq -e '.pagination_cap_hit == false and .total_repos > 0' atlas.json  # shape sanity
```

Green means: run completes, `pagination_cap_hit=false`, README block replaced in place
(exactly one ATLAS:BEGIN marker), and family counts in the README block match
`jq '.families' atlas.json`. The scheduled workflow is the standing regression harness:
it runs every 6 hours and commits only when the output changed.

## Conventions

- **Task IDs everywhere**: classifier versions (53-e, 54-c, 55-c), studies (74-b, 75-a,
  76-a...), workflow lanes. New work gets a Task ID and records it in the wave journal
  (superinstance-lab → worklog.md).
- **Append-only**: studies and seed-dna chapters are never deleted or rewritten; the atlas
  map itself is regenerated in full each run but the *history* lives in git commits
  (`atlas: scheduled regen <ts>`).
- **Receipts before claims**: numbers without `generated_at_utc` or a study header are
  unbooked. Preregistrations are stamped before runs (sha256 in the study headers).
- **Honest gaps stay visible**: `— none —` in the CI table, `other` as a family,
  `UNMEASURED` for unprobed slices, `pagination_cap_hit` for bounded runs. Never fabricate
  a number to fill a hole.
- **Commit style**: the bot commits `atlas: scheduled regen <YYYY-MM-DDTHH:MMZ>`; human
  lanes write descriptive messages with the task ID.

## Gotchas for editors

- The README block regex `/<\!-- ATLAS:BEGIN[\s\S]*<\!-- ATLAS:END -->/` replaces the FIRST
  marker pair to the LAST end marker — if you duplicate the markers by hand, both spans
  collapse into one block on the next run.
- `build_atlas.mjs` resolves `README.md` and `atlas.json` from the CWD, not from the script
  location. Run from repo root (`node scripts/build_atlas.mjs`), never from `scripts/`.
- The `famLine` renderer only annotates families that have description-stage members
  (`desc ? ... : ''`); a name-only family shows a bare count. Do not "fix" this asymmetry
  without reading the 54-c/55-c audit notes.
- Classification is case-insensitive via `toLowerCase()` on BOTH name and description in
  `hitsIn`, but name regexes are case-sensitive-ish by convention (`/jev/` matches
  lowercase only in the regex — however `re.test(name)` runs on the raw name, so a repo
  named "JEV-foo" would NOT match stage-1; it can still land via description scoring.
  Verified behavior: regexes test the raw name, synonyms test the lowercased text).
- `atlas.json` is ~36k lines and fully rewritten per run — do not hand-merge diffs;
  regenerate instead.
- The workflow uses `concurrency: atlas-regen` with `cancel-in-progress: false` — a manual
  dispatch just after a scheduled start will queue, not race.
