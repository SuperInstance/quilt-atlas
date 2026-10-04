# quilt-atlas — Knowledge Map

The index of indexes for this repo. Everything deeper than the README routes from here.

## In this repo

- `scripts/build_atlas.mjs` — the entire pipeline in one zero-dep Node file: pagination,
  3-stage classifier, top-motion CI probe, atlas.json + README block emission, env-gated
  audit dump. The first thing to read and the only executable.
- `.github/workflows/atlas.yml` — the 6-hour cron (`17 */6 * * *`) + manual dispatch;
  commits regenerated files as the "quilt-atlas bot".
- `atlas.json` — the machine-readable map: `generated_at_utc`, `total_repos`,
  `pages_fetched` / `pagination_cap` / `pagination_cap_hit`, `families`,
  `families_by_stage`, `family_members`, `classification` (per-repo evidence tuples),
  `top_motion` (24 repos with workflow lists), `notes` (audit verdicts carried forward).
- `README.md` — prose + the generated block between `<!-- ATLAS:BEGIN -->` and
  `<!-- ATLAS:END -->` (counts, families, top-motion + CI table, honesty laws).
- `studies/` — the research layer (each file a self-contained study with header receipts):
  - `DEEP-STUDY-71-legacy-corpora.md` — the three legacy corpora (synesis-research,
    papermill, animal-ai), tasks 71-0..71-6; PROBE-2's exact-HEAD fold proof lives here.
  - `ANIMAL-AI-LATTICE-72.md` — full-corpus 900-arena scan (task 72-b), fraction/ordering
    predictions after wave-71's honest absolute-threshold FAIL.
  - `PROMISE-CENSUS-72.md` — promise→implementation linkage as a standing instrument
    (task 72-c).
  - `REHYDRATION-72.md` — decay curve + rehydration scheduler (task 72-e); logistic fit
    anchored at the two proven points.
  - `GRAPH-R2-72.md` — multi-model independent graph induction + 5-gram provenance probe
    (waves 72-f/72-g).
  - `CELL-LAB-ROUND3-72.md` / `CELL-LAB-ROUND4-72.md` — the M1-vs-M2 instrument under
    adversarial specs (s4) and degraded conditions (D1/D2/D3), waves 72-h/72-k.
  - `JEV-CALIBRATION-74.md` — Jev System-One vs 3-auditor majority (74-a); E1 FAIL
    booked with the reflex/reflect miss structure.
  - `MECHANICAL-M1-74.md` — fly motif on cells (74-b): P1/P3/P4 PASS, P2 FAIL booked →
    M2's hypothesis.
  - `REPO-CHORES-74.md` — pure repo engineering (74-d): slackwater-lattice hex_distance
    fix v0.1.1, DID-signed P8 events; zero LLM calls; key-scan 0 hits.
  - `REFLEX-ROUTER-75.md` — out-of-sample replication of the reflex/reflect router
    (75-a): 28/28 at 38% of pure-reflective cost.
  - `MECHANICAL-M2-75.md` … `MECHANICAL-M5-78.md` — rounds 2–5 of the mechanical-learning
    program (lateral inhibition FALSIFIED; evidence-gated commitment; EMA-gated
    commitment; the frozen-normalizer decomposition of M4's failure).
  - `w71-dag-receipt.json` — the wave-71 CellDiff DAG replay receipt (papermill: 101
    commits → 359 diffs → 248/248 paths converged, `converged: true`; animal-ai 766
    commits sampled in the same file).
  - `w71-seal-chain.jsonl` — the wave-71 seal chain.
  - `data/` — `prereg_round3.md`, `prereg_round4.md`, `w75-router-prereg.md` (frozen
    pre-registrations); `round3.jsonl`, `round3b.jsonl`, `round4.jsonl`,
    `round4_summary.md` (cell-lab ledgers); result/receipt JSONs `w72-audit-r2.json`,
    `w72-decay-curve.json`, `w72-lattice-900.json`, `w72-nemotron-diag.json`,
    `w72-probe-5gram.json`, `w72-rehydrate-decisions.json`, `w74-m1-results.json`,
    `w75-router.json`, `w75-router.expectation.json`, `w75-m2-results.json`,
    `w76-m3-results.json`, `w77-m4-results.json`, `w78-m5-results.json`.
- `seed-dna/seed-dna-catalog.md` — SEED DNA (wave-66 lane 66-a + wave-68/70 addenda):
  §0 the 8-primitive genetic code (cell, edge, tick, receipt, chain, projection, seal,
  fold) and the two signature constants (fnv1a64 café canary; organ triple
  `{hash, manifestHash, seq}`); §1 functional families (substrates, time organs, witness
  instruments, models-in-the-joint, swarm, organs, polyglot, creative skins); §2 synergy
  map; §3 missing-boilerplate distill list; §4 method receipt.
- `seed-dna/seed-dna.json` — 90 machine-usable DNA records (78 + 12 added by the wave-70
  addendum: essence, primitives, soft joints, time flows, synergies, distill_next per repo).
- `NIGHT-SHIFT-REPORT.md` — wave-67 night shift (2026-09-30): 8 repos shipped v0.1.0
  test-green, cross-lane PR events, organ/key status, dawn queue.
- `RELEASES-STATUS.md` — wave-66 publishing census (5,106 repos then): releases/packages/
  deployments/CI state, the where-ready release queue, "a release is a receipt, not a
  label" doctrine.
- `docs/` (wave-69) — this documentation package.

## Pre-existing docs (before wave-69)

- `README.md` — the map's front door: why an atlas, family definitions v2/v3, the two
  keyword-audit write-ups (54-c fleet, 55-c qthe), honesty laws, usage, the generated
  block, and the seed-dna chapter pointer.
- `NIGHT-SHIFT-REPORT.md` — wave-67 operational snapshot (see above).
- `RELEASES-STATUS.md` — wave-66 publishing deep-dive (see above).
- `studies/*.md` (15 files) — every study is itself documentation of the account's
  research record (see above for the per-file one-liners).
- `seed-dna/seed-dna-catalog.md` — the DNA catalog with its own method receipt (§4).
- `ORACLE.md`-style manifests do not exist here; there is no other prose doc. (No
  CONTRIBUTING/DESIGN/LICENSE files — an honest gap for a data/instrument repo.)

## In the fleet

- `SuperInstance/quilt` — upstream context: the reactive cell runtime whose ecosystem the
  atlas's `quilt` family names (sibling; atlas describes it, quilt does not depend on the
  atlas).
- `SuperInstance/fleet-seeds` — sibling: seed intake; the atlas maps the repos seeds
  become; SEED DNA's wave-66 lane read 47 of them.
- `SuperInstance/quilt-neighbourhood`, `SuperInstance/quilt-fleet-tools` — downstream
  instruments: studies in this repo (REHYDRATION-72, PROMISE-CENSUS-72) drove and were
  driven by their `fleet_tools` modules (rehydrate, promise_census).
- `SuperInstance/MicroMoth-quilt`, `SuperInstance/quilt-jev-toolkit`,
  `SuperInstance/jev-quilt` — repos the atlas classifies and the SEED DNA catalog
  dissects (substrates / organs). Nuance worth knowing: the operative classifier puts
  MicroMoth-quilt in `quilt` (the case-sensitive `/moth/` regex misses the capitalized
  "Moth"; see USER-GUIDE's worked example), while `jev-quilt` is `jev` by name.
- `SuperInstance/superinstance-lab` — the journal repo: worklog.md records every wave's
  entries; the atlas's own task IDs (52-a, 53-e, 54-c, 55-c, 66-a, 71-*, 72-*, 74-*,
  75-*, 76-a, 77-a, 78-a) are journal entries.
- `SuperInstance/agent-workspace-template` — pattern source for fleet repo scaffolding
  (relationship: none at runtime; atlas classifies it as fleet).

## In the journal

Local journal copy: `/home/z/my-project/worklog.md` (canonical:
SuperInstance/superinstance-lab → worklog.md). Grep `quilt-atlas`:

- Line ~700 (wave-50 era): fresh clone of quilt-atlas @ 67dbaf0 during the repo-sync
  census; "compose-don't-clobber" adopted.
- Line ~1227: the meta+external family decomposition task explicitly lists quilt-atlas
  (and quilt-codespace) among works decomposed into elementary parts.
- Line ~1426 (wave-69): remote census — quilt-atlas +38 commits behind at census time
  (other lanes pushing).
- In-repo task IDs carried by the repo's own artifacts: 53-e and 54-c (classifier v2/v3),
  55-c (qthe audit), 66-a (SEED DNA), 71-0..71-6, 72-b/72-c/72-e/72-f/72-g/72-h/72-k,
  74-a/74-b/74-d, 75-a/75-b, 76-a, 77-a, 78-a (studies). These are verified from the
  study headers and code comments in this repo; their full worklog entries predate the
  local journal copy's coverage in part — treat line-level verification of the study
  tasks against worklog.md as unverified where noted.

## Receipts of record

- `atlas.json` — THE receipt: a full-run snapshot with pagination + classification
  evidence. `generated_at_utc: 2026-10-04T12:20:07.272Z`, `total_repos: 5168`,
  `pages_fetched: 52`, `pagination_cap_hit: false`.
- README generated block — same run rendered for humans (52 pages, cap 120, top-24 CI).
- `studies/w71-dag-receipt.json` — replay convergence proof (papermill 248/248,
  `converged: true`).
- `studies/data/w75-router.json` (+ `.expectation.json`) — the registered router
  replication receipt (28/28, 38% cost).
- `studies/data/w74-m1-results.json` — M1's pre-registered results incl. the booked P2
  FAIL.
- `seed-dna/seed-dna-catalog.md` §4 — the method receipt for the DNA catalog (~200
  receipted API calls, 2026-10-02).
- `.github/workflows/atlas.yml` commit history — the standing liveness receipt
  (`atlas: scheduled regen <ts>` commits).

## How to search further

```bash
# Which family did a repo land in, and why?
jq -r '.classification["<repo-name>"]' atlas.json

# All repos matching a keyword at classification time
jq -r '.classification | to_entries[] | select(.value[2] | test("canon")) | .key' atlas.json
# Scope note: this returns 59 repos across all stages, while the audit text's "25
# canon-surface" figure (55-c) is description-stage only at audit time.

# Study claims about a topic (e.g. entropy gates, judges, decay)
grep -rn "entropy" studies/ | head -20
grep -rln "prereg" studies/data/

# The atlas's history of a repo's family assignments (needs git history)
git log --oneline -- atlas.json | head          # scheduled regen commits
git log -p -S '"MicroMoth-quilt"' -- atlas.json # when it entered/moved

# Journal trails
grep -n "quilt-atlas" /path/to/worklog.md
grep -n "54-c\|55-c\|66-a" /path/to/worklog.md

# CI coverage question for any repo NOT in top_motion: unmeasured by the atlas —
# check the repo's .github/workflows directly on GitHub.
```
