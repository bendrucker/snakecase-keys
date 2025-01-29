import { describe, test, expect } from 'vitest'
import snakecaseKeys from '../index.js'

type ValidInput = Record<string, unknown> | Array<Record<string, unknown>>

describe('snakecaseKeys', () => {
  test('converts basic object keys to snake case', () => {
    const input = { fooBar: 'baz', nested: { fooBar: 'baz' } }

    const result = snakecaseKeys(input)

    expect(result).toEqual({
      foo_bar: 'baz',
      nested: { foo_bar: 'baz' },
    })
  })

  test('handles repeated capital letters in keys', () => {
    const input = { fooID: 1 }

    const result = snakecaseKeys(input)

    expect(result).toEqual({ foo_id: 1 })
  })

  test('supports shallow conversion with deep option disabled', () => {
    const input = { fooBar: { barBaz: 'qux' } }

    const result = snakecaseKeys(input, { deep: false })

    expect(result).toEqual({
      foo_bar: { barBaz: 'qux' },
    })
  })

  test('converts keys in array of objects', () => {
    const input = [{ fooBar: 'baz' }]

    const result = snakecaseKeys(input)

    expect(result).toEqual([{ foo_bar: 'baz' }])
    expect(Array.isArray(result)).toBe(true)
  })

  test('preserves arrays in object values', () => {
    const input = { foo: [0, 1, 2] }

    const result = snakecaseKeys(input)

    expect(result).toEqual({ foo: [0, 1, 2] })
    expect(Array.isArray(result.foo)).toBe(true)
  })

  test('converts keys in nested arrays', () => {
    const input = { foo: [0, { fooBar: 'baz', nested: { fooBar: 'baz' } }, 2] }

    const result = snakecaseKeys(input)

    expect(result).toEqual({ foo: [0, { foo_bar: 'baz', nested: { foo_bar: 'baz' } }, 2] })
    expect(Array.isArray(result.foo)).toBe(true)
  })

  describe('exclude option', () => {
    test('excludes specific keys from conversion', () => {
      const input = { fooBar: 'baz', barBaz: 'qux' }

      const result = snakecaseKeys(input, { exclude: ['fooBar'] })

      expect(result).toEqual({
        fooBar: 'baz',
        bar_baz: 'qux',
      })
    })

    test('excludes keys matching regex patterns', () => {
      const input = { fooBar: 'baz', barBaz: 'qux' }

      const result = snakecaseKeys(input, { exclude: [/^foo/, /^bar/] })

      expect(result).toEqual({
        fooBar: 'baz',
        barBaz: 'qux',
      })
    })
  })

  describe('shouldRecurse option', () => {
    test('controls recursion based on key', () => {
      const input = { fooBar: { barBaz: 'qux' }, nested: { barBaz: 'qux' } }

      const result = snakecaseKeys(input, {
        shouldRecurse(key: string, val: unknown) {
          return key !== 'nested'
        },
      })

      expect(result).toEqual({ foo_bar: { bar_baz: 'qux' }, nested: { barBaz: 'qux' } })
    })

    test('controls recursion based on value type', () => {
      const date = new Date()
      const input = { fooBar: { barBaz: 'qux' }, fooDate: date }

      const result = snakecaseKeys(input, {
        shouldRecurse(key: string, val: unknown) {
          return !(val instanceof Date)
        },
      })

      expect(result).toEqual({
        foo_bar: { bar_baz: 'qux' },
        foo_date: date,
      })
    })
  })

  describe('input validation', () => {
    test('rejects primitive values', () => {
      const input = 1
      const invalidCall = () => snakecaseKeys(input as unknown as ValidInput)

      expect(invalidCall).toThrow('obj must be an plain object')
    })

    test('rejects function values', () => {
      const input = () => 1
      const invalidCall = () => snakecaseKeys(input as unknown as ValidInput)

      expect(invalidCall).toThrow('obj must be an plain object')
    })

    test('rejects instance values', () => {
      const input = new Date()
      const invalidCall = () => snakecaseKeys(input as unknown as ValidInput)

      expect(invalidCall).toThrow('obj must be an plain object')
    })

    test('rejects arrays containing primitive values', () => {
      const input = [1, { fooBar: 'baz' }]
      const invalidCall = () => snakecaseKeys(input as unknown as ValidInput)

      expect(invalidCall).toThrow('obj must be array of plain objects')
    })

    test('rejects arrays containing functions', () => {
      const input = [() => 1, { fooBar: 'baz' }]
      const invalidCall = () => snakecaseKeys(input as unknown as ValidInput)

      expect(invalidCall).toThrow('obj must be array of plain objects')
    })

    test('rejects arrays containing instances', () => {
      const input = [new Date(), { fooBar: 'baz' }]
      const invalidCall = () => snakecaseKeys(input as unknown as ValidInput)

      expect(invalidCall).toThrow('obj must be array of plain objects')
    })
  })

  test('preserves dots in keys while converting surrounding parts', () => {
    const input = { 'fooBar.baz': 'qux', 'bar.bazQux': 'foo' }

    const result = snakecaseKeys(input)

    expect(result).toEqual({ 'foo_bar.baz': 'qux', 'bar.baz_qux': 'foo' })
  })

  describe('edge cases', () => {
    test('handles empty objects', () => {
      const input = {}

      const result = snakecaseKeys(input)

      expect(result).toEqual({})
    })

    test('handles empty arrays', () => {
      const input: Array<Record<string, unknown>> = []

      const result = snakecaseKeys(input)

      expect(result).toEqual([])
      expect(Array.isArray(result)).toBe(true)
    })

    test('preserves null and undefined values', () => {
      const input = {
        fooBar: null,
        barBaz: undefined,
        deepNested: { nullValue: null, undefinedValue: undefined },
      }

      const result = snakecaseKeys(input)

      expect(result).toEqual({
        foo_bar: null,
        bar_baz: undefined,
        deep_nested: { null_value: null, undefined_value: undefined },
      })
    })

    test('handles keys with multiple dots', () => {
      const input = {
        'fooBar.baz.qux': 'value',
        'nested.fooBar.bazQux': 'another',
      }

      const result = snakecaseKeys(input)

      expect(result).toEqual({
        'foo_bar.baz.qux': 'value',
        'nested.foo_bar.baz_qux': 'another',
      })
    })

    test('handles keys with special characters', () => {
      const input = {
        'foo-Bar': 'value1',
        bar_Baz: 'value2',
        'baz@Qux': 'value3',
      }

      const result = snakecaseKeys(input)

      expect(result).toEqual({
        foo_bar: 'value1',
        bar_baz: 'value2',
        baz_qux: 'value3',
      })
    })
  })

  describe('complex objects', () => {
    test('handles deeply nested mixed arrays and objects', () => {
      const input = {
        topLevel: [{ nestedArray: [{ deepObject: { evenDeeperKey: 'value' } }] }, { anotherKey: 'value' }],
        mixedTypes: {
          arrayWithMixed: [1, { someKey: 'value' }, 3],
          nestedMixed: { deepArray: [{ deepKey: 'value' }] },
        },
      }

      const result = snakecaseKeys(input)

      expect(result).toEqual({
        top_level: [{ nested_array: [{ deep_object: { even_deeper_key: 'value' } }] }, { another_key: 'value' }],
        mixed_types: {
          array_with_mixed: [1, { some_key: 'value' }, 3],
          nested_mixed: { deep_array: [{ deep_key: 'value' }] },
        },
      })
    })

    test('handles objects with array-like properties', () => {
      const input = {
        arrayLikeObject: { length: 1, 0: { fooBar: 'value' } },
        normalArray: [{ barBaz: 'value' }],
      }

      const result = snakecaseKeys(input)

      expect(result).toEqual({
        array_like_object: { length: 1, 0: { foo_bar: 'value' } },
        normal_array: [{ bar_baz: 'value' }],
      })
    })
  })
})
