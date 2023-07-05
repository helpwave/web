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

const primary = {
  100: '#F5E2FD',
  200: '#EFD5FB',
  300: '#CDAFEF',
  400: '#AA96DF',
  500: '#B275CE',
  600: '#8E75CE',
  700: '#694BB4',
  800: '#8070A9',
  900: '#5D4D80',
  1000: '#4F3879',
} as const

const secondary = {} as const

const positive = {
  200: '#CEFDDB',
  300: '#BCF5CB',
  400: '#7DED99',
  500: '#69D384',
  600: '#52BC6D',
  700: '#479E66',
  800: '#4D8466',
} as const

const negative = {
  200: '#FCD4D9',
  300: '#F8B0BF',
  400: '#E890A0',
  500: '#D77585',
  600: '#A97070',
  700: '#A54F5C',
  800: '#804D4D',
} as const

export const config = defineConfig({
  theme: {
    extend: {
      colors: {
        'hw-primary': primary,
        'hw-secondary': secondary,
        'hw-positive': positive,
        'hw-negative': negative,
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
        'hw-label-blue': {
          background: '#758ECE42',
          text: '#758ECE'
        },
        'hw-label-pink': {
          background: '#CE75A042',
          text: '#CE75A0'
        },
        'hw-label-yellow': {
          background: '#FEEACB',
          text: '#EA8E00'
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        space: ['var(--font-space)', ...fontFamily.sans]
      },
      screens: {
        desktop: { min: '1350px' },
        mobile: { max: '1350px' },
      },
      animation: {
        fade: 'fadeOut 3s ease-in-out'
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: '100%' },
          '100%': { opacity: '0%' },
        },
      },
    }
  },
  presets: [presetAutoprefix(), presetTailwind(), presetTailwindForms(), presetTypography()]
}) as unknown as TwindConfig // TODO: twind is being very dumb right here, not my fault

export default config
