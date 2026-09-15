export type Module = { id: string; title: string; hours: number; level: "Foundation" | "Core" | "Advanced" | "Research"; lab: string };
export type Track = { id: string; title: string; short: string; color: string; depth: string; modules: Module[] };

const m = (id:string,title:string,hours:number,level:Module["level"],lab:string):Module => ({id,title,hours,level,lab});

export const tracks:Track[] = [
 {id:"foundations",title:"Foundations",short:"00",color:"#f6c453",depth:"Diagnostic-first. Skip proven knowledge; repair hidden gaps.",modules:[
  m("diagnostic","Adaptive baseline diagnostic",4,"Foundation","Mixed conceptual, derivation, coding and debugging assessment"),
  m("algebra","Algebra, functions & logarithms",12,"Foundation","Derive stable log-sum-exp and softmax ratios"),
  m("numerics","Numerical reasoning & floating point",10,"Foundation","Build a floating-point failure gallery"),
  m("research-tools","Linux, Git, testing & reproducibility",12,"Core","Reproduce a packaged experiment from a clean checkout") ]},
 {id:"python-dsa",title:"Python & DSA",short:"01",color:"#69d2e7",depth:"Language fluency plus interview-grade algorithms.",modules:[
  m("python-model","Python object & execution model",14,"Core","Build a typed configuration and plugin system"),
  m("python-protocols","Functions, closures, decorators & protocols",12,"Core","Implement iterators, decorators and context managers"),
  m("python-performance","Generators, concurrency & profiling",14,"Advanced","Stream and profile a dataset larger than memory"),
  m("numpy","NumPy, broadcasting, strides & vectorization",20,"Core","Implement batched regression, softmax and minibatching"),
  m("complexity","Complexity & recurrence reasoning",12,"Core","Analyze attention, heaps and hash-table workloads"),
  m("linear-structures","Arrays, stacks, queues & hashing",16,"Core","Implement an LRU cache and streaming token buffer"),
  m("trees-graphs","Trees, heaps, tries & graphs",22,"Advanced","Build efficient BPE merges using heaps and tries"),
  m("algorithm-patterns","Search, greedy & dynamic programming",28,"Advanced","Solve a curated algorithm transfer set") ]},
 {id:"mathematics",title:"Mathematics",short:"02",color:"#a78bfa",depth:"Proof-oriented development from foundations through full derivations.",modules:[
  m("calculus","Calculus & Taylor approximation",22,"Core","Derive activation and loss gradients; verify numerically"),
  m("vector-geometry","Vectors, bases & geometry",20,"Core","Build a projection and basis-change laboratory"),
  m("matrix-algebra","Linear maps, rank & least squares",24,"Core","Compare normal equations, QR and gradient descent"),
  m("eigen-svd","Eigenstructure, invariant spaces, SVD & PCA",30,"Advanced","Compress embeddings and inspect weight spectra"),
  m("matrix-calculus","Multivariable & matrix calculus",34,"Advanced","Derive LayerNorm and attention backward passes"),
  m("optimization-convexity","Convexity, smoothness & duality",38,"Advanced","Prove GD rates; derive KKT and the max-entropy softmax"),
  m("optimization-stochastic","Stochastic approximation, SGD & batch size",36,"Advanced","Measure the gradient noise scale; locate the critical batch size"),
  m("optimization-landscapes","Nonconvex landscapes & training dynamics",36,"Research","Reproduce the edge of stability with matrix-free curvature estimates"),
  m("optimization-preconditioning","Preconditioning, adaptive methods & schedules",40,"Research","Implement SGD through Muon; run a muP coordinate check"),
  m("optimization-constrained","Constrained, composite & distributed optimization",36,"Advanced","Implement projection and prox; audit distributed gradient semantics"),
  m("information","Information theory",30,"Advanced","Compare tokenizers using entropy and bits per byte"),
  m("slt","Statistical learning theory",44,"Research","Test PAC/VC/stability predictions empirically"),
  m("decision","Bayesian decision theory",28,"Advanced","Design calibrated human-escalation thresholds") ]},
 {id:"probability-statistics",title:"Probability & Statistics",short:"03",color:"#f0abfc",depth:"Built from finite events to modern generative and evaluation statistics.",modules:[
  m("prob-foundations","Probability foundations from finite events",24,"Foundation","Compute exact conditional probabilities on a finite space"),
  m("prob-random-variables","Random variables, distributions & simulation",32,"Core","Sample from categorical weights without a library"),
  m("prob-joint","Joint distributions, conditioning & covariance",24,"Core","Build finite joint marginals and covariance by hand"),
  m("prob-transformations","Transformations, convolution, Jacobians & flows",28,"Advanced","Implement discrete convolution and an affine coupling layer"),
  m("prob-gaussian","Multivariate Gaussian geometry & conditioning",22,"Advanced","Condition a bivariate Gaussian from the block formulas"),
  m("prob-limits","Limit theorems, Monte Carlo error & concentration",30,"Core","Estimate Monte Carlo error with batch means"),
  m("stat-estimation","Estimation, likelihood, Fisher information & asymptotics",28,"Advanced","Derive and implement Bernoulli maximum likelihood"),
  m("stat-testing","Hypothesis testing, confidence, power & multiplicity",34,"Advanced","Implement exact binomial tests and Benjamini-Hochberg"),
  m("stat-resampling","Bootstrap, permutation, sequential inference & design",36,"Research","Build bootstrap intervals and an anytime-valid e-process"),
  m("stat-bayes","Bayesian modeling, MCMC & chain theory",44,"Research","Implement importance sampling and random-walk Metropolis"),
  m("stat-sampling-eval","Sampling design, datasets & rigorous ML evaluation",42,"Research","Implement stratified and Horvitz-Thompson estimators"),
  m("stat-glm","Exponential families, GLMs, partial pooling & Bradley-Terry",50,"Research","Fit OLS, logistic gradients and partial pooling from scratch"),
  m("prob-high-dimensional","High-dimensional probability & random projections",30,"Advanced","Measure Johnson-Lindenstrauss distortion directly"),
  m("stat-calibration","Calibration, proper scoring rules & conformal prediction",32,"Research","Implement ECE with a null and a split-conformal threshold"),
  m("prob-elbo","Latent variables, the ELBO & gradient estimators",36,"Research","Implement Gaussian ELBO terms and Gumbel-max sampling"),
  m("prob-diffusion","Score matching, diffusion & generative sampling",36,"Research","Implement nucleus decoding and a forward diffusion schedule") ]},
 {id:"ml",title:"Machine Learning",short:"04",color:"#34d399",depth:"Rigorous probabilistic understanding; primitives before libraries.",modules:[
  m("regression","Linear & logistic models",22,"Core","Implement estimators, Newton updates and calibration"),
  m("bayesian","Bayesian models & approximate inference",30,"Advanced","Compare MAP, Laplace, sampling and variational inference"),
  m("latent","Mixtures, EM & latent variables",26,"Advanced","Implement Gaussian mixtures and EM"),
  m("kernels","SVMs, kernels & duality",26,"Advanced","Implement a margin classifier and kernel experiments"),
  m("trees","Trees, ensembles & boosting",22,"Core","Build a tree and gradient booster from primitives"),
  m("unsupervised","Clustering, density & manifolds",24,"Advanced","Compare clustering assumptions and metrics"),
  m("ml-evaluation","Generalization, calibration & shift",26,"Research","Create a leakage-resistant paired comparison") ]},
 {id:"deep-learning",title:"Deep Learning",short:"05",color:"#fb7185",depth:"Mechanistic intuition with detailed technical coverage.",modules:[
  m("autodiff","Computational graphs & autodiff",30,"Core","Build a scalar autodiff engine plus gradient checks"),
  m("mlp","MLPs, losses & initialization",24,"Core","Implement a NumPy MLP and overfit one batch"),
  m("training","Optimization & training dynamics",28,"Advanced","Run controlled optimizer and initialization ablations"),
  m("normalization","Normalization, residuals & regularization",26,"Advanced","Implement BatchNorm and LayerNorm forward/backward"),
  m("conv","Convolutions & representation learning",22,"Core","Implement convolution and a residual CNN"),
  m("sequence","RNNs, LSTMs & sequence modelling",22,"Core","Build a character LM and inspect gradient flow"),
  m("attention","Attention from first principles",32,"Advanced","Implement multi-head causal attention without helpers"),
  m("transformers","Transformer architectures",34,"Advanced","Match a reference transformer numerically") ]},
 {id:"nlp-llm",title:"NLP & LLMs",short:"06",color:"#60a5fa",depth:"Classical NLP through modern foundation-model training.",modules:[
  m("linguistics","Text processing & linguistic structure",20,"Core","Build a multilingual normalization/error suite"),
  m("classical-nlp","N-grams, smoothing, HMMs & CRFs",28,"Core","Implement an n-gram LM and Viterbi decoder"),
  m("semantics","Distributional semantics & embeddings",26,"Core","Train word2vec and audit representation geometry"),
  m("tokenization","Unicode, byte BPE & tokenization",34,"Advanced","Build a reversible byte-level BPE tokenizer"),
  m("language-modeling","Autoregressive language modelling",32,"Advanced","Train a decoder-only LM end to end"),
  m("lm-data","Pretraining data engineering",34,"Advanced","Stream, filter, deduplicate and document a corpus"),
  m("scaling","Scaling laws & compute allocation",30,"Research","Predict a held-out training run with uncertainty"),
  m("sft","Instruction tuning, LoRA & QLoRA",30,"Advanced","Fine-tune with response-only loss and controlled evals"),
  m("rag-agents","Retrieval, tools & agent systems",34,"Advanced","Build and evaluate a constrained support agent"),
  m("llm-evals","LLM evaluation science",36,"Research","Calibrate judges and expose misleading metrics") ]},
 {id:"systems",title:"PyTorch & Systems",short:"07",color:"#2dd4bf",depth:"Advanced from-scratch implementation with minimal scaffolding.",modules:[
  m("pytorch-tensors","PyTorch tensor mechanics",30,"Core","Pass an unseen shape, stride, einsum and device gauntlet"),
  m("pytorch-training","Modules, autograd & training loops",28,"Core","Build a tested trainer from a blank file"),
  m("lm-from-scratch","Language model from scratch",90,"Advanced","Complete a tokenizer, model, and optimizer stack from primitives"),
  m("gpu","GPU architecture & profiling",38,"Advanced","Predict then measure memory/compute bottlenecks"),
  m("triton","Triton kernels & FlashAttention",55,"Research","Implement and benchmark fused kernels"),
  m("distributed","Distributed training",50,"Research","Run DDP/FSDP and write a scaling report"),
  m("inference","Efficient inference",38,"Advanced","Build KV-cache and continuous-batching simulations"),
  m("reliability","Reliable large-scale training",36,"Research","Inject NaNs/OOMs/interruption and recover correctly") ]},
 {id:"rl",title:"RL & Post-training",short:"08",color:"#f97316",depth:"Classical RL through PPO, RLHF, DPO, RLVR and GRPO.",modules:[
  m("bandits","Bandits & exploration",22,"Core","Implement epsilon-greedy, UCB and Thompson sampling"),
  m("mdp","MDPs & Bellman equations",30,"Core","Solve tabular MDPs with dynamic programming"),
  m("td","Monte Carlo, TD, SARSA & Q-learning",30,"Advanced","Implement and compare tabular control methods"),
  m("dqn","Deep Q-learning & stability",32,"Advanced","Build and ablate a DQN"),
  m("policy-gradient","Policy gradients & actor-critic",36,"Advanced","Implement REINFORCE and actor-critic"),
  m("ppo","PPO, GAE & KL control",36,"Advanced","Implement PPO from equations"),
  m("reward-models","Preferences & reward models",30,"Advanced","Train and calibrate a reward model"),
  m("dpo","DPO & preference optimization",34,"Research","Implement DPO directly from chosen/rejected logits"),
  m("grpo","RLVR, GRPO & reasoning",44,"Research","Build a GRPO-style verifiable-reward loop") ]},
 {id:"research",title:"Research Practice",short:"09",color:"#e879f9",depth:"From faithful reproduction to defensible original evidence.",modules:[
  m("papers","Paper reading & claim decomposition",22,"Advanced","Write a claim, evidence and dependency map"),
  m("experiments","Ablations, baselines & reproducibility",30,"Research","Pre-register and execute an ablation matrix"),
  m("reproduction","Paper reproduction",80,"Research","Release code, results and a technical report"),
  m("extension","Research extension",70,"Research","Change one substantive assumption and defend it"),
  m("defence","RE interview & project defence",50,"Research","Pass coding, derivation, debugging and systems rounds") ]}
];

export const allModules = tracks.flatMap(t => t.modules.map(x => ({...x,trackId:t.id,trackTitle:t.title,color:t.color})));
export const totalHours = allModules.reduce((s,x)=>s+x.hours,0);
