---
title: "Oral Quiz Practice Set 1"
toc_sticky: true
published: true
---

## Problem 1: Stack Code

Here is an implementation of a stack in Kotlin.  Explain how the code works.  Your response should touch on the role of ``T``, the definition of ``top`` (and why it has a nullable type), and how each of the functions works.

```kotlin
class MyStack<T>: Stack<T> {
    private class StackNode<T>(val data: T,
                               var next: StackNode<T>?)

    private var top: StackNode<T>? = null

    override fun push(data: T) {
        top = StackNode<T>(data, top)
    }

    override fun pop(): T? {
        val returnValue = top?.data
        top = top?.next
        return returnValue
    }

    override fun peek(): T? {
        return top?.data
    }

    override fun isEmpty(): Boolean {
        return top == null
    }
}
```


## Problem 2: Order of Growth

Explain why selection sort (finding the min and putting it at the beginning of the list, finding the second-smallest element and putting it in the second position in the list, etc.) is $\Theta(n^2)$.

Explain the merge sort algorithm and why it has a running time of $\Theta(n \log n)$.


## Problem 3: Binary Heaps

On the whiteboard, explain the concept of a binary heap.  Explain what the heap invariant property is.  Demonstrate how to insert a new element into a binary heap.  Explain why binary heaps are well-suited to implementing priority queues.

## Problem 4: Broken Dijkstra

The pseudocode for Dijkstra's algorithm is incorrect.  Explain what is wrong with it and how you would fix it.  The code finds the length of the shortest path from ``source`` to ``target``.

```
for each vertex, v that is not the source:
    dist[v] ← INFINITY
    queue.addWithPriority(v, INFINITY)

dist[source] ← 0
queue.addWithPriority(source, 0)

while queue is not empty:
    u ← pop min priority element from queue
    for each neighbor v of u still in queue:
        alt ← dist[u] + edgecost(u, v)
        if alt < dist[v]:
            dist[v] ← alt

return dist[target]
```