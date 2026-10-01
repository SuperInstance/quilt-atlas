# Cell-Lab Round 3 — Adversarial Spec s4 (wave-72h)

**Question (frozen, AMENDMENT 4 pre-fire):** does the M1-vs-M2 instrument *discriminate* when spec difficulty is raised to adversarial grade?

**Background:** rounds 1–2 were instrument-ceilinged — all 42 primary sessions (7 models × 3 specs × M1/M2) passed 100% of hidden property tests first-shot, so decomposed-with-mentor (M2) vs monolithic (M1) was indistinguishable. The wave-70 queue prescribed round 3 with an adversarial spec authored by tencent/Hy3 and carried a discrimination estimate p(discriminate)=0.79.

## AMENDMENT 4 protocol (pre-registered before any generation call)

- **s4 authorship:** tencent/Hy3 (allowlisted), same conversation, ≤3 revision rounds. Round-1 draft **failed our validation**: a keeper reference implementation written from spec_text alone disagreed with Hy3's own worked examples in 3 places (simultaneous-charge, refractory-decrement, multi-step). Revision round 2 (1 of 3 used) fixed all three; spec pinned (`spec_text` sha256 `df1f59f8…`).
- **Offline gate (all PASS before firing):** `refimpl_s4.py` (written from spec text only, never sent to models) passes 8/8 hidden properties; Hy3's 5 self-check inputs match the reference exactly; **three named mutants each fail their named target property** (off-by-one refractory window → multi-step; swapped ring direction → wraparound-dir; missing refractory guard).
- **Run config:** 3 reserved models (Muse-Glimmer-30B, Nemotron-3-Nano-30B-A3B, Hy3) × {M1, M2} × s4; 3 allowlisted deepinfra judges per batch, never the author (Groq perimeter-blocked 403 — environment, not credentials — AMENDMENT-1 fallback engaged); budget cap 90 calls; repair cap 3/session.
- **Registered prediction:** per-session pass-rate lands in the headroom zone [0.3, 0.7]; p(discriminate)=0.79. KILL conditions pre-registered.

## Results

| model | M1 pass | M2 pass | repairs | M1 judges | M2 judges | medians |
|---|---|---|---|---|---|---|
| Muse-Glimmer-30B | 1.0 | 1.0 | 0 / 1 | 10,10,9 | 9,9,9 | 10 vs 9 |
| Nemotron-3-Nano-30B-A3B | 1.0 | 1.0 | 0 / 0 | 10,9,9 | 8,10,8 | 9 vs 8 |
| tencent/Hy3 | 1.0 | 1.0 | 0 / 0 | 9,10,10 | 8,9,10 | 10 vs 9 |

- **Primary verdict: STILL-CEILINGED.** 6/6 sessions passed 8/8 hidden properties (five first-shot, one after a single repair). The headroom-zone prediction FAILED; p(discriminate)=0.79 **FAIL** — actual discrimination on the primary metric is zero across three rounds and four difficulty grades.
- **Secondary texture (gate-verified judge instrument):** every model's judge median favors M1 by exactly +1 (median-of-medians 10 vs 9; sign test 3/3, each n=1, LLM-opinion scores). Direction is consistent but magnitude is noise-level; booked as texture, not evidence.
- **Cost:** 18 generation/judging calls total (10 + 8), all within allowlist; transcripts and receipts preserved (`round3.jsonl`, `round3b.jsonl`).

## Interpretation (honest)

The ceiling is **task-class-bound, not spec-bound**. Even a spec authored adversarially by one of the lab's own models — mutation-validated so that plausible-looking implementations fail specific properties — is solved first-shot by every reserved model. Two standing explanations remain indistinguishable by this instrument: (a) the kernel-implementation task class sits inside the competence band of all allowlisted models, so no spec of this type can create headroom; (b) M1 and M2 genuinely do not differ on outcomes at this scale, and only judge texture (slight M1 preference, plausibly penalizing decomposition overhead) varies.

## Standing verdict for the self-decomposition roadmap

Three rounds, four specs, seven models: **decomposed-with-mentor shows no measurable benefit on relational-cell kernel implementation**, and the sole consistent signal (judge medians) leans the other way. This is a receipted negative result. Consequences for wave-73:

1. **Change the condition axis, not the spec axis:** create headroom by degrading conditions (mentor-to-worker context stripped; repair budget 0 vs 3; token-capped generation) rather than by hardening specs.
2. **Price per-cell luck:** n>1 replicates per (model, condition) at temperature 0.4 — single runs cannot separate a +1 median from noise.
3. **Route decomposition to where monolithic demonstrably fails** (first-shot hidden-property failures — currently never observed in this lab), instead of as a default condition.

## Notes

- Run integrity: the original 72-h agent run was interrupted after writing Muse+Nemotron rows; the keeper completed Hy3's sessions under the same AMENDMENT-4 config (tag `round3b`) and merged. All sessions, transcripts, and receipts are the harness's own artifacts; nothing was re-derived or imputed.
- Harness key-scan reports 1 hit at `run_harness.py:743` — the scanner's own regex literal (pre-existing negative control, not a secret).
