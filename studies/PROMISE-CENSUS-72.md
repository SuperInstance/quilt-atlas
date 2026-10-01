# PROMISE-CENSUS-72 — promise→implementation linkage as a standing atlas instrument

Wave-72, task 72-c. Instrument: `fleet_tools.promise_census` + CLI subcommand
`python -m fleet_tools promise-census REPO...` (study/quilt-fleet-tools), unit
tests in `tests/test_promise_census.py`, combined artifact
`outputs/w72-promise-census.json` (snapshot 2026-10-01, HEAD states below).

## 1. Why

Wave-71 PROBE-1 (synesis-promise-seal) showed synesis-research carries 33
promise files (planned-crate / roadmap / `<promise>…</promise>` commitment
markdown) with **0 linkage to any implementation byte → 0.0%**, PASSing the
pre-registered ≤5% "fiction-sealed" prediction. Wave-72's seed asks to
generalize that one-off probe into a standing instrument that runs on ANY repo
— including our own, as an honest mirror.

## 2. Method (deterministic, offline, no LLM)

1. **Promise documents** — every markdown file whose text matches any
   forward-looking commitment pattern:
   - `promise_tag`: literal `<promise>[A-Za-z0-9_]+</promise>` (wave-71's marker);
   - `roadmap_header`: headers `^#{1,6} … \b(roadmap|planned|plan|planning|upcoming|backlog|future work|next steps|milestones?|todo|specs?|specifications?)\b`;
   - `we_plan`: "we/I plan|intend|aim|expect|propose|commit to";
   - `will_commit`: "will/shall [be] implement|add|support|ship|release|provide|build|deliver|land|publish|introduce|extend|replace|migrate|include|cover…";
   - `todo_implement`: "TODO:", "not yet implemented", "to be implemented";
   - `planned_crate_list`: "planned|proposed|future|upcoming + crates|modules|packages|components|cells".
   Bare "will" is deliberately NOT a trigger ("the sauce will thicken" is not a
   commitment); the verb-constrained form is. Code fences are excluded.
2. **Promise units** — bullet/list items (per-unit, deduped) plus
   crate/module-style identifiers (backticked spans, `snake_case`,
   `CamelCase`, `*-rs` crates, dotted/slashed paths; ≥3 chars; capped at
   200/doc). A unit is a checkable claim.
3. **Implementation bytes** — code/build/config text files (py rs js ts c go
   … toml yaml json lock …, Makefile/Dockerfile), binary-skipped (NUL probe),
   1 MB/file cap. Markdown, prose-data (`.txt`/`.csv`) and repo plumbing
   (LICENSE, .gitignore) do NOT count — mirrors PROBE-1's registered
   code-extension definition while generalizing to polyglot repos. (First
   draft counted LICENSE/.txt; synesis then "linked" promises to its MIT
   license text and a `.research_summary.txt` notes file — plumbing, not
   implementation. Tightened before any results were booked.)
4. **Linkage** — a unit is LINKED iff one of its own identifiers (case-
   sensitive substring) or one of its distinctive bigrams (2 consecutive
   words, lowercased, alphanumeric-only, both ≥3 chars, non-stopword)
   appears in the implementation corpus. Otherwise UNLINKED.
5. **Output** — per repo `{promise_docs, promise_units, linked_units,
   linkage_ratio, impl_files, impl_bytes, unlinked_examples[≤20],
   linked_examples[≤20], pattern_hits, notes, [promise_doc_paths],
   [cross_check]}` as JSON, arg-order stable.

## 3. Results (6-repo census)

| repo | promise docs | promise units | linked units | linkage | impl files | impl bytes |
|---|---|---|---|---|---|---|
| synesis-research | 173 | 15,940 | 0 | **0.00%** | 0 | 0 |
| papermill | 52 | 2,547 | 63 | **2.47%** | 1 | 5,505 |
| quilt-neighbourhood | 0 | 0 | 0 | **n/a (0.00%)** | 18 | 141,707 |
| quilt-fleet-tools | 0 | 0 | 0 | **n/a (0.00%)** | 34 | 132,716 |
| quilt-mojo-lab | 0 | 0 | 0 | **n/a (0.00%)** | 23 | 77,402 |
| quilt-atlas | 1 | 50 | 6 | **12.00%** | 6 | 996,598 |

Snapshot notes: quilt-atlas includes the concurrent wave-72 sibling commit
`5a86fd5` (animal-ai lattice study + `studies/data/`); quilt-mojo-lab's
working-tree census counts 3 untracked seal files under `outputs/seals/`
(the instrument reads the working tree as-is, so it works on non-git trees too).

**Cross-check vs wave-71 PROBE-1 (registered reproduction).** With
`--tag-crosscheck '<promise>[A-Z0-9_]+</promise>'` on synesis-research:
`tag_files = 33` — **exactly the wave-71 count**; all 33 are also detected as
promise documents by the general patterns (33/33); among their **5,313 promise
units, 0 are linked** to implementation bytes → **tag linkage 0.0%** ≤ 5% →
the fiction-sealed prediction reproduces under the generalized unit-level
method. (PROBE-1 measured file-level linkage; both levels are 0.0 because
synesis contains zero implementation bytes — 502 markdown files, no code.)

The general detector flags 173/502 synesis docs as promise-bearing (155 via
roadmap-ish headers, 33 via tags, 13 via TODO-implement, 5 via will-commit;
patterns overlap) — a plan-dense corpus, exactly what the census should see.

**papermill (2.47%).** 52 of 245 essays flagged (business-plan/launch/roadmap
material). The repo's ONLY implementation-ish bytes are `business/cocapn.json`
(5.5 KB) — structured data extruded from the same business plan — and all 63
linked units match into it ("a2a protocol", "cocapn pro"). Under PROBE-1's
code-only definition papermill would be 0%: this is **plan→data-of-plan
self-linkage**, not fulfillment. No essay promise links to code, because
there is no code.

## 4. The honest mirror: our own repos

**Plainly: our repos' linkage ratios are 0.00% — but by absence of promises,
not by fulfillment.** The census detects **zero forward-looking commitment
documents** in quilt-neighbourhood, quilt-fleet-tools and quilt-mojo-lab: their
markdown (READMEs, EXPERIMENT.md, TEST-RECEIPT.md, RESULTS.md, MOJO-NOTES.md)
is written **after** the code as receipts — claims in table form, registered
bounds inline, failure conditions stated ("what counts as failure"), no
Roadmap/Planned/TODO sections, no "will implement". Docs-after-code makes the
synesis failure mode (promise documents with zero backing bytes) structurally
absent — there is nothing for the instrument to catch because there is nothing
forward-looking to verify. That is a process property we apparently already
hold ("same-day build → receipt → docs iterated FROM experience"), not a
scoring win, and it cuts both ways:

- the good part: no decorative roadmap → no fiction gap;
- the blind part: **0 promise docs = 0 census coverage, not 0 risk.** Silent
  scope-cutting (never writing the promise down) is invisible to a lexical
  instrument. If the fleet ever grows real roadmap docs, this census becomes
  the per-repo atlas line; today it certifies only that we don't write
  promises in markdown.

quilt-atlas is the one detected case, and it is an instructive false-ish
positive: the flagged doc is `studies/DEEP-STUDY-71-legacy-corpora.md` (via the
`promise_tag` pattern — the study *quotes* the synesis promise tokens), and its
6 linked units are corpus crate names (`tx-rs`, `scheduler-rs`,
`statemachine-rs`, `tripartite-rs`) that appear in `atlas.json`/data files
because the atlas indexes the corpora it studies. That is **linkage-by-study,
not linkage-by-fulfillment** — the name-collision limitation, demonstrated
inside our own repo on day one.

## 5. Relation to PROBE-1 and the atlas role

- PROBE-1 was a one-off, file-level, synesis-specific check; this instrument
  generalizes it to unit-level linkage on any repo, keeps the ≤5% fiction-seal
  vocabulary, and pins synesis as the negative control (0.0% reproduced).
- Atlas integration: every repo entry can now carry a promise-linkage line
  (wave-71 study's own recommendation: "every repo gets a promise→artifact
  linkage line in its atlas entry").
- Tooling receipts: 7 new offline unit tests (fixture repo with one linked +
  one unlinked promise; docs-only zero-linkage; n-gram linkage; tag cross-
  check; determinism; CLI). Full suite green alongside the existing
  instruments.

## 6. Limitations

1. **Lexical ≠ causal.** A name appearing in code is not fulfillment, and
   fulfillment without the same name is missed (linkage certifies overlap, not
   delivery).
2. **Name collisions.** Short/common identifiers and corpus names studied in a
   repo (see quilt-atlas above) create false links.
3. **Docs-as-code self-linkage.** READMEs quoting their own code link
   trivially; the instrument measures the gap, not authorship order.
4. **Detector coverage.** The pattern set catches explicit forward-looking
   commitments; promises phrased as goals without the listed cues are missed;
   stoplist and ≥3-char floors are judgment calls, all deterministic and
   versioned in the tool.
5. **Working-tree snapshot.** The census reads files as they are (including
   untracked artifacts); numbers move as sibling waves commit.
6. **Impl-bytes boundary.** Excluding prose-data/plumbing is required to
   reproduce PROBE-1 honestly, but a repo whose "implementation" is a .txt
   would read as docs-only.

## 7. Reproduce

```sh
cd study/quilt-fleet-tools
python -m pytest tests/ -q                      # 30 passed (7 are promise-census)
python -m fleet_tools promise-census \
  /home/z/my-project/study/synesis-research /home/z/my-project/study/papermill \
  /home/z/my-project/study/quilt-neighbourhood /home/z/my-project/study/quilt-fleet-tools \
  /home/z/my-project/study/quilt-mojo-lab /home/z/my-project/quilt-atlas \
  --tag-crosscheck '<promise>[A-Z0-9_]+</promise>' \
  --out /home/z/my-project/outputs/w72-promise-census.json
```
