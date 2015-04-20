var resolver = require('./lib/resolver.js')
var loader = require('./lib/loader.js')

module.exports = function requere (request) {
  return loader(resolver(request, module.parent), module.parent)
}
