---
title: "How to capture the standard output stream from a Jupyter notebook cell"
authors:
    - "Janis Lesinskis"
date: "2019-03-09"
tags:
    - Python
    - Jupyter
contentType: "tutorial"
callToActionText: "Have you got a project that requires in depth knowledge of Python or Jupyter notebooks? We'd love to hear about it so fill in the form below with some details."
hideCallToAction: false
---

One thing you may want to do is to capture all of the standard output stream from a cell in a Jupyter notebook.
You might also not want to change your code, here's how you can do that...

<!-- end excerpt -->

See the [notebook source on Github](https://github.com/CustomProgrammingSolutions/Jupyter_examples/blob/master/CaptureOutputFromCell.ipynb)

For example say you have this cell:

```python
items = ["a", "b", "c"]
for i in range(10):
    print(f"Item {i}: is {items[i%3]}")
```

This has the following output:

```
Item 0: is a
Item 1: is b
Item 2: is c
Item 3: is a
Item 4: is b
Item 5: is c
Item 6: is a
Item 7: is b
Item 8: is c
Item 9: is a
```

If you can change the code you could easily just build a string instead of printing.
In a simple case like this you might just want to change the code, but if you don't want to change the code for whatever reason (like it's a big chunk of code) you can still achieve this result.

Jupyter provides a magic cell command called `%%capture` that allows you to capture all of to outputs from that cell.

You can use it like this:

```python
%%capture cap_out --no-stderr
items = ["a", "b", "c"]
for i in range(10):
    print(f"Item {i}: is {items[i%3]}")
```

Now all the output of the cell is stored into the variable `cap_out`:

```python
var = cap_out.stdout
```

We just take the standard out here and now `var` is the output that was from that cell:

``` python
>>> var
'Item 0: is a\nItem 1: is b\nItem 2: is c\nItem 3: is a\nItem 4: is b\nItem 5: is c\nItem 6: is a\nItem 7: is b\nItem 8: is c\nItem 9: is a\n'
```
