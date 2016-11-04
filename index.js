'use strict'

var map = require('map-obj')
var snakeCase = require('to-snake-case')

module.exports = function (obj) {
  return map(obj, function (key, val) {
    return [snakeCase(key), val]
  }, {deep: true})
}
