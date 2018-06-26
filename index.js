'use strict'

var map = require('map-obj')
var snakeCase = require('to-snake-case')

module.exports = function (obj, options) {
  options = Object.assign({deep: true}, options)

  return map(obj, function (key, val) {
    return [snakeCase(key), val]
  }, options)
}
