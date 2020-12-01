import { expectError, expectType } from "tsd";
import snakecaseKeys = require(".");

// Without generic parameter
const fooBarObject = { fooBar: true };
const camelFooBarObject = snakecaseKeys(fooBarObject);
expectType<{ [key: string]: any }>(camelFooBarObject);

const fooBarArray = [{ fooBar: true }];
const camelFooBarArray = snakecaseKeys(fooBarArray);
expectType<Array<{ [key: string]: any }>>(camelFooBarArray);

expectType<string[]>(snakecaseKeys(["name 1", "name 2"]));

// Using generic parameters
interface ISnakecase {
  foo_bar: boolean;
}
interface ICamelcase {
  fooBar: boolean;
}

type Snakecase = {
  foo_bar: boolean;
};
type Camelcase = {
  fooBar: boolean;
};

expectType<ISnakecase>(
  snakecaseKeys<ISnakecase>({ fooBar: true })
);
expectType<ISnakecase[]>(
  snakecaseKeys<ISnakecase[]>([{ fooBar: true }])
);
expectError<ICamelcase>(
  snakecaseKeys<ISnakecase>({ fooBar: true })
);

expectType<Snakecase>(
  snakecaseKeys<Snakecase, Camelcase>({ fooBar: true })
);
expectError<Snakecase>(
  snakecaseKeys<Snakecase, Snakecase>({ fooBar: true })
);
