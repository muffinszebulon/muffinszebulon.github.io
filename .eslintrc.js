module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    "bootstrap": false,
    "getElementById": false,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'prettier/prettier': 0,
    'object-shorthand': 0,
    'prefer-destructuring': 0,
    'no-restricted-globals': 0,
    'no-restricted-syntax': 0,
  },
};
