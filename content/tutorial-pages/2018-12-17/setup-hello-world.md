---
title: "A hello-world with Python packaging"
authors:
    - "Janis Lesinskis"
date: "2018-12-17"
tags:
    - Python
    - packaging
contentType: "tutorial"
callToActionText: "Have you got a project that requires in depth knowledge of python packaging or deployment? Or do you have a topic about Python packaging you would like to see a post about? We'd love to hear about it so fill in the form below with some details."
hideCallToAction: false
---

When you have used Python a lot you'll notice that you will use tools such as `pip install package_name` you are installing some python code in a way that can be imported in your project. This guide will show you how you can make your own package installable.

## Source code

The code that is used in this article is hosted up on GitHub in the [ScryEngineering/setup.py-intro repository](https://github.com/ScryEngineering/setup.py-intro).

In this example we are turning a relatively simple file called `greeting.py` into an installable package. This file is just the following:

```python
def hello_world():
    print("HELLO WORLD")
```

Which we want to then be able to use via an installed pacakge via `from hello_world.greeting import hello_world`.

## Python packaging

[From the docs](https://pip.pypa.io/en/stable/reference/pip_install/#overview) the way `pip install` works is as follows:

1. Identify the base requirements. The user supplied arguments are processed here.
2. Resolve dependencies. What will be installed is determined here.
3. Build wheels. All the dependencies that can be are built into wheels.
4. Install the packages (and uninstall anything being upgraded/replaced).

When you issue a command such as `pip install path/to/package` pip will go to that path and will resolve the dependencies found there. If the package dependencies are successfully installed `pip` will then it will attempt to install your package into the site-pacakges directory.

How it installs this is determined by the contents of the `setup.py` file.
Within that `setup.py` file you will need to specify a function called `setup` that will define how your package is installed.

## Filesystem conventions

For tools such as pip to work you need to follow some filesystem conventions, specifically this is what the sample repository includes:

```sh
$ tree .
.
├── hello_world
│   ├── greeting.py
│   └── __init__.py
├── README.MD
└── setup.py

```

In this structure `setup.py` must be found at the top level as pip will look here for how to install your package. It will then execute this `setup.py` file to install your package.

## The anatomy of setup.py

The setup.py file in this example includes the following:

```python
from setuptools import setup

setup(name='hello_world',
      version='0.0.1',
      description='Shows how to use setup.py',
      url='https://www.scrygroup.com',
      author='Janis Lesinskis',
      license='GPLv3',
      packages=['hello_world'],
      classifiers = [
          'Development Status :: 4 - Beta',
          'Intended Audience :: Developers',
          'Programming Language :: Python',
          'Programming Language :: Python :: 3.5',
          'Programming Language :: Python :: 3.6',
      ],
      keywords='tutorial',
      include_package_data = True,
)
```

The most important arguments to `setup` are the following:

* The `name` which will be the directory your package is installed in.
* The `version` of your package, semantic versioning is a good choice for this.
* The `packages` which specifies the directories that the installed packages reside in. in this case `hello_world` is the directory where our code resides in.