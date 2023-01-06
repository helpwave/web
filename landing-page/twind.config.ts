import { defineConfig } from '@twind/core'
import type { TwindConfig } from '@twind/core'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTypography from '@twind/preset-typography'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'

// defaults otherwise provided by tailwind
export const fontFamily = {
  sans: [
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    '"Noto Sans"',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"'
  ],
  serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
  mono: [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    '"Liberation Mono"',
    '"Courier New"',
    'monospace'
  ]
}

export const config = defineConfig({
  theme: {
    extend: {
      colors: {
        // TODO: custom helpwave (hw) colors go here
        'hw-primary': {
          300: '#8E75CE',
          400: '#B275CE',
          500: '#8070A9',
          600: '#694BB4',
          700: '#5D4D80',
          800: '#4F3879'
        },
        'hw-temp-red': '#AD5461',
        'hw-temp-green': '#7DED99',
        'hw-temp-orange': '#FF9933',
        'hw-find-a-good-name-for-this-background': '#281C20',
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        space: ['var(--font-space)', ...fontFamily.sans]
      }
    }
  },
  presets: [presetAutoprefix(), presetTailwind(), presetTailwindForms(), presetTypography()]
}) as unknown as TwindConfig // TODO: twind is being very dumb right here, not my fault

export default config
