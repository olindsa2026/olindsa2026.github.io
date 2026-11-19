---
title: "Day 26: Last Regular Class!"
toc_sticky: true
published: true
---

## Getting Ready for the Final Event

The main part of the final event is presenting your final projects.  Make sure to consult [the final project assignment page](../assignments/assignment_09.md) for information on the length of the presentation and intended format.  It is my hope that these presentations will summarize not only what you did, but give folks some insight into the algorithm you learned about.

## P versus NP

I had talked about doing some brief discussions on algorithms during the project work period.  I wanted to take this last class to talk about probably the most famous problem in computer science: P versus NP (this is also one of [the Millennium Prize problems](https://en.wikipedia.org/wiki/P_versus_NP_problem)).  I'm guessing this is a problem that many folks have heard a bit about (possibly a lot about).  Let's end the semester by establishing a little bit of common knowledge regarding P and NP.

Before we define P versus NP, we need to talk about what we mean by each of these classes.  First, what is P?  We can think of P as a set of decision problems.  A decision problem is a problem where we are deciding something of interest (i.e., the output is a 0 or 1).  We haven't dealt with too many of these problems this semester, but many of the problems we've studied thus far can be cast as decision problems.

P is the set of all decision problems such that there is an algorithm to solve them in $O(n^k)$ where $n$ is the size of the input and $k$ is some constant.  That is to say, there is an algorithm that runs in polynomial time to solve the decision problem.

NP is the set of all decision problems such that there is an algorithm to **verify** a proposed solution in $O(n^k)$ where $n$ is the size of the input and $k$ is some constant.  That is to say, there is an algorithm that runs in polynomial time to verify a candidate solution to the decision problem.

To get a handle on NP problems, let's consider the partition problem (a close cousin of the 0-1 knapsack problem).  Given a bunch of weighted items, $w_1, w_2, \ldots, w_n$, determine whether there is a way to split these items into two knapsacks such that the weights of the two knapsacks are identical.  If we were given a possible solution to this problem, we could easily verify whether it was correct (how?).

### Try it: solving versus verifying

Try to solve the puzzle below, and then try checking a classmate's answer.  Pay attention to how different those two tasks feel.

<div class="partition-race" data-n="12"></div>

While we can verify a solution to this problem in polynomial time, we don't yet have a way to find a solution in polynomial time.  The obvious approach is brute force: try every possible split.  With $n$ items there are $2^n$ ways to split them, so every item you add doubles the work.  Watch your browser do it below, then add a few items.

<div class="partition-bruteforce" data-n="20"></div>

> **Exercise**
>
> Using the table above, how many items does it take before brute force becomes hopeless on your laptop?  Why doesn't buying a computer that is 1,000 times faster help very much?  (Hint: $2^{10} \approx 1000$.)
{: .notice--success}

If you could find a polynomial-time algorithm for this problem, you would be a billionaire, win the Turing award, and maybe win a Fields medal.

The partition problem is part of a set of problems called [the NP-Complete problems](https://en.wikipedia.org/wiki/List_of_NP-complete_problems).  These are problems that are known to be at least as hard as any of the problems in NP.  We show that they are at least as hard using the idea of a reduction.

### Another NP-complete problem: graph 3-coloring

Here is a very different-looking NP-complete problem.  Given a graph, can you color each node red, green, or blue so that no edge connects two nodes of the same color?  Try it below, and try a bigger graph too.

<div class="graph-coloring" data-nodes="20"></div>

Notice that, just like with partition, checking a finished coloring is easy (look at each edge once), but finding one can take a lot of trial and error.  Because both problems are NP-complete, each can be *reduced* to the other.  That means that a polynomial-time algorithm for 3-coloring could be turned into a polynomial-time algorithm for partition (and for every other problem in NP).

> **Exercise**
>
> Why is 2-coloring (only red and blue) easy?  Sketch an algorithm.  What runtime does it have?
{: .notice--success}

Right now it is unknown whether the two sets P and NP are the same.  Here are two possibilities.

![A diagram showing two possible scenarios for P and NP](https://upload.wikimedia.org/wikipedia/commons/a/a0/P_np_np-complete_np-hard.svg)

Proving whether P is equal to NP has not been easy.  There have been many [papers published that purport to address the question](https://www.win.tue.nl/~wscor/woeginger/P-versus-NP.htm), but none are widely accepted in the field.  I've even heard that some journals have limits on how many papers per year someone can submit on the question of P versus NP.

### Why does anyone care? Easy one way, hard the other

A lot of modern cryptography relies on problems that are easy to check but (we believe) hard to solve.  The classic example is factoring.  Multiplying two primes is fast, but recovering the primes from their product appears to be very hard.  Try it below.

<div class="factoring-race" data-digits="7"></div>
<script src="{{ '/assets/js/pvsnp-partition.js' | relative_url }}"></script>

One caveat: factoring is in NP (a proposed factor can be checked with a single division), but it is **not** known to be NP-complete, and many researchers suspect it isn't.  So a proof that P ≠ NP would not by itself prove factoring is hard.  The other direction is what has dramatic consequences: if P = NP, then factoring (along with every other problem in NP) would have a polynomial-time algorithm, and much of today's cryptography would stop being secure.

## Final push on projects

Let's do it.
