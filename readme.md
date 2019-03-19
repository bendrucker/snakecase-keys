# snakecase-keys [![Build Status](https://travis-ci.org/bendrucker/snakecase-keys.svg?branch=master)](https://travis-ci.org/bendrucker/snakecase-keys) [![Greenkeeper badge](https://badges.greenkeeper.io/bendrucker/snakecase-keys.svg)](https://greenkeeper.io/)

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

###### exclude

Type: `array[string || regexp]`  
Default: `[]`

An array of strings or regular expressions matching keys that will be excluded from snake-casing.

## Related

* [camelcase-keys](https://github.com/sindresorhus/camelcase-keys)
* [kebabcase-keys](https://github.com/mattiloh/kebabcase-keys)

## License

MIT © [Ben Drucker](http://bendrucker.me)
