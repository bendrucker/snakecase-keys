import { SnakeCase } from "type-fest";

// eslint-disable-next-line @typescript-eslint/ban-types
type EmptyTuple = [];

/**
Return a default type if input type is nil.
@template T - Input type.
@template U - Default type.
*/
type WithDefault<T, U extends T> = T extends undefined | void | null ? U : T;

/**
Check if an element is included in a tuple.
@template List - List of values.
@template Target - Target to search.
*/
type IsInclude<List extends readonly unknown[], Target> = List extends undefined
  ? false
  : List extends Readonly<EmptyTuple>
  ? false
  : List extends readonly [infer First, ...infer Rest]
  ? First extends Target
    ? true
    : IsInclude<Rest, Target>
  : boolean;

/**
Append a segment to dot-notation path.
@template S - Base path.
@template Last - Additional path.
*/
type AppendPath<S extends string, Last extends string> = S extends ""
  ? Last
  : `${S}.${Last}`;

/**
Convert keys of an object to snake-case strings.
@template T - Input object or array.
@template Deep - Deep conversion flag.
@template Exclude - Excluded keys.
@template Path - Path of keys.
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
      [P in keyof T & string as [IsInclude<Exclude, P>] extends [true]
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
@param options - Options of conversion.
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
