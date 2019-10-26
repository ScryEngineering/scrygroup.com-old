---
title: "Python's __hash__ function is not a cryptographic hash"
authors:
    - "Janis Lesinskis"
date: "2018-07-14"
tags:
    - Python
    - hashing
    - cryptography
contentType: "blog"
---

You may have noticed that Python has an internal hash method, here’s why it is not suitable as a cryptographic hash and some suggestions for alternatives if you do need a cryptographic hash.

<!-- end excerpt -->

Let’s say we want to check if 2 sequences of bytes are the same by comparing their hash values. To do this we would need a hashing function that satisfies the requirements for a good cryptographic hash function.

## Python’s builtin hash

Python makes extensive use of hash-table based associative mappings with it's dictionary and set types amongst others. To support this there is a builtin function called [`hash`](https://docs.python.org/3/library/functions.html#hash) which will call the [`__hash__`](https://docs.python.org/3/reference/datamodel.html#object.__hash__) dunder method. This is an internal implementation detail that calculates the hash value required by the various hash-table backed associative mappings in the language. To be able to store an item as a dictionary key that item must support the hashing protocol via supplying the `__hash__` method. A collision in a dictionary is not a deal-breaker because any item being used as a dictionary key must specify an equality operation too. The collision resolution is therefore able to be handled in these cases by having more than one value stored at each colliding hash value and then comparing based on equality. For example:

```python
>>> hash("foo")
-2127098756728086877
>>> hash(-2127098756728086877)
-2127098756728086877
>>> test = { "foo": 1, -2127098756728086877: 2}
>>> test["foo"]
1
>>> test[-2127098756728086877]
2
```

Because the equality of `"foo"` and `-2127098756728086877` is not the same both can be stored as dictionary keys and the lookup will still succeed. This of course is the required behavior, to the user the hash collision is usually *mostly* transparent, the only cost you pay for collisions is a degradation of performance because every item with the same hash value now needs to be checked for equality (Note this is why hash randomization was introduced for strings, read more below).

This built in hash method does have a few nice properties with regards to the data structures it supports. One of the big things is that it is fast because it performs well with the data you encounter in Python programs. Because the hash is fast the time saved on the hash more than offsets the extra time spent on collision handling in general cases.

The current default algorithm used by recent CPython versions for hashing is [SipHash24](https://en.wikipedia.org/wiki/SipHash). If you would like more information about which hash is being internally or how to change the defaults have a look at [this blog post](https://www.lesinskis.com/TIL_python_hashing.html).

## Why this hash function is not suitable as a cryptographic hash

Unfortunately the builtin `hash` doesn’t necessarily meet the requirements for a cryptographic hash for the following reasons:

### The hash does not always yield the same result given the same input

```python
janis@scry:~$ python3
Python 3.5.2 (default, Nov 23 2017, 16:37:01)
[GCC 5.4.0 20160609] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> hash("abcdef")
3361618094207257066
>>> exit()
janis@scry:~$ python3
Python 3.5.2 (default, Nov 23 2017, 16:37:01)
[GCC 5.4.0 20160609] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> hash("abcdef")
5563937455588773354
>>> exit()
```

The change in values across runs of the Python interpreter is as a result of hash randomization that was introduced into the language to prevent against various denial of service hashing attacks (See: https://bugs.python.org/issue13703 for more details). The default hashing algorithm makes use of a per-run hash seed, see [PYTHONHASHSEED](https://docs.python.org/3/using/cmdline.html#envvar-PYTHONHASHSEED) for information on how to set this seed from the command line.

The reason this is important is because in a lot of web frameworks that use Python there are various lookups into dictionaries and sets to handle URLs and these values are from strings in the URLs that are publicly facing. A carefully crafted attack that generates the same hash values can degrade performance by taking advantage of the fact that in the worst case inserting items into a dictionary is `O(n^2)` complexity in the case of a hash collision. Adding hash randomization makes construction of hash collisions harder to do. But unfortunately this means we can’t use this to create sharable hash values for strings/bytes across runs of the program without seeding both with the same hash seed.

### The hash does not change substantially for small changes for some inputs

```python
janis@scry:~$ python3
Python 3.5.2 (default, Nov 23 2017, 16:37:01)
[GCC 5.4.0 20160609] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> hash(1)
1
>>> hash(2)
2
>>> hash(3)
3
```

This behavior does not hold for strings/bytes objects however:

```python
>>> hash("a")
6813857533266275591
>>> hash("b")
-7206112842794147113
>>> hash("c")
4007592366952877056
```

Because strings/bytes are hashed with a different algorithm to the integers.

### Collisions are easy to create

Notice how the hash of an integer is the integer itself. Given that there’s a unification of long types in Python 3 this means we can represent arbitrarily large integers directly and this means we can recreate any hash value. See for example:

```python
>>> hash("foo")
-2127098756728086877
>>> hash(-2127098756728086877)
-2127098756728086877
```

This is an issue if your code relies on `hash` creating different results for different inputs.

## What you should use instead

If you want to hash the contents of an object for the purposes of checking the contents for equality this could perhaps be implemented via a method that uses a proper cryptographic hash function. Because Python has a batteries included approach to the standard library there’s some cryptographic hash functions in the standard library in the [hashlib](https://docs.python.org/3/library/hashlib.html) module.
