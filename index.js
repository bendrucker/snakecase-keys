'use strict'

var map = require('map-obj')
var snakeCase = require('to-snake-case')

module.exports = function (obj, options) {
  var shallow = options && options.deep === false

  return map(obj, function (key, val) {
    return [snakeCase(key), val]
  }, {deep: !shallow})
}
