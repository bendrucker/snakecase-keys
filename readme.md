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

#### `snakeCaseKeys(obj)` -> `object`

##### obj

*Required*  
Type: `object`

An object to transform into snake case (keys only).

## Related

* [camelcase-keys](https://github.com/sindresorhus/camelcase-keys)

## License

MIT © [Ben Drucker](http://bendrucker.me)
