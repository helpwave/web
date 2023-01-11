module.exports = {
  extends: [
    'standard',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: '2020'
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'space-before-function-paren': 'off',
    // the behaviour of ternary operators is often more clear than using '||', '&&' or '??'
    'no-unneeded-ternary': 'off',
    // This rule has a small problem: when using jsx it is pretty common to wrap the (true / false) expressions in parentheses and have the "?" or ":" on the same line.
    // This isn't allowed with this rule as it would require an additional newline for "?" and ":".
    // As the rule doesn't really enforce anything useful (a lot of bad styles are still allowed, but some good ones as well; no real way to filter further) disabling it doesn't hurt.
    'multiline-ternary': 'off',
    'no-use-before-define': 'off',
    'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    // this rule is utter trash
    'n/no-callback-literal': 'off',
    // This highly depends on the situation even when the same operators are used.
    // For ternaries it should always be 'before' but override doesn't work with 'off'
    // therefore turning it off altogether
    'operator-linebreak': ['off'],
    // basically allow dangling commas in situations where they might be useful
    // for quickly lists of *things* (e.g. exports, arrays, objects) but disallow
    // for unnecessary things (functions and imports)
    'comma-dangle': ['error', {
      functions: 'never',
      imports: 'never',
      exports: 'only-multiline',
      arrays: 'only-multiline',
      objects: 'only-multiline',
    }],
    // if a single key requires quotes better quote all keys
    // it would be great if this was also optional additionally, meaning that
    // if one key requires quotes all other keys *can* optionally be quoted as well
    // but never otherwise
    'quote-props': ['warn', 'consistent-as-needed'],
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/no-use-before-define': ['error'],
    // use commas in typescript types as they are closely related to object literals
    '@typescript-eslint/member-delimiter-style': [
      'warn',
      {
        multiline: {
          delimiter: 'comma',
          requireLast: false
        },
        singleline: {
          delimiter: 'comma',
          requireLast: false
        }
      }
    ],
    'jsx-quotes': ['error', 'prefer-double'],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'ignore', propElementValues: 'always' }],
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
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
