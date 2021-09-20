'use strict';

module.exports = {
  parserOptions: {
    ecmaVersion: 12,
  },
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    bootstrap: false,
    getElementById: false,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {},
  overrides: [
    // node files
    {
      files: ['.eslintrc.js', '.prettierrc.js'],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
    },
  ],
};
