---
title: "Day 16: Lempel-Ziv"
toc_sticky: true
published: true
---

## Practical consideration for hash map: How do I hash non-integer data?

Kotlin defines a function called ``.hashCode()`` that turns any data into a number that can be used for hashing.  All the languages being used in this class have something of this form (I can help you do research if needed);

## Lempel-Ziv Compression

One of the options for the current assignment is to implement Lempel-Ziv Compression.  Lempel-Ziv is a lossless compression algorithm, which means that the original data can be recovered exactly (without any loss of information) from the compressed data.  In this assignment, you will be implementing the LZ78 algorithm.

There are a number of different variants of Lempel-Ziv, but the one we're going to talk about in class today is the simplest to implement (LZ78).

It's also worth noting that Lempel-Ziv is an optimal algorithm for lossless compression in a certain information-theoretic sense.  We likely won't have time to go over the details of this in class, but if you are interested you may consider looking at [this Wikipedia article](https://en.wikipedia.org/wiki/LZ77_and_LZ78#Theoretical_efficiency) that presents the sense in which the algorithm is optimal and links to some external sources that explore this topic in more depth.  The main article is Peter Shor's notes that are also linked below.  If there is time, and people are interested, I'll go over a quick explanation of the claim at the end of class.

## Encoding

We start with a stream of symbols and a codebook.  I'm going to use this string [from Peter Shor's notes](https://web.archive.org/web/20210528171521/http://www-math.mit.edu/~shor/PAM/lempel_ziv_notes.pdf) on the topic.

> AABABBBABAABABBBABBABB

In Lempel-Ziv (LZ) compression, we will also maintain a codebook. The codebook is going to be a mapping from strings to integers.  The strings (the keys) will represent the symbols from our data source and the integers (the values) will be unique identifiers that will help us compress the key. In some variants we start by creating a codebook entry for every possible symbol (letter) in our string.  In this version, we're going to start with a single mapping $\epsilon \rightarrow 0$.  As we scan through the string we'll adaptively add new mappings to our codebook as we encounter particular patterns.

Next, we're going to start scanning through the symbols of our string one-by-one and occasionally building the compressed representation of the data.  Our strategy will be to look for the longest substring that has yet to be compressed and is represented in our codebook.  As we scan our symbols, as long as these strings are in our codebook, we just keep moving through the data.  Once we find that the string is not in the codebook, we do two things

1. We add a new codeword
2. We output the compressed representation of the data.

Let's work through our example on the board.  If you're not in-class today, I'll point you to [this video of a worked example of the same string](https://www.youtube.com/watch?v=Dn-91_Vu_aM).  It's a little different from what I'll do in class, but you'll get the same main idea.

**Now we'll go through the example on the board.**

What questions arose for you from this demonstration?

> **Exercise 1**
> 
> Choose your own string to encode and go through the steps of Lempel-Ziv.  Before you start, take a second to think about what characteristics of the string might make it a more interesting example.
{: .notice--success}

## Decoding

Let's go through the process of decompressing the string that we compressed in our original example.  To do so, we'll scan through the compressed data and build the codebook and output the uncompressed data.

## Practical Considerations for Implementing this in Kotlin

When I wrote my own implementation, I found that it took me a while to figure out how to actually encode the data to binary (even though getting the codebook was fairly straightforward).  I found a nice helper class from Princeton that made the process a lot easier.  For your convenience, I (more accurately IntelliJ with some help from me) translated it into Java.  I modified the original design a bit to arrive at [this version](https://github.com/OlinDSA2024/HashingSample/blob/main/src/main/kotlin/BinaryUtils.kt).

The starter code provides two classes:

- `BinaryWriter` lets you write individual bits or integers using a
  specified number of bits.
- `BinaryReader` lets you recover the original values from the encoded bytes.

For example, suppose we want to encode the numbers 5, 2, and 9
using 3, 2, and 4 bits, respectively.

```kotlin
val writer = BinaryWriter(keepTrackOfBinaryString = true)

writer.write(5, 3)   // 101
writer.write(2, 2)   // 10
writer.write(9, 4)   // 1001

println(writer.toBinaryString()) // 101101001

val encoded = writer.toByteArray()

val reader = BinaryReader(encoded)

println(reader.readInt(3))      // 5
println(reader.readInt(2))      // 2
println(reader.readInt(4))      // 9
```