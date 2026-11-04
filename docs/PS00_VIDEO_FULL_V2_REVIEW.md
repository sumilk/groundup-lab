# PS00 complete v2 — review

**Decision: suitable to commit as a review checkpoint.** The revised script is represented in all twelve scene modules, and the previously requested teaching corrections are present in the sampled final frames. Publication review remains open: no continuous audiovisual or human comprehension check was performed here.

Reviewed `outputs/ps00/final/PS00_probability_foundations.mp4`, **41:52.361**, 2560 × 1440, plus chapters, captions, description, thumbnail, scene narration, and the chapter corrections.

## Verified

- All twelve scene narration texts match the current written script after whitespace normalization.
- The SRT contains **738 cues**, all with positive durations. No adjacent cues overlap by more than 50 ms, and none exceed 25 characters per second. Caption text matches the scene narration after accounting for line wraps inside hyphenated words. These are structural checks, not an assessment of perceived synchronization.
- All **12 chapters** are embedded in the MP4. The description includes the corresponding starts.
- Inspected **48 selected frames across sections 5–12**, plus five detailed frames around potential problems and the thumbnail. Sections 1–4 retain the earlier sample review. This does not replace continuous viewing or exhaustive frame inspection.
- The chapter changes correctly qualify disjointness using positive probabilities and state the sampling assumptions behind prompt-selection examples. The matching generated A8 statement is updated.

## Passage checks

| Final-video time | Result |
|---|---|
| **14:36** | The Bayes comparison explicitly distinguishes 100 contaminated models from 100 flagged models. |
| **15:41–16:45** | Partition, total probability, Bayes notation, and odds conversion are present and readable in the sampled frames. The displayed counts and calculations agree. |
| **19:22; 20:18** | The knowledgeable-host example normalizes to 1/3 versus 2/3; the ignorant-host example settles to 1/2 versus 1/2. A possible label collision in an earlier sampled transition is gone in the settled 20:18 frame; I do not count that as a persistent error. |
| **22:26–22:39** | General ordered selections and combinations are included, with grouped factorials, the without-replacement condition, and `0! = 1`. |
| **27:09–27:30** | Pairwise checks and the failed triple check are displayed separately. |
| **29:38–29:48** | The CDF is held at threshold 1 while the question about 1.5 is asked. The extension to 1.5 appears afterward. Closed/open endpoints in the detailed later frame agree with `P(X ≤ x)`. |
| **32:00–32:19** | The roll table shows regrouping before the expectation rule; narration explicitly distinguishes a short sample list from the model expectation. |
| **33:30–34:22** | Birthday indicators proceed through one pair, the three-person dependence example, and the total. Most of the 253 connecting lines are faint, keeping selected pairs visible. |
| **35:35–36:15** | Repeated-run spread precedes the standard-error formula, then running paths illustrate the sampling-rate effect. See the axis clarification below. |
| **38:36–38:52** | The easy/hard example includes both denominators and preserves the ranking reversal. The wording permits a valid claim specifically about easy prompts. |
| **39:15** | The token factorization includes the end token and an illustrative-tokenization note. |
| **40:37–41:09** | The prompt-selection example states independent prompt-by-example trials, identifies Binomial(200, 0.70) scores, and gives the fresh-evaluation correction. |

## Two refinements before publication

**35:13–35:54 — clarify the sideways histogram's horizontal direction.** The distribution of repeated 100-flip frequencies is piled sideways at the position n = 100, but it shares the existing horizontal axis labelled “number of flips.” Its bar lengths represent run counts, not additional flips. Without an inset label, a newcomer can read its horizontal extent as changing sample size. Put the histogram in a small panel labelled “200 runs, 100 flips each; bar length = number of runs,” or temporarily replace the horizontal axis while this distribution is being shown. Restore the sample-size axis for the running paths. The displayed standard-error values themselves are correct.

**Thumbnail and description opening — decide whether the prediction should remain unanswered.** Both reveal “33%” before the viewer reaches the opening question. That undercuts the request to commit to a guess. If the prediction remains part of the teaching, remove the numerical answer from the thumbnail and introductory description, for example retaining “95% sure?” with “Which group are we counting?” Otherwise explicitly turn the opening into “Why is it only 33%?” The current packaging and the withheld-answer opening serve different experiences.

Neither refinement prevents a checkpoint commit. Neither should be reported as a mathematical failure in the script.

## Commit recommendation and remaining checks

Commit the chapter corrections and their generated assets together. Commit the PS00 production sources and review documents as a separate checkpoint if convenient. Describe the video as built and technically reviewed, with listening and newcomer checks pending. Keep generated MP4/WAV/render outputs under the existing ignored-output convention.

Before publication, retain the already agreed continuous viewing, emphasis/fatigue log, blind listener, and fresh conditioning question. I did not listen to audio, conduct those participant checks, or certify the absence of issues between the sampled frames. The review establishes that the substantive script revision reached the built video and that the inspected export structure is sound.
