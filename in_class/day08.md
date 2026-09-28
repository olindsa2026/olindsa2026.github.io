---
title: "Day 8: A-Star Search and Intro to Sorting"
toc_sticky: true
published: true
---

## A quick reminder about GenAI policy

> If you feel it is consistent with what helps you learn, you may use generative AI tools (e.g., ChatGPT) to help you complete the work in this course.  When using these tools, please disclose how you used generative AI in preparing your work.  Please do not use generative AI in a way that makes your contribution to the work negligible.  The design of the oral quizzes is designed around idea that you should be able to explain how the code that was created by generative AI works and what each line is doing.  You might also strive to be able to rewrite the code without generative AI.

## A-Star Search

Before we turn the page to the next topic of the course, I want to talk about [A-star](https://en.wikipedia.org/wiki/A*_search_algorithm) search algorithm.

What's beautiful about A-star search is that it can drastically speed up Dijkstra's algorithm in certain cases by cutting down on searching fruitless parts of the graph.

Before showing the algorithm, we must realize that A-star is solving a bit different problem than Dijkstra's.  A-star is specifically finding a path from a given start vertex to the goal.  If you recall, Dijkstra actually gives us the shortest path from the start vertex to any vertex in the graph.

The key insight of A-star is to make use of a heuristic function that serves as a lower bound for the cost to move from a particular node in the graph to the goal.  Let's do some work at the board to understand what a heuristic means and under what conditions it can work with A-star (this is known as the [admissibility condition](https://en.wikipedia.org/wiki/Admissible_heuristic)).

We use the notation $h(v)$ denotes the lower bound on traversing from $v$ to the goal node.  Given this construction, we can modify our pseudocode for Dijkstra's algorithm from last time to get the A-star algorithm.

Before stating our pseudocode, let's define what each variable in the program will represent.

* ``source`` is our starting vertex in the graph for searching
* ``goal`` is the vertex we are trying to reach
* ``prev`` will be used to reconstruct the optimal path and will map from a vertex to the vertex immediately preceding it on the optimal path from ``source`` to ``goal``.
* ``dist`` maps from a vertex to the currently known minimum cost path from the start to that vertex
* ``queue`` is our priority queue that we will use to keep track of which vertex to expand next

```
for each vertex, v that is not the source:
    prev[v] ← UNDEFINED
    dist[v] ← INFINITY

dist[source] ← 0    // note: this is called g in some writeups
queue.addWithPriority(source, h(source))

while queue is not empty:
    u ← queue.popMin()  // gets min and removes it
    if u == goal:
        // reconstruct shortest path from prev
        return
    for each neighbor v of u:
        alt ← dist[u] + edgecost(u, v)
        if alt < dist[v]:
            dist[v] ← alt
            if v in queue:
                queue.changePriority(v, alt + h(v))
            else:
                queue.addWithPriority(v, alt + h(v))
            prev[v] ← u
```

Key differences with Dijkstra's algorithm.
* In A-star, nodes can be expanded multiple times (in Dijkstra's they can only be expanded once)
* We make use of a heuristic function to prioritize our search (this can save us time)

Example to do on the board (this is from [Pieter Abbeel's course at Berkeley](https://www.youtube.com/watch?v=DhtSZhakyOo)):

<div class="mermaid">
graph LR
  S --1--> A
  S --4--> B
  A --5--> C
  A --2--> B
  B --2--> C
  C --3--> G
  A --12--> G
</div>>

This graph has the following heuristic.

| Vertex | h |
$S$ | 7
$A$ | 6
$B$ | 2
$C$ | 1
$G$ | 0

Let's try to understand why this could make your problem more efficient.

## Sorting

The [sorting problem](https://en.wikipedia.org/wiki/Sorting_algorithm) typically involves taking an input list of items and rearranging them so that the resultant list contains the items in some order.  A simple example would be arranging numbers in ascending order.  There are many variants and settings to this problem, but for this part of the class, let's imagine that we are simply taking lists of integers and sorting them in ascending order.

We're going to learn about three of the many sorting algorithms today.

### Selection sort

[Selection sort](https://en.wikipedia.org/wiki/Selection_sort) is a very simple algorithm.  We continuously look for the minimum value in the part of the list that is unsorted and then place that element at the front.  Let's develop the pseudocode for this and prove that the algorithm yields a sorted list.  You can see a visualization of this algorithm by going to [visualgo.net/en/sorting](https://visualgo.net/en/sorting) and choosing selection sort.

### Merge sort

[Merge sort](https://en.wikipedia.org/wiki/Merge_sort) is a divide and conquer approach to sorting a list.  We'll develop some pseudocode for this one together.

The basic idea is to chop our list in two, sort both halves, and then reassemble the two sorted halves into a sorted whole.  You can see a visualization of this algorithm by going to [visualgo.net/en/sorting](https://visualgo.net/en/sorting) and choosing merge sort.

### Heap sort

This one is pretty awesome.  You just insert all of your values into a binary min heap and then take them all out using the ``getMin()`` function.

## Complexity of Sorting Algorithms

> **Exercise 1:** Analyzing Selection Sort
>
> Let's start as a group by analyzing the worst case running time of selection sort.  Compute the number of operations necessary to run selection sort in the worst case.  Determine $\Theta$.
{: .notice--success}

### Analyzing Heap Sort

> **Exercise 2:** Determine the $\Theta$ of heap sort.
{: .notice--success}

### Analyzing Merge Sort

> **Exercise 3:** Determine the $\Theta$ of merge sort by drawing a tree diagram that shows how the problem of size $n$ is divided into subproblems (this will form a tree).  Keep track of how much work you would do at each level of this tree.
{: .notice--success}

### Master Theorem

A generalizable recipe for analyzing recursive algorithms like this is the [master theorem](https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)).  

> **Exercise 4:** Reanalyze merge sort using the [master theorem](https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)).  
{: .notice--success}


You may find the following special cases of the master theorem useful (we'll discuss the more general form next class).

$T(n) = a T(n/b) + n$

Has a run time $\Theta(n^{\log_{b}{a}})$ if $\log_{b}{a} > 1$.

Has a run time $\Theta(n \log^{k+1} n)$ if $n^{\log_{b}{a}} \log{k} = \Theta(n)$.