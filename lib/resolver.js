var Module = require('module')
var path = require('path')
var fs = require('fs')

function exists (target, extensions) {
  /**
   * Files have higher priority than directories in Module's loading strategy
   * e.g.
   *   foo.js
   *   foo/
   * require('./foo') will load `foo.js` not `foo/`
   * For directory, Module will try to load main file specified in package.json
   * or `index.EXT` (EXT is resolved by Module with module._extensions)
   * So, we have to make this strategy right
   */

  // `foo/` will become `PREFIX/foo` when using `path.resolve()` outside
  // this function, so ignore it

  // If target has extname, return it if exists, otherwise return false
  if (path.extname(target) !== '') {
    return fs.existsSync(target) ? target : false
  }

  // If target has no extname
  // Check if it's a file
  var stats
  if (fs.existsSync(target)) {
    stats = fs.statSync(target)

    // If it's a file, return it
    if (stats.isFile()) {
      return target
    }
  }

  // Check if file exists with supported extensions
  // If exists, return resolved path
  for (var i = 0; i < extensions.length; i++) {
    var resolvedPath = target + extensions[i]
    if (fs.existsSync(resolvedPath)) {
      return resolvedPath
    }
  }

  // If target exists and is a directory, return it,
  // let Module handles the rest
  if (stats && stats.isDirectory()) {
    return target
  }
}

module.exports = function resolver (request, parent) {
  if (typeof request !== 'string' ||
      // Check if request is a relative or asbolute path
      request[0] === '/' || request === '..' || request === '.' ||
      request.slice(0, 2) === './' || request.slice(0, 3) === '../') {
    return request
  }

  // Check if it's a built-in module
  if (!Module._resolveLookupPaths(request, parent)[1].length) {
    return request
  }

  var resolvedPath
  var i = 0
  var extensions = Object.keys(Module._extensions)

  for (i = 0; i < parent.paths.length; i++) {
    resolvedPath = exists(path.resolve(parent.paths[i], request), extensions)
    if (resolvedPath) {
      return resolvedPath
    }
  }

  for (i = 0; i < parent.paths.length; i++) {
    resolvedPath = path.resolve(parent.paths[i].slice(0, parent.paths[i].lastIndexOf('node_modules')), request)
    resolvedPath = exists(resolvedPath, extensions)
    if (resolvedPath) {
      return resolvedPath
    }
  }

  return request
}
