---
title: "Day 1: Course Intro and Welcome to DSA"
toc_sticky: true
---

Today we'll get oriented to the course, think about where algorithms show up in the world, and start designing and analyzing algorithms ourselves. You don't need prior experience with data structures or algorithm analysis for today's activities. The goal is to start developing the kinds of questions we'll ask throughout the semester.

## Let's Settle In and Meet Each Other
{% include activity-time.html time="1:00-1:10pm" %}

Find five people around you and form a group.  Have each person introduce themselves and say one thing they hope to 
get out of taking this class.

We'll have a few minutes for people to share what they heard in their groups.

## Course Structure and Major Topics
{% include activity-time.html time="1:10-1:20pm" %}

The goal of this course is for you to learn how to frame problems using the language of computation and select appropriate data structures and algorithms to solve them.  We'll get more into what we mean by framing problems later (there is an example later today), but for now I want to focus on the sorts of problems we will be tackling and the algorithmic strategies we will be using to solve them.

### Data Structures

* Before talking about data structures, let's talk about data.  What sorts of data do we need to consider when designing computer algorithms?
* Data structures as supports for algorithms.  Ultimately, data structures are useful to solve certain problems.  There are many properties we might care about when we select a data structure.  Can we brainstorm some of these properties as a class?
* We'll be learning about basic linked data structures (linked lists, stacks, queues), data structures to represent graphs and trees (e.g., binary search trees or heaps), and data structures that use hashing to index and retrieve data.

### Algorithmic Design Patterns

While each algorithm must be tuned to the particular problem being solved, there are general algorithm types that we will encounter (e.g., some algorithms work by breaking a larger problem into smaller instances, some use a greedy approach, others are based on backtracking or graph search).

### Analyzing Algorithms

We want to develop ways to talk about the time (how long it takes to compute a solution) and space (how much space is needed in a computer's memory to compute a solution) complexity of algorithms.  We can look at these factors with both theoretical (e.g., doing some analysis to understand how long an algorithm runs based on the problem size) and empirical tools (e.g., measuring the actual time it takes an algorithm to run on a computer).

### Specific Algorithms

Of course, we will learn about specific algorithms.  We'll see algorithms from graph theory, string matching, bioinformatics, sorting, matrix multiplication, backtracking, and artificial intelligence.

### Applications of Algorithms

We'll see some instances of how particular algorithms can be applied to solve problems in specific fields (e.g., text retrieval and indexing, bioinformatics).

### Algorithmic Deep Dive

You'll be able to customize the course by taking a deep dive into a new algorithm or algorithms topic that we did not cover in the class.

### Implementation and Testing

In order to solidify your understanding of the material and improve your ability as a developer, we will be 
implementing many of our algorithms and data structures.  We'll focus on creating unit tests as a way to create more 
maintainable and testable code.  We'll also be thinking about how developments in agentic coding tools might 
intersect with these workflows.

## Algorithms in the World
{% include activity-time.html time="1:20–1:40pm" %}

Choose **two** areas below. If possible, choose at least one that you don't already know much about.  For each problem area you choose to look into:

* What problem does the algorithm solve?
* List the metrics that an algorithm designer might care about when creating an algorithm of this type.
* List at least two examples of how algorithms of this type are used in the world (applications).

Some examples of algorithms are listed below.
* Data Compression (lossless or lossy)
* Collaborative filtering (e.g., as used in recommender systems)
* Encryption
* Routing (e.g., of Internet traffic or for navigation instructions)
* [Task Assignment](https://en.wikipedia.org/wiki/Assignment_problem)
* Sorting
* Matrix Multiplication
* Fourier Analysis
* Semantic search
* (come up with your own.... there are so many!)

> Bonus question: list all the algorithms that you and your team have interacted with since you got up this morning.


## Having Some Fun With Algorithms

{% include activity-time.html time="1:40pm-2:20pm" %}

> Note: this is an open-ended exercise that I do not expect you to complete within the 40 minutes. If you do not complete it during class, that's okay.  You will be asked to implement a solution to some of these problems for your homework.

***Quantifying Runtime***

In this class we're going to be reasoning about the efficiency of our algorithms with respect to the size of the problem they are solving.  For instance, if we feed $n$ pieces of information into an algorithm, how many operations does it take the algorithm to compute a solution?  Depending on how the algorithm works, this might take $n^2$ operations (e.g., if we had to check all pairs of inputs against each other) or $n$ operations (e.g., if we only had to scan the inputs once).  In the problems below, you'll want to come up with a procedure for solving the problem and also determine how many operations the algorithm would take to compute an answer as a function of $n$.  We're mainly interested in how the amount of work grows as $n$ gets larger, rather than getting an exact instruction count.  If you have any questions about what counts as an operation, just ask (or make an assumption, note it, and move forward).

Work through the meeting scheduler problem with a group of people sitting near you.  The goal here is not for you to be able to jump right to the answer, but to break down the problem and discuss it with those around you.

> Hint: For these problems, you may assume that $n$ items can be sorted in $n \log n$ time (which is smaller than $n^2$). You do not need to know *how* the sorting algorithms works right now.


### Meeting Scheduler

Suppose you are implementing a piece of scheduling software.  Your system will take in a list of meetings (each meeting includes a start and end time) and compute various properties.

As an example, your program may receive the following meeting list.  For simplicity, you can assume these meeting
times are all on the same day.  We'll use 24-hour time to avoid any issues with am and pm.

> Meeting A: 10:00–11:00
>
> Meeting B: 10:15–10:45
>
> Meeting C: 13:30–14:00

Together with your group, you'll go through a series of problems.  For each problem:

* Make sure everyone in your group understands the problem.
* Come up with an algorithm that solves it.
* Explain your algorithm clearly (probably write it on the board).  You do not need to write code, but your description should be unambiguous.
* Determine how many operations your algorithm performs to compute a solution as a function of the number of meetings, $n$. Building on what we said before, don't worry about figuring out the number of operations exactly (e.g., you don't need to say that it takes $3n + 5$ operations, but instead you can say it takes on the order of $n$ operations).

**Problem 1:** Find the longest meeting

Given a list of meetings, find the meeting with the longest duration.

Questions to consider:

* How many meetings does your algorithm need to look at?
* How many operations does your algorithm take to compute a solution?  What is your definition of a single operation?
* Could an algorithm always solve this problem without looking at every meeting?

**Problem 2:** Are there any conflicts?

Given a list of meetings, determine whether any two meetings overlap.

For example:

> 10:00–11:00
>
> 13:00–14:00
>
> 10:45–11:30

The first and third meetings overlap, so the answer is yes.

In contrast:

> 10:00–11:00
>
> 11:00–11:30
>
> 13:00–14:00

has no conflicts. For this problem, assume that a meeting ending exactly when another begins does not count as an overlap. You may find it useful to define some notation to keep track of the start and end times of each meeting.

Questions to consider:

* What is the most straightforward algorithm you can think of?
* In the worst case, how many pairs of meetings might it examine?
* Can you reorganize the meetings in a way that makes conflicts easier to detect? Given this new method, can you guarantee that you will always find a conflict if one exists?

**Problem 3:** How many meetings happen at once?

Sometimes knowing that some meetings conflict isn't enough. Suppose you want to know how busy the schedule gets at its busiest point.

Given a list of meetings, determine the maximum number of meetings that are happening simultaneously.

For example:

> A: 10:00–11:00
>
> B: 10:15–10:45
>
> C: 11:15–12:00
>
> D: 10:30–11:30

Between 10:30 and 10:45, meetings A, B, and D are all happening Therefore, the maximum number of simultaneous  meetings is 3.

Questions to consider:

* How could you determine how many meetings are happening at a particular moment?
* What are the important moments when the number of active meetings can change?
* Can you process those moments in a useful order?

**Problem 4:** Assign the rooms

Given a list of meeting rooms (e.g., Room 1, Room 2, Room 3), assign rooms to each meeting so that you use the fewest number of rooms possible.

For example, your output might look something like:

> Meeting A → Room 1
>
> Meeting B → Room 2
>
> Meeting C → Room 2
>
> Meeting D → Room 3

Your assignment must satisfy two conditions:
* Overlapping meetings cannot be assigned to the same room.
* You use as few rooms as possible.

Can you develop an algorithm that always produces a valid assignment using the minimum possible number of rooms?


## Discussion of Learning Strategies and Oral Quizzes
{% include activity-time.html time="2:20pm-2:30pm" %}

Next, I want to discuss two interrelated issues.  The first is how you can work in a way that best supports your learning this semester.  The second is how I can provide an assessment structure that provides you with useful feedback.

Twice this semester, I will meet with each of you for an oral quiz (each quiz is worth 10% of your grade).  I intend for this structure to give you a useful measurement of your progress over the semester.  I used oral quizzes for the first time last time I taught this course, and they were well-received.  I want to give you all a chance to weigh in on the specific design (see below) to see if I should make any adjustments.


| *Activity* | *What's Being Assessed* |
| You are given a problem to solve. As you work towards a solution, you show / discuss your thought process. | Your ability to select appropriate data structures and algorithms to solve a problem. |
| You are asked to explain a section of code from one of your submitted assignments. | Your ability to internalize, and be able to verbalize to others, the coding choices you made. |
| You are asked to give a whiteboard talk explaining one of the class concepts. | Your fluency with the concepts in the course, your ability to distill down the important bits, and your ability to communicate clearly about course concepts. |
| You are given an implementation of a particular algorithm, and you must work through whether the code is correct. If it is not correct, you may suggest corrections. | Your ability to comprehend code that you didn't write (e.g., from a co-worker or from an AI agent) and assess its correctness. |

With some folks around you, please discuss the following.
1. What are some learning strategies that have worked particularly well for you in the past?  Do you think they will work well in this course?
2. Will you use AI-based coding assistants in this course?  How will you use them to ensure you are getting the knowledge you'd like from the course?
3. In reaction to the table above, what other activities would be useful to include in an oral quiz and what skill would they be assessing? How would you rank the four items in the list above from most to least helpful in you assessing your progress in the course?

## Orientation to Assignment 1

{% include activity-time.html time="2:30pm-2:35pm" %}

Let me show you [the first assignment](/assignments/assignment_01) (due a week from this Thursday).

## Turning in your work

{% include activity-time.html time="2:35pm-2:40pm" %}

Please respond to the prompts the [Canvas day page](https://olin.instructure.com/courses/1069/assignments/19928) to complete your 
assignment for today.