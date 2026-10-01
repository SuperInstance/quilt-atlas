# AMENDMENT 4 — round 3 adversarial spec (task 72-h), PRE-FIRE
Written: 2026-10-01T02:07Z. This amendment is registered BEFORE any round-3
GENERATION call. Two (2) pre-fire spec-AUTHORING calls to tencent/Hy3 were
spent before this document (receipted below, same accounting rule as
AMENDMENT 2's smoke calls); no generation/judging call has been made.

## (a) Round-3 question (frozen)
Does the M1-vs-M2 instrument DISCRIMINATE when spec difficulty is raised to
adversarial grade? Rounds 1-2 were instrument-ceilinged: all 42 primary
sessions (7 models x 3 specs x M1/M2) passed 100% of hidden property tests
first-shot, so M1 (monolithic) vs M2 (decomposed-with-mentor) was
indistinguishable on s1-s3. Round 3 replaces the spec axis with a single
adversarial spec s4 (8 hidden properties) and re-asks the round-1 verdict
rules on it.

## (b) Spec s4 provenance + validation (receipted)
- AUTHOR: tencent/Hy3 via the DeepInfra API (allowlisted), SAME conversation,
  max 3 revision rounds per AMENDMENT 4 protocol.
  - Call 1 (author-round-1): 1039+1467 tok, 45.07s, receipted in
    outputs/spec_s4_authoring.jsonl; draft pinned verbatim in
    outputs/spec_s4_draft_round1.json.
  - Draft VALIDATION FAILED (evidence, not opinion): a keeper reference
    implementation written from spec_text alone disagreed with Hy3's own
    worked examples in 3 places (simultaneous: spec gives [0.0,0.25,0.25] not
    [0.0,0.0,0.5]; refractory_decrement: spec gives [0.25,4.25] not [0.0,0.25];
    multi_step: spec gives [2.0,0.25,0.0] not [1.0,0.5,0.0]) plus 3
    under-pinned items (same-step decrement timing, k<N assumption,
    direction-sensitive wraparound example). Feedback:
    outputs/spec_s4_feedback_round2.md.
  - Call 2 (author-revision-2, SAME conversation): 3396+1456 tok, 28.28s;
    draft pinned verbatim in outputs/spec_s4_draft_round2.json and
    outputs/spec_s4_final.json (spec_text sha256 df1f59f8d20f8848…).
  - REVISION ROUNDS USED: 1 of 3.
- VALIDATION (offline gate, ALL must pass BEFORE the fire; receipt
  outputs/spec_s4_validation.json, GATE=PASS):
  1. refimpl_s4.py (written from spec_text ALONE, never sent to models)
     passes 8/8 hidden properties (tests/test_s4_properties.py,
     CANDIDATE_PATH-bound pytest, same runner as the harness).
  2. Hy3's 5 self_check_inputs match refimpl_s4 exactly.
  3. THREE NAMED MUTANTS each FAIL their named target property:
     - mutant_refractory_offbyone.py  (off-by-one: window 2 instead of 3)
         -> FAILS test_s4_multi_step
     - mutant_backward_ring.py        (swapped operand: (i-off)%N)
         -> FAILS test_s4_wraparound_dir (and 3 others)
     - mutant_no_refractory_guard.py  (missing edge case: no refractory guard)
         -> FAILS test_s4_replay_reject (and 3 others)
- What the models SEE at generation time is spec_text ONLY (the S4 text in
  specs_s4.py, verbatim from Hy3's final draft). Hy3's hidden_properties list,
  anticipated_failure_modes, and self_check_inputs are NEVER sent to any
  generator or judge.

## (c) Registered predictions (numbers, frozen)
- P1 (headroom): mean FINAL pass-rate on s4 across the 6 primary sessions will
  land in [0.3, 0.7] — i.e. the spec has headroom: not saturated (round-2 mean
  was 1.0), not impossible (0.0).
- P2 (discrimination): p(instrument discriminates) = 0.79 — CARRIED from the
  wave-70 queue note. Provenance: the question "p_discriminate = probability
  that an adversarial-spec round 3 produces at least one session with
  pass_rate < 1.0 on first shot" was posed to typesafe jev-latest in
  scripts/discuss_69.mjs (line 25) and the answer p=0.79 is receipted in
  worklog.md task 69-d ("p(adversarial round-3 discriminates) = 0.79",
  759+83 tok). Honest caveat: the raw jev answer JSON was printed to console
  at the time and was not archived as a file; the citation is the script
  (question) + the worklog receipt (answer). We adopt 0.79 unchanged.
- P3 (hardest property): test_s4_snapshot (Hy3's declared hardest_property)
  will be the single most-failed property across sessions, with
  test_s4_multi_step second.
- P4 (repair economics): mean repair rounds per session on s4 >= 0.5
  (round-2 mean was 0.06 on s1-s3).
- NO directional M1-vs-M2 prediction is registered: with n=6 sessions the
  directional test is exploratory this round; the registered question is
  whether the instrument gains headroom AT ALL (P1/P2).

### Verdict rules (frozen)
- Primary metric: hidden pass-rate on the 8 s4 properties (final code after
  <= 3 same-session repair rounds, REPAIR_CAP_PER_SESSION=3).
- Secondary: judge medians (book ONLY if the round-3 judge-instrument gate
  passes; same rules as AMENDMENT 3: stability max|delta| <= 1; label-shuffle
  mean|d| <= 1.0 AND |signed| <= 0.5).
- DISCRIMINATES: >= 1 of the 6 sessions has first-shot pass-rate < 1.0 AND the
  6 final pass-rates are not all identical (variance > 0 or a non-zero paired
  M1-vs-M2 delta exists).
- STILL-CEILINGED: all 6 sessions reach pass-rate 1.0 on the FIRST shot.
- INCONCLUSIVE: anything else (partial matrix, uniform failure under K1, or
  gate-fail with degenerate pass-rates).
- DEGENERATE-MEASUREMENT rule (wave-67) remains in force: identical outcomes
  across all cells forbid a PASSED verdict.

### KILL conditions (frozen)
- K1 SPEC-IMPOSSIBLE: if >= 4 of 6 sessions end at final pass-rate 0.0 after
  the full repair cap, s4 is judged unfair/over-tensioned (it was built to
  break ceiling, not to be un-passable); verdict INCONCLUSIVE + s4 rejected;
  M1-vs-M2 does NOT book.
- K2 STILL-CEILING: all 6 sessions first-shot 1.0 -> the adversarial axis
  failed to break saturation at this difficulty; verdict STILL-CEILINGED.
- K3 BUDGET: if the budget exhausts before 6 sessions complete, report partial
  rows honestly; NO verdict is bookable from < 6 sessions.
- K4 GATE-FAIL: if the round-3 judge-instrument gate fails, judge medians do
  NOT book as evidence; the verdict rests on pass-rate + repair economics.

## (d) Run configuration (frozen)
- Env: CELL_LAB_TASK_ID=72-h | CELL_LAB_RUN_TAG=round3 |
  CELL_LAB_SPECS_EXT=s4 | CELL_LAB_MATRIX="meta-models/Muse-Glimmer-30B,
  nvidia/Nemotron-3-Nano-30B-A3B, tencent/Hy3" | CELL_LAB_CONDS="M1,M2" |
  CELL_LAB_BUDGET=78. CELL_LAB_MENTOR unset (same-model M2). max_tokens 4096,
  temperature 0.4 (round-2 settings). Harness code path unchanged otherwise;
  SPEC_ORDER becomes ["s4"] via specs_s4.extend (guarded; s1-s3 pins in
  specs.py untouched, sha c89183ff0210cb38 unchanged).
- Matrix: 3 models x 1 spec (s4) x 2 conditions = 6 primary sessions; repair
  cap 3 per session, same growing session (cache-friendly).
- BUDGET: hard round-3 total <= 90 chat calls across ALL phases =
  2 spec-authoring (spent) + harness cap 78 (enforced fail-closed by
  CELL_LAB_BUDGET=78) + 10 judge-gate calls. Expected spend ~ 2 + (1 smoke +
  9 generation + repairs + 9 judging) + 10 ≈ 31-45.
- Judges: per AMENDMENT 1 rules and the existing judge_author() code path —
  authors are NOT in the round-1 MATRIX, so every author is judged by
  MiMo-V2.6-Flash, Seed-2.0-mini, Ling-3.0-flash (3 allowlisted judges, never
  the author; Groq remains perimeter-blocked/403, receipted in rounds 1-2).
  Hy3 is NEVER a judge this round (it authored the spec — conflict of
  interest); Muse-Glimmer-30B IS judged on the spec its authorship circle
  produced — noted as an unavoidable authoring-author adjacency, mitigated by
  the fact that all generators see identical spec text.
- Judge-instrument gate (round-3 mode of judge_instrument_check.py, added by
  this amendment): stability pair + label-shuffle on s4 blocks, authors
  Muse-Glimmer-30B + Nemotron-3-Nano-30B-A3B, judges Ling-3.0-flash +
  Seed-2.0-mini (both non-authors); 10 calls; receipt
  outputs/judge_instrument_check-round3.json. Runs BEFORE medians book.

## File pins (sha256 at freeze, pre-fire)
{
 "run_harness.py": "662955d3ac729905f63b60d5be36f7b222fd74b367ee893be5ae274a4e2dfcd8",
 "judge_instrument_check.py": "bd73cb3bb817bddb4c809566a761deaf19c0784a8ad0dbd0332be90aff532cee",
 "specs.py": "c89183ff0210cb38ed0b2726d5780bc7c74b1dfd3dfe43e383a910e23caae18b (UNCHANGED)",
 "client.py": "d6da00a8143c34d3e6c4253836b5725670a94773aea40b2dff6786fb92b13f03",
 "sandbox.py": "944834589c5920b68f94634beea7420f8c469fc6b6ff9b5e8bcb7eda1b6de631 (UNCHANGED)",
 "specs_s4.py": "c2f014ee6461c116d5cfdfb68a49a132e43a58ad27dea777dece856806709251",
 "spec_author_s4.py": "362fc9d72d3f2b2ec161adce6490c511505a061a1e8bdebb79e96069d6da0df6",
 "validate_s4_offline.py": "2dca8400ae911ab7ce48797c46df6eb4489727c8f114292cc6e932729ffb64bb",
 "refimpl_s4.py": "fd1919075f4016f4e152237044c874c2fc168ab50b16c5fe87829ce68d71b5aa",
 "tests/test_s4_properties.py": "0c9cd3e3ee6be37487cf26d5f0ca5b466af0b3ab53d75f6ad9a607f4a9486f04",
 "tests/mutants_s4/mutant_refractory_offbyone.py": "9b37dc72d8e3a2d533097a420513dc50fc74575041e145b8c29634349fae01d5",
 "tests/mutants_s4/mutant_backward_ring.py": "d2effd0e18e0963a0c83d4e283277ef1a28d018bb977f562b1f6e98cd6acaead",
 "tests/mutants_s4/mutant_no_refractory_guard.py": "ef7e04bc60f930dd116ac14afa766dfb2aa95dbe53f9b188d66997618eca1050",
 "outputs/spec_s4_final.json": "67d7f286ef054bb53a4ebd2afc75c856f2109dbebfb8ed665aa639aa366ffb4e",
 "outputs/spec_s4_authoring.jsonl": "b737ea7ad91031c358a274e3a375287667e7d2b83288b953e26af535f78db1cb",
 "outputs/spec_s4_validation.json": "779c3a7a8eeff71890318b4890cff5b8e3b11b680fc947101e15dfa84027a613"
}
Note: judge_instrument_check.py was edited after the initial freeze list to add
the --round3 mode; the pin above is the POST-edit fingerprint (bd73cb3b…),
re-verified before any round-3 call. Full 64-hex pins also stored in
outputs/prereg_round3_pins.json.
