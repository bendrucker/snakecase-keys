'use strict'

const map = require('map-obj')
const snakeCase = require('to-snake-case')

module.exports = function (obj, options) {
  options = Object.assign({ deep: true, exclude: [] }, options)

  return map(obj, function (key, val) {
    return [
      matches(options.exclude, key) ? key : snakeCase(key),
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
