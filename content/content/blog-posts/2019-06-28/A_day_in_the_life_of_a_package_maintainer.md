---
title: "A day in the life of a package maintainer"
date: "2019-06-28"
tags:
    - dependency-management
    - travisCI
    - python
    - packages
    - maintenance
    - persephone
    - software-lifecycle
contentType: "blog"
Slug:  A-day-in-the-life-of-a-package-maintainer
authors:
    - "Janis Lesinskis"
summary: A day in the life of an open source package maintainer
callToActionText: "Have you got a system that requires in depth knowledge of Python? We'd love to hear about it so fill in the form below with some details."
hideCallToAction: false
---

I was bumping some versions for the [Persephone project](https://github.com/persephone-tools/persephone/) today to try remove some security issues from the project dependencies.
Package maintenance like this is the sort of thing that is good to do for the health of projects but tends often be annoying or thankless work ([we have worked on this library on and off for a while now](/blog/2018-02-25/Persephone-project/) and it's definitely been a good experience overall to be involved in this project for many reasons).
It's often thankless because packaging is a mostly invisible job when things go right but not when they go wrong. This is in contrast to pushing new features where new work has highly visible and obvious benefits (*especially* to people outside the dev team).
This imbalance is probably a large factor in why package maintenance is often neglected and just generally avoided.

PRs such as this [carry costs](https://rgommers.github.io/2019/06/the-cost-of-an-open-source-contribution/) that are not so visible, in this case the improvements to the CI system here reduce those costs for future contributions substantially.

I'm posting this just in case there's something that helps other package maintainers realize that they aren't the only ones dealing with frustrating work.

I'd like to remind people that this is important work. Keeping package dependencies maintained is a great help to the broader ecosystem, as it helps avoid bugs and security issues.

With open source being so widespread, this sort of work is crucial to the overall health of the ecosystem. See [Roads and Bridges: The Unseen Labor Behind Our Digital Infrastructure](https://www.fordfoundation.org/about/library/reports-and-studies/roads-and-bridges-the-unseen-labor-behind-our-digital-infrastructure/) for a discussion about the efforts that have built modern tech infrastructure that runs much of the world.

Today was a great example of one such frustration where I had to spend a lot of time just to get the functionality back to where it was previously.
Fighting this "bit rot" is a great example of the sort of package maintenance work that is especially valuable, the type of work that keeps everything running behind the scenes.

## What I planned to do today

There's a CVE in an older version of tensorflow. I wanted to update the version we were using. Sounds simple right? (That grimacing smiley seems appropriate here...)

## What I actually did today

I first off started by updating the dependency for tensorflow in the `setup.py` file. Unfortunately, this version was pinned exactly (something that's a mistake for a base library). Upon updating this I wanted to see if travisCI would give the all clear.

Unfortunately for me, a worse outcome than the test cases failing occurred - the tests couldn't run at all.
Because the test dependencies were not pinned exactly, newer versions of the test dependencies had a mutually incompatible version.
`Pytest` and `pytest-cov` had a mutually incompatible versioning for their dependency `pluggy`:

```
Traceback (most recent call last):
  File "/home/travis/virtualenv/python3.5.6/bin/pytest", line 11, in <module>
    sys.exit(main())
  File "/home/travis/virtualenv/python3.5.6/lib/python3.5/site-packages/_pytest/config/__init__.py", line 63, in main
    config = _prepareconfig(args, plugins)
  File "/home/travis/virtualenv/python3.5.6/lib/python3.5/site-packages/_pytest/config/__init__.py", line 207, in _prepareconfig
    pluginmanager=pluginmanager, args=args
  File "/home/travis/virtualenv/python3.5.6/lib/python3.5/site-packages/pluggy/hooks.py", line 258, in __call__
    return self._hookexec(self, self._nonwrappers + self._wrappers, kwargs)
  File "/home/travis/virtualenv/python3.5.6/lib/python3.5/site-packages/pluggy/manager.py", line 67, in _hookexec
    return self._inner_hookexec(hook, methods, kwargs)
  File "/home/travis/virtualenv/python3.5.6/lib/python3.5/site-packages/pluggy/manager.py", line 61, in <lambda>
    firstresult=hook.spec_opts.get('firstresult'),
  File "/home/travis/virtualenv/python3.5.6/lib/python3.5/site-packages/pluggy/callers.py", line 196, in _multicall
    gen.send(outcome)
  File "/home/travis/virtualenv/python3.5.6/lib/python3.5/site-packages/_pytest/helpconfig.py", line 94, in pytest_cmdline_parse
    config = outcome.get_result()
  File "/home/travis/virtualenv/python3.5.6/lib/python3.5/site-packages/pluggy/callers.py", line 76, in get_result
    raise ex[1].with_traceback(ex[2])
  File "/home/travis/virtualenv/python3.5.6/lib/python3.5/site-packages/pluggy/callers.py", line 180, in _multicall
    res = hook_impl.function(*args)
  File "/home/travis/virtualenv/python3.5.6/lib/python3.5/site-packages/_pytest/config/__init__.py", line 687, in pytest_cmdline_parse
    self.parse(args)
  File "/home/travis/virtualenv/python3.5.6/lib/python3.5/site-packages/_pytest/config/__init__.py", line 895, in parse
    self._preparse(args, addopts=addopts)
  File "/home/travis/virtualenv/python3.5.6/lib/python3.5/site-packages/_pytest/config/__init__.py", line 841, in _preparse
    self.pluginmanager.load_setuptools_entrypoints("pytest11")
  File "/home/travis/virtualenv/python3.5.6/lib/python3.5/site-packages/pluggy/manager.py", line 259, in load_setuptools_entrypoints
    message="Plugin %r could not be loaded: %s!" % (ep.name, e))
pluggy.manager.PluginValidationError: Plugin 'pytest_cov' could not be loaded: (pluggy 0.7.1 (/home/travis/virtualenv/python3.5.6/lib/python3.5/site-packages), Requirement.parse('pluggy<1.0,>=0.12'), {'pytest'})!
The command "pytest --cov=persephone" exited with 1.
```

Which is caused by these issues:

- <https://github.com/pytest-dev/pytest/issues/1479>
- <https://github.com/pywbem/pywbem/issues/1371>
- <https://github.com/pytest-dev/pytest-cov/issues/252>

This means the old code that included a `PPA` for an older ubuntu distribution is no longer correct.

So I had to manually intervene with the dependency resolution by pinning some dependencies:

before:
```
tox
pluggy>0.7
pylint>1.8
pytest>=3.9
pytest-cov
mypy>=0.6
```

After:
```
tox
pluggy<1.0,>=0.12
pylint>1.8
pytest>=3.9
pytest-cov
mypy>=0.7
```

Which then led to this issue surfacing:

- <https://github.com/pytest-dev/pytest/issues/4608>

For which I had to pin `pytest-cov` to an exact version:
```
pytest-cov==2.6.1
```

At this point the CI system started working and actually running tests.
(There was still another package version issue because between mypy 0.6 and 0.7 some previously working code was now generating false-positive for an error)

Specifically this line was fine with mypy `<.700` but not with `.710`:

```python
    def __init__(self, exp_dir: Union[Path, str], corpus_reader: CorpusReader) -> None:
        if isinstance(exp_dir, Path):
            self.exp_dir = str(exp_dir) # type: str
        else:
            self.exp_dir = exp_dir # type: str
```

This gave the following error output:

```bash
$ mypy persephone
persephone/model.py:183: error: Attribute 'exp_dir' already defined on line 181
The command "mypy persephone" exited with 1.
```

Honestly this is a bit annoying, and the error message is very poor here.
As far as I understand, this is an issue with how mypy internally tracks state. It assigns one variable to keep track of the types of variables as the program flows through.
Because of how it parses the code, mypy doesn't quite recognize that `self.exp_dir` here can only even be the type `str`.
So I made a nasty hack to work around this:

```python
    def __init__(self, exp_dir: Union[Path, str], corpus_reader: CorpusReader) -> None:
        self.exp_dir = str(exp_dir) if isinstance(exp_dir, Path) else exp_dir # type: str
```

This got mypy to stop complaining despite being almost the exact same code. (If I had any energy left over, I'd check this with the [`dis` module](https://docs.python.org/3/library/dis.html) and if they were the same I'd go open an issue over on mypy)

I figured it would be nice to add in support for Python 3.7 in the CI system.

So I added the line for `"3.7"` in the `.travis.yml` file:

```yaml
language: python
python:
  - "3.5"
  - "3.6"
  - "3.7"
```
Which then led to this failure for the Python 3.7 version:

```bash
3.7 is not installed; attempting download
Downloading archive: https://storage.googleapis.com/travis-ci-language-archives/python/binaries/ubuntu/14.04/x86_64/python-3.7.tar.bz2
0.05s$ curl -sSf -o python-3.7.tar.bz2 ${archive_url}
curl: (22) The requested URL returned error: 404 Not Found
Unable to download 3.7 archive. The archive may not exist. Please consider a different version.
```

Which is because of this: <https://github.com/travis-ci/travis-ci/issues/9815>

The default travis runs on an old ubuntu LTS and Python 3.7 cannot run on that same LTS because of a variety of issues (effectively Python 3.7 requires a more modern version of the system dependencies than those that are available in Ubuntu 14.04).

So when you add Python 3.7 to the matrix of jobs you have to explicitly specify a different, and more modern, distro image to run from.
Here's the original `.travis.yml` file:

```yaml
language: python
python:
  - "3.5"
  - "3.6"
  - "3.7"
before_install:
  - if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then sudo add-apt-repository -y ppa:mc3man/trusty-media && sudo apt-get update && sudo apt-get install ffmpeg; fi
install:
  - pip install .
  - pip install pytest-cov
  - pip install python-coveralls
  - pip install -r test_requirements.txt
script:
  - pylint -E persephone
  - mypy persephone
  - pytest --cov=persephone
notifications:
  email:
    recipients:
      - oliver.adams@gmail.com
after_success:
- coveralls
```

Here's the new one:

```yaml
language: python
sudo: required
dist: xenial
python:
  - "3.5"
  - "3.6"
  - "3.7"
before_install:
  - if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then sudo apt-get update && sudo apt-get install ffmpeg; fi
install:
  - pip install .
  - pip install pytest-cov==2.6.0
  - pip install python-coveralls
  - pip install -r test_requirements.txt
script:
  - pylint -E persephone
  - mypy persephone
  - pytest --cov=persephone
notifications:
  email:
    recipients:
      - oliver.adams@gmail.com
after_success:
- coveralls
```

Note how we are now explicitly setting the distribution to be using `xenial`.
This caused a breakage in the install because of a missing PPA, `ffmpeg` got moved into the official packages so the addition of a PPA is no longer needed.

So at the end of the day no new features were shipped but I think important work was done. People will have installs that have updated and more secure dependencies. Also, the CI system will actually be able to run. This is an important thing to keep running in an open source project because it is a feedback mechanism that will help new contributors.
