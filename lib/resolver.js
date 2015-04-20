var path = require('path')
var fs = require('fs')

function exists (target) {
  var found = false

  found = fs.existsSync(target)

  if (!found && path.extname(target) === '') {
    found = fs.existsSync(target + '.js')
  }

  return found
}

module.exports = function resolver (request, parent) {
  if (typeof request !== 'string' || /^[./]/.test(request)) {
    return request
  }

  var resolvedPath
  var i = 0

  for (i = 0; i < parent.paths.length; i++) {
    resolvedPath = path.resolve(parent.paths[i], request)
    if (fs.existsSync(resolvedPath)) {
      return resolvedPath
    }
  }

  for (i = 0; i < parent.paths.length; i++) {
    resolvedPath = path.resolve(parent.paths[i].slice(0, parent.paths[i].lastIndexOf('node_modules')), request)
    if (exists(resolvedPath)) {
      return resolvedPath
    }
  }

  return request
}
