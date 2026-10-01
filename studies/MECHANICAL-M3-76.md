# Wave-76 — MECHANICAL-LEARNING M3: evidence-gated commitment — the gate works, the registered point does not

Task 76-a (round 3 of the mechanical-learning program on the four-field cell;
M1 = 74-b, M2 = 75-b). Prereg: `scripts/w76_m3_prereg.md` + stamped
`outputs/w76-m3.expectation.json` (prereg sha256 `a484f5fb2f05688e…`,
registered 2026-10-01T10:41:22Z BEFORE any M3 run). Raw:
`outputs/w76-m3-results.json` (config-hash-stamped, judge tables + costs
merged), judge `outputs/w76-m3-judge.json` (+ raw), charts
`outputs/w76-m3-verdicts.png`, `outputs/w76-m3-dose-response.png`. Sim:
`scripts/w76_m3_sim.py` — imports the 74-b harness UNCHANGED; the only new
physics is the commitment gate. Compact data: `studies/data/w76-m3-results.json`.
Ledgers: `outputs/w76-m3-ledgers/` (12 JSONL, new seeds 404/505/606,
config-hash separated from every 74-b/75-b ledger).

## What was tested — receipts must cite evidence (the P8 analogy)

75-b falsified target-side lateral inhibition and queued M3: **a cell may emit
a commitment receipt only when its OWN dbar exceeds a fraction of the running
lattice max** — the receipt must cite the evidence that admitted it, echoing
P8's fail-closed authorship gate (a reconciliation event must prove authorship
before application; an M3 receipt must cite its evidence before commit). The
hypothesis was credit-side: leakage ringing wins k-winner slots for off-path
cells, so refusing weak-evidence receipts should suppress the off-path
saturation (+0.6) without costing encoding.

```
# registered M3 semantics (commit-time ONLY; plasticity unchanged from M1)
base_mask = eligible(stimulus-entropy ∈ [0.30,0.90]) AND credit(k-winner k=13)
Dmax(t)   = max over 64 cells of dbar_i(t)     # dbar = mean |diff| over 4 edges
mask      = base_mask AND (dbar_own >= delta_frac · Dmax(t))
emit: delta = r_fast − r_commit; r_commit += delta
receipt row gains: evidence {dbar_at_gate, threshold, lattice_max_dbar, delta_frac}
```

Every receipt now carries its own admission evidence — verifiable at replay,
like the hash chain itself. Arms: `m3_df{0.3,0.5,0.7}` (0.5 primary) +
`m1_baseline` (delta_frac = 0 → gate no-op, dynamics bit-identical to M1;
corr@399 reproduced 74-b's 0.7067070294862626 EXACTLY — a free harness
validation receipt). Seeds 404/505/606 (out-of-round hygiene, 75-b lesson).

## Registered verdicts

| # | Claim (bar frozen in prereg) | Measured | Verdict |
|---|------------------------------|----------|---------|
| R1 | off-path mean \|r_commit−0.4\| ≤ 0.1 @ tick 399, df=0.5 | **0.000** (every seed; baseline also 0.000) | **PASS — but vacuous** (see below) |
| R2 | corr@399 ≥ 0.7067 (M1 round-1) every seed, df=0.5 | **0.6861** every seed (df0.3: 0.7083 ✓; df0.7: 0.5908) | **FAIL — booked honestly** |
| R3 | max unclamped \|r\| ≤ 1.2 | 1.0354 | **PASS** |
| R4 | fold diff ≤ 1e-6 + shuffled ≤ 1e-6 + tamper refused (+ tick≤400 prefix folds to the training snapshot) | 0.0 / ≤ 6.7e-16 / both refused; prefix diff 0.0 | **PASS** |
| R5 | receipts(df0.5) < receipts(baseline) every seed | 2577–2603 vs 4023–4043 (**−36%**; blocked 1,665–1,698, of which 1,444–1,466 would have emitted) | **PASS** |
| R6 | off-path dev non-increasing in delta_frac {0.3,0.5,0.7} @ tick 399 | 0 ≥ 0 ≥ 0 | **PASS — vacuous at 399**; descriptive tick-500 curve is genuinely monotone: 0.384 → 0.363 → 0.326 |

Judge panel (advisory, registered protocol): **Jev** r1 0.97 / r2 0.04 / r3 0.98
/ r4 0.95 / r5 0.98 / r6 0.97 — flags exactly the one registered FAIL;
evidence 2.8/4, prereg fidelity 3.83/4. **Reflective auditors**
MiMo-V2.6-Flash and Ling-3.0-flash (temp 0): both T,F,T,T,T,T — **majority
agrees with the mechanical verdicts 6/6**, i.e. the panel confirmed the R2
failure rather than rubber-stamping the round. Receipted harness fix: run 1's
Ling call spent its entire 500-token completion budget reasoning and emitted no
JSON — booked verbatim (`outputs/w76-m3-judge-run1-parse-failure.json`), one
retry with a larger completion budget per the 75-a parse-retry precedent.
deepinfra cash cost ≈ **$0.008 total** (both runs) of the $0.03 budget.

## Two findings the round actually produced

**1. The registered measurement point was vacuous — and 75-b's diagnosis gets
refined.** At tick 399, off-path dev is EXACTLY 0.0 for every arm *including
the M1 baseline*: a never-injected cell's potential stays ≈ 0 (the prior-art
flow rule only DRAINS the higher-potential cell, never fills the lower one), so
its entropy sits below the 0.30 eligibility floor and it can never commit
during training. The M1 entropy band was ALREADY an evidence gate on the
training lane. The +0.6 off-path saturation 75-b measured is a **noise-phase
phenomenon** (ticks 400–499): ~10 random cells per tick × 100 ticks injects
every cell ~15 times, and an injected cell cites its own injection as evidence.
75-b's `offpath_*_tick399` keys were in fact tick-500 values (receipted in the
M3 prereg §3 before the run; now measured at both points). So the pathology was
never "training-lane leakage ringing wins commit slots" — it is "the noise
phase makes every cell its own evidence."

**2. The gate is real but cannot separate weak PATTERN evidence from weak NOISE
evidence — and cannot refuse strong noise at all.** All three measured curves
are monotone in delta_frac, in tension: receipts ↓ (−7% / −36% / −71%),
off-path dev@500 ↓ (0.388 → 0.384 → 0.363 → 0.326), but corr@399 also ↓
(0.7067 → 0.7083 → 0.6861 → 0.5908). Mechanism: during training the blob's
INTERIOR cells have dbar ≈ 0 (all four edges inside the blob are equal) — the
gate refuses exactly the low-contrast half of the pattern, which is why R2
fails at df=0.5 (the sensitivity arm df=0.3 meets both R1's bar and R2's bar,
at only −7% receipts). During noise, an injected cell's dbar ≈ its own
magnitude, and Dmax ≈ the largest magnitude that tick — so strong noise
(mag 4.5–5) passes ANY delta_frac < 1 and still saturates r_commit to the
clamp. A receipt that cites strong evidence can still be noise: **instantaneous
self-contrast is not receipt quality.**

## What this means for "learning = folding receipts"

- **The substrate thesis keeps winning its structural tests.** Third rule
  change (M1 → M2 plasticity → M3 commit semantics), third first-try R4-class
  pass: replay-from-empty, shuffled folds, tamper refusal, and the new
  tick≤400-prefix fold all exact on 12 ledgers written under a *different
  admission rule*. The learned state is a folded receipt stream regardless of
  which gate admitted the receipts.
- **Receipt-count engineering works**: −36% receipts at df=0.5 with bounded
  encoding loss (corr −0.021), or −7% at df=0.3 with zero measured loss.
  "Fewer, better-evidenced receipts" is achievable — but this gate buys the
  reduction with pattern-interior evidence, which is the wrong currency.
- **The honest failure localizes the next mechanism**: admission cannot be
  judged from the instantaneous signal the cell was just hit with. The
  discrimininating signal is TEMPORAL: pattern cells are re-stimulated at the
  same magnitude every sweep (EMA|d| rises, β=0.05), a one-off noise spike
  barely moves it. **M4 hypothesis (queued): slow-signal-gated commitment** —
  a cell may commit only when its own EMA|d| ≥ delta_frac × lattice-max EMA|d|
  (same three-fraction sweep, same bars: off-path dev@500 ≤ 0.1 AND corr@399 ≥
  0.7067), because the EMA separates repeated pattern from self-injected noise
  while dbar cannot. Same prereg discipline; measurement point registered at
  tick 500 where the phenomenon actually lives.

## Wave-77 seeds

1. M4 slow-signal (EMA) gated commitment, per above — the same paired-baseline
   design, seeds fresh (707/808/909), off-path bars at tick 500.
2. Receipt-phase instrumentation as first-class metrics: train-lane vs
   noise-lane receipt counts and off-path receipt counts per run (this round
   computed them post-hoc from the ledgers; they explain every verdict here).
3. Optional: a "same-magnitude-repeat" input arm (channel magnitude jitter 0)
   to test whether an EMA gate can be fooled by sustained random input —
   the falsification test for M4 before it is run.
