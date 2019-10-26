---
title: "Python self references"
authors:
    - "Janis Lesinskis"
date: "2018-04-22"
tags:
    - Python
    - trivia
contentType: "tutorial"
---
This is a bit of Python trivia but Python containers can store items that are self references.

<!-- end excerpt -->

The way this works is that in Python a list just stores references to Python objects so you can just have a reference to the container. You can create such a list like this:

```python
>>> foo = ['bar', 'baz']
>>> foo.append(foo)
>>> foo
['bar', 'baz', [...]]
>>> foo[2] is foo
True
```

So you can see here from the object identity test that `foo` has a self reference in it now.

This knowledge can be useful sometimes (like explaining to people why there's 2 [garbage collection mechanisms in CPython](https://docs.python.org/3/library/gc.html)) but for the most part this will just be a bit of trivia.
