---
id: neural-networks.connectionism-threshold-unit
title: Connectionism and the threshold unit
prerequisites: [foundations.mathematical-language]
estimated_hours: 20
answers: nn-01-connectionism-threshold-unit
lab: nn-mp
---

# Connectionism and the threshold unit

A speech recogniser turns a waveform into words. A captioner turns pixels into a sentence. A game engine turns a board position into a move. Each of these is a box with something going in and something coming out, so each is a **function**. The question this track answers is how to build a machine that can become almost any such function by learning from examples.

![Three tasks drawn as boxes: a speech waveform becomes a transcription, a picture becomes a caption, and a board position becomes the next move](../assets/nn01-tasks-are-functions.svg)

The answer started as a theory of the brain. Over two thousand years, people argued about where thoughts are linked, then decided the links live in the connections between neurons, then wrote those neurons down as equations simple enough to compute with. This chapter follows that path from the first idea to the first machine that could learn. It ends with networks that can draw any decision boundary and fit any curve. Every model you meet here still sits inside a modern network: the unit that weighs evidence and fires above a threshold is the ancestor of every neuron in a transformer.

Ten hands-on labs run alongside the text, in the same order. The panel below tracks which ones you have finished.

```lab
nn-overview
```

## 0. Route and prerequisite diagnostic

The chapter builds five ideas, each defined where it first appears.
1. A **connectionist machine** stores what it knows in the strengths of the connections between simple units, not in a separate program.
2. A **threshold unit** adds up weighted evidence and fires when the total reaches a threshold.
3. A **learning rule** changes the weights from experience. Hebb's rule strengthens connections that fire together. The perceptron rule corrects a unit only when it makes a mistake.
4. One threshold unit can only draw a straight boundary, so it cannot compute XOR. A **network** of units can compute any Boolean function.
5. With real-valued inputs, networks can carve out any region of space (they are **universal classifiers**). With a summing output, they can approximate any continuous function of one variable.

**Notation.** Inputs are x=(x₁,…,x_N), weights are w=(w₁,…,w_N), and the bias is b. A unit computes the **pre-activation** z=w·x+b=Σᵢwᵢxᵢ+b, then the **threshold activation** θ(z)=1 if z≥0 and 0 otherwise. Writing b=−T turns "z≥0" into "Σᵢwᵢxᵢ≥T", where T is the **threshold**. Boolean values are 0 and 1. A **truth table** lists a function's output for every input pattern.

Check these before starting. Each comes with a short repair.
- Can you evaluate Σᵢwᵢxᵢ for w=(2,−1,3) and x=(1,1,0)? The answer is 1. If sums with signs are unfamiliar, review the summation notation in [mathematical language](../00-foundations/00-mathematical-language.md).
- Can you write the truth table of AND, OR and XOR on two inputs? XOR is 1 exactly when the inputs differ.
- Do you know what the line w₁x₁+w₂x₂+b=0 looks like? It is a straight line, and (w₁,w₂) points from it towards the side where the expression is positive.
- Do you know what an eigenvector of a symmetric matrix is? Section 4 uses one fact: repeated multiplication by a symmetric matrix with nonnegative eigenvalues stretches vectors fastest along the eigenvector with the largest eigenvalue.

**How to use the help on this page.** Every paragraph, figure and exercise has a small **?** button. It opens a note anchored to that spot where you can ask an LLM tutor about it, request a hint without the answer, or submit an attempt for marking. Connect a model once with the toolbar button. Without a connection the notes still work as private written notes. The tutor sees only the passage you anchor to, so quote what you are asking about.

## 1. Associations, connections, and the connectionist machine

**The question.** When you see lightning, you brace for thunder. When you hear thunder, you wonder where the lightning struck. Something links the two experiences. What is that link, and where is it kept?

**Associationism** answered the first half: the mind learns by linking ideas that occur together. Around 350 BC, Aristotle listed four ways ideas become linked:
- **Contiguity:** things that occur close together in space or time get linked.
- **Frequency:** the more often two things occur together, the stronger the link.
- **Similarity:** thinking of one thing recalls things like it.
- **Contrast:** thinking of one thing can recall its opposite.

![Aristotle's four laws drawn as pictures: two events close in time, a link that thickens with repetition, two similar shapes, and a black and a white disc](../assets/nn01-four-laws.svg)

Later associationists (Locke, Hume, Hartley, the Mills, Bain, Pavlov) pushed this to its limit. They claimed there is only *one* mental process, the forming of associations. In the early twentieth century, behaviourism made the same claim about actions: behaviour is learned by repeatedly pairing actions with feedback.

None of this said where the links are stored. In 1749 David Hartley guessed that sensations are vibrations in the nerves, and memories are fainter vibrations he called *vibratiuncles*, in the same places. That was a physical theory without the physical parts. Nobody yet knew about neurons.

**The picture.** By the mid-1800s, microscopes showed that the brain is a mass of interconnected cells. Many fibres run into each nerve cell and many run out, so the brain is a **network**. In 1873 Alexander Bain drew the conclusion that defines this whole subject: *the information is in the connections*.

Think of a city's road network. There is no central office where routes are written down. A route is a pattern of streets, and the routes people use most get widened. Bain's brain worked the same way. "For every act of memory, every exercise of bodily aptitude, every habit, recollection, train of ideas," he wrote, "there is a specific grouping, or co-ordination, of sensations and movements, by virtue of specific growths in the cell junctions" (*Mind and Body*, p. 91).

Bain proposed two mechanisms that sound modern:
- **Groupings.** One input fibre can produce different outputs depending on which other fibres are active with it and how strongly it is stimulated (pp. 110–115). A weak current reaches one set of cells and a strong one spreads further: "What begins as mere difference of intensity in one track ends in difference of grouping."
- **Making memories.** When two impressions occur together, "the nerve-currents find some bridge or place of continuity" (p. 117), leaving "a strengthened connexion or diminished obstruction—a preference track for that line." That is Hebbian learning, three quarters of a century before Hebb.

![Bain's groupings: three input fibres a, b and c, each pair meeting in its own cell X, Y or Z, which produces a different output](../assets/nn01-bain-groupings.svg)

**A worked example: Bain's capacity check.** Bain worried whether a brain was big enough to hold a lifetime of associations, so he estimated both sides (pp. 101–108).
1. **Demand.** The multiplication table is 144 facts. Bain guessed it is about one fiftieth of what an arithmetician knows, so arithmetic alone needs more than 7,000 links. Adding music, languages and faces, he estimated a lifetime of learning in the "thousands, and even tens of thousands" of acquisitions.
2. **Supply.** The cortex covers over 300 square inches and is about a tenth of an inch thick. With 500 cells per linear inch and 16 layers of cells, that is about 1,200 million cells. With four fibres per cell, it is about 4,800 million fibres. He rounded these to 1,000 million cells and 5,000 million fibres.
3. **Ratio.** Even at 200,000 acquisitions, each one could have its own 5,000 cells and 25,000 fibres. He concluded there was "no improbability in supposing an independent nervous track for each separate acquisition."

Bain's figures were far too small: the cortex has about 16 billion neurons and the brain about 10¹⁴ synapses. Notice also that he counted fibres, which are wires, not synapses, which are junctions. Later in life he grew doubtful that the scheme could account for everything, and accounts of his career report that by 1903 he had abandoned it. Even so, the method of comparing the demand for storage with the supply of connections is still how we reason about network capacity.

**Connectionist machines.** A **connectionist machine** is a network of simple processing units in which everything the machine knows is stored in the connections between units. Neural networks are connectionist machines.

The contrast with an ordinary computer is sharp. A **von Neumann machine** has a processor, a separate memory holding the program and the data, and a loop that fetches one instruction after another. Think of a chef who reads a recipe card one step at a time. A connectionist machine is more like a jazz band with no sheet music. The "program" is how the players listen to each other, and changing what the band plays means changing those habits, not editing a card.

![A von Neumann machine with a processor and a memory holding program and data, beside a network of units joined by connections of different strengths](../assets/nn01-von-neumann-vs-network.svg)

Several groups wrote down what a connectionist system needs. Rumelhart, Hinton and McClelland's *Parallel Distributed Processing* (1986) listed eight requirements:
1. a set of processing units;
2. a state of activation;
3. an output function for each unit;
4. a pattern of connectivity among units;
5. a propagation rule that sends activity through the connections;
6. an activation rule that combines a unit's inputs with its current state;
7. a learning rule that changes connectivity with experience;
8. an environment in which the system operates.

Bechtel and Abrahamsen (1991) compressed the list to four: the connectivity of the units, their activation function, the learning procedure that modifies the connections, and how the network is interpreted semantically. Keep both lists in mind. Every model in this chapter fills in the slots differently, and the missing slot is usually the learning rule.

```lab
nn-history
```

> **Practice — Foundation:** Classify each statement as associationist, connectionist, or both: (a) learning forms links between ideas that occur together; (b) those links are stored as strengths of connections between units; (c) the program and the data share one memory.
>
> **Hint:** Associationism is about what learning does; connectionism adds where the result is stored. Statement (c) belongs to neither.

> **Practice — Core:** Redo Bain's supply estimate for a cortex of 2,000 square centimetres at 0.25 cm thick, with 200 cells per linear centimetre and 25 layers. Give cells and fibres, using his four fibres per cell, and the cells available per acquisition if there are 50,000 acquisitions.
>
> **Hint:** Cells per square centimetre are 200², then multiply by the area and the number of layers.

> **Practice — Stretch:** Bain's Fig. 2 gives every pair of input fibres its own meeting cell. How many meeting cells does his scheme need for all pairs, and for all triples, of n input fibres? Why does this growth make a one-cell-per-combination design hopeless, and what does a network of threshold units do instead?
>
> **Hint:** Count the pairs with n(n−1)/2 and the triples with a binomial coefficient. A threshold unit can respond to many combinations through its weights.

## 2. The McCulloch–Pitts neuron

**The question.** If knowledge lives in connections, what are the units being connected, and what does one of them compute?

**The picture.** A real neuron gathers signals through its **dendrites** into the cell body, the **soma**, and sends one output down its single **axon** to other neurons. It fires in an all-or-nothing way: a pulse either goes or it doesn't. In 1943 the neurophysiologist Warren McCulloch and the self-taught logician Walter Pitts turned this into mathematics. Their paper, "A logical calculus of the ideas immanent in nervous activity," treats each neuron as a device that decides whether a logical proposition about its inputs is true.

![A schematic neuron with dendrites, soma, axon and synapses, beside the threshold unit that abstracts it, with weighted inputs and a threshold](../assets/nn01-neuron-anatomy.svg)

Picture a committee that votes on a motion. Each ordinary member (an **excitatory** synapse) votes yes or abstains. The motion passes if enough members vote yes. Some members hold a **veto** (an **inhibitory** synapse): if any of them objects, the motion fails no matter how many voted yes.

McCulloch and Pitts stated five assumptions (p. 101 of the 1990 reprint):
1. The activity of the neuron is an "all-or-none" process.
2. A fixed number of synapses must be excited within a short summation period to fire the neuron. That number does not depend on past activity or on where the synapses sit.
3. The only significant delay in the nervous system is the synaptic delay.
4. "The activity of any inhibitory synapse absolutely prevents excitation of the neuron at that time."
5. The structure of the net does not change with time.

The fifth assumption rules out learning on purpose. The authors showed that some kinds of learning could be imitated by fixed nets with loops, but their neurons never change.

**A worked example.** Take three excitatory inputs A, B, C and threshold 2, with no inhibitory input. Count the active inputs in each of the eight patterns. The unit fires on (1,1,0), (1,0,1), (0,1,1) and (1,1,1), and stays silent otherwise. That is "at least two of three", the majority function. Now add an inhibitory input D. Whenever D is active, the unit is silent, so it computes "majority of A, B, C, and not D".

**The definition.** A **McCulloch–Pitts unit** has excitatory inputs e₁,…,e_m, inhibitory inputs i₁,…,i_k (all 0 or 1) and a threshold θ. It outputs 1 at time t exactly when no inhibitory input was active at time t−1 and the number of active excitatory inputs at t−1 reached the threshold. One time step is one synaptic delay.

There is a subtlety in "reached". The 1943 paper says the count must *exceed* θ. The labs here and most modern texts fire when the count is *at least* θ. The difference is a shift of the threshold by one, except at the edge case of θ=0, which you will meet below.

**What it can compute.** With threshold 2 and two excitatory inputs, the unit is AND. With threshold 1 it is OR. With A excitatory, B inhibitory and threshold 1 it is "A and not B". Feed outputs of such units into other units and you can build any formula of propositional logic.

![The four McCulloch–Pitts building blocks: delay, OR with threshold 1, AND with threshold 2, and AND-NOT with an inhibitory veto](../assets/nn01-mp-gates.svg)

One case is impossible, and McCulloch and Pitts proved it (their Theorem 3). With a strict threshold, a net whose inputs are all silent can never fire, because no unit gets any excitation. So **a McCulloch–Pitts net cannot compute a function that is true when every input is off**, such as NOT A or NOR. The usual fix is a unit that is always on and feeds the net a constant 1. A bias does the same job in modern networks. The lab's NOR challenge uses the "at least" convention with θ=0 to do this, which is exactly the loophole.

```lab
nn-mp
```

### An illusion built from logic

McCulloch and Pitts used their units to explain a strange fact about the skin. If a cold object touches the skin only briefly, you feel *heat*. Hold it there and you feel cold. A net of five units, each with one step of delay, produces exactly this (Fig. 1e of the paper). Write h(t) for the heat receptor and c(t) for the cold receptor:
- unit a copies the cold receptor one step later;
- unit b fires when a fired but the cold receptor has just gone quiet (a excites b, the cold receptor inhibits it);
- heat is felt one step after h *or* b fires;
- cold is felt one step after both a and the cold receptor fire.

![The heat/cold net: heat and cold receptors, a relay unit a, a unit b that fires when cold has just stopped, and the HOT and COLD sensation units](../assets/nn01-heatcold-wiring.svg)

Unrolled, the sensations are

$$H(t)=h(t-1)\ \lor\ \big[c(t-3)\land\lnot c(t-2)\big],\qquad C(t)=c(t-2)\land c(t-1).$$

A one-step cold touch sets c at a single time, so the bracket in H becomes true three steps later and nothing ever makes C true: you feel heat. A sustained touch keeps c on, so the bracket stays false and C turns on after two steps: you feel cold. The point McCulloch and Pitts drew is that what we perceive depends on the wiring between the receptors and the sensation, not only on the world.

```lab
nn-heatcold
```

### Loops, memory, and the Turing claim

So far every signal flows forward. If a unit's output feeds back into its own input, activity can circulate indefinitely. Think of a light switch that, once pressed, holds itself on by its own current. That **reverberating loop** remembers that it was pressed. In 1930 the psychiatrist Lawrence Kubie had suggested such closed loops as the basis of memory, and McCulloch and Pitts showed that nets with loops can depend on events arbitrarily far in the past.

They also claimed that a net equipped with a tape, scanners and suitable outputs could compute exactly what a Turing machine computes. They wrote that this "is easily shown" but gave no proof. That, and the absence of any way for the net to learn, are the main criticisms of the model.

> **Practice — Foundation:** Give the threshold and synapse types of a McCulloch–Pitts unit that computes "at least three of five inputs are on", and of one that computes "A and B, but not C".
>
> **Hint:** Count how many excitatory inputs must be active. Inhibition is a veto, so C belongs on an inhibitory synapse.

> **Practice — Core:** In the heat/cold net, give the sensations at every step when the cold receptor fires at t=0 and t=4 only, and nothing else happens. Then do the same when it fires at t=0 and t=1.
>
> **Hint:** Use the two unrolled formulas. For H, look for times where c was on three steps earlier and off two steps earlier.

> **Practice — Stretch:** Using Theorem 3, list which of the sixteen Boolean functions of two inputs a strict McCulloch–Pitts net without loops cannot compute. Then show how one extra input that is always on removes the restriction.
>
> **Hint:** The forbidden functions are exactly those whose value on the input (0,0) is 1. Count them.

## 3. Turing's unorganised machines

**The question.** McCulloch–Pitts nets are designed by hand, wire by wire. Could a network start out random and be *trained* into doing something useful?

**The picture.** In 1948 Alan Turing wrote a report for the National Physical Laboratory called "Intelligent Machinery." It was not published until 1969, which is one reason nobody built on it. In it he described **unorganised machines**, and wrote that "the cortex of the infant is an unorganised machine, which can be organised by suitable interfering training."

Think of an old telephone exchange where every cable has a little switch on it. Nobody plans the cabling, which is random. Training means a supervisor flips switches until the right calls get through.

**The definitions.**
- An **A-type machine** has N units, each with two inputs chosen at random from the other units, all updated together by a clock. Each unit computes NAND of its two inputs from the previous tick. NAND is **universal**: any Boolean function can be built from NAND gates alone. So with the right wiring an A-type can compute anything, but nothing in it can be changed.
- A **B-type machine** is an A-type in which every connection passes through a small device with a **modifier**. In Turing's definition the device has two modes. In one, its output is the *negation* of its input. In the other, its output is stuck at 1, which cuts the connection, since a NAND unit ignores an input that is always 1. Training means setting each modifier to one of the two modes.
- A **P-type machine** is not a network. It is a table-driven machine trained with "pleasure" and "pain" signals that keep or cancel random tentative choices.

![Turing's A-type NAND unit, a B-type link with a modifier, and its two modes: on passes the negated signal, off fixes the output at 1](../assets/nn01-turing-btype.svg)

Many retellings describe the "on" mode as letting the signal "sail through". In Turing's report it inverts the signal. Copeland and Proudfoot (1996) point out that with the definition as written, some functions are out of reach for a given B-type. Their fix is two modifiers in series on each connection, since inverting twice passes the signal unchanged. The figure below uses Turing's definition, so you can find a function the little machine cannot learn.

```lab
nn-btype
```

**Why the idea stalled.** Each modifier flips a connection completely on or off. Copeland and Proudfoot call this "a savage all-or-nothing shift". Compare a light switch with a dimmer. With only switches, a small change to the network makes a large, unpredictable change in its behaviour, so there is nothing to guide a search except trying settings. Turing had no training algorithm beyond exhaustive or random search. The key ingredient that came later was **graded weights**, which let learning take small steps.

> **Practice — Foundation:** Show that NOT x, x AND y, and x OR y can each be built from NAND gates alone, giving one formula for each.
>
> **Hint:** NAND(x,x) is NOT x. AND is NOT of NAND. For OR, use De Morgan: x OR y = NAND(NOT x, NOT y).

> **Practice — Core:** In the B-type figure, the "Search all 16 settings" button finds every modifier setting that realises a target. Predict, before searching, which of OR, AND, and NOT A the machine can realise, and explain your prediction from the two link modes.
>
> **Hint:** Work out what N1 can be for each pair of modifiers on L1 and L2, then what N2 does with N1 and A.

> **Practice — Stretch:** Explain why every A-type machine, started from any state, must eventually repeat a state and then cycle forever. Give an upper bound on how long the sequence of states can run before repeating, as a function of N.
>
> **Hint:** The next state depends only on the current state, and there are finitely many states.

## 4. Hebbian learning, and why it explodes

**The question.** McCulloch–Pitts nets cannot learn, and Turing's switches change too abruptly. How could connection strengths change gradually with experience?

**The picture.** Think of a lawn between two buildings. Nobody plans a path, but where people walk most the grass wears away, and a worn path invites even more people to take it. In 1949 the psychologist Donald Hebb proposed that synapses work this way. His *neurophysiological postulate* (*The Organization of Behavior*, p. 62) reads:

> When an axon of cell A is near enough to excite a cell B and repeatedly or persistently takes part in firing it, some growth process or metabolic change takes place in one or both cells such that A's efficiency, as one of the cells firing B, is increased.

Two details matter. First, A must *take part in firing* B, which is about cause and timing, not mere coincidence. Second, Hebb named no mechanism; the cellular story of long-term potentiation came decades later. The slogan "neurons that fire together wire together" is a later summary and does not appear in Hebb's book.

![Before and after: axon branches of cell A end in small knobs on cell B, and after A repeatedly helps fire B the active knob has grown larger](../assets/nn01-hebb-knobs.svg)

**A worked example.** The simplest mathematical version updates the weight w from input x to output y by

$$w \leftarrow w + \eta\,x\,y,$$

where η>0 is a small **learning rate**. Take one linear unit y=wx with a single input that is always x=1, start at w=0.5, and use η=0.1. Each step multiplies w by 1.1: 0.5, 0.55, 0.605, 0.6655, … After n steps w=0.5·1.1ⁿ, so after 100 steps w is about 6,900. Nothing ever makes it smaller.

**The derivation.** Now let the input be a random vector x with correlation matrix C=E[xxᵀ], and let the output be y=w·x. The Hebbian update is Δw=ηyx=η xxᵀw, so on average

$$\mathbb{E}[\Delta w] = \eta\,C\,w.$$

For small η, w follows the differential equation dw/dt=Cw. Write w in the eigenvectors uᵢ of C, with eigenvalues λ₁≥λ₂≥…≥0 (C is symmetric and positive semidefinite). Each coordinate grows like e^{λᵢt}, so

$$w(t)=\sum_i e^{\lambda_i t}\,(u_i^\top w_0)\,u_i .$$

The term with the largest eigenvalue wins, so w turns towards u₁, the direction of greatest variance in the data. But its length grows like e^{λ₁t}. Indeed d‖w‖²/dt=2wᵀCw≥0, so the length can never decrease.

![Weight length against update step on a log axis: the Hebb curve rises in a straight line, the Oja curve levels off at length 1](../assets/nn01-hebb-vs-oja.svg)

This is what "fundamentally unstable" means here. Strong connections strengthen themselves, nothing weakens them, and connections do not compete. The instability belongs to the formula Δw=ηxy, not to Hebb's theory. Hebb himself was willing to assume "that an unused connection decays" (p. 231).

**The fix: forgetting.** Erkki Oja (1982) added a term that shrinks the weights in proportion to how strongly the unit responds:

$$w \leftarrow w + \eta\,y\,(x - y\,w).$$

On average, dw/dt=Cw−(wᵀCw)w. Take the dot product with w: d‖w‖²/dt=2(wᵀCw)(1−‖w‖²). The length grows when it is below 1 and shrinks when it is above 1, so it settles at 1. At a resting point Cw=(wᵀCw)w, so w is a unit eigenvector of C, and the only stable one is u₁. Oja's unit therefore learns the **first principal component** of its inputs. With several outputs, Sanger's **generalized Hebbian rule** wᵢⱼ←wᵢⱼ+ηyⱼ(xᵢ−Σ_{k≤j}wᵢₖyₖ) makes output j learn the j-th principal component. Each output subtracts what the earlier outputs already explain.

```lab
nn-hebb
```

> **Practice — Foundation:** A single-input linear unit starts at w=2 with constant input x=1 and η=0.05. Give w after one and two Hebbian steps, and the number of steps needed to pass w=20.
>
> **Hint:** Each step multiplies w by 1+η, so solve 2·1.05ⁿ>20 with logarithms.

> **Practice — Core:** For C=diag(4,1) and w₀=(1,1), solve dw/dt=Cw. Give the angle between w(t) and the first axis at t=1, and explain why it shrinks over time.
>
> **Hint:** Each coordinate grows independently: w₁(t)=e^{4t} and w₂(t)=e^{t}. The angle is arctan(w₂/w₁).

> **Practice — Stretch:** Starting from dw/dt=Cw−(wᵀCw)w, show that every unit eigenvector of C is a resting point. Then argue that the eigenvector with the second-largest eigenvalue is unstable, by perturbing it slightly towards the first.
>
> **Hint:** Substitute w=u₂+εu₁ and keep terms of first order in ε. Check whether the u₁ coefficient grows.

## 5. Rosenblatt's perceptron

**The question.** Hebb's rule strengthens whatever happens, right or wrong. Can a unit learn from its *mistakes* and settle once it is right?

**The picture.** In 1958 the psychologist Frank Rosenblatt published "The perceptron: a probabilistic model for information storage and organization in the brain." He took the connectionist side explicitly. Information, he wrote, "is contained in connections or associations rather than topographic representations." He then built machines that learned, first simulated on an IBM 704 and later in hardware.

His original **photoperceptron** had several stages:
- **sensory points (S)** on a retina, which respond all-or-nothing;
- a **projection area A_I** of association units, each collecting from a cluster of nearby sensory points;
- an **association area A_II**, randomly connected to A_I;
- **response units (R)**, each receiving from its own source set in A_II.

![Rosenblatt's photoperceptron: a retina of sensory points feeding projection units, association units and two mutually inhibiting response units](../assets/nn01-photoperceptron.svg)

Connections could be excitatory or inhibitory. Feedback from each response unit inhibited the source sets of the others, which made the responses mutually exclusive. The **simplified perceptron** kept only fixed association units and learnable weights into the response units.

Learning in the 1958 paper is not the rule you will see below. It used "value" reinforcement schemes, in which active association units gained or lost value. The **error-correction rule** and its convergence proofs were developed over the next few years, by Rosenblatt (*Principles of Neurodynamics*, 1962) and by Block, Novikoff and Papert. Minsky and Papert note that Agmon's 1954 method for solving linear inequalities already contained the key argument.

Think of the simplified perceptron as a nightclub bouncer with a points system. Each feature of a guest (input xᵢ) earns points (weight wᵢ), positive or negative. If the total reaches the bar (threshold T), the guest gets in. The bouncer learns by being corrected by a manager: whenever the bouncer lets in someone who should have been refused, the points for that guest's features go down. Whenever the bouncer refuses someone who should have been admitted, they go up. When the bouncer is right, nothing changes.

**The definition.** A **perceptron** with real inputs x∈ℝᴺ, weights w∈ℝᴺ and bias b computes

$$y=\theta(w\cdot x+b)=\begin{cases}1 & \text{if } \sum_i w_i x_i + b \ge 0,\\ 0 & \text{otherwise.}\end{cases}$$

The map x↦w·x is **linear**: it sends 0 to 0, and it respects sums and scaling. The map x↦w·x+b is **affine**: a linear map plus a constant. A perceptron applies a threshold to an affine function. Its **decision boundary** w·x+b=0 is a line in two dimensions, a plane in three, and a **hyperplane** in general. So a perceptron is a **linear classifier**: it fires on one side of a hyperplane and not on the other.

The **perceptron learning rule** processes examples one at a time. For an input x with desired output d,

$$w \leftarrow w + \eta\,(d-y)\,x,\qquad b\leftarrow b+\eta\,(d-y).$$

If the answer was right, d−y=0 and nothing changes. If the unit fired when it should not have, d−y=−1 and w moves away from x. If it stayed silent when it should have fired, w moves towards x.

**A worked example.** Train an OR gate with η=1, starting from w=(0,0) and b=0, presenting the inputs in the order (0,0), (0,1), (1,0), (1,1).
1. Epoch 1, input (0,0), target 0. z=0, so y=1. Wrong, so b becomes −1.
2. Input (0,1), target 1. z=−1, so y=0. Wrong, so w becomes (0,1) and b becomes 0.
3. Input (1,0), target 1. z=0, so y=1. Right.
4. Input (1,1), target 1. z=1, so y=1. Right.
5. Epoch 2, input (0,0), target 0. z=0, so y=1. Wrong, so b becomes −1.
6. Input (0,1): z=0, right. Input (1,0): z=−1, so y=0. Wrong, so w becomes (1,1) and b becomes 0.
7. Input (1,1): z=2, right.
8. Epoch 3, input (0,0): z=0, so y=1. Wrong, so b becomes −1. The other three are now right: z=0, 0 and 1.
9. Epoch 4 makes no mistakes, so training stops with w=(1,1) and b=−1. The unit fires when x₁+x₂≥1, which is OR.

**The convergence theorem.** If the two classes can be separated by some hyperplane with a margin, the rule makes only finitely many mistakes and then stops. Module NN03 proves the bound. If no separating hyperplane exists, the rule never settles.

**The limit.** Some simple functions have no separating line. For XOR, suppose some w₁, w₂ and threshold T worked.
- The input (0,0) must not fire, so 0<T.
- The inputs (1,0) and (0,1) must fire, so w₁≥T and w₂≥T. Adding these gives w₁+w₂≥2T.
- Since T>0, 2T>T, so w₁+w₂>T. But then the input (1,1) fires, and it must not.

![Three panels of the four corners of the unit square: one line separates AND and OR, but XOR's firing corners lie on a diagonal and need two lines](../assets/nn01-xor-corners.svg)

No single perceptron computes XOR. In *Perceptrons* (1969), Marvin Minsky and Seymour Papert proved much stronger results: some properties of images, such as parity and connectedness, need perceptrons whose units each look at more and more of the image as it grows. In the 1988 epilogue they insisted they had never claimed networks were useless: "for any particular size of retina we can make a perceptron that will recognize any predicate," but the general predicate "requires perceptrons of unbounded order." The lesson the field took was simpler: **individual units are weak, so networks of units are required.**

```lab
nn-perceptron
```

> **Practice — Foundation:** Give weights and a bias for a perceptron that computes NOR on two inputs, and check all four rows.
>
> **Hint:** NOR fires only at (0,0). Use negative weights and a bias just large enough to fire when both inputs are 0.

> **Practice — Core:** Run the perceptron rule by hand on AND with η=1, starting from w=(0,0) and b=0, with inputs in the order (0,0), (0,1), (1,0), (1,1). Give the weights after each epoch and the epoch with no mistakes.
>
> **Hint:** Keep a table with columns x, d, z, y and the new (w, b). The boundary convention z≥0 fires matters on the first row.

> **Practice — Stretch:** Prove that XNOR (1 exactly when the two inputs are equal) is not computable by a single perceptron. Then explain why multiplying the weights and the bias by any positive number never changes what a perceptron computes.
>
> **Hint:** Write the four inequalities for XNOR with threshold T, and combine the two rows that must fire against the two that must not.

## 6. Networks of perceptrons compute any Boolean function

Before building networks, here is where the story stands: two thousand years of ideas about association, then four decades in which the neuron became a computing element.

![A timeline from Aristotle's laws of association through Hartley, Bain, Kubie, McCulloch and Pitts, Turing, Hebb, Rosenblatt, Minsky and Papert, to the PDP group in 1986](../assets/nn01-timeline.svg)

**The question.** One unit cannot compute XOR. How many units, arranged how, can compute anything?

**The picture.** Think of Lego. One brick shape is not enough to build a castle, but with enough bricks of a few shapes you can build any shape. Threshold units are the bricks. A unit can be AND, OR or NOT, and those three gates build any Boolean function.

A **multilayer perceptron (MLP)** is a network of perceptrons arranged in layers. The first layer reads the inputs, and each later layer reads the outputs of the layer before. The layers between the inputs and the output are called **hidden layers**, because nothing outside the network sees their values directly.

**A worked example: XOR in three units.** XOR is "at least one input is on, but not both". Write that as two hidden units and an output:
- h₁ = OR(X,Y): weights 1 and 1, threshold 1;
- h₂ = NAND(X,Y), that is, NOT X OR NOT Y: weights −1 and −1, threshold −1;
- XOR = AND(h₁,h₂): weights 1 and 1, threshold 2.

Check all four rows. At (0,0), h₁=0, so the output is 0. At (0,1) and (1,0), h₁=1 and h₂=1, so the output is 1. At (1,1), h₂=0, so the output is 0.

**The general construction.** Any Boolean function can be written in **disjunctive normal form (DNF)**: an OR of AND terms, one for each input pattern on which the function is 1. For example, a function of three inputs that is 1 on exactly the patterns (1,0,1) and (0,1,1) is (X AND NOT Y AND Z) OR (NOT X AND Y AND Z). Each AND term is a single threshold unit: weight +1 on inputs that must be on, −1 on inputs that must be off, and threshold equal to the number of inputs that must be on. The OR is one more unit. So **every Boolean function is computed by an MLP with one hidden layer**.

The price can be steep. A function of N inputs can need up to 2ᴺ⁻¹ AND terms, and depth sometimes reduces the count enormously. The next chapter, NN02, is about exactly that trade-off. The figure below also shows a three-layer network for a formula over four inputs, (A·X̄·Z + A·Ȳ)·(X·Y + X·Z), where the layers build the AND terms, then the ORs, then the final AND.

```lab
nn-boolean-mlp
```

> **Practice — Foundation:** Write the single threshold unit for the AND term "X and not Y and not Z": its three weights and its threshold. Check the pattern that should fire and one that should not.
>
> **Hint:** Use +1 for inputs that must be on and −1 for inputs that must be off. The threshold is the number of +1 inputs.

> **Practice — Core:** Build a one-hidden-layer network for "exactly one of three inputs is on" using the DNF construction. How many hidden units does it use? Then find a network with only two hidden units.
>
> **Hint:** For the smaller network, use a unit that fires when at least one input is on and another that fires when at least two are on.

> **Practice — Stretch:** Explain why the DNF construction can never need more than 2ᴺ⁻¹ AND terms for a function of N inputs, if you are allowed to build the complement instead when that is shorter.
>
> **Hint:** A function and its complement have 2ᴺ patterns between them, so one has at most half. NOT of an OR of ANDs is still one output unit with flipped weights.

## 7. Perceptrons on real inputs carve out regions

**The question.** Brains do not receive 0s and 1s, and they do not only answer yes or no. What can a network do with real-valued inputs?

**The picture.** With real inputs, a perceptron fires on one side of a line. Think of each unit as a **fence** across a field: it reports which side of the fence you are standing on. To mark out a pen, put up several fences and ask whether you are on the inside of *all* of them, which is an AND. To mark out two separate pens, ask whether you are inside one pen *or* the other, which is an OR of two ANDs.

![Three panels: first-layer units draw lines, second-layer AND units turn groups of lines into a triangle and a square, and a third-layer OR unit takes their union](../assets/nn01-layers-compute.svg)

**A worked example: a pentagon.** Take a regular pentagon and give each of its five edges a unit that fires on the inside of that edge. A point inside the pentagon fires all five units. A point outside fires at most four, because it is outside at least one edge. So an output unit that fires when the sum of the five hidden outputs is at least 5 detects the pentagon. In general, a convex polygon with K edges needs K edge units plus one output: K+1 threshold units in two layers.

**A worked progression: a square, its outside, and two squares.** Read each figure from left to right: the fences on the left are the hidden units on the right.

1. **The square |x₁|≤1, |x₂|≤1.** Each edge is one inequality. Rewrite each one so that "inside" means "≥0": x₁≤1 becomes 1−x₁≥0, so h₁=θ(−x₁+1), with weight −1 and bias 1. The other three are h₂=θ(−x₂+1), h₃=θ(x₁+1) and h₄=θ(x₂+1). The output fires when all four do: y=θ(h₁+h₂+h₃+h₄−4). That is a 2–4–1 network: two inputs, four hidden units, one output.

![Left: the square with corners at plus or minus one shaded, with its four edge lines labelled h1 to h4. Right: the 2–4–1 network with weights on the edges and biases in the nodes](../assets/nn01-square-network.svg)

2. **Everything outside the square.** You might expect to flip every fence. You do not need to. "Outside" is "NOT inside", and by De Morgan's law NOT(h₁ AND h₂ AND h₃ AND h₄) is (NOT h₁) OR … OR (NOT h₄): the point is outside when *at least one* fence disagrees, that is, when at most three of them fire. Keep the hidden layer and change only the output, to y=θ(3−h₁−h₂−h₃−h₄). A point exactly on an edge fires all four hidden units (z=0 fires), so it counts as inside the square and not outside: the two networks split the plane with no overlap and no gap.

![Left: the whole plane shaded except the closed square. Right: the same four hidden units, with the output changed to weights minus one and bias three](../assets/nn01-outside-square.svg)

3. **Two squares that share fences.** Two squares side by side, at the same height, need two ANDs and an OR. Built separately they use 4+4=8 edge units, a 2–8–2–1 network. But both squares have the same top edge and the same bottom edge, so one unit for each can feed *both* AND units. That leaves six edge units, a 2–6–2–1 network. A hidden unit is a reusable test, and any later unit may read it.

![Left: two shaded squares at the same height, with their shared top and bottom edges labelled t and u. Right: a 2–6–2–1 network in which t and u feed both AND units](../assets/nn01-two-squares-shared.svg)

A region that is not convex, or that falls into separate pieces, needs more. Build each convex piece with its own AND unit, then OR the pieces together. That adds a third layer of threshold units.

![Regular polygons with 3, 6, 12 and 48 sides around the unit circle, with their unit counts and how much too large their areas are](../assets/nn01-polygons-to-circle.svg)

**The result.** Any region of the plane can be approximated as closely as you like by a union of small polygons. So with enough units, **an MLP can represent any decision region to arbitrary precision**. MLPs are **universal classifiers**. The same construction works in any dimension, with hyperplanes instead of lines. A handwritten digit stored as a 28×28 image is a point in 784-dimensional space, and recognising the digit "2" means drawing a boundary around the region of that space where twos live.

```lab
nn-regions
```

> **Practice — Foundation:** Write the four edge units and the output unit for the square with corners (±2, ±2), centred at the origin. How many threshold units is that?
>
> **Hint:** Each edge is one inequality, such as x₁≤2, rewritten as step(2−x₁).

> **Practice — Core:** An L-shaped region is the union of the rectangle 0≤x₁≤3, 0≤x₂≤1 and the rectangle 0≤x₁≤1, 0≤x₂≤3. Build a three-layer network for it and count the units. Then reuse shared edges to reduce the count, and explain which edges can be shared.
>
> **Hint:** Both rectangles use the edges x₁≥0 and x₂≥0. A shared edge needs only one unit, read by both AND units.

> **Practice — Stretch:** Explain why a single perceptron's decision region in ℝᴺ is always convex, and why the AND of any number of perceptrons is also convex. What does this imply about where an OR layer is required?
>
> **Hint:** A half-space contains the segment between any two of its points. An intersection of convex sets is convex.

## 8. From polygons to cylinders

**The question.** The AND-then-OR construction needs three layers for regions in separate pieces. Can one hidden layer do it?

**The picture.** Stand inside a round room with many walls and count how many walls have you on their inside: all of them. Walk far away and look back. The walls on the near side still have you on their outside, but the walls facing away from you still count you as inside their half-plane. Far away, about half of the walls do. So instead of asking whether *every* wall agrees, ask *how many* agree.

**The derivation.** Take a regular N-gon around the unit circle, with outward edge normals at angles φₖ=2πk/N. Unit k fires when x₁cos φₖ+x₂sin φₖ≤cos(π/N). Inside the polygon all N units fire. For a point at distance r and angle α, unit k fires when r·cos(α−φₖ)≤cos(π/N). As N grows, cos(π/N)→1 and the angles α−φₖ spread evenly around the circle. The fraction of units that fire tends to the fraction of angles ψ with cos ψ≤1/r. For r>1 that excludes the interval |ψ|<arccos(1/r), of length 2arccos(1/r), so

$$\text{fraction firing}\ \to\ 1-\frac{\arccos(1/r)}{\pi}=\frac12+\frac{\arcsin(1/r)}{\pi}.$$

This equals 1 at r=1 and falls towards ½ as r→∞. The summed count looks like a **cylinder**: high on the disc and sloping down to a constant floor of N/2 everywhere else.

Thresholding the count at τN, for ½<τ≤1, gives a disc whose limiting radius r* solves ½+arcsin(1/r*)/π=τ, that is r*=1/sin(π(τ−½)). Because every cylinder has the same floor, you can add many cylinders at different places, subtract the floors, and threshold once. Arbitrary regions then need only **one hidden layer**, at the price of very many units.

```lab
nn-cylinder
```

> **Practice — Foundation:** Use the limit formula to give the fraction of units firing at r=√2, and the count threshold τ that makes the output a disc of radius √2.
>
> **Hint:** arcsin(1/√2)=π/4.

> **Practice — Core:** Two cylinders, each built from N units, are centred far apart. Write the single output unit that fires inside either disc of radius r*, using the summed counts S₁ and S₂. Explain why the floor of the other cylinder must be subtracted.
>
> **Hint:** Inside disc 1, S₁ is near its peak while S₂ is near its floor N/2. Write the condition as S₁+S₂−N/2 ≥ τN.

> **Practice — Stretch:** For finite N, explain why the region where the output fires is a polygon-like shape rather than an exact disc, and why its edges get smoother as N grows.
>
> **Hint:** The count changes only when the point crosses one of the N edge lines, so the region's boundary is made of pieces of those lines.

## 9. Continuous outputs: pulses and regression

**The question.** Classification answers yes or no. Many tasks need a number: a price, a temperature, the next sample of a waveform. Can threshold units produce a continuous output?

**The picture.** Draw a city skyline. Each building is a flat-topped block, and the skyline is the sum of blocks of different heights. A smooth curve can be approximated by a skyline of thin enough buildings. Three units build one building: one unit switches on at the left edge T₁, a second switches on at the right edge T₂, and a summing output computes step(x−T₁)−step(x−T₂), which is 1 between the edges and 0 outside. Scale each block by the height of the function there and add them up.

**A worked example.** Approximate f(x)=sin x on [0, 2π] with K blocks of equal width Δ=2π/K, each at the height of f at its midpoint. Inside a block, |x−c|≤Δ/2, and sin has slope at most 1, so the error is at most Δ/2=π/K. To guarantee an error below 0.05 you need π/K<0.05, so K≥63. The lab lets you check whether fewer blocks happen to suffice.

![Approximations of sin x by 4, 12 and 48 flat-topped pulses, with the threshold-unit count and maximum error under each](../assets/nn01-skylines.svg)

**Counting units.** Each block needs two threshold units, so K blocks need 2K units and a summing output. Neighbouring blocks share an edge, and that saves units. Write the skyline as a sum over edges:

$$\sum_{k=1}^{K} h_k\big[\theta(x-T_k)-\theta(x-T_{k+1})\big]=\sum_{k=1}^{K+1}(h_k-h_{k-1})\,\theta(x-T_k),$$

with h₀=h_{K+1}=0. This is a **staircase** with K+1 threshold units. In one dimension, the error falls in proportion to 1/K. In d dimensions the number of blocks grows like (1/ε)ᵈ for error ε, which is why the next chapters care about depth and smoother activations.

**Other activations change the count completely.** A network of units with activation sin z can compute cos(2x) exactly with *one* unit: cos(2x)=sin(2x+π/2), so the weight is 2 and the bias is π/2. Matching the activation to the function can replace thousands of threshold units.

**What else networks do.** The same building blocks do more than classify and regress:
- networks with loops remember patterns, as Kubie proposed in 1930;
- networks can represent probability distributions over integers, real numbers and complex numbers, both conditional and unconditional, and can generate data from them;
- most interesting AI tasks are functions, such as voice signal → transcription, image → caption, and game state → next move, so a network can in principle approximate them.

```lab
nn-pulses
```

> **Practice — Foundation:** Write the three-unit network for a pulse of height 1.5 on the interval [2, 5], and evaluate it at x=1, x=3 and x=6.
>
> **Hint:** The output weights on the two threshold units are +1.5 and −1.5.

> **Practice — Core:** For f(x)=x² on [0, 1] with K equal blocks at midpoint heights, bound the maximum error in terms of K and find the smallest K that guarantees an error below 0.01.
>
> **Hint:** The slope of x² on [0,1] is at most 2, so the error is at most 2·(Δ/2).

> **Practice — Stretch:** Show that a staircase with K+1 threshold units and a summing output computes exactly the same function as K separate pulses with 2K threshold units. Then say what goes wrong at the right end if you forget the final unit.
>
> **Hint:** Expand the telescoping sum and collect the coefficient of each θ(x−T_k).

## 10. Code katas

These five short programs rebuild the chapter's models in JavaScript, with tests that run in your browser: a McCulloch–Pitts unit, perceptron training, Oja's rule, XOR from three units, and parity in n+1 units. Each solution also shows a NumPy version. The last kata contains a surprise: parity is not a function that needs depth when units can count.

```lab
nn-katas
```

## 11. Seven runnable coding labs

These labs use standard-library Python and run in the reader's browser workspace or locally with `python -m labs.checks <task>`. Each one has a reference implementation and behavioural checks, including invalid inputs.

### Lab A — a threshold gate that cannot be fooled by cancellation

Open [threshold gate](../../labs/exercises.py). Implement `threshold_gate(weights, bias, inputs)`, returning 1 when Σwᵢxᵢ+b≥0 and 0 otherwise. Accept nonempty lists or tuples of finite reals of the same length, and a finite real bias. Reject bools, mismatched lengths and non-finite values with ValueError, using the supplied `_finite_real_vector`. Use `math.fsum`: a naive running sum can lose a small term between two huge cancelling ones and flip the decision. Do not mutate the inputs.

### Lab B — fences, enclosures, and votes

Open [half-space composition](../../labs/exercises.py). Implement `compose_halfspaces(halfspaces, k, point)`, returning `(count, fires)`: how many of the threshold units fire at the point, and whether at least k of them do. With k equal to the number of units it is an AND (a convex polygon), with k=1 it is an OR, and in between it is the vote that builds a cylinder. Validate every unit, keep k an integer between 0 and the number of units, and do not mutate the inputs.

### Lab C — Hebb diverges, Oja settles

Open [Hebbian update](../../labs/exercises.py). Implement `hebbian_update(samples, w0, eta, rule)`, running one pass of Hebb's rule (`"hebb"`) or Oja's rule (`"oja"`) over the samples in order and returning the new weights. Detect divergence: if the response or any weight becomes non-finite, raise ValueError instead of returning infinities. The checks confirm that Oja's weights reach unit length along the top eigenvector of a correlated dataset, while Hebb's grow without bound.

### Lab D — the error-correction rule

Open [perceptron training](../../labs/exercises.py). Implement `perceptron_train(samples, labels, eta, max_epochs)`, returning `(weights, bias, epochs_run, converged)`. Start from zero, visit the samples in order, fire on z≥0, and update only on mistakes. Stop after a clean epoch or after `max_epochs`. The checks replay the OR trace from Section 5 exactly, confirm the rule learns AND, NAND, NOR and three-input majority, and confirm it reports failure on XOR instead of looping forever.

### Lab E — any truth table becomes a network

Open [DNF network](../../labs/exercises.py). Implement `dnf_network(truth)`, which takes a truth table in binary order and returns one hidden AND unit per true row plus an OR output. Each hidden unit must fire on exactly its own row. Notice how the bias lets a unit fire on the all-zero input, the case a strict McCulloch–Pitts net cannot handle. The checks build all sixteen two-input functions and random four-input ones and evaluate every row.

### Lab F — a skyline with shared walls

Open [staircase weights](../../labs/exercises.py). Implement `staircase_weights(heights, edges)`, rewriting K pulses as K+1 threshold units whose coefficients are the jumps h_k−h_{k−1}. The checks compare the staircase with the pulse sum at interior points and exactly on the edges, where the convention step(0)=1 decides which pulse a boundary point belongs to.

### Lab G — an illusion from five units

Open [heat/cold net](../../labs/exercises.py). Implement `heat_cold_sensations(heat, cold)` from the units a and b of Section 2, one step of delay each, and return the felt heat and felt cold at every step. The checks compare your network with the unrolled formulas on two hundred random receptor histories, so the unit-by-unit construction must match the logic exactly.

## 12. Exercises · by hand

These are the paper problems of Lab 9. Work each with pen and paper, then type numerical answers to check them, submit your written argument for marking, or open the reference solution. The panel tracks how many you have attempted.

```lab
nn-problems
```

**A1 · Foundation · paper — XOR is not linearly separable.** Write the four inequalities a single perceptron w₁x₁+w₂x₂≥T would need for XOR, and derive a contradiction algebraically, without a picture.

**A2 · Core · paper — at least 3 of 5, and exactly 2 of 3.** (a) Give one perceptron for "at least 3 of 5 inputs are on". (b) Prove that "exactly 2 of 3 inputs are on" needs more than one neuron, and build a two-layer network for it.

**A3 · Core · paper — a diamond with a hole.** Build a network for 1≤|x₁|+|x₂|≤2. How many layers does the natural construction use? Can it be done with one hidden layer? Lab 5 checks your answer.

**A4 · Core · paper — two disjoint shapes.** Build a network for the union of the diamond |x₁+1|+|x₂|≤1 and the square 1≤x₁≤2, −0.5≤x₂≤0.5. Count the neurons, and say where the OR happens.

**A5 · Stretch · paper — a union with one hidden layer.** Redo A4 with only one hidden layer of threshold units. Where does your approximation fail, and how do more units shrink the error?

**A6 · Stretch · paper — the cylinder derivation.** Take a regular N-gon around the unit circle, with edge normals at θₖ=2πk/N. (a) Write neuron k's weights and bias. (b) Show that all N fire inside. (c) Show that as N→∞ the fraction firing at distance r>1 tends to ½+arcsin(1/r)/π. (d) Where should the output threshold sit for a disc of radius 3, and how do cylinders combine? Lab 6 shows this.

**A7 · Stretch · paper — parity: shallow versus deep.** (a) Count the units in the minterm (DNF) construction for n-bit parity with one hidden layer. (b) Count the units in a tree of two-input XOR blocks. (c) Find a one-hidden-layer network with only n+1 units. What does this say about whether depth is needed? Kata 5 checks (c).

**A8 · Core · paper — how many regions can lines make?** (a) What is the largest number of regions that N lines can cut the plane into? (b) In a network of threshold units, why can the first hidden layer of N units never distinguish more points than that, however deep the network is?

**A9 · Core · paper — Hebb's knob argument.** Hebb argued (p. 66) that bigger synaptic contacts let fewer active inputs fire a cell. Model a cell as a threshold unit with four inputs, all weights 1 and threshold 4. Which input patterns fire it? Now Hebbian growth raises the weights of inputs 1 and 2 to 1.5. Give the smallest number of active inputs that can fire the cell, and list every pattern with exactly three active inputs that fires it.

**A10 · Core · paper — reuse the fences, twice.** (a) Three squares sit in a row at the same height: −5≤x₁≤−3, −1≤x₁≤1 and 3≤x₁≤5, each with −1≤x₂≤1. Using shared edges wherever possible, how many threshold units does the edge–AND–OR network use in total? (b) For the two-square network of Section 7, give a network for the region outside both squares that keeps every hidden unit and changes only the output layer. Check a point on a shared edge.

## 13. Review quiz

Twelve mixed questions across the whole chapter, including some details that only the reading list covers.

```lab
nn-quiz
```

## 14. Exercises · NumPy

These run locally with NumPy. Use fixed seeds and report the numbers you measured, not only whether a check passed.

**B1 · Foundation · NumPy — score a region network on a grid.** Vectorise the hexagon network with vertices (±1, 0) and (±0.5, ±1) over a 600×600 grid on [−3, 3]², and report the fraction of grid points where it agrees with the exact region. Then move the top edge unit to step(1.05−x₂) and report the agreement again. Explain what the lost fraction measures, and why agreement on a grid is an estimate of an area.

**B2 · Core · NumPy — Hebb, Oja, and the eigenvector.** Draw 5,000 samples from a zero-mean Gaussian with covariance [[2, 1.2], [1.2, 1]] (seed 0). Run Oja's rule with η=0.002 and compare the learned direction with the top eigenvector from `np.linalg.eigh`, reporting the angle in degrees and the final length. Then run plain Hebb with the same η and report how many samples it takes for the length to exceed 10⁶.

**B3 · Core · NumPy — count the cylinder.** For N=128 edge units around the unit circle, estimate the fraction of units firing at r=1.5, 2, 4 and 10 by averaging over 360 directions. Compare each with ½+arcsin(1/r)/π and explain the size of the gap.

**B4 · Stretch · NumPy — perceptron updates and the margin.** Generate 200 points uniformly in the unit square, label them by whether x₁+2x₂>1.2, and drop points within 0.05 of the boundary (seed 1). Train the perceptron rule to convergence with η=1, record the number of updates, and compare it with (R/γ)², where R is the largest input length (with a constant 1 appended for the bias) and γ is the smallest distance of a point to the true boundary after normalising. Repeat with the margin filter at 0.01 and explain the change.

## 15. Exercises · PyTorch

**C1 · Core · PyTorch — the threshold has no useful gradient.** Build a perceptron as `torch.heaviside(x @ w + b, torch.tensor(1.0))` with `w` requiring gradients, compute a squared error on a few points, and call `backward()`. Report what happens. Then replace the step with `torch.sigmoid(k*(x @ w + b))` for k=1, 10 and 100, and report the gradient norm. Explain why the perceptron rule is not gradient descent on the classification error, and what this means for training networks of threshold units.

**C2 · Stretch · PyTorch — a region network as tensors.** Write the two-shapes network of A4 as two weight matrices and threshold vectors, evaluate it on a batch of one million random points in [−3, 3]² in one call, and check it against a direct Python evaluation on 1,000 of them. Report the time per point and the agreement.

## 16. Derivations to own

Rebuild each of these without notes, including the assumptions, and know a case where the result fails when an assumption is dropped.
1. **A single perceptron cannot compute XOR.** Four inequalities and a contradiction. The result fails if the unit has an extra input x₁x₂, which makes XOR separable.
2. **Every Boolean function is a one-hidden-layer network.** The DNF construction with one AND unit per true pattern and one OR unit. Know why it can need 2ᴺ⁻¹ hidden units.
3. **A strict McCulloch–Pitts net cannot fire on all-silent input.** No unit receives excitation, so none fires. A constant input or a bias removes the restriction.
4. **Hebbian growth.** From Δw=ηxxᵀw to dw/dt=Cw, the solution in eigenvectors, and d‖w‖²/dt=2wᵀCw≥0.
5. **Oja's normalisation.** d‖w‖²/dt=2(wᵀCw)(1−‖w‖²), the resting points as unit eigenvectors, and why only the top one is stable.
6. **The cylinder limit.** The fraction ½+arcsin(1/r)/π and the radius r*=1/sin(π(τ−½)).
7. **The staircase.** Telescoping 2K pulse units into K+1 edge units, and the error bound L·Δ/2 for a function with slope at most L.

## 17. Exercises · cumulative

**M1 · Core · mixed — from committee to perceptron.** A McCulloch–Pitts unit has excitatory inputs A, B, C, an inhibitory input D, and threshold 2 (fire when at least two excitatory inputs are on and D is off). Write a single perceptron with real weights and a bias that computes the same function on all sixteen inputs, and justify the size of D's weight. What feature of the McCulloch–Pitts model does this show is not needed?

**M2 · Core · mixed — what Bain would have needed.** Using Bain's own figure of 25,000 fibres per acquisition at 200,000 acquisitions, and modern figures of about 1.6×10¹⁰ cortical neurons and 10¹⁴ synapses, how many acquisitions could the modern synapse count support at Bain's rate? State two reasons the comparison is misleading.

**M3 · Stretch · mixed — a learned AND that cannot change its mind.** Train a perceptron on AND to convergence, then change the task to OR and keep training from the learned weights. Explain why it relearns quickly, and contrast this with a B-type machine, whose only change is flipping whole connections. What property of the perceptron's weights makes learning gradual?

**M4 · Stretch · mixed — is Hebb's rule a perceptron rule?** Write the perceptron update as a Hebbian product of an input and an error signal. Explain the role of the teacher signal d, and why plain Hebbian learning with y in place of d−y cannot learn to stop. Then say what Oja's forgetting term does that the perceptron's error term also does.

## 18. Exercises · checkpoint

**K1 · Foundation · gate — name the parts.** Define a threshold unit, its pre-activation and its decision boundary. Say what makes a function linear rather than affine, and which of the two a perceptron applies its threshold to.

**K2 · Stretch · gate — prove a separation result.** Prove that no single threshold unit computes "x₁ and x₂ are equal" on two Boolean inputs, then give a network of three threshold units that does, with weights and thresholds.

**K3 · Core · gate — size a region network.** A convex polygon with 9 edges must be detected, and a second, disjoint convex polygon with 5 edges must be detected too, with one output that fires inside either. Using the edge–AND–OR construction with no shared edges, how many threshold units does the network use in total?

**K4 · Core · gate — debug a learning rule.** A student's perceptron update is w←w+η·d·x on every example, whether the prediction was right or wrong. On separable data with labels 0 and 1, explain what this rule actually computes, show with a two-point example that it can fail to separate data the true rule separates, and give the one-line fix.

**K5 · Stretch · gate — critique a claim about Hebbian learning.** A blog post says: "Hebb proved that neurons that fire together wire together, and Hebbian learning is unstable because Hebb forgot about weakening." Identify each error of fact or attribution, and state precisely what is unstable and why.

**K6 · Stretch · gate — an unfamiliar activation.** A unit outputs |z| instead of a threshold, where z=w·x+b. Show that a single such unit followed by a threshold output can compute XOR on two Boolean inputs, giving the weights. What does this say about the claim that "one unit cannot compute XOR"?

## Research connection and reading

The readings below are the primary sources behind this chapter. Each is worth reading at least in part.
- McCulloch, W. S., & Pitts, W. (1943). A logical calculus of the ideas immanent in nervous activity. *Bulletin of Mathematical Biophysics*, 5, 115–133. Read the five assumptions, Theorem 3, and the heat/cold construction.
- Hebb, D. O. (1949). *The Organization of Behavior*. Wiley. Chapter 4, pp. 60–78, states the postulate and the cell assembly.
- Rosenblatt, F. (1958). The perceptron: a probabilistic model for information storage and organization in the brain. *Psychological Review*, 65(6), 386–408. Compare its value-reinforcement schemes with the error-correction rule taught here, and read its own statement of limits on pp. 404–405.
- Turing, A. M. (1948). Intelligent machinery. NPL report, published in *Machine Intelligence 5* (1969). Read with Copeland, B. J., & Proudfoot, D. (1996), On Alan Turing's anticipation of connectionism, *Synthese*, 108, 361–377.
- Bain, A. (1873). *Mind and Body: The Theories of Their Relation*. Pages 91–117 contain the groupings, the capacity estimate and the learning principle.
- Minsky, M., & Papert, S. (1988). *Perceptrons*, expanded edition, Epilogue: "The new connectionism", pp. 247–280. Their own account of what the 1969 book proved, and their critique of back-propagation's scaling.
- Rumelhart, D. E., McClelland, J. L., & the PDP Research Group (1986). *Parallel Distributed Processing*, vol. 1, ch. 2, for the eight requirements.

Two open questions connect this history to current research. First, Minsky and Papert asked how the cost of learning grows with problem size; scaling laws for modern networks are a partial answer, not a settled one. Second, Hebb's postulate is about *causal timing*, and spike-timing-dependent plasticity in neuroscience still has no agreed counterpart in the training of artificial networks.

## Mastery check and remaining coverage

You are ready for NN02 when you can, without notes: build AND, OR, NOT and XOR from threshold units; prove that one unit cannot compute XOR; derive why Hebbian weights grow without bound and what Oja's term changes; run the perceptron rule by hand; and design a network for any union of polygons with the number of units counted. The checkpoint K1–K6 tests these.

This chapter does not prove the perceptron convergence theorem (NN03), compare the size of shallow and deep networks for the same Boolean function (NN02), or train networks of more than one layer (NN04–NN05). Threshold units have no useful gradient, so those modules replace them with smooth activations.
