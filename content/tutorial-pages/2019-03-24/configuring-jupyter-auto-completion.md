---
title: "How to configure Jupyter to not autocomplete"
authors:
    - "Janis Lesinskis"
date: "2019-03-24"
tags:
    - Python
    - Jupyter
contentType: "tutorial"
callToActionText: "Have you got a project that requires in depth knowledge of Python or Jupyter notebooks? We'd love to hear about it so fill in the form below with some details."
hideCallToAction: false
---

Have you ever found the autocompletion of certain characters like brackets or quotes to be an annoyance in Jupyter? If so here's how to change the configuration to disable this.

<!-- end excerpt -->

There's 2 main ways to do this, you can edit the configuration file directly or you can do it from code in the notebook. The following instructions have been tested on version 4.4.0.

## From configuration file

You will need to put this into the Jupyter configuration directory.
To find the correct location for your configuration files you can run:

```bash
jupyter --paths
```

Then create or modify the `nbconfig/notebook.json` file to contain this section for `CodeCell` behavior:

```json
{
  "CodeCell": {
    "cm_config": {
      "autoCloseBrackets": false
    }
  }
}
```

Note you may need to refresh the browser to get this to apply.

## From code

```python
from notebook.services.config import ConfigManager
c = ConfigManager()
c.update('notebook', {"CodeCell": {"cm_config": {"autoCloseBrackets": False}}})
```

Note you may need to refresh the browser to get this to apply.

This is just an automated version of editing the configuration file directly. This file will go in the first configuration path as seen in `jupyter --paths`, in my case this was `~/.jupyter/nbconfig/notebook.json`.