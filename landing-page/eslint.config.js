import config from '@helpwave/eslint-config'
import nextConfig from '@next/eslint-plugin-next'

export default [
  {
    ignores: ['build/**']
  },
  ...config,
  {
    plugins: {
      '@next/eslint': nextConfig.configs.recommended,
    }
  }
]
