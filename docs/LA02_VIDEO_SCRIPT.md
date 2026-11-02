# LA02 video — script and storyboard (step 4 of the [voice plan](LA02_VIDEO_VOICE_PLAN.md), for review)

**Systems, elimination and the four fundamental subspaces — one system, followed all the way down.**

| | |
|---|---|
| Format | One video for the lesson, 60–90 min (see "Length check"); 13 parts plus a short close, which become the YouTube chapters |
| Voice | Kokoro, delivery **V2** from step 2: one synthesis per paragraph, punctuation shaped for delivery, authored pauses only. No fixed gap between beats, no slowed "technical" speed |
| Standard | [Voice plan](LA02_VIDEO_VOICE_PLAN.md) §0, §2 A, C and D. Two questions judge every unit: *does this feel like someone guiding me through the mathematics?* and *is it intuitive for someone new to the material?* |
| Viewer | Knows LA01 (vectors, linear combinations, span, independence, bases, dimension, subspaces, direct sums, affine sets) and school algebra. Nothing else |
| Source | `content/02-linear-algebra/02-systems-elimination-subspaces.md`, §0–§10. Labs, exercises, the checkpoint and the mastery check stay in the chapter |
| Approved text | *One system, two pictures* opens with the approved test passage, wording unchanged; paragraphs 2, 4, 7 and 8 use the punctuation of `PASSAGE_V2` in `scripts/videos/la02/voice_test.py` |

## Reading this script

- **VISUAL** is what is on screen. **NARRATION** is spoken, already in spoken form (numbers and symbols as words). Kokoro does not pause at colons, so narration uses full stops, commas and "…" where a breath is wanted.
- **⏸ n — purpose** is an authored silence of n seconds. Every pause says what the viewer is doing in it. There are no other silences except what the synthesis produces inside a paragraph and the time a visual needs to finish moving.
- **HIDDEN UNTIL AFTER ⏸:** sits directly before every prediction pause and lists what must not be on screen until the pause ends. Nothing on screen may reveal an answer before the viewer has had the pause to predict it.
- **TERM ▸** marks the moment a term is named. Only then does the term appear on screen, as a label on the object it names.
- **PRECISE — VISUAL** is the mathematics on screen: the equation being worked, in standard notation. It builds in step with the narration, never ahead of it. Calculations are shown in full on screen; the narration works one representative step aloud and then says what pattern to follow, instead of reading every entry.
- **Panels.** Whenever an idea involves inputs and outputs, the screen is split: **input panel** on the left, **output panel** on the right, joined by the map. The reference is the approved step-3 sample (`scripts/videos/la02/sample.py`): panel titles **input: the amounts (x, y)** and **output: where the amounts land**, the matrix `A =` centred below and between the two panels, and a curved white arrow labelled *A* carrying an input point to its output. The two are never drawn as one plane, even when both are ℝ². When the spaces cannot be drawn (ℝ⁴), the panels become labelled boxes holding vectors as columns, still left and right.
- **No title cards, no default fades, no typed sentences, no decorative motion.** A change of picture is a teaching event: the old picture turns into the new one when they are related, and clears only when the topic changes. Part headings below are YouTube chapter markers only; nothing appears on screen for them.
- On-screen text is limited to labels, the equation being worked, and a term at the moment it is named.

## Cast

The cast continues from LA01 and the approved sample. Colours never change meaning.

| Character | Value | Colour / where |
|---|---|---|
| Blue column `a₁` | (2, 1) | blue arrow, output panel (LA01's blue move `u`) |
| Teal column `a₂` | (−1, 1) | teal arrow, output panel (LA01's teal grid) |
| The matrix `A` | [[2, −1], [1, 1]] | columns outlined blue and teal |
| Green target `b` | (1, 5) | green dot, output panel |
| The recipe / crossing point | (2, 3) | white dot, input panel only (as in the sample) |
| Row lines | 2x − y = 1 and x + y = 5 | pink `#E58FB5` (2x − y = 1) and purple `#B39DDB` (x + y = 5), each equation's text tinted to match; input panel only |
| Gold column `a₃` (*One system, two pictures* and *Every solution at once* only) | (1, 2) = a₁ + a₂ | gold `#F4C152` (LA01's gold); not purple, which is the x + y = 5 line |
| `A⁻¹` | ⅓ [[1, 1], [−1, 2]] | arrow from output panel back to input panel |
| The 3 × 3 system (*Elimination*, *LU: elimination, remembered*) | rows (2, 1, 1 \| 3), (4, 1, 0 \| 6), (−2, 2, 1 \| 1); solution (1, 2, −1) | chapter §3 and §9 |
| The 3 × 4 system (*When a column has no pivot* through *Four subspaces from one elimination*) | A = [[1, 2, 1, 3], [2, 4, 4, 10], [1, 2, −1, −1]], b = (4, 10, 2) | chapter §4–§7 |
| … its reduced form | R = [[1, 2, 0, 1], [0, 0, 1, 2], [0, 0, 0, 0]] | pivots boxed, free columns 2 and 4 shaded |
| … its pieces | x_p = (3, 0, 1, 0); s₁ = (−2, 1, 0, 0); s₂ = (−1, 0, −2, 1); y = (−3, 1, 1) | |
| Subspace colours | column space: blue–teal wash · row space: orange `#FF8A65` · null space: purple `#B39DDB` (the house subspace colour; never on screen with the x + y = 5 line) · left null space: rose (output side only, never with the pink line) | |
| Numerical danger | — | red, *Elimination on a real machine* only (LA01's "fragile"); distinct from the orange row space |

Other matrices (the composition pair, the rotation, the Gauss–Jordan matrix, the three-digit machine, W₃) are the chapter's own worked examples, used exactly as given.

Numbers in VISUAL and PRECISE blocks are written as digits; NARRATION is already in spoken form.

---

## One system, two pictures
*Chapter §1 (worked example), §0. Terms: none named yet; the two questions, existence and uniqueness, are posed.*

> **Approved test passage — wording locked.** Visual directions as approved for the step-3 sample. Paragraphs 2, 4, 7 and 8 use the `PASSAGE_V2` punctuation.

**VISUAL:** Left half only. A grid titled **input: the amounts (x, y)**. The two equations are written above it.

**NARRATION:**
Here are two equations of the kind you've solved in school. Two x minus y equals one. And x plus y equals five.

**VISUAL:** Each line draws as its equation is spoken. Each equation's text is tinted to match its line.

**NARRATION:**
On its own, each equation is a line. Every point on it makes that equation true. A point on both lines makes both true. So the solution is... wherever they cross.

⏸ 2 — read the crossing point off the grid

**VISUAL:** A dot at (2, 3), with the label "x = 2, y = 3".

**NARRATION:**
Two across, three up. x is two, and y is three.

**VISUAL:** The coefficients in the equations light up column by column: 2 above 1 (blue), then −1 above 1 (teal). Only these coefficients lift out, into the matrix `A = [[2, −1], [1, 1]]`, which settles centred below and between the panels, as in `sample.py`. The right-hand side, 1 above 5, lights up separately; it does not join A, and becomes the green target **b**. The right half now opens: a second grid titled **output: where the amounts land**, with the blue arrow (2, 1), the teal arrow (−1, 1) and the green target b at (1, 5).

**NARRATION:**
Read the same equations down the columns, instead of across the rows. The numbers beside x are two, and one. The numbers beside y are minus one, and one. Each column is an arrow. Blue goes two right and one up. Teal goes one left and one up. And the numbers on the right, one and five, are a target.

Put the columns side by side and you have the matrix A. And the equations are asking the question from chapter one: how much blue, and how much teal, reaches the target?

**VISUAL:** The dot (2, 3) on the left pulses once. Nothing moves on the right yet.

**NARRATION:**
We've already found an answer on the left: two and three. So take two blue arrows, then three teal ones. Where do you think you'll end up?

**HIDDEN UNTIL AFTER ⏸:** the tip-to-tail path, the landing point and the calculation under the panel

⏸ 3 — predict where two blue and three teal will land

**VISUAL:** On the right, two blue arrows lay tip to tail to (4, 2), then three teal arrows to (1, 5). The calculation builds under the panel as each part is spoken:
`2·(2, 1) + 3·(−1, 1) = (4 − 3, 2 + 3) = (1, 5)`

**NARRATION:**
Two blues. That's four right, two up. Three teals. Three left, three up. Across, four minus three, is one. Up, two plus three, is five. One, five. Exactly the target.

⏸ 1.5 — read the finished calculation

**VISUAL:** An arrow labelled **A** draws from the left panel to the right, carrying the dot (2, 3) to the target (1, 5).

**NARRATION:**
So the same pair, two and three, has two jobs. On the left, it's a place. Where the lines cross. On the right, it's a recipe. The amounts that reach the target.

With two unknowns, you can draw the lines. With seven hundred and sixty-eight unknowns, you can't draw anything. But you can still ask whether these columns can reach the target.

> *End of the approved passage.*

### Is two and three the only recipe?

**VISUAL:** Both panels stay. On the left, the pink and purple lines and the white dot. A small "?" sits beside the dot.

**NARRATION:**
Can the columns reach the target? A second question comes straight after it. If they can, is two and three the only way?

For these two arrows the left panel answers at once. Two lines that cross, cross at a single point. There is one place on the left, so there is one recipe on the right.

**VISUAL:** On the right, a third arrow draws from the origin: gold, (1, 2). It is drawn as blue followed by teal, tip to tail, then the gold arrow replaces that path. The left panel, which can no longer hold three amounts in a plane, turns into a small 3-D box of axes labelled **input: the amounts (x₁, x₂, x₃)**. The white dot becomes (2, 3, 0) in it.

**NARRATION:**
Give the target more ways to be reached. Add a third column, gold. Gold goes one right and two up, which is exactly blue followed by teal. The input now needs three amounts, so the left panel needs three directions. Two blue, three teal, no gold still works. In the box, that recipe is the point two, three, zero.

Try one blue, two teal, and one gold. Before adding it up... does it land on the target?

**HIDDEN UNTIL AFTER ⏸:** the tip-to-tail path, the calculation and the second white dot at (1, 2, 1)

⏸ 3 — predict whether one blue, two teal and one gold reach (1, 5)

**VISUAL:** On the right, one blue, two teal and one gold lay tip to tail and finish on (1, 5). Under the panel:
`1·(2, 1) + 2·(−1, 1) + 1·(1, 2) = (2 − 2 + 1, 1 + 2 + 2) = (1, 5)`
On the left, a second white dot appears at (1, 2, 1).

**NARRATION:**
Across, two, minus two, plus one, is one. Up, one plus two plus two, is five. The same target, from a different recipe.

⏸ 1.5 — read the finished calculation

**NARRATION:**
The reason is in the gold arrow. Gold is blue plus teal. Handing back one blue and one teal, and taking one gold instead, changes the route but not the destination. You can make that trade as many times as you like, or run it backwards.

**VISUAL:** On the left, a dashed line draws through both white dots and on past them. A third and fourth white dot slide along it at (0, 1, 2) and (3, 4, −1); each time, the path on the right re-forms and still ends on (1, 5).

**NARRATION:**
Every one of those trades is a point on this line in the input box. Every point on it is a recipe for the same target. One extra recipe has turned into a whole line of them. That line comes back later, with a name.

### Two old questions, asked backwards

**VISUAL:** The gold arrow and the 3-D box retire; the left panel returns to the plane with the two lines and the single dot (2, 3). Two short labels attach to the panels: on the output panel, **existence: is b in the span of the columns?**; on the input panel, **uniqueness: are the columns independent?**

**NARRATION:**
Both questions are ones you met in chapter one. Whether a target can be reached is whether it lies in the span of the columns. It's a question about the output side. Whether the recipe is unique is whether the columns are independent, because a dependence, like gold equals blue plus teal, is exactly a trade that changes the recipe and keeps the target. It's a question about the input side.

In chapter one you were given arrows and asked what they could reach. Here the target is fixed first, and you ask for the recipe.

**PRECISE — VISUAL:** A two-row table builds beside the panels:

| Question about Ax = b | The idea it really is |
|---|---|
| Existence: is there any solution? | Is b in the span of the columns of A? |
| Uniqueness: is there only one? | Are the columns of A independent? |

A third column, **read off from elimination as**, is drawn but left empty.

**NARRATION:**
One procedure, called elimination, fills in the last column of this table for any system, of any size. Most of this video is about what elimination does, and what it tells you.

**VISUAL:** The panels shrink to the top corners. Below, a tall-wide grey block labelled **A: 768 × 3072**, beside it a short column **b ∈ ℝ⁷⁶⁸** and a long column **x ∈ ℝ³⁰⁷²**.

**NARRATION:**
To make that concrete, take a matrix with seven hundred and sixty-eight rows and three thousand and seventy-two columns, a shape you'll find inside language models. Can its columns reach every target? And when they reach one, is the recipe ever unique? By the end, both questions have answers you can give from the shape and one count, the rank.

---

## What A x computes
*Chapter §0 notation, §1 definition. Terms: matrix–vector product, m × n, entry a_ij, column picture, row picture, hyperplane, standard basis vector e_j.*

### Any amounts, not just two and three

**VISUAL:** The two panels return, full size, titled **input: the amounts (x, y)** and **output: where the amounts land**, with `A` between them. On the left, the white dot is released from (2, 3) and becomes a draggable dot labelled **(x, y)**. On the right, x blues and y teals, tip to tail, follow it.

**NARRATION:**
Two and three was one input. What does A do to an input you haven't solved for, any amounts x and y?

The rule from chapter one says, take x blues and y teals. x copies of the blue arrow, two, one, is two x, x. y copies of the teal arrow, minus one, one, is minus y, y.

**PRECISE — VISUAL:** Under the output panel, built term by term:
`A(x, y) = x·(2, 1) + y·(−1, 1) = (2x, x) + (−y, y) = (2x − y, x + y)`

**NARRATION:**
Add them. The first entry is two x minus y. The second is x plus y.

⏸ 2 — compare the two entries with the two equations at the top

**VISUAL:** The two equations from *One system, two pictures* reappear above the left panel. Their left-hand sides glow and slide down to sit beside the two entries of the result. They match exactly.

**NARRATION:**
Those are the left sides of the two equations, back again. So the column recipe and the row equations are not two methods that happen to agree. They're one sum, added up in a different order. Down the columns, you scale whole arrows and add them. Across the rows, you build the answer one entry at a time.

**PRECISE — VISUAL:** Row 1 of A, (2, −1), slides beside the input (x, y). Pairs light up: 2 with x, −1 with y. `2·x + (−1)·y = 2x − y`. Then row 2: `1·x + 1·y = x + y`.

**NARRATION:**
Across row one, that's two times x, plus minus one times y. Multiply matching entries and add. It is the dot product from chapter one, row one of A with the input. Every entry of the output is one row of A, dotted with the input.

### Any size

**VISUAL:** The 2 × 2 grid of A stretches into a generic block. Rows are counted down the side, **m rows**; columns along the top, **n columns**. One entry is picked out, in row i and column j, and labelled **a_ij**. The columns peel off as arrows labelled **a₁, a₂, …, aₙ**, each with m entries.

**NARRATION:**
Nothing here depends on there being two of anything. A matrix with m rows and n columns is called an m by n matrix. The number in row i and column j is written a, sub i j. Its columns are n arrows, a one up to a n, and each has m entries.

**TERM ▸ m × n matrix; entry a_ij** (labels on the block)

**NARRATION:**
With more than two unknowns, we stop inventing letters and number them. x one, x two, up to x n, one amount for each column. That list is the input x. It lives in R n. The output, and the target b, have one entry per row, so they live in R m.

**VISUAL:** The panel titles extend: **input: the amounts (x₁, …, xₙ), in ℝⁿ** and **output: where the amounts land, in ℝᵐ**.

**NARRATION:**
For our A, both are R two, and that's why the two panels look alike. They are still different places. The left holds amounts. The right holds where the amounts land.

**PRECISE — VISUAL:**
`Ax = x₁a₁ + x₂a₂ + ⋯ + xₙaₙ ∈ ℝᵐ`
then, picking out entry i of that sum:
`(Ax)ᵢ = aᵢ₁x₁ + aᵢ₂x₂ + ⋯ + aᵢₙxₙ = (row i of A) · x`

**NARRATION:**
That is the definition. A times x is x one copies of the first column, plus x two copies of the second, and so on to x n copies of the last. Read off entry i of that sum, and you get row i of A, dotted with x.

**TERM ▸ matrix–vector product Ax**

⏸ 2 — read both lines of the definition

### Two ways to read A x = b

**VISUAL:** Back to the cast. The left panel shows the two lines meeting at (2, 3); the right shows the blue and teal path to (1, 5). Labels attach: left **row picture**, right **column picture**.

**NARRATION:**
A x equals b can be read two ways, then. Read by columns, it asks for a recipe. Which combination of the columns builds b? That's the column picture. Read by rows, it's a list of m equations, and the answer must satisfy all of them at once. That's the row picture.

**TERM ▸ column picture; row picture**

**VISUAL:** The left panel tilts into a 3-D box. A single plane through it is labelled **2x + y + z = 3**. A second and third plane follow, the three meeting at one point.

**NARRATION:**
With two unknowns, each equation is a line. With three, it's a plane, a flat sheet in space. With n unknowns it's the same kind of object, one dimension short of the whole space, called a hyperplane, provided at least one coefficient is nonzero. If every coefficient is zero, the equation says zero equals its right-hand side. That holds everywhere if the right-hand side is zero, and nowhere otherwise. Those two cases come back when we eliminate. In the row picture, a solution is a point on every hyperplane.

**TERM ▸ hyperplane** (label on one plane: "the solutions of one linear equation in ℝⁿ, at least one coefficient ≠ 0")

**VISUAL:** The 3-D box retires; the plane panels return.

### The simplest inputs

**VISUAL:** On the left, the draggable dot jumps to (1, 0) and is labelled **e₁**.

**NARRATION:**
Some inputs are easier than others. Put a one in the first slot and zero everywhere else. Where does A send that?

**HIDDEN UNTIL AFTER ⏸:** any output arrow on the right

⏸ 2 — predict where (1, 0) lands

**VISUAL:** On the right, one blue arrow and zero teal: the output is the blue arrow itself, (2, 1). The dot jumps to (0, 1), labelled **e₂**; the output is the teal arrow, (−1, 1).

**NARRATION:**
One blue and no teal. It lands on blue itself, two, one. And zero, one lands on teal. These inputs, with a single one and zeros elsewhere, are the standard basis vectors from chapter one. In R n there are n of them, e one to e n.

**TERM ▸ e_j** (label: "e_j: 1 in slot j, 0 elsewhere")

**PRECISE — VISUAL:** `A e_j = 0·a₁ + ⋯ + 1·a_j + ⋯ + 0·aₙ = a_j` (column j).

**NARRATION:**
A times e j picks out column j and nothing else. The columns of a matrix, then, are not just numbers in a grid. Each one says where one direction of the input space goes.

---

## The matrix as a map
*Chapter §1, the third reading. Terms: function ℝⁿ → ℝᵐ, linear, superposition, additivity, homogeneity, f(0) = 0, Theorem 1 (every linear map is a matrix), affine map.*

### The whole grid at once

**VISUAL:** The input panel fills with its square grid of whole-number points. One by one, the grid lines are sent along the arrow **A**: each line leaves a copy on the left and arrives on the right as a slanted line. Lines running across arrive along blue; lines running up arrive along teal. The right panel ends with a slanted grid of parallelograms.

**NARRATION:**
Those two columns settle where every other input goes. Send the whole square grid of the input panel through A. One step right on the left becomes one blue step on the right. One step up becomes one teal step. The square grid arrives as a slanted grid, its rows along blue and its columns along teal.

**VISUAL:** On the left, the white point (2, 3) is highlighted: two squares across, three up. On the right, its image is found by counting in the slanted grid: two cells along blue, three along teal. It lands on the green target.

**NARRATION:**
The point two across and three up on the left lands two across and three up in the slanted grid. Which is the target. Solving A x equals b is finding the grid point on the left that lands on b on the right.

**NARRATION:**
But why should the grid survive the trip at all? Why do straight, evenly spaced lines on the left arrive straight and evenly spaced on the right?

### Combinations go to combinations

**VISUAL:** On the left, two input arrows x and y and a combination of them, 2x + y, drawn as a parallelogram path. On the right, their images Ax and Ay, and the image of the combination, which lands at the end of the path 2·Ax + Ay.

**NARRATION:**
Take two inputs, x and y, and form a combination, alpha copies of x plus beta copies of y. A uses each entry of the input as the amount of one column. The amount of column j in the combination is alpha x j plus beta y j. Split that, and you get alpha copies of the recipe x, plus beta copies of the recipe y.

**PRECISE — VISUAL:**
`A(αx + βy) = Σⱼ (αxⱼ + βyⱼ) aⱼ = α Σⱼ xⱼaⱼ + β Σⱼ yⱼaⱼ = αAx + βAy`

⏸ 2 — read the three equal signs

**NARRATION:**
A combination of inputs goes to the same combination of outputs. That's why the grid survives. Every grid point is a combination of the two steps, so its image is the same combination of blue and teal.

**VISUAL:** The equation abstracts: `f(αx + βy) = αf(x) + βf(y)` for a function f labelling the A arrow.

**NARRATION:**
A function that takes vectors in R n to vectors in R m, and has this property for all inputs and all amounts, is called linear. The property itself is called superposition. The response to a combination is the same combination of the responses.

**TERM ▸ linear map f : ℝⁿ → ℝᵐ; superposition**

**PRECISE — VISUAL:** Three special cases, one per line, each with its choice of α and β:
`α = β = 1:  f(x + y) = f(x) + f(y)` (additivity)
`β = 0:  f(αx) = αf(x)` (homogeneity)
`α = β = 0:  f(0) = 0`

**NARRATION:**
Three special cases are worth having by name. With both amounts one, sums go to sums. That's additivity. With beta zero, scaling goes to scaling. That's homogeneity. And with both amounts zero, the zero input goes to the zero output. A linear map always fixes the origin.

**TERM ▸ additivity; homogeneity**

### Is every linear map a matrix?

**NARRATION:**
Every matrix gives a linear map. Does it work the other way? If someone hands you a linear map, with no matrix in sight, is there always a matrix doing the same job?

**VISUAL:** The A arrow loses its label and becomes a box marked **f**. On the left, an input x = (x₁, x₂) is drawn as x₁ copies of e₁ followed by x₂ copies of e₂. On the right, f(e₁) and f(e₂) appear as two arrows.

**NARRATION:**
Write any input as its amounts along the axes, x one copies of e one, plus x two copies of e two, and so on. Superposition says f of that is x one copies of f of e one, plus x two copies of f of e two. Now stand the arrows f of e one, up to f of e n, side by side as columns. That sum is exactly the column definition of the matrix times x.

**PRECISE — VISUAL:**
`x = x₁e₁ + ⋯ + xₙeₙ  ⇒  f(x) = x₁f(e₁) + ⋯ + xₙf(eₙ) = Ax,  A = [ f(e₁) ⋯ f(eₙ) ]`

**NARRATION:**
Could a different matrix B also match f? Then B times e j would equal f of e j, which is A times e j. But A times e j is column j of A, and B times e j is column j of B. Every column agrees, so B is A.

**PRECISE — VISUAL:** Under the first line: `Bx = f(x) for all x ⇒ Beⱼ = f(eⱼ) = Aeⱼ ⇒ column j of B = column j of A`.

**TERM ▸ Theorem 1: every linear map ℝⁿ → ℝᵐ is x ↦ Ax for exactly one m × n matrix A, with columns f(e₁), …, f(eₙ)**

⏸ 2 — read the theorem against the picture

**NARRATION:**
A linear map is decided by where it sends the axes. A list of n columns pins down what happens to every point of the input space.

### Building matrices from what a map does

**VISUAL:** Fresh pair of panels. On the left, the unit square with e₁ and e₂. The map is labelled **rotate 90° counterclockwise**.

**NARRATION:**
Take a map described only in words. Turn the whole plane a quarter turn counterclockwise about the origin. Is that linear? Turn a parallelogram and you get a parallelogram, so sums go to sums. Turn a stretched arrow and you get the turned arrow, stretched by the same amount. It is. Then its matrix is decided by two things. Where does e one go, and where does e two go?

**HIDDEN UNTIL AFTER ⏸:** the turned square, the images of e₁ and e₂, and the matrix R

⏸ 3 — predict where the two axis arrows end up after a quarter turn

**VISUAL:** On the right, the turned square: e₁'s image points straight up to (0, 1); e₂'s image points left to (−1, 0). The two images stand as columns of a matrix.

**NARRATION:**
e one, pointing right, ends up pointing up, at zero, one. e two, pointing up, ends up pointing left, at minus one, zero. Those are the columns.

**PRECISE — VISUAL:**
`R = [[0, −1], [1, 0]]`. Check on x = (3, 1): `R(3, 1) = 3·(0, 1) + 1·(−1, 0) = (−1, 3)`.
On the left, the arrow (3, 1); on the right, the turned grid with (−1, 3) at three steps along the image of e₁ and one along the image of e₂.

**NARRATION:**
Check it on three, one. Three copies of zero, one, plus one copy of minus one, zero, is minus one, three. And three, one, turned a quarter turn, does point to minus one, three.

⏸ 1.5 — read the check

**VISUAL:** New panels with different shapes. The input panel is a 3-D box labelled **input ℝ³: three measurements (x₁, x₂, x₃)**; the output panel is a plane labelled **output ℝ²**.

**NARRATION:**
The input and output don't have to be the same size. Take three measurements, and report two numbers. Their mean, and the last minus the first. Averages and differences respect sums and scaling, so this is linear. Its matrix needs three columns, one for each input axis.

**PRECISE — VISUAL:** One column at a time:
`f(e₁) = (⅓, −1)`, `f(e₂) = (⅓, 0)`, `f(e₃) = (⅓, 1)`, so `F = [[⅓, ⅓, ⅓], [−1, 0, 1]]` (2 × 3).
Check: `F(3, 6, 12) = (7, 9)`.

**NARRATION:**
e one, the measurements one, zero, zero, has mean one third, and last minus first is minus one. e two and e three give the other two columns the same way. The matrix is two by three. Two rows, because two numbers come out. Three columns, because three go in. On the measurements three, six, twelve, it reports a mean of seven, and a difference of nine.

⏸ 1.5 — read the matrix and its check

**VISUAL:** Back to two planes. On the left, the origin highlighted. The map is labelled **g: move every point one unit right**. The right panel is empty.

**NARRATION:**
One more map. Move every point one unit to the right. Is that linear?

**HIDDEN UNTIL AFTER ⏸:** the origin's image at (1, 0)

⏸ 2 — test it on the zero vector

**VISUAL:** On the right, the origin's image appears at (1, 0).

**NARRATION:**
It sends zero to one, zero. A linear map has to send zero to zero, so this one isn't linear. A linear map followed by a shift is called affine. A neural-network layer that computes W times x, plus a bias c, is affine for the same reason whenever c isn't zero.

**TERM ▸ affine map** (label: "x ↦ Wx + c: linear, then shift")

**VISUAL:** A small block **W** times a column **h**; W's columns peel off as arrows and h's entries become their amounts.

**NARRATION:**
When a paper writes W times h, read it as a combination of W's columns, weighted by the entries of h. Anything said about what a layer without a bias can output is a statement about the span of those columns.

---

## One map after another
*Chapter §2, product. Terms: matrix product AB, inner sizes, entry view, row view, column view, columns times rows, outer product, blocks, associativity, distributivity, identity matrix Iₙ, diagonal matrix.*

### What is the matrix of "B, then A"?

**VISUAL:** Three panels in a row: **input**, **middle**, **output**, joined by two arrows, **B** (input → middle) and **A** (middle → output). The input panel holds the unit square with e₁ and e₂. Above the arrows, two new matrices: `B = [[2, 0], [1, 1]]`, `A = [[1, 1], [0, 2]]`. The cast matrix is not on screen.

**NARRATION:**
Apply one linear map, and then another. For this part, A and B are two new matrices. B has columns two, one and zero, one. A has columns one, zero and one, two. Our own A comes back when we start eliminating.

Is "B, then A" linear? A combination of inputs goes through B to the same combination of outputs, and through A to the same combination again. It is. And by Theorem one its matrix is decided by where e one and e two end up.

**VISUAL:** e₁ travels through B and arrives in the middle panel as B's first column, (2, 1).

**NARRATION:**
Follow e one. B sends it to B's first column, two, one. Where does A send two, one?

**HIDDEN UNTIL AFTER ⏸:** the path to (3, 2) in the output panel and the product AB

⏸ 3 — work out A·(2, 1) from A's columns

**VISUAL:** In the output panel, two copies of A's first column (1, 0) and one copy of its second (1, 2), tip to tail, ending at (3, 2).

**NARRATION:**
Two copies of A's first column, one, zero, plus one copy of its second, one, two. The result is three, two. And e two goes to zero, one in the middle, which A sends to its second column, one, two.

**PRECISE — VISUAL:**
`A(2, 1) = 2·(1, 0) + 1·(1, 2) = (3, 2)`, `A(0, 1) = (1, 2)`, so `AB = [[3, 1], [2, 2]]`.

⏸ 1.5 — read the two columns of the product

**NARRATION:**
The matrix of "B, then A" has columns three, two and one, two. It is written A B, with B on the right, because B acts first. The order is the same as in A of B of x.

**TERM ▸ matrix product AB**

**PRECISE — VISUAL:** General form, B's columns labelled u₁, …, u_p:
`AB = A [u₁ ⋯ u_p] = [Au₁ ⋯ Au_p]`, with shapes `(m × n)(n × p) = m × p`, the two n's circled.
Under it: `(AB)x = A(Bx)` for every x.

**NARRATION:**
In general, A times B is A applied to each column of B. If A is m by n and B is n by p, the product is m by p. The two inner sizes must agree, because A accepts inputs with n entries, so every column of B must have n entries.

**VISUAL:** The unit square in the input panel. Under B it becomes a parallelogram in the middle panel, corners at (2, 1) and (0, 1). Under A that parallelogram becomes one in the output panel with sides (3, 2) and (1, 2). A single arrow labelled **AB** then draws directly from input to output, and the square lands on the same final parallelogram.

**NARRATION:**
In pictures, B turns the unit square into a parallelogram. A then acts on that parallelogram. The final shape has sides three, two and one, two, which are the columns of A B. Going straight there with A B gives the same shape.

### Four ways to compute the same product

**NARRATION:**
By hand, you rarely want to push whole columns through a map. Are there quicker ways to get the same numbers?

**VISUAL:** The product `AB = [[3, 1], [2, 2]]` sits between A and B. Row 1 of A, (1, 1), lights up together with column 1 of B, (2, 1). The pairs 1·2 and 1·1 are multiplied and added to give the 3 in position (1, 1). Then row 2 of A, (0, 2), with the same column gives the 2 in position (2, 1).

**NARRATION:**
Take one entry at a time. The entry in row i, column j of A B is row i of A, dotted with column j of B. Watch the top-left entry. Row one meets column one, one times two plus one times one, three. Every other entry is the same move, with a different row and column.

**PRECISE — VISUAL:** `(AB)ᵢⱼ = Σₖ AᵢₖBₖⱼ` · `(AB)₁₁ = (1, 1)·(2, 1) = 3` · `(AB)₂₁ = (0, 2)·(2, 1) = 2`.

**TERM ▸ entry view**

**VISUAL:** The rows of B, (2, 0) and (1, 1), are drawn as two strips. Row 1 of A supplies the amounts 1 and 1; the strips combine to (3, 1), which drops into row 1 of the product.

**NARRATION:**
Or take one row at a time. Row i of A B is a combination of the rows of B, with the amounts taken from row i of A. Row one of A asks for one of each, so the first row of the product is B's two rows added together.

**PRECISE — VISUAL:** `row 1 of AB = 1·(2, 0) + 1·(1, 1) = (3, 1)`.

**TERM ▸ row view; column view** (the column view is the definition itself: column j of AB = A × column j of B)

**NARRATION:**
The column view is the definition you started with. Column j of A B is A times column j of B, a combination of the columns of A.

**VISUAL:** A's columns (1, 0) and (1, 2) on the left of the screen, B's rows (2, 0) and (1, 1) along the top. Column 1 of A times row 1 of B fills a 2 × 2 grid: `[[2, 0], [0, 0]]`. Column 2 of A times row 2 of B fills a second grid: `[[1, 1], [2, 2]]`. The two grids slide together and add.

**NARRATION:**
The fourth way splits the product into pieces. Pair column one of A with row one of B, and multiply every entry of the column by every entry of the row. The result is a whole matrix. Do the same with column two and row two, and add the two pieces.

**PRECISE — VISUAL:**
`a₁b₁ᵀ + a₂b₂ᵀ = [[2, 0], [0, 0]] + [[1, 1], [2, 2]] = [[3, 1], [2, 2]]`
and in general `AB = a₁b₁ᵀ + ⋯ + aₙbₙᵀ`.

⏸ 2 — check the sum against the product above

**NARRATION:**
It's the same product again. A column times a row like this is called an outer product. In each piece, every column is a multiple of the same arrow. In the second piece, both columns are multiples of one, two. Every matrix product is a sum of pieces as thin as that.

**TERM ▸ columns times rows; outer product**

### Does the order matter?

**VISUAL:** The three panels again, with the arrows relabelled: **A** first (input → middle), then **B**. The original final parallelogram, sides (3, 2) and (1, 2), stays faint in the output panel for comparison.

**NARRATION:**
If you apply A first, and then B, do you land on the same parallelogram?

**HIDDEN UNTIL AFTER ⏸:** the A-then-B parallelograms and the matrix BA

⏸ 3 — predict whether A-then-B gives the same shape

**VISUAL:** The unit square goes through A to the parallelogram with sides (1, 0) and (1, 2), then through B to sides (2, 1) and (2, 3). It does not match the faint outline.

**NARRATION:**
A first makes a different parallelogram, and B carries it somewhere else again. The final shape misses the outline. So B A, with columns two, one and two, three, is not A B.

**PRECISE — VISUAL:** `BA = [[2, 2], [1, 3]] ≠ AB = [[3, 1], [2, 2]]`.

**NARRATION:**
The order of matrices in a product is the order of the maps, read right to left. Change the order and, in general, you change the map.

### Blocks, and shapes that aren't square

**VISUAL:** `A = [[1, 2, 0], [0, 1, 3]]` and the input `b = (1, 1, 2)`. A vertical cut separates A's first two columns (A₁) from its third (A₂); a horizontal cut separates b's first two entries from its last.

**NARRATION:**
The columns-times-rows view says a product is a sum of contributions, one per column of the first factor. You can group the columns into blocks, then, as long as you cut the second factor at the same place. Cut this two by three matrix after its second column, and cut the input one, one, two after its second entry.

**PRECISE — VISUAL:**
`A₁(1, 1) + A₂(2) = (3, 1) + (0, 6) = (3, 7)`, and directly, `Ab = 1·(1, 0) + 1·(2, 1) + 2·(0, 3) = (3, 7)`.
General rule: `[A₁ A₂] [B₁; B₂] = A₁B₁ + A₂B₂`.

**NARRATION:**
The first block gives three, one, and the second gives zero, six. Together they make three, seven, the same as A times b computed in one go. Splitting into blocks only brackets the same sum.

⏸ 1.5 — compare the block result with the direct one

**TERM ▸ block multiplication**

**VISUAL:** A 2 × 3 matrix `[[1, 0, 2], [−1, 3, 1]]` and a 3 × 2 matrix `[[2, 1], [0, −1], [1, 1]]`. Shape labels under each; the inner 3's circled.

**NARRATION:**
Products don't need square matrices. Take a two by three matrix times a three by two. The inner sizes are both three, so the product exists, and it is two by two.

**PRECISE — VISUAL:** Entries fill one at a time:
`(1,1): 2 + 0 + 2 = 4` · `(1,2): 1 + 0 + 2 = 3` · `(2,1): −2 + 0 + 1 = −1` · `(2,2): −1 − 3 + 1 = −3`, giving `[[4, 3], [−1, −3]]`.

**NARRATION:**
Watch one entry. Row one against column one is two, plus zero, plus two, four. The other three entries are built the same way, row against column. The other order, three by two times two by three, is also allowed, and it's three by three. Not even the same size.

⏸ 1.5 — read the finished product

### The rules that come free

**VISUAL:** Three panels with arrows C, B, A in sequence. Brackets group them two ways: (AB)C and A(BC).

**NARRATION:**
Because a product is a composition of maps, some rules need no calculation. A B, times C, and A times B C, both mean C, then B, then A. They're equal, and brackets can be dropped. And because each map is linear, products distribute over sums. Apply A to the sum of B and C. That gives A B plus A C.

**PRECISE — VISUAL:** `(AB)C = A(BC)` · `A(B + C) = AB + AC` · `(A + B)C = AC + BC`.

**VISUAL:** The 3 × 3 identity, its columns e₁, e₂, e₃ outlined. Beside it, `diag(d₁, d₂, d₃)` acting on an input box, stretching axis i by dᵢ.

**NARRATION:**
The map that does nothing has columns e one to e n, because it sends each axis to itself. It is called the identity matrix, I n. Multiplying by it changes nothing, on either side. A diagonal matrix has numbers d one to d n down its diagonal and zeros elsewhere. It scales coordinate i by d i, and touches nothing else.

**TERM ▸ identity matrix Iₙ; diagonal matrix diag(d₁, …, dₙ)**

**PRECISE — VISUAL:** `Iₙx = x`, `AIₙ = A`, `IₘA = A`.

---

## Turning rows into columns, and running a map backwards
*Chapter §2, transpose and inverse. Terms: transpose Aᵀ, symmetric, xᵀy, Theorem 2, invertible, inverse A⁻¹, singular, Theorem 3, the 2 × 2 inverse formula.*

### The transpose

**VISUAL:** The 2 × 3 matrix `[[1, 0, 2], [−1, 3, 1]]`. Its first row tips over and stands as a column; its second row does the same beside it. The result is `[[1, −1], [0, 3], [2, 1]]`, labelled **Aᵀ**.

**NARRATION:**
When we first read A x row by row, the rows did half the work. To use the same tools on rows that you use on columns, you need a way to turn rows into columns. Tip each row over, so that row one becomes column one, and row two becomes column two. The result is the transpose, written A with a small T.

**TERM ▸ transpose Aᵀ**

**PRECISE — VISUAL:** `(Aᵀ)ᵢⱼ = Aⱼᵢ`. An m × n matrix has an n × m transpose.

**NARRATION:**
The entry in row i, column j of A transpose is the entry in row j, column i of A. A two by three matrix has a three by two transpose. A matrix that equals its own transpose is called symmetric.

**TERM ▸ symmetric** (`Aᵀ = A`)

**VISUAL:** Two columns x and y. x tips over into a row, xᵀ, and sits in front of y. Their product is a single number.

**NARRATION:**
The dot product is a product of this kind. Tip x over into a row, one by n, and multiply it by y, n by one. The result is one by one, a single number, and it's the dot product.

**PRECISE — VISUAL:** `x · y = xᵀy`.

**NARRATION:**
What is the transpose of a product? A guess would be A transpose times B transpose. Check the shapes before the entries. If A is m by n and B is n by p, then A transpose is n by m and B transpose is p by n.

**HIDDEN UNTIL AFTER ⏸:** the answer BᵀAᵀ and the entry-by-entry proof

⏸ 3 — decide which order of Aᵀ and Bᵀ even fits together

**NARRATION:**
A transpose times B transpose needs m to equal p, which it usually doesn't. The other order, B transpose times A transpose, always fits, and it's the right one.

**PRECISE — VISUAL:**
`((AB)ᵀ)ᵢⱼ = (AB)ⱼᵢ = Σₖ AⱼₖBₖᵢ = Σₖ (Bᵀ)ᵢₖ(Aᵀ)ₖⱼ = (BᵀAᵀ)ᵢⱼ`, so `(AB)ᵀ = BᵀAᵀ` (Theorem 2).

**NARRATION:**
Follow one entry. The i j entry of the transpose is the j i entry of A B, row j of A against column i of B. Read the other way round, it's a row of B transpose against a column of A transpose. So the transpose of A B is B transpose times A transpose.

⏸ 2 — follow the index swap in the middle step

**PRECISE — VISUAL:** With the pair from *One map after another*: `(AB)ᵀ = [[3, 2], [1, 2]]` and `BᵀAᵀ = [[2, 1], [0, 1]] [[1, 0], [1, 2]] = [[3, 2], [1, 2]]`.

**NARRATION:**
With the pair A and B from before, both sides come out the same. The order reverses, the way it does when you undo a sequence of steps. You put on socks, then shoes. To take them off, you remove the shoes first.

### Running the map backwards

**VISUAL:** The cast returns in its two panels: lines crossing at (2, 3) on the left, the blue and teal path to (1, 5) on the right, the arrow **A** between them. A second arrow starts to draw from the right panel back to the left, unlabelled.

**NARRATION:**
Our A carries the recipe two, three to the target one, five. Is there a map that runs the other way, taking the target back to the recipe?

**NARRATION:**
If there were, call it B, then doing A and then B would return every input to where it started. And doing B then A would return every output. Both B A and A B would be the identity.

**PRECISE — VISUAL:** `AB = BA = I`.

**NARRATION:**
A square matrix with such a partner is called invertible. One with no such partner is called singular.

**TERM ▸ invertible; singular**

**PRECISE — VISUAL:** For a 2 × 2 matrix:
`[[p, q], [r, s]]⁻¹ = 1/(ps − qr) · [[s, −q], [−r, p]]`, when `ps − qr ≠ 0`.

**NARRATION:**
For two by two matrices there's a formula you can check by multiplying out. Swap the two diagonal entries, change the sign of the other two, and divide everything by p s minus q r. It works whenever that number isn't zero.

**PRECISE — VISUAL:** For the cast: `ps − qr = 2·1 − (−1)·1 = 3`, so `A⁻¹ = ⅓ [[1, 1], [−1, 2]]`. Beside it, `A⁻¹(1, 5) = ?`.

**NARRATION:**
For our A, p s minus q r is three. Swap the diagonal entries, change the signs off it, and divide by three. Now send the target one, five back through it.

**HIDDEN UNTIL AFTER ⏸:** the resolved calculation `= (2, 3)`, the A⁻¹ label and the back arrow's landing point

⏸ 3 — predict where A⁻¹ sends the target

**PRECISE — VISUAL:** The "?" resolves: `A⁻¹(1, 5) = ⅓ (1 + 5, −1 + 10) = ⅓ (6, 9) = (2, 3)`.

**VISUAL:** The back arrow gains its label **A⁻¹** and carries the green target (1, 5) from the right panel to the white point (2, 3) on the left.

**NARRATION:**
One plus five is six, minus one plus ten is nine, and a third of that is two, three. The target goes back to the crossing point.

⏸ 1.5 — read the finished calculation

**VISUAL:** The cast fades to one side. The chapter's own example: `[[2, 1], [5, 3]]`, with `ps − qr = 6 − 5 = 1` and inverse `[[3, −1], [−5, 2]]`. Check: `3·(2, 5) − 5·(1, 3) = (1, 0)`.

**NARRATION:**
One more, from the written chapter. For two, one, five, three, p s minus q r is one, so the inverse is three, minus one, minus five, two. The check on screen multiplies out the first column of the product and gets one, zero, the first column of the identity.

⏸ 1.5 — read the check

### What inverses obey

**PRECISE — VISUAL:** Theorem 3, one line at a time as each is spoken:
(i) An inverse, when it exists, is unique; it is written A⁻¹. Proof line: `B = BI = B(AC) = (BA)C = IC = C`.
(ii) `(AB)⁻¹ = B⁻¹A⁻¹`. Proof line: `(AB)(B⁻¹A⁻¹) = A(BB⁻¹)A⁻¹ = AA⁻¹ = I`, and likewise the other way round.
(iii) `(Aᵀ)⁻¹ = (A⁻¹)ᵀ`. Proof line: transpose `AA⁻¹ = I` and `A⁻¹A = I` with Theorem 2.
(iv) Ax = b has exactly one solution, `x = A⁻¹b`. Proof line: `A(A⁻¹b) = b`, and any solution has `x = A⁻¹(Ax) = A⁻¹b`.

**NARRATION:**
Four facts follow almost at once. First, there can only be one inverse. If B and C both undo A, then B equals B times A C, which is B A times C, which is C.

Second, the inverse of a product is the product of the inverses, in reverse order. Shoes and socks again.

Third, the inverse of A transpose is the transpose of A inverse. Transpose the equation A times A inverse equals I, and use the rule you just saw.

And fourth, when A is invertible, A x equals b has exactly one solution, A inverse b. It works, because A undoes A inverse. And it's the only one, because any solution x equals A inverse times A x, which is A inverse b.

⏸ 2 — read the four statements

### A matrix nothing can undo

**VISUAL:** Fresh panels. `[[1, 2], [2, 4]]`. In the output panel its columns, (1, 2) and (2, 4), lie along one line. The whole input grid is carried over and lands on that single line.

**NARRATION:**
Not every square matrix can be undone. Take the columns one, two and two, four. The second is twice the first, so both lie on one line. The whole input plane lands on that line.

**VISUAL:** On the left, the input (2, −1) is highlighted, and its image is drawn on the right: two copies of (1, 2) and minus one copy of (2, 4), returning to the origin.

**NARRATION:**
Two copies of the first column, minus one copy of the second, gets you nowhere. Two, minus one is sent to zero, zero. And so is the zero vector, as it is under every matrix. Could any map undo this?

**HIDDEN UNTIL AFTER ⏸:** the word "singular" and any back arrow

⏸ 3 — decide whether anything could send (0, 0) back to the right place

**NARRATION:**
To undo it, a map would have to send zero, zero back to two, minus one, and also back to zero. A map can't send one input to two places. So this matrix is singular. Later, that observation becomes a complete test for invertibility.

---

## Elimination
*Chapter §3. Terms: augmented matrix, row operations (swap, scale, replace), Gaussian elimination, pivot, multiplier, upper triangular, back substitution, shear; Theorem 4.*

### Equations as rows of numbers

**VISUAL:** The cast's two equations above the input panel. The letters x and y and the equals signs fade from the text, leaving the numbers in place. A vertical bar takes the place of the equals signs: `[[2, −1 | 1], [1, 1 | 5]]`.

**NARRATION:**
In school you solved this pair by substitution. With two equations that's quick. With ten, every substitution makes the next equation longer, and the bookkeeping gets out of hand. Is there a way to simplify a system step by step, without ever losing a solution or gaining a false one?

First, drop what doesn't change. The letters x and y sit in the same places in every equation. Keep only the numbers. Each row holds one equation, its coefficients, and then, after a bar, its right-hand side.

**TERM ▸ augmented matrix [A | b]**

**PRECISE — VISUAL:** Three operations appear one per line as they are named, each acting on a small example:
1. Swap two rows, `Rᵢ ↔ Rⱼ`.
2. Scale a row by a nonzero number, `Rᵢ ← cRᵢ`, `c ≠ 0`.
3. Replace a row by itself minus a multiple of another row, `Rᵢ ← Rᵢ − ℓRⱼ`, `j ≠ i`.

**NARRATION:**
Three moves are allowed on the rows. Swap two rows, which just reorders the equations. Multiply a row by a number that isn't zero. And replace a row by itself minus some multiple of a different row. Row i is written R i.

**TERM ▸ row operations: swap, scale, replace**

### One replacement, two pictures

**VISUAL:** The augmented matrix. The 2 in the top-left corner is ringed. The 1 below it is highlighted.

**NARRATION:**
The plan is to clear the entry under the top-left two. That two is the pivot, the entry used to clear the others in its column. The entry below it is one. How many copies of row one do you subtract from row two to turn that one into zero?

**HIDDEN UNTIL AFTER ⏸:** the multiplier ½, its label and the new row

⏸ 3 — find the number of copies of row 1 that clears the 1

**TERM ▸ pivot**

**NARRATION:**
One half. One divided by two. That number, the entry to be cleared divided by the pivot, is called the multiplier.

**TERM ▸ multiplier ℓ** (label: "ℓ = entry to clear ÷ pivot = ½")

**PRECISE — VISUAL:** `R₂ ← R₂ − ½R₁`:
`(1 − 1,  1 + ½ | 5 − ½) = (0, 3/2 | 9/2)`

**NARRATION:**
Row two minus one half of row one. The first entry cancels, which was the point. The new row says three halves y equals nine halves.

⏸ 1.5 — read the new row

**VISUAL:** The input panel. The line x + y = 5 is still drawn. Its equation text morphs into 0x + (3/2)y = 9/2.

**NARRATION:**
What has that done to the picture on the left? The second equation has changed, so its line must have moved. Where does it go?

**HIDDEN UNTIL AFTER ⏸:** the turning of the purple line and the line y = 3

⏸ 3 — predict where the second line goes

**VISUAL:** The purple line x + y = 5 turns about the white point (2, 3) until it lies flat: the horizontal line y = 3. The pink line, 2x − y = 1, does not move. The crossing stays at (2, 3).

**NARRATION:**
It turns about the crossing point until it's flat. The line y equals three. The new equation is a combination of the old two, so any point that satisfies both old equations satisfies it too. Its line has to pass through the crossing. And x has disappeared from it, which is why it's flat. That's what eliminating x means.

**NARRATION:**
From here the rest is easy. Three halves y equals nine halves, so y is three. Put that in the first equation. Two x minus three equals one, so x is two.

**TERM ▸ back substitution**

**PRECISE — VISUAL:** `(3/2)y = 9/2 ⇒ y = 3` · `2x − 3 = 1 ⇒ x = 2`.

**VISUAL:** The output panel. Blue (2, 1), teal (−1, 1), target (1, 5), and the slanted grid. Under the operation, every point (u, v) of the output panel slides straight up or down by −½u. Blue moves to (2, 0); teal to (−1, 3/2); the target to (1, 9/2). The slanted grid moves with them.

**NARRATION:**
On the right, the same row operation moves the output panel. Every point slides vertically by minus a half of its horizontal position. Points to the right drop, points to the left rise, and points on the vertical axis stay put. That kind of sliding is called a shear. Blue drops to two, zero. Teal rises to minus one, three halves. The target drops to one, nine halves.

**TERM ▸ shear** (label: "(u, v) ↦ (u, v − ½u)")

**NARRATION:**
Blue, teal and the target all moved. Is two blues and three teals still the recipe?

**HIDDEN UNTIL AFTER ⏸:** the re-formed path and the calculation `= (1, 9/2)`

⏸ 3 — predict whether the recipe (2, 3) still reaches the moved target

**PRECISE — VISUAL:** `2·(2, 0) + 3·(−1, 3/2) = (4 − 3, 0 + 9/2) = (1, 9/2)`; the path re-forms tip to tail and ends on the moved target.

**NARRATION:**
Across, four minus three, is one. Up, zero plus nine halves, is nine halves. It still lands on the target. The shear is linear, so it carries the whole recipe along with the arrows. And blue now lies flat along the horizontal axis. Elimination is a sequence of shears like this one, together with swaps, each one chosen to flatten one more column.

⏸ 1.5 — read the finished calculation

### Three equations, three unknowns

**VISUAL:** The two planes retire. A 3 × 4 augmented matrix with its equations beside it:
`2x + y + z = 3` · `4x + y = 6` · `−2x + 2y + z = 1`
`[[2, 1, 1 | 3], [4, 1, 0 | 6], [−2, 2, 1 | 1]]`

**NARRATION:**
The same moves work on bigger systems, in a fixed order. Here are three equations in three unknowns. Gaussian elimination works through the columns from left to right. In each column it picks a pivot, and uses it to clear every entry underneath.

**TERM ▸ Gaussian elimination**

**VISUAL:** The 2 in the top-left is ringed. The 4 and the −2 below it are highlighted.

**NARRATION:**
Column one. The pivot is two. Below it are four and minus two. What are the two multipliers?

**HIDDEN UNTIL AFTER ⏸:** ℓ₂₁, ℓ₃₁ and the new rows

⏸ 3 — work out both multipliers in column 1

**PRECISE — VISUAL:**
`ℓ₂₁ = 4/2 = 2`:  `R₂ ← R₂ − 2R₁` gives `(4 − 4, 1 − 2, 0 − 2 | 6 − 6) = (0, −1, −2 | 0)`
`ℓ₃₁ = −2/2 = −1`:  `R₃ ← R₃ + R₁` gives `(0, 3, 2 | 4)`

**NARRATION:**
Four over two is two, so take two copies of row one from row two. Minus two over two is minus one, and subtracting minus one copies means adding row one to row three. Watch column one empty out below the pivot. The rest of each new row is on screen.

⏸ 1.5 — read the two new rows

**VISUAL:** The −1 in row 2, column 2 is ringed. The 3 below it is highlighted.

**NARRATION:**
Column two. The pivot is the minus one in row two, and the three beneath it gives the multiplier minus three. Adding three copies of row two clears it.

**PRECISE — VISUAL:**
`ℓ₃₂ = 3/(−1) = −3`:  `R₃ ← R₃ + 3R₂` gives `(0, 3 − 3, 2 − 6 | 4 + 0) = (0, 0, −4 | 4)`
Result: `[[2, 1, 1 | 3], [0, −1, −2 | 0], [0, 0, −4 | 4]]`, with the pivots 2, −1, −4 ringed.

**NARRATION:**
Now every entry below the diagonal is zero, and the pivots two, minus one and minus four sit on the diagonal. A square matrix like that is called upper triangular, and it's the shape elimination aims for.

**TERM ▸ upper triangular**

⏸ 1.5 — read the triangular system

**PRECISE — VISUAL:** Back substitution, bottom row first:
`−4z = 4 ⇒ z = −1` · `−y − 2z = 0 ⇒ −y + 2 = 0 ⇒ y = 2` · `2x + y + z = 3 ⇒ 2x + 2 − 1 = 3 ⇒ x = 1`
Check in the original equations: `2 + 2 − 1 = 3` · `4 + 2 = 6` · `−2 + 4 − 1 = 1`.

**NARRATION:**
Back substitution starts at the bottom. The last row alone gives z equals minus one. Put that into the row above, and y is two. Put both into the top row, and x is one. The check in the original three equations is on screen, and all three hold.

⏸ 2 — read the solution and the check

**VISUAL:** Two panels. Left, **input ℝ³**: three planes, each tinted to match its equation, meeting at the single white point (1, 2, −1). Right, **output ℝ³**: the columns (2, 4, −2), (1, 1, 2), (1, 0, 1) and the target (3, 6, 1); one copy of the first, two of the second, and minus one of the third, tip to tail, reaching the target.

**NARRATION:**
In the row picture, each equation is a plane, and the three meet at one point, one, two, minus one. In the column picture, the same numbers are a recipe that lands on three, six, one. The three pivots were all nonzero. Those nonzero pivots are the reason there is exactly one solution, and we'll see why once elimination is written as multiplication.

**PRECISE — VISUAL:** `1·(2, 4, −2) + 2·(1, 1, 2) − 1·(1, 0, 1) = (3, 6, 1)`.

### Why the moves are safe

**NARRATION:**
Each row operation changed the equations. How do you know it didn't change the solutions?

**VISUAL:** Two boxes: **old system** and **new system**, joined by an arrow labelled with a row operation. Two arrows between their solution sets: "old ⊆ new" and "new ⊆ old".

**NARRATION:**
There are two things to check. Every old solution must still solve the new system. And every new solution must have solved the old one.

The first is about combinations. Each new equation is a combination of old ones. A swap reorders them, scaling multiplies one by c, and replacement forms R i minus ell R j. If a point satisfies the old equations, it satisfies any combination of them.

The second is about undoing. Each operation is reversed by one of the same kind. A swap is undone by the same swap. To undo scaling by c, divide by c. That's why c cannot be zero. To undo subtracting ell copies of row j, add them back. That needs row j to be a different row, still there unchanged. The reverse operation takes the new system back to the old one, so the first argument, applied in reverse, shows that new solutions solve the old system.

**PRECISE — VISUAL:** **Theorem 4.** A row operation does not change the solution set.
`swap⁻¹ = same swap` · `(Rᵢ ← cRᵢ)⁻¹ = (Rᵢ ← (1/c)Rᵢ)`, needs `c ≠ 0` · `(Rᵢ ← Rᵢ − ℓRⱼ)⁻¹ = (Rᵢ ← Rᵢ + ℓRⱼ)`, needs `j ≠ i`.
Then: any sequence of row operations preserves the solution set (one step at a time).

⏸ 2 — read where the two conditions c ≠ 0 and j ≠ i were used

**NARRATION:**
One step at a time, then, any sequence of row operations keeps exactly the same solutions. This is what makes elimination trustworthy.

**VISUAL:** A small augmented matrix whose top-left entry is 0.0001, its multiplier displayed in red: 10 000.

**NARRATION:**
In exact arithmetic, any nonzero entry can be a pivot. On a computer, which rounds every result, a tiny pivot means a huge multiplier, and that causes trouble. At the end, we'll see how much, and how practical programs choose their pivots.

---

## When a column has no pivot
*Chapter §4. Terms: row echelon form, pivot (as first nonzero entry), pivot column, free column, free variable, reduced row echelon form (RREF); Lemma 5 (row operations preserve column relations); Theorem 6 (the RREF is unique).*

### A system with more unknowns than it can pin down

**VISUAL:** The augmented matrix of the 3 × 4 system, with the four unknowns x₁, x₂, x₃, x₄ written above its columns:
`[[1, 2, 1, 3 | 4], [2, 4, 4, 10 | 10], [1, 2, −1, −1 | 2]]`
To its right, two boxes: **input ℝ⁴** and **output ℝ³**, joined by **A**. They hold vectors as columns of numbers, since neither can be drawn as a picture of the space.

**NARRATION:**
Both systems we've eliminated so far had exactly one solution. This one has three equations and four unknowns, x one to x four. Four unknowns means the input space is R four. Three equations means the output space is R three. Run elimination on it, the same way as before, and watch what's different.

**VISUAL:** The 1 in the top-left is ringed. The 2 and the 1 below it are highlighted.

**NARRATION:**
Column one. The pivot is one, so the multipliers are just the entries below it, two and one.

**PRECISE — VISUAL:** `R₂ ← R₂ − 2R₁`, `R₃ ← R₃ − R₁`:
`[[1, 2, 1, 3 | 4], [0, 0, 2, 4 | 2], [0, 0, −2, −4 | −2]]`

**NARRATION:**
Row two loses two copies of row one, and row three loses one copy. The new rows are on screen.

⏸ 1.5 — read the two new rows

**VISUAL:** Column 2 is highlighted from row 2 downward: two zeros.

**NARRATION:**
Column two is next. The pivot has to come from row two or below. Which entry should it be?

**HIDDEN UNTIL AFTER ⏸:** the grey shading of column 2 and the ring on column 3

⏸ 3 — look for a pivot in column 2

**NARRATION:**
There isn't one. Both candidates are zero, and no swap can bring a nonzero entry up, because there isn't one below. So column two gets no pivot. Elimination leaves it and moves on to column three, staying on row two.

**VISUAL:** Column 2 is shaded grey. The 2 in row 2, column 3 is ringed.

**PRECISE — VISUAL:** `R₃ ← R₃ + R₂`:
`[[1, 2, 1, 3 | 4], [0, 0, 2, 4 | 2], [0, 0, 0, 0 | 0]]`

**NARRATION:**
In column three, row two has a two. Make it the pivot, and add row two to row three. Row three becomes zeros all the way across. Column four has nothing left below row two, so it gets no pivot either.

⏸ 1.5 — read the staircase that has formed

**VISUAL:** A staircase line traces under the first nonzero entries: row 1 starts in column 1, row 2 in column 3, row 3 is empty. The pivots 1 and 2 sit on the stair corners.

**NARRATION:**
The nonzero entries now form a staircase. Each row starts further right than the row above, and the empty rows sit at the bottom. That shape is called row echelon form. The first nonzero entry of each row is its pivot. A column with a pivot is a pivot column. Every other column is a free column, and the unknown that goes with it is a free variable.

**TERM ▸ row echelon form; pivot; pivot column; free column; free variable** (columns 1 and 3 labelled "pivot", columns 2 and 4 labelled "free")

### Finishing the job

**NARRATION:**
You could back-substitute from here. But the cleanest form comes from two more kinds of step. Scale each pivot to one, and clear the entries above each pivot as well as below.

**PRECISE — VISUAL:** `R₂ ← ½R₂`, then `R₁ ← R₁ − R₂`:
`[[1, 2, 0, 1 | 3], [0, 0, 1, 2 | 1], [0, 0, 0, 0 | 0]]`, pivots boxed, columns 2 and 4 shaded.

**NARRATION:**
Halve row two, so its pivot becomes one. Then subtract it from row one, to clear the entry above that pivot.

⏸ 1.5 — read the finished matrix

**NARRATION:**
Now every pivot is one, and every other entry in a pivot column is zero. This form is called reduced row echelon form, R R E F for short.

**TERM ▸ reduced row echelon form (RREF)**

**VISUAL:** The two nonzero rows turn back into equations beside the matrix:
`x₁ + 2x₂ + x₄ = 3` · `x₃ + 2x₄ = 1` · and the last row `0 = 0`.

**NARRATION:**
Read the rows back as equations, as on screen. The last row says zero equals zero. It asks nothing, and in particular it isn't zero equals something nonzero, which would be a contradiction. So this system has solutions. In the two remaining equations, which unknowns are pinned down, and which are left free?

**HIDDEN UNTIL AFTER ⏸:** the "pivot"/"free" column labels from earlier in *When a column has no pivot* (dimmed for this unit) and any highlighting of x₁, x₃

⏸ 2 — find each pivot variable and the free variables in the two equations

**NARRATION:**
Each equation contains exactly one pivot variable, x one in the first and x three in the second. The free variables, x two and x four, can be anything. Everything in the next three parts is read off this one reduction.

### Would someone else get the same answer?

**NARRATION:**
There were choices along the way. Someone else might swap rows first, or scale earlier, or clear in a different order. Would they end up with the same R R E F?

**NARRATION:**
To answer that, you need something row operations can't change. Look at the columns of A.

**VISUAL:** The output box becomes a drawn **ℝ³** panel. A's four columns appear as arrows: a₁ = (1, 2, 1); a₂ = (2, 4, 2), lying on a₁'s line, twice as long; a₃ = (1, 4, −1); a₄ = (3, 10, −1). All four lie in one tilted plane through the origin, shaded faintly.

**NARRATION:**
Column two, two, four, two, is exactly twice column one. Column four, three, ten, minus one, is column one plus two copies of column three.

**PRECISE — VISUAL:** In A: `(2, 4, 2) = 2·(1, 2, 1)` · `(3, 10, −1) = (1, 2, 1) + 2·(1, 4, −1)`.

**VISUAL:** Beside it, a second ℝ³ panel labelled **columns of R**, joined to the first by an arrow labelled **row operations**. R's columns appear: (1, 0, 0); (2, 0, 0); (0, 1, 0); (1, 2, 0). All four lie flat in the floor plane.

**NARRATION:**
Now the columns of R. Do the same two relations hold there?

**HIDDEN UNTIL AFTER ⏸:** the two relation equations for R

⏸ 3 — check whether column 2 is twice column 1, and column 4 is column 1 plus twice column 3, in R

**PRECISE — VISUAL:** In R: `(2, 0, 0) = 2·(1, 0, 0)` · `(1, 2, 0) = (1, 0, 0) + 2·(0, 1, 0)`.

**NARRATION:**
They do. The columns moved, but the relations among them stayed exactly the same.

**NARRATION:**
Why? A relation among the columns, amounts c making c one a one, up to c four a four, equal zero, is the statement A c equals zero. In other terms, c solves A x equals zero. Row operations keep that system's column of zeros zero, turning it into R x equals zero, and by Theorem four the two systems have the same solutions.

**PRECISE — VISUAL:** **Lemma 5.** If R comes from A by row operations, then for every c, `Ac = 0 ⇔ Rc = 0`.
Proof line: `[A | 0] → [R | 0]` by the same operations; Theorem 4.

⏸ 2 — read the lemma

**VISUAL:** The two ℝ³ panels side by side. The tilted plane holding A's columns, and the floor holding R's.

**NARRATION:**
What the row operations did change is the span. Every column of R has third entry zero, so all of R's columns lie in the floor. Column one of A, one, two, one, doesn't. The relations survive. The spans don't need to.

### The reduced form is the same for everyone

**VISUAL:** The RREF R alone. Its pivot columns (1 and 3) are outlined: they are e₁ = (1, 0, 0) and e₂ = (0, 1, 0). Its free columns (2 and 4) are shaded.

**NARRATION:**
Look at how any R R E F is built. A pivot column has a one in its pivot row and zeros elsewhere, so the pivot columns are e one, e two, and so on, in order. Here, columns one and three are e one and e two.

A free column only has entries in the rows of the pivots to its left. Column two is two, zero, zero, which is two copies of e one. Column four is one, two, zero, which is one copy of e one plus two copies of e two. Its entries are exactly the amounts of the earlier pivot columns that build it.

**PRECISE — VISUAL:** Two facts appear as they are spoken:
(i) Column j of R is a pivot column exactly when it is **not** a combination of the columns before it.
(ii) The entries of a free column are the coefficients that express it through the pivot columns before it — and those coefficients are unique, because e₁, …, e_k are independent.

**NARRATION:**
That gives two facts. First, a column is a pivot column exactly when it is not a combination of the columns before it. A free column is a combination of earlier ones. A pivot column, e k, isn't, because every column before it has zero in row k. Second, the numbers in a free column are the unique amounts that build it from the pivot columns before it.

**NARRATION:**
Both facts are statements about relations among columns. Suppose two people reduce A and get two R R E Fs. By Lemma five, both satisfy exactly the same column relations as A. By the first fact, they have the same pivot columns, which are e one, e two and so on, in the same places. By the second fact, every free column holds the same numbers. And the rows below are zero in both. So the two are the same matrix.

**PRECISE — VISUAL:** **Theorem 6.** Every matrix has exactly one RREF, whatever sequence of row operations is used.

⏸ 2 — read the theorem

**VISUAL:** A small example: `[[2, 4], [1, 2]]`. Column 2 is outlined as 2 × column 1. Several different first moves branch off (swap; halve row 1; subtract twice row 2 from row 1), and every branch arrives at `[[1, 2], [0, 0]]`.

**NARRATION:**
A small case shows it. In two, four, one, two, column two is twice column one. Whatever anyone does, that relation survives. So column two can never become a pivot column, and its entry in the R R E F has to be the amount, two. Every route ends at one, two, zero, zero. There's nothing left to choose.

**NARRATION:**
Anything read off the reduced form, which columns are pivot columns, how many there are, which variables are free, belongs to the matrix itself, and not to the route taken.

---

## Rank
*Chapter §5. Terms: rank, column space C(A), row space C(Aᵀ); Theorem 7 (bases from the reduced form; row rank = column rank); Theorem 8 (the consistency test); the three outcomes; full row rank, full column rank; Theorem 9 (rank of a product).*

### What the count of pivots measures

**VISUAL:** The 3 × 4 matrix A above its RREF R; the two pivots boxed. A counter beside R: **2**.

**NARRATION:**
Elimination on this matrix found two pivots. Because the reduced form is unique, that count belongs to A. It's called the rank of A, written rank A, or just r. What does it measure?

**TERM ▸ rank** (label: "r = number of pivots in the RREF")

**VISUAL:** The ℝ³ panel from *When a column has no pivot*, with A's four columns in their tilted plane. The plane is now shaded in the blue–teal wash and labelled **C(A)**.

**NARRATION:**
All the outputs A x, that is, all combinations of the columns, form the span of the columns. That span is called the column space of A, written C of A. It lives in the output space, here R three.

**TERM ▸ column space C(A)**

**NARRATION:**
The rows have a span too, the row space. A's rows are the columns of A transpose, so the row space is written C of A transpose. It lives in the input space, here R four.

**TERM ▸ row space C(Aᵀ)**

### Bases, read straight off the reduction

**NARRATION:**
The column space here is a plane through the origin, so a basis takes two columns. Which two? Columns one and three are the pivot columns. But should you take them from A, or from R?

**HIDDEN UNTIL AFTER ⏸:** the highlighting of columns 1 and 3 and the Theorem 7 statement

⏸ 3 — decide whether the basis columns come from A or from R

**VISUAL:** The two ℝ³ panels from *When a column has no pivot*, A's tilted plane and R's floor. Columns 1 and 3 are highlighted in both.

**NARRATION:**
From A. R's columns lie in the floor, which isn't A's column space at all. What carries over is the relations. In R, the pivot columns are e one and e two, which are independent, and every free column is a combination of them. Lemma five says A has the same relations. So A's pivot columns are independent too, and every free column of A is built from them in the same way. They span C of A, and they're independent, so they're a basis.

**PRECISE — VISUAL:** **Theorem 7.** Let R be the RREF of A.
1. The pivot columns *of A* form a basis of C(A).
2. The nonzero rows *of R* form a basis of the row space of A.
3. So `dim C(A) = dim C(Aᵀ) = r`: row rank equals column rank, and `rank Aᵀ = rank A`.
In the example: C(A) has basis `(1, 2, 1), (1, 4, −1)`; the row space has basis `(1, 2, 0, 1), (0, 0, 1, 2)`.

**NARRATION:**
For the rows it's the other way round. Take them from R. Row operations replace rows by combinations of rows, and can be reversed, so the row space never changes. The nonzero rows of R span it, and they're independent, because row k has a one in its pivot column where every other row has zero.

⏸ 2 — read the two bases

**NARRATION:**
Here, the column space lives in R three and the row space in R four, yet both have dimension two. Both bases have one vector per pivot. The number of independent columns always equals the number of independent rows.

### The consistency test

**VISUAL:** The augmented matrix `[A | b]` with b = (4, 10, 2) and its reduction from *When a column has no pivot*, ending in the row `(0 0 0 0 | 0)`.

**NARRATION:**
Change the target. Keep A, and replace b by four, ten, three. Only the last entry changed. The same row operations are chosen by A alone, so they're the same steps. Track just the right-hand column. What ends up in the last row?

⏸ 3 — follow the right-hand column through the same steps

**PRECISE — VISUAL:** The right-hand column alone, step by step:
`(4, 10, 3)` → after `R₂ − 2R₁`, `R₃ − R₁`: `(4, 10 − 8, 3 − 4) = (4, 2, −1)` → after `R₃ + R₂`: `(4, 2, −1 + 2) = (4, 2, 1)`.
Last row: `(0 0 0 0 | 1)`.

**NARRATION:**
Four stays four, ten becomes two, and three becomes minus one, then one. The last row now reads zeros on the left, and one on the right. Zero equals one.

⏸ 1.5 — read the impossible row

**NARRATION:**
This is the all-zero equation we met with hyperplanes. Once its coefficients are cleared, a row says either zero equals zero, which asks nothing, or zero equals something nonzero, which nothing satisfies. Every other row holds a pivot, so the right-hand entries of the zero rows decide everything. Here it's zero equals one, so by Theorem four the original system has no solutions. The right-hand column has received a pivot of its own. The augmented matrix has rank three, while A has rank two. And four, ten, three is not in the column space. It's off the tilted plane.

**VISUAL:** In the ℝ³ output panel, b = (4, 10, 2) sits in the C(A) plane; the new target (4, 10, 3) sits just above it, a green dot with a dashed drop-line to the plane.

**PRECISE — VISUAL:** **Theorem 8.** These are equivalent: (a) Ax = b has a solution; (b) b ∈ C(A); (c) `rank A = rank [A | b]`.

**NARRATION:**
That's the consistency test. A x equals b has a solution, exactly when b is in the column space, exactly when adding b as an extra column doesn't raise the rank. The first two are the column reading of A x. For the third, reduce the augmented matrix. If its last column gets a pivot, some row reads zero equals one, and there's no solution. If it doesn't, set every free variable to zero and read each pivot variable from its row. The result is a solution.

**VISUAL:** The table from *One system, two pictures* returns. The first row's third column fills in: **no pivot in the right-hand column**.

### One, none, or infinitely many

**NARRATION:**
Could a system have exactly two solutions?

**HIDDEN UNTIL AFTER ⏸:** the line through x and x′ and the equation A(x − x′) = 0

⏸ 3 — decide whether exactly two solutions is possible

**VISUAL:** Input panel. Two white points x and x′, then the line through them, extended in both directions.

**NARRATION:**
Suppose x and x prime are two different solutions. Then A times their difference is b minus b, zero. So you can add any multiple of that difference to x, and A still gives b. One extra solution forces a whole line of them. A linear system has no solution, exactly one, or infinitely many. Never two.

**PRECISE — VISUAL:** `A(x − x′) = b − b = 0 ⇒ A(x + t(x − x′)) = b` for every real t.

**PRECISE — VISUAL:** A three-row table:

| Reduced form of [A \| b] shows | Outcome | Solution set |
|---|---|---|
| a pivot in the right-hand column | no solution | empty: b ∉ C(A) |
| no pivot there, no free columns | exactly one | a point |
| no pivot there, k free columns | infinitely many | a k-dimensional affine set |

**VISUAL:** Three small input panels side by side, each with the line x + 2y = 4 drawn in the same colour.

**NARRATION:**
In the plane you can see all three. Keep the first equation, x plus two y equals four, and change the second.

**VISUAL:** Panel 1 adds the line 3x − y = 5. Panel 2 adds 2x + 4y = 5. Panel 3 adds 2x + 4y = 8. Under each, its row operation.

**PRECISE — VISUAL:**
Panel 1: `R₂ ← R₂ − 3R₁` gives `−7y = −7`, so `y = 1`, `x = 2`.
Panel 2: `R₂ ← R₂ − 2R₁` gives `0 = −3`.
Panel 3: `R₂ ← R₂ − 2R₁` gives `0 = 0`; `y = t` free, `x = 4 − 2t`: the line `(4, 0) + t(−2, 1)`.

**NARRATION:**
With three x minus y equals five, elimination leaves minus seven y equals minus seven. One crossing, at two, one. With two x plus four y equals five, it leaves zero equals minus three. Parallel lines that never meet. With two x plus four y equals eight, it leaves zero equals zero. The second equation is the first one doubled, so the lines coincide, and every point on that line is a solution.

⏸ 2 — match each panel to its row of the table

### What the rank alone tells you

**VISUAL:** A generic m × n block with its RREF. Pivots are drawn as dots, each in its own row and its own column.

**NARRATION:**
Without solving anything, what can you say from m, n and r?

Each pivot needs its own row and its own column. The rank can't be more than the number of rows, or the number of columns.

**PRECISE — VISUAL:** `r ≤ min(m, n)`.

**VISUAL:** A wide matrix with a pivot in every row: no zero rows at the bottom.

**NARRATION:**
If every row has a pivot, r equals m, there are no zero rows, and no row can ever read zero equals one. So A x equals b has a solution for every b. That's called full row rank. It also works the other way. If some row lacks a pivot, then some b can't be reached. The four subspaces will show which ones.

**TERM ▸ full row rank** (`r = m ⇔ Ax = b solvable for every b`)

**VISUAL:** A tall matrix with a pivot in every column: no free columns.

**NARRATION:**
If every column has a pivot, r equals n, and there are no free variables. Then a solution, when there is one, is unique. That's called full column rank. The last step of the argument comes when we look at every solution at once.

**TERM ▸ full column rank** (`r = n ⇔ no free columns ⇔ a solution, when it exists, is unique`)

**VISUAL:** The table from *One system, two pictures*; its second row fills in: **no free columns**.

### Rank can't be created by multiplying

**VISUAL:** Three panels: input, middle, output, with arrows **B** then **A**. In the output panel, C(A) is a shaded plane.

**NARRATION:**
If you multiply two matrices, can the product have more rank than either factor?

**HIDDEN UNTIL AFTER ⏸:** the columns of AB and the C(AB) region

⏸ 3 — predict whether AB can have higher rank than A

**VISUAL:** The columns of AB arrive in the output panel, each landing inside the C(A) plane; C(AB) is drawn inside it.

**NARRATION:**
Each column of A B is A times a column of B, so it lies in the column space of A. The column space of A B sits inside that of A, and can't have larger dimension. On the other side, each row of A B is a combination of the rows of B, so the row space of A B sits inside that of B. By Theorem seven, row space and column space have the same dimension.

**PRECISE — VISUAL:** **Theorem 9.** `rank(AB) ≤ min(rank A, rank B)`.
`C(AB) ⊆ C(A)` · `row space of AB ⊆ row space of B`.

⏸ 2 — read both containments

**VISUAL:** A large grey matrix **W**, beside it a tall thin factor and a short wide factor, inner width **r**. Their product **ΔW = BA** is drawn with every column lying inside an r-dimensional slice, shaded.

**NARRATION:**
This is exactly why low-rank adaptation works. A fine-tuning update is written as a tall thin matrix times a short wide one, with inner width r. Every column of the update lies in the column space of the tall factor, so its rank is at most r. That limits how many independent directions the update can use. It doesn't limit how large the update is.

**NARRATION:**
The same bound appears in attention. The score matrix, Q times K transpose, has inner width d head, so its rank is at most d head, however long the sequence. And two linear layers with nothing between them compose to one linear layer, whose rank is at most the narrower width.

**PRECISE — VISUAL:** `rank(ΔW) = rank(BA) ≤ r` · `rank(QKᵀ) ≤ d_head` · `rank(W₂W₁) ≤ min(width of W₁, width of W₂)`.

**VISUAL:** Input panel. Two lines crossing at a very shallow angle. One of them tilts by a hair; the crossing point slides far along.

**NARRATION:**
One caution. Two nearly parallel lines still cross at exactly one point, so the algebra rightly reports one solution. But tilt either line slightly, and the crossing point moves a long way. The answer is exact, and still fragile. We'll come back to that when elimination runs on a real machine.

---

## Every solution at once
*Chapter §6. Terms: null space N(A), nullity, homogeneous system, particular solution; Theorem 10 (x_p + N(A)); Theorem 11 (the free-variable basis); Theorem 12 (rank–nullity).*

### The recipes that reach nothing

**VISUAL:** The input box **ℝ⁴** and output box **ℝ³** for the 3 × 4 system, joined by **A**. In the output box, a single zero vector, (0, 0, 0).

**NARRATION:**
The three by four system has infinitely many solutions. How do you write all of them down, and how many independent directions of freedom are there?

Start with the target zero. Which inputs does A send to zero? Right at the start, gold was blue plus teal, and the trade "one blue, one teal, minus one gold" reached nothing. Inputs like that are what you're collecting.

**NARRATION:**
All the inputs x with A x equal to zero form the null space of A, written N of A. It lives in the input space. A system with right-hand side zero is called homogeneous.

**TERM ▸ null space N(A); homogeneous system** (label in the input box, purple)

**NARRATION:**
Is the null space a subspace? It contains zero. And if A x and A y are both zero, then any combination goes to the same combination of zeros, which is zero. The null space is a subspace, and its dimension is called the nullity of A.

**PRECISE — VISUAL:** `N(A) = {x ∈ ℝⁿ : Ax = 0}` · `Ax = 0, Ay = 0 ⇒ A(αx + βy) = αAx + βAy = 0`.

**TERM ▸ nullity** (`dim N(A)`)

### One solution, plus the null space

**VISUAL:** Input box. One white vector x_p labelled **particular solution**, and a purple vector s in N(A). Their sum x_p + s.

**NARRATION:**
Suppose you have one solution, any one. Call it x p, a particular solution. Add something from the null space. Is the result still a solution?

**HIDDEN UNTIL AFTER ⏸:** the Theorem 10 statement and its proof line

⏸ 2 — predict A(x_p + s)

**NARRATION:**
A of x p plus s is A x p plus A s, which is b plus zero. Still b. And it works the other way. If x is any solution at all, then A of x minus x p is b minus b, zero. So x minus x p is in the null space, and x is x p plus something from the null space.

**PRECISE — VISUAL:** **Theorem 10.** If x_p is one solution of Ax = b, the set of all solutions is `x_p + N(A) = {x_p + s : s ∈ N(A)}`.
`A(x_p + s) = b + 0 = b` · `Ax = b ⇒ A(x − x_p) = 0`.

**TERM ▸ particular solution x_p**

⏸ 2 — read both directions of the proof

**NARRATION:**
So the solution set is the null space, slid over so that it passes through x p. That's an affine set, in the sense of chapter one. It's a single point exactly when the null space is only zero.

### Reading it off the reduced form

**VISUAL:** The two reduced equations from *When a column has no pivot*:
`x₁ + 2x₂ + x₄ = 3` · `x₃ + 2x₄ = 1`
Each is rewritten for its pivot variable: `x₁ = 3 − 2x₂ − x₄` · `x₃ = 1 − 2x₄`.

**NARRATION:**
Back to the reduced equations. Solve each one for its pivot variable, as on screen. The free variables, x two and x four, can be anything you like.

**NARRATION:**
The quickest particular solution sets both free variables to zero. What do you get?

**HIDDEN UNTIL AFTER ⏸:** x_p and its check

⏸ 3 — set x₂ = x₄ = 0 and read off x₁ and x₃

**PRECISE — VISUAL:** `x_p = (3, 0, 1, 0)`. Check: `Ax_p = 3·(1, 2, 1) + 1·(1, 4, −1) = (3 + 1, 6 + 4, 3 − 1) = (4, 10, 2) = b`.

**NARRATION:**
x one is three and x three is one, which makes x p three, zero, one, zero. Three copies of column one and one of column three give four, ten, two. Exactly b.

⏸ 1.5 — read the check

**NARRATION:**
For the null space, use the same equations with zeros on the right, and turn on one free variable at a time.

**PRECISE — VISUAL:**
`x₂ = 1, x₄ = 0`: `x₁ = −2, x₃ = 0`, so `s₁ = (−2, 1, 0, 0)`.
`x₂ = 0, x₄ = 1`: `x₁ = −1, x₃ = −2`, so `s₂ = (−1, 0, −2, 1)`.
Checks: `As₁ = −2·(1, 2, 1) + (2, 4, 2) = 0` · `As₂ = −(1, 2, 1) − 2·(1, 4, −1) + (3, 10, −1) = 0`.

**NARRATION:**
With x two equal to one, the pivot variables come out as minus two and zero. Call that s one. With x four equal to one, they come out as minus one and minus two. Call that s two.

**NARRATION:**
They are the column relations we found when a column had no pivot, written as recipes. s one says column two minus two copies of column one is zero. s two says column four, minus column one, minus two copies of column three, is zero.

⏸ 2 — match s₁ and s₂ to the two column relations

**PRECISE — VISUAL:** The complete solution, built term by term:
`x = (3, 0, 1, 0) + x₂(−2, 1, 0, 0) + x₄(−1, 0, −2, 1)`, with `x₂, x₄ ∈ ℝ`.

**NARRATION:**
So every solution is x p, plus any amount of s one, plus any amount of s two. Two free amounts, so the solutions form a flat, two-dimensional plane inside R four. It misses the origin, because zero doesn't solve a system whose target isn't zero.

⏸ 2 — read the complete solution

### A version you can see

**VISUAL:** Input panel, now a 3-D box: **input ℝ³**. Two planes, `x + y + z = 3` and `x + 2y + 3z = 4`, tinted pink and blue to match their equations (not purple, which is N(A) in this picture).

**NARRATION:**
Four dimensions can't be drawn. Take a smaller system with the same structure. Two equations in three unknowns. x plus y plus z equals three. And x plus two y plus three z equals four. Two planes in space. What does the set of points on both look like?

**HIDDEN UNTIL AFTER ⏸:** any highlighting of the intersection (planes drawn translucent, no solid line), the elimination steps and x_p

⏸ 3 — predict the shape where two planes meet

**PRECISE — VISUAL:** `R₂ ← R₂ − R₁`: `y + 2z = 1`; then `R₁ ← R₁ − R₂`: `x − z = 2`. Free variable z.
`x_p = (2, 1, 0)` · null vector `(1, −2, 1)`.

**NARRATION:**
Elimination, on screen, leaves z free. Setting z to zero gives the particular point two, one, zero. Setting z to one, with zeros on the right, gives the null vector one, minus two, one.

**VISUAL:** The two planes meet along a solid line through the white point (2, 1, 0). A dashed purple line through the origin, parallel to it, is labelled **N(A)**, along (1, −2, 1). A second white point (3, −1, 1) slides along the solid line.

**NARRATION:**
The planes meet in a line, the solid one. The dashed line through the origin is the null space, every multiple of one, minus two, one. The solution set is that same line, shifted so it passes through two, one, zero. Pick a different particular point on it, like three, minus one, one, and you describe the same line.

### How many directions of freedom?

**NARRATION:**
In the three by four example, two free variables gave two null vectors. Do those two always form a basis of the null space? Could some null vector be missing from their span?

**VISUAL:** s₁ and s₂ stacked as columns. Their free coordinates, rows 2 and 4, are highlighted: s₁ has (1, 0) there, s₂ has (0, 1).

**NARRATION:**
They're independent. Each one has a one in its own free coordinate and a zero in the other's. In any combination that adds up to zero, reading coordinate two forces the first amount to be zero, and coordinate four forces the second.

**NARRATION:**
They span. Take any null vector x, and subtract x two copies of s one and x four copies of s two. What's left is still in the null space, and both its free coordinates are zero. The reduced equations then force its pivot coordinates to zero as well. It's the zero vector, and x was that combination of s one and s two all along.

**PRECISE — VISUAL:** **Theorem 11.** For free columns f₁, …, f_k, let s_j solve Ax = 0 with `x_{f_j} = 1`, the other free variables 0, and pivot variables read from R. Then s₁, …, s_k is a basis of N(A).
Spanning step: `y = x − Σⱼ x_{f_j} s_j ∈ N(A)`, free coordinates of y are 0 ⇒ pivot coordinates of y are 0 ⇒ y = 0.

⏸ 2 — read the spanning step

**NARRATION:**
The nullity is therefore the number of free columns. And every column is either a pivot column or a free column.

**PRECISE — VISUAL:** **Theorem 12 (rank–nullity).** For `A ∈ ℝ^{m×n}`: `rank A + dim N(A) = n`. In the example: `2 + 2 = 4`.

**TERM ▸ rank–nullity**

⏸ 2 — read the identity and the example

**NARRATION:**
Rank plus nullity is the number of columns. Read it as a conservation law. The n directions of the input space split into the ones A keeps, the rank, and the ones it sends to zero, the nullity. Here, two and two make four.

**NARRATION:**
It also finishes the claim we made about rank. Full column rank means nullity zero, so by Theorem ten a solution, when there is one, is a single point. The cast A has rank two in R two, so two, three was the only recipe. Add gold, and the three-column matrix still has rank two. Its nullity is one, and that direction is the line of recipes from the very beginning.

**VISUAL:** The table from *One system, two pictures* is complete. A short, grey row of activation cells, 768 long, beside a single row vector **w**.

**NARRATION:**
One place this matters. A fixed linear probe reads one number, w transpose h, from an activation h in R seven hundred and sixty-eight. With w nonzero it has rank one, so its null space has dimension seven hundred and sixty-seven, and changes inside it leave the probe's score exactly the same. The score, not the accuracy. Scores can move without changing predictions, so unchanged accuracy doesn't show that the activation, or even its component along w, stayed fixed.

**PRECISE — VISUAL:** `h ↦ wᵀh`, `w ∈ ℝ⁷⁶⁸, w ≠ 0`: `rank 1`, `dim N = 767`.

---

## Four subspaces from one elimination
*Chapter §7. Terms: the four fundamental subspaces, left null space N(Aᵀ); Theorem 13 (the four dimensions); the record matrix E, [A | I] → [R | E]; Theorem 14 (the left null space decides consistency); Theorem 15 (two direct sums; A maps the row space one-to-one onto the column space); determinant as area (named only).*

### Two subspaces on each side

**VISUAL:** The two boxes for the 3 × 4 matrix, **input ℝ⁴** on the left, **output ℝ³** on the right, joined by **A**. In the input box, the row space (orange) and the null space (purple), each with its basis from *Rank* and *Every solution at once*. In the output box, the column space (blue–teal wash). One slot in the output box is still empty.

**NARRATION:**
Up to now, each matrix has given you three subspaces. In the input space, the row space and the null space. In the output space, the column space. The output side looks one short. Is there a natural fourth subspace living there?

**NARRATION:**
The null space came from asking which combinations of the columns give zero. Ask the same question of the rows. Which combinations of the rows of A give the zero row?

**VISUAL:** The three rows of A stacked. Amounts y₁, y₂, y₃ appear beside them; the weighted rows add to a row of zeros.

**NARRATION:**
Give each row an amount, y one, y two, y three, and ask for the weighted rows to add up to the zero row. Such a y lives in the output space, because it has one entry per row. In matrix form, y transpose times A is zero, which is the same as A transpose times y equals zero. The y multiplies A from the left, so the set of all such y is called the left null space, N of A transpose.

**TERM ▸ left null space N(Aᵀ)** (rose, in the output box)

**PRECISE — VISUAL:** `N(Aᵀ) = {y ∈ ℝᵐ : Aᵀy = 0} = {y : yᵀA = 0}`.
Then the table, row by row:

| Subspace | Definition | Lives in | Dimension |
|---|---|---|---|
| Column space C(A) | all Ax; span of the columns | ℝᵐ | r |
| Null space N(A) | all x with Ax = 0 | ℝⁿ | n − r |
| Row space C(Aᵀ) | span of the rows | ℝⁿ | r |
| Left null space N(Aᵀ) | all y with Aᵀy = 0 | ℝᵐ | ? |

**NARRATION:**
Three of the dimensions you already have. The column space and the row space both have dimension r. The null space has n minus r, by rank–nullity. For this three by four matrix of rank two, how big is the left null space?

**HIDDEN UNTIL AFTER ⏸:** the value in the "?" cell

⏸ 3 — use rank–nullity on Aᵀ to predict dim N(Aᵀ)

**NARRATION:**
A transpose is a four by three matrix, with three columns, and the same rank, two. Rank–nullity for A transpose says two plus its nullity is three. The left null space has dimension one. In general, m minus r.

**PRECISE — VISUAL:** The "?" fills in: **m − r**. **Theorem 13.** The four subspaces have dimensions r, n − r, r and m − r. For this matrix: 2, 2, 2, 1.

⏸ 1.5 — read the completed table

### Finding the left null space with a record

**NARRATION:**
Dimension one means a single vector y will span it. How do you find it? The zero row in R holds a clue. Row three became zero because some combination of A's rows cancelled out. Elimination did that combining, but didn't write down how.

**VISUAL:** `[A | I₃]`: A with the 3 × 3 identity to its right. The five operations from *When a column has no pivot* are listed down the side: `R₂ − 2R₁`, `R₃ − R₁`, `R₃ + R₂`, `½R₂`, `R₁ − R₂`. They play again, quickly, acting on the full width.

**NARRATION:**
Make it keep a record. Write the identity beside A, and run the same five row operations on the full width, still choosing pivots only from A's block. The identity starts as "row one is one copy of row one", and so on. Each operation updates that record along with A.

**PRECISE — VISUAL:**
`[A | I₃] → [[1, 2, 0, 1 | 2, −½, 0], [0, 0, 1, 2 | −1, ½, 0], [0, 0, 0, 0 | −3, 1, 1]] = [R | E]`

⏸ 2 — read the right-hand block E

**NARRATION:**
The left block is R. The right block is a matrix called E. Each row of E lists the amounts of A's rows that make the matching row of R. E times A equals R. Row three of E is minus three, one, one. Row three of R is zero. Minus three copies of row one of A, plus row two, plus row three, should give the zero row. Check it.

**HIDDEN UNTIL AFTER ⏸:** the summed row of zeros and the label y spanning N(Aᵀ)

⏸ 3 — check −3·(row 1) + (row 2) + (row 3) of A

**PRECISE — VISUAL:** `−3·(1, 2, 1, 3) + (2, 4, 4, 10) + (1, 2, −1, −1) = (0, 0, 0, 0)`, so `y = (−3, 1, 1)` spans N(Aᵀ). `EA = R`.

**NARRATION:**
Column by column, the sums cancel, starting with minus three plus two plus one. The vector y equals minus three, one, one spans the left null space.

**VISUAL:** The four-subspace diagram. Left box, **ℝ⁴**: the row space (orange, dim 2) and the null space (purple, dim 2), drawn meeting at a right angle at the origin. Right box, **ℝ³**: the column space (blue–teal, dim 2) and the left null space (rose, dim 1), also at a right angle. An arrow from a row-space vector lands in the column space; an arrow from a null-space vector lands on 0. Each subspace is labelled with its basis.

**NARRATION:**
All four come from one elimination. In the input space, the row space from R's nonzero rows, and the null space from the free variables. In the output space, the column space from A's pivot columns, and the left null space from E's last row. The counts add up on each side. Two plus two is four, the input dimension. Two plus one is three, the output dimension.

**PRECISE — VISUAL:** Labels on the diagram:
C(Aᵀ): `(1, 2, 0, 1), (0, 0, 1, 2)` · N(A): `(−2, 1, 0, 0), (−1, 0, −2, 1)` · C(A): `(1, 2, 1), (1, 4, −1)` · N(Aᵀ): `(−3, 1, 1)`.
`2 + 2 = 4` under the left box, `2 + 1 = 3` under the right.

⏸ 3 — inspect the diagram: which subspaces share a box, and which bases came from where

### Which targets can be reached?

**VISUAL:** The ℝ³ output panel drawn as a picture again. The column-space plane, and the rose arrow y = (−3, 1, 1) standing at a right angle to it. The target (4, 10, 2) in the plane; the target (4, 10, 3) just above it.

**NARRATION:**
Earlier, four, ten, two was reachable and four, ten, three wasn't. The left null space tells you which is which without running elimination again.

If A x equals b, then for any y in the left null space, y transpose b is y transpose A x. And y transpose A is zero. Then y transpose b has to be zero. For this matrix, that's one condition on the target. Minus three b one, plus b two, plus b three, must be zero.

**PRECISE — VISUAL:** `Ax = b, yᵀA = 0 ⇒ yᵀb = yᵀAx = 0`. Test: `−3b₁ + b₂ + b₃ = 0`.

**NARRATION:**
Try it on both targets.

**HIDDEN UNTIL AFTER ⏸:** both results and the ✓/✗ marks

⏸ 3 — compute −3b₁ + b₂ + b₃ for (4, 10, 2) and for (4, 10, 3)

**PRECISE — VISUAL:** `b = (4, 10, 2)`: `−12 + 10 + 2 = 0` ✓ consistent. `b = (4, 10, 3)`: `−12 + 10 + 3 = 1 ≠ 0` ✗.

**NARRATION:**
For four, ten, two, minus twelve plus ten plus two is zero. Reachable. For four, ten, three, it's one. And that's the same one that appeared in the bad row earlier. Reducing the augmented matrix applies E to b too, so the bad row's right-hand entry was y transpose b all along.

**NARRATION:**
The converse holds as well. If y transpose b is zero for every y in the left null space, the system has a solution. Reducing the augmented matrix gives R, with E b on the right. The entries of E b beside the zero rows of R are exactly y transpose b, for the rows of E that sit beside those zero rows. If they're all zero, the right-hand column gets no pivot, and Theorem eight gives a solution.

**PRECISE — VISUAL:** **Theorem 14.** Ax = b has a solution exactly when `yᵀb = 0` for every `y ∈ N(Aᵀ)`. The rows of E beside the zero rows of R form a basis of N(Aᵀ).
`[A | b] → [R | Eb]`.

**NARRATION:**
Those rows of E are a basis. E comes from the identity by row operations, so its m rows span R m, and are therefore independent. The m minus r rows beside the zero rows of R are independent, they lie in the left null space, and that space has dimension m minus r. The right number of independent vectors makes a basis.

⏸ 2 — read the theorem

**NARRATION:**
This also closes the promise we made about rank. If the rank is less than m, the left null space has some nonzero vector y. Use y itself as the target. Then y transpose b is y transpose y, the sum of the squares of y's entries, which isn't zero. So that target can't be reached. Full row rank is exactly what lets every target be reached.

**PRECISE — VISUAL:** `r < m ⇒ ∃ y ≠ 0 in N(Aᵀ); b = y gives yᵀb = yᵀy > 0 ⇒ unreachable`.

### How the pieces fit together

**VISUAL:** The four-subspace diagram again. In the input box, the row space and the null space meet only at the origin.

**NARRATION:**
In the diagram, each pair of subspaces in one box meets only at the origin. Is that true for every matrix? Can a nonzero input be in the row space and the null space at once?

**HIDDEN UNTIL AFTER ⏸:** the zᵀz argument

⏸ 3 — think about what Ax = 0 says about x and each row

**NARRATION:**
A x equals zero says that every row of A, dotted with x, gives zero. A null-space vector is at a right angle to every row, and so to every combination of rows. A vector in both would be at a right angle to itself. Its dot product with itself, the sum of the squares of its entries, would be zero. That only happens for the zero vector.

**PRECISE — VISUAL:** If `z ∈ C(Aᵀ) ∩ N(A)`: `z = Aᵀy`, `Az = 0`, so `zᵀz = (Aᵀy)ᵀz = yᵀAz = 0 ⇒ z = 0`.

**NARRATION:**
So the sum of the row space and the null space is direct, in the sense of chapter one. Its dimension is r plus n minus r, minus zero for the overlap, which is n. A subspace of R n with dimension n is all of R n. The same argument, applied to A transpose, splits the output space.

**PRECISE — VISUAL:** **Theorem 15.** `ℝⁿ = C(Aᵀ) ⊕ N(A)` and `ℝᵐ = C(A) ⊕ N(Aᵀ)`. Moreover A maps the row space one-to-one onto the column space.

**VISUAL:** In the input box, an input x splits into an orange part x_r in the row space and a purple part x_null in the null space. Under A, the purple part lands on 0; the orange part lands on Ax in the column space. A second row-space vector x_r′ with the same image is drawn, and their difference is shown lying in both subspaces, so it shrinks to the origin.

**NARRATION:**
Every input splits, in one way only, into a row-space part and a null-space part. A sends the null-space part to zero, so the row space alone reaches the whole column space. And two row-space vectors can't land in the same place, because their difference would lie in both subspaces, so it would be zero. A carries the row space onto the column space without collapsing anything.

⏸ 2 — follow x_r and x_null through A

**NARRATION:**
On the output side, b can be reached exactly when it has no component along the left null space. It is the right-angle picture of the test you just did.

**NARRATION:**
One thing to keep straight. Rank, nullity, existence and uniqueness need no angles at all. Only the right angles in this diagram do, and they come from the dot product, which Module three develops.

### The two by two case

**VISUAL:** Two panels for the cast A. The unit square on the left; on the right, the parallelogram spanned by blue and teal, its area shaded and labelled **3**. Then the panels switch to `[[1, 2], [2, 4]]` from *Turning rows into columns, and running a map backwards*: the parallelogram flattens onto a line, area 0. The output line is labelled **C(A)**; in the input panel, the line through (2, −1) is labelled **N(A)**, its points all landing on the origin.

**NARRATION:**
In two dimensions you can see collapse directly. The cast A turns the unit square into a parallelogram of area three, and nothing is flattened. Its column space is all of R two, its null space just zero. The singular matrix one, two, two, four flattens the square onto a line, its column space, and its null space is the line through two, minus one. The area, up to sign, is called the determinant, and zero area is exactly a loss of rank. Chapter five develops determinants. Here the area is only a picture of collapse.

**TERM ▸ determinant (named only: |det| = area of the image of the unit square)**

---

## Elimination as multiplication
*Chapter §8. Terms: elementary matrix; Theorem 16; reflection, stretch, shear; E_k ⋯ E₁A = R; Gauss–Jordan inversion; Theorem 17 (the invertible matrix theorem); one-sided inverses.*

### A row operation is a matrix

**VISUAL:** The cast's augmented matrix from *Elimination* and its one row operation, `R₂ ← R₂ − ½R₁`, beside the shear picture of the output panel.

**NARRATION:**
When we first eliminated, the row operation on our system acted on the output panel as a shear, and shears are linear. Is every row operation a matrix? And if so, which matrix?

**NARRATION:**
A row operation acts on each column separately, the same way whatever the other columns hold, and it respects sums and multiples. On a single column it's a linear map from R m to R m. By Theorem one, its matrix has as columns the images of e one, e two, and so on, which is the operation done to I.

**PRECISE — VISUAL:** Three 3 × 3 matrices, each labelled with its operation, each obtained by doing that operation to I:
`[[0, 1, 0], [1, 0, 0], [0, 0, 1]]` (R₁ ↔ R₂) · `[[1, 0, 0], [0, 5, 0], [0, 0, 1]]` (R₂ ← 5R₂) · `[[1, 0, 0], [0, 1, 0], [−4, 0, 1]]` (R₃ ← R₃ − 4R₁).

**TERM ▸ elementary matrix** (label: "one row operation, done to I")

**NARRATION:**
The matrix you get by doing one row operation to the identity is called an elementary matrix. Here are three. A swap of rows one and two. Row two times five. And row three minus four copies of row one.

**NARRATION:**
Multiply the third one by any three-row matrix A. What does it do?

**HIDDEN UNTIL AFTER ⏸:** Theorem 16 and the inverse matrix with +4

⏸ 3 — predict what the third matrix does to the rows of A

**NARRATION:**
Its first two rows are the first two rows of the identity, so rows one and two of A are left alone. Its third row is minus four, zero, one, so the new row three is minus four copies of row one plus row three. The operation itself. And it's undone by adding four copies back, so its inverse has plus four in the same place.

**PRECISE — VISUAL:** **Theorem 16.** If E is the elementary matrix of a row operation, doing the operation to any m-row matrix A gives EA. Every elementary matrix is invertible, and its inverse is the elementary matrix of the reverse operation.
`[[1, 0, 0], [0, 1, 0], [−4, 0, 1]]⁻¹ = [[1, 0, 0], [0, 1, 0], [4, 0, 1]]`.
For the cast: `E = [[1, 0], [−½, 1]]`, `EA = [[2, −1], [0, 3/2]]`.

**NARRATION:**
For the cast, the one operation was row two minus a half of row one. Put minus a half below the diagonal of the identity. Multiplying A by this matrix performs our row operation. The triangular system we reached by elimination.

⏸ 2 — read the cast's elementary matrix and its product

**VISUAL:** Three pairs of 2 × 2 panels, each with the unit square on the left and its image on the right:
- swap `[[0, 1], [1, 0]]`: the square reflected across the line y = x;
- `R₂ ← 3R₂`: the square stretched vertically to height 3;
- `R₂ ← R₂ − 2R₁`: the square sheared, e₁ to (1, −2), e₂ to (0, 1).

**NARRATION:**
Acting on vectors in the plane, the three kinds look like this. A swap reflects across the diagonal line. Scaling a row stretches along one axis. A replacement is a shear. None of them flattens the square. Each can be undone.

**PRECISE — VISUAL:** `E_k ⋯ E₂E₁A = R`, and `E = E_k ⋯ E₁ = E_k ⋯ E₁ I`.

**NARRATION:**
Elimination multiplies A on the left by one elementary matrix after another, until it reaches R. Their product is the record matrix E from the four subspaces, because doing the same operations to the identity builds exactly that product.

### Computing an inverse

**NARRATION:**
If elimination on a square matrix reaches the identity, what has it found?

**PRECISE — VISUAL:** `[A | I] → [EA | EI] = [I | E]`, so `EA = I`, E invertible, `A = E⁻¹`, `A⁻¹ = E`.

**NARRATION:**
The operations multiply everything by E. If the left block becomes I, then E A equals I, and E, a product of invertible matrices, is invertible. So A is E inverse, and A inverse is E. The right block started as I and now holds E. Reduce A beside the identity, and when the left side becomes I, the right side is A inverse. This is Gauss–Jordan inversion.

**TERM ▸ Gauss–Jordan inversion**

**VISUAL:** `[A | I]` for `A = [[1, 1, 0], [1, 2, 1], [0, 1, 2]]`.

**NARRATION:**
Take the matrix on screen.

**PRECISE — VISUAL:** Each step changes one row, highlighted:
1. `R₂ ← R₂ − R₁`: `(0, 1, 1 | −1, 1, 0)`
2. `R₃ ← R₃ − R₂`: `(0, 0, 1 | 1, −1, 1)` — the left block is now upper triangular, pivots 1, 1, 1
3. `R₂ ← R₂ − R₃`: `(0, 1, 0 | −2, 2, −1)`
4. `R₁ ← R₁ − R₂`: `(1, 0, 0 | 3, −2, 1)`

**NARRATION:**
Two steps clear downwards and leave pivots one, one, one. Two more clear upwards. Watch the right block. It starts as I and collects every operation.

⏸ 2 — follow the four steps

**PRECISE — VISUAL:**
`[[1, 0, 0 | 3, −2, 1], [0, 1, 0 | −2, 2, −1], [0, 0, 1 | 1, −1, 1]]`, so `A⁻¹ = [[3, −2, 1], [−2, 2, −1], [1, −1, 1]]`.
Check: `A(3, −2, 1) = (3 − 2, 3 − 4 + 1, −2 + 2) = (1, 0, 0)`.

**NARRATION:**
The left block is the identity, so the right block is A inverse. The check on screen multiplies A by the first column of the answer and gets one, zero, zero. Exactly e one.

⏸ 2 — read the inverse and its check

**NARRATION:**
And if the left block develops a row of zeros instead, A has fewer than n pivots. Is A then certainly not invertible?

### Eleven ways of saying "no collapse"

**VISUAL:** A square matrix A at the centre. Around it, statements appear one at a time as they are proved, connected by implication arrows into a cycle with spurs.

**NARRATION:**
For a square matrix, how many different-sounding properties turn out to be one property? The screen lists eleven. One thread runs through all of them, and it's collapse.

**PRECISE — VISUAL:** **Theorem 17 — the invertible matrix theorem.** For an n × n matrix A, these are equivalent:
1. A is invertible. 2. N(A) = {0}. 3. The columns are independent. 4. rank A = n. 5. The RREF of A is I. 6. A is a product of elementary matrices. 7. Ax = b has a solution for every b. 8. The columns span ℝⁿ. 9. There is B with BA = I. 10. There is C with AC = I. 11. Aᵀ is invertible.

**NARRATION:**
Start with a matrix that can be undone, even if only from the left. Then nothing nonzero can be crushed to zero, because the left inverse would have to bring it back from zero, and every matrix sends zero to zero. A null space of just zero is the same thing as independent columns. Rank–nullity then makes the rank n. With n pivots in n columns, the reduced form is the identity. The row operations that got there, undone in reverse, rebuild A from elementary matrices, and each of those can be undone. So A is invertible, and the thread closes where it began.

**PRECISE — VISUAL:** The cycle draws: `1 ⇒ 9 ⇒ 2 ⇔ 3`, `2 ⇒ 4 ⇒ 5 ⇒ 6 ⇒ 1`, with each arrow labelled by its one-line reason:
`9 ⇒ 2: x = BAx = B0 = 0` · `2 ⇒ 4: rank = n − 0` · `5 ⇒ 6: A = E₁⁻¹ ⋯ E_k⁻¹` · `6 ⇒ 1: Theorem 3`.

⏸ 3 — trace the cycle from 1 back to 1

**NARRATION:**
The other statements hang off the same thread. A right inverse lets you reach every target, which is the columns spanning, which forces rank n again. And A transpose is invertible exactly when A is, by Theorem three.

**PRECISE — VISUAL:** Spurs: `1 ⇒ 10 ⇒ 7 ⇔ 8 ⇒ 4` · `1 ⇔ 11`. Under the diagram: if `BA = I`, then `B = B(AA⁻¹) = (BA)A⁻¹ = A⁻¹`; likewise `AC = I ⇒ C = A⁻¹`.

**NARRATION:**
And once they all hold, a one-sided inverse is the inverse, by the last line on screen.

⏸ 2 — read the last line

**NARRATION:**
That answers the question about a zero row. Fewer than n pivots breaks the thread at the rank, so A isn't invertible. It also settles a claim chapter one left open. A square matrix whose null space is just zero is invertible. And it explains why elimination worked on our first system. Three nonzero pivots in a three by three system is full rank, so that solution had to be unique. A twelfth equivalent condition, that the determinant isn't zero, is proved in chapter five.

**VISUAL:** The two-panel picture of the cast A: the unit square and its parallelogram of area 3; then the singular [[1, 2], [2, 4]] flattening it onto a line.

**NARRATION:**
In the picture, an invertible map never flattens space. The square goes to a genuine parallelogram. No nonzero input is crushed to zero, and every output is hit. The eleven statements are eleven ways of saying there's no collapse.

### Rectangular matrices

**VISUAL:** A tall m × n matrix and a wide one, each with a candidate inverse beside it.

**NARRATION:**
Can a matrix that isn't square have an inverse on both sides?

**HIDDEN UNTIL AFTER ⏸:** the two inequality chains and m = n

⏸ 3 — use rank to decide whether a non-square matrix can have BA = I and AC = I

**NARRATION:**
If B A equals I, the null space is zero, so the rank is n, and rank can't exceed m. If A C equals I, every b in R m is reachable, so the rank is m, which can't exceed n. Together, m equals n. Only square matrices have two-sided inverses. One-sided inverses of full-rank rectangular matrices do exist, and return in least squares, in Module three.

**PRECISE — VISUAL:** `BA = Iₙ ⇒ N(A) = {0} ⇒ n = rank A ≤ m` · `AC = Iₘ ⇒ m = rank A ≤ n` · both ⇒ `m = n`.

---

## LU: elimination, remembered
*Chapter §9. Terms: unit lower triangular, A = LU (Theorem 18), forward substitution, flop and operation count, permutation matrix, partial pivoting, PA = LU (Theorem 19), P⁻¹ = Pᵀ, LDU and LDLᵀ.*

### Twenty right-hand sides

**VISUAL:** One matrix A beside a stack of twenty different right-hand-side columns b₁, …, b₂₀.

**NARRATION:**
Suppose you have to solve A x equals b for twenty different right-hand sides, all with the same A. The row operations depend only on A. Which entries get cleared, which multipliers, which pivots. Only the right-hand column is different each time. Repeating the whole elimination twenty times redoes almost all of that work. How can you record the elimination once, and reuse it?

**VISUAL:** The cast's elimination: `E = [[1, 0], [−½, 1]]`, `EA = U = [[2, −1], [0, 3/2]]`. The arrow is reversed: `A = E⁻¹U`, with `E⁻¹ = [[1, 0], [½, 1]]`.

**NARRATION:**
Start with the cast. One operation, row two minus a half of row one, turned A into the triangular matrix U. Undo it, and you're back to A. A is the undo matrix times U. Undoing means adding back a half of row one, so the undo matrix has plus a half where the operation had minus a half. It is the multiplier itself, sitting in row two, column one.

**PRECISE — VISUAL:** `A = [[2, −1], [1, 1]] = [[1, 0], [½, 1]] [[2, −1], [0, 3/2]] = LU`.

**HIDDEN UNTIL AFTER ⏸:** the bottom-row arithmetic

⏸ 2 — multiply out the bottom row of LU to check it gives (1, 1)

**NARRATION:**
Half of U's top row, plus all of its bottom row, gives one, one. Row two of A.

### Three operations, three multipliers

**VISUAL:** The 3 × 3 system from *Elimination*: `A = [[2, 1, 1], [4, 1, 0], [−2, 2, 1]]`. Its three operations and multipliers listed: `R₂ − 2R₁` (ℓ₂₁ = 2), `R₃ + R₁` (ℓ₃₁ = −1), `R₃ + 3R₂` (ℓ₃₂ = −3). Their elementary matrices appear beneath:
`E₂₁ = [[1, 0, 0], [−2, 1, 0], [0, 0, 1]]`, `E₃₁ = [[1, 0, 0], [0, 1, 0], [1, 0, 1]]`, `E₃₂ = [[1, 0, 0], [0, 1, 0], [0, 3, 1]]`.

**NARRATION:**
Back to the three by three system we eliminated earlier. It needed three operations, with multipliers two, minus one and minus three. Each is an elementary matrix, with minus the multiplier in the position it cleared. Multiplying A by all three, in the order they were done, gives the triangular U.

**PRECISE — VISUAL:** `E₃₂E₃₁E₂₁A = U = [[2, 1, 1], [0, −1, −2], [0, 0, −4]]`.

**NARRATION:**
To get A back, multiply U by the inverses, in reverse order. Each inverse just flips the sign of its one off-diagonal entry. What do you expect their product to look like?

**HIDDEN UNTIL AFTER ⏸:** L and the multipliers flying into it

⏸ 3 — predict the product E₂₁⁻¹E₃₁⁻¹E₃₂⁻¹

**PRECISE — VISUAL:** `A = E₂₁⁻¹E₃₁⁻¹E₃₂⁻¹ U = LU`, `L = [[1, 0, 0], [2, 1, 0], [−1, −3, 1]]`. The multipliers 2, −1, −3 fly from the list into L, each into the position it was used: (2, 1), (3, 1), (3, 2).

**NARRATION:**
The multipliers, each in the place where it was used, with no arithmetic at all. Two in row two, column one. Minus one in row three, column one. Minus three in row three, column two. Ones on the diagonal, zeros above. A matrix of that shape is called unit lower triangular.

**TERM ▸ unit lower triangular L**

**PRECISE — VISUAL:** Row 3 of LU: `−1·(2, 1, 1) − 3·(0, −1, −2) + 1·(0, 0, −4) = (−2, 2, 1)` = row 3 of A.

**NARRATION:**
Check one row on screen. Row three of L says how much of each row of U to take, and that combination lands exactly on row three of A.

⏸ 2 — read the check

**VISUAL:** Beside L, the forward-order product `E₃₂E₃₁E₂₁ = [[1, 0, 0], [−2, 1, 0], [−5, 3, 1]]`, with the −5 ringed.

**NARRATION:**
The forward product isn't so tidy. Watch its bottom-left entry. It's minus five, which isn't any multiplier. Row three got row one directly once, and again through row two, which already held some of row one, and the two contributions combined. In L, each multiplier acts on a row of U, a finished row that nothing else changes afterwards, so nothing combines. That's why L, and not the forward product, is the record to keep.

**PRECISE — VISUAL:** **Theorem 18.** If elimination on a square A meets a nonzero pivot in every column without swaps, then A = LU, with U the upper triangular result and L unit lower triangular holding ℓᵢⱼ in position (i, j).
Proof lines: clearing column k is `L_k = I − ℓ_k e_kᵀ`, with ℓ_k zero in positions 1, …, k; `L_k⁻¹ = I + ℓ_k e_kᵀ` since `e_kᵀℓ_k = 0`; in `(I + ℓ₁e₁ᵀ)(I + ℓ₂e₂ᵀ)⋯` every cross term contains `e_jᵀℓ_k = 0` (j < k), so the product is `I + ℓ₁e₁ᵀ + ⋯ + ℓ_{n−1}e_{n−1}ᵀ`.

**NARRATION:**
In general, all the operations clearing column k form one matrix, the identity minus a column of multipliers below the diagonal in column k. Its inverse adds them instead. When the inverses multiply in order, each cross term would pair a multiplier column with a position above it, where that column is zero. Nothing mixes, and the product is the identity with every multiplier in its own place.

⏸ 2 — read the theorem

### Solving with the factors

**PRECISE — VISUAL:** `Ax = b` ⇒ `L(Ux) = b`: first `Lc = b`, then `Ux = c`.

**NARRATION:**
With A equal to L U, the equation A x equals b becomes L times U x equals b. Call U x by a name, c. Solve L c equals b first, then U x equals c. Both are triangular, so each is quick.

**NARRATION:**
L is lower triangular, so its top row involves only c one. Solve from the top down. That's called forward substitution. Take b equal to three, six, one.

**TERM ▸ forward substitution**

**VISUAL:** Only L, the empty unknowns c₁, c₂, c₃, and b = (3, 6, 1) are on screen. *Elimination*'s reduced matrix is not.

**HIDDEN UNTIL AFTER ⏸:** c₁, c₂, c₃ and *Elimination*'s right-hand column

⏸ 3 — solve Lc = (3, 6, 1) from the top row down

**PRECISE — VISUAL:** `c₁ = 3` · `2c₁ + c₂ = 6 ⇒ c₂ = 0` · `−c₁ − 3c₂ + c₃ = 1 ⇒ c₃ = 4`. So `c = (3, 0, 4)`.
Beside it, the right-hand column from *Elimination*'s elimination: `(3, 0, 4)`.

**NARRATION:**
The top row gives c one equals three. Each row below adds one new unknown, so c two is zero and c three is four. That's exactly the right-hand column elimination produced earlier. Forward substitution replays the elimination on b alone. Back substitution on U x equals c then returns one, two, minus one, as before.

⏸ 1.5 — compare c with the right-hand column from *Elimination*

### What the record saves

**NARRATION:**
How much work does the record save? Count one flop for each addition, subtraction, multiplication or division.

**TERM ▸ flop**

**VISUAL:** An n × n grid. The column-k step is shaded: n − k rows below the pivot, each with one multiplier to compute and n − k remaining entries to update.

**NARRATION:**
Clearing column k affects the n minus k rows below the pivot. Each one needs a division for its multiplier. Then, for each of its n minus k remaining entries, one multiplication and one subtraction. Column k costs n minus k, plus two times n minus k squared.

**PRECISE — VISUAL:** Write j = n − k:
`Σ_{j=1}^{n−1} (j + 2j²) = (n−1)n/2 + 2·(n−1)n(2n−1)/6 = ⅔n³ − ½n² − ⅙n ≈ ⅔n³`.
Forward substitution with unit L: `n² − n` flops. Back substitution: `n²`.

**NARRATION:**
Add up over the columns, and the full count is on screen. What matters is how it grows. The factorisation grows like n cubed, about two thirds n cubed. Each solve after that grows only like n squared, about two n squared for the two substitutions.

⏸ 2 — read the total

**PRECISE — VISUAL:** `n = 1000`: factor ≈ `6.7 × 10⁸` flops; one forward + back pair ≈ `2 × 10⁶`; ratio > 300.

**NARRATION:**
For n equal to a thousand, one factorisation is about six hundred and seventy million flops. One pair of substitutions is about two million. So once the factors exist, each extra right-hand side is more than three hundred times cheaper. Forming A inverse instead costs about two n cubed flops, three times the factorisation, and is rarely worth it. Solve with the factors.

### When a row has to move

**VISUAL:** The 3 × 3 identity with its rows reordered to `[[0, 1, 0], [0, 0, 1], [1, 0, 0]]`, labelled **P**.

**NARRATION:**
No row swaps have been needed yet. When a zero, or on a computer a very small number, lands in the pivot position, elimination swaps rows. A permutation matrix is the identity with its rows reordered. Multiplying by it reorders the rows of A the same way.

**TERM ▸ permutation matrix P**

**NARRATION:**
The usual rule is called partial pivoting. In each column, swap up the entry with the largest absolute value, from the pivot position down. Then every multiplier is an entry divided by something at least as large, so its size is at most one.

**TERM ▸ partial pivoting** (label: "pivot = largest |entry| at or below the pivot position ⇒ |ℓ| ≤ 1")

**VISUAL:** The 3 × 3 matrix A again. Column 1's candidates 2, 4, −2 are highlighted.

**NARRATION:**
Run it on the same matrix. In column one, the candidates are two, four and minus two. Which row supplies the pivot?

**HIDDEN UNTIL AFTER ⏸:** the swap and both column steps

⏸ 3 — pick the pivot for column 1 under partial pivoting

**PRECISE — VISUAL:**
Column 1: swap R₁ ↔ R₂: rows `(4, 1, 0)`, `(2, 1, 1)`, `(−2, 2, 1)`. Multipliers `2/4 = ½` and `−2/4 = −½`: new rows 2 and 3 are `(0, ½, 1)` and `(0, 5/2, 1)`.
Column 2: candidates `½` and `5/2`; swap rows 2 and 3 (and their stored multipliers). Multiplier `(½)/(5/2) = ⅕`: last row `(0, 0, 1 − ⅕) = (0, 0, ⅘)`.

**NARRATION:**
Four, in row two, so swap it to the top. Both multipliers have size one half, and column one clears. In column two, five halves beats a half, so swap again, carrying the stored multipliers along. The last multiplier is a fifth, and the last pivot is four fifths.

⏸ 2 — read the two steps

**PRECISE — VISUAL:** The rows of A were used in the order 2, 3, 1:
`PA = [[4, 1, 0], [−2, 2, 1], [2, 1, 1]] = [[1, 0, 0], [−½, 1, 0], [½, ⅕, 1]] [[4, 1, 0], [0, 5/2, 1], [0, 0, ⅘]]`.
Check row 3: `½·(4, 1, 0) + ⅕·(0, 5/2, 1) + (0, 0, ⅘) = (2, 1, 1)`.

**NARRATION:**
The rows of A were used in the order two, three, one. With that reordering, A factors as L U again, and every multiplier in L has size at most one, where the unpivoted elimination used minus three. The check of row three is on screen.

⏸ 2 — read the factorisation and the check

**PRECISE — VISUAL:** **Theorem 19.** For every n × n matrix A there are a permutation P, a unit lower triangular L and an upper triangular U with PA = LU. With partial pivoting, every entry of L has absolute value at most 1. U has a zero on its diagonal exactly when A is singular.

**NARRATION:**
That works for every square matrix. A later swap only exchanges rows below the columns already cleared, so it can be slid to the front, at the cost of swapping a few stored multipliers. All the swaps collect into one P, and the multipliers form L as before, still of size at most one. If a column has no nonzero candidate, that step is skipped, leaving a zero on U's diagonal.

**NARRATION:**
And the diagonal of U tells you whether A is invertible, since P and L always are. If every diagonal entry is nonzero, back substitution on U x equals zero forces every unknown to zero, from the bottom up. If the entry in column k is zero, the first k columns of U live in the first k minus one coordinates, so they're dependent, and U is singular.

⏸ 2 — read the theorem

### Solving with the swapped factors

**PRECISE — VISUAL:** `P⁻¹ = Pᵀ`, because the columns of P are distinct standard basis vectors, so `PᵀP = I`.
`Ax = b ⇒ PAx = Pb ⇒ LUx = Pb`.
`Pb = (6, 1, 3)` · forward: `c₁ = 6`, `c₂ = 1 + ½·6 = 4`, `c₃ = 3 − ½·6 − ⅕·4 = −⅘` · back: `⅘x₃ = −⅘ ⇒ x₃ = −1`, `(5/2)x₂ + x₃ = 4 ⇒ x₂ = 2`, `4x₁ + x₂ = 6 ⇒ x₁ = 1`.

**NARRATION:**
To solve with P A equals L U, multiply A x equals b by P first. That just reorders b, in the same order, rows two, three, one. Three, six, one becomes six, one, three. Undoing P is easy too. Its columns are different standard basis vectors, so P transpose times P is the identity, and P inverse is P transpose.

**NARRATION:**
Forward substitution on six, one, three, then back substitution, gives one, two, minus one. The same answer as before.

⏸ 2 — read the solution

### A symmetric refinement

**PRECISE — VISUAL:** `U = DU′`: for the unpivoted example, `[[2, 1, 1], [0, −1, −2], [0, 0, −4]] = diag(2, −1, −4) · [[1, ½, ½], [0, 1, 2], [0, 0, 1]]`. So `A = LDU′`.

**NARRATION:**
One more refinement. Divide each row of U by its pivot, and U becomes a diagonal matrix D of pivots, times a unit upper triangular matrix. For the unpivoted example, D holds two, minus one and minus four. A is then L D U prime, with ones on the diagonals of both triangular factors.

**NARRATION:**
When A is invertible and needs no swaps, those three factors are unique. If two such products are equal, rearranging puts a lower triangular matrix on one side and an upper triangular one on the other. A matrix that's both is diagonal, and the unit diagonals then force the factors to match. For a symmetric A, the upper factor is the transpose of the lower one, and A equals L D L transpose. Chapter seven builds the Cholesky factorisation from that form.

**PRECISE — VISUAL:** `L₁D₁U₁ = L₂D₂U₂ ⇒ L₂⁻¹L₁D₁ = D₂U₂U₁⁻¹` (lower = upper ⇒ diagonal) ⇒ `L₁ = L₂, D₁ = D₂, U₁ = U₂`. Symmetric A: `A = LDLᵀ`.

---

## Elimination on a real machine
*Chapter §10. Terms: rounding, pivoting failure, growth factor ρ, Wilkinson's example, backward error, unit roundoff u, numerical rank, tolerance, condition number κ.*

### A computer with three digits

**VISUAL:** Input panel. Two lines: `10⁻⁴x + y = 1`, almost horizontal, and `x + y = 2`. They cross near (1, 1) at a clear angle. A small counter in the corner reads **3 significant digits**.

**NARRATION:**
Everything so far used exact arithmetic. A real computer rounds every result. To see what that does, imagine a machine that keeps only three significant digits, and give it this pair. Ten to the minus four x, plus y, equals one. And x plus y equals two.

**NARRATION:**
The exact solution has x just above one, at one point zero zero zero one and a little more, and y just below one, at nought point nine nine nine eight and a little more. To three digits, both are one.

**PRECISE — VISUAL:** `x = 1/(1 − 10⁻⁴) = 1.0001…`, `y = (1 − 2·10⁻⁴)/(1 − 10⁻⁴) = 0.9998…`; both round to `1.00`.

**NARRATION:**
Without pivoting, the pivot is ten to the minus four, and the multiplier is ten thousand. What happens to the second row?

**HIDDEN UNTIL AFTER ⏸:** the red rounded values, y, x and the result (0, 1)

⏸ 3 — predict what three-digit rounding does to the second row

**PRECISE — VISUAL:** In red where rounding bites:
`1 − 10⁴·1 = −9999 → stored −1.00 × 10⁴` · `2 − 10⁴·1 = −9998 → stored −1.00 × 10⁴`
`y = 1.00` · `x = (1 − 1.00)/10⁻⁴ = 0`. Result `(0, 1)`.

**NARRATION:**
The new coefficient, one minus ten thousand, and the new right-hand side, two minus ten thousand, both round to minus ten thousand. Dividing, y is one. Then x is one minus one, divided by ten to the minus four. Zero. The machine answers zero, one. It has lost x completely.

⏸ 2 — compare (0, 1) with the true answer near (1, 1)

**VISUAL:** A dashed vertical line, x = 0, appears in the input panel. It meets the first line at (0, 1), marked in red. The true crossing near (1, 1) stays marked with a white dot.

**NARRATION:**
The huge multiplier subtracted ten thousand copies of the first equation from the second, and rounding then threw away the second equation's own numbers as too small to keep. The stored factors multiply back to a matrix whose second row is one, zero. With the rounded right-hand side, the machine exactly solved a system whose second line is x equals zero, the dashed line. Its answer lies on the first line, but misses the second by one.

**PRECISE — VISUAL:** Stored `L = [[1, 0], [10⁴, 1]]`, `U = [[10⁻⁴, 1], [0, −10⁴]]`, `LU = [[10⁻⁴, 1], [1, 0]]`. Residual in equation 2: `2 − (0 + 1) = 1`.

**NARRATION:**
The two true lines cross at a healthy angle, so the problem itself isn't delicate. The failure belongs to the method.

**NARRATION:**
With partial pivoting, the first column's candidates are ten to the minus four and one. Swap the rows, so the pivot is one. What's the multiplier now?

**HIDDEN UNTIL AFTER ⏸:** ℓ = 10⁻⁴ and the rounded rows

⏸ 2 — find the multiplier after the swap

**PRECISE — VISUAL:** Swap: `x + y = 2` on top. `ℓ = 10⁻⁴`. `1 − 10⁻⁴ = 0.9999 → 1.00` · `1 − 2·10⁻⁴ = 0.9998 → 1.00` · `y = 1.00`, `x = 2 − 1.00 = 1.00`.

**NARRATION:**
Ten to the minus four. Now the new coefficient and the new right-hand side both round to one. Then y is one, and x is two minus one, one. Correct to all three digits.

### Growth

**NARRATION:**
Partial pivoting keeps every multiplier at size one or less. Does that keep every number in the elimination small?

**NARRATION:**
To measure it, take the largest entry, in absolute value, that appears anywhere during elimination, U included. Divide it by the largest entry of A. That ratio is called the growth factor, written rho. In the unpivoted three-digit example, the largest entry of A was one, and minus ten thousand appeared. Rho was ten thousand.

**TERM ▸ growth factor ρ**

**VISUAL:** `W₃ = [[1, 0, 1], [−1, 1, 1], [−1, −1, 1]]`: ones on the diagonal and in the last column, −1 below the diagonal. The last column is highlighted.

**NARRATION:**
Take a matrix with ones on the diagonal and down the last column, and minus ones below the diagonal. In column one every candidate has size one. Keep the current row on a tie, so row one is the pivot row, and the multipliers are minus one. Watch the last column as you add row one to the rows below.

**HIDDEN UNTIL AFTER ⏸:** the new rows, the 1 → 2 → 4 chain and ρ

⏸ 3 — predict what happens to the last column

**PRECISE — VISUAL:** Add R₁ to R₂ and R₃: rows `(0, 1, 2)` and `(0, −1, 2)`. Column 2 ties again; multiplier −1; add R₂ to R₃: `(0, 0, 4)`. Last column: `1 → 2 → 4`. `ρ = 4/1 = 4`.

**NARRATION:**
Column two ties again, with multiplier minus one, and the steps are on screen. The last column went one, two, four, though every multiplier stayed at minus one. The largest entry grew from one to four, so rho is four. The n by n version doubles the last column at every step, so its growth factor is two to the n minus one. This is Wilkinson's example.

**PRECISE — VISUAL:** n × n version: `ρ = 2ⁿ⁻¹`.

**NARRATION:**
How much does growth matter? The standard result says the computed answer, x hat, exactly solves a slightly different system, A plus delta A, times x hat, equals b, where delta A, relative to A, is of order rho times u. Here u is the unit roundoff, two to the minus fifty-three in double precision. Growth like two to the n minus one is possible but almost never seen, which is why partial pivoting is the default.

**PRECISE — VISUAL:** `(A + δA)x̂ = b`, `‖δA‖/‖A‖ = O(ρu)`, `u = 2⁻⁵³` in float64 (Trefethen & Bau, Lecture 22).

**TERM ▸ backward error; unit roundoff u**

### What "rank" means on a computer

**VISUAL:** `diag(1, 10⁻¹⁰)`. Its two diagonal entries as bars on a log scale, with a horizontal tolerance line at 10⁻⁸.

**NARRATION:**
Exact rank is well defined for exact numbers. But rounding, or noise in measured data, almost always nudges a matrix to full rank. How, then, does a program decide the rank?

**NARRATION:**
It counts pivots, or better, the singular values of chapter eight, that lie above a chosen tolerance. Take the diagonal matrix with entries one and ten to the minus ten. Its exact rank is two. With a tolerance of ten to the minus eight, the second entry falls below the line, and the reported rank is one.

**TERM ▸ numerical rank; tolerance**

**NARRATION:**
A numerical rank is a statement about a matrix, a method and a tolerance together. Report all three.

### When the problem itself is sensitive

**VISUAL:** The two nearly parallel lines from *Rank*. The target nudges slightly; the crossing slides far.

**NARRATION:**
Pivoting repairs the method. Can it repair a problem like the nearly parallel lines we saw with rank?

**NARRATION:**
No. That sensitivity belongs to the problem. The condition number, kappa of A, which is the size of A times the size of A inverse, measures how much a small relative change in b, or in A, can be magnified in the exact solution. The sizes here are matrix norms, defined in chapter nine. Roughly, you lose about log base ten of kappa of the sixteen or so decimal digits that double precision carries.

**PRECISE — VISUAL:** `κ(A) = ‖A‖ ‖A⁻¹‖` · digits lost ≈ `log₁₀ κ` of ≈ 16.

**TERM ▸ condition number κ**

**NARRATION:**
Partial pivoting controls the multipliers, not the growth, so its guarantee is excellent in practice rather than unconditional. And a small residual, b minus A x hat, shows that x hat solves a nearby problem. It does not show that x hat is close to the true x, when kappa is large. Chapter nine treats norms, kappa and backward error in full.

---

## The matrix with 3072 columns

**VISUAL:** The grey block from *One system, two pictures* returns: **A: 768 × 3072**, b ∈ ℝ⁷⁶⁸, x ∈ ℝ³⁰⁷². Beside it, the completed table from *One system, two pictures*, and the four-subspace diagram in miniature, its boxes labelled ℝ³⁰⁷² (input) and ℝ⁷⁶⁸ (output).

**NARRATION:**
Back to the matrix with seven hundred and sixty-eight rows and three thousand and seventy-two columns. Can its columns reach every target? And is a recipe ever unique?

**HIDDEN UNTIL AFTER ⏸:** the rank bound, the full-row-rank line and the nullity bound

⏸ 4 — answer both from the shape, using rank and rank–nullity

**PRECISE — VISUAL:** `r ≤ min(768, 3072) = 768`. If `r = 768` (full row rank): no zero rows, `Ax = b` solvable for every b. Always: `dim N(A) = 3072 − r ≥ 2304 > 0`, so a solution is never unique.

**NARRATION:**
The rank is at most seven hundred and sixty-eight, the smaller side. If it reaches that, every row has a pivot, no row can read zero equals one, and every target can be reached. And the nullity is three thousand and seventy-two minus the rank, at least two thousand three hundred and four. So a target that is reached is reached by a whole affine set of recipes, never by just one.

**VISUAL:** The two panels of the cast, as at the very start: the lines crossing at (2, 3), the arrows reaching (1, 5), and A between them.

**NARRATION:**
It's the same reasoning as with two equations and a crossing point. Elimination finds the pivots, and the pivots give the rank. Rank and shape tell us whether every target is reachable, and whether a reachable target has one recipe or infinitely many. For a particular target, the augmented matrix tells us whether it can be reached.

**NARRATION:**
The written chapter has the three labs, where you eliminate by hand and watch both pictures move, along with the exercises and the checkpoint.

---

## Coverage decisions for review

Every definition, theorem, worked example and remark in §0–§10 appears above. Where the video treats something differently from the chapter, it is listed here so nothing changes silently.

1. **Order inside §0–§1.** The approved passage (the §1 worked example) opens the video; §0's framing (existence/uniqueness table, the 768 × 3072 promise) follows it in *One system, two pictures* rather than preceding it, and the §1 definitions come in *What A x computes*. The chapter's "Route" and "How to work through this" paragraphs and the prerequisite-check list are not narrated (they are reading instructions for the page); the five prerequisite skills are used, not listed.
2. **§0 table, third column.** Shown empty in *One system, two pictures* and filled in at *Rank* (consistency) and *Rank* (free columns), when the words *pivot* and *free column* exist.
3. **Added cast material (not in the chapter, all verified):**
   - Gold column a₃ = (1, 2) = a₁ + a₂ in *One system, two pictures* and *Every solution at once*, giving a second recipe (1, 2, 1) and the recipe line (2, 3, 0) + t(−1, −1, 1). Used to make uniqueness ↔ independence visible before any formalism.
   - The cast's inverse A⁻¹ = ⅓[[1, 1], [−1, 2]] and A⁻¹(1, 5) = (2, 3) in *Turning rows into columns, and running a map backwards*, before the chapter's [[2, 1], [5, 3]] example (which is kept).
   - The cast's elementary matrix E = [[1, 0], [−½, 1]] (*Elimination as multiplication*) and LU = [[1, 0], [½, 1]][[2, −1], [0, 3/2]] (*LU: elimination, remembered*), as a one-multiplier warm-up before the chapter's 3 × 3.
   - A numerical check F(3, 6, 12) = (7, 9) for the chapter's mean/difference map.
   - D and U′ written out for the chapter's 3 × 3 U in *LU: elimination, remembered* (the chapter states A = LDU′ without numbers).
   - |det| = 3 for the cast (*Four subspaces from one elimination*) as the area picture.
4. **Letter clash.** §2 uses A and B for new matrices. The narration says so explicitly at the start of *One map after another*. LoRA uses the chapter's ΔW = BA notation (on screen only).
5. **Proofs given in full vs. by their key step.** Full: Theorems 1, 2, 3, 4, Lemma 5, 6, 7 (both halves), 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, the rectangular-inverse remark, LDU uniqueness. **Key step only, full proof on screen:** Theorem 18 (the cross-term argument is narrated in words; the e_jᵀℓ_k notation is on screen). **Narrated in outline:** Theorem 19 (the "slide swaps to the front" step is described, not computed; the singular-U argument is given in full). Recommended: reviewers check that the Theorem 18/19 narration is followable; if not, the fix is more screen time, not removal.
6. **§2 "Rules".** Distributivity is stated with its one-line reason (linearity); the identity and diagonal matrix get one unit together.
7. **§4 elimination bench, §5 two-picture lab, §7 map lab.** Not shown (labs stay in the chapter). The §7 lab's content — collapse of the unit square and determinant as area — is kept as *Four subspaces from one elimination*. The close mentions the labs once.
8. **§5 "Why this matters for ML"** (LoRA, QKᵀ, two linear layers) is kept in *Rank*, with the LA01 review's correction built in: rank limits the number of directions, not the size of the update.
9. **§6 probe example** is kept, including the score-vs-accuracy caveat.
10. **§10 backward-error statement** is quoted as the chapter gives it, "of order ρu", with the citation on screen. (Standard statements hide a dimension-dependent constant inside the O; see notes below.)
11. **Numerical notes in §3 and §5** become two short forward pointers (*Elimination* end, *Rank* end) that *Elimination on a real machine* pays off.
12. **Colours follow the approved sample.** The solution dot is white, the row lines are pink and purple, and the derived column (1, 2) is gold so it doesn't clash with the purple line. The row space is orange, since amber would sit too close to gold. Purple (`C_P`, the house subspace colour) still marks the null space; it never shares a picture with the x + y = 5 line.
13. **Spoken vs. shown calculations.** In *One map after another* through *Elimination on a real machine*, routine entry-by-entry arithmetic (other entries of a product, the rest of a row after an operation, LU and Gauss–Jordan checks, the pivoted factorisation, substitutions) is shown on screen and not read aloud; one representative step is narrated. The invertible-matrix-theorem list is shown in full; the narration follows the single "no collapse" thread through it rather than reading the eleven numbered statements.
14. **Two additions for rigour.** *What A x computes* states that a linear equation is a hyperplane only when at least one coefficient is nonzero, and that an all-zero equation is either 0 = 0 (no constraint) or 0 = c ≠ 0 (impossible). *Rank* links the consistency test back to that, since every zero row of the reduced form is one of these two cases.
15. **Summary claims.** The close separates what rank and shape decide (whether every target is reachable; one recipe or infinitely many for a reachable target) from what needs the augmented matrix (whether a particular target is reachable). *One system, two pictures*'s promise is worded to match.
16. **Not narrated:** the "Practice" prompts in every section, §11–§17 and the mastery check (by design). Chapter cross-references to LA05, LA07, LA08, LA09 and Module 3 are spoken as "chapter five", "chapter seven", etc.

## Notes for the maths review

- **Chapter wording to confirm (not changed in the script):**
  - §10: "‖δA‖/‖A‖ of order ρu" is the Trefethen–Bau statement with dimension-dependent factors absorbed into the O. Fine as stated; flagged only because a careful viewer may ask where n went.
  - §10: the exact y is given as "0.9998…"; the value is 0.99989999…, so "0.9998…" is a truncation, not a rounding. Narration says "nought point nine nine nine eight, and a little more", which is accurate.
  - §5 "full row rank" bullet forward-references Theorem 14. The script defers that half of the argument to *Four subspaces from one elimination* and says so.
- **Resolved:** the only two colons left in narration are in the approved passage (paragraph 5, "chapter one: how much blue…", and paragraph 6, "on the left: two and three"). They stay. The approved audiovisual sample was voiced and approved with them, and neither is a beat boundary, so no cut falls there.

### Computations checked, and how

Checked: every number below was recomputed in Python. Exact work used `fractions.Fraction` with hand-written matrix product, matrix–vector product, transpose and RREF routines (no rounding). Spot checks used NumPy from `scripts/videos/la02/.venv`. The scripts themselves were throwaway and are not in the repo; anyone can rerun these checks from the list.

*Cast (*One system, two pictures* through *Elimination*, 10, 11, 12):*
- A(2, 3) = (1, 5); 2·(2, 1) + 3·(−1, 1) = (1, 5); blue path ends at (4, 2).
- Gold column: [a₁ a₂ a₃](2, 3, 0) = (1, 5), (1, 2, 1) ↦ (1, 5), (0, 1, 2) ↦ (1, 5), (3, 4, −1) ↦ (1, 5), (−1, −1, 1) ↦ (0, 0); rank of [a₁ a₂ a₃] = 2.
- Ae₁ = (2, 1), Ae₂ = (−1, 1).
- A⁻¹ = ⅓[[1, 1], [−1, 2]]: AA⁻¹ = I; A⁻¹(1, 5) = (2, 3); |det A| = 3.
- Shear: [[1, 0], [−½, 1]]A = [[2, −1], [0, 3/2]], image of b = (1, 9/2), 2·(2, 0) + 3·(−1, 3/2) = (1, 9/2).
- Cast LU: [[1, 0], [½, 1]][[2, −1], [0, 3/2]] = A.

*§1–§2 examples (*The matrix as a map* through *Turning rows into columns, and running a map backwards*):*
- Rotation R(3, 1) = (−1, 3).
- Mean/difference map F = [[⅓, ⅓, ⅓], [−1, 0, 1]], F(3, 6, 12) = (7, 9).
- Composition pair AB = [[3, 1], [2, 2]], BA = [[2, 2], [1, 3]].
- Outer products [[2, 0], [0, 0]] + [[1, 1], [2, 2]] = AB.
- Blocks: [[1, 2, 0], [0, 1, 3]](1, 1, 2) = (3, 7).
- 2×3 · 3×2 product = [[4, 3], [−1, −3]]; the reverse product is 3×3.
- Transpose [[1, −1], [0, 3], [2, 1]].
- (AB)ᵀ = BᵀAᵀ = [[3, 2], [1, 2]].
- [[2, 1], [5, 3]]⁻¹ = [[3, −1], [−5, 2]], checked both ways.
- [[1, 2], [2, 4]](2, −1) = 0.

*§3 (*Elimination*):*
- The 3×3 elimination rows (0, −1, −2 | 0), (0, 3, 2 | 4), (0, 0, −4 | 4).
- Solution (1, 2, −1) checked in all three equations.
- Column recipe 1·(2, 4, −2) + 2·(1, 1, 2) − 1·(1, 0, 1) = (3, 6, 1).

*§4–§7, the 3×4 system (*When a column has no pivot* through *Four subspaces from one elimination*):*
- RREF of [A | b] for b = (4, 10, 2): [[1, 2, 0, 1 | 3], [0, 0, 1, 2 | 1], 0], pivot columns 1 and 3.
- For b = (4, 10, 3): the last row is (0 0 0 0 | 1), rank 3.
- Column relations in A and in R.
- Ax_p = (4, 10, 2); As₁ = As₂ = 0.
- [A | I] → [R | E] with E = [[2, −½, 0], [−1, ½, 0], [−3, 1, 1]], and EA = R.
- (−3, 1, 1)A = 0.
- y·(1, 2, 1) = y·(1, 4, −1) = 0 (y is normal to C(A)).
- yᵀ(4, 10, 2) = 0 and yᵀ(4, 10, 3) = 1.
- The 3-unknown figure: RREF of [[1, 1, 1 | 3], [1, 2, 3 | 4]] is [[1, 0, −1 | 2], [0, 1, 2 | 1]]; (2, 1, 0) and (3, −1, 1) both solve it; (1, −2, 1) is in the null space.
- The three-outcomes systems: x + 2y = 4 with 3x − y = 5 gives (2, 1); 0 = −3; 0 = 0.

*§8–§9 (*Elimination as multiplication* through *LU: elimination, remembered*):*
- Gauss–Jordan: the RREF of [A | I] gives A⁻¹ = [[3, −2, 1], [−2, 2, −1], [1, −1, 1]], and AA⁻¹ = I.
- 2×2 elementary shear images (1, −2) and (0, 1).
- LU = A; E₃₂E₃₁E₂₁ = [[1, 0, 0], [−2, 1, 0], [−5, 3, 1]], and (E₃₂E₃₁E₂₁)A = U.
- Forward substitution c = (3, 0, 4).
- D·U′ = U for D = diag(2, −1, −4), U′ = [[1, ½, ½], [0, 1, 2], [0, 0, 1]].
- PA for P = rows (2, 3, 1) equals L₂U₂ with the pivoted factors given.
- Pb = (6, 1, 3), c = (6, 4, −⅘), x = (1, 2, −1).
- Flop sum Σ(j + 2j²) matches ⅔n³ − ½n² − ⅙n exactly for n = 3 (13) and n = 1000 (666,166,500).
- ⅔n³ / 2n² ≈ 333 at n = 1000; forward n² − n = 999,000, back n² = 10⁶.

*Rechecked after the "spoken textbook" revision (exact fractions):*
- Cast LU check: ½·(2, −1) + (0, 3/2) = (1, 1).
- Pivoted elimination: multipliers ½ and −½, then ⅕; last pivot ⅘.
- Entry checks quoted in narration: (AB)₁₁ = 1·2 + 1·1 = 3; the 2×3·3×2 product's (1, 1) entry is 2 + 0 + 2 = 4.
- Three-digit rounding: 1 − 10⁴ and 2 − 10⁴ both round to −1.00 × 10⁴; 1 − 10⁻⁴ and 1 − 2·10⁻⁴ both round to 1.00.
- Every PRECISE block that now resolves only after a pause (A⁻¹(1, 5) = (2, 3); c = (3, 0, 4)) uses the values already verified below.

*§10 (*Elimination on a real machine*):*
- Exact solution of the three-digit system: x = 1.00010…, y = 0.99989…
- Stored factors multiply to [[10⁻⁴, 1], [1, 0]].
- W₃ elimination rows (0, 1, 2), (0, −1, 2), (0, 0, 4), so ρ = 4.
- Wilkinson growth 2ⁿ⁻¹ for n = 2…6 (NumPy).
- 2-norm κ of [[10⁻⁴, 1], [1, 1]] ≈ 2.6, which supports "healthy angle".
- `numpy.linalg.matrix_rank(diag(1, 1e−10), tol=1e−8) = 1`.

## Open visual questions

- ***One system, two pictures* (the gold column).** Three amounts need a 3-D input box while the output stays a plane. The switch from a 2-D input plane to a 3-D box mid-unit is a real change of space; it should be a visible transformation (the plane tilting into the floor of the box), not a cut.
- ***The matrix as a map* (rotation).** Comparing (3, 1) with its turned image (−1, 3) invites overlaying them in one plane. The script avoids that: the right panel shows the turned grid, and (−1, 3) is located by counting along the turned axes. Reviewers should check this still makes "a quarter turn" obvious.
- **ℝ⁴ boxes (*When a column has no pivot* through *Four subspaces from one elimination*).** Shown as labelled boxes holding column vectors. The four-subspace diagram is the conventional Strang drawing (rectangles meeting at right angles), which is schematic, not a true picture of ℝ⁴; it should be labelled as a diagram.
- **Theorems 18 and 19.** The cross-term argument and "sliding swaps to the front" are algebraic; on-screen equations are specified but no geometric picture. A possible picture for 18: the three elementary matrices as shears composed in two orders, showing the forward product's −5 as an interaction. Not scripted.
- ***Elimination on a real machine* growth.** Drawn as numbers changing; no geometric picture proposed.

## Length check

Counted from the NARRATION blocks (spoken form, so "seven hundred and sixty-eight" counts as five words). Pauses are the authored ⏸ seconds only.

| Part | Narration words | Authored pauses |
|---|---|---|
| 1 One system, two pictures | 712 | 11.0 s |
| 2 What A x computes | 612 | 6.0 s |
| 3 The matrix as a map | 865 | 12.0 s |
| 4 One map after another | 910 | 12.5 s |
| 5 Transpose and inverse | 801 | 16.0 s |
| 6 Elimination | 1,005 | 22.0 s |
| 7 When a column has no pivot | 986 | 16.5 s |
| 8 Rank | 1,131 | 19.5 s |
| 9 Every solution at once | 996 | 19.5 s |
| 10 Four subspaces | 1,240 | 22.5 s |
| 11 Elimination as multiplication | 884 | 17.0 s |
| 12 LU | 1,320 | 26.5 s |
| 13 Elimination on a real machine | 856 | 10.0 s |
| Close | 181 | 4.0 s |
| **Total** | **12,499** | **215 s (95 pauses)** |

- At 150 words/min: narration ≈ 83.3 min, plus 3.6 min of authored pauses ≈ **87 min**, before time for visuals to finish moving.
- At LA01's measured Kokoro rates (≈165–170 wpm for mostly technical narration): ≈ **77–79 min**.
- Within the 60–90 min range at either rate. The revision got under 12,500 words by showing routine calculations on screen instead of reading them aloud, not by dropping content; every concept, theorem and worked example is still present.
