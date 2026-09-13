---
title: "Day 4: Stack Implementation Walkthrough and Challenge Problems"
toc_sticky: true
published: true
---

## Overview

We'll begin by looking back at the linked list content we missed last class (hopefully, you looked through it or watched the video I posted).

We're going to take some time to dive into an implementation of a data structure: the Stack.  We'll get started together, and then I'll let you all split off to work at your own pace.

## Implementing a Stack Together

We're going to go through the process of implementing a stack as a class.  Once we get through this example, we should have lots of time for folks to ask questions or keep working on the homework.

The steps we will go through will involve creating a new project, creating a stack class, adding some basic functions, and testing our code through unit tests.

The definition of the stack abstract datatype (ADT) can be defined using this Kotlin interface (this is directly from the current assignment).

```kotlin
interface Stack<T> {
    /**
     * Add [data] to the top of the stack
     */
    fun push(data: T)
    /**
     * Remove the element at the top of the stack.  If the stack is empty, it remains unchanged.
     * @return the value at the top of the stack or nil if none exists
     */
    fun pop(): T?
    /**
     * @return the value on the top of the stack or nil if none exists
     */
    fun peek(): T?
    /**
     * @return true if the stack is empty and false otherwise
     */
    fun isEmpty(): Boolean
}
```

Let's create an implementation of this ADT together.  **Note: in contrast to what you should do on the homework, which is to use a doubly linked list to create your stack, here we will implement the stack directly**.

[A sample solution](https://github.com/OlinDSA2025/SampleSolutions/tree/main/Class04) can be found in the course solutions repo.

## Additional Practice Problems

If you already feel good about implementing a stack.  Here are some suggestions for taking the material farther.  I invite those who are interested in this to move to MAC326 to work with others in that room.


> **Optional Exercise**
> 
> Create a class called ``MutableStringList`` that implements the following Kotlin interface.  You should use [Kotlin arrays](https://kotlinlang.org/docs/arrays.html) to store the entries of the list and implement a strategy where you double the size of the underlying array when you run out of space (since we know from last time that this has better $\Theta$ run time).  A [sample solution for this optional problem](https://github.com/OlinDSA2025/SampleSolutions/tree/main/Class04Optional) (with unit tests left as an exercise to you all) is in the class sample solutions repo.
> 
> ```kotlin
interface MutableStringList {
    /**
     * Adds [data] to the end of the list
     */
    fun add(data: String)
    /**
     * Returns the number of elements in this collection.
     */
    fun count(): Int
    /**
     * Return the element at the specified index
     *
     * @return the value if it exists.   The behavior is undefined if the value does not exist.
     */
    operator fun get(index: Int): String
    /**
     * Set the element at the specified index.  If the index does not exist, the behavior is undefined.
     */
    operator fun set(index: Int, value: String)
}
```
>
> As an additional challenge, show, through timing your code on values of $N$ of different orders of magnitude, that the cost to add $N$ elements to your mutable list is $\Theta(N)$.
{: .notice--success}

> **Optional Exercise**
> 
> Building off the suggestions in the assignment, try some LeetCode-style problems taht use stacks, queues, or linked lists.
{: .notice--success}