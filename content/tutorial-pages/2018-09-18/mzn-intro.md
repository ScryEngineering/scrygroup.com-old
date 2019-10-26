---
title: "MiniZinc introduction"
authors:
    - "Nick Downing"
date: "2018-09-18"
tags:
    - minizinc
    - satisfiability
    - optimization
    - combinatorial optimization
    - constraints
    - constraint programming
    - declarative modelling
    - mathematical modelling
    - mathematical programming
contentType: "tutorial"
callToActionText: "Do you have a scheduling or logistics problem that could be improved by a deeper knowledge of modelling and solving technologies? We are experts at solving difficult optimisation problems, and more importantly, integrating the solutions into existing workflows. Interested in talking further? Fill in the form below with some details and we'll get back to you as soon as possible."
hideCallToAction: false
---

You want to solve some kind of a combinatorial problem, it involves putting lots of fiddly pieces in different places and seeing if they fit together. Maybe they are physical things, such as boxes, maybe they are abstract things, such as people's schedules. Is this you? What you need is MiniZinc.

<!-- end excerpt -->

## Introduction to MiniZinc

In this tutorial we are going to look at an advanced technique of solving industrial problems. I say industrial because this is where the true value of the technique lies, but the technique has also been used for things as trivial as:

* (in abstract) solving the Zebra puzzle: there are 5 houses, the Englishman lives in the red house, the Spaniard owns the dog, etc, etc, ... therefore, who owns the zebra?
* (in real life) arranging the seating for my PhD supervising professor's family reunion: certain relatives cannot sit together as they will fight, certain relatives must be placed in a certain way so as to reassure them of their status, males and females must be mixed, children must be near their parents, ...

The technique to which we refer is called *declarative modelling*, however do not let the fancy words fool you. The best way to think about this is, suppose somebody proposes to you a solution (the owner of the zebra, the seating plan for the family reunion, ...). What would you check about that solution to be sure it fits? If you can answer that question, you can write a declarative model.

## Basic MiniZinc Syntax

We could think of MiniZinc as being something like Python, except a specialized Python for checking whether solutions fit requirements. The syntax is somewhat similar, it has operators like `+` and `-`, it has variables, etc. So if you are used to writing Python or some other computer language, you should be fairly comfortable writing in MiniZinc. There are however some unexpected features.

The first thing to remember in MiniZinc is that the order of statements does not matter. After all, if you are checking the fitness of a solution it does not matter which order you check things: all requirements must be satisfied. But it goes further than this, since even variables do not need to be defined before they are used. What matters is the entire information you give about the problem.

The second thing to remember is that MiniZinc is strongly typed: like in C or Java, but unlike in Python or Javascript, you must state the type of each variable as you declare it. The most important variable type in MiniZinc is `int`, similar to `int i = 5;` in C or `i = 5` in Python. An important difference between MiniZinc and C or Java, is that most variables have a domain, for instance we say `var 0..9: i;` instead of `int i;` to mean `i` is a variable whose value is an integer 0, 1, 2, ..., 9.

A final thing that is unusual about MiniZinc is that where many computer languages such as Python would use words like `and`, `or` to express reasoning, or C, Java and Javascript would use symbols like `&&`, `||`, the equivalent symbols in MiniZinc are from logic: `\/` means `or` and `/\` means `and`. Using the backslash in this way can be a little jarring, but one gets used to it. The same operators when applied over a list, are called `exists()` and `forall()`, similar to Python which has `any()` and `all()` for this purpose.

Apart from that, we are going to assume a basic familiarity with Python or some other programming language, so it does not pay to exhaustively list the kinds of statements and so forth. Instead we will pick this up more by example as we go.

## A first MiniZinc model

At this point the normal tutorial would probably present a basic "Latin Squares" problem or something like the Zebra puzzle, but since we are targetting programmers or beginning programmers, we are going to do things somewhat differently.

We will write a short program in Python to add up some dice rolls, and then we will do the same thing in MiniZinc to see where the similarities and differences lie. Then we will make it awesome, using some of MiniZinc's unique capabilities.

Here goes with a Python 3.6+ dice program, you can save this as `dice.py`:

```python
#!/usr/bin/env python3

die1 = int(input('Die 1? '))
assert die1 >= 1 and die1 <= 6
die2 = int(input('Die 2? '))
assert die2 >= 1 and die2 <= 6
total = die1 + die2
print(f'You rolled a {total}')
```

If you are not familiar with the [`assert` statement](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement) in Python, you should become so. What it does is to check things are sensible: stop the program if the user did not type a number 1, 2, ..., 6 for each of the die rolls. It is particularly handy for in-house or test programs that don't need to be fancy.

An important part of our presentation today, is that we will make an input file, which can be saved as `dice.in` although the filename is not critical here:

```python
4
6
```

We will assume that we have a Linux or macOS system with a prompt of `$`, with Python 3.6 installed, so that we can run the above program from the command line using the input redirection operator `<` to feed it the input from our file:

```
$ ./dice.py <dice.in
Die 1? Die 2? You rolled a 10
```

If you are on a different system you may have to install a Linux virtual machine, or make accommodations to your environment. Windows could do something very similar from the "Command Prompt" window with correctly set up PATH, but we won't go into that here. We will simply assume you can run Python and feed it a file.

Now for a straightforward equivalent in MiniZinc, save this as `dice0.mzn`:

```c
int: die1;
constraint die1 >= 1 /\ die2 <= 6;
int: die2;
constraint die2 >= 1 /\ die2 <= 6;
var int: total = die1 + die2;

solve satisfy;
output ["You rolled a \(total)\n"];
```

So we can see that it is fairly similar in intent to the Python version, if a little odd-looking to connoisseurs of ordinary (imperative) programming languages. In particular, simple type declarations of `int` or `var int` have been added, and the MiniZinc `constraint` statement has been used in a similar manner to `assert` (they are not exactly the same, but similar enough for now).

Also, note the `solve satisfy;` boilerplate is needed in every model, and that MiniZinc cannot intersperse `print()` statements throughout the model as Python does, since the order of statements does not matter. Instead the model runs to completion, and only then is the `output` item executed, allowing you to pretty-print the results of solving in some way that makes sense to you.

The MiniZinc equivalent of an input file is called the `dzn` file, where `dzn` stands for \`DataZinc', hence, save this as `dice0.dzn`:

```c
die1 = 4;
die2 = 6;
```

Similarly to what we did in Python, the purpose of the `dzn` file is to allow your declarative model to input some data and solve interesting problems, otherwise it would simply produce the same output every time it runs. A difference however is that the `dzn` file is also written in MiniZinc, so it normally consists of a set of assignments to variables. Thus you don't need anything like `die1 = input(...)` to connect your input data with your model as you do in Python.

## Running the MiniZinc model

Now it is time to run our model. Luckily, the MiniZinc team has done a very good job of packaging MiniZinc for students, researchers, beginners and/or everyone to use directly. At the time of writing, you can download a comprehensive package from [the MiniZinc website](http://www.minizinc.org/software.html), I will not go into detail about installation and other requirements since their page explains it all quite well.

In this tutorial, I will be using the command-line MiniZinc since this is my normal practice. You should have no trouble following the examples in the MiniZinc IDE if that is your choice. I downloaded the MiniZinc IDE package since unfortunately the compiler-only package is not there anymore. When I unpack this and `cd` into the root of the package, I see the following directory listing:

```
bin  libexec         plugins  resources  translations
lib  MiniZincIDE.sh  README   share
```

Fine. I will create my `dice0.mzn` and `dice0.dzn` files and try them out. To get things to work I had to point MiniZinc at its `lib` directory, which seems to be a regression since the compiler and solver components did not used to be linked against the Qt library, but anyway, my workaround is fine. I did this:

```
$ LD_LIBRARY_PATH=lib bin/minizinc dice0.mzn dice0.dzn
You rolled a 10
----------
```

It works!

## Making the model awesome

So now we are going to switch things around a bit.

* Firstly, we should note that using contraints like `>= 1` and `<= 6` are equivalent to giving a domain for a variable in the first place, so we can easily improve that and get rid of the `constraint` statements that we have.
* Also, using the `variable = value` syntax on a `var` variable is equivalent to first declaring the variable and then adding a separate `constraint` statement to enforce the equality.

I made these changes (and also put a domain on `total` for no particular reason except completeness), giving me `dice1.mzn`:

```c
1..6: die1;
1..6: die2;
var 2..12: total;
constraint total = die1 + die2;

solve satisfy;
output ["You rolled a \(total)\n"];
```

This is certainly more idiomatic MiniZinc than the direct Python translation. If you want, you can copy the `dice0.dzn` data file over to `dice1.dzn`, or just use the same `dzn` file with both models. Either way, it works.

Okay, so now for making it awesome. What we will do is switch around the `var` and non-`var` variables, therefore making MiniZinc solve for the original dice rolls given the total. This will require a new `dice2.mzn` file:

```c
var 1..6: die1;
var 1..6: die2;
2..12: total;
constraint total = die1 + die2;

solve satisfy;
output ["\(die1) and \(die2) give \(total)\n"];
```

And the corresponding `dice2.dzn` file:

```c
total = 10;
```

Running this I find that MiniZinc in no way complain about this reversal, and is happy to solve my model:

```
$ LD_LIBRARY_PATH=lib bin/minizinc dice2.mzn dice2.dzn
6 and 4 give 10
----------
```

Yep, so here we have achieved the original goal of the tutorial, we have fit two things together in such a way that they obey the rule: they must add up to 10.

Even more interestingly, we can pass in the `-a` (all solutions) switch:

```
$ LD_LIBRARY_PATH=lib bin/minizinc -a dice2.mzn dice2.dzn
6 and 4 give 10
----------
5 and 5 give 10
----------
4 and 6 give 10
----------
==========
```

Nice! As well as the original solution found, MiniZinc has continued on and found a total of three ways that rolling two dice can add up to 10.

We can also see some other interesting features here. Firstly, the purpose of the `----------` line, which is to separate the solutions when there are multiple solutions. Secondly, the new `==========` line, which says, after I found these three solutions, I didn't just give up looking, I actually *proved* that no further solutions exist. This becomes rather important later when we discuss optimality, that is finding the best way the pieces can fit together by the rules.

## Conclusion and what we have learnt

This is the end of the tutorial today, however it is only a portent of things to come. Next time we are going to look at a rectilinear problem, that is we will discuss packing some rectangular or cuboid objects into, say, a truck...

Before we go, let us just recap the significance of this *declarative* model of programming. Basically, we have told MiniZinc what we *want*, but we have made no mention of *how* it is to be found, unlike the extra work we would have to do in Python of making it loop over the possible values of the dice or using some kind of formula to derive one die from the other. In fact, MiniZinc does both of these things, and in more complex cases, MiniZinc uses more complex strategies.

The declarative way means simply to state the relationships between variables and facts that we know, this is why the order they are stated does not matter. On the other hand, as we saw, the declarative way can still carry out computations and more-or-less replace Python, it's just quite a different way to approach things. I certainly believe that thinking of things in a different way, gives us lots of nice mental exercise, and gives us a new viewpoint on difficult problems.
