# LA01 video: review and proposed teaching approach

## Implemented edition

The revised single lesson video is complete: **72 minutes 59 seconds**, 1920×1080,
30 fps, with the existing Kokoro neural voice at normal speed. It combines a new
opening, conceptual bridges and ending with selected original mathematical
animations and corrected narration. Exercises and lab instructions remain in the
written chapter.

The complete spoken script and shot storyboard are in
`docs/LA01_VIDEO_SCRIPT_AND_STORYBOARD.md`; reproducible production code is in
`scripts/videos/la01/`. The delivery package is in
`~/Downloads/GroundUp Lab YouTube/LA01 concept-led revision/`.

Validation passed: all 264 shot durations and frame counts, the complete final
video/audio decode, all 12 embedded chapter timestamps, and caption text coverage
of every spoken word (1,353 caption blocks). Visual review sampled the opening,
chapter entries and selected retained illustrations; it was not continuous human
viewing of the entire export.

Published Public on [GroundUp Lab](https://youtu.be/ZBsU14xtEBU), in the **Linear Algebra** playlist, with custom thumbnail, English captions and 12 chapter timestamps. YouTube completed checks with no issues found. The video is embedded near the top of the live LA01 chapter with 12 timestamp links; desktop, mobile and seek navigation checks passed.

## What this review covers

Reviewed the finished video's captions and chapter timings, all 15 scene narration lists, the production brief, animation code excerpts, and sampled production frames. This is a script, structure, and sampled visual review, not a continuous viewing or listening assessment of the entire film. Voice quality is taken from the user's assessment.

Materials:

- Final video and captions: `/Users/sumilkhosla/Downloads/GroundUp Lab YouTube/LA01 video/`
- Scene scripts and brief: `/private/tmp/claude-501/-Users-sumilkhosla-workspace-groundup-lab/4526ee22-2d62-4a4d-9628-05bc10648cd0/scratchpad/la01video/`
- Source chapter: `content/02-linear-algebra/01-vectors-spaces-bases.md`

## Diagnosis

The video contains substantial conceptual teaching and several good analogies. The problem is how they are organised: the film follows the chapter's sequence, repeatedly explains its own structure, and gives a large amount of formal development before paying off the central questions.

It runs approximately **2:24:34**, with about **24,500 words** of scene narration. Duration alone is not the problem; the question is what holds the learner's attention through it.

| Existing passage | What works | What I would change |
| --- | --- | --- |
| Opening, 0:00–3:28 | The boat losing its ability to move off a line is a strong visual idea. | Stay with the boat and give it a destination. The opening moves from that problem into large matrix dimensions, conventions, a roadmap at 2:09, and a description of the teaching format at 3:13. These interrupt the question just as it becomes interesting. |
| Vector views, 3:28–8:00 | Moving an arrow without changing its displacement is useful. | Introduce representations as needed. Four views, functions, embeddings, and residual streams are too many new destinations before the learner has used the basic idea. |
| Axioms, 8:00–19:13 | The chess-piece analogy explains why rules can matter more than material. | Explain the purpose of the axioms after the learner has used addition and scaling; keep exhaustive formal verification in the written chapter. The main story needs addition, scaling, and their consequences first; proving cancellation facts this early delays reachability. |
| Span, 24:36–32:53 | Reachable territory, collapse, and multiple recipes are excellent material. | Bring these forward. Avoid restarting in a kitchen before returning to the map. Make the same target and same arrows carry the explanation. |
| Independence and exchange, 32:53–56:15 | Redundancy and the counting bound have meaningful payoffs. | Establish the learner's need for a redundancy test, then derive the zero combination. Teach basis and unique coordinates before the full exchange argument. |
| Basis, 1:05:00–1:18:03 | The skewed street grid and exploding coordinates are compelling. | Reach the first basis insight much earlier. Separate the key uniqueness argument from the subsequent chain of basis existence and dimension theorems. |
| Matrices, 1:27:12–1:41:37 | Combining columns connects the pictures to computation. | Introduce the column-combination equation soon after the learner understands two movement controls. |
| Numerical decisions, 2:01:05–2:14:06 | Nearly parallel thrusters give the story a surprising consequence. | Use this as a major payoff. Explain sensitivity in this video; leave detailed elimination mechanics, tolerance policies, and the Hadamard-ratio derivation in the written chapter where they do not advance the conceptual story. |
| Ending, 2:14:06–2:24:34 | Some exercise puzzles are valuable. | Extract those puzzles into teaching moments. Put return-value contracts, helper functions, exercise-bank counts, and tutor submission instructions in the written chapter. End the main explanation by resolving its opening problem. |

The brief explicitly asks for both intuitive motivation and complete coverage of every worked example, definition, theorem, and proof, with each section becoming a scene. That encourages textbook order and exhaustive coverage. A new version needs a different organising instruction, not simply a request to sound more conversational.

## Proposed central story

**Working title: “Two controls, a whole world: where vectors can take you.”**

Use an idealised movement simulator with two fixed movement directions. Each control sets a signed displacement; it can be fractional, negative, or arbitrarily large. This avoids implying that real boat thrust, acceleration, or energy is the mathematical model.

Keep one target visible through the main argument. Each new mathematical term should name something the viewer has already encountered:

1. How do I get there? → linear combination.
2. Where could I possibly get? → span.
3. Does another control let me get anywhere new? → dependence.
4. When does each destination have exactly one set of settings? → basis and coordinates.
5. How many independent controls can this space support? → dimension.
6. How do I write the machine compactly? → matrix multiplication.
7. Why can a valid control system still be difficult to use? → near-dependence and sensitive coordinates.

The analogy must do explanatory work. A decorative boat followed by unrelated equations will reproduce the current problem.

## Format rule for lesson videos

Use **one video per lesson**, with **60–90 minutes as the usual duration range**. Use timestamped chapters inside that video for navigation. Do not split a lesson into companion videos or separate proof, exercise, or lab videos. Duration is a rule of thumb: spend time on understanding rather than padding to a target.

The video should explain the lesson's major concepts through a coherent story, with enough illustrations, visual reasoning, and selected proofs to make the ideas click. The written chapter carries the exercise bank, comprehensive derivations, and lab instructions.

## LA01 storyboard: approximately 80 minutes, one video

These are editorial targets. They allocate time for discovery and understanding, rather than reproducing every chapter item.

| Approximate time | Learner's question | Scene and conceptual payoff |
| --- | --- | --- |
| 0:00–4:00 | Why can't I reach that target? | Two controls point along the same line. Try forwards, backwards, and combined settings. Ask for a prediction before turning the second direction. Establish the central problem without a long syllabus tour. |
| 4:00–13:00 | What changes when I turn one direction? | Introduce vectors as moves, addition and signed scaling. Fix `u=(2,1)` and `v=(1,2)`, target `(4,5)`. Show `u+2v` reaching it, then vary all real settings to reveal span. A bounded patch is a window into the span, not the entire span. |
| 13:00–23:00 | Would another control add capability? | Add `w=u+v`. Compare settings `(1,2,0)` and `(0,1,1)` reaching the same target. Subtract them to obtain the zero-producing setting `(1,1,-1)`. Derive dependence and explain why pairwise nonparallel directions can still form a dependent list. |
| 23:00–35:00 | When do settings become an address? | Remove redundancy. Explain basis through existence and uniqueness of representations, including the short subtraction proof. Keep the destination fixed while changing grids: its address in `B=((2,1),(1,2))` is `(1,2)`; in `Q=((2,1),(-1,1))` it is `(3,2)`. Extend to dimension in 3D and an intuitive exchange argument explaining why basis size is fixed. |
| 35:00–44:00 | What makes a whole reachable world? | Explain subspaces through closure, with a few revealing counterexamples. Motivate the vector-space rules as the reason this reasoning transfers to functions and polynomials. Demonstrate one such transfer; leave exhaustive axiom checks in the chapter. |
| 44:00–52:00 | How do reachable worlds combine, and what if home moves? | Use intersecting lines and planes to explain sums, overlap, and unique splitting in direct sums. Translate a line to distinguish a subspace from an affine set. Explain why differences cancel the anchor and weights summing to one preserve it. |
| 52:00–62:00 | Where are the matrices? | Place the familiar arrows side by side as columns and animate `Vc=c₁v₁+c₂v₂`. Derive a coordinate conversion from the unchanged vector. Show why outputs of a factored update `ΔW=LR` lie in the span of the columns of `L`. The rank restriction applies to the update, not necessarily to `W+ΔW`. |
| 62:00–70:00 | Does independence mean perpendicularity? | Add inner-product geometry after reachability is understood. Use signed shadows to explain projection and dot products, distinguish orthogonality from independence, and illustrate feature overlap. Clearly distinguish signed projection length from the dot product. |
| 70:00–78:00 | Can a valid basis still be difficult to use? | With `b₁=(1,0)`, `b₂=(1,ε)`, target `(0,1)`, derive settings `(-1/ε,1/ε)`. Show huge cancellation and sensitivity. For every nonzero ε the plane remains reachable; at zero the target becomes impossible. Connect briefly to numerical tolerances. |
| 78:00–80:00 | What can I now explain? | Return to the original target. Ask predictions about a redundant direction, a changed basis, and near-parallel directions. Resolve the opening question and briefly invite exploration in the chapter. |

Use the city/address analogy specifically when distinguishing an object from its coordinates. Introduce other analogies only when they clarify something the movement model cannot explain well. Keep transitions between the timestamped sections connected to the same central questions.

## Sample replacement opening

**Visual:** A small craft, two control sliders, one destination off the controls' shared line. No initial syllabus card.

> You can push this craft forwards. You can push it backwards. You can use either control, or both together.
>
> Can you get it to that green point?

**Visual:** Try several settings. Leave a few trails; each lies on the same line. Allow a short pause for a prediction.

> More power takes you farther along this line. Reversing takes you the other way. But the target stays out of reach.
>
> Both controls are giving you versions of the same move.

**Visual:** Rotate the second movement arrow away from the first. Keep the target fixed.

> What if we turn this one?
>
> Now make one move, then the other. We can land on the target. And by changing how much of each move we use, we can reach every point in the plane.
>
> That little change—from a line to a plane—is the first idea we need in linear algebra.

**Visual:** Keep the movement directions visible. Add a third control pointing along their sum.

> So here is the next question. If two controls can reach the whole plane, what would a third one actually add?

This opens a question that subsequent scenes answer. It does not reveal the entire syllabus before the viewer has a reason to care.

## Scope: teach the concepts, leave practice in the chapter

The video should use only enough illustrations to establish each concept and expose its most important misconception. It does not need to reproduce every exercise, example, theorem, or proof. The chapter remains the place for systematic practice and complete formal development. The user's clarification supersedes the original production brief's exhaustive coverage requirement.

Cover the lesson's major conceptual connections within the single video, using the internal chapters above. Select examples by what they make understandable. One well-chosen example can establish several connected ideas; add another only when it reveals a new distinction or failure mode. There is no requirement to narrate every definition, theorem, proof, or practice prompt.

Keep full formal treatments, extended calculations, lab contracts, helper functions, exercise navigation, and assessment expectations in the written chapter. Selected proofs belong in the video when they explain why a concept works; for example, subtracting two representations to expose a zero combination. Do not create extra videos to accommodate omitted written material.

## Direction for narration and animation

- Build each segment around a question, an attempted answer, an observation, and the explanation. Vary the rhythm when the idea calls for it.
- Ask for predictions before revealing the result. Give viewers a short silent interval to think; place longer calculations behind an explicit pause invitation.
- Speak the relationship and its reason. Let the screen carry routine coordinate arithmetic; narrate an algebra step when the step itself explains the idea.
- Introduce formal statements after the viewer understands the phenomenon. Keep important proofs, especially the connection between duplicate representations and zero combinations.
- Keep arrows, colours, targets, and coefficients consistent across adjacent scenes. Change one mathematical feature at a time so the consequence is visible.
- Use motion to show a mathematical change or comparison. Animating text to keep a slide moving does not by itself advance understanding.
- Separate reachable directions from physically available force, budget, or speed. Dependence means no extra reachable directions under unrestricted signed coefficients; a real extra thruster can still improve physical performance.
- Reserve terms such as residual stream, Gram matrix, singular value, and down-projection until their meanings are needed and explained.
- End on an insight or a prediction the learner can now make. Keep homework logistics in the written chapter.

## Suggested next production step

Write and storyboard the first five minutes before generating the whole film. Review the question, prediction pauses, visual continuity, and conceptual payoff at script level. Produce that short segment using the existing voice and animation tooling, then assess whether the viewer can explain what changed and why. Settle the teaching approach before committing to the remaining scenes.
