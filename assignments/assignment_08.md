---
title: "Assignment 8: K-D Trees and Nearest Neighbor Search"
toc_sticky: true
published: false
due_on_class: 20
---

## K-D Trees and Nearest Neighbor Search

For this assignment you will be implementing a [K-D tree](https://en.wikipedia.org/wiki/K-d_tree) and comparing its performance to a brute force method for nearest neighbor searching.

The assignment will have three parts.

### Part 1: K-D Tree and Brute Force Nearest Neighbor Implementation

Create an implementation of a K-D tree.  Your tree should be able to work with points of any dimension ($k$).  You can assume a Euclidean distance as the measure of similarity.

**You should support the following capabilities.**
* Starting from an empty tree and given a list of k-dimensional points, build a K-D tree.
* Given a single, k-dimensional query point, return the nearest neighbor in the K-D tree (you must use the structure of your tree and not default to brute force search).

**You DO NOT need to support any of the following capabilities**
* Incrementally add new points to your K-D tree
* Delete points from your K-D tree
* Look for nearest neighbors of multiple points simultaneously

**For extra credit you can implement the following**
* 1 point of extra credit: implement the [Quickselect method](https://en.wikipedia.org/wiki/Quickselect) ($\Theta(n)$ runtime versus the typical $\Theta(n \log n)$) for median finding.

**For your brute force search, you must support the following capability**
* Given a list of k-dimensional points and a query, return the closest point to the query.  The brute force approach involves searching through every point and calculating its distance to the query.

### Part 2: Benchmarking Infrastructure

Create a function called ``runExperiment`` with the following capabilities.

```kotlin
/**
 * Benchmark [KDTree] against brute force nearest neighbor.
 * 1000 test points will be generated to test against the training
 * points.
 *
 * @param k: the dimensionality of the dataset to create
 * @param numPoints: the number of points to use to match against
 *   (1000 test points will be used)
 * @return the triple of [Duration] objects where the first specifies
 * the time to build the tree, the second specifies the time it takes
 * to query the tree with 1,000 points, and the third is the time it
 * takes to find the nearest neighbor to these points using the brute
 * force approach.
 */
fun runExperiment(k: Int, numPoints: Int): Triple<Duration, Duration, Duration> {
    // your implementation here
}
```

You can create the data points using a random number generator.

In your ``fun main()``, use nested loops to test various values of ``k`` and ``numPoints``.  Make sure you allow ``numPoints`` to range over different orders of magnitude (e.g., 10, 100, 1000, 10000) rather than over a linear range (e.g., 10, 20, 30, 40).

### Part 3: Running Some Experiments

In a markdown file or other document format, use your code from parts 1 and 2, run some experiments to compare the performance of brute force search to your k-d tree.  Write up your data in a clear manner (either a table or a plot).  In a brief report, summarize the situations where k-d trees are superior to a brute force search.
