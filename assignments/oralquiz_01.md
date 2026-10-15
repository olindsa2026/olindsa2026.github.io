---
title: "Oral Quiz 1 Practice Set 2"
toc_sticky: true
published: true
---

## Problem 1: Breadth-first and Depth-first Search

The following code can be used to implement both depth-first and breadth-first search by choosing a particular data structure for ``priorityList``.  Which data structure would you choose for ``priorityList`` to implement breadth-first search?  How about for depth-first search?  Choose one of these algorithms and show an example of how it would play out on the whiteboard.

<pre>
toVisit ← {}
priorityList ← []

priorityList.add(root)
toVisit.add(root)

while priorityList is not empty:
    n ← priorityList.popHighestPriorityElement()
    if n == target:
        return true // path exists
    for all neighbors m of node n:
        if m is not in toVisit:
            priorityList.add(m)
            toVisit.add(m)

return false // no path
</pre>

## Problem 2: Heap Sort

Heap sort is a sorting algorithm where given a list of $n$ items $x_1, x_2, \ldots, x_n$, each item is first inserted into a binary min heap.  Next, we call pop min repeatedly to extract the elements in sorted order.

What is the $\Theta$ running time of heap sort?  Justify your answer. 


## Problem 3: Doubly Linked Lists

* Draw a picture of a doubly linked list.
* Explain how it differs from a singly linked list
* What are the $\Theta$ running times of the following operations (justify your answers).
  * pushFront
  * pushBack
  * popFront
  * popBack
  * Search the list to determine whether a particular element is present in the list.

## Problem 4: Explain Your Sorting Code

Let's pull up an implementation of one of your sorting algorithms.  Please explain how your code implements the particular algorithm you chose.  What is the $\Theta$ runtime of this particular sorting algorithm.