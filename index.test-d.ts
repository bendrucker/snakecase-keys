import {expectType} from 'tsd';
import snakecaseKeys = require('.');

const fooBarObject = {'foo-bar': true};
const camelFooBarObject = snakecaseKeys(fooBarObject);
expectType<typeof fooBarObject>(camelFooBarObject);

expectType<Array<{ [key: string]: unknown }>>(
  snakecaseKeys([{ 'foo-bar': true }]),
);

expectType<{ [key: string]: unknown }>(snakecaseKeys({ 'foo-bar': true }));

expectType<{ [key: string]: unknown }>(
  snakecaseKeys({ 'foo-bar': true }, { deep: true }),
);

expectType<{ [key: string]: unknown }>(
  snakecaseKeys({ 'foo-bar': true }, { exclude: ['foo', /bar/] }),
);

const fooBarArray = [{'foo-bar': true}];
const camelFooBarArray = snakecaseKeys(fooBarArray);
expectType<typeof fooBarArray>(camelFooBarArray);

expectType<Array<{[key in 'foo-bar']: true}>>(snakecaseKeys([{'foo-bar': true}]));

expectType<string[]>(snakecaseKeys(['name 1', 'name 2']));

expectType<string[]>(snakecaseKeys(['name 1', 'name 2'], {deep: true}));

expectType<{[key in 'foo-bar']: true}>(snakecaseKeys({'foo-bar': true}));

expectType<{[key in 'foo-bar']: true}>(
	snakecaseKeys({'foo-bar': true}, {deep: true}),
);

expectType<{[key in 'foo-bar']: true}>(
  snakecaseKeys({'foo-bar': true}, {exclude: ['foo', /bar/]}),
);

interface SomeObject {
	someProperty: string;
}

const someObj: SomeObject = {
	someProperty: 'this should work'
};

expectType<SomeObject>(snakecaseKeys(someObj));
expectType<SomeObject[]>(snakecaseKeys([someObj]));

type SomeTypeAlias = {
	someProperty: string;
}

const objectWithTypeAlias = {
	someProperty: 'this should also work'
};

expectType<SomeTypeAlias>(snakecaseKeys(objectWithTypeAlias));
expectType<SomeTypeAlias[]>(snakecaseKeys([objectWithTypeAlias]));
