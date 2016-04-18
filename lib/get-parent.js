'use strict'

const path = require('path')

function getFilename (input) {
  const firstSepIndex = input.indexOf(path.sep)
  const lastSpaceIndex = input.lastIndexOf(' ', firstSepIndex)

  return input.slice(lastSpaceIndex)
}

module.exports = (parentFilename, e, relative) => {
  const stack = e.stack.split('\n')

  const index = stack.findIndex(s => s.includes(parentFilename))

  let parent

  for (let dir of stack.slice(index + 1)) {
    let match = getFilename(dir).match(/([^(]+):\d+:\d+\)?$/)

    if (match) {
      match = match[1].trim()
    }

    if (!match || !path.isAbsolute(match)) {
      continue
    }

    parent = match
    break
  }

  if (relative) {
    return path.dirname(parent)
  }

  const lastIndex = parent && parent.split(path.sep).lastIndexOf('node_modules')

  if (lastIndex > -1) {
    return parent.slice(0, lastIndex + 1)
  }

  return process.cwd()
}
