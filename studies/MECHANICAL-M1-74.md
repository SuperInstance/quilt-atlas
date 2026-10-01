# MECHANICAL-M1-74 — mechanical-learning rule M1, round 1: the fly motif on cells

**Wave:** 74 · **Task:** 74-b · **Date:** 2026-10-01 · **Lane:** cell-lab / mechanical learning
**Pre-registration:** `scripts/w74_m1_prereg.md` (stamped `scripts/w74_m1_prereg_expectations.json`, sha256 `477b4801a57d89b1…`, registered BEFORE the first sim tick and before any judge call)
**Sim:** `scripts/w74_m1_sim.py` · **Judge:** `scripts/w74_m1_judge.py` · **Data:** `studies/data/w74-m1-results.json` (+ ledgers under `outputs/w74-m1-ledgers/`)
**Verdicts: P1 PASS · P2 FAIL (booked) · P3 PASS · P4 PASS · judge majority = same shape (unanimous per prediction) · evidence gate PASS**

---

## 1. The rule (pseudocode)

```
cell := {potential, resistance, entropy, is_split}   # prior-art four fields
        (+ ewma|d|, r_commit = folded-ledger state)  # M1 bookkeeping

every tick:
  pot *= 0.85                     # membrane leak (adaptation, documented in prereg)
  inject(script)                  # SET potentials (prior-art inject_force)
  entropy = min(1, (pot/5)*0.95)  # prior-art fractal rule
  eligible = 0.30 <= entropy <= 0.90                  # commitment gate (stimulus-time)
  flow: for each cell i, neighbor j (synchronous snapshot, torus):
          d = pot_i - pot_j ; if d > r_i: pot_i -= (d - r_i) * 0.22   # prior-art leakage
  surprise_i = |pot_after_flow - pot_after_inject|    # LOCAL third factor (dopamine slot)
  winners   = top-k by surprise (k = 13 = ceil(20% of 64))  # Kenyon sparsity motif
  for i in winners (m1) / all cells (dense):          # Oja-style homeostatic update
      ewma_i <- (1-0.05)*ewma_i + 0.05*mean_j|pot_i - pot_j|
      r_i    <- clamp(r_i + 0.05*(0.8*ewma_i - r_i), 0, 1)   # toward alpha*EMA|d|, no sign flips
  for i in eligible AND received-credit:              # ENTROPY-GATED COMMITMENT
      delta = r_i - r_commit_i
      if delta != 0: emit receipt {tick, cell, delta, r_commit_after, entropy_at_gate,
                                   config_hash, prev_hash, row_hash=sha256(row)}   # fail-closed ledger
      r_commit_i += delta
```

Two time scales: `r_fast` (reversible) vs `r_commit` = **fold of the receipt ledger** (per-cell additive deltas over init 0.4; monoid: identity = empty ledger, combine = sum, commutative up to float-associativity — measured ≤ 1.1e-15). The learned state IS the folded ledger; training IS replay.

## 2. Fly-motif mapping (1:1, from 73-g)

| Drosophila MB | M1 on cells | Evidence this round |
|---|---|---|
| Kenyon random fan-out kept sparse (eLife 52278) | k-winner selector, k=13/64 ≈ 20% | sparse arm BEAT dense on encoding error (0.293 vs 0.395) with 4.92× fewer plasticity events |
| Dopamine RPE broadcast (Nat Commun 2021) | local surprise \|Δpotential\| per flow pass | only cells actually touched by flow receive credit |
| APL / lateral inhibition | **NOT implemented in M1** | the diagnosed cause of the P2 saturation miss — M2 target |
| Synaptic scaling (Turrigiano) | Oja-style `r → α·EMA\|d\|` | P1 PASS: max\|r\| 1.04 (unclamped) vs no-M1 drift 26.4 (25× median ratio) |
| Short-vs-long term (Aplysia) | fast `r_fast` vs sealed `r_commit` receipts | P4 PASS on the sealed lane (below) |
| MB output commitment (valuation) | entropy-gated receipt emission | receipts only from in-band (active-not-saturated) cells |

## 3. Pre-registered results (n=3 seeds × 4 arms, 500 ticks: 400 two-channel moving-blob + 100 noise)

| # | Prediction (registered) | Measured | Verdict |
|---|---|---|---|
| P1 | m1 max\|r\| (unclamped) ≤ 1.2 all seeds; median drift ≥ 2× m1 | m1 1.036–1.040; drift 25.9–26.4; median ratio **25.1×** | **PASS** |
| P2 | enc_err(m1) ≤ enc_err(dense) AND ≤ 0.25 AND events(m1) < events(dense) | 0.293 ≤ 0.395 ✓; 0.293 > 0.25 ✗; 6,500 < 32,000 (4.92×) ✓ | **FAIL (booked)** |
| P3 | replay(ledger from empty) == live folded r_commit ≤ 1e-6; tamper refused; shuffled ≤ 1e-6 | max diff **0.0** (one dense run 1.1e-16); tampered-delta AND wrong-config rows refused; shuffled ≤ 1.1e-15; interrupted-run resume fingerprint identical | **PASS** |
| P4 | ≥ 2/3 seeds m1: corr@499 ≥ 0.5·corr@399 AND ≥ 0.4 | corr@399 0.707 → @499 0.561/0.571/0.635 (ratios 0.79–0.90); 3/3 seeds ok | **PASS** |

Reference floors: frozen arm enc error 1.000 (constant map); dense arm corr@499 **collapses** to −0.016/−0.289/+0.093 — with dense credit the noise window writes scrambling receipts (decayed r_fast gets committed as negative deltas), while M1's sparse credit keeps non-winner `r_fast` parked at baseline so noise commits nothing (delta = 0 → no receipt). **Sparse credit is what the receipt lane protects.**

### The honest P2 failure and its mechanism
M1 encoded the pattern at corr 0.707 (target 0.75) and beat dense credit, but the registered absolute bar was missed: the r_commit map saturates — nearly all path-adjacent cells climb to the r = 1.0 clamp because (a) credit leaks one ring outward (propagated flow gives ring cells surprise) and (b) the α·EMA target exceeds 1.0 for hot cells (unclamped max 1.04) while the fly solves exactly this with APL lateral inhibition, which M1 does not have. Registered FAIL stands verbatim; no thresholds were moved. **M2 proposal (next round):** add the APL analog — subtract γ·mean(neighbor r) from the homeostatic target (or gate winners by neighbor resistance) — plus a tighter commit band; pre-register corr ≥ 0.75 AND off-path r_commit within 0.05 of init.

## 4. Judge round (pre-registered protocol, §3 of prereg)

| Auditor | P1 | P2 | P3 | P4 | evidence 0–4 | fidelity 0–4 |
|---|---|---|---|---|---|---|
| TypeSafe Jev `jev-latest` (noul) | 0.98 ✓ | **0.10 ✗** | 0.98 ✓ | 0.98 ✓ | 3.94 | 3.34 |
| deepinfra XiaomiMiMo/MiMo-V2.6-Flash | ✓ | **✗** | ✓ | ✓ | 3 | 3 |
| deepinfra ByteDance/Seed-2.0-mini | ✓ | **✗** | ✓ | ✓ | 4 | 4 |
| **Majority** | support | **NOT supported** | support | support | **gate PASS (median ≥ 3)** | |

Unanimous per prediction, and the panel correctly refused to support the one registered FAILURE — the judge stack discriminates, it does not rubber-stamp. MiMo's note ("no stamped prereg hash shown") is fair: the state carries the prereg path; future judge states should embed the stamp hash itself. deepinfra cost **$0.0012** (budget < $0.05); Jev 2,000 input / 109 output tokens.

## 5. What this means for "learning = folding receipts"

1. **It works mechanically.** A 4-field cell with one local Oja-style update, one local surprise, and one hash-chained delta stream encodes a moving-blob statistic at corr 0.71 — with zero gradients, zero optimizer, zero global state, and the learned state reproducible from the receipt stream alone (replay diff 0.0).
2. **Write-once receipts are the memory-protection device.** The P4 asymmetry (M1 0.56–0.64 vs dense ≈ 0 under identical noise) is structural, not tuned: noise cannot rewrite what was committed; it can only add receipts through cells that win. Sparsity gates the write path — the fly motif and the ledger algebra are the same mechanism seen from two sides.
3. **Order-independence is native.** Shuffled-order folds land within 1.1e-15 of the sequential fold — the receipt stream is the list-homomorphism SUBSTRATE.md:60-69 claimed, now carrying learned state instead of document state.
4. **Falsifiable-by-construction paid off again.** The one registered FAILURE (P2) is the round's most valuable row: it localized the missing mechanism (lateral inhibition) and issued M2 its hypothesis. Rounds progress by KILL/KEEP like fly crosses.

**Limitations (honest):** the training script is deterministic, so seeds differentiate only the noise window (registered as "scripted inputs"; n≥3 still caught nothing spurious, but noisy-training variants should randomize stimulus order); the membrane-leak and stimulus-time entropy gate are adaptations of prior art, documented in the prereg; corr-vs-intensity is a readout of the script's own statistics, not an external ground truth; single corpus (one pattern) as everywhere in this lane.

**Repos touched:** `quilt-atlas` (this study + data copy). Scripts and ledgers live under `/home/z/my-project/scripts` and `/home/z/my-project/outputs/w74-m1-ledgers/` (12 ledger JSONLs, every row config-hash-stamped, chains verified).
