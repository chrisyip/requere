'use strict'

const path = require('path')
const extensions = require('./extensions')

const glob = require('glob')

const isGlob = require('is-glob')

const fs = require('fs')

function readStat (path) {
  try {
    return fs.statSync(path)
  } catch (e) {
    return false
  }
}

function resolveModuleLoader (request) {
  const extname = path.extname(request)

  if (extname) {
    return extensions[extname] || (require.extensions[extname] && require)
  }
}

function resolve (request) {
  let stat = readStat(request)
  let loader = require

  if (!stat) {
    return { request, loader, resolved: false }
  }

  if (stat.isFile()) {
    loader = resolveModuleLoader(request)

    return { request, loader: loader || require, resolved: !!loader }
  }

  if (stat.isDirectory()) {
    const exts = Object.keys(extensions).concat(Object.keys(require.extensions))
    const extPattern = `@(${exts.join('|')})`

    const result = glob.sync(`${request}/index${extPattern}`)

    const _request = result[0]
    loader = resolveModuleLoader(_request)

    return {
      request: _request || request,
      loader: loader || require,
      resolved: !!loader
    }
  }

  return { request, loader, resolved: false }
}

module.exports = (request, onlySupportedExtname) => {
  if (isGlob(request)) {
    const result = {}

    glob.sync(request, { nodir: true }).forEach(res => {
      const resolved = resolve(res)

      if (onlySupportedExtname) {
        if (resolved.resolved) {
          result[resolved.request] = resolved.loader(resolved.request)
        }
      } else {
        result[resolved.request] = resolved.loader(resolved.request)
      }
    })

    return result
  }

  const resolved = resolve(request)
  return resolved.loader(resolved.request)
}
