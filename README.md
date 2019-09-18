# codechecks-dependency-cruiser

## Usage

Add to your `codechecks.yml` file:

```yml
checks:
  - name: codechecks-dependency-cruiser
    options:
      exclude: (node_modules)
      graph: true
      paths:
        - src
```

Options

| name | required | type | description |
| --- | --- | ---  | --- |
| `paths` | yes | `string[]` | files or directories to cruise |
| `graph` | no | `boolean` | whether to generate dependency graph |
| `exclude` | no | `string` | a regexp for modules to exclude from being cruised |
| `config` | no | `string` | custom path to .dependency-cruiser.js or .dependency-cruiser.json |

## Install GraphViz

macOS

    brew install graphviz

Ubuntu

    sudo apt-get install graphviz

## Limitations

* Extending presets is not supported, use self-contained dependency-cruiser configuration
* Generating graphs require [GraphViz](http://www.graphviz.org/) installed
