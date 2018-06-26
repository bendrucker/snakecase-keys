'use strict'

var test = require('tape')
var Snake = require('./')

test(function (t) {
  t.deepEqual(Snake({fooBar: 'baz', nested: {fooBar: 'baz'}}), {foo_bar: 'baz', nested: {foo_bar: 'baz'}})
  t.end()
})

test('It will not deeply convert when option is set', function (t) {
  var sourceObject = {
    topLevel: 'should get converted',
    iHaveChildren: {
      thatShouldNot: 'get converted'
    }
  }
  var expectedObject = {
    top_level: 'should get converted',
    i_have_children: {
      thatShouldNot: 'get converted'
    }
  }

  var resultObject = Snake(sourceObject, { deep: false })

  t.deepEqual(resultObject, expectedObject)
  t.end()
})
