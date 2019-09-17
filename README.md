# codechecks-dependency-cruiser

## Usage

Add to your `codechecks.yml` file:

```yml
checks:
  - name: codechecks-dependency-cruiser
    options:
      exclude: (node_modules)
      paths:
        - src
```

Options

| name | required | description |
| --- | --- | --- |
| `paths` | yes | files or directories to cruise |
| `exclude` | no | a regexp for modules to exclude from being cruised |
| `config` | no | custom path to .dependency-cruiser.js or .dependency-cruiser.json |

## Limitations

* Extending presets is not supported, use self-contained dependency-cruiser configuration
