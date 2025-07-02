import { test, expect } from 'vitest'
import Snake from '.'

test('basic snakecase', () => {
  expect(Snake({ fooBar: 'baz', nested: { fooBar: 'baz' } })).toEqual({ foo_bar: 'baz', nested: { foo_bar: 'baz' } })
})

test('repeated capital letters', () => {
  expect(Snake({ fooID: 1 })).toEqual({ foo_id: 1 })
})

test('shallow conversion with {deep: false}', () => {
  expect(
    Snake({ fooBar: { barBaz: 'qux' } }, { deep: false })
  ).toEqual({ foo_bar: { barBaz: 'qux' } })
})

test('array of objects', () => {
  const result = Snake([{ fooBar: 'baz' }])
  expect(result).toEqual([{ foo_bar: 'baz' }])
  expect(Array.isArray(result)).toBe(true)
})

test('nested arrays', () => {
  const result = Snake({ foo: [0, 1, 2] })
  expect(result).toEqual({ foo: [0, 1, 2] })
  expect(Array.isArray(result.foo)).toBe(true)
})

test('snakecase objects in arrays', () => {
  const result = Snake({ foo: [0, { fooBar: 'baz', nested: { fooBar: 'baz' } }, 2] })
  expect(result).toEqual({ foo: [0, { foo_bar: 'baz', nested: { foo_bar: 'baz' } }, 2] })
  expect(Array.isArray(result.foo)).toBe(true)
})

test('exclude', () => {
  expect(
    Snake({ fooBar: 'baz', barBaz: 'qux' }, { exclude: ['fooBar'] })
  ).toEqual({ fooBar: 'baz', bar_baz: 'qux' })
  expect(
    Snake({ fooBar: 'baz', barBaz: 'qux' }, { exclude: [/^foo/, /^bar/] })
  ).toEqual({ fooBar: 'baz', barBaz: 'qux' })
})

test('parsing options', () => {
  const camelCaseRegex = /([a-z])([A-Z])/g
  expect(
    Snake({ 'fooBar.baz': 'qux', 'bar.bazQux': 'foo' }, { parsingOptions: { stripRegexp: camelCaseRegex } })
  ).toEqual({ 'foo_bar.baz': 'qux', 'bar.baz_qux': 'foo' })
})

test('shouldRecurse option', () => {
  expect(
    Snake(
      { fooBar: { barBaz: 'qux' }, nested: { barBaz: 'qux' } },
      { deep: true, shouldRecurse: (key, val) => key !== 'nested' }
    )
  ).toEqual({ foo_bar: { bar_baz: 'qux' }, nested: { barBaz: 'qux' } })

  const date = new Date()
  expect(
    Snake(
      { fooBar: { barBaz: 'qux' }, fooDate: date },
      { deep: true, shouldRecurse: (key, val) => !(val instanceof Date) }
    )
  ).toEqual({
    foo_bar: { bar_baz: 'qux' },
    foo_date: date
  })
})

test('not a plain object(primitive value)', () => {
  expect(() => Snake(1)).toThrowError('obj must be an plain object')
})

test('not a plain object(function value)', () => {
  expect(() => Snake(() => { return 1 })).toThrowError('obj must be an plain object')
})

test('not a plain object(instance value)', () => {
  expect(() => Snake(new Date())).toThrowError('obj must be an plain object')
})

test('not array of plain objects(primitive value)', () => {
  expect(() => Snake([1, { fooBar: 'baz' }])).toThrowError('obj must be array of plain objects')
})

test('not array of plain objects(function value)', () => {
  expect(() => Snake([() => { return 1 }, { fooBar: 'baz' }])).toThrowError('obj must be array of plain objects')
})

test('not array of plain objects(instance value)', () => {
  expect(() => Snake([new Date(), { fooBar: 'baz' }])).toThrowError('obj must be array of plain objects')
})
