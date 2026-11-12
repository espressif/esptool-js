import { existsSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

const rootDir = dirname(fileURLToPath(import.meta.url));
const stubDir = join(rootDir, "node_modules/esp-flasher-stub/stubs");

/**
 * Package name for a bare specifier, or null when this resolver should skip it.
 * Subpaths are left unresolved; the stub plugin handles esp-flasher-stub JSON.
 * @param {string} source Import specifier.
 * @returns {string | null} Package name.
 */
function packageName(source) {
  if (source.startsWith(".") || source.startsWith("\0") || isAbsolute(source)) return null;
  if (source.startsWith("@")) {
    const parts = source.split("/");
    if (parts.length !== 2) return null;
    return source;
  }
  if (source.includes("/")) return null;
  return source;
}

/**
 * Resolve bare node_modules imports for the browser bundle.
 * A string `browser` field wins, matching the previous mainFields: ["browser"] setting.
 * Otherwise the ESM export, `module`, or `main` entry is used.
 * @returns {import('rollup').Plugin} Rollup plugin.
 */
function resolveNodeModule() {
  return {
    name: "resolve-node-module",
    resolveId(source) {
      const name = packageName(source);
      if (!name) return null;
      const pkgDir = join(rootDir, "node_modules", name);
      const pkgPath = join(pkgDir, "package.json");
      if (!existsSync(pkgPath)) return null;
      const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
      const exportImport = pkg.exports?.["."]?.import;
      const target =
        (typeof pkg.browser === "string" ? pkg.browser : null) ||
        (typeof exportImport === "string" ? exportImport : null) ||
        pkg.module ||
        pkg.main;
      if (typeof target !== "string") return null;
      return join(pkgDir, target);
    },
  };
}

// esp-flasher-stub publishes "./*.json" -> "./stubs/*.json". Map those specifiers directly.
function resolveEspFlasherStub() {
  return {
    name: "resolve-esp-flasher-stub",
    resolveId(source) {
      const match = /^esp-flasher-stub\/([^/]+\.json)$/.exec(source);
      if (!match) return null;
      return join(stubDir, match[1]);
    },
  };
}

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "lib/index.js",
  output: {
    name: "esptooljs",
    file: "bundle.js",
    format: "es",
    inlineDynamicImports: true,
  },
  plugins: [
    resolveEspFlasherStub(),
    resolveNodeModule(),
    commonjs(),
    babel({ exclude: "node_modules/**", babelHelpers: "runtime", skipPreflightCheck: true }),
    json({ namedExports: true, preferConst: true }),
    terser(),
  ],
};

const _default = config;
export { _default as default };
