module.exports = {
  verbose: true,
  setupFiles: ['./tests/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', 'dekko', 'node'],
  transform: {
    '\\.ts$': 'ts-jest',
    '\\.jsx?$': './node_modules/rc-tools/scripts/jestPreprocessor.js',
  },
  modulePathIgnorePatterns: ['/examples/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.test.json',
    },
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transformIgnorePatterns: ['/examples/', '/build/', 'node_modules/[^/]+?/(?!(es|node_modules)/)'],
};
