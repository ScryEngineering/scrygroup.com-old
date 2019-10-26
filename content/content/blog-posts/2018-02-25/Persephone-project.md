---
title: "Improving the Persephone library"
date: "2018-02-21"
tags:
    - project-management
    - software-engineering
    - open-source
contentType: "blog"
callToActionText: "Is your business interested in discussing the benefits/costs of open sourcing code? Fill in the form below and one of our expert partners will get back to you about how open source could help you."
hideCallToAction: false
---

Recently we have been collaborating with [Oliver Adams](https://oadams.github.io/). He is a computer science researcher who has done some very interesting work in the field of computational linguistics. One of his research projects was creating automatic phonetic transcriptions for low resource languages. This project aims to make it much easier for linguists to transcribe audio from unwritten languages, you can find the [source code on GitHub](https://github.com/persephone-tools/persephone/).

In the interests of reproducible research he has been working on releasing open source code that has powered some of his research. Further he wanted to make it easier for people to use the software in their day-to-day linguistics work as the software has a substantial amount of value beyond the papers and research that the code enabled. Making software more valuable to professional users is a particularly strong area of our skills at CPS so we jumped on the chance to contribute to this project and do the work needed to successfully transition the project to an open source library usable to a wider audience. Making software easier to build and distribute is not an initial priority in an academic environment that has a strong pressure to publish many papers, run classes, attend conferences. Talking to many researchers I have found that they would actually love to improve these aspects of their code, but the harsh reality is that time is very hard to come by and the structural incentives sometimes aren't there to do such work in that environment. Now that this project is starting to deliver gains to professional linguists in the course of their work it became increasingly valuable to work on those aspects of software quality that impact the end users.

Keeping this very practical we will focus on this initial stage of consultation on improving the library and show you some of the process that we took to decide on the initial scope of work. We outline what improvements can be made, the various methodologies involved and show via links to the repository where we created code to meet these requirements. Some of these tasks will be common to projects transitioning from a proof-of-concept that is supporting research into standalone libraries.

Overall we are trying to prioritize the tasks that will bring the greatest return for time invested (ROI) given the transition the project is undergoing. In a commercial setting the priorities could be different but this is the sort of thing we would figure out on a case-by-case basis via consulting with the client directly.

Preliminaries
=============

Any good software project work has to start with a conversation about the aims and goals of the project and clear communications on what the scope of work is. The following is a summary of the communications between CustomProgrammingSolutions and the author of the project [Oliver Adams](https://oadams.github.io/).

What is the high level summary of this project? What problems does it solve?

> It is an automatic transcription tool. Traditional speech recognition
> tools require a large pronunciation lexicon (describing how words are
> pronounced), and much training data. In contrast, Persephone is
> designed for situations where training data is limited, perhaps as
> little as 30 minutes of transcribed speech. Such limitations on data
> are common in the documentation of low-resource languages. It is
> possible to use such small amounts of data to train a transcription
> model that can then be used to help linguists transcribe speech, but
> this hasn't been widely adopted because linguists don't know its
> possible, and the existing tools (such as Kaldi
> <http://kaldi-asr.org/>) are not accessible to a non-technical
> audience. They're also implemented in C++ while Persephone is in
> Python/Tensorflow.

What are the priorities (technical and non-technical) for the project
that has created this code? How does this code produce value?

> The overarching priority is to actually to get linguists using this
> tool in their workflow to speed up language documentation, or improve
> the quality of their transcription work. User interface is thus key to
> the goal, and it's currently lacking. Related to this, the tool should
> have solid defaults so that users don't need to know much about speech
> recognition or NN's to have a solid baseline model. It would be good
> to implement automatic hyperparameter tuning (using Gaussian
> processes) to find the best hyperparameters automatically given
> someone's data. The idea is that the linguist should just run the
> train function (or click the train button) without having to think
> about anything other than the nature of the data.\
> \
> I want the code to be extensible so that adding other models is
> straightforward. This is part of the motivation for Python/Tensorflow.

How will other people use your code artifacts? What use cases do you
currently support? What use cases do you wish to support? Is this
project an isolated application or does it also intend to be a library?

> Currently I have code that handles a couple specific corpora (one for
> Yongning Na and one for Chatino). The model also supports general
> corpora in a specific format: one utterance per wav file and a
> corresponding transcription for each utterance (also one per file). An
> important next step is to support a wider variety of ways of
> presenting the data to the system, such as the files from another tool
> linguists use (ELAN), and the input files Kaldi (another ASR system)
> expects. The linguist shouldn't have to do to much data munging
> (though they will always have to ensure the quality of the data). It
> should be usable as a standalone program. It also intends to be a
> library, so that people can build other front-ends to it.

Who will work on these code artifacts? What is your plan for
collaborators?

> Linguists in general. Currently I'm collaborating with Alexis Michaud
> from the French National Center for Scientific research, who is a
> linguist working on Yongning Na. Graham Neubig at Carnegie Mellon is
> an AI/NLP researcher (and my supervisor), who has a lot of clout (in
> his ability to recruit students who may be able to help) and is
> interested in making tools useful to linguists. My goal is to get the
> tool to the point where it is useful and robust enough that there is
> uptake. I'll probably need help. Next weekend I'm going to be taking
> part in a workshop where a bunch of people are going to try using the
> tool. Hopefully I can recruit people there who are interested and
> technically strong enough.

Do you have any specific technical issues that you wish to get our
assistance with?

> I suppose general code quality assurance and architecture / API
> design. There's nothing really specific I need to address, its more
> broad coverage concern about the quality of the software. I'm
> interested in learning about the issues I don't know I don't know
> about, and improving myself and the codebase at the same time.

Prioritization of work
======================

Given a limited amount of time we need to prioritize what do based on the value it will generate for the project.

The first step we undertook was a quick scan through the code to get a first round of potential improvements. The following is our notes from that:

-   Needs a license
-   Make the usage of the project prominent in the documentation
-   Reduce time that it takes for people to contribute
    -   Development environment setup automation -- possibly use vagrant
    -   Encourage drive-by contributors
        -   Make a ticket tag/label called "documentation", "easy first
            issue" and "difficult" so contributors can more easily get
            started with tasks at an appropriate level of difficulty
    -   Contributing.txt -- guidelines for contributing
    -   Pull request and issues templates
    -   VCS workflow -- discuss this, don't leave it up to individual
        contributors to work out the workflow on their own, this needs a
        bit of attention in any project.
-   Create clear APIs
    -   Command line interface or GUIs built off the code need this --
        talk about implications
-   Improve packaging
    -   Make the install easy with package managers -- pip, setuptools
    -   Share the packages -- PyPi, other methods
    -   Reproducible requirements
-   Improving internal code quality
    -   Unit tests
        -   Tox
    -   Static analysis
        -   Pylint
    -   CI setup
        -   On GitHub: probably Travis considering the project is open
            source
        -   [Pylint](https://www.pylint.org/)/Coverage report perhaps
            run as part of CI tooling

From our discussions with the author a recurring theme is the desire to get collaborators involved in the project and making it easier to get people involved. Given the nature of the project involving many small but important details I imagine that there's a high probability of people doing [drive-through contributions](https://www.youtube.com/watch?v=q3ie1duhpCg) to fix small issues that get in the way of their work. Making it as easy as possible for people to contribute will make it much easier for people to contribute patches and also make it much easier for people to get involved in the project as long term contributors/community members.

Ease of use concerns cover APIs and packaging. Both have value but the ROI for us is higher in providing help with packaging as that's a relatively straightforward task when you have those skills. Good APIs are immensely valuable but take more knowledge of the domain and more time to get right. So packaging is our second priority.

Before improving any API or architectural details it's important that we preserve value in the existing code base as much as possible, setting up some tooling to run tests and code quality analysis will help the project but will also make it much safer for us to refactor code and do other high level changes. For this reason setting up a continuous integration system is our 3rd priority, this also helps with contributions as being able to let your contributors get direct feedback on their pull/merge requests is exceedingly valuable and saves a lot of time. This way people can be more effective with their time spent developing.

The initial prioritization for our time is as follows:

1. Work required to enable easier contributions (especially since we are contributors and making this easier will help our later work)
2. Set up packaging
3. Set up tooling to assist with code quality
4. Improvements to APIs/architecture
5. Performance

Enabling contributions
======================

This step is a mostly non-technical step and is setting up the framework in which people are able to work on the project, this is mostly about communications with the collaborators and users of the software. Technical steps will be covered later after we have a more organized approach for how we will be integrating our technical work.

We are looking to make it easier to get people contributing to the project. There are a set of tasks that are very much preliminary tasks to help people contribute, these include: choosing a license for the project, discussing the requirements for contributing (pull requests guidelines), documenting the requirements for installing and developing the software.

Also it's worth noting that while we are writing about these steps here in this article we have tried to maintain open communications in the GitHub project page for these various topics. Having the important conversations happen out in the open is very good for the health of the project because this allows other contributors to be informed of the reasoning behind changes being made, this makes it much easier for people to be actively involved in the project.

**License**
-----------

This is necessary, without this people will be strongly disincentivized from contributing as they will be unable to use the code in their own projects. We opened an issue: <https://github.com/persephone-tools/persephone/issues/19>

Choosing licenses for your projects can be tough, but it is absolutely essential, thankfully there's some help out there with sites like [Choose A Licence](https://choosealicense.com/)

After discussing the overall project goals and how those fit in with the research work the project decided on using the GPLv3 as the license.

**Contribution guidelines**
---------------------------

Getting some of the guidelines in place for contributing really helps the health of a project. You want people to be easily able to contribute in such a way that makes it easiest for their changes to be incorporated. This means spending a bit of time figuring out the version control strategy that the project will use. To get more of an understanding of this we ask a few questions, the discussion was vaguely as follows:

Do people commit to master?

> No, master is for stable changes and management of releases and as
> such direct commits are not allowed.

Do people have to open a pull request to get their changes incorporated?

> Yes

Who has the authority to merge to master?

> Project maintainers only. People will need to fork the project for
> doing their changes and then issue a pull request once their changes
> are stable/mature.

Are there any requirements that must be satisfied for a pull request to be considered for inclusion (such as passing automated tests? Other requirements?)?

> At the moment the only requirement is that there can't be substantial
> merge conflicts

This type of discussion is something that can happen informally but is much more valuable if documented in contributing guidelines. We suggested that pull requests can be created in a non-completed state but require a prefix to the pull request name that indicates that it is currently a work in progress. Such pull requests can be prefixed with \[WIP\], to mark that they are Work In Progress. This way we wish to encourage people to collaborate while maintaining the integrity of the master branches. The benefit of these work in progress pull requests are that they are a communications tool, they allow people to see what other people are working on and make it easier for people to get supported in making changes and also easier for people to prioritizes their work based on better information as to what
other people are doing.

A contribution guidelines document was added to the repository as a result of this discussion. We suggested that guidelines for issues and pull requests were included in that document along with some step by step instructions.

**Documenting installation**
----------------------------

Have good information on how to install the software is a major win for project adoption. The fewer hoops that people have to jump through in order to install the software the better and good documentation removes a major hurdle to adoption. As per our project work priorities we are reworking the installation process so we will decided to defer this documentation work until after the installation automation work is done.

The relevant issues are here:

- [Support setuptools install issue](https://github.com/persephone-tools/persephone/issues/16)

Some information about installs is now clearly documented in the project readme.

You can see what we did to streamline the installation later in this article.

Code reviews and Pull requests
------------------------------

How you deal with contributors work is a very important social aspect of a good project. We try to lead by example by offering a clear review of a Pull Request (PR) from a contributor here:

<https://github.com/persephone-tools/persephone/pull/68>

Giving direct feedback without being emotive about it allows people a good chance to improve their code and also strongly signals the projects intent to have solid internal quality.

Code engineering improvements
=============================

One of the biggest ways in which we can bring value to the project is via improving the software engineering aspects of the project. Many of these tasks give the project more utility even if they don't directly add new features for users.

**Cleaning up the install**
---------------------------

Being able to cleanly install the project with a package manager is very important, this involves tracking down package dependencies and doing the required work to enable the package to be installed via a package manager. Python package installs require you to write a `setup.py` file that contains various metadata required to install the project. In any install automation process you are forced to carefully analyze and then record your project dependencies in a machine readable format. This is done in the `install_requires` section of the setup command.

There are a few general processes that you can use to introduce formal package dependency management into an existing Python project. One simple way is to make a fresh install with no package dependencies installed, from there you can then attempt to iteratively run the code+tests and find out where the failing imports occur. After each failing import is fixed you then record the code dependency in your requirements and commit the changes. You then iterate until this is completed for all dependencies.

Another approach involves static analysis of the imports with a tool such as [Pylint](https://www.pylint.org/), these tools scan the source files and with a proper path set up they will then be able to report on which imports fail. This allows you to find which names *must* be importable from external packages and also allows you to track down any internal import issues your code may have.

### **Finding dependencies**

Via analyzing the code we found one 3rd party package that needed to be installed and created an issue here:

<https://github.com/persephone-tools/persephone/issues/21>

### **Installation via setuptools**

In order to be able to install via package managers such as pip you need to be able to have a properly defined `setup.py` with setuptools.

We opened a pull request with the changes required to make the code installable as a standalone python package:

<https://github.com/persephone-tools/persephone/pull/22>

### **Containers**

Containers are a great way to automate an environment for users. This is exceedingly beneficial for getting new contributors on board quickly as they don't need to spend as much time setting up the environment to run the code. Consider someone who finds a bug that takes 15 minutes to fix, you want to let them fix that bug in as close to 15 minutes as possible, if people have to spend multiple hours getting the environment right first it will act as a very strong disincentive from one-off contributors. Getting a container for development is a big win.

We were going to make a docker container but another contributor beat us to it! Their contribution can be found in [this pull request](https://github.com/persephone-tools/persephone/pull/25)

This shows the power of a good open source project, we heard that this work was already in progress so we prioritized a couple of other tasks higher to see if this was completed first. This way duplicated effort was avoided while pushing the project forward by continuing with other improvements.

After these pull requests were merged in you could then easily install the package via [`pip`](https://pip.pypa.io/en/stable/) or by fetching the Docker image. The end result is a massive efficiency win for anyone wishing to install the code or develop on the code. Having to track down dependencies is a massive pain and has the potential to waste a lot of time, making this as automated as possible both documents the state of the external dependencies and frees up a lot of project setup time for people who wish to be contributors/testers/users/etc.

**Automated testing setup**
---------------------------

Automated testing is a very powerful tool to have at your disposal, this is especially so when you have to support existing users or are refactoring. Because we were making the package installable we wanted to make some automation for testing the *installation* of the package. To do this we used the [Tox](https://tox.readthedocs.io/en/latest/) tool to automate package installation testing.

For unit testing we set up [pytest](https://docs.pytest.org/en/latest/) to run via Tox. This lets us run our unit tests against what will be the final installed package and allows us to automate the testing process against all the various combinations of Python implementations and versions. We created a pull request to do that here:

[https://github.com/persephone-tools/persephone/pull/24/](https://github.com/persephone-tools/persephone/pull/24/files)

We also set up Pylint error checker in the Tox run here:

<https://github.com/persephone-tools/persephone/pull/48/>

In order to have a good unit test suite it needs to be able to run fairly quickly. The quick feedback loop is essential. However you might want to have longer running tests to that are more of an integration test nature. Having both run from the same test runner, pytest in this case, is actually quite useful but needs configuration so that you don't have all the test runs be slow. We created a PR to allow you to mark the slow tests accordingly and to have them be skilled by default unless a command line flag is provided to run them:

<https://github.com/persephone-tools/persephone/pull/71>

**Configuration management**
----------------------------

Considering that this project has some significant complexity with
regards to paths and binaries used it's important to spend some time
thinking about configuration management. Specifically there are a lot of situations where the path to a specific directory must be specified for loading of data. This previously resided in `config.py` which had a variety of hardcoded strings which were imported by other modules, here's a snippet that shows the general pattern:

In [config.py](https://github.com/persephone-tools/persephone/blob/56a22bfcf733dc54734927fbfa198a63c120db78/persephone/config.py):

```python
    # The directory where the preprocessed data will be held.
    TGT_DIR = "./data"
    # The path for experiments
    EXP_DIR = "./exp"

    # The path to the sox tool for converting NIST format to WAVs.
    SOX_PATH = "/home/oadams/tools/sox-14.4.2/src/sox"
    OPENFST_BIN_PATH = "/home/oadams/tools/openfst-1.6.2/src/bin"
    FFMPEG_PATH = "/home/oadams/tools/ffmpeg-3.3/ffmpeg"
    KALDI_ROOT = "/home/oadams/tools/kaldi"
```

Which is used in the dataset processing files such as Chatino. In [chatino.py](https://github.com/persephone-tools/persephone/blob/56a22bfcf733dc54734927fbfa198a63c120db78/persephone/datasets/chatino.py\#L8):

```python
    from .. import config
    from .. import corpus
    from .. import feat_extract
    from .. import utils

    ### Initialize path variables.###
    # Path to unpreprocessed Chatino data from GORILLA.
    ORG_DIR = config.CHATINO_DIR
    # The directory for storing input features and targets.
    TGT_DIR = os.path.join(config.TGT_DIR, "chatino")
    ORG_WAV_DIR = os.path.join(ORG_DIR, "wav")
```

There's a variety of issues with this approach to configuration, some of which only appear after you create an installable package. In a small project storing configuration as Python files directly in the source is usually fine because you are able to quickly edit those files. If however you are packaging an install your source files are no longer in the current working directory, as they are installed into the Python site-packages directory. This makes a significant barrier to configuration changes for non-technical users as many people are not aware of how to edit those files. Not to mention that this would be a poor place to store configuration considering that multiple projects could use the same package if it was installed system wide (this type of general issue is why it is strongly advisable to use Python virtual environments for your projects as it makes your projects isolated from external changes like the one just mentioned). To resolve this issue it makes a lot of sense to read in configuration from a file. Python supplies the `ConfigParser` in the standard library to help you do just this. Due to this being in the standard library this is often our preferred way of setting up a configuration from file system because it doesn't need to bring in any additional package dependencies. If the configuration gets complicated we will consider a move to YAML or some other more robust format.

The other rather large issue is that the way in which the configuration was being used in other modules was creating a situation where module imports will fail if the paths are incorrect. This leads to some counterintuitive error stacktraces, if a path can't be found generating an `ImportError` is at best a bit misleading. But the bigger issue is that in this project users will often be analyzing one spoken language at a time and modules that were irrelevant to that language would be imported anyway. So say that a user is working on `language A` and they supply the paths required for `language A` only, then errors from not specifying the path for files for `language B` at module import time could arise. This is an annoying restriction on the user if they supply everything needed for `language A` but then get errors related to `language B` that they are not using. So forcing a user to do exception handling on an import seems like something we should not require (generally speaking having to do exception handling on imports is a strong signal of a structural problem, it is a definitely code-smell). It is far better if the import that requires the a missing data set fails at the time the code is executed as this will allow people to use only the modules that they need without needing to be concerned about how the internals of modules manage the paths. So for an example of where this came up in code, in [chatino.py](https://github.com/persephone-tools/persephone/blob/56a22bfcf733dc54734927fbfa198a63c120db78/persephone/datasets/chatino.py\#L29):

```python
PREFIXES = [os.path.splitext(fn)[0]
            for fn in os.listdir(ORG_TRANSCRIPT_DIR)
if fn.endswith(".txt")]
```

This is an example of something that is at the module level which means it will be executed at the time the module is imported. Here `ORG_TRANSCRIPT_DIR` is constructed from a path defined in `config.py` and will therefore fail if that path has not been specified at the time of module import. The solution to this is to make sure that this code only executes when Chatino language is actually being processed, which will involve a refactor.

Similarly for the paths to binaries, you want to make sure you only have to specify the binaries that are actually being used. Defaulting to the system names probably makes sense with the option for the user to override that path with something that that specify themselves in the configuration file.

**API work**
------------

Getting good APIs is a crucial part of making a good library. Seeing as this code is aiming to split out core parts into a reusable library then use that same library as an application getting the API right is a big deal.

### **Exception handling**

In Python the exceptions that can be thrown in functions form an important part of the API of those functions. This is because the users at the call site may need to do exception handling.

One thing that makes the code much easier to consume is a good exception handling hierarchy. In some spots the base Exception is being raised. This makes it impossible for the caller to catch exceptions with any granularity, if they wish to catch any exception from the library they have to  catch this base Exception which means catching all the child class of Exception as well. Very frequently this is not what is wanted because a user only wishes to catch a small group of types of exceptions, if you raise a base Exception you prevent the user being able to do this.

<https://github.com/persephone-tools/persephone/pull/47>.

Since this pull request a user can now catch more specific exceptions and an exception class `PersephoneException` has been created that will allow a user to catch exceptions that have come from the library.

### **Interfaces and testability**

Unfortunately there's some code that has a bit of an anti-pattern of using module level variables instead of parameters to pass in information into functions.

For example:

```python
    def prep_exp_dir():
        """ Prepares an experiment directory by copying the code in this directory
        to it as is, and setting the logger to write to files in that
        directory.
        """

        if not os.path.isdir(EXP_DIR):
            os.makedirs(EXP_DIR)
        exp_num = get_exp_dir_num(EXP_DIR)
        exp_num = exp_num + 1
        exp_dir = os.path.join(EXP_DIR, str(exp_num))
        if not os.path.isdir(exp_dir):
            os.makedirs(exp_dir)
        repo = Repo(".", search_parent_directories=True)
        with open(os.path.join(exp_dir, "git_hash.txt"), "w") as f:
            print("SHA1 hash: {hexsha}".format(hexsha=repo.head.commit.hexsha), file=f)

        return exp_dir
```

This is a situation where it is much better to pass in the directory as a parameter, even if the calling sites are always passing the same thing it helps the ability to run tests on the function. Without a specific parameter testing the function is much more difficult and is harder to reuse. We fixed some of these and raised the more general issue with the project maintainer.

## Conclusion

We have outlined some of the steps we took to get a library in a state that was easier to work on for collaborators and easier for the end users to install and use. When you are working on a library the tasks that make it easier for people to collaborate are very valuable and some of those tasks do not take much effort to get in place. Those low-effort collaboration enablers are a very good starting point when releasing a library, as there is a very high return on time investment for them.

This highlights a crucial different between in house vs open source library priorities. Take for example a library that’s hard to install and takes a few hours to install but would take a few days to fix. On a small team where you only have a a couple of people that will ever install the software a case could be made to defer that fix until more people got involved. In an open source library a painful install makes something essentially a non-starter for many people. Make an explicit effort to revisit the project priorities if the project has made a transition in the nature of how it is to be used, as the nature of underlying trade-offs can change substantially.

The Persephone library started out as an in house research tool, so the right choice was made at the time to prioritize some features over the ease of install. Now that it is starting to be a popular library the effort to make it easier to install and collaborate on has become a higher priority. Because of the skill set of CPS we were able to do the work to help the transition from a valuable in-house tool to a more accessible and polished open source library.

Please feel free to [contact us](/contact) if you wish to discuss work to transition code to open source libraries.