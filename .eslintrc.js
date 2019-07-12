module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    // 'airbnb',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint'
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module'
  },
  env: {
    es6: true,
    node: true
  }
};
