# quilt-atlas — CTO Brief

## One-paragraph value statement

quilt-atlas is the self-updating ground-truth map of the SuperInstance GitHub account
(5,168 repos at the 2026-10-04 run): a scheduled 6-hour workflow re-inventories every
repo, classifies it into families with a per-repo evidence trail, measures CI coverage on
the moving frontier, and commits the diff. It is the account's cheapest instrument with
the highest trust yield — any stranger, investor, or agent can verify the fleet's scale,
structure, and liveness from artifacts alone, which is the account's stated stone
standard. Operating cost is effectively zero (free-tier Actions + ~76 API calls per run).

## What it does & for whom

For the fleet's principals and for zero-shot agents: a machine-readable map (`atlas.json`)
plus a human block in the README — family counts (fleet 1,591, qthe 464, quilt 299, jev
54, moth 25, latent 18, other 2,717), the 24 most-recently-pushed repos with their CI
workflows, and receipts for every limitation (pagination caps, unmeasured slices). For
researchers: the repo doubles as the studies library (waves 71–78: the MECHANICAL
M1–M5 learning program, the rehydration scheduler, the JEV reflex-router calibration and
its out-of-sample replication, cell-lab condition studies) and the SEED DNA catalog that
distills 47 repos into an 8-primitive genetic code. Consumers are internal lanes making
triage decisions and external strangers verifying claims.

## Maturity assessment

**Working, and hardened where it matters.** Evidence: the pipeline has run unattended on
a 6-hour cron since wave 52–55 (commits `atlas: scheduled regen <ts>` are the standing
receipt); it survived three documented upgrades (v2 description classifier 53-e, v3
Link-pagination 54-c, qthe audit 55-c) without changing v1 family assignments; its two
keyword-precision audits measured 83% (fleet) and 87% (qthe) strict precision against a
70% bar; the newest study layer (M1–M5, waves 74–78) shows a repeatable
preregister-and-judge discipline with honest booked failures. Not hardened: no test suite
(verification is execution + receipts), and the CI-probe catch swallows rate-limit errors
on the 24-repo slice (documented in ENGINEERING-NOTES).

## Risks

| Risk | Severity | Mitigation status |
|---|---|---|
| GitHub API drift (pagination/contents endpoints) | Medium — map silently understates | Mitigated: `pages_fetched` receipt makes any shortfall visible; fail-closed on non-OK pagination responses |
| Rate limiting (token expiry, throttling) | Low — run fails or (probe-stage) renders honest-looking gaps | Partially mitigated: ~76 calls/run vs 5,000/h budget; the probe-stage catch issue is documented, fix is a one-line narrowing |
| Classifier false positives eroding trust | Medium — mislabeled families | Mitigated: per-repo evidence tuples + sampled audits (83%/87% measured); stability rule prevents churn |
| Repo growth past the 120-page cap (12,000) | Low — years away at current growth | Instrumented: `pagination_cap_hit` flips visibly when it happens |
| Secrets leakage | Low | One workflow-scoped token, env-injected, never committed; no keys anywhere in the repo |
| Clone growth from full JSON rewrites (~1-2 MB/run) | Low | Accepted at 4 commits/day; revisit if clone size bites (estimate, not receipted) |

## Cost profile

Effectively free-tier across the board: GitHub Actions on a public repo (4 scheduled runs
/day, each ~1–2 min, well inside the free allowance — estimate, not metered); GitHub REST
API (~76 authenticated calls per run against a 5,000/h limit); no external services, no
model calls, no storage spend. The studies layer's LLM spend is receipted per study and
lives in the wave ledger, not in the atlas run (e.g. M1's judge round: deepinfra $0.0012;
REPO-CHORES-74: zero LLM calls).

## Strategic options

- **Invest (recommended if the fleet keeps growing):** the map is the trust layer for a
  5,000+-repo account; extend it with a second receipted CI slice and per-family synonym
  audits as description-stage populations grow (quilt=47, jev=28 are next candidates).
- **Maintain (minimum viable posture):** the 6-hour cron needs nothing; the map stays true
  on its own. This is the floor.
- **Harvest-learnings:** the audit method (deterministic sample → hand-read → price
  residual → record in `notes`) and the evidence-tuple pattern are reusable for any large
  corpus classification problem the fleet meets.
- **Retire:** not indicated — it is the account's only whole-fleet artifact, and its
  removal would regress the stone standard to "trust the lane that tells you".

## Integration surface

Reads: GitHub REST (users/<owner>/repos, contents/.github/workflows). Writes: only its own
`atlas.json` + `README.md`. Consumed by: any agent or human needing account ground truth;
the wave journal cites it during censuses (wave-49/50 remote-census entries); the studies
layer references atlas context; SEED DNA explicitly positions its functional families
orthogonal to the atlas's name families. No runtime dependency in either direction —
nothing in the fleet breaks if the atlas pauses; everything loses its shared picture if
it dies permanently.
