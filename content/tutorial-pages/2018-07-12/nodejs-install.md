---
title: "How we install Node.js"
authors:
    - "Janis Lesinskis"
date: "2018-07-12"
tags:
    - nodejs
    - yarn
    - npm
    - NVM
    - package-management
contentType: "tutorial"
---

Here's how we go about installing Node.js

<!-- end excerpt -->

## Manage Node.js versions with NVM

The [node version manager](https://github.com/creationix/nvm) makes it much easier to have the right versions of node installed.

If you want to use more than one version of node this makes life a lot easier. We make use of this extensively.

We use the Git install [as described here](https://github.com/creationix/nvm#git-install). There's another installation option that involves curl getting piped into a root shell, please do not pipe into root shells, it’s bad news all around.

## Update npm/yarn

There’s a lot of benefits to running the latest npm and [Yarn](https://yarnpkg.com/lang/en/) versions. We have been using Yarn in house because it was first to have lock files and solved many issues at the time, since that time npm has also improved. To make the most of these improvements you will want to get the most recent versions installed.

## Global packages

Some packages assume that you are installing globally. One such package we regularly encounter is [`firebase-admin`](https://firebase.google.com/docs/admin/setup), this is a bit easier to use in a globally installed manner. If your operating system ships with an old Node.js version you can still run into some issues even if you are using NVM. If you use sudo it will call the system `node` not the NVM managed one. So we like to update the system Node.js before we install our global packages.

For the most part the only global packages generators or some non-project specific deployment packages. As much as possible we try to install per-project.

## Ubuntu Node.js packages

Installing Node.JS on Ubuntu can be a bit of a pain because there was a preexisting package called `node`. On older ubuntu versions if you do `apt-get install node` you will *not* get the Node.js but will get the Amateur Packet Radio Node package instead. (In more recent versions the radio package is gone)

As you can see in trusty 14.04 LTS:

* https://packages.ubuntu.com/trusty/node
* https://packages.ubuntu.com/trusty/nodejs

Here `node` is the packet radio package and `nodejs` will be Node.js

But then in later versions like xenial 16.04 LTS:

* https://packages.ubuntu.com/xenial/node
* https://packages.ubuntu.com/xenial/nodejs

And bionic 18.04:

* https://packages.ubuntu.com/bionic/node
* https://packages.ubuntu.com/bionic/nodejs

We see that `node` is no longer pointing to the packet radio package and instead is not found (I did some searching around and I think that project might be dead now). I think this change would have been probably the best of the various "bad" options available to the distribution’s package maintainers since in this situation the overwhelming majority of people expect installing `node` to be Node.js but a package by the same name already existed. They didn’t want to break existing packages that depended on the old packet radio package but they also didn't want the vast majority of new users to get frustrated by installing something they didn’t expect or having `node` not be the binary they were expecting so they removed the packet radio node packages from their package lists in the more recent releases. You might find the [bug report discussion](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=611698) interesting here.

You can also see from those sources that `apt-get install nodejs` will get you Node.JS but likely a very out of date version.

When installing you may have a situation where you may need to symlink `nodejs` to `node` to have the `node` refer to Node.JS on the path.

```sh
ln -s /usr/bin/nodejs ~/bin/node
```

Once you have got this sorted out it is good to update the base node version

The “suggested” way to to fetch the `.deb` files from nodesource is to do this:

```sh
# UNSAFE !!!
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
```

However we would strongly suggest not installing this way because piping directly into a sudo shell is very bad form as it creates unnecessary security risks (lots of very bad things can happen if you pipe arbitrary shell scripts from the internet into a root shell). It is far preferable to do something like this:

First pick which node version you want:

```sh
NODEREPO="node_10.x"
NODEREPO="node_9.x"
NODEREPO="node_8.x"
```

Then

```sh
curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
echo "deb https://deb.nodesource.com/${NODEREPO} $(lsb_release -sc) main" > /etc/apt/sources.list.d/nodesource.list
echo "deb-src https://deb.nodesource.com/${NODEREPO} $(lsb_release -sc) main" >> /etc/apt/sources.list.d/nodesource.list
sudo apt-get update
```

Now you have added the package sources you can install with:

```sh
sudo apt-get install -y nodejs
```

This will now install the most recent Node.js package via apt-get.

Check you got the right version with:

```sh
node --version
```