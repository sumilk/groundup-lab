# LA02 video — a lesson that feels taught (plan for review, v2)

**Status:** proposal, not started. **Format:** unchanged. One concept-first video for the lesson, 60–90 min; exercises stay in the chapter. **Voice engine:** Kokoro (local). No external TTS.

## 0. The acceptance criterion

> **Does this feel like someone guiding me through the mathematics?**

> **…and is it intuitive for someone new to the material?**

The viewer is assumed to know LA01 and school algebra, nothing more. Every decision below serves these two questions, and every gate is judged against them. Engineering changes are tools; none of them counts as progress on its own. Feedback on LA01 was that it felt robotic. Its pipeline was reviewed for correctness and frame layout, but no one ever judged it as a lesson being taught.

What "guided" means in practice. These are the things a viewer would notice:
- The narrator is clearly working on **one specific idea** at a time and knows why it comes next.
- The viewer is asked to **predict or inspect** something, and is given the time to do it.
- The picture on screen **is the mathematics being discussed**. It changes because the argument moves on, not because a slide changed.
- Emphasis falls on the words that carry the idea. Equations are read at a speed you can follow. Nothing sounds like a template.

## 1. What made LA01 feel generated

| Area | What happened | Effect |
|---|---|---|
| Writing | Paragraphs of explanation with stock transitions ("Notice something…", "Here's…", "Hold that thought"). Ideas were often stated before the viewer had a reason to want them. | Sounded like narration *about* a topic, not someone teaching it. |
| Delivery | Each beat synthesised separately; a fixed 0.3 s gap; a separate slowed-down speed for technical beats; breaths trimmed. | Every sentence ended in the same falling tone with the same rhythm. |
| Visuals | A title card for every act, then fades and text appearing in time with each sentence. The picture often reset between ideas. | A slide-deck template, not one developing piece of maths. |
| Pauses | Pause lengths were set by a formula, not by what the viewer was doing at that moment. | Silence came where the template put it, not where thinking happens. |
| Review | Checked for correctness, frame layout and caption timing. No one watched it as a learner. | Nothing caught the overall feel. |

## 2. Changes

### A. Writing: one specific idea, taught

When writing each idea, check that it has these five ingredients. This is a **writing checklist, not a presentation template**. Order, proportion and visibility vary from idea to idea. Some ideas open with the worked example. Some need no explicit question. A prediction pause is used only where there is something meaningful for a newcomer to predict. Script review flags any run of ideas that sound alike in shape.

1. **The question.** A concrete thing the viewer can't answer yet, posed about the picture on screen. ("These two columns, and this target. Which combination lands on it?")
2. **The prediction (where it earns its place).** The viewer is invited to guess, with an actual pause (see D). The guess should be possible from what is on screen.
3. **The worked example.** The specific numbers, computed on the picture, step by step.
4. **The explanation.** *Why* it came out that way: the general statement, earned by the example just seen.
5. **What it changes.** One sentence on what the viewer can now see or do that they couldn't before. Not a slogan.

Writing rules:
- **Intuition before formalism, for a newcomer.** The viewer should be able to guess the idea from the picture before it has a name or a symbol. Each unit uses only what LA01 or an earlier unit has built; anything else is introduced on screen first. If a unit only makes sense to someone who already knows the result, it gets rewritten.
- **Specific over general.** Name the numbers, the arrow and the line. "The second column, minus one and one" rather than "the second vector".
- **No stock transitions.** If two ideas need a bridge, the bridge is the next question, not a phrase like "Now let's…" or "Here's the thing". The script review strikes them.
- **No invented personal asides or feelings** ("this surprised me", "I love this part"). The narrator has no biography; any engagement comes from the maths.
- **No hype or filler summaries** ("powerful", "beautiful", "and that's the key insight").
- **Spoken notation:** say what a symbol means the first time, then use its name. The screen carries the notation.
- **Read-aloud gate:** each unit is read aloud by a person before any scene work. Anything that sounds like reading rather than explaining gets rewritten.

### B. Delivery: chosen by listening, not assumed

Paragraph-level synthesis, word timestamps and speed settings are **candidates**. We don't assume any of them gives natural speech; a listening test decides.

**Test passage, about 90 s,** taken from LA02 §1 ("one system, two pictures"). It must contain all three hard cases:
- **motivation:** why "can these columns reach b?" is the question worth asking;
- **an equation read in context:** `2 a₁ + 3 a₂ = (1, 5)`, worked through entry by entry;
- **a quiet thinking pause:** "Before I draw the lines, where do you think they cross?" followed by real silence.

**Variants to render, audio only, for this test alone:**

| Variant | What changes |
|---|---|
| V0 | LA01 pipeline as is (per-beat synthesis, 0.3 s gaps, slowed technical speed). This is the baseline. |
| V1 | One Kokoro call per teaching unit, cut into beats afterwards using word timestamps. |
| V2 | V1 plus punctuation and phrasing shaped for delivery: commas and em dashes where a teacher would breathe, questions written as questions, equations split into spoken chunks. |
| V3 | Best of V1/V2 with 2–3 Kokoro voices or one voice blend, at speed 0.95 vs 1.0. |

**Judged on:**
1. **Emphasis:** does stress land on the word carrying the idea ("*three* copies of the *second* column")?
2. **Phrasing:** are the breaks in the right places, especially inside the equation?
3. **Pronunciation:** symbols, numbers, "a sub one", "R two".
4. **The criterion:** does it sound like someone explaining, or reading?

If no variant passes, we stop and discuss before building anything else.

**Ninety seconds can't measure fatigue.** That is tested separately: once the delivery is chosen, someone listens to the first full section, *One system, two pictures*, **continuously, in one sitting** (step 5). Fatigue that only shows up over 15+ minutes, such as a recurring intonation pattern or a sameness in pacing, is caught there, before the remaining acts are produced.

### C. Visuals: one picture, developed

- **One mathematical picture per idea, kept on screen** while the explanation develops it.
- **Never merge different spaces into one plane.** When an idea involves both inputs and outputs, show them as two clearly labelled panels connected by the map. In the sample:
  - **Input space** (left, "x = (x, y): the recipe") holds the two row lines 2x − y = 1 and x + y = 5, crossing at the point **(2, 3)**.
  - **Output space** (right, "Ax: where the recipe lands") holds the columns a₁ = (2, 1) and a₂ = (−1, 1) (LA01's blue and teal) and the target **b = (1, 5)**.
  - An arrow labelled **A** connects the panels: the input point (2, 3) is carried to b.
  
  Both panels are ℝ² here, which is exactly why a single plane would mislead. The recipe and the target are different kinds of thing, living in different spaces.
- **Movement shows a relationship or a calculation.** For example, in the output panel, two copies of a₁ laid tip to tail and then three of a₂, landing on b. Then the matching highlight in the input panel shows that the recipe (2, 3) *is* the crossing point there, and the A arrow shows how one becomes the other.
- **What gets cut:**
  - title cards before every section (chapter markers live in the YouTube chapters instead);
  - fade-in and fade-out as the default transition;
  - sentences typed onto the screen;
  - decorative motion such as pulses, glows and sweeping cameras.
- **Text on screen is limited to:** labels on objects, the equation currently being worked, and a term at the moment it is named.
- **Changing to a new picture is a teaching event.** The old picture transforms into the new one when they are related; it only clears when the topic genuinely changes.
- Kept from LA01: the cast stays constant, readouts never contradict the narration, objects leave once their job is done, and nothing is illegible.

### D. Pauses: placed for the viewer

- A pause exists because the viewer is **doing something**: predicting, inspecting a picture, reading an equation that just finished, or connecting two things on screen.
- Each pause is written into the script with its purpose and length, e.g. `⏸ 3 — predict the crossing point`, `⏸ 1.5 — read the finished equation`. Script review checks that every prediction and every newly finished equation has one, and that no pause lacks a purpose.
- No random timing variation, and no fixed gap between beats. Between sentences within a unit, the gap is whatever the synthesis produced. Every other silence is authored.
- Room tone or music is a finishing touch at most. It is not counted as fixing delivery, and it is decided after the sample is approved.

### E. Engineering (in service of A–D)

Built in a new `scripts/videos/la02/` (copied from `la01v3`, which stays untouched), and only as far as the tests need:
- Rebuild the venv (the LA01 one lived in an old session scratchpad).
- Synthesise a whole teaching unit at once and cut it into beats using word timestamps. The PyTorch `kokoro` package returns token timings; local `faster-whisper` alignment is the fallback. Cuts fall in low-energy gaps, with a short crossfade.
- Pauses are authored in the script; there is no global gap.
- Drop the slowed `SLOW|` speed unless the delivery test favours it.
- Keep natural onsets and tails instead of trimming to 30 ms and 120 ms.
- A QA check flags any cut that isn't in a pause and any audio overlap. The existing frame contact sheets stay.

## 3. Sequence and gates

| Step | Work | Gate (judged on the §0 criterion) |
|---|---|---|
| 1 | Write the 90 s test passage as one A-style teaching unit. | You approve the text after hearing it read aloud. |
| 2 | Rebuild the pipeline; render V0–V3 audio. | **You choose the delivery**, or we stop if none passes. |
| 3 | **Two-minute audiovisual sample:** LA02 §1, "one system, two pictures". Two labelled panels connected by A: the row lines crossing at (2, 3) in input space, and the column recipe reaching b = (1, 5) in output space. Final voice, final visual style, no shortcuts. | **You approve the style, and a newcomer passes it:** someone who hasn't studied this material watches once, then explains in their own words why (2, 3) is both the crossing point on the left and the recipe that reaches (1, 5) on the right. If they can't, we fix the sample. This sample becomes the reference for all scene work, as LA01 Act 1 was. Iterate here until it passes. |
| 4 | Full LA02 script, written as A-style units with authored pauses (D). | Maths review, read-aloud gate, transition and aside strike-list. |
| 5 | The first full section, *One system, two pictures*, matching the sample. | **Continuous listening and viewing of the whole section in one sitting**, by you and by one person new to the material. This is the fatigue gate for the chosen delivery. Note where they got lost, bored or tired; those spots get rewritten. |
| 6 | The remaining sections, build, captions and chapters. | **One complete, continuous viewing of the finished video** before publishing, with problems logged by timestamp. |

No section is produced before step 3 is approved.

## 4. Risks

- **Kokoro's ceiling.** Writing and pauses can do a lot, but the voice may still sound synthetic. Step 2 is where we find out. If it fails, we revisit the engine choice instead of producing 60 minutes of it.
- **Writing in this style takes longer** than LA01's paragraph-first script, and each idea may take more screen time. Within 60–90 min this probably means fewer, deeper units rather than cutting content. Coverage choices go to review explicitly; nothing is silently dropped.
- **Removing title cards and fades** makes chapter boundaries less obvious. A change of picture plus the YouTube chapters should carry this; we confirm in the step-3 sample.

## 5. Open questions

1. Who is the newcomer reviewer for steps 3 and 5? It needs someone who knows school algebra but hasn't studied linear algebra. This gate must be a person. A model review can flag unclear explanations, and we may use it as an extra script check, but it can't judge whether the voice is tiring or the visuals feel artificial. If no one is available, the gate stays **pending**; it is not passed by substitution.
2. Should LA01 be revised to this standard later, or left as is?
3. Should the full LA02 script (step 4) start only after step 3 is approved? I recommend waiting, because the sample will reshape how units are written.

## Naming

Sections are named only by their titles, everywhere: in the script, these docs, the YouTube chapters and conversation. There are no "Act N" or "Part N" labels. Scene files carry a numeric prefix only so that they sort in playback order, e.g. `01_one_system.py`.
