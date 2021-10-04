import { Includes, SnakeCase } from "type-fest";

// eslint-disable-next-line @typescript-eslint/ban-types
type EmptyTuple = [];

/**
Return a default type if input type is nil.
@template T - Input type.
@template U - Default type.
*/
type WithDefault<T, U extends T> = T extends undefined | void | null ? U : T;

/**
Append a segment to dot-notation path.
*/
type AppendPath<S extends string, Last extends string> = S extends ""
  ? Last
  : `${S}.${Last}`;

/**
Convert keys of an object to camelcase strings.
*/
type SnakeCaseKeys<
  T extends Record<string, any> | readonly any[],
  Deep extends boolean,
  Exclude extends readonly unknown[],
  Path extends string = ""
> = T extends readonly any[]
  ? // Handle arrays or tuples.
    {
      [P in keyof T]: SnakeCaseKeys<T[P], Deep, Exclude>;
    }
  : T extends Record<string, any>
  ? // Handle objects.
    {
      [P in keyof T & string as [Includes<Exclude, P>] extends [true]
        ? P
        : SnakeCase<P>]: [Deep] extends [true]
        ? T[P] extends Record<string, any>
          ? SnakeCaseKeys<T[P], Deep, Exclude, AppendPath<Path, P>>
          : T[P]
        : T[P];
    }
  : // Return anything else as-is.
    T;

declare namespace snakecaseKeys {
  interface Options {
    /**
		Recurse nested objects and objects in arrays.
		@default true
		*/
    readonly deep?: boolean;

    /**
		Exclude keys from being snakeCased.
		@default []
		*/
    readonly exclude?: ReadonlyArray<string | RegExp>;
  }
}

/**
Convert object keys to snake using [`to-snake-case`](https://github.com/ianstormtaylor/to-snake-case).
@param input - Object or array of objects to snake-case.
*/
declare function snakecaseKeys<
  T extends Record<string, any> | readonly any[],
  Options extends snakecaseKeys.Options
>(
  input: T,
  options?: Options
): SnakeCaseKeys<
  T,
  WithDefault<Options["deep"], true>,
  WithDefault<Options["exclude"], EmptyTuple>
>;

export default snakecaseKeys;
