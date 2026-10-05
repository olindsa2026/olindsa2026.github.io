---
title: "Day 10: Divide and Conquer and Intro to Dynamic Programming"
toc_sticky: true
published: true
---

## Oral Quizzes

Our first oral quiz will be assigned this Thursday (the 9th) and due Monday the 19th.  This is not at all required, but the CAs are running some practice sessions for people if they want to get a flavor for what the oral quizzes will be like.

* This is a placeholder for where I'll post Aidan and Evi's availability.

## Divide and Conquer and Intro to Dynamic Programming

Today is going to primarily be about getting practice with divide and conquer algorithms.  We'll also throw in a recursive algorithm that doesn't quite fit the mold of divide and conquer.


> **Exercise 1**
>
> Multiplying square matrices.  Given two square matrices, $A$ and $B$, each of size $n \times n$.  Determine a divide and conquer method for determining the product of the two matrices $C = AB$.  To solve the problem, you can make use of the technique of [block matrix multiplication](https://en.wikipedia.org/wiki/Block_matrix#Block_matrix_multiplication).  Show that the running time you get from using block matrix multiplication is the same as you get from the traditional method of matrix multiplication (the one you learned about in math class).
{: .notice--success}


> **Exercise 2**
> 
> Create a divide and conquer algorithm to compute $x^n$ where $n$ is a positive integer.  Consider each multiplication operation as taking $\Theta(1)$.  What is the runtime of your divide and conquer algorithm?  Hint: you should be able to do better thant $\Theta(n)$.  How does it compare to the approach of just multiplying $x$ $n$ times.
{: .notice--success}

> **Exercise 3**
> 
> Solve the maximum contiguous subsequence problem by determining a divide and conquer algorithm to solve it.  Once you have the algorithm, use the master theorem to determine its runtime.  Note that there are other algorithm you can use to solve this problem (that are actually faster, but here we want to focus on divide and conquer).
> 
> The maximum contiguous sub-sequence problem involves taking an input list of numbers $x_1, \ldots, x_n$ and determining two index values $i$ and $j$ such that $\sum_{k=i}^j x_k$ is as large as possible.  Note that the numbers can be negative.  For simplicity, you can just return the maximum sum (rather than the indices).
> 
>    <button onclick="HideShowElement('HideShow1')">Show / Hide Hint 1</button>
>    <div id="HideShow1" style="display:none">
         Divide the array into two halves.  Find the maximum subsequence for each half.  What case have you not considered?
>    </div>
>    <button onclick="HideShowElement('HideShow2')">Show / Hide Hint 2</button>
>    <div id="HideShow2" style="display:none">
         Create a special purpose algorithm for determining the maximum crossing sequence.
>    </div>
{: .notice--success}

## Dynamic Programming

> Let's start with a very simple recursive function and see if we can use dynamic programming to solve it.  Let's implement a function to compute the $n$th Fibonacci number.

We'll see if we can understand how this applies to the Leetcode problem of [Minimum Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/description/).

The book "Introduction Algorithms" by Cormen, Leiserson, Rivest, and Stein has the following description of the dynamic programming approach.

1. Characterize the structure of an optimal solution.
2. Recursively define the value of an optimal solution.
3. Compute the value of an optimal solution, typically in a bottom-up fashion.
4. Construct an optimal solution from computed information.

This can be a helpful way to think about dynamic programming.  Try it on the next problem.

> You are given an integer array cost where ``cost[i]`` is the cost of $i$th step on a staircase. Once you pay the cost, you can either climb one or two steps.
> You can either start from the step with index 0, or the step with index 1.
> Return the minimum cost to reach the top of the floor.
> 
> Example 1:
>  - Input: cost = [10,15,20]
>  - Output: 15
>
> Example 2:
>   - Input: cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]
>   - Output: 6


> **Exercise 4:**
> 
> Change making.  Given $n$ different coin denominations worth $x_1, x_2, \ldots, x_n$ cents and a target value of $D$ cents, determine how many different ways you can combine the different coins to add up exactly $D$ cents.  You can use as many of each denomination of coin as you'd like.  Solve the problem using dynamic programming where you create a table to store the solutions to the problem, fill out rows and/or columns of the table that correspond to small or easy to solve instances of the problem, and then determine a rule for filling out the rest of the table.  Finally, determine how you would compute the solution to your original problem by referencing a particular cell in your table.
{: .notice--success}