var Module = require('module')
var path = require('path')
var fs = require('fs')

function exists (target, extensions) {
  if (fs.existsSync(target)) {
    return target
  }

  if (path.extname(target) === '') {
    for (var i = 0; i < extensions.length; i++) {
      var resolvedPath = target + extensions[i]
      if (fs.existsSync(resolvedPath)) {
        return resolvedPath
      }
    }
  }
}

module.exports = function resolver (request, parent) {
  if (typeof request !== 'string' || /^[./]/.test(request)) {
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
