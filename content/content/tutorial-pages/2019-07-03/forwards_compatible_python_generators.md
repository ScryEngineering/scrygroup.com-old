---
title: Forwards compatibility with Python generators
date: "2019-07-03"
tags:
    - Python
    - generators
    - software-engineering
    - persephone
authors:
    - "Janis Lesinskis"
Summary: PEP 479 changed how Python handled generators in a backwards incompatible manner, here's how to get compatible code working from Python 3.5+
contentType: "tutorial"
callToActionText: "Have you got a project that requires in depth knowledge of Python? We'd love to hear about it so fill in the form below with some details."
hideCallToAction: false
---

PEP 479 changed how Python handled generators in a backwards incompatible manner, here's how to get compatible code working from Python 3.5+

<!-- end excerpt -->

The other day I was getting a variety of issues fixed in the Persephone library, one such issue was setting up the CI environment to actually test with Python 3.7 in the test matrix.
This turned out to be much more annoying than I estimated, so much so I wrote a [post about it](blog/2019-06-28/A_day_in_the_life_of_a_package_maintainer/).
The reason for setting up these tests was that the codebase didn't support Python 3.7 due to a section of code that raised `StopIteration` directly to signal there was nothing to generate. So having the CI working for Python 3.7 was something I wanted before I started changing the codebase and advertising Python 3.7 support.

## First a bit of history

Generators were introduced into Python version 2.2 with [PEP 255](https://www.python.org/dev/peps/pep-0255/) back in 2001.
This allows you to `yield` elements out one at a time, which in some cases can be very beneficial.
Internally a `StopIteration` is raised to handle the exhaustion of a generator, when no more items are to be yielded.
From the beginning a generator has been able to have a `return` statement too, you can see this in the original PEP document [here](https://www.python.org/dev/peps/pep-0255/#id19) but some people (such as when I wrote a quick fix for an issue in Persephone) were raising `StopIteration` directly from their code to end a generator.

There's some issues with raising a `StopIteration` from your code (as opposed to the internals of Python) so [PEP 479](https://www.python.org/dev/peps/pep-0479/) made this deprecated in Python 3.5 and this is now an error in Python 3.7 onwards.
The PEP itself has a great example of the potential issues in the [rationale section](https://www.python.org/dev/peps/pep-0479/#rationale)

## A practical example

So lets have a look at what this does in a real project.
Persephone has some code that creates batches to be sent to the machine learning portion of the code that used to look like this:

```python
    def train_batch_gen(self) -> Iterator:
        """ Returns a generator that outputs batches in the training data."""
        if len(self.train_fns) == 0:
            raise PersephoneException("""No training data available; cannot
                                       generate training batches.""")
        # Create batches of batch_size and shuffle them.
        fn_batches = self.make_batches(self.train_fns)
        if self.rand:
            random.shuffle(fn_batches)
        for fn_batch in fn_batches:
            logger.debug("Batch of training filenames: %s",
                          pprint.pformat(fn_batch))
            yield self.load_batch(fn_batch)
```

There was an issue however if `fn_batches` was empty which caused some issues at calls sites and led to this change:

```python
    def train_batch_gen(self) -> Iterator:
        """ Returns a generator that outputs batches in the training data."""
        if len(self.train_fns) == 0:
            raise PersephoneException("""No training data available; cannot
                                       generate training batches.""")
        # Create batches of batch_size and shuffle them.
        fn_batches = self.make_batches(self.train_fns)
        if self.rand:
            random.shuffle(fn_batches)
        for fn_batch in fn_batches:
            logger.debug("Batch of training filenames: %s",
                          pprint.pformat(fn_batch))
            yield self.load_batch(fn_batch)
        else:
            raise StopIteration
```

This fixed the issue that being encountered but at the cost being breaking on Python 3.7, where this code causes the following issue:

```
                    batch_gen = self.corpus_reader.train_batch_gen()
    
                    train_ler_total = 0
                    print("\tBatch...", end="")
>                   for batch_i, batch in enumerate(batch_gen):
E                   RuntimeError: generator raised StopIteration
persephone/model.py:382: RuntimeError
```

To get this into the more modern format that's compatible with Python 3.7+ we have to change it to this:

```python
    def train_batch_gen(self) -> Iterator:
        """ Returns a generator that outputs batches in the training data."""
        if len(self.train_fns) == 0:
            raise PersephoneException("""No training data available; cannot
                                       generate training batches.""")
        # Create batches of batch_size and shuffle them.
        fn_batches = self.make_batches(self.train_fns)
        if self.rand:
            random.shuffle(fn_batches)
        for fn_batch in fn_batches:
            logger.debug("Batch of training filenames: %s",
                          pprint.pformat(fn_batch))
            yield self.load_batch(fn_batch)
        else:
            # Python 3.7 compatible way to mark generator as exhausted
            return
```

However we do want to continue to maintain support for Python 3.5 so this change would need to be accompanied by adding this future statement at the top of the file:

```python
from __future__ import generator_stop
```

What this does is make the Python 3.5 behavior consistent with the newer 3.7 way of handling things.
