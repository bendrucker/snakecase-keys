import map from 'map-obj';
import { snakeCase, type Options as SnakeCaseOptions } from 'change-case';
import type { SnakeCase } from 'type-fest';

type EmptyTuple = [];

// Allow union with, for example, `undefined` and `null`.
type ObjectUnion = Record<string, unknown> | unknown;

/**
 * Return a default type if input type is nil.
 * @template T - Input type.
 * @template U - Default type.
*/
type WithDefault<T, U> = T extends undefined | void | null ? U : T;

/**
 * Check if an element is included in a tuple.
 * @template List - List of values.
 * @template Target - Target to search.
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
 * Append a segment to dot-notation path.
 * @template S - Base path.
 * @template Last - Additional path.
*/
type AppendPath<S extends string, Last extends string> = S extends ''
  ? Last
  : `${S}.${Last}`;

/**
 * Convert keys of an object to snake-case strings.
 * @template T - Input object or array.
 * @template Deep - Deep conversion flag.
 * @template Exclude - Excluded keys.
 * @template Path - Path of keys.
*/
export type SnakeCaseKeys<
  T extends ObjectUnion | ReadonlyArray<Record<string, unknown>>,
  Deep extends boolean = true,
  Exclude extends readonly unknown[] = EmptyTuple,
  Path extends string = ''
> = T extends ReadonlyArray<Record<string, unknown>>
  ? {
      [P in keyof T]: T[P] extends Record<string, unknown> | ReadonlyArray<Record<string, unknown>>
        ? SnakeCaseKeys<T[P], Deep, Exclude>
        : T[P];
    }
  : T extends Record<string, unknown>
  ? {
      [P in keyof T as [Includes<Exclude, P>] extends [true] ? P : SnakeCase<P>]: [Deep] extends [true]
        ? T[P] extends ObjectUnion | ReadonlyArray<Record<string, unknown>>
          ? SnakeCaseKeys<T[P], Deep, Exclude, AppendPath<Path, P & string>>
          : T[P]
        : T[P];
    }
  : T;

export interface Options {
  /**
   * Recurse nested objects and objects in arrays.
   * @default true
  */
  readonly deep?: boolean;
  /**
   * Exclude keys from being snakeCased.
   * @default []
  */
  readonly exclude?: ReadonlyArray<string | RegExp>;
  /**
   * A function that determines whether to recurse for a specific key and value.
  */
  readonly shouldRecurse?: (key: any, value: any) => boolean;
  /**
   * Options object that gets passed to snake-case parsing function.
   * @default {}
  */
  readonly parsingOptions?: SnakeCaseOptions;
}

/**
 * Convert object keys to snake using [`snake-case`](https://github.com/blakeembrey/change-case/tree/main/packages/change-case).
 * @param input - Object or array of objects to snake-case.
 * @param options - Options of conversion.
 */
function snakecaseKeys<
  T extends Record<string, unknown> | ReadonlyArray<Record<string, unknown>>,
  Opts extends Options = Options
>(
  obj: T,
  options?: Opts
): SnakeCaseKeys<
  T,
  Opts extends { deep: boolean } ? Opts['deep'] : true,
  WithDefault<Opts extends { exclude: any } ? Opts['exclude'] : undefined, EmptyTuple>
> {
  const PlainObjectConstructor = {}.constructor;
  if (Array.isArray(obj)) {
    if (obj.some(item => item.constructor !== PlainObjectConstructor)) {
      throw new Error('obj must be array of plain objects');
    }
  } else {
    if (obj.constructor !== PlainObjectConstructor) {
      throw new Error('obj must be an plain object');
    }
  }

  const opts = Object.assign({ deep: true, exclude: [], parsingOptions: {} }, options);

  return map(
    obj,
    (key, val) => [
      typeof key === 'string'
        ? matches(opts.exclude, key)
          ? key
          : snakeCase(key, opts.parsingOptions)
        : String(key),
      val,
      mapperOptions(key, val, opts)
    ],
    opts
  ) as SnakeCaseKeys<
    T,
    Opts extends { deep: boolean } ? Opts['deep'] : true,
    WithDefault<Opts extends { exclude: any } ? Opts['exclude'] : undefined, EmptyTuple>
  >;
}

function matches(patterns: ReadonlyArray<string | RegExp>, value: string): boolean {
  return patterns.some(pattern =>
    typeof pattern === 'string' ? pattern === value : pattern.test(value)
  );
}

function mapperOptions(
  key: string | number | symbol,
  val: unknown,
  options: Options
): { shouldRecurse: boolean } | undefined {
  return options.shouldRecurse && typeof key === 'string'
    ? { shouldRecurse: options.shouldRecurse(key, val) }
    : undefined;
}

export default snakecaseKeys; 