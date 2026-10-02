# SEED DNA — the genetic code of the SuperInstance study set

> Wave-66 lane 66-a research artifact. **Zero-shot contract:** this file catalogs 47
> SuperInstance repos (read live via the GitHub API on 2026-10-02: README, top-level
> structure, last 5 commits each — ~200 receipted API calls) and states each repo's
> SEED ESSENCE: the one irreducible thing it does, stripped of language and framework,
> as a geometric "genetic code". Companion machine-usable file: [`seed-dna.json`](./seed-dna.json).
> The principal's question this answers: *the DNA of life is a toolkit with variations —
> basic codes for functions, and the logic is geometric in nature. Where is that in our
> tools?* Append-only chapter: nothing here deletes or rewrites any prior atlas content.

---

## 0. The one genetic code (read this first)

Across 47 repos, eight primitives recur. Every repo in the study set is a re-expression
of some subset of this alphabet — in TypeScript, Python, Rust, Verilog, Forth, Prolog,
Erlang, or shell. The alphabet is the DNA; the repos are its phenotypes.

| # | primitive | language-free definition | where it is most load-bearing |
|---|-----------|--------------------------|-------------------------------|
| 1 | **CELL** | a typed, addressable unit holding state + behavior; identity is coordinates, never floats | quilt, jev-quilt, quilt-in-git, quilt-verilog, quilt-nn, cellgraph |
| 2 | **EDGE/HOP** | a directed link carrying weight or delta between cells | quilt-in-git links, jev-quilt hooks, quilt-verilog LINK, quilt-nn inputs, jev-net synapses |
| 3 | **TICK** | the unit of time — non-deferrable (verilog proves it can't be starved), throttled into tides (chrono), or a commit (quilt-in-git) | quilt-verilog, quilt-chrono, quilt-in-git, quilt-runbook |
| 4 | **RECEIPT** | a hash-chained append-only record of an act; `{seq, prev, body, id}` (+sig) | MicroMoth-quilt, quilt-qcells, quilt-nn, quilt-runbook, quilt-chrono, slackwater-quilt, quilt-mcp-receipts |
| 5 | **CHAIN/REPLAY** | replay of the receipt chain ≡ live state; tamper localizes to the exact row | quilt-qcells (4254/4254), frozen-clock-lab, erised-sequencer, quilt-organ-workers |
| 6 | **PROJECTION** | a read-only view over the chain: `stateAt`, `diff`, `flowMap`, render, rewind | quilt-chrono, quilt-runbook, delta-shape, jev-quilt last-mile law |
| 7 | **SEAL/GATE** | fail-closed, NAMED errors; freeze; signed checkpoints over `{hash, manifestHash, seq}` | quilt-jev-toolkit organ v2, quilt-chrono custody, quilt-qcells registration, murmuration's std==0 rule |
| 8 | **FOLD** | merge-order-independent combination of a knowledge set (commutative, associative, idempotent) | quilt-bandit, murmuration deference, quilt-swarm sheets, fleet consensus |

Two derived constants appear everywhere and are the account's signature constants:

- **The canary:** `fnv1a64("café Δ 日本語") = 0x024a555471370b18d` — pinned byte-exact
  across Python, TypeScript, Rust, C#, Julia (jeviter, cellgraph, jev-quilt). It guards
  *source portability*.
- **The organ triple:** `{hash, manifestHash, seq}` under HMAC-SHA256 — the custody seal
  (quilt-jev-toolkit spec §8, adopted byte-for-byte by quilt-chrono lane 67-a). It guards
  *history*.

---

## 1. THE FAMILIES

Families here are **functional organs**, deliberately orthogonal to quilt-atlas's
name-based families (jev/latent/moth/qthe/quilt/fleet). A repo is assigned by what it
*does to the organism*, not by what its name matches. Full per-repo DNA in
[`seed-dna.json`](./seed-dna.json).

### FAMILY S — SUBSTRATES (the cell/kernel)

**quilt** (TS/HTML) — *the reactive typed cellular runtime: a spreadsheet where every
cell is a live capability and the grid is the runtime.*
Genetic code: `{cell×9 kinds, dependency edge, reactive recompute, listener, federation}`.
Language: TypeScript+HTML — the product skin: playground, badges, 38-repo ecosystem page.
Soft joints: formulaic = cell kinds, sheet JSON shape, engine dispatch; dynamic = AI cells,
elf workers. Time: engine memoizes current state; history lives elsewhere (that gap is
what quilt-chrono fills). Synergy: the trunk every substrate repo grafts onto; its Murmur
gossip ≈ I2I bottles; its Room-as-cell RFC ≈ PLATO rooms.

**quilt-in-git** (Shell) — *the quilt lives inside plain Git: dials are files, ticks are
commits, rewind is checkout, hooks are the runtime.*
Genetic code: `{dial write, commit-as-tick, post-commit receipt, cascade, freeze gate,
orphan snapshot ref}`. Language: Shell/Git — the constraint *becomes* the runtime: clone/
push/bundle/time-travel come free; zero engine code. Time: the commit IS the tick; the
receipt's timestamp is the commit time, never wall clock (determinism over convenience).
Honest limits receipted: hooks inert in fresh clones until `quilt-init`; freeze is
convention not security. Synergy: git-agent's substrate; quilt-chrono's rewind-without-
erase proven by git itself; refs/quilt/dials = the fleet's vital-signs sidechannel.

**git-agent** (Python) — *the repo IS the agent: observe → plan → execute → communicate →
reflect, with commits as work and I2I bottles as speech.*
Genetic code: `{lifecycle loop, TASKS.md board claim, bottle commit, career stage}`.
Language: Python — the harness family; swappable LLM backends. Soft joints: formulaic =
board grammar, bottle format; dynamic = task selection, reflection. Time: git history is
the agent's diary. Synergy: consumes quilt-in-git conventions; feeds fleet-triage signals;
I2I = quilt-i2i's coordination ledger.

**jev-quilt** (Python) — *cellular-first decision substrate: typed cells, hooks on deltas
(not values), per-cell bookkeeper WAL, decide-in-one-pass / project-elsewhere.*
Genetic code: `{typed cell, delta hook + deadband floor, bookkeeper WAL, projection split,
binary viability floor}`. Five laws incl. "identity never floats" (q16 exact rationals)
and "the decider never renders". Language: Python core + Rust/Mercury/Haskell polyform
ports. Time: replay ≡ live per cell; continuous battery survives sandbox wipes by living
in git. Synergy: the doctrine parent of jeviter, jev-garden, jev-net; Typesafe/jev wire
compatibility is the fleet's decision API.

**MicroMoth-quilt** (Python, multi-language ports) — *the smallest quantum framework,
taught to keep receipts: every gate a BIND, every measurement a sealed collapse event.*
Genetic code: `{gate append, seeded collapse receipt, replay-to-prove, fnv1a chain}`.
Killer insight: **collapse is an event, not a state** — a seeded collapse receipt turns a
histogram number into a re-executable claim. Language: stdlib Python (template), JS/Lua/
C#/Arduino ports upstream. Synergy: quilt-qcells is its engine-side twin; supplies TRUE
quantum seed bits to cot-quilt; mothquantum channel shared fleet-wide.

**mavis-substrate-walker** (Python) — *a substrate is anything that emits and accepts
receipts; the walker crosses them all with STITCH / WITNESS / PROMOTE.*
Genetic code: `{stitch, witness, promote}` mapped to physical primitives (entanglement/
clock/projection). Language: stdlib Python — even a dict qualifies as a substrate.
Synergy: the weakest-coupling connector; formalizes what every other repo does implicitly.

**platonic-randomness** (TypeScript) — *structured pseudo-randomness: the five Platonic
solids' symmetry groups shape PRNG state rotation; the seed determines the sequence
forever.* Genetic code: `{solid choice = orbit texture, seed → deterministic stream}`.
Note: mission flagged it "may 404" — **it did not 404**; it is alive (created 2026-03,
119 tests, CI). Language: TS/npm — the deterministic-identity organ. Synergy: erised-
sequencer cuts its dice from this (`sha256(prev_tip | seq | solid | n)`); cot-quilt and
jev-net prefer TRUE mothquantum bits for seeds — determinism vs entropy, receipted either
way.

### FAMILY T — TIME ORGANS (ledger, playhead, rewind)

**quilt-chrono** (JS) — *time as a first-class dimension: the spreadsheet with a playhead.*
Genetic code: `{reading, writing, flow_id double-entry (n reads ↔ 1 write), tide (held
propagation rides the next crest), compensating entries, seal = organ checkpoint}`.
"Balanced" law: every flowed write must pair ≥1 read — the write's cause is provably the
read, forever. Time: append-only jsonl; corrections are compensating entries; rewind
appends. Synergy: adopts quilt-jev-toolkit's checkpoint byte-for-byte (anti-drift law:
"no chrono-specific fields"); quilt-far-shore specs derivative/integral cells over it;
quilt-runbook's stable points are its `stateAt`.

**frozen-clock-lab** (Python) — *order lives in the chain; the clock is an injectable
fault* (freeze/skew/replay/honest). Born from a real incident: an edge worker's clock
froze across 25.6M ops and nothing broke because nothing trusted the clock. Genetic code:
`{receipt = fnv1a(prev|op), position = integer index, clock = forensics only}`. P1–P5
pins incl. "chain survives freeze byte-identical". Honest limits: chain proves ORDER not
IMPORTANCE; fnv1a is integrity-mark not signature. Synergy: the theory under quilt-chrono's
`ts_utc` being forensics; delta-shape's "no replays" law; position-sync for simulators.

**quilt-runbook** (JS) — *play-test runs as append-only ledgers: rewind to stable points,
WHY-decomposed adjustments, mined into compiled cells — runs stop needing adjustments.*
Genetic code: `{attempt, observe, adjust{target,before,after,WHY{trigger,hypo,evid}},
stablepoint(hash+snapshot), rewind-appends-resumed-from, mine→compiled_cell}`. This is the
principal's wave-66 play-tester directive made mechanical, with the §5a adjustment schema
SHARED with quilt-softjoints (cross-lane contract). Synergy: consumes quilt-chrono
projections; feeds quilt-softjoints compiler; dogfooded by a catalog lane.

**slackwater-quilt** (Python) — *the ledger IS the build: every geometry operation is a
receipted cell; there is no build state, only what the log says replayed.*
Genetic code: `{PLACE/RELEASE/PATH/TICK receipts, sha256 tip, append-time gate + replay-time
adjudication, exact Eisenstein integers only in payloads}`. The epistemological gem: **a
hash-valid ledger can still lie; only geometry adjudicates** (NC2). It also draws the
fleet's hash line in the sand: sha256, not fnv1a-64, for chains ("FNV is trivially
forgeable; if you need 8 bytes, compress a sha256 receipt"). Synergy: direct seed expansion
of slackwater-lattice (its EXPANSION SEED #1 named this repo); pattern imported from
quilt-qcells ("the ledger is the circuit" → "the ledger is the build").

**erised-sequencer** (JS) — *a rewindable TTRPG scene engine: dice re-derived from the
ledger itself; scars persist through rewind.* Genetic code: `{beat receipt, ledger-derived
dice, scar (sticky across rewind), twist energy (earned surprise as curve geometry)}`.
The soft-joints thesis as a playable work-product: the Keeper proves everything and opens
nothing; the Stranger proves nothing and opens the door — the last joint stays soft on
purpose. 13/13 pins + pre-registered predictions (4/4). Synergy: platonic-randomness
(dice), quilt gesture math (twist), erised time economy; quilt-chrono/organ law mirrored
in gameplay (S1–S9).

**quilt-far-shore** (JS) — *imagine the 2028 runtime, then reverse-actualize it into
falsifiable specs: FACT-dimension moment-vectors (fact/tone split) and derivative/integral
derived-cells over quilt-chrono.* Genetic code: `{imagine → reverse-actualize → spec →
machine-checked tests (the spec's own JSON blocks are re-computed by tests)}`. Model
answers stored verbatim as data, not authority. Synergy: consumes reverse-actualization's
method; specs are adoption-ready for quilt-storefront (`vector.js`, `freeze.js`) and
quilt-chrono.

### FAMILY W — WITNESS INSTRUMENTS (epistemics: digests, shapes, exactness)

**cellgraph** (Python) — *a transformer forward pass IS a quilt cell graph; a witness
digest at every boundary recovers the dependency graph from digests alone.*
Genetic code: `{typed cell f(env,*inputs), insertion order = topo order, per-cell digest,
perturb-and-diff localization, forecast-then-witness}`. The defect story is the doctrine:
its witness was blind (float32 cast before hashing) and reported "no fault" with full
confidence — fix pinned as two rules: **hash the array you have; put the dtype inside the
digest.** Synergy: parent convention of quilt-nn + quilt-attention (both cite it, and both
fixed its portability via the `f64|8|…` tagged-string preimage); moves the polyformalism
canary from source code down to tensors.

**quilt-nn** (JS) — *neural nets as cell graphs, trained for real, receipted every epoch;
same seed → same bytes.* Genetic code: `{weight/sum/product/act/loss/grad/tick cells,
LCG-seeded determinism, per-epoch sha256 chain, portable preimage, verify()}`. The grad
cell is the analytic derivative composed on the SAME graph — no autograd tape. Synergy:
closes the loop cellgraph (forward) + micrograd-quilt (backward) started; its v1→v2
receipt fix was cross-pollinated through quilt-attention#1 — iron sharpening iron, receipted.

**quilt-attention** (JS) — *one-head self-attention as a cell DAG with hand-rolled,
gradchecked backprop, per-epoch receipts, and digest-exact fault localization.*
Genetic code: `{embed/attn/matmul cells, dtype-tagged digests, perturb-one-cell → changed
set must EQUAL the downstream topological slice}`. Honest caveats pinned: witness resolves
finer than cells; softmax-shift invariance can legitimately hide a direction. Synergy:
quilt-nn's twin; cellgraph's descendant.

**micrograd-quilt** (Python) — *Karpathy's 100 lines, asked three new questions: where do
floats lie (stochastic exact-rational auditor), how do you prove a gradient (hash-chained
opcode tape, replay ≡ live bitwise), how does the engine evolve (tape spine = genotype,
viability floor binary).* Genetic code: `{Value twin, BIND/LINK/EFFECT/VIEW/TICK/FORGET
tape, genotype = canonical spine, comb = dual-order disagreement}`. Synergy: the opcode
algebra (from AI-Writings/algebra.md) lands here in autograd, in MicroMoth's collapse
ledger, in qcells — the fleet's five-opcode DNA is visible across all three.

**delta-shape** (JS) — *deltas-as-shape, content-addressed one derivative below receipts:
a series' identity is the sign-pattern of its deltas plus change-points — value-free by
construction.* Genetic code: `{shape hash, flatTail/extinct/firstCrossing predicates
(R64's prose made checkable), Weber/JND gates (dynamic quantization by surround),
time-first ranging with honest remainders}`. Also pinned the fleet lesson: **a canon chain
with prev_hash=0 everywhere is the band with no tuning fork** — nonzero genesis is the
absolute anchor. Synergy: consumes quilt-ewitness e-processes (vendored, sha-pinned);
unifies witness-validation / qcells RATE-NOT-WALL / eLearn into one shape vocabulary;
prices murmuration-style drift alarms.

**quilt-qcells** (Python) — *quantum ops as quilt cells, as a working plugin: the ledger
IS the circuit.* Wraps a pinned micromoth oracle; every primitive op appended emits a
hash-chained row; the ledger replays to a byte-faithful QuantumCircuit. Genetic code:
`{CellCircuit wrapper, CellLedger (fnv1a-64, genesis prev 0), verify_ledger,
rebuild_from_rows, check_anchor, canon C1–C6 pinning the design's open byte choices,
pre-registered P1–P4 claims with fail-closed stale-seal refusal}`. Proven: replay == oracle
exactly, chain verifies from genesis, exhaustive single-byte tamper **4254/4254 localizes
to the exact row**, byte-identical determinism across builds. Honest holes named: no
physical erasure (FORGET is a receipted tombstone), no tail-truncation detection without
the published `(tip, rows)` anchor, unseeded counts minted `EFFECT/UNSEALED` and excluded
from determinism claims. Synergy: jev-garden's real training soil (16 ledgers / 1418
rows); MicroMoth's engine-side twin; slackwater-quilt's pattern source; its
registration.json is one of the seven hand-rolled pre-registration copies to distill.

**slackwater-lattice** (Python, on PyPI) — *exact Eisenstein A₂ hex geometry: no floats,
no drift, six equidistant neighbors, no privileged axis.* Genetic code:
`{EisensteinInteger arithmetic, snap (continuous→discrete, deterministic), O(1) integer
collision, A* with admissible hex heuristic}`. The published PyPI defect (hex_distance)
was pinned and fixed with an exhaustive property suite — measurement culture on a math
lib. Synergy: constraint-theory-core's sibling exactness line; slackwater-quilt's substrate.

**constraint-theory-core** (Rust, crates.io) — *stop representing directions as floats:
Pythagorean triples + KD-tree snapping = exact, cross-machine-reproducible rotation.*
Genetic code: `{triple snap, integer norm, deadband funnels, Laman rigidity, metronome
consensus, holonomy verification}`. 83 tests, zero deps. Synergy: slackwater-lattice
(both Eisenstein-lineage exactness); murmuration consensus (holonomy = zero-drift
agreement); everything downstream that needs two machines to agree forever.

### FAMILY J — MODELS IN THE JOINT (learning, judgment, iteration)

**jeviter** (JS, zero-dep) — *homeostatic iteration: pull until the world SURPRISES a
sliding boundary belief; every silence booked as a receipt; the threshold is alive
(mean + k·σ).* Genetic code: `{gain, threshold, silence receipt, ratchet (fixed-amplitude
oscillation silenced after exactly one admission — adversarial resonance impossible by
construction)}`. Cross-verifies with jev-quilt's Bookkeeper via the café canary. Synergy:
the nerve that lets every other repo stop polling: quilt lanes, log tails, MCP servers
(ships one), vibe→spec distiller.

**jev-garden** (JS) — *the living JEV training system: grows from what flows through the
quilt; idle compute compiles the ExoJ into versioned weave artifacts.*
Genetic code: `{watch → deform → observe → idle-compile → serve → escalate-to-teacher →
grow}` with a bake-off discipline (qthe/hash/field arms, pre-registered, sealed, honest
FAILs kept as crown jewels). First harvest: parametric tissue wins (96.14%), three
ensemble forms refuted on saturated soil, JS⟷Python byte-identical weave (5450 bytes).
Synergy: trained on real quilt-qcells ledgers (16 ledgers / 1418 rows); serves the
systemone wire so quilt lanes can swap the hosted JEV without protocol change; A13 gave
it the fleet's first EXECUTED budget cap.

**jev-net** (Python) — *a neural network whose neurons are JEV calls: J=confidence is the
presynaptic gate, E=typed extractions are the prism, V=verdict spawn is the recurrent
iterator; hebbian credit only along edges that delivered.* Genetic code:
`{JEV packet, salience×confidence×weight transfer, threshold fire, spawn re-injection,
fuzzy judge→cell matching, learned state = bootable JSON}`. Honest: "judging models are
unreliable narrators; the ledger is not". Synergy: jev-quilt doctrine at network scale;
provider-ladder + moth-bits conventions shared with cot-quilt; state.json is the
saved-state-bootable-by-others deliverable shape.

**quilt-ml-recipes** (JS) — *the night's working setups as recipe cards, each with a
RECEIPT (pinned numbers), a NEGATIVE-CONTROL (the rule shown failing live), and a GROW
path; the library's certifier itself has a negative control.* Genetic code:
`{recipe = receipt + negative-control + grow-path, LIBRARY CERTIFIED or nothing}`.
Six recipes R1–R6 (determinism, cell-graph training, chained run ledger, judge
calibration, convergence alarm, fold-convergence). Synergy: distills quilt-lab, cellgraph,
quilt-bandit into copy-anywhere cards — the closest thing to the fleet's "standard library".

**quilt-ml-architecture** (docs only) — *the architecture proposal, not a claim: the model
is a cell graph, witness at every activation, canary moved down to the tensor.* It also
did the honest audit: found a public "in-quilt" fork of llama3-from-scratch with ZERO
fleet commits — "a false claim about our own work" — and proposed the simple-llm lesson:
**the unit has to fit in someone else's head.** Synergy: the design doc cellgraph/
quilt-nn/quilt-attention implemented; fleet-triage's hollow/stub census in miniature.

**harness-rssi** (Python/docs) — *RRSI applied to the fleet itself: a liveness probe that
found zero of five durable recipes have measured variance.* Genetic code:
`{leakage critic, noise-adjusted floor, cost rule, pruning}` mapped onto named fleet
failures ("durability is absence of measurement, not evidence of it"; the load-bearing
278-line probe has no regression guard). Synergy: the critique that seeded fleet-seeds'
M13 ("procedure value is executor-scoped") and the whole pre-registration discipline the
garden/qcells/bandit now practice.

**cog-lab** (JS) — *the Cog Thesis, tested: a cellular component is learnable from
simulated I/O iff its role is computable from its own input/output contract.* Pinned a
real engine (quilt-dba @ sha), committed RULES R1–R8 BEFORE the run, measured 4 contract
gaps (CG-1..4) and honestly recorded H-1 (the harness finding: null control could not
widen the gap — refusal policy fired). Genetic code: `{determinacy, sim↔real transfer
gap, rules-before-findings, MEASURED/SYNTHETIC/CITED/PREDICTED marks}`. Synergy: the
spec-fidelity instrument for every cell contract; wave-2 pre-registers a generalizing
model class.

**ladder** (Python) — *an adversarial reading of a seeded training ladder: what is still
CHECKABLE at each rung; a shared memory layout hides rather than filters (fix: producer
sequence numbers).* Verdict: the sweet spot is the middle of the ladder (5x5, Connect 4,
blackjack) — the top rungs are uncheckable by construction. Genetic code:
`{rung checkability class, observable-proxy substitution, sequence-number auditability}`.
Synergy: fleet-triage's failopen lesson applied to training; murmuration's controls
culture; feeds GPU-experiment queues with decision trees.

**cot-quilt** (JS/Python) — *the CoT-decomposition cell: a large model's chain-of-thought
decomposed by cheaper models into a cellular graph; the large model judges its own
decomposition; critique folds back in as new cells.* Genetic code:
`{3 lenses × seeds, SPLIT→WIRE→MERGE→JUDGE, cross-seed agreement = weight, divergences =
alternate routes, judge.gaps = next-generation cells}`. The receipted payload: only
divergent samples carried *aging* — decomposition makes a model's convergence/divergence
structure visible per-cell. TRUE quantum seeds (48/48 bits); burn-guards; atomic receipt
writes. Synergy: feeds cells to quilt (graph_v1→value cells), judge.gaps→question-cells;
organ bundle uploaded LIVE to the fleet organ store; provider lessons shared with jev-net.

**Patchwork-experts** (Python/Markdown) — *a community quilt of freezable expert patches:
grow → freeze (distill the delta) → trade (PR) → patch in (agent reads patch.md+meta.yaml
and embodies it).* Genetic code: `{patch = knowledge+alignment; harness = hands; every
patch carries its trail}`. The Arduino pin-layout insight: one standard shape so agents
think in *experts*, not context windows. Designed to be read and browsed by agents first.
Synergy: the human-facing end of jev-garden's weave artifacts; quilt-softjoints' greeter
law at library scale.

**murmuration** (Python) — *a swarm of first-person cells reaching consensus by local
deference alone, no center, no objective; JEV-as-oracle null result included.*
Genetic code: `{k-nearest read, deference-to-confidence (averaging was a dead fixed
point), d-dimensional opinion space sustains d+1 defended tissues, degree-preserving
rewiring control}`. The controls culture is the real product: three instruments caught
lying, one seeded bug caught by exp10, std==0 scored INCONCLUSIVE by law. Synergy:
quilt-bandit's variance-collapse twin (homogenization vs tissue defense);
constraint-theory-core's holonomy; the honest-negative canon.

### FAMILY F — FEDERATION & SWARM

**quilt-bandit** (JS) — *RL as gossip federation over a diff-DAG: observations are cells,
policy is read-time folding, no parameter server; signing overlays provenance without
changing semantics.* Genetic code: `{observation cell, gossip-ring sync, canonical fold,
Ed25519 DID = key-in-identity, reject-sig receipt}`. The finding of record: federation's
real effect is **variance collapse** (spread 22.36→5.92, 3.78×) — pooling homogenizes
fate; dithering partially decorrelates; both headline claims FAILED honestly and were
kept. SG2's documented asymmetry: signatures protect only the sheets that enforce them.
Synergy: murmuration (swarm epistemics), quilt-nn receipts, quilt-ml-recipes R6.

**quilt-swarm** (TS) — *a Quilt sheet as the control plane for Docker Swarm: edit a cell,
the cluster follows.* Genetic code: `{value cell → replica count, formula → service spec,
program cell → reaction}`. Language: TS strict, 28/28 tests. Synergy: the ops skin of the
cell doctrine (same genome as quilt-codespace's runtime tier).

**quilt-codespace** (Shell) — *a Codespace as a live, token-authenticated, federated quilt
tier: TUI + HTTP/SSE + dashboard; subscribes to siblings via quilt://instance/sheet#cell.*
Latest commit: a deterministic repo-oracle + receipted fix-loop PoC (wave-66). Synergy:
codespace-worker (ephemeral compute), git-agent (repo-native agents), ESP32/Jetson tiers.

**codespace-worker** (Shell) — *run commands remotely in ephemeral Codespaces: cross-arch
builds, agent offloads, batch.* Genetic code: `{command offload, ephemeral lifecycle}`.
Smallest repo in the set (335-byte README) — the fleet's utility strip.

**agent-memory** (Rust, crates.io) — *three-tier cognitive memory with decay ×
logarithmic reinforcement × importance, and O(n) consolidation pruning.*
Genetic code: `{episodic/semantic/procedural store, S = importance·(1+ln(1+access))·e^(−λ·age),
consolidate(τ)}`. Language: Rust — the persistent-cognitive-substrate family. Synergy:
jev-garden's rhizome (memory that grows by use) and jeviter's booked silences are the
event-sourced mirror of this aggregate-stat mirror.

### FAMILY O — ORGANS & INFRA

**fleet-kit** (Python, PyPI) — *the modular toolkit: PLATO client, zero-holonomy
consensus, model router, crab agent shell, repo auditor, badge/indexer utilities — import
one tool, no framework.* Genetic code: `{client, router, shell, auditor}`. Synergy: the
hand-rolled predecessors of several organs live here; fleetlint wave cleaned its tree.

**ccc-os** (Python, PyPI) — *autonomous fleet monitoring: monitors → codified rubric →
prioritized queues → autopilot intervention → deck generation.* Genetic code:
`{signal monitor, rubric evaluate, dispatch, severity autopilot}`. Synergy: consumer of
fleet-triage/fleet-health signals; the human-liaison escalation path.

**fleet-triage** (Python) — *mechanical triage of the 5,108-repo namespace: hollow /
untested / noverify / failopen (a CI gate that cannot fail) / vendored / historybloat —
"a read that fails is recorded unreadable, never a clean bill."* Two of its own bugs are
kept ON PURPOSE as doctrine: the per-file pipefail hole ("a control that runs, is
satisfied, and gates nothing") and the zero-denominator ratio ("36 real findings out of
106 flags — the arithmetic caught the instrument"). Genetic code:
`{cheap mechanical signals, per-step checks, negative controls, UNMEASURED ≠ zero}`.
Synergy: quilt-atlas's honesty laws are the same laws at map scale.

**quilt-atlas** (JS) — *the living map: a scheduled workflow re-inventories the account
every 6h; families, motion, CI on the moving frontier; the map only grows truer.*
Genetic code: `{inventory, name→description classification with recorded evidence,
Link-header pagination receipted, CI probed only on the motion slice (absence = UNMEASURED)}`,
hand-audited samples kept with receipted residuals (fleet 83%, qthe 87% strict). This
chapter (seed-dna/) is its newest addition. 

**reverse-actualization** (JS on CF Worker + Python lanes) — *think backward from the
future that already exists: return ONLY the mandatory prerequisites, never suggestions.*
Genetic code: `{targetState → deriveRequiredSteps, fork-first single-function logic}`.
Wave-73/73b dogfood: four models walked the same 11-rung ladder to the fleet's own 2036,
and the NEGATIVE ladder (2037→2046) registered-then-walked, prediction CONFIRMED. Rung 10
is the fleet compressed to one sentence: *a file-cell with a standing instruction; a poke;
a receipt appended and never rewritten; a one-sentence self-amendment.* Synergy: the
method quilt-far-shore industrialized.

**quilt-verilog** (Verilog + Python harness) — *the cell fabric in silicon: 5+1 opcodes
(BIND/LINK/EFFECT/VIEW/TICK + ack/nak), no vendor primitives, formal proofs, real iCE40
bitstream via open tools, QUF = "the GGUF of cellular silicon".* The language made it
become: cycle-exact. The formal proofs found two real RTL defects simulators accepted —
and **the tick cannot be starved** (pending tick suppresses ingress; non-deferrable time,
proven under flood). Genetic code: `{opcode FSM per cell, Hebbian edges, power-law
forgetting, fabric tick, QUF state file}`. Synergy: the five-opcode algebra's hardest
proof; MicroMoth/qcells share the opcode vocabulary; byte-exact with the polyformalism.

**quilt-i2i** (Forth/Prolog/Erlang) — *low-level cells in distant language families: each
language's constraints carve a DIFFERENT cell from the SAME doctrine — three different
definitions of done.* Forth: does it compile to the stack? Prolog: does unification
terminate? Erlang: does the actor survive restart? Also the fleet's I2I coordination
ledger (agents book what they learn before building). Genetic code:
`{cell-as-doctrine, language-carved shape, ledger booking}`. Synergy: the polyformalism
canary's philosophical home; the anti-GAN shape (many routes, one answer).

**quilt-llvm** (Rust) — *a compiler infrastructure whose IR is a fabric of inspectable
cells: passes append diffs (history never rewrites), conservation = every admitted value
is delivered or dropped-with-ledger-entry.* Keel + theory + glossary (cell↔value,
wire↔use, tick↔pass); "work has begun, nothing claimed to work yet" — the keel exists so
the next lanes build on a named idea. Synergy: LLVM parity as direction; N4 law shared
with every ledger repo; F3's lesson promoted to compiler law.

### FAMILY C — CREATIVE / APPLICATION SKINS (the essence "skinned with use-case")

**quilt-softjoints** (JS) — *the soft-joint thesis as code: decompose() → lookup tables
(everything that can freeze, does) + soft joints (small model reads the moment as a NAMED
VECTOR, fails closed, caches bucketed moments) + greeter cells (never decomposed —
scripting connection is the failure mode).* Adjustments observed during runs COMPILE into
new cells — the sheet grinds toward tables. Genetic code: `{decompose, runJoint,
freezingTest, compileAdjustments}`. Synergy: the §5a adjustment schema is shared verbatim
with quilt-runbook; quilt-lookup feeds its classes; quilt-storefront is its live proof.

**quilt-storefront** (JS) — *the general-store assistant as a living quilt: lookup tables
for the formulaic bulk, a keyword NEXUS + soft-joint classifier for the moment, greeter
law, fallback-FIRST frozen rows, every ai-cell fails closed to a lookup.* **Measured:
+2.83 over the same small model alone at ~1/3 the calls (blind-judged, wave-67 re-run).**
The freeze-test verdict is the thesis working: NO region froze — the deciding feature was
a FACT the emotional vector could not see; `refunder.frozen` ships EMPTY (evidence or
nothing). Synergy: softjoints+lookup+runbook's compound organism; far-shore's §A/§B
adoption target.

**quilt-lookup** (JS) — *the principal's mathematical-spreadsheet catalog (988 entries)
as machine-usable JSON + 73 executable cell recipes + a soft-joint classification per
entry; "the filename says not-complete — we keep answering" (1040 entries, 104 families;
unparseable lines preserved with reasons; collisions suffixed with dup_of receipts —
nothing deleted).* Genetic code: `{catalog entry, executable recipe, soft-joint tag,
lossless parse}`. Synergy: decomposer fuel for quilt-softjoints; greeter-territory is law.

**quilt-canvas** (TS) — *the web/WASM line: a canvas where every cell is an addressable
capability; genome ≠ evidence (a projection renders the genome and cannot flatter you).*
Honest status section: scaffold in relaunch, engine crate not landed. Synergy: quilt-
canvas-tui is the reference byte-compatible implementation; chiaroscuro lineage.

---

## 2. The synergy map (the coalesce)

The organism the principal wants is already assembling itself. Edges below are drawn
only where a repo *actually consumes or produces* another's artifact (receipted in the
READMEs/commits above), not where a theme merely rhymes.

```
                         ┌────────────────────────────────────────────┐
                         │  SUBSTRATE: quilt cells (S)                │
                         │  quilt · quilt-in-git · git-agent          │
                         │  jev-quilt · MicroMoth · mavis · platonic  │
                         └──────┬─────────────┬───────────────┬───────┘
                                │             │               │
             opcode algebra     │  ledger-is- │   delta hooks │  seeds (true bits
             BIND/LINK/EFFECT/  │  the-circuit│   + bookkeeper│  & deterministic)
             VIEW/TICK          ▼             ▼               ▼
        ┌─────────────┐   ┌────────────┐  ┌───────────┐  ┌────────────┐
        │ WITNESS (W) │   │ TIME (T)   │  │ JOINT (J) │  │ SWARM (F)  │
        │ cellgraph   │   │ chrono     │  │ jeviter   │  │ bandit     │
        │ quilt-nn    │◄─┐│ frozen-clock│ │ jev-garden│  │ murmuration│
        │ attn        │ │ │ runbook     │  │ jev-net   │  │ swarm      │
        │ micrograd   │ │ │ slackwater-Q│  │ cog-lab   │  │ codespace  │
        │ delta-shape │ │ │ erised      │  │ recipes   │  │ agent-mem  │
        │ lattice     │ │ │ far-shore   │  │ harness-  │  └─────┬──────┘
        │ constraint  │ │ └──────┬──────┘  │ rssi      │        │
        └──────┬──────┘ │        │         │ cot-quilt │        │
               │        │        │         │ patchwork │        │
               │        ▼        ▼         └─────┬─────┘        │
               │   ┌──────────────────┐          │              │
               │   │ ORGANS (O):      │          ▼              │
               │   │ organ-store KV,  │   ┌────────────────┐    │
               └──►│ mcp-receipts,    │◄──│ SKINS (C):     │◄───┘
                   │ atlas, triage,   │   │ softjoints     │
                   │ verilog, i2i,    │   │ storefront     │
                   │ llvm, fleet-kit, │   │ lookup         │
                   │ ccc-os, rev-act  │   │ canvas         │
                   └──────────────────┘   └────────────────┘
```

**Receipted compound loops (the brewing solution):**

1. **The quantum-to-judgment loop:** MicroMoth gates → qcells receipt ledgers (1418 rows)
   → jev-garden trains on them (AUC 0.9539) → serves systemone wire → quilt lanes swap
   hosted JEV → A13 budget caps the escalation → teacher calls receipted. One organism,
   five repos, each receipting the previous.
2. **The witness lineage:** cellgraph convention → quilt-nn (backward pass added) →
   quilt-attention (localization tightened) → cross-pollinated fix via issue #1 (portable
   `f64|8|…` preimage) → both re-fixed cellgraph's portability gap. Iron sharpening iron,
   with the sharpening events themselves receipted in commits.
3. **The seed-expansion law working:** slackwater-lattice's EXPANSION SEED #1 literally
   named slackwater-quilt into existence; MicroMoth's CELL-MAPPING named quilt-qcells;
   quilt-far-shore's §A/§B name their own adoption targets. The repos are reproducing.
4. **The rewind consensus:** five independent inventions of "rewind does not erase — it
   appends": quilt-organ toolkit v1/v2 (compensating credits), quilt-chrono (compensating
   entries), quilt-runbook (resumed-from markers), erised (scars persist), quilt-in-git
   (checkout). quilt-chrono adopts the organ checkpoint byte-for-byte to stop dialect
   drift — the anti-fragility move (spec-cite, not re-spec).
5. **The soft-joint grind:** quilt-lookup classifies 1040 entries → quilt-softjoints
   decomposes & compiles adjustments → quilt-runbook books the WHY → quilt-storefront
   measures (+2.83 @ ⅓ calls) → freeze tests refuse to freeze non-deterministic regions →
   far-shore specs the next dimension (fact/tone vectors, derivative cells). The measured
   economics: formulaic bulk at zero model cost, dynamic joints only where the moment
   genuinely varies, greeter cells never frozen by law.

---

## 3. Boilerplate still missing / clunky parts to distill

The principal said: *"there are some boilerplate pieces that are still not there and
clunky parts that need to be distilled to the essence."* Specifics, with counts from
this study:

### 3.1 The receipt chain is re-implemented at least 12 times — in TWO dialects
- **fnv1a-64 lineage** (the café-canary class): jeviter Ledger, jev-quilt Bookkeeper,
  MicroMoth collapse_ledger, quilt-qcells, micrograd tape, quilt-canvas fabric digest,
  frozen-clock-lab.
- **sha256 lineage**: slackwater-quilt (which explicitly REFUTES fnv1a for chains:
  "trivially forgeable; compress a sha256, never replace it"), quilt-nn v2, quilt-attention,
  quilt-runbook, quilt-chrono sidecar, erised-sequencer, quilt-mcp-receipts (qmr1, HMAC).
- **Clunky consequence:** jeviter receipts "cross-verify with jev-quilt from byte one"
  *inside one dialect only*; slackwater-quilt cannot verify against any fnv1a sibling;
  quilt-nn had to ship a v1→v2 receipt migration because the first preimage wasn't
  portable. **Distill:** ONE receipt primitive `{seq, prev, body, id, sig?}` with
  pluggable hash (conformance-canary fnv1a for cross-language portability checks;
  sha256 for custody chains), canonical-JSON preimage, named fail-closed errors, tamper
  localization, and tip publication. All the pieces exist separately (quilt-jev-toolkit's
  receiptHash/verifyChain; quilt-mcp-receipts' qmr1; quilt-nn's portable preimage;
  cellgraph's dtype rule).

### 3.2 The tamper/verify test battery is re-proven ~8 times
qcells (4254/4254 exhaustive), mcp-receipts tamper trio, quilt-nn verify(), quilt-chrono
balanced()+verifyCustody, quilt-runbook fail-closed steps, slackwater-quilt NC1/NC2,
erised S1–S9, MicroMoth pins. Every one re-proves the same trio: edit→detect,
delete→detect, reorder→detect, each with its own fixture. **Distill:** one shared
conformance harness (like quilt-organ-workers' validate-dialect, already proven
cross-repo) with a golden fixture corpus + negative controls, imported not copied.

### 3.3 Pre-registration/seal boilerplate hand-rolled 7+ times
qcells `registration.json`+`--register`; jev-garden sealed registration (sha256+mtime,
fail-closed stale seal); quilt-bandit pre-registered ensemble claims; erised
predictions.json; cog-lab RULES R1–R8 committed pre-run; murmuration's std==0 law;
reverse-actualization wave-73b register-then-walk. Same shape every time: claim → seal →
refuse-if-stale → verdict HELD/FAILED verbatim. **Distill:** one pre-registration
primitive (schema + seal + verify + verdict class), so a lane's predictions are
machine-comparable across repos (fleet-seeds' registry is the natural host).

### 3.4 The receipted model-call client is re-implemented 4+ times
jev-net (hard deadlines, ladders, fuzzy judge matching), cot-quilt (burn-guard, JSON
repair, atomic receipt writes), jev-garden (teacher bridge + usage receipts),
quilt-softjoints (joint.js: typesafe/deepinfra/local + cache + fail-closed fallback),
fleet-kit ModelRouter. Same requirements, five codebases: timeout ≠ socket timeout;
truncated-JSON recovery; per-call receipt {model, usage, latency, finish}; fail-closed
fallback; budget caps (A13). **Distill:** one provider-ladder primitive.

### 3.5 Key/push discipline scripts are copied, not packaged
quilt-far-shore's README: keyscan "copied verbatim from cot-quilt". The key-scan +
tokenize-push + ls-remote-verify + scrub recipe exists in fleet docs and per-repo copies.
**Distill:** `fleet-kit push` / `fleet-kit keyscan` (the pattern is identical every wave;
the worklog proves the recipe never varies).

### 3.6 The cell schema diverges in dialect
`{id, kind, inputs[], params}` (cellgraph/quilt-nn/quilt-attention/quilt), jev-quilt's
`Cell(name, coord, hooks, decision, outputs, bookkeeper)`, quilt-in-git's
`cells/<alias>/dials/0..15`, verilog's dial registers, bandit's rate cells. No crosswalk
exists; every new port re-chooses. **Distill:** one JSON Schema + a crosswalk table
(quilt-ml-architecture already argues the case; schema/organ-manifest.v1.json proves the
fleet can hold one schema string).

### 3.7 The missing organ: tip anchoring
quilt-nn, quilt-qcells, and slackwater-quilt all state the same honest limit: a bare hash
chain cannot detect tail truncation without an externally anchored tip. The anchor
infrastructure EXISTS (organ store KV, mcp-receipts' v2 note, atlas's scheduled workflow)
but none of the study repos publish their tips. **This is the single highest-leverage
wiring job in the account:** a scheduled anchor of every chain tip into the organ store.

### 3.8 Honesty prose is hand-written every time
Every repo hand-writes its "honest limits", "receipts", "lineage" sections (this study
read ~50 of them). The atlas already generates its block between markers. **Distill:** a
receipt→README generator for the honesty block (limits table, receipts table, lineage)
so the prose can never drift from the ledger.

---

## 4. Method receipt

- Fetched 2026-10-02 via GitHub API with `Accept: application/vnd.github.raw`: README,
  `/contents`, last 5 commits, repo metadata for **49 repos** (47 core study set + 
  quilt-atlas + fleet-triage context). ~202 authenticated calls; zero 404s in the study
  set — **platonic-randomness did NOT 404** (flagged as may-404; it is alive).
- harness-rssi and quilt-ml-architecture have no README; their SYNTHESIS.md /
  ARCHITECTURE.md were fetched as the primary document instead.
- Local working clones (MicroMoth-quilt, cot-quilt, jeviter, jev-garden, jev-quilt,
  quilt-codespace, quilt-qcells, codespace-worker, quilt-atlas) used only as read-only
  context; all catalog claims are grounded in the fetched GitHub state + the fleet
  worklog (waves 63–65 receipts).
- Machine-usable companion: `seed-dna.json` — **49 entries** (the 47 study repos plus the
  two context repos quilt-atlas and fleet-triage, family-tagged `organ`), one record per
  repo, fields: repo, family, essence, primitives, language, soft_joints, time_flows,
  synergies, distill_next.
- This chapter is additive; no existing atlas content was modified or deleted.
