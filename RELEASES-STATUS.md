# RELEASES-STATUS — account publishing deep-dive (wave-66, 2026-09-30)

Census basis: `/user/repos` pagination (52 pages, per_page=100), releases/deployments/packages APIs, Actions runs API. All numbers API-read this wave, not carried forward.

## Scale

- **5106 repos** total (census 2026-09-30). The atlas's "4000+" claim is superseded.
- Page-1 flagship window (100 most recently pushed) is the deep-dive scope below.

## Publishing state (page-1 window)

| Lane | State |
|---|---|
| Releases | 21 repos released (quilt-c, Scrapcraft, sunset-ecosystem, exoj, quilt-cloudflare, pincher, eisenstein v0.3.1, ec2mud v1.0.0, cocapn-plato v3.2.0, constraint-theory-core, lucineer-relay, ccc-os v2.0.0, plato-portal, SuperInstance v1.0.0, SuperInstance-papers, polln, forgemaster, slackwater-lattice v0.1.0, QuiltEgg.jl, QuiltCanary.jl, + pong-quilt v0.64.0 this wave) |
| Packages | 3 container (composite-headspace, gno/portalloopd, open-webui — June vintage, stale) + 11 npm (qthe, mudra-bridge-core-gh, canon-* family — private) + **new: `@superinstance/quilt-neighbourhood@0.1.0` (GitHub Packages, this wave)** |
| Deployments | 8 repos on github-pages (pong-quilt, quilt-c, AI-Writings, Syzygy, fleet-dashboard, Scrapcraft, plato-portal, SuperInstance) |
| CI | **Zero Actions runs account-wide until wave-66.** Now: quilt-neighbourhood (2 green runs) + pong-quilt build-then-test workflow (seeded this wave) |

## Wave-66 PoC additions (both released with receipts)

- **quilt-neighbourhood** v0.1.0 — diff-DAG convergence for quilt sheets; 8/8 suite (T1-T5 + NC1-NC3); contract from the coasys study (66-c), rebuilt in cell-receipt idiom. npm package published.
- **slackwater-quilt** v0.1.0 — "the ledger is the build": every slackwater lattice op as a receipted cell; 12/12 suite; **found an upstream bug**: slackwater-lattice 0.1.0 `hex_distance` disagrees with its own `neighbors()` for ±(1+ω) steps (replay adjudication caught it).

## Where-ready queue (flagships still unreleased, honest gating)

| Repo | Blocks release because | Ready when |
|---|---|---|
| cellgraph | no test suite receipt | transformer-as-cell-graph battery green in CI |
| quilt-gpu-lab | no suite receipt | GPU-optional tests green, determinism receipt |
| quilt-vm-wasm | 5-opcode core needs the canary pin | FNV canary byte-identity test in CI |
| Syzygy | single-pass executor unbenchmarked | perf receipt + suite green |
| edge-ledger | fleet-state@v1 contract needs conformance tests | replay + tamper pins green |
| mavis-substrate-walker | STITCH/WITNESS/PROMOTE unverified cross-substrate | one substrate conformance run receipted |
| subleq-fabric | code-as-integer-array identity untested | hash-identity pin green |
| canary-3lang | polyformalism canary needs cross-lang bit-identity | Futhark/Jl/C canary hashes equal |

Doctrine: a release is a receipt, not a label — no release ships without run-verified numbers (three-elements) and its own negative controls. The Rust template family ("A Rust library for X", ~60 repos on page 1 alone) is intentionally NOT release-gated; they are scaffold, not artifact.

## Next publishing lanes

1. GitHub Actions seed on flagship repos (pong-quilt pattern: build-then-test) — CI is the deployment lane's missing foundation.
2. npm `@superinstance/slackwater-quilt` (python package would go to PyPI — needs registry creds decision).
3. Container lane refresh (3 stale containers from June) — quilt-neighbourhood + slackwater-quilt images where a runtime makes sense.
