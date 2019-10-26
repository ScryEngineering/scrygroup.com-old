---
title: "A couple of questions about mypy"
authors:
    - "Janis Lesinskis"
date: "2018-07-20"
tags:
    - python
    - mypy
    - testing
    - mocks
contentType: "blog"
callToActionText: "Looking for advice with how to use static analysis and continuous integration to improve the quality of your Python software? Fill in the form below with some details so we can discuss preventing bugs from getting into your code!"
hideCallToAction: false
---

Last night [Robbie Clarken](http://twitter.com/RobbieClarken) presented a great talk about Mocking and how it fits in with testing in general.

There were a few questions he had over email about how mypy could be used in addition to Mocking to get better coverage of issues with parameters in function calls being tested. Seeing as this is helping him with a real process we agreed that there's value in blogging this so a wider audience can get exposure to these techniques.

<!-- end excerpt -->

## mypy background

There's a package called [mypy](http://mypy-lang.org/) that does static type checking analysis for Python.
We particularly like using this because some bugs get caught by our CI pipeline that would have otherwise slipped though the unit tests.
This has saved us a large amount of debugging time and has improved the correctness of our programs without costing us much at all.
It fits in with our overall approach of having multiple lines of defense as no one methodology will catch everything.

All the example code in this post can be found over on our GitHub repository: <https://github.com/ScryEngineering/mypy_mocks>

Here are the questions that Robbie was interested in:

## Question 1 - type checking an instance variable

What does mypy report here?

```python
class Item:
   def __init__(self, price: float):
       self.price = price

item = Item(price=1.5)
item.price + "abc"
```

Mypy output:

```
examples/question1.py:3: error: The return type of "__init__" must be None
examples/question1.py:7: error: Unsupported operand types for + ("float" and "str")
```

So it does correctly catch that you can't add a string to a float. So in this case if you knew you needed the `price` to be a float type this would catch a large number of bugs essentially for free from your CI pipeline.
It also complains that the return type of `__init__` must be `None`, we can fix that as follows:

```python
class Item:
   def __init__(self, price: float) -> None:
       self.price = price
```

The reason this is the case is that any Python function that does not have a return statement actually returns `None`. (Some languages do not return a type from void functions which is a substantial pain, it's great Python gets this right, though some sort of specific `void` type would likely be even better to differentiate that there was no return at all. This differentiation is useful for metaprogramming.)

```python
>>> def no_return():
...     pass
... 
>>> type(no_return())
<class 'NoneType'>
```

Since returning from `__init__` is not allowed the return type must much up with the no-return value of `None`.

## Question 2 - type checking a forwarded function

Good practice involves creating a specification for mocks such that the mock has the same interface as the actual method/function.
This is important because you don't want a situation where the mock isn't matching the interface of the thing it is mocking.
There is a really good thing called [Autospeccing](https://docs.python.org/3/library/unittest.mock.html#autospeccing) in the standard library that makes this process easier, it limits the API of mocks to the API of the original object that it is mocking which removes a whole class of possible bugs.

This was really good info in the talk, I'd encourage everyone to look into this if they use mocks heavily. I completely agree with Robbie that using `autospec=True` in your [`patch`'s](https://docs.python.org/3/library/unittest.mock.html#unittest.mock.patch) as a default is a really good idea in general. Please tell your team to do that if they aren't already.

One pain point that came up is situations like the requests library, for example [this code](https://github.com/requests/requests/blob/master/requests/api.py#L104)

```python
def post(url, data=None, json=None, **kwargs):
    r"""Sends a POST request.
    :param url: URL for the new :class:`Request` object.
    :param data: (optional) Dictionary, list of tuples, bytes, or file-like
        object to send in the body of the :class:`Request`.
    :param json: (optional) json data to send in the body of the :class:`Request`.
    :param \*\*kwargs: Optional arguments that ``request`` takes.
    :return: :class:`Response <Response>` object
    :rtype: requests.Response
    """

return request('post', url, data=data, json=json, **kwargs)
```

The forwarding of arguments via kwargs is an area that can make it harder to test with the [standard library mocks](https://docs.python.org/3/library/unittest.mock.html) because autospeccing just won't work on this now. You can of course write a manual specification by using the `spec` parameter in such cases and this would likely be the way to do this.

Unlike autospeccing which is essentially a [Pareto improvement option](https://en.wikipedia.org/wiki/Pareto_efficiency) over not autospeccing, having to write manual specifications takes a bit more time and effort so we may or may not want to do that depending on our priorities. I had suggested that this is a situation where mypy could help add an additional line of defense. So I was asked what mypy does in this situation:

```python
def outer(**kwargs):
   inner(**kwargs)

def inner(num: float):
   print(num * 2)

outer(num="abc")
```

On a first run of mypy this provides no feedback. This might not be what [you'd expect](https://en.wikipedia.org/wiki/Principle_of_least_astonishment).

The reason is because there's no type annotations on `outer` so mypy ignores this function for its analysis.
For reasons of backwards compatibility the default behavior of mypy is to not type check any un-annotated functions.
If you don't want this to silently pass you can use the `--disallow-untyped-calls` command line option for mypy:

```
examples/question2.py:8: error: Call to untyped function "outer" in typed context
```

Now we see we got the feedback we expected there. But how do we make this actually work with type annotations?

### Homogenous types being forwarded

One thing we can do is to mark the type of the `kwargs` if they are all homogenous as follows:

```python
def outer(**kwargs: float):
    inner(**kwargs)

def inner(num: float):
    print(num * 2)

outer(num="abc")
```

To which mypy will give the following:

```
examples/annotating_kwargs.py:11: error: Argument "num" to "outer" has incompatible type "str"; expected "float"
```

### Non-homogenous types being forwarded

Now if the arguments are not homogenous because we are using function dispatch as a form of method overloading we need to annotate differently.

Consider if there's 2 different functions for inner that we want to call based on the type passed, say one for floats but a different one for lists:

```python
def outer2(**kwargs):
    if isinstance(kwargs['num'], list):
        inner_lists(**kwargs)
    else:
        inner_floats(**kwargs)

def inner_lists(num: List[float]):
    for item in num:
        print(num * 2)

def inner_floats(num: float):
    print(num * 2)

# OK
outer2(num=0.1)

# OK
outer2(num=[0.2,0.3])

# bad
outer2(num="abc")
```

To get this to catch the bad case we have to use the aptly named `@overload` decorator as follows:

```python
from typing import List, overload

@overload
def outer2(num: float) -> None:
    ...

@overload
def outer2(num: List[float]) -> None:
    ...

# Code for outer2 must occur after these type annotations
```

Now when we run this with mypy we get the following:

```
examples/annotating_kwargs.py:11: error: Argument "num" to "outer" has incompatible type "str"; expected "float"
examples/annotating_kwargs.py:48: error: No overload variant of "outer2" matches argument type "str"
examples/annotating_kwargs.py:48: note: Possible overload variants:
examples/annotating_kwargs.py:48: note:     def outer2(num: float) -> None
examples/annotating_kwargs.py:48: note:     def outer2(num: List[float]) -> None
```

Perfect!

Using `@overload` is starting to introduce significant additional code overhead however and you may find you get better mileage out of just manually creating the specification of your tests if you were only doing this to mock calls for testing.