'use strict'

import { test } from 'node:test'
import assert from 'node:assert'
import Snake from './index.js'

test('basic functionality', () => {
  assert.deepEqual(Snake({ fooBar: 'baz', nested: { fooBar: 'baz' } }), { foo_bar: 'baz', nested: { foo_bar: 'baz' } })
})

test('repeated capital letters', () => {
  assert.deepEqual(Snake({ fooID: 1 }), { foo_id: 1 })
})

test('shallow conversion with {deep: false}', () => {
  assert.deepEqual(
    Snake({ fooBar: { barBaz: 'qux' } }, { deep: false }),
    { foo_bar: { barBaz: 'qux' } }
  )
})

test('array of objects', () => {
  const result = Snake([{ fooBar: 'baz' }])
  assert.deepEqual(result, [{ foo_bar: 'baz' }])
  assert.ok(Array.isArray(result))
})

test('nested arrays', () => {
  const result = Snake({ foo: [0, 1, 2] })
  assert.deepEqual(result, { foo: [0, 1, 2] })
  assert.ok(Array.isArray(result.foo))
})

test('snakecase objects in arrays', () => {
  const result = Snake({ foo: [0, { fooBar: 'baz', nested: { fooBar: 'baz' } }, 2] })
  assert.deepEqual(result, { foo: [0, { foo_bar: 'baz', nested: { foo_bar: 'baz' } }, 2] })
  assert.ok(Array.isArray(result.foo))
})

test('exclude', () => {
  assert.deepEqual(
    Snake({ fooBar: 'baz', barBaz: 'qux' }, { exclude: ['fooBar'] }),
    { fooBar: 'baz', bar_baz: 'qux' }
  )
  assert.deepEqual(
    Snake({ fooBar: 'baz', barBaz: 'qux' }, { exclude: [/^foo/, /^bar/] }),
    { fooBar: 'baz', barBaz: 'qux' }
  )
})

test('parsing options', () => {
  const splitOnCamelCase = input => input.split(/(?=[A-Z])/)
  assert.deepEqual(
    Snake({ 'fooBar.baz': 'qux', 'bar.bazQux': 'foo' }, { parsingOptions: { split: splitOnCamelCase } }),
    { 'foo_bar.baz': 'qux', 'bar.baz_qux': 'foo' }
  )
})

test('shouldRecurse option', () => {
  assert.deepEqual(
    Snake(
      { fooBar: { barBaz: 'qux' }, nested: { barBaz: 'qux' } },
      { deep: true, shouldRecurse: (key, val) => key !== 'nested' }
    ),
    { foo_bar: { bar_baz: 'qux' }, nested: { barBaz: 'qux' } }
  )
  const date = new Date()
  assert.deepEqual(
    Snake(
      { fooBar: { barBaz: 'qux' }, fooDate: date },
      { deep: true, shouldRecurse: (key, val) => !(val instanceof Date) }
    ),
    {
      foo_bar: { bar_baz: 'qux' },
      foo_date: date
    }
  )
})

test('not a plain object(primitive value)', () => {
  assert.throws(
    () => Snake(1),
    { message: 'obj must be an plain object' }
  )
})

test('not a plain object(function value)', () => {
  assert.throws(
    () => Snake(() => 1),
    { message: 'obj must be an plain object' }
  )
})

test('not a plain object(instance value)', () => {
  assert.throws(
    () => Snake(new Date()),
    { message: 'obj must be an plain object' }
  )
})

test('not array of plain objects(primitive value)', () => {
  assert.throws(
    () => Snake([1, { fooBar: 'baz' }]),
    { message: 'obj must be array of plain objects' }
  )
})

test('not array of plain objects(function value)', () => {
  assert.throws(
    () => Snake([() => 1, { fooBar: 'baz' }]),
    { message: 'obj must be array of plain objects' }
  )
})

test('not array of plain objects(instance value)', () => {
  assert.throws(
    () => Snake([new Date(), { fooBar: 'baz' }]),
    { message: 'obj must be array of plain objects' }
  )
})

test('custom snakeCase function', () => {
  const customSnakeCase = (key) => key.replace(/([A-Z])/g, '_$1').toLowerCase()
  assert.deepEqual(
    Snake({ fooBar: 'baz', barBaz: 'qux' }, { snakeCase: customSnakeCase }),
    { foo_bar: 'baz', bar_baz: 'qux' }
  )
})

test('custom snakeCase function with nested objects', () => {
  const customSnakeCase = (key) => key.toUpperCase()
  assert.deepEqual(
    Snake({ fooBar: { barBaz: 'qux' } }, { snakeCase: customSnakeCase }),
    { FOOBAR: { BARBAZ: 'qux' } }
  )
})

test('undefined values in arrays with deep: true', () => {
  assert.deepEqual(
    Snake({ fooBar: [undefined, 'value'] }, { deep: true }),
    { foo_bar: [undefined, 'value'] }
  )

  assert.deepEqual(
    Snake({ nested: { fooBar: [undefined, { bazQux: 'value' }] } }, { deep: true }),
    { nested: { foo_bar: [undefined, { baz_qux: 'value' }] } }
  )
})
