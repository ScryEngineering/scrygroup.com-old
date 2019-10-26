---
title: "Moving commits from one repository to another."
authors:
    - "Janis Lesinskis"
date: "2018-05-11"
tags:
    - Git
contentType: "tutorial"
---

Sometimes you'll have a project where you have some files that you wish to break out into a new repository.

For example when we were initially developing the CPS website we had some sample content inside the main repository as this made it easier to write the initial code. However it's a bit messy because we were developing a CMS and putting the content in the same repository.
Now that we want to reuse the repository as a potential base for other work it doesn't make sense for our content to be in there anymore.

So what we wanted to do was to put the content into an entirely different repository. We could have just done something like this:

```sh
git init CPS_content
cp -a CPS_gatsby/content/. CPS_content/
git add -A
git commit -m "Move content"
```

And all the files would have been there but we would have lost the commit history. But because we know Git and don't want to lose our history we did the following...

## Git cherry-pick

Git has this great tool that lets you pick out commits and apply them.

Git supplies the [cherry-pick](http://git-scm.com/docs/git-cherry-pick) tool to allow you to take commits from one repository and apply them to another. So you supply cherry-pick the commits that you wish to pick.

We are essentially trying to move one directory out into it's own repository.

1. Find the relevant commits
2. Pass those in to git cherry-pick

## Finding the relevant commits

In this case we have to find the commits that happened in the `content` directory.

`git-log` provides us with such a tool:

```sh
git log --format=oneline --no-merges master content/
```

This will find the commits that touched the `content/` directory.

Running this in the original repository has the following output:

```sh
f1083fc7d3a5288ae66bf6fb5b904f9553067070 Remove draft tag from SQLite tutorial
ae3ab62de0c17934bf87a1ef6bacdfc0b7dcc09e Clean up article and remove draft tag
7cad814715d31fc9f342aae0dbfd639ef2fcee73 Write about fix of problem
... more lines here ...
```

We can see that the most recent commit is at the top and oldest at the bottom.

Inspecting the commit messages shows that the commits are all content creation commits and not framework commits. Because we are being disciplined with our commits and aim to make commits that are one topic only we can be sure that a commit for an article won't contain something like say our hosting login configuration. This is one of the ways in which being disciplined with the size of commits pays off long term, you can use tools like this more easily. (More about commits that a little later)

## Extracting the commit SHA information

The log has found us the relevant commits, we could just copy and paste them in to the `git cherry-pick` command but that would be tedious and error prone. So we have to format the data to get it in to the form with which we can use as a `cherry-pick` argument.

The first thing we have to do is to remove the commit messages and just keep the SHA.  There's a variety of ways to do this from the command line, you can use powerful tools tools like [`sed`](https://www.gnu.org/software/sed/) or more simple tools like `cut`

`cut` is in this case fairly simple:

```sh
git log --format=oneline --no-merges master content/ | cut -d " " -f 1
```

Which creates:

```sh
f1083fc7d3a5288ae66bf6fb5b904f9553067070
ae3ab62de0c17934bf87a1ef6bacdfc0b7dcc09e
7cad814715d31fc9f342aae0dbfd639ef2fcee73
... more commits ...
```

So far so good. `cherry-pick` expects a list of SHA commits in the order in which they are to be applied. We want the oldest SHA hashes inserted first then the newest last.

This means we have to reverse the list. `tac` (`cat` backwards ;) ) will do this:

```sh
git log --format=oneline --no-merges master content/ | cut -d " " -f 1 | tac
```

Which creates:

```sh
... more commits...
7cad814715d31fc9f342aae0dbfd639ef2fcee73
ae3ab62de0c17934bf87a1ef6bacdfc0b7dcc09e
f1083fc7d3a5288ae66bf6fb5b904f9553067070
```

So now the newest commit is last. Now we have to get this all on the one line.
Here we use `tr` which is the "*tr*ansliterate" tool to replace newlines with :

```sh
git log --format=oneline --no-merges master content/ | cut -d " " -f 1 | tac | tr '\n' ' '
```

Which produces:

```sh
...more commits... 7cad814715d31fc9f342aae0dbfd639ef2fcee73 ae3ab62de0c17934bf87a1ef6bacdfc0b7dcc09e f1083fc7d3a5288ae66bf6fb5b904f9553067070
```

now we have all the commits in the form of the argument needed for cherry-picking!

```sh
git log --format=oneline --no-merges master content/ | cut -d " " -f 1 | tac | tr '\n' ' ' > content_SHA.txt
```

## Extracting the commits

So now we just need to glue the pieces together to get `cherry-pick` to run:

```sh
janis@janis-workstation:~/CPS/CPS_content (master)$ git remote add original_repo ../CPS_gatsby/
janis@janis-workstation:~/CPS/CPS_content (master)$ git remote -v 
original_repo   ../CPS_gatsby/ (fetch)
original_repo   ../CPS_gatsby/ (push)
janis@janis-workstation:~/CPS/CPS_content (master)$ git fetch original_repo 
```

So now our local repository has access to the commits.

We have to make an initial commit of some sort or cherry-pick will fail with a message like this:

```sh
error: Can't cherry-pick into empty head
fatal: cherry-pick failed
```

Assuming we have a commit HEAD already we are good to go!

We just need to pull those into the master branch, which we do by using cherry-pick with the SHA's we extracted before:

```sh
janis@janis-workstation:~/CPS/CPS_content (master)$ cat ../content_SHA.txt | xargs -n1 git cherry-pick
error: could not apply 681de41... Change directory name
hint: after resolving the conflicts, mark the corrected paths
hint: with 'git add <paths>' or 'git rm <paths>'
hint: and commit the result with 'git commit'
janis@janis-workstation:~/CPS/CPS_content (master|CHERRY-PICKING)$ git status
On branch master
You are currently cherry-picking commit 681de41.
  (fix conflicts and run "git cherry-pick --continue")
  (use "git cherry-pick --abort" to cancel the cherry-pick operation)

Unmerged paths:
  (use "git add/rm <file>..." as appropriate to mark resolution)

	added by them:   content/tutorial-pages/example-code-highlighting.md
	added by them:   content/tutorial-pages/example-tutorial.md
	added by them:   content/tutorial-pages/python-excepthook-logging.md
	deleted by us:   gatsby-config.js
	deleted by us:   gatsby-node.js
```

The command starts up a cherry-picking session as you can see in the prompt where we have to fix the conflict that's stopping the cherry-pick from succeeding.

This issue has come about because we changed around some files in these commits that were outside the `content` directory. From the point of view of making clean commits too much has gone on in this commit, we have tried changing conceptually unrelated code, and the issue comes up now when we are trying to cherry-pick. Note that you might have a sloppy commit like this and never run into any issues but this is the downside of that sloppiness.

So we have to resolve the issue then issue the command:

```sh
git cherry-pick --continue
```

Now if all has gone well you will see these changes applied until they are all completed or you run into another error:

```sh
[master 7a90d8c] Added tags in markdown header to test tag generation
 Date: Sat Apr 14 00:23:46 2018 +1000
 1 file changed, 4 insertions(+)
[master 0f1ab3c] Remove path from frontmatter as it seems to hit some GatsbyJS bug
 Date: Sat Apr 14 02:44:51 2018 +1000
 3 files changed, 3 deletions(-)
[master 25eb09c] Update article contents
 Date: Sat Apr 14 19:10:57 2018 +1000
 1 file changed, 6 insertions(+), 5 deletions(-)
error: could not apply fa4cd25... Add in support for excerpts separator
hint: after resolving the conflicts, mark the corrected paths
hint: with 'git add <paths>' or 'git rm <paths>'
hint: and commit the result with 'git commit'
```

Once you fix up all the conflicts then you are done. Have a look at you `git log` and enjoy!

If you want to verify everything has worked you can use the `diff` command:

```sh
diff --brief -r new/ old/
```

Which will show that any differences will be uncommitted changes in the original repository.
