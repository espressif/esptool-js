import resolve from '@rollup/plugin-node-resolve';
import babel from "@rollup/plugin-babel";
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

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
    resolve({ preferBuiltins: false}),
    commonjs(),
    babel({ exclude: 'node_modules/**', babelHelpers: "runtime", skipPreflightCheck: true }),
    json({ namedExports: false, preferConst: true }),
    terser()
  ],
};

const _default = config;
export { _default as default };
