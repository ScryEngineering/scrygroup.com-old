---
title: "Tensorflow serving now officially supports python3"
authors:
    - "Janis Lesinskis"
date: "2018-06-26"
tags:
    - Tensorflow
    - Python
    - Packaging
contentType: "blog"
---

Recently we have been using a lot of Tensorflow in projects. As far as libraries go it's really quite nice, however it's not a native Python library and therefore some of the support was quite lacking.

One thing that almost made us go with a different package was the lack of Python 3 support with [tensorflow-serving](https://github.com/tensorflow/serving). The main Tensorflow package supports Python 3 so this struck us as an odd situation. So we analysed the source code for tensorflow-serving to see how expensive a Python 3 support project would be and to our complete surprise there was no work needed to be done other than fixing up the packaging.

Given the tensorflow library is so good in general the lack of understanding of Python packaging was particularly out of character. There was no official support for tensorflow serving with Python 3 despite the code supporting Python 3 without change. (The discussion in the [relevant issue](https://github.com/tensorflow/serving/issues/700) is rather enlightening.) So we are happy to see that Tensorflow-serving now supports Python 3 as of [this commit](https://github.com/tensorflow/serving/commit/029578acb7f1a43a7c333f1ad2abe1dfbccab6ba)

## Packaging choices

In a sense we made a bit of a mistake here assuming that the language support would be the same for the various utilities as the main library. This is something that was a little bit surprising for 2 libraries in the same organization and same project. It does highlight the importance of looking through the package dependencies and seeing if there's any issues with support or any conflicts. This due-diligence with packaging is especially important if you are working on an open source library like we were with the [persephone project](https://persephone.readthedocs.io/en/latest/).

## What went wrong with the Python packaging here

To make something that you can install via pip you have to package it up properly. Specifically there's a thing called [wheels](http://wheel.readthedocs.io/en/stable/) that allow you to pre-compile code and hence dramatically reduce the amount of compilation time that users have when installing the software on their machines.

Running setup.py with the `bdist_wheel` command is saying to create a binary distribution in a wheel file format.

So when we run:

```sh
python setup.py bdist_wheel
```

This will create a specific binary distribution in the wheel format. [Wheel files store metadata about the Python version](http://wheel.readthedocs.io/en/stable/#defining-the-python-version) and the default behavior of which is to match the Python version that created it.

If however you don't want to restrict your wheel file to a narrower version range it is better to create a "universal" wheel that can be installed more broadly:

```sh
python setup.py bdist_wheel --universal
```

In this particular instance this was the only change that was needed to provide support. Note that if your code doesn't support multiple Python versions changing the packaging alone won't fix it, your code still needs to support all the versions.