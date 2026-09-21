---
title: "Day 6: Graph data structures, depth-first and breadth-first search"
toc_sticky: true
published: true
---


## Adjacency Lists 

Let's take some time to familiarize ourselves with one way of representing a graph in a computer program: the [adjacency list](https://en.wikipedia.org/wiki/Adjacency_list).

Let's take a few minutes as a class to make sure we understand what we mean by adjacency list.

To get us on the same page let's use the following definition of a Graph.  We're using ``MutableSet`` and ``MutableMap`` because it allows us to efficiently either test membership (in the case of a set) or look up an associated value (in the case of the map).

```kotlin
class Graph<VertexType> {
    private var adjacencyList: MutableMap<VertexType, MutableSet<VertexType>> = mutableMapOf()

    fun addVertex(v: VertexType): Boolean {
        if (adjacencyList.contains(v)) {
            return false
        }
        adjacencyList[v] = mutableSetOf()
        return true
    }

    fun addEdge(from: VertexType, to: VertexType): Boolean {
        val adjacentVertices = adjacencyList[from]
        if (adjacentVertices != null && adjacencyList.contains(to)) {
            adjacentVertices.add(to)
            return true
        }
        return false
    }

    fun getEdges(from: VertexType): Set<VertexType> {
        // Note: Elvis operator gives us a value if left hand expression is null
        return adjacencyList[from] ?: setOf()
    }
    
    fun clear() {
        adjacencyList.clear()
    }
}
```

## Graph Traversal

One of the most important graph algorithms is the concept of searching for a path that connects two nodes within a graph.  This concept is known as [Graph Traversal](https://en.wikipedia.org/wiki/Graph_traversal) or Graph Search.

Within the space of graph traversal, there are a number of useful problems we might solve.
* [Shortest path](https://en.wikipedia.org/wiki/Shortest_path_problem) (finding the path between two nodes with the least cost)
* [Traveling salesman problem](https://en.wikipedia.org/wiki/Travelling_salesman_problem)
* [Hamiltonian path](https://en.wikipedia.org/wiki/Hamiltonian_path)
* [Eulerian path](https://en.wikipedia.org/wiki/Eulerian_path)
* ... (many more)

In this class we will be mainly concerned with the shortest path problem.

There are tons of problems that can be cast as graph traversal problems.  Let's think of a few as a class.  To get us started what are some problems that can be converted into graphs?

We're going to learn about four different methods for graph traversal in this class: breadth-first search, depth-first search, Dijkstra's algorithm, and A-Star search. Today, we'll talk about the first two.

### Breadth-First Search (BFS)

Starting from some node in our graph, let's call it ``root``, we want to keep following edges until we find our node ``target``.  Our search proceeds by following all edges from the current node.  Once we've followed all of those edges, we follow edges from current to the next node, we follow edges from that set of nodes, etc. We do this until we find ``target`` or run out of nodes to visit.

### Depth-First Search (DFS)

Starting from some node in our graph, let's call it ``root``, we want to keep following edges until we find our node ``target``.  Our search proceeds by continuously following edges until we reach a point where no edges are available to traverse.  At that point, we can back track on our path and visit the next edge.

### General Approach to Graph Traversal

Our algorithms for graph traversal are all fairly similar.  The two we're going to learn about today can be described using the following framework.

```
toVisit ← {}
priorityList ← []

priorityList.add(root)
toVisit.add(root)

while priorityList is not empty:
    n ← priorityList.popHighestPriorityElement()
    if n == target:
        return true // path exists
    for m in nodesConnectedTo(n):
        if m is not in toVisit:
            priorityList.add(m)
            toVisit.add(m)

return false // no path
```

> **Exercise 1:**
>
> Looking at the pseudocode above, what is the role of the variable ``toVisit``?  What might happen if we removed it?
{: .notice--success}


> **Exercise 2:**
> Sometimes it's also useful to be able to return the actual path that would be needed to go from the starting ``root`` to ``target``.
> How could we modify the pseudocode to be able to return the path from ``root`` to ``target``?
>    <button onclick="HideShowElement('HideShow0')">Show / Hide Hint</button>
>    <div id="HideShow0" style="display:none">
         You may find MutableMap to be useful here.
>    </div>
{: .notice--success}


> **Exercise 3:**
>
> Given the pseudocode above and the ``Graph`` class, implement breadth-first search (BFS).  You can choose how you define your function, but perhaps add it as a new function of ``Graph``.  I recommend you start with some pseudocode before firing up IntelliJ.  Here is a potential function signature for ``bfs``
>    ```kotlin
> /**
>  * Search through a graph using a breadth-first search
>  * @param start the node to start the search
>  * @param target the node to search for
>  * @return true if and only if path exists between [start] and [target]
>  */
> fun bfs(start: VertexType, target: VertexType): Boolean
>    ```
> For added challenge, you can return the path from ``start`` to ``target`` (rather than just indicating if it is possible).
>    ```kotlin
> /**
>  * Search through a graph using a breadth-first search
>  * @param start the node to start the search
>  * @param target the node to search for
>  * @return the path from start to target (if one exists) and null otherwise
> */
> fun bfs(start: VertexType, target: VertexType): List<VertexType>?
>    ```
>    <button onclick="HideShowElement('HideShow1')">Show / Hide Hint</button>
>    <div id="HideShow1" style="display:none">
         Think about which data structures you've learned about would achieve the desired prioritization of nodes.
>    </div>
{: .notice--success}


> **Exercise 4:**
>
> Given the pseudocode above and the ``Graph`` class, implement depth-first search (DFS).  You can choose how you define your function, but perhaps add it as a new function of ``Graph``.  I recommend you start with some pseudocode before firing up IntelliJ.  Here is a potential function signature for ``dfs``
>    ```kotlin
> /**
>  * Search through a graph using a depth-first search
>  * @param start the node to start the search
>  * @param target the node to search for
>  * @return true if and only if path exists between [start] and [target]
> */
> fun dfs(start: VertexType, target: VertexType): Bool
>    ```
> For added challenge, you can return the path from ``start`` to ``target`` (rather than just indicating if it is possible).
>    ```kotlin
> /**
>  * Search through a graph using a depth-first search
>  * @param start the node to start the search
>  * @param target the node to search for
>  * @return the path from start to target (if one exists) and null otherwise
> */
> fun dfs(start: VertexType, target: VertexType): List<VertexType>?
>    ```
>    <button onclick="HideShowElement('HideShow2')">Show / Hide Hint</button>
>    <div id="HideShow2" style="display:none">
         Think about which data structures you've learned about would achieve the desired prioritization of nodes.
>    </div>
{: .notice--success}

### Visualizations of Graph Traversal

Here are some resources for visualizing graph searching algorithms.
* [Stanford SAILORS tutorial on breadth-first search](https://cs.stanford.edu/people/abisee/tutorial/bfs.html)
* [Stanford SAILORS tutorial on depth-first search](https://cs.stanford.edu/people/abisee/tutorial/dfs.html)
* [Stanford SAILORS tutorial on comparing DFS and BFS](https://cs.stanford.edu/people/abisee/tutorial/bfsdfs.html)

## Graph Properties

We probably won't have a ton of time to work with these during class today, but here are some useful properties of graphs.  If you have time, go ahead and implement (either in pseudocode or Kotlin) one or more of them.

### Number of Connected Components

For an undirected graph (where ``A`` connected to be ``B`` is implies ``B`` connected to ``A``), a connected component is a set of vertices such that there is a path between any two vertices in the set.  If all vertices in a graph are connected, we would say the graph has 1 connected component.  On the other hand, if there are some vertices that are not reachable from each other, that would create additional components.

Suppose you were given a ``Graph`` object where you were guaranteed that all edges were symmetric (``A`` connected to ``B`` implies ``B`` connected to ``A``).  Write pseudocode to determine the number of connected components in your graph.

### DAGs (Directed, Acyclic Graph)

A directed graph is acyclic if it contains no cycles.  A cycle is a path that starts at a given node and returns to that same node.

There are several algorithms to determine if a graph is a Directed Acyclic Graph (DAG).  One of the easier ones to understand is Kahn's algorithm, which has the following description from [the Wikipedia page on Topological Sorting](https://en.wikipedia.org/wiki/Topological_sorting). It turns out that a graph is a DAG if and only if there is a valid topological sorting of the nodes in the DAG.

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

### Trees

An undirected graph is a tree if there is exactly one path between any pair of nodes.  This is guaranteed if the graph is connected and the total number of edges if equal to the number of vertices minus 1.

A directed graph is a tree if it is acyclic and the graph the results from making the edges undirected is a tree.

## Sample Solutions

Sample solutions for today are in [the Github repo](https://github.com/OlinDSA2024/DSA2024InClass) as a module.
