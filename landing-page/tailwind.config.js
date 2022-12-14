// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')

const defaultSansFonts = defaultTheme.fontFamily.sans

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#281C20',
        secondary: '#5D4D80',
        team: '#DDDDDD'
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultSansFonts],
        space: ['var(--font-space)', ...defaultSansFonts]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
