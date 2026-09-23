# Data structures and algorithms — build plan

*An authoring brief, following the [linear algebra plan](../02-linear-algebra/_plan.md) and the probability/statistics teaching sequence. These are planned learning units, not newly authored lessons or registered labs.*

## 1. Target and current state

Build the ability to derive, implement, test, and analyze algorithms under unfamiliar constraints. Connect interview-scale reasoning to tokenization, retrieval, scheduling, and distributed data processing.

The [invariants, search, graphs, and DP overview](01-invariants-search-graphs-dp.md) remains an orientation page with its path preserved. New detailed units reserve 02–15; the overview is not evidence that all these algorithms have been taught.

**Scope:** 14 units; 364 estimated study hours including derivations, practice, and the capstone. These are planning estimates, not elapsed-time requirements or hiring guarantees. Diagnose existing knowledge and use the gates to skip material already mastered. Module numbers below are file-number reservations within this track; retained overview pages are outside the new sequence unless explicitly listed.

## 2. Teaching and authoring contract

Apply the [shared authoring contract and prerequisite key](../_plans.md). Each unit must develop its spine through definitions, a worked small example, derivations with assumptions, an interactive prediction and failure case, and an ML application. Close every numbered teaching section with Foundation / Core / Stretch practice and static hints. Include three small checkable implementations, a derivations list, a cumulative exercise set, and the six-part mastery checkpoint. Each module's RE and RS gates below are additional concrete evidence requirements.

Module handles such as `DS02` refer to this plan; `LA08` and `PS05` refer to the reference tracks. Dependencies list actual conceptual entry requirements, not a requirement to finish every earlier track. New content IDs use `dsa.<slug>`; preserve existing IDs and filenames where noted below. Proposed answer banks and lab IDs are namespaced, are not yet registered, and must be validated when implemented.

**Ownership boundary.** Own correctness invariants, complexity, and algorithmic data structures. Python owns language mechanics; NLP owns tokenizer semantics; Practical AI Systems owns retrieval quality; LLM Systems owns real distributed execution.

## 3. Module map

| Handle | Module | Hours | Prerequisites |
|---|---|---:|---|
| DS02 | Complexity, recurrences, and invariants | 22 | PY02, F03 |
| DS03 | Arrays, hashing, and streaming buffers | 24 | DS02 |
| DS04 | Sorting, binary search, and selection | 24 | DS03 |
| DS05 | Heaps, trees, tries, and caches | 24 | DS03 |
| DS06 | Graph traversal and dependency scheduling | 24 | DS03 |
| DS07 | Shortest paths and greedy proofs | 26 | DS05, DS06 |
| DS08 | Dynamic programming and state design | 28 | DS04, DS06 |
| DS09 | String matching and token algorithms | 26 | DS05, DS08 |
| DS10 | Backtracking, branch-and-bound, and search | 24 | DS05, DS08 |
| DS11 | Randomized and streaming algorithms | 28 | DS04, PS05 |
| DS12 | External-memory and parallel algorithms | 26 | DS06, DS11, PY08 |
| DS13 | Nearest-neighbor search and retrieval indexes | 28 | DS05, DS11, LA08 |
| DS14 | Algorithm transfer and technical defense | 24 | DS07, DS09, DS10, DS12 |
| DS15 | Capstone: a measured index or scheduler | 36 | DS13, DS14 |

## 4. Detailed module briefs

### Part I · Invariants and cost

*Thesis: choose a representation only after stating what must remain true.*

**Module 02 — Complexity, recurrences, and invariants**

`handle: DS02` · `id: dsa.complexity-invariants` · 22h · prerequisites: PY02, F03 · proposed bank: `ds-02-complexity-invariants`

**Spine and derivations:** Worst-case versus expected and amortized cost; loop invariants, recurrence trees, potential functions, and output-sensitive bounds.

**Interactive experiment:** `ds-complexity-invariants` — Change input size and adversarial ordering; compare operation counts with wall-time curves and hidden constants.

**Implementation ladder:** Implement operation_counter, recurrence_table, and an invariant-checked insertion routine.

**RE gate:** Explain correctness and complexity before coding an unfamiliar variant.

**RS gate:** Prove an amortized bound and state which input model an expected bound needs.

**Module 03 — Arrays, hashing, and streaming buffers**

`handle: DS03` · `id: dsa.arrays-hashing` · 24h · prerequisites: DS02 · proposed bank: `ds-03-arrays-hashing`

**Spine and derivations:** Dynamic arrays, hash collisions, equality/hash consistency, stacks, queues, two pointers, prefix sums, and sliding-window invariants.

**Interactive experiment:** `ds-arrays-hashing` — Vary hash collisions and window boundaries; show resize spikes and duplicate-key failures.

**Implementation ladder:** Implement a ring buffer, chained hash map, and longest-valid-window solver.

**RE gate:** Handle empty input, duplicates, wraparound, and resizing with explicit memory bounds.

**RS gate:** Construct adversarial inputs and distinguish average from worst-case lookup guarantees.

**Module 04 — Sorting, binary search, and selection**

`handle: DS04` · `id: dsa.sorting-search-selection` · 24h · prerequisites: DS03 · proposed bank: `ds-04-sorting-search-selection`

**Spine and derivations:** Stable sorting, merge and partition invariants, binary search on monotone predicates, quickselect, and comparison lower bounds.

**Interactive experiment:** `ds-sorting-search-selection` — Drag pivot position and duplicate frequency; show unstable ties and off-by-one search intervals.

**Implementation ladder:** Implement stable_merge, lower_bound, and randomized_select.

**RE gate:** Solve a boundary-search variant and defend termination on all-equal input.

**RS gate:** Derive the comparison lower bound and qualify randomized selection's expected guarantee.

**Module 05 — Heaps, trees, tries, and caches**

`handle: DS05` · `id: dsa.heaps-trees-tries` · 24h · prerequisites: DS03 · proposed bank: `ds-05-heaps-trees-tries`

**Spine and derivations:** Heap ordering, balanced-tree guarantees in outline, prefix tries, lazy invalidation, and linked hash structures for LRU.

**Interactive experiment:** `ds-heaps-trees-tries` — Change access sequences and heap priorities; reveal stale entries and pathological trie memory.

**Implementation ladder:** Implement binary_heap, prefix_trie, and lru_cache.

**RE gate:** Maintain correctness under duplicate updates and capacity-zero caching.

**RS gate:** Compare representation choices using workload assumptions and a counterexample to a naive cache policy.

### Part II · Combinatorial structure

*Thesis: graphs, state spaces, and decompositions turn problems into algorithms.*

**Module 06 — Graph traversal and dependency scheduling**

`handle: DS06` · `id: dsa.graph-traversal-dependencies` · 24h · prerequisites: DS03 · proposed bank: `ds-06-graph-traversal-dependencies`

**Spine and derivations:** Adjacency representations, BFS/DFS invariants, connected components, topological sorting, cycle witnesses, and strongly connected components.

**Interactive experiment:** `ds-graph-traversal-dependencies` — Edit a dependency graph; animate frontiers, back edges, and a cycle that blocks scheduling.

**Implementation ladder:** Implement bfs_distances, topological_order with cycle reporting, and strongly_connected_components.

**RE gate:** Produce a minimal useful cycle witness in a broken experiment graph.

**RS gate:** Prove traversal complexity in sparse versus dense representations.

**Module 07 — Shortest paths and greedy proofs**

`handle: DS07` · `id: dsa.shortest-paths-greedy` · 26h · prerequisites: DS05, DS06 · proposed bank: `ds-07-shortest-paths-greedy`

**Spine and derivations:** Dijkstra, Bellman–Ford, union-find, minimum spanning trees, cut/exchange arguments, and negative-cycle semantics.

**Interactive experiment:** `ds-shortest-paths-greedy` — Change an edge through zero; show where Dijkstra fails while Bellman–Ford detects the issue.

**Implementation ladder:** Implement dijkstra, bellman_ford, and kruskal with disjoint sets.

**RE gate:** Choose a valid algorithm from constraints and detect unreachable or negative-cycle cases.

**RS gate:** Prove a cut or exchange property and construct a case where a tempting greedy rule fails.

**Module 08 — Dynamic programming and state design**

`handle: DS08` · `id: dsa.dynamic-programming` · 28h · prerequisites: DS04, DS06 · proposed bank: `ds-08-dynamic-programming`

**Spine and derivations:** Optimal substructure, state sufficiency, recurrence derivation, DAG evaluation, backpointers, and memory compression.

**Interactive experiment:** `ds-dynamic-programming` — Change allowed state variables in edit distance or knapsack; show state aliasing and incorrect update order.

**Implementation ladder:** Implement edit_distance with reconstruction, knapsack, and sequence_alignment.

**RE gate:** Derive and implement an unseen recurrence with a valid base case.

**RS gate:** Prove state sufficiency and show what information a proposed compressed state discards.

**Module 09 — String matching and token algorithms**

`handle: DS09` · `id: dsa.strings-token-algorithms` · 26h · prerequisites: DS05, DS08 · proposed bank: `ds-09-strings-token-algorithms`

**Spine and derivations:** Prefix functions, linear pattern matching, trie segmentation, rolling-hash collisions, and incremental pair-count updates for BPE.

**Interactive experiment:** `ds-strings-token-algorithms` — Edit a repeated string; trace failure links and stale pair counts after a merge.

**Implementation ladder:** Implement prefix_function, kmp_search, and incremental_pair_counts.

**RE gate:** Match a slow tokenizer-merging oracle on adversarial repeated and overlapping pairs.

**RS gate:** Derive a complexity bound and explain why a hash match needs a collision policy.

**Module 10 — Backtracking, branch-and-bound, and search**

`handle: DS10` · `id: dsa.search-backtracking` · 24h · prerequisites: DS05, DS08 · proposed bank: `ds-10-search-backtracking`

**Spine and derivations:** Search trees, admissible heuristics, A*, pruning invariants, memoization, and exponential worst cases.

**Interactive experiment:** `ds-search-backtracking` — Alter heuristic inflation and beam width; show lost optimality and misleading early success.

**Implementation ladder:** Implement a_star, bounded_backtracking, and beam_search with deterministic tie breaking.

**RE gate:** Return a valid solution or explicit resource-limit status without claiming unproved optimality.

**RS gate:** Prove an admissibility condition and distinguish beam search from exact search.

### Part III · Scale and transfer

*Thesis: approximation and resource constraints change what correctness must mean.*

**Module 11 — Randomized and streaming algorithms**

`handle: DS11` · `id: dsa.randomized-streaming` · 28h · prerequisites: DS04, PS05 · proposed bank: `ds-11-randomized-streaming`

**Spine and derivations:** Reservoir sampling, Bloom filters, count-min sketches, heavy hitters, and error budgets; separate false positives from biased estimates.

**Interactive experiment:** `ds-randomized-streaming` — Change sketch width and stream skew; display collision error and an adversarial repeated-key preset.

**Implementation ladder:** Implement reservoir_sample, bloom_filter, and count_min_sketch.

**RE gate:** Match stated memory limits and document reproducibility and hash assumptions.

**RS gate:** Derive reservoir inclusion probability and a sketch error statement with its failure probability.

**Module 12 — External-memory and parallel algorithms**

`handle: DS12` · `id: dsa.external-memory-parallel` · 26h · prerequisites: DS06, DS11, PY08 · proposed bank: `ds-12-external-memory-parallel`

**Spine and derivations:** External sorting, partitioning, map/reduce algebra, associative summaries, communication cost, and data skew.

**Interactive experiment:** `ds-external-memory-parallel` — Change partition sizes and key skew; compare bytes moved and worker imbalance, including one hot key.

**Implementation ladder:** Implement external_merge_simulation, partition_balance, and mergeable_summary.

**RE gate:** Design a bounded-memory algorithm and account for communication as well as operations.

**RS gate:** Show when reassociation changes floating-point results despite mathematical associativity.

**Module 13 — Nearest-neighbor search and retrieval indexes**

`handle: DS13` · `id: dsa.retrieval-indexes` · 28h · prerequisites: DS05, DS11, LA08 · proposed bank: `ds-13-retrieval-indexes`

**Spine and derivations:** Exact top-k, spatial partitioning, locality-sensitive hashing, graph search intuition, approximate recall, and index memory.

**Interactive experiment:** `ds-retrieval-indexes` — Vary dimension and search budget; plot recall against work with exact search as oracle and a tied-distance case.

**Implementation ladder:** Implement exact_topk, random_hyperplane_hash, and budgeted_graph_search.

**RE gate:** Produce recall/latency/memory curves without changing the query set between methods.

**RS gate:** Explain how the data distribution defeats a claimed sublinear search behavior.

**Module 14 — Algorithm transfer and technical defense**

`handle: DS14` · `id: dsa.algorithm-transfer` · 24h · prerequisites: DS07, DS09, DS10, DS12 · proposed bank: `ds-14-algorithm-transfer`

**Spine and derivations:** Translate an unfamiliar requirement into invariants, cost model, and constraints; compare at least two designs before implementing.

**Interactive experiment:** `ds-algorithm-transfer` — Reveal requirements incrementally in a scheduler or token-cache problem; track broken assumptions.

**Implementation ladder:** Implement a reference solution, optimized solution, and differential fuzz harness for an unseen task.

**RE gate:** Defend correctness, resource usage, and failure behavior under follow-up changes.

**RS gate:** Find the minimal counterexample to an attractive incorrect optimization.

**Module 15 — Capstone: a measured index or scheduler**

`handle: DS15` · `id: dsa.capstone-index-or-scheduler` · 36h · prerequisites: DS13, DS14 · proposed bank: `ds-15-capstone-index-or-scheduler`

**Spine and derivations:** No new theory: exact oracle, optimized representation, bounded resources, randomized guarantees where used, and adversarial validation.

**Interactive experiment:** `ds-capstone-index-or-scheduler` — Replay real and adversarial traces; show worst-case latency and quality loss beside averages.

**Implementation ladder:** Deliver the algorithm library, fuzz corpus, and scaling report.

**RE gate:** Meet a declared memory and latency target while preserving the required correctness contract.

**RS gate:** Defend the guarantee and distinguish empirical speedup from asymptotic improvement.

## 5. Write order and milestones

Write DS02–DS05, then the graph/greedy branch DS06–DS07 and DP/string branch DS08–DS09. DS10 needs both state design and heaps. PS05 unlocks DS11; DS12–DS13 provide scale-oriented electives. DS14 is the cumulative gate and DS15 is the capstone. RE learners emphasize implementation under constraints; RS learners must also prove the guarantees used by their research specialization.

A unit is ready for the next author only when its prerequisites have an authored route or a named external reading with an entry diagnostic. An overview that mentions an algorithm is not a substitute for teaching it. Preserve existing inbound IDs; add missing metadata only when the corresponding lesson is expanded. Do not register placeholder lessons or raise authored-coverage counts from this plan.

## 6. Capstone and assessment

Choose either a searchable text index with an exact recall oracle or a bounded-resource experiment scheduler. Report operation counts, memory, end-to-end latency, adversarial cases, and the point where the optimization stops helping. Include unseen requirement changes in the defense.

The checkpoint has six tasks: explain a concept without notation; derive a central result and its assumptions; compute a small case by hand; implement or repair a component; diagnose a misleading experiment; defend an unfamiliar extension. Passing requires a correct derivation, implementation evidence, and a defensible limitations statement, with no critical conceptual error. Record which failed tasks need repair; do not substitute aggregate quiz points for these gates.

## 7. Infrastructure and validation

Build reusable graph/frontier animation, array/heap state traces, and operation-count charts. CPU-only implementations are sufficient; external-memory and parallel browser labs are labeled simulations.

Browser Python remains standard-library-only. Use deterministic small fixtures there; label NumPy/PyTorch, accelerator, and multi-device work as local extensions. A CPU simulation teaches an algorithm or protocol, not accelerator performance. Each local benchmark records versions, hardware, shapes, warmup, synchronization, seeds, raw timings, and a correctness oracle. Build shared visual primitives only when the first authored unit needs them.

For lesson implementation, follow the shared validation commands in [the plan index](../_plans.md). Check invalid inputs, degenerate cases, input preservation, and the failure preset. Inspect the reader in both themes and work one exercise end to end. For this planning change, verify local links, reserved IDs, prerequisite resolution, and exclusion of `_plan.md` from the lesson catalog.
