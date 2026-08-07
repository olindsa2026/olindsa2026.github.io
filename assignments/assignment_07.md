---
title: "Assignment 7: Associative Arrays and Applications"
toc_sticky: true
published: false
due_on_class: 18
---

## Overview

In this assignment you will explore the idea of associative arrays and how they can be implemented using hash tables.  You will then use your associative array to implement a data compression algorithm!

## Associative Arrays

Create an associative array class that implements the following interface.

```kotlin
/**
 * Represents a mapping of keys to values.
 * @param K the type of the keys
 * @param V the type of the values
 */
interface AssociativeArray<K, V> {
    /**
     * Insert the mapping from the key, [k], to the value, [v].
     * If the key already maps to a value, replace the mapping.
     */
    operator fun set(k: K, v: V)

    /**
     * @return true if [k] is a key in the associative array
     */
    operator fun contains(k: K): Boolean

    /**
     * @return the value associated with the key [k] or null if it doesn't exist
     */
    operator fun get(k: K): V?

    /**
     * Remove the key, [k], from the associative array
     * @param k the key to remove
     * @return true if the item was successfully removed and false if the element was not found
     */
    fun remove(k: K): Boolean

    /**
     * @return the number of elements stored in the hash table
     */
    fun size(): Int

    /**
     * @return the full list of key value pairs for the associative array
     */
    fun keyValuePairs(): List<Pair<K, V>>
}
```

Your associative array should use separate chaining and the division-based method for hashing (consider using this resource [to determine primes to use in your hashing function](https://planetmath.org/goodhashtableprimes)).  Your code should handle rehashing as the number of elements stored in your associative array grows.

You will almost certainly need to create additional classes and/or functions to implement the associative array (don't assume that the list of functions above is sufficient).

Make sure your code is documented and has sufficient unit tests (the specific number and nature of the unit tests is up to you).

## Solving Problems with Hashing

Choose one of these two problems to solve with hashing.  Note: you will also do a very brief writeup on your results from this, so make sure to look in the deliverables section for this.

### Option 1: Lempel-Ziv

Implement the Lempel-Ziv algorithm for lossless data compression.  There are a lot of resources for learning this. Here are some that I've found useful so far (please share more).
* [Peter Schor's notes](https://math.mit.edu/~djk/18.310/Lecture-Notes/LZ-worst-case.pdf)
* [Lempel Ziv Algorithm Video](https://www.youtube.com/watch?v=hHQgu4qILGs)

You should at least write the encoding part.  If you write the decoder, you can get 2 points of extra credit.

### Option 2: Markov Text Analysis

Download a text from some source (e.g., Project Gutenberg) and create a Markov model.  That is, given any word in the text, you should be able to return the number of times each word follows the given word in the text.  If you want to have some more fun with it, you could do a Markov Text Generator (a la Allen's Think Python, e.g.).

Markov text analysis is very useful for applications like predictive text completion (e.g., in texting or emailing).

## Modifications (for additional challenge, not required)

1. Choose a different hashing function to explore.
2. Do some benchmarking (meaning measure the time it takes for your code to run on a computer) to see how sensitive the performance of your associative array is to different choices for number of bins (e.g., using a power of 2 instead of a prime number).
3. As mentioned earlier, the decoder for the Lempel-Ziv algorithm is extra credit.  If you do something else that is above and beyond what is written here, let me know, and we can discuss extra credit.

## Deliverables

Turn in a link to a GitHub repo with your deliverables.

### Code

Your code contain the associative array data structure as well as the application to text processing.  Make sure your code is documented and has unit tests.

### Writeup

Include a brief writeup of the results you got applying associative arrays to solving a problem.  For example, if you did Lempel-Ziv, you might run it on several different input texts and discuss how much the algorithm compresses the data.  You can include the writeup as a markdown file in your repository.
