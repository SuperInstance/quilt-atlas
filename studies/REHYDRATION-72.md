# REHYDRATION-72: The Decay Curve and the Rehydration Scheduler

**Wave-72 seed study** · 2026-10-01 · Task ID 72-e · instruments: quilt-neighbourhood v0.4.0
CellDiff fold (w71 PROBE-2 instrument, re-run), `fleet_tools.rehydrate` (new: DecayModel +
RehydrationScheduler + `rehydrate-plan` CLI), pytest suite (30 tests).

---

## 1. Motivation: why PROBE-2's exact-HEAD proof matters

Wave-71 PROBE-2 (`scripts/w71_probes_1_2.mjs`) proved two things about a receipt-chained
CellDiff stream replayed from a git history:

1. **Full stream → exact HEAD.** Folding all 101 papermill commits (359 CellDiffs) reconstructs
   the HEAD path set **byte-identically** (248 == 248). The fold has no drift, no
   approximation: an intact stream converges *exactly*.
2. **Decayed stream → measurable divergence.** Dropping every 2nd commit (51 of 101 kept)
   diverges on **117 of 248 paths** (47.2%).

Exactness at t=0 is what makes *rehydration* a well-defined concept: since an intact fold is
provably identical to the seal, any divergence a replica observes is attributable to **missing
or unverifiable prefix receipts** — decay — and not to the instrument. The wave-72 question:
given the measured divergence-vs-truncation curve, when is a **full rehydration from seal**
cheaper than an **incremental catch-up** that will land on a partially divergent state?

## 2. Measured decay curve (real data, real runs)

`scripts/w72_decay_curve.mjs` re-runs the PROBE-2 fold machinery on the papermill corpus at
five truncation depths (deterministic "drop every m-th commit" patterns in oldest-first
order; images/ excluded exactly as in w71):

| kept commits | dropped | t (decay fraction) | folded paths | divergent paths | divergence d(t) |
|---:|---:|---:|---:|---:|---:|
| 101 | 0   | 0.0000 | 248 | 0   | 0.0000 |
| 76  | 25  | 0.2475 | 196 | 52  | 0.2097 |
| 51  | 50  | 0.4950 | 131 | 117 | 0.4718 |
| 26  | 75  | 0.7426 | 53  | 195 | 0.7863 |
| 0   | 101 | 1.0000 | 0   | 248 | 1.0000 |

- The t=0.4950 row **reproduces the sealed w71 PROBE-2 receipt exactly** (117 paths) — the
  measurement is deterministic across waves.
- The two anchors are not fitted: t=0 → d=0 is the P2 exact-HEAD proof; t=1 → d=1 is the
  empty-fold identity.
- Curve data: `outputs/w72-decay-curve.json` (committed copy: `studies/data/w72-decay-curve.json`),
  including per-depth samples of divergent paths.

Shape: papermill is a write-once corpus (282/294 files touched once), so decay is nearly
linear — dropping a fraction t of commits loses roughly t of the file-creating commits and
therefore ~t of the paths — with a mild S: below the diagonal at low t (surviving neighbors
of dropped commits still carry some paths), above it at high t (removes/tombstones missing
their setters).

## 3. Model fit

`fleet_tools.rehydrate.DecayModel` fits d(t) with two families, both **anchored** at the two
proven points (d(0)=0, d(1)=1) so the model can never contradict the P2 proof:

| fit | parameters | R² | max \|model − measured\| |
|---|---|---:|---:|
| **logistic** (normalized sigmoid, deterministic coarse-to-fine grid search) | a=3.4375, t₀=0.515 | **0.9995** | 0.013 (at t=0.2475) |
| piecewise-linear through the 5 knots | — | 1.0 (exact on knots) | 0 |

The anchored logistic d(t) = (σ(a(t−t₀)) − σ(−a·t₀)) / (σ(a(1−t₀)) − σ(−a·t₀)) degrades
gracefully to the linear d(t)=t as a→0 — appropriate for a write-once corpus, with headroom
for S-shaped (churny) corpora where a will come out larger. Fit is deterministic (identical
params on every run; pinned by test).

## 4. Scheduler policy

`RehydrationScheduler.decide(prefix_receipts_known, replica_depth, stream_length,
cost_full_rehydrate, cost_catchup_per_diff)`:

- **Decay fraction** t = (n − p)/n, where n = canonical stream depth claimed by the seal and
  p = prefix receipts the replica can verify (its checkpoint's own receipts plus any surviving
  upstream chain). Intact stream: p = n → t = 0 → expected divergence exactly 0.
- **Expected divergence** d(t) from the fitted model.
- **Policy** (deterministic, no network):
  1. d(t) > threshold (default **0.02**) → `rehydrate`: catch-up would land a divergent state.
  2. else cost_full_rehydrate ≤ (n − k)·cost_catchup_per_diff → `rehydrate`: inside the
     deadband, but rebuilding from seal is cheaper *and* exactly convergent.
  3. else → `catchup`.
- Costs and threshold are **policy knobs**, not laws (see §7).

CLI (offline):

```sh
python -m fleet_tools rehydrate-plan --curve outputs/w72-decay-curve.json \
  --stream-length 101 --prefix-known 51 --replica-depth 30 \
  --cost-full 300 --cost-per-diff 1 --threshold 0.02 --fit logistic
```

## 5. Real decisions on the papermill curve

Scenarios: replica checkpointed at commit-depth k of the canonical n=101 stream; the upstream
archive has decayed so only p prefix receipts remain verifiable. p is chosen per row so t
lands exactly on a measured curve depth. Knobs: threshold 0.02, cost_full=300, per-diff=1.
(`outputs/w72-rehydrate-decisions.json`; atlas copy `studies/data/w72-rehydrate-decisions.json`.)

| replica depth k | verifiable prefix p | t | expected d (model) | measured d at t | est. divergent paths | decision |
|---:|---:|---:|---:|---:|---:|---|
| 10 | 101 (intact) | 0.0000 | 0.0000 | 0.0000 (0) | 0 | **catchup** (91 diffs, cost 91 < 300) |
| 30 | 76 | 0.2475 | 0.2006 | 0.2097 (52) | 50 | **rehydrate** (divergence ≫ 2% deadband) |
| 51 | 51 | 0.4950 | 0.4849 | 0.4718 (117) | 121 | **rehydrate** |
| 80 | 26 | 0.7426 | 0.7772 | 0.7863 (195) | 193 | **rehydrate** |

Reading: the papermill deadband is razor-thin. Because d(t) ≈ t from the first measured point
already (21% divergence at 25% decay), **any** non-trivial decay — even one lost commit in 51
— breaches the 2% threshold and demands rehydration from seal. Catch-up is only scheduled on
an intact stream (or under a deliberately looser threshold). For churny corpora with flat
early decay the window would be wider; that is exactly what the fitted `a` parameter encodes.

## 6. Tests

`tests/test_rehydrate.py` (14 tests): logistic fit recovers a synthetic anchored-logistic
curve (R² > 0.99, curve-closeness < 0.01); fit determinism; piecewise exactness on and between
knots; input validation; curve-loader both schemas; decision boundary strictly on both sides
of the threshold (t=0.01 catches up, t=0.03 rehydrates, t==0.02 stays in deadband — policy is
strictly `>`); cost-forced rehydration inside the deadband; intact/degenerate streams;
monotonicity (deeper truncation never decreases divergence, for both fits and through the
scheduler); CLI smoke test via subprocess. Full suite: **30/30 pass** (bench-seal 4,
judge-gate 5, promise-census 7, rehydrate 14).

## 7. Honest limitations

- **One corpus.** The curve is measured on papermill (101 commits, write-once, 248 paths).
  A churny history (README edited 5×, tombstones, merges) will have a different d(t) — the
  instrument accepts any measured curve; the model constants (a=3.4375, t₀=0.515) are
  papermill's, not the fleet's.
- **Divergence is path-count, not byte-weight.** d(t) counts paths whose live/dead status
  differs from HEAD. A lost commit touching one huge blob and one touching 50 stubs weigh the
  same here. Byte-weighted divergence is the obvious v2 metric.
- **The threshold is a policy knob, not a law.** 0.02 is a default, pre-registered here as a
  default only; fleets with cheaper rehydration or stricter consumers should turn it.
- **Uniform decay assumption.** The curve truncates uniformly (drop every m-th commit).
  Correlated decay (a contiguous lost range) can diverge differently at the same t; the
  scheduler consumes only the fraction t today.
- **Costs are abstract units.** cost_full=300 / per-diff=1 encode "rebuild ≈ 3× the stream"
  as a stance, not a measurement; the catchup branch is only reachable inside the deadband.
- **Truncation in commit space.** The scheduler's n and k are commit depths to match the
  curve's commit-space measurement; the underlying CellDiff stream is 359 diffs. Mixing
  units is a linear approximation, honest only because both scale ≈ monotonically.

## 8. Receipts

- Curve: `outputs/w72-decay-curve.json` ← `scripts/w72_decay_curve.mjs` (deterministic;
  t=0.4950 row == sealed w71 PROBE-2 receipt, 117 paths).
- Decisions: `outputs/w72-rehydrate-decisions.json` ← `scripts/w72_decisions.py`.
- Code: `study/quilt-fleet-tools` `fleet_tools/rehydrate.py`, `fleet_tools/__main__.py`
  (`rehydrate-plan`), `tests/test_rehydrate.py` — 30/30 suite pass.
- Wave-71 context: `studies/DEEP-STUDY-71-legacy-corpora.md` (PROBE-2 section), worklog 71-e.
