# Wave-78 — MECHANICAL-LEARNING M5: the frozen normalizer decomposes M4's failure — the chase was never the binding constraint

Task 78-a (round 5 of the mechanical-learning program on the four-field cell;
M1 = 74-b, M2 = 75-b, M3 = 76-a, M4 = 77-a). Prereg: `scripts/w78_m5_prereg.md`
+ stamped `outputs/w78-m5.expectation.json` (prereg sha256
`4ecd6461cbea5dfb…`, registered 2026-10-01T13:10:15Z BEFORE any M5 run or judge
call). Raw: `outputs/w78-m5-results.json` (config-hash-stamped, judge tables +
costs merged), judge `outputs/w78-m5-judge.json` (+ raw), charts
`outputs/w78-m5-offpath.png`, `outputs/w78-m5-corr.png`. Sim:
`scripts/w78_m5_sim.py` — imports the 74-b harness UNCHANGED; the only new
state is gate-only (`ewma_slow`, a 5-tick dbar ring buffer) plus the repeat
arm's cached noise draw; plasticity stays bit-identical to M1's. Compact data:
`studies/data/w78-m5-results.json`. Ledgers: `outputs/w78-m5-ledgers/` (12 JSONL).

## What was tested — decomposing M4's two registered causes

M4 failed its noise lane (R4 0.3875 vs bar 0.3) with two structural causes
receipted: **(1) same-signal coupling** — the gate reads the cell's own
winner-sampled history, heated by the very wins that drive r_fast to the
clamp; **(2) the normalizer chases the noise floor** — Emax rose 1.495@400 →
2.13, threshold in lockstep. M5 was registered to attack (2) and stretch (1)'s
horizon, and — the round's centerpiece — to run the **same-magnitude-repeat
falsification arm** queued since 77-a: re-inject the FIRST noise draw's same 10
cells at the same magnitudes on every noise tick. If the M-series premise
("the slow signal separates repeated pattern from one-off noise") is what the
gates were actually tracking, a *repeating* noise pattern must light the gate
up like the training pattern does.

Two registered gate variants, both with the **training-end frozen normalizer**
(the anti-chase fix), `frac = 0.5`:

```
m5_horizon   ewma_slow = winner-sampled EMA of dbar at β_horizon = 0.005 (~200-tick memory;
             gate-ONLY state, never feeds plasticity; M1's own ewma at β=0.05 unchanged)
             mask = (eligible & credit) & (ewma_slow ≥ 0.5 · N(t))
             N(t) = live lattice-max ewma_slow for ticks ≤ 400; NORM_FROZEN = 1.0649
             (read once at the tick-400 commitment) for ticks > 400
m5_persist   mask = (eligible & credit) & (dbar ≥ 0.5 · Dmax(t') on ≥ 3 of last 5 ticks incl. current)
             Dmax(t') live for training ticks; DMAX_FROZEN = 1.9790 (tick-400 flow) in noise
m5_horizon_repeat  = m5_horizon + the repeated-noise script (falsification arm; the stored
             pattern is bit-identical to m5_horizon's first noise draw — the rng stream is
             untouched during training; verified in-run against a fresh default_rng replay)
m1_baseline  gate none under the M5 namespace; reproduced w77-m4's stored baseline
             state/measurement values BIT-EXACTLY on all 3 seeds (r_commit vectors,
             corr@399/@500, events, ledger lengths, off-path values; fingerprints differ
             only by the registered receipt schema — booked as documented, not a failure)
```

Seeds 404/505/606 — the M3/M4 cohort (paired comparability; the baseline
equality check doubles as a fourth consecutive determinism receipt).

## Registered verdicts (bars frozen in prereg §3; measured at tick 500)

| # | Claim (bar frozen) | Measured | Verdict |
|---|--------------------|----------|---------|
| R1 | corr@399 ≥ **0.70** for BOTH M5 arms, every seed | m5_horizon **0.7071** ✓; m5_persist **0.5822** ✗ (blocked 1,669 training-phase commits/seed: blob-center ticks have dbar ≈ 0, the registered risk 4, realized) | **FAIL — booked honestly** (horizon arm alone passes) |
| R2 | off-path dev @500 ≤ **0.30** for BOTH arms (mean over seeds of cell-means) | m5_horizon **0.3884 = baseline EXACTLY** (per-seed 0.3960/0.3949/0.3742, identical to baseline's); m5_persist **0.3745** | **FAIL — the frozen normalizer did not move the noise lane** |
| R3 | receipts < m1_baseline, every seed, both arms | horizon 3954/3979/3935 (**98.1/98.4/97.8%** of baseline); persist 2326/2329/2330 (**57.7/57.6/57.9%**) | **PASS** |
| R4 | fold/shuffled/prefix ≤ 1e-6, tamper refused, baseline state exact | 0.0 / ≤ 6.7e-16 / 0.0 / both refused; baseline exact 3/3 | **PASS** — fifth consecutive round |
| R5 | **REGISTERED EITHER-WAY**: repeat arm dev @500 ≥ 0.45 → FALSIFIED; ≤ 0.30 → SURVIVES; between → INDETERMINATE | repeat arm **0.0960 / 0.0960 / 0.1440, mean 0.1120 ≤ 0.30** | **branch SURVIVES (decisive)** — see the mechanism caveat below |
| R6 | m5_persist dev @500 ≤ m5_horizon dev @500 | 0.3745 ≤ 0.3884 | **PASS** — persistence beats horizon, but both miss the 0.30 bar |

Descriptive: homeostasis inherited intact (max unclamped |r| = 1.1253 —
plasticity untouched); repeat-pattern composition 4/5/6 off-path cells of 10
per seed; corr@399 bit-identical across seeds in every arm (the training era
consumes no rng, as registered).

## The decomposition result: fixing cause (2) alone does not fix the noise lane

The frozen normalizer worked exactly as specified — and that is the finding.
M4's threshold chased 0.75 → 1.05 in lockstep with the noise-heated Emax; M5's
stayed **pinned at 0.532** for all 100 noise ticks. The chase is gone. The
noise lane did not move by a digit: m5_horizon's per-seed off-path devs are
**bit-identical to the ungated baseline's**, its 25/25/24 saturated off-path
cells are the baseline's 25/25/24, and their first-saturation ticks match the
baseline's **tick for tick** (427, 427, 433, 434, …). The gate blocked only
71/60/84 small noise-phase commits (all would-emit) — delays, never refusals —
because the threshold sits barely above the `ewma_slow` init: 0.532 vs 0.5
(the registered stale-init risk, realized). A cell needs ~4–6 winner ticks of
noise heating to cross a 0.032 gap at β = 0.005 — and r needs ~13+ winner
ticks to climb to a commit-worthy delta. **The gate is always open by the time
the seal is ready.** M4's cause (1) — coupling — is the binding constraint;
cause (2) was real but not load-bearing. The registered instrument did its
job: M5 converts M4's compound failure into a single clean cause.

## The falsification arm: branch SURVIVES — and what it actually means

The repeat arm's registered outcome: mean off-path dev @500 = **0.1120 ≤
0.30** → **branch SURVIVES**, decisive, booked as registered. Read honestly,
with the mechanism caveat that was carried in the judge state alongside the
booking:

- The repeated pattern contains only **4/5/6 off-path cells of 54** per seed —
  the cell-mean metric (mean over ALL off-path cells) drops mostly because the
  repeating noise *exposes* far fewer cells than fresh noise does (fresh:
  ~10 random cells/tick sweep 25 off-path cells into saturation over 100
  ticks; repeat: only the pattern's fixed cells can ever be noise-injected).
- Per-cell, the gate did **not** refuse the repeating noise: it sealed 4/4/6
  repeated off-path cells (≈ every one it was exposed to), and their first
  saturation ticks (408–415) are **earlier** than the fresh-noise baseline's
  (427+) — every-tick injection heats the coupled signal faster, exactly the
  coupling failure mode, now twice-receipted.
- So the registered instrument fires SURVIVES while the per-cell mechanism
  stays with M4: **no gate built from the cell's own winner-sampled history —
  fast (β = 0.05, M4), slow (β = 0.005, M5), or K-of-5 persistence (M5) —
  refuses a saturation seal.** What survives the falsification arm is the
  *frozen normalizer + sparse exposure* combination, not gate discrimination.
  The premise, in its sharpest per-cell form, is falsified even though the
  registered bar books SURVIVES; both readings are on the record, which is
  what an either-way instrument is for.

Secondary honest readings: the repeat arm's corr@500 (0.5592/0.5755/0.4763)
is *worse* than fresh noise's — a persistent wrong pattern distorts the
receipt map more than IID noise; and m5_persist's R6 "win" (0.3745 ≤ 0.3884)
is bought with a −0.125 training-lane tax (corr@399 0.5822), the worst
encoding cost of any gate in the program (M3 −0.0206, M4 −0.0031, M5-persist
−0.1245).

## The M-series arc, rounds 1–5: a falsification program working as designed

| Round | Hypothesis tested | Registered instrument | Outcome |
|---|---|---|---|
| M1 (74-b) | Oja + k-winner + entropy-gated ledger works at all | homeostasis bound, encoding error, replay, graceful decay | 4/4 PASS — the substrate |
| M2 (75-b) | lateral inhibition on the Oja target improves the map | paired corr, receipts | **FALSIFIED** — credit-side, not target-side |
| M3 (76-a) | instantaneous self-contrast gates receipts | corr@399 vs 0.70 bar | **FALSIFIED** — "instantaneous self-contrast is not receipt quality"; corrected the instrument to tick 500 |
| M4 (77-a) | the slow signal (β = 0.05 EMA) separates pattern from noise | corr@500 paired, off-path @500 ≤ 0.3 | best TRAINING-lane gate (−0.003 tax), **noise lane FAIL** — two causes receipted |
| M5 (78-a) | stretch the horizon + freeze the normalizer; repeat the noise | decomposition + either-way falsification arm | chase **eliminated**, noise lane **unchanged** → coupling is binding; repeat arm books SURVIVES with the per-cell caveat above |

Every round killed exactly one thing and kept the substrate: the fail-closed
receipt ledger has now passed replay/tamper/paired-honesty tests **five
consecutive rounds** under five admission rules, three of them failed gates.

**What "learning = folding receipts" means after five rounds.** The program's
 founding bet is that learned state is not a weight matrix but the *fold of an
 auditable receipt stream* — r_commit is literally the ledger's monoid fold,
 and every admission rule is a hypothesis about WHICH receipts deserve to
 exist. Five rounds in, the bet has split cleanly down the middle:

1. **The fold is robust.** Determinism, tamper refusal, prefix-fold-to-snapshot
   and bit-exact re-runs held under every gate ever layered on top (5/5).
   "Learning = folding receipts" is load-bearing as a *substrate* claim.
2. **Receipt quality cannot be manufactured by the emitter's own history.**
   Self-contrast in instantaneous form (M3), slow form (M4), 200-tick form
   (M5-horizon), and vote-over-window form (M5-persist) all fail the same
   test: the evidence a cell cites for its own commitment is heated by the
   very events it is being asked to refuse. Five arm-failures, one cause,
   now isolated by decomposition.
3. **What would actually separate pattern from noise** (the program's next
   honest queue): evidence that is NOT the cell's own winner history —
   cross-cell contrast at training-era timescales (a cell vs its neighborhood's
   frozen training-era statistics), or a discriminator computed at the lattice
   level from the receipt stream itself (fold-side, not emit-side). Both need
   their own preregistration; both now have a precisely measured failure
   surface to beat: 25/54 off-path cells sealing at r_commit 1.0 with
   first-seal ticks 427+.

Judge panel (advisory, registered protocol): **Jev** r1 0.07 / r2 0.07 / r3
0.88 / r4 0.82 / r5 0.89 / r6 0.92, evidence_quality 3.57, prereg_fidelity
3.89 — flags exactly the two registered FAILs. deepinfra auditors
ByteDance/Seed-2.0-mini + XiaomiMiMo/MiMo-V2.6-Flash (temp 0, both parsed
first-try): both F,F,T,T,T,T; **majority vs mechanical 6/6** — panel confirmed
both failures and the R5 booking. deepinfra $0.0039 ≪ $0.03 budget.

M6 queue (unregistered): the cross-cell/training-era discriminator (§ above);
a stale-init-honest horizon variant (init-corrected ewma_slow) only if the
discriminator route is exhausted first; the repeat-pattern instrument is
shipped and reusable — any future gate must run it alongside the fresh-noise
lane.

— 78-a, wave 78. Preregistered, booked either-way, pushed.
