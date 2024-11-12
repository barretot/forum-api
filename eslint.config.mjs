import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import nPlugin from 'eslint-plugin-n';

export default [
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/*.e2e-spec.ts'],
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'import': importPlugin,
      'prettier': prettierPlugin,
      'n': nPlugin,
    },
    rules: {
      // Regras do ESLint, TypeScript e Import
      ...typescriptEslint.configs.recommended.rules,

      // Regras do Prettier diretamente no ESLint
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          tabWidth: 2,
          singleQuote: true,
          trailingComma: 'all',
          arrowParens: 'always',
          semi: false,
        },
      ],

      // Regras de importação
      'import/order': ['error', {
        'groups': [
          ['builtin', 'external'],
          ['internal'],
          ['parent', 'sibling', 'index']
        ],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
      'import/newline-after-import': ['error', { 'count': 1 }],
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      'semi': ['error', 'never'],
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
  },
];
