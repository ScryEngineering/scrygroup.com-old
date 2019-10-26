---
title: "Renaming Git branches"
authors:
    - "Janis Lesinskis"
date: "2018-05-24"
tags:
    - Git
contentType: "tutorial"
callToActionText: "Got any tips for using Git that you'd like to share? Fill in the form below, we'd love to hear from you!"
hideCallToAction: false
---

I've spent a few days in a cold office And one thing I notice is that I'm making a lot more typo's when it's cold.

One particularly cold day (it was 13 degrees inside) I was working away on fixing some bugs in a branch on Git. I ended up solving the issue and wrote a test case that covered it in case there was a future regression. As I was about to push the changes I noticed a spelling mistake in the Git branch name.

```sh
git push origin bugifx-serialization
```

While I could have just pushed this up and merged it I really don't like pushing branch names with typo's. There's a level of attention to detail that's really crucial with software development work and things like this bother me. (for example if you had a script that matched on various branch name prefixes like "bugfix", "feature", etc. this would not match)

Because I haven't pushed changes there's a really quick fix for this:

```sh
git branch -m bugifx-serialization bugfix-serialization
```

Done!

In this case the `-m` is short for `--move`, like the `mv` command in the shell enables you to rename files by "moving" them this allows you to rename branches.
