---
title: "Day 18: Nearest Neighbor Search and K-d Trees"
toc_sticky: true
published: true
---

## Nearest Neighbor Search

> Nearest neighbor search (NNS), as a form of proximity search, is the optimization problem of finding the point in a given set that is closest (or most similar) to a given point. Closeness is typically expressed in terms of a dissimilarity function: the less similar the objects, the larger the function values.
>  -- [Wikipedia page on Nearest Neighbor Search](https://en.wikipedia.org/wiki/Nearest_neighbor_search)

This algorithm is handy in a wide variety of data analysis, computer graphics, video game, computer vision, and machine learning tasks.  Specific examples include data classification, clustering, template matching, photogrammetry, and 3D modeling.

The nearest neighbor algorithm consists of a set of training points $x_1, \ldots, x_n$ with each $x_i \in \mathbb{R}^k$ (i.e., each point has $k$-dimensions).

Given a query point, $x_q$ (with $x_q \in \mathbb{R}^k$), the nearest neighbor is defined as the closest point in our set of training points, where closeness is given by some distance function.  The distance function could be Euclidean distance, Manhattan distance, or something more exotic.

> **Exercise 1**
> 
> What is the time complexity, $\Theta$, of finding the nearest neighbor to the query point in terms of the number of training points $n$ and the dimensionality $k$ of the data?
> 
> How does this time complexity compare to the special case of using a red-black tree for the special case of $k=1$?
{: .notice--success}

## K-d Trees (construction)

Given the fact that we were able to dramatically speed up our search for the closest point in 1-dimension with the Red-Black tree, it is natural to ask the of question of whether there is a way to use the same ideas to speed up the search for the nearest neighbor to some query point.  The answer to this question is "yes... maybe".  Next, we'll see a structured called [K-d trees](https://en.wikipedia.org/wiki/K-d_tree), which can, in some conditions, speed up nearest neighbor search.


> **To build a K-d tree**, we are given a set of $k$ dimensional points (e.g., represented in Kotlin as an ``Array`` of ``DoubleArray`` objects). The algorithm works as follows.
>
> Compute the median along dimension 0.  Divide your points into two sets.  The first set consts of those points whose value along the $0$th dimension is less than the median.  The second set consists of those points whose value along the $0$th dimension is greater than or equal to the median.
> 
> Recurse on each of the two sets.  That is, you will want to repeat the procedure above but use only those points in a particular set and this time choose the $1$st dimension to split on.
> 
> Continue recursing until there is just a single in a set.  As you recurse increment the dimension to split on by 1.  If you run out of dimensions, split on dimension 0 again.
{: .notice--warning}

> **Exercise 2**
> 
> Create a k-D tree from given the following points.  Sketch your result on a whiteboard.
> $x_1 = (1, 5), x_2 = (-1, 2), x_3 = (4, 4), x_4 = (2, 0), x_5 = (-3, -3), x_6 = (9, 1), x_7 = (4, 1), x_8 = (3, 8)$
>
>    <div id="plot"></div>
>    <script>
  // Define the points
  const points = {
     x1: [1, 5],
     x2: [-1, 2],
     x3: [4, 4],
     x4: [2, 0],
     x5: [-3, -3],
     x6: [9, 1],
     x7: [4, 1],
     x8: [3, 8]
  };
  // Extract x, y, and labels
  const xs = Object.values(points).map(p => p[0]);
  const ys = Object.values(points).map(p => p[1]);
  const labels = Object.keys(points);
  // Create the scatter plot trace
  const trace = {
    x: xs,
    y: ys,
   text: labels, // optional: subscript style
   mode: 'markers+text',
   textposition: 'top center',
   marker: { size: 10, color: 'blue' },
  type: 'scatter'
  };
  const layout = {
    title: '2D Points for k-D Tree Construction',
  autosize: false, // prevent Plotly from resizing layout dynamically
  width: 600,
  height: 600,
    xaxis: { title: 'x₁', scaleanchor: 'y', scaleratio: 1, range: [-5, 10], fixedrange: true },
    yaxis: { title: 'x₂', scaleanchor: 'x', scaleratio: 1, range: [-5, 10]},
  };
  Plotly.newPlot('plot', [trace], layout);
>    </script>
{: .notice--success}

{% capture solution %}
Once you've built your tree by hand, check it with this interactive builder. Hover over a region to preview a splitting line, then click (or drag and release) to split it. Points with a value less than the split go to the left child; points with a value greater than or equal to it go to the right. Keep splitting until each region has one point, then click **Show decision tree** to see the logic of your splits.

Try some non-median splits too and see how the shape of the tree changes.

<div class="kdtree-builder" data-range="-5,10" data-points='{"x1":[1,5],"x2":[-1,2],"x3":[4,4],"x4":[2,0],"x5":[-3,-3],"x6":[9,1],"x7":[4,1],"x8":[3,8]}'></div>
<script src="{{ '/assets/js/kdtree-builder.js' | relative_url }}"></script>
{% endcapture %}
{% include solution.html content=solution label="Solutions and Interactive Builder" %}

> **Exercise 3**
> 
> How would you represent this tree in a programming language?  What classes would you use?  What would the basic flow be of your function to construct the tree? Don't start coding!  Sketch it out with people around you.
{: .notice--success}

## k-D Tree Search

Next we're going to work on the problem of how to search through a k-D tree to find the closest point to a query.  Instead of giving you the procedure, let's go through a series of exercises to discover it ourselves.

> **Exercise 4**
> 
> Let's start by searching using a strategy similar to how we would search through a binary search tree.  Given a query point $x_q$, go through your tree by comparing the appropriate dimensions of $x_q$ to the median computed along that dimension when constructing the tree.  When you arrive at a leaf node, return the point stored there as your nearest neighbor.
> 
> Given the points in exercise 3 (or come up with your own), show the result of running that procedure on some input.
> 
> Can you construct an input where the procedure would return the incorrect nearest neighbor?
{: .notice--success}

> **Exercise 5**
> 
> In order to fix the procedure in exercise 4, we are going to have to consider searching through other branches of our tree.
> 
> Suppose you follow your procedure from exercise 4, and when you get to a leaf, you store the point and the distance from the query to that point.  Now pop up to the previous node, determine a test you can perform to see if it's worth searching the branch you haven't searched yet.
{: .notice--success}

## Approximate Nearest Neighbor (ANN) Search

You might ask whether there is a way to get a speedup to your nearest neighbor search even when the data dimensionality is large.  It turns out that there is a very active field of research into *approximate nearest neighbor search* (ANN).  If you are willing to live give up the guarantee that the value returned will always be the closest point, you can get [a substantial speedup](https://ann-benchmarks.com/glove-100-angular_10_angular.html).

The graph linked on this page shows the recall rate and the number of queries per second for a given algorithm.  In this experiment, recall means the probability that one of the actually 100 nearest neighbors to a point was included in the list of the 100 nearest neighbors returned by a particular ANN algorithm (1.0 is perfect).  Higher queries per second (y-axis indicates better efficiency).

How do these techniques work?  It is an area that I don't have a lot of familiarity with, so I can only tell you a bit (maybe this could be a topic for a final project?).  One technique that I did want to highlight since it touches on the course material, is [locality-sensitive hashing](https://en.wikipedia.org/wiki/Locality-sensitive_hashing).  There is a really nice writeup of doing [locality-sensitive hashing on text data at Pinecone.io](https://www.pinecone.io/learn/series/faiss/locality-sensitive-hashing/).

The one thing I wanted to highlight is the difference between locality-sensitive hashing (LSH) and the sort of hashing we do in the creation of a hash map.  In direct opposition to what you want in creating a hash map, In the case of LSH you want to maximize the chance of collision (when you have similar data).  By maximizing collisions between similar inputs, you have a chance can quickly narrow down your nearest neighbor search by applying your hash function and looking in the returned bin.

I have created a [Colab notebook](https://colab.research.google.com/drive/1krShfv89NyK4a7kB59EVvIQst4B09Yi9?usp=sharing) to explore the performance of Meta's library ``faiss`` for exact and approximate nearest neighbor.