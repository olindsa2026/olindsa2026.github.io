---
title: "Assignment 4: Sorting Algorithms"
toc_sticky: true
published: false
due_on_class: 10
---

## Overview

This assignment is about implementing, benchmarking, and solving problems with sorting algorithms.

## Sorting Algorithm Implementation and Complexity Analysis

Implement at least four sorting algorithms.  For each sorting algorithm you implement, provide an analysis of its computational complexity.  At least one of your algorithms should be $\Theta(n \log n)$.

Here are some possible algorithms to implement.
* Heap sort
* Radix sort
* Insertion sort
* Selection sort
* Merge sort
* Quick sort


## Sorting Algorithm Benchmarking

Test the performance (meaning how long it takes for the code to run) of your sorting algorithms on sorting different sized lists of numbers.  Create some representation (e.g., a table or a plot) of the runtimes of the algorithms as a function of list size.  In a writeup (I would suggest a markdown file), discuss how you tested your algorithms (e.g., how you generated the lists to be sorted, how many times you performed each experiment).  Draw some conclusions based on your experiment (e.g., which algorithm seems faster and in which cases).

Tips 1: You should try running your algorithms on lists of vastly different sizes (think different orders of magnitude).  For example, try a lists of size $10$, $100$, $1,000$, $1,000,000$.

Tip 2: To generate your lists, you should consider using random numbers.  This code generated a list of ``desiredSize`` where each number is from 0 to 999.  Please adjust as you see fit.

```kotlin
// somewhere above you need: import kotlin.random.Random
val x = (1 until desiredSize).map { Random.nextInt(1000) }
```

Tip 3: to time your code, you can use the ``measureTime`` Kotlin function.
```kotlin
// somewhere above you need: import kotlin.time.measureTime
val runTime = measureTime {
    // put in call to your sorting algorithm here
}
println("my algorithm took $runTime to run")
```

Tip 4: it helps to automate as much of this as possible.  Here is some code that runs built-in sorting algorithm on a few different list sizes.
```kotlin
// somewhere above you need: import kotlin.time.measureTime
// somewhere above you need: import kotlin.time.DurationUnit
// somewhere above you need: import kotlin.random.Random

val runTimes = mutableListOf<Double>()
for (size in listOf(10, 100, 1000, 10000, 100000)) {
    val x = (1 until size).map { Random.nextInt(100000) }
    val runTime = measureTime {
        x.sorted()
    }
    runTimes.add(runTime.toDouble(DurationUnit.SECONDS))
}
println("Runtimes are $runTimes")
```



## New Frontiers in Sorting?

> This is now extra credit
{: .notice--warning}

Do some research to determine what new problems exist in terms of sorting.  In your writeup, discuss at least one variant of sorting that has active research.  Make sure you explain what solving this problem entails.  Read one research paper that is related to this sorting problem and summarize its contributions (you may not be able to understand the paper at full detail, but hopefully you can get the gist).

## Practice with the master theorem

> Time box this to an hour or so
{: .notice--warning}

Do [this worksheet](https://courses.csail.mit.edu/6.046/spring02/handouts/master.pdf) from MIT 6.046 by applying the master theorem.  There [are solutions available](https://courses.csail.mit.edu/6.046/spring02/handouts/mastersol.pdf) here.  Note that the master theorem doesn't apply to all of these problems, so if it doesn't fit the patterns, you can just say it doesn't apply (no need to try to work out the solution).

> Please ignore the part on the worksheet where it says you can go through the whole worksheet in 10 minutes!! Not the case!
{: .notice--danger}


## Turning in your work

Submit a link to a repository that has your code and writeup.  Make sure to add me ``paulruvolo`` as a collaborator if the repo is private.

## Assessment

See the rubric on Canvas.
