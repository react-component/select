module.exports = {
  snapshotSerializers: [require.resolve('enzyme-to-json/serializer')],
  testEnvironment: 'jest-environment-jsdom-fourteen' // https://stackoverflow.com/a/62439088/2971795
};
