# DSA: invariants, searching, graphs, and dynamic programming

**Prerequisites:** [Python](../01-python/01-python-memory-iteration.md). **Outcome:** derive, prove, and implement an algorithm.

## Complexity and representation

$T(n)\in O(g(n))$ means an eventual upper bound: some positive $c,n_0$ satisfy $T(n)\le c g(n)$ for $n\ge n_0$. It is not an equality or a wall-clock measurement. A matching lower bound gives $\Theta$.

State the input representation. Graph traversal with adjacency lists can cost $O(V+E)$ while scanning an adjacency matrix costs $O(V^2)$. Hash lookup is expected constant time under appropriate assumptions, not an unconditional worst-case guarantee.

Appending to a dynamically growing array is amortized constant time. With doubling capacity, the copied elements over $n$ insertions form a geometric sum $1+2+4+\cdots<2n$. A single insertion can still cost linear time.

## Binary search from an invariant

Return the first index in sorted array $a$ with $a_i\ge x$, or its length if none exists. Maintain a half-open interval $[lo,hi)$:

- all indices below lo contain values less than $x$;
- all indices at or above hi contain values at least $x$.

Initialize lo to zero and hi to the length. Choose their floored midpoint. If the middle value is below $x$, set lo to mid plus one; otherwise set hi to mid. Each update preserves the partition and strictly decreases interval length. At equality, the boundary is determined.

This proves correctness and $O(\log n)$ time with constant auxiliary storage. Empty arrays and duplicates require no special equality branch.

> **Predict:** Why can assigning lo to mid cause an infinite loop?

## Graphs

Breadth-first search discovers vertices in order of shortest unweighted distance. Use a queue, mark a vertex when enqueuing it, and record its predecessor at first discovery.

~~~mermaid
flowchart TD
  S["start: distance 0"] --> A["A: distance 1"]
  S --> B["B: distance 1"]
  A --> C["C: distance 2"]
  B --> C
  C --> G["goal: distance 3"]
~~~

Proof by induction: after processing all vertices at distance $d$, every reachable distance-$d+1$ vertex has been discovered through a predecessor. A shorter undiscovered route would require a predecessor already processed, a contradiction. Follow predecessors backward to reconstruct a shortest path.

DFS explores one branch before backtracking; the first path found need not be shortest. Dijkstra uses a priority queue for nonnegative weighted edges. Settling a distance permanently relies on nonnegative weights.

## Dynamic programming

With unlimited positive coin denominations $C$, let $D(s)$ be the minimum coin count for amount $s$:

$$
D(0)=0,\qquad D(s)=1+\min_{c\in C,\ c\le s}D(s-c).
$$

Use infinity for unreachable states. Consider the last coin: the remainder must be solved optimally, or replacing it improves the original solution. Increasing amount is a valid dependency order. Time is $O(S|C|)$ and memory $O(S)$.

This bound is pseudo-polynomial: numeric amount $S$ can be exponentially larger than its bit length. Greedy largest-first fails for coins $\{1,3,4\}$ and amount 6. Limited coin counts need a richer state.

## Why this matters for ML

Backpropagation is reverse traversal of a computation graph. Beam search maintains a bounded ranked frontier. Replay buffers combine insertion and random sampling. Efficient batching requires understanding both memory layout and algorithmic cost.

## Lab and problems

Implement lower_bound in [exercises.py](../../labs/exercises.py), then BFS path reconstruction and coin DP.

1. Prove initialization, preservation, and termination for lower-bound search.
2. Give a DFS example whose first path is not shortest.
3. Why is removing the first item from a Python list costly for BFS?
4. Give a negative-edge counterexample to Dijkstra's settled-distance invariant.
5. Extend coin DP to reconstruct a solution.

<details><summary>Hints and solution sketches</summary>

A length-one interval can have mid equal to lo, so lo = mid makes no progress. List front removal shifts remaining elements. Edges $s\to a=2$, $s\to b=5$, $b\to a=-4$ invalidate settling $a$ at 2. Store an argmin coin at every reachable DP state, then subtract it repeatedly.

</details>

**Mastery:** solve an unfamiliar boundary or DP problem, with invariants and complexity. Later units: heaps, trees, tries, union-find, sorting, backtracking, and edit distance.
