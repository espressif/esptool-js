import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import resolve from '@rollup/plugin-node-resolve';
import babel from "@rollup/plugin-babel";
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

const stubDir = join(dirname(fileURLToPath(import.meta.url)), "node_modules/esp-flasher-stub/stubs");

// @rollup/plugin-node-resolve 15 only expands export patterns that end in "*".
// esp-flasher-stub publishes "./*.json" -> "./stubs/*.json", so map those specifiers directly.
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

// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'lib/index.js',
  output: {
    name: "esptooljs",
    file: 'bundle.js',
    format: 'es',
    inlineDynamicImports: true
  },
  plugins: [
    resolveEspFlasherStub(),
    resolve({ preferBuiltins: false, mainFields: ["browser"]}),
    commonjs(),
    babel({ exclude: 'node_modules/**', babelHelpers: "runtime", skipPreflightCheck: true }),
    json({ namedExports: true, preferConst: true }),
    terser()
  ],
};

const _default = config;
export { _default as default };
