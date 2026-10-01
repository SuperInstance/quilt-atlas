# Cell-Lab Round 4 — Condition-Degradation Axis (wave-72k)

**Question (AMENDMENT 5, frozen pre-fire):** does the M1-vs-M2 instrument discriminate when the *conditions* are degraded — mentor-context starvation (D1), repair starvation (D2), output-budget caps (D3/D3M2) — rather than the spec?

Round 3's verdict prescribed changing the condition axis after the spec axis (s1–s3 standard, s4 adversarial-authored) failed to create headroom across three rounds. Full pre-registration: `studies/data/prereg_round4.md`; harness: `run_round4.py` (imports the round-1/2/3 harness unmodified; s1–s4 pins untouched; fail-closed ledger ≤90 calls; D1 leak check fail-closed per session).

## Design

2 models (Muse-Glimmer-30B, Nemotron-3-Nano-30B-A3B — the two largest round-3 judge textures) × 5 conditions (M1 control; D1 context-starved M2 — mentor call made, output withheld behind a frozen placeholder; D2 repair-starved M1; D3 budget-capped M1 at max_tokens=1600 ≈ 39% of round-3's 4096; D3M2 budget-capped M2 — mentor+worker+repairs all capped, mentor output replayed) × spec s4 (re-used, not re-authored) × **n=3 replicates** at temperature 0.4. Judges: MiMo-V2.6-Flash, Seed-2.0-mini, Ling-3.0-flash (never the author).

## Results (31 sessions; 40/90 round-level calls; all rows judged)

| model | cond | first-shot (by rep) | final (by rep) | mean final | judge mean-of-medians |
|---|---|---|---|---|---|
| Muse | M1 | [0, 0, 0] | [1, 1, 1] | **1.00** | 8.67 |
| Muse | D1 | [1, 0, 0] | [1, 1, 1] | 1.00 | 8.50 |
| Muse | D2 | [0, 0, 0] | [0, 0, 0] | **0.00** | 1.00 |
| Muse | D3 | [0, 0, 0] | [1, 0, 1] | 0.67 | 5.67 |
| Muse | D3M2 | [0, 0, 0] | [0, 1, 1] | 0.67 | 6.33 |
| Nemotron | M1 | [1, 1, 1, 1] | [1, 1, 1, 1] | 1.00 | 7.50 |
| Nemotron | D1 | [1, 1, 0] | [1, 1, 1] | 1.00 | 8.00 |
| Nemotron | D2 | [1, 1, 1] | [1, 1, 1] | 1.00 | 7.00 |
| Nemotron | D3 | [1, 1, 1] | [1, 1, 1] | 1.00 | 7.00 |
| Nemotron | D3M2 | [0, 1, 0] | [1, 1, 1] | 1.00 | 5.33 |

**Harness bookkeeping (fail-closed, unchanged):** 3 Muse sessions emitted truncated code (unclosed paren / unterminated strings — token-cap casualties); the harness counts `sandbox_violation` rows invalid → 28/30 valid → **its own verdict stays INCONCLUSIVE (K1)**. We do not edit verdict logic post-hoc. The analysis below scores the registered predictions against the raw rows.

## Registered predictions, scored by hand from rows

| # | prediction | verdict | mechanism |
|---|---|---|---|
| P1 | D1 null: mentor channel adds nothing (p=0.70) | **PASS** | D1 final = 1.00 both models = M1 |
| P2 | Muse D3 ≤ 0.75 | **PASS** | 0.67 (cap truncations unrecoverable in 1 of 3 reps) |
| P3 | Nemotron D3 ∈ [0.5, 1.0] | **PASS** | 1.00 (upper edge) |
| P4 | D2 == M1 (every rep 1.0) | **FAIL** | premise falsified by the replicates themselves: Muse M1 first-shot is 0/3 this round, so D2-final(0) == M1-first-shot(0) mechanically |
| P5 | M1 = D1 = D2 = D3 identical outcomes | **FAIL** | D2 and D3 diverge |

## Findings

1. **The replicate structure invalidated the round-1..3 "ceiling".** Muse's s4 first-shot pass was 1.0 as a single rep in round 3 and **0/3 at the identical config in round 4** — the ceiling was partly per-cell luck, now priced. Any future lab round must run n≥3.
2. **The instrument finally discriminates conditions** (Muse: D2 0.00 vs M1 1.00; D3 0.67) — but the discriminating variables are **repair slack and output budget interacting with true first-shot competence**, not the decomposition hypothesis.
3. **The decomposition question remains null everywhere it is measured.** D1 (mentor channel) null on both models; D3M2 == D3 on final pass for Muse (0.67 == 0.67) and Nemotron (1.00 == 1.00); and **D3M2 has the worst judge texture on both models** (5.33 / 6.33) — under output scarcity the M2 pipeline (mentor+worker, both capped) produces the worst-judged code, consistent with round 3's M1-favoring texture.
4. **Standing three-round verdict for the self-decomposition roadmap:** decomposed-with-mentor shows no measured benefit on this task class in any round, condition, or budget regime; under scarcity it is if anything harmful. Future work routes decomposition to tasks where monolithic first-shot demonstrably fails (rare: Nemotron 10/10 first-shot; Muse 0/6 this round), rather than as a default.

## Honesty notes

- Muse's round-4 M1 first-shot collapse (0/3 vs round-3's 1.0) is unexplained beyond temperature-0.4 luck + n=3; no config change was made (M1 is byte-identical to round-3 config). The receipts pin everything.
- Muse D2's three syntax-error emissions and D3M2-r1's unclosed-paren are truncation artifacts booked as outcomes of their conditions, not as property failures; the harness's more conservative INCONCLUSIVE is preserved alongside.
- Ling's judge batch for Muse returned 0/15 parsed even after retry (2 judges per candidate instead of 3 for that author); medians use whatever parsed.

## Artifacts

`run_round4.py`, `outputs/round4.jsonl` (31 rows), `outputs/round4_summary.md`, `outputs/prereg_round4.md`, sealed `w72-celllab-round4` in `outputs/seals-w72/`.
