---
title: "NumPy introduction"
authors:
    - "Nick Downing"
date: "2018-09-16"
tags:
    - python
    - numpy
    - colour spaces
    - image processing
    - signal processing
    - number crunching
    - big data
    - arrays
    - SIMD
contentType: "tutorial"
callToActionText: "Do you have Big Data projects which require large amounts of number crunching, statistical analysis, etc? Along with rapid prototyping ability? We'd love to hear about them, so fill in the form below with some details."
hideCallToAction: false
---

You want to deal with bulk data from your Python program. You realise that looping over every cell of a huge array from your Python code would be silly. You also would like the convenience of many kinds of canned routine to transform your data easily and efficiently. Enter NumPy!

<!-- end excerpt -->

# Introduction to NumPy

One of the great things that I love about Python, is that whatever you want to do, it is highly likely that somebody has made a package for that very thing. Examples:

* You want to record audio? Use [PyAudio](http://people.csail.mit.edu/hubert/pyaudio/)!
* You want to graph some data? Use [Matplotlib](https://matplotlib.org/)!
* You want to make a videogame? Use [PyGame](https://www.pygame.org/)!
* You want to do computer vision? Use [OpenCV](https://opencv.org/)!
* You want to do scientific programming? Use [SciPy](https://www.scipy.org/)!
* You want to do machine learning? Use [TensorFlow](https://www.tensorflow.org/)!

And so on! This really multiplies your power, as you are able to use Python for its intended purpose as a scripting language for gluing together the canned functionality of these useful packages, getting things done quickly and efficiently.

Today, the focus will be on [NumPy](http://www.numpy.org/). NumPy is a worthy addition to the above list, but it also has a special role as a fundamental underpinning to packages of the kind listed above, which are working with bulk data and need some way of transporting that data around. For instance, you can record some audio data into a NumPy array and then do some scientific programming on it.

Therefore I prefer to think of NumPy as actually a part of the Python language. Technically, NumPy is an optional add-on package, but in fact NumPy has influenced features of the core Python language (`@` for matrix multiplication) and vice versa (`:` for slicing, etc). Thus time spent learning NumPy will have a huge payoff, and luckily it is really easy and fun. There are so many cool things you can do with NumPy! We are going to do some of these fun things today.

# What NumPy does

At its core NumPy is basically an arrays package. What it does is to store multi-dimensional arrays of some particular data type for you (usually integers or real numbers). The beauty of this is that you often want to repeat some kind of operation over the array, and this is what NumPy does superbly as we will see.

## Signal Processing with NumPy

Let us think of some examples of things we could store in a NumPy array:

* 10 seconds of CD audio. This is a 2-dimensional array of 16-bit integers. The dimensions of the array are 441,000 samples (10 seconds @ 44,100 samples per second) × 2 channels (left and right). Each cell of the array holds a value -32768 (speaker fully in) through 32767 (speaker fully out) where 0 is the rest position (silence).
* Your avatar thumbnail image. This is a 3-dimensional array of 8-bit integers. The dimensions of the array might be 80 pixels (height) × 80 pixels (width) × 3 channels (red, green and blue). Each cell of the array holds a value 0 (black) through 255 (bright red, green or blue depending on the channel).

So the classical things to do with these kinds of arrays might be collapsing the channels: Convert stereo to mono, or convert colour to monochrome. We will see how to use `numpy.sum()` for this kind of thing, but for now, let us continue.

* A digitized sine wave. This is a 1-dimensional array of real numbers. Let us suppose the sine wave has a period of 8 units, then the first 8 entries will look like [0.000, 0.707, 1.000, 0.707, 0.000, -0.707, -1.000, -0.707] and then it will repeat for some number of periods. Suppose there are 55,125 periods, then we are talking about a 1-dimensional array of 441,000 entries.
* A digital filter kernel. This is the same kind of idea as the sine wave example. You may have used something like the \`blur' filter in Photoshop or GIMP. We can represent this with an array of say 10 × 10 real numbers describing how a pixel of an original image smears out into a 10 × 10 region in a blurred image.

The classic thing to do with these further kinds of arrays containing more abstract data is *element-wise multiplication*, for example NumPy can take an audio signal and put a sine wave next to it and multiply each audio cell by its corresponding sine wave cell. This is useful in itself, but can be even more powerful when combined with `numpy.sum()` to collapse the results of the multiplication.

The above examples were in keeping with a signal-processing theme, which we will be looking at in this article, in particular we'll be looking at image processing because it is easy and fun and accessible (everybody has a computer monitor).

## Creative uses of NumPy

However, NumPy isn't limited to signal processing, you could store...

* Financial data. Historical share prices, dollar values extracted from your bank statement, etc. We won't emphasize this usage as much, since you would need some other way of keeping track of what the columns or rows mean, but NumPy certainly has a role to play in this kind of analysis even if it's more advanced.
* Textual data. You might want to quickly replace certain character values with other character values, find the first location of a particular character, etc.
* Coordinate data. You might have a line-drawing consisting of 50 points to be connected in sequence, each point being an (*x*, *y*) position. This is more-or-less how line drawing tools such as Inkscape store drawings. You could keep this coordinate data in an array of 50 rows (one per point) × 2 columns (*x* and *y*).
* Mapping data. You might have an array indexed by latitude/longitude coordinates (at some suitable resolution) giving the terrain altitude at each coordinate in your home city. You could use this to help cyclists find a less hilly route.

The uses of NumPy arrays are only limited by your imagination, especially considering the absolutely enormous explosion in computer memory and processing capacity in recent decades. Say you're studying meteorology and you want to do some weather data analysis. You could quickly download a gigantic array from the Internet filled with atmospheric pressures or some such, and easily do simulations and so on, on an ordinary home or lab PC or even your laptop, with NumPy! Meteorologists of 20 years ago would have spent millions for this capability that we take for granted today. I want to put this million-dollar capability in your hands!

## Getting NumPy installed

There are ample resources for installing Python, NumPy and other things elsewhere, so I will only give a few quick commands to hopefully get you started.

Personally, I use a Ubuntu-derived Linux system, and I highly recommend to my readers to use Linux for anything involving Python, since it will be about 500% easier to get anything working. You could spend days installing Python on Windows and figuring out where the batch file is to start it and how to install add-on modules and so forth. Do not bother, you can quickly install Linux (in a virtual machine if you do not want to commit your PC or laptop) and get started.

In Ubuntu the best thing to do would be something like this:

```sh
sudo apt-get install python3-numpy python3-imageio
```

Another approach would be to use `pip`, which will download and install the package in a private location that Ubuntu's package manager won't know about. `pip` can sometimes give more up-to-date versions of packages, but I recommend to stick with the distribution's packaged software for standard things like NumPy.

Of course you might also want to use a *virtualenv* or a *docker container* or similar. Personally I find these things to be a distraction for a tutorial. You do however pay a price when it comes to moving a project around if you do it this way.

# Image processing with NumPy

So now we will get down to some code! What we will do is load an image in PNG format from disk into a NumPy array so that we can work on it. And like I said previously, just about anything you will want to do, has already been done, and there is a package or function to do it. In this case, the package is `imageio`:

```python
#!/usr/bin/env python3

import imageio
import numpy

test = imageio.imread('lena256.png').astype(float)
print(test.shape)

for i in range(256):
  for j in range(256):
    for k in range(3):
      test[i, j, k] /= 2.

imageio.imsave('test.png', test.astype(numpy.uint8))
```

So what we have done is to:

* Load the image from disk, creating a 256 × 256 × 3 NumPy array (we're assuming the image is RGB colour and thus there is a 3rd dimension containing the 3 separate colour channels).
* Change the image from the type `numpy.uint8` with integer cells in range [0, 255] to the type `numpy.float` in the same range.
* Print the dimensions of the image, including the 3rd dimension of size 3.
* Perform a trivial image processing step, here dividing each pixel's red, green and blue values by 2 to darken every pixel.
* Convert back to `numpy.uint8` and write out the image again under a new filename.

We often see Lena in this kind of work. I have taken her image from [here](http://caca.zoy.org/study/lena256.png) and I highly recommend to read the containing website, [Libcaca study: the science behind colour ASCII art](http://caca.zoy.org/wiki/libcaca/study/introduction). We will briefly look at some of the same concepts in a later NumPy tutorial.

We can read more about Lena [here](http://www.lenna.org/). Supposedly, a group of computer science researchers tracked her down in Sweden for an interview and explained that her Playboy image is often used as an example in image processing research, and she replied \`Dear me, that must be so boring for everybody, looking at me all day!'. Quite so, and we will transition away from Lena to some other images that I like better, but let us have a little bit of fun before we do.

At this point, may I recommend that you check out the repository [here](https://github.com/nickd4/numpy_tutorial) containing the files from this tutorial and have a play. Reading is so fascinating, but you will only understand in depth by doing! What happens if you introduce some other operators like `+` or `-`? Can you replace the `/=` statement by a more complicated expression? What kind of operators might be relevant when working with brightness values from images?

## Monochrome conversion with NumPy

I promised that I would show you how to collapse the channels and thereby convert the RGB Lena image into a monochrome image. We will do it the long way first:

```python
#!/usr/bin/env python3

import imageio
import numpy

orig = imageio.imread('lena256.png').astype(numpy.float)
print(orig.shape)

test = numpy.zeros((256, 256), numpy.float)
for i in range(256):
  for j in range(256):
    test[i, j] = (orig[i, j, 0] + orig[i, j, 1] + orig[i, j, 2]) / 3.

imageio.imsave('test.png', test.astype(numpy.uint8))
```

What we have done here is very straightforward. For each pixel (*i*, *j*) in the image, we calculate a mean of the red, green, and blue channels of the original image. We get the red pixel value from `orig[i, j, 0]`, the blue pixel value from `orig[i, j, 1]` and so on.

This would be the time to let NumPy take a bit of the load off us. Suppose we want to deal with each pixel as a unit. What we can do is type `orig[i, j, :]` where using `:` instead of an index means \`take all of the values in this dimension', thus it will extract a subarray of 3 elements being the red, green and blue values for the pixel. We can put this into `numpy.mean()` as follows:

```python
#!/usr/bin/env python3

import imageio
import numpy

orig = imageio.imread('lena256.png').astype(numpy.float)
print(orig.shape)

test = numpy.zeros((256, 256), numpy.float)
for i in range(256):
  for j in range(256):
    test[i, j] = numpy.mean(orig[i, j, :])

imageio.imsave('test.png', test.astype(numpy.uint8))
```

## How NumPy refers to multi-dimensional arrays

An even better way to do the above (RGB to mono) is to tell `numpy.mean()` which axis we want the mean taken along, and it handles everything for us like so:

```python
#!/usr/bin/env python3

import imageio
import numpy

orig = imageio.imread('lena256.png').astype(numpy.float)
print(orig.shape)

test = numpy.mean(orig, 2)

imageio.imsave('test.png', test.astype(numpy.uint8))
```

We need to think carefully about how NumPy numbers things and the difference between axis numbering and element numbering. When we have an original image of 256 × 256 × 3, this has 3 axes being *y*, *x* and *channel* respectively. That's to say, an element in this array is indexed by 3 numbers (because there are 3 axes) and the numbers are *y* in range 0..255, then *x* in range 0..255, then *channel* in range 0..2, in that order. The axis numbering is therefore that *y* is axis 0, *x* is axis 1, and *channel* is axis 2. Clear as mud?

Also consider the difference between a 256 × 256 × 3 array and a 256 × 256 array. Although axis number 2 has gone (which had 3 values in it previously) the information hasn't actually gone, it has been collapsed to a scalar, and a scalar requires no indexing which is why the corresponding axis has gone. Thus a 256 × 256 array can also be considered as something like a 256 × 256 × 1 array when we want. This makes it a little bit clearer what's happened to the 3-element axis.

So when `numpy.mean()` takes a mean along axis 2, it notes that the array also has several other axes, being axis 0 (*y*) and axis 1 (*x*), and thus the mean will have to be taken separately for each element in these axes. So it will make 256 × 256 separate mean calculations and construct an array similar to the original but with axis 2 missing, since it has been collapsed to a scalar. Yeah!

## Broadcasting our calculations

We saw that `numpy.mean()` is rather smart and can take a lot of the load off us, and in the process we avoid the tedious and time-consuming `for i in range` and `for j in range` style of repeating operations, which is difficult for Python but easy for NumPy. The same is true of the ordinary calculation operators such as `+` and `-`. Repeating calculations is called **broadcasting**.

Going back to the original darkening example, here is a much easier way to divide each array element (the red, green and blue values for each pixel) by 2:

```python
#!/usr/bin/env python3

import imageio
import numpy

test = imageio.imread('lena256.png').astype(float)
print(test.shape)

test /= 2.

imageio.imsave('test.png', test.astype(numpy.uint8))
```

That's right: if you just treat the array as a scalar and do operations on it, the operations are repeated over the entire array. Or we can be more technical if we like and say `test[:, :, :] /= 2.` and this says, do the operation for every element over the *y*, *x* and *channel* axes. If we don't specify the full 3 indices to cover the 3 axes of the array, NumPy provides `:` indices.

To see how the `:` syntax (for repeating operations) and ordinary indexing can be used together, consider a version of the above example where we only darken the green and blue channels, and thus we give the image more of a reddish tint:

```python
#!/usr/bin/env python3

import imageio
import numpy

test = imageio.imread('lena256.png').astype(float)
print(test.shape)

test[:, :, 1] /= 2.
test[:, :, 2] /= 2.

imageio.imsave('test.png', test.astype(numpy.uint8))
```

Even easier is to collapse both of those `/= 2.` lines into the single statement `test[:, :, 1:] /= 2.` which means, for all *y*, and for all *x*, and for all *channel* from 1 onwards, divide the cell value by 2. Truly this is powerful!

## Monochrome conversion, the NTSC way

The technically inclined reader might have noticed we did something rather naughty, we computed a monochrome image with equal weighting for each channel, basically 0.333 × red + 0.333 × green + 0.333 × blue. This is not what we are meant to do! Due to the differing sensitivities of the human eye to each colour, the U.S. National Television Standards Committee (NTSC) define monochrome like this,

Y = 0.299 R + 0.587 G + 0.114 B

where Y is the monochrome pixel value, whereas R, G, B are the red, green and blue pixel channel values. If R, G, B are in the range [0, 255] as in our case, then so will be the result Y.

How do we go about making such a summation with NumPy?

```python
#!/usr/bin/env python3

import imageio
import numpy

orig = imageio.imread('lena256.png').astype(numpy.float)
print(orig.shape)

test = .299 * orig[:, :, 0] + .587 * orig[:, :, 1] + .114 * orig[:, :, 2]

imageio.imsave('test.png', test.astype(numpy.uint8))
```

Niiice! We are becoming masters of this, we will not explain in detail about how the operations are repeated by NumPy over the various axes because it starts to become obvious once you have played with it a bit. But if you are still having trouble conceptualizing it, consider it like adding 3 matrices in mathematics.

But weight (ahem) wait, there is more! Surely we should not need to type all those `+`s and `*`s, since NumPy is so good at repeating things for us! Let us put the NTSC weights somewhere, and have NumPy put the weights against the pixel values and do some element-by-element multiplication.

First we'll do it the long way which emphasizes the element-by-element multiplication. Try this out:

```python
#!/usr/bin/env python3

import imageio
import numpy

orig = imageio.imread('lena256.png').astype(numpy.float)
print(orig.shape)

weight = numpy.zeros((256, 256, 3), numpy.float)
weight[:, :, 0] = .299
weight[:, :, 1] = .587
weight[:, :, 2] = .114

test = numpy.sum(orig * weight, 2)

imageio.imsave('test.png', test.astype(numpy.uint8))
```

Here we are basically putting together everything we know about NumPy. Firstly, we create an array of weights which is dimensioned the exact same as the original image, that is 256 × 256 × 3. So each red, green or blue value of the original image has a corresponding weight that it will be multiplied by. Then, we broadcast the `=` to make all the red weights = .299, all the blue weights = .587, etc.

The next step, which we haven't seen before, is to do `orig * weight`. Here NumPy notices that the dimensions of the arrays are the same, and therefore we are not asking for some weight to be broadcast over every element of the image, we are asking for the `*` (times) operation to occur between corresponding elements of the two arrays. NumPy builds a new array with the same dimensions as both the input arrays, where each cell is the product of corresponding input cells.

Finally, we used `numpy.sum()` to collapse out the now unwanted axis 2, containing the weighted red, green and blue values, by summing them to produce a scalar. In this case we did not want the result divided by 3 since we already have our own weights, hence we used plain old `numpy.sum()` instead of `numpy.mean()` that we saw earlier. You will extremely often see `numpy.sum()` used after some elementwise multiplication.

## Using dummy axes to line things up

As the last step of today's tutorial, we will be repeating the monochrome conversion but this time we'll use a simple vector of the NTSC weights (rather than a gigantic and redundant array of elementwise weights dimensioned the same as the input image):

```python
#!/usr/bin/env python3

import imageio
import numpy

orig = imageio.imread('lena256.png').astype(numpy.float)
print(orig.shape)

weight = numpy.array([.299, .587, .114], numpy.float)
test = numpy.sum(orig * weight[numpy.newaxis, numpy.newaxis, :], 2)

imageio.imsave('test.png', test.astype(numpy.uint8))
```

How this works is complicated so we are going to build up the idea step by step.

It has previously been mentioned that an image dimensioned 256 × 256 can be considered also to be like an image dimensioned 256 × 256 × 1, since the reason an axis disappears is when it becomes a scalar and hence requires no indexing, not because the information in the actual cells has disappeared.

The same thing happens with the vector of NTSC weights here. Initially it's a 3 element vector (a weight of .299 for red and so on), but then after we apply the special index of `numpy.newaxis` twice inside `weight[]`, it becomes a 1 × 1 × 3 array, although it still contains exactly the same 3 values of [.299, .587, .114]. Adding extra axes does not imply any extra cells.

Then what we've done is asked NumPy to elementwise multiply a 256 × 256 × 3 array against a 1 × 1 × 3 array. NumPy puts these shapes side-by-side to figure out that the vector of R, G, B weights in axis 2 of `weight`, is intended to go against axis 2 of the image `orig`, i.e. the R, G, B pixel values. On the other hand, in the *y* and *x* axes NumPy sees something like vector vs. scalar multiplication and so it decides to apply the same vector of R, G, B weights to every pixel of the image. Great!

So the new thing we've learned here is that a 1 × 1 × 3 array of weights can stand in for the large and redundant 256 × 256 × 3 array of weights (where the entire red channel was filled with .299, the entire blue channel was filled with .587 and so on). This is the essence of NumPy broadcasting: figure out which axes correspond to which, and either do an elementwise or a vector vs. scalar operation in each axis, and figure out a suitable \`Cartesian product' of all of these.

## Conclusion and what we have learnt

So today we have learned about some example uses for NumPy, a summary of how NumPy manipulates arrays for us and repeats operations over those arrays, and then we have done some image processing: darkening an image, and then converting an image to monochrome in several ways. We also played with NumPy **broadcasting**.

This is the end of our NumPy tutorial for today. What I aim to do is to transmit some small measure of my passion for NumPy to my readers, and if you have found this tutorial fun or interesting then I will have succeeded. Of course, the fascinating thing about computers is that there is always much more that we can do!

You can read about the NTSC colour space [here](https://en.wikipedia.org/wiki/YIQ). I hope to be able to write a lot more about colour space conversion using NumPy in the future, as it is a truly fascinating topic that is worthy of many individual tutorials. Colour space work is also nice for learning as it usually affects each pixel separately, via some nice simple NumPy broadcasting operations.

Spatial processing (e.g. blurring) will require more advanced NumPy, and combined with colour space work the results are powerful. In a later article I hope to be able to try quantizing or dithering (basically some simple colour space manipulations), and then test the results by applying a blur filter to try to recover an approximation of the original image, from the quantized or dithered image.
