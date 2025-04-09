// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs'
import * as path from 'node:path'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {},
  typescript: {
    reactDocgen: 'react-docgen-typescript'
  },
  core: {
    disableTelemetry: true,
  },
  webpackFinal: async (config) => {
    console.log('Webpack config:', config)

    config.module?.rules?.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
      include: [
        path.resolve(__dirname, '../stories'),
        path.resolve(__dirname, '../node_modules/@helpwave/style-themes'),
      ],
    })

    return config
  },
}

export default config
