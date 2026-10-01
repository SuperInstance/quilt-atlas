# Repo Chores 74 — hex_distance fix-PR, DID-signed P8 events, native replay (wave-74d)

**Date:** 2026-10-01 · **Lane:** repo engineering only — **0 LLM API calls** · Repos: `SuperInstance/slackwater-lattice`, `SuperInstance/quilt-neighbourhood` · Commits: slackwater-lattice `94a7f2b`, quilt-neighbourhood `9381ba8` (both remote==local verified; key-scan of committed diffs against the five standing key-material patterns (GitHub/Groq/DeepInfra/TypeSafe/Moth token prefixes, as listed in the worklog): **0 hits** — this doc deliberately does not spell the patterns to keep future scans at 0).

## 1. slackwater-lattice `hex_distance` fix (v0.1.1)

**The bug, pinned to the published artifact.** The PyPI 0.1.0 wheel (repo commit `5bff9a3`, "📦 Published to PyPI + cleanup") shipped `hex_distance = max(|da|, |db|, |da+db|)` — the textbook axial formula, which is the true graph distance for the **other** axial neighbor set {(±1,0), (0,±1), ±(1,−1)}. This package's neighbor set is the six units of ℤ[ω]: {(±1,0), (0,±1), ±(1,1)} = {±1, ±ω, ±(1+ω)}. Misapplied, the published formula scores every true ±(1+ω) neighbor step as **2** and every (1,−1)/(−1,1) non-neighbor diagonal as **1**. Measured defect: **192 of the 3,721 ordered pairs of the radius-4 ball violate dist(a,b)==1 ⟺ b ∈ neighbors(a)** (88 neighbors scored ≠1, 104 non-neighbors scored 1). Symmetry *held even in the buggy formula* — the defect is an iff violation, not an asymmetry. Git forensics: a correct implementation already sat **unversioned** in the repo tree (commit `2946624`, inside a publish-cleanup commit, no changelog mention), which is why the wave-67a brute-force audit "did not reproduce" the claim against the repo — the claim was true of the published wheel, and the wave-74d lane pinned exactly that.

**Tests first, then fix.** `tests/test_hex_distance_properties.py` (13 tests) written before the fix: dist==1 ⟺ neighbor (both directions), symmetry over all radius-4 pairs, exact cube-form identity, BFS-graph-distance agreement, and the published 0.1.0 formula **vendored + pinned** (witnesses `E(0)→E(1+1ω)`: neighbor scored 2; `E(0)→E(1−1ω)`: non-neighbor scored 1; exact 192-violation count) so it cannot return unnoticed. Honest RED run receipted: against the published-0.1.0 worktree the new suite scores **11 failed / 2 passed** (`receipts/red-state-74d.txt`); green after the fix.

**The fix** (`slackwater_lattice/eisenstein.py`): `hex_distance` is now the self-evident canonical cube form

```
d = (|da| + |db − da| + |db|) // 2   ==   max(|da|, |db − da|, |db|)
```

with the convention trap documented in the docstring. Behavior on the repo tree is byte-identical to the pre-existing unversioned correction. **Suite: 178 passed** (127 baseline at v0.1.0 → 165 after 67-a's hex_line/conformance work → +13 property tests). Version **0.1.1** — folded into the same unreleased 0.1.1 already claimed by 67-a rather than burning 0.1.2 (changelog documents this); tag `v0.1.1` pushed.

## 2. DID-signed reconciliation events — quilt-neighbourhood v0.6.0 (P8 × P6, RFC P8 §6 Q2 resolved)

Wave-72's v0.5.0 implemented RFC P8 (event schema, id identity gate, deterministic rec-diffs, fail-closed `applyReconciliation`) and left two open items: DID-signed events (P8 × P6) and the ad-hoc replay merge path. v0.6.0 closes the first:

**Schema.** The P8 event gains an optional **`sig` OVERLAY**: base64 Ed25519 signature over the 32-byte event-id buffer. `sig` is excluded from identity — `verifyReconciliationEvent` strips it before canonical hashing — so (a) unsigned v0.5.0 events verify byte-for-byte unchanged, and (b) signed and unsigned views of one event **share the id**: stripping or re-signing never changes identity. Reused the repo's existing Ed25519 primitives (`src/signed.mjs`: `signId`/`verifySignatureOverId`; `did:key:z` embeds the raw 32-byte pubkey; node:crypto ed25519) — no new crypto code. Emitter-side, `createReconciliation({privateKey})` signs the event and (with `parentTrees`) the materialized marker + rec-diffs via `signDiff` — same ids, since `sig` is identity-invisible, so they survive the P6 receive gate of signed sheets in transport.

**Semantics — fail-closed, consistent with the existing signed-sheet refusal.** `Replica.applyReconciliation` gains `verifyEventAuthorship`: an event whose `author` is a `did:key:z` string *claims* proof-of-authorship, so it **MUST** carry a signature that verifies under the did's embedded public key — a did-authored unsigned event is refused (`reject-rec` receipt), not trusted. This closes v0.2.0's "author is a claim" gap for P8. Gate order: **id integrity → authorship → parents-known → sheet policy**. A *self-consistent* forgery (recomputed id + stale sig from a genuinely signed older payload) passes the id gate and is caught by the signature-over-id (R6b). Events with plain-string authors pass untouched ({signed:false}) — byte-for-byte v0.5.0 backward compatibility. Signed sheets (P6) now **accept** did-signed reconciliation events (that is Q2 resolved) while still refusing unsigned ones; allowlist sheets pin `event.author` after the crypto gate (mirroring `verifyDiffForSheet`).

**Tests (suite 42/42; the 38 pre-existing v0.5.0 tests pass unmodified).**

| id | claim |
|---|---|
| R6 | valid-signed event applies — on unsigned sheets and on signed sheets; receipt records `signed:true` |
| R6b | tampered refuses — naive payload tamper (id gate) AND stale-sig self-consistent forgery (signature gate) |
| R6c | signature by the WRONG key refuses |
| R6d | emitter-side `createReconciliation({privateKey})` signs event+marker+rec-diffs; allowlist pins the resolver; signed transport converges |

README §"DID-signed reconciliation events (v0.6.0) — P8 x P6, Q2 resolved" documents the schema and gates.

## 3. Native P8 replay — the wave-72 note "ad-hoc merge handling still in the script" resolved

`scripts/w71_dag_replay.mjs` v3: per merge commit the script builds the RFC P8 event (parents = both branch reps, asserted_tree = `diff-tree(parent, merge)` union with ABSENT deletions, author/ts from the commit), supplies `opts.parentTrees` from an incremental per-commit tree snapshot, and lets `Replica.applyReconciliation` derive + absorb the rec-diffs **natively, fail-closed**. The old ad-hoc emission survives only as a counted fallback for merges the native path refuses. Re-run this session:

| corpus | commits | merges | fold vs HEAD | merges reconciled |
|---|---|---|---|---|
| papermill | 101 | 0 | **248 == 248** CONVERGED | — |
| synesis-research | 1 | 0 | **506 == 506** CONVERGED | — |
| animal-ai | 766 | 45 | **1,017 == 1,017** CONVERGED | **native 43 / fallback 2** (honest: the 2 fallbacks assert `__pycache__/*.pyc` cells, which live in the reserved `"_"` bookkeeping namespace and are refused natively — counted, not hidden) |

45 merges → **15,312 derived rec-diffs over 13,062 diff-paths**; replay 37.7 s for animal-ai.

## Verification of record

- `slackwater-lattice`: `python3 -m pytest -q` → **178 passed** (this session); HEAD == origin/main == ls-remote = `94a7f2b`; tags v0.1.0 + v0.1.1 on remote.
- `quilt-neighbourhood`: `node --test test/*.test.mjs` → **42/42 pass** (this session); HEAD == origin/main == ls-remote = `9381ba8`; native replay numbers reproduced this session.
- Key-scan of both committed diffs: 0 hits. No token material written to any file (push via transient-token URL only).
