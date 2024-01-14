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

test('parsing options', function (t) {
  const camelCaseRegex = /([a-z])([A-Z])/g
  t.deepEqual(
    Snake({ 'fooBar.baz': 'qux', 'bar.bazQux': 'foo' }, { parsingOptions: { stripRegexp: camelCaseRegex } }),
    { 'foo_bar.baz': 'qux', 'bar.baz_qux': 'foo' }
  )
  t.end()
})

test('shouldRecurse option', function (t) {
  t.deepEqual(
    Snake(
      { fooBar: { barBaz: 'qux' }, nested: { barBaz: 'qux' } },
      { deep: true, shouldRecurse: (key, val) => key !== 'nested' }
    ),
    { foo_bar: { bar_baz: 'qux' }, nested: { barBaz: 'qux' } }
  )
  const date = new Date()
  t.deepEqual(
    Snake(
      { fooBar: { barBaz: 'qux' }, fooIcon: date },
      { deep: true, shouldRecurse: (key, val) => !(val instanceof Date) }
    ),
    {
      foo_bar: { bar_baz: 'qux' },
      foo_icon: date
    }
  )
  t.end()
})
