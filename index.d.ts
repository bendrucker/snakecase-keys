declare namespace snakecaseKeys {
  interface Options {
    /**
		Recurse nested objects and objects in arrays.
		@default false
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
declare function snakecaseKeys(
  input: ReadonlyArray<{ [key: string]: unknown }>,
  options?: snakecaseKeys.Options,
): Array<{ [key: string]: unknown }>;
declare function snakecaseKeys(
  input: { [key: string]: unknown },
  options?: snakecaseKeys.Options,
): { [key: string]: unknown };

export = snakecaseKeys;
