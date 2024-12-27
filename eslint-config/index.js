import reactRecommendedEslint from 'eslint-plugin-react/configs/recommended.js'
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylisticEslint from '@stylistic/eslint-plugin'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import customRules from './custom-rules/index.js'

/** @type {import('eslint').Linter.Config} */
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  reactRecommendedEslint,
  customRules.configs.recommended,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: '2020'
      },
    },
    plugins: {
      '@stylistic': stylisticEslint,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      'custom-rules/no-empty-then': 'error',
      'no-undef': 'off', // handled by typescript itself
      'sort-imports': 'warn',
      'no-unneeded-ternary': 'off', // ternary operators are often more clear than '||', '&&' or '??'
      'no-use-before-define': 'off',
      'jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/quotes': ['error', 'single', {avoidEscape: true, allowTemplateLiterals: true}],
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      'no-trailing-spaces': ['error'],
      '@stylistic/comma-dangle': ['error', {
        functions: 'never',
        imports: 'never',
        exports: 'only-multiline',
        arrays: 'only-multiline',
        objects: 'only-multiline',
      }],
      '@stylistic/quote-props': ['warn', 'consistent-as-needed'],
      '@stylistic/member-delimiter-style': [
        'warn',
        {
          multiline: {
            delimiter: 'comma',
            requireLast: true
          },
          singleline: {
            delimiter: 'comma',
            requireLast: false
          },
          multilineDetection: 'brackets'
        }
      ],
      '@typescript-eslint/consistent-type-imports': ['error', {prefer: 'type-imports'}],
      '@typescript-eslint/no-use-before-define': ['error'],
      '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
      'react/jsx-curly-brace-presence': ['error', {props: 'never', children: 'ignore', propElementValues: 'always'}],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-wrap-multilines': ['error', {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line'
      }],
      //'custom-rules/no-empty-then': 'error',
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }]
