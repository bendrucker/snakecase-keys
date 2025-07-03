# snakecase-keys [![tests](https://github.com/bendrucker/snakecase-keys/workflows/tests/badge.svg?branch=main)](https://github.com/bendrucker/snakecase-keys/actions?query=workflow%3Atests+branch%3Amain)

> Convert an object's keys to snake case


## Install

```
npm install snakecase-keys
```


## Usage

```js
import snakecaseKeys from 'snakecase-keys'

snakecaseKeys({ fooBar: 'baz' })
//=> { foo_bar: 'baz' }

snakecaseKeys({ 'foo-bar': true, nested: { fooBaz: 'bar' } })
//=> { foo_bar: true, nested: { foo_baz: 'bar' } }
```

## API

#### `snakecaseKeys(obj, options)` -> `object`

##### obj

*Required*  
Type: `object | Array<object>`

A plain object or array of plain objects to transform into snake case (keys only).

##### options

*Optional*  
Type: `object`

###### deep

Type: `boolean`  
Default: `true`

Enables snake-casing of keys in nested objects.

###### exclude

Type: `Array<string | RegExp>`  
Default: `[]`

An array of strings or regular expressions matching keys that will be excluded from snake-casing.

###### `shouldRecurse(key, val)` -> `boolean`

*Optional*  
Type: `function`

A function that determines if `val` should be recursed.

Requires `deep: true`.

###### parsingOptions

Type: `object`  
Default: `{}`

Options object passed to the built-in `snakeCase` function from `change-case`. Available options include:

- `split`: Custom function to split strings into words
- `locale`: Locale for case conversion
- `separateNumbers`: Whether to separate numbers (deprecated, use `splitSeparateNumbers`)
- `delimiter`: Custom delimiter between words
- `prefixCharacters`: Characters to preserve at start
- `suffixCharacters`: Characters to preserve at end

See [`change-case`](https://github.com/blakeembrey/change-case) for full documentation.

###### snakeCase

*Optional*
Type: `(key: string) => string`

Custom function to convert a key to snake case. Use this to fully override the default behavior of the library and convert keys according to your own conventions. When provided, the return type will be a generic `Record<string, unknown>`, since specific keys cannot be inferred from the custom function.

## Related

* [camelcase-keys](https://github.com/sindresorhus/camelcase-keys)
* [kebabcase-keys](https://github.com/mattiloh/kebabcase-keys)

## License

MIT © [Ben Drucker](http://bendrucker.me)
