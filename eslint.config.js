const js = require("@eslint/js");
const jsdoc = require("eslint-plugin-jsdoc");
const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  {
    ignores: [
      "lib/**",
      "bundle.js",
      "docs/**",
      "wasm/**",
      "examples/**",
      "native/**",
      "node_modules/**",
      ".parcel-cache/**",
      "eslint.config.js",
    ],
  },
  js.configs.recommended,
  ...tsPlugin.configs["flat/recommended"],
  {
    files: ["**/*.ts"],
    plugins: {
      prettier,
      jsdoc,
    },
    rules: {
      ...jsdoc.configs.recommended.rules,
      ...prettierConfig.rules,
      "no-console": 1,
      "prettier/prettier": 2,
      "jsdoc/require-param-type": 0,
      "jsdoc/require-param-description": 0,
      "jsdoc/require-returns": 0,
      "jsdoc/require-jsdoc": 0,
    },
  },
];
