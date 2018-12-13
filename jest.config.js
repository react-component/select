module.exports = {
  verbose: true,
  setupFiles: ['./tests/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', 'dekko', 'node'],
  modulePathIgnorePatterns: ['/examples/'],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.test.json',
    },
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transformIgnorePatterns: ['/examples/', '/build/', 'node_modules/[^/]+?/(?!(es|node_modules)/)'],
};
