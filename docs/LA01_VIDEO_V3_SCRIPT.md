# LA01 video v3 — script and storyboard (for review)

**Vectors, span, independence and bases — one story, every term.**

| | |
|---|---|
| Format | One video for the lesson, estimated 61–67 min (see "Length check"); 12 parts that become the YouTube chapters |
| Voice | Kokoro `af_heart`, natural speed (~5% slower than v1), deliberate pauses after every reveal |
| Rule | Every technical term in the chapter is introduced, but **always intuition → picture → name**. The name arrives as a label on something the viewer already understands. |
| Not in the video | Practice, not rigor: exercise banks, lab contracts, coding experiments. Definitions, notation, worked numbers and key arguments stay in. |

## Reading this script

- **VISUAL** describes what is on screen. **NARRATION** is spoken. **⏸** marks a deliberate silent pause (seconds).
- **TERM ▸** marks the moment a technical term is introduced; it also appears on screen as a label.
- **PRECISE** blocks put the real mathematics on screen: definitions in standard notation, worked numbers, and the key argument for why a result is true. The analogy is the way in; it never replaces the maths. Every concept follows the same five beats: **question → analogy and picture → precise statement → worked example or reason → payoff.**
- Numbers are written as digits here for readability; production converts them to spoken form.
- **One cast of characters, used everywhere** (so viewers never re-learn an example):

| Character | Value | Colour |
|---|---|---|
| Blue move `u` | (2, 1) | blue |
| Gold move `v` | (1, 2) | gold |
| The green target `T` | (4, 5) | green dot |
| The "lazy" gold move | (4, 2) = 2u | gold |
| Purple shortcut `w` | u + v = (3, 3) | purple |
| A second grid `Q` | (2, 1) and (−1, 1) | teal |
| The drone (3-D) | a = (1, 0, 1), b = (0, 1, 1) | blue / gold |
| Almost-parallel pair | (1, 0) and (1, ε) | blue / red |

---

## Opening — Where can you get to?

**VISUAL:** Dark screen. The GU logo draws itself: the ground line, then the U's stem rising into the arrow. Then, before any context, a concrete thing to notice: a small craft at home, a green target, and two sliders. Each slider nudges the craft along its own arrow; the target sits somewhere neither arrow points directly.

**NARRATION:**
Welcome to GroundUp Lab. Here's a little puzzle to keep in mind. This craft has two controls. Each one pushes it along its own arrow. Can some setting of the two controls bring it to that green point?

⏸ 2

**VISUAL:** The craft freezes mid-move. Fade to a slow montage, each shot ~6 s, each overlaid with a single faint arrow:
a cloud of word-points drifting (embeddings) → a giant grid of numbers (a weight matrix) whose columns peel off as arrows → a tiny sliver of a huge matrix lighting up (a fine-tune that trains a fraction of the parameters).

**NARRATION:**
Hold that thought. This is linear algebra, chapter one, and before any symbols, here's why that little puzzle matters. Modern AI systems are, at heart, enormous collections of arrows. Every word a language model reads becomes an arrow in a space with hundreds of directions. The learned linear maps inside a network are grids of numbers, and each column of such a grid is an arrow. Even the trick that lets you fine-tune a huge model by training only a tiny slice of it is a statement about arrows.

**VISUAL:** The montage freezes. All the arrows fly to the centre and become two arrows, blue and gold, on a clean grid. A question types itself above them.

**NARRATION:**
And every one of those stories comes back to one deceptively simple question.
Given some arrows, where can you get to?

⏸ 2

**VISUAL:** Three small cards fade in along the bottom: "about an hour" · "built from basic arithmetic and algebra" · "every idea gets a picture".

**NARRATION:**
That's what this hour is about. We'll build everything from basic arithmetic and algebra, and every idea gets a picture first and a name second. By the end, you'll be able to look at a matrix with 768 rows and 3072 columns and say something true and non-obvious about it. Let's go back to the craft, and take that question slowly.

---

## Act 1 — Moves and recipes
*Terms: vector, ℝⁿ, displacement vs point, vector addition, scalar, scalar multiplication, linear combination, coefficients.*

### 1.1 The craft

**VISUAL:** A small craft sits at a dot labelled "home". A green target glows at (4, 5). Two sliders appear on a control panel: blue and gold. Each slider has a matching arrow drawn from home.

**NARRATION:**
Here's a little craft sitting at home, and a green target it would like to reach. The craft has two controls. The blue control pushes it along the blue arrow. The gold control pushes it along the gold arrow. You can set each control to any amount you like: a little, a lot, or even backwards.

**VISUAL:** Slide blue to 1: the craft glides two squares right, one up. Slide back to 0. Slide gold to 1: one right, two up.

**NARRATION:**
Set blue to one, and the craft moves two steps right and one step up. That's the blue move. Set gold to one, and it moves one step right and two up. That's the gold move.

### 1.2 What a vector is

**VISUAL:** The blue arrow lifts off the grid. Beside it, its numbers appear as a stacked pair `(2, 1)`. The arrow slides around the grid; a ghost copy stays at home. Each copy shows "2 right, 1 up".

**NARRATION:**
Each move is what mathematicians call a vector. You can think of a vector in two ways that turn out to be the same thing. It's a list of numbers, here two and one. And it's an arrow, an instruction: two steps right, one step up. For now our vectors are exactly these lists of numbers. Later we'll meet vectors that aren't lists, which a list can still describe once we pick a basis.

Notice something about that instruction. It doesn't care where you start. Two right and one up means the same thing whether you're at home or across town. So I can slide this arrow anywhere I like, and it's still the same vector.

**TERM ▸ vector** (label pinned to the arrow: "vector = a move you can make, written as a list")

**VISUAL:** Split screen. Left: an arrow (a move). Right: a dot (a place). Caption under each: "displacement" / "point".

**NARRATION:**
Sometimes we'll use a vector to mean a place rather than a move: the point where an arrow from home lands. Both uses are fine, as long as you know which one you mean. Here's a quick way to feel the difference. Two directions, like "three blocks east" and "two blocks north", add up sensibly. Two addresses don't: there's no sensible answer to "the town hall plus the train station".

**VISUAL:** A row of 768 tiny coloured cells streams past, labelled "a word, inside a language model".

**NARRATION:**
Our moves have two numbers because our world is flat. A list of three numbers is a move in space. And a list of 768 numbers is a move in a space with 768 directions, which is exactly what a word becomes inside a language model. We write ℝ², ℝ³, and in general ℝⁿ, for all the lists of n real numbers.

**TERM ▸ ℝⁿ** ("all lists of n real numbers")

### 1.3 The two things you can do

**VISUAL:** Blue arrow from home; then gold arrow drawn from the blue arrow's tip. Then the reverse order, dashed. Both land at (3, 3). A parallelogram shades in.

**NARRATION:**
There are exactly two things you can do with moves, and everything in this chapter is built from them.

The first: do one move, then another. Blue, then gold. Two right and one up, then one right and two up, lands you three right and three up. Do them the other way round and you land in exactly the same place. The two routes trace the two sides of a parallelogram. That's vector addition: add the lists entry by entry.

**TERM ▸ vector addition** ("(2, 1) + (1, 2) = (3, 3)")

**PRECISE — VISUAL:** The general rule writes itself under the picture, entries colour-matched to the arrows' horizontal and vertical legs:
`(a₁, a₂) + (b₁, b₂) = (a₁ + b₁, a₂ + b₂)`, then the ℝⁿ version `(a₁, …, aₙ) + (b₁, …, bₙ) = (a₁ + b₁, …, aₙ + bₙ)`.

**NARRATION:**
In symbols: add the first entries to get the first entry, add the second entries to get the second. In ℝⁿ it's the same rule, entry by entry, n times. And here's why the two routes always meet at the same corner: each entry is just a sum of ordinary numbers, and ordinary addition doesn't care about order. u plus v equals v plus u. That one fact is why the picture is a parallelogram and not a zig-zag.

**VISUAL:** A dial labelled `c` attaches to the blue arrow. Turn it: 2 → the arrow doubles; ½ → halves; 0 → shrinks to a dot; −1 → flips. The tip leaves a trail that becomes a full line through home.

**NARRATION:**
The second thing you can do: use more or less of a move. Turn the dial up to two and the arrow doubles. Turn it down to a half and it shrinks. At zero, it vanishes; you don't move at all. Push past zero and it comes out the other side, pointing backwards.

Notice what the dial can never do. It can stretch, shrink and flip, but it can never turn the arrow sideways. Watch the trail: every amount of one move lands on a single line through home.

The number on the dial is called a scalar, because it scales. This is scalar multiplication: multiply every entry by the same number.

**TERM ▸ scalar, scalar multiplication**

**PRECISE — VISUAL:** `c · (a₁, a₂) = (c a₁, c a₂)`. Live readout as the dial turns: `2u = (4, 2)`, `½u = (1, ½)`, `0u = (0, 0)`, `−u = (−2, −1)`. A fixed caption states the invariant: "every cu = c·(2, 1): first entry is always twice the second" (no ratio is displayed, since at c = 0 there is none).

**NARRATION:**
In symbols, c times a vector multiplies every entry by c. Watch the two entries as the dial turns: the first is always exactly twice the second, because both are c times the original entries. That's the algebra behind "never turns sideways". Scaling changes how far you go, and possibly which way along the line, but never the line itself. Scaling by a size of c stretches by the size of c, and a negative c flips the arrow.

⏸ 2

### 1.4 Recipes

**VISUAL:** Back to the craft, target glowing. Sliders return. A recipe card appears: "blue × __, gold × __".

**NARRATION:**
Now put the two operations together. Choose an amount of blue and an amount of gold, scale each, and add. I like to call that a recipe: the moves are the ingredients, and the amounts say how much of each to use.

Can you find a recipe that reaches the green target? Before I move anything, have a guess.

⏸ 4

**VISUAL:** Blue to 1: the craft moves to (2, 1). Gold to 2: it travels (1, 2) twice, to (4, 5). The target pulses. The recipe card fills: "blue × 1, gold × 2".

**NARRATION:**
One blue, then two gold. Two right and one up, then two lots of one right and two up. That's four right and five up. We're there.

**VISUAL:** The recipe card morphs into `1·u + 2·v = (4, 5)`. The `1` and `2` glow and get labelled.

**NARRATION:**
A recipe like this, some amount of one vector plus some amount of another, is called a linear combination. The amounts are its coefficients. That's the whole vocabulary of this section: vectors are moves, coefficients are amounts, and a linear combination is a recipe.

**TERM ▸ linear combination, coefficients**

**VISUAL:** The equation `a·(2, 1) + b·(1, 2) = (4, 5)` splits into two stacked equations, one per row of numbers: `2a + b = 4` and `a + 2b = 5`. Highlight how each row comes from one coordinate.

**NARRATION:**
And when you can't guess a recipe, you can solve for it. A vector equation is really one equation per coordinate. The first entries give two a plus b equals four. The second entries give a plus two b equals five.

**PRECISE — VISUAL:** The solve, one line at a time, each line appearing as it's spoken; the substituted expression flies from line 1 into line 2:
`b = 4 − 2a` → `a + 2(4 − 2a) = 5` → `8 − 3a = 5` → `a = 1, b = 2` → check: `1·(2, 1) + 2·(1, 2) = (2 + 2, 1 + 4) = (4, 5)` ✓.
Then the general form: `c₁v₁ + c₂v₂ + ⋯ + cₖvₖ`.

**NARRATION:**
From the first equation, b is four minus two a. Put that into the second: a plus two times four minus two a, equals five. That simplifies to eight minus three a equals five, so a is one, and then b is two. And always check by rebuilding: one times two, one, plus two times one, two, is four, five.

In general, with any number of vectors v one up to v k, a linear combination is c one v one plus c two v two, and so on up to c k v k. Every question in this chapter is a question about expressions of exactly this shape.

---

## Act 2 — Reachable territory
*Terms: span, the span is a line / plane / all of ℝⁿ, span always contains the origin, degenerate (collapse), multiple representations.*

### 2.1 From one target to all of them

**VISUAL:** Many green dots appear one at a time; for each, the sliders snap to a recipe and the craft flies there, leaving a trail. Then a shaded parallelogram patch around home grows as the slider range widens (−1…1, −2…2, −6…6) until it fills the screen.

**NARRATION:**
Finding one recipe is satisfying. But here's the bigger question: which places can you reach at all?

Try a few other targets. Each one has a recipe. Now, instead of picking targets, let both controls range over small amounts, between minus one and one. The places you can reach form a small parallelogram around home. Allow bigger amounts and the patch grows. There's no limit on the amounts, so there's no limit on the patch. With these two moves you can reach every single point in the plane.

**VISUAL:** Title stamp across the shaded plane: "the span of u and v = the whole plane ℝ²".

**NARRATION:**
The set of everywhere you can reach is called the span. The span of the blue and gold moves is the entire plane.

**TERM ▸ span** ("everywhere a set of moves can reach")

**PRECISE — VISUAL:** The definition assembles under the shaded plane, each piece pointing at its picture:
`span(v₁, …, vₖ) = { c₁v₁ + ⋯ + cₖvₖ : every cᵢ ∈ ℝ }` — "all recipes" ↔ "all reachable points". Then a small inset: an empty control panel and a single dot at home: `span() = {0}`.

**NARRATION:**
Written precisely, the span of v one to v k is the set of all their linear combinations, with every coefficient free to be any real number. All recipes, so all reachable points. And one edge case worth knowing: a list with no moves at all can only stay home, so its span is just the zero vector.

### 2.2 The collapse

**VISUAL:** The gold arrow slowly rotates toward the blue line. The parallelogram patch thins, like a closing door, and at the end flattens onto the line. Gold now reads (4, 2).

**NARRATION:**
Now watch what happens if I change the gold move, so that it points along the same line as blue. Keep your eye on the reachable patch.

⏸ 3

**NARRATION:**
It flattens. This gold move is just two blue moves glued together. Anything gold can do, blue could already do. So however you mix them, forwards, backwards, huge amounts or tiny ones, you never leave this line.

**VISUAL:** The craft races up and down the line at high speed, never leaving it. The green target sits off the line, unreachable. A red ✗ appears on it.

**NARRATION:**
And the green target? No recipe exists. This isn't a failure to search hard enough. The target is simply outside the territory these two moves can reach. Two controls, but only one direction. The span has collapsed from a plane to a line.

**TERM ▸ (on screen) "span = a line"**

**PRECISE — VISUAL:** The algebra of the collapse, factor pulled out in colour: `a·u + b·(2u) = (a + 2b)·u`. Then the target test: `t·(2, 1) = (4, 5)` ⇒ `2t = 4` and `t = 5` — the two demands highlighted in red against each other.

**NARRATION:**
The algebra says the same thing. Any recipe, a times blue plus b times the lazy gold, which is two blue, equals a plus two b, times blue. Whatever a and b you choose, you get some multiple of blue. And can a multiple of blue, t times two, one, ever equal four, five? The first entry demands t equals two. The second demands t equals five. A single number can't be both. That's a proof the target is unreachable, not just a failed search.

⏸ 2

**VISUAL:** A point on the line, (6, 3), lights up. Three different recipe cards appear, each with the craft reaching it by a different path: (3, 0), (1, 1), (−1, 2).

**NARRATION:**
Something else changed too, more quietly. Pick a point that is on the line, like six, three. Now there are many recipes for it. Three blues. Or one blue and one gold. Or minus one blue and two golds. Losing a direction did two things at once: some places became impossible, and the places you can still reach picked up lots of different recipes. Hold onto that pairing. It's the key to the next act.

### 2.3 Spans in space

**VISUAL:** The camera tilts up into 3-D. The craft becomes a small drone. Two arrows, a = (1, 0, 1) and b = (0, 1, 1). As the drone mixes them, a tilted transparent sheet fills in through home.

**NARRATION:**
Let's go up a dimension. Give a drone two moves in three-dimensional space. Mix them in every possible amount and you don't fill the room; you fill a flat, tilted sheet through home. It's a plane. Two independent directions give you a plane, whether that plane is the whole floor or tilted in space.

**VISUAL:** Two targets: (2, 3, 5) sits exactly on the sheet; (1, 1, 1) hovers below it, with a dotted line up to the sheet at (1, 1, 2).

**NARRATION:**
So some points in the room are reachable, like two, three, five, which sits right on the sheet. And some aren't, like one, one, one, which hangs just below it. Reaching every point in the room would take a third move pointing off the sheet.

**PRECISE — VISUAL:** `s·(1, 0, 1) + t·(0, 1, 1) = (s, t, s + t)`; the third entry glows: "always first + second". Then the plane's equation `z = x + y`. Two checks side by side: `(2, 3, 5)`: s = 2, t = 3, 2 + 3 = 5 ✓ · `(1, 1, 1)`: s = 1, t = 1, 1 + 1 = 2 ≠ 1 ✗.

**NARRATION:**
Here's how you know exactly which sheet it is. A general recipe gives s, t, s plus t. The third entry is always the sum of the first two. So the span is precisely the plane z equals x plus y. To test two, three, five: the first two entries force s equals two and t equals three, and then the third entry must be five. It is. For one, one, one, they force s and t to be one, so the third entry would have to be two, not one. Two free numbers, s and t, means it's a plane, even though each point has three coordinates.

### 2.4 Three facts you can now see

**VISUAL:** Three small tiles, each a 4-second animation: (1) every reachable region passes through home; (2) the region is always a dot, a line, a plane, or higher-dimensional flat sheet, never a curve or a disc; (3) a sum or a scaling of two reachable points is reachable.

**NARRATION:**
Three facts about spans you can now see for yourself. A span always contains home: just use zero of everything. A span is always flat: a point, a line, a plane, or a higher-dimensional version of a plane, never a curve and never a blob with an edge. And if you can reach two places, you can reach their sum, and any scaled version of them. Remember that third fact. It comes back later with a name of its own.

**PRECISE — VISUAL:** The closure identities, with the coefficients merging visibly: `Σcᵢvᵢ + Σdᵢvᵢ = Σ(cᵢ + dᵢ)vᵢ` and `a·Σcᵢvᵢ = Σ(a cᵢ)vᵢ`.

**NARRATION:**
That third fact is one line of algebra. Add two recipes and you just add their amounts, which is another recipe. Scale a recipe and you scale its amounts, which is another recipe. So sums and scalings of reachable points are always reachable.

---

## Act 3 — Dead weight
*Terms: linearly dependent, linearly independent, trivial / non-trivial combination, dependency relation, "independence is a property of the whole list".*

### 3.1 A third control

**VISUAL:** Back in the plane with the good blue and gold moves. A third, purple slider and arrow are added: w = (3, 3), pointing between them.

**NARRATION:**
Back to our two good moves, which reach the whole plane. Now I'm going to add a third control, purple. It points in a new direction, different from both blue and gold. Here's the question: does the craft gain any new places it can reach?

⏸ 5

**VISUAL:** Purple arrow decomposes visibly: a blue arrow, then a gold arrow, tip to tail, ending exactly at purple's tip.

**NARRATION:**
It doesn't. Purple is exactly one blue move followed by one gold move. Anything purple can do, blue and gold can already do together. It looks new, but it brings no new territory. It's dead weight.

### 3.2 How to detect dead weight without a picture

**VISUAL:** Two recipe cards for the green target, side by side, with paths: "1 blue + 2 gold + 0 purple" and "0 blue + 1 gold + 1 purple". Both paths end at (4, 5).

**NARRATION:**
In two dimensions you can spot the dead weight by eye. But a language model's arrows live in hundreds of dimensions, where you can't draw anything. So we need a test that doesn't use pictures.

Here's the clue, and it's the one I asked you to hold onto. When there's dead weight, the same destination has more than one recipe. One blue and two golds reaches the target. So does one gold and one purple.

**VISUAL:** The second path is drawn in reverse after the first: forward along recipe one, then backwards along recipe two. The craft ends exactly at home. The card reads "1 blue + 1 gold − 1 purple = home".

**NARRATION:**
Now do something sneaky. Follow the first recipe out to the target, then follow the second recipe backwards. You end up exactly where you started. Subtracting the two recipes gives you a round trip: one blue, plus one gold, minus one purple, brings you back home, even though you really moved.

⏸ 3

**NARRATION:**
That's the test. Doing nothing at all, zero of every control, obviously keeps you at home. Mathematicians call that the trivial combination. Dead weight is exactly what lets you get home in some other way: a round trip that really uses the controls.

**TERM ▸ trivial combination**

### 3.3 The names

**VISUAL:** The definition builds on screen, every symbol with a caption underneath:
`c₁v₁ + c₂v₂ + … + cₖvₖ = 0` — "some recipe… brings you home"; "only when every c is 0" → **independent**; "some c is not 0" → **dependent**.

**NARRATION:**
So here are the official names. A list of vectors is linearly independent if the only way to get back home is to do nothing: every coefficient zero. If there's a genuine round trip, some recipe with a non-zero amount that still lands at home, the list is linearly dependent, and that round trip is called a dependency relation.

**TERM ▸ linearly independent, linearly dependent, dependency relation**

**PRECISE — VISUAL:** "Hunting for a round trip" in ℝ³, pretending we can't see. The drone's two moves and a third: `a = (1, 0, 1)`, `b = (0, 1, 1)`, `c = (1, 1, 2)`. Their entries slide row by row into three equations for the amounts x, y, z:
`x + z = 0`, `y + z = 0`, `x + y + 2z = 0`.
Solve: `x = −z`, `y = −z`, and the last equation becomes `−z − z + 2z = 0` — true for every z. Pick `z = 1`: `−a − b + c = 0`, i.e. `c = a + b`. Then the 3-D view: walking a then b lands exactly on c's tip, never leaving the drone's sheet.

**NARRATION:**
Let's use the test as if we couldn't see anything. Give the drone a third move, one, one, two. Is there a round trip? Write x times a, plus y times b, plus z times c, equals zero, one coordinate at a time. That's three equations. The first says x is minus z. The second says y is minus z. Put both into the third and everything cancels: it's true whatever z is. That freedom is the round trip. Choose z equals one, and minus a, minus b, plus c is zero. Rearranged, c is just a plus b. The third move was dead weight, and the picture confirms it: c lies flat in the drone's sheet.

**VISUAL:** Swap c for `(2, 2, 3)`; the same procedure gives `x = −2z`, `y = −2z`, then `−4z + 3z = 0` forces `z = 0`, so `x = y = 0`. Stamp: "only the trivial recipe → independent". In 3-D the new arrow pokes out of the sheet, and the reachable region sweeps out to fill the whole room.

**NARRATION:**
Now change the third move to two, two, three, and run the same hunt. This time the last equation forces z to be zero, and then x and y are zero too. Only doing nothing brings you home, so these three moves are independent. And the picture agrees: the new arrow sticks out of the sheet, and with it the drone can reach the entire room. Independent moves are the ones that keep adding new directions.

**VISUAL:** Three panels linked by arrows in a loop: "a round trip exists" → "one move can be built from the others" → "removing it loses no territory" → back to the first.

**NARRATION:**
Why define it through getting home, instead of just saying "one move can be built from the others"? Because they're the same thing, and the round-trip version is easier to check. If you have a round trip, pick any control that's actually used and solve for it: that control can be built from the rest. And if a control can be built from the rest, removing it can't lose you any territory. Three descriptions of one idea.

**PRECISE — VISUAL:** The key step of the proof, isolated: from `Σ cᵢvᵢ = 0` with `cⱼ ≠ 0` (circled), move the others across and divide:
`vⱼ = Σ_{i≠j} (−cᵢ / cⱼ) vᵢ`. A small warning label on the division: "allowed only because cⱼ ≠ 0".

**NARRATION:**
Here's the one step that makes it work. Start from a round trip, and choose a move whose amount isn't zero. Move everything else to the other side and divide by that amount. Now that move is written as a recipe of the others. The division is the whole point: you can only solve for a move that's actually used. And this is called Theorem 1 in the chapter: dependent, built from the others, and removable without loss, all mean the same thing.

**VISUAL:** Add moves to the list one at a time and watch the span grow: dot → line → plane → plane (no growth). The step where it fails to grow flashes: "first redundant move".

**NARRATION:**
There's a sharper way to see it. Add your moves to the list one at a time, and watch the reachable territory. For an independent list it grows at every step. For a dependent list there's a first step where it doesn't grow, and that move is already reachable from the ones before it. That's the linear dependence lemma. Its partner says the reverse: if a new move is outside the current span, adding it keeps the list independent. We'll lean on both of these in a moment.

**TERM ▸ linear dependence lemma** (and its partner: adding a move outside the span preserves independence)

**VISUAL:** 2-D test. The parallelogram on u and v, its area shaded and a live readout `D = u₁v₂ − u₂v₁`. For blue and gold: `2·2 − 1·1 = 3`. Rotate gold onto blue's line: the area shrinks to 0 and the readout reaches `2·2 − 1·4 = 0` for the lazy gold (4, 2).

**NARRATION:**
In the plane, there's a neat shortcut. For two moves, compute u one v two minus u two v one. That number is, up to sign, the area of the parallelogram they make. For blue and gold it's three. Turn gold onto blue's line and the parallelogram flattens, and the number hits zero. Two moves in the plane are dependent exactly when that area is zero. You'll meet this number again as the determinant.

**TERM ▸ (named) determinant — preview**

### 3.4 A trap

**VISUAL:** Three arrows: (1, 0), (0, 1), (1, 1). Each pair is highlighted in turn; no pair is parallel ("✓ pair OK" three times). Then (1, 0) + (0, 1) − (1, 1) traces a closed triangle back to home. Red stamp: "dependent".

**NARRATION:**
One trap catches almost everyone. Take these three moves. No two of them point the same way, so every pair looks fine. But one right plus one up minus one diagonal brings you home. They're dependent.

Independence is a property of the whole list, not of its pairs. You can't check it two at a time. In high dimensions this is exactly why a model can store many feature directions that look unrelated in pairs, yet together they must contain dead weight.

**PRECISE — VISUAL:** Two quick stamps: a list containing the zero vector: `1·0 = 0` → dependent; a list with a repeat: `1·v + (−1)·v = 0` → dependent.

**NARRATION:**
Two quick consequences of the definition. Any list containing the zero vector is dependent: one times zero is a round trip that uses a control. And any list that repeats a move is dependent: go forward along it, then back along its copy.

---

## Act 4 — Addresses
*Terms: basis, ordered basis, coordinates, coordinate vector [v]_B, standard basis e₁ … eₙ, change of basis.*

### 4.1 What we want from a set of controls

**VISUAL:** Two checklists side by side, each with a tiny icon: "reach everywhere" (filled plane) and "no dead weight" (no round trip). Both tick. A badge snaps on: **basis**.

**NARRATION:**
Let's step back and ask what makes a set of controls genuinely good. Two things. First, it should reach everywhere: its span is the whole space. Second, it shouldn't carry dead weight: it's independent. A set of moves with both properties is called a basis.

**TERM ▸ basis** ("reaches everything, with no dead weight")

**PRECISE — VISUAL:** Definition card: "A list `B = (b₁, …, bₙ)` is a **basis** of V if (i) `span(b₁, …, bₙ) = V` and (ii) `b₁, …, bₙ` are linearly independent." Under (i): "enough arrows". Under (ii): "not one too many".

**NARRATION:**
Precisely: a list is a basis of a space if it spans the space and it's linearly independent. Spanning means enough arrows. Independence means not one too many.

### 4.2 A basis is an address system

**VISUAL:** A city map at night. A friend stands at home; a pin glows at a café. A message bubble: "3 blocks east, 2 blocks north". The walk animates along the street grid.

**NARRATION:**
Here's why that pair of properties matters so much. Think about how you give someone directions in a city with a street grid. "Three blocks east, two blocks north." Those two numbers are an address. They work because the grid gives you two directions of streets, and a fixed block length along each.

A basis is exactly that: a street grid for your space. Reaching everywhere means every place has an address. No dead weight means no place has two different addresses.

**VISUAL:** Overlay: our blue and gold moves become the city's two street directions. The grid re-draws itself as a skewed lattice along u and v. The green target sits at a lattice corner: 1 block along blue, 2 along gold.

**NARRATION:**
Now make our blue and gold moves the streets. The city's grid tilts, because the streets aren't at right angles anymore. That's fine. To reach the green target, walk one block along blue and two blocks along gold. So in this city, the target's address is one, two.

**TERM ▸ coordinates** ("the address: how many blocks along each basis direction")

### 4.3 Why the address is unique

**VISUAL:** Two candidate addresses for the same café: (1, 2) and a hypothetical (x, y). Subtract them, drawn as a round trip that returns home. Since blue and gold have no dead weight, the round trip must be "do nothing": x = 1, y = 2.

**NARRATION:**
Why must the address be unique? Suppose some place had two different addresses. Walk out using the first and back using the second, and you've made a round trip that really used the streets. But that would be dead weight, and a basis has none. So two addresses for the same place can't happen. Uniqueness falls straight out of independence, using the same round-trip trick from the last act.

**PRECISE — VISUAL:** Theorem card: "B is a basis ⇔ every v ∈ V has **exactly one** representation `v = c₁b₁ + ⋯ + cₙbₙ`." The proof in two columns:
- ⇒ *existence:* B spans. *uniqueness:* `Σcᵢbᵢ = Σdᵢbᵢ` ⇒ `Σ(cᵢ − dᵢ)bᵢ = 0` ⇒ independence ⇒ `cᵢ = dᵢ`.
- ⇐ *spans:* every v has a representation. *independent:* `Σcᵢbᵢ = 0 = Σ0·bᵢ`, uniqueness at v = 0 ⇒ all `cᵢ = 0`.

**NARRATION:**
In symbols: subtract the two addresses. The difference of the amounts is a recipe for zero, and independence says every one of those differences must be zero. So the addresses were the same all along. It works backwards too. If every place has exactly one address, then in particular home has only the address "all zeros", which is exactly what independence means. So "is a basis" and "gives every point exactly one address" are the same statement. The chapter calls this Theorem 8.

### 4.4 The standard grid is a choice

**VISUAL:** The skewed grid unskews into the familiar square grid. Arrows e₁ = (1, 0) and e₂ = (0, 1). The target reads (4, 5): four blocks east, five north.

**NARRATION:**
When we wrote the target as four, five, we were secretly using an address system too: the ordinary square grid, with one street going east and one going north. Those two moves are called the standard basis.

**TERM ▸ standard basis (e₁, e₂, … eₙ)**

**VISUAL:** The target stays perfectly still while three grids take turns underneath it: square (address 4, 5), blue/gold (address 1, 2), teal Q grid (address 3, 2). Each address appears beside the dot in that grid's colour.

**NARRATION:**
Now here's the idea I most want you to take from this act. Keep the place fixed and change the grid. In the square grid, the address is four, five. In the blue-and-gold grid, it's one, two. In this third grid, it's three, two. The place never moved. Only its description changed.

⏸ 3

**NARRATION:**
So these numbers describe the vector relative to a chosen basis. In ℝⁿ the list four, five is itself a vector, but as an address it only means something together with the grid it was read from. The chapter writes this as v, in square brackets, with a little B underneath: the coordinates of v in basis B. And translating one address into another, for the same place, is called a change of basis.

**TERM ▸ coordinate vector [v]_B, change of basis**

**PRECISE — VISUAL:** Finding the teal address of T: `c₁(2, 1) + c₂(−1, 1) = (4, 5)` → `2c₁ − c₂ = 4`, `c₁ + c₂ = 5` → add them: `3c₁ = 9` → `c₁ = 3, c₂ = 2` → check `3(2, 1) + 2(−1, 1) = (6 − 2, 3 + 2) = (4, 5)` ✓. Result: `[T]_Q = (3, 2)`. Beside it, the blue/gold address solved earlier: `[T]_B = (1, 2)`, and the standard one: `[T]_E = (4, 5)`.

**NARRATION:**
Finding an address is solving for a recipe, exactly as in Act 1. For the teal grid: two c one minus c two equals four, and c one plus c two equals five. Add the two equations and c two disappears: three c one equals nine, so c one is three, and then c two is two. Rebuild it to check: three of the first street and two of the second land on four, five. So the same point has three different addresses: four, five in the standard grid, one, two in blue and gold, and three, two in teal.

**VISUAL:** Two small swatches: "order matters" — swap the two streets and (1, 2) becomes (2, 1). Label: "ordered basis".

**NARRATION:**
One small detail. If you swap the order of the streets, the address swaps too. One, two becomes two, one. So we always list the basis in a fixed order, and call it an ordered basis.

**TERM ▸ ordered basis**

### 4.5 Making a basis from what you have

**VISUAL:** "Trim" animation: a spanning list `(1, 1), (2, 2), (1, 0), (0, 1)` enters a conveyor. Each arrow is checked against the span of those already kept: (1, 1) kept; (2, 2) = 2(1, 1) → discarded; (1, 0) kept; (0, 1) = (1, 1) − (1, 0) → discarded. Result: basis `(1, 1), (1, 0)`.

**NARRATION:**
Where do bases come from? Two ways, and both use the dependence lemma from the last act. If you have a list that reaches everything but has dead weight, walk along it and throw away every move you could already make from the ones you've kept. What's left still reaches everything, and has no dead weight, so it's a basis. Here, one, one stays. Two, two is just twice that, so it goes. One, zero is new, so it stays. And zero, one is one, one minus one, zero, so it goes. Every list that spans contains a basis.

**VISUAL:** "Grow" animation: start from the independent list `(0, 1, 1)`; try e₁, e₂, e₃ in turn; append e₁ (new direction), append e₂ (new), skip e₃ = (0, 1, 1) − e₂. Result: `(0, 1, 1), e₁, e₂`.

**NARRATION:**
And the reverse: if you have an independent list that doesn't reach everything yet, keep adding moves from the standard basis, skipping any that are already reachable. Each new one adds a direction, and you stop when nothing is left out. Every independent list can be extended to a basis.

**TERM ▸ (on screen) "every spanning list contains a basis · every independent list extends to one"**

### 4.6 Why this matters for models

**VISUAL:** A row of 768 numbers (a word's embedding). A "rotate" icon spins the underlying grid; the numbers all change, but a pair of nearby points stays nearby.

**NARRATION:**
This is not just bookkeeping. When researchers say a model's features are "a rotated copy" of another model's features, or that a different basis reveals what a neuron means, they're talking about exactly this: the same arrows, described with different addresses. Keeping the arrows separate from the numbers that describe them is what lets you even ask that question.

---

## Act 5 — Seats
*Terms: dimension, finite-dimensional, the exchange lemma, the dimension bound (more than n vectors in ℝⁿ are dependent).*

### 5.1 Can bases have different sizes?

**VISUAL:** The plane with three different bases flashing: square (2 arrows), blue/gold (2 arrows), teal (2 arrows). A question mark: "could some basis have 3? or 1?"

**NARRATION:**
Every basis we've drawn in the plane has had two moves. Is that a coincidence? Could you find a clever basis of the plane with three moves, or with one?

One is clearly too few: one move only ever reaches a line. Three is more interesting. Could three moves reach the plane with no dead weight at all?

⏸ 4

### 5.2 Musical chairs

**VISUAL:** A row of three chairs. On them sit three cards, w₁ w₂ w₃: a set of moves that reaches all of 3-D space. Guests arrive one at a time: u₁, u₂ — independent moves. Each time a guest sits, one w card stands up and leaves. The row always still reaches all of space.

**NARRATION:**
Here's a game that answers it. Imagine the moves that reach everywhere sitting in a row of chairs. Now independent moves arrive as guests, one at a time. Each time a guest sits down, one of the original moves gives up its seat, and here's the remarkable part: the row can still reach everywhere. The guest can do the job of the move it replaced.

**VISUAL:** Close-up of one swap: the new guest u₁ = (1, 1, 0) sits; w₂ = (0, 1, 0) is revealed to be u₁ − w₁ and stands up.

**NARRATION:**
Why does someone always have to stand up, and why is it never a guest? Here's the careful version. Put all the guests first, then the remaining originals. The enlarged list has dead weight, because the row already reached everywhere before the new guest arrived. Now scan from the left for the first move that can be built from the ones before it. It can't be a guest: the guests are independent, so none of them is built from earlier guests. So it's an original, and removing it keeps the row reaching everywhere.

**VISUAL:** A *proposed* fourth guest arrives at a row of three guests: no original is left to give up a seat. The would-be guest turns red: "can't be independent of the three". Sign: "no seat left".

**NARRATION:**
So follow the game to the end. Every guest takes the seat of an original move. If there are three chairs, at most three independent guests can ever be seated. A proposed fourth guest would need an original move to stand up, and there are none left. So a fourth move can't be independent of the other three.

**VISUAL:** Theorem card: "If k moves are independent and n moves reach everything, then k ≤ n."

**NARRATION:**
That's the exchange lemma. If some list of independent moves sits inside a space that n moves can reach, then there are at most n of them. You can never pack more independent directions into a space than the number of moves it takes to reach it.

**TERM ▸ exchange lemma**

**PRECISE — VISUAL:** The game played with real numbers in ℝ³. Seats hold `e₁, e₂, e₃`. Guests: `u₁ = (1, 1, 0)`, `u₂ = (0, 1, 1)`.
Row 1: `u₁ | e₁ e₂ e₃` — scan left to right for the first move built from earlier ones: `e₂ = u₁ − e₁` → e₂ stands up → `u₁ e₁ e₃`.
Row 2: `u₁ u₂ | e₁ e₃` — is e₁ built from u₁, u₂? `(a, a + b, b) = (1, 0, 0)` forces a = 1, b = 0, but then a + b = 1 ≠ 0: no. Is e₃? `e₃ = −u₁ + u₂ + e₁` ✓ → e₃ stands up → `u₁ u₂ e₁`.
Each row still spans ℝ³; the list length never changes.
Then the theorem in symbols: "If `u₁, …, uₘ` are independent in V and `w₁, …, wₙ` span V, then `m ≤ n`."

**NARRATION:**
Let's play it with real moves. The seats start with the three standard moves. The first guest is one, one, zero. Put it at the front and scan along the row for the first move we could already build from the ones before it. It's e two: one, one, zero minus one, zero, zero is exactly zero, one, zero. So e two stands up.

The second guest is zero, one, one. Scan again. Can we build e one from the two guests? We'd need a, a plus b, b to equal one, zero, zero, which forces a equals one and b equals zero, and then the middle entry is one, not zero. So no. Can we build e three? Yes: minus the first guest, plus the second, plus e one gives zero, zero, one. So e three stands up. At every step the row still reaches all of space, and its length never changes.

In symbols: if m moves are independent in a space that n moves can span, then m is at most n. The proof is exactly this game, played in general.

### 5.3 Dimension

**VISUAL:** Two bases of the same space shown as two rows of chairs. Exchange in both directions: row A fits into row B, row B into row A, so they have the same length.

**NARRATION:**
Now apply the game twice. Take any two bases of the same space. The first is independent and the second reaches everything, so the first can't be longer. Swap their roles, and the second can't be longer either. So every basis of a space has exactly the same number of moves.

That number belongs to the space itself, not to any particular choice of grid. It's called the dimension. The plane has dimension two. Space has dimension three. And ℝⁿ, the lists of n numbers, has dimension n, because the standard basis has n moves.

**TERM ▸ dimension** · **finite-dimensional** ("some finite list of moves reaches everywhere")

**NARRATION:**
A space that some finite list of moves can reach is called finite-dimensional. Everything in this chapter lives in finite-dimensional spaces, though you'll soon meet one that isn't.

**PRECISE — VISUAL:** Four compact result cards, each with a one-picture illustration:
1. **Dimension bound:** in ℝⁿ, any k > n vectors are dependent, and any spanning list has at least n vectors. *(n seats; the (n+1)th guest is turned away.)*
2. **Dimension is well defined:** any two bases of V have the same length. *(Two rows of chairs, exchanged both ways.)*
3. **The right length is enough:** in an n-dimensional space, n independent vectors already span, and n spanning vectors are already independent. *(A full row of n guests: nothing to add, nothing to remove.)*
4. **Subspaces are no bigger** (V finite-dimensional): if U ⊆ V then dim U ≤ dim V, with equality only when U = V. *(A plane inside space: 2 ≤ 3.)*

**VISUAL:** Result 3 gets its own deduction: an independent list of n moves is sent through the "grow" machine from Act 4.5 — it would extend to a basis, but every basis has length n, so nothing gets added: it already spans. A spanning list of n goes through the "trim" machine — every basis has length n, so nothing gets removed: it's already independent.

**NARRATION:**
The game gives us four results almost for free. First, in ℝⁿ, more than n vectors are always dependent, and fewer than n can never span. Second, every basis of a space has the same length, so dimension is well defined. Third, a shortcut: in an n-dimensional space, a list of exactly n vectors only needs to pass one of the two tests. Watch why. Feed n independent moves into the grow machine from Act 4: it would extend them to a basis, but every basis has exactly n moves, so there's nothing to add. They already span. Feed n spanning moves into the trim machine: every basis has n moves, so there's nothing to remove. They're already independent. That saves a lot of work when you're checking a basis. And fourth, a space inside another can't have more dimensions than the one it sits in, and if it has the same number, it's the whole thing.

### 5.4 The payoff we promised

**VISUAL:** The 768 × 3072 matrix from the opening. Its 3072 columns peel out as arrows into a space marked "768 dimensions". A chair row of 768 seats fills; the remaining 2304 arrows queue outside, faded.

**NARRATION:**
Here's the promise from the start of the video. A weight matrix with 768 rows and 3072 columns has 3072 column arrows, and each one is a move in a space of dimension 768. By the exchange lemma, at most 768 of them can be independent. The other columns must be built from those. It doesn't matter how the model was trained, how clever the optimiser was, or how many hours it ran. That's a fact about counting, not about learning.

**VISUAL:** A cloud of "10,000 features" arrows in the 768-seat room; caption "dependent — but how much they interfere is a separate question (Act 9)".

**NARRATION:**
And the same count says that if someone claims a model stores ten thousand separate feature directions in a 768-dimensional space, those directions can't be independent. Whether they still work well is another question entirely, and we'll come back to it when we add geometry.

**PRECISE — VISUAL:** The rank of a matrix defined in one line under the 768 × 3072 picture: "rank(W) = the largest number of independent columns ≤ min(768, 3072) = 768".

**NARRATION:**
The largest number of independent columns a matrix has is called its rank. For this matrix, the rank can be at most 768, the smaller of its two sides. We'll see in Act 8 why rank is the single most useful number you can know about a matrix.

**TERM ▸ rank** (defined here; returns in Act 8)

---

## Act 6 — Vectors that aren't arrows
*Terms: vector space, axioms, zero vector, additive inverse, functions as vectors, polynomials Pₘ, an infinite-dimensional space.*

### 6.1 The same game, different pieces

**VISUAL:** Three panels morph in turn: (1) two sound waves add into a chord, a volume knob scales one; (2) two images blend pixel by pixel, a brightness slider scales one; (3) two polynomials add coefficient by coefficient.

**NARRATION:**
So far every vector has been an arrow. But look at what we actually used. We added moves, and we scaled them. That's all.

Lots of things can be added and scaled. Two sounds can be mixed, and a volume knob scales a sound. Two images can be blended pixel by pixel, and brightness scales an image. Two polynomials can be added term by term. We mean the underlying numerical signals, before clipping them to what a screen or speaker can reproduce. If something can be added and scaled in a well-behaved way, every idea in this video applies to it: span, independence, basis, dimension, all of it.

### 6.2 The rules of the game

**VISUAL:** A chessboard. A knight carved from wood, then a bottle cap, then a coin, each making the same L-shaped move. Caption: "the piece doesn't matter; the rules do".

**NARRATION:**
Think of chess. A knight can be carved wood, a bottle cap, or a coin. What makes it a knight is not what it's made of, but how it's allowed to move. Vectors are the same. A vector is anything that follows the rules of adding and scaling.

**VISUAL:** A rulebook opens to eight short lines, grouped into three coloured sections, each line with a one-phrase gloss:
- *Adding behaves like adding:* order doesn't matter · grouping doesn't matter · there's a "do nothing" vector · every move can be undone
- *Scaling behaves like scaling:* scaling twice is scaling by the product · scaling by 1 changes nothing
- *They cooperate:* scale a sum = sum of the scaled · scale by a sum = sum of the scalings

**NARRATION:**
The rules are short. Adding behaves like ordinary adding: order and grouping don't matter, there's a do-nothing vector, and every move can be undone. Scaling behaves like ordinary scaling. And the two cooperate: scaling a sum is the same as summing the scaled pieces.

A collection of things that follows these eight rules is called a vector space, and the rules are its axioms. The do-nothing vector is the zero vector, and the move that undoes v is its additive inverse, minus v.

**TERM ▸ vector space, axioms, zero vector, additive inverse**

**PRECISE — VISUAL:** The rulebook flips to its symbolic page; each line keeps its plain-English gloss beside it. For all u, v, w ∈ V and a, b ∈ ℝ:
(1) `u + v = v + u` (2) `(u + v) + w = u + (v + w)` (3) there is `0` with `v + 0 = v` (4) each v has `−v` with `v + (−v) = 0`
(5) `a(bv) = (ab)v` (6) `1v = v`
(7) `a(u + v) = au + av` (8) `(a + b)v = av + bv`
Axiom (7) animates as the parallelogram on u and v scaled by 2: the whole picture doubles, diagonal included.

**NARRATION:**
Here are the eight rules in the notation you'll see in every textbook. One and two: order and grouping don't matter when adding. Three: there's a zero vector. Four: every vector has a negative that cancels it. Five and six: scaling twice is scaling by the product, and scaling by one does nothing. And seven and eight are where adding and scaling meet. Seven says that scaling a sum is the sum of the scalings: enlarge the whole parallelogram, and its diagonal enlarges with it. Eight says that scaling by a sum of two numbers is the sum of the two scalings.

**VISUAL:** Theorem card "0v = 0". Proof lines appear, each tagged with the axiom it uses, which lights up in a mini rulebook: `0v = (0 + 0)v = 0v + 0v` (8) → add `−(0v)` to both sides (4, 2, 3) → `0 = 0v`.

**NARRATION:**
And from these eight rules alone, we can prove things that hold in every vector space at once. Here's the first one: zero times any vector is the zero vector. Zero is zero plus zero, so by rule eight, zero times v is zero v plus zero v. Now cancel one copy of zero v from both sides, using rules four, two and three, and you're left with zero equals zero v. The same style of argument shows that minus one times v is exactly minus v. These look obvious for arrows. The point is that they're true for sounds, images and polynomials too, and we proved them once.

**VISUAL:** A false rule: "scale by the size of the number, ignoring sign". (1 blue) plus (−1 blue) under the false rule lands at 2 blue, not home. Red flag on axiom 8.

**NARRATION:**
Why bother writing the rules down? Because pictures can mislead you, and rules can't. Here's a "scaling" that ignores minus signs. It looks harmless, but with it, one move plus minus one move no longer brings you home. One rule breaks, and half of what we've learned stops working.

**PRECISE — VISUAL:** Define `a ⋆ v = |a| v`. With `w = (2, 1)`: left side `1⋆w + (−1)⋆w = w + w = (4, 2)`; right side `(1 + (−1))⋆w = 0⋆w = (0, 0)`. The two results sit side by side with a red ≠. Rule (8) flashes in the rulebook. Below: "so `(−1)⋆w ≠ −w`".

**NARRATION:**
Concretely: define a new scaling that multiplies by the size of the number and throws away its sign. Take w equals two, one. One star w plus minus one star w is w plus w, which is four, two. But one plus minus one is zero, and zero star w is the origin. Rule eight fails. And with it, the fact we just proved, that minus one times v is minus v, fails too. Every theorem leans on the rules, so the rules are the thing to check.

### 6.3 What the rules deliberately leave out

**VISUAL:** A rubber-sheet grid, deformed only by uniform linear stretches and shears with home fixed (no bending): the parallelogram stays a parallelogram, the sum still lands at the corner, but the lengths and angles shown in a corner readout change wildly.

**NARRATION:**
Notice what's not in the rules: length and angle. Nothing in them says how long a move is, or whether two moves are perpendicular. Everything we've done so far would survive if you drew it on a rubber sheet and stretched or sheared it evenly, keeping home fixed. Not any wobbly deformation: bending would break straight lines. Just uniform stretches and shears. Length and angle are extra structure, added on top, and we'll add them in Act 9. Keep that in mind whenever someone measures "similarity" between vectors. It's a choice of geometry, not a fact the vectors carry around.

### 6.4 Polynomials, and a space with no end

**VISUAL:** Polynomial 3 + 2x − x² as a three-bar chart of coefficients; the basis 1, x, x² shown as three "moves". Then a growing tower x³, x⁴, x⁵… each adding a new bar that the previous ones can't reach.

**NARRATION:**
Polynomials make the point beautifully. A polynomial of degree at most two, like three plus two x minus x squared, is a recipe: three of the move "one", two of the move "x", minus one of the move "x squared". Those three are a basis, so this space has dimension three. We call it P₂.

**PRECISE — VISUAL:** Two polynomials as coefficient bars: `p = 1 + 2x − x²`, `q = 2 − x + 3x²`. `p + q = 3 + x + 2x²` (bars stack), `2p = 2 + 4x − 2x²` (bars double). Then the coordinate vector: `[3 + 2x − x²]_(1, x, x²) = (3, 2, −1)`. Finally a second basis `(1, 1 + x, 1 + x + x²)` gives the same polynomial a different address, `(1, 3, −1)`, with a check line `1·1 + 3·(1 + x) − 1·(1 + x + x²) = 3 + 2x − x²` ✓.

**NARRATION:**
Adding polynomials adds their coefficients, and scaling multiplies them, so P₂ behaves exactly like ℝ³. In the basis one, x, x squared, our polynomial's address is three, two, minus one. And just like the city, a different basis gives a different address: in the basis one, one plus x, one plus x plus x squared, the same polynomial has address one, three, minus one. Rebuild it and check: you get three plus two x minus x squared again. Same object, different coordinates, even with no arrows in sight.

But now consider all polynomials, of every degree. Any finite list of them has some highest degree, so it can never reach x to the next power. No finite list reaches everything. That space is infinite-dimensional. Other function spaces, including infinite-dimensional ones, appear in Fourier analysis and kernel methods. Same rules, bigger world.

**TERM ▸ Pₘ (polynomials of degree ≤ m), infinite-dimensional**

---

## Act 7 — Worlds inside worlds
*Terms: subspace, closed under addition and scaling, intersection, sum of subspaces, direct sum ⊕, dimension of a sum, affine set, affine combination, convex combination, affine span, convex hull.*

### 7.1 A closed world

**VISUAL:** In 3-D, the drone's tilted sheet from Act 2. The drone mixes moves inside it: every sum and scaling stays on the sheet. The sheet glows: "closed".

**NARRATION:**
Remember the tilted sheet the drone could reach? It has a lovely property. Add any two points on it, and you stay on it. Scale any point on it, and you stay on it. It's a closed world: what happens on the sheet stays on the sheet.

A set like that, which contains home and is closed under adding and scaling, is called a subspace. It's a vector space living inside a bigger one.

**TERM ▸ subspace** ("contains home; closed under adding and scaling")

### 7.2 Three ways to fail

**VISUAL:** Four 2-D tiles, each a short animation:
1. Line through home (y = 3x): sums and multiples stay on it. ✓
2. The same line shifted up (y = 3x + 1): misses home. ✗ "no home"
3. The right half-plane: v is in it, but −v escapes. ✗ "can't flip"
4. The two axes together: (1, 0) and (0, 1) are in it, their sum (1, 1) escapes. ✗ "sums escape"

**NARRATION:**
Here's how to test a set. Does it contain home? Is it closed under adding? Is it closed under scaling? A line through home passes all three. Slide that line up a little and it misses home, so it fails immediately. A half-plane fails because you can't flip a move and stay inside. And here's a sneaky one: the two axes together. Each axis is fine on its own, but one step right plus one step up lands you off both axes. Gluing two subspaces together doesn't give you a subspace.

**PRECISE — VISUAL:** The three-part test as a checklist, applied live to `Y = {(x, y, z) : x + 2y − z = 0}`:
1. `0 + 0 − 0 = 0` ✓
2. if `x + 2y − z = 0` and `x′ + 2y′ − z′ = 0`, adding gives `(x + x′) + 2(y + y′) − (z + z′) = 0` ✓
3. multiplying by c gives `cx + 2(cy) − cz = 0` ✓
Then solve for z: `(x, y, x + 2y) = x(1, 0, 1) + y(0, 1, 2)`, so `Y = span{(1, 0, 1), (0, 1, 2)}` — a plane, drawn in 3-D.

**NARRATION:**
Let's run the test on a set described by an equation: all points where x plus two y minus z equals zero. Home satisfies it. If two points satisfy it, adding the two equations shows their sum does too. And multiplying the equation by any number shows every scaled point does too. Three ticks: it's a subspace. And now we can see which one. Solve for z, and every point is x times one, zero, one plus y times zero, one, two. So this subspace is the span of those two moves, a plane through home. That's no accident: in finite dimensions, every subspace is the span of some list of moves. Subspace emphasises the place; span emphasises the moves that build it.

**TERM ▸ (on screen) "every span is a subspace — the smallest one containing its moves"**

### 7.3 Combining two worlds

**VISUAL:** Two planes through home in 3-D, floor (z = 0) and a wall (x = 0), meeting along a line. The overlap line glows: "intersection". Then everything reachable by "a move from the floor plus a move from the wall" fills all of space: "sum".

**NARRATION:**
So how do you combine two subspaces properly? Two ways. Their overlap, the points in both, is always a subspace. That's the intersection. And instead of gluing them, you can let yourself use moves from both: anything you get by taking a move from the first and a move from the second and adding them. That's the sum of the two subspaces, and it's the smallest subspace that contains both.

**TERM ▸ intersection, sum of subspaces**

**VISUAL:** Counter animation: floor has 2 directions, wall has 2 directions, 2 + 2 = 4… but the shared line is counted twice: 4 − 1 = 3. Formula fades in: dim(U + Y) = dim U + dim Y − dim(U ∩ Y).

**NARRATION:**
How big is the sum? The floor has two directions, the wall has two, but they share one: the line where they meet. Count naively and you get four. But you counted the shared line twice, so subtract it once: three. That's the dimension formula for a sum, and it's exactly the same idea as counting people in two overlapping clubs.

**TERM ▸ dimension of a sum**

**VISUAL:** The floor and a line poking straight up through home (no overlap but home). Any point splits uniquely into a floor part plus a line part: the split animates for (3, 4, 5). Then the floor + wall example: the same point splits two different ways, sliding along the shared line.

**NARRATION:**
Now compare two situations. The floor plus a vertical line: they share only home. Every point in space splits in exactly one way, a floor part plus a vertical part. But the floor plus the wall share a whole line, and now points can be split in many ways, because you can slide a bit of the shared direction from one part to the other.

When two subspaces share only home, so every split is unique, we call their sum a direct sum, written with a plus inside a circle.

**TERM ▸ direct sum (⊕)**

**PRECISE — VISUAL:** Definitions: `U + Y = {u + w : u ∈ U, w ∈ Y}`; the sum is **direct**, `U ⊕ Y`, when each vector of U + Y splits as u + w in exactly one way. Theorem: `U + Y is direct ⇔ U ∩ Y = {0}`. Proof of ⇐ animated: two splits `u + w = u′ + w′` → rearrange `u − u′ = w′ − w`; the left side glows "in U", the right side "in Y", so both are in `U ∩ Y = {0}` → `u = u′, w = w′`.

**NARRATION:**
In symbols, the sum of U and Y is everything of the form u plus w, with u from U and w from Y. And here's why sharing only home forces a unique split. Suppose some vector had two splits. Rearrange, and u minus u prime equals w prime minus w. The left side lives in U. The right side lives in Y. So that vector lives in both, and the only thing in both is home. So the two splits were the same. The overlap is exactly the slack.

**VISUAL:** A worked split in 3-D. `U = span{(1, 1, 0), (0, 1, 1)}`, `Y = span{(1, 0, 1)}`, target `x = (3, 4, 5)`. Equations `a + c = 3`, `a + b = 4`, `b + c = 5`; add all three: `2(a + b + c) = 12` → `a + b + c = 6` → `b = 3, c = 2, a = 1`. So `u = (1, 4, 3)`, `w = (2, 0, 2)`, and the parallelogram on u and w has x at its far corner.

**NARRATION:**
With numbers: split three, four, five between a plane U and a line Y that meets it only at home. Write the unknown amounts, get three equations, and use a neat trick: add all three, and you get twice the total, so the total is six. Subtract each equation from that, and the amounts fall out: one, three and two. So the plane part is one, four, three, and the line part is two, zero, two. They add up to three, four, five, and because U and Y share only home, that's the only split there is.

**VISUAL:** Caption: "two planes in 3-D always share at least a line: 2 + 2 − 3 = 1".

**NARRATION:**
And here's a consequence you can now prove in your head. Two planes through home in three-dimensional space must share at least a line. Their sum can be at most three-dimensional, so the overlap must make up the difference.

### 7.4 Worlds that miss home

**VISUAL:** A wall with a floor line. A shelf is mounted parallel to the floor, one unit up. On the shelf sit two books, p and q. The floor is labelled "subspace S"; the shelf "S shifted by p".

**NARRATION:**
Some flat worlds don't pass through home at all. Think of a shelf on a wall, parallel to the floor but lifted off it. The floor is a subspace. The shelf is that same subspace, shifted. That's called an affine set: a translated subspace. It need not pass through home, though it may, if the shift happens to lie inside the subspace.

**TERM ▸ affine set** ("a translated subspace — need not contain home")

**VISUAL:** Points p = (1, 0) and q = (0, 1) on the line x + y = 1. Their sum (1, 1) falls off the line. Their midpoint (½, ½) stays on it. A slider t sweeps (1 − t)p + tq along the whole line; for t between 0 and 1, the segment between them lights up.

**NARRATION:**
Shelves have their own rules. Add two books on the shelf and you fall off: the sum is too high. But average them, and you stay on the shelf. In fact, any mix whose amounts add up to one stays on the shelf. That kind of mix is called an affine combination. If the amounts are also never negative, you stay between the two books, and that's a convex combination.

The whole line through the books is their affine span. The stretch of shelf between them is their convex hull.

**TERM ▸ affine combination, convex combination, affine span, convex hull**

**PRECISE — VISUAL:** The shelf line written as a shifted subspace: `{x + y = 1} = (1, 0) + span{(−1, 1)}`, every point `(1 − t, t)`. Then the identity that explains the rule, with the anchor term boxed:
`Σ aᵢ (x₀ + sᵢ) = (Σ aᵢ) x₀ + Σ aᵢ sᵢ`.
Three cases tick by: `Σaᵢ = 1` → stays on the shelf `x₀ + S`; `Σaᵢ = 2` → lands on a parallel shelf twice as high; `Σaᵢ = 0` → lands on the floor S.

**NARRATION:**
Here's the precise version. The shelf, x plus y equals one, is the point one, zero, plus the line spanned by minus one, one. Every point on it is one minus t, t. Now take any mix of points on a shelf, each written as the anchor plus something in the floor. The mix equals the sum of the amounts, times the anchor, plus a mix of floor moves, which stays in the floor. So if the amounts add to one, you get exactly one copy of the anchor and you stay on the shelf. If they add to two, you land on a shelf twice as high. If they add to zero, you fall to the floor. That's why averages are safe and sums aren't.

**VISUAL:** A cloud of data points far from home. An arrow from home to each point (all pointing roughly the same way). Then the cloud slides so its centre sits at home: the arrows now point outward from the centre, showing the spread around the mean.

**NARRATION:**
Two places you'll meet this in practice. A bias term in a network, W x plus b, shifts every output by the same vector b. And when you subtract the mean of a dataset, you're moving the shelf back down to the floor. Before centring, every data point is an arrow pointing roughly the same way, toward the cloud. After centring, the arrows show how the data varies around its mean. For a method like PCA, that's exactly the point: centring lets you study variation around the mean, rather than the cloud's offset from home. It doesn't make the cloud spread into every direction; it just puts home at its centre.

---

## Act 8 — Machines made of arrows
*Terms: matrix, matrix–vector product as a combination of columns, column space, rank, null space (preview), invertible matrix, change of basis as a matrix, low-rank update ΔW = LR.*

### 8.1 Put the moves in a box

**VISUAL:** The control panel with blue and gold sliders. The two arrows lift and stand upright side by side, their numbers becoming the two columns of a grid. The slider values become a small column of two numbers. "Matrix × recipe = destination".

**NARRATION:**
We've been using matrices this whole time without writing one down. Take the moves and stand them side by side as columns. That grid of numbers is a matrix. Write the recipe, the amounts, as a short column too. Then multiplying the matrix by the recipe means exactly one thing: scale each column by its amount and add them up.

**TERM ▸ matrix, matrix–vector product**

**VISUAL:** A mixing desk: two channel strips labelled with the columns, faders set to 1 and 2, output meter showing the green target (4, 5).

**NARRATION:**
If you like, think of a mixing desk. Each column is a channel. The recipe is the fader positions. And the output is the mix. That's all a matrix does to a vector: it mixes its own columns.

**PRECISE — VISUAL:** The column picture with our cast: `V = [u v] = [[2, 1], [1, 2]]` (columns outlined blue and gold), `c = (1, 2)`:
`Vc = 1·(2, 1) + 2·(1, 2) = (4, 5)`. Then the general form `Vc = [v₁ ⋯ vₖ](c₁, …, cₖ) = c₁v₁ + ⋯ + cₖvₖ`, with shape labels: V is n × k → "k amounts in, n coordinates out".
Then the row picture as a cross-check: row 1 · c = `2·1 + 1·2 = 4`, row 2 · c = `1·1 + 2·2 = 5`.

**NARRATION:**
With our cast: the matrix with columns blue and gold, times the recipe one, two, is one blue plus two gold, which is four, five. The green target, as a matrix product. In general, a matrix with n rows and k columns takes in k amounts, one per column, and puts out a vector with n entries. There's a second way to compute the same thing, row by row: each output entry is a row of the matrix multiplied entry by entry with the recipe and added. Row one gives two plus two, four; row two gives one plus four, five. Same answer. The column picture tells you what it means; the row picture is how you'd compute it by hand.

**TERM ▸ (on screen) "n × k matrix: k in, n out"**

### 8.2 Every question we've asked, in one line

**VISUAL:** Four cards flip, each pairing a picture from earlier acts with its matrix form:
- "Can I reach the target?" → is there a recipe c with V c = T?
- "Everywhere I can reach" → the column space
- "Is there dead weight?" → is there a non-zero c with V c = 0?
- "How many directions really?" → rank

**NARRATION:**
Now every question from this video fits in one line. Can I reach the target? That asks whether some recipe makes the matrix output the target. Everywhere the matrix can reach is the span of its columns, called its column space. Is there dead weight? That asks whether some non-zero recipe outputs zero: a round trip. And the number of genuinely independent directions among the columns, the dimension of the column space, is called the rank.

**TERM ▸ column space** (and rank, revisited from Act 5)

**PRECISE — VISUAL:** `rank(V) = dim(column space) ≤ min(n, k)`. For our three-column panel `[u v w] = [[2, 1, 3], [1, 2, 3]]`: column space = ℝ², rank 2, though there are 3 columns.

**VISUAL:** The three-column matrix [blue gold purple]. The round trip (1, 1, −1) feeds in; the output meter reads zero. All multiples of it light up as a line of "silent recipes". Caption: "null space — next chapter".

**NARRATION:**
Those round-trip recipes, all the inputs that the machine sends to zero, form their own subspace. It's called the null space, and it's the star of the next chapter.

**TERM ▸ null space** (preview)

**PRECISE — VISUAL:** Every recipe for the target with the three-column panel: `x(2, 1) + y(1, 2) + z(3, 3) = (4, 5)` → `x = 1 − z`, `y = 2 − z`, z free → recipes `(1, 2, 0) + z·(−1, −1, 1)`. A slider on z shows the craft taking different routes that all end at the target. The direction `(−1, −1, 1)` is highlighted: "a null-space recipe — adding it changes the route, not the destination".

**NARRATION:**
Here's how the two ideas fit together. With the three-control panel, every recipe for the target is one particular recipe, one, two, zero, plus any amount of the round trip minus one, minus one, one. Slide that amount and the craft takes a different route every time, but always lands on the target. Every solution is one solution plus something from the null space. That sentence will run through the whole next chapter.

### 8.3 Changing address with a matrix

**VISUAL:** The target with its two addresses: (1, 2) in the blue/gold grid, (3, 2) in the teal grid. Arrow 1: "build the place from its blue/gold address" (multiply by B). Arrow 2: "read its teal address" (undo Q). Composite label: [T]_Q = Q⁻¹ B [T]_B.

**NARRATION:**
Remember changing address? It's two machine steps. First, build the actual place from its old address: multiply by the old basis. Then ask for its address in the new grid, which means undoing the new basis machine. A machine you can undo is called invertible, and the undo machine is its inverse. So changing address is: build with B, then undo Q.

**TERM ▸ invertible matrix, inverse**

**PRECISE — VISUAL:** The derivation, one line each:
`v = B[v]_B` (build from the B-address) · `v = Q[v]_Q` (build from the Q-address) · so `Q[v]_Q = B[v]_B` · so `[v]_Q = Q⁻¹ B [v]_B`.
With our numbers: `B[T]_B = [[2, 1], [1, 2]](1, 2) = (4, 5)`, then solving `Q d = (4, 5)` with `Q = [[2, −1], [1, 1]]` gives `d = (3, 2)` ✓ — the teal address from Act 4. A note: "in code, solve Q d = B c; don't form Q⁻¹".

**NARRATION:**
In symbols: the place equals B times its B-address, and it also equals Q times its Q-address. Set those equal and undo Q, and the Q-address is Q inverse times B times the B-address. Read it right to left: build, then translate. With our numbers, building from one, two in the blue-gold grid gives four, five, and translating into the teal grid gives three, two, exactly the address we found by hand. In practice you never compute the inverse explicitly; you solve the equation, which is faster and more accurate.

### 8.4 The fine-tuning trick

**VISUAL:** A huge frozen matrix W (grey, 4096 × 4096). Beside it, a thin tall matrix L (4096 × 8) and a short wide matrix R (8 × 4096). Their product ΔW appears, and every one of its 4096 columns is drawn as an arrow inside the faint 8-dimensional "room" spanned by L's columns.

**NARRATION:**
Now the trick from the opening. To fine-tune a giant matrix, low-rank adapters don't train the whole thing. They train a small update, written as a tall thin matrix L times a short wide one R.

Here's what you can now see. Each column of the update is L times some recipe: a mix of L's columns. So every column of the update lives inside the span of just L's few columns. If L has eight columns, the update has rank at most eight, however big the original matrix is. That's why it's called low-rank, and why it's so cheap: you're only choosing directions inside a small room.

**TERM ▸ low-rank update (ΔW = LR)**

**PRECISE — VISUAL:** Shapes `L: 4096 × 8`, `R: 8 × 4096`, `ΔW = LR: 4096 × 4096`. Column j of ΔW: `ΔW[:, j] = L · R[:, j] = Σₖ R[k, j] · L[:, k]` — a recipe over L's 8 columns. Conclusion: `column space(ΔW) ⊆ span(columns of L)` ⇒ `rank(ΔW) ≤ 8`. Parameter count: `2 × 4096 × 8 = 65,536` vs `4096² ≈ 16.8 million`.

**NARRATION:**
Here's the argument in full. Column j of the update is L times column j of R, which is a recipe over L's eight columns. So every column of the update lies in the span of those eight columns, and the rank is at most eight. And look at the counts: L and R together have about sixty-five thousand numbers to train, instead of almost seventeen million. That's the whole trick, and it's just span and rank.

**VISUAL:** Caption: "rank(ΔW) ≤ 8 limits directions, not size · W + ΔW need not be low-rank · L and R are both trained".

**NARRATION:**
One careful note: it's the update that has rank at most eight, not the resulting weight matrix, which can still have full rank. And rank limits the number of independent directions the update can produce, not its size: a rank-one update can still be huge. Training learns both the small room, through L, and the recipes inside it, through R.

---

## Act 9 — Adding geometry
*Terms: inner product, dot product, norm (length), unit vector, distance, angle, cosine similarity, orthogonal, Cauchy–Schwarz inequality, triangle inequality, Gram matrix, cross-talk / interference, positive definite (one line).*

### 9.1 How much of one move points along another?

**VISUAL:** Blue u and gold v from home. A lamp directly above u's line; v casts a shadow on that line. As v rotates, the shadow lengthens, shrinks, vanishes at 90°, and goes negative past it. A live number tracks it.

**NARRATION:**
Remember, the rules said nothing about length or angle. Now we add them. Start with a question: how much of the gold move points along the blue one?

Imagine a light shining straight down onto blue's line. Gold casts a shadow on it. When gold points almost along blue, the shadow is long. When gold is perpendicular to blue, the shadow vanishes. Point gold backwards, and the shadow points backwards too.

**VISUAL:** Readout: u · v = 2·1 + 1·2 = 4. Then |u| = √(2² + 1²) = √5 drawn as a right triangle with legs 2 and 1.

**NARRATION:**
The number that measures this is the dot product: multiply matching entries and add. For blue and gold, that's two times one plus one times two, which is four. The dot product of a move with itself gives its squared length, so blue's length is the square root of five, which is just Pythagoras.

**TERM ▸ inner product, dot product, norm (length)**

**PRECISE — VISUAL:** `u · v = uᵀv = Σ uᵢvᵢ`, `‖v‖ = √(vᵀv)`. A card "an **inner product** ⟨u, v⟩ is any rule that is symmetric, linear in each slot, and positive (⟨v, v⟩ > 0 for v ≠ 0)"; the dot product is the standard one.

**NARRATION:**
In symbols, the dot product of u and v is the sum of u i times v i, also written u transpose v. The length, or norm, is the square root of a vector's dot product with itself. More generally, any rule for multiplying two vectors that is symmetric, linear in each input, and gives a positive number for any non-zero vector with itself, is called an inner product. The dot product is the standard one, but not the only one, and that will matter in a moment.

**VISUAL:** The shadow labelled (u · v) / |u| = 4 / √5, next to the dot product 4: "signed component along u = dot product ÷ length of u" (negative when v points away from u).

**NARRATION:**
Strictly, the shadow is a signed component: positive along blue, negative when gold points away, and it equals the dot product divided by blue's length. The two agree when blue has length one, which is why we often shrink moves to length one first. A move of length one is a unit vector.

**TERM ▸ unit vector**

### 9.2 Angles and similarity

**VISUAL:** The angle between u and v drawn: cos θ = 4 / (√5 · √5) = 0.8, θ ≈ 37°. A dial swings from cos = 1 (same direction) to 0 (perpendicular) to −1 (opposite).

**NARRATION:**
Divide the dot product by both lengths and you get a number between minus one and one. That's the cosine of the angle between the moves. One means same direction, zero means perpendicular, minus one means opposite. For blue and gold, it's four fifths: about thirty-seven degrees apart.

That's the cosine similarity that recommender systems and embedding search use everywhere. It only makes sense for two non-zero vectors: the zero vector has no direction, and you'd be dividing by zero.

**TERM ▸ angle, cosine similarity**

**VISUAL:** A parabola: the squared length of (u − t·v) as t varies, never dipping below zero, touching zero only when u is a multiple of v.

**NARRATION:**
Why is it always between minus one and one? Slide along gold's line looking for the point closest to blue's tip. The squared distance can never be negative, and writing that down gives exactly the bound. It's called the Cauchy–Schwarz inequality, and its cousin, the triangle inequality, says a detour is never shorter than going straight.

**TERM ▸ Cauchy–Schwarz inequality, triangle inequality, distance**

**PRECISE — VISUAL:** The proof beside the parabola:
If `v = 0` both sides are 0 — done. Otherwise `0 ≤ ‖u − tv‖² = ‖u‖² − 2t (u·v) + t²‖v‖²`; complete the square: `= ‖v‖² (t − (u·v)/‖v‖²)² + ‖u‖² − (u·v)²/‖v‖²`; the bracket vanishes at the lowest point `t = (u·v)/‖v‖²`, so `0 ≤ ‖u‖² − (u·v)²/‖v‖²` ⇒ `(u·v)² ≤ ‖u‖²‖v‖²` ⇒ `|u·v| ≤ ‖u‖ ‖v‖`, equality exactly when u and v are linearly dependent (for v ≠ 0: the parabola touches zero, u is a multiple of v).
Then: `cos θ = u·v / (‖u‖ ‖v‖)`; distance `‖u − v‖`; triangle inequality `‖u + v‖² = ‖u‖² + 2u·v + ‖v‖² ≤ (‖u‖ + ‖v‖)²`. With our cast: `‖u + v‖ = ‖(3, 3)‖ = 3√2 ≈ 4.24 ≤ √5 + √5 ≈ 4.47`.

**NARRATION:**
Here's that argument on the screen. If v is the zero vector, both sides are zero and there's nothing to prove. Otherwise, the squared length of u minus t v is a parabola in t, and it can never go below zero. Complete the square, and the parabola is the squared length of v times a perfect square, plus a constant. The perfect square vanishes at its lowest point, so that constant, the squared length of u minus the dot product squared over the squared length of v, must itself be at least zero. Rearranged, that says the square of the dot product is at most the product of the squared lengths. Take square roots, and that's the Cauchy–Schwarz inequality. It's exactly what makes the cosine a number between minus one and one, so angles make sense. Equality holds exactly when u and v are linearly dependent: if v is zero that's automatic, and otherwise it's when the parabola touches zero, which means u is a multiple of v.

And Cauchy–Schwarz gives the triangle inequality in one line. Expand the squared length of u plus v, and bound the middle term using Cauchy–Schwarz. For blue plus gold, the straight route has length about four point two four, and the detour along blue then gold has length about four point four seven. Going straight is never longer.

### 9.3 Perpendicular means independent (but not the other way round)

**VISUAL:** Three mutually perpendicular arrows in 3-D: try to make a round trip; each arrow's shadow on the others is zero, so it fails. Then blue and gold (37° apart): independent, but not perpendicular.

**NARRATION:**
Moves that are perpendicular to each other are called orthogonal, and mutually orthogonal non-zero moves are automatically independent: none of them casts any shadow on the others, so there's no way to build one from the rest. But the reverse isn't true. Blue and gold are independent, and they're not perpendicular at all.

**TERM ▸ orthogonal**

**PRECISE — VISUAL:** Proof: suppose `Σ cᵢvᵢ = 0` with the vᵢ non-zero and mutually orthogonal. Take the dot product with vⱼ: every term `cᵢ vᵢ·vⱼ` with i ≠ j vanishes (struck out), leaving `cⱼ ‖vⱼ‖² = 0` ⇒ `cⱼ = 0`. Do it for every j.

**NARRATION:**
The proof is a single move. Take a supposed round trip, and dot both sides with one of the moves. Every other term vanishes, because the moves are perpendicular, leaving that move's amount times its squared length equals zero. Its length isn't zero, so its amount must be. Do that for every move, and the only round trip is doing nothing.

### 9.4 Crowded rooms

**VISUAL:** A party: three speakers, each with a microphone. When the mics point at their own speaker, each hears only them. Then three feature arrows 120° apart in the plane, more features than dimensions. Feature 1 and feature 2 are "on"; each microphone reads its own feature plus a share of the others: ½, ½, −1.

**NARRATION:**
Here's where geometry meets the counting from Act 5. This is a simplified model of what's called superposition: it illustrates the algebra, not a universal account of how networks decode features. Suppose a model stores more feature directions than it has dimensions, so they can't all be perpendicular. Picture three microphones at a crowded party. If each points only at its own speaker, it hears only them. But if the mics are angled toward each other, each one picks up some of the neighbours.

Here are three feature directions squeezed into a flat plane. Turn on features one and two. When we read out feature one, we get a half, not one, and feature three, which is off, reads minus one. That leakage is called cross-talk, or interference, and it's exactly the dot products between the feature directions.

**TERM ▸ cross-talk / interference**

**PRECISE — VISUAL:** Encoding `x = Σ aᵢ fᵢ` with unit vectors fᵢ. Readout for feature j:
`fⱼᵀx = aⱼ + Σ_{i≠j} aᵢ fⱼᵀfᵢ` — first term labelled "the signal", the sum labelled "cross-talk". For the 120° example `fᵢᵀfⱼ = −½`: `f₁ᵀx = 1 − ½ = ½`, `f₂ᵀx = ½`, `f₃ᵀx = −½ − ½ = −1`.

**NARRATION:**
Here's the formula behind that. Encode the active features as x, the sum of each feature's amount times its direction. Reading out feature j with a dot product gives that feature's own amount, the signal, plus every other active feature's amount times its overlap with feature j. That second part is the cross-talk. Three directions a hundred and twenty degrees apart overlap by minus a half each, which is exactly where the half and the minus one come from. Small overlaps help, even when the directions can't all be perpendicular. But the total also depends on how many features are active and how strongly: many small overlaps can add up. The formula shows exactly why.

**VISUAL:** A small table of all pairwise dot products for a set of columns, labelled "Gram matrix". Highlight the off-diagonal entries: "the overlaps".

**NARRATION:**
If you collect every pairwise dot product of a set of moves into a table, you get the Gram matrix. Its diagonal holds the squared lengths, and everything off the diagonal is an overlap, a potential source of cross-talk. It also detects dead weight: the moves are dependent exactly when some non-zero recipe gives zero length.

**TERM ▸ Gram matrix**

**PRECISE — VISUAL:** `G = VᵀV`, entries `Gᵢⱼ = vᵢᵀvⱼ`. For our cast `V = [u v]`: `G = [[5, 4], [4, 5]]`. Identity: `cᵀGc = (Vc)ᵀ(Vc) = ‖Vc‖²`. Theorem: `Gc = 0 ⇔ Vc = 0` (if Gc = 0 then ‖Vc‖² = cᵀGc = 0).

**NARRATION:**
In symbols, the Gram matrix is V transpose V. For blue and gold it's five, four, four, five: squared lengths five on the diagonal, overlap four off it. And here's the useful identity: c transpose G c equals the squared length of V c. So if G sends some recipe to zero, the squared length of V c is zero, so V c is zero. The Gram matrix sees exactly the same dead weight as the moves themselves.

**VISUAL:** The teal grid: two vectors that are perpendicular in the square grid have coordinates in the teal grid whose plain dot product isn't zero. Caption: "the dot product of the addresses ≠ the dot product of the vectors".

**NARRATION:**
One warning to finish. Dot products depend on geometry, not just addresses. If you change to a skewed basis and take the dot product of the new addresses, you'll get the wrong answer. Geometry is extra structure, and it has to be carried along when you change grids. A matrix that defines a valid geometry this way is called positive definite, a word you'll meet properly in later chapters.

**TERM ▸ positive definite** (named only)

**PRECISE — VISUAL:** If `x = Bc` and `y = Bd`, then `xᵀy = cᵀ(BᵀB)d` — the correct dot product in B-addresses carries `BᵀB` in the middle; plain `cᵀd` is wrong unless `BᵀB = I`. Example with e₁, e₂ and the teal basis: true `e₁·e₂ = 0`, but their teal addresses `(⅓, −⅓)` and `(⅓, ⅔)` have plain dot product `−⅑`.

**NARRATION:**
Here's the exact fix. If x is B times c and y is B times d, then their true dot product is c transpose, B transpose B, d. That middle matrix carries the geometry into the new addresses. Leave it out and you get the wrong answer. Two perpendicular standard moves, written in the teal grid, have a plain dot product of minus one ninth instead of zero. And a matrix that can sit in the middle like this, symmetric with z transpose M z positive for every non-zero z, is exactly what positive definite means.

---

## Act 10 — Fragile addresses
*Terms: near-dependence, ill-conditioned, condition number, sensitivity, tolerance, numerical rank, elimination and pivot (named), floating point.*

### 10.1 Independent, but only just

**VISUAL:** Two near-parallel thrusters: blue (1, 0) and red (1, ε). The target is straight up at (0, 1). A slider shrinks ε from 1 → 0.5 → 0.1 → 0.01. Each time, the craft's route to the target becomes a huge trip far right along red and almost all the way back along blue. Live readout: recipe = (−1/ε, 1/ε).

**NARRATION:**
Let's end with a twist. Two moves that are independent still form a perfectly good basis, right? Every place has exactly one address. True. But watch what happens when two moves are almost parallel.

To go one step straight up, the craft has to fly far out along red and almost all the way back along blue. As the two moves get closer together, the trip gets longer and longer. When they're a hundredth apart, you're flying a hundred steps out and a hundred steps back, just to move one step up.

**VISUAL:** A second target, `(1, 0)`, whose recipe is simply `(1, 0)`: one blue step. Nudge it to `(1, 0.01)` at ε = 0.01: the recipe flips to `(0, 1)` — all red, no blue. Readout: target moved 0.01; recipe moved √2 ≈ 1.41, over a hundred times more, relative to their sizes.

**NARRATION:**
And it's worse than inefficient. Take an easy target, one step to the right. Its recipe is one blue step and nothing else. Now nudge it up by one hundredth. The recipe flips completely: no blue at all, one full red step. The target moved by a hundredth; the recipe moved by about one point four. Relative to their sizes, that's more than a hundred times larger. The address is technically unique, but it's fragile. A little noise in the place means a wild change in the description.

**TERM ▸ ill-conditioned, sensitivity**

**PRECISE — VISUAL:** `B_ε = [[1, 1], [0, ε]]`, target `(0, 1)`. Equations: `c₁ + c₂ = 0`, `ε c₂ = 1` → `c₂ = 1/ε`, `c₁ = −1/ε`. Live table: ε = 0.5 → (−2, 2); 0.1 → (−10, 10); 0.01 → (−100, 100). Perturb the target by δ in its second entry: the recipe changes by `(−δ/ε, δ/ε)`; at ε = δ = 0.01 that's a change of 1 in each entry for a 0.01 move of the target.

**NARRATION:**
The algebra makes it exact. The second equation says epsilon times c two equals one, so c two is one over epsilon, and c one is minus that. As epsilon shrinks, one over epsilon explodes. And if the target moves by a small amount delta, the recipe moves by delta over epsilon. Dividing by a tiny number magnifies everything, including errors.

### 10.2 Measuring fragility

**VISUAL:** A gauge labelled "condition number κ₂ (2-norm)", rising as ε shrinks, each reading labelled with its ε: ε = 1 → 2.6, ε = 0.1 → 20, ε = 0.01 → 200, ε = 0.0001 → 20 000. At ε = 0 the needle goes off the scale: "singular". Then the definition and bound: `κ(B) = ‖B‖ ‖B⁻¹‖`, and `‖δc‖ / ‖c‖ ≤ κ(B) · ‖δT‖ / ‖T‖` — labelled "worst case, not every perturbation".

**NARRATION:**
The worst-case amount by which relative changes can be magnified has a name: the condition number. For a square invertible matrix it's the size of the matrix times the size of its inverse, kappa equals the norm of B times the norm of B inverse. And it bounds the damage: the relative change in the recipe is at most kappa times the relative change in the target. That's a worst case; not every nudge is amplified that much. A small condition number means addresses are stable. A huge one means the system is ill-conditioned. Two nearly parallel moves are one cause; wildly unequal lengths are another, even when the moves are perpendicular. When the moves become exactly parallel, the matrix is singular and the condition number is infinite.

**TERM ▸ condition number**

**PRECISE — VISUAL:** An angle-only gauge beside the parallelogram on b₁ and b₂: `h(B) = |det B| / (‖b₁‖ ‖b₂‖)`. Area = base × height → `|det B| = ‖b₁‖ ‖b₂‖ |sin θ|` → `h = |sin θ|`. Perpendicular: h = 1. As the moves close up: h → 0. For our blue/gold: `|det| = 3`, `‖u‖‖v‖ = 5`, `h = 0.6`.

**NARRATION:**
There's also a simple angle-only gauge. Divide the area of the parallelogram by the product of the two lengths. Since area is base times height, that ratio is exactly the sine of the angle between the moves: one when they're perpendicular, sliding to zero as they close up. For blue and gold, the area is three and the lengths multiply to five, so the gauge reads point six. It measures angle only; the condition number also accounts for lengths that are wildly unequal, which is why both exist.

**TERM ▸ Hadamard ratio** (named)

### 10.3 When a computer has to decide

**VISUAL:** A computer chip icon looking at a pivot value 0.000000001. Two judges: "absolute rule: below 10⁻⁶? call it zero" and "relative rule: compared to the biggest value". Multiply the whole matrix by 10⁸ and watch the absolute judge change its verdict while the relative judge doesn't.

**NARRATION:**
This matters because computers never compute exactly. When a program solves for a recipe, it uses a step-by-step method called elimination, and at each step it divides by a number called a pivot. If that number is tiny, is it really small, or is it zero plus a bit of rounding error? The program has to decide with a threshold, a tolerance.

Here's the catch: a fixed threshold can change its mind if you simply rescale your data. A threshold that's relative to the size of the data doesn't. So when a library reports how many independent directions a matrix has, its numerical rank, that answer depends on the tolerance it chose. Exact maths and computer maths can disagree, and now you know why.

**TERM ▸ elimination, pivot, tolerance, numerical rank**

**PRECISE — VISUAL:** Elimination on the collapsed panel (blue and lazy gold), two targets side by side:
`2a + 4b = 6`, `a + 2b = 3` → row₂ − ½ row₁ → `0 = 0` → b is free: infinitely many recipes for (6, 3).
`2a + 4b = 4`, `a + 2b = 5` → row₂ − ½ row₁ → `0 = 3` → impossible: (4, 5) unreachable.
The pivot (the 2 in row 1) is boxed; the second row's would-be pivot is 0.
Then two separate questions, each on its own card. **Residual:** "does this recipe rebuild this target accurately enough?" — `‖Vc − w‖ ≤ atol + rtol · ‖w‖`. **Numerical rank:** "which directions stay distinguishable at this resolution?" — count singular values above a threshold. For diagonal matrices the singular values are just the absolute diagonal entries: `diag(1, 10⁻⁸)` has 1 and 10⁻⁸; `10⁸ · diag(1, 10⁻⁸) = diag(10⁸, 1)` has 10⁸ and 1. Absolute threshold 10⁻⁶ → 1 vs 2 directions; relative threshold 10⁻⁶·σ_max → 1 for both.

**NARRATION:**
Elimination is just the recipe-solving from Act 1, done systematically: subtract a multiple of one equation from another, which never changes the answers because you could add it back. On our collapsed panel, subtract half of the first equation from the second. For six, three, the second equation becomes zero equals zero: no restriction, so there are infinitely many recipes. For four, five, it becomes zero equals three: impossible. The number you divide by at each step is the pivot. A zero candidate pivot may just need a row swap. But when no pivot can be found anywhere in the remaining column, that column supplies no new direction.

On a computer, "zero" has to be decided, and there are two different questions to keep apart. The first is about a residual: does this recipe rebuild this target accurately enough? There a tolerance usually combines an absolute part with a part relative to the size of the target. The second is numerical rank: which directions are still distinguishable at the resolution you care about? That's decided by comparing the matrix's stretch factors, its singular values, with a threshold. For a diagonal matrix they're just the sizes of the diagonal entries. This one stretches one direction by one and the other by a hundred millionth. An absolute threshold of one millionth says one usable direction. Multiply the whole matrix by a hundred million, which changes nothing about its directions, and the same absolute threshold now says two. A threshold relative to the largest stretch says one both times.

---

## Finale — See the whole machine

**VISUAL:** Back to the opening: the craft at home, blue and gold controls, green target. Three quick replays, each with a prediction pause:
1. Add purple → the reachable plane doesn't grow. "New territory? No — a new recipe."
2. Swap to the teal grid → the target doesn't move. "New place? No — a new address."
3. Squeeze gold toward blue → the recipe explodes. "Unreachable? Not yet — but fragile."

**NARRATION:**
Let's go back to where we started. If I add a control built from the others, do I reach anywhere new?

⏸ 3

No. I've gained another recipe, not another destination. If I switch to a different grid, does the target move?

⏸ 3

No. Only its address changes. And if I squeeze two controls almost together, is the target out of reach?

⏸ 3

Not yet. But its recipe has become wildly sensitive.

**VISUAL:** Three words stack up beside the craft: **Reachable? Unique? Stable?**

**NARRATION:**
Those are the three questions to ask of any set of vectors you meet. What can they reach? Is the description unique? And is it stable? Span, independence and basis answer the first two. Conditioning answers the third.

**VISUAL:** The opening montage plays again, now with labels: embedding → "a point in ℝ⁷⁶⁸"; weight matrix → "columns span its reach; rank ≤ 768"; fine-tune → "ΔW = LR: rank ≤ r".

**NARRATION:**
And now the opening montage reads differently. A word inside a model is a point in a space with hundreds of directions. A weight matrix's reach is the span of its columns, and its rank can't exceed its smallest side. A fine-tune that trains a sliver of a model is learning a small room of directions, and the moves inside it.

**VISUAL:** GU logo. End card: "Read the chapter · run the labs · lab.groundup.workers.dev" · "@grounduplab-ai".

**NARRATION:**
The written chapter has the full proofs, more examples, and labs where you'll build these tests yourself. Next time, we'll take the round trips we found today and give them a home of their own: the null space. Until then, when you see a set of arrows, ask where they can take you.

---

## Term ledger (every chapter term, where it is introduced)

| Term | Act | Term | Act |
|---|---|---|---|
| vector; point vs displacement | 1.2 | exchange lemma | 5.2 |
| ℝⁿ | 1.2 | dimension; finite-dimensional | 5.3 |
| vector addition | 1.3 | dimension bound; equal-length bases; right length is enough; dim U ≤ dim V | 5.3 |
| rank (first definition) | 5.4 |
| scalar; scalar multiplication | 1.3 | vector space; axioms | 6.2 |
| linear combination; coefficients | 1.4 | zero vector; additive inverse | 6.2 |
| span | 2.1 | Pₘ; infinite-dimensional | 6.4 |
| span collapse; multiple representations | 2.2 | subspace; closure | 7.1–7.2 |
| span contains origin; spans are flat; closure | 2.4 | intersection; sum of subspaces | 7.3 |
| trivial combination | 3.2 | dimension of a sum; direct sum ⊕ | 7.3 |
| linearly (in)dependent; dependency relation | 3.3 | affine set / translated subspace | 7.4 |
| equivalent forms of dependence | 3.3 | affine & convex combination; affine span; convex hull | 7.4 |
| independence is a property of the list | 3.4 |
| linear dependence lemma; 2-D area test (determinant preview) | 3.3 | bias term; centring data | 7.4 |
| basis | 4.1 | matrix; matrix–vector product | 8.1 |
| coordinates; uniqueness of coordinates | 4.2–4.3 | column space; rank | 8.2 |
| standard basis | 4.4 | null space (preview) | 8.2 |
| coordinate vector [v]_B; change of basis | 4.4 | invertible; inverse | 8.3 |
| ordered basis | 4.4 |
| unique representation (Theorem 8) | 4.3 |
| shrink a spanning list / extend an independent list to a basis | 4.5 | low-rank update ΔW = LR | 8.4 |
| inner product; dot product; norm | 9.1 | cross-talk / interference | 9.4 |
| unit vector | 9.1 | Gram matrix | 9.4 |
| angle; cosine similarity | 9.2 | positive definite (named) | 9.4 |
| Cauchy–Schwarz; triangle inequality; distance | 9.2 | ill-conditioned; sensitivity; condition number; Hadamard ratio | 10.1–10.2 |
| orthogonal | 9.3 | elimination; pivot; tolerance; numerical rank | 10.3 |

**Deliberately not in the video:** practice, not rigor — the exercise banks, the three browser labs' contracts, the NumPy/PyTorch experiments, and the checkpoint. Results whose full proofs are long (Theorems 9–13, Theorem 16) are stated with their key idea and a worked example; the chapter carries the complete proofs.

## Length check (measured in the pilot)

The pilot measured the voice's real rates: **~186 words/min** for conversational beats (speed 0.95) and **~161 words/min** for technical beats (speed 0.82, marked `SLOW|` in the scene code). The revised script has **~9,866 narration words**; with roughly 40% of them technical, narration alone is **~55 minutes**. Reading holds after each equation, prediction pauses and visual transitions add roughly 10–20% in the pilot, giving an **estimated 61–67 minutes** finished. This stays an estimate until each act's audio is synthesised; technical explanations are never sped up to hit a number, and the video is not stretched to reach an hour.

## Production notes

- **Pacing:** see the length check above. Each act is self-contained, opens on a question and closes on a payoff; acts become the YouTube chapters.
- **Visual continuity:** the cast table above is used in every act. Colours never change meaning: blue = u, gold = v, green = target, purple = redundant/derived, teal = an alternative grid, red = fragile/near-parallel.
- **Reuse:** existing Manim assets that already fit this script (craft and lake, collapsing parallelogram, 3-D sheet, musical chairs, skewed street grid, mixing desk, shadow/lamp, microphone party, shelf, near-parallel thrusters) are adapted to the cast above; nothing is spliced in with its old narration.
- **Thinking time (from the v3 review):** Act 7.3 stays on the floor/wall example long enough to show the shared direction, two different splittings and the 2 + 2 − 1 count *before* moving to the direct-sum case; Act 9.4 gives the Gram identity and the changed-coordinate geometry each their own question and pause. Equations stay on screen long enough to be read after they're spoken. Runtime is provisional until audio is synthesised and the storyboard is timed; technical explanations are never sped up to hit a number.
- **Review gates:** (1) this script; (2) a low-resolution render of the Opening + Act 1 for tone and pacing; (3) full render.

## YouTube description (draft)

```
Linear Algebra 1 — Vectors, span, independence and bases

Given some arrows, where can you get to? Starting from a craft with two controls, this lesson builds the core ideas of linear algebra — vectors, linear combinations, span, linear independence, bases and coordinates, dimension, subspaces and direct sums, affine sets, matrices as column combinations, inner products, and conditioning — with every idea introduced through a picture or analogy and then made precise.

📖 Read this chapter (full proofs, worked examples, exercises and in-browser labs):
https://lab.groundup.workers.dev/theory/#02-linear-algebra%2F01-vectors-spaces-bases.md

🧪 GroundUp Lab — machine learning math, built from the ground up:
https://lab.groundup.workers.dev

Subscribe for the next chapter: https://www.youtube.com/@grounduplab-ai

Chapters
(generated from the final cut)

#linearalgebra #machinelearning #math
```

The chapter link is the deep link to this lesson on the site; the build writes this file with real chapter timestamps once the final cut exists.
