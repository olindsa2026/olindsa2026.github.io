---
title: "Day 11: More Dynamic Programming"
toc_sticky: true
published: true
---

## Oral Quiz 1

First, sign up for a time to meet with me (see link on Canvas).  You need to make it to this time unless something catastrophic happens.

Here are some things I noticed in the practice quizzes (Note: this is from last year, but the advice is still relevant).
* When determining runtimes (non divide and conquer), figure out what are the main steps you have to perform, determine how many operations each step takes, and then add up the total number of operations.  Conclude by converting to $\Theta$.
* For divide and conquer algorithms, be ready to draw a tree diagram or use the master theorem.
* When reading code, I found that people who talked through what the code as doing in greater detail had an easier time giving the relevant details.
* For graph search (e.g., Dijkstra), make sure you understand what the variables represent (e.g., ``dist[v]`` returns the shortest known path from the source to vertex ``v``).

## Dynamic Programming General Structure

The book Introduction Algorithms by Cormen, Leiserson, Rivest, and Stein has the following description of the dynamic programming approach.

1. Characterize the structure of an optimal solution.
2. Recursively define the value of an optimal solution.
3. Compute the value of an optimal solution, typically in a bottom-up fashion.
4. Construct an optimal solution from computed information.

## Practice Problems

> **Exercise 0 (as a class)**
> We'll go over the solution to exercise 4 from the previous day.

> **Exercise 1**
>
> Revisit the maximum contiguous subsequence problem from last class.  Instead of using divide and conquer, use dynamic programming.  We're planning to use this one as an intuition building exercise, so don't look up the solution until you've had a chance to really sit with this problem.
> 
> Here is a potential sequence for how you might break this problem down
> * First, write an example on the board and make sure you understand what the problem is asking.  Compute the solution to your example by hand.
> * Consider a set of smaller problems that you could solve that might be useful to solving the full problem.  What space does this set of problems live in (Is it a table or a list?).  Start by thinking of a problem you could solve without referencing a solution to a smaller problem.
> * See if you can come up with a rule to solve a larger instance of the space of problems you came up with above by referencing the solution to the smaller problems.  If you find that you are unable to come up with a rule to solve this larger problem, perhaps revisit the definition of the subproblems in the previous step (you may need to tweak them).
> * Assuming you can find a recipe for solving larger problems in terms of smaller ones, now extract the overall solution to the problem from the solutions to the smaller problems.
{: .notice--success}

> **Solution 1**
>
> <iframe width="560" height="315" src="https://www.youtube.com/embed/sPtrhdlCxaE?si=M7jgNiKG3CSVhhPr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
{: .notice--warning}

> **Exercise 2**
>
> Change making part 2.  Given $n$ different coin denominations worth $x_1, x_2, \ldots, x_n$ cents and a target value of $D$ cents, determine the minimum number of coins you can use to add up exactly $D$ cents.  You can use as many of each denomination of coin as you'd like.  Solve the problem using dynamic programming where you create a table to store the solutions to various subproblems, fill out rows and/or columns of the table that correspond to small or easy to solve subproblem, and then determine a rule for filling out the rest of the table.  Finally, determine how you would compute the solution to your original problem by referencing a particular cell in your table.
{: .notice--success}

> **Exercise 3**
> 
> The Longest Common Subsequence (LCS) problem asks: given two sequences, what is the longest sequence that appears in both of them in the same order? In other words, it’s the longest sequence that you can form by deleting some elements (without changing the order) from each of the two original sequences.
{: .notice--success}

> **Exercise 4**
>
> In the 0–1 Knapsack problem, we are given a set of items, each with a weight and a value, and we need to determine the number of each item to include in a collection so that the total weight is less than or equal to a given limit and the total value is as large as possible.
> 
> Please note that the items are indivisible; we can either take an item or not (0-1 property). For example,
>
> Input:
>  - value = [ 20, 5, 10, 40, 15, 25 ]
>  - weight = [ 1, 2, 3, 8, 7, 4 ]
>  - W = 10
> 
> Output: Knapsack value is 60 value = 20 + 40 = 60 (weight = 1 + 8 = 9 < W)
{: .notice--success}

## Strassen's Algorithm Intuition

On your homework, you will be implementing Strassen's algorithm for matrix multiplication.  The algorithm builds on the idea of blockwise matrix multiplication that we saw last class, but through some clever algebra, we can eliminate one of the recursive calls.

$$
A = \begin{bmatrix}
A_{11} & A_{12} \\
A_{21} & A_{22}
\end{bmatrix},
\quad
B = \begin{bmatrix}
B_{11} & B_{12} \\
B_{21} & B_{22}
\end{bmatrix},
\quad
C = \begin{bmatrix}
C_{11} & C_{12} \\
C_{21} & C_{22}
\end{bmatrix}
$$

$$
\begin{aligned}
M_1 &= (A_{11} + A_{22}) \times (B_{11} + B_{22}) \\
M_2 &= (A_{21} + A_{22}) \times B_{11} \\
M_3 &= A_{11} \times (B_{12} - B_{22}) \\
M_4 &= A_{22} \times (B_{21} - B_{11}) \\
M_5 &= (A_{11} + A_{12}) \times B_{22} \\
M_6 &= (A_{21} - A_{11}) \times (B_{11} + B_{12}) \\
M_7 &= (A_{12} - A_{22}) \times (B_{21} + B_{22})
\end{aligned}
$$

$$
\begin{bmatrix}
C_{11} & C_{12} \\
C_{21} & C_{22}
\end{bmatrix}
=
\begin{bmatrix}
M_1 + M_4 - M_5 + M_7 & M_3 + M_5 \\
M_2 + M_4 & M_1 - M_2 + M_3 + M_6
\end{bmatrix}
$$

Wow!  To build some confidence as to how this can possibly be true, let's look at one block of the resultant matrix $C$.  In traditional blockwise matrix multiplication:

$$
C_{11} = A_{11}B_{11} + A_{12}B_{21}
$$

Strassen's algorithm instead computes:

$$
C_{11} = M_1 + M_4 - M_5 + M_7
$$

Substituting the definitions:

$$
\begin{aligned}
C_{11} ={}&
(A_{11}+A_{22})(B_{11}+B_{22})\\
&+ A_{22}(B_{21}-B_{11})\\
&- (A_{11}+A_{12})B_{22}\\
&+ (A_{12}-A_{22})(B_{21}+B_{22})
\end{aligned}
$$

Expanding each product:

$$
\begin{aligned}
C_{11} ={}&
A_{11}B_{11}+A_{11}B_{22}
+A_{22}B_{11}+A_{22}B_{22}\\
&+A_{22}B_{21}-A_{22}B_{11}\\
&-A_{11}B_{22}-A_{12}B_{22}\\
&+A_{12}B_{21}+A_{12}B_{22}
-A_{22}B_{21}-A_{22}B_{22}
\end{aligned}
$$

After canceling terms:

$$
\boxed{C_{11} = A_{11}B_{11} + A_{12}B_{21}}
$$