'use strict'

var test = require('tape')
var Snake = require('./')

test(function (t) {
  t.deepEqual(Snake({fooBar: 'baz', nested: {fooBar: 'baz'}}), {foo_bar: 'baz', nested: {foo_bar: 'baz'}})
  t.end()
})
