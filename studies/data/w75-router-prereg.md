# WAVE-75 PREREGISTRATION — Reflex-Router Replication, Out-of-Sample (75-a)

**Registered_utc: 2026-10-01T09:08:23Z** (stamped copy: `outputs/w75-router.expectation.json`,
sha256 of this file embedded there). **This document was completed BEFORE any TypeSafe Jev or
deepinfra auditor call of wave-75.** No API call has been made for task 75-a as of this stamp.

## 1. What is being replicated

74-a calibrated the TypeSafe "Jev" System One judge against the wave-72 3-auditor majority on
10 graph edges. E1 FAILED (agreement 0.60), but the failure structure was a reflex/reflect
signature: all 4 misses were absence-of-evidence KILLs just above the decision boundary
(noul 0.52-0.64), while Jev was confidently right on verbatim-digest KEEPs (0.91/0.95).
Post-hoc, IN-SAMPLE: route `|noul-0.5| <= 0.15` to reflective auditors, auto-accept the rest
-> 10/10 at 50% of reflective cost. Wave-75 registered seed: **replicate that router rule
OUT-OF-SAMPLE** on three fresh judgment sets never used for calibration.

## 2. Frozen router rule (no post-hoc changes permitted)

- Instrument: `scripts/ts_client.py`, model `jev-latest`, ONE batched call per set
  (state = the set's evidence document; one named noul question per statement).
- Verdict mapping (fixed pre-call): noul >= 0.5 -> statement TRUE ("KEEP"/"true" arm),
  noul < 0.5 -> FALSE.
- **Boundary band (frozen from 74-a): route to reflective auditors iff |noul - 0.5| <= 0.15,
  i.e. noul in [0.35, 0.65].** All other statements are AUTO-ACCEPTED from Jev.
- Routed cases go to TWO reflective auditors (deepinfra allowlist):
  `XiaomiMiMo/MiMo-V2.6-Flash` and `ByteDance/Seed-2.0-mini`, temperature 0, one batched
  call per (set, auditor) over the routed subset. Vote = TRUE/FALSE.
  Router final verdict on routed cases = majority-of-3 {MiMo, Seed, Jev} (Jev's auto verdict
  is the tiebreak vote; with 3 binary voters a 2-1 majority always exists).
- Pure-reflective comparator arm (same statements, same evidence, same auditors, temp 0):
  verdict = MiMo+Seed agreement; **on 2-2 disagreement the pure arm has no tiebreak
  mechanism and the case is booked INCORRECT** (conservative against the router arm; the
  excl-ties accuracy is also reported).
- Parse-failure rule (registered): an auditor answer that cannot be parsed after one
  "JSON only" retry is an ABSTAIN, booked honestly; majorities are computed over cast
  votes; a pure-arm case left with 0 or 2 abstains is booked unresolvable/incorrect.
  A Jev set-level failure is an instrument failure: full-set re-run permitted, both
  attempts receipted.
- Cost model (registered): deepinfra USD from returned `estimated_cost` is the primary
  cash metric (TypeSafe pricing is unpublished; Jev overhead is reported in tokens and
  calls, and TypeSafe call count is capped at 60 by budget). E4 is scored on
  deepinfra-USD-per-correct-verdict; reflective-call counts reported alongside.

## 3. Ground truth — derived and documented BEFORE any judging

Ground truths are deterministic structural reads of receipted artifacts. For every statement
the derivation rule and the exact evidence used are registered below. All three source files
were read in full before this registration; **no judge or auditor has seen any statement yet.**

### Set A — HOMUNCULUS RECEIPTS (10 statements)

Source: `/home/z/my-project/outputs/w74-homunculus.json` (74-c/A; 25 receipts, 21
propagation_edges). Authors: `R0-HOST-*` -> HOST; `Rk-FLOW-*` -> FLOW; `Rk-MEM-*` -> MEM;
`Rk-SENSE-*` -> SENSE. The three trading cells are FLOW/MEM/SENSE; R0-HOST-* are round-0
per-lane seed feeds (each addressed `to` exactly one lane).

**Registered rule (deterministic):** for receipt X and origin cell Y in {FLOW, MEM, SENSE},
*X shows influence originating in Y* iff EITHER
(a) `propagation_edges` contains a row with `by == X` and `from_origin == Y` (the receipted
automatic propagation table is authoritative), OR
(b) X's body contains an explicit receipt reference (`Re <id>` / `Citing <id>` / `<id>'s`)
whose id's cell code == Y and Y != author(X).
References to `R0-HOST-*` seeds do NOT count (same-lane seed inputs, not cross-cell).
A receipt is *self-contained* iff no Y satisfies the rule. Note: `propagation_edges` rows
exist only for rounds 2-4; round-1 cross-cell citations are decided by rule (b) alone.

| id | statement | truth | derivation (rule application) |
|----|-----------|-------|-------------------------------|
| HOM-1 | Receipt R4-MEM-1's content shows influence originating in cell SENSE. | TRUE | (a) edge {by R4-MEM-1, from_origin SENSE}; (b) body: "Citing R3-SENSE-1" + "R1-SENSE-1's non-determinism amendment stands" |
| HOM-2 | Receipt R3-FLOW-1's content shows influence originating in cell MEM. | TRUE | (a) edge {by R3-FLOW-1, from_origin MEM, shaped=true}; (b) body: "Re R2-MEM-1: adopting always-parent-linked" |
| HOM-3 | Receipt R4-SENSE-1's content shows influence originating in cell MEM. | TRUE | (a) edge {by R4-SENSE-1, from_origin MEM, shaped=true, "id-ref"}; (b) body: "Citing R3-MEM-2 and R0-HOST-3" |
| HOM-4 | Receipt R2-MEM-2's content shows influence originating in cell FLOW. | TRUE | (a) edge {by R2-MEM-2, from_origin FLOW, how "1 shared words; rare:['append']"} — table-authoritative; body cites SENSE (R1-SENSE-1), not FLOW |
| HOM-5 | Receipt R3-SENSE-1's content shows influence originating in cell FLOW. | FALSE | no edge {by R3-SENSE-1, from_origin FLOW} (only MEM); body cites "Citing R3-MEM-2" (MEM) and own-lane R0-HOST-3 only |
| HOM-6 | Receipt R3-MEM-1's content shows influence originating in cell SENSE. | TRUE | (a) edge {by R3-MEM-1, from_origin SENSE, "3 shared words; rare:['diffs','signal']"}; body "diffs logged as signal" echoes R1-SENSE-1 |
| HOM-7 | Receipt R2-SENSE-1's content shows influence originating in cell MEM. | TRUE | (a) edge {by R2-SENSE-1, from_origin MEM, "3 shared words; rare:['citing','deterministic','embedding']"} |
| HOM-8 | Receipt R1-FLOW-2 is self-contained, with no cross-cell influence shaping its content. | FALSE | body opens "Re R1-MEM-1:" (MEM-authored) -> cross-cell influence exists; no table row (round 1) — rule (b) decides |
| HOM-9 | Receipt R0-HOST-3 is self-contained, with no cross-cell influence shaping its content. | TRUE | round-0 seed; no propagation_edges rows for any R0-*; body has no receipt references — structurally self-contained |
| HOM-10 | Receipt R3-MEM-2's content shows influence originating in cell FLOW. | TRUE | (a) edge {by R3-MEM-2, from_origin FLOW, how "1 shared words; rare:['record']"} — table-authoritative |

Set A truth distribution: 8 TRUE / 2 FALSE.

### Set B — CHAOTIC-DIFFUSE CLAIMS (10 statements)

Sources: `/home/z/my-project/outputs/w74-chaotic.json` (receipted verdicts incl. D_star,
substitution note), `/home/z/my-project/outputs/w74-chaotic-metrics.csv` (960 rows = 4 runs
x 240 gens; columns gen,arm,rep,H_pool,NBHD,C,V_p,n_split,n_frags,n_types),
`reverse-actualization/wave74-CHAOTIC-DIFFUSE.md` (receipted writeup).
**Registered rule: each claim's truth = direct comparison against the receipted value quoted
in its derivation row. No re-interpretation.**

| id | statement | truth | derivation (receipted value) |
|----|-----------|-------|------------------------------|
| CHA-1 | H2 (transport range sublinearity) was registered as PASS, with log-log slope b = 0.026 and R-squared = 0.94. | TRUE | verdicts.H2="PASS", H2_slope=0.02634, H2_r2=0.9424 |
| CHA-2 | Transport range grows linearly with fragment age (log-log slope around 1.0). | FALSE | H2_slope=0.026 (hard saturation; writeup: "R(a) is flat past age ~2") |
| CHA-3 | ExoJ conservation was violated: the flag for C > 0.75 on more than 5% of observations was raised. | FALSE | H3_amendment_flag=false; frac_C_gt_075=0.00417 (< 5%); H3="PASS" |
| CHA-4 | H1 (pool diversity non-decreasing, margin >= 0.05 nats) was registered as INCONCLUSIVE. | TRUE | verdicts.H1="INCONCLUSIVE" |
| CHA-5 | The registered H1 margin (+0.033 nats) met or exceeded its 0.05-nat bar. | FALSE | H1_margin_nats=0.03300 < 0.05 |
| CHA-6 | The D-star neighborhood-diversity crossing occurred before generation 60 in at least two of the three moth-arm replicates. | TRUE | D_star: moth0=26, moth1=102, moth2=48 -> 26 and 48 < 60 (moth1 102 is not) |
| CHA-7 | The maximum ExoJ conservation margin C over the 960 generation-observations stayed at or below 0.80. | TRUE | H3_max_C=0.75242 <= 0.80; CSV has 960 data rows (4 arms x 240 gens) |
| CHA-8 | The run used 2048 bytes of live comet-qrng-v1 moth entropy as registered, with no substitution. | FALSE | entropy_substitution_booked=true; 81/2048 live bytes; seeded local fallback, provenance downgraded |
| CHA-9 | The experiment ran 240 generations per replicate with sustained splits (P_SPLIT = 0.02 firing every generation). | TRUE | ngen=240 in receipt; writeup: "sustained fractal splits (P_SPLIT = 0.02 every generation, never switched off)" |
| CHA-10 | The transport-range R(a) curve was flat past fragment age ~2 (saturating) rather than steadily growing with age. | TRUE | H2 slope 0.026, R2 0.94; writeup reading 2: "fragments plant near their origin and stay" |

Set B truth distribution: 6 TRUE / 4 FALSE.

### Set C — GRAPH EDGES ROUND 2: auditor-table properties (8 statements)

Sources: `/home/z/my-project/quilt-atlas/studies/data/w72-audit-r2.json` (receipted Seed
72-f table + Hy3/Muse 72-i tables, agreement blocks, three_way table),
`quilt-atlas/studies/GRAPH-R2-72.md` (72-i section). Edge numbering E1..E10 = the
registered `core_edges` order (E1 C1>C2 rediscovery-of, E2 C2>C1 antidote-to, E3
C1>FLEET ancestor-of, E4 FLEET>C1 antidote-to, E5 C3>FLEET dataset-for, E6 FLEET>C3
instrument-for, E7 C2>FLEET ancestor-of, E8 FLEET>C2 antidote-to, E9 C2>C3 instrument-for,
E10 FLEET>C2 instrument-for). **These are NEW property statements about the receipted
auditor tables — NOT the 10 KEEP/KILL judgments reused as 74-a's calibration ground truth.**
**Registered rule: truth = direct read of the receipted tables.**

| id | statement | truth | derivation (receipted value) |
|----|-----------|-------|------------------------------|
| GRP-1 | Edge E7 (C2>FLEET ancestor-of) was kept by all three auditors. | TRUE | three_way i=7: Seed/Hy3/Muse all KEEP, unanimous=true |
| GRP-2 | The 3-auditor majority table equaled Seed's original 2/8 KEEP/KILL split exactly (all 10 edges). | TRUE | three_way majority column == Seed's verdicts edge-by-edge (verified in the receipt: only E5/E7 are majority-KEEP, matching Seed) |
| GRP-3 | The Muse-Glimmer auditor killed edge E5 (C3>FLEET dataset-for). | TRUE | Muse verdicts[4]="KILL" (it caught the 13,062 merge-diff payload misattribution) |
| GRP-4 | Exactly four of the ten core edges were unanimously KILLed by all three auditors. | FALSE | six unanimous KILLs: E1, E2, E3, E6, E9, E10 |
| GRP-5 | Hy3 kept both of Seed's KEEP edges plus two additional FLEET->C* antidote-to edges (KEEP count 4). | TRUE | hy3 keep_set = {FLEET>C1 antidote-to, C3>FLEET dataset-for, C2>FLEET ancestor-of, FLEET>C2 antidote-to} |
| GRP-6 | Seed and Muse agreed on 9 of the 10 edges (per-edge agreement 0.90). | TRUE | agreement.seed_vs_muse.agreement_rate=0.9, count 9 |
| GRP-7 | The Seed-vs-Hy3 KEEP-set symmetric difference was 3 or more edges. | FALSE | symmetric_difference has 2 edges (FLEET>C1 antidote-to, FLEET>C2 antidote-to) |
| GRP-8 | The FLEET->C3 instrument-for edge was kept by at least one of the three auditors. | FALSE | i=6: Seed KILL, Hy3 KILL, Muse KILL |

Set C truth distribution: 5 TRUE / 3 FALSE.

**Total: 28 statements, 19 TRUE / 9 FALSE (base rate 67.9% — the reverse skew of 74-a's
8 KILL / 2 KEEP; auto-accept-everything-as-TRUE would score 0.679, so E1's 0.85 bar is
informative relative to that lazy baseline).** [CORRECTED PRE-CALL 09:12Z: the summary
arithmetic first said 6T/2F for Set C and 20/8 total; the per-statement table above — the
actual registration — was and is unchanged. No API call had been made at correction time.]

## 4. Evidence documents (what judges/auditors see)

- Set A: target receipts (verbatim id/from/to/round/body) + every receipt their bodies cite
  (R0-HOST-1/2/3, R1-MEM-1, R1-MEM-2, R1-SENSE-1, R2-MEM-1, R3-MEM-1, R4-FLOW-2) + the full
  21-row propagation_edges table + the author map + the registered influence rule verbatim.
  The propagation_edges table IS part of the receipt under test (it is evidence, and the
  registered rule makes it authoritative — the judgment is structured rule-following over
  the receipt, not blind lookup).
- Set B: the receipted verdicts JSON verbatim (H1/H2/H3 + D_star + substitution note) +
  the writeup's registered-verdict table lines + the facts ngen=240 / 960 CSV observations
  / sustained P_SPLIT=0.02.
- Set C: E1..E10 edge list + the full 3-auditor verdict table with majority + the agreement
  block (rates 0.8/0.9/0.7, keep sets, sym-diffs 2/1/3, auditor KEEP counts 2/4/1) + the
  receipted finding that the majority table equals Seed's table.
- Auditors receive the same evidence + statement list + instruction to return strict JSON:
  `[{"id": "...", "verdict": "TRUE"|"FALSE", "evidence": "<short locator>"}]`, temp 0.

## 5. Pre-registered expectations (honest priors, scored after the run)

| # | expectation | bar | prior | reasoning |
|---|-------------|-----|-------|-----------|
| E1 | Router final-verdict accuracy across all 28 statements | >= 0.85 (>= 24/28) | 0.55 | in-sample was 10/10 but n=10 and in-sample; sets B/C are careful-lookup tasks Jev may excel at; set A demands rule-following, Jev's known weakness — the band should catch its uncertainty |
| E2 | Auto-accept rate (1 - routed/28) | >= 0.40 (routed <= 16) | 0.60 | 74-a routed 4/10 in-sample; lookup-style evidence may push nouls to extremes -> fewer routings |
| E3 | Routed cases: router final verdict (majority-of-3) matches ground truth | >= 0.70 | 0.60 | the escalation exists precisely because boundary cases are where reflex fails; if routed n < 3, E3 is booked UNSCOREABLE (not auto-passed) |
| E4 | deepinfra-USD per correct verdict: router arm < pure-reflective arm | strict < | 0.70 | router pays 3 Jev calls (tokens) + reflective calls on routed only; pure arm pays reflective on all 28. Jev token overhead reported; TypeSafe $ not priced (unpublished) |

Secondary/descriptive (reported, not gated): Jev-only accuracy (would the router be needed?);
auto-accepted-subset accuracy; auditor inter-agreement on routed cases; routed-subset
auditor-agreement-with-truth where both auditors agree; per-set breakdowns; pure-arm
excl-ties accuracy; latency; token tables; TypeSafe calls used (budget 60), deepinfra USD
(budget 0.05).

## 6. Analysis plan & honesty rules

- Scoring is mechanical from the receipt; no verdict edits, no band moves, no post-hoc
  thresholds. Misses are listed with their nouls and votes.
- Per-set accuracy reported so a single-set collapse cannot hide inside the pooled number.
- All raw answers (Jev nouls per statement; auditor JSON per call) land in
  `outputs/w75-router.json` with usage and cost per call.
- Interpretation guardrails: base rate 0.679 is the no-skill TRUE-lazy baseline; the
  informative comparisons are E1 vs that baseline, router-vs-pure cost at comparable
  accuracy, and where the router's errors sit (band vs auto-accepted).
- Telescope architecture claim to be assessed (not assumed): reflex first (Jev, ~250
  ms/question, batched), reflect only on the boundary band (2 auditors, majority-of-3
  with Jev tiebreak) — the operational meaning of "telescope, not television".

## 7. Run order (registered)

1. This prereg + stamped expectation (done, pre-call).
2. Router arm: Jev batched per set (3 calls, jev-latest) -> apply frozen band -> batched
   MiMo + Seed calls on routed subsets (<= 6 calls) -> verdicts.
3. Pure-reflective arm: batched MiMo + Seed calls on ALL statements (6 calls).
4. Score E1-E4, write `outputs/w75-router.json`.
5. Study `quilt-atlas/studies/REFLEX-ROUTER-75.md` + data copy; worklog; push.
