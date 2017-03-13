'use strict'

const loadModule = require('./load-module')
const path = require('path')

module.exports = function resolver (request, parent, onlySupportedExtname) {
  return loadModule(path.resolve(parent, request), onlySupportedExtname)
}
