import { SnakeCase } from "type-fest";
import { Options as SnakeCaseOptions } from "change-case";

// eslint-disable-next-line @typescript-eslint/ban-types
type EmptyTuple = [];

// Allow union with, for example, `undefined` and `null`.
type ObjectUnion = Record<string, unknown> | unknown;

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
type Includes<List extends readonly unknown[], Target> = List extends undefined
  ? false
  : List extends Readonly<EmptyTuple>
  ? false
  : List extends readonly [infer First, ...infer Rest]
  ? First extends Target
    ? true
    : Includes<Rest, Target>
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
export type SnakeCaseKeys<
  T extends ObjectUnion | ReadonlyArray<Record<string, unknown>>,
  Deep extends boolean = true,
  Exclude extends readonly unknown[] = EmptyTuple,
  Path extends string = ""
> = T extends ReadonlyArray<Record<string, unknown>>
  ? // Handle arrays or tuples.
    {
      [P in keyof T]: T[P] extends Record<string, unknown> | ReadonlyArray<Record<string, unknown>>
      ? SnakeCaseKeys<T[P], Deep, Exclude>
      : T[P];
    }
  : T extends Record<string, unknown>
    ? // Handle objects.
      {
        [P in keyof T as [Includes<Exclude, P>] extends [true]
          ? P
          : SnakeCase<P>]: [Deep] extends [true]
          ? T[P] extends ObjectUnion | ReadonlyArray<Record<string, unknown>>
            ? SnakeCaseKeys<T[P], Deep, Exclude, AppendPath<Path, P & string>>
            : T[P]
          : T[P];
      }
    : // Return anything else as-is.
      T;

  /**
  Convert keys using a custom function - returns generic object type.
  */
  export type CustomSnakeCaseKeys<
    T extends ObjectUnion | ReadonlyArray<Record<string, unknown>>,
    Deep extends boolean = true
  > = T extends ReadonlyArray<unknown>
    ? Array<Record<string, unknown>>
    : Record<string, unknown>;

export interface Options {
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

  /**
  A function that determines whether to recurse for a specific key and value.
  */
 readonly shouldRecurse?: {
  (key: any, value: any): boolean;
 }

  /**
  Options object that gets passed to snake-case parsing function.
  @default {}
  */
  readonly parsingOptions?: SnakeCaseOptions;

  /**
  Custom function to convert keys to snake case.
  When provided, TypeScript will return a generic Record<string, unknown> type
  since the transformation cannot be determined at compile time.
  @default Built-in snake case conversion
  */
  readonly snakeCase?: (key: string) => string;
}

/**
Convert object keys to snake using [`to-snake-case`](https://github.com/ianstormtaylor/to-snake-case).
@param input - Object or array of objects to snake-case.
@param options - Options of conversion.
*/
declare function snakecaseKeys<
  T extends Record<string, unknown> | ReadonlyArray<Record<string, unknown>>,
  TOptions extends Options
>(
  input: T,
  options: TOptions & { snakeCase: (key: string) => string }
): CustomSnakeCaseKeys<
  T,
  TOptions["deep"] extends boolean ? TOptions["deep"] : true
>;

declare function snakecaseKeys<
  T extends Record<string, unknown> | ReadonlyArray<Record<string, unknown>>,
  TOptions extends Options
>(
  input: T,
  options?: TOptions
): SnakeCaseKeys<
  T,
  TOptions["deep"] extends boolean ? TOptions["deep"] : true,
  WithDefault<TOptions["exclude"], EmptyTuple>
>;

export default snakecaseKeys;