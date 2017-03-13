'use strict'

const resolver = require('./lib/resolver.js')
const extensions = require('./lib/extensions')

const getParent = require('./lib/get-parent')

function resolvedByRequire (request) {
  try {
    return require(request)
  } catch (e) {}
}

function requere (request, onlySupportedExtname) {
  if (
    // If not string, go to require error logic
    typeof request !== 'string' ||

    request === '.' ||
    request === '..'
  ) {
    return require(request)
  }

  // Check if it's a built-in module
  const mod = resolvedByRequire(request)
  if (mod) {
    return mod
  }

  return resolver(request, getParent(__filename, new Error(), request[0] === '.'), onlySupportedExtname)
}

requere.register = (ext, loader) => {
  extensions[ext] = loader
}

requere.extensions = extensions

module.exports = requere
