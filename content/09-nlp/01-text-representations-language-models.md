# NLP: text representations and language modeling

**Prerequisites:** Python, probability, classical ML. **Outcome:** build a text baseline and understand what a language-model likelihood measures.

## Text is not yet a tensor

A text pipeline maps bytes to Unicode, normalized text, tokens, token IDs, and batches. Each transformation is a modeling decision. Lowercasing may help topic classification but remove useful named-entity information. A tokenizer trained on all data can leak evaluation statistics.

Stemming applies heuristic reductions; lemmatization aims for dictionary forms using linguistic information. Neither is universally required before neural language modeling. Preserving raw text may be essential for code, morphology, and generation.

A vocabulary needs an explicit unknown-token policy. Character/byte models cover inputs differently from word or subword models. Tokenization determines sequence length, vocabulary size, and what a "next token" means.

## Bag of words and TF–IDF

For document $d$, a term-frequency vector counts occurrences. One common smoothed inverse document frequency is

$$
\operatorname{idf}(t)=\log\frac{N+1}{\operatorname{df}(t)+1}+1.
$$

Multiply term frequency by IDF and optionally normalize the vector. State the convention: libraries differ in count scaling, smoothing, and normalization.

Bag-of-words discards order: "dog bites person" and "person bites dog" can have identical vectors. It can still be a strong inexpensive baseline for topic or intent tasks. Fit vocabulary and IDF on training documents only.

## Naive Bayes

For class $c$, Bayes' rule gives a score proportional to $P(c)P(x\mid c)$. A multinomial model approximates log likelihood using token counts:

$$
\log P(c\mid x)=\text{constant}+\log P(c)+\sum_t x_t\log P(t\mid c).
$$

Add-$\alpha$ smoothing estimates

$$
P(t\mid c)=\frac{N_{tc}+\alpha}{\sum_vN_{vc}+\alpha |V|}.
$$

The conditional independence approximation is strong and usually false for natural language. Its practical value lies in providing a simple benchmark, not in linguistic realism.

## Sequence probabilities

The chain rule is exact:

$$
P(w_1,\ldots,w_T)=\prod_{t=1}^T P(w_t\mid w_{<t}).
$$

An n-gram model approximates the context with the last $n-1$ tokens. A neural autoregressive model uses a learned context representation. Teacher forcing trains predictions using the true earlier tokens; generation conditions on its own sampled tokens.

Average negative log likelihood $\mathcal L$ corresponds to perplexity $\exp(\mathcal L)$ when natural logarithms are used. Perplexity comparisons require compatible data, tokenization, and loss masking. Different token units can change perplexity without reflecting better text understanding.

> **Predict:** For a uniform next-token distribution over four symbols, what is perplexity?

## Embeddings and context

An embedding table $E\in\mathbb R^{V\times d}$ maps token IDs to rows. A static embedding assigns the same row to every occurrence of a token. Contextual representations change with surrounding text.

An embedding lookup's gradient adds contributions into the accessed rows. Repeated IDs accumulate updates. Integer IDs themselves are not continuous differentiable inputs.

For sequence batches, distinguish padding positions, attention masks, and labels ignored by loss. A model can attend correctly while the loss is still incorrectly averaged over padding.

## Lab and problems

1. Implement vocabulary fitting, counts, IDF, and multinomial naive Bayes.
2. Train a smoothed bigram model on the training split.
3. Implement bigram_nll in [exercises.py](../../labs/exercises.py).
4. Explain why an unseen transition is not equivalent to an impossible transition.
5. Compare shuffled-word and original documents for bag-of-words and sequence models.
6. Detect a label-shift error in next-token targets.

<details><summary>Solutions</summary>

Uniform four-way predictions have loss $\log4$ and perplexity 4. Smoothing assigns nonzero mass to unseen transitions. Next-token inputs and targets are offset by exactly one token; predicting each token from itself creates leakage. A bag-of-words representation is invariant to reordering, while a sequence model generally is not.

</details>

**Mastery:** build a baseline, audit tokenization/splitting, and calculate likelihood by hand. Later units: BPE, WordPiece, linguistic structure, HMMs, CRFs, tagging, parsing, seq2seq, attention, retrieval, and NLP evaluation.
