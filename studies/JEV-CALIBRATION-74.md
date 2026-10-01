# Jev System-One Calibration vs 3-Auditor Majority (wave-74a)

**Date:** 2026-10-01 · **Lane:** typesafe.ai only (deepinfra spend $0) · **Prereg:** `outputs/w74-jev-cal.expectation.json` (stamped 2026-10-01T07:28:04Z, before any calibration call)

## What Jev is

TypeSafe's **System One judge** (`api.typesafe.ai/v1/systemone`, spec receipt `outputs/typesafe-openapi.json`). Not a chat API: you POST one `state` (string/object/array) plus named questions of three kinds — `noul` (probability of yes/true, 0..1), `score` (ordered rubric levels), `choice` (named alternatives + probabilities + confidence) — and get back typed answers with token usage. Models: `jev-latest`, `jev-preview` ("System One Model: Jev"). One request may carry MANY questions over ONE state; a 10-question batch answered in ~300 ms.

## The reflex/reflect architecture idea

Wave-72's 3-auditor regime (Seed-2.0-mini, Hy3, Muse over the 10 core corpus-graph edges, KEEP = majority, digest-bound harsh standard) is a *reflective* process: long-context reading, evidence tables, reasoning tokens, ~1–6 s and thousands of tokens per audit. The founder's taxonomy (everything is weights: soft/reflective/**reflexive**) says a judge layer should exist *under* it: **Jev = the reflexive judge** — a single fast pass that grades a claim without deliberation, at ~250 ms and ~20 output tokens per question, while deepinfra models remain the reflective layer that handles what the reflex flags. Measured tonight: such a cascade is not hypothetical — see the routing result below.

## Calibration instrument

`scripts/ts_client.py` (shared client: key from `.env.keys` only, retry/backoff on 429/5xx, per-call latency + usage accounting; smoke receipt `outputs/w74-jev-smoke.json` — 1 noul + 1 score + 1 choice, all types parsed). Calibration: for each of the 10 edges, one `noul` question — *"Should edge Ei (from>to type) be KEEPED in the corpus graph? true = KEEP, false = KILL"* — with KEEP/KILL criteria mirroring the auditors' standard (KEEP requires explicit digest evidence for the payload claim; plausibility is not KEEP). State = verbatim `w71_profile.txt` digest + the 10 edge records exactly as receipted in `outputs/w72-audit-r2.json`. Verdict mapping registered before calls: `noul >= 0.5 => KEEP`. Primary instrument = 1 batched request per model (10 named questions); robustness/latency instrument = 10 individual requests (one edge per request, jev-latest). Total: **12 calls, 23,422 input tokens, 550 output tokens; 0 retries needed.**

## Calibration table (batched = primary)

| edge | 3-auditor majority (votes S/H/M) | jev-latest noul | verdict | jev-preview noul | jev-latest noul (individual) |
|---|---|---|---|---|---|
| E1 C1>C2 rediscovery-of | KILL (K,K,K) unan | 0.23 | KILL ✓ | 0.21 | 0.18 |
| E2 C2>C1 antidote-to | KILL (K,K,K) unan | 0.38 | KILL ✓ | 0.41 | 0.52 ✗ |
| E3 C1>FLEET ancestor-of | KILL (K,K,K) unan | 0.17 | KILL ✓ | 0.18 | 0.11 |
| E4 FLEET>C1 antidote-to | KILL (K,**E**,K) split | 0.52 | KEEP ✗ | 0.52 | 0.64 ✗ |
| E5 C3>FLEET dataset-for | KEEP (**E**,**E**,K) split | **0.91** | KEEP ✓ | 0.89 | **0.89** |
| E6 FLEET>C3 instrument-for | KILL (K,K,K) unan | 0.57 | KEEP ✗ | 0.58 | 0.37 |
| E7 C2>FLEET ancestor-of | KEEP (**E**,**E**,**E**) unan | **0.95** | KEEP ✓ | 0.95 | **0.96** |
| E8 FLEET>C2 antidote-to | KILL (K,**E**,K) split | 0.64 | KEEP ✗ | 0.65 | 0.58 ✗ |
| E9 C2>C3 instrument-for | KILL (K,K,K) unan | 0.56 | KEEP ✗ | 0.62 | 0.31 |
| E10 FLEET>C2 instrument-for | KILL (K,K,K) unan | 0.34 | KILL ✓ | 0.41 | 0.13 |

(E = auditor KEEP vote; S/H/M = Seed 72-f, Hy3 72-i, Muse 72-i. ✓/✗ vs majority.)

## Expectation verdicts (registered 07:28:04Z, scored from raw receipts)

| id | registered claim | measured | verdict |
|---|---|---|---|
| **E1** | jev-latest vs majority ≥ 0.7 | **0.60** (6/10, batched primary); individual spot-check 0.70 | **FAIL** |
| **E2** | jev-preview vs jev-latest ≥ 0.8 | **1.00** (10/10) — **confounded, see below** | **PASS** (weakened) |
| **E3** | mean \|noul−0.5\| unanimous > split | **0.209 > 0.190** (batched, razor-thin); individual 0.269 > 0.203 | **PASS** (weak) |
| **E4** | latency per question < 3 s | **median 250 ms** (batched amortized 33/27 ms per question) | **PASS** |

## Findings

1. **Jev is a real reflex layer.** ~250 ms and 20 output tokens per judged edge, one API call for ten judgments. It recovered the direction of the auditors' harsh KILL regime (0.6–0.7) with zero audit-specific prompting beyond the registered criteria.
2. **Its misses are exactly the "absence-of-evidence" KILLs.** All four batched disagreements (E4 0.52, E6 0.57, E8 0.64, E9 0.56) are noul just above the boundary — Jev feels the plausibility of a well-formed edge and the harsh digest-bound standard forbids that. Where the auditors' KEEP standard is *anchored on verbatim digest evidence* (E5, E7), Jev is confidently right (0.89–0.96). Reflex reads salience; reflection enforces the evidence rule.
3. **Confidence tracks consensus, weakly (E3).** Direction correct on both instruments, but the batched margin is 0.019 — one edge (E5) carries the split-group mean because the auditors' split there was Muse's lone dissent against verbatim evidence. n=3 split edges; treat as directional only.
4. **E2's perfect sibling agreement is confounded:** the response `model` field resolves **both** aliases to `jev-1.13.0`. Nouls differ slightly between the two identical batch requests (0.21–0.65 range), so either sampling noise or same-version-different-weights. E2 measured within-version stability, not two-model agreement. Booked as PASS with the confound stated.
5. **Reflex–reflect cascade (post-hoc, in-sample, NOT preregistered):** routing rule "auto-accept if \|noul−0.5\| > 0.15, else escalate to the reflective auditors" would auto-resolve 5/10 edges — all 5 correct (E1/E3/E10 KILL, E5/E7 KEEP) — and escalate the 5 near-boundary edges, whose majority verdicts are all KILL. 10/10 end accuracy at **50% of the reflective cost**. Fitted on the same 10 edges it scores; a preregistered replication on fresh edges (wave-75 seed) is required before this is a policy.
6. **Batching sensitivity is real:** batched vs individual verdict agreement 0.7 (flips E2, E6, E9 — all near boundary). A reflex judge re-reads state fresh each time; near 0.5 its answer is context-order-sensitive. Preregistered primary (batched) is what E1 is scored on; the individual instrument is reported alongside.

## Honest limitations

- n=10 edges from one corpus study; ground truth is itself 3 LLM auditors bound to a 2.7 KB digest (their majority = Seed's 2/8 exactly, 6/10 unanimous KILL), not repo truth.
- Jev saw criteria that spell out the harsh standard — without them the gap would likely be larger; with them, part of Jev's performance is criteria-following, not corpus judgment.
- E1 FAIL is instrument-frame-dependent (0.60 batched vs 0.70 individual); the preregistered frame is batched and that is what is scored — no post-hoc frame switching.
- typesafe.ai pricing is not published; costs are reported as token counts (output tokens free per API docs). deepinfra spend this task: $0.
- One aggregation bug found and patched in the receipt (individual E3 block recomputed from the same receipt's raw answers; patch documented in `honesty_notes`; raw answers untouched).

## Artifacts

- `scripts/ts_client.py` — shared TypeSafe client (retry/backoff, usage accounting, CLI smoke test)
- `scripts/w74_jev_calibration.py` — prereg docstring + calibration runner
- `outputs/w74-jev-smoke.json` — smoke receipt (raw) · `outputs/w74-jev-cal.expectation.json` — preregistration
- `outputs/w74-jev-calibration.json` — full receipts: raw answers, per-edge table, agreement, latencies, usage, E1–E4 scoring
- Ground truth: `studies/data/w72-audit-r2.json` (72-i), study `GRAPH-R2-72.md`
