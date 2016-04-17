'use strict'

const loadModule = require('./load-module')
const path = require('path')

module.exports = function resolver (request, parent, onlySupportedExtname) {
  if (request[0] === '/') {
    return loadModule(request, onlySupportedExtname)
  }

  return loadModule(path.resolve(parent, request), onlySupportedExtname)
}
