arc-tslint integrates the TypeScript Linter
TSLint (https://palantir.github.io/tslint/) into Arcanist.
This allows linting TypeScript files directly through Arcanist

[Arcanist](https://secure.phabricator.com/book/phabricator/article/arcanist/)
is the command-line tool for [Phabricator](http://phabricator.org)


**Installation**

The libary has to be loaded in the `.arcconfig`:
```
{
  "load": [
    ".arc/arc-tslint"
  ]
}
```
where '.arc/arc-tslint' is the path to this repository.

Then add `tslint` to your `.arclint`


**LICENSE**

arc-tslint is released under the Apache 2.0 license except as otherwise noted.
