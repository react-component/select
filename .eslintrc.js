const base = require('@umijs/fabric/dist/eslint');
const path = require('path');

module.exports = {
  ...base,
  rules: {
    ...base.rules,
    'default-case': 0,
    'react/sort-comp': 0,
    'jsx-a11y/interactive-supports-focus': 0,
    'jsx-a11y/no-autofocus': 0,
    'react/no-unknown-property': 0,
  },
};
