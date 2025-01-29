import * as esbuild from "esbuild";

// Build ESM version
await esbuild.build({
  entryPoints: ["src/index.js"],
  outfile: "dist/index.mjs",
  format: "esm",
  platform: "node",
  bundle: true,
  minify: false,
  external: ["map-obj", "snake-case"],
});

// Build CJS version
await esbuild.build({
  entryPoints: ["src/index.js"],
  outfile: "dist/index.cjs",
  format: "cjs",
  platform: "node",
  bundle: true,
  minify: false,
  external: ["map-obj", "snake-case"],
});
