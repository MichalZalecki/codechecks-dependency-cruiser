# codechecks-dependency-cruiser

## Usage

Add to your `codechecks.yml` file:

```yml
checks:
  - name: codechecks-dependency-cruiser
    options:
      paths:
        - src
      rules:
        - no-orphans
```
