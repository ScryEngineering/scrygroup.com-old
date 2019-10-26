---
title: "How to work with Jupyter notebook cell input and output"
authors:
    - "Janis Lesinskis"
date: "2019-03-08"
tags:
    - Python
    - Jupyter
contentType: "tutorial"
callToActionText: "Have you got a project that requires in depth knowledge of Python or Jupyter notebooks? We'd love to hear about it so fill in the form below with some details."
hideCallToAction: false
---

Wondered what those `In[10]` and `Out[10]` things are in your Jupyter notebooks and how to make use of them?

<!-- end excerpt -->

See the [notebook source on Github](https://github.com/CustomProgrammingSolutions/Jupyter_examples/blob/master/CellInputsAndOutputs.ipynb)

[Jupyter notebooks](https://Jupyter.org/) are a powerful browser based interactive computing notebook that makes it super easy to make high quality presentations of data. Jupyter has got popular in recent years because it lends itself very well to data science tasks as it makes it easy to work with data and create nice visualizations and reports from within the browser.

These notebooks are built on top of [IPython](https://ipython.org/) which provides the kernel that Jupyter notebooks run on top of. So in the background the code is sent to the kernel where it is then run (unlike JavaScript the code doesn't run in the browser).

The nature of the interactivity is such that the input and outputs are not based on the traditional file based structure but on cells that get executed in a certain order.

Here's a fairly simple example of a Jupyter notebook:

![Jupyter's cell based structure](JupyterNotebookExample.png)

Breaking this down a but we see on the first line marked with `In[1]` that we have defined some items in a list.

On the second line we output a single item, and because it's the last item executed it gets placed into the output for that cell which is `Out[2]` (note that this is just the default behavior, you can change this if you want).

You can interact directly with the `In` and `Out` from within cells themselves like so:

![Example of The In and Out variables](JupyterCellIO_InOut.png)

The `In` and `Out` are just a simple `list` and a `dict`:

![Types of The In and Out variables](JupyterTypes_InOut.png)

`In` is a list of strings that form the contents of the cells.

`Out` is a dictionary of pairs of line numbers with strings that contained the output. The reason `Out` is not a list is because some lines don't contain an output, like line 1 in this example.

More information about the Input and Output caching can be found on the [IPython official documentation here](https://ipython.org/ipython-doc/3/interactive/reference.html#input-caching-system)
