---
title: "Testing an API that accepts multipart/form-data"
authors:
    - "Janis Lesinskis"
date: "2018-05-23"
tags:
    - web-development
    - web-API
    - CURL
    - testing
contentType: "tutorial"
draft: true
---

Do you need to automatically test an API that will accept `multipart/form-data`? Here's some suggestions.

<!-- end excerpt -->

What we wanted to do is test an API that lets you upload an audio file. So lets go through some alternatives to will let us do that:

## Postman

We quite like [Postman](https://www.getpostman.com/) for API testing in the more general cases. There is however one particularly annoying pain point with Postman, it won't save the files associated with a `multipart/form-data` POST request.

An [issue addressing this](https://github.com/postmanlabs/postman-app-support/issues/2331) is open and has been for over a year. This is a substantial annoyance when you are trying to automate a testing workflow. If it weren't for this Postman would completely meet our needs in many cases such as the [Persephone web API](https://github.com/persephone-tools/persephone-web-API/) we have been developing. Now apparently you can get this done with their command line tool Newman, as explained in [their blog post](http://blog.getpostman.com/2014/11/15/using-newman-to-run-collections-with-file-post-requests/).

Upsides:

- Can write scripts in JavaScript to test the results.

Downsides:

- Can't save the file along with with the `multipart/form-data` request which greatly reduces the utility of the collections runner in the GUI.

## CURL

Perhaps one of the simplest things is to construct these queries using [CURL](https://curl.haxx.se/).

```sh
 curl -X POST -F audioFile=@testing.wav --header 'Content-Type: multipart/form-data' --header 'Accept: application/json' 'http://127.0.0.1:8080/v0.1/audio'
```

Being a command line call you can script these in a shell script.

Upsides:

- CURL is fairly ubiquitous, so it's fairly easy to get started. Most Linux distributions have a package for it (if it is not installed already) and [Windows binaries exist](https://curl.haxx.se/download.html).
- You can fairly easily script this in a shell script.

Downsides:

- Harder to write tests on the results of the request.
- If you have to process JSON data returned from the call you either have to use a CLI tool such as [jq](http://stedolan.github.io/jq/) or you have to invoke some other language to then process the JSON.

## Python based options

Here's a few Python based options.

### Tavern

[Tavern](https://github.com/taverntesting/tavern) is a project that aims to make it as easy as possible to integrate API testing with an existing Python CI setup. It integrates well with [pytest](https://docs.pytest.org/en/latest/) and also provides a CLI runner if you are not using pytest.

For a project that is already using pytest this seemed like a really good choice. However when we actually tried using it we ran into issues with integrating this with the [Flask test server](http://flask.pocoo.org/docs/1.0/testing/).

Upsides:

- Declarative formatting for the test cases
- Composing more that one test is easy

Downsides:

- Additional test dependency
- Hard to get this to work with the test client supplied by Flask.