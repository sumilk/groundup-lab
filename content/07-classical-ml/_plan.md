# Classical machine learning — build plan

*An authoring brief, following the [linear algebra plan](../02-linear-algebra/_plan.md) and the probability/statistics teaching sequence. These are planned learning units, not newly authored lessons or registered labs.*

## 1. Target and current state

Use classical models as tractable research instruments: derive an objective, implement its solver, compare against strong baselines, and analyze failure under changed data. Strong performance is evidence only when preprocessing, selection, and uncertainty are correct.

The [regression, classification, and evaluation overview](01-regression-classification-evaluation.md) remains an orientation page. New detailed units reserve 02–16. Statistical derivations already authored in PS06, PS11, PS13, and PS17 are prerequisites or linked readings rather than duplicate lessons.

**Scope:** 15 units; 436 estimated study hours including derivations, practice, and the capstone. These are planning estimates, not elapsed-time requirements or hiring guarantees. Diagnose existing knowledge and use the gates to skip material already mastered. Module numbers below are file-number reservations within this track; retained overview pages are outside the new sequence unless explicitly listed.

## 2. Teaching and authoring contract

Apply the [shared authoring contract and prerequisite key](../_plans.md). Each unit must develop its spine through definitions, a worked small example, derivations with assumptions, an interactive prediction and failure case, and an ML application. Close every numbered teaching section with Foundation / Core / Stretch practice and static hints. Include three small checkable implementations, a derivations list, a cumulative exercise set, and the six-part mastery checkpoint. Each module's RE and RS gates below are additional concrete evidence requirements.

Module handles such as `ML02` refer to this plan; `LA08` and `PS05` refer to the reference tracks. Dependencies list actual conceptual entry requirements, not a requirement to finish every earlier track. New content IDs use `ml.<slug>`; preserve existing IDs and filenames where noted below. Proposed answer banks and lab IDs are namespaced, are not yet registered, and must be validated when implemented.

**Ownership boundary.** Own estimator behavior, model selection pipelines, and comparative empirical studies. LA owns least-squares geometry; probability owns likelihood, GLM inference, EM derivation, calibration guarantees, and causal identification; information/learning theory owns capacity bounds.

## 3. Module map

| Handle | Module | Hours | Prerequisites |
|---|---|---:|---|
| ML02 | Problem specification, splits, and preprocessing | 24 | PY07, PS06 |
| ML03 | Linear models, ridge, and lasso | 28 | ML02, LA10, OPT07 |
| ML04 | Logistic and multiclass models | 28 | ML03, PS11 |
| ML05 | Generative classifiers and probabilistic baselines | 24 | ML04, PS04 |
| ML06 | Kernels, margins, and support vector machines | 32 | ML03, OPT03, LA07 |
| ML07 | Trees, bagging, and gradient boosting | 30 | ML02, OPT01 |
| ML08 | Gaussian processes and Bayesian optimization | 32 | ML06, PS04, PS09 |
| ML09 | Clustering, mixtures, and latent structure | 28 | ML05, PS17 |
| ML10 | Dimensionality reduction and manifold assumptions | 28 | ML09, LA08, DS13 |
| ML11 | Density estimation and anomaly detection | 26 | ML09, PS18 |
| ML12 | Model selection and hyperparameter search | 28 | ML07, PS08, PS10 |
| ML13 | Calibration, shift, and subgroup evaluation | 30 | ML12, PS13, IL10 |
| ML14 | Prediction, causal features, and shortcut tests | 28 | ML13, PS16 |
| ML15 | Classical baselines in modern research | 26 | ML08, ML14, RP04 |
| ML16 | Capstone: a rigorous model comparison | 44 | ML15, ML11 |

## 4. Detailed module briefs

### Part I · Supervised baselines

*Thesis: a small model with a correct pipeline is the baseline every larger model must beat.*

**Module 02 — Problem specification, splits, and preprocessing**

`handle: ML02` · `id: ml.problem-data-pipelines` · 24h · prerequisites: PY07, PS06 · proposed bank: `ml-02-problem-data-pipelines`

**Spine and derivations:** Define target, prediction unit, loss, sampling unit, split boundaries, and fit/transform semantics; distinguish prediction from causal estimation.

**Interactive experiment:** `ml-problem-data-pipelines` — Move preprocessing across the split boundary; show group leakage and time leakage despite randomized rows.

**Implementation ladder:** Implement split_by_group, fitted_standardizer, and pipeline_predict.

**RE gate:** Prevent train/test leakage through every preprocessing and tuning stage.

**RS gate:** State the target population and explain which sampling assumptions the evaluation needs.

**Module 03 — Linear models, ridge, and lasso**

`handle: ML03` · `id: ml.linear-ridge-lasso` · 28h · prerequisites: ML02, LA10, OPT07 · proposed bank: `ml-03-linear-ridge-lasso`

**Spine and derivations:** OLS and ridge as linked LA results, feature scaling, lasso KKT conditions, coordinate descent, regularization paths, and bias from shrinkage.

**Interactive experiment:** `ml-linear-ridge-lasso` — Vary collinearity and penalty; show coefficient instability alongside stable predictions and sparsity changes.

**Implementation ladder:** Implement ridge_via_solve, lasso_coordinate_descent, and kkt_residual.

**RE gate:** Match a trusted small solution without forming an unnecessary inverse.

**RS gate:** Explain when coefficients are identifiable and distinguish predictive error from parameter recovery.

**Module 04 — Logistic and multiclass models**

`handle: ML04` · `id: ml.logistic-multiclass` · 28h · prerequisites: ML03, PS11 · proposed bank: `ml-04-logistic-multiclass`

**Spine and derivations:** Bernoulli/multinomial likelihood, stable logits, gradients and Hessians, separation, class weighting, and decision thresholds.

**Interactive experiment:** `ml-logistic-multiclass` — Drag class overlap and regularization; reveal diverging unregularized coefficients under complete separation.

**Implementation ladder:** Implement logistic_objective, damped_irls, and multiclass_log_loss.

**RE gate:** Pass gradient checks and remain finite for extreme logits and imbalanced classes.

**RS gate:** Derive the convex objective and explain why separability can prevent a finite MLE.

**Module 05 — Generative classifiers and probabilistic baselines**

`handle: ML05` · `id: ml.generative-classifiers` · 24h · prerequisites: ML04, PS04 · proposed bank: `ml-05-generative-classifiers`

**Spine and derivations:** Naive Bayes factorization, Gaussian discriminant analysis, shared versus class covariance, smoothing, and the difference between generative assumptions and discriminative accuracy.

**Interactive experiment:** `ml-generative-classifiers` — Correlate two features or create unseen categories; show double-counted evidence and zero-likelihood collapse.

**Implementation ladder:** Implement categorical_nb, gaussian_discriminant, and smoothed_counts.

**RE gate:** Build a transparent baseline and audit its confidence under dependent features.

**RS gate:** Derive the linear/quadratic decision boundary and state the covariance assumptions.

### Part II · Alternative inductive biases

*Thesis: different model families encode different assumptions about the data.*

**Module 06 — Kernels, margins, and support vector machines**

`handle: ML06` · `id: ml.kernels-margin-methods` · 32h · prerequisites: ML03, OPT03, LA07 · proposed bank: `ml-06-kernels-margin-methods`

**Spine and derivations:** Maximum-margin primal/dual, KKT support vectors, positive-semidefinite kernels, feature maps, representer intuition, and kernel approximation.

**Interactive experiment:** `ml-kernels-margin-methods` — Change margin, outliers, and kernel width; show indefinite Gram matrices and interpolation without generalization.

**Implementation ladder:** Implement kernel_matrix, small_dual_solver, and random_feature_map.

**RE gate:** Compare kernel and feature-space solutions on an exact small case.

**RS gate:** Derive the dual and explain why an arbitrary similarity is not automatically a valid kernel.

**Module 07 — Trees, bagging, and gradient boosting**

`handle: ML07` · `id: ml.trees-ensembles-boosting` · 30h · prerequisites: ML02, OPT01 · proposed bank: `ml-07-trees-ensembles-boosting`

**Spine and derivations:** Impurity reductions, recursive partitions, pruning, bagging variance with correlated learners, and boosting as functional gradient steps.

**Interactive experiment:** `ml-trees-ensembles-boosting` — Change depth and learner correlation; display unstable splits and training-loss improvements that harm validation.

**Implementation ladder:** Implement regression_tree, bootstrap_ensemble, and squared_loss_booster.

**RE gate:** Prevent split leakage and benchmark against a properly tuned linear baseline.

**RS gate:** Derive the boosting residual target and qualify the variance reduction from correlated ensemble members.

**Module 08 — Gaussian processes and Bayesian optimization**

`handle: ML08` · `id: ml.gaussian-processes` · 32h · prerequisites: ML06, PS04, PS09 · proposed bank: `ml-08-gaussian-processes`

**Spine and derivations:** GP posterior mean/covariance, kernel hyperparameters, marginal likelihood, noisy observations, acquisition functions, and cubic solve costs.

**Interactive experiment:** `ml-gaussian-processes` — Change length scale, noise, and acquisition exploration; show overconfident extrapolation and duplicate observations.

**Implementation ladder:** Implement gp_posterior via Cholesky, log_marginal_likelihood, and expected_improvement.

**RE gate:** Handle ill-conditioning with documented jitter and distinguish noise from numerical stabilization.

**RS gate:** Derive conditioning formulas and explain how a misspecified kernel invalidates uncertainty interpretation.

**Module 09 — Clustering, mixtures, and latent structure**

`handle: ML09` · `id: ml.clustering-mixtures` · 28h · prerequisites: ML05, PS17 · proposed bank: `ml-09-clustering-mixtures`

**Spine and derivations:** K-means as alternating minimization, GMM implementation from the PS17 EM derivation, label switching, singular components, and clustering metrics.

**Interactive experiment:** `ml-clustering-mixtures` — Change initialization and component count; show empty clusters, singular covariance, and nonidentifiable labels.

**Implementation ladder:** Implement kmeans, stable_gmm_estep, and responsibility_audit.

**RE gate:** Track objective monotonicity and handle empty components without silent NaNs.

**RS gate:** Distinguish recovered clusters from meaningful latent causes and diagnose nonidentifiability.

**Module 10 — Dimensionality reduction and manifold assumptions**

`handle: ML10` · `id: ml.dimensionality-manifolds` · 28h · prerequisites: ML09, LA08, DS13 · proposed bank: `ml-10-dimensionality-manifolds`

**Spine and derivations:** PCA reuse, kernel PCA, neighborhood graphs, spectral embeddings, and visualization distortions; compare reconstruction, neighborhood, and downstream objectives.

**Interactive experiment:** `ml-dimensionality-manifolds` — Change neighborhood size and projection scale; reveal disconnected graphs and visually convincing false clusters.

**Implementation ladder:** Implement pca_transform, graph_embedding, and neighbor_preservation_score.

**RE gate:** Separate train-fitted transformations from test data and report multiple preservation metrics.

**RS gate:** Explain why a two-dimensional plot cannot establish cluster existence or global geometry.

**Module 11 — Density estimation and anomaly detection**

`handle: ML11` · `id: ml.density-anomaly` · 26h · prerequisites: ML09, PS18 · proposed bank: `ml-11-density-anomaly`

**Spine and derivations:** Histogram/KDE bandwidth tradeoffs, kNN density intuition, one-class scores, contamination assumptions, and tail versus density notions of anomaly.

**Interactive experiment:** `ml-density-anomaly` — Change scale and dimension; show low density in a valid group and high likelihood on an anomalous example.

**Implementation ladder:** Implement kde_1d, knn_score, and anomaly_threshold from held-out calibration data.

**RE gate:** Evaluate precision under a realistic low anomaly rate and inspect subgroup false alarms.

**RS gate:** Construct a counterexample to identifying low density with low probability mass.

### Part III · Research judgment

*Thesis: selection, shift, and uncertainty determine whether an improvement is real.*

**Module 12 — Model selection and hyperparameter search**

`handle: ML12` · `id: ml.selection-hyperparameters` · 28h · prerequisites: ML07, PS08, PS10 · proposed bank: `ml-12-selection-hyperparameters`

**Spine and derivations:** Nested validation, grouped/time splits, search budgets, early stopping, paired comparisons, and selection-induced optimism.

**Interactive experiment:** `ml-selection-hyperparameters` — Increase the number of tried models; display best-validation optimism and repeated-test contamination.

**Implementation ladder:** Implement nested_split_plan, search_manifest, and paired_metric_summary.

**RE gate:** Compare families under declared search budgets and preserve all failed trials.

**RS gate:** Quantify the selection problem and propose an evaluation design that addresses it.

**Module 13 — Calibration, shift, and subgroup evaluation**

`handle: ML13` · `id: ml.calibration-shift-fairness` · 30h · prerequisites: ML12, PS13, IL10 · proposed bank: `ml-13-calibration-shift-fairness`

**Spine and derivations:** Temperature/isotonic calibration as algorithms, proper scores as reused theory, label shift corrections, subgroup uncertainty, and incompatible fairness objectives.

**Interactive experiment:** `ml-calibration-shift-fairness` — Change prevalence and subgroup sample size; show stable aggregate accuracy masking severe slice failures.

**Implementation ladder:** Implement temperature_fit, subgroup_report, and label_shift_reweight.

**RE gate:** Evaluate calibration on independent data and keep threshold selection separate from final testing.

**RS gate:** Explain the assumptions of a correction and distinguish a fairness metric from a value judgment.

**Module 14 — Prediction, causal features, and shortcut tests**

`handle: ML14` · `id: ml.causal-prediction-boundaries` · 28h · prerequisites: ML13, PS16 · proposed bank: `ml-14-causal-prediction-boundaries`

**Spine and derivations:** Prediction versus intervention, confounding and selection, invariant-feature hypotheses, negative controls, and shortcut stress tests.

**Interactive experiment:** `ml-causal-prediction-boundaries` — Change a spurious feature's correlation between environments; display in-distribution success with intervention failure.

**Implementation ladder:** Implement environment_split, shortcut_ablation, and negative_control_report.

**RE gate:** Find a shortcut using controlled data changes and preserve the intended evaluation population.

**RS gate:** Use a causal graph to distinguish an identified effect from a predictive association.

**Module 15 — Classical baselines in modern research**

`handle: ML15` · `id: ml.classical-baseline-research` · 26h · prerequisites: ML08, ML14, RP04 · proposed bank: `ml-15-classical-baseline-research`

**Spine and derivations:** Linear probes, nearest-neighbor retrieval, small-data baselines, tuning parity, representation leakage, and compute-quality frontiers.

**Interactive experiment:** `ml-classical-baseline-research` — Compare frozen-feature probes with retrained baselines under unequal tuning; reveal the source of a claimed gain.

**Implementation ladder:** Implement probe_pipeline, baseline_budget_audit, and frontier_report.

**RE gate:** Construct a strong inexpensive baseline that another team can reproduce.

**RS gate:** Defend why the comparison answers the research question rather than only ranking implementations.

**Module 16 — Capstone: a rigorous model comparison**

`handle: ML16` · `id: ml.capstone-model-comparison` · 44h · prerequisites: ML15, ML11 · proposed bank: `ml-16-capstone-model-comparison`

**Spine and derivations:** No new theory: select a real prediction problem, compare at least three inductive biases, and explain errors with held-out evidence.

**Interactive experiment:** `ml-capstone-model-comparison` — Display quality, latency, calibration, and subgroup metrics under a controlled shift.

**Implementation ladder:** Deliver fitted pipelines, complete search artifacts, and a comparison report.

**RE gate:** Reproduce all reported numbers from raw data and a clean environment.

**RS gate:** Defend one substantive hypothesis, a counterexample, and the limit of the conclusion.

## 5. Write order and milestones

Write ML02–ML05 first. ML06–ML08 and ML09–ML11 are two branches with separate prerequisites. ML12–ML14 establish the evaluation gate before ML15–ML16. The RE path emphasizes stable solvers and pipelines; the RS path adds derivations and identification arguments. GPs and density estimation are specialization modules rather than prerequisites for first neural-network work.

A unit is ready for the next author only when its prerequisites have an authored route or a named external reading with an entry diagnostic. An overview that mentions an algorithm is not a substitute for teaching it. Preserve existing inbound IDs; add missing metadata only when the corresponding lesson is expanded. Do not register placeholder lessons or raise authored-coverage counts from this plan.

## 6. Capstone and assessment

Compare a linear model, a tree ensemble, and one kernel or probabilistic model under group-aware splits and equal selection budgets. Include calibration, shift, latency, subgroup errors, and complete search records. The final report must explain a failure and a case where the simplest model is adequate.

The checkpoint has six tasks: explain a concept without notation; derive a central result and its assumptions; compute a small case by hand; implement or repair a component; diagnose a misleading experiment; defend an unfamiliar extension. Passing requires a correct derivation, implementation evidence, and a defensible limitations statement, with no critical conceptual error. Record which failed tasks need repair; do not substitute aggregate quiz points for these gates.

## 7. Infrastructure and validation

Add split-leakage, regularization-path, tree-partition, and GP uncertainty views. Use small finite datasets in browser exercises; matrix solvers, kernel experiments, and full pipelines run in local NumPy.

Browser Python remains standard-library-only. Use deterministic small fixtures there; label NumPy/PyTorch, accelerator, and multi-device work as local extensions. A CPU simulation teaches an algorithm or protocol, not accelerator performance. Each local benchmark records versions, hardware, shapes, warmup, synchronization, seeds, raw timings, and a correctness oracle. Build shared visual primitives only when the first authored unit needs them.

For lesson implementation, follow the shared validation commands in [the plan index](../_plans.md). Check invalid inputs, degenerate cases, input preservation, and the failure preset. Inspect the reader in both themes and work one exercise end to end. For this planning change, verify local links, reserved IDs, prerequisite resolution, and exclusion of `_plan.md` from the lesson catalog.
