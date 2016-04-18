# requere

[![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Travis CI][travis-image]][travis-url] [![Coveralls][coveralls-image]][coveralls-url]

Better way to load modules in node.

# What is `requere`

`requere` is a package that avoid ugly path when loading modules in node.

For example:

```
config.js
lib/
  foo/
    bar/
      foobar.js
```

If you wanna use `config.js` in `foobar.js`, you might write code like this:

```js
const config = require('../../../config.js')
```

Yes, you have to figure out how many `../` out there.

But with `requere`:

```js
const config = require('requere')('config.js')
```

Yes, simple.

## glob

`requere` supports [`glob`](https://github.com/isaacs/node-glob).

```js
requere(pattern, onlySupportedExtname)

// Example
requere('foo/bar/**/*.js')
```

Returns an object with loaded modules, module's full path will be the key:

```js
{
  '/path/to/foo.js': exported
}
```

### `onlySupportedExtname`

If `onlySupportedExtname` is `true`, `requere` will only load modules with supported extname.

You can check supported extnames by `require.extensions` and `requere.extensions`.

For example:

```
foo/
  bar/
    baz.jpg
    foobar.js
```

`requere('foo/bar/*')` will throw errors, but `requere('foo/bar/*', true)` will not throw errors and return `foobar.js`.

## How to Use

Install via [npm](https://www.npmjs.com/):

```
npm install requere
```

```js
const requere = require('requere')

// Loading a npm package
const path = requere('path')

// Loading a file module
const foo = requere('./foo')

// Loading a file module from package root folder
const bar = requere('foobar/bar')

// Loading with glob pattern
const modules = requere('baz/**/*.@(js|json)')

// Loading with custom module loader
requere.register('.cson', requere('cson').load.bind(requere('cson')))
requere('config/*.cson')
```

## Require Hook (deprecated)

Requere hook is buggy, so, it's deprecated.

# Contributors

Via [GitHub](https://github.com/chrisyip/requere/graphs/contributors)

[npm-url]: https://npmjs.org/package/requere
[npm-image]: http://img.shields.io/npm/v/requere.svg?style=flat-square
[daviddm-url]: https://david-dm.org/chrisyip/requere
[daviddm-image]: https://david-dm.org/chrisyip/requere.svg?style=flat-square
[travis-url]: https://travis-ci.org/chrisyip/requere
[travis-image]: http://img.shields.io/travis/chrisyip/requere.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/chrisyip/requere
[coveralls-image]: http://img.shields.io/coveralls/chrisyip/requere.svg?style=flat-square
