import { expectAssignable, expectType } from "tsd";
import snakecaseKeys from ".";

// 1. Test object conversion
expectType<{ foo_bar: boolean }>(snakecaseKeys({ fooBar: true }));
expectAssignable<{ [key: string]: boolean }>(snakecaseKeys({ fooBar: true }));

// 2. Test array conversion
expectType<{ foo_bar: boolean }[]>(snakecaseKeys([{ fooBar: true }]));
expectAssignable<Array<{ [key: string]: boolean }>>(
  snakecaseKeys([{ fooBar: true }])
);
expectType<string[]>(snakecaseKeys(["name 1", "name 2"]));

// 3. Test deep conversion
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

// 4. Test exclusive conversion
expectType<{ foo_bar: boolean; barBaz: true }>(
  snakecaseKeys(
    { fooBar: true, barBaz: true },
    {
      exclude: ["foo", "barBaz", /^baz/] as const,
    }
  )
);
