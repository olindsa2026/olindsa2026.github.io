---
title: "Assignment 3: Graph Searching and Shortest Paths"
toc_sticky: true
published: false
due_on_class: 8
---

## Getting Started

I am providing some starter code for this assignment.  The starter code (shown below) can be copy / pasted into your project.

You may also want to check out the tips and tricks section.

## Representing Graphs

Create a Kotlin class to represent a directed, weighted graph.  Your graph should implement the ``Graph<VertexType>`` interface shown below.

```kotlin
/**
 * ``Graph`` represents a directed graph
 * @param VertexType the type that represents a vertex in the graph
 */
interface Graph<VertexType> {
    /**
     * @return the vertices in the graph
     */
    fun getVertices(): Set<VertexType>

    /**
     * Add an edge between [from] and [to] with edge weight [cost]
     */
    fun addEdge(from: VertexType, to: VertexType, cost: Double)

    /**
     * Get all the edges that begin at [from]
     * @return a map where each key represents a vertex connected to [from] and the value represents the edge weight.
     */
    fun getEdges(from: VertexType): Map<VertexType, Double>

    /**
     * Remove all edges and vertices from the graph
     */
    fun clear()
}
```

* You should be able to retrieve a collection of vertices in the graph (e.g., you might maintain a ``MutableList`` or a ``MutableSet`` that contains all of your vertices.). In the interface above this is the function ``getVertices``.
* Given a vertex, $v$, you should be able to retrieve a collection of vertices that are neighbors of $v$ (that is any vertex $m$ such that there exists an edge $v \rightarrow m$). In the interface above this is the function ``getEdges``.

## Creating a Priority Queue

Create a data structure called [``PriorityQueue``](https://en.wikipedia.org/wiki/Priority_queue) that implements the following interface.

```kotlin
/**
 * ``MinPriorityQueue`` maintains a priority queue where the lower
 *  the priority value, the sooner the element will be removed from
 *  the queue.
 *  @param T the representation of the items in the queue
 */
interface MinPriorityQueue<T> {
    /**
     * @return true if the queue is empty, false otherwise
     */
    fun isEmpty(): Boolean

    /**
     * Add [elem] with at level [priority]
     */
    fun addWithPriority(elem: T, priority: Double)

    /**
     * Get the next (highest priority) element and remove this element from the queue.
     * @return the next element in terms of priority.  If empty, return null.
     */
    fun next(): T?

    /**
     * Adjust the priority of the given element
     * @param elem whose priority should change
     * @param newPriority the priority to use for the element
     *   the lower the priority the earlier the element int
     *   the order.
     */
    fun adjustPriority(elem: T, newPriority: Double)
}
```

In order to implement your priority queue, you'll want to create a ``MinHeap``.  For your ``MinHeap`` you can either build it from scratch (e.g., using [this Wikipedia page](https://en.wikipedia.org/wiki/Heap_(data_structure)) as a guide) or you can build off (or probably just use) the reference implementation [here](https://github.com/OlinDSA2024/Assignment03/blob/main/src/main/kotlin/MinHeap.kt).  The priority queue will be a pretty thin wrapper on top of this heap.

> If you implement the ``MinHeap`` yourself, you can earn 2 points of extra credit on the assignment (equivalent to a 20% boost in your grade).
{: .notice--success}

## Searching

Implement Dijkstra's algorithm to search through a graph for the shortest path.  Your algorithm should return the shortest path (not just the cost) between a given start node and a given destination node.  If no path exists between the two nodes, return ``null``.

## Solving Problems with Dijkstra

Dijkstra can be used to solve a bunch of problems.  Here are some you might want to try for practice.  Choose at least one of these options and implement it in Kotlin using the code you wrote earlier in the assignment.

* [Project Euler Problem 81](https://projecteuler.net/problem=81) (also look at 82 and 83 for harder variants)
* [Implement a Maze Solver](https://inginious.org/course/competitive-programming/graphs-maze)
* Create a graph that represents the cost (however you want to define it) to travel between particular various cities (you choose which ones).  Compute some shortest paths on this graph using your Dijkstra implementation.  If you want to define a map on a different level of granularity (e.g., city streets) that is cool too!

## Turning in your Code

Either submit your code as a GitHub link or upload the code directly to Canvas.

## Assessment

See the rubric on Canvas.

## Tips and Tricks

Suppose you have computed a path to the vertex ``target`` and along the way populated a map called ``prev: MutableMap<VertexType, VertexType>`` where ``prev[v]`` indicates the previous element along the path.  In order to reconstruct the full path from the start to ``target``, you may find the ``generateSequence`` function useful. In the code below, I've used the one that lets you [specify a seed](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.sequences/generate-sequence.html) to start the sequence.

```kotlin
generateSequence(seed=target) {
    curr -> prev[curr]
}.toList().asReversed()
```

