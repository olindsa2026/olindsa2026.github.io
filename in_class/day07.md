---
title: "Day 7: DAGs, Dijkstra's Algorithm, and Heaps"
toc_sticky: true
published: true
---

## Dijkstra's Algorithm

I have some companion slides to go along with the presentation of [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm).  I'll have these up on the projector, but you can [access the slides in PPTX](day07_slides.pptx) or [PDF form](day07_slides.pdf).  Don't pull them up just yet.

Before we introduce Dijkstra's algorithm, we need to briefly introduce the idea of weighted graphs.  Imagine that in addition to storing the neighbors of each vertex in our graph, we also store an edge weight.  Here is what a graph might look like with edge weights added.

<div class="mermaid">
graph LR
  A --2--> B
  B --3--> C
  A --4--> C
  C --3--> D
  B --1--> D
  A --10--> E
  D --7--> E
</div>

As an aside, edge weights could encode a bunch of different things in our graph.  In computer vision, edge weights can encode the dissimilarity between neighboring parts of an image and this graph can then be processed to segment the image into regions.  Another classical example is graph traversal where we might want to find the shortest path through a graph connecting $v_{start}$ to $v_{goal}$. In this setting, the cost of a path is defined by the sum of edge weights along the path.  This is what we will learn about next.

Dijkstra's algorithm gives us a way to compute the shortest path (defined in terms of the lowest sum of edges) to move between a given source node and any destination node.  In order for Dijkstra's algorithm to work, none of the edges in the network can have a negative weight (or cost).

Looking at our sample graph, let's calculate a few shortest paths.

Dijkstra's algorithm gives us a way to compute the shortest path in a systematic fashion.  The pseudocode for the algorithm is defined below.  Before we go through the algorithm, let's make sure we understand the role of two maps (or, if you prefer, dictionaries) that we will be creating.  The first is called ``prev`` and it is used to reconstruct the shortest path once we find it.  The second is called ``dist`` and you can think of this as a tentative cost to travel from the start node to any particular node.  We'll also maintain a queue of nodes that we plan to visit.  This queue will be pretty similar to the one you implemented on the last assignment, but it will have an additional feature of adding elements with a particular priority.

```
for each vertex, v that is not the source:
    prev[v] ← UNDEFINED
    dist[v] ← INFINITY
    queue.addWithPriority(v, INFINITY)

dist[source] ← 0
queue.addWithPriority(source, 0)

while queue is not empty:
    u ← vertex in queue with min priority
    remove u from queue
    for each neighbor v of u still in queue:
        alt ← dist[u] + edgecost(u, v)
        if alt < dist[v]:
            dist[v] ← alt
            queue.changePriority(v, alt)
            prev[v] ← u
// reconstruct shortest path from prev
```
Now that we've seen this pseudocode, let's go through [our slides](graphsearch_slides.pdf) to see an example of it in action.

> **Exercise 1**
> 
> (a) How does this pseudocode differ from the approach we used last class (for DFS and BFS)?
> 
> (b) Suppose the pseudocode above has finished running, how would you reconstruct the shortest path from the vertex ``source`` to a vertex ``target`` using ``prev``?
{: .notice--success}


## Min-Heaps

A [binary heap](https://en.wikipedia.org/wiki/Binary_heap) is a data structure that is very useful for implementing the priority queue will need for Dijkstra's algorithm.

A heap is a special type of graph called a binary tree.

**Definition** A tree is a graph where there is a root node (one that has no incoming edges) and each vertex, besides the root, has exactly one incoming edge.  For a given node, $v$, if there exists an edge $p \rightarrow v$ we call $p$ the parent of $v$.  Nodes with no outgoing edges are called **leaves**.  The maximum length path (defined in terms of number of edges) from the root to any leaf is called the **height** of the tree.

**Definition** A binary tree is a tree where each node has at most two outgoing edges.  For a vertex, $v$, if $v \rightarrow u$ and $v \rightarrow q$ then we say that $u$ and $q$ are children of $v$. Sometimes we think of these children as ordered, and we'll refer to them as the left or right child of $v$.

An example of a binary tree is given below.

<div class="mermaid">
graph TB
  A --> B
  A --> C
  B --> D
  B --> E
  C --> F
  C --> G
</div>

A heap extends the concept of a binary tree by adding a number that accompanies each node.  Let's suppose in our example that each of the letters A through F in our sample graph above were assigned the following values (A: 5, B: 3, C: 4, D: 9, E: 1, F: 6).  The following would be a valid heap.

<div class="mermaid">
graph TB
E[E, 1] --> B[B, 3]
E --> C[C, 4]
B --> A[A, 5]
B --> F[F, 6]
C --> D[D, 9]
</div>

> The binary tree above is a heap because it meets two conditions.
>
> **Condition 1** the binary tree maintains the "heap-invariant", which is that for any two nodes, $u, v$ in the tree such that the edge $u \rightarrow v$ the number stored with $u$ is less than the number stored with $v$.  In plain-speak, for any node in the graph the number written next to it will be less than the numbers written next to any nodes below it.
>
> **Condition 2** the binary tree is nearly complete meaning that it has the minimum height for a tree with the specific number of nodes.
{: .notice--warning}

### Implementation: Inserting an element into the heap

When inserting an element into the heap, we put it in the tree at the lowest level in the first available spot (starting from the left).  Once we place it in the heap, we check to see if this placement has violated the heap invariant (condition 1).  If so, we swap the node with its parent.  We the nodes new parent to make sure the heap invariant is satisfied (swapping if it's not) and so on.  This procedure is called "bubbling up".

We'll do a quick example of bubbling up on the board.


### Implementation: Finding the vertex with the minimum corresponding number

This is super easy!  We just look at the root node.  It's guaranteed to be the minimum.  Quick understanding check: why is that?

### Implementation: Removing the minimum

To remove the minimum value we first replace the root node with the right most element of the lowest level of our tree.  We then perform a procedure called "bubbling down" where we check to see if the new root violates the heap invariant (condition 1).  If it is larger, then we swap it with the child with the smaller number.  After the swap we continue bubbling the element down until it no longer violates the heap invariant (condition 1).

We'll do a quick example of bubbling down on the board.

### Binary Heap Operations Complexity

Now that we know what a heap is, let's talk about the running time of various operations on a heap.

|--|--|
|Operation|Runtime|
---|-----
|Insert|$\Theta(\log n)$|
|Delete min|$\Theta(\log n)$|
|Find min|$\Theta(1)$|

> **Exercise 2** Why are these runtimes attractive from the perspective of implementing Dijkstra's algorithm?
{: .notice--success}

> **Exercise 3** What operation needed for Dijkstra's algorithm is not present in the list above?  How would you implement it?
{: .notice--success}

> **Exercise 4** Show why delete min, insert, and change heap number are all $\Theta(\log n)$.
{: .notice--success}

### Implementation considerations

Since this is part of the extra credit, I'll leave it to you to look into the details of this (there's a lot of explanations on the web / videos to watch).  Binary heaps are often implemented by storing the vertices of the heap in a list.  This might seem counterintuitive, but it presents a really elegant solution to some challenging aspects of implementing the heap: finding parents and children of a node, quickly swapping nodes in the tree, and inserting new values in such a way that condition 2 is maintained.


## Directed-Acyclic Graphs

A directed graph is acyclic if it contains no cycles.  A cycle is a path that starts at a given node and returns to that same node.  We use the acronym DAG (directed, acyclic graph) to refer ot this type of graph.  Here is an example of such a graph.

<div class="mermaid">
graph LR
  A --> B
  B --> C
  A --> C
  C --> D
  B --> D
  A --> E
</div>

As was included in the day materials last time (although there was not enough time to get to it), there are several algorithms to determine if a graph is a DAG.  One of the easier ones to understand is Kahn's algorithm, which has the following description from [the Wikipedia page on Topological Sorting](https://en.wikipedia.org/wiki/Topological_sorting). It turns out that a graph is a DAG if and only if there is a valid topological sorting of the nodes in the DAG.

> A topological sorting of a directed graph consisting of vertices $V$ and edges $E$ consists of an ordering of the vertices $v_1, v_2, \ldots, v_n$ such that the edge $v_i \rightarrow v_j$ exists in $E$ if and only if $i < j$.
{: .notice--warning}

Let's work as a class to determine a valid topological sorting of the graph above.  Is the sorting unique?

<button onclick="HideShowElement('HideShow1')">Show Solution</button>
<div id="HideShow1" style="display:none">
     A valid solution would consist of the order $A, E, B, C, D$.  For this graph, another valid topological sorting would be $A, B, C, D, E$.  (other sortings exist as well)
</div>


Kahn's algorithm can be used to determine if a directed graph has cycles or not.  The pseudocode for Kahn's algorithm is below.

```
L ← Empty list that will contain the sorted elements
S ← Set of all nodes with no incoming edge

while S is not empty do
    remove a node n from S
    add n to L
    for each node m with an edge e from n to m do
        remove edge e from the graph
        if m has no other incoming edges then
            insert m into S

if graph has edges then
    return error   (graph has at least one cycle)
else 
    return L   (a topologically sorted order)
```

Let's go through this example together to see how Kahn's algorithm works.

Let's try Kahn's algorithm on a graph that does contain a cycle to see what happens.

Input graph:
<div class="mermaid">
graph LR
  A --> B
  B --> C
  C --> D
  C --> B
  A --> D
</div>
$L = []$, $S = [A]$

After step 1:
$L = [A], S = []$
<div class="mermaid">
graph LR
  A
  B --> C
  C --> D
  C --> B
</div>

Question for us to work through together: How would we prove that Kahn's algorithm is correct?
