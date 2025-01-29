// src/index.js
import map from "map-obj";
import { snakeCase } from "snake-case";
var PlainObjectConstructor = {}.constructor;
function matches(patterns, value) {
  return patterns.some(
    (pattern) => typeof pattern === "string" ? pattern === value : pattern.test(value)
  );
}
function mapperOptions(key, val, options) {
  return options.shouldRecurse ? { shouldRecurse: options.shouldRecurse(key, val) } : void 0;
}
function snakecaseKeys(obj, options) {
  if (Array.isArray(obj)) {
    if (obj.some((item) => item.constructor !== PlainObjectConstructor)) {
      throw new Error("obj must be array of plain objects");
    }
  } else {
    if (obj.constructor !== PlainObjectConstructor) {
      throw new Error("obj must be an plain object");
    }
  }
  const opts = Object.assign(
    { deep: true, exclude: [], parsingOptions: {} },
    options
  );
  return map(
    obj,
    (key, val) => [
      matches(opts.exclude, key) ? key : snakeCase(key, opts.parsingOptions),
      val,
      mapperOptions(key, val, opts)
    ],
    opts
  );
}
export {
  snakecaseKeys as default
};
