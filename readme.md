# snakecase-keys

> Convert object keys to snake case

## Install

```sh
npm install snakecase-keys
```

## Usage

### ESM (recommended)
```js
import snakecaseKeys from 'snakecase-keys'

snakecaseKeys({ fooBar: true })
//=> { foo_bar: true }

snakecaseKeys({ fooBar: true, nested: { fooBar: true } })
//=> { foo_bar: true, nested: { foo_bar: true } }

snakecaseKeys({ foo: [{ barBaz: true }] })
//=> { foo: [{ bar_baz: true }] }

// Exclude keys from being converted
snakecaseKeys({ fooBar: true, barBaz: false }, { exclude: ['fooBar'] })
//=> { fooBar: true, bar_baz: false }

// Exclude keys matching patterns from being converted
snakecaseKeys({ fooBar: true, barBaz: false }, { exclude: [/^foo/] })
//=> { fooBar: true, bar_baz: false }

// Disable recursion for nested objects
snakecaseKeys({ fooBar: { barBaz: true } }, { deep: false })
//=> { foo_bar: { barBaz: true } }

// Control recursion based on key/value
snakecaseKeys({ fooBar: { barBaz: true }, date: new Date() }, {
  shouldRecurse: (key, value) => !(value instanceof Date)
})
//=> { foo_bar: { bar_baz: true }, date: Date }
```

### CommonJS
```js
const snakecaseKeys = require('snakecase-keys')

snakecaseKeys({ fooBar: true })
//=> { foo_bar: true }
```

## API

### snakecaseKeys(input, options?)

#### input

Type: `object` | `Array<object>`

Object or array of objects to convert.

#### options

Type: `object`

##### deep

Type: `boolean`\
Default: `true`

Recursively convert keys of nested objects.

##### exclude

Type: `Array<string | RegExp>`\
Default: `[]`

Keys to exclude from conversion. Strings are matched exactly, regular expressions are tested against the key.

##### shouldRecurse

Type: `(key: string, value: unknown) => boolean`\
Default: `undefined`

Function to control recursion based on the current key and value. Return `true` to recurse into the value, `false` to skip recursion.

## TypeScript

This module includes TypeScript declarations.

## Related

* [camelcase-keys](https://github.com/sindresorhus/camelcase-keys)
* [kebabcase-keys](https://github.com/mattiloh/kebabcase-keys)

## License

MIT © [Ben Drucker](http://bendrucker.me)
