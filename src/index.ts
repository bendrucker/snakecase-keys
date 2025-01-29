import { snakeCase } from 'change-case'

export type Options = {
  deep?: boolean
  exclude?: ReadonlyArray<string | RegExp>
  shouldRecurse?: (key: string, value: unknown) => boolean
}

const PlainObjectConstructor = {}.constructor

function matches(patterns: ReadonlyArray<string | RegExp>, value: string): boolean {
  return patterns.some((pattern) => (typeof pattern === 'string' ? pattern === value : pattern.test(value)))
}

function snakeCaseWithDots(str: string): string {
  return str
    .split('.')
    .map((part) => snakeCase(part))
    .join('.')
}

function mapObject<T extends Record<string, unknown>>(
  obj: T,
  mapper: (key: string, value: unknown) => [string, unknown],
  options: { deep?: boolean; shouldRecurse?: (key: string, value: unknown) => boolean } = {}
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    const [newKey, newValue] = mapper(key, value)
    if (options.deep && typeof value === 'object' && value !== null) {
      const shouldRecurse = options.shouldRecurse ? options.shouldRecurse(key, value) : true
      if (shouldRecurse) {
        if (Array.isArray(value)) {
          result[newKey] = value.map((item) =>
            typeof item === 'object' && item !== null && item.constructor === PlainObjectConstructor
              ? mapObject(item as Record<string, unknown>, mapper, options)
              : item
          )
        } else if (value.constructor === PlainObjectConstructor) {
          result[newKey] = mapObject(value as Record<string, unknown>, mapper, options)
        } else {
          result[newKey] = newValue
        }
      } else {
        result[newKey] = value
      }
    } else {
      result[newKey] = newValue
    }
  }

  return result
}

function mapArray<T extends Array<Record<string, unknown>>>(
  arr: T,
  mapper: (key: string, value: unknown) => [string, unknown],
  options: { deep?: boolean; shouldRecurse?: (key: string, value: unknown) => boolean } = {}
): Array<Record<string, unknown>> {
  return arr.map((obj) => mapObject(obj, mapper, options))
}

function snakecaseKeys<T extends Record<string, unknown> | Array<Record<string, unknown>>>(
  obj: T,
  options: Options = {}
): T {
  const { deep = true, exclude = [], shouldRecurse } = options

  const mapper = (key: string, value: unknown): [string, unknown] => {
    const newKey = exclude.length > 0 && matches(exclude, key) ? key : snakeCaseWithDots(key)
    return [newKey, value]
  }

  if (Array.isArray(obj)) {
    if (
      !obj.every((item) => typeof item === 'object' && item !== null && item.constructor === PlainObjectConstructor)
    ) {
      throw new TypeError('obj must be array of plain objects')
    }
    return mapArray(obj, mapper, { deep, shouldRecurse }) as T
  }

  if (typeof obj !== 'object' || obj === null || obj.constructor !== PlainObjectConstructor) {
    throw new TypeError('obj must be an plain object')
  }

  return mapObject(obj, mapper, { deep, shouldRecurse }) as T
}

export default snakecaseKeys
