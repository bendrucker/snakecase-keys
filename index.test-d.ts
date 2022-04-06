import { expectAssignable, expectType } from "tsd";
import type { SnakeCaseKeys } from ".";
import snakecaseKeys from ".";

// Object
expectType<{ foo_bar: boolean }>(snakecaseKeys({ fooBar: true }));
expectAssignable<{ [key: string]: boolean }>(snakecaseKeys({ fooBar: true }));

expectType<{ foo_bar: boolean }>(snakecaseKeys({ FooBar: true }));

// Array
expectType<{ foo_bar: boolean }[]>(snakecaseKeys([{ fooBar: true }]));
expectAssignable<Array<{ [key: string]: boolean }>>(
  snakecaseKeys([{ fooBar: true }])
);
expectType<string[]>(snakecaseKeys(["name 1", "name 2"]));

// Deep
expectType<{ foo_bar: { "foo-bar": { "foo bar": true } } }>(
  snakecaseKeys(
    { foo_bar: { "foo-bar": { "foo bar": true } } },
    { deep: false }
  )
);
expectType<{ foo_bar: { foo_bar: { foo_bar: boolean } } }>(
  snakecaseKeys({ foo_bar: { "foo-bar": { "foo bar": true } } }, { deep: true })
);
expectType<{ foo_bar: { foo_bar: boolean } }[]>(
  snakecaseKeys([{ "foo-bar": { foo_bar: true } }], { deep: true })
);

// Exclude
expectType<{ foo_bar: boolean; barBaz: true }>(
  snakecaseKeys(
    { fooBar: true, barBaz: true },
    {
      exclude: ["foo", "barBaz", /^baz/] as const,
    }
  )
);

// Verify exported type `SnakeCaseKeys`
// Object
const objectInput = { fooBar: true };
expectType<SnakeCaseKeys<typeof objectInput>>(snakecaseKeys(objectInput));
expectAssignable<SnakeCaseKeys<{ [key: string]: boolean }>>(
  snakecaseKeys(objectInput)
);

// Array
const arrayInput = [{ fooBar: true }];
expectType<SnakeCaseKeys<typeof arrayInput>>(snakecaseKeys([{ fooBar: true }]));
expectAssignable<SnakeCaseKeys<typeof arrayInput>>(snakecaseKeys(arrayInput));
expectType<SnakeCaseKeys<string[]>>(snakecaseKeys(["name 1", "name 2"]));

// Deep
const deepInput = { foo_bar: { "foo-bar": { "foo bar": true } } };
expectType<SnakeCaseKeys<typeof deepInput, false, []>>(
  snakecaseKeys(deepInput, { deep: false })
);
expectType<SnakeCaseKeys<typeof deepInput>>(
  snakecaseKeys({ foo_bar: { "foo-bar": { "foo bar": true } } }, { deep: true })
);
const deepArrayInput = [{ "foo-bar": { foo_bar: true } }];
expectType<SnakeCaseKeys<typeof deepArrayInput>>(
  snakecaseKeys([{ "foo-bar": { foo_bar: true } }], { deep: true })
);

// Exclude
const excludeInput = { fooBar: true, barBaz: true };
const exclude = ["foo", "barBaz", /^baz/] as const;
expectType<SnakeCaseKeys<typeof excludeInput, true, typeof exclude>>(
  snakecaseKeys(excludeInput, {
    exclude: ["foo", "barBaz", /^baz/] as const,
  })
);
