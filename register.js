var Module = require('module')
var loader = require('./lib/loader.js')
var resolver = require('./lib/resolver.js')

Module._load = function (request, parent, isMain) {
  return loader(resolver(request, parent), parent, isMain)
}
