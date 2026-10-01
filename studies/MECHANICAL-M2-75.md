# Wave-75 / B — MECHANICAL-LEARNING M2: lateral inhibition FALSIFIED (and that is the result)

Task 75-b. Prereg: `scripts/w75_m2_prereg.md` + stamped expectations
(`outputs/w75-m2.expectation.json`, sha 15ee4e570b1a7cec, registered BEFORE any
run). Raw: `outputs/w75-m2-results.json`, judge `outputs/w75-m2-judge.json`,
chart `outputs/w75-m2-verdicts.png`. Sim: `scripts/w75_m2_sim.py` (imports the
74-b M1 harness UNCHANGED; the only new physics is the inhibition term).

## What was tested

74-b's round-1 P2 FAIL queued an M2 hypothesis: *"add the APL analog — subtract
gamma·mean(neighbor r_commit) from the Oja target or gate winners by neighbor
resistance — tighter commit band."* Round 2 implemented BOTH registered variants
on the same 8×8 lattice, same input script, same receipt-ledger mechanics,
seeds 101/202/303:

- **m2_oja_apl** (γ ∈ {0.1, 0.25, 0.5}): plasticity target becomes
  max(0, α·EMA|d| − γ·nb_mean(r_commit)).
- **m2_winner_gate** (γ = 0.25): winner score becomes surprise·(1 − γ·nb_mean(r_commit)).
- **m1** baseline re-run unchanged for paired comparison.

## Registered verdicts

| # | Claim | Measured | Verdict |
|---|-------|----------|---------|
| P1' | homeostasis preserved (max unclamped \|r\| ≤ 1.2) | max 1.040 across all M2 runs | **PASS** |
| P2' | best-M2 corr@399 ≥ 0.75 AND > M1 per-seed | best = γ0.1 at **0.638 < 0.7067**; γ0.25 → 0.559; γ0.5 → 0.415; winner-gate 0.705 ≈ M1 | **FAIL — hypothesis falsified** |
| P3' | replay determinism + fail-closed tamper refusal | fold diffs 0.0; tampered delta + config refused; shuffled ≤ 1.1e-15 | **PASS** |
| P4' | off-path \|r_commit − 0.4\| ≤ 0.05 (mean, never-injected cells) | best arm **0.60** (= M1's own 0.60); no arm below 0.44 | **FAIL** |
| P5' | degradation floor corr@499 ≥ 0.5 | 0.559 / 0.562 / 0.608 | **PASS** |

Judge panel (advisory): Muse-Glimmer agreement with mechanical verdicts **1.00**,
MiMo **0.80**; Jev independently scores P2' 0.05 and P4' 0.08 (matching the two
FAILs) and evidence quality **3/4** ("strong preregistered falsification").

## Reading — why this falsification is worth keeping

1. **The M2 hypothesis was wrong in an informative direction.** Subtracting
   neighbor-resistance from the Oja target does not tighten the commit band —
   it *degrades encoding globally and monotonically in γ* (0.638 → 0.559 →
   0.415). Inhibition at the TARGET punishes exactly the cells the fly motif
   wants to keep sparse-and-plastic: high-|d| path cells sit in high-resistance
   neighborhoods (their neighbors committed first), so the inhibition term
   eats their signal. The fly's lateral inhibition acts on *competition for
   credit*, not on the homeostatic target.
2. **Off-path saturation is credit-side, not target-side.** Every arm — M1
   included — drives never-injected cells' r_commit to ≈ +0.6. The k-winner
   selector ranks by raw surprise; leakage ringing around the moving blobs
   gives off-path cells enough surprise to win slots and commit. M3
   hypothesis (queued): **evidence-gated commitment** — a cell may commit only
   when its OWN dbar exceeds a fraction of the running lattice max (the
   receipt must cite evidence, echoing P8's fail-closed authorship gate);
   prediction: off-path dev ≤ 0.1 with corr@399 not below M1's 0.7067.
3. **The ledger discipline survives every rule change.** P3' passed on the
   first try for all four M2 arms — replay-from-empty, shuffled folds, tamper
   refusal — because commitment semantics were untouched. The learned state
   remains a folded receipt stream regardless of which plasticity rule
   produced it. That is the substrate property the mechanical-learning
   program is actually betting on.

## Wave-76 seeds

1. M3 evidence-gated commitment (above) — pre-register, same harness, seeds +1
   (404/505/606) for out-of-round replicate hygiene.
2. γ as a *diagnostic dial* rather than a fix: the monotone γ-response is a
   clean dose-response curve; register it as the instrument for detecting
   target-side vs credit-side pathologies in future rule variants.
3. Port the winner-gate variant into the chaotic-diffuse fragment layer
   (74-c/B): fragments transport preferentially along low-resistance corridors
   — does D* shorten?
