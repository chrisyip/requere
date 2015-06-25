# requere

[![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Travis CI][travis-image]][travis-url] [![Coveralls][coveralls-image]][coveralls-url]

Better way to require file in node

# What is `requere`

`requere` is a package that avoid ugly path when requiring modules in node.

For example, if there's a folder structure like this:

```
config.js
lib/
  foo/
    bar/
      foobar.js
```

If you wanna use `config.js` in `foobar.js`, you might write code like this:

```js
var config = require('../../../config.js')
```

Yes, you have to figure out how many `../` out there.

How about `requere`?

```js
var requere = require('requere')
var config = requere('config.js')
```

Yes, just that simple.

## How to Use

Install via [npm](https://www.npmjs.com/):

```
npm install requere
```

- Loading module: `requere('fs')`
- Loading file in relative path: `requere('./foo.js')` or `requere('../bar.js')`
- Loading file from the top folder of package: `requere('foo/bar.js')`

## Require Hook

If you hate to require `requere` in all files, you can use require hook in your main file:

```js
require('requere/register')
var bar = require('foo/bar.js')
```

### Attentions

- Require hook will pollute `Module._load()`. You must be knowing this, and there's a `requere/deregister` to help you disable require hook.
- `requere`'s require hook may conflict with other package's require hook, e.g. [`CoffeeScript`](http://coffeescript.org/), [`Babel`](https://babeljs.io/). If you use `requere()` instead register hook, everything goes fine.

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
