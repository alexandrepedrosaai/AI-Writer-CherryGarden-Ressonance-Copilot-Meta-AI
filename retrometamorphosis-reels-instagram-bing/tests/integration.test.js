const integration = require('../src/integration');

test('integration runs without error', () => {
  expect(() => integration.run()).not.toThrow();
});
