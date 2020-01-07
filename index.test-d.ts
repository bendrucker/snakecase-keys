import { expectType } from 'tsd';
import camelcaseKeys = require('.');

interface TestInterface {
  foo: boolean
}

const test: TestInterface = { foo: false }
expectType<{ [key: string]: unknown }>(
  camelcaseKeys(test)
)

expectType<Array<{ [key: string]: unknown }>>(
  camelcaseKeys([{ 'foo-bar': true }]),
);

expectType<{ [key: string]: unknown }>(camelcaseKeys({ 'foo-bar': true }));

expectType<{ [key: string]: unknown }>(
  camelcaseKeys({ 'foo-bar': true }, { deep: true }),
);

expectType<{ [key: string]: unknown }>(
  camelcaseKeys({ 'foo-bar': true }, { exclude: ['foo', /bar/] }),
);
