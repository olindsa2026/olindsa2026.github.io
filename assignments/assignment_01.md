---
title: "Assignment 1: Hello World and Getting to Know You"
due_on_class: 3
toc_sticky: true 
---

## A Note on Assignment Scope

In general, you will be spending about 8 hours a week on homework for this class.  The first assignment spans a week and a half, is on the lighter side, but you should still be spending at least 8 hours on it.  If you finish this assignment in less than 8 hours, please consider one of the following additional activities.
* Do some problems from [Advent of Code](https://adventofcode.com/) (note: there is a link on the [useful resources](/how_to/useful_resources) page to a walkthrough of these problems).
* Expand the scope of the "translating old code to Kotlin" part of the assignment.
* In the "Hello Kotlin" part of the assignment, try importing a dependency and using it in your code (the [Setting up Kotlin](/how_to/setting_up_kotlin) section has some information on this).  If you are using another programming language, see if you can import a third-party library (i.e., one that is not already built into the language) and use it somehow.

## Choosing a Language

New for this year, I want to experiment with opening up the choice of programming language.  Let me give you a 
little background on what I was looking for in an ideal DSA language.

1. I wanted a language that is **statically typed**.  [Statically typed languages](https://en.wikipedia.org/wiki/Type_system#Static_type_checking) 
are ones where the programmer is required to specify the data types that their functions accept and, in-turn, the computer can verify that the correct types are being passed into those functions *before* running the code (this sort of analysis is called *static analysis*).  Static typing will help you become more adept at defining appropriate data types and thinking about the abstractions they represent.
2. I wanted a language that is more than just an academic curiosity.  I wanted the language to be *useful* both in direct application and also as a bridge to learning other languages.
3. I wanted a language with a minimal learning curve.  The class you are taking, Data Structures and Algorithms, is already covering a lot of ground in a single semester (some colleges will separate these two subjects into their own courses). I worried that if the language was too difficult to learn, then many of the core learning objectives of the course would be lost.
4. I wanted students to expand their toolbox.  While I was worried about having a steep learning curve, I also wanted students to continue their journey as programmers. This meant that I wanted to make sure they were either learning a new language, or learning new tooling to use a language they already know in a new way.

This combination of requirements led me to choose the **Kotlin** programming language.  Kotlin is statically typed, used in many contexts (e.g., mobile apps, web, backend, data analysis), is a fantastic bridge to learning Java (and gives you some help towards learning C++), is very easy to learn with great tooling, and is new to almost all students.

I firmly believe that it is my responsibility as an instructor to provide scaffolding towards achieving goals 1-4 listed above.  With this in mind, I will continue to support Kotlin as the default language of the course.  This means that if I implement something in class, I will do so in Kotlin.  I will post solutions in Kotlin, and I will provide how-tos on setting up your environment for Kotlin.  I also firmly believe in student agency to customize learning experiences to serve their individual goals.  To this end, if you would like to use a different language than Kotlin for this course, you are free to do so.  Here are the requirements for choosing your own language.

1. You assume primary responsibility for finding resources (textbooks, online resources, AI-as-a-teacher) to learn your chosen language.  That said, I have learned many programming languages in my day, and I'm a very curious person, so I am more than happy to help you think through any issues you have bumped up against with your chosen programming language.  I'm also excited to help you find learning resources that work best for you.
2. Choosing a difficult to learn language does not mean you can downscope other parts of the course assignments.  You are still expected to complete the assignments in full.
3. The language you choose must be statically typed or have tooling that helps enforce static typing constraints.  For example, you may choose to do this course in [Python with type hints and mypy](https://mypy.readthedocs.io/en/latest/getting_started.html) as a type checker.
4. For oral quizzes, if an exercise requires examining code you didn't write, at this time I will only provide Kotlin or Python with type hints as the two options.  If it turns out there is a big cluster of students working in a language that I know well, I may add more options.

As part of the course entrance survey, I will ask you to let me know your initial choice for programming language (as well as your rationale).  You are, however, free to switch languages during the course.  If you do so, I'd appreciate you writing me a quick note to explain your rationale for shifting.  I don't need to know about this shift for bookkeeping, I am, however, interested in following your decisions related to this class.

Given all of this, I am expecting the following languages to be the main alternatives to Kotlin chosen in this course.
* C++: steeper learning curver, used in a lot in domains (e.g., robotics)
* Rust: much steeper learning curve, lots of excitement around it, used in areas like systems programming.  Warning: I don't know Rust myself, so I would be learning with you.
* Python with mypy: straightforward extension of what you learned in the courses that are prerequisites for this course.

## Course Entry Survey

Please [fill this out](https://docs.google.com/forms/d/e/1FAIpQLScJegi7KGH3-TvK7R0ImdSJHRrENx9AuBfAB6pKXzm60bPncw/viewform).  I want to get a better sense for what you are hoping to get out of this course, what your background is, and how I can make this course work well for you.

## Identifying Effective Strategies for Learning

When embarking on a course, it's important to strategize about how to get the most out of the experience.  One might focus on how to get the best grade, but I invite you to consider the task of trying to learn as much as possible as being the primary objective (and other rewards will follow from this goal).

Respond to the following prompts to get you thinking about your approach to learning in this course.

1.  Choose a moment in your educational career (it could be an assignment or a full course) where learning went really well. What strategies did you employ that worked particularly well (e.g., working with others, trying work on your own before asking a friend, going to office hours)?
2. Similar to (1), which sorts of strategies have led to either less effective learning or less enjoyment of the learning experience.  Feel free to describe a few examples of what doesn't work for you.
3. As this course is foundational for many aspects of computer science, the problems in this class can be easily solved with modern AI systems (e.g., ChatGPT, Gemini, etc.).  One of my foundational assumptions is the process of grappling with a problem helps you internalize the important concepts, gives you more insight into how the tools you are learning can be applied in other contexts, helps you more realistically assess your own abilities, and helps you learn to better communicate your knowledge to others.  Particular methods of using AI (e.g., prompting the AI to provide answers to questions and thoughtlessly copying the answers) are unlikely to achieve the learning goals articulated previously.  Do you agree with this framing? How are you thinking about AI tools with respect to this course?
4. What strategies will you use in this course to be successful?  With respect to AI, what principles or strategies will you use during this course.
5. What do you think of some of [the proposed activities for the oral quizzes](https://olin.instructure.com/courses/940/pages/course-policies-and-structure)?  Are these activities ones that would give you helpful feedback as to how you are performing with respect to the course material?  Would you add or subtract any of the proposed activities?
6. How can the teaching team support you?

## Hello World!

> If you choose a language other than Kotlin, you will want to do something equivalent in your chosen programming language.  Here is [a Google doc you can use to share anything cool](https://docs.google.com/document/d/1ZvxRpHxgRflxHU__9kKKlFOXb7QimZwsk1UURh8MAaA/edit?usp=sharing) you found with the class related to your chosen programming language.

Read the section on the website about [Getting Set with Kotlin](/how_to/setting_up_kotlin).

Go through [the Kotlin tour](https://kotlinlang.org/docs/kotlin-tour-welcome.html) (you only need to do the beginner Kotlin tour).  Make sure to attempt all the exercises in the tour.

1. What features do you like about Kotlin?
2. Are there things you were expecting to find that you haven't?
3. What questions do you have?
4. Try using the debugger (see the Getting Set with Kotlin page) for some very basic information on the debugger.  Do you have experience using interactive debuggers like this one?  Were you able to successfully launch the debugger?

> Turning in your work: You don't have to turn in the code you write for the tour.  Please let me know that you did indeed finish the tour and turn in your answers to the questions above.

## Translating Your Old Code

> If you choose a language other than Kotlin, please adjust this prompt as appropriate.  If you choose Python with type hints, you may find this takes a lot less time than I anticipated. If it does, you can see some of the suggestions at the top of the assignment to augment your work.

Choose a piece of code that you've written in a programming language other than Kotlin.  Translate the code to run in Kotlin.  For simplicity, you may want to choose some code that will not require interacting with a lot of external libraries (although [the course how-to](/how_to/setting_up_kotlin) discusses how to add dependencies to your project)

The code you produce should be documented and contain at least some unit tests.

>  Turning in your work: Include a link to a GitHub repo containing your port of the code.  Include a writeup that describes the purpose of the code and how you found the process of translating the code to Kotlin (or the language you wind up choosing).  Feel free to touch on the good, the bad, and the ugly.

## Implementing Meeting Scheduler

Implement an algorithm that determines whether a collection of meetings contains a conflict (as we discussed in the [day 1](../in_class/day01) page).

It's up to you how you pass data into your program.  You could read it from a file, hard code a test input into your main function, etc.

* First implement the straightforward algorithm that checks pairs of meetings.
* Develop a second algorithm that sorts the meetings in a useful way so you can check for conflicts more easily.  You should not implement your own search function, but instead use your language's built-in sort function.
* Write unit tests for both implementations, including edge cases such as one meeting ending exactly when another starts. For each algorithm (the straightforward one and the one based sorting), describe how you expect its running time to grow with $n$.  As mentioned on day 1, sorting has runtime $\Theta(n \log n)$.
