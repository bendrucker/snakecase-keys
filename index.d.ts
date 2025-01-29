export type Options = {
    deep?: boolean;
    exclude?: ReadonlyArray<string | RegExp>;
    shouldRecurse?: (key: string, value: unknown) => boolean;
};
declare function snakecaseKeys<T extends Record<string, unknown> | Array<Record<string, unknown>>>(obj: T, options?: Options): T;
export default snakecaseKeys;
