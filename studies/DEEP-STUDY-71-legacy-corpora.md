# DEEP-STUDY-71: The Three Legacy Corpora — synesis-research, papermill, animal-ai

**Wave-71 keeper study** · 2026-10-01 · Task IDs 71-0..71-6 · instruments: 3 parallel deep-read
subagents, quilt-neighbourhood v0.4.0 CellDiff DAG replay, quilt-fleet-tools bench-seal,
deepinfra relational session (MiMo-V2.6-Flash + Seed-2.0-mini), numpy Jacobi potential fields.

The user's premise, verified exactly: synesis-research is 502/506 markdown blobs, papermill is
245/288, animal-ai is 902 YAML + 61 PNG (11 GIF at HEAD; the 23rd lives in history). All three
cloned, inventoried, deep-read, replayed through our tools, and probed. Receipts sealed.

---

## 1. What the three corpora ARE

### C1 — synesis-research: the design canon that preceded everything
A single-commit archive ("Archive Curator", 2026-09-22) of **58 planned Rust crates designed and
never built** — 502 markdown files, 825k words, median 2,087 words/file, one rigid 10-doc
template per crate (01-research … 10-index), written by an autonomous **"Ralph Loop Mode"**
agent (Claude Sonnet 4.5) in two campaigns (2025-01, 2026-01) that died around tool ~60 of a
100-tool plan. STATUS.md says it outright: *"the designs are the artifact."*

The corpus is a fossil record of the pre-measurement era: every file announces its own
completeness (`<promise>TXRS_COMPLETE</promise>` — 33 files, 27 crates), self-reports honest
cost lines (*"Total Research Time: 3 hours"*), and — fatally — prints fictional performance
tables (tx-rs: *"4,273 tx/sec"* for code that never existed). The link graph carries no
intellect: 37 components, hubs are template nav files (examples.md, dev-guides). The
co-mention graph is the real structure: 3,699 edges, **one giant component**, hubs
tx-rs / scheduler-rs / statemachine-rs — everything claims integration with orchestration.

Fertile survivors: promise tokens (proto-bench-seal), the named-loop methodology with honest
cost lines (proto-keeper discipline), the "No CLI — Library Only" honest-refusal slot (proto-
judge-gate refusal), self-measured output contracts ("Total Words: 18,759"), library-first
doctrine. Dead: the crates, the consensus dependency (tripartite-rs), the perf fiction.

### C2 — papermill: the 48-hour theory mill
A fork of Lucineer/papermill in which one agent (CedarBeach2019, 96 of 101 commits, 2026-04-01
→ 04-13) mass-produced **245 essays / 498k words in ~48 hours** inside the "cocapn vessel"
fiction — 77 "Wave" commits, machine cadence (05:00–09:00 peak, no sleep gap), multi-model
attribution headers (47 "Written by Gemini…", ~30 DeepSeek). The history is **extrusion, not
smithing**: 282/294 files ever touched were touched exactly once; the only "forged" artifacts
are the README (5 versions, 3 authors) and one flagship paper (3 versions). Zero wiki-links:
245 monads.

The theory layer is the payload, and it is directly ancestral to the current program:
**Accumulation Theorem** (context as sole moat), **crystallization/rehydration** (crystallized
knowledge decays; needs a scheduler), **Conservation of Intelligence / deadband** ("the best AI
agent uses the least AI"), **typed deckboss cells** (STANDARD/CLAW/RUNTIME/GATE/UI/TWIN with
latency budgets — the cell vocabulary two waves before quilt cells), **Universal Handoff RFC**,
8-tier emergence thresholds. It stopped because the mission self-completed (Wave 77 landed),
upstream reasserted the fiction, and its own audit verdict ("a static repo of PDFs is a 3/10")
was heeded — the fleet moved from *writing about* accumulation to *measuring* it.

### C3 — animal-ai: the pristine Olympics archive
A fork of Kinds-of-Intelligence-CFI/animal-ai (Crosby et al., the Nature MI Animal-AI Testbed
paper). HEAD is a **docs+configs tree with zero code** — the 900 competition arena YAMLs form a
**perfect lattice: 10 cognitive families × 30 days × 3 variants**, machine-readable
positions/sizes/valence, 903/903 parse. Family signatures are clean: 04 owns hazards
(DeathZone ×178), 07 is object-permanence-in-the-dark (blackouts in all 90), 09 is multi-goal
harvesting (GoodGoalMulti ×405, richest pass marks), 10 is movable-block puzzles (t=500).
The fork side (Ibrahim Alhas, 511 commits 2023–2024) contributed docs/CI/raycaster patches and
**touched zero corpus YAML**; the archive is upstream's, shepherded.

---

## 2. Simulation in our tools — the CellDiff DAG replay (Task 71-3)

Every commit became a representative diff (commit topology incl. merges); every changed file a
CellDiff (cell=path, value={blob-sha12}, parents=[rep, last-diff-on-cell]); the P1–P5 fold then
ran against ground truth HEAD:

| repo | commits | diffs | fold vs HEAD | verdict |
|---|---|---|---|---|
| papermill | 101 (0 merges) | 359 | 248 cells == 248 paths, 0 missing 0 extra | **CONVERGED == HEAD** |
| synesis-research | 1 | 507 | 506 == 506 | **CONVERGED == HEAD** (degenerate single wave) |
| animal-ai | 766 (45 merges) | 37,523 (incl. 13,062 reconciliation) | 1,017 == 1,017 | **CONVERGED == HEAD** |

Two genuine semantics findings, earned through failures (honest log: rename-as-delete+create;
`-z` parsing; merge invisibility; two instrument iterations):

1. **Git merges are reconciliation events, not diff-DAG folds.** No per-commit diff stream can
   see a branch-side add that the merge silently dropped — the merge RESULT tree is a
   fourth input our fold does not model. Fix: at each merge, assert the merge tree against
   BOTH parents (13,062 reconciliation diffs in animal-ai = the measured surface where git's
   resolver overrides P1–P5). This is the exact boundary between *replica convergence*
   (no resolver; P1–P5) and *reconciliation* (a resolver exists; assert its output).
2. **A remove is a first-class head.** Our replay's per-cell "last head" map initially ignored
   removes, so a post-tombstone set hung off the last SET, leaving the tombstone a concurrent
   sibling → P2 remove-wins buried the resurrection (905 false-dead cells). Authoring replicas
   must chain causally through tombstones. Candidate regression test for quilt-neighbourhood.

---

## 3. Relational session — cross-corpus graph learning (Task 71-4)

deepinfra long session (receipts in `scripts/w71_relational_out.txt`, `w71_t1_graph.txt`;
~$0.006 total). MiMo produced a 12-edge typed graph (value/route/payload per edge); Seed-2.0-mini
audited adversarially: **3 KEEP / 3 KILL**. The surviving structure is the finding:

> **The three corpora never referenced each other** (C1: zero wiki-links, 2 cross-crate links;
> C2: zero wiki-links; C3: fork-side zero YAML edits). The only evidenced flows run
> **corpus → fleet, through today's tools**: the DAG replay (dataset-for all three),
> bench-seal (instrument-for C1's promise tokens), judge-gate (antidote-to C1's perf fiction),
> the SoA rasterization (dataset-for C3). **The fleet is the first component that connects the
> corpora.**

The rediscovery table (8 rows) maps the same ideas re-appearing across eras, each rediscovery
adding teeth: completion tokens → bench-seal hash chains; refusal slots → verified judge-gate;
deckboss cell typing → executable merge semantics; rehydration-theorem → rehydrator-with-proof
(exact HEAD reconstruction); least-AI motto → instrument-verified model selection; write-once
immutability → append-only diffs with representable deletion.

## 4. The three registered probes — run today, honest verdicts (Task 71-5)

| probe | registered prediction | verdict | measured |
|---|---|---|---|
| P1 synesis-promise-seal | promise→artifact linkage ≤ 5% | **PASS** | 33 promise files, 0 linked to any implementation byte: **0.0%** |
| P2 papermill-decay-rehydrate | full stream == HEAD byte-identical AND 50%-truncated stream diverges | **PASS** | full: 248==248 identical; 50% truncation (51 commits): **117 divergent paths** |
| P3 animal-ai-potential-label | family 04 mean ≤ −0.30 AND only negative family; 01/02/03 ≥ +0.45 | **FAIL** | family 04 mean −0.043; negative families {04, 07}; 01/02/03 ≈ +0.01..+0.04 |

P3's kill-condition fired exactly as designed, and the failure is the lesson: the thresholds
were extrapolated from a **6-arena point sample** (V=0.539/0.007/−0.633) and do not generalize
to family means. The measured structure beneath the failed thresholds: family 04 is still the
unique hazard signature — **83% of its arenas have negative potential at spawn** (min −0.635,
matching the sample's −0.633) vs ≤21% everywhere else. Next-time discipline: register
**fractions and orderings**, not mean thresholds extrapolated from n=6. (Instrument fidelity
note: a first coarser port FAILED differently — bbox-filled goals sealed agent pockets —
before the faithful point-source mapper ran; both receipts kept. 876/900 arenas scored.)

## 5. What we do with this (wave-72 queue seeds)

1. **Tombstone-head regression test** for quilt-neighbourhood (from finding 2) — small, sharp.
2. **Reconciliation-event RFC**: model merge-reconciliation as a first-class diff type
   (P8?) carrying the resolver's authority — the DAG replay is its existence proof.
3. **C2 rehydration scheduler**: papermill's crystallization problem is now measured (P2's
   117-path decay curve) — a degradation-aware re-vendor scheduler has a real dataset.
4. **C3 as the cell-lab's spatial benchmark**: 900 labeled arenas, 10 families, machine-
   checkable difficulty (potential fields, blackouts as time-varying resistance) — the
   substrate benchmark quilt-mojo-lab lacks.
5. **Promise-token census as a standing fleet instrument**: P1 took minutes; every repo gets
   a promise→artifact linkage line in its atlas entry.

## 6. Receipts & artifacts

- Clones: `study/synesis-research` (11M), `study/papermill` (140M), `study/animal-ai` (155M, partial)
- Manifests: `study/_*-manifest.json` (per-extension path lists)
- Study agents: 3 parallel deep-reads (41 + 65 + ~20 files read; sampling stated in each)
- Replay: `scripts/w71_dag_replay.mjs`, `scripts/w71_dag_out.json` (convergence: all TRUE)
- Relational: `scripts/w71_relational.mjs`, `w71_t1_graph.txt`, `w71_relational_out.txt`
- Probes: `scripts/w71_probes_1_2.mjs`, `w71_probe1.json`, `w71_probe2.json`,
  `w71_probe3_arenas.py`, `w71_probe3.json`
- Deep-read agents' scripts: `synesis_corpus_study_71_2a.py`, `papermill_churn.py`,
  `a71_yaml_corpus_scan.py`, `a71_arena_to_cells.py` (+ taxonomies)
