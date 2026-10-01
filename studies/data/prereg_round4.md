# AMENDMENT 5 — round 4 degraded conditions (task 72-k), PRE-FIRE
Written: before any round-4 GENERATION call. Zero round-4 chat calls have been
spent at registration time (no smoke, no generation, no judging, no gate).
Offline pins for this registration were computed and stored in
outputs/prereg_round4_pins.json; the round-3 file pins are verified UNCHANGED
(see §(e)).

## (a) Round-4 question (frozen)
Does the M1-vs-M2 instrument DISCRIMINATE when the CONDITIONS are degraded?
Three rounds (7 models x 4 specs s1-s3-standard + s4-adversarial, 48 primary
sessions) produced 100% first-shot hidden-property pass rates everywhere, so
the spec axis is exhausted (round-3 verdict: "change the condition axis, not
the spec axis"). Round 4 freezes the spec (s4, validated adversarial, reused
verbatim) and degrades the CONDITIONS around it:
- D1 context-starved M2 — tests whether the mentor channel itself carries
  measurable value;
- D2 repair-starved — tests whether the repair slack (never yet used to
  first-shot failure) is load-bearing;
- D3 budget-capped generation — tests whether output constraints create
  headroom, and (via D3M2) whether M2's decomposition helps under them.
M1 (undegraded, round-3 config) is the control condition.

## (b) Conditions, models, provenance (frozen)
- SPEC: s4 only (specs_s4.py, spec_text sha256 df1f59f8…, Hy3-authored,
  mutation-validated in AMENDMENT 4; outputs/spec_s4_final.json sha
  67d7f286… re-verified unchanged). NO new spec is authored this round.
- MODELS (2): meta-models/Muse-Glimmer-30B, nvidia/Nemotron-3-Nano-30B-A3B.
  Justification: (i) task recommendation — the two largest round-3 judge
  textures (Muse M1 10 vs M2 9; Nemotron 9 vs 8; both also showed the only
  repair/truncation texture of round 3: Muse's s4/M2 mentor call hit
  finish_reason=length and needed 1 repair); (ii) round-3 comparability —
  both have round-3 s4/M1 rows at the identical control config, so round-4
  M1 replicates double as a cross-round stability check (P8); (iii) Hy3 is
  excluded as the s4 author (authoring adjacency, AMENDMENT-4 mitigation
  continued). All models allowlisted; client.py enforceement untouched.
- CONDITIONS (5) x n=3 REPLICATES each (temperature 0.4, temp replicates are
  the round-3 prescription "price per-cell luck, n>1"):
  - M1 (control): monolithic, byte-identical prompt path to round-3 M1
    (SYS_PROMPT + spec text), max_tokens 4096, repair cap 3.
  - D1 (context-starved M2): the mentor call IS made (same model, same
    MENTOR_PROMPT, max_tokens 4096 — the mentor runs exactly as in M2) but
    its output is WITHHELD. The worker conversation is
    [sys, user: MENTOR_PROMPT(spec), assistant: PLACEHOLDER, user:
    WORKER_PROMPT] with PLACEHOLDER frozen verbatim:
    "[mentor output withheld under degraded condition D1: the mentor turn was executed but its text is not available to you. Implement from the spec above directly.]"
    Structural shape is identical to M2 (4 messages); the mentor channel's
    INFORMATION is stripped while the spec remains in-context via the mentor
    question. Repairs (cap 3) continue in the same worker conversation.
  - D2 (repair-starved M1): identical to M1 but repair_cap=0 (first-shot
    only). n=3 replicates stand in for the "more sessions instead" clause.
  - D3 (budget-capped M1): every call (gen + repairs) max_tokens=1600
    (= 39% of the round-3 4096; registered as the ~40% fraction). Repair cap 3.
  - D3M2 (budget-capped M2): mentor + worker + repairs all capped at 1600;
    mentor output IS replayed (exact M2 semantics; only the budget degrades).
    This arm answers the D3 sub-question "does decomposition help under
    output constraints" as a direct D3M2-vs-D3 contrast.
- D3 cap calibration (from EXISTING round-3 data, pre-registered): round-3 s4
  completion tokens — Muse M1 3873, Nemotron M1 1575, Muse M2 worker 4096
  (hit cap, repaired), Nemotron M2 worker 1698, Hy3 M1 254. So 1600 binds
  hard for Muse M1, borderline for Nemotron M1, and binds for both M2
  workers — a real constraint, not a token.
- D2 inclusion justification: a priori D2 is predicted identical to M1
  (repairs were used in exactly 1 of 48 primary sessions across 3 rounds);
  it costs only 6 first-shot calls and converts that a priori claim into a
  measured one (P4).
- Judges (3, per batch, never the author): XiaomiMiMo/MiMo-V2.6-Flash,
  ByteDance/Seed-2.0-mini, inclusionAI/Ling-3.0-flash — the identical judge
  trio to round 3's medians; none is a round-4 author; Hy3 stays excluded
  (spec author). Groq remains perimeter-blocked (403, receipted rounds 1-3);
  AMENDMENT-1 fallback (3rd DeepInfra judge) is the standing configuration.

## (c) Registered predictions (numbers, frozen)
- P1 (D1 null): D1 mean final pass-rate = 1.0 on BOTH models — the mentor
  channel carries no measurable value for this task class when the spec is
  already in-context. p = 0.70. The alternative arm (D1 < M1 on any model)
  would be a positive discrimination result (mentor-channel value detected).
- P2 (D3 binds for Muse): Muse D3 mean final pass-rate <= 0.75 (at least 1
  of 3 reps ends final < 1.0). p = 0.65. Calibration: 3873-token round-3
  completions vs 1600 cap.
- P3 (D3 borderline for Nemotron): Nemotron D3 mean final in [0.5, 1.0].
  p = 0.60. Calibration: 1575-token round-3 completion vs 1600 cap.
- P4 (D2 == M1): every D2 rep final pass = 1.0 = M1 for both models;
  repairs = 0 in all M1 and D2 sessions. p = 0.75.
- P5 (variance pricing): zero within-(model, cond) replicate variance for
  M1, D1, D2 (all reps identical outcomes). p = 0.60.
- P6 (decomposition under caps): D3M2 mean final >= D3 mean final, per
  model (decomposition does not hurt under output constraints). p = 0.50
  (directional, weak prior — this is the measured question, not a belief).
- P7 (truncation texture): >= 1 finish_reason=length event occurs inside
  D3 ∪ D3M2 sessions. p = 0.80.
- P8 (cross-round stability): round-4 M1 rep-1 final pass-rate == round-3
  M1 final pass-rate (1.0) for both models at identical config. p = 0.80.
- Headroom summary: p(round 4 produces at least one headroom event on the
  primary metric) = 0.60, i.e. p(NOT-DISCRIMINATES) = 0.40.

### Verdict rules (frozen)
- Primary metric: hidden-property pass rate on the 8 s4 properties per
  session, BOTH first-shot and final (after <= 3 repair rounds; D2 has 0).
  Fail-closed evaluation identical to rounds 1-3 (sandbox scan, 20s pytest
  timeout, parse failures = 0-pass).
- Secondary: judge medians (book ONLY if the round-4 judge-instrument gate
  passes — K4), repair counts, truncation events (finish_reason=length),
  latency.
- DISCRIMINATES: the 30-cell matrix is complete AND (>= 1 valid session with
  first-shot pass < 1.0 OR >= 1 valid session with final pass < 1.0) within
  booked conditions (booked = not K2-killed, D1 clean per K3). Headroom
  events are reported per condition so the verdict names WHICH degradation
  created them.
- NOT-DISCRIMINATES: matrix complete AND all 30 valid sessions have
  first-shot 1.0 AND final 1.0 — the ceiling is robust to D1+D2+D3+D3M2 at
  these degradation levels.
- INCONCLUSIVE: anything else (incomplete matrix per K1, >= 2 conditions
  K2-killed, or both).
- DEGENERATE-MEASUREMENT rule (wave-67) remains in force: identical outcomes
  across all cells forbid any "instrument works" claim; it is encoded
  directly in the DISCRIMINATES definition.

### KILL conditions (frozen)
- K1 BUDGET/COMPLETENESS: any of the 30 cells missing at finalize (budget
  exhaustion, persistent call failure, harness exception) → verdict
  INCONCLUSIVE; partial rows reported honestly; NO verdict books from an
  incomplete matrix. Round-level call accounting is fail-closed: generation
  invocations cap at 68 (Ledger), repairs are additionally gated by a
  first-shot reserve (a pending session's FIRST shot is never starved by
  earlier repairs), gate = 10, judging <= 12; hard round total <= 90.
- K2 OVER-TENSION: >= 4 of 6 sessions of any single condition end at final
  pass-rate 0.0 after the full repair cap → that condition is judged
  over-tensioned (it destroyed the task rather than creating headroom); its
  contrast does NOT book. If >= 2 conditions are so killed → INCONCLUSIVE.
- K3 D1-LEAK: if any mentor-derived substring (line >= 12 chars not already
  in the legitimate context) appears in a D1 worker prompt, that session
  fails closed (booked as MISSING, never as an outcome), the incident is
  reported (count only, never the text), and D1 books only from clean
  sessions. The pre-fire offline unit test (with M2-style negative control)
  must pass before the fire.
- K4 GATE-FAIL: if the round-4 judge-instrument gate fails, judge medians do
  NOT book as evidence; the verdict rests on pass-rate + repair economics +
  truncation texture.
- K5 MODEL-404: a model 404ing persistently (2 consecutive hard failures)
  gets NO substitution (the 2-model matrix is frozen; substituting would
  break the registered texture rationale) → affected cells MISSING → K1.

## (d) Run configuration (frozen)
- Env: CELL_LAB_TASK_ID=72-k | CELL_LAB_RUN_TAG=round4 |
  CELL_LAB_SPECS_EXT=s4 | CELL_LAB_MATRIX="meta-models/Muse-Glimmer-30B,
  nvidia/Nemotron-3-Nano-30B-A3B". CELL_LAB_BUDGET unset (round4 driver
  constructs its own fail-closed Ledger caps; see K1).
- Driver: run_round4.py (NEW; the ONLY new file) imports the round-1/2/3
  harness UNMODIFIED — run_harness.py, client.py, specs.py, specs_s4.py,
  sandbox.py, judge_instrument_check.py are byte-identical to the
  AMENDMENT-4 pins (verified, §(e)). s1-s4 spec pins untouched.
- Matrix: 2 models x 5 conditions x 3 replicates = 30 sessions on s4.
  First-shot calls: M1/D2/D3 = 1, D1/D3M2 = 2 → 42 first-shot calls + 1
  smoke = 43 planned no-repair generation calls; <= 25 repair-call headroom
  inside GEN_CAP=68 with first-shot-reserve gating; worst-case round total
  68 + 10 + 12 = 90.
- Chunked resume: every finished session appends to outputs/round4.jsonl
  immediately; re-invocations skip done (model, cond, rep) cells — same
  chunk discipline as rounds 1-3 (tool-call sandbox kills are expected and
  survivable).
- Judge-instrument gate (runs AFTER generation, BEFORE any median books):
  judge_instrument_check.py --round3-mode overrides --rows
  outputs/round4_rep1.jsonl (derived view: rep-1 rows only, both authors in
  identical M1,D1,D2,D3,D3M2 order), authors Muse-Glimmer-30B +
  Nemotron-3-Nano-30B-A3B, judges Ling-3.0-flash + Seed-2.0-mini (neither is
  an author), tag -round4; AMENDMENT-3 rules: stability pair max|delta| <= 1;
  label-shuffle mean|d| <= 1.0 AND |signed mean| <= 0.5; 10 calls; receipt
  outputs/judge_instrument_check-round4.json.
- Judging: per author, 1 batched call per judge (15 candidates = 5 conds x 3
  reps, ids carry __r<rep>), 3 judges x 2 authors = 6 calls (+1 strict-JSON
  retry each max). Same rubric wording and parser as rounds 1-3.
- Judged output: per-row median of the 3 judge scores; per-(model,cond)
  mean-of-medians in the summary.
- Budget: hard round-4 total <= 90 chat calls across ALL phases (round-level
  accounting across chunked invocations, traced in
  outputs/round4_ledger_trace.jsonl + gate state; receipt asserts <= 90).
  Expected spend ~ 55-70.

## (e) Provenance, deviations, honesty (frozen into the record)
- The worklog has NO "Task ID: 72-h" entry (the round-3 agent's worklog
  append is absent). Round-3 provenance is taken from outputs/prereg_round3.md
  (AMENDMENT 4), quilt-atlas/studies/CELL-LAB-ROUND3-72.md, and the round-3
  artifacts (round3.jsonl / round3b.jsonl / receipts), which are internally
  consistent. This gap is recorded here and in the 72-k worklog entry.
- AMENDMENT 4 §(d) planned a round-3 judge-instrument gate receipt
  (outputs/judge_instrument_check-round3.json, 10 calls). That file DOES NOT
  exist — the round-3 gate never ran; the only gate receipt on disk is the
  round-2 one (GATE=PASS, s1-s3 rows, Seed+Inkling authors, Ling+Muse
  judges). Consequence registered here: round-3 judge medians remain
  TEXTURE-ONLY (as the round-3 study already booked them), and AMENDMENT 5
  runs its own round-4 gate before any median books (K4).
- Pin verification at registration: specs.py c89183ff…, specs_s4.py
  c2f014ee…, sandbox.py 94483458…, client.py d6da00a8…, run_harness.py
  662955d3…, judge_instrument_check.py bd73cb3b…, refimpl_s4.py fd191907…,
  tests/test_s4_properties.py 0c9cd3e3… — ALL EQUAL to the AMENDMENT-4
  pre-fire pins. New-file pins and full 64-hex values:
  outputs/prereg_round4_pins.json.
- Pre-fire offline gate (ZERO chat calls; runs after this registration;
  receipt outputs/round4_preflight.json; a FAIL blocks the fire):
  1. s4 refimpl 8/8 properties (same CANDIDATE_PATH pytest runner);
  2. the 3 named s4 mutants each fail their named target property;
  3. D1 withhold unit test PASSES (no mentor-derived substring in the D1
     worker conversation from a canned mentor output; placeholder present;
     M2-style negative control trips the checker);
  4. budget arithmetic (planned no-repair 65 <= 90; hard worst 90 <= 90);
  5. all round-4 models and judges allowlisted; judges ∩ authors = ∅;
  6. pins re-verified against outputs/prereg_round4_pins.json (fail-closed).

## File pins (sha256 at freeze, pre-fire) — see outputs/prereg_round4_pins.json
{
 "run_harness.py": "662955d3… (UNCHANGED from AMENDMENT 4)",
 "client.py": "d6da00a8… (UNCHANGED)",
 "specs.py": "c89183ff… (UNCHANGED)",
 "specs_s4.py": "c2f014ee… (UNCHANGED)",
 "sandbox.py": "94483458… (UNCHANGED)",
 "judge_instrument_check.py": "bd73cb3b… (UNCHANGED)",
 "run_round4.py": "4466fd5d… (NEW)",
 "refimpl_s4.py": "fd191907… (UNCHANGED)",
 "tests/test_s4_properties.py": "0c9cd3e3… (UNCHANGED)",
 "tests/mutants_s4/mutant_refractory_offbyone.py": "9b37dc72… (UNCHANGED)",
 "tests/mutants_s4/mutant_backward_ring.py": "d2effd0e… (UNCHANGED)",
 "tests/mutants_s4/mutant_no_refractory_guard.py": "ef7e04bc… (UNCHANGED)",
 "outputs/spec_s4_final.json": "67d7f286… (UNCHANGED)",
 "outputs/spec_s4_authoring.jsonl": "b737ea7a… (UNCHANGED)",
 "outputs/spec_s4_validation.json": "779c3a7a… (UNCHANGED)"
}

## AMENDMENT 5 addendum (pre-fire, post-fix fingerprint — registered BEFORE any
generation call; per AMENDMENT-2 precedent)
Chunk-1 invocation (02:53:55Z) crashed with a NameError in run_round4.py's
repair-reserve generator (FIRST_SHOT_CALLS[c] -> c2) AFTER the smoke call
(1 chat call spent, receipted in outputs/run4.log and reconstructed in
outputs/round4_ledger_trace.jsonl) and BEFORE any generation call. The fix is
registered here pre-fire; re-pinned fingerprints (full 64-hex in
outputs/prereg_round4_pins.json): run_round4.py 4466fd5d… -> 368f05e0….
All other pins unchanged. The fire starts only after preflight re-PASSES.
