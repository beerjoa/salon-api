// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import named from 'eslint-plugin-import/lib/rules/named.js';

export default tsEslint.config(
  {
    ignores: ['eslint.config.mjs', 'commitlint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  importPlugin.flatConfigs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        project: [
          'tsconfig.json',
          'tsconfig.build.json',
        ],
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json', './tsconfig.build.json', 'commitlint.config.mjs'],
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          moduleDirectory: ['node_modules', 'src/'],
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'no-restricted-imports': ['error', { patterns: ['.*'] }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'object', 'unknown'],
          pathGroups: [
            { pattern: 'node:*', group: 'builtin', position: 'before' },
            { pattern: '@nestjs/**', group: 'external', position: 'before' },
            { pattern: '#/**', group: 'parent', position: 'before' },
            { pattern: '##*/**', group: 'sibling', position: 'after' },
            { pattern: '#*/**', group: 'sibling', position: 'before' },
          ],
          'newlines-between': 'always',
          named: true,
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
);