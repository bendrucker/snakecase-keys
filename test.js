'use strict'

const test = require('tape')
const Snake = require('./')

test(function (t) {
  t.deepEqual(Snake({ fooBar: 'baz', nested: { fooBar: 'baz' } }), { foo_bar: 'baz', nested: { foo_bar: 'baz' } })
  t.end()
})

test('repeated capital letters', function (t) {
  t.deepEqual(Snake({ fooID: 1 }), { foo_id: 1 })
  t.end()
})

test('shallow conversion with {deep: false}', function (t) {
  t.deepEqual(
    Snake({ fooBar: { barBaz: 'qux' } }, { deep: false }),
    { foo_bar: { barBaz: 'qux' } }
  )
  t.end()
})

test('arrays', function (t) {
  const result = Snake({ foo: [0, 1, 2] })
  t.deepEqual(result, { foo: [0, 1, 2] })
  t.ok(Array.isArray(result.foo))
  t.end()
})

test('snakecase objects in arrays', function (t) {
  const result = Snake({ foo: [0, { fooBar: 'baz', nested: { fooBar: 'baz' } }, 2] })
  t.deepEqual(result, { foo: [0, { foo_bar: 'baz', nested: { foo_bar: 'baz' } }, 2] })
  t.ok(Array.isArray(result.foo))
  t.end()
})

test('exclude', function (t) {
  t.deepEqual(
    Snake({ fooBar: 'baz', barBaz: 'qux' }, { exclude: ['fooBar'] }),
    { fooBar: 'baz', bar_baz: 'qux' }
  )
  t.deepEqual(
    Snake({ fooBar: 'baz', barBaz: 'qux' }, { exclude: [/^foo/, /^bar/] }),
    { fooBar: 'baz', barBaz: 'qux' }
  )
  t.end()
})
