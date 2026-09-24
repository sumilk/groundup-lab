# Natural language processing and language data — build plan

*An authoring brief, following the [linear algebra plan](../02-linear-algebra/_plan.md) and the probability/statistics teaching sequence. These are planned learning units, not newly authored lessons or registered labs.*

## 1. Target and current state

Understand text as structured, multilingual data before treating it as token IDs. Build classical and neural language baselines, then audit tokenization, data quality, retrieval, and evaluation under realistic shifts.

The [text representations and language models overview](01-text-representations-language-models.md) stays as orientation. Detailed units reserve 02–15. Tokenizer algorithms reuse DSA; transformer architecture and scaled execution belong to their own tracks.

**Legacy-page review:** Keep the overview: Unicode/token units, TF–IDF, multinomial naive Bayes and perplexity conventions are not replaced by a generic probability lesson. It owns `bigram`; preserve its fixtures and migrate them into NLP02/NLP03/NLP04/NLP06/NLP07 before retirement. See the [cross-track audit](../_legacy-audit.md) for the removal criteria and current coverage.

**Scope:** 14 units; 414 estimated study hours including derivations, practice, and the capstone. These are planning estimates, not elapsed-time requirements or hiring guarantees. Diagnose existing knowledge and use the gates to skip material already mastered. Module numbers below are file-number reservations within this track; retained overview pages are outside the new sequence unless explicitly listed.

## 2. Teaching and authoring contract

Apply the [shared authoring contract and prerequisite key](../_plans.md). Each unit must develop its spine through definitions, a worked small example, derivations with assumptions, an interactive prediction and failure case, and an ML application. Close every numbered teaching section with Foundation / Core / Stretch practice and static hints. Include three small checkable implementations, a derivations list, a cumulative exercise set, and the six-part mastery checkpoint. Each module's RE and RS gates below are additional concrete evidence requirements.

Module handles such as `NLP02` refer to this plan; `LA08` and `PS05` refer to the reference tracks. Dependencies list actual conceptual entry requirements, not a requirement to finish every earlier track. New content IDs use `nlp.<slug>`; preserve existing IDs and filenames where noted below. Proposed answer banks and lab IDs are namespaced, are not yet registered, and must be validated when implemented.

**Ownership boundary.** Own linguistic/text representations, tokenization semantics, corpus construction, sequence tasks, and language evaluation. Deep Learning owns neural blocks; LLM Systems owns decoder training and deployment; Practical AI Systems owns end-to-end retrieval/tool workflows; probability owns evaluation inference.

## 3. Module map

| Handle | Module | Hours | Prerequisites |
|---|---|---:|---|
| NLP02 | Unicode, normalization, and linguistic units | 24 | PY04 |
| NLP03 | Bag-of-words, TF–IDF, and lexical baselines | 24 | NLP02, ML05 |
| NLP04 | N-gram language models and smoothing | 28 | NLP03, PS02, IL02 |
| NLP05 | HMMs, CRFs, and structured decoding | 30 | NLP04, DS08, PS17 |
| NLP06 | Distributional semantics and embeddings | 28 | NLP03, LA08, IL04 |
| NLP07 | Byte-level BPE and tokenizer design | 32 | NLP02, DS09 |
| NLP08 | Neural sequence tasks and structured outputs | 28 | NLP05, DL07, PT09 |
| NLP09 | Lexical retrieval, dense retrieval, and reranking | 30 | NLP06, DS13, DL09 |
| NLP10 | Corpus curation, deduplication, and provenance | 32 | NLP07, PY12, PS10 |
| NLP11 | Multilingual and domain transfer | 28 | NLP08, NLP10, ML13 |
| NLP12 | Generation metrics and human/model judgments | 30 | NLP08, PS10, PS13 |
| NLP13 | Language decoding and search objectives | 28 | NLP04, NLP08, DS10, PS15 |
| NLP14 | Language benchmark and contamination audits | 30 | NLP10, NLP11, NLP12, NLP13 |
| NLP15 | Capstone: a language-data or representation study | 42 | NLP14, NLP09, RP04 |

## 4. Detailed module briefs

### Part I · Text and classical models

*Thesis: language data has structure and normalization choices that can change the task.*

**Module 02 — Unicode, normalization, and linguistic units**

`handle: NLP02` · `id: nlp.unicode-normalization` · 24h · prerequisites: PY04 · proposed bank: `nlp-02-unicode-normalization`

**Spine and derivations:** Bytes, code points, graphemes, normalization forms, scripts, whitespace, case, and segmentation; distinguish reversible encoding from destructive normalization.

**Interactive experiment:** `nlp-unicode-normalization` — Edit combining marks, mixed scripts, and right-to-left text; show visually equal strings with different bytes and normalization collisions.

**Implementation ladder:** Implement utf8_roundtrip, normalization_audit, and span_offset_map.

**RE gate:** Preserve byte/text alignment and document every destructive transform.

**RS gate:** Explain which normalization is justified by the task and show a language where a naive rule changes meaning.

**Module 03 — Bag-of-words, TF–IDF, and lexical baselines**

`handle: NLP03` · `id: nlp.bow-naive-bayes` · 24h · prerequisites: NLP02, ML05 · proposed bank: `nlp-03-bow-naive-bayes`

**Spine and derivations:** Document/term frequency, sparse vectors, smoothing, multinomial Naive Bayes, cosine retrieval, and train-only vocabulary fitting.

**Interactive experiment:** `nlp-bow-naive-bayes` — Change document length and rare terms; show test-vocabulary leakage and duplicated-document domination.

**Implementation ladder:** Implement tfidf_fit_transform, multinomial_nb, and sparse_cosine_search.

**RE gate:** Build a strong lexical baseline with correctly scoped fitted statistics.

**RS gate:** Explain which conditional-independence assumptions matter for likelihood versus classification.

**Module 04 — N-gram language models and smoothing**

`handle: NLP04` · `id: nlp.ngram-smoothing` · 28h · prerequisites: NLP03, PS02, IL02 · proposed bank: `nlp-04-ngram-smoothing`

**Spine and derivations:** Sequence factorization, Markov assumptions, count models, add-k/interpolation/backoff, discounting intuition, perplexity, and boundary tokens.

**Interactive experiment:** `nlp-ngram-smoothing` — Change context length and unseen events; compare training perplexity with held-out loss and normalization errors.

**Implementation ladder:** Implement ngram_counts, interpolated_probability, and sequence_log_likelihood.

**RE gate:** Check every conditional distribution sums to one, including unseen histories.

**RS gate:** Explain why perplexity is comparable only under compatible tokenization and scoring conventions.

**Module 05 — HMMs, CRFs, and structured decoding**

`handle: NLP05` · `id: nlp.sequence-labeling` · 30h · prerequisites: NLP04, DS08, PS17 · proposed bank: `nlp-05-sequence-labeling`

**Spine and derivations:** Latent-state factorization, forward/backward, Viterbi, log-space computation, conditional sequence normalization, and label bias.

**Interactive experiment:** `nlp-sequence-labeling` — Change transition/emission scores; show best-path versus marginal predictions and underflow in probability space.

**Implementation ladder:** Implement log_forward, viterbi_decode, and linear_chain_partition.

**RE gate:** Match dynamic programs to exhaustive enumeration on tiny sequences.

**RS gate:** Derive the partition recurrence and distinguish marginal likelihood from maximum-path probability.

### Part II · Learned representations

*Thesis: a representation should be evaluated against explicit linguistic and task properties.*

**Module 06 — Distributional semantics and embeddings**

`handle: NLP06` · `id: nlp.distributional-embeddings` · 28h · prerequisites: NLP03, LA08, IL04 · proposed bank: `nlp-06-distributional-embeddings`

**Spine and derivations:** Co-occurrence matrices, PMI, low-rank embeddings, word2vec/negative sampling, subword features, and frequency confounds.

**Interactive experiment:** `nlp-distributional-embeddings` — Change frequency and context window; show apparent semantic clusters driven by nuisance statistics.

**Implementation ladder:** Implement ppmi_matrix, negative_sampling_loss, and similarity_audit.

**RE gate:** Reproduce a small embedding objective and control for frequency in evaluation.

**RS gate:** Explain the negative-sampling distribution's effect and why similarity does not establish semantic equivalence.

**Module 07 — Byte-level BPE and tokenizer design**

`handle: NLP07` · `id: nlp.tokenization-bpe` · 32h · prerequisites: NLP02, DS09 · proposed bank: `nlp-07-tokenization-bpe`

**Spine and derivations:** Reversible byte vocabulary, pair counts and merge order, boundary/special-token rules, encode/decode parity, vocabulary tradeoffs, and unigram alternatives.

**Interactive experiment:** `nlp-tokenization-bpe` — Change merges and special-token parsing; show collisions, non-round-trips, and disproportionate length across languages.

**Implementation ladder:** Implement bpe_train_reference, bpe_encode_decode, and tokenizer_invariant_suite.

**RE gate:** Match slow and optimized encoders and round-trip arbitrary valid text plus explicit byte cases.

**RS gate:** Compare tokenizers at consistent bytes, model compute, and data budgets rather than raw tokens alone.

**Module 08 — Neural sequence tasks and structured outputs**

`handle: NLP08` · `id: nlp.neural-sequence-tasks` · 28h · prerequisites: NLP05, DL07, PT09 · proposed bank: `nlp-08-neural-sequence-tasks`

**Spine and derivations:** Sequence labeling, encoder/decoder conditioning, teacher forcing, padding, alignment, constrained outputs, and exposure mismatch.

**Interactive experiment:** `nlp-neural-sequence-tasks` — Toggle target shifting and encoder masks; show label leakage and invalid structured predictions.

**Implementation ladder:** Implement sequence_collator, masked_task_loss, and constrained_decode.

**RE gate:** Pass causality/alignment checks and overfit a tiny task.

**RS gate:** Explain how the training objective differs from sequence-level evaluation and propose a controlled test.

**Module 09 — Lexical retrieval, dense retrieval, and reranking**

`handle: NLP09` · `id: nlp.retrieval-reranking` · 30h · prerequisites: NLP06, DS13, DL09 · proposed bank: `nlp-09-retrieval-reranking`

**Spine and derivations:** BM25 components, dual encoders, hard negatives, cross-encoders, retrieval loss, relevance judgments, and recall/ranking tradeoffs.

**Interactive experiment:** `nlp-retrieval-reranking` — Change corpus size and negative sampling; show false negatives and high aggregate recall with poor subgroup coverage.

**Implementation ladder:** Implement bm25, contrastive_retriever_loss, and ranking_metrics.

**RE gate:** Use an exact retrieval baseline and separate index, retriever, and reranker errors.

**RS gate:** Defend relevance labels and show how pooled judgments can bias comparisons.

### Part III · Data and measurement

*Thesis: corpus and evaluation design frequently dominate an apparent modeling gain.*

**Module 10 — Corpus curation, deduplication, and provenance**

`handle: NLP10` · `id: nlp.corpus-pipelines` · 32h · prerequisites: NLP07, PY12, PS10 · proposed bank: `nlp-10-corpus-pipelines`

**Spine and derivations:** Source sampling, document boundaries, exact/near deduplication, quality filters, language identification errors, provenance, and split contamination.

**Interactive experiment:** `nlp-corpus-pipelines` — Change dedup threshold and filter score; reveal minority-language loss and train/eval overlap.

**Implementation ladder:** Implement document_manifest, near_duplicate_candidates, and split_overlap_audit.

**RE gate:** Build a replayable corpus pipeline with auditable counts at each transformation.

**RS gate:** Quantify selection effects of filtering and distinguish quality improvement from distribution change.

**Module 11 — Multilingual and domain transfer**

`handle: NLP11` · `id: nlp.multilingual-domain` · 28h · prerequisites: NLP08, NLP10, ML13 · proposed bank: `nlp-11-multilingual-domain`

**Spine and derivations:** Language imbalance, code switching, morphology, dialect/domain variation, tokenizer fertility, and transfer evaluation.

**Interactive experiment:** `nlp-multilingual-domain` — Change language mixture and segmentation; show averages improving while a low-resource group regresses.

**Implementation ladder:** Implement language_slice_report, fertility_metrics, and domain_shift_fixture.

**RE gate:** Preserve non-English cases in tests and report per-language quality and cost.

**RS gate:** Separate data volume, tokenization efficiency, and model transfer as competing explanations.

**Module 12 — Generation metrics and human/model judgments**

`handle: NLP12` · `id: nlp.generation-metrics-judges` · 30h · prerequisites: NLP08, PS10, PS13 · proposed bank: `nlp-12-generation-metrics-judges`

**Spine and derivations:** Exact match, overlap metrics, semantic metrics, pairwise preferences, rubric design, judge disagreement, position/length bias, and unit of analysis.

**Interactive experiment:** `nlp-generation-metrics-judges` — Swap answer order and verbosity; reveal judge preference shifts without a quality change.

**Implementation ladder:** Implement paired_eval_records, order_bias_check, and rubric_agreement_report.

**RE gate:** Build a replayable scorer and audit parsing failures separately from model failures.

**RS gate:** Validate judgments against a blinded human sample and account for clustered prompts or raters.

**Module 13 — Language decoding and search objectives**

`handle: NLP13` · `id: nlp.decoding-search` · 28h · prerequisites: NLP04, NLP08, DS10, PS15 · proposed bank: `nlp-13-decoding-search`

**Spine and derivations:** Greedy, beam, temperature, top-k/top-p, length normalization, constraints, and distribution shifts induced by sampling.

**Interactive experiment:** `nlp-decoding-search` — Change temperature and beam length penalty; show low-probability truncation and repetitive high-likelihood outputs.

**Implementation ladder:** Implement nucleus_distribution, beam_decode, and constrained_sampling.

**RE gate:** Verify sampled support and deterministic decoding edge cases.

**RS gate:** Distinguish model distribution, decoding policy, and task utility in a claimed improvement.

**Module 14 — Language benchmark and contamination audits**

`handle: NLP14` · `id: nlp.language-evaluation-audit` · 30h · prerequisites: NLP10, NLP11, NLP12, NLP13 · proposed bank: `nlp-14-language-evaluation-audit`

**Spine and derivations:** Benchmark construction, overlap detection limits, temporal/domain splits, annotation ambiguity, prompt sensitivity, and negative controls.

**Interactive experiment:** `nlp-language-evaluation-audit` — Inject exact and paraphrased contamination; show detection recall and false positives separately.

**Implementation ladder:** Implement overlap_audit, prompt_sensitivity_suite, and benchmark_card.

**RE gate:** Produce versioned examples, scorer, exclusions, and full failure counts.

**RS gate:** Explain why absence of detected overlap does not prove absence of contamination.

**Module 15 — Capstone: a language-data or representation study**

`handle: NLP15` · `id: nlp.capstone-language-data-study` · 42h · prerequisites: NLP14, NLP09, RP04 · proposed bank: `nlp-15-capstone-language-data-study`

**Spine and derivations:** No new theory: a lexical baseline, a learned alternative, multilingual or domain slices, corpus provenance, and blinded evaluation.

**Interactive experiment:** `nlp-capstone-language-data-study` — Compare tokenization/data/model interventions at equal resources with per-slice uncertainty.

**Implementation ladder:** Deliver corpus manifest, baseline implementations, and an executable study report.

**RE gate:** Reproduce preprocessing, predictions, and all metrics from a clean checkout.

**RS gate:** Defend which intervention changed quality and what alternative explanations remain.

## 5. Write order and milestones

Write NLP02–NLP05 as the classical core. NLP06–NLP07 develop representation and tokenization; NLP07 is the gate into LLM Systems. NLP08–NLP09 add neural tasks and retrieval. NLP10 can begin as soon as the tokenizer and data-engineering prerequisites exist. Finish the multilingual/evaluation/decoding branches before NLP14–NLP15.

A unit is ready for the next author only when its prerequisites have an authored route or a named external reading with an entry diagnostic. An overview that mentions an algorithm is not a substitute for teaching it. Preserve existing inbound IDs; add missing metadata only when the corresponding lesson is expanded. Do not register placeholder lessons or raise authored-coverage counts from this plan.

## 6. Capstone and assessment

Choose a tokenizer, corpus-filtering, retrieval, or representation hypothesis. Compare against a strong lexical/classical baseline and a learned model, with a held-out domain or language. Release exact preprocessing, data counts, evaluation records, and a contamination audit with documented detection limits.

The checkpoint has six tasks: explain a concept without notation; derive a central result and its assumptions; compute a small case by hand; implement or repair a component; diagnose a misleading experiment; defend an unfamiliar extension. Passing requires a correct derivation, implementation evidence, and a defensible limitations statement, with no critical conceptual error. Record which failed tasks need repair; do not substitute aggregate quiz points for these gates.

## 7. Infrastructure and validation

Add Unicode/byte alignment, n-gram/backoff, sequence-trellis, BPE merge, and retrieval-ranking views. Browser labs use tiny dictionaries and sequences; neural encoders and corpus-scale processing run locally with bounded sample fixtures.

Browser Python remains standard-library-only. Use deterministic small fixtures there; label NumPy/PyTorch, accelerator, and multi-device work as local extensions. A CPU simulation teaches an algorithm or protocol, not accelerator performance. Each local benchmark records versions, hardware, shapes, warmup, synchronization, seeds, raw timings, and a correctness oracle. Build shared visual primitives only when the first authored unit needs them.

For lesson implementation, follow the shared validation commands in [the plan index](../_plans.md). Check invalid inputs, degenerate cases, input preservation, and the failure preset. Inspect the reader in both themes and work one exercise end to end. For this planning change, verify local links, reserved IDs, prerequisite resolution, and exclusion of `_plan.md` from the lesson catalog.
