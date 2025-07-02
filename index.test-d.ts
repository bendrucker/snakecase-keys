import { assertType, expectTypeOf } from "vitest"
import type { SnakeCaseKeys } from "."
import snakecaseKeys from "."

class Point {
	x: number;
	y: number;

	addPoint(point: Point): Point {
		return new Point(this.x + point.x, this.y + point.y);
	}

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}
const point = new Point(0, 10);

interface Person {
	firstName: string;
	lastName: string;
	age: number;
}

const person: Person = {
	firstName: 'firstName',
	lastName: 'lastName',
	age: 30
};

// Object
expectTypeOf(snakecaseKeys({})).toEqualTypeOf<{}>();
expectTypeOf(snakecaseKeys({ fooBar: true })).toEqualTypeOf<{ foo_bar: boolean }>();
expectTypeOf(snakecaseKeys({ fooBar: true })).toMatchTypeOf<{ [key: string]: boolean }>();

expectTypeOf(snakecaseKeys({ FooBar: true })).toEqualTypeOf<{ foo_bar: boolean }>();

// Array
expectTypeOf(snakecaseKeys([{ fooBar: true }])).toEqualTypeOf<{ foo_bar: boolean }[]>();
expectTypeOf(snakecaseKeys([{ fooBar: true }])).toMatchTypeOf<Array<{ [key: string]: boolean }>>();

// Deep
assertType<{ foo_bar: { "foo-bar": { "foo bar": true; }; }; nested: { pointObject: Point; }; }>(
  snakecaseKeys(
    { foo_bar: { "foo-bar": { "foo bar": true } }, nested: { pointObject: point } },
    { deep: false }
  )
);
expectTypeOf(
  snakecaseKeys({ foo_bar: { "foo-bar": { "foo bar": true } }, nested: { pointObject: point }  }, { deep: true })
).toMatchTypeOf<{ foo_bar: { foo_bar: { foo_bar: boolean; }; }; nested: { point_object: Point; }; }>();
expectTypeOf(
  snakecaseKeys([{ "foo-bar": { foo_bar: true } }], { deep: true })
).toEqualTypeOf<{ foo_bar: { foo_bar: boolean } }[]>();
expectTypeOf(
  snakecaseKeys([{ date: new Date() }], { deep: true })
).toEqualTypeOf<{ date: Date }[]>();
expectTypeOf(
  snakecaseKeys([{ regexp: /example/ }], { deep: true })
).toEqualTypeOf<{ regexp: RegExp }[]>();
expectTypeOf(
  snakecaseKeys([{ error: new Error() }], { deep: true })
).toEqualTypeOf<{ error: Error }[]>();
expectTypeOf(
  snakecaseKeys([{ pointObject: point }], { deep: true })
).toEqualTypeOf<{ point_object: Point }[]>();
expectTypeOf(
  snakecaseKeys([{ personObject: person }], { deep: true })
).toEqualTypeOf<{ person_object: Person }[]>();
expectTypeOf(
  snakecaseKeys([{ date: new Date(), personObject: person }], { deep: true })
).toEqualTypeOf<{ date: Date, person_object: Person }[]>();
expectTypeOf(
  snakecaseKeys({ fooBar: [{ fooBaz: [{ fooBar: point }] }] }, { deep: true })
).toEqualTypeOf<{ foo_bar: { foo_baz: { foo_bar: Point; }[]; }[]; }>();

// Deep with default (no deep option)
expectTypeOf(
  snakecaseKeys({ foo_bar: { "foo-bar": { "foo bar": true } } })
).toEqualTypeOf<{ foo_bar: { foo_bar: { foo_bar: boolean } } }>();
expectTypeOf(
  snakecaseKeys([{ "foo-bar": { foo_bar: true } }])
).toEqualTypeOf<{ foo_bar: { foo_bar: boolean } }[]>();
expectTypeOf(
  snakecaseKeys([{ date: new Date() }])
).toEqualTypeOf<{ date: Date }[]>();
expectTypeOf(
  snakecaseKeys({ fooBar: [{ fooBaz: [{ fooBar: point }] }] })
).toEqualTypeOf<{ foo_bar: { foo_baz: { foo_bar: Point; }[]; }[]; }>();

// Exclude
assertType<{ foo_bar: boolean; barBaz: true }>(
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
expectTypeOf(snakecaseKeys(objectInput)).toEqualTypeOf<SnakeCaseKeys<typeof objectInput>>();
expectTypeOf(snakecaseKeys(objectInput)).toMatchTypeOf<SnakeCaseKeys<{ [key: string]: boolean }>>();

// Array
const arrayInput = [{ fooBar: true }];
expectTypeOf(snakecaseKeys([{ fooBar: true }])).toEqualTypeOf<SnakeCaseKeys<typeof arrayInput>>();
expectTypeOf(snakecaseKeys(arrayInput)).toMatchTypeOf<SnakeCaseKeys<typeof arrayInput>>();

// Deep
const deepInput = { foo_bar: { "foo-bar": { "foo bar": true } } };
expectTypeOf(
  snakecaseKeys(deepInput, { deep: false })
).toEqualTypeOf<SnakeCaseKeys<typeof deepInput, false, []>>();
expectTypeOf(
  snakecaseKeys({ foo_bar: { "foo-bar": { "foo bar": true } } }, { deep: true })
).toEqualTypeOf<SnakeCaseKeys<typeof deepInput>>();
const deepArrayInput = [{ "foo-bar": { foo_bar: true } }];
expectTypeOf(
  snakecaseKeys([{ "foo-bar": { foo_bar: true } }], { deep: true })
).toEqualTypeOf<SnakeCaseKeys<typeof deepArrayInput>>();

// Deep with default (no deep option)
expectTypeOf(
  snakecaseKeys({ foo_bar: { "foo-bar": { "foo bar": true } } })
).toEqualTypeOf<SnakeCaseKeys<typeof deepInput>>();
expectTypeOf(
  snakecaseKeys([{ "foo-bar": { foo_bar: true } }])
).toEqualTypeOf<SnakeCaseKeys<typeof deepArrayInput>>();

// Exclude
const excludeInput = { fooBar: true, barBaz: true };
const exclude = ["foo", "barBaz", /^baz/] as const;
expectTypeOf(
  snakecaseKeys(excludeInput, {
    exclude,
  })
).toEqualTypeOf<SnakeCaseKeys<typeof excludeInput, true, typeof exclude>>();

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
expectTypeOf(snakecaseKeys(objectInputData)).toEqualTypeOf<ConvertedObjectDataType>();
// Negative assertion
// @ts-expect-error
expectTypeOf(snakecaseKeys(objectInputData)).toEqualTypeOf<InvalidConvertedObjectDataType>();

// Array
type ArrayDataType = ObjectDataType[];

const arrayInputData: ArrayDataType = [
  {
    fooBar: "fooBar",
    baz: "baz",
  },
];
expectTypeOf(snakecaseKeys(arrayInputData)).toEqualTypeOf<ConvertedObjectDataType[]>();
// Negative assertion
// @ts-expect-error
expectTypeOf(snakecaseKeys(arrayInputData)).toEqualTypeOf<InvalidConvertedObjectDataType[]>();

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
expectTypeOf(
  snakecaseKeys(deepInputData, { deep: false })
).toEqualTypeOf<ConvertedDeepObjectDataType>();
// Negative assertion
// @ts-expect-error
expectTypeOf(snakecaseKeys(deepInputData, { deep: false })).toEqualTypeOf<InvalidConvertedDeepObjectDataType>();

expectTypeOf(
  snakecaseKeys(deepInputData, { deep: true })
).toEqualTypeOf<ConvertedDeepObjectDataTypeDeeply>();

// Deep with default (no deep option)
expectTypeOf(
  snakecaseKeys(deepInputData)
).toEqualTypeOf<ConvertedDeepObjectDataTypeDeeply>();

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
expectTypeOf(
  snakecaseKeys(excludeInputData, {
    exclude,
  })
).toEqualTypeOf<ConvertedExcludeObjectDataType>();
// Negative assertion
// @ts-expect-error
expectTypeOf(snakecaseKeys(excludeInputData, { exclude })).toEqualTypeOf<InvalidConvertedExcludeObjectDataType>();

// Test for union type
// eslint-disable-next-line @typescript-eslint/ban-types
const objectCamelcased: SnakeCaseKeys<{fooBar: {fooProp: string} | null}, true>
	= snakecaseKeys({fooBar: {fooProp: 'foo_props'}}, {deep: true});
// eslint-disable-next-line @typescript-eslint/ban-types
const nullCamelcased: SnakeCaseKeys<{fooBar: {fooProp: string} | null}, true>
	= snakecaseKeys({fooBar: null}, {deep: true});

// eslint-disable-next-line @typescript-eslint/ban-types
expectTypeOf(objectCamelcased).toEqualTypeOf<{foo_bar: {foo_prop: string} | null}>();
// eslint-disable-next-line @typescript-eslint/ban-types
expectTypeOf(nullCamelcased).toEqualTypeOf<{foo_bar: {foo_prop: string} | null}>();
