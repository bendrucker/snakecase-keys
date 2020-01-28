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
declare function snakecaseKeys<T>(
  input: ReadonlyArray<T>,
  options?: snakecaseKeys.Options,
): Array<{ [key: string]: unknown }>;
declare function snakecaseKeys<T>(
  input: T,
  options?: snakecaseKeys.Options,
): { [key: string]: unknown };

export = snakecaseKeys;
