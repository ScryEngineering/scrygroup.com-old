---
title: "Getting Altair to render inline in Jupyter"
authors:
    - "Janis Lesinskis"
date: "2019-04-11"
tags:
    - Altair
    - Jupyter
    - packages
    - pip
    - environments
    - Vega
contentType: "tutorial"
callToActionText: "Have you got a project that requires in depth knowledge of Python or Jupyter notebooks? We'd love to hear about it so fill in the form below with some details."
hideCallToAction: false
---

Run into the issue where Altair won't plot inline in your Jupyter notebooks? Here's a reason why it happens and how to fix it.

<!-- end excerpt -->

Since the 2.0 version of Vega was released there's been an issue with rendering Altair inline in Jupyter notebooks.

In a recent workshop I was trying to show people some examples from the Altair examples page and I ran into the following issue:

```python
import altair as alt
import pandas as pd

source = pd.DataFrame({
    'a': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    'b': [28, 55, 43, 91, 81, 53, 19, 87, 52]
})

alt.Chart(source).mark_bar().encode(
    x='a',
    y='b'
)
```

And depending on configurations/packages you end up getting no visualizations only the following output:

```
<VegaLite 2 object>

If you see this message, it means the renderer has not been properly enabled
for the frontend that you are using. For more information, see
https://altair-viz.github.io/user_guide/troubleshooting.html
```

When using Altair without nteract, a user must run `alt.renderers.enable('notebook')` but I ran into a subsequent issue with attempting to run this:

```python
>>> alt.renderers.enable('notebook')
---------------------------------------------------------------------------
NoSuchEntryPoint                          Traceback (most recent call last)
~/anaconda3/lib/python3.7/site-packages/altair/utils/plugin_registry.py in _enable(self, name, **options)
    133             try:
--> 134                 ep = entrypoints.get_single(self.entry_point_group, name)
    135             except entrypoints.NoSuchEntryPoint:

~/anaconda3/lib/python3.7/site-packages/entrypoints.py in get_single(group, name, path)
    185 
--> 186     raise NoSuchEntryPoint(group, name)
    187 

NoSuchEntryPoint: No 'notebook' entry point found in group 'altair.vegalite.v2.renderer'

During handling of the above exception, another exception occurred:

ValueError                                Traceback (most recent call last)
<ipython-input-2-74da33b3ed9c> in <module>
      1 import altair as alt
----> 2 alt.renderers.enable('notebook')

~/anaconda3/lib/python3.7/site-packages/altair/utils/plugin_registry.py in enable(self, name, **options)
    169         if name is None:
    170             name = self.active
--> 171         return PluginEnabler(self, name, **options)
    172 
    173 

~/anaconda3/lib/python3.7/site-packages/altair/utils/plugin_registry.py in __init__(self, registry, name, **options)
     23         self.options = options
     24         self.original_state = registry._get_state()
---> 25         self.registry._enable(name, **options)
     26 
     27     def __enter__(self):

~/anaconda3/lib/python3.7/site-packages/altair/utils/plugin_registry.py in _enable(self, name, **options)
    135             except entrypoints.NoSuchEntryPoint:
    136                 if name in self.entrypoint_err_messages:
--> 137                     raise ValueError(self.entrypoint_err_messages[name])
    138                 else:
    139                     raise

ValueError: 
To use the 'notebook' renderer, you must install the vega package
and the associated Jupyter extension.
See https://altair-viz.github.io/getting_started/installation.html
for more information.
```

Given that the workshops I've been running with [Python Charmers](https://pythoncharmers.com/?ref=CPS-altair-post) have been highly organized with a lot of hours put into preparations time I had an immediate intuition that something may have been amiss with the more recent package versions.

Since we explicitly installed Vega just before running this makes for a highly annoying error.
There's an open issue about this over on the GitHub page: https://github.com/altair-viz/altair/issues/1114

Effectively the reason this happens is because Altair does not work well with the 2.x.x version of Vega.
The maintainer says this is hard to fix because:

    Altair doesn't have any dependency on vega, so there's nowhere to pin the version.

For example after running this command in a fresh virtual environment:

```
pip install jupyter altair vega
```

We end up with this following combination of packages installed (from `pip freeze` output):

```
altair==2.4.1
appnope==0.1.0
attrs==19.1.0
backcall==0.1.0
bleach==3.1.0
decorator==4.4.0
defusedxml==0.5.0
entrypoints==0.3
ipykernel==5.1.0
ipython==7.4.0
ipython-genutils==0.2.0
jedi==0.13.3
Jinja2==2.10.1
jsonschema==3.0.1
jupyter-client==5.2.4
jupyter-core==4.4.0
MarkupSafe==1.1.1
mistune==0.8.4
nbconvert==5.4.1
nbformat==4.4.0
notebook==5.7.8
numpy==1.16.2
pandas==0.24.2
pandocfilters==1.4.2
parso==0.4.0
pexpect==4.7.0
pickleshare==0.7.5
prometheus-client==0.6.0
prompt-toolkit==2.0.9
ptyprocess==0.6.0
Pygments==2.3.1
pyrsistent==0.14.11
python-dateutil==2.8.0
pytz==2019.1
pyzmq==18.0.1
Send2Trash==1.5.0
six==1.12.0
terminado==0.8.2
testpath==0.4.2
toolz==0.9.0
tornado==6.0.2
traitlets==4.3.2
vega==2.0.1
wcwidth==0.1.7
webencodings==0.5.1
```

The problematic combination is:

```
altair==2.4.1
vega==2.0.1
```

To fix the dependencies issue you want to pin the install of Vega using the requirements format:

```
pip install altair "vega<2" notebook
```

A separate but possibly confounding issue is if the notebook renderer extension has not been properly installed into jupyter notebook. If you try to enable the notebook renderer and see the following:

```python
>>> import altair as alt
>>> alt.renderers.enable('notebook')

ValueError: 
To use the 'notebook' renderer, you must install the vega package
and the associated Jupyter extension.
See https://altair-viz.github.io/getting_started/installation.html
for more information.
```

Then there's potentially some issues with the jupyter extension that implements the renderer not being installed properly. From the [stackoverflow answer](https://stackoverflow.com/a/55014794) from the maintainer it suggests you can do the following:

```
jupyter nbextension install --sys-prefix --py vega
```

If you still get the entry point issue from before then you will also have to downgrade Vega and pin the version to `<2` since this will be the latest version in the working 1.x.x series. (An explicit version pin such as this may be worth revisiting in the future if new releases fix the issues)

Then if you run this:

```python
>>> import altair as alt
>>> alt.renderers.enable('notebook')
RendererRegistry.enable('notebook')
```

You should see the correct output inline in your Jupyter notebook.