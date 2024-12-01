import { defineConfig, type TwindConfig } from '@twind/core'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'
import presetTypography from '@twind/preset-typography'
import { generateShadingColors } from '../coloring/shading'
import type { ShadedColors } from '../coloring/types'

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

export type ScreenTypes = 'desktop' | 'tablet' | 'mobile'
const screenSizes: Record<ScreenTypes, { min?: string, max?: string, raw?: string }> = {
  mobile: { max: '768px' },
  tablet: { min: '768px', max: '1024px' },
  desktop: { min: '1024px' },
}

// TODO consider renaming
export const genderColorNames = ['hw-male', 'hw-female', 'hw-diverse'] as const
export type GenderColors = typeof genderColorNames[number]

export const appColorNames = [
  'hw-primary',
  'hw-secondary',
  'hw-tertiary',
  'hw-positive',
  'hw-negative',
  'hw-neutral',
  'hw-warn',
  'hw-grayscale',
  'hw-label-1',
  'hw-label-2',
  'hw-label-3',
  'hw-label-blue',
  'hw-label-pink',
  'hw-label-yellow',
  ...genderColorNames
] as const
export type AppColor = typeof appColorNames[number]

export const colors: Record<AppColor, ShadedColors> = {
  'hw-primary': generateShadingColors({
    100: '#F5E2FD',
    200: '#EFD5FB',
    300: '#CDAFEF',
    400: '#AA96DF',
    500: '#B275CE',
    600: '#8E75CE',
    700: '#694BB4',
    800: '#8070A9',
    900: '#5D4D80',
  }),
  'hw-secondary': generateShadingColors({
    200: '#93a4bf',
    300: '#7290c2',
    400: '#3272DF',
    500: '#2758ab',
    800: '#11243E',
  }),
  'hw-tertiary': generateShadingColors({ 400: '#50687C' }),
  'hw-positive': generateShadingColors({
    200: '#CEFDDB',
    300: '#BCF5CB',
    400: '#7DED99',
    500: '#69D384',
    600: '#52BC6D',
    700: '#479E66',
    800: '#4D8466',
  }),
  'hw-negative': generateShadingColors({
    200: '#FCD4D9',
    300: '#F8B0BF',
    400: '#E890A0',
    500: '#D77585',
    600: '#A97070',
    700: '#A54F5C',
    800: '#804D4D',
  }),
  'hw-warn': generateShadingColors({
    100: '#FCF1DE',
    200: '#FEEACB',
    300: '#FAB060',
    400: '#EA9E40',
    500: '#D77E30',
    600: '#C48435',
    700: '#AD6915',
    800: '#996628',
  }),
  'hw-grayscale': generateShadingColors({}),
  'hw-neutral': generateShadingColors({}),
  'hw-label-1': generateShadingColors({ 100: '#FEE0DD', 400: '#D67268' }),
  'hw-label-2': generateShadingColors({ 100: '#FEEACB', 400: '#C79345' }),
  'hw-label-3': generateShadingColors({ 100: '#E2E9DB', 400: '#7A977E' }),
  'hw-label-blue': generateShadingColors({ 400: '#758ECE' }),
  'hw-label-pink': generateShadingColors({ 400: '#CE75A0' }),
  'hw-label-yellow': generateShadingColors({ 400: '#EA8E00' }),
  'hw-male': generateShadingColors({ 400: '#2761EB' }),
  'hw-female': generateShadingColors({ 400: '#EC666D' }),
  'hw-diverse': generateShadingColors({ 400: '#BABABA' }),
} as const

export const config = defineConfig({
  theme: {
    extend: {
      colors: {
        ...colors,
        'hw-disabled': '#BBBBBB',
        'hw-disabled-text': '#555555',
        'hw-pool': {
          // TODO: there should be more of these and potentially more shades for each one of them
          red: '#AD5461',
          green: '#7DED99',
          orange: '#FF9933'
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        space: ['var(--font-space)', ...fontFamily.sans]
      },
      screens: screenSizes,
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
        'around': '0 2px 2px 0 rgba(0, 0, 0, 0.02), 0 -2px 2px 0 rgba(0, 0, 0, 0.02), 2px 0 2px 0 rgba(0, 0, 0, 0.02), -2px 0 2px 0 rgba(0, 0, 0, 0.02)',
        'around-md': '0 5px 5px 0 rgba(0, 0, 0, 0.02), 0 -5px 5px 0 rgba(0, 0, 0, 0.02), 5px 0 5px 0 rgba(0, 0, 0, 0.02), -5px 0 5px 0 rgba(0, 0, 0, 0.02)',
        'around-lg': '0 10px 10px 0 rgba(0, 0, 0, 0.02), 0 -10px 10px 0 rgba(0, 0, 0, 0.02), 10px 0 10px 0 rgba(0, 0, 0, 0.02), -10px 0 10px 0 rgba(0, 0, 0, 0.02)',
        'around-xl': '0 20px 20px 0 rgba(0, 0, 0, 0.02), 0 -20px 20px 0 rgba(0, 0, 0, 0.02), 20px 0 20px 0 rgba(0, 0, 0, 0.02), -20px 0 20px 0 rgba(0, 0, 0, 0.02)',
      }
    }
  },
  presets: [presetAutoprefix(), presetTailwind(), presetTailwindForms(), presetTypography()]
}) as unknown as TwindConfig // TODO: twind is being very dumb right here, not my fault

export default config
