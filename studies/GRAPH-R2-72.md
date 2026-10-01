# Graph Round 2 + 5-gram Provenance Probe (wave-72f/72g)

**Date:** 2026-10-01 · **Lane:** deepinfra allowlist (7-model discipline) · **Seals:** `w72-graph-r2`, `w72-probe-5gram` (chain VERDICT PASS, `outputs/seals-w72/`)

## 72-f — Multi-model independent graph induction

Round 1 of wave-71 induced one typed graph (MiMo-V2.6-Flash, 12 edges) audited by Seed-2.0-mini (3 KEEP / 3 KILL on a 6-edge sample). Round 2 asks: **is that graph a model quirk or a property of the corpora?** Three fresh allowlist models — Ling-3.0-flash, Nemotron-3-Nano-30B-A3B, Inkling-Small — received the *identical* corpus digest + task string (byte-identical prompt = comparability plus cache-hit pricing), induced graphs independently (R1), then saw anonymized peer graphs and revised or defended (R2, long-session continuation of the same context).

### Pairwise Jaccard on normalized edge sets (R2)

| | MiMo (w71) | Ling | Nemotron | Inkling |
|---|---|---|---|---|
| MiMo (w71) | — | **0.692** | 0.048 | **0.600** |
| Ling | 9 shared | — | 0.111 | **0.833** |
| Nemotron | 1 shared | 2 shared | — | 0.158 |
| Inkling | 9 shared | 10 shared | 3 shared | — |

Two structure findings. First, **MiMo, Ling and Inkling form a tight cluster** (0.60–0.83) while **Nemotron is a systematic outlier** (≤0.16 against everyone) — its R1 output needed a retry and its edge semantics diverge (it reads "instrument-for" edges where others read "dataset-for"). Second, the 4-model consensus contains 10 edges at ≥3/4 votes, with **`FLEET→C3 instrument-for` unanimous (4/4)** — corpus↔corpus edges stay out of consensus, matching wave-71's headline.

### Seed adversarial audit of the 10 consensus edges: 2 KEEP / 8 KILL

The auditor, constrained to the digest only, killed 8 of 10 consensus edges for lack of *explicit* textual evidence — far harsher than its w71 pass (3/6 kept, but that sample was MiMo's own edges). Methodological result, registered here as a standing caution:

> **Consensus measures model-agreement, not digest-truth.** Four models agreeing on an edge raises its prior but is zero evidence; the audit's KEEP set (C3→FLEET dataset-for, C2→FLEET ancestor-of) is defined by verbatim payload–digest matches, not by votes.

MiMo's closing synthesis turn registered the next falsifiable probe against the surviving C2→FLEET lineage claim: a **C2-unique 5-gram provenance scan** of the fleet's own prose.

## 72-g — C2-unique 5-gram provenance probe (deterministic, local)

**REGISTERED (MiMo):** the fleet's diff-lineage prose contains ≥3 C2-unique 5-grams with zero C1/C3 hits, and the matching span is contiguous ≥12 tokens, not scattered boilerplate. **KILL:** hits ≤ decoy baseline, or matches are generic git/CI vocabulary, or the quoted span cannot be completed.

Method: 5-grams of papermill HEAD text absent from *both* synesis-research and animal-ai HEAD (454,888 grams), scanned against the fleet's study/receipt prose (atlas studies + fleet-tools README). Position-ordered chaining; separator/plumbing grams excluded (any gram with <2 alphanumeric tokens — markdown table rules had formed a false 8-chain; caught and excluded before receipting, exactly the boilerplate failure mode the probe pre-registered).

| metric | value |
|---|---|
| C2-unique 5-grams (controls: C1, C3) | 454,888 |
| fleet-prose hits | **4** |
| max contiguous chain | **4 chained 5-grams = 8 tokens** |
| span | `the best ai agent uses the least ai` |
| generic git/CI vocabulary hits | 0 |

**Verdict: strict REGISTER = FAIL (8 < 12 tokens); substantive claim = supported.** The fleet's prose carries exactly **one** distinctive C2 fingerprint — papermill's *Conservation of Intelligence* motto, verbatim, C2-unique, absent from the other two corpora — embedded in the judge-gate/cell-lab design language ("smallest sufficient model per round"). Nothing else leaked through: 4 hits against a 454,888-gram target space is a sparse but real lineage trace, and it supplies precisely the evidence Seed's audit said the digest lacked for a C2→FLEET `ancestor-of` edge. The w71 T2 table had asserted "least-AI motto → instrument-verified selection" from reading; this probe makes that edge lexical and falsifiable.

## Honest limitations

- The audit is digest-bound: "no evidence in digest" ≠ "no evidence in the repos" (72-g is the demonstration — it found the trace the digest could not show).
- Contiguity threshold (12 tokens) was the registrant's choice; at 8 tokens the motto span is the longest prose lineage trace found, but a stricter or looser bar flips the verdict — recorded as registered, not rationalized.
- N-gram provenance is lexical: adoption-by-paraphrase is invisible.
- One Seed auditor; a second adversarial pass would make the 2/8 KEEP/KILL split itself reproducible.

## Artifacts

- `scripts/w72_graph_r2.mjs`, `outputs/w72-graph-r2.json`, `scripts/w72_graph_r2_out.txt` (full transcripts incl. retries; Inkling needed 8k-token retries in both rounds — reasoning tokens swallow JSON budgets)
- `scripts/w72_probe5gram.mjs`, `outputs/w72-probe-5gram.json`, `studies/data/w72-probe-5gram.json`
- Parse-robustness receipt: MiMo's w71 baseline uses unquoted JSON keys; the parser gained bare-key quoting + fallback (three-stage), verified against all four models' outputs.

## Second-auditor reproducibility + Nemotron diagnostic (72-i)

Gate pre-registered before any call (stamped `w72-audit-r2.expectation.json`): per-edge agreement ≥ 0.7 AND same KEEP set within 1 edge.

| pair | per-edge agreement | KEEP-set delta |
|---|---|---|
| Seed vs **Hy3** | **0.80** (8/10) | sym-diff 2 — Hy3 keeps Seed's both KEEPs **plus** both FLEET→C\* antidote-to |
| Seed vs **Muse** | **0.90** (9/10) | sym-diff 1 — Muse kills C3→FLEET dataset-for too |
| Hy3 vs Muse | 0.70 (7/10) | sym-diff 3 |

**The exact 2/8 split did NOT reproduce under the registered gate** (E1 PASS 0.80, E2 FAIL sym-diff 2; auditor KEEP counts ranged 1–4). What does reproduce: the digest-bound KILL regime — 6/10 edges unanimously KILLed, `C2→FLEET ancestor-of` unanimously KEEPed, and the 3-auditor majority table equals Seed's 2/8 exactly. Muse caught a payload misattribution Seed missed (13,062 merge-diffs belong to C3, not C2). Nemotron outlier classified **H2 — inverted edge-type semantics, self-defended** ("ancestor-of – a temporal or structural precedence"; "rediscovery-of – the source re-creates or replays the target's history"); H1 parse friction recovered both rounds, H3 not primary. Limitations: n=2 second auditors, digest-only evidence, single diagnostic session, LLM-table parsing. Seals: `w72-audit-r2`, `w72-nemotron-diag` (chain VERDICT PASS); artifacts `studies/data/w72-audit-r2.json`, `studies/data/w72-nemotron-diag.json`, `scripts/w72_audit_r2.mjs`.
