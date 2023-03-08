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
        'hw-positive': {
          300: '#7DED99',
          // TODO: 400 is still missing, see figma
          500: '#52BC6D'
        },
        'hw-negative': {
          300: '#D77585',
          400: '#A97070',
          500: '#A54F5C',
          600: '#804D4D'
        },
        'hw-neutral': {
          // TODO: 300 is still missing, see figma
          400: '#FF9933'
          // TODO: 500 is still missing, see figma
        },
        'hw-info': {
          // TODO: everything still missing, see figma
        },
        'hw-dark-gray': {
          600: '#281C20',
          700: '#25282B',
          800: '#1B1B1B'
        },
        // these are a bunch of colors which look good together, the idea behind these is that they can be used in places where a lot of colors without any meaning are used
        // as an example of this think of google calendar event colors, they don't have any inherent meaning, other than what you assign to each
        'hw-pool': {
          // TODO: there should be more of these and potentially more shades for each one of them
          red: '#AD5461',
          green: '#7DED99',
          orange: '#FF9933'
        },
        'hw-label-1': {
          background: '#FEE0DD',
          accent: '#D67268',
          text: '#591917'
        },
        'hw-label-2': {
          background: '#FEEACB',
          accent: '#C79345',
          text: '#412A1D'
        },
        'hw-label-3': {
          background: '#E2E9DB',
          accent: '#7A977E',
          text: '#273429'
        },
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
