var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  default: () => snakecaseKeys
});
module.exports = __toCommonJS(src_exports);
var import_map_obj = __toESM(require("map-obj"), 1);
var import_snake_case = require("snake-case");
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
  return (0, import_map_obj.default)(
    obj,
    (key, val) => [
      matches(opts.exclude, key) ? key : (0, import_snake_case.snakeCase)(key, opts.parsingOptions),
      val,
      mapperOptions(key, val, opts)
    ],
    opts
  );
}
