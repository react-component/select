import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const legacyConfig = require('./.eslintrc.js');

function supportRule(ruleName) {
  if (ruleName.startsWith('@babel/')) {
    return false;
  }
  if (ruleName.startsWith('@typescript-eslint/')) {
    return Boolean(tsEslintPlugin.rules[ruleName.replace('@typescript-eslint/', '')]);
  }
  return true;
}

function dropUnsupportedRules(config) {
  if (!config.rules) {
    return config;
  }

  return {
    ...config,
    rules: Object.fromEntries(
      Object.entries(config.rules).filter(([ruleName]) => supportRule(ruleName)),
    ),
  };
}

export default [
  {
    ignores: [
      'node_modules/',
      'coverage/',
      'es/',
      'lib/',
      'dist/',
      'docs-dist/',
      '.dumi/',
      '.doc/',
      '.vercel/',
      '.eslintrc.js',
      'src/index.d.ts',
    ],
  },
  ...compat.config(legacyConfig).map(dropUnsupportedRules),
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
