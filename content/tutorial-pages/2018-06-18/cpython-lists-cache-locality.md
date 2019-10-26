---
title: "Cache locality in Python lists"
authors:
    - "Janis Lesinskis"
date: "2018-06-18"
tags:
    - Python
    - performance
    - implementation-details
    - numpy
contentType: "tutorial"
callToActionText: "Have you got a project that requires in depth knowledge of implementation details? Or do you have a topic about Python internals you would like to see a post about? We'd love to hear about it so fill in the form below with some details."
hideCallToAction: false
---

The other day I got asked what the cache locality of lists in CPython was and how the lists are layed out in memory. Because I always tend to use contiguous memory whenever this is an issue I hadn't looked into it until now.

[Locality of reference](https://en.wikipedia.org/wiki/Locality_of_reference) is an important consideration in any high performance system, lets have a look into how these concepts apply with CPython lists. Because CPython is open source we can gain insight by studying the source code. In this case it is in [Objects/listobject.c](https://github.com/python/cpython/blob/8c663fd60ecba9c82aa4c404dbfb1aae69fe8553/Objects/listobject.c).

First of all we see that there is a struct called `PyListObject`. Which is found in [Include/listobject.h](https://github.com/python/cpython/blob/1a5856bf9295fa73995898d576e0bedf016aee1f/Include/listobject.h)

and is defined as the following:

```c
typedef struct {
    PyObject_VAR_HEAD
    /* Vector of pointers to list elements.  list[0] is ob_item[0], etc. */
    PyObject **ob_item;

    /* ob_item contains space for 'allocated' elements.  The number
     * currently in use is ob_size.
     * Invariants:
     *     0 <= ob_size <= allocated
     *     len(list) == ob_size
     *     ob_item == NULL implies ob_size == allocated == 0
     * list.sort() temporarily sets allocated to -1 to detect mutations.
     *
     * Items must normally not be NULL, except during construction when
     * the list is not yet visible outside the function that builds it.
     */
    Py_ssize_t allocated;
} PyListObject;
```

We can see there that the list allocates some memory for the items contained within it. In order to not pessimize the performance of list appends and other operations more space is allocated to the list than there are elements in the list. This is very much reminiscent of `std::vector` in c++ and various other implementations in other languages.
Here's the reallocation strategy:

```c
/* Ensure ob_item has room for at least newsize elements, and set
 * ob_size to newsize.  If newsize > ob_size on entry, the content
 * of the new slots at exit is undefined heap trash; it's the caller's
 * responsibility to overwrite them with sane values.
 * The number of allocated elements may grow, shrink, or stay the same.
 * Failure is impossible if newsize <= self.allocated on entry, although
 * that partly relies on an assumption that the system realloc() never
 * fails when passed a number of bytes <= the number of bytes last
 * allocated (the C standard doesn't guarantee this, but it's hard to
 * imagine a realloc implementation where it wouldn't be true).
 * Note that self->ob_item may change, and even if newsize is less
 * than ob_size on entry.
 */
static int
list_resize(PyListObject *self, Py_ssize_t newsize)
{
    PyObject **items;
    size_t new_allocated, num_allocated_bytes;
    Py_ssize_t allocated = self->allocated;

    /* Bypass realloc() when a previous overallocation is large enough
       to accommodate the newsize.  If the newsize falls lower than half
       the allocated size, then proceed with the realloc() to shrink the list.
    */
    if (allocated >= newsize && newsize >= (allocated >> 1)) {
        assert(self->ob_item != NULL || newsize == 0);
        Py_SIZE(self) = newsize;
        return 0;
    }

    /* This over-allocates proportional to the list size, making room
     * for additional growth.  The over-allocation is mild, but is
     * enough to give linear-time amortized behavior over a long
     * sequence of appends() in the presence of a poorly-performing
     * system realloc().
     * The growth pattern is:  0, 4, 8, 16, 25, 35, 46, 58, 72, 88, ...
     * Note: new_allocated won't overflow because the largest possible value
     *       is PY_SSIZE_T_MAX * (9 / 8) + 6 which always fits in a size_t.
     */
    new_allocated = (size_t)newsize + (newsize >> 3) + (newsize < 9 ? 3 : 6);
    if (new_allocated > (size_t)PY_SSIZE_T_MAX / sizeof(PyObject *)) {
        PyErr_NoMemory();
        return -1;
    }

    if (newsize == 0)
        new_allocated = 0;
    num_allocated_bytes = new_allocated * sizeof(PyObject *);
    items = (PyObject **)PyMem_Realloc(self->ob_item, num_allocated_bytes);
    if (items == NULL) {
        PyErr_NoMemory();
        return -1;
    }
    self->ob_item = items;
    Py_SIZE(self) = newsize;
    self->allocated = new_allocated;
    return 0;
}
```

So the pointers to the list elements are allocated in a contiguous manner but the actual list elements can be anywhere from the stack.

## Practically speaking what does this cost anyway?

As always with questions of performance, *profile instead of guessing*.
Here's a quick and dirty performance benchmark:

```python
import array
import random
import timeit
from statistics import mean
import numpy as np

items = list(range(10000))
random.shuffle(items)
list_version = list(items)
array_version = array.array('I', items)

print("Results for max of the list:")
print(timeit.repeat(stmt="max(list_version)", number=10000, globals=globals()))
print("Results for max of the array.array:")
print(timeit.repeat(stmt="max(array_version)", number=10000, globals=globals()))
print("Results for max of array.array with np.max:")
print(timeit.repeat(stmt="np.max(array_version)", number=10000, globals=globals()))

print("Results for sum of the list:")
print(timeit.repeat(stmt="sum(list_version)", number=10000, globals=globals()))
print("Results for sum of the array.array:")
print(timeit.repeat(stmt="sum(array_version)", number=10000, globals=globals()))
print("Results for sum of array.array with np.sum:")
print(timeit.repeat(stmt="np.sum(array_version)", number=10000, globals=globals()))

print("Results for mean of the list:")
print(timeit.repeat(stmt="mean(list_version)", number=10000, globals=globals()))
print("Results for mean of the array.array:")
print(timeit.repeat(stmt="mean(array_version)", number=10000, globals=globals()))
print("Results for mean of array.array with np.average:")
print(timeit.repeat(stmt="np.average(array_version)", number=10000, globals=globals()))
```

Here's the results I got for `array.array` vs `list` on a Intel(R) Core(TM) i7-4500U CPU @ 1.80GHz processor, taking best of 3 with times in this list in seconds:

|Function | list  | array | numpy on array.array|
|---------|-------|-------|---------------------|
|max      | 1.91  | 3.48  | 0.16                |
|sum      | 0.89  | 1.85  | 0.15                |
|average  | 49.71 | 50.09 | 0.20                |

One thing that's interesting here is the difference between max/sum and average. If I were to guess why this is it comes down to the cost of boxing/unboxing the Python objects, in the case of `statistics.mean` there's always a type conversion made in [`_convert`](https://github.com/python/cpython/blob/9b7cf757213cf4d7ae1d436d86ad53f5ba362d55/Lib/statistics.py#L232) so we see roughly the same cost here.

Now compare this to Numpy which is not making any intermediate Python objects at all and is fully taking advantage of the contiguous memory and the results are striking.

If memory locality is a "make or break" part of your project you should strongly consider not using pure Python for that component by either FFI-ing out to another language (using numpy is an example) or write that part of the code in a language that explicitly supports determinism of memory layouts.