'use strict'

const path = require('path')

module.exports = (parentFilename, e, relative) => {
  const stack = e.stack.split('\n')

  const index = stack.findIndex(s => s.includes(parentFilename))

  let parent

  for (let dir of stack.slice(index + 1)) {
    let match = dir.match(/\((.+):\d+:\d+\)?$/)

    if (!match || !path.isAbsolute(match[1])) {
      continue
    }

    parent = match[1]
    break
  }

  if (relative) {
    return path.dirname(parent)
  }

  const lastIndex = parent && parent.split('/').lastIndexOf('node_modules')

  if (lastIndex > -1) {
    return parent.slice(0, lastIndex + 1)
  }

  return process.cwd()
}
