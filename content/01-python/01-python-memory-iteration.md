# Python: objects, iteration, and reliable programs

**Prerequisites:** arithmetic. **Outcome:** reason about state and build a streaming numerical pipeline. Start with a Python interpreter and one file; run it using python filename.py.

## Names, objects, and mutation

Assignment binds a name to an object. It does not recursively copy the object. Compare mutation with rebinding:

~~~python
x = [1, 2]
y = x
x.append(3)
assert y == [1, 2, 3]
x = [4]
assert y == [1, 2, 3]
~~~

The caller and a function can reference the same mutable argument. Mutating that argument is visible to both; assigning a different object to the function's local name does not rebind the caller's name. Equality compares values; identity tests whether two names refer to the same object.

> **Predict:** Run rows = [[0]*3]*2 followed by rows[0][1] = 7. Explain the result using references.

~~~mermaid
flowchart TD
  R["rows"] --> A["outer list"]
  A -->|"index 0"| B["same inner list"]
  A -->|"index 1"| B
  B --> C["0, 7, 0"]
~~~

A list comprehension creates independent inner lists. A shallow copy duplicates only the outer container. Tuples are immutable containers, but a tuple can contain a mutable list.

Default arguments are evaluated when a function is defined. Use None followed by explicit initialization for an optional accumulating list; a mutable default can retain earlier callers' values.

## Containers and contracts

Lists offer ordered indexing. Dictionaries associate hashable keys with values; sets represent membership. Hashability requires behavior consistent with equality and stable hashes during lookup. A tuple is hashable only when its elements are hashable.

A contract should specify accepted inputs, whether mutation occurs, behavior for missing values, and failure cases. Type annotations support tooling; they do not automatically validate runtime values. Distinguish None from zero. A general truthiness test rejects both.

Keep calculation separate from file access and printing. Return results and let the caller decide how to report them. Use context managers for resources and catch expected exceptions where recovery is possible. Silently ignoring malformed records produces misleading model metrics.

Container examples: [official Python tutorial](https://docs.python.org/3/tutorial/datastructures.html).

## Iteration and streaming

An iterable produces an iterator. An iterator yields values until StopIteration. A generator suspends at yield and retains local state.

~~~python
def batches(items, size):
    if size <= 0:
        raise ValueError("size must be positive")
    batch = []
    for item in items:
        batch.append(item)
        if len(batch) == size:
            yield batch
            batch = []
    if batch:
        yield batch
~~~

The generator needs $O(B)$ auxiliary memory, but the whole pipeline can still retain $O(N)$ data if its input is a list or its consumer collects every batch. A consumed iterator is not automatically replayable.

> **Predict:** Why would clearing batch in place after yielding corrupt a consumer's stored batches?

## Stable streaming moments

For measurements with large offset and small spread, subtracting $E[X]^2$ from $E[X^2]$ loses precision. Maintain count $n$, mean $\mu$, and centered sum of squares $M_2$:

$$
\delta=x_n-\mu_{n-1},\quad
\mu_n=\mu_{n-1}+\delta/n,\quad
M_{2,n}=M_{2,n-1}+\delta(x_n-\mu_n).
$$

Start at zero. The sample variance is $M_2/(n-1)$ for $n>1$. To derive the recurrence, expand the old centered deviations around the new mean and use their zero sum. This computes both statistics in one pass with constant memory.

## Lab and problems

Implement streaming_moments in [exercises.py](../../labs/exercises.py). Accept a finite-valued iterator, require at least two observations, and return count, mean, sample variance.

1. Explain mutation versus rebinding without running the first example.
2. Derive $\mu_n=\mu_{n-1}+(x_n-\mu_{n-1})/n$.
3. Test constant input, an iterator, and values near $10^9$ differing by one.
4. Design a test that detects shared mutable batch output.
5. Extend the lab to a JSON-lines reader with line-numbered parsing errors and training-only normalization statistics.

<details><summary>Hints and solution sketches</summary>

The mean identity follows from $n\mu_n=(n-1)\mu_{n-1}+x_n$. With constant data, every new deviation is zero. Retain two batches and mutate one to detect aliasing. Store the training mean and scale for inference; never refit them on validation records.

</details>

**Mastery:** explain an unfamiliar aliasing bug and account for memory across a streaming pipeline. Later units: packaging, protocols, generators in depth, concurrency, profiling, and testing design.
