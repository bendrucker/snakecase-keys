# snakecase-keys [![Build Status](https://travis-ci.org/bendrucker/snakecase-keys.svg?branch=master)](https://travis-ci.org/bendrucker/snakecase-keys)

> Convert an object's keys to snake case


## Install

```
$ npm install --save snakecase-keys
```


## Usage

```js
var snakeCaseKeys = require('snakecase-keys')

snakeCaseKeys({fooBar: 'baz'})
//=> {foo_bar: 'baz'}

snakeCaseKeys({'foo-bar': true, nested: {fooBaz: 'bar'}});
//=> {foo_bar: true, nested: {foo_baz: 'bar'}}
```

## API

#### `snakeCaseKeys(obj, options)` -> `object`

##### obj

*Required*  
Type: `object`

An object to transform into snake case (keys only).

##### options

*Optional*  
Type: `object`

###### deep

Type: `boolean`  
Default: `true`

Enables snake-casing of keys in nested objects.

## Related

* [camelcase-keys](https://github.com/sindresorhus/camelcase-keys)

## License

MIT © [Ben Drucker](http://bendrucker.me)
