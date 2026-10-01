---
title: "Day 9: More Sorting and More Divide and Conquer"
toc_sticky: true
published: true
---

## Class Overview

Last class we saw heap sort, merge sort, and selection sort, but there are many more to learn about. Today we'll learn a few more sorting algorithms, but we'll also formally introduce the master theorem as a generalizable way to find $\Theta$ for divide and conquer algorithms.  There's an optional section at the end on the speed limit of sorting (if you are interested).  That content is not part of the assignments or oral quizzes.

## Master Theorem

A generalizable recipe for analyzing divide and conquer algorithms is the [master theorem](https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)).  Remember, by divide and conquer all we mean is that we divide the problem into smaller subproblems, solve the subproblems recursively, and use the solutions to the subproblems to determine the solution to the original problem.

Let's see if we can apply this to determining the complexity of merge sort from last class.  Before applying the master theorem, we need to make sure we are comfortable with the idea of a recurrence relation.  A recurrence relation relates the runtime of an algorithm on input of size $n$ (denoted as $T(n)$) to the runtime of the algorithm on smaller problem sizes (less than $n$).  For example, in the case of merge sort we can write the following recurrence relation.

> $T(n) = 2 T(\frac{n}{2}) + n$
{: .notice--warning}

Let's make sure we understand this exactly.  The term on the left is the runtime of sorting $n$ items with merge sort.  The runtime is based on two parts.  The first part is the recursive piece, which consists of merge sorting two lists of size $\frac{n}{2}$.  The second part is the work needed to reassemble the sorted lists back into an overall sorted list (the merge step), which takes time $n$.

The master theorem provides a recipe for us to solve this recurrence relation (meaning determine a function $T(n)$ that satisfies the equation).  The master theorem solves recurrence relations of the following form.

> $T(n) = a T(\frac{n}{b}) + f(n)$
{: .notice--warning}

You should see that for merge sort, $a=2$, $b=2$, and $f(n) = n$.
In order to apply the master theorem, we compute a value called $c_{crit} = \log_{b}{a}$.  Plugging in $a=2$ and $b=2$, we get $c_{crit} = \log_2{2} = 1$.

Now, we have to determine which of the three cases of the master theorem applies. Before doing so, let's remember our order of growth.

> **Refresher: $O, \Omega, \Theta$**
> 
> Let's make sure we remember what our old friend $O$, $\Omega$, and $O$ mean.  I'll state these definitions somewhat loosely, trusting you to go back to the original definitions for the exact meanings.
> * $f(n) = O(g(n))$ means that $g(n)$ bounds $f(n)$ from above for large $n$.
> * $f(n) = \Omega(g(n))$ means that $g(n)$ bounds $f(n)$ from below for large $n$.
> * $f(n) = \Theta(g(n))$ means that $g(n)$ bounds $f(n)$ from both above and below (meaning $f(n) = O(g(n))$ and $f(n) = \Omega(g(n))$).
{: .notice--warning}

Okay, so here are the three cases of the master theorem.  I'll list the condition, state if merge sort meets it, and if it does, show the runtime.  To apply this to other problems, you will need to look back at the more general versions of these cases.

Case 1: $n = O(n^c)$ for some $c < 1$.  **Nope can't be true.  If $c$ is less than 1, $n^c$ grows more slowly than $n$ and cannot serve as an upper bound.**

Case 2: $n = \Theta(n (\log n)^k)$ for some $k \geq 0$.  **Yes!  If we set $k=0$, then the $\log$ drops out, and we are left with $n = \Theta(n)$, which is true.**

Case 3: $n = \Omega(n^c)$ for some $c > 1$.  **Nope.  If we set $c$ bigger than 1, $n^c$ will grow faster than $n$ and cannot serve as a lower bound.**

Okay, so case 2 is the winner.  The runtime as dictated by case 2 is $T(n) = \Theta(n^{c_{crit}} (\log n)^{k+1}) = \Theta(n \log n)$ (since $c_{crit} = 1$ and $k = 0$).

> **Exercise 1:** Imagine you have an array of $n$ sorted numbers.  You are given a number $k$, and you would like to determine if the number $k$ occurs in the array of numbers.  This problem can be solved using a binary search.  First: Make sure you understand what binary search is.  Use the master theorem to determine the runtime of ($\Theta$) for using binary search procedure to determine of the number $k$ is in the list.  Hint: first find a recurrence relation, and then try to find the case of the master theorem that matches.
{: .notice--success}

At first the formulas for the master theorem might seem a bit strange, but one quantity that comes up, $n^{c_{crit}}$, is related to the number of nodes in the recursive tree when you apply a divide and conquer strategy.  For example, if we had $a = 4$ and $b=2$, the following tree would have approximately $n^2$ nodes.

<div class="mermaid">
graph TD
  r[n] --> b[n/2]
  r --> c[n/2]
  r --> d[n/2]
  r --> f[n/2]
  b --> g[n/4]
  b --> h[n/4]
  b --> i[n/4]
  b --> j[n/4]
  c --> k[n/4]
  c --> l[n/4]
  c --> m[n/4]
  c --> n[n/4]
  d --> o[n/4]
  d --> p[n/4]
  d --> q[n/4]
  d --> s[n/4]
  f --> t[n/4]
  f --> u[n/4]
  f --> v[n/4]
  f --> w[n/4]
</div>

This value $c_{crit}$ is important because it controls whether the tree is wide (like the tree above), narrow (in the case of $c_{crit} < 1$), or in between (in the case of $c_{crit} = 1$).

> **Exercise 2:** Choose a few problems from the homework and do them together.  If you want to hit each case at least once, try these three.
> * Problem 1-5
> * Problem 1-21
> * Problem 1-23
{: .notice--success}

## Quick Sort

[Quick Sort](https://en.wikipedia.org/wiki/Quicksort) is one of the most commonly used sorting algorithms.

There are quite a few ways to implement Quick Sort, but the general idea is the following:
* For an unsorted list, choose an element of the list as your pivot value, $p$.
* Iterate through the elements of your list ($x_1, x_2, \ldots, x_n$), swapping as needed, until the pivot element is located at index $i$ and $x_j < x_i$ if $j < i$ and $a_j \geq a_i$ if $j \geq i$.
* Sort range of elements that are before the pivot in the list and those after the pivot recursively.

Let's look at the [algorithm visualization](https://visualgo.net/en/sorting) (you can choose quick or ``quick sort`` or ``random quick sort``).

Analyzing the runtime of this algorithm is a bit tricky.  Let's consider a specific case of always choosing the first element as the pivot.  Let's see what happens with quick sort with this pivot selection rule.

## Radix Sort

[Radix sort](https://en.wikipedia.org/wiki/Radix_sort) (also called bucket sort) is an interesting algorithm where we don't perform an explicit comparisons between elements in our list.  We instead sort, e.g. if we are sorting integers, based on comparing the ones digits, then the tens digit, etc.  Let's check out [the visualization of Radix sort](https://visualgo.net/en/sorting) at our favorite website!  Choose Rad, and then click the sort button.

The complexity of radix sort is $\Theta(nk)$ where $k$ is the number of digits (or chunks) that each element can be broken into (e.g., if our list had numbers with 4 or fewer digits, $k$ would be $4$).

## The Speed Limit for Comparison-Based Sorting

> This is an optional writeup for those that are interested in going through the details.  To understand this, you need to know some basic facts from discrete math.  I'll highlight those in the writeup.  I will not be going over the details in class.
{: .notice--warning}

There's a theorem that states that any algorithm for sorting that works by comparing elements of the list to each other has a running time of $\Omega(n \log n)$ (i.e., the running time can be bounded below by $n \log n$).  We can think of $n \log n$ as a speed limit for any sorting algorithm that relies on comparisons.

The basic idea is to shift how you think about sorting a list of $n$ items.  Instead of thinking of reordering the items such that the list is sorted, let's think about sorting as the problem of determining a function that maps indices from the unsorted list to where they should go in the sorted list.  Here's an example.

Suppose we have a list $x = [3, 9, 2, 10]$.  A function that sorts the list specifies a mapping from the original indices ($0, 1, 2, 3$) to their positions in the sorted list.  A function $f$ that achieves this goal would be defined as follows.

$$\begin{align*}
f(0) &= 1,~\text{since 3 would appear at index 1 in the sorted list} \\
f(1) &= 2,~\text{since 9 would appear at index 2 in the sorted list} \\
f(2) &= 0,~\text{since 2 would appear at index 0 in the sorted list} \\
f(3) &= 3,~\text{since 10 would appear at index 3 in the sorted list}
\end{align*}$$

With this new definition of sorting in mind, let's think about how many possible functions $f$ there are as a function of $n$.  To determine this, we can imagine that for $f(0)$ there are $n$ possible choices, for $f(1)$ there are $n-1$ possible choices (since we can't repeat what we chose for $f(0)$), for $f(2)$ there are $n-2$ possible choices, etc.  Overall, we have that the number of choices is $n (n-1)(n-2)\ldots 1 = n!$.  If you took Discrete, you might recognize this as the number of ways to permute $n$ items (which should line up intuitively with what we are doing here).

Now let's think about what happens when we perform some comparison $x_i < x_j$ for the purposes of determining which of the $n!$ functions will sort our list.  Some proportion will return true to this comparison the others will return false.  By this logic, if you think of the worst case scenario (which is what we consider when thinking about runtime complexity), at best we are left with half as many possible functions that we are still considering (in relation to the number we had before the comparison $x_i < x_j$).

Let's say our sorting algorithm perfectly divides the number of possible functions that are consistent with the two possible outcomes of each of the comparisons it performs. We can represent this scenario as a tree where at each level of the tree we perform a comparison to eliminate some of the $n!$ possible functions.  The number written on the node in the tree below represents the number of functions that are still under consideration after performing a particular comparison.

<div class="mermaid">
graph TD
  r[n!] --> b[n!/2]
  r --> c[n!/2]
  b --> e[n!/4]
  b --> f[n!/4]
  c --> g[n!/4]
  c --> h[n!/4]
</div>

If we were to extend this tree, eventually we would reach leaf nodes where there is exactly $1$ functions remaining (this function would sort our list).  What is the runtime of this sorting algorithm?  Well, it has to be the number of comparisons, which is given by the height of the tree.  The height of the tree would be $\log_2(n!)$ (since each level reduces the number of consistent functions by a factor of $2$).  This shows that the fastest sorting algorithm based on comparisons has to perform at least $\log_2(n!)$ operations in the worst case.  We could stop here, but we'd like to derive our desired result, which states that all sorting algorithms are $\Omega(n \log n)$.

To accomplish our goal, we now show that $\log_2(n!) = \Omega (n \log n)$.  To do this we need to find a value $n_0$ and a constant $c$ such that $\log_2(n!) > c n \log_2 n$ for $n \geq n_0$.  Note: I'm using $\log_2$ here to make it clearer in the proof coming up, but the base of the log doesn't matter since it's just a constant factor (that doesn't affect $\Omega$).

The first fact we use is that $n! > \left(\frac{n}{2}\right)^\frac{n}{2}$.  This is because the first $\frac{n}{2}$ terms of $n!$ are all bigger than $\frac{n}{2}$.

$$\begin{align*}
\log_2(n!) &> \log_2\left (\left (\frac{n}{2} \right)^\frac{n}{2}\right )\\
&= \frac{n}{2} (\log_2(n) - 1)~~~~~~\text{Note: applied some basic properties of logs}\\
&\geq c n \log_2(n), \text{for }n\geq 4, \text{and }c=\frac{1}{4}~~~~~~~~~~\text{Note: there are lots of constants that will work here}
\end{align*}$$

That's it!  We've shown that $\log_2(n!) = \Omega(n \log_2 n)$, and we have proven our speed limit.