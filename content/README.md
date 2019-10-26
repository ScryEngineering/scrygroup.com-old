# CPS content

This is the content for the Scry Engineering website.

## Directory structure

There is a folder called `content` that is the top level directory for content.

Within that there are some subdirectories:

* blog-posts
* tutorial-pages
* people
* faces (which contains the portrait images on the people pages)
* services

Example directory tree:

```sh
content/
├── blog-posts
│   ├── 2018-02-25
│   │   └── Persephone-project.md
│   ├── 2018-04-21
│   │   └── CPS-site-relaunched.md
│   └── 2018-06-26
│       └── Tensorflow-serving-python-3.md
├── faces
│   ├── aapeli.jpg
│   └── janis.jpg
├── people
│   ├── aapeli.md
│   ├── cps.md
│   └── janis.md
├── services
│   ├── data-science.md
│   ├── machine-learning.md
│   ├── mathematical-optimization.md
│   ├── natural-language-processing.md
│   ├── process-automation.md
│   └── tech-strategy.md
└── tutorial-pages
    ├── 2018-02-06
    │   └── python-excepthook-logging.md
    └── 2018-06-23
        └── limiting-unit-test-runtime.md
```

The structure is set up for ease of use with Gatsby.js but is by no means limited to just that.
Some conventions however make it easier to manage and edit the content.

## Creating a post

Posts are written in markdown. If you are unfamiliar with markdown please see the [markdown guide](https://guides.github.com/features/mastering-markdown/) for help with understanding markdown syntax.

### Post body (main contents of a post)

The content of a post is just the contents of the markdown file.
Static assets from the post is pulled in via a gatsby plugin by searching the current directory that the post resides in.

This is useful if you need to have some images or similar included in your post. So for example lets look at our tutorial about workflows for editing markdown to see how this works.

Here's the directory structure:

```sh
└── tutorial-pages
    ├── 2018-04-23
    │   ├── editing-markdown.md
    │   ├── markdownLinter.png
    │   └── markdownSyntaxHighlighting.png
```

The directory structure itself determines the slug in Gatsby. So this generates a post at `/tutorials/2018-04-23/editing-markdown`.
Here's some markdown from the post itself:

```markdown
## Linting via VS Code plugin

Seeing as we use VS Code already we can install a [markdown linter extension](https://github.com/DavidAnson/vscode-markdownlint) that gives immediate linting for our Markdown files.

So for example have a look at this screen-shot from when I was writing a draft for a post on here:

![example of linter UX in VS Code](markdownLinter.png "VS Code markdownlint extension")
```

Note that the post body text starts with a second level heading, this is because a first level heading is generated on the website above the post body text.

So we see that creating an image just involves making a reference to the image file name in the current directory.

### Metadata

Metadata for the various posts is stored in the frontmatter. This is a section at the top of the markdown file that is fenced off with `---` as a delimiter. Let's again use the markdown article as an example:

```md
---
title: "Editing markdown"
authors:
    - "Janis Lesinskis"
date: "2018-04-23"
tags:
    - markdown
    - tooling
    - productivity
    - linting
contentType: "tutorial"
callToActionText: "Are you looking for ways to improve the editing workflows your team uses? Let us know about your current workflow and requirements bu filling in the form below and one of our content workflow experts will get back to you."
---

Even before we moved our site to a [JAM stack](https://jamstack.org/) we found that we edited a number of [Markdown](https://en.wikipedia.org/wiki/Markdown) files every day, for example those README.md files on our GitHub repositories and various other bits of documentation.

More article content here...
```

You can see that various pieces of metadata are stored here that are later parsed by Gatsby when building the pages and associated site structure.

### Call to action text

At the bottom of the pages as they are rendered there's the option to have a call to action section. Specifying what text goes here is done in the metadata section called `callToActionText`.

For example

```markdown
---
callToActionText: "Are you looking for ways to improve the editing workflows your team uses? Let us know about your current workflow and requirements bu filling in the form below and one of our content workflow experts will get back to you."
---
```

If you don't supply anything here a default call to action text will be rendered at the bottom of the page.

### Specifying drafts

Add in a `draft: true` in the frontmatter to prevent a post from being published on the site:

```markdown
---
title: "how to use mark a post as a draft"
date: "2018-02-06"
tags:
    - markdown
draft: true
---

This page won't be built when you run gatsby-build
```

This lets you work on new posts within version control without having to publish them.

### Excerpts

When you are writing a post in markdown you can specify the excerpt by using the separator configured in `gatsby-config.js` in the `excerpt_separator` option for the `gatsby-transformer-remark` plugin.

For now it is `<!-- end excerpt -->`.
You would use this like so:

```markdown
---
title: "how to use the excerpt separator"
date: "2018-02-06"
tags:
    - markdown
    - excerpts
    - howto
    - someOtherTag
---

The excerpt written here can be used on various pages to render a summary, don't make it too long though as that might break formatting on some listing pages in the site!

<!-- end excerpt -->

Rest of the tutorial text is here....
```

## Author information

We are using Markdown files to store the information about the people/authors which is later used to create biography pages. The file path is in `content/people`

```sh
content/
├── faces
│   ├── aapeli.jpg
│   └── janis.jpg
├── people
│   ├── aapeli.md
│   ├── cps.md
│   └── janis.md
```

Author information is extracted from these markdown documents, templating system will then create the page for all people specified in that file.

The image data for portrait photos is found in the `faces` directory at the filename provided in the metadata section `image` key.

For example

```markdown
---
name: "Janis Lesinskis"
teamMember: true
image: "janis.jpg"
url: "https://www.lesinskis.com"
location: "Australia/Canada"
bio: "Director of Technological Innovation"
socialUrls:
    - "https://github.com/shuttle1987"
    - "mailto:janis@scrygroup.com"
    - "https://www.linkedin.com/in/janislesinskis/"
shortBlurb: "The short blurb is a few of sentences long about the author.

This is the other sentence"
miniBlurb: "A single sentence about the author goes here."
---
```

The `images` section here will look for the file `faces/janis.jpg` when creating the portrait photo images.

## Creating a service page

Create a page in the `/services` directory, for example `data-science.md`:

```markdown
---
name: "Data science"
callToActionText: "We'd love to learn more about your data science and analytics requirements. Contact us today."
hideCallToAction: false
---

Writing for this service page goes here

```