import noEmptyThen from './no-empty-then.js'

const plugin = {
  meta: {
    name: 'custom-rules',
    version: '0.1.0',
  },
  configs: {
    recommended: {
      plugins: {
        'custom-rules': {
          rules: {
            'no-empty-then': noEmptyThen
          },
        },
      },
      rules: {
        'custom-rules/no-empty-then': 'warn',
      }
    }
  },
}

export default plugin
