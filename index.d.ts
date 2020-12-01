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
  ReturnValue extends Array<{ [key: string]: any }>,
  Input extends Array<{ [key: string]: any }> = Array<{ [key: string]: any }>
>(input: Input, options?: snakecaseKeys.Options): ReturnValue;

declare function snakecaseKeys<
  ReturnValue extends { [key: string]: any },
  Input extends { [key: string]: any } = { [key: string]: any }
>(input: Input, options?: snakecaseKeys.Options): ReturnValue;

export = snakecaseKeys;
