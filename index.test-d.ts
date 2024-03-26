import { expectAssignable, expectType, expectNotType } from "tsd";
import type { SnakeCaseKeys } from ".";
import snakecaseKeys from ".";

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
expectType<{}>(snakecaseKeys({}));
expectType<{ foo_bar: boolean }>(snakecaseKeys({ fooBar: true }));
expectAssignable<{ [key: string]: boolean }>(snakecaseKeys({ fooBar: true }));

expectType<{ foo_bar: boolean }>(snakecaseKeys({ FooBar: true }));

// Array
expectType<{ foo_bar: boolean }[]>(snakecaseKeys([{ fooBar: true }]));
expectAssignable<Array<{ [key: string]: boolean }>>(
  snakecaseKeys([{ fooBar: true }])
);

// Deep
expectType< { foo_bar: { "foo-bar": { "foo bar": true; }; }; nested: { pointObject: Point; }; }>(
  snakecaseKeys(
    { foo_bar: { "foo-bar": { "foo bar": true } }, nested: { pointObject: point } },
    { deep: false }
  )
);
expectType<{ foo_bar: { foo_bar: { foo_bar: boolean; }; }; nested: { point_object: Point; }; }>(
  snakecaseKeys({ foo_bar: { "foo-bar": { "foo bar": true } }, nested: { pointObject: point }  }, { deep: true })
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
expectType<{ point_object: Point }[]>(
  snakecaseKeys([{ pointObject: point }], { deep: true })
);
expectType<{ person_object: Person }[]>(
  snakecaseKeys([{ personObject: person }], { deep: true })
);
expectType<{ date: Date, person_object: Person }[]>(
  snakecaseKeys([{ date: new Date(), personObject: person }], { deep: true })
);
expectType<{ foo_bar: { foo_baz: { foo_bar: Point; }[]; }[]; }>(
  snakecaseKeys({ fooBar: [{ fooBaz: [{ fooBar: point }] }] }, { deep: true })
);

// Deep with defalt(no deep option)
expectType<{ foo_bar: { foo_bar: { foo_bar: boolean } } }>(
  snakecaseKeys({ foo_bar: { "foo-bar": { "foo bar": true } } })
);
expectType<{ foo_bar: { foo_bar: boolean } }[]>(
  snakecaseKeys([{ "foo-bar": { foo_bar: true } }])
);
expectType<{ date: Date }[]>(
  snakecaseKeys([{ date: new Date() }])
);
expectType<{ foo_bar: { foo_baz: { foo_bar: Point; }[]; }[]; }>(
  snakecaseKeys({ fooBar: [{ fooBaz: [{ fooBar: point }] }] })
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

// Deep with defalt(no deep option)
expectType<SnakeCaseKeys<typeof deepInput>>(
  snakecaseKeys({ foo_bar: { "foo-bar": { "foo bar": true } } })
);
expectType<SnakeCaseKeys<typeof deepArrayInput>>(
  snakecaseKeys([{ "foo-bar": { foo_bar: true } }])
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

// Deep with defalt(no deep option)
expectType<ConvertedDeepObjectDataTypeDeeply>(
  snakecaseKeys(deepInputData)
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

// Test for union type
// eslint-disable-next-line @typescript-eslint/ban-types
const objectCamelcased: SnakeCaseKeys<{fooBar: {fooProp: string} | null}, true>
	= snakecaseKeys({fooBar: {fooProp: 'foo_props'}}, {deep: true});
// eslint-disable-next-line @typescript-eslint/ban-types
const nullCamelcased: SnakeCaseKeys<{fooBar: {fooProp: string} | null}, true>
	= snakecaseKeys({fooBar: null}, {deep: true});

// eslint-disable-next-line @typescript-eslint/ban-types
expectType<{foo_bar: {foo_prop: string} | null}>(objectCamelcased);
// eslint-disable-next-line @typescript-eslint/ban-types
expectType<{foo_bar: {foo_prop: string} | null}>(nullCamelcased);
