const resolve = require('@rollup/plugin-node-resolve');
const babel =  require("@rollup/plugin-babel");
const commonjs = require('@rollup/plugin-commonjs');
const terser = require('@rollup/plugin-terser');

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
    resolve(),
    commonjs(),
    babel({ exclude: 'node_modules/**', babelHelpers: "runtime", skipPreflightCheck: true }),
    terser()
  ],
};

module.exports.default = config;
