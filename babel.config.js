module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: '8'
        },
        loose: true
      }
    ]
  ],
  plugins: [
    [
      'babel-plugin-module-name-mapper',
      {
        moduleNameMapper: {
          '^src/(.*)': '<rootDir>/src/$1'
        }
      }
    ],
    '@babel/plugin-proposal-class-properties'
  ]
};
