---
title: "Assignment 2: Linked Data Structures"
toc_sticky: true
published: false
due_on_class: 5
---

## Overview

In this assignment you will be implementing a doubly linked list in Kotlin.  You'll then utilize your linked list class to create both a queue and a stack.  Once you've done that, you can use your newly minted data structures to solve some code-interview style problems.

## Part 1: Doubly Linked List

Implement a doubly linked list in Kotlin.  Your class should work with any data type (use [Kotlin's generics](https://kotlinlang.org/docs/generics.html)).  Your linked list should implement the following interface (we use ``T`` to refer to the data type stored in the underlying linked list).

```kotlin
interface LinkedList<T> {
    /**
     * Adds the element [data] to the front of the linked list.
     */
    fun pushFront(data: T)

    /**
     * Adds the element [data] to the back of the linked list.
     */
    fun pushBack(data: T)

    /**
     * Removes an element from the front of the list. If the list is empty, it is unchanged.
     * @return the value at the front of the list or nil if none exists
     */
    fun popFront(): T?

    /**
     * Removes an element from the back of the list. If the list is empty, it is unchanged.
     * @return the value at the back of the list or nil if none exists
     */
    fun popBack(): T?

    /**
     * @return the value at the front of the list or nil if none exists
     */
    fun peekFront(): T?

    /**
     * @return the value at the back of the list or nil if none exists
     */
    fun peekBack(): T?

    /**
     * @return true if the list is empty and false otherwise
     */
    fun isEmpty(): Boolean
}
```

Make sure to include unit tests for each of these operations.  It's okay if a single unit test simultaneously tests multiple of these functions.

## Stack and Queue Abstract Data Types

The Stack abstract data type (ADT) can be represented by the following Kotlin interface.

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


The Queue abstract data type is:

```kotlin
interface Queue<T> {
    /**
     * Add [data] to the end of the queue.
     */
    fun enqueue(data: T)
    /**
     * Remove the element at the front of the queue.  If the queue is empty, it remains unchanged.
     * @return the value at the front of the queue or nil if none exists
     */
    fun dequeue(): T?
    /**
     * @return the value at the front of the queue or nil if none exists
     */
    fun peek(): T?
    /**
     * @return true if the queue is empty and false otherwise
     */
    fun isEmpty(): Boolean
}
```


## Stack and Queue Implementations

> **Exercise 1:** Using your linked list class as a data structure, create a class that implements the stack abstract data type.  Make sure to include unit tests to ensure your code is correct.  Since you are reusing your linked list class, you should not be implementing the stack operations from scratch (your functions should primarily be one-liners).
{: .notice--success}

> **Exercise 2:** Using your linked list class as a data structure, create a class that implements the queue abstract data type.  Make sure to include unit tests to ensure your code is correct.  Since you are reusing your linked list class, you should not be implementing the queue operations from scratch (your functions should primarily be one-liners).
{: .notice--success}

## Practice Problems with Stacks and Queues

These next problems are similar to the types of problems you might encounter in a technical interview.  You should work out a strategy for implementing all fo them, but you only need to implement one in Kotlin.

> **Exercise 3:** How would you reverse the elements in a stack (i.e., put the elements at the top of the stack on the bottom and vice versa)?  You can use as many additional stacks and queues as temporary storage in your approach.
{: .notice--success}


> **Exercise 4:** Come up with a strategy to solve the [valid parentheses problem](https://leetcode.com/problems/valid-parentheses/description/).
{: .notice--success}

> **Exercise 5:** Solve the copy stack problem (source: University of Washington CSE122)
>
> Given a stack return a copy of the original stack (i.e., a new stack with the same values as the original, stored in the same order as the
original). Your method should create the new stack and fill it up with the same values that are stored in the original stack.
>
> You may use one queue as auxiliary storage.
{: .notice--success}

> **Optional** problems you might check out (totally optional... let's find more together)
> * [Splice stack](https://courses.cs.washington.edu/courses/cse122/23wi/lectures/5/5.pdf)
> * https://leetcode.com/tag/queue/
> * https://leetcode.com/tag/stack/
> * https://leetcode.com/problems/simplify-path/
> * [Some practice problems](https://neetcode.io/roadmap) recommended by CA Eddy Pan! (click on Stack after following the link)
{: .notice--success}
