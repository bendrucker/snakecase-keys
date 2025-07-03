# snakecase-keys [![tests](https://github.com/bendrucker/snakecase-keys/workflows/tests/badge.svg)](https://github.com/bendrucker/snakecase-keys/actions?query=workflow%3Atests)

> Convert an object's keys to snake case


## Install

```
$ npm install --save snakecase-keys
```


## Usage

```js
var snakecaseKeys = require('snakecase-keys')

snakecaseKeys({fooBar: 'baz'})
//=> {foo_bar: 'baz'}

snakecaseKeys({'foo-bar': true, nested: {fooBaz: 'bar'}});
//=> {foo_bar: true, nested: {foo_baz: 'bar'}}
```

## API

#### `snakecaseKeys(obj, options)` -> `object`

##### obj

*Required*  
Type: `object | array[object]`

A plain object or array of plain objects to transform into snake case (keys only).

##### options

*Optional*  
Type: `object`

###### deep

Type: `boolean`  
Default: `true`

Enables snake-casing of keys in nested objects.

###### exclude

Type: `array[string || regexp]`  
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

Options object passed to the built-in `snake-case` parsing function. See [`snake-case`](https://github.com/blakeembrey/change-case/tree/master/packages/snake-case) for available options.

###### snakeCase

*Optional*
Type: `function(string)` -> `string`

Custom function to convert a key to snake case. Use this to fully override the default behavior of the library and convert keys according to your own conventions. When provided, the return type will be a generic `Record<string, unknown>`, since specific keys cannot be inferred from the custom function.

## Related

* [camelcase-keys](https://github.com/sindresorhus/camelcase-keys)
* [kebabcase-keys](https://github.com/mattiloh/kebabcase-keys)

## License

MIT © [Ben Drucker](http://bendrucker.me)
