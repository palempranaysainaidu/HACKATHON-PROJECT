/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#dccfff',
          300: '#c3a9ff',
          400: '#a778ff',
          500: '#8b47ff',
          600: '#7c22ff',
          700: '#6c13ef',
          800: '#5a10c9',
          900: '#4b0ea4',
          950: '#2d0070',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
