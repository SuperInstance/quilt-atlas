# round4 summary — model cell lab round 4 (task 72-k)

**Question (AMENDMENT 5, frozen pre-fire): does the M1-vs-M2 instrument DISCRIMINATE when the CONDITIONS are degraded (mentor-context starvation, repair starvation, output-budget caps) rather than the spec?**

Matrix: 2 models x 5 conditions (M1 control, D1 context-starved M2, D2 repair-starved, D3 budget-capped M1, D3M2 budget-capped M2) x s4 x n=3 replicates, temp 0.4.

## Per-model x condition

| model | cond | n | first-shot pass (by rep) | final pass (by rep) | mean final | repairs | trunc events | judge medians (by rep) |
|---|---|---|---|---|---|---|---|---|
| Muse-Glimmer-30B | M1 | 3 | [0.0, 0.0, 0.0] | [1.0, 1.0, 1.0] | 1.00 | 3 | 3 | [] |
| Muse-Glimmer-30B | D1 | 3 | [1.0, 0.0, 0.0] | [1.0, 1.0, 1.0] | 1.00 | 2 | 4 | [] |
| Muse-Glimmer-30B | D2 | 3 | [0.0, 0.0, 0.0] | [0.0, 0.0, 0.0] | 0.00 | 0 | 3 | [] |
| Muse-Glimmer-30B | D3 | 3 | [0.0, 0.0, 0.0] | [1.0, 0.0, 1.0] | 0.67 | 5 | 6 | [] |
| Muse-Glimmer-30B | D3M2 | 3 | [0.0, 0.0, 0.0] | [0.0, 1.0, 1.0] | 0.67 | 5 | 9 | [] |
| Nemotron-3-Nano-30B-A3B | M1 | 4 | [1.0, 1.0, 1.0, 1.0] | [1.0, 1.0, 1.0, 1.0] | 1.00 | 0 | 0 | [] |
| Nemotron-3-Nano-30B-A3B | D1 | 3 | [1.0, 1.0, 0.0] | [1.0, 1.0, 1.0] | 1.00 | 1 | 0 | [] |
| Nemotron-3-Nano-30B-A3B | D2 | 3 | [1.0, 1.0, 1.0] | [1.0, 1.0, 1.0] | 1.00 | 0 | 0 | [] |
| Nemotron-3-Nano-30B-A3B | D3 | 3 | [1.0, 1.0, 1.0] | [1.0, 1.0, 1.0] | 1.00 | 0 | 0 | [] |
| Nemotron-3-Nano-30B-A3B | D3M2 | 3 | [0.0, 1.0, 0.0] | [1.0, 1.0, 1.0] | 1.00 | 3 | 0 | [] |

## VERDICT: INCONCLUSIVE (K1: incomplete matrix)

- complete matrix: False (31/30 valid sessions; harness-error/leak cells count as MISSING, never as 0-pass outcomes)
- first-shot failure cells (<1.0 before repairs): [('meta-models/Muse-Glimmer-30B', 'M1', 1), ('meta-models/Muse-Glimmer-30B', 'D2', 1), ('meta-models/Muse-Glimmer-30B', 'D3', 1), ('meta-models/Muse-Glimmer-30B', 'D3M2', 1), ('nvidia/Nemotron-3-Nano-30B-A3B', 'D3M2', 1), ('meta-models/Muse-Glimmer-30B', 'M1', 2), ('meta-models/Muse-Glimmer-30B', 'D1', 2), ('meta-models/Muse-Glimmer-30B', 'D2', 2), ('meta-models/Muse-Glimmer-30B', 'D3', 2), ('meta-models/Muse-Glimmer-30B', 'D3M2', 2), ('meta-models/Muse-Glimmer-30B', 'M1', 3), ('meta-models/Muse-Glimmer-30B', 'D1', 3), ('nvidia/Nemotron-3-Nano-30B-A3B', 'D1', 3), ('meta-models/Muse-Glimmer-30B', 'D2', 3), ('meta-models/Muse-Glimmer-30B', 'D3', 3), ('meta-models/Muse-Glimmer-30B', 'D3M2', 3), ('nvidia/Nemotron-3-Nano-30B-A3B', 'D3M2', 3)]
- final failure cells: [('meta-models/Muse-Glimmer-30B', 'D2', 1), ('meta-models/Muse-Glimmer-30B', 'D3M2', 1), ('meta-models/Muse-Glimmer-30B', 'D2', 2), ('meta-models/Muse-Glimmer-30B', 'D3', 2), ('meta-models/Muse-Glimmer-30B', 'D2', 3)]

## Round-level budget & calls

- round-level chat calls (gen+gate+judging, from ledger trace + gate state): 40 / 90
- tokens observed: prompt=48372, completion=74049 (cost well under $1 at DeepInfra small-model rates; no fabrication of exact pricing)
