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

test('array of objects', function (t) {
  const result = Snake([{ fooBar: 'baz' }])
  t.deepEqual(result, [{ foo_bar: 'baz' }])
  t.ok(Array.isArray(result))
  t.end()
})

test('nested arrays', function (t) {
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
      { fooBar: { barBaz: 'qux' }, fooDate: date },
      { deep: true, shouldRecurse: (key, val) => !(val instanceof Date) }
    ),
    {
      foo_bar: { bar_baz: 'qux' },
      foo_date: date
    }
  )
  t.end()
})

test('not a plain object(primitive value)', function (t) {
  t.throws(
    () => Snake(1),
    { message: 'obj must be an plain object' },
    'Should throw an error when input is not a plain object'
  )
  t.end()
})

test('not a plain object(function value)', function (t) {
  t.throws(
    () => Snake(() => { return 1 }),
    { message: 'obj must be an plain object' },
    'Should throw an error when input is not a plain object'
  )
  t.end()
})

test('not a plain object(instance value)', function (t) {
  t.throws(
    () => Snake(new Date()),
    { message: 'obj must be an plain object' },
    'Should throw an error when input is not a plain object'
  )
  t.end()
})

test('not array of plain objects(primitive value)', function (t) {
  t.throws(
    () => Snake([1, { fooBar: 'baz' }]),
    { message: 'obj must be array of plain objects' },
    'Should throw an error when input is not an array of plain objects'
  )
  t.end()
})

test('not array of plain objects(function value)', function (t) {
  t.throws(
    () => Snake([() => { return 1 }, { fooBar: 'baz' }]),
    { message: 'obj must be array of plain objects' },
    'Should throw an error when input is not an array of plain objects'
  )
  t.end()
})

test('not array of plain objects(instance value)', function (t) {
  t.throws(
    () => Snake([new Date(), { fooBar: 'baz' }]),
    { message: 'obj must be array of plain objects' },
    'Should throw an error when input is not an array of plain objects'
  )
  t.end()
})

test('custom snakeCase function', function (t) {
  const customSnakeCase = (key) => key.replace(/([A-Z])/g, '_$1').toLowerCase()
  t.deepEqual(
    Snake({ fooBar: 'baz', barBaz: 'qux' }, { snakeCase: customSnakeCase }),
    { foo_bar: 'baz', bar_baz: 'qux' }
  )
  t.end()
})

test('custom snakeCase function with nested objects', function (t) {
  const customSnakeCase = (key) => key.toUpperCase()
  t.deepEqual(
    Snake({ fooBar: { barBaz: 'qux' } }, { snakeCase: customSnakeCase }),
    { FOOBAR: { BARBAZ: 'qux' } }
  )
  t.end()
})
