# Wave-77 — MECHANICAL-LEARNING M4: EMA-gated commitment — the slow signal taxes encoding least and refuses nothing

Task 77-a (round 4 of the mechanical-learning program on the four-field cell;
M1 = 74-b, M2 = 75-b, M3 = 76-a). Prereg: `scripts/w77_m4_prereg.md` + stamped
`outputs/w77-m4.expectation.json` (prereg sha256 `afeeb10eb0bec6a1…`,
registered 2026-10-01T12:16:56Z BEFORE any M4 run or judge call). Raw:
`outputs/w77-m4-results.json` (config-hash-stamped, judge tables + costs
merged), judge `outputs/w77-m4-judge.json` (+ raw), descriptive diagnostic
`outputs/w77-m4-diagnostic.json`, charts `outputs/w77-m4-corr-trajectories.png`,
`outputs/w77-m4-receipts.png`. Sim: `scripts/w77_m4_sim.py` — imports the 74-b
harness UNCHANGED and the M3 lattice itself for the comparison arm; the only
new physics is the commitment gate. Compact data: `studies/data/w77-m4-results.json`.
Ledgers: `outputs/w77-m4-ledgers/` (15 JSONL).

## What was tested — the gate's currency, not its speed

M3's evidence gate worked mechanically (receipts −36%) but failed its primary
bar (corr@399 0.6861 < 0.7067) because instantaneous dbar cannot distinguish
repeated pattern from one-off noise: *instantaneous self-contrast is not
receipt quality*. The queued M4 hypothesis: give the gate a **slow signal** —
M1's own `self.ewma` (the EMA of |d| at β = 0.05, maintained inside
`_plasticize`, inherited UNCHANGED) — and re-register the bars **at tick 500**,
the corrected instrument (76-a receipted that the off-path pathology is
noise-phase, not training-phase).

```
# registered M4 semantics (commit-time ONLY; plasticity/ewma unchanged from M1)
base_mask = eligible(stimulus-entropy ∈ [0.30,0.90]) AND credit(k-winner k=13)
Emax(t)   = max over 64 cells of ewma_i(t)     # M1's winner-sampled EMA of |d|
mask      = base_mask AND (ewma_own >= ema_frac · Emax(t))
emit: delta = r_fast − r_commit; r_commit += delta
receipt row gains: evidence {ewma_at_gate, threshold, lattice_max_ewma, ema_frac}
```

Arms: `m4_ema{0.3, 0.5 (primary), 0.7}` + `m1_baseline` (ema_frac = 0, gate
no-op) + **`m3_df0.5` re-run bit-exactly** — the comparison arm is the IMPORTED
`M3Lattice` run in this round's process (config_hash deliberately M3's 76-a
namespace), and it reproduced 76-a's stored fingerprints, corr@399, corr@500,
ledger lengths and off-path values **exactly on all 3 seeds** (`all_exact:
true`): a paired-honesty receipt and a determinism receipt in one. Seeds
404/505/606 — the SAME cohort as M3 (documented departure from fresh-seed
hygiene: identical noise realizations make R1's per-seed pairing exact and the
M3 re-run possible at all).

## Registered verdicts (bars frozen in prereg §3; measured at tick 500)

| # | Claim (bar frozen) | Measured | Verdict |
|---|--------------------|----------|---------|
| R1 | corr@500 (noise INCLUDED) ≥ M1 baseline's corr@500, **every seed**, ema=0.5 | 0.5802 = base (404), 0.7454 = base (505), **0.5954 < 0.6017 (606)** | **FAIL — booked honestly** |
| R2 | corr@399 ≥ 0.6861066183691137 (M3's value) every seed | **0.7037** every seed (−0.0031 vs M1's 0.7067; M3 cost −0.0206) | **PASS** — least encoding tax of any gated arm so far |
| R3 | receipts(ema0.5) < receipts(baseline) every seed | 3802/3816/3773 vs 4029/4043/4023 (**−5.6 / −5.6 / −6.2%**; blocked 227/227/250, all would-emit) | **PASS** |
| R4 | off-path cell-mean \|r_commit−0.4\| @500 ≤ **0.3** | **0.3875** (baseline 0.3884; M3 df0.5 0.3635) | **FAIL — the gate is nearly inert on the noise lane** |
| R5 | fold ≤ 1e-6, shuffled ≤ 1e-6, tick≤400 prefix folds to the training snapshot, tamper refused, M3 re-run exact | 0.0 / ≤ 6.7e-16 / 0.0 / both refused (row_hash + config_hash); M3 exact 3/3 | **PASS** — fourth consecutive round |
| R6 | off-path dev @500 non-increasing in ema_frac {0.3, 0.5, 0.7} | 0.3884 → 0.3875 → **0.3100** (strict both steps) | **PASS** — but the dial only bites at 0.7, where corr@399 crashes to 0.5488 (worse than M3 df0.7's 0.5908) |

Descriptive: homeostasis inherited intact (max unclamped |r| = 1.0354 —
plasticity untouched, r_fast bit-identical to M1's). `m4_ema0.3` is a near
no-op (1 blocked event across 3 seeds; corr@399 = 0.7067 = M1 exactly).

Judge panel (advisory, registered protocol): **Jev** r1 0.04 / r2 0.97 / r3
0.98 / r4 0.04 / r5 0.97 / r6 0.96 — flags exactly the two registered FAILs;
evidence_quality 3.69/4, prereg_fidelity 3.94/4. **Reflective auditors**
ByteDance/Seed-2.0-mini + XiaomiMiMo/MiMo-V2.6-Flash (temp 0, both parsed
first-try): both **F, T, T, F, T, T** — **majority agrees with the mechanical
verdicts 6/6**; the panel confirmed both failures (Seed: "R1 fails as seed
606's M4 corr@500 is below baseline; … R4 fails as its mean off-path deviation
exceeds 0.3"). deepinfra cash cost ≈ **$0.004** of the $0.03 budget.

## The mechanism the round produced: same-signal coupling + a threshold that chases the noise floor

The descriptive diagnostic (`outputs/w77-m4-diagnostic.json`, seed 404, not a
registered metric) splits the 227 blocked commits by cell class and phase:

| phase | blocked PATH cells | blocked OFF-PATH cells |
|---|---|---|
| training (≤400) | 125 | **0** |
| noise (401–500) | 5 | 97 |

At first glance the gate did resist the noise lane (97 off-path blocks). It
did not matter: **all 25 off-path cells that saturate under baseline saturate
under M4 with delay 0 ticks** — the first commit that seals r_commit > 0.55
happens on the same tick in both arms, and per-seed max off-path dev is
identical to baseline (0.600 / 0.532 / 0.600). Two structural reasons:

1. **Same-signal coupling.** The gate reads the cell's own ewma, and ewma is
   updated by the same plasticity events (k-winner wins) that drive r_fast
   toward the clamp. During the noise phase an injected off-path cell wins,
   and each win simultaneously raises r_fast *and* heats its own gate
   currency. The gate's refusal window covers only the first few wins —
   exactly the low-delta phase where a commit would barely move r_commit
   (97 blocked events, all small deltas; 354 off-path noise commits still
   passed vs baseline's 451). By the time a seal would matter, the cell's
   ewma has crossed the bar: **a gate whose evidence is the suspect's own
   recent history is a rubber stamp with latency.**
2. **The normalizer chases the noise floor.** Emax(t) — the lattice-max ewma
   the threshold is a fraction of — rose from 1.495 at tick 400 to 2.135 in
   the noise phase, because the loudest cells are noise-injected cells. The
   threshold (ema_frac 0.5) rose 0.75 → 1.05 in lockstep. Lattice-max
   normalization keeps the loudest injector always eligible — M3's failure
   mode re-emerged in slow motion, now with the noise setting the bar it must
   clear. A slow version of the wrong currency, normalized by the wrong
   reference, is still the wrong currency.

Meanwhile the training lane is where the slow gate actually worked: R2 PASS at
0.7037 (one-third of M3's encoding tax) with −6% receipts — the gate refused
125 training-lane commits, all from path cells whose winner-sampled ewma sat
below the bar (blob cells sample dbar ≈ 0 on their center tick). The
dose-response R6 (0.3884 → 0.3875 → 0.3100) shows the dial only becomes a real
filter at 0.7 — where it also refuses pattern evidence wholesale (corr@399
0.5488, worse than M3 at the same fraction). R1's only regression (seed 606:
0.5954 vs 0.6017) is the round's whole noise-lane yield: blocking 125
noise-phase path-cell commits changed that seed's map slightly for the worse,
while seeds 404/505 ended **bit-identical to baseline** — blocked commits
re-sealed the same clamped values later.

## The M-series arc so far

| Round | Rule (commit lane) | corr@399 | corr@500 (mean) | receipts Δ | off-path dev@500 | shape |
|---|---|---|---|---|---|---|
| M1 (74-b) | entropy-band commit, no evidence gate | 0.7067 | 0.642 | — | 0.388 | honest encoding fail → M2 |
| M2 (75-b) | target-side APL inhibition | 0.638 best | — | — | 0.60 | **FALSIFIED** (wrong locus: credit, not target) |
| M3 (76-a) | instantaneous-dbar evidence gate | 0.6861 | 0.649 | **−36%** | 0.364 | split: gate real, currency wrong |
| M4 (77-a) | slow-EMA evidence gate | **0.7037** | 0.640 | −6% | 0.3875 | split inverted: currency least-taxed, gate inert where the pathology lives |

Three falsifications, one structure: the off-path pathology has now survived
*target-side inhibition* (M2), *instantaneous self-contrast* (M3), and *slow
self-contrast under a noise-tracking normalizer* (M4). What has survived every
round: the receipt substrate itself (replay/tamper/prefix folds exact under a
fourth admission rule), receipt-count engineering, and encoding fidelity as a
measurable, tradeable quantity. The gate-design space is being mapped honestly:
M3 bought receipt reduction with encoding; M4 bought encoding safety with
inertia. Nothing self-referential has separated pattern from noise, because
during the noise phase the noise IS the cell's evidence.

## Wave-78 seeds (M5 hypothesis space, unregistered)

1. **Horizon stretch:** keep the EMA-gate rule but lengthen the horizon
   (β ≈ 0.005–0.01, its own registered dial). Pattern cells carried high |d|
   for 400 ticks; noise cells for 100 — a long-horizon EMA separates them by
   *integral*, not level, and the noise phase is too short to heat a
   β = 0.005 signal past a bar set by the training era. The information that
   separates pattern from noise lives in training-lane history; any gate that
   reads only the current tick's era cannot have it.
2. **Persistence gate:** commit only if the cell's evidence has been above the
   bar continuously for K ticks (pattern persists across sweeps; noise bursts
   do not).
3. **Frozen normalizer:** threshold from the *training-end* Emax, so the bar
   cannot be re-set by the noise the gate is supposed to refuse.
4. Still queued from 76-a: the same-magnitude-repeat falsification arm
   (channel magnitude jitter 0) — M4's failure is consistent with its
   prediction that a sustained random input fools any self-referential gate;
   it should ship with M5's prereg as the pre-registered falsification test.
