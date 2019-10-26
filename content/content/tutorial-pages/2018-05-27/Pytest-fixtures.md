---
title: "Pytest fixtures with Flask"
authors:
    - "Janis Lesinskis"
date: "2018-05-27"
tags:
    - Python
    - pytest
    - OpenAPI
    - REST
    - Flask
    - testing
    - web-API
contentType: "tutorial"
---

Recently I've been working on a web API with Flask, here's how I went about making unit tests with pytest work well with Flask and testing the API via requests.

<!-- end excerpt -->

Creating a [Web API for Persephone](https://github.com/persephone-tools/persephone-web-API/) has involved writing an API using [OpenAPI](https://github.com/OAI/OpenAPI-Specification) powered by [Flask](http://flask.pocoo.org/). This makes good use of the [connexion library](https://github.com/zalando/connexion) for providing an OpenAPI powered API. We really can't speak highly enough about OpenAPI for specifying [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API's because the tooling is very good and good tooling means large time savings.

In early development we were just testing the API via [Postman](https://www.getpostman.com/) and while this worked reasonably well it didn't integrate as nicely with the CI tooling we were using. It is inconvenient to have to spin up a server to test against when you are wanting to run the unit tests. I came across a situation where there was a bug with the API that I wanted to write a couple of regression tests for that would run with the unit tests. By making these tests run from the CI we thought it would benefit other contributors, especially if it could be integrated with the GitHub pull-requests (PR) workflow. (If there's some way of using the tests from Postman in a CI setup that would be really good to know about, please [email us](/contact)!)

In this tutorial I'll run you through the thought process I had when I was putting together the code to run these API tests via pytest, the code in this article is mostly in this PR: <https://github.com/persephone-tools/persephone-web-API/pull/12>

In the spirit of getting something working first before refactoring I put together a very basic test case for an endpoint:

```python
import os

import connexion
from connexion.resolver import RestyResolver
import pytest

import api

flask_app = connexion.FlaskApp(__name__)
flask_app.add_api('../swagger/api_spec.yaml', resolver=RestyResolver('api'))


@pytest.fixture(scope='module')
def client():
    with flask_app.app.test_client() as c:
        yield c

def test_backend(client):
    """Test information about the transcriber library on the backend is provided"""
    response = client.get('/v0.1/backend')
    assert response.status_code == 200
```

So far so good. Test runs and works. (note that we have to use `flask_app.app` to access the underlying Flask application because connexion wraps the Flask app up)

So I make another test for the file upload capabilities like so:

```python
def test_audio_uploads_endpoint(client):
    """Test audio upload endpoint works"""
    import io
    WAV_MAGIC_BYTES = b'RIFF....WAVE'
    data = {'audioFile': (io.BytesIO(WAV_MAGIC_BYTES), 'test_wav_file.wav')}
    response = client.post(
        ('/v0.1/audio'),
        data=data,
        content_type='multipart/form-data'
    )
    assert response.status_code == 201
```

This test failed with a 500 error. To determine why I turned on the debug mode via the flask configuration by adding the following to the client fixture setup:

```python
app = connexion.FlaskApp(__name__)
app.add_api('../swagger/api_spec.yaml', resolver=RestyResolver('api'))

@pytest.fixture(scope='module')
def client():
    # fetch underlying flask app from the connexion app
    flask_app = app.app
    flask_app.config['DEBUG'] = True
    flask_app.config['TESTING'] = True
    with flask_app.test_client() as c:
        yield c
```

So now when this fails I at least get a message as to why as opposed to just getting the nondescript 500 response (this is a sensible default, I would like to see a 500 without extra information when running this in production).

Having a test case that works while the other doesn't comes down to configuration not being set up properly for the file uploads. Generally you want to make sure that if you are doing an integration type of test that you are actually testing the same thing which means that the configuration must be as close to identical as you can make it. Differences between test and production environments can lead to really perplexing bugs that happen only happen in testing but not production (or vice-versa) like the [SQLite foreign keys issue that we wrote about](/tutorial/2018-05-07/SQLite-foreign-keys/).

So I set up the required configuration to try to closely mirror the actual app config:

```python
@pytest.fixture(scope='module')
def client():
    # !!! duplication of config begins here !!!
    # fetch underlying flask app from the connexion app
    flask_app = app.app

    # configure the DB
    # in-memory sqlite DB for development purposes, will need file backing for persistence
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    from api import db
    db.init_app(flask_app)

    # create DB tables
    with flask_app.app_context():
        db.create_all()

    # configure upload paths
    flask_app.config['MAX_CONTENT_LENGTH'] = 64 * 1024 * 1024 #max 64 MB file upload
    flask_app.config['BASE_UPLOAD_DIRECTORY'] = os.path.join(os.getcwd(), 'test_uploads')
    configure_uploads(flask_app)
    # !!! duplication of config ends here !!!

    flask_app.config['DEBUG'] = True
    flask_app.config['TESTING'] = True
    with flask_app.test_client() as c:
        yield c
```

Now everything works well, the test no longer errors. The test itself is fairly simple here but the fixture to set up the test client needed a lot of additional work. There's 2 issues that become immediately apparent here:

1. A lot of code is getting duplicated per file to set up the fixtures.
2. A lot of the configuration is duplicated with the main app itself.

So I went about fixing these issues in this PR.

# Using pytest fixtures with Flask

In order to deal with this duplication of the test fixtures we can make use of Pytest's test fixtures. Specifically Pytest provides the ability to specify a fixture to multiple test files via `conftest.py`. This will always be run once before pytest runs any tests.

So we set up a file `tests/conftest.py` in which we can set up fixtures that will be available to all the tests we wish to run.

If we just copied the existing setup directly into multiple test files it won't work  as we would be running a few things that must be run only once, more than once. Here's what happens if you do this:

```
E           AssertionError: A setup function was called after the first request was handled.  This usually indicates a bug in the application where a module was not imported and decorators or other functionality was called too late.
E           To fix this make sure to import all your view modules, database models and everything related at a central place before the application starts serving requests.
```

The database tables have already been created so trying to create them again raises an error. So we have to make sure that these functions that create the database tables are called only once. To do this we can make good use of the fact that Python modules are effectively singletons and that `conftest.py` will allow us to write a fixture file where we can place the relevant configuration.

```python
# conftest.py

#Set up flask_app here

@pytest.fixture
def client():
    """Create a test client to send requests to"""
    with flask_app.test_client() as c:
        yield c
```

So at this point we have now created a fixture and removed the duplicated code to set up the test server.

# Improving temporary files

One thing that's a little bit suboptimal is the handling of files used in the tests. Because the file upload in the tests were configured to go to the same directory each run the filesystem state is different between test runs. This is not ideal, you want each test run to be run in as much isolation as possible.

So we used the [pytest temporary file fixture](https://docs.pytest.org/en/latest/tmpdir.html) to improve this:

```python
@pytest.fixture
def client(tmpdir):
    """Create a test client to send requests to"""
    flask_app.config['BASE_UPLOAD_DIRECTORY'] = os.path.join(str(tmpdir), 'test_uploads')

    from api.upload_config import configure_uploads
    configure_uploads(flask_app)
    with flask_app.test_client() as c:
        yield c
```

Now each test run has a predictable starting state. Note that the `tmpdir` fixture is not of a type that will work with `os.path.join` hence the call to `str` here.