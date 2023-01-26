import { expectAssignable, expectType, expectNotType } from "tsd";
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
expectType<{ date: Date }[]>(
  snakecaseKeys([{ date: new Date() }], { deep: true })
);
expectType<{ regexp: RegExp }[]>(
  snakecaseKeys([{ regexp: /example/ }], { deep: true })
);
expectType<{ error: Error }[]>(
  snakecaseKeys([{ error: new Error() }], { deep: true })
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
    exclude,
  })
);

// Verify exported type `SnakeCaseKeys`
// Mapping types and retaining properties of keys
// https://github.com/microsoft/TypeScript/issues/13224

type ObjectDataType = {
  fooBar?: string;
  barBaz?: string;
  baz: string;
};
type InvalidConvertedObjectDataType = {
  foo_bar: string;
  bar_baz: string;
  baz: string;
};
type ConvertedObjectDataType = {
  foo_bar?: string;
  bar_baz?: string;
  baz: string;
};

const objectInputData: ObjectDataType = {
  fooBar: "fooBar",
  baz: "baz",
};
expectType<ConvertedObjectDataType>(snakecaseKeys(objectInputData));
expectNotType<InvalidConvertedObjectDataType>(snakecaseKeys(objectInputData));

// Array
type ArrayDataType = ObjectDataType[];

const arrayInputData: ArrayDataType = [
  {
    fooBar: "fooBar",
    baz: "baz",
  },
];
expectType<ConvertedObjectDataType[]>(snakecaseKeys(arrayInputData));
<ConvertedObjectDataType[]>snakecaseKeys(arrayInputData);
expectNotType<InvalidConvertedObjectDataType[]>(snakecaseKeys(arrayInputData));

// Deep
type DeepObjectType = {
  fooBar?: string;
  barBaz?: string;
  baz: string;
  firstLevel: {
    fooBar?: string;
    barBaz?: string;
    secondLevel: {
      fooBar: string;
      barBaz?: string;
    };
  };
  optionalFirstLevel?: {
    fooBar?: string;
    barBaz?: null;
    optionalSecondLevel?: {
      fooBar: number;
    };
  };
};
type InvalidConvertedDeepObjectDataType = {
  foo_bar?: string;
  bar_baz?: string;
  baz: string;
  first_level?: {
    fooBar?: string;
    barBaz?: string;
    secondLevel?: {
      fooBar: string;
      barBaz?: string;
    };
  };
  optional_first_level?: {
    fooBar?: string;
    barBaz?: null;
    optionalSecondLevel?: {
      fooBar: number;
    };
  };
};
type ConvertedDeepObjectDataType = {
  foo_bar?: string;
  bar_baz?: string;
  baz: string;
  first_level: {
    fooBar?: string;
    barBaz?: string;
    secondLevel: {
      fooBar: string;
      barBaz?: string;
    };
  };
  optional_first_level?: {
    fooBar?: string;
    barBaz?: null;
    optionalSecondLevel?: {
      fooBar: number;
    };
  };
};
type ConvertedDeepObjectDataTypeDeeply = {
  foo_bar?: string;
  bar_baz?: string;
  baz: string;
  first_level: {
    foo_bar?: string;
    bar_baz?: string;
    second_level: {
      foo_bar: string;
      bar_baz?: string;
    };
  };
  optional_first_level?: {
    foo_bar?: string;
    bar_baz?: null;
    optional_second_level?: {
      foo_bar: number;
    };
  };
};

const deepInputData: DeepObjectType = {
  fooBar: "fooBar",
  baz: "baz",
  firstLevel: {
    barBaz: "barBaz",
    secondLevel: {
      fooBar: "fooBar",
    },
  },
};
expectType<ConvertedDeepObjectDataType>(
  snakecaseKeys(deepInputData, { deep: false })
);
expectNotType<InvalidConvertedDeepObjectDataType>(
  snakecaseKeys(deepInputData, { deep: false })
);

expectType<ConvertedDeepObjectDataTypeDeeply>(
  snakecaseKeys(deepInputData, { deep: true })
);

// Exclude
type InvalidConvertedExcludeObjectDataType = {
  foo_bar?: string;
  bar_baz?: string;
  baz: string;
};
type ConvertedExcludeObjectDataType = {
  foo_bar?: string;
  barBaz?: string;
  baz: string;
};
const excludeInputData: ObjectDataType = {
  fooBar: "fooBar",
  barBaz: "barBaz",
  baz: "baz",
};
expectType<ConvertedExcludeObjectDataType>(
  snakecaseKeys(excludeInputData, {
    exclude,
  })
);
expectNotType<InvalidConvertedExcludeObjectDataType>(
  snakecaseKeys(excludeInputData, {
    exclude,
  })
);
