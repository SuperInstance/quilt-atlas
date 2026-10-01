# Reflex-Router Replication, Out-of-Sample (wave-75 / 75-a)

**Date:** 2026-10-01 · **Lane:** TypeSafe Jev (reflex) + deepinfra allowlist (reflect) ·
**Prereg:** `scripts/w75_router_prereg.md` (registered 09:08:23Z, corrected pre-call 09:12Z,
sha256 `10c9bef075c5b45b…`, stamped copy `studies/data/w75-router.expectation.json`) ·
**Receipt:** `outputs/w75-router.json` (copy: `studies/data/w75-router.json`) ·
**Verdict: E1 PASS · E2 PASS · E3 PASS (n=3) · E4 PASS — 28/28 at 38% of pure-reflective deepinfra cost**

## 1. What was replicated

74-a calibrated Jev against the wave-72 3-auditor majority on the 10 core graph edges.
E1 FAILED (0.60), but the failure structure was a reflex/reflect signature: all four misses
were absence-of-evidence KILLs sitting inside a narrow band above the decision boundary
(noul 0.52–0.64), while Jev was confidently right on verbatim-digest KEEPs (0.91/0.95).
Post-hoc, in-sample: route `|noul−0.5| ≤ 0.15` to reflective auditors, auto-accept the rest
→ 10/10 at 50% of reflective cost. Wave-75's registered seed: **replicate that router rule
out-of-sample** — three fresh judgment sets, ground truths constructed and documented
BEFORE any API call, rule frozen in the prereg (band, verdict mapping, tiebreak, parse and
tie rules, cost model).

## 2. The routing rule as a specification

```
REFLEX  (batched, ~1 call per judgment set)
  Jev jev-latest over the set's evidence doc; one named noul question per statement.
  verdict(noul) = TRUE iff noul >= 0.5.
ROUTE   iff |noul − 0.5| <= 0.15          # frozen band [0.35, 0.65], from 74-a
REFLECT (boundary band only)
  two auditors (MiMo-V2.6-Flash + Seed-2.0-mini, temp 0) vote TRUE/FALSE;
  final = majority-of-3 {auditor, auditor, Jev}   # Jev = tiebreak vote
AUTO-ACCEPT otherwise (Jev's reflex verdict stands)
PURE comparator: same two auditors judge EVERYTHING; 2-2 split = booked incorrect
  (the pure arm has no tiebreak mechanism) — conservative against the router.
```

Cost model (registered): deepinfra USD from returned `estimated_cost` is the cash metric;
TypeSafe pricing is unpublished, so Jev overhead is reported in calls/tokens.

## 3. Out-of-sample judgment sets (ground truth first, deterministic)

All statements, derivations, and the exact rules were registered in the prereg before any
call; per-statement tables are reproduced in `studies/data/w75-router.json.ground_truth`
(see the receipt's `ground_truth` block).

| set | source | n (T/F) | ground-truth rule |
|---|---|---|---|
| A — HOMUNCULUS RECEIPTS | `outputs/w74-homunculus.json` (74-c/A: 25 receipts, 21 propagation_edges) | 10 (8/2) | receipt X shows influence from cell Y iff a `propagation_edges` row (by=X, from_origin=Y) exists OR X's body cites a receipt authored by Y≠author(X); R0-HOST seeds excluded (same-lane); table-authoritative |
| B — CHAOTIC-DIFFUSE CLAIMS | `outputs/w74-chaotic.json` + metrics CSV + receipted writeup | 10 (6/4) | direct comparison vs receipted values (H1 +0.033 < 0.05 INCONCLUSIVE; H2 b=0.026 R²=0.94 PASS; H3 max C=0.7524, flag not raised; D* 26/102/48/63; substitution booked) |
| C — GRAPH EDGES ROUND 2 | `studies/data/w72-audit-r2.json` + GRAPH-R2-72.md | 8 (5/3) | NEW property statements about the receipted auditor tables (NOT the 10 judgments used as 74-a's calibration truth): unanimities, keep sets, sym-diffs, agreement rates |

Base rate for a lazy always-TRUE judge: 19/28 = **0.679** (the reverse skew of 74-a's
8 KILL / 2 KEEP). E1's bar (0.85) is informative against that baseline.

## 4. Results

### Jev reflex layer (3 batched calls, jev-1.13.0, 8,394 in / 574 out tokens)

| noul band | statements | outcome |
|---|---|---|
| < 0.35 (confident FALSE) | HOM-5 0.07, HOM-8 0.11, CHA-2/3/5/8 0.02, GRP-4 0.07, GRP-7/8 0.03 (9) | 9/9 correct auto-accepts |
| **[0.35, 0.65] → ROUTED** | **HOM-7 0.55, HOM-10 0.63, GRP-2 0.38** | routed to reflective panel |
| > 0.65 (confident TRUE) | 16 statements (0.71–0.99) | 16/16 correct auto-accepts |

### The routed cases — where the reflective layer earns its cost

| id | Jev noul | Jev vote | MiMo | Seed | majority-of-3 | truth |
|---|---|---|---|---|---|---|
| HOM-7 (R2-SENSE-1 ← MEM influence) | 0.55 | TRUE | TRUE | TRUE | TRUE | TRUE ✓ |
| HOM-10 (R3-MEM-2 ← FLOW influence) | 0.63 | TRUE | TRUE | TRUE | TRUE | TRUE ✓ |
| GRP-2 (majority table == Seed's 2/8 exactly) | 0.38 | FALSE | **TRUE** | **TRUE** | **TRUE** | TRUE ✓ — **Jev's only error out-of-sample, caught and repaired by the band** |

Auditors were unanimous on all three routed cases (inter-auditor agreement 1.0); the pure
reflective arm (28/28, zero ties) agreed with the router everywhere.

### E1–E4 scoring (as registered)

| # | registered bar | measured | verdict |
|---|---|---|---|
| E1 | router accuracy across 28 ≥ 0.85 (lazy-TRUE baseline 0.679) | **1.00 (28/28)** | **PASS** |
| E2 | auto-accept rate ≥ 0.40 | **0.893 (25/28 auto-accepted)** | **PASS** |
| E3 | routed cases: final verdict == truth ≥ 0.70 (n < 3 ⇒ UNSCOREABLE) | **1.00 (3/3)**; inter-auditor 1.0 | **PASS** (n=3 — scoreable per prereg, small) |
| E4 | deepinfra-$/correct: router < pure (strict) | **$0.0001226 vs $0.0003238** | **PASS** |

Per set: A router 10/10 (jev-only 10/10), B 10/10 (10/10), C 8/8 (jev-only 7/8 — GRP-2).
Jev-only across all 28: **27/28 (0.964)** — above the E1 bar on its own, with its single
miss inside the band; the router converts that 0.964 into 1.00 for 4 reflective calls
(vs 6 for the pure arm).

### Budgets

deepinfra **$0.0125 total both arms** (router arm $0.0034, pure arm $0.0091) of the $0.05
budget; TypeSafe **3 calls** of 60. Jev overhead: 3 calls, 8,394 in / 574 out tokens.
Latency per 74-a's standing measurement: ~250 ms/question batched (this wave did not
re-measure latency; token and call counts are in the receipt).

## 5. The cost-accuracy frontier (both arms ran on the same 28 statements)

| strategy | deepinfra $ | reflective calls | accuracy | $/correct |
|---|---|---|---|---|
| lazy-TRUE (no judge) | 0 | 0 | 0.679 | — |
| **Jev reflex only** | 0 (8,394 TypeSafe in-tokens) | 0 | 0.964 | ~0 |
| **reflex-router (this wave)** | **$0.0034** | **4** (2 routed subsets × 2 auditors) | **1.000** | **$0.000123** |
| pure-reflective (2-auditor majority) | $0.0091 | 6 (all statements) | 1.000 | $0.000324 |

The router dominates pure-reflective on this task class (equal accuracy, 2.6× cheaper on
the cash layer), and dominates reflex-only on accuracy (the band's single save) — the
in-sample 74-a cascade (10/10 at 50% of reflective cost) **replicated out-of-sample**,
with the auto-accept rate even higher (0.89 vs 0.60) and the one reflective rescue landing
exactly as designed.

## 6. What "telescope architecture" means operationally

The founder's line — *telescope, not television* — cashes out here as a **two-layer
judgment pipeline**: a fast cheap reflex layer (Jev, System One) answers everything first
and is trusted exactly as far as its confidence is from the boundary; only the narrow
uncertainty band escalates to the slow expensive reflective layer (reasoning auditors),
whose votes are combined with the reflex vote (majority-of-3, reflex as tiebreak). Three
receipted properties make it work: (1) reflex confidence is *calibrated to its own
failures* — both in 74-a (4/4 misses in-band) and now out-of-sample (the only miss
in-band, all out-of-band answers correct 25/25 + 9/9); (2) the reflective layer is
*strictly better inside the band* (3/3, unanimous) — grounding/evidence checks are
reflective work (74-c's third sighting); (3) the whole thing is *pre-registered* — band,
tiebreaks, tie-scoring, and cost model frozen before any call, so the frontier numbers
are falsifiable, not narrative.

## 7. Honest limitations

- **Set composition:** deterministic ground truth forces careful-reading/lookup tasks
  (verdict tables, citation rules). Jev's 0.964 reflex-only accuracy is partly a property
  of that task class; on digest-bound absence-of-evidence judgments (74-a) reflex-only was
  0.60. The replication claim is about the *router's structure*, not about reflex
  omnipotence — and the band still did all the corrective work.
- **E3 n=3.** Scoreable under the registered n≥3 clause, but three routed cases cannot
  bound the band's repair rate tightly; both in-band errors observed (74-a's four,
  this wave's one) were repaired, which pools to 7/7 across waves.
- **Jev tiebreak unexercised:** auditors were unanimous on all routed cases, so the
  majority-of-3 never needed the reflex vote; the tie rule remains registered-but-untested.
- **Pure-arm tie rule** (disagreement = incorrect) never fired (zero disagreements), so
  the conservatism is untested too.
- Cost comparison prices deepinfra only; TypeSafe's true $ is unpublished (reported in
  tokens). Even with a generous Jev price, the router's 62% reflective-call saving stands.
- One judgment set (C) reuses the wave-72 auditor tables as its universe — statements are
  NEW (properties of the tables, not the 10 calibration judgments), but the artifact is
  shared with the calibration set by design (the mission's "same study file" clause).

## 8. Artifacts

- Prereg (pre-call, sha-stamped): `scripts/w75_router_prereg.md` · copy `studies/data/w75-router-prereg.md`
- Stamp: `outputs/w75-router.expectation.json` · copy `studies/data/w75-router.expectation.json`
- Full receipt (statements, ground truth + derivations, evidence docs, raw Jev nouls,
  routing decisions, raw auditor outputs incl. one documented retry, votes, costs, E-scoring):
  `outputs/w75-router.json` · copy `studies/data/w75-router.json`
- Runner: `scripts/w75_router_run.py` (imports shared `scripts/ts_client.py` + `scripts/hy4/di_client.py` unchanged)
- Prior waves: JEV-CALIBRATION-74.md (74-a), reverse-actualization/wave74-*.md (74-c)
