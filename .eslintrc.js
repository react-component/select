const base = require('@umijs/fabric/dist/eslint');

module.exports = {
  ...base,
  rules: {
    ...base.rules,
    'default-case': 0,
    'jsx-a11y/interactive-supports-focus': 0,
  },
};
