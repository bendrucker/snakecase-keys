import { expectType } from 'tsd';
import snakecaseKeys = require('.');

interface TestInterface {
  foo: boolean
}

const test: TestInterface = { foo: false }
expectType<{ [key: string]: unknown }>(
  snakecaseKeys(test)
)

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
