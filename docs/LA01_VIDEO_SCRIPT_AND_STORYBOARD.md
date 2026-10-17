# LA01 — concept-led production script and storyboard

One lesson, one video. Target: 60–90 minutes. Voice: Kokoro af_heart at its original speed.

Reuses selected existing mathematical animations; new passages and replacement narration are explicit. No exercise-bank or lab-contract tour.

## Can you reach the target?

### Shot 000

Visual: parallel.

Can you get this little craft to the green point? You have two controls. You can use either one, turn it up or down, and even run it backwards. Before you try anything, look carefully at the two arrows. What do you think will happen?

Thinking pause: 4 seconds.

### Shot 001

Visual: try_blue.

Let's try the blue control. The craft moves along the blue arrow. More of that move takes it farther along the same line. Reverse it, and we go back through home and out the other side. We can travel a long way, but the green point is still somewhere we haven't been.

### Shot 002

Visual: try_gold.

Perhaps the gold control can help. It looks like a second option. But watch its direction. It is just twice the blue move. Anything it can do, the blue control could already do. Adding them, subtracting them, or using enormous settings still leaves the craft on the same line.

### Shot 003

Visual: unreachable.

Here is the important failure. We don't need to search harder for a clever setting. No setting exists. The target lies outside the entire collection of places these controls can reach. That is a much stronger statement than saying that our first few attempts didn't work.

Thinking pause: 2 seconds.

### Shot 004

Visual: turn.

Now turn the gold arrow. We have changed its direction, not added any new control. Do you think the target is reachable now? Imagine walking some distance along blue, then some distance along gold. Negative distances are allowed too. Hold a possible route in your mind.

Thinking pause: 4 seconds.

### Shot 005

Visual: reach.

One blue move, followed by two gold moves, lands exactly on the green point. The blue move is two across and one up. Each gold move is one across and two up. Together that makes four across and five up. We have found a way to get there.

### Shot 006

Visual: fill.

But finding one route is only the beginning. Change the two settings and the destination changes. Sweep through more settings and a patch of reachable territory appears. Give yourself larger settings and the patch grows. There is no boundary built into these two directions: together they reach the whole plane.

### Shot 007

Visual: controls.

This is an ideal movement simulator. Each arrow describes a displacement, rather than a real engine's acceleration. The controls accept any real number, including fractions and negatives. We have no fuel limit and no shore. Those assumptions let us isolate the mathematics of which moves can be combined.

### Shot 008

Visual: third.

Now for a different puzzle. Suppose we attach a third control pointing along this new arrow. It isn't parallel to either of the first two. Three different-looking directions. Has the craft gained the ability to reach somewhere it couldn't reach before?

Thinking pause: 5 seconds.

### Shot 009

Visual: third_hold.

Keep that question. It will lead us to independence, to the meaning of a coordinate system, and eventually to the columns of a neural network's weight matrix. The same distinction keeps returning: how many controls are on the panel, and how many independent moves can they actually produce?

## From moves to reachable territory

### Shot 010

Visual: operations.

We can already see the main problem. To explain it precisely, we need just two operations: do one move after another, and change how much of a move we use. Let's briefly separate those operations. These example arrows use different numbers, but they obey exactly the same movement rules.

### Shot 011

Visual: s01_views:6, 56.67–69.00s.

A vector can be pictured as an arrow. Read the list three, minus one as a movement instruction: three steps right, then one step down. The arrow from where you started to where you finish records that displacement. The numbers and the arrow describe the same move.

### Shot 012

Visual: s01_views:7, 69.00–83.20s.

Here's the subtle part. The arrow is not pinned in place by its tail. It's a displacement, a move, like the instruction 'three steps right and one step down'. That instruction means the same thing wherever you happen to be standing.

### Shot 013

Visual: s01_views:8, 83.20–99.93s.

So slide the arrow around. Wherever its tail sits, the vector is computed as tip minus tail. Start it at minus two, two, and it ends at one, one. Tip minus tail is one minus minus two, which is three, and one minus two, which is minus one. Same vector.

### Shot 014

Visual: s03_operations:2, 27.63–39.73s.

Addition is componentwise. a one, a two, plus b one, b two, is a one plus b one, a two plus b two. Let's watch it. Take u equal to three, one, and v equal to one, two.

### Shot 015

Visual: s03_operations:3, 39.73–57.13s.

Pick up v, and move its tail to the tip of u. Sliding doesn't change it: it's still the same displacement. The sum runs from the origin to v's new tip, the point four, three. Three east and one north, then one east and two north, adds up to four east and three north.

### Shot 016

Visual: s03_operations:4, 57.13–74.23s.

Now do it the other way round. Start with v, and attach a copy of u at its tip. You land in exactly the same place. In numbers: u plus v is three plus one, one plus two, which is four, three. And v plus u is one plus three, two plus one: also four, three.

### Shot 017

Visual: s03_operations:5, 74.23–91.53s.

The two routes trace the two halves of one parallelogram. Why must they meet? Sliding an arrow keeps its displacement, and each coordinate is a sum of real numbers, which don't care about order. That's axiom one, and it's why the picture is a parallelogram rather than a path.

### Shot 018

Visual: s03_operations:6, 91.53–103.87s.

Now scalar multiplication. c times a one, a two, is c a one, c a two. Every coordinate gets multiplied by the same number c. Think of c as a dial attached to the arrow.

### Shot 019

Visual: s03_operations:7, 103.87–111.97s.

Turn c up to two, and the arrow stretches to twice its length, in the same direction. Turn it back down toward zero, and it shrinks.

### Shot 020

Visual: s03_operations:8, 111.97–125.43s.

At c equal to zero, the arrow collapses to the origin. Push past zero, and it comes out the other side, pointing exactly backwards. At minus one it's u flipped, and at minus two it's flipped and doubled.

### Shot 021

Visual: s03_operations:9, 125.43–135.37s.

So scaling stretches by the absolute value of c, and flips if c is negative. The direction is preserved or exactly reversed. Never rotated.

### Shot 022

Visual: s03_operations:10, 135.37–154.40s.

Watch the trail the tip leaves behind. Because a scalar can't turn a vector sideways, the multiples of one vector stay on one line, instead of filling a plane. And because the scalar can be negative, they fill the whole line in both directions, not just a ray. Hold on to that picture. It's the seed of span.

### Shot 023

Visual: s03_operations:11, 154.40–163.80s.

Now combine the two moves. Let's build two u minus v. Step one, scale. Two u is six, two. And minus v is minus one, minus two.

### Shot 024

Visual: s03_operations:12, 163.80–177.33s.

Step two, add, tip to tail. Start at six, two, and walk minus v from there: one back, and two down. Six minus one is five, and two minus two is zero. So two u minus v is five, zero.

### Shot 025

Visual: reach.

Return to our original moves, two across and one up, and one across and two up. A pair of control settings is a recipe for a destination. The question is no longer what the arrows are called. It is what these two arrows let us build, and whether a particular destination has a recipe.

### Shot 026

Visual: s04_span:5, 79.80–93.57s.

Let's try one. Our two moves are u equals two, one, and v equals one, two. Can they reach the point four, five? In other words, is there a recipe, a and b, with a times u plus b times v equal to four, five?

### Shot 027

Visual: s04_span:6, 93.57–106.33s.

A vector equation is really one equation per coordinate. The first coordinates give two a plus b equals four. The second coordinates give a plus two b equals five. Two equations, two unknowns.

### Shot 028

Visual: s04_span:7, 106.33–125.60s.

From the first equation, b equals four minus two a. Substitute that into the second: a plus two times, four minus two a, equals five. Expand: a plus eight minus four a. That's eight minus three a, equals five. So three a equals three, and a equals one. Then b is four minus two, which is two.

### Shot 029

Visual: s04_span:8, 125.60–143.93s.

Now let's walk the recipe. Dial a up to one: one step along u takes us to two, one. Now dial b up to two: two steps along v, to three, three, and then to four, five. We land exactly on the target. In coordinates, two plus two is four, and one plus four is five.

### Shot 030

Visual: s04_span:9, 143.93–157.20s.

Now step back. Instead of asking about one target, ask about all of them. The span of a list of vectors is the set of all its linear combinations. Every recipe you could write down, so every point you can reach.

### Shot 031

Visual: s04_span:13, 210.13–226.00s.

Let's watch that happen for u and v. First let both coefficients range only between minus one and one. The reachable region is a small parallelogram around the origin. Now let them range up to two: a bigger parallelogram, with the same shape.

### Shot 032

Visual: s04_span:14, 226.00–239.13s.

Keep widening the range, and the parallelogram swallows more and more of the plane. Let a and b run over all the real numbers, and nothing is left out. The span of u and v is the whole plane, R two.

### Shot 033

Visual: s04_span:15, 239.13–252.73s.

Now let's break it. Keep u, but replace v by v prime equals minus four, minus two. Look closely: that's exactly minus two times u. Watch the parallelogram as v swings around onto u's line.

### Shot 034

Visual: s04_span:16, 252.73–263.03s.

It gets thinner and thinner, and then it flattens into a segment. That flattening is the single most important degeneracy in this whole subject. Keep an eye out for it.

### Shot 035

Visual: s04_span:17, 263.03–282.47s.

Here's the algebra. Any combination a u plus b v prime is a u minus two b u, which is a minus two b, times u. Whatever recipe you choose, you get a multiple of u. So the span is the set of multiples t times two, one: the line y equals x over two. Two thrusters, but both on the same rail.

### Shot 036

Visual: s04_span:18, 282.47–297.23s.

Can we still reach four, five? We'd need t times two, one, to equal four, five. That means two t equals four, so t is two, and also t equals five, at the same time. Impossible. The target is off the line, and out of reach.

### Shot 037

Visual: s04_span:19, 297.23–312.27s.

What about six, three? That's three u, so it's on the line. And now it can be reached in many ways. Any a and b with a minus two b equal to three will do: three and zero, one and minus one, minus one and minus two, and infinitely many more.

### Shot 038

Visual: s04_span:20, 312.27–326.47s.

Notice what changed. Once the two moves lay on the same line, some destinations became impossible, and reachable destinations acquired many different recipes. The loss of a direction shows up both in the territory we can reach and in the settings that describe it.

### Shot 039

Visual: s04_span:21, 326.47–339.53s.

Now go up a dimension. In R three, take a equals one, zero, one, and b equals zero, one, one. Our boat has become a drone with two thrusters, flying in three dimensions. Where can it get to?

### Shot 040

Visual: s04_span:22, 339.53–352.90s.

A general combination is s times one, zero, one, plus t times zero, one, one, which is the vector s, t, s plus t. Look at the pattern: the third coordinate is always the sum of the first two.

### Shot 041

Visual: s04_span:23, 352.90–371.47s.

And conversely, any vector x, y, x plus y, equals x times a plus y times b. So the span is exactly the plane z equals x plus y: a tilted sheet through the origin. Two free parameters, s and t, so it's a plane, even though each point has three coordinates.

### Shot 042

Visual: s04_span:24, 371.47–386.23s.

Is two, three, five on it? The first two coordinates force s equals two and t equals three. Then the third coordinate has to be two plus three, which is five. It checks. Two steps along a, three along b, and the drone arrives.

### Shot 043

Visual: s04_span:25, 386.23–402.77s.

What about one, one, one? The first two coordinates force s and t to both be one, and then the third coordinate would have to be two, not one. So one, one, one is off the plane. It sits directly below the plane point one, one, two, and no recipe reaches it.

## When another direction adds nothing

### Shot 044

Visual: third.

Remember the third control from the opening? Its arrow was the sum of the first two. We can replace one use of that control by one use of each original control. So it adds a new way to travel, without adding a new destination. Let's see how to recognise that redundancy even when a picture is hard to draw.

### Shot 045

Visual: zero.

Here is why zero is the right place to look. One blue move and two gold moves reaches our target. So does one gold move and one purple move, because purple is blue plus gold. Subtract the settings. Blue plus gold minus purple produces zero. Two descriptions of one destination have become a nontrivial way to return home.

### Shot 046

Visual: zero_family.

And it works in reverse. Start with any recipe, then add a multiple of this zero-producing recipe. The destination cannot change, because we added zero. But the settings do change. That is the connection to remember: redundancy, multiple representations, and a nontrivial combination equal to zero are different views of the same problem.

Thinking pause: 3 seconds.

### Shot 047

Visual: s05_independence:3, 49.03–65.43s.

Here's the trick: hunt for a zero recipe. Take v one equals one, one, zero, v two equals zero, one, one, and v three equals one, three, two. Is there a way to combine them and land back at the origin, without making all the coefficients zero?

### Shot 048

Visual: s05_independence:4, 65.43–78.83s.

All zeros always works: do nothing, and you stay home. That's the trivial recipe, and it tells us nothing. We want a non-trivial one: an actual trip, using real moves, that loops back to where it started.

### Shot 049

Visual: s05_independence:5, 78.83–97.43s.

Write c one v one plus c two v two plus c three v three equals zero, one coordinate at a time. First coordinates: c one plus c three equals zero. Second: c one plus c two plus three c three equals zero. Third: c two plus two c three equals zero.

### Shot 050

Visual: s05_independence:6, 97.43–116.53s.

The first equation gives c one equals minus c three. The third gives c two equals minus two c three. Substitute both into the second: minus c three, minus two c three, plus three c three. That's zero, no matter what c three is. The equation holds for every value of c three.

### Shot 051

Visual: s05_independence:7, 116.53–133.13s.

So we're free to choose. Take c three equals one. Then c one is minus one and c two is minus two. The recipe minus v one, minus two v two, plus v three, gives zero. Rearranged: v three equals v one plus two v two.

### Shot 052

Visual: s05_independence:8, 133.13–149.83s.

Here's what that looks like. v one and v two span a plane, shown in purple. Walk along v one, then twice along v two. The path never leaves the plane, and it ends exactly at v three. The third arrow adds no new direction. It's the redundant thruster.

### Shot 053

Visual: s05_independence:9, 149.83–164.83s.

Now replace v three by two, two, three, and hunt again. The equations become: c one plus two c three equals zero. c one plus c two plus two c three equals zero. And c two plus three c three equals zero.

### Shot 054

Visual: s05_independence:10, 164.83–179.70s.

Subtract the first equation from the second, and c two equals zero. Then the third says three c three equals zero, so c three is zero. And the first gives c one equals zero. Only the all-zero recipe reaches zero.

### Shot 055

Visual: s05_independence:11, 179.70–189.33s.

In the picture, the new arrow rises out of the plane. It sits three units above the plane point two, two, zero. So it adds a genuinely new direction.

### Shot 056

Visual: s05_independence:12, 189.33–211.17s.

Now we can say it precisely. A list v one through v k is linearly independent if the only solution of c one v one plus and so on plus c k v k equals zero, is all the c's equal to zero. Otherwise it's linearly dependent, and any solution with some c i not zero is called a dependency relation.

### Shot 057

Visual: s05_independence:15, 248.47–266.07s.

We can now connect three descriptions of redundancy. A nontrivial combination gives zero. Some vector can be made from the others. And removing that vector leaves the reachable territory unchanged. These statements are equivalent. The picture suggests why; one short rearrangement makes the connection precise.

### Shot 058

Visual: s05_independence:16, 266.07–283.20s.

Start with a combination equal to zero in which at least one coefficient is nonzero. Pick a vector with a nonzero coefficient. We can solve for that vector using all the others. This is the step that turns a cancellation into evidence of redundancy.

### Shot 059

Visual: s05_independence:17, 283.20–303.07s.

One implies two. Start with a dependency relation: the sum of c i v i equals zero, with not all c's zero. Here's the key move: choose an index j where c j is not zero. Then move every other term to the other side: c j v j equals minus the sum of the other c i v i.

### Shot 060

Visual: s05_independence:18, 303.07–325.47s.

Because c j is not zero, we're allowed to divide by it. So v j equals the sum, over i not equal to j, of minus c i over c j, times v i. That writes v j as a combination of the others, which is statement two. And that's why we needed a nonzero coefficient: you can't solve for a vector whose coefficient is zero.

### Shot 061

Visual: s05_independence:22, 400.83–421.43s.

Some vector is redundant; that does not mean every vector can be discarded. In the list one, zero; zero, one; and zero, two, the last two directions can replace each other. But remove one, zero and you lose every move with a nonzero horizontal component. Redundancy belongs to the list, with a particular relation showing which vectors participate.

### Shot 062

Visual: s05_independence:38, 725.80–745.63s.

One warning. Independence is a property of the whole list, not of its pairs. The smallest example: one, zero, then zero, one, then one, one. No two of them are parallel, so every pair is independent. Yet one, zero plus zero, one, minus one, one, is zero. Checking pairs is not enough.

## A destination, exactly one address

### Shot 063

Visual: basis.

We want to use the controls as an address system. Every destination should have an address, and each should have only one. Reaching everything is one requirement. Avoiding redundant controls is the other. Put those together and we get a basis. To see why the address depends on our choice, imagine changing the grid while keeping the place fixed.

### Shot 064

Visual: s08_basis:1, 14.90–28.27s.

Start with a city. If you tell a friend, walk three blocks east and two blocks north, you've given them an address. That only works because the city has a street grid: two directions of streets, and a fixed block length along each.

### Shot 065

Visual: s08_basis:2, 28.27–40.77s.

Our usual coordinates are exactly that kind of address. The streets run along e one and e two, and the point four, five means: four blocks along e one, then five blocks along e two.

### Shot 066

Visual: s08_basis:3, 40.77–53.97s.

But nothing forces the streets to meet at right angles. Picture a city whose streets run along b one, equals two, one, and b two, equals minus one, one. Watch the whole street grid shear into place.

### Shot 067

Visual: s08_basis:4, 53.97–60.60s.

Now give directions in this new city. Walk three blocks along b one. Then two blocks along b two.

### Shot 068

Visual: s08_basis:5, 60.60–74.50s.

We land on the very same point, four, five. The place didn't move. Only its address changed: in the standard city it's four, five; in the skewed city it's three, two. The address depends on the grid. The place does not.

### Shot 069

Visual: s08_basis:6, 74.50–91.57s.

How would we find that address without counting cells? We want c one times two, one, plus c two times minus one, one, to equal four, five. Match the first entries: two c one minus c two equals four. Match the second: c one plus c two equals five.

### Shot 070

Visual: s08_basis:7, 91.57–107.33s.

Add the two equations, and c two cancels: three c one equals nine. So c one is three, and then c two is two. Check: three times two, one is six, three. Two times minus one, one is minus two, two. Together, four, five.

### Shot 071

Visual: s08_basis:8, 107.33–113.60s.

So what made this grid work as a coordinate system? Two things, and they're the two ideas we already have.

### Shot 072

Visual: s08_basis:9, 113.60–134.23s.

A basis is an ordered list of vectors that spans the space and is linearly independent. Spanning means every destination has an address. Independence means no destination gets two different addresses. Both conditions matter: too few directions leave places unreachable, while redundant directions make the description ambiguous.

### Shot 073

Visual: s08_basis:10, 134.23–147.27s.

Here is the precise connection. A list is a basis exactly when every vector has one and only one representation using that list. This is worth proving, because the proof tells us why the condition about zero controls all the other destinations too.

### Shot 074

Visual: s08_basis:11, 147.27–154.07s.

Forward direction first. Existence is free: B spans V, so every v has at least one recipe.

### Shot 075

Visual: s08_basis:12, 154.07–168.90s.

Uniqueness. Suppose v had two recipes, the c's and the d's. Subtract one from the other. The left side becomes v minus v, which is zero. The right side becomes the sum of c i minus d i, times b i.

### Shot 076

Visual: s08_basis:13, 168.90–190.50s.

That's a combination of the b's that equals zero. Independence says the only such combination is the trivial one, so every c i minus d i is zero, and the two recipes were the same all along. In the city picture: two different addresses for one place would give you a round trip with nonzero steps, and independence forbids exactly that.

### Shot 077

Visual: s08_basis:14, 190.50–197.60s.

Now the backward direction. If every v has a representation, that is literally the statement that B spans V.

### Shot 078

Visual: s08_basis:15, 197.60–216.27s.

For independence, look at the zero vector. It already has one recipe: all coefficients zero. If c one b one plus up to c n b n equals zero, that's a recipe for zero too, and uniqueness says it must be the all-zeros one. So every c i is zero. That's independence.

### Shot 079

Visual: s08_basis:16, 216.27–227.13s.

The list of coefficients, c one through c n, is called the coordinate vector of v with respect to B, written v in square brackets, sub B. For our point, it's three, two.

### Shot 080

Visual: s08_basis:17, 227.13–238.90s.

The order matters. Swap b one and b two, and the address swaps to two, three. Same place, same streets; you just read the street names in the other order. That's why we say ordered basis.

### Shot 081

Visual: s08_basis:18, 238.90–252.67s.

And here's something easy to forget. The standard basis is also a choice. The list three, minus one is already a coordinate vector, with respect to e one, e two. It's so convenient that we stop noticing we picked it.

### Shot 082

Visual: s08_basis:28, 372.60–391.30s.

How would you build a basis from a large collection of controls? Keep a direction when it expands the territory you can reach. Discard it when the directions already kept can reproduce it. Starting with a spanning list, this removes redundancy without losing a single destination.

### Shot 083

Visual: s08_basis:29, 391.30–399.23s.

Try it on the list one, one; two, two; one, zero; zero, one, which spans the plane. Keep one, one. Its span is a line.

### Shot 084

Visual: s08_basis:30, 399.23–403.30s.

Two, two is twice one, one. It's already on that line, so delete it.

### Shot 085

Visual: s08_basis:31, 403.30–408.90s.

One, zero is not a multiple of one, one. Keep it, and now the span is the whole plane.

### Shot 086

Visual: s08_basis:32, 408.90–416.57s.

And zero, one is one, one minus one, zero. Already reachable: delete it. The basis is one, one and one, zero.

### Shot 087

Visual: s08_basis:33, 416.57–429.93s.

Why does this always work? Each deleted vector is a combination of vectors we kept. So throwing it out can't shrink the span: anywhere it was used, substitute its recipe instead. The survivors still span V.

### Shot 088

Visual: s08_basis:34, 429.93–446.97s.

And the survivors are independent. If a kept direction could be built from the earlier kept directions, we would have discarded it. Every kept direction added something new, and every discarded direction is still reproducible. That gives us both independence and spanning.

### Shot 089

Visual: s08_basis:35, 446.97–467.70s.

You can also start with independent directions and add more until they span the space. Each time you find a direction outside the current span, keep it. In our movement picture, attach another control only when it opens up new territory. Stop when the whole space is reachable.

### Shot 090

Visual: s08_basis:36, 467.70–487.80s.

Why does adding an outside direction preserve independence? A cancellation involving it with a nonzero coefficient would express it using the old directions. That contradicts being outside their span. Once the construction reaches everything, the resulting list is a basis.

## Why dimension is a real constraint

### Shot 091

Visual: dimension.

You can choose many different bases. But can you choose their size? Could two independent controls be enough for one description of the plane, while three independent controls were needed for another? If dimension is going to mean anything, the number must belong to the space rather than to the particular arrows we picked.

Thinking pause: 3 seconds.

### Shot 092

Visual: s06_exchange:5, 94.73–107.93s.

Now the main question. Picture a game of musical chairs. A spanning list is a row of seats, here three of them, occupied by w one, w two and w three. Together they span the space.

### Shot 093

Visual: s06_exchange:6, 107.93–124.53s.

Independent vectors are guests who arrive one at a time. When a guest sits down, one of the w's has to stand up, and the row must still span the whole space. Here's the rule that makes it work: the one who stands up is always a w, never a guest who already has a seat.

### Shot 094

Visual: s06_exchange:7, 124.53–144.07s.

So with three seats, at most three guests can ever sit. If a fourth independent guest arrived, there would be no w left to give up a seat. That's the whole theorem in one picture. Where the analogy stretches: in real musical chairs anyone can lose. Here the math decides exactly who stands up, as we'll see.

### Shot 095

Visual: s06_exchange:8, 144.07–161.33s.

Let's run it with real vectors. In R three, take the independent list u one equals one, one, zero and u two equals zero, one, one. Our spanning list is the standard basis, so w one is e one, w two is e two, and w three is e three.

### Shot 096

Visual: s06_exchange:9, 161.33–182.57s.

Insert the first new vector at the front. It already lies in the span of the old list, so the longer list has a redundancy. Scan from left to right for a vector that can be built from earlier ones. Replacing that vector preserves every destination the list could reach.

### Shot 097

Visual: s06_exchange:10, 182.57–187.90s.

Is it u one? Nothing comes before it, so it would have to be the zero vector. It isn't.

### Shot 098

Visual: s06_exchange:11, 187.90–198.10s.

Is it w one? Before it there's only u one, so w one would have to be a multiple of one, one, zero. One, zero, zero is not. Keep going.

### Shot 099

Visual: s06_exchange:12, 198.10–208.57s.

Is it w two? Yes. w two equals u one minus w one: one, one, zero, minus one, zero, zero, gives zero, one, zero. Found it.

### Shot 100

Visual: s06_exchange:13, 208.57–220.83s.

Remove the second standard direction. We have just written it using the other vectors, so every old recipe can be rewritten without it. The first new direction has taken its place. The list still contains three vectors, and it still spans the whole three-dimensional space.

### Shot 101

Visual: s06_exchange:14, 220.83–234.67s.

Step two. Insert u two right after u one: u one, u two, w one, w three. Scan again. Is u two in the span of u one? No, zero, one, one is not a multiple of one, one, zero.

### Shot 102

Visual: s06_exchange:15, 234.67–254.07s.

Is w one in the span of u one and u two? We'd need a times one, one, zero, plus b times zero, one, one. That's a, a plus b, b, and it should equal one, zero, zero. The first entry forces a equals one, the last forces b equals zero, and then the middle entry is one, not zero. So no.

### Shot 103

Visual: s06_exchange:16, 254.07–273.40s.

Is w three in the span of u one, u two and w one? Now we need a plus c, a plus b, b, to equal zero, zero, one. The last entry says b is one, the middle then says a is minus one, and the first says c is one. Yes: w three equals minus u one, plus u two, plus w one.

### Shot 104

Visual: s06_exchange:17, 273.40–292.20s.

Remove w three. The list u one, u two, w one still spans R three. Look at the history: the list length never changed, the list always spanned, and each u pushed out exactly one w. If there had been more u's than w's, some step would have found no w left to push out.

### Shot 105

Visual: s06_exchange:18, 292.20–309.00s.

The general result is called the exchange lemma. An independent list cannot be longer than a spanning list. One at a time, independent directions can replace old generators while preserving the span. Independence prevents a new direction from being redundant with the new directions already inserted, so each step must replace an old generator. There are only so many old generators to replace.

### Shot 106

Visual: s08_basis:40, 526.50–536.07s.

Now apply that counting result to two different bases of the same space. Each basis is independent and each spans. That combination forces their lengths to agree. The number is a property of the space, even though the arrows themselves can be chosen in many different ways.

### Shot 107

Visual: s08_basis:41, 536.07–555.20s.

Take two bases, B and B prime. B is independent and B prime spans, so the exchange lemma says the length of B is at most the length of B prime: B's vectors can't take more seats than B prime provides. Now swap their roles, and you get the reverse inequality. So the lengths are equal.

### Shot 108

Visual: s08_basis:42, 555.20–574.73s.

That common length is the dimension of V. So R n has dimension n, thanks to the standard basis. The polynomials of degree at most m have dimension m plus one, with basis one, x, x squared, up to x to the m. And the zero space has dimension zero: its basis is the empty list.

### Shot 109

Visual: s08_basis:43, 574.73–587.87s.

Once the dimension is known, an independent list of that length is automatically a basis. So is a spanning list of that length. A list that already uses all the independent directions has no room to gain another; a spanning list of the right size has no room for redundancy.

### Shot 110

Visual: s08_basis:44, 587.87–606.87s.

To see why, extend an independent list to a basis. Since the list already has the dimension's number of vectors, nothing can be added. Or shrink a spanning list to a basis. The final size must be that same number, so nothing can be removed. The two requirements meet at exactly the basis size.

## A world that keeps its own rules

### Shot 111

Visual: subspace.

So far we have described spaces by their generators: which arrows can build them? Now reverse the viewpoint. Someone hands you a set of points and asks whether it behaves like a self-contained world of moves. Can you add its members, reverse them, and scale them without falling outside? That is the question a subspace answers.

### Shot 112

Visual: s07_subspaces:3, 44.87–61.47s.

Let's test four sets in the plane. First, the line y equals three x. Take two points on it and add them: the sum lands back on the line. Now scale one of them, say by minus two. Still on the line. Sums and multiples stay inside. This one is a club.

### Shot 113

Visual: s07_subspaces:4, 61.47–79.27s.

Second, the line y equals three x plus one. Same slope, shifted up by one. It looks just as straight, but it misses the origin. Home base isn't there. And watch what happens to a sum of two of its points: it lands on the line y equals three x plus two. It falls off.

### Shot 114

Visual: s07_subspaces:5, 79.27–96.83s.

Third, the half-plane where x is at least zero. The origin is in. Sums are fine, because two nonnegative x's add to a nonnegative x. But take a member v and flip it. Minus v escapes to the left side. The set is not closed under scaling by minus one.

### Shot 115

Visual: s07_subspaces:6, 96.83–109.83s.

Fourth, the two axes together. The origin is in, and multiples stay on their own axis. But one, zero plus zero, one is one, one, which lies on neither axis. Not closed under addition.

### Shot 116

Visual: s07_subspaces:7, 109.83–119.40s.

The counterexamples expose three different failures. The shifted line misses zero. The half-plane loses members when we reverse them. The union of the axes loses members when we add them. A set can pass one or two checks and still fail to be a subspace.

### Shot 117

Visual: s07_subspaces:8, 119.40–133.63s.

A subspace is a subset that remains a vector space under the same addition and scaling as the surrounding space. We don't have to recheck every algebraic identity from scratch. We need to check that our chosen world contains zero and that the operations keep us inside it.

### Shot 118

Visual: s07_subspaces:9, 133.63–153.30s.

Y is a subspace if and only if three things hold. One: the zero vector is in Y. Two: Y is closed under addition. If u and w are in Y, so is u plus w. Three: Y is closed under scaling. If w is in Y and c is any real number, then c w is in Y.

### Shot 119

Visual: s07_subspaces:10, 153.30–165.30s.

Why do those checks suffice? The surrounding space already supplies identities such as commuting and regrouping sums. Those identities still hold for members of the smaller set. The question is whether adding and scaling those members produces another member of that set.

### Shot 120

Visual: s07_subspaces:11, 165.30–180.67s.

So the algebraic rules are inherited. The closure checks ensure we can actually perform the operations inside the subset. That distinction matters: a set might contain familiar vectors and still fail to contain their sums, as the two axes just showed.

### Shot 121

Visual: s07_subspaces:12, 180.67–198.20s.

Zero is present by the first check. And every member has its negative, because multiplying by minus one stays inside. We have kept both a home position and an undo for every move. Together with closure and the inherited identities, that gives a vector space.

### Shot 122

Visual: s07_subspaces:14, 222.30–231.53s.

A worked example. Let Y be the set of points x, y, z in R three with x plus two y minus z equal to zero. Run the test.

### Shot 123

Visual: s07_subspaces:15, 231.53–254.13s.

Zero: zero plus zero minus zero is zero, so the origin is in. Addition: suppose x plus two y minus z is zero, and x prime plus two y prime minus z prime is zero. Add the two equations, and group: x plus x prime, plus two times y plus y prime, minus z plus z prime, equals zero. So the sum is in Y.

### Shot 124

Visual: s07_subspaces:16, 254.13–274.60s.

Scaling: multiply x plus two y minus z equals zero by c. You get c x plus two times c y minus c z equals zero, so the scaled vector is in Y. Y is a subspace. Notice that the zero on the right-hand side does all the work: zero plus zero is zero, and c times zero is zero.

### Shot 125

Visual: s07_subspaces:17, 274.60–297.17s.

Now with numbers. u equals one, zero, one is in Y, since one plus zero minus one is zero. w equals zero, one, two is in Y, since zero plus two minus two is zero. Their sum, one, one, three: one plus two minus three, zero. And minus three u, which is minus three, zero, minus three: minus three plus zero plus three, zero. Every check lands.

### Shot 126

Visual: s07_subspaces:18, 297.17–316.37s.

The same set is also a span. Solve the equation for z: z equals x plus two y. So every member looks like x, y, x plus two y, which is x times one, zero, one, plus y times zero, one, two. Y is the span of those two vectors: a plane through the origin.

### Shot 127

Visual: s07_subspaces:21, 349.27–362.63s.

A span is a subspace, and it is the smallest subspace containing its generators. This is what makes reachable territory such a useful picture. The generators force their scaled versions to be present, and addition forces every combination to be present too.

### Shot 128

Visual: s07_subspaces:22, 362.63–385.47s.

The span contains zero: choose every coefficient to be zero. Add two recipes and you add their coefficients, producing another recipe. Scale a recipe and you scale its coefficients. Neither operation can escape the span, so the span is a subspace.

### Shot 129

Visual: s07_subspaces:23, 385.47–408.80s.

Part two: it's the smallest. Suppose a subspace U contains each v i. By scaling, U contains each c i v i. Then by adding one term at a time, U contains c one v one plus c two v two, then the next partial sum, and so on, so it contains every combination. And the empty list's span, just zero, is inside every subspace by condition one.

### Shot 130

Visual: s07_subspaces:24, 408.80–425.03s.

In finite dimensions, we can describe the same object as a subspace or as the span of a basis. Subspace emphasises the closed world of moves. Span emphasises the particular generators that build that world. Neither description requires us to use every coordinate direction in the ambient space.

### Shot 131

Visual: s07_subspaces:25, 425.03–439.23s.

Intersections also preserve this structure. The vectors that belong to each of two subspaces form a subspace of their own. Here two planes through the origin meet along a line through the origin. That shared line is their intersection.

### Shot 132

Visual: s07_subspaces:26, 439.23–460.97s.

Zero belongs to both subspaces. If two vectors belong to both, their sum belongs to each subspace and hence to the intersection. The same holds for a scaled vector. The shared set therefore keeps all three properties: zero, closure under addition, and closure under scaling.

### Shot 133

Visual: functions.

Notice what our reasoning used. We added objects, scaled them, regrouped sums, and cancelled a move with its opposite. We never needed the objects to be little arrows. This is why linear algebra also applies to functions and polynomials. The shared rules, called vector-space axioms, let one argument work in several settings.

### Shot 134

Visual: s02_axioms:1, 17.83–32.17s.

Here's a helpful way to think about it. In chess, a knight isn't a particular lump of carved wood. A bottle cap or a coin can be a knight, as long as it moves like a knight. The rules of the game define the piece, not what it's made of.

### Shot 135

Visual: s02_axioms:2, 32.17–49.87s.

Vectors work the same way. The precise answer to the question, what is a vector, is: a member of a vector space. That's a set whose addition and scaling obey eight rules. Arrows, lists and functions all obey them, so they're all vectors. In this unit, the scalars are real numbers.

### Shot 136

Visual: s02_axioms:15, 225.53–237.17s.

Lists in R n aren't the only things that play by these rules. Take three by three matrices, with the usual operations: add them entry by entry, and scale them entry by entry.

### Shot 137

Visual: s02_axioms:16, 237.17–250.57s.

Or take real functions on the interval from zero to one. Add them value by value: at each point, the height of f plus g is the height of f stacked on the height of g. Scaling works point by point too.

### Shot 138

Visual: s02_axioms:17, 250.57–266.37s.

In each case, the eight axioms boil down to the same facts about ordinary real numbers, checked one entry, or one point, at a time. And here's the payoff: every theorem in this unit applies to all of them. Prove it once, use it everywhere.

### Shot 139

Visual: s02_axioms:18, 266.37–283.23s.

Let's work through one carefully. Let P two be the polynomials of degree at most two: a nought, plus a one x, plus a two x squared, with real coefficients. Think of each polynomial as a recipe of three numbers: how much constant, how much x, how much x squared.

### Shot 140

Visual: s02_axioms:19, 283.23–303.93s.

First: are the operations even allowed? Add two of them and you add coefficient by coefficient: a nought plus b nought, then a one plus b one, then a two plus b two. Multiply by c, and every coefficient gets multiplied by c. Either way you get a polynomial of degree at most two. Both operations stay inside the set.

### Shot 141

Visual: s02_axioms:20, 303.93–312.73s.

The zero polynomial plays the role of the zero vector. And minus a nought, minus a one x, minus a two x squared is the inverse.

### Shot 142

Visual: s02_axioms:21, 312.73–333.93s.

For example, scaling a polynomial by a plus b is the same as adding a times that polynomial to b times that polynomial. Check any coefficient: ordinary distributivity of real numbers makes the two sides equal. The abstract rule is just the familiar numerical rule applied consistently to every coefficient.

## Combining worlds without double counting

### Shot 143

Visual: sum.

Now give our craft two different sets of allowed moves. One set reaches a world called U, the other a world called Y. Using both means taking a move from U and adding a move from Y. We want to know the combined territory, and whether a destination has a unique split between the two worlds.

### Shot 144

Visual: s09_sums:4, 63.60–81.60s.

Let's split an actual vector. Let U be the span of one, one, zero and zero, one, one. That's a plane in R three. Let Y be the span of one, zero, one. That's a line. We want to split x equals three, four, five as u plus w, with u in U and w in Y.

### Shot 145

Visual: s09_sums:5, 81.60–96.23s.

In coordinates, we need a times one, one, zero, plus b times zero, one, one, plus c times one, zero, one, to equal three, four, five. Matching entries: a plus c is three. a plus b is four. b plus c is five.

### Shot 146

Visual: s09_sums:6, 96.23–112.50s.

Here's a neat trick. Add all three equations. Each unknown appears exactly twice, so two times a plus b plus c equals twelve, and a plus b plus c is six. Now subtract each equation from that total. b is three, c is two, and a is one.

### Shot 147

Visual: s09_sums:7, 112.50–132.47s.

So u is one times one, one, zero plus three times zero, one, one, which is one, four, three. And w is two times one, zero, one, which is two, zero, two. Add them: three, four, five. In the picture, x is the far corner of a parallelogram, with one side in the plane and one side along the line.

### Shot 148

Visual: s09_sums:8, 132.47–154.80s.

Is the split unique? A vector on the line Y is t, zero, t. A vector in the plane U has the form a, a plus b, b. Equating them forces a and b both to equal t, but their sum must be zero. So t is zero. The two worlds share only the zero vector, which will be the key to uniqueness.

### Shot 149

Visual: s09_sums:9, 154.80–165.93s.

The sum of U and Y consists of all moves u plus w, where u belongs to U and w belongs to Y. It is the combined territory available when we can use either world's directions. It contains more than the union: adding a move from each can reach points belonging to neither world separately.

### Shot 150

Visual: s09_sums:10, 165.93–185.03s.

The sum is the smallest subspace containing both original subspaces. If one is generated by a list of u vectors and the other by a list of w vectors, the combined list generates their sum. All we have done is allow both sets of moves on the same control panel.

### Shot 151

Visual: s09_sums:11, 185.03–205.00s.

Proof. Zero is zero plus zero. Adding two splits, u plus w, plus u prime plus w prime, regroups as u plus u prime, plus w plus w prime: still a piece from U plus a piece from Y. And c times u plus w is c u plus c w. So U plus Y is a subspace.

### Shot 152

Visual: s09_sums:12, 205.00–222.30s.

It contains U, because u is u plus zero. It contains Y, because w is zero plus w. And any subspace that contains both U and Y must contain every u plus w, by closure under addition. So U plus Y is the smallest.

### Shot 153

Visual: s09_sums:13, 222.30–238.37s.

For the spans: a combination of all the generators splits into a combination of the u's, which lands in U, plus a combination of the w's, which lands in Y. And conversely, any u plus w is a combination of all the generators.

### Shot 154

Visual: s09_sums:14, 238.37–249.77s.

The sum is called direct when each destination has exactly one split into a piece from U and a piece from Y. Notice what is being claimed: uniqueness of the two component vectors. It does not require us to have already chosen coordinates for each component.

### Shot 155

Visual: s09_sums:15, 249.77–259.63s.

A direct sum is exactly a sum whose two subspaces share only zero. Overlap creates freedom to trade a shared move from one component to the other. Without a nonzero shared move, that trade is impossible, so the split is unique.

### Shot 156

Visual: s09_sums:16, 259.63–282.13s.

Forward direction. Take any x in the overlap. Then x equals x plus zero, with x in U and zero in Y. But x also equals zero plus x, with zero in U and x in Y. Two splittings of the same vector. Uniqueness says they're the same, so x is zero. That's the slack from the payment picture: money in the overlap could come from either account.

### Shot 157

Visual: s09_sums:17, 282.13–304.60s.

Backward. Suppose u plus w equals u prime plus w prime. Rearrange: u minus u prime equals w prime minus w. The left side lives in U. The right side lives in Y. So this one vector lives in both; it's in the overlap, which is just zero. So u equals u prime, and w equals w prime. The split was unique.

### Shot 158

Visual: s09_sums:18, 304.60–323.30s.

The dimension of the combined space is the dimension of U plus the dimension of Y, minus the dimension of their intersection. The shared directions were counted in both spaces, so we subtract their dimension once. Watch two overlapping planes make the formula visible.

### Shot 159

Visual: s09_sums:26, 438.40–455.40s.

Now take the plane z equals zero and the plane x equals zero. They share the y axis. Their sum has dimension two plus two minus one, which is three. Together the planes generate all three-dimensional space, but the shared direction gives us freedom in how we divide a destination between them.

### Shot 160

Visual: s09_sums:27, 455.40–472.27s.

But the sum is not direct. Take the vector one, two, three. Split it as one, two, zero, plus zero, zero, three. Or as one, zero, zero, plus zero, two, three. Watch the y part slide from one account to the other. That's the slack the overlap creates.

### Shot 161

Visual: s09_sums:28, 472.27–484.27s.

Compare our first example: the dimension of U plus Y is two plus one minus zero, which is three. So R three is U direct sum Y, and every vector has exactly one split.

### Shot 162

Visual: s09_sums:29, 484.27–497.43s.

Two consequences are worth keeping. First, a sum is direct exactly when the dimension of U plus Y equals the dimension of U plus the dimension of Y. No overlap, nothing to subtract.

### Shot 163

Visual: s09_sums:30, 497.43–516.27s.

Second, inside R n, U plus Y has dimension at most n. So the overlap has dimension at least dim U plus dim Y minus n. For two planes through the origin in R three, that's two plus two minus three, which is one. However you tilt them, two planes always share at least a line.

## What changes when home moves?

### Shot 164

Visual: affine.

Every reachable world we built started at home. What if home moves? Imagine shifting an entire line without turning it. The allowed differences between points stay the same, but the location changes. We need to distinguish the directions a set contains from where that set happens to sit.

### Shot 165

Visual: s12_affine:3, 45.70–55.93s.

Now in the plane. Here is the subspace S, the span of minus one, one. It's the dashed line x plus y equals zero, and it runs through the origin.

### Shot 166

Visual: s12_affine:4, 55.93–68.60s.

Slide the whole line over by the vector p equals one, zero. Every point moves by the same displacement, so the line keeps its direction. It lands exactly on x plus y equals one.

### Shot 167

Visual: s12_affine:5, 68.60–85.67s.

An affine set is a translated subspace: an anchor point plus every vector in a subspace S. Its directions come from S; the anchor sets its location. If the anchor lies in S, translating changes nothing. A translate that genuinely misses the origin is affine but is not itself a linear subspace.

### Shot 168

Visual: s12_affine:6, 85.67–103.77s.

For our line, take the anchor x naught equals one, zero, and S the span of minus one, one. Then every point is one, zero, plus t times minus one, one. That's the point one minus t, t. Watch t carry the point along the line, and notice its coordinates always add to one.

### Shot 169

Visual: s12_affine:7, 103.77–112.03s.

The affine dimension is the dimension of S. Here, that's one. The anchor tells you where the set sits. It adds no dimension.

### Shot 170

Visual: s12_affine:8, 112.03–132.37s.

Notice the two lines are parallel. The solid one is just the dashed one, slid over by p. Take two points on the solid line, p equals one, zero, and q equals zero, one. Their difference, q minus p, is minus one, one. Slide that arrow to the origin, and it lies right along the dashed line. It's in S.

### Shot 171

Visual: s12_affine:10, 144.73–165.13s.

Subtract two points on the translated line. Both contain the same anchor, so it cancels. What remains is the difference of two vectors in S, which stays in S. You can also choose a different anchor on the line: its extra displacement is absorbed into S, leaving the same affine set.

### Shot 172

Visual: s12_affine:11, 165.13–172.30s.

Now a worked example. Which averages stay on the line? Both p and q lie on x plus y equals one.

### Shot 173

Visual: s12_affine:12, 172.30–180.90s.

Add these two location vectors and the result is one, one. Its coordinates add to two rather than one, so it lies on a different parallel line. The translated set is not closed under addition. The sum has counted the anchor twice.

### Shot 174

Visual: s12_affine:13, 180.90–190.07s.

Now take their midpoint. Half of each point gives one half, one half. Those coordinates add to one, so the midpoint stays on the original line. The two half-sized copies of the anchor have combined into exactly one copy.

### Shot 175

Visual: s12_affine:14, 190.07–206.17s.

Let's turn this into a dial. Mix p and q with weights one minus t and t: the point one minus t times p, plus t times q. Whatever t is, the two weights add up to one. Turn the dial, and the point glides along the line. It never leaves.

### Shot 176

Visual: s12_affine:15, 206.17–223.70s.

When t is between zero and one, both weights are nonnegative, and the point stays on the segment between p and q. Those are the genuine averages. Push t past one, or below zero, and one weight turns negative. You're extrapolating, but you are still on the line.

### Shot 177

Visual: s12_affine:16, 223.70–239.03s.

For the general reason, write each point as the common anchor plus a vector in S. Expand a weighted combination of those points. The result separates into the sum of the weights times the anchor, plus a linear combination of vectors in S.

### Shot 178

Visual: s12_affine:17, 239.03–251.50s.

The second part stays in S because S is a subspace. The first part controls the location: how many copies of the anchor have we included? When the weights add to one, we retain precisely the one anchor that places us on the original translated set.

### Shot 179

Visual: s12_affine:18, 251.50–274.53s.

Weights summing to one preserve the affine set. Adding two points gives weights summing to two, which doubles the anchor and can leave that set. Weights summing to zero cancel the anchor altogether, leaving a direction in S. That is why differences between points reveal the underlying directions.

### Shot 180

Visual: s12_affine:19, 274.53–292.77s.

These deserve names. A combination whose coefficients sum to one is called affine. If the coefficients are also nonnegative, it's convex. The set of all affine combinations of some points is their affine span. The set of all convex combinations is their convex hull.

### Shot 181

Visual: s12_affine:20, 292.77–308.10s.

For p and q, that gives three different sets. The affine span is the whole line through them. The convex hull is just the segment between them. And neither is their linear span, which, with no restriction on the coefficients, is all of R two.

### Shot 182

Visual: s12_affine:23, 345.77–364.30s.

Where does this show up in machine learning? Everywhere there's a bias. A layer computes W x plus b. The map from x to W x sends zero to zero, so its outputs form a subspace through the origin. Suppose W squashes the whole plane onto a line. Every output lands on that line.

### Shot 183

Visual: s12_affine:24, 364.30–376.23s.

Adding the bias shifts every output by the same vector. The image is now a translated subspace, an affine set. If the bias lies outside the original image, the translate misses the origin. If it already lies inside, the reachable set stays the same. The location can change without adding any new output direction.

### Shot 184

Visual: s12_affine:25, 376.23–391.77s.

Centring a dataset runs the same move in reverse. Here's a cloud of data points sitting far from the origin. Compute its mean, the centre of the cloud, and subtract it from every point. The whole cloud slides, and its centre lands on home base.

### Shot 185

Visual: s12_affine:26, 391.77–414.93s.

Why bother? Before centring, the location vectors all point from the origin out to the cloud, so their span mostly reflects where the cloud sits. After centring, the vectors point along the ways the data varies around its mean. So centre the data before you interpret its span as variation around the mean. The span of the raw location vectors answers a different question.

## The arrows inside a matrix

### Shot 186

Visual: matrix.

We have been doing matrix multiplication almost the entire time. We just haven't written the controls as a matrix. Put each movement arrow into a column. Put one setting per column into an input list. The output is the sum of the scaled columns: exactly the destination our controls produce.

### Shot 187

Visual: s10_matrices:3, 47.90–63.70s.

Each channel in this picture is one fixed vector, just like a movement control. Put those vectors side by side as the columns of a matrix V. The settings form a coefficient vector c, with one entry per column. Multiplying V by c produces their combined output.

### Shot 188

Visual: s10_matrices:4, 63.70–81.50s.

V times c equals c one v one, plus c two v two, and so on up to c k v k. Matrix times vector is nothing more than a linear combination of the columns. Hold on to that sentence. Everything else in this section is that sentence, applied again and again.

### Shot 189

Visual: s10_matrices:5, 81.50–100.90s.

Here is a desk with two channels that live in the plane: v one is two, one, and v two is minus one, one. Set the faders to two and one. The mix is two v one plus one v two, which lands at three, three. Now sweep the faders, and watch the output arrow roam. Everywhere it can reach is the span of the columns.

### Shot 190

Visual: s10_matrices:6, 100.90–120.23s.

The shape tells us what goes in and what comes out. A matrix with n rows and k columns accepts k coefficients and produces n output coordinates. One coefficient per column, one output entry per row. This is the same movement machine, written compactly.

### Shot 191

Visual: s10_matrices:7, 120.23–135.83s.

Now every question we've asked about vectors becomes a question about this machine. Is w in the span? That asks: is there a fader setting with V c equal to w? Here, for the target one, three, the setting four thirds, five thirds works.

### Shot 192

Visual: s10_matrices:8, 135.83–148.17s.

Are the columns independent? That asks: does V c equal zero have any solution other than all faders at zero? For our two channels, the only way to get silence is to pull everything down.

### Shot 193

Visual: s10_matrices:9, 148.17–167.00s.

But add a third channel, v three equal to one, two, which is just v one plus v two. Now the setting one, one, minus one produces silence with the faders up. Walk along v one, then v two, then back along v three, and you're home. That's what dependence looks like: a channel the others can cancel.

### Shot 194

Visual: s10_matrices:10, 167.00–175.90s.

Is it a basis? Then every vector in the span has exactly one fader setting that makes it. Not zero settings, not two. Exactly one.

### Shot 195

Visual: s10_matrices:11, 175.90–191.70s.

The rank of V is the dimension of its column span. It counts the independent output directions the machine can produce. A basis can be extracted from the columns, so rank is also the largest number of independent columns. Having many columns does not guarantee a large rank.

### Shot 196

Visual: s10_matrices:13, 200.40–218.60s.

First, the product of two matrices. If A is m by n and N is n by p, then A N is m by p, and its j-th column is A times the j-th column of N. Think of N as a stack of fader settings, one per column. A N lists the mixes they produce.

### Shot 197

Visual: s10_matrices:14, 218.60–238.33s.

For example, take A with columns one, zero and one, one, and N with columns two, one and zero, three. The first column of the product is two times one, zero, plus one times one, one, which is three, one. The second column is zero times one, zero, plus three times one, one, which is three, three.

### Shot 198

Visual: s10_matrices:15, 238.33–257.37s.

Next, the transpose. A transpose swaps rows and columns, so one, two over three, four becomes one, three over two, four. A column vector u becomes a row, u transpose, and u transpose v, a row times a column, is a one by one product: the sum of u i times v i.

### Shot 199

Visual: s10_matrices:16, 257.37–278.87s.

The identity matrix I has the standard basis vectors e one through e n as its columns, so I times x is just x. A diagonal matrix has the numbers d one through d n on its diagonal and zeros everywhere else. Diag of two, one stretches the first axis by two and leaves the second alone. Watch the grid.

### Shot 200

Visual: s10_matrices:17, 278.87–294.67s.

Products group freely. A N, times x, equals A times N x. A of x plus y is A x plus A y, and A of c x is c times A x. Those last two hold because adding or scaling fader settings adds or scales the mixes.

### Shot 201

Visual: s10_matrices:18, 294.67–315.93s.

Then the first one follows. A N times x is the sum over j of x j times A n j, where n j is column j of N. Pull the A outside, by those same two rules, and you get A times the sum of x j n j, which is A times N x. This is what will let us read a product of three matrices in either grouping later on.

### Shot 202

Visual: basis.

An address is not a new destination. If the same vector has coordinates c in one basis and d in another, then both recipes must rebuild the same vector. That one observation explains change of coordinates. Watch how equating the two reconstructions leads to the conversion matrix, rather than trying to memorise which inverse goes where.

### Shot 203

Visual: s10_matrices:32, 509.47–519.13s.

Two-dimensional example. Take v equal to three, two. In the standard basis, E, its address is three, two: three blocks east, then two blocks north.

### Shot 204

Visual: s10_matrices:33, 519.13–538.37s.

Now use the basis B, with b one equal to one, zero, and b two equal to one, one. We need gamma one times one, zero, plus gamma two times one, one, to equal three, two. The second coordinates say gamma two is two. The first say gamma one plus gamma two is three, so gamma one is one.

### Shot 205

Visual: s10_matrices:34, 538.37–555.40s.

Watch the street grid shear into the B grid. The house stays exactly where it is; only the streets through it change. In B coordinates its address is one, two: one block along b one, two blocks along b two. Nothing moved. Only the description changed.

### Shot 206

Visual: s10_matrices:35, 555.40–571.87s.

In general, let B and Q be n by n matrices whose columns are two ordered bases of R n. The vector itself must agree in both descriptions: v equals B times its B coordinates, and v also equals Q times its Q coordinates.

### Shot 207

Visual: s10_matrices:36, 571.87–578.57s.

To convert, we need the map that sends v to its Q coordinates. The key fact is that this map is linear.

### Shot 208

Visual: s10_matrices:37, 578.57–596.70s.

Why? Suppose u is the sum of alpha i q i, and v is the sum of beta i q i. Then u plus v is the sum of alpha i plus beta i, times q i, and s v is the sum of s beta i, times q i. Those are valid recipes for u plus v and for s v.

### Shot 209

Visual: s10_matrices:38, 596.70–611.47s.

Coordinates in a basis are unique, so adding two vectors adds their coordinate lists, and scaling a vector scales its coordinates. The coordinate map is linear. Apply that fact to each column and it becomes a matrix, with no need to memorise a conversion rule in advance.

### Shot 210

Visual: s10_matrices:39, 611.47–630.10s.

Now write v as the sum of v j e j: its ordinary entries times the standard basis. Linearity says its Q coordinates are the sum of v j times the Q coordinates of e j. That's a matrix times v: the matrix whose columns are the Q coordinates of e one through e n.

### Shot 211

Visual: s10_matrices:40, 630.10–646.30s.

Call that matrix Q inverse, because it really is one. Q times the Q coordinates of v gives back v, and the Q coordinates of Q d are just d. So Q times Q inverse and Q inverse times Q are both the identity, and Q is invertible.

### Shot 212

Visual: s10_matrices:41, 646.30–664.70s.

Putting it together: the Q coordinates of v equal Q inverse, times B, times the B coordinates of v. Read it right to left. Build the vector from its B recipe, then find its Q recipe. In code you don't form the inverse; you solve Q d equals B times the B coordinates.

### Shot 213

Visual: rank.

This gives us a way to see inside much larger machines. A matrix can have thousands of columns without having thousands of independent output directions. Its rank counts the dimension of the reachable output space. And if the matrix is built by combining only a small list of columns, all its outputs remain in their span.

### Shot 214

Visual: s06_exchange:28, 454.97–475.50s.

Take a weight matrix with seven hundred sixty-eight rows and three thousand seventy-two columns. Each column lives in a seven hundred sixty-eight dimensional output space. At most seven hundred sixty-eight columns can be independent. Thousands of input settings cannot create more independent output directions than the output space has room for.

### Shot 215

Visual: s06_exchange:29, 475.50–490.23s.

This limits independent directions, not the number of labels, concepts, or patterns a model can encode. Many distinct vectors can live in a low-dimensional space. What cannot happen is for more than the dimension's number of fixed directions to be linearly independent.

### Shot 216

Visual: s06_exchange:30, 490.23–507.60s.

Now a factored update: delta W equals L times R. The left factor L has r columns, and the right factor R has r rows. Here's a small one with r equal to two. Look at any column of delta W. It's L times the matching column of R.

### Shot 217

Visual: s06_exchange:31, 507.60–525.10s.

And L times a column is a recipe. The column of R gives the amounts, and the columns of L are the ingredients. Two, one, means two of the first column of L plus one of the second. Every column of delta W is a combination of the r columns of L.

### Shot 218

Visual: s06_exchange:32, 525.10–538.67s.

Picture it. L's two columns span a plane through the origin in R three. However many columns delta W has, every one of them lands in that plane. So at most r columns of delta W are independent.

### Shot 219

Visual: s06_exchange:33, 538.67–550.70s.

This is the restriction used by low-rank adapters: the update has at most r independent output directions. It is a restriction on delta W. Adding that update to an existing matrix W does not force the combined matrix to have rank at most r. A small update space and a small total model space are different claims.

## Reachability is only half the story

### Shot 220

Visual: geometry.

There is a question our movement story hasn't answered: how close are two vectors, and how much do their directions overlap? Independence only tells us that one recipe cannot secretly cancel another. It does not say the arrows meet at right angles. To discuss length and angle, we add a geometry through an inner product.

### Shot 221

Visual: s11_inner_product:2, 43.10–58.83s.

Picture the perpendicular shadow of v on the line through u. Its signed length measures how much of v points along that direction. The dot product is that signed length multiplied by the length of u. If u has unit length, the dot product equals the signed shadow length directly.

### Shot 222

Visual: s11_inner_product:3, 58.83–70.47s.

Swing v around and watch the shadow. When v is at a right angle to u, the shadow shrinks to nothing. Swing it further, and the shadow falls behind the origin: a negative overlap.

### Shot 223

Visual: s11_inner_product:4, 70.47–88.80s.

Formally, an inner product on a vector space is a function of two vectors, written with angle brackets, with three properties. It's symmetric: u with v equals v with u. It's linear in each argument separately. And it's positive: v with itself is greater than zero for every non-zero v.

### Shot 224

Visual: s11_inner_product:5, 88.80–103.77s.

In the usual Euclidean geometry of R n we choose the dot product: u transpose v, the sum of u i times v i. The length, or norm, of v is the square root of v transpose v. In the plane, that's just Pythagoras.

### Shot 225

Visual: s11_inner_product:6, 103.77–120.50s.

Worked example. u is two, one, and v is one, three. The dot product is two times one plus one times three, which is five. The length of u is the square root of four plus one, root five. The length of v is the square root of one plus nine, root ten.

### Shot 226

Visual: s11_inner_product:7, 120.50–133.57s.

To turn the dot product into an angle, we'll want to divide by the two lengths and call the result a cosine. That only makes sense if the dot product is never bigger than the product of the lengths. That's the next theorem.

### Shot 227

Visual: s11_inner_product:8, 133.57–145.10s.

The Cauchy–Schwarz inequality says that the absolute dot product cannot exceed the product of the two lengths. Dividing by those lengths therefore produces a number between minus one and one, as a cosine must. Equality occurs when the two vectors are dependent. We will use the inequality here; the written chapter develops its proof.

### Shot 228

Visual: s11_inner_product:15, 237.00–252.90s.

For two nonzero vectors, divide the dot product by the product of their lengths. The resulting number lies between minus one and one. It is the cosine of their angle in this geometry. The division removes the effect of vector length so we can compare direction.

### Shot 229

Visual: s11_inner_product:16, 252.90–263.17s.

In our example, the cosine is five over root five times root ten, which is five over root fifty, one over root two. So theta is forty-five degrees.

### Shot 230

Visual: s11_inner_product:17, 263.17–281.87s.

Now the shadow. The shadow of v on the line of u has signed length: the length of v times cosine theta, which is u dot v over the length of u. Five over root five is root five, exactly the length of u itself. So the perpendicular from the tip of v lands exactly at the tip of u.

### Shot 231

Visual: s11_inner_product:18, 281.87–296.63s.

Check it. v minus u is minus one, two, and its dot product with two, one is minus two plus two: zero. A right angle. And Cauchy–Schwarz says the shadow is never longer than v itself: root five is at most root ten.

### Shot 232

Visual: s11_inner_product:19, 296.63–316.80s.

A few more words come for free. A unit vector has length one. Divide any non-zero vector by its length, and you get the unit vector in its direction: u over its length is two, one, over root five. The distance between u and v is the length of u minus v. Here that's the length of one, minus two: root five.

### Shot 233

Visual: s11_inner_product:22, 355.30–365.47s.

Two vectors are orthogonal when their dot product is zero. And here's a useful fact: non-zero vectors that are mutually orthogonal are always independent.

### Shot 234

Visual: s11_inner_product:23, 365.47–387.70s.

The proof is a neat trick. Suppose a combination, the sum of c i v i, equals zero. Take the dot product of both sides with one of them, v j. Every cross term vanishes, because the vectors are orthogonal, leaving c j times the length of v j squared equals zero. That length isn't zero, so c j is zero. And that works for every j.

### Shot 235

Visual: s11_inner_product:24, 387.70–407.67s.

The converse fails. u equal to two, one and v equal to one, three are independent: the determinant, two times three minus one times one, is five, not zero. But their dot product is five, not zero either. A basis doesn't need right angles or unit-length arrows. Think of the slanted street grid.

### Shot 236

Visual: s11_inner_product:32, 513.00–531.73s.

Why does overlap matter in a model? Imagine several signals being mixed and then read out by comparing the mixture with one signal direction. If the directions overlap, the readout picks up contributions from other signals. A dot product measures that overlap; it does not automatically recover the original coefficient.

### Shot 237

Visual: s11_inner_product:33, 531.73–554.33s.

In a model, let the unit feature directions be f i, and encode the activations as x equals the sum of a i f i. A dot-product readout for feature j gives f j transpose x, which equals a j, the signal, plus the sum over i not equal to j of a i times f j transpose f i. That second term is the cross-talk.

### Shot 238

Visual: s11_inner_product:34, 554.33–566.70s.

Here's the example from the figure. Three unit vectors sit one hundred twenty degrees apart in R two. Any two of them have dot product minus one half, the cosine of one hundred twenty degrees.

### Shot 239

Visual: s11_inner_product:35, 566.70–583.07s.

Activate features one and two, so x is f one plus f two, with activations one, one, zero. Readout one is one, minus one half: one half. Readout two, likewise, is one half. Readout three is minus one half, minus one half: minus one.

### Shot 240

Visual: s11_inner_product:36, 583.07–601.53s.

So the active features read only half their value, and the silent one reads minus one. Here the party analogy bends: a real microphone can't hear negative sound, but a dot product can subtract. Three feature directions crammed into a two-dimensional room can't stay out of each other's way.

### Shot 241

Visual: s11_inner_product:37, 601.53–616.00s.

One more warning. A new basis does not automatically mean a new geometry. If x is B c and y is B d, then their Euclidean inner product, x transpose y, equals c transpose, B transpose B, d.

### Shot 242

Visual: s11_inner_product:38, 616.00–635.50s.

So if you just take c transpose d on the coordinate lists, you silently change the geometry, unless B transpose B is the identity. Watch: in the slanted grid, the coordinate lists one, zero and zero, one look perpendicular, but the arrows they describe are not. Their true dot product is one.

### Shot 243

Visual: s11_inner_product:39, 635.50–653.03s.

More generally, a symmetric matrix M with z transpose M z greater than zero for every non-zero z defines an inner product, x transpose M y. Such a matrix is called positive definite. In B coordinates, its matrix is B transpose M B.

### Shot 244

Visual: s11_inner_product:40, 653.03–668.63s.

A change of coordinates preserves linear relationships: spans, independence, recipes. But a raw cosine between the new coordinate lists need not match the old cosine. The rubber sheet again: stretching keeps lines, not angles.

## Possible does not always mean stable

### Shot 245

Visual: sensitive.

We can now return to the opening experiment with a more subtle question. The gold arrow is not exactly parallel to blue, so every point in the plane is still reachable. Does that guarantee the controls are easy to use? Watch what happens as we turn gold closer and closer to blue while keeping our target off their line.

Thinking pause: 4 seconds.

### Shot 246

Visual: s13_numerics:24, 360.97–372.00s.

Now steer with two movement directions that are almost parallel. They are still independent, so every target in the plane remains reachable. But the geometry of the controls is about to make a particular target surprisingly difficult to describe with small settings.

### Shot 247

Visual: s13_numerics:25, 372.00–386.70s.

To move one step sideways, you have to fire one thruster hard in reverse and the other hard forward. Their huge pushes almost cancel, and the tiny leftover is what nudges you sideways. Enormous effort, tiny result.

### Shot 248

Visual: s13_numerics:26, 386.70–399.83s.

In symbols: B epsilon has columns b one equals one, zero, and b two equals one, epsilon. The target v is zero, one. For every nonzero epsilon, the columns form a basis.

### Shot 249

Visual: s13_numerics:27, 399.83–418.57s.

Solve. The second equation is epsilon c two equals one, so c two is one over epsilon. The first is c one plus c two equals zero, so c one is minus one over epsilon. The coordinates are minus one over epsilon, and one over epsilon.

### Shot 250

Visual: s13_numerics:28, 418.57–436.07s.

Now shrink epsilon, and watch the recipe. Walk left along b one, then back along b two. At epsilon one half, that's minus two, two. At one quarter, minus four, four. At one eighth, minus eight, eight. The destination never moves, but the walk grows without bound.

### Shot 251

Visual: s13_numerics:29, 436.07–450.73s.

At epsilon equals zero, both columns lie along the x axis. They're parallel, and no recipe for zero, one exists at all. The coordinates didn't settle down to a limit. They ran off to infinity, and then there was nothing.

### Shot 252

Visual: s13_numerics:30, 450.73–466.03s.

Now nudge the target. Change its second coordinate by a small amount, delta. The same algebra says the recipe changes by minus delta over epsilon, and delta over epsilon. Watch the walk swing while the target barely moves.

### Shot 253

Visual: s13_numerics:31, 466.03–481.00s.

With epsilon one thousandth, a nudge of one thousandth moves each coefficient by a whole unit. That's sensitivity to input error, and it happens even with a perfectly correct solver. The trouble is in the question, not the code.

### Shot 254

Visual: s13_numerics:33, 494.63–509.23s.

In computation, decide what reconstruction error you can accept. One useful rule allows a small absolute error plus an error proportional to the size of the target. Neither number should be hidden. The tolerance is part of what a numerical answer means.

### Shot 255

Visual: s13_numerics:34, 509.23–521.80s.

Why both? Exact independence doesn't care about scale. Multiply every coordinate by a nonzero number, and independent vectors stay independent. A fixed absolute threshold does care.

### Shot 256

Visual: s13_numerics:35, 521.80–542.93s.

Call the factors by which a diagonal matrix stretches each axis its gains. The matrix diag of one and ten to the minus eight has gains one and ten to the minus eight. It leaves the first axis alone, and crushes the second almost flat. For general matrices, the gains are the singular values, which arrive with the SVD.

### Shot 257

Visual: s13_numerics:36, 542.93–560.83s.

Now count the gains above ten to the minus six. For A, only one gain clears the bar: one usable direction. Multiply A by ten to the eight. The gains become ten to the eight and one, and now both clear the bar: two directions. Yet the exact rank is two in both cases.

### Shot 258

Visual: s13_numerics:37, 560.83–574.77s.

Switch to a relative rule: count gains above ten to the minus six times the largest gain. Now both matrices report one. The threshold rides along with the data, so a common rescaling changes nothing.

### Shot 259

Visual: s13_numerics:48, 734.43–753.43s.

A small residual says the reconstruction is close to the target. It does not automatically say the recovered coefficients are close to the intended coefficients. Nearly dependent directions can turn very different recipes into almost the same destination. Keep reachability, uniqueness, and sensitivity separate when you interpret a solver's output.

## See the whole machine

### Shot 260

Visual: recap.

Return to the original green point. If I add a control made from the existing controls, have I opened up any new territory? No. I have introduced another recipe. If I change to a different basis, has the destination moved? No. Its address has changed. If I turn the directions almost parallel, is the destination impossible? Not yet. But the settings can become extremely sensitive.

Thinking pause: 3 seconds.

### Shot 261

Visual: matrix.

Those are three different things to look for: what is reachable, whether a description is unique, and whether recovering that description is stable. A matrix is a compact way to organise the same questions. Its columns supply the moves, its input supplies their amounts, and its output is the combination they produce.

### Shot 262

Visual: recap.

The arrows helped us see the ideas, but the rules also apply to functions, polynomial coefficients, data vectors, and learned representations. When you meet a new matrix, ask what its columns can reach. When you meet a set of features, ask what is redundant. When you meet a coordinate list, ask which basis gives those numbers their meaning.

### Shot 263

Visual: final.

You now have a picture to reason with. The written lesson has further examples and exercises when you want to test that understanding. For now, look one last time at the two controls. Two arrows can give you a whole plane, or leave you trapped on a line. What matters is the independent movement they make possible.

Thinking pause: 2 seconds.
