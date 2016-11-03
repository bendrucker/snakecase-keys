# snakecase-keys [![Build Status](https://travis-ci.org/bendrucker/snakecase-keys.svg?branch=master)](https://travis-ci.org/bendrucker/snakecase-keys)

> Convert an object's keys to snake case


## Install

```
$ npm install --save snakecase-keys
```


## Usage

```js
var Snake = require('snakecase-keys')

Snake({fooBar: 'baz'})
//=> {foo_bar: 'baz'}

Snake({'foo-bar': true, nested: {fooBaz: 'bar'}});
//=> {foo_bar: true, nested: {foo_baz: 'bar'}}
```

## API

#### `Snake(obj)` -> `object`

##### obj

*Required*  
Type: `object`

An object to transform into snake case (keys only).


## License

MIT © [Ben Drucker](http://bendrucker.me)
