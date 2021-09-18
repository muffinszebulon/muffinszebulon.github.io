module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    "bootstrap": false,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'object-shorthand': 0,
    'prefer-destructuring': 0,
    'no-restricted-globals': 0,
    'no-restricted-syntax': 0,
  },
};
