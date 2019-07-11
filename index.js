'use strict'

var map = require('map-obj')
var snakeCase = require('to-snake-case')

module.exports = function (obj, options) {
  options = Object.assign({ deep: true, exclude: [], excludeCharacters: [] }, options)

  return map(obj, function (key, val) {
    return [
      matches(options.exclude, key) ? key : snakeCaseOptions(options.excludeCharacters, key),
      val
    ]
  }, options)
}

function matches (patterns, value) {
  return patterns.some(function (pattern) {
    return typeof pattern === 'string'
      ? pattern === value
      : pattern.test(value)
  })
}

function snakeCaseOptions (elements, key) {
  if (!elements || elements.length <= 0) return snakeCase(key)

  var elementToUse = elements[0]
  var leftElements = elements.slice(1)

  var subKeys = key.split(elementToUse).map((k) => snakeCaseOptions(leftElements, k))
  return subKeys.reduce((acc, curr) => `${acc}${acc && acc.length > 0 ? elementToUse : ''}${curr}`, '')
}
