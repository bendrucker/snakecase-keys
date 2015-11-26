'use strict'

var test = require('tape')
var Snake = require('./')

test(function (t) {
  t.deepEqual(Snake({fooBar: 'baz'}), {foo_bar: 'baz'})
  t.end()
})
