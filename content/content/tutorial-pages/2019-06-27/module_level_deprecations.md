---
title: "Deprecating module level variables"
authors:
    - "Janis Lesinskis"
date: "2019-06-27"
tags:
    - Python
    - package-maintenance
    - deprecation
    - versioning
    - software-lifecycle
contentType: "tutorial"
callToActionText: "Have you got a project that requires in depth knowledge of Python? We'd love to hear about it so fill in the form below with some details."
hideCallToAction: false
---

A good strategy when managing your packages is to have a strategy for deprecating functionality across versions.
This way developers get some advance warning when APIs they depend on change.
Doing this right makes it much easier for developers to use your code and *especially* when they have direct dependencies on your packages.
Part of this strategy should involve good documentation and good communication, and part of this strategy should involve using the features of whatever programming language you are using.

Python makes informational warnings fairly easy with classes and functions.
We can use the [warnings module](https://docs.python.org/3/library/warnings.html#warning-categories) to report information to *developers* who are using our code in such a way that doesn't break the code like an exception would.

Take for example the following function in version 1.0:
```python
def some_function():
    """This function is an example"""
    return "Works fine now"
```

Then in Version 1.1 we might decide we have to get rid of this function, so we can inform the users that change is upcoming like so:
```python
import warnings
def some_function()
    """This will be removed in version 1.2"""
    warnings.warn(
        "some_function is deprecated and will be removed in version 1.2, please use some_other_function instead",
        DeprecationWarning
    )
    return "Still works but going away soon"
```

Then when you move to version 1.2 this function is then removed but you've given people a chance to be prepared.

However imagine you have a module like this

```python
"""This module does some things"""

TOP_LEVEL = "Just a placeholder"

def some_function():
    """This function is an example"""
    return "Works fine now"
```

Say you wanted to change the interface of this module to remove `TOP_LEVEL` then it is harder to attach this warning compared to a function or a similar situation with a class because there isn't as obvious a way to hook the warning triggering code to lookups of the `TOP_LEVEL` variable.

What's changed in Python 3.7 is PEP [PEP 562](https://www.python.org/dev/peps/pep-0562/) has now provided support for `__getattr__` at the module level that explicitly gives you this hook. This allows us to do the following:


```python
"""This module shows you how you can deprecate a module-scope variable

Note that since version 1.1 TOP_LEVEL is deprecated and the preferred way is to use NEW_TOP_LEVEL
"""
from warnings import warn

__version__ = "1.2.0"

_deprecated_TOP_LEVEL = "Just a placeholder"

NEW_TOP_LEVEL = "This is the new placeholder"

deprecated_names = ["TOP_LEVEL"]
def __getattr__(name):
    if name in deprecated_names:
        warn(f"{name} is deprecated", DeprecationWarning)
        return globals()[f"_deprecated_{name}"]
    raise AttributeError(f"module {__name__} has no attribute {name}")
```
Now when we try to use this:

```python
>>> import deprecation_warning_example
>>> deprecation_warning_example.TOP_LEVEL
'Just a placeholder'
>>> import sys
>>> if not sys.warnoptions:
...     import warnings
...     warnings.simplefilter("always")
... 
>>> deprecation_warning_example.TOP_LEVEL
/home/janis/python-tinkering/deprecation_warning_example.py:16: DeprecationWarning: TOP_LEVEL is deprecated
  warn(f"{name} is deprecated", DeprecationWarning)
'Just a placeholder'
```

Note how the default behavior is to not show a `DeprecationWarning` if it was emitted somewhere other than `__main__`, so we changed the warning reporting in the interactive to make sure we got the feedback there.
You can see that the value is still correctly returned but the warning mechanism also fires too, so the call site code will still work just as before.

While it was possible via various hacks (send a message through the contact form below if you are interested in these hacks and we can make a post about them) it was actually quite annoying to do this before Python 3.7.
