'use strict'

var map = require('map-obj')
var snakeCase = require('to-snake-case')

const has = (array, key) => array.some(x => typeof x === 'string' ? x === key : x.test(key));

module.exports = function (obj, options) {
  options = Object.assign({deep: true}, options)
  const {exclude} = options;

  return map(obj, function (key, val) {
    if (!(exclude && has(exclude, key))) {
      key = snakeCase(key);
    }
    return [key, val]
  }, options)
}
