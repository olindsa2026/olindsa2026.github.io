---
title: "Day 15: Associative Arrays and Hashing"
toc_sticky: true
published: true
---

## Project Shareout

Let's take some time and share the results from the individual deep dives.  I'll take volunteers to come to the front, plug in their computer, and say a little bit about what they wound up doing.

## Associative Arrays

An [associative array](https://en.wikipedia.org/wiki/Associative_array) is a data structure that stores key / value pairs.  In the basic (vanilla) associative array, we assume that each key can be associated with at most one value.  The types of the keys and values need not be the same, and they need not be integers or even primitive data types (e.g., doubles, floats, ints, shorts).

The typical operations supported by an associative array are:

> * Insert or put: add a new (key, value) pair to the collection, mapping the key to its new value. Any existing mapping is overwritten. The arguments to this operation are the key and the value.
> * Remove or delete: remove a (key, value) pair from the collection, unmapping a given key from its value. The argument to this operation is the key.
> * Lookup, find, or get: find the value (if any) that is bound to a given key. The argument to this operation is the key, and the value is returned from the operation. If no value is found, some lookup functions raise an exception, while others return a default value (such as zero, null, or a specific value passed to the constructor).

If these operations look familiar, there's a good reason.  You've actually already been using associative arrays for much of this course (as you've done, also, in prior courses like Software Design).  Data structures like Python's ``dict`` and Kotlin's ``Map`` and ``MutableMap`` are examples of associative arrays.

## Straw man Implementations of Associative Arrays

Let's look at two methods of implementing associative arrays.  For simplicity, let's suppose that $k$ represents the total number of possible keys that can be stored in our associative arrays (e.g., if we were creating an associative array of red, green, blue triples to red, green, blue triples, then $k = 256^3$, assuming $256$ possible values for each color channel).  You can assume that given a particular key, it is easy (meaning it can be done in constant time) to map the key to an integer from $0$ to $k-1$ that represents the key's identity among the $k$ possible keys.  Secondly let's use the symbol $n$ to denote the number of elements stored in the associative array thus far.

### Method 1: Association Lists

An [association list](https://en.wikipedia.org/wiki/Association_list) stores key / value pairs in a linked list.  Whenever you add a new key / value pair, you just add it to your linked list.

> **Exercise 1**
> * (a) For an association list, what is the runtime ($\Theta$) of the operations insert, remove, and lookup (you may find it useful to reference the symbols $k$ and $n$ when constructing your answer)?
> * (b) What is the space complexity for storing $n$ elements in an association list?  You can use $\Theta$ to describe the amount of space needed to store the data.  Assume that the values stored in the associative array are of a constant size.
>
>  Note: space complexity is similar to runtime but the focus is on how much memory do you use to run the algorithm as a function of problem size.  You can express space complexities in the same way as runtimes (using $\Theta$).
> 
> <button onclick="HideShowElement(&quot;HideShow1&quot;)">Show / Hide Hint for (a) </button>
> <div id="HideShow1" style="display:none">
Can you map each of these operations to an operation on a linked list?  If so, try to borrow the time complexities from there.
> </div>
{: .notice--success}

### Method 2: Array Map

Another simple method for implementing an associative array is to create an array, $a$, of size $k$ where the value $v$ will be stored at $a[i]$ if the key that maps to index $i$ is associated with the value $v$.  Initially, the array may contain a default value at each index to indicate that there are no values associated with any keys when the associative array is initially created.

> **Exercise 2**
> * (a) For an array map, what is the runtime ($\Theta$) of the operations insert, remove, and lookup (you may find it useful to reference the symbols $k$ and $n$ when constructing your answer)?
> * (b) What is the space complexity for storing $n$ elements in an array map?  You can use $\Theta$ to describe the amount of space needed to store the data.  Assume that the values stored in the associative array are of a constant size.
>
> <button onclick="HideShowElement(&quot;HideShow2&quot;)">Show / Hide Hint for (b) </button>
> <div id="HideShow2" style="display:none">
> Does the amount of space needed depend on $n$?
> </div>
{: .notice--success}

> **Exercise 3**
Are either of these two approaches practical?  If so, in what situations would each of them be a good choice for a data structure?
>
> <button onclick="HideShowElement(&quot;HideShow3&quot;)">Show / Hide Hint</button>
> <div id="HideShow3" style="display:none">
> Consider variables like the size of the key space $k$ and the number of elements stored $n$.
> </div>
{: .notice--success}

## Hash maps

The [hash map](https://en.wikipedia.org/wiki/Hash_table) (or hash table) strikes a balance between the pros and cons of the association list and the array map.  The hash map makes use of an entity called a [hash function](https://en.wikipedia.org/wiki/Hash_function), which is a function from the key space to an integer in the range $[0, m)$ (where the upper limit $m$ depends on the particular choice of hash function).  For now, we will consider these hash functions to be black boxes.  That is, they take in a key and spit out non-negative number less than $m$.  We'll look at some specific hash functions in just a bit.

Here is an example of how a hash function might be used to implement an associative array.  In this case, we will assume that our hash function maps elements from our key space (names) to integers $0, \ldots, 15$ (i.e., $m = 16$).  In essence the hash function computes a "bucket" at which to store the value associated with a particular key.

![A hash map showing several names mapping to different phone numbers.](https://upload.wikimedia.org/wikipedia/commons/7/7d/Hash_table_3_1_1_0_1_0_0_SP.svg)
credit: Wikimedia ([license](https://commons.wikimedia.org/wiki/File:Hash_table_3_1_1_0_1_0_0_SP.svg))

This design should bring to mind two questions:

1. What happens when we insert a key (a name) that happens to map to the same bucket that already contains a value (a phone number)?
2. Does it matter how we assign keys (the names) to buckets?  Will any scheme do?

With respect to question 1, there are two commonly used schemes.  The first is called **separate chaining**.  In separate chaining, instead of storing the values directly in the buckets, each bucket points to an association list that stores the key-value pairs.  In the example of the phone book, separate chaining would look like this.

![A hash table with separate chaining](https://upload.wikimedia.org/wikipedia/commons/5/5a/Hash_table_5_0_1_1_1_1_0_LL.svg).  credit: Wikimedia ([license](https://commons.wikimedia.org/wiki/File:Hash_table_5_0_1_1_1_1_1_LL.svg))

Notice how the John Smith and Sandra Dee both map to the same bucket (this is called a *collision*), which points to a two element association list.  Separate chaining works well when the load factor (defined as the ratio of the number of elements stored, $n$, to the number of buckets, $m$) is less than 3 ([citation](https://www.cs.cornell.edu/courses/cs312/2008sp/lectures/lec20.html)).  When the load factor exceeds some specified threshold, the table must be rehashed (meaning each element must be reinserted with a new hashing function where with a larger number of buckets).

An alternative to separate chaining is direct addressing.  When using direct addressing, we still store the values directly in the buckets (as we did in the simple version of our hash map) and when a collision occurs we simply search for an alternate place to put the value.  There are a number of schemes we can use to find this alternative location, but the simplest of these is called [linear probing](https://en.wikipedia.org/wiki/Linear_probing).

In linear probing, when you insert an item and a collision occurs, you simply search ahead in your array into you find an unused bucket and place the value there.  This scheme requires updating your algorithm for lookup and deletion of elements accordingly.  Here is what our running example would look like when using linear probing.

![A phonebook stored with linear probing](https://upload.wikimedia.org/wikipedia/commons/b/bf/Hash_table_5_0_1_1_1_1_0_SP.svg)  credit: Wikimedia ([license](https://commons.wikimedia.org/wiki/File:HASHTB12.svg))

Notice how the colliding elements are now stored in two separate buckets located sequentially in the array.

### Complexity of Operations

Under the assumption that we have a good hash function (meaning that the probability it maps a randomly chosen key to a specific bucket is roughly uniform and that there are no discernible patterns in how keys are mapped to buckets) and that the load factor on the table is relatively low, then insertion, deletion, and lookup will all have amortized time complexity of $\Theta(1)$.  If you remember back to our discussion of array lists, amortized analysis is based on the average number of steps per operation.  For example, an amortized time complexity of $\Theta(1)$ to insert elements into a hash map means that it takes $\Theta(n)$ time to insert $n$ elements, and hence the time per insertion is $\Theta(1)$.

### Tradeoffs Between Separate Chaining and Linear Probing

Linear probing (as an example of open addressing) has the advantage of using less memory given $m$ buckets and has better locality of reference (meaning you don't have to follow a pointer to another chunk of memory to find the value for a specified key).  On the downside, the performance of linear probing tanks when the load factor of the table approaches 1 (separate chaining can support load factors above 1).  Linear probing is also very sensitive to the choice of hash function.  For example, if a series of keys inserted into the hash map keys cluster in the same range of buckets, the performance of the hash map will degrade even if the load factors is low.

## Hash functions

As alluded to above, we would like our hash function, $h$, to satisfy two key properties.

> 1. Injection: for two keys $k_1 \neq k_2$, the hash function should give different results $h(k_1) \neq h(k_2)$, with probability $m-1/m$.
> 2. Diffusion (stronger than injection): if $k_1 \neq k_2$, knowing $h(k_1)$ gives no information about $h(k_2)$. For example, if $k_2$ is exactly the same as $k_1$, except for one bit, then every bit in $h(k_2)$ should change with $1/2$ probability compared to $h(k_1)$. Knowing the bits of $h(k_1)$ does not give any information about the bits of $h(k_2)$.
 - [CS 312 Lecture 21](https://www.cs.cornell.edu/courses/cs312/2008sp/lectures/lec21.html)

> It should be obvious why the first property is important for our hash maps to perform optimally, but why do we care about the second property?
{: .notice--warning}

There are many specific choices of hash functions.  To understand some of the specific choices of hash function, it helps to think a little bit about how the keys we are storing are represented in a computer's memory.

Fundamentally, all data in a computer is stored in a binary format.  For example, positive integers are represented, as you would expect, by converting them into a base 2 representation (negative numbers can be represented in various ways, for example, using [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement)).  Some data is fixed length (e.g., Kotlin's ``Int``, ``Long``, and ``Short``) and some is variable length (e.g., a string).  When designing a hash function, we'll have to think about to apply it to fixed length and variable length data.

A full discussion of hash functions is outside the scope of this course, but here are a few concrete choices to make the ideas concrete.

For each of these hash functions, we say that the number of buckets for our hash function is $m$ and $m_b$ is the number of bits required to represent the numbers from $0$ to $m-1$.  If we assume $m$ is a power of two, then $m_b = \log_2 m$.

### Folding

Folding algorithms divide the input into chunks of $m_b$ bits and then perform operations on these $m_b$-long bit strings to create the final hash index.  These operations could be additions or bit-wise exclusive or (XOR).

For example, suppose we were hashing the integer key $4,234,234,421$ into $m = 256$ buckets.  We would take the integer's binary representation (in this case $11111100011000010100101000110101_b$) and divide it into four 8-bit chunks (since $\log_2 m = 8$).  These chunks would be: $00110101_b$, $01001010_b$, $01100001_b$, and $11111100_b$.  We could then use X-OR to combine these values chunk by chunk.

> Note: xor is [exclusive or](https://en.wikipedia.org/wiki/Exclusive_or), which we denote using the $\oplus$ operator.

$$\begin{align*}
00110101_b \oplus 01001010_b &= 01111111_b & \text{xor chunk 1 and 2} \\
01111111_b \oplus 01100001_b &= 00011110_b & \text{take result and xor with chunk 3} \\  00011110_b \oplus 11111100_b &= 11100010_b  & \text{take result and xor with chunk 4}
\end{align*}$$

Given this result, we would then store the value associated with the key $4,234,234,421$ in bin 226 (this is the decimal equivalent of the bit string computed above).

### Division Hashing

In division hashing, we typically choose $m$ to be a prime number (we also require that $m$ not be too close to a power of $2$, see [this reference](https://www.geeksforgeeks.org/what-are-hash-functions-and-how-to-choose-a-good-hash-function/) for an explanation).  Our hash function now becomes $h(k) = mod(k, m)$, where $mod$ is [the modulo operation](https://en.wikipedia.org/wiki/Modulo).

> **Exercise 4**
> Let's examine why we might want to choose our table size to be a prime number.  Suppose we are hashing the first 50 non-negative even numbers (0 through 98).  Let $h_1(k) = mod(k, 13)$ and $h_2(k) = mod(k, 16)$.  Show that despite the $h_1$ using fewer bins, it will result in better utilization of its bins than $h_2$.
{: .notice--success}

> **(Optional) Theoretical Background**
> 
> It turns out that there is some interesting number theory that underlies this result.  The theory of [cyclic groups](https://en.wikipedia.org/wiki/Cyclic_group) can be applied.  In this case, if we have look at the set of integers $\mathbb{Z}_n$, which includes the integers $0, 1, 2, \ldots n-1$, there is a result that says that if we start at 0 and keep adding any number $k$ (modding by $n$ when needed) such that $n$ and $k$ are relatively prime, we will eventually cover all values in $\mathbb{Z}_n$.
> 
> Here is an example showing this.
> Let's set $n=7$ and $k=4$.
> 
> $$\begin{align*}
> 4 &\equiv 4\text{ (mod 7)} \\
> 4 + 4 &\equiv 1\text{ (mod 7)} \\
> 4 + 4 + 4 &\equiv 5\text{ (mod 7)} \\
> 4 + 4 + 4 + 4 &\equiv 2\text{ (mod 7)} \\
> 4 + 4 + 4 + 4 + 4 &\equiv 6\text{ (mod 7)} \\
> 4 + 4 + 4 + 4 + 4 + 4 &\equiv 3\text{ (mod 7)} \\
> 4 + 4 + 4 + 4 + 4 + 4 + 4 &\equiv 0\text{ (mod 7)} \\
> 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 &\equiv 4\text{ (mod 7)}
> \end{align*}$$
{: .notice--warning}


### More Hashing Algorithms

We won't over these, but they are here for reference.

#### Murmur Hash (this is supplementary,  we won't get to it)

Admittedly, I haven't looked into [Murmur Hash](https://en.wikipedia.org/wiki/MurmurHash) in any detail, but  I did find some [useful resources](https://www.keiruaprod.fr/blog/2023/04/02/the-murmur-hashing-algorithm.html) to understand this algorithm.  I thought folks might be interested in reading about a hashing algorithm used in practice.  If you want to look into it and want to report back next class, please let me know.

#### Cuckoo Hashing (this is supplementary,  we won't get to it)

[Cuckoo hashing](https://en.wikipedia.org/wiki/Cuckoo_hashing) is another interesting seeming technique (again, I haven't looked into it too much, but the basic idea is intriguing).  If you want to look into it and want to report back next class, please let me know.