# STUDY: ANIMAL-AI 900-ARENA LATTICE — full-corpus potential scan (wave-72, task 72-b)

Date: 2026-10-01 · Agent: w72-b (quilt-fleet researcher) · Status: complete, bench-sealed

**Corpus.** animal-ai (fork of Kinds-of-Intelligence-CFI) `configs/competition/` = exactly 10 families x 30 days x 3 variants = 900 arena YAMLs — a perfect competition lattice. Wave-71 (71-2c) built the arena->cell simulator and ran it on a sample; wave-71's PROBE-3 registered absolute family-mean thresholds that FAILED honestly (lesson: *register fractions/orderings, not absolute mean thresholds extrapolated from n=6*). This wave runs the identical instrument over **all 900** arenas and tests five pre-registered **fraction/ordering** predictions.

## 1. Methods — mapper physics (identical to wave-71, imported not copied)

Instrument: `scripts/w71_probe3_arenas.py` (the faithful 71-2c mapper), imported by `scripts/w72_lattice_full.py`. Zero mapper code was re-typed or weakened; the module was refactored **structurally only** (driver wrapped in `main()`, `rasterize` / `nudge_spawn` / `jacobi` extracted verbatim from the original `arena_potential` body) so it can be imported.

- YAML: custom SafeLoader for `!ArenaConfig/!Arena/!Item/!Vector3/!RGB`; first arena of each file.
- Raster: 40x40 grid, 1 cell = 1 unit. `Wall`/`WallTransparent` -> blocked IF they intersect the walking band (y in [0.2, 0.9]) and their footprint does not contain the agent (is_floor carve-out: AAI uses wall slabs as raised floors). Footprint = axis-aligned bbox of (sx, sz) at (x, z); **rotation ignored**. Items with x/z outside [0, 39.9] skipped. `Ramp`/`CylinderTunnel*` walkable.
- Sources/sinks are POINT cells: GoodGoal/GoodGoalMulti/Bounce variants/RipenGoal/GrowGoal -> +1; BadGoal/BadGoalBounce/BadGoalMulti/DeathZone/ShrinkGoal/HotZone -> -1.
- Physics: free-cell conductance 1, blocked 0; steady-state potential by **400-sweep numpy Jacobi**, sources/sinks re-pinned every sweep, blocked cells forced to 0.
- Difficulty metric (the w71 metric, unchanged): **potential at the agent spawn cell** (injection point). If the spawn cell is rasterized blocked, the w71 spawn-nudge moves the probe to the nearest free cell by Manhattan distance (nudged in 35/876 arenas here).
- New full-field stats over **floor cells** (all non-wall cells; pinned +/-1 source/sink cells included): mean/min/max potential, `frac_pos_gt_045` (fraction > +0.45 = positive structure), `frac_neg_lt_m030` (fraction < -0.30 = negative structure), goal/hazard counts (point instances the mapper pinned), wall fraction (blocked cells / 1600).

**Refactor verification.** After extraction, `w71_probe3_arenas.py` was re-run end-to-end: 876/900 parsed, per-family n/min/max/neg_frac **exactly identical** and means identical to <1e-12 vs the pre-refactor `w71_probe3.json`. During this run, every one of the 876 `potential_spawn` values was recomputed with the untouched `arena_potential()` and compared bit-for-bit: **0 mismatches**.

## 2. Parse census: 876/900

All 24 unparsed files fail for ONE reason: **no Agent item** (the mapper refuses to invent an injection point). They form three structurally degenerate groups — themselves a corpus finding:

- `01-20/21/22/23-{1,2,3}.yaml` (12): a single `GoodGoalMulti` item with size vectors but **no positions at all**, no agent — truncated configs.
- `05-13/14/15-{1,2,3}.yaml` (9): `Cardbox1` + `GoodGoal` (goal stacked at y=2 above the cardbox), no agent.
- `07-25-{1,2,3}.yaml` (3): `GoodGoalMulti`, no positions, no agent, with a blackouts list.

Target was 900/900; 876/900 is the honest ceiling of the faithful mapper. The 24 rows are present in the JSON with `parsed: false` and the reason, so the 900-row table is complete.

## 3. Per-family results (876 arenas)

| family | n | mean V@spawn | frac>+0.45 (mean) | frac<-0.30 (mean) | frac<-0.30 (pooled) | mean goals | mean hazards | wall% |
|---|---|---|---|---|---|---|---|---|
| 01 | 78 | +0.0371 | 0.00569 | 0.02373 | 0.02373 | 0.88 | 0.50 | 0.0% |
| 02 | 90 | +0.0087 | 0.02327 | 0.00287 | 0.00290 | 2.31 | 0.27 | 4.8% |
| 03 | 90 | +0.0162 | 0.00388 | 0.00000 | 0.00000 | 1.01 | 0.00 | 5.3% |
| 04 | 90 | -0.0432 | 0.00309 | 0.10222 | 0.10358 | 1.07 | 2.61 | 5.4% |
| 05 | 81 | +0.0001 | 0.00436 | 0.00000 | 0.00000 | 2.48 | 0.00 | 26.0% |
| 06 | 90 | +0.0019 | 0.00475 | 0.00954 | 0.01113 | 2.00 | 0.23 | 14.3% |
| 07 | 87 | -0.0053 | 0.00338 | 0.00609 | 0.00636 | 1.52 | 0.31 | 4.5% |
| 08 | 90 | +0.0069 | 0.00704 | 0.00356 | 0.00372 | 1.43 | 0.40 | 8.2% |
| 09 | 90 | +0.0190 | 0.02514 | 0.00096 | 0.00102 | 3.27 | 0.03 | 6.2% |
| 10 | 90 | +0.0025 | 0.00503 | 0.00952 | 0.00984 | 1.40 | 0.83 | 4.3% |

Structure notes the fractions surface that means alone hid:

- Family **04** (hazards) is the only family whose mean spawn potential is negative (-0.0432) AND dominates negative structure: 10.22% of floor cells < -0.30 — **4.3x** the runner-up (family 01, 2.37%).
- Family **01** (basic goals) is the surprise #2 in negative structure: 7 of its 78 arenas carry `BadGoal`/`BadGoalBounce` instances (12 + 9 across the corpus) — the 'easy' family is not hazard-free.
- Family **05** is the wall-richest (26.0% blocked) yet its potentials are ~0 everywhere (mean V@spawn +0.0001): walls shape paths, not potentials, when no sinks exist.
- Family **09** (multi-goal) has the highest positive-structure fraction (2.51%), edging family **02** (2.33%) — both pair multiple goals (3.27 and 2.31 per arena) with walls that crowd the sources; the single-goal families 01/03 sit at 0.57%/0.39%.

## 4. Pre-registered ordering predictions (5)

**(a) family 04 has the highest negative-structure fraction — PASS.** f04 = 0.10222; top-3: 4 = 0.10222, 1 = 0.02373, 6 = 0.00954.

**(b) family 07 (blackouts) negative-structure fraction > 0 — PASS.** f07 = 0.00609 > 0 (21% of its arenas negative at spawn; driven by 12 `BadGoal` + 9 `DeathZone` instances — the blackouts themselves are invisible to a static instrument).

**(c) families 01-03 positive-structure fraction > 0.5 — FAIL (honest).** f1 = 0.00569, f2 = 0.02327, f3 = 0.00388 — every one is ~100x below the registered 0.5. Measured structure: with +1 pinned at point sources over a 40x40 field, potential decays below +0.45 within ~2 cells of a goal, so even the easiest family has positive structure on well under 3% of floor cells. The *ordering* behind the prediction does hold (each of f01/f02/f03 > f04's 0.00309) — the absolute threshold was mis-calibrated again, this time in fraction space. Next registration: relative orderings only.

**(d) family 09 (multi-goal) has the highest mean goal count — PASS.** top-3: 9 = 3.27, 5 = 2.48, 2 = 2.31.

**(e) family 10 (movable blocks) is mid-range difficulty — PASS (with a caveat).** family-mean V@spawn: f10 = +0.00252, strictly between f04 = -0.04318 and min(f01..f03) = +0.00872. Caveat: the gap to the 01-03 band is ~7x smaller than the gap to f04 (f10 hugs the easy side), and the driver of its negative pull is `DeathZone` in 69/90 arenas — the movable blocks themselves (`Cardbox*`/`UObject`/`LObject*`) are NOT in the w71 BLOCK set, so they are invisible to the raster (honest instrument limitation, see section 7).

**Score: 4 PASS / 1 FAIL.** The FAIL is the informative one: it reproduces wave-71's lesson in fraction form — absolute thresholds do not transfer across metric families; orderings do.

## 5. Difficulty leaderboard (potential at spawn, 876 arenas)

| # | easiest (highest V) | f/d/v | V | goals | hazards | # | hardest (lowest V) | f/d/v | V | goals | hazards |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `01-01-01.yaml` | 01/01/1 | +0.4834 | 1 | 0 | 1 | `04-15-03.yaml` | 04/15/3 | -0.6354 | 1 | 5 |
| 2 | `01-19-03.yaml` | 01/19/3 | +0.4687 | 1 | 0 | 2 | `04-15-01.yaml` | 04/15/1 | -0.4729 | 1 | 5 |
| 3 | `01-18-03.yaml` | 01/18/3 | +0.4687 | 1 | 0 | 3 | `04-15-02.yaml` | 04/15/2 | -0.4720 | 1 | 5 |
| 4 | `01-01-02.yaml` | 01/01/2 | +0.3652 | 1 | 0 | 4 | `04-01-01.yaml` | 04/01/1 | -0.1908 | 1 | 1 |
| 5 | `03-11-01.yaml` | 03/11/1 | +0.3236 | 1 | 0 | 5 | `07-16-01.yaml` | 07/16/1 | -0.1908 | 1 | 1 |
| 6 | `01-01-03.yaml` | 01/01/3 | +0.2792 | 1 | 0 | 6 | `07-16-02.yaml` | 07/16/2 | -0.1908 | 1 | 1 |
| 7 | `03-11-03.yaml` | 03/11/3 | +0.2360 | 1 | 0 | 7 | `07-16-03.yaml` | 07/16/3 | -0.1908 | 1 | 1 |
| 8 | `02-29-02.yaml` | 02/29/2 | +0.2291 | 5 | 0 | 8 | `04-01-02.yaml` | 04/01/2 | -0.1082 | 1 | 1 |
| 9 | `03-12-02.yaml` | 03/12/2 | +0.2159 | 1 | 0 | 9 | `04-03-01.yaml` | 04/03/1 | -0.1004 | 1 | 2 |
| 10 | `03-12-01.yaml` | 03/12/1 | +0.2159 | 1 | 0 | 10 | `04-03-02.yaml` | 04/03/2 | -0.1004 | 1 | 2 |

The extremes are coherent: the easiest arenas are early family-01/03 single-goal open fields (`01-01-01` = the competition's first arena, V=+0.4834); the hardest is the family-04 day-15 hazard cluster (`04-15-01/02/03` all in the bottom 3, 5 hazards each, V down to -0.6354 — matching the wave-71 sample's -0.633 minimum), followed by the identical-geometry `07-16-01/02/03` triplet and family-04 day-01/03.

## 6. 10x30 difficulty heatmap (family x day, mean V@spawn over variants)

Full data structure: `heatmap_family_x_day_mean_potential_spawn` in `studies/data/w72-lattice-900.json` (values 10x30, null where all 3 variants unparsed). Rows = family 01..10, columns = day 1..30. 8 of 300 cells are null (f01 d20-23, f05 d13-15, f07 d25 — the no-agent configs).

```
day |      01      02      03      04      05      06      07      08      09      10
  1 |  +0.376  +0.000  +0.000  -0.103  +0.000  +0.000  +0.001  +0.000  +0.000  -0.003
  2 |  +0.039  +0.000  +0.000  -0.033  +0.000  +0.000  +0.001  +0.000  +0.000  -0.014
  3 |  +0.006  +0.001  +0.002  -0.100  +0.000  +0.000  +0.001  +0.000  +0.000  -0.063
  4 |  +0.002  +0.001  +0.000  -0.007  +0.000  +0.000  +0.001  +0.000  +0.000  +0.025
  5 |  +0.002  +0.000  +0.000  -0.038  +0.000  +0.000  +0.001  +0.000  +0.000  +0.025
  6 |  +0.012  +0.000  +0.000  -0.011  +0.000  +0.000  +0.001  +0.000  +0.000  +0.000
  7 |  +0.012  +0.000  +0.000  +0.000  +0.000  +0.000  +0.002  +0.006  +0.000  +0.007
  8 |  +0.109  +0.000  +0.000  +0.000  +0.001  +0.000  +0.001  +0.011  +0.000  +0.007
  9 |  +0.018  +0.000  +0.000  -0.006  +0.000  +0.000  +0.001  +0.001  +0.000  +0.007
 10 |  +0.016  -0.000  +0.022  -0.008  +0.000  +0.006  +0.000  +0.000  +0.000  +0.007
 11 |  +0.109  -0.000  +0.241  -0.042  +0.000  +0.018  +0.000  +0.000  +0.000  +0.007
 12 |  +0.005  +0.000  +0.193  -0.021  +0.001  +0.032  -0.000  +0.000  +0.000  +0.007
 13 |  +0.002  +0.000  +0.005  -0.000     --   -0.044  +0.000  +0.000  +0.000  +0.007
 14 |  +0.002  +0.000  +0.005  -0.000     --   +0.036  +0.000  +0.000  +0.000  +0.004
 15 |  +0.002  +0.002  +0.010  -0.527     --   +0.000  -0.000  +0.000  +0.000  +0.007
 16 |  +0.000  +0.002  +0.001  -0.000  +0.000  +0.000  -0.191  +0.000  +0.000  +0.007
 17 |  +0.000  +0.000  +0.000  -0.001  +0.000  +0.000  -0.042  +0.000  +0.000  +0.004
 18 |  +0.172  +0.000  +0.000  +0.010  +0.000  +0.000  -0.100  +0.000  +0.000  +0.007
 19 |  +0.172  +0.000  +0.000  -0.086  +0.000  +0.000  +0.000  +0.012  +0.025  +0.000
 20 |     --   +0.000  +0.000  -0.058  +0.000  +0.000  +0.000  +0.012  +0.015  +0.000
 21 |     --   +0.007  +0.000  -0.058  +0.000  +0.000  -0.003  +0.032  +0.025  +0.000
 22 |     --   +0.011  +0.001  -0.028  +0.000  +0.000  +0.000  +0.032  +0.015  +0.026
 23 |     --   +0.011  +0.000  -0.018  +0.000  +0.000  +0.000  +0.012  +0.011  +0.000
 24 |  -0.000  +0.049  +0.000  +0.000  +0.000  +0.000  +0.000  +0.012  +0.000  +0.000
 25 |  -0.050  +0.025  +0.002  -0.028  +0.000  +0.007     --   +0.012  +0.039  +0.000
 26 |  -0.044  +0.002  +0.002  -0.022  +0.000  +0.001  +0.024  +0.012  +0.030  +0.001
 27 |  +0.001  +0.052  +0.000  -0.056  +0.000  +0.000  +0.148  +0.012  -0.005  +0.001
 28 |  +0.000  +0.000  +0.000  -0.044  +0.000  +0.000  +0.000  +0.012  +0.184  +0.000
 29 |  +0.000  +0.087  +0.000  -0.006  +0.000  +0.000  +0.000  +0.012  +0.108  -0.000
 30 |  +0.000  +0.011  +0.000  -0.004  +0.000  +0.000  +0.000  +0.012  +0.122  -0.000
```

Reading: the lattice is visibly non-uniform. Difficulty is family-anchored, not day-anchored — family 04 is negative on 26/30 days (positive meaningfully only on d18), family 01 positive-trending early then decaying; the deepest cell is f04/d15 (-0.527); families 05/06/08 hover at ~0 all month (structure without valence). Variance across the 3 variants of a cell is small (triplets usually rank together, e.g. 04-15 and 07-16).

## 7. Honest limitations

1. **Static single-injection metric.** One probe at the spawn cell, one 400-sweep Jacobi field. No agent dynamics: no locomotion constraints, no vision/observation limits, no episode time, no goal-collection sequence, no blackout dynamics (family 07's defining feature is invisible; its negative structure comes from BadGoal/DeathZone instances). Difficulty here = field structure at spawn, not behavioural difficulty.
2. **400 sweeps is under-converged physics** (slowest mode decays only ~69%). Deliberately kept identical to w71 for comparability; it smooths/spreads the field, so thresholded fractions are conservative. All cross-arena comparisons share the bias.
3. **Rotation ignored** in wall rasterization (axis-aligned bboxes), and Cardbox/UObject/LObject (the movable blocks that DEFINE family 10) are not in the BLOCK set — family 10's raster sees its DeathZones and walls but not its blocks; its mid-range verdict (e) should be read with that in mind.
4. **Point sources** approximate finite-extent goal objects; pinned +/-1 cells count inside the fraction denominators (negligible: <0.3% of floor cells).
5. **24/900 unparsed** (no-agent configs) — the no-agent cells of the lattice are absent from all means; they are flagged, not imputed.

## 8. Provenance

- Script: `/home/z/my-project/scripts/w72_lattice_full.py` (imports `scripts/w71_probe3_arenas.py`)
- Data: `/home/z/my-project/outputs/w72-lattice-900.json` (900 rows; 876 parsed) — copied to `studies/data/`
- Seal: `w72-lattice` in `outputs/seals-w72/` (fleet_tools bench-seal; results_sha256 `4419b7b41156ff99bfd9c5583377a93ea1ea2be848208049de33291664247488`, 1-link chain, verify VERDICT PASS)
- Atlas commit: see git log of this repo (studies/ANIMAL-AI-LATTICE-72.md + studies/data/w72-lattice-900.json)
- Consistency: 876/876 potential_spawn values bit-identical to the untouched w71 `arena_potential()`.

**Score recap: 876/900 parsed · predictions 4 PASS / 1 FAIL (c) · leaderboard extremes 01-01-01 (+0.4834) / 04-15-03 (-0.6354) · heatmap 292/300 cells.**
