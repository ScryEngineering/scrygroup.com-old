---
title: "Finding the size of Python Objects"
authors:
    - "Janis Lesinskis"
date: "2018-09-04"
tags:
    - Python
    - performance
    - implementation-details
    - profiling
    - memory-management
contentType: "tutorial"
callToActionText: "Have you got a project that would be helped by in depth knowledge of Python? Do you have a topic about Python you would like to see a post about? We'd love to hear about it so fill in the form below with some details."
hideCallToAction: false
---

Ever wondered exactly much memory in bytes an arbitrary Python object requires?

<!-- end excerpt -->

Sometimes you need to know how much memory something uses, for the most part this is a bit opaque in Python compared to a languages such as C++ that give you very direct memory management capabilities. The tooling is somewhat indicative of the overall language philosophies, generally speaking if you need bytes level memory management control you tend to not be using Python.

That said it's still very valuable to know approximately how many bytes of memory various things will need. Because when you need this you _really_ need it.

(All the code in the article can be found over on our GitHub organizations page: https://github.com/ScryEngineering/python-memory-usage/)

If you want to get an introduction to how CPython manages memory have a look at [our PyCon 2019 poster](https://www.lesinskis.com/images/CPythonMemoryStructurePosterJanisLesinskisAlyshaIannetta.pdf) that summarizes the core concepts.

# sys.sizeof

The starting point for these things is the functionality in the `sys` library called [getsizeof](https://docs.python.org/dev/library/sys.html#sys.getsizeof) that will let you do some sizeof checks:

```python
>>> import sys
>>> a = [1,2,3]
>>> b = [1,2,3,4,5]
>>> sys.getsizeof(a)
88
>>> sys.getsizeof(b)
104
```

This is quite useful, but as mentioned in the documentation it only checks the object itself and not the size of the contents of the object. A clear case of this limitation is this:

```python
>>> class C:
...     def __init__(self, iterable):
...         self.data = list(iterable)
... 
>>> c1 = C([1,2,3])
>>> sys.getsizeof(c1)
56
>>> c2 = C([1,2,3,4,5])
>>> sys.getsizeof(c2)
56
```

So as you can see this is not what we really want if we are trying to compute sizes. In CPython what we are getting here is the size of class NOT what's inside it.

# If you can modify the class code

So we have to look into the items that are contained inside the object and make use of the `__sizeof__` method that will override the default behavior. This is a snippet I've used in the past:

```python
import sys
class mylist:
    """A class that implements __sizeof__"""
    def __init__(self, iterable):
        self.data = list(iterable)

    def __sizeof__(self):
        return object.__sizeof__(self) + \
            sum(sys.getsizeof(v) for v in self.__dict__.values()) + \
            sum(sys.getsizeof(item) for item in self.data)

a = mylist([1,2,3])
print(sys.getsizeof(a))
b = mylist([1,2,3,4,5])
print(sys.getsizeof(b))
```

When we run this we get the following:

```
252
324
```

So this is better, but it's still not quite right in the general case because it doesn't recurse into the members of the class to find all the sizes. It only works one level deep (which was enough for most of my use cases). Also this presumes you can modify the classes. (You can definitely hack around with this and inject this new `__sizeof__` into preexisting classes but be aware of the consequences of doing so)

# What if you don't wish to modify existing classes

The official docs point at [this recipe](https://code.activestate.com/recipes/577504/) for an approach that is similar to the one above:

```python
from __future__ import print_function
from sys import getsizeof, stderr
from itertools import chain
from collections import deque
try:
    from reprlib import repr
except ImportError:
    pass

def total_size(o, handlers={}, verbose=False):
    """ Returns the approximate memory footprint an object and all of its contents.

    Automatically finds the contents of the following builtin containers and
    their subclasses:  tuple, list, deque, dict, set and frozenset.
    To search other containers, add handlers to iterate over their contents:

        handlers = {SomeContainerClass: iter,
                    OtherContainerClass: OtherContainerClass.get_elements}

    """
    dict_handler = lambda d: chain.from_iterable(d.items())
    all_handlers = {tuple: iter,
                    list: iter,
                    deque: iter,
                    dict: dict_handler,
                    set: iter,
                    frozenset: iter,
                   }
    all_handlers.update(handlers) # user handlers take precedence
    seen = set()                  # track which object id's have already been seen
    default_size = getsizeof(0)   # estimate sizeof object without __sizeof__

    def sizeof(o):
        if id(o) in seen: # do not double count the same object
            return 0
        seen.add(id(o))
        s = getsizeof(o, default_size)

        if verbose:
            print(s, type(o), repr(o), file=stderr)

        for typ, handler in all_handlers.items():
            if isinstance(o, typ):
                s += sum(map(sizeof, handler(o)))
                break
        return s

    return sizeof(o)


##### Example call #####

if __name__ == '__main__':
    d = dict(a=1, b=2, c=3, d=[4,5,6,7], e='a string of chars')
    print(total_size(d, verbose=True))
```

When run this gives the following:

```
288 <class 'dict'> {'a': 1, 'b': 2, 'c': 3, 'd': [4, 5, 6, 7], ...}
50 <class 'str'> 'e'
66 <class 'str'> 'a string of chars'
50 <class 'str'> 'b'
28 <class 'int'> 2
50 <class 'str'> 'c'
28 <class 'int'> 3
50 <class 'str'> 'a'
28 <class 'int'> 1
50 <class 'str'> 'd'
96 <class 'list'> [4, 5, 6, 7]
28 <class 'int'> 4
28 <class 'int'> 5
28 <class 'int'> 6
28 <class 'int'> 7
896
```

This heuristic is much better because it will recurse into the objects members and attempt to find the size of all of those. We still run into the issue where an object might not define its size properly where you run into the original problem again.
The other thing is that we have to specify a handler for all the various types that can be found as members, if we miss any we will get an incorrect size. To deal with this properly we would have to recurse into the object and attempt to find the size of each and every item. Like the recipe we also need to keep track of references to avoid duplicate counts of memory usage. We would also want to be able to handle things like `weakref`. All of this would be a lot of work...

## Using pympler

Thankfully there's a library called [Pympler](https://pythonhosted.org/Pympler/) that has already implemented a lot of these memory tracking utilities. It's fairly easy to use, take for example the checking the size of an entire object:

```python
import sys
from pympler import asizeof

list_obj = [1,2,3,'abc']
print(sys.getsizeof(list_obj))
print(asizeof.asizeof(list_obj))
print(asizeof.asized(list_obj, detail=1).format())
```

When we run this we get the following:

```
96
248
[1, 2, 3, 'abc'] size=248 flat=96
    'abc' size=56 flat=56
    1 size=32 flat=32
    2 size=32 flat=32
    3 size=32 flat=32
```

So we see that `sys.getsizeof` reports the object size as 96, this is what is referred to as `flat` in the `asized` report. The total memory used for this list is 248 bytes in total. `asizeof` is recursing into the object here.

This library also handles the user defined class case from above:

```python
from pympler import classtracker
# track memory usage for a class
class C:
    def __init__(self, iterable):
        self.data = list(iterable)

tr = classtracker.ClassTracker()
tr.track_class(C)
tr.create_snapshot()
c1 = C([1,2,3])
c2 = C([1,2,3,4,5])
tr.create_snapshot()
tr.stats.print_summary()
```

When we run this we get a nice report on memory usage:

```
---- SUMMARY ------------------------------------------------------------------
                                         active      0     B      average   pct
  __main__.C                                  0      0     B      0     B    0%
                                         active      0     B      average   pct
  __main__.C                                  2    760     B    380     B    0%
-------------------------------------------------------------------------------
```

It also give you the ability to track an individual instance:

```python
from pympler import classtracker
# track memory usage for an instance
tracker = classtracker.ClassTracker()
obj = C([1,2,3])
tracker.track_object(obj)
tracker.create_snapshot('Before adding a whole heap of data')
obj.data.append(list(range(10000)))
tracker.create_snapshot('After adding a whole heap of data')
tracker.stats.print_summary()
```

as before there's a nice report summary:

```
---- SUMMARY ------------------------------------------------------------------
Before adding a whole heap of data       active      0     B      average   pct
  C                                           1    416     B    416     B    0%
After adding a whole heap of data        active      0     B      average   pct
  C                                           1    400.80 KB    400.80 KB    0%
-------------------------------------------------------------------------------
```

Being able to create snapshots like this for memory usage is incredibly useful with debugging memory usage related issues.

This library can do things like track down memory leaks (via references that are not cleaned up) and a variety of other handy things so go check out their project page.