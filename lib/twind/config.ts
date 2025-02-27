import { defineConfig, type TwindConfig } from '@twind/core'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'
import presetTypography from '@twind/preset-typography'
import { fontFamily } from './typography'
import { textStyles } from './textstyles'
import { StylingVariables } from './style-variables'

export type ScreenTypes = 'desktop' | 'tablet' | 'mobile'
const screenSizes: Record<ScreenTypes, { min?: string, max?: string, raw?: string }> = {
  mobile: { max: '767px' },
  tablet: { min: '768px', max: '1023px' },
  desktop: { min: '1024px' },
}

const colors: { [key: string]: string } = StylingVariables.colors.reduce((previousValue, currentValue) => ({ ...previousValue, [currentValue.name]: currentValue.value }), {})

export const config = defineConfig({
  theme: {
    // remove all tailwind preset colors
    colors: {
      ...colors
    },
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
      screens: {
        ...screenSizes,
        'not-mobile': { min: screenSizes.tablet.min },
      },
      animation: {
        'fade': 'fade-out 3s ease-in-out',
        'wave-big-left-up': 'bigLeftUp 1.7s ease-in 0s infinite normal',
        'wave-big-right-down': 'bigRightDown 1.7s ease-in 0s infinite reverse',
        'wave-small-left-up': 'smallLeftUp 1.7s ease-in 0s infinite normal',
        'wave-small-right-down': 'smallRightDown 1.7s ease-in 0s infinite reverse',
        'tooltip-fade-in': 'fade-in 0.2s ease-in-out forwards',
        'tooltip-fade-out': 'fade-in 0.2s ease-in-out forwards',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '100%' },
          '100%': { opacity: '0%' },
        },
        'bigLeftUp': {
          '0%': { strokeDashoffset: '1000' },
          '25%': { strokeDashoffset: '1000' },
          '50%': { strokeDashoffset: '0' },
          '75%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '0' },
        },
        'bigRightDown': {
          '0%': { strokeDashoffset: '0' },
          '25%': { strokeDashoffset: '0' },
          '50%': { strokeDashoffset: '0' },
          '75%': { strokeDashoffset: '-1000' },
          '100%': { strokeDashoffset: '-1000' },
        },
        'smallLeftUp': {
          '0%': { strokeDashoffset: '1000' },
          '25%': { strokeDashoffset: '1000' },
          '50%': { strokeDashoffset: '1000' },
          '75%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '0' },
        },
        'smallRightDown': {
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
      },
    },
  },
  presets: [presetAutoprefix(), presetTailwind(), presetTailwindForms(), presetTypography()],
  rules: [
    ...textStyles,
    ['animation-delay-', ({ $$ }) => ({ animationDelay: `${$$}ms` })],
    ['section-padding', 'mobile:(px-6 py-3) tablet:(px-8 py-4) desktop:(px-12 py-6)']
  ]
}) as unknown as TwindConfig // TODO: twind is being very dumb right here, not my fault

export default config
