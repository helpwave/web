import { defineConfig, type TwindConfig } from '@twind/core'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'
import presetTypography from '@twind/preset-typography'

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

export const colors = {
  primary: {
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
  },
  secondary: {
    200: '#93a4bf',
    300: '#7290c2',
    400: '#3272DF',
    500: '#2758ab',
    800: '#11243E',
  },
  positive: {
    200: '#CEFDDB',
    300: '#BCF5CB',
    400: '#7DED99',
    500: '#69D384',
    600: '#52BC6D',
    700: '#479E66',
    800: '#4D8466',
  },
  negative: {
    200: '#FCD4D9',
    300: '#F8B0BF',
    400: '#E890A0',
    500: '#D77585',
    600: '#A97070',
    700: '#A54F5C',
    800: '#804D4D',
  },
  warn: {
    100: '#FCF1DE',
    200: '#FEEACB',
    300: '#FAB060',
    400: '#EA9E40',
    500: '#D77E30',
    600: '#C48435',
    700: '#AD6915',
    800: '#996628',
  }
} as const

export const config = defineConfig({
  theme: {
    extend: {
      colors: {
        'hw-primary': colors.primary,
        'hw-secondary': colors.secondary,
        'hw-positive': colors.positive,
        'hw-negative': colors.negative,
        'hw-warn': colors.warn,
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
        mobile: { max: '768px' },
        tablet: { min: '768px', max: '1024px' },
        desktop: { min: '1024px' },
      },
      animation: {
        'fade': 'fadeOut 3s ease-in-out',
        'wave-big-left-up': 'bigLeftUp 1.7s ease-in 0s infinite normal',
        'wave-big-right-down': 'bigRightDown 1.7s ease-in 0s infinite reverse',
        'wave-small-left-up': 'smallLeftUp 1.7s ease-in 0s infinite normal',
        'wave-small-right-down': 'smallRightDown 1.7s ease-in 0s infinite reverse',
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: '100%' },
          '100%': { opacity: '0%' },
        },
        bigLeftUp: {
          '0%': { strokeDashoffset: '1000' },
          '25%': { strokeDashoffset: '1000' },
          '50%': { strokeDashoffset: '0' },
          '75%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '0' },
        },
        bigRightDown: {
          '0%': { strokeDashoffset: '0' },
          '25%': { strokeDashoffset: '0' },
          '50%': { strokeDashoffset: '0' },
          '75%': { strokeDashoffset: '-1000' },
          '100%': { strokeDashoffset: '-1000' },
        },
        smallLeftUp: {
          '0%': { strokeDashoffset: '1000' },
          '25%': { strokeDashoffset: '1000' },
          '50%': { strokeDashoffset: '1000' },
          '75%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '0' },
        },
        smallRightDown: {
          '0%': { strokeDashoffset: '0' },
          '25%': { strokeDashoffset: '0' },
          '50%': { strokeDashoffset: '-1000' },
          '75%': { strokeDashoffset: '-1000' },
          '100%': { strokeDashoffset: '-1000' },
        },
      },
      boxShadow: {
        'around': '0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 -2px 2px 0 rgba(0, 0, 0, 0.1), 2px 0 2px 0 rgba(0, 0, 0, 0.1), -2px 0 2px 0 rgba(0, 0, 0, 0.1)',
        'around-md': '0 4px 4px 0 rgba(0, 0, 0, 0.1), 0 -4px 4px 0 rgba(0, 0, 0, 0.1), 2px 0 2px 0 rgba(0, 0, 0, 0.1), -4px 0 4px 0 rgba(0, 0, 0, 0.1)',
        'around-lg': '0 10px 10px 0 rgba(0, 0, 0, 0.1), 0 -10px 10px 0 rgba(0, 0, 0, 0.1), 10px 0 10px 0 rgba(0, 0, 0, 0.1), -10px 0 10px 0 rgba(0, 0, 0, 0.1)',
        'around-xl': '0 20px 20px 0 rgba(0, 0, 0, 0.1), 0 -20px 20px 0 rgba(0, 0, 0, 0.1), 20px 0 20px 0 rgba(0, 0, 0, 0.1), -20px 0 20px 0 rgba(0, 0, 0, 0.1)',
      }
    }
  },
  presets: [presetAutoprefix(), presetTailwind(), presetTailwindForms(), presetTypography()]
}) as unknown as TwindConfig // TODO: twind is being very dumb right here, not my fault

export default config
