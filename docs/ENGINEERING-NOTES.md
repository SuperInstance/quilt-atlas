# quilt-atlas — Engineering Notes

For engineers operating, reviewing, or trusting the map. Every claim below is traceable to
`scripts/build_atlas.mjs`, `.github/workflows/atlas.yml`, or `atlas.json` at HEAD.

## Architecture

```
   GitHub Actions (atlas.yml)                      cron '17 */6 * * *' + manual dispatch
   ┌──────────────────────────────────────────┐
   │ checkout → setup-node 20                 │
   │ env: GITHUB_TOKEN = secrets.GITHUB_TOKEN │  (workflow-scoped token; never committed)
   ▼                                          │
   scripts/build_atlas.mjs  (zero-dep Node)   │
   ┌──────────────────────────────────────────┐
   │ 1. PAGINATE   GET /users/SuperInstance/repos?per_page=100
   │               follow Link rel="next" until exhausted; hard cap 120 pages
   │ 2. CLASSIFY   FAMILIES table: stage-1 name regex → stage-2 description
   │               synonym scoring → stage-3 "other"        (evidence tuple per repo)
   │ 3. SORT       by pushed_at desc; take TOPN = 24
   │ 4. CI PROBE   GET /repos/<o>/<r>/contents/.github/workflows  (top slice only;
   │               404 → empty list = honest gap)
   │ 5. EMIT       atlas.json (full map + receipts + notes)
   │               README block between ATLAS:BEGIN/ATLAS:END markers
   │               [ATLAS_DUMP=<path>] per-repo audit rows (opt-in)
   └───────────────┬──────────────────────────┘
                   ▼
   git add atlas.json README.md → commit if diff → push   (bot identity, concurrency-gated)
                   │
                   ▼
   Consumers: strangers/agents reading atlas.json or the README block;
              keyword audits (ATLAS_DUMP); studies/ cite the map as the account context.
```

Data flow is strictly one-pass and read-only against GitHub: no writes anywhere except the
repo's own two files, committed only when the diff is non-empty (`git diff --cached
--quiet` guard in the workflow).

## Invariants

1. **The map only grows truer; nothing is deleted.** Studies and seed-dna are append-only;
   the map is regenerated wholesale but its history is the git commit chain of scheduled
   regens. Enforced by convention + the workflow's commit step; violated only by a
   deliberate force-push, which would itself be visible.
2. **Every classification carries evidence.** `classification[repo] = [family, stage,
   matched keywords, language]` is written for every repo, every run
   (build_atlas.mjs classification loop). A family assignment without a tuple is a bug.
3. **Absence of CI data is UNMEASURED, never zero.** CI probing is bounded to the top-24
   slice; the README block states this below the table. Enforced by where the probe loop
   runs (top slice only) and by the generated disclaimer line.
4. **A bounded run can never pose as a full inventory.** `pages_fetched`,
   `pagination_cap`, `pagination_cap_hit` are receipted in atlas.json and the README line
   prints "CAP HIT, count bounded not total" when the cap binds.
5. **No fabricated numbers.** Empty workflow lists render as `— none —`; audit residuals
   are priced and stated in `notes` rather than silently reclassified (the stability rule).
6. **Fail closed on API errors.** `api()` throws on any non-OK response; the run dies
   before `writeFileSync('atlas.json')`, so a partial map is never committed.

## Failure modes & blast radius

| Failure | Behavior | Blast radius |
|---|---|---|
| Invalid/expired GITHUB_TOKEN (401) | First page fetch throws; run exits non-zero | None — no files written (write happens last) |
| Rate limit (403) during pagination | `api()` throws → run dies | None committed; next 6-hour cycle retries |
| Rate limit (403) during the CI probe | Caught by the probe loop's empty `catch` (the comment says "404" but the catch is total) → remaining repos render `— none —` | Subtle honesty hazard: a rate-limited slice looks like a no-workflows slice. Mitigation: 24 probes after 52 page fetches is far inside any authenticated limit; keep it that way |
| GitHub Link-header format drift | Pagination stops early (no rel=next match) → short map, but `pages_fetched` receipts it | Map understates; receipt shows the page count, so the gap is visible |
| Account > 12,000 repos | `pagination_cap_hit=true`, map bounded at 120 pages | Stated in README + atlas.json; count labeled bounded |
| README markers missing (hand-mangled) | Block appended at the end instead of replaced | Duplicate block possible; delete the stale block manually |
| Concurrent runs | Prevented by `concurrency: atlas-regen` (`cancel-in-progress: false`) | A manual dispatch queues behind the schedule instead of racing |
| Push rejected (e.g. force-push landed mid-run) | Workflow's `git push` fails; commit stays local to the runner | Next scheduled run regenerates from the newer base |

Worst case overall: the map goes stale until the next successful run. The map has no
write path into any other repo — it is a pure observer, so its blast radius on the fleet
is zero by construction.

## Performance & cost envelope

- **API calls per run (measured from the code's structure + the 2026-10-04 receipt):**
  52 page fetches + 24 CI probes = ~76 requests. A run is well inside GitHub's 5,000 req/h
  authenticated limit; unauthenticated (60/h) would fail — the token is load-bearing.
- **Runtime:** seconds-to-low-minutes; the CI run at 2026-10-04 12:20 UTC produced a full
  5,168-repo map (the receipt in atlas.json is the timing evidence; no dedicated timing
  receipt exists beyond that — labeled honestly).
- **CI cost:** free-tier GitHub Actions (public repo, ~1 job per 6h = 4 jobs/day, each
  ~1-2 min). Estimated, not metered: well under GitHub Actions' free monthly allowance.
- **Storage:** atlas.json ≈ 1-2 MB of JSON per commit, fully rewritten each run — the git
  history grows ~1 compressed snapshot per 6 hours. Acceptable at this cadence; a
  packfile-minded engineer might switch to monthly full snapshots + daily diffs if the
  clone size ever bites (estimate, not a receipted problem).

## Operations

- **Local:** `GITHUB_TOKEN="$(gh auth token)" node scripts/build_atlas.mjs` from the repo
  root. Optional `ATLAS_DUMP=<path>` for audit rows. No install step (zero deps).
- **CI:** `.github/workflows/atlas.yml` — checkout, Node 20, build, conditional commit as
  `quilt-atlas bot <agents@superinstance.local>`, push to the default branch. Manual runs
  via `workflow_dispatch` (Actions tab → atlas → Run workflow).
- **Credentials model:** exactly one secret, the workflow-scoped `secrets.GITHUB_TOKEN`,
  injected as an env var, never echoed, never committed. Local runs use whatever token the
  operator supplies; no token material exists anywhere in the repo (the README's
  `GITHUB_TOKEN=...` line is a placeholder, not a value).
- **Observability:** the run's own commit history is the log. A missing
  `atlas: scheduled regen` commit on a cron boundary means the run failed — check the
  Actions tab. atlas.json's `generated_at_utc` is the freshness probe.

## Design decisions & why

1. **Name-first, then description classification (v2, task 53-e)** — pure name matching
   left too much unclassified as the account grew; pure description matching would hoover
   generic words. The two-stage design keeps v1 families byte-stable (nothing that was
   classified became unclassified) while letting descriptions join. Tradeoff: synonym
   false positives, which the audit program (54-c, 55-c) measures instead of guessing.
2. **Keyword audits priced, not fixed (55-c)** — the qthe audit found ~2% adjective
   collisions ("canonical"); reclassifying would churn the map for a sub-bar gain
   (precision 87% ≥ the 70% bar). The stability rule (no unforced reclassification) won;
   the residual lives in `notes`. Tradeoff: permanent small imprecision, purchased
   stability.
3. **Link-header pagination with a 120-page hard cap (v3, task 54-c)** — the old 40-page
   cap pinned the map at exactly 4,000 while the account passed it (the wave-66 census
   counted 5,106). The cap now exists only as a runaway guard, and its engagement is
   receipted. Tradeoff: none real; the cap is 2.3× the current page count.
4. **CI probing on the top-motion slice only** — probing all 5,168 repos would cost
   ~5,168 extra API calls per run for numbers nobody reads at the tail. The top-24 slice
   answers "is the moving frontier alive", which is the question the map exists for.
   Tradeoff: UNMEASURED tail, loudly labeled.
5. **Evidence tuples over confidence scores** — a tuple `[family, stage, keywords,
   language]` is auditable by a stranger in one `jq`; a score would invite threshold
   tuning. This is the stone standard applied to the classifier itself.
6. **The studies layer lives in the atlas repo** — the map is the account's context; the
   studies (wave-71+) are the account's *findings about itself*. Co-locating them means a
   stranger gets scale + motion + measured conclusions in one clone. Tradeoff: the repo's
   identity is dual (instrument + library), which the README and this doc both state.
