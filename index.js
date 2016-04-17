'use strict'

const Module = require('module')

const resolver = require('./lib/resolver.js')
const extensions = require('./lib/extensions')

const getCWD = require('./lib/get-cwd')

function requere (request, onlySupportedExtname) {
  if (
    // If not string, go to require error logic
    typeof request !== 'string' ||

    request === '.' ||
    request === '..' ||

    // Check if it's a built-in module
    !Module._resolveLookupPaths(request)[1].length
  ) {
    return require(request)
  }

  if (request[0] === '/') {
    return resolver(request, '', onlySupportedExtname)
  }

  return resolver(request, getCWD(__filename, new Error, request[0] === '.'), onlySupportedExtname)
}

requere.register = (ext, loader) => {
  extensions[ext] = loader
}

requere.extensions = extensions

module.exports = requere
