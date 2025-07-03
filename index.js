'use strict'

import map from 'map-obj'
import { snakeCase } from 'change-case'

const PlainObjectConstructor = {}.constructor

function snakecaseKeys (obj, options) {
  if (Array.isArray(obj)) {
    if (obj.some(item => item.constructor !== PlainObjectConstructor)) {
      throw new Error('obj must be array of plain objects')
    }

    options = { deep: true, exclude: [], parsingOptions: {}, ...options }
    const convertCase = options.snakeCase || ((key) => snakeCase(key, options.parsingOptions))

    // Handle arrays by mapping each element
    return obj.map(item => {
      return map(item, (key, val) => {
        return [
          matches(options.exclude, key) ? key : convertCase(key),
          val,
          mapperOptions(key, val, options)
        ]
      }, options)
    })
  } else {
    if (obj.constructor !== PlainObjectConstructor) {
      throw new Error('obj must be an plain object')
    }
  }

  options = { deep: true, exclude: [], parsingOptions: {}, ...options }

  const convertCase = options.snakeCase || ((key) => snakeCase(key, options.parsingOptions))

  return map(obj, (key, val) => {
    return [
      matches(options.exclude, key) ? key : convertCase(key),
      val,
      mapperOptions(key, val, options)
    ]
  }, options)
}

function matches (patterns, value) {
  return patterns.some(pattern => {
    return typeof pattern === 'string'
      ? pattern === value
      : pattern.test(value)
  })
}

function mapperOptions (key, val, options) {
  return options.shouldRecurse
    ? { shouldRecurse: options.shouldRecurse(key, val) }
    : undefined
}

export default snakecaseKeys
