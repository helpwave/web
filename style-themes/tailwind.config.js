/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
          screens: {
            'mobile': { max: '767px' },
            'tablet': { min: '768px', max: '1023px' },
            'desktop': { min: '1024px' },
            'not-mobile': { min: '768px' }
          },
        },
    },
    plugins: [],
}
