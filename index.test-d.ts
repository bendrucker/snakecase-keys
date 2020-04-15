import {expectType} from 'tsd';
import snakecaseKeys = require('.');

const fooBarObject = {'fooBar': true};
const camelFooBarObject = snakecaseKeys(fooBarObject);
expectType<typeof fooBarObject>(camelFooBarObject);

const fooBarArray = [{'fooBar': true}];
const camelFooBarArray = snakecaseKeys(fooBarArray);
expectType<typeof fooBarArray>(camelFooBarArray);

expectType<Array<{[key in 'fooBar']: true}>>(snakecaseKeys([{'fooBar': true}]));

expectType<string[]>(snakecaseKeys(['name 1', 'name 2']));

expectType<string[]>(snakecaseKeys(['name 1', 'name 2'], {deep: true}));

expectType<{[key in 'fooBar']: true}>(snakecaseKeys({'fooBar': true}));

expectType<{[key in 'fooBar']: true}>(
	snakecaseKeys({'fooBar': true}, {deep: true}),
);

expectType<{[key in 'fooBar']: true}>(
	snakecaseKeys({'fooBar': true}, {exclude: ['foo', /bar/]}),
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
